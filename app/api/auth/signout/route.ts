export const dynamic = 'force-dynamic';

import { createServerSupabaseClient } from '../../../../lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    await supabase.auth.signOut();
  } catch (err) {
    console.error('Error during sign out:', err);
  }
  return NextResponse.redirect(new URL('/adminvansh', request.url));
}
