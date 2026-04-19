const safe = (val, fallback) => val || fallback;
const formatList = (arr, fallback) =>
  arr?.length ? arr.map((i) => `- ${i}`).join("\n") : fallback;
const formatAdvanced = (arr) =>
  arr?.length
    ? `\n### Advanced Requirements\n${arr.map((i) => `- ${i}`).join("\n")}`
    : "";

// ─── SHARED QUALITY RULES ────────────────────────────────────────────────────

const writingQualityRules = `
### Universal Writing Quality Rules
- No filler openers: NEVER start with "In today's world", "In conclusion",
  "It's important to note", "As we all know", "With that being said"
- No passive voice where active works better
- Read every sentence aloud — if it sounds unnatural, rewrite it
- One idea per paragraph maximum
- Short sentences outperform long ones — aim for avg 15 words per sentence
- Every paragraph must earn its place — if it doesn't move the reader forward, cut it
- Specificity beats vagueness always:
    BAD:  "Many companies have seen great results"
    GOOD: "73% of B2B companies that publish 2+ blogs/week generate more leads (HubSpot)"
`;

// ─── BLOG POST ────────────────────────────────────────────────────────────────

function buildBlogPost(a) {
  const lengthMap = {
    "short (under 150 words)": {
      words: "100–150",
      paragraphs: "3–4",
      h2: "1–2",
    },
    "medium (150–400 words)": {
      words: "300–400",
      paragraphs: "5–6",
      h2: "3–4",
    },
    "long (400–800 words)": { words: "600–800", paragraphs: "8–10", h2: "4–5" },
    "detailed (800+ words)": {
      words: "1000–1200",
      paragraphs: "12+",
      h2: "5–7",
    },
  };
  const len = lengthMap[a.length] || lengthMap["medium (150–400 words)"];

  return `
### Task
Write a complete, publish-ready blog post. Every section below is MANDATORY.
Do NOT summarize or outline — write the full post.

### Title / Topic
${safe(a.title, "Untitled Blog Post")}

### Context
${safe(a.context, "No additional context provided")}

### Target Audience
- Who: ${safe(a.audience, "General public")}
- Knowledge level: adjust vocabulary and assumed knowledge accordingly
- Pain point they have that this post solves

### Tone & Voice
- Overall tone: ${safe(a.tone, "Informative and engaging")}
- Reading level: Grade 8 (Hemingway App target — clear, not dumbed down)
- POV: Second person ("you") for instructional posts, first person for opinion pieces

### Structure Specification
- Word count: ${len.words} words
- Paragraph count: ${len.paragraphs} paragraphs
- H2 subheadings: ${len.h2}
- Paragraph length: max 3 sentences each
- Sentence length: average 15 words, never exceed 30

### Required Elements
${formatList(a.features, "- Introduction hook\n- Subheadings\n- Conclusion with CTA")}

### Opening Hook Rules (CRITICAL)
The first sentence must be ONE of these hook types — choose the most powerful for the topic:
- Surprising statistic: "73% of [audience] struggle with [problem]"
- Provocative question: "What if everything you knew about [topic] was wrong?"
- Bold contrarian claim: "Stop doing [common thing] — here's why it's hurting you"
- Vivid scenario: "Picture this: [relatable situation the reader has experienced]"
NEVER start with: "In this post", "Today we're going to", "Welcome to", "Are you looking for"

### Subheading Rules
- Each H2 must be benefit-driven or curiosity-driven, not label-based
  BAD:  "## Introduction to Email Marketing"
  GOOD: "## Why 80% of Email Campaigns Fail in the First 3 Days"
- H2s must flow as a logical narrative — reader should understand the arc from H2s alone

### SEO Rules
${
  a.extras?.includes("make it SEO-friendly")
    ? `
- Target keyword implied by title — use naturally in:
  • H1 (title)
  • First 100 words
  • At least one H2
  • Meta description (155 chars max)
  • Last paragraph
- Do NOT keyword-stuff — max 1.5% keyword density
- Include 2–3 semantically related terms (LSI keywords)
`
    : "- SEO optimization not required for this piece"
}

### Extras
${formatList(a.extras, "- Standard writing")}

### Output Contract
Deliver in this exact order:
1. META DESCRIPTION (155 chars max, includes keyword, has a hook)
2. H1 TITLE (the actual post title, compelling, includes keyword if SEO)
3. FULL BLOG POST BODY (all sections, all H2s, complete paragraphs)
4. CALL TO ACTION (last paragraph — one specific, direct ask)
5. SUGGESTED TAGS (5 comma-separated tags)

${writingQualityRules}

### Final Output
- Complete, publish-ready blog post — no placeholders, no [insert here]
- Every H2 section must be fully written, not summarized
- CTA must be specific (not "let us know in the comments" — give them ONE clear next step)
`;
}

