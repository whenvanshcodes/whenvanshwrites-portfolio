export const dynamic = 'force-dynamic';
import { json, isOwner, sameOrigin, supabaseAdmin } from '../../../lib/portfolio-api';
import { contentOverrides, validateContent } from '../../../lib/portfolio-content';

export async function GET() {
  return json({ content: await contentOverrides() });
}

export async function PUT(request: Request) {
  if (!(await isOwner(request)) || !sameOrigin(request)) {
    return json({ error: 'Owner access required.' }, 403);
  }
  let b: any;
  try {
    const t = await request.text();
    if (new TextEncoder().encode(t).length > 150000) {
      return json({ error: 'This section is too large.' }, 413);
    }
    b = JSON.parse(t);
    if (typeof b?.key !== 'string') throw Error();
  } catch {
    return json({ error: 'Invalid content.' }, 400);
  }

  try {
    const value = validateContent(b.key, b.value);
    const supabase = supabaseAdmin();
    const { error } = await supabase.from('portfolio_content').upsert(
      {
        key: b.key,
        payload: JSON.stringify(value),
        updated_at: Date.now(),
      },
      { onConflict: 'key' }
    );
    if (error) throw error;
    return json({ ok: true, key: b.key, value });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : 'Could not save.' }, 400);
  }
}
