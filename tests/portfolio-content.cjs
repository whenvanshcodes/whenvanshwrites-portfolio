const fs = require('fs'),
  path = require('path'),
  vm = require('vm'),
  assert = require('assert'),
  { DatabaseSync } = require('node:sqlite');

const root = path.resolve(__dirname, '..');
const ts = require(path.join(root, 'node_modules/typescript'));
const sql = new DatabaseSync(':memory:');

// Create SQLite tables matching the Supabase schema for test execution
sql.exec(`
  CREATE TABLE contacts (
    id text PRIMARY KEY NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    topic text NOT NULL,
    message text NOT NULL,
    created_at integer NOT NULL,
    is_read integer DEFAULT 0 NOT NULL
  );
  CREATE TABLE portfolio_content (
    key text PRIMARY KEY NOT NULL,
    payload text NOT NULL,
    updated_at integer NOT NULL
  );
  CREATE TABLE project_media (
    id text PRIMARY KEY NOT NULL,
    project_id text NOT NULL,
    object_key text NOT NULL,
    mime text NOT NULL,
    caption text NOT NULL,
    created_at integer NOT NULL
  );
`);

const objects = new Map();
let authUser = null;

const mockSupabase = {
  from(table) {
    return {
      select(cols) {
        return {
          order() {
            return {
              limit() {
                return this;
              },
              async then(resolve) {
                const rows = sql.prepare(`SELECT * FROM ${table}`).all();
                resolve({ data: rows, error: null });
              },
            };
          },
          like(col, pattern) {
            const pat = pattern.replace(/%/g, '%');
            const rows = sql.prepare(`SELECT * FROM ${table} WHERE ${col} LIKE ?`).all(pat);
            return Promise.resolve({ data: rows, error: null });
          },
          eq(col, val) {
            return {
              single: async () => {
                const row = sql.prepare(`SELECT * FROM ${table} WHERE ${col} = ?`).get(val);
                return { data: row || null, error: row ? null : { message: 'Not found' } };
              },
              async then(resolve) {
                const rows = sql.prepare(`SELECT * FROM ${table} WHERE ${col} = ?`).all(val);
                resolve({ data: rows, error: null });
              },
            };
          },
          async then(resolve) {
            const rows = sql.prepare(`SELECT * FROM ${table}`).all();
            resolve({ data: rows, error: null });
          },
        };
      },
      upsert(row) {
        if (table === 'portfolio_content') {
          sql.prepare(
            `INSERT INTO portfolio_content (key, payload, updated_at) VALUES (?, ?, ?)
             ON CONFLICT(key) DO UPDATE SET payload=excluded.payload, updated_at=excluded.updated_at`
          ).run(row.key, row.payload, row.updated_at);
        }
        return Promise.resolve({ error: null });
      },
      insert(row) {
        if (table === 'project_media') {
          sql.prepare(
            `INSERT INTO project_media (id, project_id, object_key, mime, caption, created_at) VALUES (?, ?, ?, ?, ?, ?)`
          ).run(row.id, row.project_id, row.object_key, row.mime, row.caption, row.created_at);
        }
        return Promise.resolve({ error: null });
      },
      delete() {
        return {
          eq(col, val) {
            sql.prepare(`DELETE FROM ${table} WHERE ${col} = ?`).run(val);
            return Promise.resolve({ error: null });
          },
        };
      },
    };
  },
  storage: {
    from(bucketName) {
      return {
        async upload(key, bytes, opts) {
          objects.set(key, { bytes, mime: opts?.contentType });
          return { error: null };
        },
        async download(key) {
          const item = objects.get(key);
          if (!item) return { data: null, error: { message: 'Not found' } };
          return { data: item.bytes, error: null };
        },
        async remove(keys) {
          for (const k of keys) objects.delete(k);
          return { error: null };
        },
      };
    },
  },
};

