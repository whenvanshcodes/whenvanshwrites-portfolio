export const dynamic = 'force-dynamic';
import { json, isOwner, sameOrigin, supabaseAdmin, clean } from '../../../lib/portfolio-api';

export async function GET(request: Request) {
  const manage = new URL(request.url).searchParams.get('manage') === '1';
  if (manage && !(await isOwner(request))) return json({ error: 'Owner access required.' }, 403);

  const supabase = supabaseAdmin();
  let query = supabase
    .from('writings')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(200);

  if (!manage) {
    query = query.eq('published', 1);
  }

  const { data, error } = await query;
  if (error) {
    console.error('Writings get error:', error);
    return json({ writings: [] });
  }

  return json({ writings: data || [] });
}

async function mutate(request: Request, method: string) {
  if (!(await isOwner(request)) || !sameOrigin(request))
    return json({ error: 'Owner access required.' }, 403);

  if (Number(request.headers.get('content-length') || 0) > 140000)
    return json({ error: 'This writing is too long.' }, 413);

  let b: Record<string, unknown>;
  try {
    b = (await request.json()) as Record<string, unknown>;
    if (!b || typeof b !== 'object' || Array.isArray(b)) throw new Error();
  } catch {
    return json({ error: 'Invalid request.' }, 400);
  }

  const id = clean(b.id, 80);
  const supabase = supabaseAdmin();

  if (method === 'DELETE') {
    if (!id) return json({ error: 'Choose a writing.' }, 400);
    await supabase.from('writings').delete().eq('id', id);
    return json({ ok: true });
  }

  const title = clean(b.title, 150);
  const category = clean(b.category, 30);
  const excerpt = clean(b.excerpt, 400);
  const body = clean(b.body, 30000);
  const published = b.published === true || b.published === 1 ? 1 : 0;

  if (!title || !body || !['Poem', 'Story', 'Essay', 'Field note'].includes(category))
    return json({ error: 'Add a title, category, and your writing.' }, 400);

  const now = Date.now();

  if (method === 'PATCH') {
    if (!id) return json({ error: 'Choose a writing.' }, 400);
    const { data: exists } = await supabase.from('writings').select('id').eq('id', id).limit(1);
    if (!exists || exists.length === 0) return json({ error: 'Writing not found.' }, 404);

    await supabase
      .from('writings')
      .update({
        title,
        category,
        excerpt,
        body,
        published,
        updated_at: now,
      })
      .eq('id', id);

    return json({ ok: true, id });
  }

  const newId = crypto.randomUUID();
  const { error } = await supabase.from('writings').insert({
    id: newId,
    title,
    category,
    excerpt,
    body,
    published,
    created_at: now,
    updated_at: now,
  });

  if (error) {
    console.error('Writings insert error:', error);
    return json({ error: 'Could not save writing.' }, 500);
  }

  return json({ ok: true, id: newId }, 201);
}

export const POST = (r: Request) => mutate(r, 'POST');
export const PATCH = (r: Request) => mutate(r, 'PATCH');
export const DELETE = (r: Request) => mutate(r, 'DELETE');
