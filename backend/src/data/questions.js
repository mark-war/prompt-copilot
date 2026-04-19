// ─── GAME ───────────────────────────────────────────────────────────────────

const sharedGameQuestions = [
  {
    key: "name",
    label: "Game name",
    type: "text",
    placeholder: "e.g. Void Striker, Neon Rush...",
  },
  {
    key: "theme",
    label: "Game theme / setting",
    type: "text",
    placeholder: "e.g. cyberpunk city, haunted space station...",
  },
  {
    key: "tech",
    label: "Technology",
    type: "select",
    options: ["HTML/CSS/JS", "Canvas API", "WebGL"],
  },
  {
    key: "style",
    label: "Visual style",
    type: "select",
    options: ["retro arcade", "modern", "pixel art"],
  },
  {
    key: "difficulty",
    label: "Difficulty scaling",
    type: "select",
    options: ["easy", "medium", "hard", "progressive"],
  },
  {
    key: "constraints",
    label: "Technical constraints",
    type: "multi",
    options: ["single file", "no libraries", "mobile-friendly"],
  },
  {
    key: "gameFlow",
    label: "Game flow controls",
    type: "multi",
    options: [
      "Start screen",
      "Restart button",
      "Pause/Resume (P key)",
      "Game over screen",
    ],
  },
];

const genreQuestions = {
  sudoku: [
    {
      key: "features",
      label: "Sudoku features",
      type: "multi",
      options: [
        "number validation",
        "auto-fill candidates",
        "hint system",
        "mistake highlighting",
        "timer",
        "puzzle generator",
        "multiple difficulty levels",
        "pencil / candidate mode",
        "undo / redo history",
        "auto-remove pencil marks on confirm",
        "highlight matching numbers",
        "remaining number counter",
      ],
    },
    {
      key: "visual",
      label: "Visual feedback",
      type: "multi",
      options: [
        "highlight wrong inputs in red",
        "highlight selected row, column, and box",
        "highlight all matching numbers on select",
        "dim completed numbers",
        "animate completed row / column / box",
        "celebration animation on solve",
      ],
    },
    {
      key: "controls",
      label: "Controls",
      type: "multi",
      options: [
        "click to select cell",
        "keyboard number input",
        "numpad support",
        "touch/tap cell",
        "erase / backspace",
        "undo/redo",
        "pencil mode toggle (P key)",
        "number pad UI (on-screen)",
      ],
    },
    {
      key: "advanced",
      label: "Advanced options",
      type: "multi",
      options: [
        "daily challenge puzzle",
        "save & resume progress (localStorage)",
        "solve animation (step-by-step reveal)",
        "leaderboard by time",
        "color theme selector",
        "accessibility mode (large numbers)",
        "mistake limit mode (max 3 mistakes)",
        "auto-solve with backtracking visualizer",
      ],
    },
  ],

  "tower defense": [
    {
      key: "features",
      label: "Core features",
      type: "multi",
      options: [
        "multiple tower types",
        "enemy waves",
        "upgrade system",
        "resource / gold system",
        "lives / health bar",
        "path-based enemies",
        "boss waves",
      ],
    },
    {
      key: "controls",
      label: "Controls",
      type: "multi",
      options: [
        "click to place tower",
        "click to upgrade tower",
        "click to sell tower",
        "touch support",
        "speed up button",
        "pause button",
      ],
    },
    {
      key: "advanced",
      label: "Advanced options",
      type: "multi",
      options: [
        "multiple maps / paths",
        "tower range preview on hover",
        "enemy health bars",
        "tower targeting priority (first / last / strongest)",
        "special abilities / skills",
        "wave preview (next enemies)",
        "save progress between waves",
      ],
    },
  ],
  platformer: [
    {
      key: "features",
      label: "Core features",
      type: "multi",
      options: [
        "double jump",
        "wall jump",
        "checkpoints",
        "collectibles",
        "enemies",
        "moving platforms",
      ],
    },
    {
      key: "controls",
      label: "Controls",
      type: "multi",
      options: [
        "Arrow keys movement",
        "WASD movement",
        "Spacebar jump",
        "Up arrow jump",
        "Touch left/right buttons",
        "Tap to jump",
      ],
    },
  ],
  puzzle: [
    {
      key: "mechanics",
      label: "Puzzle mechanics",
      type: "multi",
      options: [
        "drag and drop",
        "tile matching",
        "grid-based",
        "physics-based",
        "color matching",
      ],
    },
    {
      key: "controls",
      label: "Controls",
      type: "multi",
      options: [
        "Mouse click",
        "Mouse drag",
        "Touch tap",
        "Touch drag",
        "Keyboard navigation",
      ],
    },
  ],
};

