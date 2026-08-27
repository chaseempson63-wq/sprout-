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

// MINIMAL STAGE (2026-08-27, Chase's call): the live site is being sent to real
// people as "336 free worksheets, no signup", and the coming-soon furniture was
// getting in the way of that promise. People tapped the teases expecting a
// product and hit a dead end, with a broken close button on the pop-up.
//
// While this is true the library page is just: header, one line, search, tags,
// worksheets. Hidden behind it: the build-your-own prompt bar, the slideshow +
// community teases, the coming-soon pop-up, the kid profile cards, the help
// mascot, the first-run tutorial, and the Build/Community items in the nav.
//
// NOTHING IS DELETED. Set this to false and every one of those comes straight
// back exactly as it was.
export const RESOURCES_MINIMAL = true;
