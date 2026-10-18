export const dynamic = 'force-dynamic';
import { supabaseAdmin, json } from '../../../../lib/portfolio-api';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = supabaseAdmin();
  const { data: p } = await supabase
    .from('project_media')
    .select('object_key, mime')
    .eq('id', id)
    .single();

  if (!p) return json({ error: 'Screenshot not found.' }, 404);

  const { data: file, error } = await supabase.storage
    .from('portfolio-media')
    .download(p.object_key);

  if (error || !file) return json({ error: 'Screenshot not found.' }, 404);

  return new Response(file, {
    headers: {
      'Content-Type': p.mime,
      'Cache-Control': 'public, max-age=86400',
      'X-Content-Type-Options': 'nosniff',
      'Content-Security-Policy': "default-src 'none'; sandbox",
    },
  });
}