// ─── EMAIL ────────────────────────────────────────────────────────────────────

function buildEmail(a) {
  return `
### Task
Write a complete, ready-to-send email. Every field below is MANDATORY.
Do NOT leave placeholders except where [brackets] are explicitly instructed.

### Subject / Purpose
${safe(a.title, "Untitled Email")}

### Context
${safe(a.context, "No additional context")}

### Tone
${safe(a.tone, "Professional")}

### Length
${safe(a.length, "Short and concise")}

### Required Elements
${formatList(a.features, "- Subject line\n- Body\n- Professional sign-off")}

### Subject Line Rules (CRITICAL)
Write 3 subject line variants:
- Variant A: Curiosity-gap  ("The mistake 90% of [audience] make")
- Variant B: Direct benefit ("How to [outcome] in [timeframe]")
- Variant C: Personalized   ("Quick question, [First Name]")

Subject line constraints:
- Max 50 characters (preview-friendly)
- No ALL CAPS
- No spam trigger words: "Free", "Guaranteed", "Act Now", "!!!",  "Earn money"
- Preview text (90 chars) must complement, not repeat, the subject line

### Email Structure Rules
Opening line:
- NEVER start with "I hope this email finds you well"
- NEVER start with "My name is [X] and I work at [Y]"
- Lead with THEM, not you: their situation, their problem, their goal
- Max 1 sentence for the opener

Body:
- Each paragraph: max 3 sentences
- Total body: max ${safe(a.length, "150")} words
- Use line breaks between paragraphs — no walls of text
- One idea per paragraph

CTA Rules:
- ONE CTA per email — never two
- Make it specific: "Reply with 'YES' to get the guide"
  not "Feel free to reach out if you have questions"
- Low friction: the ask must take less than 2 minutes to fulfill
- If scheduling: include a Calendly-style placeholder [CALENDAR LINK]

Sign-off:
- Warm but professional
- Include: Name / Title / Company / [Optional: one-liner social proof]

### Extras
${formatList(a.extras, "- Standard email")}

### Output Contract
Deliver in this exact order:
1. SUBJECT LINE VARIANTS (A, B, C — labeled)
2. PREVIEW TEXT (for each variant)
3. EMAIL BODY (complete, ready to copy-paste)
4. SIGN-OFF
5. QUICK NOTES (2–3 bullet tips for personalizing before sending)

${writingQualityRules}

### Final Output
- Complete email, zero placeholders except [First Name], [Company], [LINK]
- All 3 subject line variants must be genuinely different strategies
- Must pass the "so what?" test on every sentence
`;
}

// ─── SOCIAL MEDIA POST ────────────────────────────────────────────────────────

