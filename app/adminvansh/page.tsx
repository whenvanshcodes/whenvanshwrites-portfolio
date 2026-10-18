import { headers } from 'next/headers';
import { createServerSupabaseClient } from '../../lib/supabase/server';
import { isOwner } from '../../lib/portfolio-api';
import AdminVansh from '../../components/admin-vansh';
import AdminLogin from '../../components/admin-login';

export const dynamic = 'force-dynamic';
export const metadata = {
  title: 'Owner studio — Vansh Bhati',
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const h = await headers();
  const request = new Request('https://' + (h.get('host') || 'localhost') + '/adminvansh', {
    headers: new Headers(h),
  });

  const owner = await isOwner(request);

  let userEmail: string | undefined;
  if (!owner) {
    try {
      const supabase = await createServerSupabaseClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user?.email) {
        userEmail = user.email;
      }
    } catch {
      // User is not signed in or client not yet initialized
    }
  }

  return (
    <>
      <link rel="stylesheet" href="/admin-vansh.css" />
      {owner ? (
        <AdminVansh signOut="/api/auth/signout" />
      ) : (
        <AdminLogin userEmail={userEmail} />
      )}
    </>
  );
}
