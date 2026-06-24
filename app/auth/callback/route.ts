// OAuth callback: Apple redirects here after sign-in. We exchange the code for a
// session (sets the auth cookies) and bounce the user to where they were headed.
//
// The redirect URL for this route must be allowlisted in the Supabase dashboard
// (Auth -> URL Configuration) and in the Apple Services ID return URLs.

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/resources";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/resources/login?error=auth`);
}
