export const dynamic = 'force-dynamic';
import { json, isOwner, sameOrigin, supabaseAdmin, clean } from '../../../lib/portfolio-api';

export async function GET(request: Request) {
  const q = new URL(request.url).searchParams;
  const course = q.get('course') === 'garden' ? 'garden' : 'village';
  const reverse = q.get('reverse') === '1' ? 1 : 0;
  const laps = Number(q.get('laps') || 3);
  if (![1, 3, 5].includes(laps)) return json({ error: 'Choose 1, 3 or 5 laps.' }, 400);

  const supabase = supabaseAdmin();
  const { data, error } = await supabase
    .from('race_times')
    .select('id, name, time_ms, created_at')
    .eq('course', course)
    .eq('reverse', reverse)
    .eq('laps', laps)
    .order('time_ms', { ascending: true })
    .order('created_at', { ascending: true })
    .limit(20);

  if (error) {
    console.error('Race times get error:', error);
    return json({ entries: [] });
  }

  return json({ entries: (data || []).map(r => ({ ...r, time: r.time_ms / 1000 })) });
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) return json({ error: 'Share from the portfolio.' }, 403);
  if (Number(request.headers.get('content-length') || 0) > 3000)
    return json({ error: 'Result too large.' }, 413);

  let b: Record<string, unknown>;
  try {
    b = (await request.json()) as Record<string, unknown>;
    if (!b || Array.isArray(b) || typeof b !== 'object') throw Error();
  } catch {
    return json({ error: 'Invalid result.' }, 400);
  }

  const name = clean(b.name, 31);
  const laps = Number(b.laps);
  const time = Number(b.time);
  const course = b.course;
  const reverse = b.reverse === true ? 1 : 0;
  const splits = b.splits;

  if (b.public !== true)
    return json({ error: 'Please opt in before publishing your name and time.' }, 400);

  if (
    !name ||
    name.length > 30 ||
    !['village', 'garden'].includes(String(course)) ||
    ![1, 3, 5].includes(laps) ||
    !Number.isFinite(time) ||
    time < 8 * laps ||
    time > 1800 ||
    !Array.isArray(splits) ||
    splits.length !== laps ||
    !splits.every(t => typeof t === 'number' && Number.isFinite(t) && t >= 8) ||
    Math.abs(splits.reduce((a: number, t: number) => a + t, 0) - time) > 0.1
  )
    return json({ error: 'This result is not a complete lap record.' }, 400);

  const supabase = supabaseAdmin();
  const now = Date.now();

  const { count } = await supabase
    .from('race_times')
    .select('*', { count: 'exact', head: true })
    .gt('created_at', now - 60000);

  if (count && count >= 12)
    return json({ error: 'The lap book is busy. Try again in a minute.' }, 429);

  const ms = Math.round(time * 1000);

  const { data: duplicate } = await supabase
    .from('race_times')
    .select('id')
    .eq('name', name)
    .eq('course', course)
    .eq('reverse', reverse)
    .eq('laps', laps)
    .eq('time_ms', ms)
    .limit(1);

  if (duplicate && duplicate.length > 0)
    return json({ error: 'That lap is already in the book.' }, 409);

  const { error } = await supabase.from('race_times').insert({
    id: crypto.randomUUID(),
    name,
    course,
    reverse,
    laps,
    time_ms: ms,
    created_at: now,
  });

  if (error) {
    console.error('Race times insert error:', error);
    return json({ error: 'Could not record lap time. Please try again.' }, 500);
  }

  return json({ ok: true }, 201);
}

export async function DELETE(request: Request) {
  if (!(await isOwner(request)) || !sameOrigin(request))
    return json({ error: 'Owner access required.' }, 403);

  let b: Record<string, unknown>;
  try {
    const value = await request.json();
    if (!value || typeof value !== 'object' || Array.isArray(value)) throw Error();
    b = value as Record<string, unknown>;
  } catch {
    return json({ error: 'Choose a result.' }, 400);
  }

  const id = clean(b?.id, 80);
  if (!id) return json({ error: 'Choose a result.' }, 400);

  const supabase = supabaseAdmin();
  await supabase.from('race_times').delete().eq('id', id);
  return json({ ok: true });
}
