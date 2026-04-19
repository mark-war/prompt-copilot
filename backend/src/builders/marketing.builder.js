const safe = (val, fallback) => val || fallback;
const formatList = (arr, fallback) =>
  arr?.length ? arr.map((i) => `- ${i}`).join("\n") : fallback;

const marketingQualityRules = `
### Universal Marketing Copy Rules
- Every headline leads with OUTCOME, not product name
- Use customer's language, not company jargon
- One idea per sentence. Short paragraphs. White space sells.
- Every line must pass the "so what?" test
- CTAs must be specific: "Start free trial" not "Click here"
- Power words: Proven, Guaranteed, Instantly, Exclusive, Finally,
  Revealed, Transform, Effortless, Breakthrough, Limited, Free, New
- Banned phrases: "In today's world", "We are excited to announce",
  "Best in class", "Cutting edge", "Synergy", "Leverage", "World class"
- Specificity beats vagueness:
    BAD:  "Used by thousands of companies"
    GOOD: "Trusted by 14,000+ teams at Shopify, Notion, and Figma"
`;

function buildLandingPageCopy(a) {
  return `
### Task
Write complete, conversion-optimized landing page copy.
Write every section IN FULL — ready to hand directly to a designer.
Do NOT outline or summarize — write the actual copy.

### Product / Service
${safe(a.product, "An innovative product or service")}

### Unique Value Proposition
${safe(a.usp, "Saves time and delivers results faster")}

### Target Audience
${safe(a.audience, "General audience")}

### Funnel Stage
${safe(a.funnelStage, "Awareness (TOFU)")}

### Brand Tone
${safe(a.tone, "Bold & direct")}

### Sections Required
${formatList(a.features, "- Hero\n- Features\n- Benefits\n- CTA")}

### Section Specifications

HERO SECTION:
- H1: max 8 words, outcome-focused
  Formula: "[Achieve Outcome] Without [Pain Point]"
  BAD:  "Introducing TaskFlow — The Ultimate Project Manager"
  GOOD: "Ship Projects Twice as Fast, Without the Chaos"
- Subheadline: max 20 words — WHO it's for and HOW
- Hero CTA: action verb + outcome, max 5 words
- Social proof line: "[X] [customers] already [achieving outcome]"
- Deliver: 3 H1 variants for A/B testing

FEATURES SECTION:
- Exactly 3 features (odd numbers outperform even)
- Each: [Icon description] + [Title: 3 words max] + [Benefit-first description: 15 words max]
  BAD:  "AI-powered analysis — Our algorithm processes your data"
  GOOD: "Know what's working — AI surfaces your best opportunities instantly"

BENEFITS SECTION:
- Format: "[Customer outcome], so you can [deeper desire]"
- 3–5 bullets, each: bold phrase + 1-sentence explanation

SOCIAL PROOF (if requested):
- Template: ★★★★★ "[Specific result] — [Name], [Title] at [Company]"
- Specific results only: "Reduced reporting by 6 hrs/week" not "Great tool!"
- 3 testimonials minimum + 3–5 company logos [LOGO placeholders]

PRICING (if requested):
- 3-tier: Basic / Pro / Enterprise — highlight middle as "Most Popular"
- Each tier: price + 5 feature bullets + CTA

FAQ (if requested):
- 5–7 real objection-based questions from a skeptical buyer
- Direct answer first, then elaboration

FINAL CTA SECTION:
- Restate the single strongest benefit
- One outcome-driven CTA button
- Risk reducer: "No credit card required" / "Cancel anytime"

### Extras
${formatList(a.extras, "- Standard copy")}

${marketingQualityRules}

### Output Contract
1. H1 VARIANTS (3 options: A/B/C labeled)
2. FULL PAGE COPY (every section, in reading order, complete)
3. CTA VARIANTS (3 button copy options)
4. META TITLE & DESCRIPTION (60 chars / 155 chars)
5. ABOVE THE FOLD SUMMARY (hero only — for mobile preview)
6. COPY STRATEGY NOTE (psychological approach used, 2–3 sentences)
`;
}

