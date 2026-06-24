// Pre-built illustration catalog for resource visuals.
//
// These are generated ONCE, offline, by scripts/gen-illustrations.mjs (Venice
// image gen) and committed as static assets in public/resources/illustrations/.
// The model picks an imageKey from this list; the renderer shows the matching
// webp. No image generation happens at request time, so visuals are free, instant,
// and reliable. An imageKey with no asset (not generated yet, or removed) degrades
// to an honest draw box in the renderer.
//
// To add a topic: add an entry here, run the gen script, commit the new webp.

export interface Illustration {
  key: string; // slug; also the asset filename (<key>.webp) and what the model picks
  prompt: string; // subject description for the one-time generator (shared style is added by the script)
  labels?: string[]; // diagram topics: real label text the APP renders flanking the image
  //                    (never baked into the picture, so spelling is always correct)
}

// Grouped only for human readability; order does not matter to the code.
export const ILLUSTRATIONS: Illustration[] = [
  // ── land animals ──────────────────────────────────────────────────────────
  { key: "cat", prompt: "a friendly sitting cat" },
  { key: "dog", prompt: "a happy puppy dog" },
  { key: "lion", prompt: "a friendly lion with a fluffy mane" },
  { key: "elephant", prompt: "a cheerful elephant" },
  { key: "tiger", prompt: "a friendly striped tiger" },
  { key: "bear", prompt: "a cuddly brown bear" },
  { key: "rabbit", prompt: "a cute rabbit with long ears" },
  { key: "fox", prompt: "a friendly orange fox" },
  { key: "horse", prompt: "a gentle horse standing in grass" },
  { key: "cow", prompt: "a spotted cow" },
  { key: "monkey", prompt: "a playful monkey" },
  { key: "giraffe", prompt: "a tall friendly giraffe" },
  { key: "zebra", prompt: "a striped zebra" },
  { key: "panda", prompt: "a cute panda eating bamboo" },
  { key: "kangaroo", prompt: "a kangaroo with a joey in its pouch" },
  { key: "frog", prompt: "a smiling green frog" },
  { key: "deer", prompt: "a gentle deer with small antlers" },
  { key: "pig", prompt: "a happy pink pig" },
  { key: "sheep", prompt: "a fluffy white sheep" },
  { key: "hedgehog", prompt: "a tiny cute hedgehog" },
  // ── ocean ─────────────────────────────────────────────────────────────────
  { key: "fish", prompt: "a bright tropical fish" },
  { key: "whale", prompt: "a friendly blue whale spouting water" },
  { key: "dolphin", prompt: "a leaping dolphin" },
  { key: "shark", prompt: "a friendly cartoon shark" },
  { key: "octopus", prompt: "a smiling purple octopus" },
  { key: "sea-turtle", prompt: "a green sea turtle swimming" },
  { key: "crab", prompt: "a red crab with big claws" },
  { key: "seahorse", prompt: "a curly yellow seahorse" },
  { key: "jellyfish", prompt: "a glowing jellyfish with trailing tentacles" },
  { key: "starfish", prompt: "an orange starfish" },
  { key: "penguin", prompt: "a waddling penguin" },
  // ── birds & bugs ──────────────────────────────────────────────────────────
  { key: "bird", prompt: "a small cheerful songbird" },
  { key: "owl", prompt: "a wise round owl" },
  { key: "eagle", prompt: "a soaring eagle with spread wings" },
  { key: "parrot", prompt: "a colorful tropical parrot" },
  { key: "butterfly", prompt: "a colorful butterfly" },
  { key: "bee", prompt: "a fuzzy honey bee" },
  { key: "ladybug", prompt: "a red ladybug with black spots" },
  { key: "ant", prompt: "a busy little ant" },
  { key: "spider", prompt: "a friendly spider on a web" },
  // ── space ─────────────────────────────────────────────────────────────────
  { key: "sun", prompt: "a bright smiling sun" },
  { key: "moon", prompt: "a crescent moon at night" },
  { key: "earth", prompt: "planet Earth from space" },
  { key: "solar-system", prompt: "the eight planets of our solar system in their correct order out from the sun, with the sun on the left, accurate relative sizes and colors", labels: ["Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune"] },
  { key: "rocket", prompt: "a rocket ship blasting off" },
  { key: "astronaut", prompt: "an astronaut floating in space" },
  { key: "star", prompt: "a single bright twinkling star" },
  { key: "saturn", prompt: "the planet Saturn with its rings" },
  { key: "comet", prompt: "a comet with a glowing tail" },
  // ── nature & weather ──────────────────────────────────────────────────────
  { key: "tree", prompt: "a leafy green tree" },
  { key: "flower", prompt: "a single colorful flower" },
  { key: "mountain", prompt: "a snow-capped mountain" },
  { key: "volcano", prompt: "an erupting volcano with lava and smoke" },
  { key: "rainbow", prompt: "a bright rainbow with clouds" },
  { key: "cloud", prompt: "a fluffy white cloud" },
  { key: "rain", prompt: "a rain cloud with falling raindrops" },
  { key: "snowflake", prompt: "a single detailed snowflake" },
  { key: "leaf", prompt: "a single autumn leaf" },
  { key: "forest", prompt: "a small forest of trees" },
  { key: "water-cycle", prompt: "a simple water cycle scene with sun, a cloud, rain falling, and a lake, drawn in a friendly style, no text", labels: ["Evaporation", "Condensation", "Precipitation", "Collection"] },
  // ── dinosaurs ─────────────────────────────────────────────────────────────
  { key: "t-rex", prompt: "a friendly cartoon Tyrannosaurus Rex" },
  { key: "triceratops", prompt: "a friendly triceratops with three horns" },
  { key: "stegosaurus", prompt: "a stegosaurus with back plates" },
  { key: "brachiosaurus", prompt: "a long-necked brachiosaurus" },
  { key: "dinosaur-egg", prompt: "a dinosaur egg hatching" },
  // ── the body ──────────────────────────────────────────────────────────────
  { key: "human-body", prompt: "a friendly front-facing illustration of a child's whole body, arms slightly out, no text", labels: ["Head", "Arm", "Hand", "Body", "Leg", "Foot"] },
  { key: "heart", prompt: "a simple anatomical human heart" },
  { key: "brain", prompt: "a simple friendly human brain" },
  { key: "teeth", prompt: "a smiling set of clean white teeth" },
  { key: "skeleton", prompt: "a simple friendly human skeleton" },
  // ── vehicles ──────────────────────────────────────────────────────────────
  { key: "car", prompt: "a cute little car" },
  { key: "truck", prompt: "a friendly delivery truck" },
  { key: "train", prompt: "a steam train engine" },
  { key: "airplane", prompt: "a flying airplane" },
  { key: "boat", prompt: "a small sailboat on water" },
  { key: "bicycle", prompt: "a bicycle" },
  // ── food & plants ─────────────────────────────────────────────────────────
  { key: "apple", prompt: "a shiny red apple" },
  { key: "vegetables", prompt: "a friendly group of vegetables" },
  { key: "seed-to-plant", prompt: "the stages of a seed growing into a plant, left to right, no text", labels: ["Seed", "Sprout", "Plant", "Flower"] },
  { key: "pumpkin", prompt: "an orange pumpkin" },
  { key: "corn", prompt: "an ear of corn" },
  // ── places & make-believe ─────────────────────────────────────────────────
  { key: "house", prompt: "a cozy little house" },
  { key: "castle", prompt: "a fairytale castle with towers" },
  { key: "dragon", prompt: "a friendly cartoon dragon" },
  { key: "robot", prompt: "a friendly little robot" },
  { key: "lighthouse", prompt: "a striped lighthouse by the sea" },
];

export const ILLUSTRATION_KEYS = new Set(ILLUSTRATIONS.map((i) => i.key));

export function hasIllustration(key: string | undefined): key is string {
  return !!key && ILLUSTRATION_KEYS.has(key);
}

// Grouped, comma-joined slug list handed to the model so it only picks keys that
// exist. Kept compact; the model reads slugs fine.
export const ILLUSTRATION_HINT = ILLUSTRATIONS.map((i) => i.key).join(", ");

const BY_KEY = new Map(ILLUSTRATIONS.map((i) => [i.key, i] as const));

// Real label text the renderer shows flanking a diagram illustration (e.g. the
// 8 planet names beside the solar system). Undefined for a plain illustration.
export function illustrationLabels(key: string | undefined): string[] | undefined {
  return key ? BY_KEY.get(key)?.labels : undefined;
}