function buildSocialPost(a) {
  const platformRules = {
    "Twitter/X": {
      charLimit: 280,
      format: "Thread or single tweet",
      hashtagCount: "1–2",
      emojiUsage: "Sparingly",
    },
    LinkedIn: {
      charLimit: 3000,
      format: "Hook + body + CTA, line-spaced",
      hashtagCount: "3–5",
      emojiUsage: "Minimal, professional",
    },
    Instagram: {
      charLimit: 2200,
      format: "Caption + line breaks + hashtags",
      hashtagCount: "5–15",
      emojiUsage: "Moderate",
    },
    Facebook: {
      charLimit: 63206,
      format: "Conversational, story-driven",
      hashtagCount: "1–3",
      emojiUsage: "Moderate",
    },
    TikTok: {
      charLimit: 2200,
      format: "Hook + quick value + CTA",
      hashtagCount: "3–6",
      emojiUsage: "Liberal",
    },
  };
  const rules = platformRules[a.platform] || platformRules["LinkedIn"];

  return `
### Task
Write a complete, platform-optimized social media post. Do NOT write a generic post —
it must be specifically crafted for ${safe(a.platform, "LinkedIn")} and immediately postable.

### Topic
${safe(a.title, "Untitled Post")}

### Context
${safe(a.context, "No additional context")}

### Platform
${safe(a.platform, "LinkedIn")}

### Platform Constraints
- Character limit: ${rules.charLimit} characters
- Format style: ${rules.format}
- Hashtag count: ${rules.hashtagCount}
- Emoji usage: ${rules.emojiUsage}

### Tone
${safe(a.tone, "Engaging")}

### Required Elements
${formatList(a.features, "- Hook opening\n- Main message\n- Call to action")}

### Hook Rules (CRITICAL — first 1–2 lines)
The hook must force the reader to tap "see more" or stop scrolling.
Use ONE of these proven hook formats:
- Contrarian:  "Unpopular opinion: [common belief] is wrong."
- Number hook: "I [achieved result] in [timeframe]. Here's exactly how:"
- Story open:  "3 years ago I [relatable low point]. Today [impressive outcome]."
- Bold claim:  "[Surprising statement that challenges assumptions]."
- Question:    "Why do [audience] always [common mistake]?"

NEVER start with:
- "I'm excited to share..."
- "I'm humbled to announce..."
- "Throwback to when..."
- "Just wanted to..."
- Your company name or job title

### Body Rules
${
  a.platform === "LinkedIn"
    ? `
LinkedIn-specific:
- Single sentences on their own line (line-spaced format)
- Max 5 words per standalone line for impact
- Story arc: Setup → Conflict → Resolution → Lesson
- No jargon or corporate buzzwords
`
    : ""
}
${
  a.platform === "Twitter/X"
    ? `
Twitter/X-specific:
- If thread: Tweet 1 must standalone as a hook
- Number each tweet: "1/" "2/" etc.
- End thread with a summary tweet
- Max 280 chars per tweet (check this)
`
    : ""
}
${
  a.platform === "Instagram"
    ? `
Instagram-specific:
- First line is the hook (shows before "more")
- Use line breaks to create white space
- Hashtags at the very end, separated by dots or new lines
- Story-driven captions outperform promotional ones
`
    : ""
}

### CTA Rules
- ONE specific CTA at the end
- Make it low friction: comment, share, follow, click link
- Phrase it as a question or direct instruction, not "feel free to"
  GOOD: "Drop a 🔥 if this resonated"
  GOOD: "What would you add? Comment below."
  BAD:  "Feel free to share your thoughts"

### Extras
${formatList(a.extras, "- Standard post")}

### Output Contract
Deliver in this exact order:
1. HOOK (first 1–2 lines — the scroll-stopper)
2. FULL POST BODY (complete, formatted for ${safe(a.platform, "LinkedIn")})
3. CTA LINE
4. HASHTAGS (${rules.hashtagCount}, on separate line)
5. VARIANT B (a shorter or differently-angled version of the same post)
6. BEST TIME TO POST (day + time recommendation for ${safe(a.platform, "LinkedIn")})

${writingQualityRules}

### Final Output
- Complete, copy-paste ready post — no placeholders
- Must respect the ${rules.charLimit} character limit
- Hook must be genuinely compelling, not generic
`;
}

