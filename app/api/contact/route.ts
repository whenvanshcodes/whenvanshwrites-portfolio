export const dynamic = 'force-dynamic';
import { json, isOwner, sameOrigin, supabaseAdmin, clean } from '../../../lib/portfolio-api';

export async function POST(request: Request) {
  if (!sameOrigin(request)) return json({ error: 'Please submit this form from the portfolio.' }, 403);
  if (Number(request.headers.get('content-length') || 0) > 16000)
    return json({ error: 'This message is too long.' }, 413);

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
    if (!body || typeof body !== 'object' || Array.isArray(body)) throw new Error();
  } catch {
    return json({ error: 'Please check the form and try again.' }, 400);
  }

  if (body.website) return json({ ok: true });
  const name = clean(body.name, 120);
  const email = clean(body.email, 254).toLowerCase();
  const topic = clean(body.topic, 80) || 'Say hello';
  const message = clean(body.message, 4000);

  if (name.length < 2 || !/^\S+@\S+\.\S+$/.test(email) || message.length < 10)
    return json(
      { error: 'Please add your name, a valid email, and a message of at least 10 characters.' },
      400
    );

  const supabase = supabaseAdmin();
  const now = Date.now();
  const { count } = await supabase
    .from('contacts')
    .select('*', { count: 'exact', head: true })
    .eq('email', email)
    .gt('created_at', now - 60000);

  if (count && count >= 2)
    return json({ error: 'Please wait a minute before sending another note.' }, 429);

  const id = crypto.randomUUID();
  const { error } = await supabase.from('contacts').insert({
    id,
    name,
    email,
    topic,
    message,
    created_at: now,
    is_read: 0,
  });

  if (error) {
    console.error('Contact insert error:', error);
    return json({ error: 'Could not send message. Please try again.' }, 500);
  }

  return json({ ok: true }, 201);
}

export async function GET(request: Request) {
  if (!(await isOwner(request))) return json({ error: 'Owner access required.' }, 403);
  const supabase = supabaseAdmin();
  const { data, error } = await supabase
    .from('contacts')
    .select('id, name, email, topic, message, created_at, is_read')
    .order('created_at', { ascending: false })
    .limit(200);

  if (error) {
    console.error('Contact get error:', error);
    return json({ messages: [] });
  }

  return json({ messages: data || [] });
}

export async function PATCH(request: Request) {
  if (!(await isOwner(request)) || !sameOrigin(request))
    return json({ error: 'Owner access required.' }, 403);
  let b: Record<string, unknown>;
  try {
    b = (await request.json()) as Record<string, unknown>;
    if (!b || typeof b !== 'object' || Array.isArray(b)) throw new Error();
  } catch {
    return json({ error: 'Invalid request.' }, 400);
  }
  const id = clean(b.id, 80);
  const supabase = supabaseAdmin();
  await supabase.from('contacts').update({ is_read: 1 }).eq('id', id);
  return json({ ok: true });
}
