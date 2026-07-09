// Resources DEMO STAGE (2026-07-09): the live site runs as a free demo of the
// templates while the premium features (build-your-own, slideshows, community)
// are teased as coming soon — frosted cards, animated previews, no dead ends.
//
// This is a UI/marketing state, separate from the dormant subscriber gate
// (RESOURCES_AUTH_ENABLED). At launch: set this to false AND flip the auth
// flag in Vercel — the coming-soon teases disappear and the tier-aware gate
// (middleware.ts) takes over the same features.
//
// Safe to import anywhere: it's a plain constant, no env, no server-only code.
export const RESOURCES_DEMO = true;