// ─── PRODUCT DESCRIPTION ─────────────────────────────────────────────────────

function buildProductDescription(a) {
  return `
### Task
Write a complete, conversion-optimized product description.
This is NOT a spec sheet — it must sell the product emotionally and logically.

### Product
${safe(a.title, "Unnamed Product")}

### Context
${safe(a.context, "No additional context")}

### Tone
${safe(a.tone, "Professional")}

### Required Elements
${formatList(a.features, "- Key benefits\n- Features\n- Call to action")}

### Length
${safe(a.length, "Medium (150–400 words)")}

### Copywriting Framework — use FAB + PAS hybrid:
Feature → Advantage → Benefit for each key feature
Then: Problem → Agitate → Solution for the overall narrative

### Structure Specification

HEADLINE (H1):
- Outcome-focused, not product-name-focused
- Max 10 words
- Formula: "[Achieve Desired Outcome] Without [Common Pain Point]"
  Example: "Sleep Through the Night Without Waking Up Groggy"

OPENING HOOK (1–2 sentences):
- Speak directly to the reader's pain or desire
- NEVER start with the product name
- NEVER start with "Introducing..."

BENEFITS SECTION:
- Lead with benefits, follow with features
  BAD:  "Made with 400-thread-count Egyptian cotton"
  GOOD: "Wake up feeling rested — thanks to 400-thread-count Egyptian cotton
         that stays cool all night"
- List format: 3–5 bullets max
- Each bullet: benefit first (bold) + feature explanation

SOCIAL PROOF PLACEHOLDER:
${
  a.features?.includes("social proof")
    ? `
- Insert: ★★★★★ "[Specific result] — [Customer Name], [Location or Descriptor]"
- Make it specific and believable, not generic ("Great product!")
`
    : "- Social proof not requested"
}

URGENCY / SCARCITY:
${
  a.features?.includes("urgency trigger")
    ? `
- One line only — do not overdo it
- Ethical urgency only: limited stock, time-limited offer, seasonal
- NEVER fake: "Only 2 left!" if not true
`
    : "- No urgency element requested"
}

CTA:
- Action verb + specific outcome: "Add to Cart — Get Yours by [Day]"
- NOT: "Buy Now" alone — too generic
- NOT: "Click here to purchase"

### SEO Requirements
${
  a.extras?.includes("make it SEO-friendly")
    ? `
- Primary keyword in: H1, first 50 words, at least 1 subheading
- Include product category keyword naturally
- Meta description: 155 chars, includes primary keyword + benefit
`
    : "- SEO optimization not requested"
}

### Extras
${formatList(a.extras, "- Standard description")}

### Output Contract
Deliver in this exact order:
1. H1 HEADLINE (outcome-focused)
2. META DESCRIPTION (155 chars, if SEO requested)
3. OPENING HOOK (1–2 sentences)
4. BENEFITS SECTION (3–5 bullets)
5. FEATURES LIST (technical specs if applicable)
6. SOCIAL PROOF (if requested)
7. URGENCY LINE (if requested)
8. CTA
9. VARIANT HEADLINE (alternative H1 for A/B testing)

${writingQualityRules}

### Final Output
- Complete, publish-ready product description — no placeholders
- Benefits must be emotionally resonant, not just informational
- CTA must be specific and outcome-focused
`;
}

// ─── COVER LETTER ─────────────────────────────────────────────────────────────

