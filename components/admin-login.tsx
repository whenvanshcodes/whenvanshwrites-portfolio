'use client';

import { useState, type FormEvent } from 'react';
import { createClient } from '../lib/supabase/client';

export default function AdminLogin({ userEmail }: { userEmail?: string }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'password' | 'magic-link'>('password');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const supabase = createClient();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      if (mode === 'password') {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (signInError) throw signInError;
        window.location.reload();
      } else {
        const { error: otpError } = await supabase.auth.signInWithOtp({
          email: email.trim(),
          options: {
            emailRedirectTo: `${window.location.origin}/adminvansh`,
          },
        });
        if (otpError) throw otpError;
        setMessage('Check your email for a secure sign-in link.');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Could not sign in. Check your credentials.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="admin-login">
      <span>VANSH / OWNER STUDIO</span>
      <h1>Your portfolio.<br />Your control room.</h1>

      {userEmail ? (
        <>
          <p>
            Signed in as <strong>{userEmail}</strong>. This account is not authorized as the verified owner.
          </p>
          <a href="/api/auth/signout">Switch account / Sign out ↗</a>
        </>
      ) : (
        <>
          <p>
            Sign in with your verified Supabase owner credentials to edit your portfolio, projects, writing Hut, and media.
          </p>

          <form onSubmit={handleSubmit}>
            {error && <div className="admin-login-error" role="alert">{error}</div>}
            {message && <div className="admin-login-success" role="status">{message}</div>}

            <label>
              Email address
              <input
                type="email"
                required
                value={email}
                placeholder="you@domain.com"
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </label>

            {mode === 'password' && (
              <label>
                Password
                <input
                  type="password"
                  required
                  value={password}
                  placeholder="••••••••••••"
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
              </label>
            )}

            <button type="submit" className="admin-login-submit" disabled={loading}>
              {loading ? 'Verifying…' : mode === 'password' ? 'Sign in to Owner Studio' : 'Send Magic Link'}
            </button>

            <div style={{ display: 'flex', gap: '16px', marginTop: '10px', fontSize: '13px' }}>
              <button
                type="button"
                style={{ background: 'none', border: 'none', color: '#73b9ff', cursor: 'pointer', padding: 0 }}
                onClick={() => {
                  setMode(mode === 'password' ? 'magic-link' : 'password');
                  setError('');
                  setMessage('');
                }}
              >
                {mode === 'password' ? 'Sign in with Magic Link instead →' : 'Sign in with password instead →'}
              </button>
            </div>
          </form>
        </>
      )}

      <a href="/">Back to the portfolio</a>
    </main>
  );
}