// ─── CODING ───────────────────────────────────────────────────────────────────

const codingTypeQuestions = {
  "rest api": [
    {
      key: "language",
      label: "Language / Framework",
      type: "select",
      options: [
        "Node.js / Express",
        "Node.js / Fastify",
        "Python / FastAPI",
        "Python / Django",
        "Go",
      ],
    },
    {
      key: "features",
      label: "API features",
      type: "multi",
      options: [
        "authentication",
        "CRUD endpoints",
        "pagination",
        "rate limiting",
        "file upload",
        "webhooks",
      ],
    },
    {
      key: "auth",
      label: "Auth method",
      type: "select",
      options: ["JWT", "API key", "OAuth2", "session-based", "none"],
    },
    {
      key: "advanced",
      label: "Advanced options",
      type: "multi",
      options: [
        "OpenAPI / Swagger docs",
        "request validation middleware",
        "response caching",
        "background jobs",
        "websocket support",
        "multi-tenancy",
        "soft delete",
        "audit logging",
      ],
    },
  ],
  "react component": [
    {
      key: "features",
      label: "Component features",
      type: "multi",
      options: [
        "props validation",
        "loading state",
        "error state",
        "animations",
        "responsive",
        "dark mode",
      ],
    },
    {
      key: "styling",
      label: "Styling approach",
      type: "select",
      options: [
        "Tailwind CSS",
        "CSS modules",
        "styled-components",
        "plain CSS",
        "inline styles",
      ],
    },
    {
      key: "advanced",
      label: "Advanced options",
      type: "multi",
      options: [
        "compound component pattern",
        "render props pattern",
        "custom hook extraction",
        "forwardRef support",
        "memoization (React.memo / useMemo)",
        "accessibility (ARIA)",
        "Storybook stories",
        "unit tests (Jest + Testing Library)",
      ],
    },
  ],
  "cli tool": [
    {
      key: "features",
      label: "CLI features",
      type: "multi",
      options: [
        "interactive prompts",
        "file input/output",
        "config file",
        "colorful output",
        "progress bar",
        "verbose mode",
      ],
    },
    {
      key: "runtime",
      label: "Runtime",
      type: "select",
      options: ["Node.js", "Python", "Go", "Rust", "Bash"],
    },
    {
      key: "advanced",
      label: "Advanced options",
      type: "multi",
      options: [
        "subcommands (click / typer / commander)",
        "auto-complete support",
        "YAML config file support",
        "plugin system",
        "package as pip-installable / npm-publishable tool",
        "shell script wrapper",
        "update checker",
        "telemetry / usage tracking",
      ],
    },
  ],
  "database schema": [
    {
      key: "features",
      label: "Schema features",
      type: "multi",
      options: [
        "relationships",
        "indexes",
        "soft delete",
        "timestamps",
        "audit log",
        "full-text search",
      ],
    },
    {
      key: "database",
      label: "Database",
      type: "select",
      options: ["PostgreSQL", "MySQL", "MongoDB", "SQLite", "Supabase"],
    },
    {
      key: "advanced",
      label: "Advanced options",
      type: "multi",
      options: [
        "row-level security (RLS)",
        "partitioning / sharding strategy",
        "materialized views",
        "stored procedures",
        "triggers",
        "multi-tenancy schema",
        "versioned migrations",
        "seed data",
      ],
    },
  ],
  "chrome extension": [
    {
      key: "features",
      label: "Extension features",
      type: "multi",
      options: [
        "popup UI",
        "content script",
        "background service",
        "context menu",
        "storage sync",
        "keyboard shortcut",
      ],
    },
    {
      key: "manifest",
      label: "Manifest version",
      type: "select",
      options: ["Manifest V3", "Manifest V2"],
    },
    {
      key: "advanced",
      label: "Advanced options",
      type: "multi",
      options: [
        "side panel (Chrome 114+)",
        "offscreen document",
        "native messaging",
        "OAuth2 login",
        "cross-browser support (Firefox)",
        "options page",
        "automated tests (Playwright)",
        "publish to Chrome Web Store guide",
      ],
    },
  ],
  algorithm: [
    {
      key: "features",
      label: "Requirements",
      type: "multi",
      options: [
        "time complexity analysis",
        "space complexity analysis",
        "test cases",
        "edge case handling",
        "step-by-step comments",
      ],
    },
    {
      key: "language",
      label: "Language",
      type: "select",
      options: ["JavaScript", "Python", "TypeScript", "Java", "C++"],
    },
    {
      key: "advanced",
      label: "Advanced options",
      type: "multi",
      options: [
        "iterative and recursive versions",
        "visual trace / dry run",
        "benchmarking code",
        "comparison with alternative approaches",
        "LeetCode-style problem statement",
        "memoization / dynamic programming variant",
      ],
    },
  ],
};

