const safe = (val, fallback) => val || fallback;
const formatList = (arr, fallback) =>
  arr?.length ? arr.map((i) => `- ${i}`).join("\n") : fallback;
const formatAdvanced = (arr) =>
  arr?.length ? `\n### Advanced Requirements\n${arr.map((i) => `- ${i}`).join("\n")}` : "";

// ─── SHARED QUALITY RULES ─────────────────────────────────────────────────────

const codingQualityRules = `
### Universal Code Quality Rules
- No TODO comments or stub functions — every function must be fully implemented
- No console.log left in production code — use proper logging or remove
- All async functions must have try/catch with meaningful error messages
- No hardcoded secrets, credentials, ports, or magic numbers without constants
- All exported functions must have JSDoc / docstring comments
- Consistent naming: camelCase for JS/TS variables, snake_case for Python
- Separation of concerns: routing ≠ business logic ≠ data access
- Every function does ONE thing — if it needs an "and" to describe it, split it
- Error responses must be consistent: never mix { error: "..." } and { message: "..." }
- Input validation runs BEFORE any business logic or database call
`;

// ─── REST API ─────────────────────────────────────────────────────────────────

function buildRestApi(a) {
  return `
### Task
Build a complete, production-ready REST API. Every section is MANDATORY.
Do NOT stub functions. Do NOT use placeholder comments like "// add logic here".
Every route, middleware, and utility must be fully implemented.

### Project
${safe(a.projectName, "Unnamed API")}

### Description
${safe(a.description, "A REST API")}

### Tech Stack
- Framework: ${safe(a.language, "Node.js / Express")}
- Auth: ${safe(a.auth, "JWT")}
- Database: implied by context — choose appropriate (PostgreSQL / MongoDB / SQLite)

### Folder Structure (MANDATORY — use exactly this)
\`\`\`
/
├── server.js           ← entry point, app init, listen
├── app.js              ← express setup, middleware registration, route mounting
├── /routes
│   └── [resource].js   ← route definitions only, no business logic
├── /controllers
│   └── [resource].js   ← business logic, calls services
├── /services
│   └── [resource].js   ← data access, DB queries
├── /middleware
│   ├── auth.js          ← JWT / API key verification
│   ├── validate.js      ← input validation middleware
│   └── errorHandler.js  ← global error handler
├── /models
│   └── [resource].js    ← DB schema / model definition
├── /utils
│   └── response.js      ← consistent response shape helper
└── .env.example         ← all required env vars documented
\`\`\`

### Response Shape — ALL routes must use this EXACT shape:
\`\`\`javascript
// Success
{ success: true,  data: <any>,    error: null,    meta: { page?, total?, ... } }

// Error
{ success: false, data: null,     error: "Human-readable message", code: "MACHINE_CODE" }
\`\`\`

Use a helper:
\`\`\`javascript
// utils/response.js
exports.ok    = (res, data, meta = {}) =>
  res.status(200).json({ success: true, data, error: null, meta });
exports.fail  = (res, status, message, code) =>
  res.status(status).json({ success: false, data: null, error: message, code });
\`\`\`

### API Features
${formatList(a.features, "- CRUD endpoints\n- Authentication\n- Input validation\n- Error handling")}

### Authentication — ${safe(a.auth, "JWT")}
${a.auth === "JWT" || !a.auth ? `
JWT Implementation rules:
- Access token: 15 minute expiry
- Refresh token: 7 day expiry, stored in httpOnly cookie
- Middleware: auth.js verifies Bearer token on every protected route
- Never store JWT in localStorage (XSS risk) — document this in README
- Token payload: { userId, role, iat, exp } — nothing else
- Blacklist invalidated tokens in Redis or DB on logout
` : ""}
${a.auth === "API key" ? `
API Key rules:
- Keys stored as hashed values (bcrypt) — never plaintext
- Pass in header: X-API-Key
- Rate limit per key: 1000 req/hour default
- Key rotation endpoint: POST /auth/rotate-key
` : ""}
${a.auth === "OAuth2" ? `
OAuth2 rules:
- Implement Authorization Code flow
- Store tokens server-side, return session cookie to client
- Supported providers: [specify in .env]
- Callback route: GET /auth/callback
` : ""}

### Required Endpoints — implement ALL of these:
\`\`\`
POST   /auth/register     → create user, return tokens
POST   /auth/login        → verify credentials, return tokens
POST   /auth/refresh      → rotate access token
POST   /auth/logout       → invalidate refresh token

GET    /[resource]        → list (paginated)
POST   /[resource]        → create (validated)
GET    /[resource]/:id    → get one
PUT    /[resource]/:id    → full update (validated)
PATCH  /[resource]/:id    → partial update (validated)
DELETE /[resource]/:id    → soft delete (set deletedAt, don't destroy)
\`\`\`

### Pagination — implement on ALL list endpoints:
\`\`\`javascript
// Query params: ?page=1&limit=20&sort=createdAt&order=desc
// Response meta: { page, limit, total, pages, hasNext, hasPrev }
\`\`\`

### Input Validation Rules
- Validate BEFORE any DB call
- Return 422 Unprocessable Entity for validation errors
- Error format: \`{ field: "email", message: "Must be a valid email address" }\`
- Use Joi, Zod, or express-validator — do NOT write manual if/else validation

### Error Handling — global errorHandler.js must catch:
\`\`\`javascript
// Map error types to status codes:
ValidationError   → 422
AuthError         → 401
ForbiddenError    → 403
NotFoundError     → 404
ConflictError     → 409  (duplicate resource)
RateLimitError    → 429
Default           → 500  (never expose stack trace in production)
\`\`\`

### Security Checklist — ALL must be implemented:
- [ ] helmet() middleware (sets secure HTTP headers)
- [ ] cors() with explicit origin whitelist from .env
- [ ] express-rate-limit on auth routes (max 10 req/15min)
- [ ] Input sanitization (strip HTML tags from string inputs)
- [ ] SQL injection prevention (parameterized queries only)
- [ ] .env.example with ALL required vars documented

### Code Quality
${formatList(a.quality, "- JSDoc comments\n- Error handling\n- Follow best practices")}

### Output Format
${safe(a.output, "Multiple files with structure")}

${formatAdvanced(a.advanced)}

${codingQualityRules}

### Output Contract
Deliver in this exact order:
1. FOLDER STRUCTURE (exact tree as specified above)
2. ALL SOURCE FILES (fully implemented, in folder order)
3. .env.example (all required environment variables)
4. QUICK START (5-step README section: install → configure → run → test)
5. EXAMPLE REQUESTS (curl or HTTP snippets for every endpoint)

### Final Output Requirements
- Every route fully implemented — no "// TODO" or "// add logic here"
- Auth middleware applied to all protected routes
- Global error handler catches ALL unhandled errors
- Consistent response shape on every single endpoint
- Code must run with: npm install && cp .env.example .env && npm start
`;
}

