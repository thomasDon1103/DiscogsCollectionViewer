/**
 * Maps human-readable theme names to their corresponding data-theme attribute values.
 */
export const themeMap: ReadonlyMap<string, string> = new Map([
  // Default (style.css)
  ["Default", "default"],
  ["Forest", "forest"],
  ["Ocean", "ocean"],
  ["Sunset", "sunset"],
  ["Rose", "rose"],
  ["Arctic", "arctic"],
  ["Ember", "ember"],
  ["Midnight", "midnight"],
  ["Gold", "gold"],
  ["Aurora", "aurora"],
  ["Nebula", "nebula"],
  ["Tropical", "tropical"],
  ["Cyberpunk", "cyberpunk"],
  ["Volcano", "volcano"],
  ["Coral Reef", "coral-reef"],
  ["Northern Lights", "northern-lights"],
  ["Sakura", "sakura"],
  ["Desert Dusk", "desert-dusk"],
  ["Deep Space", "deep-space"],
  ["Jungle", "jungle"],

  // Elegant & Classic (themesPlus.css)
  ["Velvet", "velvet"],
  ["Chrome", "chrome"],
  ["Editorial", "editorial"],

  // Neon & Electric
  ["Rave", "rave"],
  ["Hologram", "hologram"],
  ["Hazard", "hazard"],

  // Nature & Earth
  ["Terracotta", "terracotta"],
  ["Moss", "moss"],
  ["Lavender", "lavender"],
  ["Harvest", "harvest"],

  // Experimental & Unusual
  ["Paradox", "paradox"],
  ["Noir", "noir"],
  ["Duochrome", "duochrome"],
  ["Bleached", "bleached"],
  ["Patina", "patina"],
  ["Bruise", "bruise"],

  // Cosmic & Sci-Fi
  ["Mars", "mars"],
  ["Bioluminescent", "bioluminescent"],
  ["Supernova", "supernova"],
  ["Wormhole", "wormhole"],

  // Moody & Atmospheric
  ["Storm", "storm"],
  ["Fog", "fog"],
  ["Absinthe", "absinthe"],

  // Retro & Vintage
  ["Synthwave", "synthwave"],
  ["Polaroid", "polaroid"],
  ["VHS", "vhs"],

  // Mineral & Gem
  ["Amethyst", "amethyst"],
  ["Obsidian", "obsidian"],
  ["Opal", "opal"],
  ["Ruby", "ruby"],
  ["Sapphire", "sapphire"],
  ["Emerald", "emerald"],

  // Food & Drink
  ["Espresso", "espresso"],
  ["Matcha", "matcha"],

  // Weather & Atmosphere
  ["Lightning", "lightning"],
  ["Monsoon", "monsoon"],

  // Abstract & Artistic
  ["Rothko", "rothko"],
  ["Mondrian", "mondrian"],
  ["Glitch", "glitch"],
  ["Vaporwave", "vaporwave"],

  // Geography & Culture
  ["Tokyo", "tokyo"],
  ["Fjord", "fjord"],
  ["Sahara", "sahara"],
  ["Tundra", "tundra"],
  ["Bazaar", "bazaar"],

  // Seasons
  ["Winter Berry", "winter-berry"],
  ["Spring", "spring"],
  ["Indian Summer", "indian-summer"],

  // Synesthesia (themesPlusPlus.css)
  ["Cello", "cello"],
  ["White Noise", "white-noise"],
  ["Bass Drop", "bass-drop"],

  // Impossible Physics
  ["Antimatter", "antimatter"],
  ["Dark Matter", "dark-matter"],
  ["Quantum", "quantum"],
  ["Event Horizon", "event-horizon"],

  // Emotional States
  ["Euphoria", "euphoria"],
  ["Melancholy", "melancholy"],
  ["Vertigo", "vertigo"],
  ["Nostalgia", "nostalgia"],
  ["Insomnia", "insomnia"],

  // Decay & Transformation
  ["Rust", "rust"],
  ["Mold", "mold"],
  ["Ash", "ash"],
  ["Petrichor", "petrichor"],

  // Forbidden Palettes
  ["Forbidden Xmas", "forbidden-xmas"],
  ["Ugly Beautiful", "ugly-beautiful"],
  ["Pumpkin Witch", "pumpkin-witch"],
  ["Mustard Navy", "mustard-navy"],

  // Temporal
  ["4AM", "4am"],
  ["Solar Noon", "solar-noon"],
  ["Blue Hour", "blue-hour"],
  ["Witching Hour", "witching-hour"],

  // Texture as Color
  ["Wet Concrete", "wet-concrete"],
  ["Silk", "silk"],
  ["Charcoal", "charcoal"],
  ["Mercury", "mercury"],
  ["Neon Sign", "neon-sign"],

  // Biological
  ["Mycelium", "mycelium"],
  ["Jellyfish", "jellyfish"],
  ["Chlorophyll", "chlorophyll"],
  ["Coral Bleach", "coral-bleach"],

  // Glitch & Digital
  ["Dead Pixel", "dead-pixel"],
  ["Corrupted", "corrupted"],
  ["BSOD", "bsod"],
  ["Matrix", "matrix"],

  // Culinary Extremes
  ["Wasabi", "wasabi"],
  ["Squid Ink", "squid-ink"],
  ["Burnt Sugar", "burnt-sugar"],

  // Architectural
  ["Brutalist", "brutalist"],
  ["Art Deco", "art-deco"],
  ["Gothic", "gothic"],
  ["Solarpunk", "solarpunk"],

  // Dreamscape
  ["Lucid", "lucid"],
  ["Sleep Paralysis", "sleep-paralysis"],
  ["Déjà Vu", "deja-vu"],
  ["Fever", "fever"],

  // Astronomical Phenomena
  ["Pulsar", "pulsar"],
  ["Solar Flare", "solar-flare"],
  ["Red Dwarf", "red-dwarf"],
  ["Comet", "comet"],

  // Optical Illusions (themesPlusPlusPlus.css)
  ["Afterimage", "afterimage"],
  ["Chromatic", "chromatic"],
  ["Moiré", "moire"],
  ["Blind Spot", "blind-spot"],

  // Wrong on Purpose
  ["Clown", "clown"],
  ["Sunburn", "sunburn"],
  ["Bruised Banana", "bruised-banana"],
  ["Static Cling", "static-cling"],

  // Synesthetic Taste
  ["Umami", "umami"],
  ["Sour", "sour"],
  ["Bitter", "bitter"],
  ["Spice", "spice"],

  // Impossible Materials
  ["Transparent Aluminum", "transparent-aluminum"],
  ["Vantablack Rainbow", "vantablack-rainbow"],
  ["Aerogel", "aerogel"],
  ["Liquid Nitrogen", "liquid-nitrogen"],

  // Emotional Paradoxes
  ["Bittersweet", "bittersweet"],
  ["Calm Panic", "calm-panic"],
  ["Joyful Grief", "joyful-grief"],
  ["Comfortable Dread", "comfortable-dread"],

  // Corrupted Nature
  ["Radioactive Forest", "radioactive-forest"],
  ["Inverted Ocean", "inverted-ocean"],
  ["Petrified", "petrified"],
  ["Toxic Bloom", "toxic-bloom"],

  // Dimensional Shifts
  ["Flatland", "flatland"],
  ["Tesseract", "tesseract"],
  ["Mirror", "mirror"],
  ["Void Echo", "void-echo"],

  // Micro World
  ["Prism", "prism"],
  ["Beetle", "beetle"],
  ["Soap Bubble", "soap-bubble"],
  ["Crystal Lattice", "crystal-lattice"],

  // Temporal Paradox
  ["Retro Future", "retro-future"],
  ["Ancient Neon", "ancient-neon"],
  ["Fossil Fuel", "fossil-fuel"],
  ["Y2K", "y2k"],

  // Weather Extremes
  ["Ball Lightning", "ball-lightning"],
  ["Dust Devil", "dust-devil"],
  ["Ice Storm", "ice-storm"],
  ["Volcanic Lightning", "volcanic-lightning"],

  // Alien Worlds
  ["Methane Sunset", "methane-sunset"],
  ["Titan Lake", "titan-lake"],
  ["Europa", "europa"],
  ["Io Sulfur", "io-sulfur"],

  // Psychological
  ["Hyperfocus", "hyperfocus"],
  ["Dissociation", "dissociation"],
  ["Flow State", "flow-state"],
  ["Déréalisation", "derealization"],

  // Phantom Senses (themesPlusPlusPlusPlus.css)
  ["Infrared", "infrared"],
  ["Ultraviolet", "ultraviolet"],
  ["Echolocation", "echolocation"],
  ["Magnetoreception", "magnetoreception"],
  ["Proprioception", "proprioception"],

  // Mathematical Beauty
  ["Golden Ratio", "golden-ratio"],
  ["Pi", "pi"],
  ["Infinity", "infinity"],
  ["Fractal", "fractal"],

  // Forbidden Combinations
  ["Toothpaste OJ", "toothpaste-oj"],
  ["Ketchup Ice Cream", "ketchup-icecream"],
  ["Neon Overload", "neon-overload"],
  ["Camo Fail", "camo-fail"],

  // Liminal Spaces
  ["Empty Mall", "empty-mall"],
  ["Hotel Hallway", "hotel-hallway"],
  ["Pool 2AM", "pool-2am"],
  ["Backrooms", "backrooms"],

  // Glitch Biology
  ["DNA Corrupt", "dna-corrupt"],
  ["Mitosis", "mitosis"],
  ["Virus", "virus"],
  ["Symbiosis", "symbiosis"],

  // Sensory Overload
  ["Tinnitus", "tinnitus"],
  ["Phantom Limb", "phantom-limb"],
  ["Overstimulated", "overstimulated"],
  ["ASMR", "asmr"],

  // Wrong Physics
  ["Negative Gravity", "negative-gravity"],
  ["Time Reversal", "time-reversal"],
  ["Absolute Zero", "absolute-zero"],
  ["Heat Death", "heat-death"],

  // Cultural Glitch
  ["Inverted Wedding", "inverted-wedding"],
  ["Broken Glass", "broken-glass"],
  ["Neon Temple", "neon-temple"],
  ["Faded Propaganda", "faded-propaganda"],

  // Dreams Within Dreams
  ["Dream Level 1", "dream-l1"],
  ["Dream Level 2", "dream-l2"],
  ["Dream Level 3", "dream-l3"],
  ["Limbo", "limbo"],

  // Synesthetic Music Genres
  ["Doom Metal", "doom-metal"],
  ["Shoegaze", "shoegaze"],
  ["Harsh Noise", "harsh-noise"],
  ["Ambient", "ambient"],

  // Existential
  ["Emergence", "emergence"],
  ["Theseus", "theseus"],
  ["Sisyphus", "sisyphus"],
  ["Memento Mori", "memento-mori"],
]);