function buildEmailSequence(a) {
  const structures = {
    "welcome sequence": ["Day 0: Welcome + deliver the promise", "Day 1: Quick win — small result immediately", "Day 3: Social proof — story of someone like them", "Day 5: Overcome the #1 objection", "Day 7: Soft pitch — introduce next step"],
    "sales sequence": ["Day 0: Agitate the pain", "Day 1: The story — someone solved this", "Day 2: The solution — introduce offer", "Day 3: Objection killer — top 3 hesitations", "Day 4: Social proof — results", "Day 5: Urgency — ethical scarcity", "Day 6: Last chance — strong close"],
    "nurture sequence": ["Email 1: Key insight — educational value", "Email 2: Case study — real result", "Email 3: Common mistake — what they do wrong", "Email 4: Tool/resource — genuinely useful", "Email 5: Behind the scenes — trust building"],
    "onboarding sequence": ["Day 0: Welcome + setup steps", "Day 1: First win — guide to first success", "Day 3: Pro tip — powerful feature they missed", "Day 7: Check-in + support offer", "Day 14: Upgrade nudge"],
    "re-engagement sequence": ["Email 1: Pattern interrupt subject line", "Email 2: Reminder of value they are missing", "Email 3: Something new since they went quiet", "Email 4: The breakup email — highest open rate"],
    "post-purchase": ["Immediate: Confirmation + what happens next", "Day 1: Quick start guide", "Day 3: Pro tips + hidden features", "Day 7: Check-in + support", "Day 14: Review request + referral ask"],
  };
  const structure = structures[a.sequenceType] || structures["welcome sequence"];

  return `
### Task
Write a complete ${safe(a.sequenceType, "welcome")} email sequence.
Every email must be FULLY written — no outlines, no placeholders except [First Name].

### Product / Service
${safe(a.product, "A product or service")}

### Audience
${safe(a.audience, "Email subscribers")}

### Sequence Type
${safe(a.sequenceType, "Welcome sequence")}

### Tone
${safe(a.tone, "Friendly & warm")}

### Sequence Structure
${structure.map((e, i) => `${i + 1}. ${e}`).join("\n")}

### Email Elements
${formatList(a.features, "- Story-based\n- Value-first\n- Clear CTA")}

### Per-Email Requirements
1. SUBJECT LINE — 3 variants (50 chars max each):
   - Variant A (Curiosity): "The [thing] nobody tells you about [topic]"
   - Variant B (Benefit): "How to [outcome] in [timeframe]"
   - Variant C (Personal): "Quick [thing], [First Name]"
2. PREVIEW TEXT (90 chars — complements, never repeats subject)
3. OPENING LINE (NEVER "I hope this email finds you well" — start with THEM)
4. BODY (max 200 words, short paragraphs, one idea each)
5. ONE CTA (specific action verb + outcome — never "feel free to reach out")
6. SIGN-OFF

### Extras
${formatList(a.extras, "- Standard")}

${marketingQualityRules}

### Output Contract
For each email deliver:
EMAIL [N] — [Purpose]
Timing: [day/trigger]
Subject A/B/C: [all three variants]
Preview: [text]
---
[Complete email body]
---
CTA: [exact text]
Performance note: [what this email optimizes for]
`;
}

function buildBrandVoiceGuide(a) {
  return `
### Task
Create a comprehensive brand voice guide specific enough that a freelance writer
with zero brand knowledge can write on-brand copy after reading it.

### Brand
${safe(a.product, "A growing brand")}

### Audience
${safe(a.audience, "Core customer")}

### Brand Personality
${formatList(a.personality, "- Bold\n- Trustworthy\n- Innovative")}

### Tone
${safe(a.tone, "Professional")}

### Guide Sections
${formatList(a.features, "- Tone of voice\n- Words to use\n- Words to avoid\n- Examples")}

### Guide Specifications

BRAND IN 3 WORDS:
For each adjective: what it means IN PRACTICE (not just the word)
Example: Bold = "We make strong claims and back them with proof. We never hedge."

TONE SPECTRUM (rate 1–10 with one-sentence explanation each):
- Formal ←————→ Casual
- Reserved ←————→ Expressive
- Serious ←————→ Playful
- Conventional ←————→ Rebellious

VOICE BY CONTEXT:
- Social media: [specific guidance]
- Email subject line: [specific guidance]
- Error message: [specific guidance — often overlooked]
- Support response: [specific guidance]
- Ad headline: [specific guidance]

WORDS TO USE (20+ organized by category):
- Power words / Brand terms / Casual industry terms

WORDS TO AVOID (15+ with replacements):
Format: ~~Avoid~~ → Use instead
~~Leverage~~ → Use
~~Synergy~~ → Collaboration
~~Best in class~~ → [specific claim]
[continue...]

BEFORE / AFTER REWRITES (5 examples minimum):
BEFORE (off-brand): [example]
AFTER (on-brand): [example]
Why: [one sentence]

MESSAGING PILLARS (3–5):
Each: Name + What it means + How it shows in copy + What it is NOT

AUDIENCE PERSONA:
Name / Who they are / What they care about / How we talk to them / What they hate hearing

### Extras
${formatList(a.extras, "- Standard guide")}

${marketingQualityRules}

### Output Contract
1. COMPLETE BRAND VOICE GUIDE (all sections above)
2. QUICK REFERENCE CARD (one-page summary for writers)
3. ONBOARDING TEST (5 sentences — writer marks on-brand vs off-brand, with answers)
`;
}