// ─── REACT COMPONENT ──────────────────────────────────────────────────────────

function buildReactComponent(a) {
  return `
### Task
Build a complete, production-ready React component.
Do NOT create a demo or example — build the REAL, reusable component.
Every prop, state, and edge case must be handled.

### Project
${safe(a.projectName, "Unnamed Component")}

### Description
${safe(a.description, "A reusable React component")}

### Language
${safe(a.language, "TypeScript")}

### Styling
${safe(a.styling, "Tailwind CSS")}

### Component Architecture Rules
\`\`\`
ComponentName/
├── index.tsx              ← public export (re-exports from ComponentName.tsx)
├── ComponentName.tsx      ← main component
├── ComponentName.types.ts ← all TypeScript interfaces/types
├── ComponentName.test.tsx ← unit tests (if requested)
└── ComponentName.stories.tsx ← Storybook (if requested)
\`\`\`

### TypeScript Contract — define ALL types explicitly:
\`\`\`typescript
// ComponentName.types.ts
export interface ComponentNameProps {
  // Required props first
  // Optional props after (marked with ?)
  // Callbacks typed with full signature: onAction: (value: string) => void
  // Children: React.ReactNode (if applicable)
  // className?: string  — always include for style extensibility
}

export interface ComponentNameState {
  // Internal state types if complex
}
\`\`\`

### Required Features
${formatList(a.features, "- Props validation\n- Loading state\n- Error state\n- Responsive")}

### State Management Rules
- Local state only for UI state (open/closed, loading, error)
- NEVER store server data in component state if parent can pass as props
- Derived state: compute from props/state, do NOT store in useState
- Loading state: show skeleton, not just spinner (better UX)
- Error state: show actionable message + retry option, not just "Error"
- Empty state: explicit empty state UI — never show a blank screen

### Accessibility (ARIA) Rules — ALL must be implemented:
- Interactive elements: button, input, select (not div with onClick)
- Focus management: trap focus in modals, return focus on close
- ARIA labels: all icon-only buttons need aria-label
- Keyboard nav: Tab, Shift+Tab, Enter, Escape must all work correctly
- Color contrast: never rely on color alone to convey meaning
- Screen reader: test with: role, aria-label, aria-describedby

### Performance Rules
${a.features?.includes("memoization (React.memo / useMemo)") ? `
- Wrap component in React.memo() if it renders frequently with same props
- useMemo() for expensive computations (not for simple values)
- useCallback() for functions passed as props to memoized children
- Add displayName for React DevTools: ComponentName.displayName = 'ComponentName'
` : "- Standard performance (no memoization requested)"}

### Styling Rules — ${safe(a.styling, "Tailwind CSS")}
${a.styling === "Tailwind CSS" || !a.styling ? `
- Use Tailwind utility classes only — no inline styles
- Responsive: mobile-first (sm: md: lg: prefixes)
- Dark mode: dark: prefix on all color utilities
- Variants: use cva() (class-variance-authority) for variant-based styling
- Never hardcode colors — use Tailwind palette or CSS variables
` : ""}
${a.styling === "CSS modules" ? `
- One .module.css file per component
- BEM-inspired naming: .container, .container__header, .container--active
- No global styles in module files
- CSS variables for theme values
` : ""}

### Code Quality
${formatList(a.quality, "- TypeScript types\n- JSDoc comments\n- Error handling")}

### Output Format
${safe(a.output, "Multiple files with structure")}

${formatAdvanced(a.advanced)}

${codingQualityRules}

### Output Contract
Deliver in this exact order:
1. ComponentName.types.ts (all interfaces)
2. ComponentName.tsx (main component, fully implemented)
3. index.tsx (re-export)
4. ComponentName.test.tsx (if unit tests requested)
5. ComponentName.stories.tsx (if Storybook requested)
6. USAGE EXAMPLE (copy-paste snippet showing the component in use with all prop variants)
7. PROPS TABLE (markdown table: Prop | Type | Required | Default | Description)

### Final Output Requirements
- Zero TypeScript errors — all types must be explicit, no 'any'
- All required features in checklist fully implemented
- Loading, error, and empty states all handled with proper UI
- Component is immediately usable — no configuration required
- Works in isolation (no global state dependencies)
`;
}

