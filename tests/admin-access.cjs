const fs = require('node:fs'),
  path = require('node:path'),
  vm = require('node:vm'),
  assert = require('node:assert/strict'),
  React = require('react'),
  { renderToStaticMarkup } = require('react-dom/server'),
  ts = require('typescript');

let requestHeaders = new Headers();
let mockUser = null;
const root = process.cwd();

function load(file) {
  file = path.resolve(root, file);
  if (!path.extname(file)) file += fs.existsSync(file + '.tsx') ? '.tsx' : '.ts';
  if (file.endsWith('.json')) return JSON.parse(fs.readFileSync(file, 'utf8'));
  const m = { exports: {} };
  vm.runInNewContext(
    ts.transpileModule(fs.readFileSync(file, 'utf8'), {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
        jsx: ts.JsxEmit.ReactJSX,
        esModuleInterop: true,
      },
    }).outputText,
    {
      module: m,
      exports: m.exports,
      require: n => {
        if (n === 'next/headers')
          return {
            headers: async () => requestHeaders,
            cookies: async () => ({
              getAll: () => [],
              set: () => {},
            }),
          };
        if (n === 'next/navigation')
          return {
            redirect: () => {
              throw Error('Unexpected redirect');
            },
          };
        if (n === '@supabase/ssr')
          return {
            createServerClient: () => ({
              auth: {
                getUser: async () => ({ data: { user: mockUser }, error: null }),
                signOut: async () => ({ error: null }),
              },
            }),
            createBrowserClient: () => ({
              auth: {
                signInWithPassword: async () => ({ error: null }),
                signInWithOtp: async () => ({ error: null }),
              },
            }),
          };
        if (n === '@supabase/supabase-js')
          return {
            createClient: () => ({
              from: () => ({
                select: () => ({ order: () => ({ limit: async () => ({ data: [], error: null }) }) }),
              }),
            }),
          };
        return n.startsWith('.') ? load(path.resolve(path.dirname(file), n)) : require(n);
      },
      Request,
      Response,
      Headers,
      URL,
      process: {
        env: {
          NODE_ENV: 'production',
          SUPABASE_OWNER_USER_ID: 'verified-owner-uuid',
          SUPABASE_OWNER_EMAIL: 'owner@example.test',
          NEXT_PUBLIC_SUPABASE_URL: 'https://test.supabase.co',
          NEXT_PUBLIC_SUPABASE_ANON_KEY: 'test-anon-key',
          SUPABASE_SERVICE_ROLE_KEY: 'test-service-key',
        },
      },
      console,
      setTimeout,
      clearTimeout,
      AbortSignal,
      queueMicrotask,
    }
  );
  return m.exports;
}

(async () => {
  const Page = load('app/adminvansh/page.tsx').default;

  // 1. Anonymous user test
  mockUser = null;
  requestHeaders = new Headers({ host: 'whenvanshwrites.is-a.dev' });
  let html = renderToStaticMarkup(await Page());
  assert(html.includes('Sign in to Owner Studio'), 'Must show Supabase sign-in to anonymous users');
  assert(!html.includes('admin-panel'), 'Anonymous users must never access admin panel');

  // 2. Non-owner authenticated user test
  mockUser = { id: 'some-other-uuid', email: 'intruder@example.test' };
  requestHeaders = new Headers({ host: 'whenvanshwrites.is-a.dev' });
  html = renderToStaticMarkup(await Page());
  assert(
    html.includes('not authorized as the verified owner'),
    'Non-owner accounts must be rejected'
  );
  assert(!html.includes('admin-panel'), 'Non-owner must never see admin panel');

  // 3. Verified owner user test
  mockUser = { id: 'verified-owner-uuid', email: 'owner@example.test' };
  requestHeaders = new Headers({ host: 'whenvanshwrites.is-a.dev' });
  html = renderToStaticMarkup(await Page());
  assert(html.includes('Portfolio control room.'), 'Owner must see control room header');
  assert(html.includes('admin-panel'), 'Owner must see admin panel');

  console.log(
    'PASS Supabase Auth admin verification: anonymous blocked, non-owner rejected, verified owner authorized'
  );
})().catch(e => {
  console.error(e);
  process.exit(1);
});
