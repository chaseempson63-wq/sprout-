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

  // ── batch 2: wider coverage ─────────────────────────────────────────────────
  // more land animals
  { key: "koala", prompt: "a cute koala hugging a tree branch" },
  { key: "hippo", prompt: "a friendly chubby hippo" },
  { key: "rhino", prompt: "a friendly rhinoceros with one horn" },
  { key: "crocodile", prompt: "a friendly green crocodile" },
  { key: "snake", prompt: "a friendly curled-up snake" },
  { key: "lizard", prompt: "a small green lizard" },
  { key: "chameleon", prompt: "a colorful chameleon on a branch" },
  { key: "tortoise", prompt: "a friendly land tortoise" },
  { key: "squirrel", prompt: "a cute squirrel holding an acorn" },
  { key: "raccoon", prompt: "a friendly raccoon" },
  { key: "otter", prompt: "a playful otter floating on its back" },
  { key: "seal", prompt: "a cute seal" },
  { key: "polar-bear", prompt: "a friendly white polar bear" },
  { key: "cheetah", prompt: "a friendly spotted cheetah" },
  { key: "leopard", prompt: "a friendly spotted leopard" },
  { key: "gorilla", prompt: "a friendly gorilla" },
  { key: "sloth", prompt: "a slow smiling sloth hanging from a branch" },
  { key: "bat", prompt: "a cute little bat" },
  { key: "llama", prompt: "a fluffy friendly llama" },
  { key: "camel", prompt: "a friendly camel with two humps" },
  { key: "goat", prompt: "a friendly goat" },
  { key: "donkey", prompt: "a friendly grey donkey" },
  { key: "duck", prompt: "a yellow duck" },
  { key: "chicken", prompt: "a friendly hen chicken" },
  { key: "flamingo", prompt: "a pink flamingo standing on one leg" },
  { key: "peacock", prompt: "a peacock with its colorful tail fanned out" },
  { key: "swan", prompt: "a graceful white swan" },
  // more ocean
  { key: "clownfish", prompt: "an orange and white clownfish" },
  { key: "pufferfish", prompt: "a round spiky pufferfish" },
  { key: "lobster", prompt: "a red lobster with big claws" },
  { key: "stingray", prompt: "a friendly stingray gliding" },
  { key: "narwhal", prompt: "a narwhal with its long tusk" },
  { key: "walrus", prompt: "a friendly walrus with tusks" },
  { key: "coral-reef", prompt: "a colorful coral reef with fish" },
  // more bugs
  { key: "caterpillar", prompt: "a cute green caterpillar" },
  { key: "dragonfly", prompt: "a colorful dragonfly" },
  { key: "grasshopper", prompt: "a green grasshopper" },
  { key: "snail", prompt: "a cute snail with a spiral shell" },
  { key: "worm", prompt: "a friendly smiling earthworm" },
  // science & nature
  { key: "tornado", prompt: "a swirling tornado" },
  { key: "lightning", prompt: "a lightning bolt from a storm cloud" },
  { key: "waterfall", prompt: "a waterfall flowing into a pool" },
  { key: "iceberg", prompt: "an iceberg floating in the sea, showing the ice below the water" },
  { key: "glacier", prompt: "a snowy glacier" },
  { key: "cave", prompt: "a cave entrance with stalactites" },
  { key: "island", prompt: "a small tropical island with a palm tree" },
  { key: "magnet", prompt: "a red horseshoe magnet" },
  { key: "telescope", prompt: "a telescope pointing at the sky" },
  { key: "microscope", prompt: "a microscope" },
  { key: "thermometer", prompt: "a thermometer" },
  { key: "compass", prompt: "a compass showing north" },
  { key: "atom", prompt: "a simple atom with a nucleus and orbiting electrons" },
  { key: "fossil", prompt: "a dinosaur fossil in a rock" },
  { key: "germ", prompt: "a friendly cartoon germ" },
  // plants
  { key: "cactus", prompt: "a friendly cactus in a pot" },
  { key: "mushroom", prompt: "a red and white spotted mushroom" },
  { key: "sunflower", prompt: "a tall sunflower" },
  { key: "rose", prompt: "a single red rose" },
  { key: "palm-tree", prompt: "a palm tree" },
  { key: "pine-tree", prompt: "a green pine tree" },
  { key: "acorn", prompt: "an acorn" },
  { key: "fern", prompt: "a green fern" },
  { key: "flower-parts", prompt: "a single flower with its roots, stem, a leaf and petals all visible from the side", labels: ["Petal", "Stem", "Leaf", "Root"] },
  { key: "tree-parts", prompt: "a tree showing its roots underground, trunk, branches and leaves", labels: ["Leaves", "Branch", "Trunk", "Roots"] },
  // life cycles (labeled)
  { key: "butterfly-life-cycle", prompt: "the four stages of a butterfly life cycle in a row: an egg, a caterpillar, a chrysalis, and a butterfly", labels: ["Egg", "Caterpillar", "Chrysalis", "Butterfly"] },
  { key: "frog-life-cycle", prompt: "the four stages of a frog life cycle in a row: an egg, a tadpole, a froglet, and a frog", labels: ["Egg", "Tadpole", "Froglet", "Frog"] },
  // food
  { key: "pizza", prompt: "a slice of pizza" },
  { key: "cake", prompt: "a birthday cake with candles" },
  { key: "ice-cream", prompt: "an ice cream cone" },
  { key: "egg", prompt: "a cracked egg" },
  { key: "banana", prompt: "a ripe banana" },
  { key: "orange-fruit", prompt: "an orange fruit" },
  { key: "grapes", prompt: "a bunch of purple grapes" },
  { key: "watermelon", prompt: "a slice of watermelon" },
  { key: "carrot", prompt: "an orange carrot with green leafy top" },
  { key: "strawberry", prompt: "a red strawberry" },
  // body
  { key: "lungs", prompt: "a simple pair of human lungs" },
  { key: "eye", prompt: "a simple human eye" },
  { key: "ear", prompt: "a simple human ear" },
  { key: "tooth", prompt: "a single clean white tooth" },
  // history & places
  { key: "pyramid", prompt: "the great pyramids of Egypt with a desert sun" },
  { key: "knight", prompt: "a friendly knight in armor" },
  { key: "crown", prompt: "a golden crown with jewels" },
  { key: "pirate-ship", prompt: "a pirate ship sailing on the sea" },
  { key: "treasure-chest", prompt: "an open treasure chest full of gold coins" },
  { key: "igloo", prompt: "a snow igloo" },
  { key: "windmill", prompt: "a windmill" },
  { key: "mummy", prompt: "a friendly cartoon Egyptian mummy" },
  // vehicles & machines
  { key: "helicopter", prompt: "a helicopter" },
  { key: "submarine", prompt: "a yellow submarine underwater" },
  { key: "hot-air-balloon", prompt: "a colorful hot air balloon" },
  { key: "tractor", prompt: "a red farm tractor" },
  { key: "fire-truck", prompt: "a red fire truck" },
  { key: "school-bus", prompt: "a yellow school bus" },
  { key: "ambulance", prompt: "a white ambulance" },
  { key: "digger", prompt: "a yellow digger excavator" },
  // people & jobs
  { key: "doctor", prompt: "a friendly doctor in a white coat" },
  { key: "teacher", prompt: "a friendly teacher by a chalkboard" },
  { key: "firefighter", prompt: "a friendly firefighter in a helmet" },
  { key: "farmer", prompt: "a friendly farmer in a straw hat" },
  { key: "chef", prompt: "a friendly chef in a chef's hat" },
  // music, art & objects
  { key: "guitar", prompt: "an acoustic guitar" },
  { key: "piano", prompt: "a grand piano" },
  { key: "drum", prompt: "a colorful drum" },
  { key: "violin", prompt: "a violin" },
  { key: "paintbrush", prompt: "a paintbrush with colorful paint" },
  { key: "books", prompt: "a stack of colorful books" },
  { key: "clock", prompt: "a round wall clock" },
  { key: "kite", prompt: "a colorful diamond kite with a tail" },
  { key: "balloon", prompt: "a single red balloon" },
  { key: "teddy-bear", prompt: "a cuddly brown teddy bear" },

  // ── batch 3: gap fill (2026-07-15, flux-2-pro) ──────────────────────────────
  // AU/NZ animals
  { key: "kiwi-bird", prompt: "a cute round kiwi bird with a long beak" },
  { key: "kookaburra", prompt: "a friendly kookaburra perched on a branch" },
  { key: "wombat", prompt: "a chubby friendly wombat" },
  { key: "platypus", prompt: "a friendly platypus with a duck bill" },
  { key: "echidna", prompt: "a cute spiky echidna" },
  { key: "emu", prompt: "a tall friendly emu" },
  { key: "tasmanian-devil", prompt: "a friendly cartoon Tasmanian devil" },
  { key: "cockatoo", prompt: "a white cockatoo with a yellow crest" },
  // more world animals
  { key: "wolf", prompt: "a friendly grey wolf" },
  { key: "moose", prompt: "a friendly moose with big antlers" },
  { key: "beaver", prompt: "a busy beaver holding a stick" },
  { key: "skunk", prompt: "a cute skunk with a fluffy striped tail" },
  { key: "meerkat", prompt: "a meerkat standing up on lookout" },
  { key: "orca", prompt: "a friendly black and white orca whale" },
  { key: "hammerhead-shark", prompt: "a friendly cartoon hammerhead shark" },
  { key: "axolotl", prompt: "a cute pink axolotl with frilly gills" },
  { key: "goldfish", prompt: "a shiny orange goldfish" },
  { key: "hamster", prompt: "a chubby cute hamster" },
  { key: "guinea-pig", prompt: "a fluffy friendly guinea pig" },
  { key: "mouse", prompt: "a tiny cute mouse" },
  { key: "hermit-crab", prompt: "a hermit crab in a spiral shell" },
  { key: "scorpion", prompt: "a friendly cartoon scorpion" },
  // more birds
  { key: "ostrich", prompt: "a tall friendly ostrich" },
  { key: "toucan", prompt: "a toucan with a big colorful beak" },
  { key: "hummingbird", prompt: "a tiny hummingbird hovering by a flower" },
  { key: "woodpecker", prompt: "a woodpecker on a tree trunk" },
  { key: "puffin", prompt: "a cute puffin with a colorful beak" },
  { key: "pelican", prompt: "a friendly pelican with a big beak pouch" },
  { key: "rooster", prompt: "a proud colorful rooster" },
  { key: "goose", prompt: "a friendly white goose" },
  // more insects & small creatures
  { key: "moth", prompt: "a soft friendly moth with patterned wings" },
  { key: "firefly", prompt: "a cute firefly with a glowing tail" },
  { key: "praying-mantis", prompt: "a friendly green praying mantis" },
  { key: "stick-insect", prompt: "a friendly stick insect on a twig" },
  // more space
  { key: "mars", prompt: "the red planet Mars" },
  { key: "jupiter", prompt: "the planet Jupiter with its great red spot and swirling bands" },
  { key: "moon-phases", prompt: "the five phases of the moon in a horizontal row on a dark night sky, each clearly different: a completely dark circle, a thin crescent moon, a half moon lit on one side, a gibbous moon nearly full, and a bright full moon", labels: ["New Moon", "Crescent", "Half Moon", "Gibbous", "Full Moon"] },
  { key: "space-station", prompt: "a space station with solar panels orbiting above Earth" },
  { key: "satellite", prompt: "a small satellite with solar panel wings in space" },
  { key: "meteor", prompt: "a glowing meteor streaking through the sky" },
  { key: "galaxy", prompt: "a colorful spiral galaxy full of stars" },
  { key: "alien", prompt: "a cute friendly green alien waving hello" },
  // more science & STEM
  { key: "dna", prompt: "a colorful DNA double helix" },
  { key: "cell", prompt: "a simple friendly animal cell with its round nucleus visible inside", labels: ["Membrane", "Nucleus", "Cytoplasm"] },
  { key: "light-bulb", prompt: "a glowing light bulb" },
  { key: "battery", prompt: "a simple battery" },
  { key: "circuit", prompt: "a simple electric circuit with a battery, wires and a small glowing bulb" },
  { key: "gears", prompt: "three colorful interlocking gears" },
  { key: "pulley", prompt: "a simple pulley lifting a small crate on a rope" },
  { key: "prism", prompt: "a glass prism splitting white light into a rainbow" },
  { key: "earth-layers", prompt: "a cutaway view of planet Earth showing its layers down to the glowing core", labels: ["Crust", "Mantle", "Outer Core", "Inner Core"] },
  { key: "crystal", prompt: "a cluster of sparkling purple crystals" },
  { key: "solar-panel", prompt: "a solar panel in the sun" },
  { key: "wind-turbine", prompt: "a tall white wind turbine on a green hill" },
  // more human body & health
  { key: "stomach", prompt: "a simple friendly human stomach" },
  { key: "muscles", prompt: "a friendly flexed arm showing the muscle" },
  { key: "hand", prompt: "a friendly open human hand" },
  { key: "food-plate", prompt: "a healthy eating plate divided into sections of fruit, vegetables, grains, protein and dairy, seen from above", labels: ["Fruit", "Vegetables", "Grains", "Protein", "Dairy"] },
  { key: "toothbrush", prompt: "a toothbrush with a stripe of toothpaste" },
  { key: "soap", prompt: "a bar of soap with bubbles" },
  // more food
  { key: "bread", prompt: "a loaf of bread with a slice cut" },
  { key: "cheese", prompt: "a wedge of yellow cheese with holes" },
  { key: "milk", prompt: "a glass of milk" },
  { key: "sandwich", prompt: "a tasty sandwich" },
  { key: "cookie", prompt: "a chocolate chip cookie" },
  { key: "honey", prompt: "a honey jar with a wooden dipper" },
  { key: "pineapple", prompt: "a pineapple" },
  { key: "lemon", prompt: "a bright yellow lemon" },
  { key: "broccoli", prompt: "a piece of green broccoli" },
  { key: "tomato", prompt: "a red tomato" },
  // more vehicles
  { key: "police-car", prompt: "a friendly police car" },
  { key: "garbage-truck", prompt: "a friendly garbage truck" },
  { key: "cement-mixer", prompt: "a cement mixer truck with a spinning drum" },
  { key: "motorcycle", prompt: "a small friendly motorcycle" },
  { key: "race-car", prompt: "a speedy red race car" },
  { key: "canoe", prompt: "a canoe with a paddle on calm water" },
  { key: "scooter", prompt: "a kick scooter" },
  // more occupations
  { key: "police-officer", prompt: "a friendly police officer in uniform" },
  { key: "nurse", prompt: "a friendly nurse in scrubs" },
  { key: "dentist", prompt: "a friendly dentist holding a small mirror tool" },
  { key: "vet", prompt: "a friendly veterinarian holding a puppy" },
  { key: "pilot", prompt: "a friendly pilot in a captain's hat" },
  { key: "scientist", prompt: "a friendly scientist in a lab coat holding a beaker" },
  // sports
  { key: "soccer-ball", prompt: "a classic black and white soccer ball" },
  { key: "basketball", prompt: "an orange basketball" },
  { key: "rugby-ball", prompt: "a rugby ball" },
  { key: "cricket-bat", prompt: "a cricket bat and ball" },
  { key: "trophy", prompt: "a shiny golden trophy cup" },
  { key: "medal", prompt: "a gold medal on a ribbon" },
  // make-believe
  { key: "unicorn", prompt: "a friendly white unicorn with a rainbow mane" },
  { key: "mermaid", prompt: "a friendly mermaid with a shiny tail" },
  { key: "fairy", prompt: "a small friendly fairy with sparkly wings" },
  { key: "wizard", prompt: "a friendly wizard with a starry hat and wand" },
  { key: "superhero", prompt: "a friendly kid superhero with a cape" },
  // music & school
  { key: "trumpet", prompt: "a golden trumpet" },
  { key: "flute", prompt: "a silver flute" },
  { key: "xylophone", prompt: "a colorful toy xylophone with mallets" },
  { key: "ukulele", prompt: "a small ukulele" },
  { key: "abacus", prompt: "a colorful counting abacus" },
  { key: "pencil", prompt: "a yellow pencil" },
  // everyday & outdoors
  { key: "snowman", prompt: "a happy snowman with a carrot nose and scarf" },
  { key: "campfire", prompt: "a cozy campfire with logs" },
  { key: "tent", prompt: "a camping tent" },
  { key: "umbrella", prompt: "an open colorful umbrella" },
  { key: "scarecrow", prompt: "a friendly scarecrow in a field" },
  { key: "beach", prompt: "a sunny beach with a bucket and spade in the sand" },
  // life cycles & diagrams
  { key: "chicken-life-cycle", prompt: "the three stages of a chicken life cycle in a row: an egg, a fluffy yellow chick, and a hen", labels: ["Egg", "Chick", "Hen"] },
  { key: "ladybug-life-cycle", prompt: "the four stages of a ladybug life cycle in a row: eggs, a larva, a pupa, and a spotted ladybug", labels: ["Egg", "Larva", "Pupa", "Ladybug"] },
  { key: "four-seasons", prompt: "exactly four separate trees standing in a horizontal row with clear gaps between them, one tree per season: the first covered in pink blossoms, the second with full green leaves, the third with orange autumn leaves falling, the fourth bare with snow on its branches", labels: ["Spring", "Summer", "Autumn", "Winter"] },
  { key: "day-and-night", prompt: "a split picture of the same little house, daytime with a bright sun on the left half and nighttime with the moon and stars on the right half", labels: ["Day", "Night"] },
];