const sharedCodingQuestions = [
  {
    key: "projectName",
    label: "Project name",
    type: "text",
    placeholder: "e.g. TaskFlow API, AuthKit...",
  },
  {
    key: "description",
    label: "What does it do?",
    type: "text",
    placeholder: "e.g. A REST API for managing user tasks with auth...",
  },
  {
    key: "quality",
    label: "Code quality",
    type: "multi",
    options: [
      "add comments",
      "add error handling",
      "add unit tests",
      "follow best practices",
      "add TypeScript types",
    ],
  },
  {
    key: "output",
    label: "Output format",
    type: "select",
    options: [
      "single file",
      "multiple files with structure",
      "with README",
      "with Docker setup",
    ],
  },
];

// ─── WRITING ──────────────────────────────────────────────────────────────────

const writingTypeQuestions = {
  "blog post": [
    {
      key: "features",
      label: "Post elements",
      type: "multi",
      options: [
        "introduction hook",
        "subheadings",
        "bullet points",
        "call to action",
        "meta description",
        "FAQs section",
      ],
    },
    {
      key: "audience",
      label: "Target audience",
      type: "select",
      options: [
        "beginners",
        "intermediate",
        "experts",
        "general public",
        "business executives",
      ],
    },
    {
      key: "tone",
      label: "Overall tone",
      type: "select",
      options: [
        "professional",
        "casual",
        "persuasive",
        "informative",
        "inspirational",
        "humorous",
      ],
    },
  ],
  email: [
    {
      key: "features",
      label: "Email elements",
      type: "multi",
      options: [
        "subject line",
        "personalization",
        "clear CTA",
        "follow-up line",
        "professional sign-off",
      ],
    },
    {
      key: "tone",
      label: "Tone",
      type: "select",
      options: ["formal", "friendly", "persuasive", "urgent", "apologetic"],
    },
  ],
  "social media post": [
    {
      key: "platform",
      label: "Platform",
      type: "select",
      options: ["Twitter/X", "LinkedIn", "Instagram", "Facebook", "TikTok"],
    },
    {
      key: "features",
      label: "Post elements",
      type: "multi",
      options: [
        "hashtags",
        "emojis",
        "hook opening",
        "call to action",
        "thread format",
      ],
    },
    {
      key: "tone",
      label: "Tone",
      type: "select",
      options: [
        "professional",
        "casual",
        "witty",
        "inspirational",
        "promotional",
      ],
    },
  ],
  "product description": [
    {
      key: "features",
      label: "Description elements",
      type: "multi",
      options: [
        "key benefits",
        "technical specs",
        "social proof",
        "SEO keywords",
        "urgency trigger",
        "target pain point",
      ],
    },
    {
      key: "tone",
      label: "Tone",
      type: "select",
      options: ["professional", "casual", "luxury", "playful", "minimalist"],
    },
  ],
  "cover letter": [
    {
      key: "features",
      label: "Letter elements",
      type: "multi",
      options: [
        "opening hook",
        "relevant experience",
        "key achievements",
        "culture fit",
        "strong closing",
      ],
    },
    {
      key: "tone",
      label: "Tone",
      type: "select",
      options: ["formal", "confident", "enthusiastic", "humble", "creative"],
    },
  ],
  "ad copy": [
    {
      key: "features",
      label: "Ad elements",
      type: "multi",
      options: [
        "attention-grabbing headline",
        "pain point",
        "unique value prop",
        "social proof",
        "strong CTA",
        "urgency",
      ],
    },
    {
      key: "platform",
      label: "Ad platform",
      type: "select",
      options: [
        "Google Ads",
        "Facebook/Instagram",
        "LinkedIn",
        "Twitter/X",
        "YouTube",
      ],
    },
    {
      key: "tone",
      label: "Tone",
      type: "select",
      options: ["urgent", "professional", "casual", "bold", "empathetic"],
    },
  ],
};