// ─── CLI TOOL ─────────────────────────────────────────────────────────────────

function buildCliTool(a) {
  return `
### Task
Build a complete, production-ready CLI tool.
Do NOT write a demo script — build a real tool someone would install and use daily.

### Project
${safe(a.projectName, "Unnamed CLI")}

### Description
${safe(a.description, "A command-line tool")}

### Runtime
${safe(a.runtime, "Node.js")}

### File Structure (MANDATORY)
\`\`\`
/
├── bin/
│   └── cli.js          ← entry point (#!/usr/bin/env node shebang)
├── src/
│   ├── commands/        ← one file per subcommand
│   ├── utils/           ← helpers (logger, config, formatters)
│   └── index.js         ← exports public API if used as a library too
├── package.json         ← bin field pointing to bin/cli.js
└── README.md            ← usage docs with examples
\`\`\`

### CLI Framework — use the right library for ${safe(a.runtime, "Node.js")}:
${a.runtime === "Node.js" || !a.runtime ? `
Use: commander.js or yargs
- commander: better for subcommand CLIs
- yargs: better for option-heavy CLIs
\`\`\`javascript
// bin/cli.js
#!/usr/bin/env node
const { program } = require('commander');
program.version(require('../package.json').version);
// mount subcommands
require('../src/commands/[command]')(program);
program.parse();
\`\`\`
` : ""}
${a.runtime === "Python" ? `
Use: click or typer
- click: battle-tested, great for complex CLIs
- typer: modern, type-hint based, auto-generates help
\`\`\`python
# cli.py
import typer
app = typer.Typer()

@app.command()
def main(name: str, verbose: bool = False):
    ...

if __name__ == "__main__":
    app()
\`\`\`
` : ""}

