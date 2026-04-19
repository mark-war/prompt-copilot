const safe = (val, fallback) => val || fallback;
const formatList = (arr, fallback) =>
  arr?.length ? arr.map((i) => `- ${i}`).join("\n") : fallback;

const careerQualityRules = `
### Universal Career Copy Rules
- Strong action verbs ONLY: Led, Built, Grew, Launched, Reduced, Increased,
  Designed, Shipped, Automated, Negotiated, Secured, Scaled, Migrated,
  Spearheaded, Architected, Delivered, Transformed, Generated, Saved, Hired
- FORBIDDEN verbs: Responsible for, Helped, Assisted, Worked on,
  Collaborated on, Participated in, Supported, Involved in
- Quantify everything: use numbers, %, $, team size, timeframes
  BAD:  "Improved team performance"
  GOOD: "Increased team velocity by 40% by introducing weekly sprint reviews
         across a 12-person engineering team"
- Pass the "so what?" test — every statement must show IMPACT, not just ACTIVITY
- ATS-friendly: use exact job title keywords from the target role
- No pronouns (I, we, my) in resume bullets — start directly with the action verb
- Tense: past tense for previous roles, present tense for current role
`;

function buildResumeBullets(a) {
  return `
### Task
Write powerful, ATS-optimized resume bullet points.
These must be immediately usable — copy-paste ready with [X%] placeholders
where the candidate needs to fill in their actual numbers.

### Role
${safe(a.role, "Professional role")}

### Industry
${safe(a.industry, "Tech / Software")}

### Seniority
${safe(a.seniority, "Mid-level")}

### Achievements to Transform
${safe(a.achievements, "Led projects, improved processes, contributed to team goals")}

### Bullet Style
${formatList(a.features, "- Action verb start\n- Quantified results\n- Impact-first")}

### Bullet Format — use EXACTLY this structure:
[Action Verb] + [What you did] + [How / Method] + [Result with number] + [Scale/Context]

Example:
"Reduced API response time by 67% by implementing Redis caching across
 3 microservices, improving user retention by 12% (50K daily active users)"

### Bullet Quality Checklist — every bullet must pass ALL:
[ ] Starts with a strong past-tense action verb (from approved list)
[ ] Contains at least ONE number (use [X%] placeholder if unknown)
[ ] Shows IMPACT, not just activity
[ ] Is 15–25 words (one punchy sentence — never two)
[ ] Would make sense to someone outside the company
[ ] Does NOT start with "Responsible for", "Helped", "Assisted"

### CAR Format (Challenge → Action → Result):
For each achievement provided, extract:
- Challenge: what problem existed
- Action: what specifically was done
- Result: what measurably changed

### Output Requirements by Seniority
${
  a.seniority?.includes("senior") ||
  a.seniority?.includes("lead") ||
  a.seniority?.includes("manager")
    ? `
Senior/Lead/Manager level — bullets must emphasize:
- Team leadership: "Led team of [N]", "Mentored [N] engineers"
- Business impact: revenue, cost savings, retention metrics
- Strategic decisions: "Architected", "Designed the strategy for"
- Cross-functional: "Partnered with [teams]", "Aligned stakeholders"
`
    : `
Mid/Junior level — bullets must emphasize:
- Technical execution: specific technologies, methods used
- Learning velocity: "Ramped up on X in Y weeks"
- Contribution to outcomes: "Contributed to [larger result]"
- Collaboration: specific cross-functional work
`
}

### Extras
${formatList(a.extras, "- ATS optimized\n- Include metric placeholders")}

${careerQualityRules}

### Output Contract
Deliver in this exact order:

1. TRANSFORMED BULLETS (8–10, from the achievements provided above)
   Format each as:
   • [Bullet text]
   Metric placeholder: [what number to fill in]
   Impact level: [High/Medium] — why

2. BONUS BULLETS (3–4 additional bullets for common responsibilities in this role
   that weren't mentioned but are typical for ${safe(a.seniority, "mid-level")} ${safe(a.role, "this role")})

3. STRONG VERB ALTERNATIVES (for each bullet, 1 alternative verb option)

4. A/B VARIANTS (rewrite the 2 strongest bullets in a different angle)

5. ATS KEYWORDS (15–20 keywords from this role/industry to weave into bullets)
`;
}