const cache = new Map();
function load(f) {
  f = path.resolve(root, f);
  if (f.endsWith('.json')) return { default: JSON.parse(fs.readFileSync(f, 'utf8')) };
  if (!path.extname(f)) f += fs.existsSync(f + '.tsx') ? '.tsx' : '.ts';
  if (cache.has(f)) return cache.get(f);
  const m = { exports: {} };
  cache.set(f, m.exports);

  vm.runInNewContext(
    ts.transpileModule(fs.readFileSync(f, 'utf8'), {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
        jsx: ts.JsxEmit.ReactJSX,
      },
    }).outputText,
    {
      module: m,
      exports: m.exports,
      require: n => {
        if (n === 'next/headers') {
          return {
            headers: async () => new Headers(),
            cookies: async () => ({ getAll: () => [], set: () => {} }),
          };
        }
        if (n === '@supabase/ssr') {
          return {
            createServerClient: () => ({
              auth: {
                getUser: async () => ({ data: { user: authUser }, error: null }),
              },
            }),
            createBrowserClient: () => ({}),
          };
        }
        if (n === '@supabase/supabase-js') {
          return {
            createClient: () => mockSupabase,
          };
        }
        if (n.includes('supabase/admin')) {
          return { getSupabaseAdmin: () => mockSupabase };
        }
        return load(path.resolve(path.dirname(f), n));
      },
      Request,
      Response,
      Headers,
      URL,
      crypto,
      Uint8Array,
      TextEncoder,
      File,
      FormData,
      process: {
        env: {
          NODE_ENV: 'production',
          SUPABASE_OWNER_USER_ID: 'owner-id',
          SUPABASE_OWNER_EMAIL: 'owner@test.local',
          NEXT_PUBLIC_SUPABASE_URL: 'https://test.supabase.co',
          NEXT_PUBLIC_SUPABASE_ANON_KEY: 'test-anon',
          SUPABASE_SERVICE_ROLE_KEY: 'test-secret',
        },
      },
    }
  );
  return m.exports;
}

const req = (method, b, auth = false, origin = 'https://lab.test') => {
  authUser = auth ? { id: 'owner-id', email: 'owner@test.local' } : null;
  return new Request('https://lab.test/api/portfolio', {
    method,
    headers: { Origin: origin, 'Content-Type': 'application/json' },
    ...(b ? { body: JSON.stringify(b) } : {}),
  });
};

