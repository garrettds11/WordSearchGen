import { useMemo, useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const SIZE_PRESETS = {
  small: { label: "Small", words: 8, grid: 12 },
  medium: { label: "Medium", words: 16, grid: 18 },
  large: { label: "Large", words: 24, grid: 24 },
};

const DIRECTIONS = [
  { dr: 0, dc: 1 },
  { dr: 1, dc: 0 },
  { dr: 1, dc: 1 },
  { dr: -1, dc: 1 },
  { dr: 0, dc: -1 },
  { dr: -1, dc: 0 },
  { dr: -1, dc: -1 },
  { dr: 1, dc: -1 },
];

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const CATEGORY_GROUPS = {
  "School & Learning": [
    "Spelling Words",
    "Science",
    "Math",
    "History",
    "Geography",
    "Literature",
    "Grammar",
    "Art",
    "Music",
    "Computer Science",
  ],
  "Nature & Animals": [
    "Animals",
    "Ocean Life",
    "Birds",
    "Insects",
    "Dinosaurs",
    "Plants",
    "Weather",
    "Space",
    "Earth Science",
    "National Parks",
  ],
  "People & Life": [
    "Family",
    "Careers",
    "Emotions",
    "Character Traits",
    "Health",
    "Sports",
    "Hobbies",
    "Food",
    "Travel",
    "Community",
  ],
  "Holidays & Events": [
    "Christmas",
    "Thanksgiving",
    "Halloween",
    "Easter",
    "Patriotic",
    "Birthday Party",
    "Wedding",
    "Baby Shower",
  ],
  "Special Interest": [
    "Bible",
    "Cybersecurity",
    "Video Games",
    "Fantasy",
    "Mythology",
    "Robotics",
    "Aviation",
    "Camping",
    "Fishing",
    "Random Mix",
  ],
};

const CATEGORY_WORDS = {
  "Spelling Words": [
    "practice",
    "phonics",
    "vowel",
    "consonant",
    "syllable",
    "prefix",
    "suffix",
    "sentence",
    "paragraph",
    "dictionary",
    "meaning",
    "context",
    "rhythm",
    "library",
    "journal",
    "reading",
    "writing",
    "teacher",
    "student",
    "lesson",
    "notebook",
    "pencil",
    "question",
    "answer",
    "grammar",
    "spelling",
    "review",
    "quiz",
  ],
  Science: [
    "atom",
    "molecule",
    "gravity",
    "energy",
    "matter",
    "liquid",
    "solid",
    "plasma",
    "magnet",
    "circuit",
    "reaction",
    "oxygen",
    "carbon",
    "hydrogen",
    "nitrogen",
    "theory",
    "lab",
    "experiment",
    "microscope",
    "telescope",
    "evidence",
    "sample",
    "data",
    "hypothesis",
    "velocity",
    "friction",
    "density",
    "pressure",
  ],
  Math: [
    "addition",
    "subtract",
    "multiply",
    "divide",
    "fraction",
    "decimal",
    "percent",
    "equation",
    "variable",
    "geometry",
    "triangle",
    "circle",
    "radius",
    "diameter",
    "algebra",
    "integer",
    "factor",
    "multiple",
    "average",
    "median",
    "mode",
    "graph",
    "slope",
    "volume",
    "area",
    "perimeter",
    "angle",
    "ratio",
  ],
  History: [
    "ancient",
    "empire",
    "colony",
    "revolution",
    "constitution",
    "treaty",
    "archive",
    "artifact",
    "timeline",
    "president",
    "kingdom",
    "dynasty",
    "explorer",
    "pioneer",
    "liberty",
    "battle",
    "museum",
    "culture",
    "citizen",
    "record",
    "source",
    "speech",
    "election",
    "migration",
    "frontier",
    "heritage",
  ],
  Geography: [
    "continent",
    "country",
    "capital",
    "river",
    "mountain",
    "valley",
    "desert",
    "island",
    "ocean",
    "harbor",
    "climate",
    "region",
    "latitude",
    "longitude",
    "equator",
    "globe",
    "map",
    "border",
    "plain",
    "plateau",
    "peninsula",
    "coast",
    "delta",
    "forest",
    "prairie",
    "territory",
  ],
  Literature: [
    "novel",
    "poem",
    "author",
    "chapter",
    "character",
    "setting",
    "conflict",
    "theme",
    "symbol",
    "plot",
    "dialogue",
    "narrator",
    "fiction",
    "nonfiction",
    "genre",
    "metaphor",
    "simile",
    "stanza",
    "prologue",
    "epilogue",
    "mystery",
    "adventure",
    "legend",
    "fable",
  ],
  Grammar: [
    "noun",
    "verb",
    "adjective",
    "adverb",
    "pronoun",
    "preposition",
    "clause",
    "phrase",
    "subject",
    "predicate",
    "comma",
    "period",
    "apostrophe",
    "quotation",
    "tense",
    "plural",
    "singular",
    "article",
    "compound",
    "modifier",
    "agreement",
    "sentence",
    "capital",
    "punctuate",
  ],
  Art: [
    "canvas",
    "palette",
    "brush",
    "sketch",
    "drawing",
    "portrait",
    "landscape",
    "sculpture",
    "ceramic",
    "pattern",
    "texture",
    "contrast",
    "shadow",
    "highlight",
    "gallery",
    "museum",
    "mosaic",
    "collage",
    "watercolor",
    "acrylic",
    "charcoal",
    "pastel",
    "design",
    "color",
  ],
  Music: [
    "melody",
    "harmony",
    "rhythm",
    "tempo",
    "chorus",
    "verse",
    "bridge",
    "guitar",
    "piano",
    "drums",
    "violin",
    "trumpet",
    "flute",
    "orchestra",
    "concert",
    "singer",
    "recording",
    "measure",
    "scale",
    "chord",
    "note",
    "staff",
    "clef",
    "bass",
  ],
  "Computer Science": [
    "algorithm",
    "function",
    "variable",
    "array",
    "object",
    "binary",
    "compile",
    "debug",
    "server",
    "client",
    "database",
    "network",
    "browser",
    "script",
    "syntax",
    "runtime",
    "cache",
    "packet",
    "storage",
    "logic",
    "loop",
    "branch",
    "module",
    "program",
  ],
  Animals: [
    "lion",
    "tiger",
    "bear",
    "zebra",
    "giraffe",
    "elephant",
    "kangaroo",
    "dolphin",
    "penguin",
    "gorilla",
    "cheetah",
    "leopard",
    "raccoon",
    "squirrel",
    "rabbit",
    "otter",
    "beaver",
    "moose",
    "bison",
    "wolf",
    "fox",
    "eagle",
    "falcon",
    "panther",
  ],
  "Ocean Life": [
    "shark",
    "whale",
    "octopus",
    "jellyfish",
    "seahorse",
    "coral",
    "turtle",
    "lobster",
    "crab",
    "shrimp",
    "starfish",
    "dolphin",
    "stingray",
    "squid",
    "clam",
    "oyster",
    "plankton",
    "kelp",
    "reef",
    "seal",
    "urchin",
    "manta",
    "marlin",
    "salmon",
  ],
  Birds: [
    "eagle",
    "falcon",
    "hawk",
    "owl",
    "sparrow",
    "robin",
    "cardinal",
    "bluejay",
    "pelican",
    "flamingo",
    "penguin",
    "ostrich",
    "parrot",
    "peacock",
    "swan",
    "goose",
    "duck",
    "turkey",
    "raven",
    "crow",
    "finch",
    "heron",
    "crane",
    "condor",
  ],
  Insects: [
    "ant",
    "bee",
    "wasp",
    "beetle",
    "butterfly",
    "moth",
    "dragonfly",
    "grasshopper",
    "cricket",
    "ladybug",
    "termite",
    "mosquito",
    "cicada",
    "mantis",
    "firefly",
    "aphid",
    "weevil",
    "flea",
    "gnat",
    "hornet",
    "larva",
    "pupa",
    "thorax",
    "antenna",
  ],
  Dinosaurs: [
    "raptor",
    "triceratops",
    "stegosaurus",
    "brontosaurus",
    "ankylosaurus",
    "allosaurus",
    "pteranodon",
    "spinosaurus",
    "iguanodon",
    "diplodocus",
    "fossil",
    "jurassic",
    "cretaceous",
    "triassic",
    "sauropod",
    "theropod",
    "herbivore",
    "carnivore",
    "extinct",
    "claw",
    "tail",
    "skull",
    "bone",
  ],
  Plants: [
    "flower",
    "root",
    "stem",
    "leaf",
    "seed",
    "pollen",
    "garden",
    "forest",
    "tree",
    "shrub",
    "vine",
    "moss",
    "fern",
    "cactus",
    "orchid",
    "rose",
    "tulip",
    "daisy",
    "bamboo",
    "maple",
    "oak",
    "pine",
    "sprout",
    "harvest",
  ],
  Weather: [
    "cloud",
    "rain",
    "storm",
    "thunder",
    "lightning",
    "tornado",
    "hurricane",
    "snow",
    "sleet",
    "hail",
    "fog",
    "wind",
    "breeze",
    "humidity",
    "forecast",
    "radar",
    "climate",
    "season",
    "sunshine",
    "drizzle",
    "pressure",
    "front",
    "temperature",
    "rainbow",
  ],
  Space: [
    "planet",
    "galaxy",
    "star",
    "comet",
    "asteroid",
    "meteor",
    "rocket",
    "orbit",
    "gravity",
    "nebula",
    "cosmos",
    "lunar",
    "solar",
    "eclipse",
    "telescope",
    "astronaut",
    "satellite",
    "mars",
    "venus",
    "jupiter",
    "saturn",
    "uranus",
    "neptune",
    "pluto",
  ],
  "Earth Science": [
    "volcano",
    "earthquake",
    "mineral",
    "crystal",
    "fossil",
    "magma",
    "lava",
    "erosion",
    "sediment",
    "bedrock",
    "plate",
    "mantle",
    "crust",
    "core",
    "basalt",
    "granite",
    "glacier",
    "canyon",
    "delta",
    "fault",
    "geyser",
    "tsunami",
    "compass",
    "topsoil",
  ],
  "National Parks": [
    "yellowstone",
    "yosemite",
    "zion",
    "acadia",
    "everglades",
    "glacier",
    "arches",
    "sequoia",
    "badlands",
    "olympic",
    "rocky",
    "shenandoah",
    "denali",
    "bryce",
    "saguaro",
    "canyon",
    "trail",
    "ranger",
    "campground",
    "wildlife",
    "waterfall",
    "summit",
    "vista",
    "passport",
  ],
  Family: [
    "mother",
    "father",
    "sister",
    "brother",
    "grandma",
    "grandpa",
    "cousin",
    "uncle",
    "aunt",
    "parent",
    "child",
    "home",
    "dinner",
    "story",
    "memory",
    "holiday",
    "birthday",
    "support",
    "kindness",
    "family",
    "together",
    "tradition",
    "neighbor",
    "friend",
  ],
  Careers: [
    "doctor",
    "nurse",
    "teacher",
    "engineer",
    "firefighter",
    "pilot",
    "chef",
    "artist",
    "writer",
    "lawyer",
    "analyst",
    "mechanic",
    "farmer",
    "scientist",
    "designer",
    "accountant",
    "developer",
    "manager",
    "plumber",
    "electrician",
    "carpenter",
    "soldier",
    "dentist",
    "architect",
  ],
  Emotions: [
    "happy",
    "sad",
    "angry",
    "calm",
    "brave",
    "worried",
    "excited",
    "lonely",
    "proud",
    "grateful",
    "hopeful",
    "curious",
    "peaceful",
    "nervous",
    "joyful",
    "gentle",
    "patient",
    "cheerful",
    "surprised",
    "confident",
    "thoughtful",
    "thankful",
    "amazed",
    "focused",
  ],
  "Character Traits": [
    "honesty",
    "courage",
    "respect",
    "patience",
    "kindness",
    "wisdom",
    "loyalty",
    "service",
    "humility",
    "diligence",
    "integrity",
    "mercy",
    "justice",
    "gratitude",
    "discipline",
    "generosity",
    "faithful",
    "truthful",
    "reliable",
    "helpful",
    "modest",
    "steady",
    "gentle",
    "brave",
  ],
  Health: [
    "fitness",
    "exercise",
    "nutrition",
    "protein",
    "vitamin",
    "hydration",
    "sleep",
    "doctor",
    "dental",
    "vision",
    "balance",
    "wellness",
    "strength",
    "stretch",
    "running",
    "walking",
    "immune",
    "muscle",
    "heart",
    "breath",
    "clinic",
    "medicine",
    "therapy",
    "recovery",
  ],
  Sports: [
    "football",
    "baseball",
    "basketball",
    "soccer",
    "tennis",
    "golf",
    "hockey",
    "swimming",
    "running",
    "cycling",
    "wrestling",
    "boxing",
    "volleyball",
    "softball",
    "lacrosse",
    "track",
    "coach",
    "score",
    "team",
    "defense",
    "offense",
    "goal",
    "trophy",
    "stadium",
  ],
  Hobbies: [
    "painting",
    "reading",
    "writing",
    "gaming",
    "cooking",
    "baking",
    "fishing",
    "hiking",
    "camping",
    "sewing",
    "knitting",
    "gardening",
    "photography",
    "collecting",
    "dancing",
    "singing",
    "woodwork",
    "puzzle",
    "crafting",
    "drawing",
    "running",
    "cycling",
    "birding",
    "journaling",
  ],
  Food: [
    "apple",
    "banana",
    "orange",
    "grape",
    "bread",
    "cheese",
    "chicken",
    "pasta",
    "pizza",
    "salad",
    "soup",
    "beans",
    "rice",
    "carrot",
    "potato",
    "tomato",
    "pepper",
    "onion",
    "garlic",
    "cookie",
    "muffin",
    "waffle",
    "taco",
    "sandwich",
  ],
  Travel: [
    "airport",
    "ticket",
    "luggage",
    "passport",
    "hotel",
    "resort",
    "cruise",
    "beach",
    "mountain",
    "museum",
    "tour",
    "guide",
    "map",
    "train",
    "flight",
    "journey",
    "vacation",
    "souvenir",
    "camera",
    "highway",
    "bridge",
    "harbor",
    "island",
    "adventure",
  ],
  Community: [
    "neighbor",
    "library",
    "school",
    "church",
    "market",
    "park",
    "clinic",
    "shelter",
    "service",
    "volunteer",
    "donation",
    "festival",
    "council",
    "police",
    "firehouse",
    "street",
    "garden",
    "meeting",
    "teamwork",
    "kindness",
    "cleanup",
    "support",
    "local",
    "public",
  ],
  Christmas: [
    "manger",
    "angel",
    "star",
    "carol",
    "nativity",
    "shepherd",
    "wisemen",
    "gift",
    "tree",
    "ornament",
    "wreath",
    "candle",
    "snowman",
    "stocking",
    "cookie",
    "cocoa",
    "family",
    "joy",
    "peace",
    "hope",
    "bells",
    "holly",
    "ribbon",
    "winter",
  ],
  Thanksgiving: [
    "turkey",
    "gravy",
    "stuffing",
    "harvest",
    "family",
    "thanks",
    "gratitude",
    "pumpkin",
    "cranberry",
    "potato",
    "cornbread",
    "feast",
    "blessing",
    "autumn",
    "parade",
    "table",
    "pilgrim",
    "native",
    "pie",
    "squash",
    "cider",
    "gather",
    "memory",
    "platter",
  ],
  Halloween: [
    "pumpkin",
    "costume",
    "candy",
    "ghost",
    "witch",
    "spider",
    "monster",
    "bat",
    "skeleton",
    "lantern",
    "mask",
    "haunted",
    "broom",
    "shadow",
    "treat",
    "orange",
    "black",
    "moon",
    "cobweb",
    "goblin",
    "vampire",
    "zombie",
    "cauldron",
    "midnight",
  ],
  Easter: [
    "resurrection",
    "sunday",
    "emptytomb",
    "garden",
    "cross",
    "hope",
    "spring",
    "lily",
    "basket",
    "egg",
    "bunny",
    "chick",
    "flower",
    "sunrise",
    "worship",
    "joy",
    "grace",
    "promise",
    "family",
    "celebrate",
    "pastel",
    "meadow",
    "renewal",
    "peace",
  ],
  Patriotic: [
    "flag",
    "liberty",
    "freedom",
    "country",
    "eagle",
    "justice",
    "union",
    "states",
    "capital",
    "anthem",
    "parade",
    "fireworks",
    "veteran",
    "service",
    "honor",
    "citizen",
    "republic",
    "history",
    "vote",
    "patriot",
    "banner",
    "memorial",
    "courage",
    "pledge",
  ],
  "Birthday Party": [
    "balloon",
    "cake",
    "candle",
    "present",
    "party",
    "music",
    "games",
    "friends",
    "family",
    "confetti",
    "ribbon",
    "invite",
    "surprise",
    "wish",
    "cupcake",
    "laughter",
    "photo",
    "decor",
    "snack",
    "favor",
    "celebrate",
    "birthday",
    "cheer",
    "smile",
  ],
  Wedding: [
    "bride",
    "groom",
    "vows",
    "rings",
    "bouquet",
    "flower",
    "ceremony",
    "reception",
    "music",
    "dance",
    "cake",
    "dress",
    "tuxedo",
    "family",
    "guest",
    "invite",
    "promise",
    "unity",
    "toast",
    "photo",
    "veil",
    "aisle",
    "chapel",
    "celebrate",
  ],
  "Baby Shower": [
    "baby",
    "blanket",
    "bottle",
    "diaper",
    "stroller",
    "crib",
    "rattle",
    "onesie",
    "pacifier",
    "family",
    "gift",
    "shower",
    "nursery",
    "lullaby",
    "storybook",
    "tiny",
    "cuddle",
    "parent",
    "welcome",
    "bundle",
    "smile",
    "balloon",
    "basket",
    "joy",
  ],
  Bible: [
    "genesis",
    "exodus",
    "psalms",
    "proverbs",
    "gospel",
    "apostle",
    "disciple",
    "parable",
    "covenant",
    "prophet",
    "temple",
    "altar",
    "prayer",
    "grace",
    "mercy",
    "faith",
    "hope",
    "love",
    "wisdom",
    "righteous",
    "kingdom",
    "shepherd",
    "salvation",
    "scripture",
  ],
  Cybersecurity: [
    "firewall",
    "malware",
    "phishing",
    "encryption",
    "password",
    "patching",
    "ransomware",
    "endpoint",
    "network",
    "packet",
    "forensics",
    "incident",
    "triage",
    "threat",
    "vulnerability",
    "exploit",
    "payload",
    "sandbox",
    "hash",
    "indicator",
    "siem",
    "alert",
    "zero trust",
    "authenticator",
  ],
  "Video Games": [
    "avatar",
    "quest",
    "level",
    "boss",
    "controller",
    "console",
    "arcade",
    "pixel",
    "score",
    "health",
    "shield",
    "powerup",
    "inventory",
    "crafting",
    "mission",
    "checkpoint",
    "multiplayer",
    "sandbox",
    "speedrun",
    "joystick",
    "keyboard",
    "strategy",
    "portal",
    "victory",
  ],
  Fantasy: [
    "dragon",
    "wizard",
    "castle",
    "kingdom",
    "sword",
    "shield",
    "quest",
    "magic",
    "potion",
    "goblin",
    "elf",
    "dwarf",
    "griffin",
    "phoenix",
    "ranger",
    "knight",
    "oracle",
    "riddle",
    "forest",
    "tower",
    "cavern",
    "treasure",
    "scroll",
    "legend",
  ],
  Mythology: [
    "zeus",
    "hera",
    "apollo",
    "athena",
    "ares",
    "hermes",
    "poseidon",
    "hades",
    "odin",
    "thor",
    "loki",
    "freya",
    "mercury",
    "venus",
    "mars",
    "jupiter",
    "neptune",
    "phoenix",
    "titan",
    "oracle",
    "nymph",
    "sphinx",
    "hero",
    "legend",
  ],
  Robotics: [
    "robot",
    "sensor",
    "motor",
    "servo",
    "circuit",
    "battery",
    "program",
    "code",
    "logic",
    "automation",
    "machine",
    "camera",
    "wheel",
    "gripper",
    "drone",
    "android",
    "algorithm",
    "input",
    "output",
    "signal",
    "calibrate",
    "prototype",
    "controller",
    "navigation",
  ],
  Aviation: [
    "aircraft",
    "runway",
    "hangar",
    "pilot",
    "altitude",
    "airspeed",
    "heading",
    "compass",
    "flaps",
    "rudder",
    "aileron",
    "elevator",
    "engine",
    "propeller",
    "weather",
    "tower",
    "traffic",
    "landing",
    "takeoff",
    "taxiway",
    "airport",
    "briefing",
    "checklist",
    "squawk",
  ],
  Camping: [
    "tent",
    "campfire",
    "lantern",
    "trail",
    "backpack",
    "compass",
    "map",
    "forest",
    "campsite",
    "sleepingbag",
    "hammock",
    "canteen",
    "wildlife",
    "firewood",
    "marshmallow",
    "hiking",
    "boots",
    "river",
    "mountain",
    "stars",
    "sunrise",
    "shelter",
    "cooler",
    "gear",
  ],
  Fishing: [
    "angler",
    "bait",
    "lure",
    "hook",
    "line",
    "reel",
    "rod",
    "tackle",
    "bass",
    "catfish",
    "trout",
    "salmon",
    "perch",
    "crappie",
    "casting",
    "bobber",
    "sinkers",
    "net",
    "boat",
    "dock",
    "lake",
    "river",
    "creek",
    "waders",
  ],
};

const THEMES = {
  "Classic Classroom": {
    bg: "linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%)",
    panel: "rgba(255,255,255,0.88)",
    panelStrong: "#ffffff",
    text: "#0f172a",
    muted: "#475569",
    border: "rgba(15,23,42,0.14)",
    accent: "#2563eb",
    accentText: "#ffffff",
    cell: "rgba(255,255,255,0.78)",
    found: "rgba(34, 197, 94, 0.36)",
    answer: "rgba(249, 115, 22, 0.38)",
    select: "rgba(37, 99, 235, 0.28)",
  },
  "Kids Bright": {
    bg: "linear-gradient(135deg, #fff7ad 0%, #fecdd3 50%, #bfdbfe 100%)",
    panel: "rgba(255,255,255,0.82)",
    panelStrong: "#ffffff",
    text: "#312e81",
    muted: "#6d28d9",
    border: "rgba(109,40,217,0.18)",
    accent: "#db2777",
    accentText: "#ffffff",
    cell: "rgba(255,255,255,0.72)",
    found: "rgba(132, 204, 22, 0.40)",
    answer: "rgba(14, 165, 233, 0.38)",
    select: "rgba(219, 39, 119, 0.25)",
  },
  "Dark Mode": {
    bg: "linear-gradient(135deg, #020617 0%, #111827 55%, #0f172a 100%)",
    panel: "rgba(15,23,42,0.82)",
    panelStrong: "#111827",
    text: "#f8fafc",
    muted: "#cbd5e1",
    border: "rgba(148,163,184,0.22)",
    accent: "#38bdf8",
    accentText: "#082f49",
    cell: "rgba(30,41,59,0.82)",
    found: "rgba(34, 197, 94, 0.34)",
    answer: "rgba(251, 191, 36, 0.34)",
    select: "rgba(56, 189, 248, 0.28)",
  },
  "Cyber Lab": {
    bg: "radial-gradient(circle at top left, #0f766e 0%, #020617 42%, #000000 100%)",
    panel: "rgba(2,6,23,0.78)",
    panelStrong: "#020617",
    text: "#ecfeff",
    muted: "#99f6e4",
    border: "rgba(45,212,191,0.24)",
    accent: "#22d3ee",
    accentText: "#062d35",
    cell: "rgba(8,47,73,0.64)",
    found: "rgba(52, 211, 153, 0.36)",
    answer: "rgba(244, 114, 182, 0.37)",
    select: "rgba(34, 211, 238, 0.28)",
  },
  Nature: {
    bg: "linear-gradient(135deg, #ecfccb 0%, #bbf7d0 55%, #bfdbfe 100%)",
    panel: "rgba(255,255,255,0.78)",
    panelStrong: "#ffffff",
    text: "#14532d",
    muted: "#166534",
    border: "rgba(21,128,61,0.18)",
    accent: "#16a34a",
    accentText: "#ffffff",
    cell: "rgba(255,255,255,0.7)",
    found: "rgba(34, 197, 94, 0.38)",
    answer: "rgba(234, 88, 12, 0.35)",
    select: "rgba(22, 163, 74, 0.26)",
  },
  Pastel: {
    bg: "linear-gradient(135deg, #fce7f3 0%, #e9d5ff 50%, #dbeafe 100%)",
    panel: "rgba(255,255,255,0.76)",
    panelStrong: "#ffffff",
    text: "#581c87",
    muted: "#7e22ce",
    border: "rgba(126,34,206,0.16)",
    accent: "#a855f7",
    accentText: "#ffffff",
    cell: "rgba(255,255,255,0.72)",
    found: "rgba(45, 212, 191, 0.35)",
    answer: "rgba(244, 114, 182, 0.35)",
    select: "rgba(168, 85, 247, 0.26)",
  },
  Holiday: {
    bg: "linear-gradient(135deg, #064e3b 0%, #7f1d1d 100%)",
    panel: "rgba(255,255,255,0.86)",
    panelStrong: "#ffffff",
    text: "#14532d",
    muted: "#7f1d1d",
    border: "rgba(127,29,29,0.18)",
    accent: "#b91c1c",
    accentText: "#ffffff",
    cell: "rgba(255,255,255,0.76)",
    found: "rgba(34, 197, 94, 0.34)",
    answer: "rgba(220, 38, 38, 0.30)",
    select: "rgba(185, 28, 28, 0.24)",
  },
  "Minimal Ink": {
    bg: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
    panel: "rgba(255,255,255,0.96)",
    panelStrong: "#ffffff",
    text: "#111827",
    muted: "#4b5563",
    border: "rgba(17,24,39,0.18)",
    accent: "#111827",
    accentText: "#ffffff",
    cell: "rgba(255,255,255,1)",
    found: "rgba(31, 41, 55, 0.22)",
    answer: "rgba(107, 114, 128, 0.20)",
    select: "rgba(17, 24, 39, 0.18)",
  },
  "High Contrast": {
    bg: "#000000",
    panel: "#000000",
    panelStrong: "#000000",
    text: "#ffffff",
    muted: "#facc15",
    border: "#ffffff",
    accent: "#facc15",
    accentText: "#000000",
    cell: "#000000",
    found: "rgba(250, 204, 21, 0.45)",
    answer: "rgba(59, 130, 246, 0.44)",
    select: "rgba(255, 255, 255, 0.26)",
  },
  "Retro Arcade": {
    bg: "radial-gradient(circle at top, #312e81 0%, #111827 52%, #020617 100%)",
    panel: "rgba(15,23,42,0.82)",
    panelStrong: "#111827",
    text: "#fef3c7",
    muted: "#f0abfc",
    border: "rgba(240,171,252,0.24)",
    accent: "#f0abfc",
    accentText: "#312e81",
    cell: "rgba(49,46,129,0.56)",
    found: "rgba(34, 197, 94, 0.36)",
    answer: "rgba(251, 146, 60, 0.38)",
    select: "rgba(240, 171, 252, 0.28)",
  },
  Ocean: {
    bg: "linear-gradient(135deg, #cffafe 0%, #38bdf8 52%, #075985 100%)",
    panel: "rgba(255,255,255,0.82)",
    panelStrong: "#ffffff",
    text: "#083344",
    muted: "#155e75",
    border: "rgba(21,94,117,0.2)",
    accent: "#0891b2",
    accentText: "#ffffff",
    cell: "rgba(255,255,255,0.72)",
    found: "rgba(20, 184, 166, 0.34)",
    answer: "rgba(251, 113, 133, 0.35)",
    select: "rgba(8, 145, 178, 0.26)",
  },
  Autumn: {
    bg: "linear-gradient(135deg, #ffedd5 0%, #fdba74 55%, #7c2d12 100%)",
    panel: "rgba(255,255,255,0.84)",
    panelStrong: "#ffffff",
    text: "#431407",
    muted: "#9a3412",
    border: "rgba(154,52,18,0.2)",
    accent: "#ea580c",
    accentText: "#ffffff",
    cell: "rgba(255,255,255,0.74)",
    found: "rgba(132, 204, 22, 0.36)",
    answer: "rgba(124, 45, 18, 0.28)",
    select: "rgba(234, 88, 12, 0.25)",
  },
};

function randomItem(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function shuffle(list) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function normalizeWord(raw) {
  return String(raw)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, "AND")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");
}

function cleanWords(rawText, maxWords, maxLength) {
  const tokens = String(rawText)
    .split(/[\n,;|\t]+/g)
    .map((token) => token.trim())
    .filter(Boolean);

  const seen = new Set();
  const accepted = [];
  const rejected = [];

  tokens.forEach((token) => {
    const cleaned = normalizeWord(token);
    if (cleaned.length < 2) {
      rejected.push({ word: token, reason: "too short after cleanup" });
      return;
    }
    if (cleaned.length > maxLength) {
      rejected.push({ word: token, reason: `longer than ${maxLength} letters` });
      return;
    }
    if (seen.has(cleaned)) {
      rejected.push({ word: token, reason: "duplicate" });
      return;
    }
    seen.add(cleaned);
    accepted.push(cleaned);
  });

  const trimmed = accepted.slice(0, maxWords);
  const overflow = accepted.slice(maxWords).map((word) => ({
    word,
    reason: `over the ${maxWords}-word limit for this size`,
  }));

  return { words: trimmed, rejected: [...rejected, ...overflow] };
}

function wordsForCategory(category, maxWords, maxLength) {
  const allWords =
    category === "Random Mix"
      ? Object.entries(CATEGORY_WORDS)
          .filter(([key]) => key !== "Random Mix")
          .flatMap(([, words]) => words)
      : CATEGORY_WORDS[category] || CATEGORY_WORDS["Spelling Words"];

  const unique = Array.from(new Set(allWords.map(normalizeWord))).filter(
    (word) => word.length >= 2 && word.length <= maxLength
  );

  return shuffle(unique).slice(0, maxWords);
}

function createEmptyGrid(size) {
  return Array.from({ length: size }, () => Array.from({ length: size }, () => ""));
}

function canPlace(grid, word, row, col, dr, dc) {
  const size = grid.length;
  for (let i = 0; i < word.length; i += 1) {
    const r = row + dr * i;
    const c = col + dc * i;
    if (r < 0 || c < 0 || r >= size || c >= size) return false;
    if (grid[r][c] && grid[r][c] !== word[i]) return false;
  }
  return true;
}

function placeWord(grid, word, row, col, dr, dc) {
  for (let i = 0; i < word.length; i += 1) {
    grid[row + dr * i][col + dc * i] = word[i];
  }
}

function generatePuzzle(words, size) {
  const grid = createEmptyGrid(size);
  const placed = [];
  const unplaced = [];
  const sorted = [...words].sort((a, b) => b.length - a.length);

  sorted.forEach((word) => {
    let done = false;
    for (let attempt = 0; attempt < 1800 && !done; attempt += 1) {
      const direction = randomItem(DIRECTIONS);
      const row = Math.floor(Math.random() * size);
      const col = Math.floor(Math.random() * size);
      if (canPlace(grid, word, row, col, direction.dr, direction.dc)) {
        placeWord(grid, word, row, col, direction.dr, direction.dc);
        placed.push({
          word,
          start: { row, col },
          end: {
            row: row + direction.dr * (word.length - 1),
            col: col + direction.dc * (word.length - 1),
          },
          direction,
        });
        done = true;
      }
    }
    if (!done) unplaced.push(word);
  });

  for (let r = 0; r < size; r += 1) {
    for (let c = 0; c < size; c += 1) {
      if (!grid[r][c]) grid[r][c] = randomItem(LETTERS);
    }
  }

  return { grid, placed: placed.sort((a, b) => a.word.localeCompare(b.word)), unplaced };
}

function reverseText(text) {
  return text.split("").reverse().join("");
}

function getSelectionLetters(grid, start, end) {
  if (!start || !end) return null;
  const dr = end.row - start.row;
  const dc = end.col - start.col;
  const absR = Math.abs(dr);
  const absC = Math.abs(dc);
  if (!(dr === 0 || dc === 0 || absR === absC)) return null;

  const stepR = Math.sign(dr);
  const stepC = Math.sign(dc);
  const length = Math.max(absR, absC) + 1;
  let text = "";

  for (let i = 0; i < length; i += 1) {
    const r = start.row + stepR * i;
    const c = start.col + stepC * i;
    if (!grid[r] || !grid[r][c]) return null;
    text += grid[r][c];
  }

  return { text, reversed: reverseText(text), length };
}

function Button({ children, onClick, active, theme, type = "button", className = "" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`rounded-2xl px-4 py-2 text-sm font-semibold shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${className}`}
      style={{
        background: active ? theme.accent : theme.panelStrong,
        color: active ? theme.accentText : theme.text,
        border: `1px solid ${active ? theme.accent : theme.border}`,
        focusRingColor: theme.accent,
      }}
    >
      {children}
    </button>
  );
}

