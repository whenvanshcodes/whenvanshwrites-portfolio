export const dynamic = 'force-dynamic';
import { supabaseAdmin, json } from '../../../../lib/portfolio-api';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = supabaseAdmin();
  const { data: row } = await supabase
    .from('photos')
    .select('object_key, mime')
    .eq('id', id)
    .single();

  if (!row) return json({ error: 'Photo not found.' }, 404);

  const { data: object, error } = await supabase.storage
    .from('portfolio-media')
    .download(row.object_key);

  if (error || !object) return json({ error: 'Photo not found.' }, 404);

  return new Response(object, {
    headers: {
      'Content-Type': row.mime,
      'Cache-Control': 'public, max-age=86400',
      'X-Content-Type-Options': 'nosniff',
      'Content-Security-Policy': "default-src 'none'; sandbox",
    },
  });
}