const sharedWritingQuestions = [
  {
    key: "title",
    label: "Title / Topic",
    type: "text",
    placeholder: "e.g. 10 Ways to Improve Your Sleep...",
  },
  {
    key: "context",
    label: "Extra context",
    type: "text",
    placeholder: "e.g. For a SaaS product targeting remote teams...",
  },
  {
    key: "length",
    label: "Length",
    type: "select",
    options: [
      "short (under 150 words)",
      "medium (150–400 words)",
      "long (400–800 words)",
      "detailed (800+ words)",
    ],
  },
  {
    key: "extras",
    label: "Extras",
    type: "multi",
    options: [
      "make it SEO-friendly",
      "avoid jargon",
      "include examples",
      "make it skimmable",
      "add a story element",
    ],
  },
];

// ─── IMAGE GENERATION ─────────────────────────────────────────────────────────

const imageTypeQuestions = {
  portrait: [
    {
      key: "subject",
      label: "Subject description",
      type: "text",
      placeholder: "e.g. young woman with curly red hair, freckles...",
    },
    {
      key: "expression",
      label: "Expression / mood",
      type: "select",
      options: [
        "neutral",
        "smiling",
        "serious",
        "contemplative",
        "joyful",
        "mysterious",
      ],
    },
    {
      key: "features",
      label: "Portrait features",
      type: "multi",
      options: [
        "bokeh background",
        "dramatic lighting",
        "eye contact",
        "candid feel",
        "studio look",
        "outdoor natural light",
      ],
    },
  ],
  landscape: [
    {
      key: "subject",
      label: "Scene description",
      type: "text",
      placeholder: "e.g. misty mountain valley at sunrise...",
    },
    {
      key: "timeOfDay",
      label: "Time of day",
      type: "select",
      options: [
        "golden hour",
        "sunrise",
        "midday",
        "sunset",
        "blue hour",
        "night",
        "overcast",
      ],
    },
    {
      key: "features",
      label: "Scene features",
      type: "multi",
      options: [
        "fog / mist",
        "dramatic clouds",
        "reflections",
        "long exposure look",
        "aerial view",
        "foreground interest",
      ],
    },
  ],
  "product shot": [
    {
      key: "subject",
      label: "Product description",
      type: "text",
      placeholder: "e.g. matte black perfume bottle, minimalist label...",
    },
    {
      key: "background",
      label: "Background",
      type: "select",
      options: [
        "pure white",
        "pure black",
        "gradient",
        "textured surface",
        "lifestyle setting",
        "transparent",
      ],
    },
    {
      key: "features",
      label: "Shot features",
      type: "multi",
      options: [
        "dramatic shadows",
        "soft shadows",
        "reflective surface",
        "close-up detail",
        "multiple angles",
        "lifestyle props",
      ],
    },
  ],
  "character design": [
    {
      key: "subject",
      label: "Character description",
      type: "text",
      placeholder:
        "e.g. female warrior in futuristic armor, determined expression...",
    },
    {
      key: "artStyle",
      label: "Art style",
      type: "select",
      options: [
        "anime",
        "semi-realistic",
        "cartoon",
        "comic book",
        "concept art",
        "oil painting",
      ],
    },
    {
      key: "features",
      label: "Character features",
      type: "multi",
      options: [
        "full body",
        "bust / portrait",
        "action pose",
        "detailed outfit",
        "weapon / prop",
        "background scene",
      ],
    },
  ],
  "logo concept": [
    {
      key: "subject",
      label: "Brand / concept",
      type: "text",
      placeholder: "e.g. tech startup focused on AI productivity tools...",
    },
    {
      key: "logoStyle",
      label: "Logo style",
      type: "select",
      options: [
        "minimal",
        "geometric",
        "lettermark",
        "emblem",
        "wordmark",
        "mascot",
        "abstract icon",
      ],
    },
    {
      key: "features",
      label: "Logo features",
      type: "multi",
      options: [
        "flat design",
        "3D / dimensional",
        "monochrome",
        "gradient",
        "vintage / retro",
        "modern / clean",
      ],
    },
  ],
  "abstract art": [
    {
      key: "subject",
      label: "Concept / theme",
      type: "text",
      placeholder: "e.g. chaos and order, the feeling of nostalgia...",
    },
    {
      key: "artStyle",
      label: "Art style",
      type: "select",
      options: [
        "fluid art",
        "geometric abstract",
        "glitch art",
        "surrealism",
        "expressionism",
        "fractal",
      ],
    },
    {
      key: "features",
      label: "Art features",
      type: "multi",
      options: [
        "vibrant colors",
        "monochromatic",
        "dark and moody",
        "neon / glow",
        "textured",
        "symmetrical",
      ],
    },
  ],
};