### Required Commands — implement ALL:
\`\`\`
[tool] --help              → show help with usage examples
[tool] --version           → show version from package.json
[tool] [command] --help    → command-specific help
[tool] [command] [args]    → main functionality
[tool] init                → interactive setup / config file creation
\`\`\`

### Required Features
${formatList(a.features, "- Argument parsing\n- Interactive prompts\n- Help text\n- Error messages")}

### Output Formatting Rules
- Use chalk (Node) or colorama (Python) for color
- SUCCESS: ✓ green text
- ERROR:   ✗ red text (to stderr, not stdout)
- WARNING: ⚠ yellow text
- INFO:    → dim text
- Never use color as the ONLY way to convey information (accessibility)
- Progress bar: use ora (Node) or tqdm (Python) for long operations
- Tables: use cli-table3 (Node) or rich (Python)

### Error Handling Rules
\`\`\`javascript
// Every command must:
try {
  // command logic
} catch (err) {
  if (err.code === 'ENOENT') {
    console.error('✗ File not found:', err.path);
    process.exit(1);
  }
  // Never expose raw stack traces to end users
  console.error('✗ Error:', err.message);
  if (process.env.DEBUG) console.error(err.stack);
  process.exit(1);
}
\`\`\`

Exit codes:
- 0 = success
- 1 = general error
- 2 = misuse of command (wrong args)
- 127 = command not found

### Interactive Prompts (if requested)
Use: inquirer (Node) or questionary (Python)
- Always validate prompt input before proceeding
- Allow --yes / -y flag to skip all confirmation prompts
- Never block automated/CI environments with required interactive prompts

### Config File (if requested)
\`\`\`javascript
// Load order (highest priority first):
// 1. CLI flags
// 2. Environment variables
// 3. .toolrc.json in current directory
// 4. ~/.toolrc.json (global user config)
// 5. Built-in defaults
\`\`\`

### Code Quality
${formatList(a.quality, "- Comments\n- Error handling\n- Follow best practices")}

${formatAdvanced(a.advanced)}

${codingQualityRules}

### Output Contract
Deliver in this exact order:
1. ALL SOURCE FILES (fully implemented, in folder order)
2. package.json (with bin field, all dependencies, scripts)
3. README.md (installation + all commands with examples)
4. EXAMPLE SESSION (terminal output showing a real usage session)
5. INSTALL INSTRUCTIONS (npm link for local dev, npm publish for release)

### Final Output Requirements
- #!/usr/bin/env node shebang on entry file (or equivalent)
- --help works on every command with useful examples
- All error messages go to stderr, all output goes to stdout
- Exits with correct exit codes
- Works after: npm install -g . (or pip install -e .)
`;
}

// ─── DATABASE SCHEMA ─────────────────────────────────────────────────────────

