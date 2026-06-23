// Server-side Supabase client for auth (reads the session from cookies).
//
// Used by server components, route handlers, and the auth callback. Pairs with
// the browser client in lib/supabase/client.ts and the session-refresh
// middleware in middleware.ts.

import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { User } from "@supabase/supabase-js";

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

// True once real Supabase creds are set. Until then the auth layer stays inert
// so it can't break the live site or make doomed calls to the placeholder host.
export function isAuthConfigured(): boolean {
  return !!URL && !!ANON && !URL.includes("placeholder");
}

export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(URL, ANON, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Called from a Server Component (cookies are read-only there). The
          // middleware refreshes the session cookie, so this is safe to ignore.
        }
      },
    },
  });
}

// Safe accessor: returns the signed-in user, or null when unconfigured or on any
// error. Never throws, so callers (login page, the future gate) can call it
// freely even before creds exist.
export async function getCurrentUser(): Promise<User | null> {
  if (!isAuthConfigured()) return null;
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  } catch {
    return null;
  }
}