const sharedImageQuestions = [
  {
    key: "title",
    label: "Image title / project",
    type: "text",
    placeholder: "e.g. Hero banner for my landing page...",
  },
  {
    key: "platform",
    label: "Target platform / tool",
    type: "select",
    options: [
      "Midjourney",
      "DALL·E 3",
      "Stable Diffusion",
      "Adobe Firefly",
      "Ideogram",
      "Leonardo AI",
    ],
  },
  {
    key: "style",
    label: "Visual style",
    type: "select",
    options: [
      "photorealistic",
      "cinematic",
      "illustration",
      "digital painting",
      "watercolor",
      "3D render",
      "sketch / pencil",
      "vintage / film",
    ],
  },
  {
    key: "mood",
    label: "Mood / atmosphere",
    type: "select",
    options: [
      "dramatic",
      "serene",
      "mysterious",
      "energetic",
      "melancholic",
      "whimsical",
      "dark",
      "bright & airy",
    ],
  },
  {
    key: "lighting",
    label: "Lighting",
    type: "select",
    options: [
      "natural light",
      "studio lighting",
      "dramatic side light",
      "backlit / silhouette",
      "neon / artificial",
      "golden hour",
      "low key",
    ],
  },
  {
    key: "camera",
    label: "Camera / lens",
    type: "select",
    options: [
      "wide angle",
      "telephoto / compressed",
      "macro / close-up",
      "fisheye",
      "35mm film",
      "50mm portrait",
      "drone / aerial",
    ],
  },
  {
    key: "quality",
    label: "Quality tags",
    type: "multi",
    options: [
      "8K ultra detailed",
      "award winning",
      "trending on ArtStation",
      "sharp focus",
      "high resolution",
      "professional photography",
      "masterpiece",
    ],
  },
  {
    key: "negative",
    label: "Avoid (negative prompt)",
    type: "multi",
    options: [
      "blurry",
      "low quality",
      "extra limbs",
      "bad anatomy",
      "watermark",
      "text / letters",
      "oversaturated",
      "flat lighting",
    ],
  },
];

// ─── MARKETING ────────────────────────────────────────────────────────────────