function buildDatabaseSchema(a) {
  return `
### Task
Design a complete, production-ready database schema.
Include migration SQL, indexes, constraints, and seed data.
Every table, column, relationship, and index must be fully specified.

### Project
${safe(a.projectName, "Unnamed Database")}

### Description
${safe(a.description, "A database schema")}

### Database
${safe(a.database, "PostgreSQL")}

### Schema Design Rules
- Naming: snake_case for all tables and columns
- Every table: id (UUID or BIGSERIAL), created_at, updated_at
- Soft delete: deleted_at TIMESTAMPTZ nullable (NULL = active)
- Primary keys: UUID for user-facing IDs, BIGSERIAL for internal join tables
- Foreign keys: always named [table]_id, always has ON DELETE behavior specified
- No nullable columns without a reason — document the reason in a comment

### Required Tables — infer from description, implement ALL relationships:
Each table definition must include:
\`\`\`sql
CREATE TABLE [name] (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- [columns with types, NOT NULL, DEFAULT, CHECK constraints]
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at  TIMESTAMPTZ           -- NULL = active (soft delete)
);
\`\`\`

### Required Features
${formatList(a.features, "- Relationships\n- Indexes\n- Timestamps\n- Soft delete")}

### Index Strategy — create indexes for ALL of these:
\`\`\`sql
-- Primary key (automatic)
-- Foreign keys (ALWAYS index FKs — prevents slow JOINs)
CREATE INDEX idx_[table]_[fk_column] ON [table]([fk_column]);

-- Soft delete queries (partial index — only active rows)
CREATE INDEX idx_[table]_active ON [table](created_at) WHERE deleted_at IS NULL;

-- Common query patterns (infer from description)
-- Email lookups → unique index
-- Status filtering → partial index per status
-- Date range queries → BRIN index for append-only tables
-- Full text search → GIN index on tsvector column
\`\`\`

### Constraints Checklist — ALL must be implemented:
- [ ] NOT NULL on every required column
- [ ] UNIQUE on business-unique fields (email, slug, username)
- [ ] CHECK constraints on enum-like columns
- [ ] FK constraints with explicit ON DELETE (CASCADE / RESTRICT / SET NULL)
- [ ] Length constraints: VARCHAR(255) not TEXT for indexed columns

### Triggers — implement these automatically:
\`\`\`sql
-- Auto-update updated_at on every UPDATE
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to every table:
CREATE TRIGGER trg_[table]_updated_at
  BEFORE UPDATE ON [table]
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
\`\`\`

### Row Level Security (if requested)
\`\`\`sql
ALTER TABLE [table] ENABLE ROW LEVEL SECURITY;

-- Users can only see their own rows
CREATE POLICY [table]_user_isolation ON [table]
  USING (user_id = current_setting('app.user_id')::UUID);
\`\`\`

### Code Quality
${formatList(a.quality, "- Comments\n- Follow best practices")}

${formatAdvanced(a.advanced)}

${codingQualityRules}

### Output Contract
Deliver in this exact order:
1. SCHEMA DIAGRAM (ASCII ERD showing tables + relationships)
2. MIGRATION FILE (complete SQL, runs top to bottom with no errors)
3. ROLLBACK MIGRATION (DROP statements in reverse order)
4. INDEX DEFINITIONS (all indexes after table creation)
5. TRIGGER DEFINITIONS (updated_at triggers for all tables)
6. SEED DATA (realistic sample data for dev/testing, 5–10 rows per table)
7. COMMON QUERIES (5–10 example queries showing how to use the schema)

### Final Output Requirements
- Migration runs cleanly on a fresh ${safe(a.database, "PostgreSQL")} database
- All FK relationships have explicit ON DELETE behavior
- Every table has the updated_at trigger
- Seed data respects all constraints and FK relationships
- No circular dependencies in FK references
`;
}

// ─── CHROME EXTENSION ────────────────────────────────────────────────────────