function buildJobDescription(a) {
  return `
### Task
Write a compelling, inclusive job description that attracts top talent and
discourages underqualified applications. Every section must be fully written.

### Role
${safe(a.role, "Open position")}

### Company Context
${safe(a.company, "A growing company")}

### Industry
${safe(a.industry, "Tech / Software")}

### Seniority
${safe(a.seniority, "Mid-level")}

### Tone
${safe(a.tone, "Startup casual")}

### Sections Required
${formatList(a.features, "- About the role\n- Responsibilities\n- Requirements\n- Benefits")}

### JD Specifications

OPENING (2–3 sentences — sell the role AND the company):
- Lead with the impact of the role: "You'll be the [X] who [does Y] that [outcome]"
- Why this role matters to the company mission
- What makes this team / company different
- NEVER start with: "We are looking for a..."

ABOUT THE ROLE (2–3 sentences):
What this person actually does day-to-day. Be honest and specific.
Include: team size, reporting structure, what success looks like in 90 days

RESPONSIBILITIES (6–8 bullets):
- Start each with an action verb (present tense: "Design", "Build", "Lead")
- Describe actual work, not vague duties
- Include the scope: "for a platform serving [X] users" / "across [N] products"
  BAD:  "Manage projects"
  GOOD: "Own the end-to-end delivery of 2–3 product features per quarter,
         from spec to production, coordinating with design and QA"

REQUIREMENTS — split into two clear sections:
MUST HAVE (5–6 items — if they don't have these, don't apply):
- Be specific: "3+ years of Python" not "experience with programming"
- Include: years of experience, specific tools/technologies, domain knowledge

NICE TO HAVE (3–4 items — bonus, not required):
- Things that would accelerate ramp-up
- Preferred but not dealbreakers

WHAT WE OFFER — BENEFITS (5+ specific items):
- No generic placeholders — write actual benefits
  BAD:  "Competitive salary"
  GOOD: "$130K–$160K base + equity (0.1–0.3%) + annual performance bonus"
- Include: compensation range, equity, PTO, health, remote policy, growth

DEI CLOSING STATEMENT:
- Inclusive closing encouraging diverse candidates to apply
- Avoid: "We are an equal opportunity employer" alone (too corporate)
- Add: "We know [role] skills come from many paths — if you're [X% qualified],
  we encourage you to apply"

### Extras
${formatList(a.extras, "- ATS optimized\n- Highlight technical skills")}

${careerQualityRules}

### Output Contract
1. COMPLETE JOB DESCRIPTION (all sections, ready to post)
2. JOB POSTING TITLE VARIANTS (3 options — different keyword combinations for job boards)
3. SHORT VERSION (150 words — for LinkedIn / social media posting)
4. SCREENING QUESTIONS (5 application questions to filter qualified candidates)
5. INTERVIEW KICK-OFF (opening question to start the interview for this role)
`;
}

function buildCoverLetter(a) {
  return `
### Task
Write a complete, personalized cover letter that gets interviews.
It must NOT be generic — every paragraph must feel written for this specific role.

### Role
${safe(a.role, "Target position")}

### Background
${safe(a.context || a.background, "An experienced professional")}

### Industry
${safe(a.industry, "Tech / Software")}

### Seniority
${safe(a.seniority, "Mid-level")}

### Tone
${safe(a.tone, "Confident")}

### Required Elements
${formatList(a.features, "- Opening hook\n- Relevant experience\n- Key achievement\n- Strong closing")}

### Structure Specification (4 paragraphs, max 400 words total)

PARAGRAPH 1 — HOOK (3–4 sentences):
NEVER start with:
"I am writing to apply for...", "I am excited to apply...",
"My name is [X]", "I saw your job posting on..."
Instead start with:
- The result: "After [X] years building [thing], I know exactly what [outcome] takes."
- The insight: "The best [role]s I've worked with all share one quality — [insight]."
- The mission: "[Company]'s approach to [problem] is the one I've been looking for."
End paragraph 1 with: one sentence connecting your background to their specific need.

PARAGRAPH 2 — PROOF (4–5 sentences):
- ONE most relevant past experience
- CAR format: Context (1 sentence) → Action (2 sentences) → Result (1 sentence with number)
- Connect explicitly: "This directly applies to [Company]'s need for [X]"

PARAGRAPH 3 — WHY THIS COMPANY (3–4 sentences):
- Must reference something SPECIFIC: product, mission, recent news, team, culture
- Use [RESEARCH THIS] placeholder where candidate must personalize
- Generic = disqualifying: "I love your company culture" is NOT specific enough
- Connect your values or working style to theirs

PARAGRAPH 4 — CLOSING (2–3 sentences):
BAD:  "I hope to hear from you at your earliest convenience"
GOOD: "I'd welcome the chance to show you how I can [specific value] at [Company]"
- Specific CTA: "I'll follow up on [Day], or reach me at [EMAIL]"
- Sign-off: "Best regards" or "Warm regards" — not "Sincerely" (dated)

### Extras
${formatList(a.extras, "- ATS optimized")}

${careerQualityRules}

### Output Contract
1. COMPLETE COVER LETTER (4 paragraphs, max 400 words, ready to send)
2. EMAIL SUBJECT LINE (if applying by email: "Application: [Role] — [Name]")
3. PERSONALIZATION CHECKLIST (5 specific things to customize before sending)
4. COMMON MISTAKES TO AVOID (3 things that would weaken this specific letter)
5. FOLLOW-UP EMAIL (send if no response in 7 days — complete, ready to use)
`;
}

