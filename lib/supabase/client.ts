// Browser Supabase client for auth (Apple sign-in on the web).
//
// Separate from lib/supabase.ts (the anon singleton the waitlist uses) so the
// waitlist keeps working untouched. This one is for the resource-library login.
//
// Uses @supabase/ssr so the session lives in cookies and the server can read it
// (server components, route handlers, middleware all share the same session).

import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.supabase.co",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "placeholder-anon-key",
  );
}