function buildChromeExtension(a) {
  return `
### Task
Build a complete, working Chrome Extension ready to load unpacked.
Every file must be fully implemented — no placeholders.

### Project
${safe(a.projectName, "Unnamed Extension")}

### Description
${safe(a.description, "A Chrome Extension")}

### Manifest Version
${safe(a.manifest, "Manifest V3")}

### File Structure (MANDATORY — every file must exist):
\`\`\`
/
├── manifest.json          ← complete, valid MV3 manifest
├── popup/
│   ├── popup.html         ← extension popup UI
│   ├── popup.js           ← popup logic
│   └── popup.css          ← popup styles
├── content/
│   └── content.js         ← injected into web pages
├── background/
│   └── service-worker.js  ← MV3 background service worker
├── options/
│   ├── options.html        ← settings page
│   └── options.js          ← settings logic
├── icons/
│   ├── icon16.png          ← note: generate placeholder or describe
│   ├── icon48.png
│   └── icon128.png
└── utils/
    └── storage.js          ← chrome.storage wrapper helpers
\`\`\`

### manifest.json — MUST include ALL of these correctly:
\`\`\`json
{
  "manifest_version": 3,
  "name": "${safe(a.projectName, "My Extension")}",
  "version": "1.0.0",
  "description": "${safe(a.description, "A Chrome Extension")}",
  "permissions": [],        ← only permissions actually needed
  "host_permissions": [],   ← explicit host patterns
  "action": {
    "default_popup": "popup/popup.html",
    "default_icon":  { "16": "icons/icon16.png", "48": "icons/icon48.png" }
  },
  "background": {
    "service_worker": "background/service-worker.js",
    "type": "module"
  },
  "content_scripts": [{
    "matches": ["<all_urls>"],
    "js": ["content/content.js"],
    "run_at": "document_idle"
  }],
  "options_ui": {
    "page": "options/options.html",
    "open_in_tab": true
  },
  "icons": { "16": "icons/icon16.png", "48": "icons/icon48.png", "128": "icons/icon128.png" }
}
\`\`\`

### Required Features
${formatList(a.features, "- Popup UI\n- Content script\n- Storage")}

### MV3 Rules — CRITICAL (common mistakes that break extensions):
- NO chrome.extension.* APIs (deprecated in MV3) — use chrome.runtime.*
- NO background page — use service worker only
- Service worker CANNOT access the DOM — ever
- Content scripts CANNOT call chrome.storage directly in some contexts — use messaging
- Permissions: request ONLY what you use — reviewers reject over-permissioned extensions
- chrome.action (MV3) not chrome.browserAction (MV2)

### Message Passing Pattern (content ↔ service worker ↔ popup):
\`\`\`javascript
// content.js → service worker
chrome.runtime.sendMessage({ action: 'ACTION_NAME', data: {} }, (response) => {});

// service worker listener
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'ACTION_NAME') {
    // handle
    sendResponse({ success: true, data: {} });
    return true;  // ← REQUIRED for async sendResponse
  }
});

// popup → service worker (same pattern)
\`\`\`

### Storage Pattern — use this wrapper:
\`\`\`javascript
// utils/storage.js
export const storage = {
  get: (keys) => chrome.storage.sync.get(keys),
  set: (items) => chrome.storage.sync.set(items),
  remove: (keys) => chrome.storage.sync.remove(keys),
  clear: () => chrome.storage.sync.clear(),
};
// Use chrome.storage.local for large data (>8KB)
// Use chrome.storage.sync for user preferences (syncs across devices)
\`\`\`

### Popup UI Rules:
- Max width: 400px (chrome popup constraint)
- Min dimensions: 200px × 100px
- No external font loading (CSP blocks it) — use system fonts or base64
- No inline event handlers (onclick="") — CSP blocks it — use addEventListener
- No external scripts from CDN — CSP blocks it — bundle or inline

### Code Quality
${formatList(a.quality, "- Comments\n- Error handling\n- Follow best practices")}

${formatAdvanced(a.advanced)}

${codingQualityRules}

### Output Contract
Deliver in this exact order:
1. manifest.json (complete and valid)
2. ALL source files (in folder order, fully implemented)
3. LOAD INSTRUCTIONS (step-by-step: chrome://extensions → Developer mode → Load unpacked)
4. PERMISSIONS EXPLANATION (why each permission in manifest.json is needed)
5. PUBLISH CHECKLIST (what to do before submitting to Chrome Web Store)

### Final Output Requirements
- Loads in Chrome without errors (chrome://extensions shows no warnings)
- All message passing has error handling (chrome.runtime.lastError checks)
- No MV2 APIs used anywhere
- Popup works without content script (handles case where CS isn't injected)
- Options page saves and loads correctly from chrome.storage
`;
}

// ─── ALGORITHM ────────────────────────────────────────────────────────────────

