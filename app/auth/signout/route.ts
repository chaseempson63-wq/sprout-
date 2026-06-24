// Sign out: clears the Supabase session and returns to the login screen.
// Used by the "wrong Apple account" escape hatch on the login page (and later by
// the fog wall).

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const { origin } = new URL(request.url);
  const supabase = await createClient();
  await supabase.auth.signOut();
  return NextResponse.redirect(`${origin}/resources/login`, { status: 303 });
}