function buildCoverLetter(a) {
  return `
### Task
Write a complete, personalized cover letter that gets interviews.
Do NOT write a generic cover letter — every paragraph must feel
specifically written for this role and this person.

### Role
${safe(a.title, "Target Role")}

### Context
${safe(a.context, "No additional context")}

### Tone
${safe(a.tone, "Confident")}

### Required Elements
${formatList(a.features, "- Opening hook\n- Relevant experience\n- Strong closing")}

### Length
${safe(a.length, "Medium (150–400 words)")} — 3–4 paragraphs maximum

### Structure Specification

PARAGRAPH 1 — HOOK OPENING:
- NEVER start with: "I am writing to apply for...", "I am excited to apply...",
  "My name is [X]", "I saw your job posting on LinkedIn"
- Start with the result, the passion, or the insight:
  "After 5 years building [X], I know exactly what it takes to [Y]."
  "The best [role title]s I've worked with all share one trait — [insight]."
  "[Company] is solving [specific problem] in a way nobody else is."
- 3–4 sentences max
- End with: one sentence connecting your background to their specific need

PARAGRAPH 2 — PROOF OF EXPERIENCE:
- Pick the ONE most relevant past experience
- Use CAR format: Context → Action → Result
- Quantify the result: numbers, percentages, scale
- Connect it explicitly to what the new role requires
- 4–5 sentences max

PARAGRAPH 3 — WHY THIS COMPANY:
- Must reference something specific about the company
  (their product, mission, recent news, culture — use [RESEARCH THIS] placeholder)
- Show you've done homework — generic "I love your company culture" is disqualifying
- Connect your values or working style to theirs specifically
- 3–4 sentences max

PARAGRAPH 4 — CLOSING:
- Confident, not apologetic
  BAD:  "I hope to hear from you at your earliest convenience"
  GOOD: "I'd welcome the chance to discuss how I can bring [specific value] to [Company]"
- Specific CTA: "I'll follow up next week, or feel free to reach me at [EMAIL]"
- Professional sign-off: "Best regards" or "Warm regards" — not "Sincerely" (dated)

### Extras
${formatList(a.extras, "- Standard cover letter")}

### Output Contract
Deliver in this exact order:
1. FULL COVER LETTER (complete, 4 paragraphs, ready to send)
2. SUBJECT LINE (if sending by email: "Application: [Role] — [Your Name]")
3. PERSONALIZATION CHECKLIST (5 bullet points of what to customize before sending)
4. WHAT TO AVOID (3 things that would weaken this specific letter)

${writingQualityRules}

### Final Output
- Complete, 3–4 paragraph cover letter — no placeholders except [RESEARCH THIS]
  and [YOUR NAME / EMAIL / PHONE]
- Must pass the "could this be sent to any company?" test — if yes, rewrite
- Opening line must be genuinely memorable
`;
}

// ─── AD COPY ─────────────────────────────────────────────────────────────────