function buildAlgorithm(a) {
  return `
### Task
Implement a complete, optimized algorithm with full analysis and tests.
This is NOT pseudocode — write the full, runnable implementation.

### Project
${safe(a.projectName, "Algorithm Implementation")}

### Description
${safe(a.description, "An algorithm")}

### Language
${safe(a.language, "JavaScript")}

### Implementation Requirements
${formatList(a.features, "- Time complexity analysis\n- Space complexity analysis\n- Test cases\n- Edge case handling")}

### Implementation Structure:
\`\`\`
1. PROBLEM STATEMENT     ← LeetCode-style formal definition
2. CONSTRAINTS           ← input bounds, assumptions
3. EXAMPLES              ← 3 worked examples with explanation
4. APPROACH ANALYSIS     ← brute force → optimized (explain the insight)
5. IMPLEMENTATION        ← full working code
6. COMPLEXITY ANALYSIS   ← Big-O for time AND space, with explanation
7. TEST SUITE            ← unit tests covering all cases
8. ALTERNATIVE APPROACH  ← second implementation (different trade-off)
\`\`\`

### Complexity Analysis Format — use EXACTLY this format:
\`\`\`
Time Complexity:  O(n log n)
  - Sorting step: O(n log n)
  - Traversal:    O(n)
  - Total:        O(n log n) dominated by sort

Space Complexity: O(n)
  - Hash map stores up to n unique elements
  - Recursion stack: O(log n) → negligible
  - Total: O(n)

Can we do better?
  - Time: Yes/No — because [reason]
  - Space: Yes/No — because [reason]
\`\`\`

### Test Suite Requirements — cover ALL of these:
\`\`\`javascript
// 1. Happy path (normal input)
// 2. Empty input ([], "", 0, null)
// 3. Single element ([1], "a")
// 4. Two elements (minimum meaningful input)
// 5. Already sorted / already solved input
// 6. Reverse sorted / worst case input
// 7. Duplicates
// 8. Negative numbers (if applicable)
// 9. Maximum constraint input (performance test)
// 10. Expected output verification for each

// Format:
function test(description, fn, expected) {
  const result = fn();
  const pass = JSON.stringify(result) === JSON.stringify(expected);
  console.log((pass ? '✓' : '✗') + ' ' + description);
  if (!pass) console.log('  Expected:', expected, '\\n  Got:', result);
}
\`\`\`

### Code Quality
${formatList(a.quality, "- Step-by-step comments\n- Edge case handling\n- Best practices")}

${formatAdvanced(a.advanced)}

${codingQualityRules}

### Output Contract
Deliver in this exact order:
1. PROBLEM STATEMENT (formal definition)
2. CONSTRAINTS & ASSUMPTIONS
3. WORKED EXAMPLES (3 examples, step-by-step)
4. APPROACH (brute force first, then optimized — explain the insight)
5. OPTIMIZED IMPLEMENTATION (fully commented)
6. COMPLEXITY ANALYSIS (exact format above)
7. TEST SUITE (all 10 test categories)
8. ALTERNATIVE IMPLEMENTATION (different time/space trade-off)
9. COMPARISON TABLE (approach | time | space | when to use)

### Final Output Requirements
- Code runs without modification in ${safe(a.language, "JavaScript")}
- All 10 test categories covered with at least 1 test each
- Complexity analysis explains WHY, not just WHAT
- Alternative approach has a genuinely different time/space trade-off
- Every function has a docstring/JSDoc explaining params and return value
`;
}

// ─── MAIN EXPORT ──────────────────────────────────────────────────────────────

export function buildCodingPrompt(answers) {
  switch (answers.type) {
    case "rest api":          return buildRestApi(answers);
    case "react component":   return buildReactComponent(answers);
    case "cli tool":          return buildCliTool(answers);
    case "database schema":   return buildDatabaseSchema(answers);
    case "chrome extension":  return buildChromeExtension(answers);
    case "algorithm":         return buildAlgorithm(answers);
    default:
      return `Build a ${answers.type} for: ${safe(answers.projectName, "this project")}.\n\nDescription: ${safe(answers.description, "Not provided")}`;
  }
}