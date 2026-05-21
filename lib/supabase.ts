import { createClient } from "@supabase/supabase-js";

// Public anon Supabase client. The anon key is meant to be exposed
// in the browser bundle — security relies on Row Level Security
// policies in `supabase/schema.sql`. Service-role operations (reading
// the waitlist, etc.) must happen server-side with the service_role
// key, never from this client.
//
// Fallback values let the build prerender static pages even when the
// env vars aren't set locally. At runtime against the placeholders,
// `.from("waitlist").insert(...)` fails with a network error and the
// Waitlist form shows its error state — which is the right behaviour
// when Supabase isn't configured. Set real values in Vercel project
// settings before going live (see `.env.example`).

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.supabase.co";
const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "placeholder-anon-key";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