function buildUgcBrief(a) {
  return `
### Task
Write a complete UGC creator brief clear enough for a non-professional creator
to film without any additional guidance.

### Product
${safe(a.product, "A consumer product")}

### Platform
${safe(a.platform, "TikTok")}

### Audience
${safe(a.audience, "Social media users")}

### Tone
${safe(a.tone, "Authentic and relatable")}

### Brief Elements
${formatList(a.features, "- Hook ideas\n- Talking points\n- Dos and donts\n- CTA script")}

### Brief Specifications

BRAND SNAPSHOT (3 sentences max):
What it does / Who it's for / One key differentiator

CAMPAIGN OBJECTIVE (one sentence):
"This content should make the viewer [feel/think/do X]"

VIDEO SPECS:
Platform: ${safe(a.platform, "TikTok")} | Length: [X–Y seconds] | Format: [9:16 / 1:1]
Deliverables: [exact pieces required]

HOOK OPTIONS (5 — creator chooses one):
Hook 1 (Question): "[Question that resonates with viewer]"
Hook 2 (Bold claim): "[Surprising statement]"
Hook 3 (Story open): "[Relatable situation]"
Hook 4 (Visual): "[Describe what to SHOW, not say]"
Hook 5 (Trend): "[Current trending format for ${safe(a.platform, "TikTok")}]"

TALKING POINTS (in natural creator language — NOT a script):
1. The problem it solves
2. How they discovered / first used it
3. The specific result they experienced
4. One feature explained simply
5. Why they'd recommend it

CTA SCRIPT (word-for-word):
"[Exact CTA — where to find, what to do]"

DOS (5 specific):
1–4: [Specific actions that work for this product/platform]
5: Disclosure: Must say #ad or #sponsored in first 3 lines (FTC required)

DONTS (5 hard rules):
1. Do NOT mention competitors
2. Do NOT make unverified health/results claims
3–5: [Brand/platform/tone rules]

B-ROLL IDEAS (3 visual suggestions with no talking)

MUSIC GUIDANCE: Mood + Tempo (creator chooses track)

### Extras
${formatList(a.extras, "- Standard brief")}

${marketingQualityRules}

### Output Contract
1. COMPLETE CREATOR BRIEF (all sections)
2. EXAMPLE VIDEO OUTLINE (shot-by-shot ideal video)
3. CREATOR FAQ (5 common questions + answers)
4. REVISION POLICY (what warrants revision vs creator discretion)
`;
}

