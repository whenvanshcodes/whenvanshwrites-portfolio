export const dynamic = 'force-dynamic';
import { json, isOwner, sameOrigin, supabaseAdmin, clean } from '../../../lib/portfolio-api';

export async function GET() {
  const supabase = supabaseAdmin();
  const { data, error } = await supabase
    .from('visitor_experiences')
    .select('id, name, experience, created_at')
    .order('created_at', { ascending: false })
    .limit(60);

  if (error) {
    console.error('Visitor experiences get error:', error);
    return json({ entries: [] });
  }
  return json({ entries: data || [] });
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) return json({ error: 'Please write from the portfolio.' }, 403);
  if (Number(request.headers.get('content-length') || 0) > 4000)
    return json({ error: 'Please keep your note short.' }, 413);

  let b: Record<string, unknown>;
  try {
    b = (await request.json()) as Record<string, unknown>;
    if (!b || typeof b !== 'object' || Array.isArray(b)) throw Error();
  } catch {
    return json({ error: 'Please enter your name and experience.' }, 400);
  }

  if (b.website) return json({ ok: true });
  if (b.public !== true)
    return json({ error: 'Please confirm that your note may appear publicly.' }, 400);

  const name = clean(b.name, 61);
  const experience = clean(b.experience, 241);
  if (!name || name.length > 60 || experience.length < 5 || experience.length > 240)
    return json({ error: 'Use a name up to 60 characters and a note of 5–240 characters.' }, 400);

  const supabase = supabaseAdmin();
  const now = Date.now();

  const { count } = await supabase
    .from('visitor_experiences')
    .select('*', { count: 'exact', head: true })
    .gt('created_at', now - 60000);

  if (count && count >= 10)
    return json({ error: 'The notebook is busy. Try again in a minute.' }, 429);

  const { data: duplicate } = await supabase
    .from('visitor_experiences')
    .select('id')
    .eq('name', name)
    .eq('experience', experience)
    .gt('created_at', now - 60000)
    .limit(1);

  if (duplicate && duplicate.length > 0)
    return json({ error: 'That note already landed. Thank you!' }, 429);

  const entry = { id: crypto.randomUUID(), name, experience, created_at: now };
  const { error } = await supabase.from('visitor_experiences').insert(entry);
  if (error) {
    console.error('Visitor experiences insert error:', error);
    return json({ error: 'Could not save your note. Please try again.' }, 500);
  }

  return json({ ok: true, entry }, 201);
}

export async function DELETE(request: Request) {
  if (!(await isOwner(request)) || !sameOrigin(request))
    return json({ error: 'Owner access required.' }, 403);

  let b: Record<string, unknown>;
  try {
    b = (await request.json()) as Record<string, unknown>;
  } catch {
    return json({ error: 'Choose a note.' }, 400);
  }

  const id = clean(b?.id, 80);
  if (!id) return json({ error: 'Choose a note.' }, 400);

  const supabase = supabaseAdmin();
  await supabase.from('visitor_experiences').delete().eq('id', id);
  return json({ ok: true });
}
