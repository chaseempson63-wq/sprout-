"use client";

// "Continue with Apple" for the web resource library. Kicks off Supabase Auth's
// Apple OAuth flow; the browser redirects to Apple, then back to /auth/callback.
//
// CREDENTIAL-DEPENDENT: this works the moment the Apple provider is configured in
// the Supabase dashboard (Services ID + key) and the callback URL is allowlisted.
// Until then the button renders but Apple sign-in will error — expected.

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function ResourcesSignIn() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function signInWithApple() {
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const redirectTo = `${window.location.origin}/auth/callback?next=/resources`;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "apple",
      options: { redirectTo },
    });
    if (error) {
      setError("Couldn't start sign-in. Please try again.");
      setLoading(false);
    }
    // On success the browser navigates to Apple, so no success state is needed.
  }

  return (
    <div className="flex w-full flex-col items-center gap-3">
      <button
        onClick={signInWithApple}
        disabled={loading}
        className="flex h-12 w-full max-w-xs items-center justify-center gap-2 rounded-full bg-black text-[15px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden="true">
          <path d="M11.182.008C11.148-.03 9.923.023 8.857 1.18c-1.066 1.156-.902 2.482-.878 2.516.024.034 1.52.087 2.475-1.258.955-1.345.762-2.391.728-2.43zm3.314 11.733c-.048-.096-2.325-1.234-2.113-3.422.212-2.189 1.675-2.789 1.698-2.854.023-.065-.597-.79-1.254-1.157a3.692 3.692 0 0 0-1.563-.434c-.108-.003-.483-.095-1.254.116-.508.139-1.653.589-1.968.607-.316.018-1.256-.522-2.267-.665-.647-.125-1.333.131-1.824.328-.49.196-1.422.754-2.074 2.237-.652 1.482-.311 3.83-.067 4.56.244.729.625 1.924 1.273 2.796.576.984 1.34 1.667 1.659 1.899.319.232 1.219.386 1.843.067.502-.308 1.408-.485 1.766-.472.357.013 1.061.154 1.782.539.571.197 1.111.115 1.652-.105.541-.221 1.324-1.059 2.238-2.758.347-.79.505-1.217.473-1.282z" />
        </svg>
        {loading ? "Taking you to Apple…" : "Continue with Apple"}
      </button>
      {error && (
        <p className="text-[13px] text-rose-300" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