function FieldLabel({ children, theme }) {
  return (
    <label className="mb-2 block text-xs font-bold uppercase tracking-[0.18em]" style={{ color: theme.muted }}>
      {children}
    </label>
  );
}

function HighlightLine({ item, color, width = 0.54 }) {
  return (
    <line
      x1={item.start.col + 0.5}
      y1={item.start.row + 0.5}
      x2={item.end.col + 0.5}
      y2={item.end.row + 0.5}
      stroke={color}
      strokeWidth={width}
      strokeLinecap="round"
    />
  );
}

function PrintablePuzzlePage({
  pageRef,
  grid,
  placedWords,
  wordBank,
  showAnswerKey = false,
  answerLineColor = "rgba(59, 130, 246, 0.35)",
}) {
  if (!grid.length) return null;

  const sortedBank = [...wordBank].sort((a, b) => a.localeCompare(b));
  const gridSize = grid.length;

  const fontSize =
    gridSize <= 12 ? "24px" :
    gridSize <= 18 ? "19px" :
    "15px";

  return (
    <div
      ref={pageRef}
      className="print-page"
      style={{
        width: "816px",
        minHeight: "1056px",
        background: "#ffffff",
        color: "#111111",
        padding: "36px",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
      }}
    >
      {showAnswerKey && (
        <div
          style={{
            fontSize: "18px",
            fontWeight: 800,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          Answer Key
        </div>
      )}

      <div
        style={{
          border: "1px solid #111",
          padding: "12px",
          borderRadius: "12px",
        }}
      >
        <div
          className="relative"
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
            border: "1px solid #ddd",
            background: "#fff",
          }}
        >
          <svg
            className="pointer-events-none absolute inset-0 z-10 h-full w-full"
            viewBox={`0 0 ${gridSize} ${gridSize}`}
            preserveAspectRatio="none"
          >
            {showAnswerKey &&
              placedWords.map((item) => (
                <HighlightLine
                  key={item.word}
                  item={item}
                  color={answerLineColor}
                  width={0.54}
                />
              ))}
          </svg>

          {grid.map((row, rowIndex) =>
            row.map((letter, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                style={{
                  aspectRatio: "1 / 1",
                  border: "1px solid #ddd",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 900,
                  fontSize,
                  lineHeight: 1,
                  position: "relative",
                  zIndex: 1,
                  background: "#fff",
                }}
              >
                {letter}
              </div>
            ))
          )}
        </div>
      </div>

      <div
        style={{
          border: "1px solid #111",
          borderRadius: "12px",
          padding: "14px",
        }}
      >
        <div
          style={{
            fontSize: "14px",
            fontWeight: 800,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            marginBottom: "12px",
          }}
        >
          Word Bank
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
            gap: "8px 14px",
          }}
        >
          {sortedBank.map((word) => (
            <div
              key={word}
              style={{
                fontSize: "14px",
                fontWeight: 700,
                textAlign: "center",
                padding: "6px 8px",
                border: "1px solid #ccc",
                borderRadius: "10px",
              }}
            >
              {word}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function WordSearchGen() {
  const [mode, setMode] = useState("custom");
  const [customText, setCustomText] = useState("apple, banana, orange, grape, pear, melon, peach, berry");
  const [category, setCategory] = useState("Cybersecurity");
  const [sizeKey, setSizeKey] = useState("medium");
  const [themeName, setThemeName] = useState("Cyber Lab");
  const [themeOpen, setThemeOpen] = useState(false);
  const [showAnswerKey, setShowAnswerKey] = useState(false);
  const [showBank, setShowBank] = useState(true);
  const [alphabetizeBank, setAlphabetizeBank] = useState(true);
  const [hideFoundFromBank, setHideFoundFromBank] = useState(false);
  const [bankColumns, setBankColumns] = useState("auto");
  const [grid, setGrid] = useState([]);
  const [placedWords, setPlacedWords] = useState([]);
  const [currentWords, setCurrentWords] = useState([]);
  const [unplacedWords, setUnplacedWords] = useState([]);
  const [rejectedWords, setRejectedWords] = useState([]);
  const [foundWords, setFoundWords] = useState(new Set());
  const [selectionStart, setSelectionStart] = useState(null);
  const [selectionEnd, setSelectionEnd] = useState(null);
  const [isSelecting, setIsSelecting] = useState(false);

  const gridRef = useRef(null);
  const exportPuzzleRef = useRef(null);
  const exportAnswerRef = useRef(null);
  const sizePreset = SIZE_PRESETS[sizeKey];
  const theme = THEMES[themeName];

  const selectedLine = useMemo(() => {
    if (!selectionStart || !selectionEnd) return null;
    const result = getSelectionLetters(grid, selectionStart, selectionEnd);
    if (!result) return null;
    return {
      word: result.text,
      start: selectionStart,
      end: selectionEnd,
    };
  }, [grid, selectionStart, selectionEnd]);

  const bankWords = useMemo(() => {
    let words = placedWords.map((item) => item.word);
    if (hideFoundFromBank) words = words.filter((word) => !foundWords.has(word));
    if (alphabetizeBank) words = [...words].sort((a, b) => a.localeCompare(b));
    return words;
  }, [placedWords, foundWords, alphabetizeBank, hideFoundFromBank]);

  const foundCount = placedWords.filter((item) => foundWords.has(item.word)).length;

  function applyPuzzle(words) {
    const puzzle = generatePuzzle(words, sizePreset.grid);
    setGrid(puzzle.grid);
    setPlacedWords(puzzle.placed);
    setUnplacedWords(puzzle.unplaced);
    setCurrentWords(words);
    setFoundWords(new Set());
    setShowAnswerKey(false);
    setSelectionStart(null);
    setSelectionEnd(null);
  }

  function handleGenerate() {
    const maxWords = sizePreset.words;
    const maxLength = sizePreset.grid;

    const { words, rejected } =
      mode === "custom"
        ? cleanWords(customText, maxWords, maxLength)
        : {
            words: wordsForCategory(category, maxWords, maxLength),
            rejected: [],
          };

    setRejectedWords(rejected);

    if (words.length === 0) {
      setGrid([]);
      setPlacedWords([]);
      setCurrentWords([]);
      setUnplacedWords([]);
      setFoundWords(new Set());
      return;
    }

    applyPuzzle(words);
  }

  function handleRegenerate() {
    if (currentWords.length > 0) {
      applyPuzzle(currentWords);
      return;
    }
    handleGenerate();
  }

  function handleReset() {
    setMode("custom");
    setCustomText("");
    setCategory("Cybersecurity");
    setSizeKey("medium");
    setThemeName("Cyber Lab");
    setThemeOpen(false);
    setShowAnswerKey(false);
    setShowBank(true);
    setAlphabetizeBank(true);
    setHideFoundFromBank(false);
    setBankColumns("auto");
    setGrid([]);
    setPlacedWords([]);
    setCurrentWords([]);
    setUnplacedWords([]);
    setRejectedWords([]);
    setFoundWords(new Set());
    setSelectionStart(null);
    setSelectionEnd(null);
    setIsSelecting(false);
  }

  async function captureElement(element) {
    if (!element) return null;

    return await html2canvas(element, {
      scale: 2,
      backgroundColor: "#ffffff",
      useCORS: true,
    });
  }

  function triggerDownload(dataUrl, filename) {
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = filename;
    link.click();
  }

  async function handleDownloadPng() {
    if (!grid.length) return;

    const targets = [
      { ref: exportPuzzleRef, filename: "wordsearchgen-puzzle.png" },
      { ref: exportAnswerRef, filename: "wordsearchgen-answer-key.png" },
    ];

    for (const target of targets) {
      const canvas = await captureElement(target.ref.current);
      if (!canvas) continue;
      triggerDownload(canvas.toDataURL("image/png"), target.filename);
    }
  }

  async function handleDownloadPdf() {
    if (!grid.length) return;

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "letter",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 24;
    const usableWidth = pageWidth - margin * 2;
    const usableHeight = pageHeight - margin * 2;

    const refs = [exportPuzzleRef, exportAnswerRef];

    for (let i = 0; i < refs.length; i += 1) {
      const canvas = await captureElement(refs[i].current);
      if (!canvas) continue;

      const imgData = canvas.toDataURL("image/png");
      const ratio = Math.min(
        usableWidth / canvas.width,
        usableHeight / canvas.height
      );

      const renderWidth = canvas.width * ratio;
      const renderHeight = canvas.height * ratio;
      const x = (pageWidth - renderWidth) / 2;
      const y = margin;

      if (i > 0) pdf.addPage();

      pdf.addImage(
        imgData,
        "PNG",
        x,
        y,
        renderWidth,
        renderHeight,
        undefined,
        "FAST"
      );
    }

    pdf.save("wordsearchgen.pdf");
  }

  function getCellFromPointer(event) {
    const element = document.elementFromPoint(event.clientX, event.clientY);
    const cell = element?.closest?.('[data-cell="true"]');
    if (!cell) return null;
    return {
      row: Number(cell.getAttribute("data-row")),
      col: Number(cell.getAttribute("data-col")),
    };
  }

  function beginSelection(row, col) {
    const point = { row, col };
    setSelectionStart(point);
    setSelectionEnd(point);
    setIsSelecting(true);
  }

  function updateSelectionFromPointer(event) {
    if (!isSelecting) return;
    const point = getCellFromPointer(event);
    if (point) setSelectionEnd(point);
  }

  function finishSelection(event) {
    if (!isSelecting) return;
    const pointerPoint = getCellFromPointer(event);
    const finalEnd = pointerPoint || selectionEnd;
    setIsSelecting(false);

    const selection = getSelectionLetters(grid, selectionStart, finalEnd);
    if (!selection) {
      setSelectionStart(null);
      setSelectionEnd(null);
      return;
    }

    const match = placedWords.find(
      (item) => item.word === selection.text || item.word === selection.reversed
    );

    if (match) {
      setFoundWords((previous) => {
        const next = new Set(previous);
        next.add(match.word);
        return next;
      });
    }

    setSelectionStart(null);
    setSelectionEnd(null);
  }

  const lineItems = placedWords.filter((item) => foundWords.has(item.word) || showAnswerKey);

  const bankGridTemplate =
    bankColumns === "auto"
      ? "repeat(auto-fit, minmax(110px, 1fr))"
      : `repeat(${Number(bankColumns)}, minmax(0, 1fr))`;

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8" style={{ background: theme.bg, color: theme.text }}>
      <style>{`
        @media print {
          @page { 
            size: letter portrait; 
            margin: 0.5in; 
          }

          body { 
            background: #fff !important; 
          }

          .no-print { 
            display: none !important; 
          }

          .print-shell {
            display: none !important;
          }

          .print-pack {
            position: static !important;
            left: auto !important;
            top: auto !important;
            width: auto !important;
            display: block !important;
          }

          .print-page {
            width: 100% !important;
            min-height: auto !important;
            padding: 0 !important;
            margin: 0 0 0.35in 0 !important;
            break-after: page;
            page-break-after: always;
            box-shadow: none !important;
          }

          .print-page:last-child {
            break-after: auto;
            page-break-after: auto;
          }
        }
      `}</style>

      <div className="mx-auto max-w-7xl print-shell">
        <header className="no-print mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold tracking-[0.35em]" style={{ color: theme.muted }}>
              WORDSEARCHGEN
            </p>
            <h1 className="text-3xl font-black tracking-tight sm:text-5xl">Word search builder</h1>
            <p className="mt-3 max-w-2xl text-sm sm:text-base" style={{ color: theme.muted }}>
              Build printable word searches from your own list or from a random category. Words can hide in every direction.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button theme={theme} onClick={handleGenerate} active>
              {mode === "custom" ? "Generate Custom Puzzle" : "Generate Random Puzzle"}
            </Button>
            <Button theme={theme} onClick={handleRegenerate}>
              Regenerate Layout
            </Button>
            <Button theme={theme} onClick={handleDownloadPng}>
              Download PNG
            </Button>
            <Button theme={theme} onClick={handleDownloadPdf}>
              Download PDF
            </Button>
            <Button theme={theme} onClick={() => window.print()}>
              Print
            </Button>
            <Button theme={theme} onClick={handleReset}>
              Reset
            </Button>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
          <aside className="no-print space-y-4 rounded-3xl p-4 shadow-xl backdrop-blur" style={{ background: theme.panel, border: `1px solid ${theme.border}` }}>
            <section>
              <FieldLabel theme={theme}>Word source</FieldLabel>
              <div className="grid grid-cols-2 gap-2">
                <Button theme={theme} active={mode === "custom"} onClick={() => setMode("custom")}>
                  Custom input
                </Button>
                <Button theme={theme} active={mode === "random"} onClick={() => setMode("random")}>
                  Random words
                </Button>
              </div>
            </section>

            {mode === "custom" ? (
              <section>
                <FieldLabel theme={theme}>Custom words</FieldLabel>
                <textarea
                  value={customText}
                  onChange={(event) => setCustomText(event.target.value)}
                  rows={8}
                  placeholder="Type words separated by commas or new lines..."
                  className="w-full resize-y rounded-2xl p-3 text-sm outline-none transition focus:ring-2"
                  style={{
                    background: theme.panelStrong,
                    color: theme.text,
                    border: `1px solid ${theme.border}`,
                  }}
                />
                <p className="mt-2 text-xs" style={{ color: theme.muted }}>
                  Cleanup removes punctuation, spaces, accents, duplicates, and words too long for the selected grid.
                </p>
              </section>
            ) : (
              <section>
                <FieldLabel theme={theme}>Random category</FieldLabel>
                <select
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  className="w-full rounded-2xl p-3 text-sm font-semibold outline-none"
                  style={{
                    background: theme.panelStrong,
                    color: theme.text,
                    border: `1px solid ${theme.border}`,
                  }}
                >
                  {Object.entries(CATEGORY_GROUPS).map(([group, categories]) => (
                    <optgroup key={group} label={group}>
                      {categories.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </section>
            )}

            <section>
              <FieldLabel theme={theme}>Puzzle size</FieldLabel>
              <div className="grid gap-2">
                {Object.entries(SIZE_PRESETS).map(([key, preset]) => (
                  <Button key={key} theme={theme} active={sizeKey === key} onClick={() => setSizeKey(key)} className="justify-between">
                    <span>{preset.label}</span>
                    <span className="ml-2 opacity-75">
                      {preset.words} words / {preset.grid}×{preset.grid}
                    </span>
                  </Button>
                ))}
              </div>
            </section>

            <section>
              <FieldLabel theme={theme}>Display options</FieldLabel>
              <div className="grid gap-2">
                <Button theme={theme} active={showAnswerKey} onClick={() => setShowAnswerKey((value) => !value)}>
                  {showAnswerKey ? "Hide Answer Key" : "Show Answer Key"}
                </Button>
                <label className="flex items-center justify-between gap-3 rounded-2xl px-3 py-2 text-sm" style={{ background: theme.panelStrong, border: `1px solid ${theme.border}` }}>
                  <span>Show word bank</span>
                  <input type="checkbox" checked={showBank} onChange={(event) => setShowBank(event.target.checked)} />
                </label>
                <label className="flex items-center justify-between gap-3 rounded-2xl px-3 py-2 text-sm" style={{ background: theme.panelStrong, border: `1px solid ${theme.border}` }}>
                  <span>Alphabetize bank</span>
                  <input type="checkbox" checked={alphabetizeBank} onChange={(event) => setAlphabetizeBank(event.target.checked)} />
                </label>
                <label className="flex items-center justify-between gap-3 rounded-2xl px-3 py-2 text-sm" style={{ background: theme.panelStrong, border: `1px solid ${theme.border}` }}>
                  <span>Hide found words</span>
                  <input type="checkbox" checked={hideFoundFromBank} onChange={(event) => setHideFoundFromBank(event.target.checked)} />
                </label>
                <div>
                  <FieldLabel theme={theme}>Bank columns</FieldLabel>
                  <select
                    value={bankColumns}
                    onChange={(event) => setBankColumns(event.target.value)}
                    className="w-full rounded-2xl p-3 text-sm font-semibold outline-none"
                    style={{
                      background: theme.panelStrong,
                      color: theme.text,
                      border: `1px solid ${theme.border}`,
                    }}
                  >
                    <option value="auto">Auto</option>
                    <option value="2">Two columns</option>
                    <option value="3">Three columns</option>
                    <option value="4">Four columns</option>
                  </select>
                </div>
              </div>
            </section>

            <section>
              <FieldLabel theme={theme}>Theme selector</FieldLabel>
              <Button theme={theme} onClick={() => setThemeOpen((value) => !value)} active={themeOpen} className="w-full">
                Choose theme: {themeName}
              </Button>
              {themeOpen && (
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {Object.keys(THEMES).map((name) => (
                    <button
                      key={name}
                      type="button"
                      onClick={() => {
                        setThemeName(name);
                        setThemeOpen(false);
                      }}
                      className="rounded-2xl p-2 text-left text-xs font-bold shadow-sm transition hover:scale-[1.02]"
                      style={{
                        background: THEMES[name].bg,
                        color: THEMES[name].text,
                        border: `2px solid ${themeName === name ? theme.accent : theme.border}`,
                      }}
                    >
                      {name}
                    </button>
                  ))}
                </div>
              )}
            </section>

            {(rejectedWords.length > 0 || unplacedWords.length > 0) && (
              <section className="rounded-2xl p-3 text-xs" style={{ background: theme.panelStrong, border: `1px solid ${theme.border}` }}>
                <p className="font-bold">Cleanup / placement notes</p>
                {rejectedWords.length > 0 && (
                  <ul className="mt-2 list-inside list-disc space-y-1" style={{ color: theme.muted }}>
                    {rejectedWords.slice(0, 8).map((item, index) => (
                      <li key={`${item.word}-${index}`}>
                        {item.word}: {item.reason}
                      </li>
                    ))}
                    {rejectedWords.length > 8 && <li>{rejectedWords.length - 8} more not shown</li>}
                  </ul>
                )}
                {unplacedWords.length > 0 && (
                  <p className="mt-2" style={{ color: theme.muted }}>
                    Could not place: {unplacedWords.join(", ")}. Try regenerating or selecting a larger puzzle.
                  </p>
                )}
              </section>
            )}
          </aside>

          <main className="print-area space-y-4">
            <section className="grid-card rounded-3xl p-3 shadow-2xl backdrop-blur sm:p-4" style={{ background: theme.panel, border: `1px solid ${theme.border}` }}>
              {grid.length > 0 ? (
                <div
                  ref={gridRef}
                  className="relative mx-auto grid max-w-[min(100%,850px)] touch-none select-none overflow-hidden rounded-2xl border"
                  style={{
                    gridTemplateColumns: `repeat(${grid.length}, minmax(0, 1fr))`,
                    borderColor: theme.border,
                    background: theme.panelStrong,
                  }}
                  onPointerMove={updateSelectionFromPointer}
                  onPointerUp={finishSelection}
                  onPointerCancel={() => setIsSelecting(false)}
                  onPointerLeave={(event) => {
                    if (isSelecting) updateSelectionFromPointer(event);
                  }}
                >
                  <svg
                    className="pointer-events-none absolute inset-0 z-20 h-full w-full"
                    viewBox={`0 0 ${grid.length} ${grid.length}`}
                    preserveAspectRatio="none"
                  >
                    {lineItems.map((item) => {
                      const color = foundWords.has(item.word) ? theme.found : theme.answer;
                      return <HighlightLine key={item.word} item={item} color={color} />;
                    })}
                    {selectedLine && <HighlightLine item={selectedLine} color={theme.select} width={0.5} />}
                  </svg>

                  {grid.map((row, rowIndex) =>
                    row.map((letter, colIndex) => (
                      <button
                        key={`${rowIndex}-${colIndex}`}
                        type="button"
                        data-cell="true"
                        data-row={rowIndex}
                        data-col={colIndex}
                        onPointerDown={(event) => {
                          event.preventDefault();
                          beginSelection(rowIndex, colIndex);
                        }}
                        className="cell-button relative z-10 aspect-square border text-center font-black leading-none transition hover:brightness-105"
                        style={{
                          background: theme.cell,
                          borderColor: theme.border,
                          color: theme.text,
                          fontSize: `clamp(0.55rem, ${grid.length > 18 ? "1.4vw" : "2vw"}, 1.35rem)`,
                        }}
                        aria-label={`Row ${rowIndex + 1}, column ${colIndex + 1}, letter ${letter}`}
                      >
                        {letter}
                      </button>
                    ))
                  )}
                </div>
              ) : (
                <div className="flex min-h-[420px] items-center justify-center rounded-2xl border border-dashed p-8 text-center" style={{ borderColor: theme.border }}>
                  <div>
                    <p className="text-2xl font-black">No puzzle generated yet</p>
                    <p className="mt-2 max-w-md text-sm" style={{ color: theme.muted }}>
                      Add custom words or switch to random mode, then generate a puzzle.
                    </p>
                  </div>
                </div>
              )}
            </section>

            {showBank && grid.length > 0 && (
              <section className="word-bank-card rounded-3xl p-4 shadow-xl backdrop-blur" style={{ background: theme.panel, border: `1px solid ${theme.border}` }}>
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-black uppercase tracking-[0.2em]" style={{ color: theme.muted }}>
                    Word Bank
                  </p>
                  <p className="screen-note text-sm font-semibold" style={{ color: theme.muted }}>
                    Found {foundCount} of {placedWords.length}
                  </p>
                </div>
                <div className="word-bank-grid grid gap-2" style={{ gridTemplateColumns: bankGridTemplate }}>
                  {bankWords.map((word) => {
                    const found = foundWords.has(word);
                    return (
                      <div
                        key={word}
                        className="rounded-xl px-3 py-2 text-center text-sm font-black tracking-wide"
                        style={{
                          background: found ? theme.found : theme.panelStrong,
                          color: theme.text,
                          border: `1px solid ${theme.border}`,
                          textDecoration: found && !hideFoundFromBank ? "line-through" : "none",
                        }}
                      >
                        {word}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}
          </main>
        </div>
      </div>
      <div
        className="print-pack"
        style={{
          position: "absolute",
          left: "-100000px",
          top: 0,
          width: "816px",
        }}
      >
        {grid.length > 0 && (
          <>
            <PrintablePuzzlePage
              pageRef={exportPuzzleRef}
              grid={grid}
              placedWords={placedWords}
              wordBank={placedWords.map((item) => item.word)}
              showAnswerKey={false}
            />

            <PrintablePuzzlePage
              pageRef={exportAnswerRef}
              grid={grid}
              placedWords={placedWords}
              wordBank={placedWords.map((item) => item.word)}
              showAnswerKey={true}
            />
          </>
        )}
      </div>
    </div>
  );
}