function buildInterviewQuestions(a) {
  return `
### Task
Generate a comprehensive interview question set with full evaluation guidance.
This is NOT a list of questions — it's a complete interview toolkit.

### Role
${safe(a.role, "Open position")}

### Industry
${safe(a.industry, "Tech / Software")}

### Seniority
${safe(a.seniority, "Mid-level")}

### Interview Type
${safe(a.interviewType, "Behavioral")}

### Question Features
${formatList(a.features, "- STAR-based\n- Follow-up probes\n- Scoring rubric")}

### Question Specifications

For EACH question deliver:
QUESTION: [The main question]
INTENT: [What competency/trait this reveals]
FOLLOW-UPS (2): [Deeper probes if answer is surface-level]
GREEN FLAGS: [What a strong answer sounds like — specific indicators]
RED FLAGS: [What to watch for — specific warning signs]
SCORE 1 (Poor): [What this looks like]
SCORE 3 (Meets): [What this looks like]
SCORE 5 (Exceptional): [What this looks like]

### Question Categories — include questions from ALL relevant types:

BEHAVIORAL (STAR-based):
- "Tell me about a time you [competency relevant to role]..."
- "Describe a situation where you had to [challenge relevant to seniority]..."
- "Give me an example of when you [specific skill needed for this role]..."

TECHNICAL/SKILLS (if applicable for ${safe(a.role, "the role")}):
- Role-specific technical questions
- Practical problem-solving scenarios
- Tool/technology proficiency questions

SITUATIONAL:
- "What would you do if [hypothetical work scenario]..."
- "How would you handle [common challenge in this role]..."

CULTURE FIT (2 questions minimum):
- Questions revealing working style, values, collaboration approach
- "What kind of environment do you do your best work in?"

REVERSE QUESTIONS (for candidate to ask):
- 5 questions this candidate SHOULD ask — that signal seriousness and preparation

### Extras
${formatList(a.extras, "- Scoring rubric\n- Sample strong answers")}

${careerQualityRules}

### Output Contract
1. COMPLETE QUESTION BANK (10–12 questions, full evaluation format above)
2. INTERVIEW STRUCTURE (recommended order + timing for a 60-min interview)
3. SCORING RUBRIC (summary scorecard for all competencies evaluated)
4. RED FLAG SUMMARY (top 5 red flags to watch across all answers)
5. POST-INTERVIEW DEBRIEF TEMPLATE (standardized evaluation form)
`;
}

function buildPerformanceReview(a) {
  return `
### Task
Write a thorough, fair, and legally defensible performance review.
Every section must be specific, evidence-based, and growth-oriented.
No vague praise ("great team player") and no vague criticism ("needs improvement").

### Employee Role
${safe(a.role, "Team member")}

### Industry
${safe(a.industry, "Tech / Software")}

### Seniority
${safe(a.seniority, "Mid-level")}

### Review Period
${safe(a.period, "Annual")}

### Tone
${safe(a.tone, "Constructive")}

### Sections Required
${formatList(a.features, "- Strengths\n- Areas for improvement\n- Goal progress\n- Next period goals")}

### Review Specifications

STRENGTHS (3–4 observations):
Each must be:
- Specific and evidence-based: "In Q3, [Employee] demonstrated X by doing Y, which resulted in Z"
- Tied to business impact: how did this strength help the team or company?
- Genuine: not generic ("great communicator") — specific to THIS person's behavior
Format: [Observation] → [Evidence] → [Impact]

AREAS FOR IMPROVEMENT (2–3):
Each must be:
- Specific behavior, not personality: "The technical documentation for Project X was incomplete"
  NOT: "Needs to be more detail-oriented"
- Actionable: include a concrete suggestion for how to improve
- Proportionate: frame as development opportunity, not failure
Format: [Gap observed] → [Specific example] → [Suggested action] → [Support offered]

GOAL PROGRESS (assess 3–5 prior goals):
For each goal:
- Goal stated: [what was set at start of period]
- Status: [Achieved / Partially achieved / Not achieved]
- Evidence: [specific outcome or activity]
- Context: [any relevant external factors]

NEXT PERIOD GOALS (3–5 SMART goals):
Each goal must be:
- Specific: clear deliverable or outcome
- Measurable: how will success be determined?
- Achievable: realistic given role and resources
- Relevant: tied to team/company objectives
- Time-bound: due date or milestone
Format: Goal + Success metric + Due date + Support needed

OVERALL SUMMARY (2–3 sentences):
- Balanced, honest assessment
- Forward-looking: where is this person headed?
- Must be something you'd say directly to the employee

RATING JUSTIFICATION (if applicable):
- Connect rating to specific examples from above
- Never use rating alone without evidence

### Extras
${formatList(a.extras, "- Make it concise\n- Coaching-focused")}

${careerQualityRules}

### Output Contract
1. COMPLETE PERFORMANCE REVIEW (all sections, [Employee Name] placeholder)
2. MANAGER TALKING POINTS (bullet points for the face-to-face review meeting)
3. EMPLOYEE SELF-ASSESSMENT TEMPLATE (matching questions for employee to complete first)
4. LEGAL REVIEW CHECKLIST (5 things to check before submitting to HR)
`;
}

