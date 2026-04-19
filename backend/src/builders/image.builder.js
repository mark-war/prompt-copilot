const safe = (val, fallback) => val || fallback;
const formatList = (arr, fallback) =>
  arr?.length ? arr.map((i) => `- ${i}`).join("\n") : fallback;
const formatInline = (arr, fallback) =>
  arr?.length ? arr.join(", ") : fallback;

// ─── PLATFORM SPECS ───────────────────────────────────────────────────────────

const PLATFORM_SPECS = {
  "Midjourney": {
    syntax: `
### Midjourney Prompt Syntax Rules
- Separate distinct concepts with :: and optional weights: forest::2 mist::1
- Parameters go at the END after --
- Common parameters:
    --ar 16:9          (widescreen) | --ar 9:16 (portrait) | --ar 1:1 (square)
    --v 6              (latest model — always use this)
    --style raw        (photorealistic, less artistic interpretation)
    --q 2              (highest quality render — slower)
    --chaos 0–100      (variation — 0=consistent, 100=wild)
    --no [terms]       (negative prompt — what to exclude)
    --seed [number]    (reproducible results)
- Do NOT use parentheses for weighting (that is SD syntax, not MJ)
- Do NOT use negative_prompt: label (use --no instead)
`,
    format: "Single paragraph, comma-separated descriptors, parameters at end",
    example: "cinematic portrait of [subject], [style], [lighting], [camera], [mood], [quality tags] --ar 16:9 --v 6 --style raw --q 2"
  },
  "DALL·E 3": {
    syntax: `
### DALL·E 3 Prompt Rules
- Write in natural language sentences — prose works better than keywords
- Be VERY specific — it follows instructions literally
- Use "I NEED" for critical requirements that must not be changed
- No celebrity names — describe physical features instead
- No named copyrighted characters — describe appearance instead
- For text-in-image: put exact text in "quotes"
- Style tip: "in the style of [art movement]" works better than artist names
`,
    format: "2–3 natural language sentences, descriptive and specific",
    example: "A photorealistic close-up portrait of [subject description]. The lighting is [lighting] with [mood]. Shot with a [camera/lens] feel, [style details]."
  },
  "Stable Diffusion": {
    syntax: `
### Stable Diffusion Prompt Rules
- Positive prompt: comma-separated keywords
- Weighting: (keyword:1.3) increases, (keyword:0.7) reduces emphasis
- Quality tags: masterpiece, best quality, ultra detailed, 8k
- Recommended: Steps 20–30, CFG Scale 7, Sampler DPM++ 2M Karras
- Checkpoint matters: Realistic Vision=photo, DreamShaper=artistic, Anything V5=anime
- Always provide BOTH positive AND negative prompts
`,
    format: "Positive prompt (keywords) + Negative prompt + Settings",
    example: "(subject:1.2), style, lighting, camera, mood, masterpiece, best quality\n\nNegative: bad anatomy, blurry, low quality, watermark, extra limbs"
  },
  "Adobe Firefly": {
    syntax: `
### Adobe Firefly Prompt Rules
- Use structured fields: Content Type, Style, Color & Tone, Lighting, Composition
- Natural language works well
- Commercially safe: trained on licensed content
- No celebrity names or branded IP
`,
    format: "Natural language description using Firefly field structure",
    example: "Content type: Photo. Subject: [description]. Style: [style]. Lighting: [lighting]. Color: [palette]."
  },
  "Ideogram": {
    syntax: `
### Ideogram Prompt Rules
- Excellent for text-in-image — put exact text in "quotes"
- Use Magic Prompt: ON for enhanced results
- Aspect ratios: 1:1, 4:3, 3:4, 16:9, 9:16
- Style presets: Realistic, Design, Anime, 3D Render, Painting
- Negative prompt supported
`,
    format: "Natural language + quoted text elements + style preset",
    example: "A minimalist logo for \"[Brand Name]\", [style], [colors], clean and professional, high resolution"
  },
  "Leonardo AI": {
    syntax: `
### Leonardo AI Prompt Rules
- Model selection:
    Leonardo Diffusion XL  → photorealism
    Anime Pastel Dream     → anime/illustration
    DreamShaper v7         → artistic/fantasy
    AlbedoBase XL          → detailed environments
- Alchemy mode: ON for highest quality
- PhotoReal: ON for photorealistic results
- Guidance Scale: 7 default
`,
    format: "Comma-separated keywords + model specification + settings",
    example: "subject, style, lighting, mood, quality tags | Model: Leonardo Diffusion XL | Alchemy: ON"
  },
};