const marketingTypeQuestions = {
  "landing page copy": [
    {
      key: "product",
      label: "Product / service",
      type: "text",
      placeholder: "e.g. AI writing assistant for marketers...",
    },
    {
      key: "features",
      label: "Page sections",
      type: "multi",
      options: [
        "hero headline + subheadline",
        "features section",
        "benefits section",
        "social proof",
        "pricing section",
        "FAQ",
        "CTA section",
      ],
    },
    {
      key: "usp",
      label: "Unique value prop",
      type: "text",
      placeholder: "e.g. 10x faster than writing manually...",
    },
  ],
  "email sequence": [
    {
      key: "product",
      label: "Product / service",
      type: "text",
      placeholder: "e.g. Online course about freelancing...",
    },
    {
      key: "sequenceType",
      label: "Sequence type",
      type: "select",
      options: [
        "welcome sequence",
        "nurture sequence",
        "sales sequence",
        "onboarding sequence",
        "re-engagement sequence",
        "post-purchase",
      ],
    },
    {
      key: "features",
      label: "Email elements",
      type: "multi",
      options: [
        "story-based",
        "value-first",
        "urgency",
        "social proof",
        "objection handling",
        "clear CTA each email",
      ],
    },
  ],
  "brand voice guide": [
    {
      key: "product",
      label: "Brand / company",
      type: "text",
      placeholder: "e.g. A sustainable fashion brand for Gen Z...",
    },
    {
      key: "personality",
      label: "Brand personality",
      type: "multi",
      options: [
        "bold",
        "friendly",
        "authoritative",
        "playful",
        "luxurious",
        "rebellious",
        "trustworthy",
        "innovative",
      ],
    },
    {
      key: "features",
      label: "Guide sections",
      type: "multi",
      options: [
        "tone of voice",
        "words to use",
        "words to avoid",
        "writing examples",
        "audience personas",
        "messaging pillars",
      ],
    },
  ],
  "ugc brief": [
    {
      key: "product",
      label: "Product / service",
      type: "text",
      placeholder: "e.g. Skincare serum for acne-prone skin...",
    },
    {
      key: "platform",
      label: "Platform",
      type: "select",
      options: [
        "TikTok",
        "Instagram Reels",
        "YouTube Shorts",
        "Instagram Feed",
        "Facebook",
      ],
    },
    {
      key: "features",
      label: "Brief elements",
      type: "multi",
      options: [
        "hook ideas",
        "talking points",
        "do's and don'ts",
        "B-roll suggestions",
        "CTA script",
        "example references",
      ],
    },
  ],
  "campaign concept": [
    {
      key: "product",
      label: "Product / service",
      type: "text",
      placeholder: "e.g. New energy drink targeting Gen Z athletes...",
    },
    {
      key: "goal",
      label: "Campaign goal",
      type: "select",
      options: [
        "brand awareness",
        "lead generation",
        "product launch",
        "sales / conversions",
        "community building",
        "rebranding",
      ],
    },
    {
      key: "features",
      label: "Campaign elements",
      type: "multi",
      options: [
        "campaign theme / concept",
        "key messages",
        "channel strategy",
        "content pillars",
        "influencer angle",
        "paid ads angle",
        "KPIs",
      ],
    },
  ],
  "influencer brief": [
    {
      key: "product",
      label: "Product / service",
      type: "text",
      placeholder: "e.g. Productivity app for students...",
    },
    {
      key: "platform",
      label: "Platform",
      type: "select",
      options: [
        "Instagram",
        "TikTok",
        "YouTube",
        "Twitter/X",
        "LinkedIn",
        "Twitch",
      ],
    },
    {
      key: "features",
      label: "Brief elements",
      type: "multi",
      options: [
        "brand background",
        "key messages",
        "content guidelines",
        "dos and don'ts",
        "deliverables",
        "posting schedule",
        "compensation info",
      ],
    },
  ],
};