function buildLinkedinSummary(a) {
  return `
### Task
Write a compelling LinkedIn About section that attracts the right opportunities
and makes the right people want to reach out.

### Role / Target
${safe(a.role, "Professional")}

### Background
${safe(a.context || a.background, "An experienced professional")}

### Industry
${safe(a.industry, "Tech / Software")}

### Seniority
${safe(a.seniority, "Mid-level")}

### Tone
${safe(a.tone, "Conversational")}

### Elements Required
${formatList(a.features, "- Hook opening\n- Career story\n- Key achievements\n- CTA")}

### Summary Specifications

LENGTH: 220–260 words (LinkedIn shows ~3 lines before "see more" on mobile)
VOICE: First person, conversational but professional — not third person bio
TENSE: Mix of past (experience) and present (current focus)

LINE 1 — THE HOOK (must force "see more" tap):
This is the MOST important line — it shows in search results.
Options:
- Bold claim: "I've [impressive outcome] in [timeframe]."
- Contrarian: "Most [role titles] get [common thing] wrong. Here's what actually works."
- Identity: "I build [thing] that [outcome] for [specific audience]."
- Question: "What separates [good] from [great] in [field]? I've spent [X] years finding out."
NEVER start with: "I am a passionate...", "With X years of experience...",
"I am a results-driven...", your job title

CAREER STORY (3–4 sentences):
- Where you started → pivotal moment → where you are → where you're going
- Include ONE specific achievement with a number
- Keep it human — mention the WHY behind your career moves

KEY ACHIEVEMENTS (2–3, embedded in the story or as a brief list):
- Format: "[Action] → [Number] result"
- Use actual numbers or [X%] placeholder

CURRENT FOCUS (1–2 sentences):
- What you're working on or interested in right now
- What kinds of problems you're excited to solve

KEYWORDS (embed naturally — do NOT list them):
8–10 industry keywords for LinkedIn search visibility
Examples for ${safe(a.industry, "Tech")}: [role title variations, key skills, tools, methodologies]

CTA — CLOSING LINE (1 sentence):
- What you want: conversations, opportunities, connections, collaborators
- How to reach you: "DM me" / "Connect with me" / "Reach me at [EMAIL]"
- NEVER end with nothing — always have a CTA

### Extras
${formatList(a.extras, "- ATS optimized\n- Highlight technical skills")}

${careerQualityRules}

### Output Contract
1. COMPLETE LINKEDIN SUMMARY (220–260 words, first person, ready to paste)
2. HEADLINE VARIANTS (5 LinkedIn headline options — 220 chars max each)
   Format: [Role] | [Value prop] | [Who you help or what you do]
3. CONNECTION REQUEST NOTE (300-char note for cold outreach — the tiny message box)
4. FEATURED SECTION SUGGESTIONS (3 things to pin to the Featured section)
5. KEYWORD AUDIT (10 high-value keywords for this role/industry — verify these are in the summary)
`;
}

export function buildCareerPrompt(type, answers) {
  switch (type) {
    case "resume bullets":
      return buildResumeBullets(answers);
    case "job description":
      return buildJobDescription(answers);
    case "cover letter":
      return buildCoverLetter(answers);
    case "interview questions":
      return buildInterviewQuestions(answers);
    case "performance review":
      return buildPerformanceReview(answers);
    case "linkedin summary":
      return buildLinkedinSummary(answers);
    default:
      return `Create ${type} career content.\n\nRole: ${safe(answers.role, "Not provided")}\nIndustry: ${safe(answers.industry, "Not provided")}`;
  }
}