export const ILLUSTRATION_KEYS = new Set(ILLUSTRATIONS.map((i) => i.key));

export function hasIllustration(key: string | undefined): key is string {
  return !!key && ILLUSTRATION_KEYS.has(key);
}

// Grouped, comma-joined slug list handed to the model so it only picks keys that
// exist. Kept compact; the model reads slugs fine.
export const ILLUSTRATION_HINT = ILLUSTRATIONS.map((i) => i.key).join(", ");

// Longest key first so multi-word topics ("sea-turtle", "solar-system") win over
// a contained single word.
const KEYS_BY_LEN = [...ILLUSTRATION_KEYS].sort((a, b) => b.length - a.length);

// Best-effort topic -> illustration key from free text (the sheet title + the
// parent's prompt). Word-boundary match so "cat" never hits "education"; tolerant
// of simple plurals ("lions" -> lion, "sheep" -> sheep). Used as a deterministic
// fallback when the model forgets to pick an image from the long list even though
// one genuinely exists for the topic.
export function pickIllustrationFor(text: string): string | undefined {
  const t = ` ${text.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ")} `;
  for (const key of KEYS_BY_LEN) {
    const p = key.replace(/-/g, " ");
    if (t.includes(` ${p} `) || t.includes(` ${p}s `) || t.includes(` ${p}es `) || (p.endsWith("s") && t.includes(` ${p.slice(0, -1)} `))) {
      return key;
    }
  }
  return undefined;
}

const BY_KEY = new Map(ILLUSTRATIONS.map((i) => [i.key, i] as const));

// Real label text the renderer shows flanking a diagram illustration (e.g. the
// 8 planet names beside the solar system). Undefined for a plain illustration.
export function illustrationLabels(key: string | undefined): string[] | undefined {
  return key ? BY_KEY.get(key)?.labels : undefined;
}
