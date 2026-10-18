export const dynamic = 'force-dynamic';
import {
  json,
  isOwner,
  sameOrigin,
  supabaseAdmin,
  clean,
  imageType,
} from '../../../lib/portfolio-api';

export async function GET() {
  const supabase = supabaseAdmin();
  const [seriesRes, photosRes] = await Promise.all([
    supabase
      .from('photo_series')
      .select('id, title, description, created_at')
      .order('created_at', { ascending: false }),
    supabase
      .from('photos')
      .select('id, series_id, caption, sort_order')
      .order('sort_order', { ascending: true }),
  ]);

  const series = seriesRes.data || [];
  const photos = photosRes.data || [];

  return json({
    series: series.map((s: any) => ({
      ...s,
      photos: photos
        .filter((p: any) => p.series_id === s.id)
        .map((p: any) => ({
          id: p.id,
          caption: p.caption,
          url: '/api/photo/' + p.id,
        })),
    })),
  });
}

export async function POST(request: Request) {
  if (!(await isOwner(request)) || !sameOrigin(request))
    return json({ error: 'Owner access required.' }, 403);

  if (Number(request.headers.get('content-length') || 0) > 45000000)
    return json({ error: 'Keep a series under 40 MB.' }, 413);

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return json({ error: 'Could not read the upload.' }, 400);
  }

  const title = clean(form.get('title'), 120);
  const description = clean(form.get('description'), 1600);
  const files = form.getAll('photos').filter((x): x is File => x instanceof File);

  if (!title || !files.length || files.length > 12)
    return json({ error: 'Add a title and 1–12 photos.' }, 400);

  if (
    files.some(x => x.size > 8 * 1024 * 1024) ||
    files.reduce((n, f) => n + f.size, 0) > 40 * 1024 * 1024
  )
    return json({ error: 'Use photos under 8 MB each, up to 40 MB per series.' }, 400);

  const supabase = supabaseAdmin();
  const seriesId = crypto.randomUUID();
  const uploaded: string[] = [];
  const entries: { id: string; key: string; mime: string; caption: string; sort: number }[] = [];

  try {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const bytes = new Uint8Array(await file.arrayBuffer());
      const mime = imageType(bytes);
      if (!mime) throw new Error('Use JPG, PNG, WebP, or GIF photos.');
      const id = crypto.randomUUID();
      const key = 'series/' + seriesId + '/' + id;

      const { error: uploadError } = await supabase.storage
        .from('portfolio-media')
        .upload(key, bytes, { contentType: mime, upsert: true });

      if (uploadError) throw uploadError;
      uploaded.push(key);
      entries.push({
        id,
        key,
        mime,
        caption: clean(form.get('caption_' + i), 300),
        sort: i,
      });
    }

    const { error: seriesError } = await supabase.from('photo_series').insert({
      id: seriesId,
      title,
      description,
      created_at: Date.now(),
    });

    if (seriesError) throw seriesError;

    const { error: photosError } = await supabase.from('photos').insert(
      entries.map(p => ({
        id: p.id,
        series_id: seriesId,
        object_key: p.key,
        mime: p.mime,
        caption: p.caption,
        sort_order: p.sort,
      }))
    );

    if (photosError) throw photosError;

    return json({ ok: true, id: seriesId }, 201);
  } catch (e) {
    if (uploaded.length) {
      await supabase.storage.from('portfolio-media').remove(uploaded);
    }
    return json(
      {
        error:
          e instanceof Error && e.message.startsWith('Use ')
            ? e.message
            : 'The upload did not finish. Please try again.',
      },
      400
    );
  }
}

export async function DELETE(request: Request) {
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

  const { data: photos } = await supabase
    .from('photos')
    .select('object_key')
    .eq('series_id', id);

  await supabase.from('photos').delete().eq('series_id', id);
  await supabase.from('photo_series').delete().eq('id', id);

  if (photos && photos.length > 0) {
    await supabase.storage.from('portfolio-media').remove(photos.map(p => p.object_key));
  }

  return json({ ok: true });
}