// ─── IMAGE TYPE BUILDERS ──────────────────────────────────────────────────────

function buildPortrait(a) {
  const platform = safe(a.platform, "Midjourney");
  const spec = PLATFORM_SPECS[platform] || PLATFORM_SPECS["Midjourney"];
  return `
### Image Type
Portrait / Human Subject

### Project
${safe(a.title, "Untitled Portrait")}

### Subject
${safe(a.subject, "A person with strong, interesting features")}

### Style
${safe(a.style, "Photorealistic")} | Expression: ${safe(a.expression, "Natural, engaging")}

### Atmosphere
${safe(a.mood, "Warm and inviting")}

### Lighting
${safe(a.lighting, "Natural light")}
- Rembrandt / butterfly / split / loop — specify which
- Key light direction, fill ratio, rim light presence
- Avoid: flat lighting, direct flash

### Camera
${safe(a.camera, "85mm portrait lens")}
- f/1.8–f/2.8: blurred background | f/8: environmental portrait
- Angle: eye level / slightly above (flattering) / below (powerful)

### Portrait Features
${formatList(a.features, "- Bokeh background\n- Sharp eye focus\n- Natural skin texture")}

### Quality Tags
${formatInline(a.quality, "highly detailed, sharp focus, professional photography, award winning")}

### Negative Prompt
${formatInline(a.negative, "blurry, low quality, bad anatomy, extra fingers, watermark, text, ugly")}

${spec.syntax}

### Output Contract
Generate THREE complete, copy-paste ready prompts for ${platform}:

PROMPT A — Main (as specified):
[Full optimized prompt following ${platform} syntax]

PROMPT B — Mood Variant (same subject, different lighting/mood):
[Alternative atmosphere version]

PROMPT C — Style Variant (same subject, different artistic treatment):
[Alternative style version]

For each prompt:
- Aspect ratio recommendation + reason
- One setting to adjust if result is too dark/light/sharp/soft
`;
}

function buildLandscape(a) {
  const platform = safe(a.platform, "Midjourney");
  const spec = PLATFORM_SPECS[platform] || PLATFORM_SPECS["Midjourney"];
  return `
### Image Type
Landscape / Environmental Scene

### Project
${safe(a.title, "Untitled Landscape")}

### Scene
${safe(a.subject, "A breathtaking natural landscape")}

### Style
${safe(a.style, "Photorealistic")} | Time of Day: ${safe(a.timeOfDay, "Golden hour")}

### Atmosphere
${safe(a.mood, "Serene and expansive")}

### Lighting
${safe(a.lighting, "Natural golden hour light")}
- Color temperature: golden hour=3200K warm | blue hour=5600K cool | midday=neutral

### Camera
${safe(a.camera, "Wide angle")}
- Wide (14–24mm): expansive scenes, dramatic foreground
- Telephoto (200–400mm): compressed mountain layers, large sun/moon
- Drone: top-down or 45-degree angle

### Scene Features
${formatList(a.features, "- Dramatic clouds\n- Rich foreground detail\n- Leading lines")}

### Composition Rules
- Horizon on upper or lower third (not center)
- Leading lines: path, river, shoreline
- Clear foreground / midground / background layers

### Quality Tags
${formatInline(a.quality, "8K ultra detailed, award winning landscape photography, sharp focus, National Geographic")}

### Negative Prompt
${formatInline(a.negative, "blurry, hazy, low quality, oversaturated, flat, watermark, people, buildings")}

${spec.syntax}

### Output Contract
Generate THREE complete prompts for ${platform}:

PROMPT A — Main (optimal conditions):
[Full optimized prompt]

PROMPT B — Dramatic (stormy/moody/extreme weather):
[Same location, dramatically different conditions]

PROMPT C — Aerial (drone perspective):
[Same scene from above]

For each: aspect ratio recommendation + post-processing tip
`;
}