const sharedMarketingQuestions = [
  {
    key: "audience",
    label: "Target audience",
    type: "text",
    placeholder: "e.g. Female entrepreneurs aged 25–40 in the US...",
  },
  {
    key: "tone",
    label: "Brand tone",
    type: "select",
    options: [
      "bold & direct",
      "friendly & warm",
      "professional",
      "playful",
      "luxurious",
      "urgent",
      "inspirational",
    ],
  },
  {
    key: "funnelStage",
    label: "Funnel stage",
    type: "select",
    options: [
      "awareness (TOFU)",
      "consideration (MOFU)",
      "conversion (BOFU)",
      "retention / loyalty",
    ],
  },
  {
    key: "extras",
    label: "Extras",
    type: "multi",
    options: [
      "include power words",
      "add urgency / scarcity",
      "include social proof placeholders",
      "SEO optimized",
      "A/B test variant",
      "emoji-friendly",
    ],
  },
];

// ─── CAREER / HR ──────────────────────────────────────────────────────────────

const careerTypeQuestions = {
  "resume bullets": [
    {
      key: "role",
      label: "Job title / role",
      type: "text",
      placeholder: "e.g. Senior Product Manager, Full Stack Developer...",
    },
    {
      key: "achievements",
      label: "Key achievements to highlight",
      type: "text",
      placeholder:
        "e.g. Grew revenue by 30%, led team of 8, launched 3 products...",
    },
    {
      key: "features",
      label: "Bullet style",
      type: "multi",
      options: [
        "action verb start",
        "quantified results",
        "STAR format",
        "impact-first",
        "skill keywords",
        "ATS-optimized",
      ],
    },
  ],
  "job description": [
    {
      key: "role",
      label: "Job title",
      type: "text",
      placeholder: "e.g. Senior Frontend Engineer...",
    },
    {
      key: "company",
      label: "Company / team context",
      type: "text",
      placeholder: "e.g. Early-stage fintech startup, 30-person team...",
    },
    {
      key: "features",
      label: "JD sections",
      type: "multi",
      options: [
        "about the role",
        "responsibilities",
        "requirements",
        "nice to haves",
        "benefits & perks",
        "DEI statement",
        "salary range",
      ],
    },
    {
      key: "tone",
      label: "Tone",
      type: "select",
      options: [
        "formal corporate",
        "startup casual",
        "technical",
        "culture-forward",
        "inclusive",
      ],
    },
  ],
  "cover letter": [
    {
      key: "role",
      label: "Role applying for",
      type: "text",
      placeholder: "e.g. Product Designer at Notion...",
    },
    {
      key: "background",
      label: "Your background",
      type: "text",
      placeholder: "e.g. 5 years UX design, fintech and SaaS focus...",
    },
    {
      key: "features",
      label: "Letter elements",
      type: "multi",
      options: [
        "opening hook",
        "relevant experience",
        "key achievements",
        "why this company",
        "culture fit",
        "strong closing",
      ],
    },
    {
      key: "tone",
      label: "Tone",
      type: "select",
      options: ["formal", "confident", "enthusiastic", "creative", "humble"],
    },
  ],
  "interview questions": [
    {
      key: "role",
      label: "Role / position",
      type: "text",
      placeholder: "e.g. Senior Data Analyst, Marketing Manager...",
    },
    {
      key: "interviewType",
      label: "Interview type",
      type: "select",
      options: [
        "behavioral",
        "technical",
        "case study",
        "culture fit",
        "leadership",
        "full loop set",
      ],
    },
    {
      key: "features",
      label: "Question features",
      type: "multi",
      options: [
        "STAR-based questions",
        "follow-up probes",
        "red flag detectors",
        "scoring rubric",
        "sample strong answers",
        "panel interview set",
      ],
    },
  ],
  "performance review": [
    {
      key: "role",
      label: "Employee role",
      type: "text",
      placeholder: "e.g. Software Engineer, Sales Associate...",
    },
    {
      key: "period",
      label: "Review period",
      type: "select",
      options: [
        "quarterly",
        "mid-year",
        "annual",
        "probationary (90-day)",
        "project-based",
      ],
    },
    {
      key: "features",
      label: "Review sections",
      type: "multi",
      options: [
        "strengths",
        "areas for improvement",
        "goal progress",
        "next period goals",
        "overall rating justification",
        "manager comments",
        "self-assessment",
      ],
    },
    {
      key: "tone",
      label: "Tone",
      type: "select",
      options: [
        "constructive",
        "encouraging",
        "direct / honest",
        "formal",
        "coaching-focused",
      ],
    },
  ],
  "linkedin summary": [
    {
      key: "role",
      label: "Current / target role",
      type: "text",
      placeholder: "e.g. Growth Marketer transitioning to Product...",
    },
    {
      key: "background",
      label: "Your background",
      type: "text",
      placeholder:
        "e.g. 7 years in B2B SaaS, ex-Salesforce, built 0-1 products...",
    },
    {
      key: "features",
      label: "Summary elements",
      type: "multi",
      options: [
        "hook opening",
        "career story",
        "key achievements",
        "skills highlight",
        "what I'm looking for",
        "personal touch",
        "CTA / contact line",
      ],
    },
    {
      key: "tone",
      label: "Tone",
      type: "select",
      options: [
        "professional",
        "conversational",
        "bold & ambitious",
        "humble",
        "story-driven",
      ],
    },
  ],
};

