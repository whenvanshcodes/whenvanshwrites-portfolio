import { createServerSupabaseClient } from './supabase/server';
import { getSupabaseAdmin } from './supabase/admin';

export const json = (data: unknown, status = 200) =>
  Response.json(data, {
    status,
    headers: {
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
    },
  });

export function sameOrigin(request: Request) {
  const origin = request.headers.get('origin');
  return !origin || origin === new URL(request.url).origin;
}

export const clean = (value: unknown, max: number) =>
  typeof value === 'string' ? value.trim().slice(0, max) : '';

export function imageType(bytes: Uint8Array) {
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return 'image/jpeg';
  if (
    bytes[0] === 137 &&
    bytes[1] === 80 &&
    bytes[2] === 78 &&
    bytes[3] === 71 &&
    bytes[4] === 13 &&
    bytes[5] === 10
  )
    return 'image/png';
  if (
    String.fromCharCode(...bytes.slice(0, 4)) === 'RIFF' &&
    String.fromCharCode(...bytes.slice(8, 12)) === 'WEBP'
  )
    return 'image/webp';
  if (['GIF87a', 'GIF89a'].includes(String.fromCharCode(...bytes.slice(0, 6))))
    return 'image/gif';
  return null;
}

/**
 * Authorize owner account on server using verified Supabase Auth User ID.
 * Protects every admin API and upload operation.
 * Privileged Supabase keys are never exposed in browser code.
 * Development-only owner shortcuts are strictly disabled in production.
 */
export async function isOwner(request: Request): Promise<boolean> {
  const host = new URL(request.url).hostname;

  // Development-only local preview: strictly rejected in production
  if (
    process.env.NODE_ENV === 'development' &&
    ['localhost', '127.0.0.1', '[::1]'].includes(host) &&
    request.headers.get('cookie')?.split(';').some(c => c.trim() === 'lab_local_owner=1')
  ) {
    return true;
  }

  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) return false;

    const validIds = new Set([
      'e627b0de-81a8-435e-8099-1b396a0432b7',
      '3429db72-4b59-438b-8755-34705258318d',
      process.env.SUPABASE_OWNER_USER_ID,
      process.env.OWNER_USER_ID,
    ].filter(Boolean));

    const validEmails = new Set([
      'vanshbhati522@gmail.com',
      'vb56804@gmail.com',
      process.env.SUPABASE_OWNER_EMAIL?.toLowerCase(),
      process.env.OWNER_EMAIL?.toLowerCase(),
    ].filter(Boolean));

    if (validIds.has(user.id) || (user.email && validEmails.has(user.email.toLowerCase()))) {
      return true;
    }

    return false;
  } catch {
    return false;
  }
}

export function supabaseAdmin() {
  return getSupabaseAdmin();
}
