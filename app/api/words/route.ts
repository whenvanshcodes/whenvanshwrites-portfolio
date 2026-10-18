export const dynamic = 'force-dynamic';
import { json, isOwner, sameOrigin, supabaseAdmin, clean } from '../../../lib/portfolio-api';

export async function GET() {
  const supabase = supabaseAdmin();
  const { data, error } = await supabase
    .from('visitor_words')
    .select('id, word, created_at')
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) {
    console.error('Visitor words get error:', error);
    return json({ words: [] });
  }
  return json({ words: data || [] });
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) return json({ error: 'Please leave your word from the portfolio.' }, 403);
  if (Number(request.headers.get('content-length') || 0) > 1000)
    return json({ error: 'Just one little word, please.' }, 413);

  let b: Record<string, unknown>;
  try {
    b = (await request.json()) as Record<string, unknown>;
    if (!b || typeof b !== 'object' || Array.isArray(b)) throw Error();
  } catch {
    return json({ error: 'Please enter a word.' }, 400);
  }

  if (b.website) return json({ ok: true });
  const word = clean(b.word, 25);
  if (!/^[\p{L}\p{M}][\p{L}\p{M}\p{N}'’-]{0,23}$/u.test(word))
    return json(
      { error: 'Use one word, up to 24 letters. Hindi and other languages are welcome.' },
      400
    );

  const supabase = supabaseAdmin();
  const now = Date.now();

  const { count } = await supabase
    .from('visitor_words')
    .select('*', { count: 'exact', head: true })
    .gt('created_at', now - 60000);

  if (count && count >= 30)
    return json({ error: 'The garden is busy. Try again in a minute.' }, 429);

  const { data: duplicate } = await supabase
    .from('visitor_words')
    .select('id')
    .ilike('word', word)
    .gt('created_at', now - 60000)
    .limit(1);

  if (duplicate && duplicate.length > 0)
    return json({ error: 'That word just landed. Try another little thought.' }, 429);

  const id = crypto.randomUUID();
  const { error } = await supabase.from('visitor_words').insert({ id, word, created_at: now });
  if (error) {
    console.error('Visitor words insert error:', error);
    return json({ error: 'Could not leave word. Please try again.' }, 500);
  }

  return json({ ok: true, entry: { id, word, created_at: now } }, 201);
}

export async function DELETE(request: Request) {
  if (!(await isOwner(request)) || !sameOrigin(request))
    return json({ error: 'Owner access required.' }, 403);

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
    if (!body || typeof body !== 'object' || Array.isArray(body)) throw Error();
  } catch {
    return json({ error: 'Invalid request.' }, 400);
  }

  const id = clean(body.id, 80);
  if (!id) return json({ error: 'Choose a word to remove.' }, 400);

  const supabase = supabaseAdmin();
  await supabase.from('visitor_words').delete().eq('id', id);
  return json({ ok: true });
}