const sharedCareerQuestions = [
  {
    key: "industry",
    label: "Industry",
    type: "select",
    options: [
      "Tech / Software",
      "Finance / Fintech",
      "Marketing / Advertising",
      "Healthcare",
      "Education",
      "E-commerce / Retail",
      "Consulting",
      "Other",
    ],
  },
  {
    key: "seniority",
    label: "Seniority level",
    type: "select",
    options: [
      "intern / entry level",
      "junior (1–2 yrs)",
      "mid-level (3–5 yrs)",
      "senior (5–8 yrs)",
      "lead / staff",
      "manager / director",
      "VP / C-suite",
    ],
  },
  {
    key: "extras",
    label: "Extras",
    type: "multi",
    options: [
      "ATS / keyword optimized",
      "include metrics placeholders",
      "make it concise",
      "tailor for remote roles",
      "highlight leadership",
      "highlight technical skills",
    ],
  },
];

// ─── EXPORT ───────────────────────────────────────────────────────────────────

export const questions = {
 game: (genre = "sudoku") => [
    {
      key: "genre",
      label: "Game type",
      type: "select",
      options: ["sudoku", "tower defense", "platformer", "puzzle"],
    },
    ...(genreQuestions[genre] ?? []),
    ...sharedGameQuestions,
  ],

  coding: (type = "rest api") => [
    {
      key: "type",
      label: "What are you building?",
      type: "select",
      options: [
        "rest api",
        "react component",
        "cli tool",
        "database schema",
        "chrome extension",
        "algorithm",
      ],
    },
    ...(codingTypeQuestions[type] ?? []),
    ...sharedCodingQuestions,
  ],

  writing: (type = "blog post") => [
    {
      key: "type",
      label: "What are you writing?",
      type: "select",
      options: [
        "blog post",
        "email",
        "social media post",
        "product description",
        "cover letter",
        "ad copy",
      ],
    },
    ...(writingTypeQuestions[type] ?? []),
    ...sharedWritingQuestions,
  ],

  image: (type = "portrait") => [
    {
      key: "type",
      label: "Image type",
      type: "select",
      options: [
        "portrait",
        "landscape",
        "product shot",
        "character design",
        "logo concept",
        "abstract art",
      ],
    },
    ...(imageTypeQuestions[type] ?? []),
    ...sharedImageQuestions,
  ],

  marketing: (type = "landing page copy") => [
    {
      key: "type",
      label: "What are you creating?",
      type: "select",
      options: [
        "landing page copy",
        "email sequence",
        "brand voice guide",
        "ugc brief",
        "campaign concept",
        "influencer brief",
      ],
    },
    ...(marketingTypeQuestions[type] ?? []),
    ...sharedMarketingQuestions,
  ],

  career: (type = "resume bullets") => [
    {
      key: "type",
      label: "What do you need?",
      type: "select",
      options: [
        "resume bullets",
        "job description",
        "cover letter",
        "interview questions",
        "performance review",
        "linkedin summary",
      ],
    },
    ...(careerTypeQuestions[type] ?? []),
    ...sharedCareerQuestions,
  ],
};