(async () => {
  const api = load('app/api/portfolio/route.ts');
  const media = load('app/api/project-media/route.ts');
  const image = load('app/api/project-media/[id]/route.ts');
  const resolve = load('lib/portfolio-content.ts');
  const resume = load('app/resume/route.ts');
  const defaults = JSON.parse(fs.readFileSync(path.join(root, 'data/portfolio-defaults.json'), 'utf8'));

  for (const key of ['profile', 'resume', 'services']) {
    const b = { key, value: defaults[key] };
    assert.equal((await api.PUT(req('PUT', b))).status, 403);
    assert.equal((await api.PUT(req('PUT', b, true, 'https://other.test'))).status, 403);
    assert.equal((await api.PUT(req('PUT', b, true))).status, 200);
  }

  assert.equal((await api.PUT(req('PUT', { key: 'profile', value: { ...defaults.profile, name: 'x'.repeat(101) } }, true))).status, 400);
  assert.equal((await api.PUT(req('PUT', { key: 'profile', value: { ...defaults.profile, portrait: '/api/photo/test-photo', bookCover: '' } }, true))).status, 200);
  assert.equal((await resolve.resolvedPortfolio()).profile.portrait, '/api/photo/test-photo');

  for (const url of ['javascript:alert(1)', 'https://example.test/photo.jpg']) {
    assert.equal((await api.PUT(req('PUT', { key: 'profile', value: { ...defaults.profile, portrait: url } }, true))).status, 400);
  }

  const profile = { ...defaults.profile, name: '<script>alert(1)</script>' };
  assert.equal((await api.PUT(req('PUT', { key: 'profile', value: profile }, true))).status, 200);
  const html = await (await resume.GET()).text();
  assert(html.includes('&lt;script&gt;'));
  assert(!html.includes('<script>alert'));

  const seed = JSON.parse(fs.readFileSync(path.join(root, 'data/project-defaults.json'), 'utf8'))[0];
  assert.equal(
    (await api.PUT(req('PUT', { key: 'project:new-build', value: { ...seed, title: 'New build', archived: true, pm: { research: 'Actual research notes' } } }, true))).status,
    200
  );
  assert(!(await resolve.resolvedPortfolio()).projects.some(p => p.id === 'new-build'));

  // Test project media upload
  authUser = null;
  assert.equal((await media.POST(new Request('https://lab.test/api/project-media', { method: 'POST', headers: { Origin: 'https://lab.test' } }))).status, 403);

  const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a8XcAAAAASUVORK5CYII=', 'base64');
  const form = new FormData();
  form.set('projectId', 'signal');
  form.set('caption', 'Actual screenshot');
  form.set('image', new File([png], 'screen.png', { type: 'image/png' }));

  authUser = { id: 'owner-id', email: 'owner@test.local' };
  let r = await media.POST(new Request('https://lab.test/api/project-media', { method: 'POST', headers: { Origin: 'https://lab.test' }, body: form }));
  assert.equal(r.status, 201);
  const id = (await r.json()).id;

  assert.equal((await (await media.GET()).json()).screenshots.filter(s => s.kind === 'screenshot').length, 1);

  r = await image.GET(new Request('https://lab.test/api/project-media/' + id), { params: Promise.resolve({ id }) });
  assert.equal(r.headers.get('Content-Type'), 'image/png');
  assert.equal((await r.arrayBuffer()).byteLength, png.length);

  authUser = null;
  assert.equal((await media.DELETE(new Request('https://lab.test/api/project-media', { method: 'DELETE', headers: { Origin: 'https://lab.test', 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) }))).status, 403);

  authUser = { id: 'owner-id', email: 'owner@test.local' };
  assert.equal((await media.DELETE(new Request('https://lab.test/api/project-media', { method: 'DELETE', headers: { Origin: 'https://lab.test', 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) }))).status, 200);
  assert.equal(objects.size, 0);

  const thinking = { before: 'Original problem', choice: 'Chosen with an accepted trade-off', changedEvidence: 'An anonymized observation', nextMeasure: 'Completion time' };
  assert.equal((await api.PUT(req('PUT', { key: 'thinking:signal', value: thinking }))).status, 403);
  assert.equal((await api.PUT(req('PUT', { key: 'thinking:signal', value: { before: 'x'.repeat(4001) } }, true))).status, 400);
  assert.equal((await api.PUT(req('PUT', { key: 'thinking:signal', value: thinking }, true))).status, 200);

  const note = (await (await api.GET()).json()).content['thinking:signal'];
  assert.equal(note.choice, thinking.choice);
  assert.equal(note.changedEvidence, thinking.changedEvidence);
  assert(Number.isFinite(note.updatedAt));

  console.log('PASS owner-only reasoning notes, length validation, timestamp and persistence');

  const previews = (await (await media.GET()).json()).screenshots.filter(s => s.kind === 'preview');
  assert.equal(previews.length, 12);
  assert(previews.every(s => s.url.startsWith('/project-previews/') && s.note));

  const previewId = previews[0].id;
  authUser = null;
  assert.equal((await media.DELETE(new Request('https://lab.test/api/project-media', { method: 'DELETE', headers: { Origin: 'https://lab.test', 'Content-Type': 'application/json' }, body: JSON.stringify({ id: previewId }) }))).status, 403);
  authUser = { id: 'owner-id', email: 'owner@test.local' };
  assert.equal((await media.DELETE(new Request('https://lab.test/api/project-media', { method: 'DELETE', headers: { Origin: 'https://lab.test', 'Content-Type': 'application/json' }, body: JSON.stringify({ id: previewId }) }))).status, 200);
  assert(!(await (await media.GET()).json()).screenshots.some(s => s.id === previewId));
  assert.equal(objects.size, 0);

  console.log('PASS 12 bundled previews, labelled metadata, owner-only hiding and uploaded screenshot preservation');
  console.log('PASS owner permissions, content validation/persistence, PM archive, safe dynamic resume, screenshot upload/list/serve/delete and image rejection');
})().catch(e => {
  console.error(e);
  process.exit(1);
});