function buildAdCopy(a) {
  const platformSpecs = {
    "Google Ads": {
      headlines: "15 headlines (max 30 chars each)",
      descriptions: "4 descriptions (max 90 chars each)",
      format: "Responsive Search Ad (RSA)",
      notes:
        "Include keywords naturally. Use title case. Add CTAs in headlines.",
    },
    "Facebook/Instagram": {
      headlines:
        "Primary text (125 chars shown before 'more'), Headline (27 chars), Description (27 chars)",
      descriptions: "3 ad variations for A/B testing",
      format: "Image or Video Ad",
      notes: "Hook in first line. Speak to pain point. One clear CTA button.",
    },
    LinkedIn: {
      headlines:
        "Intro text (150 chars), Headline (70 chars), Description (100 chars)",
      descriptions:
        "Professional tone. Lead with value. Target job title/industry.",
      format: "Sponsored Content",
      notes: "B2B focus. ROI and outcomes over emotion. Credibility-first.",
    },
    "Twitter/X": {
      headlines: "Tweet copy (280 chars max)",
      descriptions: "Card title (70 chars), Card description (100 chars)",
      format: "Promoted Tweet",
      notes: "Hook in first 5 words. Hashtag 1–2 max. Punchy and direct.",
    },
    YouTube: {
      headlines: "First 5 seconds script (non-skippable hook)",
      descriptions: "Full 30-second script + CTA card text",
      format: "In-stream Ad",
      notes:
        "Hook MUST work before skip button appears (5 sec). Brand mention early.",
    },
  };
  const spec = platformSpecs[a.platform] || platformSpecs["Facebook/Instagram"];

  return `
### Task
Write complete, high-converting ad copy for ${safe(a.platform, "Facebook/Instagram")}.
This is direct response copy — every word must earn its place and drive action.

### Product / Offer
${safe(a.title, "Unnamed Offer")}

### Context
${safe(a.context, "No additional context")}

### Platform
${safe(a.platform, "Facebook/Instagram")}

### Platform Specification
- Format: ${spec.format}
- Required fields: ${spec.headlines}
- Variations: ${spec.descriptions}
- Platform notes: ${spec.notes}

### Tone
${safe(a.tone, "Persuasive")}

### Required Elements
${formatList(a.features, "- Attention-grabbing headline\n- Unique value prop\n- Strong CTA")}

### Copywriting Framework — use PAS:
Problem → Agitate → Solution
Then layer in: Social proof → Urgency → CTA

### Hook Rules (CRITICAL — first line / first 5 seconds)
The hook must stop the scroll or prevent the skip.
Choose the most powerful format for the offer:
- Pain hook:    "Tired of [specific frustration]?"
- Result hook:  "How [specific person] got [result] in [timeframe]"
- Curiosity:    "The [counterintuitive thing] that [impressive result]"
- Social proof: "[Number] people already [achieved outcome]. Here's how:"
- Contrarian:   "Stop [common thing]. It's why you're not getting [result]."

### Power Words to Include (use 3–5 minimum)
Proven, Guaranteed, Instantly, Exclusive, Limited, Free, New,
Revealed, Secret, Transform, Effortless, Breakthrough, Finally

### CTA Rules
- ONE CTA per ad
- Action verb + specific outcome + urgency:
  GOOD: "Start Your Free Trial — Offer Ends Sunday"
  GOOD: "Get Instant Access →"
  BAD:  "Learn More"
  BAD:  "Click Here"
- Match CTA to funnel stage:
  Awareness → "Discover / Learn / See How"
  Consideration → "Get Free [Resource] / Watch Demo"
  Conversion → "Start Free Trial / Buy Now / Get Instant Access"

### Extras
${formatList(a.extras, "- Standard ad copy")}

### Output Contract
Deliver in this exact order:
1. PRIMARY COPY — Version A (full ad copy, all required fields for ${safe(a.platform, "Facebook/Instagram")})
2. PRIMARY COPY — Version B (different angle / hook — same offer)
3. PRIMARY COPY — Version C (shortest possible version — stripped to essentials)
4. HEADLINE VARIANTS (5 headline options, labeled A–E)
5. CTA VARIANTS (3 CTA options)
6. WHAT THIS AD IS DOING (2–3 sentences explaining the psychological strategy)
7. SPLIT TEST RECOMMENDATION (which 2 versions to test first and why)

${writingQualityRules}

### Final Output
- All 3 ad copy versions complete — no placeholders
- Every version must have a genuinely different hook/angle
- Character limits for ${safe(a.platform, "Facebook/Instagram")} must be respected exactly
- The copy must pass the "would I stop scrolling for this?" test
`;
}

// ─── MAIN EXPORT ─────────────────────────────────────────────────────────────

export function buildWritingPrompt(answers) {
  switch (answers.type) {
    case "blog post":
      return buildBlogPost(answers);
    case "email":
      return buildEmail(answers);
    case "social media post":
      return buildSocialPost(answers);
    case "product description":
      return buildProductDescription(answers);
    case "cover letter":
      return buildCoverLetter(answers);
    case "ad copy":
      return buildAdCopy(answers);
    default:
      return `Write a ${answers.type} about: ${safe(answers.title, "the given topic")}.\n\nContext: ${safe(answers.context, "None provided")}`;
  }
}