function buildProductShot(a) {
  const platform = safe(a.platform, "Midjourney");
  const spec = PLATFORM_SPECS[platform] || PLATFORM_SPECS["Midjourney"];
  return `
### Image Type
Commercial Product Photography

### Project
${safe(a.title, "Untitled Product Shot")}

### Product
${safe(a.subject, "A premium consumer product")}

### Background
${safe(a.background, "Pure white")}

### Style
${safe(a.style, "Photorealistic commercial photography")} | Mood: ${safe(a.mood, "Clean, professional, premium")}

### Lighting
${safe(a.lighting, "Studio lighting")}
Strategies:
- Three-point studio: key + fill + rim for full detail
- Softbox overhead: clean shadows, e-commerce standard
- Dramatic side: shadows emphasizing texture/shape
- Backlit: glow for liquids, glass, packaging
- Flat lay: overhead, no shadows

### Camera
${safe(a.camera, "Macro / close-up")}

### Shot Features
${formatList(a.features, "- Sharp product edges\n- Clean shadow\n- Premium feel")}

### Commercial Rules
- Product is the UNDISPUTED hero
- Every edge sharp — no motion blur on product
- Materials read accurately: matte vs glossy, metal vs plastic
- Colors true-to-life — no color cast from background

### Quality Tags
${formatInline(a.quality, "commercial photography, highly detailed, sharp focus, professional studio, 8K")}

### Negative Prompt
${formatInline(a.negative, "blurry, bad shadows, color cast, low quality, dirty background, distorted proportions, watermark")}

${spec.syntax}

### Output Contract
Generate FOUR complete prompts for ${platform}:

PROMPT A — Hero Shot (front-facing, optimal lighting):
PROMPT B — Detail Shot (extreme close-up of key feature/texture):
PROMPT C — Lifestyle Shot (product in use / in context):
PROMPT D — Flat Lay (overhead, styled arrangement):

For each: background recommendation + lighting note + post-processing tip
`;
}

function buildCharacterDesign(a) {
  const platform = safe(a.platform, "Midjourney");
  const spec = PLATFORM_SPECS[platform] || PLATFORM_SPECS["Midjourney"];
  return `
### Image Type
Character Design / Illustration

### Project
${safe(a.title, "Untitled Character")}

### Character
${safe(a.subject, "An original character with strong visual identity")}

### Art Style
${safe(a.artStyle, "Semi-realistic concept art")} | Visual Style: ${safe(a.style, "Digital painting")}

### Mood
${safe(a.mood, "Dramatic and powerful")} | Lighting: ${safe(a.lighting, "Dramatic side light")}

### Character Features
${formatList(a.features, "- Full body view\n- Detailed outfit\n- Dynamic action pose")}

### Design Principles
SILHOUETTE: Must be instantly recognizable as a silhouette
COLOR: Primary (60%) + Secondary (30%) + Accent (10%)
COSTUME: Function follows form, 2–3 material types minimum
POSE: Dynamic weight shift, clear motion, interesting negative space

### Art Style Breakdown
Rendering: [painterly / cell-shaded / realistic / stylized]
Line weight: [thick outlines / no outlines / varied]
Influence: [specify art movement if applicable]

### Quality Tags
${formatInline(a.quality, "highly detailed, trending on ArtStation, concept art, masterpiece, sharp focus")}

### Negative Prompt
${formatInline(a.negative, "bad anatomy, extra limbs, blurry, low quality, ugly, deformed, watermark")}

${spec.syntax}

### Output Contract
Generate FOUR complete prompts for ${platform}:

PROMPT A — Full Body (action pose):
PROMPT B — Portrait/Bust (expressions visible):
PROMPT C — Character Sheet (front/side/back reference):
PROMPT D — Scene/Action (in their environment):

For each: aspect ratio + key style terms + anatomy correction tip
Consistency tip: use --seed [number] across all four prompts
`;
}

