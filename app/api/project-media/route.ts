export const dynamic = 'force-dynamic';
import {
  json,
  isOwner,
  sameOrigin,
  supabaseAdmin,
  clean,
  imageType,
} from '../../../lib/portfolio-api';
import { resolvedPortfolio } from '../../../lib/portfolio-content';
import previews from '../../../data/project-previews.json';

export async function GET() {
  const supabase = supabaseAdmin();
  const [mediaRes, hiddenRes] = await Promise.all([
    supabase
      .from('project_media')
      .select('id, project_id, caption, created_at')
      .order('created_at', { ascending: true }),
    supabase.from('portfolio_content').select('key').like('key', 'media:hidden:%'),
  ]);

  const hidden = new Set((hiddenRes.data || []).map(p => p.key.slice('media:hidden:'.length)));
  const screenshots = [
    ...(mediaRes.data || []).map((p: any) => ({
      ...p,
      kind: 'screenshot',
      url: '/api/project-media/' + p.id,
    })),
    ...previews.filter(p => !hidden.has(p.id)),
  ];

  return json({ screenshots });
}

export async function POST(request: Request) {
  if (!(await isOwner(request)) || !sameOrigin(request))
    return json({ error: 'Owner access required.' }, 403);

  if (Number(request.headers.get('content-length') || 0) > 9000000)
    return json({ error: 'Use a screenshot under 8 MB.' }, 413);

  let f: FormData;
  try {
    f = await request.formData();
  } catch {
    return json({ error: 'Could not read the upload.' }, 400);
  }

  const projectId = clean(f.get('projectId'), 50);
  const caption = clean(f.get('caption'), 300);
  const file = f.get('image');

  if (!(file instanceof File) || !file.size || file.size > 8 * 1024 * 1024)
    return json({ error: 'Use a PNG, JPEG, or WebP screenshot under 8 MB.' }, 400);

  if (!(await resolvedPortfolio()).projects.some(p => p.id === projectId))
    return json({ error: 'Choose a published project.' }, 400);

  const supabase = supabaseAdmin();
  const { count } = await supabase
    .from('project_media')
    .select('*', { count: 'exact', head: true })
    .eq('project_id', projectId);

  if (count && count >= 12) return json({ error: 'Use up to 12 screenshots per project.' }, 400);

  const bytes = new Uint8Array(await file.arrayBuffer());
  const mime = imageType(bytes);
  if (!mime || !['image/png', 'image/jpeg', 'image/webp'].includes(mime))
    return json({ error: 'Use a real PNG, JPEG, or WebP image.' }, 400);

  const id = crypto.randomUUID();
  const key = 'project-screenshots/' + projectId + '/' + id;

  try {
    const { error: uploadError } = await supabase.storage
      .from('portfolio-media')
      .upload(key, bytes, { contentType: mime, upsert: true });

    if (uploadError) throw uploadError;

    const { error: insertError } = await supabase.from('project_media').insert({
      id,
      project_id: projectId,
      object_key: key,
      mime,
      caption,
      created_at: Date.now(),
    });

    if (insertError) throw insertError;

    return json({ ok: true, id }, 201);
  } catch (err) {
    console.error('Project media upload error:', err);
    await supabase.storage.from('portfolio-media').remove([key]);
    return json({ error: 'Could not save the screenshot.' }, 500);
  }
}

export async function DELETE(request: Request) {
  if (!(await isOwner(request)) || !sameOrigin(request))
    return json({ error: 'Owner access required.' }, 403);

  let b: any;
  try {
    b = await request.json();
  } catch {
    return json({ error: 'Invalid request.' }, 400);
  }

  const id = clean(b?.id, 80);
  const supabase = supabaseAdmin();

  if (previews.some(p => p.id === id)) {
    await supabase.from('portfolio_content').upsert(
      {
        key: 'media:hidden:' + id,
        payload: 'true',
        updated_at: Date.now(),
      },
      { onConflict: 'key' }
    );
    return json({ ok: true });
  }

  const { data: row } = await supabase
    .from('project_media')
    .select('object_key')
    .eq('id', id)
    .single();

  if (!row) return json({ error: 'Screenshot not found.' }, 404);

  await supabase.from('project_media').delete().eq('id', id);
  await supabase.storage.from('portfolio-media').remove([row.object_key]);
  return json({ ok: true });
}