function buildCampaignConcept(a) {
  return `
### Task
Develop a complete marketing campaign concept ready to present to a client or team.

### Product / Service
${safe(a.product, "A brand or product")}

### Campaign Goal
${safe(a.goal, "Brand awareness")}

### Audience
${safe(a.audience, "General audience")}

### Tone
${safe(a.tone, "Bold & direct")}

### Funnel Stage
${safe(a.funnelStage, "Awareness (TOFU)")}

### Elements Required
${formatList(a.features, "- Campaign theme\n- Key messages\n- Channel strategy\n- Content pillars")}

### Campaign Specifications

CAMPAIGN IDENTITY:
- Campaign Name: [2–4 words, memorable]
- Tagline: [max 8 words]
- Concept (3 sentences): what it is + why it resonates + why now
- Core Emotion: [the ONE feeling it should evoke]

STRATEGIC FOUNDATION:
- Insight: [human truth or cultural moment being tapped]
- Tension: [problem/conflict addressed]
- Resolution: [how the brand resolves it]

KEY MESSAGES (3, hierarchical):
Primary (every piece must convey):
Secondary (most content should convey):
Supporting (some content references):

CHANNEL STRATEGY:
For each: Content format | Frequency | Role in campaign
- Paid Social | Organic Social | Email | Content/SEO | [Others per goal]

CONTENT PILLARS (3–5):
Each: [Name] — [What it covers] — [3 example content ideas]

4-WEEK TIMELINE:
Week 1 — [Phase]: [what launches]
Week 2 — [Phase]: [what launches]
Week 3 — [Phase]: [what launches]
Week 4 — [Phase]: [what wraps up]

KPIs:
Primary KPI: [the ONE number that determines success]
Secondary (3–4): [supporting metrics]
Vanity metrics to ignore: [feels good but doesn't measure real success]

BUDGET ALLOCATION (%):
Paid media / Content creation / Tools / Contingency

### Extras
${formatList(a.extras, "- Standard campaign")}

${marketingQualityRules}

### Output Contract
1. EXECUTIVE SUMMARY (one page — for client presentation)
2. FULL CAMPAIGN PLAN (all sections complete)
3. WEEK 1 CONTENT CALENDAR (day-by-day)
4. CREATIVE BRIEF (for designers and copywriters)
5. SUCCESS SCORECARD (KPI tracking template)
`;
}

function buildInfluencerBrief(a) {
  return `
### Task
Write a complete influencer partnership brief ready to send directly to a creator or manager.

### Product / Service
${safe(a.product, "A brand or product")}

### Platform
${safe(a.platform, "Instagram")}

### Audience
${safe(a.audience, "Creator's followers")}

### Tone
${safe(a.tone, "Authentic")}

### Elements Required
${formatList(a.features, "- Brand background\n- Key messages\n- Deliverables\n- Posting schedule")}

### Brief Specifications

PARTNERSHIP OVERVIEW:
Brand / Campaign / Why this creator (be specific) / Partnership type

BRAND BACKGROUND (3 sentences max):
What it does / Why it exists / Who it's for

CAMPAIGN OBJECTIVE:
"This partnership should make the audience [feel/think/do X]"

KEY MESSAGES (3):
Must communicate / Should communicate / Nice to have

DELIVERABLES (exact, no ambiguity):
[Type] | [Format] | [Length] | [Due date] — for each piece

CONTENT GUIDELINES:
Style / Authenticity note / Brand mention rules / Caption requirements

HARD DOS (5):
1–4: [Specific requirements]
5: Disclosure — #ad or #sponsored in first 3 lines (FTC required)

HARD DONTS (5):
1. No competitor mentions
2. No unverified product claims
3–5: [Brand/platform/tone rules]

POSTING SCHEDULE:
[Date/time] — [Content type] — for each deliverable

APPROVAL PROCESS:
Submit draft [X] days before / Review 48hrs / [N] revision rounds / Final approval required

COMPENSATION:
Rate / Structure / Payment terms / Product provided

TRACKING:
UTM link / Promo code [CODE] / Affiliate % if applicable

### Extras
${formatList(a.extras, "- Standard brief")}

${marketingQualityRules}

### Output Contract
1. COMPLETE INFLUENCER BRIEF (all sections, ready to send)
2. OUTREACH EMAIL (first contact to creator/manager)
3. FOLLOW-UP EMAIL (7-day follow-up)
4. CONTRACT CHECKLIST (10 legal agreement must-haves)
5. POST-CAMPAIGN REPORT TEMPLATE (metrics to collect)
`;
}

export function buildMarketingPrompt(type, answers) {
  switch (type) {
    case "landing page copy":  return buildLandingPageCopy(answers);
    case "email sequence":     return buildEmailSequence(answers);
    case "brand voice guide":  return buildBrandVoiceGuide(answers);
    case "ugc brief":          return buildUgcBrief(answers);
    case "campaign concept":   return buildCampaignConcept(answers);
    case "influencer brief":   return buildInfluencerBrief(answers);
    default:
      return `Create ${type} marketing content.\n\nProduct: ${safe(answers.product, "Not provided")}\nAudience: ${safe(answers.audience, "Not provided")}`;
  }
}