function buildLogoConcept(a) {
  const platform = safe(a.platform, "Midjourney");
  const spec = PLATFORM_SPECS[platform] || PLATFORM_SPECS["Midjourney"];
  return `
### Image Type
Logo / Brand Mark Concept

### Project
${safe(a.title, "Untitled Logo")}

### Brand
${safe(a.subject, "A modern, memorable brand")}

### Logo Style
${safe(a.logoStyle, "Minimal geometric")} | Visual: ${safe(a.style, "Flat design, vector-like")}

### Mood
${safe(a.mood, "Professional, trustworthy, memorable")}

### Logo Features
${formatList(a.features, "- Clean lines\n- Scalable design\n- Modern aesthetic")}

### Scalability Requirements
Must work at: 512px (app icon) | 200px (website) | 16px (favicon)
Must work on: white bg | black bg | colored bg | single color (embroidery)

### Logo Prompt Rules
- Always request: "on white background, vector style, flat design"
- Max 2–3 colors for versatility
- Avoid: complex illustrations, photorealistic elements, thin lines, gradients (if flat)
- Note: AI logos are CONCEPTS — final design should be redrawn in vector (Figma/Illustrator)

### Quality Tags
${formatInline(a.quality, "vector style, flat design, clean, professional, minimal, sharp edges, white background")}

### Negative Prompt
${formatInline(a.negative, "blurry, complex, cluttered, photorealistic, watermark, shadows, low quality")}

${spec.syntax}

### Output Contract
Generate FIVE complete prompts for ${platform}:

PROMPT A — Primary Mark (icon only):
PROMPT B — Wordmark Style (typographic, text-based):
PROMPT C — Emblem/Badge (contained shape):
PROMPT D — Monochrome (black only):
PROMPT E — Dark Background Version:

For each: color palette suggestion (hex codes) + industry fit note + vector recreation note
`;
}

function buildAbstractArt(a) {
  const platform = safe(a.platform, "Midjourney");
  const spec = PLATFORM_SPECS[platform] || PLATFORM_SPECS["Midjourney"];
  return `
### Image Type
Abstract Art / Conceptual Artwork

### Project
${safe(a.title, "Untitled Abstract")}

### Concept
${safe(a.subject, "An evocative abstract composition exploring form and emotion")}

### Art Style
${safe(a.artStyle, "Geometric abstract")} | Visual: ${safe(a.style, "Digital painting")}

### Mood
${safe(a.mood, "Mysterious, thought-provoking, emotionally resonant")}

### Art Features
${formatList(a.features, "- Strong composition\n- Vibrant colors\n- Textured surface")}

### Composition Strategy
- Rule of odds: 1, 3, or 5 focal elements
- Tension: elements almost touching = visual energy
- Flow: implied movement through color temperature or shape direction
- Focal point: one area of maximum contrast draws the eye

### Color Theory
- Complementary (blue/orange): high energy, tension
- Analogous (blue/teal/green): harmony, calm
- Triadic: vibrant, dynamic balance
- Monochromatic: sophisticated, focused

### Art Movement References
Abstract Expressionism: gestural, emotional | Geometric: precise, mathematical
Color Field: large flat areas, meditative | Op Art: optical patterns
Surrealism: dreamlike, impossible | Glitch Art: digital corruption

### Quality Tags
${formatInline(a.quality, "highly detailed, masterpiece, award winning, museum quality, fine art, sharp focus")}

### Negative Prompt
${formatInline(a.negative, "blurry, low quality, cluttered, amateurish, watermark, text, ugly")}

${spec.syntax}

### Output Contract
Generate FOUR complete prompts for ${platform}:

PROMPT A — Main Concept:
PROMPT B — Color Inversion (opposite color temperature):
PROMPT C — Macro Detail (extreme zoom into composition):
PROMPT D — Series Companion (diptych partner piece):

For each: emotional target + color palette + scale recommendation for print
`;
}

// ─── MAIN EXPORT ──────────────────────────────────────────────────────────────

export function buildImagePrompt(type, answers) {
  switch (type) {
    case "portrait":         return buildPortrait(answers);
    case "landscape":        return buildLandscape(answers);
    case "product shot":     return buildProductShot(answers);
    case "character design": return buildCharacterDesign(answers);
    case "logo concept":     return buildLogoConcept(answers);
    case "abstract art":     return buildAbstractArt(answers);
    default:
      return `Generate a ${type} image.\n\nDescription: ${safe(answers.subject, "Not provided")}\nPlatform: ${safe(answers.platform, "Midjourney")}`;
  }
}