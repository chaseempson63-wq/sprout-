// Curated on-brand line-art for resource visuals. Each entry is the INNER markup
// of a 100x100 SVG; the renderer wraps it in a <g> with a dark forest stroke and
// no fill, so it prints as clean black-line art a child colors in. Deliberately
// stroke-only (no url() gradients) so the print-color rules leave it untouched.
//
// The model may only reference a key that exists here (validated in normalize);
// anything else degrades to an honest "draw it yourself" box. Keep shapes simple
// and recognizable to a 5-year-old, with a few internal lines for color regions.

export const SVG_ART: Record<string, string> = {
  // ── ocean ──────────────────────────────────────────────────────────────
  fish: `<path d="M18 50 C30 30 58 30 72 50 C58 70 30 70 18 50 Z"/><path d="M72 50 L92 37 L92 63 Z"/><path d="M46 35 C41 45 41 55 46 65"/><circle cx="32" cy="46" r="2.6" fill="#1B3722" stroke="none"/>`,
  whale: `<path d="M14 54 C22 34 62 34 80 50 C70 64 30 68 14 54 Z"/><path d="M80 50 L94 42 L90 51 L96 60 Z"/><path d="M40 34 C40 27 36 25 38 19"/><path d="M44 34 C46 28 50 26 50 20"/><path d="M16 56 C26 61 36 61 46 58"/><circle cx="30" cy="50" r="2.6" fill="#1B3722" stroke="none"/>`,
  turtle: `<path d="M28 62 C30 42 70 42 72 62"/><line x1="28" y1="62" x2="72" y2="62"/><circle cx="80" cy="56" r="6"/><circle cx="82" cy="55" r="1.8" fill="#1B3722" stroke="none"/><path d="M34 62 L31 71"/><path d="M47 64 L45 73"/><path d="M58 64 L61 73"/><path d="M68 62 L71 71"/><path d="M26 60 L19 62"/><path d="M50 44 L50 62"/><path d="M39 50 L44 62"/><path d="M61 50 L56 62"/>`,
  octopus: `<path d="M34 32 C34 17 66 17 66 32 L66 50 C66 56 34 56 34 50 Z"/><circle cx="44" cy="36" r="2.6" fill="#1B3722" stroke="none"/><circle cx="56" cy="36" r="2.6" fill="#1B3722" stroke="none"/><path d="M37 52 C33 62 30 66 33 78"/><path d="M44 54 C42 64 40 70 44 80"/><path d="M50 54 C50 66 50 72 50 81"/><path d="M56 54 C58 64 60 70 56 80"/><path d="M63 52 C67 62 70 66 67 78"/>`,
  starfish: `<path d="M50 14 C54 31 60 37 77 39 C62 47 60 53 64 70 C54 60 46 60 36 70 C40 53 38 47 23 39 C40 37 46 31 50 14 Z"/><circle cx="50" cy="44" r="2" fill="#1B3722" stroke="none"/><circle cx="44" cy="52" r="1.6" fill="#1B3722" stroke="none"/><circle cx="56" cy="52" r="1.6" fill="#1B3722" stroke="none"/>`,
  crab: `<ellipse cx="50" cy="58" rx="22" ry="13"/><path d="M40 46 L38 36"/><circle cx="38" cy="33" r="3"/><path d="M60 46 L62 36"/><circle cx="62" cy="33" r="3"/><path d="M30 54 C19 50 15 57 20 63 C13 61 14 52 23 50"/><path d="M70 54 C81 50 85 57 80 63 C87 61 86 52 77 50"/><path d="M30 64 L22 72"/><path d="M40 68 L34 76"/><path d="M60 68 L66 76"/><path d="M70 64 L78 72"/>`,
  seashell: `<path d="M50 80 C27 80 17 44 50 24 C83 44 73 80 50 80 Z"/><path d="M50 80 L33 41"/><path d="M50 80 L42 35"/><path d="M50 80 L50 30"/><path d="M50 80 L58 35"/><path d="M50 80 L67 41"/>`,
  dolphin: `<path d="M16 64 C24 40 56 28 84 30 C72 36 66 44 62 52 C72 50 80 56 84 53 C80 64 62 70 44 70 C32 70 22 70 16 64 Z"/><path d="M50 34 C54 24 60 24 62 31"/><circle cx="30" cy="52" r="2.4" fill="#1B3722" stroke="none"/>`,
  wave: `<path d="M8 64 C20 48 28 48 40 60 C52 72 60 72 72 60 C80 52 86 52 92 58"/><path d="M8 76 C20 60 28 60 40 72 C52 84 60 84 72 72 C80 64 86 64 92 70"/>`,
  // ── sky & nature ───────────────────────────────────────────────────────
  sun: `<circle cx="50" cy="50" r="19"/><path d="M50 8 L50 19"/><path d="M50 81 L50 92"/><path d="M8 50 L19 50"/><path d="M81 50 L92 50"/><path d="M21 21 L29 29"/><path d="M79 21 L71 29"/><path d="M21 79 L29 71"/><path d="M79 79 L71 71"/>`,
  star: `<path d="M50 10 L61 38 L92 39 L67 58 L76 90 L50 71 L24 90 L33 58 L8 39 L39 38 Z"/>`,
  cloud: `<path d="M30 66 C17 66 16 50 29 49 C29 36 48 34 51 45 C57 34 78 39 75 51 C87 51 86 66 74 66 Z"/>`,
  rainbow: `<path d="M16 74 A34 34 0 0 1 84 74"/><path d="M26 74 A24 24 0 0 1 74 74"/><path d="M36 74 A14 14 0 0 1 64 74"/>`,
  tree: `<rect x="45" y="58" width="10" height="28" rx="2"/><path d="M50 16 C32 22 26 42 36 52 C26 56 28 70 44 70 L56 70 C72 70 74 56 64 52 C74 42 68 22 50 16 Z"/>`,
  flower: `<circle cx="50" cy="36" r="8"/><ellipse cx="50" cy="20" rx="6" ry="9"/><ellipse cx="66" cy="30" rx="9" ry="6"/><ellipse cx="60" cy="48" rx="6" ry="9"/><ellipse cx="40" cy="48" rx="6" ry="9"/><ellipse cx="34" cy="30" rx="9" ry="6"/><path d="M50 44 L50 88"/><path d="M50 68 C61 62 70 66 67 75 C58 77 52 73 50 68"/>`,
  leaf: `<path d="M50 86 C22 66 28 26 50 14 C72 26 78 66 50 86 Z"/><path d="M50 86 L50 18"/><path d="M50 40 L36 32"/><path d="M50 54 L34 48"/><path d="M50 40 L64 32"/><path d="M50 54 L66 48"/>`,
  apple: `<path d="M50 30 C44 22 29 24 27 41 C25 60 38 82 50 82 C62 82 75 60 73 41 C71 24 56 22 50 30 Z"/><path d="M50 30 L52 17"/><path d="M53 21 C61 14 70 18 65 27 C58 30 54 27 53 21 Z"/>`,
  butterfly: `<line x1="50" y1="30" x2="50" y2="70"/><path d="M50 38 C30 18 14 30 23 45 C29 55 44 52 50 46"/><path d="M50 38 C70 18 86 30 77 45 C71 55 56 52 50 46"/><path d="M50 50 C37 56 28 68 36 78 C43 84 50 70 50 58"/><path d="M50 50 C63 56 72 68 64 78 C57 84 50 70 50 58"/><path d="M50 30 C46 22 42 22 40 26"/><path d="M50 30 C54 22 58 22 60 26"/>`,
  // ── animals & friends ──────────────────────────────────────────────────
  cat: `<circle cx="50" cy="55" r="25"/><path d="M31 38 L27 18 L45 31 Z"/><path d="M69 38 L73 18 L55 31 Z"/><circle cx="41" cy="52" r="3" fill="#1B3722" stroke="none"/><circle cx="59" cy="52" r="3" fill="#1B3722" stroke="none"/><path d="M50 60 L46 64 L54 64 Z" fill="#1B3722" stroke="none"/><path d="M50 64 L50 68"/><path d="M22 56 L36 58"/><path d="M22 62 L36 62"/><path d="M78 56 L64 58"/><path d="M78 62 L64 62"/>`,
  dog: `<circle cx="50" cy="54" r="23"/><path d="M30 38 C15 40 14 64 30 64"/><path d="M70 38 C85 40 86 64 70 64"/><circle cx="42" cy="50" r="3" fill="#1B3722" stroke="none"/><circle cx="58" cy="50" r="3" fill="#1B3722" stroke="none"/><ellipse cx="50" cy="60" rx="6" ry="4" fill="#1B3722" stroke="none"/><path d="M50 64 C50 70 44 72 40 70"/><path d="M50 64 C50 70 56 72 60 70"/>`,
  bird: `<path d="M30 56 C30 42 50 38 60 46 C66 40 76 42 78 36 C78 44 74 48 70 50 C77 54 74 65 62 66 C46 70 30 68 30 56 Z"/><path d="M78 50 L91 47 L80 56 Z"/><circle cx="64" cy="48" r="2.4" fill="#1B3722" stroke="none"/><path d="M44 52 C50 58 58 58 64 54"/>`,
  // ── places & things ────────────────────────────────────────────────────
  house: `<rect x="28" y="48" width="44" height="36" rx="2"/><path d="M22 49 L50 24 L78 49 Z"/><rect x="44" y="64" width="13" height="20" rx="1.5"/><rect x="33" y="54" width="11" height="11" rx="1.5"/>`,
  rocket: `<path d="M50 12 C63 26 63 52 58 70 L42 70 C37 52 37 26 50 12 Z"/><circle cx="50" cy="35" r="6"/><path d="M42 58 L29 75 L42 70 Z"/><path d="M58 58 L71 75 L58 70 Z"/><path d="M45 70 C47 82 53 82 55 70"/>`,
  heart: `<path d="M50 84 C18 60 14 36 31 27 C43 20 50 31 50 35 C50 31 57 20 69 27 C86 36 82 60 50 84 Z"/>`,
};

// Stable ordered key list for the prompt + validation.
export const SVG_KEYS: string[] = Object.keys(SVG_ART);

// Grouped, human-readable for the model so it picks a key that actually exists.
export const SVG_KEY_HINT =
  "ocean: fish, whale, turtle, octopus, starfish, crab, seashell, dolphin, wave; " +
  "nature: sun, star, cloud, rainbow, tree, flower, leaf, apple, butterfly; " +
  "animals: cat, dog, bird; things: house, rocket, heart";
