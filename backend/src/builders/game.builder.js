const safe = (val, fallback) => val || fallback;

const formatList = (arr, fallback) =>
  arr?.length ? arr.map((i) => `- ${i}`).join("\n") : fallback;

const qualityRules = `
### Code Quality Rules
- No undefined variables or missing initialization
- All arrays and objects must be initialized before use
- All event listeners must be cleaned up properly
- No infinite loops — all loops must have a guaranteed exit condition
- requestAnimationFrame loop must check a running flag to stop cleanly
- All game objects (enemies, bullets, particles) must be removed from their arrays when off-screen or destroyed
- Never push to an array inside a loop that iterates the same array
- All collision detection must handle empty arrays gracefully

### Game State Machine
The game must have exactly these states: "start" | "running" | "paused" | "gameover"
- Only run game logic when state === "running"
- Keyboard and click handlers must check current state before acting
- Restarting must fully reset ALL state: score, lives, level, arrays, speeds, timers

### Performance Rules
- Cap enemy/bullet/particle count — never let arrays grow unbounded
- Clear the canvas fully each frame before redrawing
- Do not create new objects (new Array, new Object) inside the animation loop
- Use object pooling or splice to remove dead entities immediately

### Progression Rules
- Difficulty must increase gradually — define a clear formula (e.g. every 10 seconds or every N enemies killed, increase speed by X)
- The game must never reach a state where progression stops (e.g. no enemies spawning, score frozen)
- Always spawn at least one enemy if the enemies array is empty and state is running
`;

const defaultControls = `
Desktop:
- Arrow keys or WASD → Move
- Spacebar → Action

Mobile:
- Touch controls → Interact
`;

export function buildGamePrompt(a) {
  switch (a.genre) {
    case "sudoku":
      return buildSudoku(a);
    case "tower defense":
      return buildTowerDefense(a);
    case "platformer":
      return buildPlatformer(a);
    case "puzzle":
      return buildPuzzle(a);
    default:
      return "Invalid genre";
  }
}

function buildSudoku(a) {
  return `
### Game
${safe(a.name, "Sudoku")}

### Setting / Theme
${safe(a.theme, "Clean minimal puzzle board")}

### Objective
Build a fully working, feature-complete, bug-free Sudoku game using ${safe(a.tech, "HTML, CSS, and JavaScript")}.
This is a STRICT specification. Every rule below is MANDATORY, not optional.
Do NOT skip any section. Do NOT simplify any mechanic.

### MANDATORY FEATURE CHECKLIST
The following features MUST be present and working before output is considered complete:
[ ] Start screen with Mode Selection (Journey vs Level vs Daily)
[ ] Level Mode: 4 difficulty buttons (Easy / Medium / Hard / Expert)
[ ] Journey Mode: auto-progression through Easy → Medium → Hard → Expert
[ ] Journey progress persisted in localStorage
[ ] Daily Challenge: same puzzle for all users on same date via seeded RNG
[ ] Puzzle generation using backtracking (valid + uniquely solvable)
[ ] Real-time win detection — triggers IMMEDIATELY when all 81 cells are correctly filled
[ ] Keyboard input 1–9 working on desktop (main keys + numpad)
[ ] Arrow key navigation between cells
[ ] On-screen numpad working on mobile
[ ] P key toggles pencil mode (must show visual indicator on button)
[ ] Backspace/Delete erases selected cell
[ ] Ctrl+Z undoes last action, Ctrl+Y redoes
[ ] Pencil marks display as 3x3 mini-grid inside cell
[ ] Confirmed input erases matching pencil marks from same row/col/box
[ ] Mistake highlighting (red flash + persistent red) — toggleable ON/OFF
[ ] Auto-candidate engine fills all valid candidates on demand
[ ] Smart highlighting — row, col, box, and matching numbers on cell select
[ ] Remaining number counter (how many of each digit left to place)
[ ] Timer starts on first input, pauses on window blur, stops on win
[ ] Hint system (3 hints per puzzle, deducted from HUD)
[ ] Win screen is mode-aware (Journey / Level / Daily show different buttons)
[ ] Pause screen hides the board
[ ] Back button returns to start screen with confirmation

═══════════════════════════════════════════════════
### SCREEN SYSTEM
═══════════════════════════════════════════════════

The game has FOUR screens. Only ONE visible at a time.
Use display:flex / display:none to switch between them.
NEVER render the game board until the player has selected a mode and difficulty.

\`\`\`javascript
function showScreen(name) {
  ['start','game','pause','win'].forEach(s => {
    document.getElementById('screen-' + s).style.display = 'none';
  });
  document.getElementById('screen-' + name).style.display = 'flex';
}
\`\`\`

The start screen has THREE internal sub-views:
\`\`\`javascript
function showStartView(name) {
  ['mode','difficulty','journey'].forEach(v => {
    document.getElementById('start-view-' + v).style.display = 'none';
  });
  document.getElementById('start-view-' + name).style.display = 'flex';
}
\`\`\`

═══════════════════════════════════════════════════
### SCREEN 1: START SCREEN (#screen-start)
═══════════════════════════════════════════════════

Visible on page load. Contains three sub-views.

─────────────────────────────────────────────
SUB-VIEW 1: MODE SELECTION (#start-view-mode)
Shown first on page load.
─────────────────────────────────────────────

Contains:
- Game title / logo
- Two large clickable mode cards side by side:

  ┌─────────────────────┐  ┌─────────────────────┐
  │   🗺 Journey Mode   │  │   🎯 Level Mode      │
  │                     │  │                     │
  │  Start Easy, auto-  │  │  Pick your own      │
  │  progress to harder │  │  difficulty level   │
  │  puzzles as you win │  │  anytime            │
  │                     │  │                     │
  │  [ Start Journey ]  │  │  [ Choose Level ]   │
  └─────────────────────┘  └─────────────────────┘

- Daily Challenge button below both cards:
  "🗓 Daily Challenge — {Month} {Day}, {Year}"

\`\`\`javascript
document.getElementById('btn-start-journey').addEventListener('click', () => {
  showStartView('journey');
  updateJourneyPreview();
});

document.getElementById('btn-choose-level').addEventListener('click', () => {
  showStartView('difficulty');
});
\`\`\`

─────────────────────────────────────────────
SUB-VIEW 2: LEVEL MODE (#start-view-difficulty)
─────────────────────────────────────────────

Contains:
- "← Back" button → showStartView('mode')
- "Choose Your Difficulty" heading
- Four difficulty buttons in a 2x2 grid with sub-labels:

  [ 🟢 Easy    "46–50 clues · Perfect for beginners"  ]
  [ 🟡 Medium  "32–45 clues · Requires elimination"   ]
  [ 🔴 Hard    "22–31 clues · Advanced techniques"    ]
  [ 💀 Expert  "17–21 clues · Maximum challenge"      ]

\`\`\`javascript
function startLevelMode(difficulty) {
  currentMode       = 'level';
  currentDifficulty = difficulty;
  isDaily           = false;
  const clues = { easy: 48, medium: 36, hard: 26, expert: 18 };
  generatePuzzle(clues[difficulty], Math.random);
  resetGameState();
  showScreen('game');
  updateDifficultyBadge();
  renderAllCells();
}
\`\`\`

─────────────────────────────────────────────
SUB-VIEW 3: JOURNEY MODE (#start-view-journey)
─────────────────────────────────────────────

Contains:
- "← Back" button → showStartView('mode')
- Journey progress display:

  Stage 1 · Easy    ████████████ 3/3 ✓ Complete
  Stage 2 · Medium  ████░░░░░░░░ 1/3 In Progress  ← current
  Stage 3 · Hard    ░░░░░░░░░░░░ 0/3 Locked 🔒
  Stage 4 · Expert  ░░░░░░░░░░░░ 0/3 Locked 🔒

- [ Continue Journey ] or [ Start Journey ] button
- Journey stats: "Total solved: X · Best time: MM:SS"

\`\`\`javascript
const JOURNEY_STAGES = [
  { difficulty: 'easy',   puzzlesRequired: 3, label: 'Stage 1 · Easy'   },
  { difficulty: 'medium', puzzlesRequired: 3, label: 'Stage 2 · Medium' },
  { difficulty: 'hard',   puzzlesRequired: 3, label: 'Stage 3 · Hard'   },
  { difficulty: 'expert', puzzlesRequired: 3, label: 'Stage 4 · Expert' },
];

function loadJourneyProgress() {
  const saved = localStorage.getItem('sudoku_journey');
  if (!saved) return {
    currentStage : 0,
    puzzlesWon   : [0, 0, 0, 0],
    totalSolved  : 0,
    bestTime     : null,
  };
  return JSON.parse(saved);
}

function saveJourneyProgress(progress) {
  localStorage.setItem('sudoku_journey', JSON.stringify(progress));
}

function updateJourneyPreview() {
  const progress = loadJourneyProgress();
  JOURNEY_STAGES.forEach((stage, i) => {
    const won      = progress.puzzlesWon[i];
    const required = stage.puzzlesRequired;
    const isActive = i === progress.currentStage;
    const isDone   = won >= required;
    const isLocked = i > progress.currentStage;
    // Render progress bar, label, and status for each stage
    // isDone   → show ✓ Complete
    // isActive → show X/Y In Progress
    // isLocked → show 🔒 Locked, dim the row
  });

  const btn = document.getElementById('btn-continue-journey');
  btn.textContent = progress.totalSolved === 0 ? 'Start Journey' : 'Continue Journey';
  document.getElementById('journey-total').textContent = progress.totalSolved;
  document.getElementById('journey-best').textContent  =
    progress.bestTime ? formatTime(progress.bestTime) : '--:--';
}

function startJourneyMode() {
  const progress    = loadJourneyProgress();
  const stage       = JOURNEY_STAGES[progress.currentStage];
  currentMode       = 'journey';
  currentDifficulty = stage.difficulty;
  currentStage      = progress.currentStage;
  isDaily           = false;
  journeyStageAdvanced = false;
  journeyCompleted     = false;

  const clues = { easy: 48, medium: 36, hard: 26, expert: 18 };
  generatePuzzle(clues[stage.difficulty], Math.random);
  resetGameState();
  showScreen('game');
  updateDifficultyBadge();
  renderAllCells();
}
\`\`\`

═══════════════════════════════════════════════════
### SCREEN 2: GAME SCREEN (#screen-game)
═══════════════════════════════════════════════════

Hidden on load. Shown after startLevelMode(), startJourneyMode(), or startDailyChallenge().

Contains top to bottom:
1. Top bar:
   [ ← Back ]  [ difficulty-badge ]  [ timer-display ]

2. Toolbar:
   [ Undo ] [ Redo ] [ Pencil: OFF ] [ Auto Candidates ] [ Hint (3) ] [ Mistakes: ON ]

3. 9×9 Sudoku board (#board)

4. Remaining numbers bar (#remaining-bar)
   Shows: 1×4  2×3  3×7 ... (how many of each digit still unplaced)

5. On-screen numpad (#numpad)
   [ 1 ][ 2 ][ 3 ][ 4 ][ 5 ][ 6 ][ 7 ][ 8 ][ 9 ][ ✕ ]

6. HUD: Mistakes: <span id="mistake-count">0</span>

Back button:
\`\`\`javascript
document.getElementById('btn-back').addEventListener('click', () => {
  if (confirm('Go back to menu? Your progress will be lost.')) {
    clearInterval(timerInterval);
    gameState = 'idle';
    showScreen('start');
    showStartView('mode');
  }
});
\`\`\`

═══════════════════════════════════════════════════
### SCREEN 3: PAUSE OVERLAY (#screen-pause)
═══════════════════════════════════════════════════

position: fixed, full screen overlay on top of game screen.
Hides the board so user cannot see puzzle while paused.

Contains:
- "Game Paused" heading
- Current time display
- [ Resume ]         → resumeGame()
- [ Restart ]        → startGame() based on currentMode
- [ Main Menu ]      → showScreen('start') + showStartView('mode')

\`\`\`javascript
function pauseGame() {
  if (gameState !== 'running') return;
  gameState = 'paused';
  clearInterval(timerInterval);
  document.getElementById('pause-time').textContent = formatTime(timerSeconds);
  showScreen('pause');
}

function resumeGame() {
  if (gameState !== 'paused') return;
  gameState = 'running';
  if (timerStarted) startTimer();
  showScreen('game');
}

// Pause when window loses focus (desktop only)
window.addEventListener('blur', () => {
  if (gameState === 'running') pauseGame();
});
\`\`\`

═══════════════════════════════════════════════════
### SCREEN 4: WIN OVERLAY (#screen-win)
═══════════════════════════════════════════════════

position: fixed, full screen overlay. Shown after triggerWin().

Contains:
- "🎉 Puzzle Solved!" heading
- Time: <span id="win-time">
- Mistakes: <span id="win-mistakes">
- Hints used: <span id="win-hints">
- Mode-aware section (only one visible at a time):

  Journey section (#win-journey-section):
    <p id="win-journey-msg">   ← updated by showWinScreen()
    [ Next Puzzle → ]          id="btn-next-puzzle"
    [ Main Menu ]

  Level section (#win-level-section):
    [ Play Again ]
    [ Change Difficulty ]      → showStartView('difficulty')
    [ Main Menu ]

  Daily section (#win-daily-msg):
    "Daily Challenge Complete! Come back tomorrow. 🗓"
    [ Main Menu ]

\`\`\`javascript
function showWinScreen() {
  document.getElementById('win-time').textContent     = formatTime(timerSeconds);
  document.getElementById('win-mistakes').textContent = mistakeCount;
  document.getElementById('win-hints').textContent    = hintsUsed;

  const journeySection = document.getElementById('win-journey-section');
  const levelSection   = document.getElementById('win-level-section');
  const dailyMsg       = document.getElementById('win-daily-msg');

  journeySection.style.display = 'none';
  levelSection.style.display   = 'none';
  dailyMsg.style.display       = 'none';

  if (currentMode === 'journey') {
    journeySection.style.display = 'flex';
    const progress = loadJourneyProgress();

    if (journeyCompleted) {
      document.getElementById('win-journey-msg').textContent =
        '🏆 Journey Complete! You conquered all 4 stages!';
      document.getElementById('btn-next-puzzle').style.display = 'none';

    } else if (journeyStageAdvanced) {
      const nextStage = JOURNEY_STAGES[progress.currentStage];
      document.getElementById('win-journey-msg').textContent =
        '🎉 Stage Complete! Next up: ' + nextStage.label;
      document.getElementById('btn-next-puzzle').textContent =
        'Start ' + nextStage.label + ' →';

    } else {
      const stage  = JOURNEY_STAGES[currentStage];
      const won    = progress.puzzlesWon[currentStage];
      const needed = stage.puzzlesRequired;
      document.getElementById('win-journey-msg').textContent =
        'Puzzle ' + won + ' of ' + needed + ' complete in this stage';
      document.getElementById('btn-next-puzzle').textContent = 'Next Puzzle →';
    }

  } else if (currentMode === 'level') {
    levelSection.style.display = 'flex';

  } else if (isDaily) {
    dailyMsg.style.display = 'block';
    const { seed } = getDailySeed();
    localStorage.setItem('sudoku_daily_' + seed, JSON.stringify({
      completed : true,
      time      : timerSeconds,
      mistakes  : mistakeCount,
    }));
  }

  showScreen('win');
}
\`\`\`

═══════════════════════════════════════════════════
### WIN DETECTION — IMPLEMENT EXACTLY AS FOLLOWS
═══════════════════════════════════════════════════

\`\`\`javascript
function checkWin() {
  const allFilled  = puzzle.every(val => val !== 0);
  if (!allFilled) return false;
  const allCorrect = puzzle.every((val, i) => val === solution[i]);
  if (!allCorrect) return false;
  triggerWin();
  return true;
}

function triggerWin() {
  clearInterval(timerInterval);
  gameState = 'won';

  if (currentMode === 'journey') {
    handleJourneyWin();
  }

  showWinScreen();
}

function handleJourneyWin() {
  const progress = loadJourneyProgress();
  const stage    = JOURNEY_STAGES[progress.currentStage];

  progress.puzzlesWon[progress.currentStage]++;
  progress.totalSolved++;
  if (!progress.bestTime || timerSeconds < progress.bestTime) {
    progress.bestTime = timerSeconds;
  }

  if (progress.puzzlesWon[progress.currentStage] >= stage.puzzlesRequired) {
    if (progress.currentStage === JOURNEY_STAGES.length - 1) {
      journeyCompleted = true;
    } else {
      progress.currentStage++;
      journeyStageAdvanced = true;
    }
  }

  saveJourneyProgress(progress);
}
\`\`\`

checkWin() MUST be called:
- After every confirmed number placement (not pencil)
- After every hint reveal
- NEVER after an erase
- NEVER after a pencil toggle

═══════════════════════════════════════════════════
### KEYBOARD INPUT — IMPLEMENT EXACTLY AS FOLLOWS
═══════════════════════════════════════════════════

ONE global keydown listener on document. Never on individual cells.

\`\`\`javascript
document.addEventListener('keydown', (e) => {
  if (/^[1-9]$/.test(e.key) || (e.code >= 'Numpad1' && e.code <= 'Numpad9')) {
    const num = parseInt(e.key) || parseInt(e.code.replace('Numpad', ''));
    if (selectedCell === -1)         return;
    if (given[selectedCell])         return;
    if (gameState !== 'running')     return;
    pencilMode
      ? addPencilMark(selectedCell, num)
      : placeNumber(selectedCell, num);
    return;
  }

  if (e.key === 'Backspace' || e.key === 'Delete') {
    if (selectedCell === -1 || given[selectedCell]) return;
    eraseCell(selectedCell);
    return;
  }

  if (e.key === 'p' || e.key === 'P') {
    pencilMode = !pencilMode;
    updatePencilToggleUI();
    return;
  }

  if (e.key === 'z' && e.ctrlKey && !e.shiftKey) {
    e.preventDefault();
    undoAction();
    return;
  }

  if ((e.key === 'y' && e.ctrlKey) || (e.key === 'z' && e.ctrlKey && e.shiftKey)) {
    e.preventDefault();
    redoAction();
    return;
  }

  const arrowMap = { ArrowUp: -9, ArrowDown: 9, ArrowLeft: -1, ArrowRight: 1 };
  if (arrowMap[e.key] !== undefined) {
    e.preventDefault();
    const next = selectedCell + arrowMap[e.key];
    if (next >= 0 && next < 81) selectCell(next);
    return;
  }
});
\`\`\`

═══════════════════════════════════════════════════
### PENCIL / CANDIDATE SYSTEM
═══════════════════════════════════════════════════

\`\`\`javascript
// pencil is an array of 81 Sets
const pencil = Array.from({ length: 81 }, () => new Set() );

function addPencilMark(index, num) {
  if (puzzle[index] !== 0) return;   // cell already has confirmed number
  if (pencil[index].has(num)) {
    pencil[index].delete(num);
  } else {
    pencil[index].add(num);
  }
  pushHistory(index, puzzle[index], clonePencilSet(index));
  renderCell(index);
}
\`\`\`

═══════════════════════════════════════════════════
### NUMBER PLACEMENT — placeNumber()
═══════════════════════════════════════════════════

\`\`\`javascript
function placeNumber(index, num) {
  if (given[index]) return;
  if (gameState !== 'running') return;

  // 1. Save to history
  pushHistory(index, puzzle[index], clonePencilSet(index));

  // 2. Place the number
  puzzle[index] = num;

  // 3. Clear pencil marks on this cell
  pencil[index].clear();

  // 4. Mistake detection
  if (mistakeMode && num !== solution[index]) {
    mistakeCount++;
    updateHUD();
    const cell = cellElements[index];
    cell.classList.add('mistake-flash');
    cell.addEventListener('animationend', () => {
      cell.classList.remove('mistake-flash');
      cell.classList.add('mistake');
    }, { once: true });
  } else {
    cellElements[index].classList.remove('mistake', 'mistake-flash');
  }

  // 5. Remove this number from pencil marks of all peers
  getPeers(index).forEach(peer => {
    if (pencil[peer].has(num)) {
      pencil[peer].delete(num);
      renderCell(peer);
    }
  });

  // 6. Render placed cell
  renderCell(index);

  // 7. Update remaining counter
  updateRemainingBar();

  // 8. Check row/col/box completion → flash animation
  checkGroupCompletion(index);

  // 9. Start timer on first input
  if (!timerStarted) {
    timerStarted = true;
    startTimer();
  }

  // 10. Check win
  checkWin();
}

function getPeers(index) {
  const peers = new Set();
  const row   = Math.floor(index / 9);
  const col   = index % 9;
  const boxR  = Math.floor(row / 3) * 3;
  const boxC  = Math.floor(col / 3) * 3;

  for (let i = 0; i < 9; i++) {
    peers.add(row * 9 + i);          // same row
    peers.add(i * 9 + col);          // same col
    peers.add((boxR + Math.floor(i / 3)) * 9 + (boxC + (i % 3))); // same box
  }
  peers.delete(index);               // exclude self
  return peers;
}
\`\`\`

═══════════════════════════════════════════════════
### ERASE — eraseCell()
═══════════════════════════════════════════════════

\`\`\`javascript
function eraseCell(index) {
  if (given[index]) return;
  if (puzzle[index] === 0 && pencil[index].size === 0) return;

  pushHistory(index, puzzle[index], clonePencilSet(index));

  puzzle[index] = 0;
  pencil[index].clear();
  cellElements[index].classList.remove('mistake', 'mistake-flash');
  renderCell(index);
  updateRemainingBar();
}
\`\`\`

═══════════════════════════════════════════════════
### UNDO / REDO
═══════════════════════════════════════════════════

\`\`\`javascript
function pushHistory(index, prevVal, prevPencil) {
  history.push({ index, prevVal, prevPencil });
  redoStack = [];    // clear redo on new action
}

function undoAction() {
  if (!history.length) return;
  const { index, prevVal, prevPencil } = history.pop();
  redoStack.push({ index, prevVal: puzzle[index], prevPencil: clonePencilSet(index) });

  puzzle[index] = prevVal;
  pencil[index] = new Set(prevPencil);
  cellElements[index].classList.remove('mistake', 'mistake-flash');
  renderCell(index);
  updateRemainingBar();
}

function redoAction() {
  if (!redoStack.length) return;
  const { index, prevVal, prevPencil } = redoStack.pop();
  history.push({ index, prevVal: puzzle[index], prevPencil: clonePencilSet(index) });

  puzzle[index] = prevVal;
  pencil[index] = new Set(prevPencil);
  renderCell(index);
  updateRemainingBar();
}

function clonePencilSet(index) {
  return new Set(pencil[index]);
}
\`\`\`

═══════════════════════════════════════════════════
### AUTO-CANDIDATE ENGINE
═══════════════════════════════════════════════════

\`\`\`javascript
function autoFillCandidates() {
  for (let i = 0; i < 81; i++) {
    if (puzzle[i] !== 0) continue;
    pencil[i].clear();
    for (let num = 1; num <= 9; num++) {
      if (isValidPlacement(puzzle, i, num)) {
        pencil[i].add(num);
      }
    }
  }
  pencilMode = true;
  updatePencilToggleUI();
  renderAllCells();
}

function isValidPlacement(board, index, num) {
  const row  = Math.floor(index / 9);
  const col  = index % 9;
  const boxR = Math.floor(row / 3) * 3;
  const boxC = Math.floor(col / 3) * 3;

  for (let i = 0; i < 9; i++) {
    if (board[row * 9 + i] === num)  return false;   // row
    if (board[i * 9 + col] === num)  return false;   // col
    const br = boxR + Math.floor(i / 3);
    const bc = boxC + (i % 3);
    if (board[br * 9 + bc] === num)  return false;   // box
  }
  return true;
}
\`\`\`

═══════════════════════════════════════════════════
### SMART HIGHLIGHTING — selectCell()
═══════════════════════════════════════════════════

\`\`\`javascript
function selectCell(index) {
  selectedCell = index;
  const val  = puzzle[index];
  const row  = Math.floor(index / 9);
  const col  = index % 9;
  const boxR = Math.floor(row / 3) * 3;
  const boxC = Math.floor(col / 3) * 3;

  cellElements.forEach((cell, i) => {
    cell.classList.remove('highlight-selected', 'highlight-peer', 'highlight-match');

    const r  = Math.floor(i / 9);
    const c  = i % 9;
    const br = Math.floor(r / 3) * 3;
    const bc = Math.floor(c / 3) * 3;

    const isPeer  = r === row || c === col || (br === boxR && bc === boxC);
    const isMatch = val !== 0 && puzzle[i] === val;

    if (i === index)     cell.classList.add('highlight-selected');
    else if (isMatch)    cell.classList.add('highlight-match');
    else if (isPeer)     cell.classList.add('highlight-peer');
  });
}
\`\`\`

═══════════════════════════════════════════════════
### MISTAKE DETECTION
═══════════════════════════════════════════════════

mistakeMode toggled by "Mistakes: ON/OFF" button. Default: ON.

Rules:
- Mistake check runs inside placeNumber() on every confirmed input
- Red flash animation plays 3 times, then persistent red border remains
- eraseCell() always removes mistake classes (but does NOT decrement mistakeCount)
- undoAction() removes mistake classes but does NOT decrement mistakeCount
- Pencil marks are NEVER flagged as mistakes

CSS:
\`\`\`css
.cell.mistake       { color: #e53935; border: 2px solid #e53935; }
.cell.mistake-flash { animation: flashRed 0.3s ease 3; }
@keyframes flashRed {
  0%, 100% { background: #fff; }
  50%      { background: #ffcccc; }
}
\`\`\`

═══════════════════════════════════════════════════
### DAILY CHALLENGE SYSTEM
═══════════════════════════════════════════════════

\`\`\`javascript
function getDailySeed() {
  const now   = new Date();
  const seed  = now.getFullYear() * 10000
              + (now.getMonth() + 1) * 100
              + now.getDate();
  const label = now.toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric'
  });
  return { seed, label };
}

function mulberry32(seed) {
  return function() {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

function startDailyChallenge() {
  const { seed, label } = getDailySeed();
  const saved = localStorage.getItem('sudoku_daily_' + seed);

  if (saved) {
    const data = JSON.parse(saved);
    alert(
      'Already completed: ' + label +
      '\\nTime: ' + formatTime(data.time) +
      ' | Mistakes: ' + data.mistakes +
      '\\nCome back tomorrow!'
    );
    return;
  }

  currentMode       = 'daily';
  currentDifficulty = 'hard';
  isDaily           = true;
  generatePuzzle(26, mulberry32(seed));
  resetGameState();
  showScreen('game');
  updateDifficultyBadge();
  renderAllCells();
}
\`\`\`

═══════════════════════════════════════════════════
### RENDER SYSTEM
═══════════════════════════════════════════════════

Single renderCell(index) — never manipulate cell DOM outside this function.

\`\`\`javascript
function renderCell(index) {
  const cell = cellElements[index];
  const val  = puzzle[index];
  cell.innerHTML = '';

  if (val !== 0) {
    const span       = document.createElement('span');
    span.textContent = val;
    span.className   = given[index] ? 'given-number' : 'user-number';
    cell.appendChild(span);
  } else if (pencil[index].size > 0) {
    const grid     = document.createElement('div');
    grid.className = 'pencil-grid';
    for (let n = 1; n <= 9; n++) {
      const mark       = document.createElement('span');
      mark.textContent = pencil[index].has(n) ? n : '';
      mark.className   = 'pencil-mark';
      grid.appendChild(mark);
    }
    cell.appendChild(grid);
  }
}

function renderAllCells() {
  for (let i = 0; i < 81; i++) renderCell(i);
}
\`\`\`

═══════════════════════════════════════════════════
### REMAINING NUMBER COUNTER — updateRemainingBar()
═══════════════════════════════════════════════════

\`\`\`javascript
function updateRemainingBar() {
  const counts = new Array(10).fill(0);          // index 1–9
  puzzle.forEach(val => { if (val !== 0) counts[val]++; });

  const bar = document.getElementById('remaining-bar');
  bar.innerHTML = '';
  for (let n = 1; n <= 9; n++) {
    const remaining = 9 - counts[n];
    const span      = document.createElement('span');
    span.className  = remaining === 0 ? 'remaining-done' : 'remaining-num';
    span.textContent = n + (remaining > 0 ? '×' + remaining : ' ✓');
    bar.appendChild(span);
  }
}
\`\`\`

Also dim the numpad button for that number when remaining === 0:
\`\`\`javascript
for (let n = 1; n <= 9; n++) {
  const btn = document.getElementById('numpad-' + n);
  btn.disabled  = (9 - counts[n] === 0);
  btn.classList.toggle('numpad-done', 9 - counts[n] === 0);
}
\`\`\`

═══════════════════════════════════════════════════
### TIMER SYSTEM
═══════════════════════════════════════════════════

\`\`\`javascript
function startTimer() {
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timerSeconds++;
    document.getElementById('timer-display').textContent = formatTime(timerSeconds);
  }, 1000);
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return m + ':' + s;
}
\`\`\`

Timer rules:
- Does NOT start on page load
- Starts on the very first placeNumber() or addPencilMark() call (check timerStarted flag)
- Pauses on window blur (desktop only)
- Stops in triggerWin()
- Resets to 0 in resetGameState()

═══════════════════════════════════════════════════
### PENCIL TOGGLE UI — updatePencilToggleUI()
═══════════════════════════════════════════════════

\`\`\`javascript
function updatePencilToggleUI() {
  const btn = document.getElementById('btn-pencil');
  if (pencilMode) {
    btn.textContent = '✏ Pencil: ON';
    btn.classList.add('active');
  } else {
    btn.textContent = '✏ Pencil: OFF';
    btn.classList.remove('active');
  }
}
\`\`\`

CSS for active pencil button:
\`\`\`css
#btn-pencil.active {
  background: #4a90d9;
  color: white;
  border-color: #2a70b9;
}
\`\`\`

═══════════════════════════════════════════════════
### TOP BAR BADGE — updateDifficultyBadge()
═══════════════════════════════════════════════════

\`\`\`javascript
function updateDifficultyBadge() {
  const badge  = document.getElementById('difficulty-badge');
  const labels = {
    easy: '🟢 Easy', medium: '🟡 Medium',
    hard: '🔴 Hard', expert: '💀 Expert'
  };
  if (currentMode === 'journey') {
    const stage      = JOURNEY_STAGES[currentStage];
    badge.textContent = '🗺 Journey · ' + stage.label;
  } else if (currentMode === 'daily') {
    badge.textContent = '🗓 Daily Challenge';
  } else {
    badge.textContent = '🎯 Level · ' + labels[currentDifficulty];
  }
}
\`\`\`

═══════════════════════════════════════════════════
### HINT SYSTEM
═══════════════════════════════════════════════════

\`\`\`javascript
function useHint() {
  if (hintsRemaining <= 0) return;
  if (selectedCell === -1)  return;
  if (given[selectedCell])  return;
  if (gameState !== 'running') return;

  const correct = solution[selectedCell];
  pushHistory(selectedCell, puzzle[selectedCell], clonePencilSet(selectedCell));

  puzzle[selectedCell] = correct;
  pencil[selectedCell].clear();
  given[selectedCell]  = true;        // lock the hint cell like a given
  cellElements[selectedCell].classList.remove('mistake', 'mistake-flash');

  hintsUsed++;
  hintsRemaining--;

  // Trigger peer pencil cleanup
  getPeers(selectedCell).forEach(peer => {
    if (pencil[peer].has(correct)) {
      pencil[peer].delete(correct);
      renderCell(peer);
    }
  });

  renderCell(selectedCell);
  updateRemainingBar();
  updateHUD();
  checkWin();
}

function updateHUD() {
  document.getElementById('mistake-count').textContent = mistakeCount;
  document.getElementById('btn-hint').textContent      = 'Hint (' + hintsRemaining + ')';
}
\`\`\`

═══════════════════════════════════════════════════
### resetGameState()
═══════════════════════════════════════════════════

\`\`\`javascript
function resetGameState() {
  pencil               = Array.from({ length: 81 }, () => new Set());
  history              = [];
  redoStack            = [];
  selectedCell         = -1;
  pencilMode           = false;
  mistakeCount         = 0;
  hintsUsed            = 0;
  hintsRemaining       = 3;
  timerSeconds         = 0;
  timerStarted         = false;
  gameState            = 'running';
  journeyStageAdvanced = false;
  journeyCompleted     = false;
  clearInterval(timerInterval);
  updatePencilToggleUI();
  updateHUD();
  updateRemainingBar();
}
\`\`\`

═══════════════════════════════════════════════════
### FULL STATE VARIABLES — DECLARE AT TOP OF SCRIPT
═══════════════════════════════════════════════════

\`\`\`javascript
let puzzle               = new Array(81).fill(0);
let solution             = new Array(81).fill(0);
let given                = new Array(81).fill(false);
let pencil               = Array.from({ length: 81 }, () => new Set());
let cellElements         = [];     // populated after board render
let history              = [];
let redoStack            = [];
let selectedCell         = -1;
let pencilMode           = false;
let mistakeMode          = true;
let mistakeCount         = 0;
let hintsUsed            = 0;
let hintsRemaining       = 3;
let timerSeconds         = 0;
let timerInterval        = null;
let timerStarted         = false;
let gameState            = 'idle'; // idle | running | paused | won
let currentMode          = 'level';  // level | journey | daily
let currentDifficulty    = 'medium';
let currentStage         = 0;
let isDaily              = false;
let journeyStageAdvanced = false;
let journeyCompleted     = false;
\`\`\`

═══════════════════════════════════════════════════
### CSS — HIGHLIGHTING + PENCIL GRID
═══════════════════════════════════════════════════

\`\`\`css
/* Cell states */
.highlight-selected { background: #4a90d9 !important; color: white; }
.highlight-peer     { background: #d0e8f8; }
.highlight-match    { background: #b3d4f0; font-weight: bold; }
.cell.mistake       { color: #e53935; border: 2px solid #e53935; }
.cell.mistake-flash { animation: flashRed 0.3s ease 3; }

@keyframes flashRed {
  0%, 100% { background: #fff; }
  50%      { background: #ffcccc; }
}

/* Pencil grid inside cell */
.pencil-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  width: 100%;
  height: 100%;
  gap: 0;
}
.pencil-mark {
  font-size: 9px;
  color: #666;
  text-align: center;
  line-height: 1.2;
}

/* Number types */
.given-number { font-weight: 700; color: #1a1a2e; }
.user-number  { font-weight: 500; color: #4a90d9; }

/* Pencil button active */
#btn-pencil.active { background: #4a90d9; color: white; border-color: #2a70b9; }

/* Remaining bar */
.remaining-num  { opacity: 1; }
.remaining-done { opacity: 0.3; text-decoration: line-through; }

/* Numpad done */
.numpad-done { opacity: 0.3; cursor: not-allowed; }

/* Board grid */
#board {
  display: grid;
  grid-template-columns: repeat(9, 1fr);
  border: 3px solid #1a1a2e;
}
.cell {
  width: 52px;
  height: 52px;
  border: 1px solid #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 20px;
  position: relative;
  box-sizing: border-box;
}

/* Thick borders between 3x3 boxes */
.cell:nth-child(3n)   { border-right: 3px solid #1a1a2e; }
.cell:nth-child(n+19):nth-child(-n+27),
.cell:nth-child(n+46):nth-child(-n+54) { border-bottom: 3px solid #1a1a2e; }

@media (max-width: 500px) {
  .cell { width: 38px; height: 38px; font-size: 15px; }
  .pencil-mark { font-size: 7px; }
}
\`\`\`

### Visual Style
- ${safe(a.style, "Clean modern")}
- Dark bold given numbers, blue user numbers, gray pencil marks
- Mode cards on start screen are large, tappable, with icon + description
- Journey progress bars use filled/empty block characters or CSS progress bars
- Toolbar is a single scrollable row on mobile

### Technical Requirements
${formatList(a.constraints, "- Single file\n- No libraries\n- Mobile-friendly")}
- Pure DOM — no canvas
- CSS Grid for board layout
- Touch events on cells and numpad identical to click events
- All screens use display:flex / display:none (no visibility:hidden)

### Game Flow
${formatList(a.gameFlow, "- Mode selection screen\n- Difficulty screen (level mode)\n- Journey preview screen\n- Pause overlay\n- Win overlay")}

### Advanced Options
${formatList(a.advanced, "- None")}

${qualityRules}

### FINAL OUTPUT REQUIREMENTS
- Single complete HTML/CSS/JS file, fully working, no placeholders
- Page loads showing ONLY #screen-start → #start-view-mode
- Board is not rendered until startLevelMode() or startJourneyMode() is called
- All items in MANDATORY FEATURE CHECKLIST must be implemented and working
- Win triggers instantly when last correct cell is filled
- P key visually toggles pencil button between ON/OFF state
- Journey progress survives page refresh via localStorage
- Daily puzzle is deterministic — same date = same puzzle for all users
- Every function listed in this spec must be fully implemented, not stubbed
- Code must be commented by section
`;
}

function buildTowerDefense2(a) {
  return `
### Game
${safe(a.name, "Tower Defense")}

### Setting / Theme
${safe(a.theme, "Fantasy kingdom under siege")}

### Objective
Build a fully working, polished, bug-free tower defense game using ${safe(a.tech, "HTML, CSS, and JavaScript")}.
This must feel like a real, well-designed tower defense game — balanced, challenging, and visually coherent.
Every system listed here is mandatory. Do not simplify, omit, or approximate any rule.

---

### Map System

#### Map Selection Screen
- Show a map selection screen between the title screen and the game
- Offer exactly 3 maps with distinct layouts, names, and difficulty ratings:
  • "Green Valley" — Easy. Gentle S-curve, 6 waypoints, wide build zones. Starting gold: 180, lives: 25.
  • "Stone Ridge" — Medium. 4–5 sharp turns, 8 waypoints, tighter build space. Starting gold: 150, lives: 20.
  • "Inferno Pass" — Hard. Long winding path, 10+ waypoints, minimal early-segment build space. Starting gold: 120, lives: 15.
- Each map card shows: name, difficulty badge (color-coded), minimap preview drawn on a small <canvas>, short flavor text, and a "Select" button
- Selecting a map loads its waypoints[], grid[][], starting gold, lives, and total wave count
- "Change Map" button is available on Game Over and Victory screens — returns to map selection without reloading

#### Path Design (per map)
- Waypoints are pixel coordinates: [{x, y}, ...] — minimum 6 per map, minimum 10 for Hard
- Turns must be genuine directional changes of at least 45°, evenly distributed along the path
- Render path as a 40px-wide lane: dark outer fill (#5a4a3a), lighter center fill (#7a6a5a), subtle edge highlight
- Corner joints rendered with arc() or bezierCurveTo() — no hard 90° pixel corners
- Path tiles marked non-buildable in grid[][] at map load time
- Path must fill the canvas meaningfully — no dead space

---

### Visual Style & Aesthetics
- ${safe(a.style, "Dark fantasy — deep slate backgrounds, stone textures, warm torchlight palette")}
- Canvas size: 800×600, centered, scales proportionally on window resize
- Background: dark stone tile pattern (draw with repeating rect grid, two alternating dark shades)
- Buildable grid cells: subtle outline only (rgba stroke, low alpha) — highlighted green on valid hover, red on invalid
- Tower range ring: semi-transparent fill on hover and while selected
- HUD strip at top (height 48px): separated from canvas by a thin border line
  - Left: [coin icon] gold amount  [heart icon] lives  [wave badge] Wave N
  - Center: next wave countdown or "Wave in progress" label
  - Right: [1×/2× speed toggle button]  [Pause button]  [sell/upgrade panel trigger]
- All HUD icons drawn with canvas primitives — no emoji, no image files
- Font: use a system monospace or canvas fillText with a clear pixel-readable size (14–16px)

#### Enemy Visuals
- Each enemy type has a distinct shape, color, and size (see Enemy Type Table)
- HP bar floats 6px above sprite: green above 50%, amber 25–50%, red below 25% — updates every frame
- On hit: enemy sprite flashes white for 1 frame (set globalAlpha or fillStyle to white momentarily)
- On death: spawn 5 particles — small 4×4px squares in the enemy's color, scatter outward with random velocity, fade over 300ms lifetime, then splice from particles[]

#### Boss Visuals
- Boss sprite: 2× the normal size of its base tier, with a pulsing outer glow ring (strokeStyle, oscillating alpha via Math.sin)
- Full-screen boss HP bar rendered at top-center of canvas (not HUD strip):
  • Width: 300px, height: 18px, centered horizontally
  • Label above: "WAVE N BOSS — [Boss Name]" in 13px bold
  • Bar color: green (#4caf50) above 50% HP, amber (#ff9800) at 25–50%, red (#f44336) below 25%
  • Below 25% HP: bar border pulses (strokeStyle oscillates via Math.sin on each frame)
- Boss also has a standard sprite HP bar above its head (same color logic, 40px wide)
- Boss names rotate from: ["The Siege Warden", "Iron Golem", "Dread Reaper", "Shadow Titan", "Bone Colossus"]

#### Castle Base (Exit Point)
- Render a castle at path endpoint using canvas rects and arcs:
  • Two crenellated towers flanking a gate arch
  • Warm ambient glow (golden strokeStyle halo, low alpha)
- Castle has its own HP bar displayed directly below the castle sprite:
  • Starts full (equal to starting lives), shrinks on each life lost
  • Color transitions same as enemy HP bars (green → amber → red)
  • Bar label: "Castle HP"
- On enemy reaching castle:
  • Screen-edge vignette flashes red for 400ms (draw red rect over entire canvas at low alpha)
  • Castle shakes: offset draw position by ±4px in a 300ms oscillation
  • Lives HUD heart icon scales to 1.4× and turns red for 300ms
- On lives = 0: castle crumbles — individual rect pieces fall with simulated gravity (y += vy; vy += gravity) over 800ms, then trigger Game Over screen

#### Tower Visuals
- Each tower drawn with canvas primitives only:
  • Basic — circular stone base (gray), short rotating barrel (dark rect)
  • Sniper — tall narrow platform (dark blue-gray), long thin barrel, small antenna arc on top
  • Cannon — wide squat base (dark brown), thick angled barrel, two small circles as wheels
- Barrel rotates smoothly toward current target each frame (lerp angle, not snap)
- On auto-upgrade: scale-pulse flash (ctx.scale 1 → 1.3 → 1 over 300ms) + gold ripple ring (expanding strokeStyle circle fading out)
- Selected tower: draw a solid selection ring around base + show detail panel (level, XP bar, upgrade cost, sell value)

---

### Tower System

#### Role Design (Mandatory Distinction)
Each tower must have a clearly different role that cannot substitute for the others:
- Basic = sustained DPS. Reliable against all enemy types. Never the best at anything, never useless.
- Sniper = high single-target burst. Ideal for Tanks and bosses. Useless against fast swarms (too slow fire rate).
- Cannon = AoE splash with falloff. Strong against groups and Fast enemies. Weak single-target (splash falloff means only center enemies take full damage).
Cannon splash falloff: full damage at 0–10px from impact, 60% damage at 10–25px, 30% damage at 25–35px.
No combination of a single tower type should be able to clear waves 15+ efficiently — mixed usage is required.

#### Tower Stats Table
| Tower   | Cost | Damage | Range | Fire Rate | Speed     | Projectile | Special                              |
|---------|------|--------|-------|-----------|-----------|------------|--------------------------------------|
| Basic   | 50   | 18     | 90    | 1.2/s     | 280 px/s  | Homing     | None                                 |
| Sniper  | 120  | 75     | 220   | 0.4/s     | 320 px/s  | Homing     | Pierces up to 2 enemies              |
| Cannon  | 150  | 50     | 110   | 0.6/s     | 200 px/s  | Ballistic  | AoE splash 35px with falloff, no homing |

#### Targeting Priority (Switchable)
- Default targeting: enemy furthest along the path (closest to base) — calculated as index in waypoint progress, not Euclidean distance
- Player can switch targeting mode per tower via the tower detail panel:
  • First (default) — furthest along path
  • Strongest — highest current HP
  • Weakest — lowest current HP
  • Fastest — highest current speed stat
- Targeting mode shown as a small toggle in the detail panel (cycle through modes with a button)
- Targeting recalculates every 100ms per tower

#### Anti-Corner-Stacking Rule
- Towers placed within 80px of the first path turn deal 15% reduced damage (diminishing returns zone)
- This zone is visualized subtly: slight red tint on grid cells in range when placing a tower
- Display a tooltip: "Crowded zone — reduced effectiveness"
- This rule prevents the degenerate strategy of stacking all towers on the first bend

#### Manual Upgrade Levels (Gold Cost)
| Level | Gold Cost        | Damage | Range | Fire Rate |
|-------|-----------------|--------|-------|-----------|
| 2     | 0.8× base cost  | +30%   | +10%  | +10%      |
| 3     | 1.2× base cost  | +50%   | +20%  | +20%      |

#### Auto-Upgrade (XP System — Capped)
- Towers earn XP from kills: +1 XP per normal/fast enemy, +3 XP per tank enemy, +5 XP per boss
- XP thresholds: Level A at 10 XP, Level B at 30 XP — zero gold cost, automatic
- XP upgrade bonuses are intentionally smaller than manual upgrades:
  • Level A: +12% damage, +8% range
  • Level B: +18% damage, +10% range (cumulative from A)
- XP upgrades are HARD CAPPED: no further bonuses beyond Level B, no matter how many kills
- XP upgrades do NOT increase fire rate — only manual upgrades do
- Total maximum tower power (all manual + all XP upgrades combined): damage ×2.0, range ×1.38, fire rate ×1.2
- Apply auto-upgrades between animation frames only — never mid-tick
- Show XP bar and threshold in tower detail panel

#### Tower Placement Rules
- Ghost preview follows cursor — green tint if valid, red if invalid (on path, occupied, out of bounds, in crowded zone)
- Gold cost label shown inside ghost preview
- Cannot place without sufficient gold
- Sell: returns 50% of all gold invested (base cost + manual upgrade costs; XP upgrades cost nothing so not counted)

---

### Projectile System

#### Homing (Basic, Sniper)
- Projectile holds a direct object reference to its target (never an index)
- Each frame: recalculate angle toward target.x/target.y, max turn rate 8°/frame
- Speed: 280px/s (Basic), 320px/s (Sniper)
- If target dies before impact: projectile continues at last heading for up to 600ms or until leaving canvas bounds, then removed
- Null-check target every single frame before any steering logic — never access .x/.y on a dead/removed enemy
- Sniper pierce: on hit, decrement pierceCount (starts at 2); remove projectile when pierceCount reaches 0

#### Ballistic (Cannon)
- No homing — aim at predicted intercept point: target position + (target velocity vector × estimated travel time)
- Travel speed: 200px/s in a straight line
- On impact: apply AoE splash with falloff to all enemies within 35px (see falloff rule above)
- Visual: 8px dark cannonball, on impact draw expanding circle (35px radius, fades over 200ms with decreasing alpha)
- Remove immediately on impact or on leaving canvas bounds

#### Projectile Array Rules
- Remove projectiles on: hit, pierce-exhaust, timeout (600ms max), out-of-bounds
- Never let projectiles[] grow unbounded — splice immediately

---

### Enemy System

#### Enemy Types (3 archetypes, mandatory)
Three distinct archetypes that counter different tower combinations:

| Type   | HP Multiplier | Speed Multiplier | Gold Multiplier | Size  | Role                                              |
|--------|--------------|-----------------|-----------------|-------|---------------------------------------------------|
| Normal | ×1.0         | ×1.0            | ×1.0            | 16px  | Baseline — all towers handle equally              |
| Fast   | ×0.45        | ×1.8            | ×0.7            | 12px  | Cannon splash hits multiple; Sniper struggles     |
| Tank   | ×3.5         | ×0.55           | ×2.2            | 22px  | Sniper ideal; Cannon falloff wastes damage on one |

#### Enemy Tier Table (5 tiers, base values before type multipliers)
| Tier | Name          | Base HP | Gold Reward | Base Speed | Color        | Shape          |
|------|---------------|---------|-------------|------------|--------------|----------------|
| 1    | Goblin        | 40      | 8           | 60 px/s    | #7bc67e      | Small circle   |
| 2    | Orc           | 100     | 18          | 45 px/s    | #8a9a3a      | Medium circle  |
| 3    | Troll         | 220     | 35          | 35 px/s    | #6b4f2a      | Large rect     |
| 4    | Dark Knight   | 450     | 60          | 30 px/s    | #4a6a8a      | Diamond shape  |
| 5    | Shadow Wraith | 800     | 100         | 55 px/s    | #6a3a8a      | Hexagon        |

- Apply type multipliers on top of tier base values when spawning (e.g., Fast Goblin: HP 40×0.45=18, speed 60×1.8=108)
- Each enemy renders its type visually: Normal = solid fill, Fast = elongated with a speed streak trail (3 fading rects), Tank = thick border ring around the sprite
- Enemy type label ("F", "T") shown in tiny text on sprite for clarity

#### Wave Composition Table
| Waves  | Tiers Present         | Type Mix                  | Notes                                      |
|--------|-----------------------|---------------------------|--------------------------------------------|
| 1–3    | Tier 1 only           | 80% Normal, 20% Fast      | Tutorial feel — player learns basics       |
| 4–6    | Tier 1–2              | 60% Normal, 30% Fast, 10% Tank | First Tanks appear in wave 5         |
| 7–10   | Tier 2–3              | 50% Normal, 25% Fast, 25% Tank | Cannon and Sniper both start mattering |
| 11–15  | Tier 3–4              | 40% Normal, 30% Fast, 30% Tank | Must use mixed tower types            |
| 16–19  | Tier 4–5              | 30% Normal, 35% Fast, 35% Tank | Heavy pressure on economy             |
| 20+    | Tier 5 dominant       | 20% Normal, 40% Fast, 40% Tank | Near-optimized placements still leak  |

#### Wave Scaling
- Waves 1–10: enemy HP ×1.12 per wave, speed ×1.06 per wave (capped at 130 px/s)
- Waves 11+: HP scaling switches to ×1.18 per wave (exponential pressure begins)
- Wave 20+: HP scaling ×1.25 per wave, enemy count +2 per wave (not +1)
- Gold reward scales: base reward × (1 + wave × 0.05), rounded to nearest integer
- Wave interval: 5 seconds between waves, countdown shown in HUD

#### Anti-Stacking / Anti-Clumping Rules (Mandatory)
- Spawn position randomness: each enemy spawns offset from the exact path start by ±8px perpendicular to path direction (random each spawn)
- Spawn interval: enemies spawn 0.6 seconds apart (not all at once) — randomized by ±0.1s per enemy
- Separation logic: each enemy checks distance to the enemy directly ahead of it in the array; if gap < minSeparation (28px), apply a slight deceleration (speed × 0.85) until gap is restored
- This prevents the "death blob" where all enemies stack into one pixel and tower targeting becomes useless
- minSeparation is 28px for Normal, 20px for Fast, 36px for Tank

#### Boss System
- Boss appears at the start of waves 5, 10, 15, 20, ...
- Boss stats: HP = (tier HP × 6) + (wave × 80); speed = tier base speed × 0.75; gold = tier gold × 6
- Boss enters alone; remaining wave enemies begin spawning 3.5 seconds after boss crosses the spawn point
- Boss is one size class above its tier's base sprite, with a pulsing glow ring
- Boss type is always Normal (no multiplier) — boss HP formula already accounts for difficulty
- Remove boss from enemies[] immediately on death; never leave ghost references

#### Gameplay Integrity Rules (Non-Negotiable)
- Waves 20+ MUST allow some enemies to leak through even with well-optimized tower layouts — enemy scaling must outpace tower power ceiling
- The game must not be winnable by placing towers only at the first corner — anti-corner-stacking penalty enforces this
- Infinite stalling is not possible: waves auto-start after a 10-second idle timeout if the player does not press the Wave Start button
- Dominant single-tower strategies must fail by wave 15: Sniper-only fails against Fast swarms; Cannon-only fails against spread-out Fast enemies; Basic-only fails against late Tanks
- Mixed tower usage must be mechanically required, not just suggested

---

### Economy Rules
| Map           | Starting Gold | Starting Lives | Total Waves |
|---------------|--------------|---------------|-------------|
| Green Valley  | 180          | 25            | 20          |
| Stone Ridge   | 150          | 20            | 25          |
| Inferno Pass  | 120          | 15            | 30          |

- Gold earned per kill: enemy gold reward × wave scaling multiplier (see Wave Scaling)
- Wave clear bonus: +20 gold flat
- Cannot place tower without sufficient gold — ghost preview shows red if unaffordable
- Flash gold coin icon (+N gold) near kill location momentarily on earn

---

### Difficulty
- ${safe(a.difficulty, "Progressive with exponential late-game scaling")}
- Wave 1 target: winnable with 2 Basic towers at the first and second turn (this is the tuning anchor)
- Waves 1–5: player feels in control, learning the systems
- Waves 6–10: real pressure begins, Sniper/Cannon become necessary
- Waves 11–20: survival requires economy management, targeting mode switching, and mixed towers
- Waves 20+: no guaranteed win state — skilled play extends survival, not eliminates leaking

---

### Technical Requirements
${formatList(a.constraints, "- Single HTML file\n- No external libraries\n- Touch-friendly (tap to place, tap to select)")}
- Use <canvas> for all game rendering — no DOM elements in the play area
- requestAnimationFrame loop with running boolean and lastTime for dt = (now - lastTime) / 1000
- All speeds and distances in px/s — always multiply by dt for movement
- Game state arrays: towers[], enemies[], projectiles[], particles[], waypoints[], grid[][]
- Splice from arrays immediately on removal — never mark-and-defer within the same frame
- Grid cell: 40×40px; map grid dimensions defined per map

---

### Game Flow
${formatList(a.gameFlow, "- Title screen → Map selection → Game\n- Wave start button\n- Pause/Resume\n- Speed toggle (1×/2×)\n- Game Over screen\n- Victory screen")}
- Title screen: game name large, animated tagline, "Play" button
- Map selection: 3 cards with minimap canvas, name, difficulty badge, flavor text, "Select" button
- In-game HUD (top strip): gold | lives | wave | countdown — right side: speed toggle + pause
- Wave start: manual button, but auto-starts after 10 seconds idle (countdown shown)
- Speed toggle (1×/2×): multiplies dt by 2 when active — all systems scale automatically
- Pause: halts requestAnimationFrame loop, shows overlay
- Tower detail panel (click any placed tower): shows type, level, XP bar, targeting mode toggle, upgrade button + cost, sell button + return value
- Game Over screen: wave reached, enemies leaked, gold earned, "Retry Same Map" + "Change Map"
- Victory screen: waves cleared, score (gold × wave multiplier), "Play Again" + "Change Map"
- Full restart resets: lives, gold, wave, towers[], enemies[], projectiles[], particles[], all timers, all counters

---

### Advanced Options
${formatList(a.advanced, [
  "Cannon AoE splash with distance falloff: 100% damage 0–10px, 60% at 10–25px, 30% at 25–35px from impact point",
  "XP auto-upgrade system: capped at Level B (+18% dmg, +10% range total), no fire rate bonus, hard cap enforced",
  "Targeting mode switcher per tower: First / Strongest / Weakest / Fastest — toggled in tower detail panel",
  "Speed ×2 toggle: multiplies dt by 2, all systems scale automatically including projectile speed and enemy movement",
  "Castle HP bar below castle sprite: shrinks per life lost, color transitions green→amber→red, label 'Castle HP'",
  "Castle crumble animation: rect pieces fall with gravity on lives=0 over 800ms before Game Over",
  "Boss full-screen HP bar: 300px wide, centered, label with wave + boss name, pulses at <25% HP",
  "Boss pulsing glow ring: oscillating strokeStyle alpha via Math.sin each frame",
  "3 enemy types (Normal/Fast/Tank) with HP/speed/gold multipliers and distinct visual indicators",
  "5 enemy tiers with explicit base HP, gold, speed — type multipliers applied at spawn",
  "Wave composition table: typed and tiered enemy mix changes by wave range, exponential scaling post-wave 10",
  "Anti-stacking: ±8px spawn offset, 0.6s ± 0.1s spawn interval, separation/deceleration logic at 28px gap",
  "Anti-corner-stacking: 15% damage penalty for towers within 80px of first path turn, visualized on placement",
  "Gameplay integrity: auto-wave after 10s idle, no dominant single-tower strategy viable past wave 15, leaking required at wave 20+",
  "Homing projectiles: object reference targeting, 8°/frame turn cap, null-checked every frame",
  "Ballistic cannon: intercept-point prediction, impact explosion animation 35px ring fading over 200ms",
  "Sniper pierce: passes through 2 enemies (pierceCount), removes on exhaust",
  "Death particle burst: 5 particles per enemy, 4×4px in enemy color, scatter + fade 300ms",
  "Enemy speed trail: Fast-type enemies render 3 fading rects behind them as motion indicator",
  "dt-based movement throughout: all velocities in px/s, no frame-rate-dependent logic anywhere"
].join("\n- "))}

${qualityRules}

---

### Output
- Fully playable, polished, bug-free tower defense game in a single HTML file
- Game must run from title → map selection → wave 1 → wave 20+ without freezing, console errors, or memory leaks
- Wave 1 is winnable by a new player; wave 20+ is not guaranteed survivable even for skilled players
- All systems must interact correctly: XP system, targeting modes, type multipliers, anti-stacking, falloff, boss bar
- Section comments required: // === CONSTANTS ===, // === MAP DATA ===, // === GAME LOOP ===, // === TOWERS ===, // === ENEMIES ===, // === PROJECTILES ===, // === PARTICLES ===, // === HUD ===, // === INPUT ===, // === SCREENS ===
- Code must be readable, well-structured, and maintainable — no minification
`;
}

function buildTowerDefense(a) {
  return `
### Game
${safe(a.name, "Tower Defense")}

### Setting / Theme
${safe(a.theme, "Fantasy kingdom under siege")}

### Objective
Build a fully working, bug-free tower defense game using ${safe(a.tech, "HTML, CSS, and JavaScript")}.
This is a STRICT specification. Every rule below is MANDATORY.
Do NOT stub functions. Do NOT use placeholder comments.

### MANDATORY FEATURE CHECKLIST
[ ] 4 enemy types: Normal, Fast, Tank, Boss — distinct shapes, colors, behaviors
[ ] 6 tower types: Basic, Cannon (splash), Slow, Tesla, Sniper, Machine Gun
[ ] Tower XP system — towers level up automatically on kills, stat boost per level
[ ] Individual tower upgrades — right-click → upgrade Damage / Range / Fire Speed
[ ] Targeting modes per tower — First / Strongest / Last (right-click menu)
[ ] Projectile system — Basic/Cannon/Sniper fire physical projectiles
[ ] Splash damage — Cannon projectile explodes on impact, hits all enemies in radius
[ ] Slow field — Slow Tower pulses a field, turns enemies blue, cuts speed by 50%
[ ] Tesla instant zap — hits up to 5 nearest enemies simultaneously, no projectile
[ ] Wave system — progressive scaling, boss every 5 waves
[ ] Dynamic gold scaling — enemy gold bounty scales with wave number
[ ] Dynamic enemy scaling — speed, health, reward scale per formula (see below)
[ ] Path collision — cannot place towers on the path tiles
[ ] Grid background — visual grid, styled path distinct from buildable tiles
[ ] Speed toggle — cycles x1 / x2 / x4, affects all game timers
[ ] Floating damage text — damage numbers, gold pickups, level-up notices
[ ] Wave bonus gold — payout between waves
[ ] Info bar — selected tower live stats (Type, Level, DMG, Range, Kills, XP)
[ ] Sell refund — 60% of total gold invested (base + all upgrades)
[ ] Restart without page reload — full state reset, same map
[ ] Win condition — survive all waves (or endless mode after wave 20)

═══════════════════════════════════════════════════
### ENEMY SYSTEM
═══════════════════════════════════════════════════

4 enemy types. Each has distinct visual, stats, and behavior.

\`\`\`javascript
const ENEMY_TYPES = {
  normal: {
    shape:       'circle',
    color:       '#e74c3c',        // red
    baseHealth:  80,
    baseSpeed:   1.2,
    baseReward:  10,
    size:        16,
    armor:       0,                // % damage reduction
  },
  fast: {
    shape:       'triangle',       // drawn as triangle pointing forward
    color:       '#f39c12',        // orange
    baseHealth:  40,
    baseSpeed:   2.4,              // 2× normal speed
    baseReward:  15,
    size:        12,
    armor:       0,
  },
  tank: {
    shape:       'square',
    color:       '#8e44ad',        // purple
    baseHealth:  400,
    baseSpeed:   0.6,              // half normal speed
    baseReward:  40,
    size:        22,
    armor:       0.25,             // takes 25% less damage
  },
  boss: {
    shape:       'pentagon',       // drawn as 5-sided polygon
    color:       '#2c3e50',        // dark charcoal with gold outline
    baseHealth:  1500,
    baseSpeed:   0.8,
    baseReward:  150,
    size:        32,
    armor:       0.4,
    specialAura: true,             // pulses a glow ring on canvas
  },
};
\`\`\`

═══════════════════════════════════════════════════
### DYNAMIC ENEMY SCALING FORMULA — USE EXACTLY THIS
═══════════════════════════════════════════════════

All values scale from wave number. Apply to EVERY enemy spawned.

\`\`\`javascript
function getScaledEnemy(type, wave) {
  const base  = ENEMY_TYPES[type];
  const scale = 1 + (wave - 1) * 0.18;       // +18% per wave
  const isBossWave = wave % 5 === 0;

  return {
    type,
    maxHealth : Math.round(base.baseHealth * scale),
    health    : Math.round(base.baseHealth * scale),
    speed     : parseFloat((base.baseSpeed * (1 + (wave - 1) * 0.05)).toFixed(2)), // +5% per wave
    reward    : Math.round(base.baseReward * (1 + (wave - 1) * 0.12)),             // +12% per wave
    size      : base.size,
    armor     : base.armor,
    color     : base.color,
    shape     : base.shape,
    isBoss    : type === 'boss',

    // Status effects (applied by towers)
    slowed    : false,
    slowTimer : 0,
    originalSpeed: parseFloat((base.baseSpeed * (1 + (wave - 1) * 0.05)).toFixed(2)),

    // Tracking
    distanceTraveled: 0,
    waypointIndex   : 0,
    x: 0, y: 0,       // set to path start on spawn
    id: Date.now() + Math.random(),   // unique id for targeting
  };
}
\`\`\`

Wave composition rules:
\`\`\`javascript
function getWaveComposition(wave) {
  const isBossWave = wave % 5 === 0;
  const enemies    = [];

  if (isBossWave) {
    // Boss wave: 1 boss + supporting enemies
    enemies.push({ type: 'boss', count: 1, interval: 0 });
    enemies.push({ type: 'normal', count: wave * 2, interval: 800 });
    enemies.push({ type: 'fast',   count: Math.floor(wave / 2), interval: 400 });
  } else {
    // Normal wave: mix based on wave number
    enemies.push({ type: 'normal', count: 5 + wave * 2, interval: 800 });
    if (wave >= 2) enemies.push({ type: 'fast',   count: Math.floor(wave * 1.5), interval: 500 });
    if (wave >= 4) enemies.push({ type: 'tank',   count: Math.floor(wave / 2),   interval: 1200 });
  }

  return enemies;   // spawn in order, each group starts after previous group
}
\`\`\`

Wave bonus gold between waves:
\`\`\`javascript
function getWaveBonus(wave) {
  return 25 + wave * 10;    // Wave 1: 35g  Wave 5: 75g  Wave 10: 125g
}
\`\`\`

═══════════════════════════════════════════════════
### TOWER SYSTEM
═══════════════════════════════════════════════════

6 tower types. Each has base stats, upgrade paths, and unique behavior.

\`\`\`javascript
const TOWER_TYPES = {
  basic: {
    label:       'Basic',
    color:       '#27ae60',         // green
    cost:        75,
    damage:      25,
    range:       120,
    fireRate:    1000,              // ms between shots
    projectile:  true,
    splashRadius: 0,
    description: 'Balanced tower, good starting choice',
  },
  cannon: {
    label:       'Cannon',
    color:       '#7f8c8d',         // gray
    cost:        150,
    damage:      80,
    range:       140,
    fireRate:    2200,
    projectile:  true,
    splashRadius: 40,               // AoE explosion on hit
    description: 'Slow but devastating splash damage',
  },
  slow: {
    label:       'Slow',
    color:       '#3498db',         // blue
    cost:        100,
    damage:      5,
    range:       110,
    fireRate:    1800,
    projectile:  false,             // pulse field, not projectile
    slowFactor:  0.5,               // reduces speed to 50%
    slowDuration: 2500,             // ms the slow lasts
    pulseRadius: 110,               // same as range — visual pulse
    description: 'Slows all enemies in range, turns them blue',
  },
  tesla: {
    label:       'Tesla',
    color:       '#9b59b6',         // purple
    cost:        200,
    damage:      45,
    range:       130,
    fireRate:    1200,
    projectile:  false,             // instant zap, no projectile
    chainTargets: 5,                // zaps up to 5 nearest enemies simultaneously
    description: 'Instantly zaps 5 nearest enemies, no travel time',
  },
  sniper: {
    label:       'Sniper',
    color:       '#e67e22',         // orange
    cost:        175,
    damage:      200,
    range:       280,               // very long range
    fireRate:    3000,
    projectile:  true,
    splashRadius: 0,
    ignoresArmor: true,             // bypasses tank/boss armor
    description: 'Extreme range, ignores armor, slow fire rate',
  },
  machinegun: {
    label:       'MG',
    color:       '#c0392b',         // dark red
    cost:        125,
    damage:      12,
    range:       100,
    fireRate:    200,               // very fast
    projectile:  true,
    splashRadius: 0,
    description: 'Rapid fire, low damage per shot, short range',
  },
};
\`\`\`

Tower instance structure:
\`\`\`javascript
function createTower(type, gridX, gridY, pixelX, pixelY) {
  const base = TOWER_TYPES[type];
  return {
    type,
    gridX, gridY,
    x: pixelX, y: pixelY,        // center pixel position
    ...base,                      // spread base stats (live, upgradeable)

    // XP and leveling
    xp           : 0,
    level        : 1,             // max level 5
    kills        : 0,
    xpToNextLevel: 10,            // increases per level (10, 25, 50, 100)

    // Upgrade levels (each 0–3 independently)
    upgradeDamage   : 0,
    upgradeRange    : 0,
    upgradeFireSpeed: 0,

    // Total gold invested (base + all upgrades) — for sell calculation
    totalInvested: base.cost,

    // Targeting
    targetMode   : 'first',       // 'first' | 'strongest' | 'last'
    lastFireTime : 0,
    target       : null,          // current target enemy id

    // UI state
    selected     : false,
  };
}
\`\`\`

═══════════════════════════════════════════════════
### TOWER XP & AUTO-LEVELING SYSTEM
═══════════════════════════════════════════════════

\`\`\`javascript
const XP_PER_KILL = {
  normal : 1,
  fast   : 2,
  tank   : 5,
  boss   : 20,
};

const XP_THRESHOLDS = [0, 10, 25, 50, 100];   // index = level - 1

const LEVEL_STAT_BONUS = {
  // Per level above 1: percentage bonus applied to base stats
  damage  : 0.15,     // +15% damage per level
  range   : 0.08,     // +8% range per level
  fireRate: 0.10,     // +10% fire speed per level (reduce interval)
};

function awardKill(tower, enemy) {
  tower.kills++;
  tower.xp += XP_PER_KILL[enemy.type] || 1;

  // Show floating XP text
  spawnFloatingText('+' + XP_PER_KILL[enemy.type] + 'xp', tower.x, tower.y, '#f1c40f');

  // Check level up
  if (tower.level < 5 && tower.xp >= XP_THRESHOLDS[tower.level]) {
    tower.level++;
    applyLevelBonus(tower);
    spawnFloatingText('LEVEL UP!', tower.x, tower.y - 20, '#2ecc71', true);
  }
}

function applyLevelBonus(tower) {
  const base = TOWER_TYPES[tower.type];
  const lvl  = tower.level - 1;    // bonus applies for each level above 1
  tower.damage   = Math.round(base.damage   * (1 + LEVEL_STAT_BONUS.damage   * lvl));
  tower.range    = Math.round(base.range    * (1 + LEVEL_STAT_BONUS.range    * lvl));
  tower.fireRate = Math.round(base.fireRate * (1 - LEVEL_STAT_BONUS.fireRate * lvl)); // lower = faster
}
\`\`\`

Level visual indicator: draw level pips (●) below the tower on canvas.
Level 1 = no pips, Level 2 = 1 pip, Level 3 = 2 pips, etc.
Level 5 towers get a golden glow ring.

═══════════════════════════════════════════════════
### TOWER UPGRADE SYSTEM (RIGHT-CLICK MENU)
═══════════════════════════════════════════════════

Right-clicking a placed tower opens an upgrade/info panel.
The panel renders as a floating HTML div (not canvas) positioned near the tower.

\`\`\`javascript
// Upgrade paths — 3 independent tracks, each 0→1→2→3
const UPGRADE_COSTS = {
  damage   : [50, 100, 200],    // upgradeLevel 1, 2, 3
  range    : [40, 80,  160],
  fireSpeed: [45, 90,  180],
};

const UPGRADE_BONUSES = {
  damage   : [0.25, 0.25, 0.30],   // +25%, +25%, +30% cumulative
  range    : [0.15, 0.15, 0.20],
  fireSpeed: [0.20, 0.20, 0.25],   // reduces fireRate interval
};

function upgradeTower(tower, stat) {
  const level = tower['upgrade' + capitalize(stat)];
  if (level >= 3) return;   // max upgraded

  const cost = UPGRADE_COSTS[stat][level];
  if (gold < cost) {
    flashMessage('Not enough gold!');
    return;
  }

  gold -= cost;
  tower.totalInvested += cost;
  tower['upgrade' + capitalize(stat)]++;

  // Recalculate stat from base + level bonus + upgrade bonus
  recalculateTowerStats(tower);
  updateInfoBar(tower);
}

function recalculateTowerStats(tower) {
  const base = TOWER_TYPES[tower.type];
  const lvl  = tower.level - 1;
  const dUpg = tower.upgradeDamage;
  const rUpg = tower.upgradeRange;
  const sUpg = tower.upgradeFireSpeed;

  tower.damage = Math.round(
    base.damage
    * (1 + LEVEL_STAT_BONUS.damage * lvl)
    * (1 + UPGRADE_BONUSES.damage.slice(0, dUpg).reduce((a, b) => a + b, 0))
  );
  tower.range = Math.round(
    base.range
    * (1 + LEVEL_STAT_BONUS.range * lvl)
    * (1 + UPGRADE_BONUSES.range.slice(0, rUpg).reduce((a, b) => a + b, 0))
  );
  tower.fireRate = Math.round(
    base.fireRate
    / (1 + LEVEL_STAT_BONUS.fireRate * lvl)
    / (1 + UPGRADE_BONUSES.fireSpeed.slice(0, sUpg).reduce((a, b) => a + b, 0))
  );
}
\`\`\`

Right-click panel must contain:
- Tower name + level (e.g. "Cannon Lv.3")
- Targeting mode selector: [ First ] [ Strongest ] [ Last ] (active highlighted)
- Three upgrade buttons:
  ⚔ Damage   Lv[0–3]  Cost: [Xg]  [Upgrade] or [MAX] if level 3
  ◎ Range    Lv[0–3]  Cost: [Xg]  [Upgrade] or [MAX]
  ⚡ Speed    Lv[0–3]  Cost: [Xg]  [Upgrade] or [MAX]
- Live stats: DMG: X | Range: X | Rate: Xms | Kills: X | XP: X/X
- [Sell for Xg] button at bottom (60% of totalInvested)
- [✕ Close] button

═══════════════════════════════════════════════════
### TARGETING MODES
═══════════════════════════════════════════════════

\`\`\`javascript
function getTarget(tower, enemies) {
  // Filter: only enemies within range
  const inRange = enemies.filter(e => {
    const dx = e.x - tower.x;
    const dy = e.y - tower.y;
    return Math.sqrt(dx * dx + dy * dy) <= tower.range;
  });

  if (!inRange.length) return null;

  switch (tower.targetMode) {
    case 'first':
      // Enemy furthest along the path (highest distanceTraveled)
      return inRange.reduce((a, b) => a.distanceTraveled > b.distanceTraveled ? a : b);

    case 'strongest':
      // Enemy with highest current health
      return inRange.reduce((a, b) => a.health > b.health ? a : b);

    case 'last':
      // Enemy least far along the path (lowest distanceTraveled)
      return inRange.reduce((a, b) => a.distanceTraveled < b.distanceTraveled ? a : b);

    default:
      return inRange[0];
  }
}

// Tesla targeting — returns array of up to chainTargets enemies
function getTeslaTargets(tower, enemies) {
  return enemies
    .filter(e => {
      const dx = e.x - tower.x;
      const dy = e.y - tower.y;
      return Math.sqrt(dx * dx + dy * dy) <= tower.range;
    })
    .sort((a, b) => {
      const da = Math.hypot(a.x - tower.x, a.y - tower.y);
      const db = Math.hypot(b.x - tower.x, b.y - tower.y);
      return da - db;    // nearest first
    })
    .slice(0, tower.chainTargets);
}
\`\`\`

═══════════════════════════════════════════════════
### PROJECTILE SYSTEM
═══════════════════════════════════════════════════

\`\`\`javascript
function createProjectile(tower, target) {
  return {
    x         : tower.x,
    y         : tower.y,
    targetId  : target.id,
    damage    : tower.damage,
    speed     : tower.type === 'sniper' ? 8 : 4,   // sniper bullets faster
    splashRadius: tower.splashRadius || 0,
    ignoresArmor: tower.ignoresArmor || false,
    color     : tower.color,
    radius    : tower.type === 'cannon' ? 6 : 3,
    towerType : tower.type,
    tower     : tower,    // reference for kill credit
  };
}

function updateProjectile(proj, enemies) {
  // Find live target
  const target = enemies.find(e => e.id === proj.targetId);

  if (!target) {
    // Target died — projectile continues to last known position then disappears
    return false;   // remove projectile
  }

  // Move toward target
  const dx    = target.x - proj.x;
  const dy    = target.y - proj.y;
  const dist  = Math.sqrt(dx * dx + dy * dy);

  if (dist < proj.speed + target.size) {
    // HIT
    applyProjectileHit(proj, target, enemies);
    return false;   // remove projectile
  }

  proj.x += (dx / dist) * proj.speed;
  proj.y += (dy / dist) * proj.speed;
  return true;    // keep projectile
}

function applyProjectileHit(proj, target, enemies) {
  if (proj.splashRadius > 0) {
    // Cannon splash — damage ALL enemies in splash radius
    enemies.forEach(e => {
      const dist = Math.hypot(e.x - target.x, e.y - target.y);
      if (dist <= proj.splashRadius) {
        dealDamage(proj.tower, e, proj.damage, proj.ignoresArmor);
        spawnSplashRing(target.x, target.y, proj.splashRadius);
      }
    });
  } else {
    // Single target hit
    dealDamage(proj.tower, target, proj.damage, proj.ignoresArmor);
  }
}

function dealDamage(tower, enemy, damage, ignoresArmor = false) {
  const effective = ignoresArmor
    ? damage
    : Math.round(damage * (1 - enemy.armor));

  enemy.health -= effective;
  spawnFloatingText('-' + effective, enemy.x, enemy.y - enemy.size, '#e74c3c');

  if (enemy.health <= 0) {
    killEnemy(tower, enemy);
  }
}
\`\`\`

═══════════════════════════════════════════════════
### SLOW TOWER BEHAVIOR
═══════════════════════════════════════════════════

\`\`\`javascript
function fireSlowTower(tower, enemies, now) {
  if (now - tower.lastFireTime < tower.fireRate) return;
  tower.lastFireTime = now;

  // Pulse all enemies in range
  enemies.forEach(e => {
    const dist = Math.hypot(e.x - tower.x, e.y - tower.y);
    if (dist <= tower.range) {
      // Apply slow
      if (!e.slowed) {
        e.originalSpeed = e.speed;
        e.speed = parseFloat((e.originalSpeed * tower.slowFactor).toFixed(2));
        e.slowed = true;
        e.color_override = '#3498db';   // turn enemy blue
      }
      e.slowTimer = tower.slowDuration;    // refresh duration

      // Deal minor damage
      dealDamage(tower, e, tower.damage, false);
    }
  });

  // Draw visual pulse ring on canvas
  spawnPulseRing(tower.x, tower.y, tower.range);
}

// In game loop — tick down slow timers
function updateSlowEffects(enemies, deltaTime) {
  enemies.forEach(e => {
    if (e.slowed) {
      e.slowTimer -= deltaTime;
      if (e.slowTimer <= 0) {
        e.speed = e.originalSpeed;
        e.slowed = false;
        e.color_override = null;    // restore original color
      }
    }
  });
}
\`\`\`

═══════════════════════════════════════════════════
### TESLA TOWER BEHAVIOR
═══════════════════════════════════════════════════

\`\`\`javascript
function fireTeslaTower(tower, enemies, now) {
  if (now - tower.lastFireTime < tower.fireRate) return;
  tower.lastFireTime = now;

  const targets = getTeslaTargets(tower, enemies);
  if (!targets.length) return;

  targets.forEach(target => {
    // Instant damage — no projectile
    dealDamage(tower, target, tower.damage, false);

    // Draw lightning arc on canvas (fades over 200ms)
    spawnLightningArc(tower.x, tower.y, target.x, target.y);
  });
}

// Lightning arc visual — jagged line, rendered for 1–2 frames
function spawnLightningArc(x1, y1, x2, y2) {
  lightningArcs.push({
    x1, y1, x2, y2,
    life: 150,      // ms
    color: '#9b59b6',
    segments: 6,    // number of zigzag segments
  });
}

function drawLightningArc(ctx, arc) {
  ctx.save();
  ctx.strokeStyle = arc.color;
  ctx.lineWidth = 2;
  ctx.globalAlpha = arc.life / 150;
  ctx.beginPath();
  ctx.moveTo(arc.x1, arc.y1);

  const dx = (arc.x2 - arc.x1) / arc.segments;
  const dy = (arc.y2 - arc.y1) / arc.segments;

  for (let i = 1; i < arc.segments; i++) {
    const mx = arc.x1 + dx * i + (Math.random() - 0.5) * 16;
    const my = arc.y1 + dy * i + (Math.random() - 0.5) * 16;
    ctx.lineTo(mx, my);
  }
  ctx.lineTo(arc.x2, arc.y2);
  ctx.stroke();
  ctx.restore();
}
\`\`\`

═══════════════════════════════════════════════════
### FLOATING DAMAGE TEXT SYSTEM
═══════════════════════════════════════════════════

\`\`\`javascript
const floatingTexts = [];

function spawnFloatingText(text, x, y, color = '#fff', large = false) {
  floatingTexts.push({
    text, x, y, color,
    vy    : -1.5,           // floats upward
    life  : 800,            // ms
    maxLife: 800,
    fontSize: large ? 14 : 11,
    fontWeight: large ? 'bold' : 'normal',
  });
}

function updateFloatingTexts(deltaTime) {
  for (let i = floatingTexts.length - 1; i >= 0; i--) {
    const ft = floatingTexts[i];
    ft.y    += ft.vy;
    ft.life -= deltaTime;
    if (ft.life <= 0) floatingTexts.splice(i, 1);
  }
}

function drawFloatingTexts(ctx) {
  floatingTexts.forEach(ft => {
    ctx.save();
    ctx.globalAlpha = ft.life / ft.maxLife;
    ctx.fillStyle   = ft.color;
    ctx.font        = \`\${ft.fontWeight} \${ft.fontSize}px monospace\`;
    ctx.textAlign   = 'center';
    ctx.fillText(ft.text, ft.x, ft.y);
    ctx.restore();
  });
}

// Gold pickup floating text:
// spawnFloatingText('+' + reward + 'g', enemy.x, enemy.y, '#f1c40f');
// Level up:
// spawnFloatingText('LEVEL UP!', tower.x, tower.y - 20, '#2ecc71', true);
// Wave bonus:
// spawnFloatingText('+' + bonus + 'g WAVE BONUS', canvas.width/2, 60, '#f39c12', true);
\`\`\`

═══════════════════════════════════════════════════
### PATH COLLISION SYSTEM
═══════════════════════════════════════════════════

\`\`\`javascript
// pathTiles: Set of "gridX,gridY" strings marking tiles the path occupies
// Built once when the map is defined, before game starts

function isPathTile(gridX, gridY) {
  return pathTiles.has(\`\${gridX},\${gridY}\`);
}

function canPlaceTower(gridX, gridY) {
  if (isPathTile(gridX, gridY)) return false;       // on path
  if (getTowerAt(gridX, gridY)) return false;        // occupied
  return true;
}

// On canvas click (tower placement):
function handleCanvasClick(e) {
  if (selectedTowerType === null) return;
  const gridX = Math.floor(e.offsetX / CELL_SIZE);
  const gridY = Math.floor(e.offsetY / CELL_SIZE);

  if (!canPlaceTower(gridX, gridY)) {
    flashMessage('Cannot place tower here!');
    return;
  }

  const cost = TOWER_TYPES[selectedTowerType].cost;
  if (gold < cost) {
    flashMessage('Not enough gold!');
    return;
  }

  gold -= cost;
  towers.push(createTower(
    selectedTowerType, gridX, gridY,
    gridX * CELL_SIZE + CELL_SIZE / 2,
    gridY * CELL_SIZE + CELL_SIZE / 2
  ));
  updateHUD();
}
\`\`\`

═══════════════════════════════════════════════════
### SPEED TOGGLE SYSTEM
═══════════════════════════════════════════════════

\`\`\`javascript
const SPEED_MODES = [1, 2, 4];
let speedIndex = 0;
let gameSpeed  = 1;

function toggleSpeed() {
  speedIndex = (speedIndex + 1) % SPEED_MODES.length;
  gameSpeed  = SPEED_MODES[speedIndex];
  document.getElementById('btn-speed').textContent =
    ['x1 ▶', 'x2 ⏩', 'x4 ⚡'][speedIndex];
}

// Apply speed in game loop:
function gameLoop(timestamp) {
  const rawDelta = timestamp - lastTimestamp;
  lastTimestamp  = timestamp;

  // Scale all time-based values by gameSpeed
  const delta = rawDelta * gameSpeed;

  updateEnemies(delta);
  updateProjectiles(delta);
  updateSlowEffects(delta, delta);
  updateFloatingTexts(delta);
  tickTowers(timestamp);        // towers use real timestamp for fireRate checks
                                // but enemy movement uses scaled delta

  drawAll();
  requestAnimationFrame(gameLoop);
}

// For tower fire rate: use real timestamp (not scaled) so
// speed toggle doesn't break cooldown math.
// For enemy movement: multiply speed * delta (scaled).
\`\`\`

═══════════════════════════════════════════════════
### GRID BACKGROUND + STYLED PATH
═══════════════════════════════════════════════════

\`\`\`javascript
function drawGrid(ctx) {
  // Background
  ctx.fillStyle = '#1a1a2e';    // dark navy base
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Grid lines
  ctx.strokeStyle = 'rgba(255,255,255,0.06)';
  ctx.lineWidth   = 0.5;

  for (let x = 0; x <= canvas.width; x += CELL_SIZE) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
  }
  for (let y = 0; y <= canvas.height; y += CELL_SIZE) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
  }

  // Path tiles — draw styled path
  pathTiles.forEach(key => {
    const [gx, gy] = key.split(',').map(Number);
    ctx.fillStyle = '#8B7355';      // dirt/sand color
    ctx.fillRect(gx * CELL_SIZE + 1, gy * CELL_SIZE + 1, CELL_SIZE - 2, CELL_SIZE - 2);

    // Path texture lines (subtle)
    ctx.strokeStyle = 'rgba(0,0,0,0.2)';
    ctx.lineWidth = 1;
    ctx.strokeRect(gx * CELL_SIZE + 3, gy * CELL_SIZE + 3, CELL_SIZE - 6, CELL_SIZE - 6);
  });
}
\`\`\`

═══════════════════════════════════════════════════
### INFO BAR (SELECTED TOWER STATS)
═══════════════════════════════════════════════════

HTML element fixed at bottom of screen. Updates on tower selection and every tick.

\`\`\`javascript
function updateInfoBar(tower) {
  if (!tower) {
    document.getElementById('info-bar').innerHTML =
      '<span style="color:#666">Click a tower to see its stats</span>';
    return;
  }

  const sellValue = Math.floor(tower.totalInvested * 0.6);
  const xpNext    = XP_THRESHOLDS[tower.level] || 'MAX';

  document.getElementById('info-bar').innerHTML = \`
    <span class="info-type">\${TOWER_TYPES[tower.type].label} Lv.\${tower.level}</span>
    <span>⚔ DMG: \${tower.damage}</span>
    <span>◎ Range: \${tower.range}px</span>
    <span>⚡ Rate: \${tower.fireRate}ms</span>
    <span>💀 Kills: \${tower.kills}</span>
    <span>★ XP: \${tower.xp}/\${xpNext}</span>
    <span>Target: \${tower.targetMode}</span>
    <button onclick="sellTower(selectedTower)">Sell: \${sellValue}g</button>
  \`;
}

function sellTower(tower) {
  if (!tower) return;
  const refund = Math.floor(tower.totalInvested * 0.6);
  gold += refund;
  towers = towers.filter(t => t !== tower);
  selectedTower = null;
  updateInfoBar(null);
  updateHUD();
  spawnFloatingText('+' + refund + 'g sold', tower.x, tower.y, '#f1c40f');
}
\`\`\`

═══════════════════════════════════════════════════
### GOLD & ECONOMY SYSTEM
═══════════════════════════════════════════════════

\`\`\`javascript
const STARTING_GOLD = 200;

function killEnemy(tower, enemy) {
  // Award gold (already scaled in getScaledEnemy)
  gold += enemy.reward;
  spawnFloatingText('+' + enemy.reward + 'g', enemy.x, enemy.y, '#f1c40f');

  // Award XP to killing tower
  if (tower) awardKill(tower, enemy);

  // Remove enemy
  enemies = enemies.filter(e => e.id !== enemy.id);
  enemiesKilledThisWave++;

  updateHUD();
  checkWaveComplete();
}

function awardWaveBonus(wave) {
  const bonus = getWaveBonus(wave);
  gold += bonus;
  spawnFloatingText('+' + bonus + 'g WAVE BONUS', canvas.width / 2, 80, '#f39c12', true);
  updateHUD();
}
\`\`\`

Gold scaling summary (for reference in HUD or wave preview):
Wave 1:  Normal=10g  Fast=15g  Tank=40g  Boss=150g
Wave 5:  Normal=18g  Fast=27g  Tank=72g  Boss=270g
Wave 10: Normal=27g  Fast=40g  Tank=108g Boss=405g

═══════════════════════════════════════════════════
### RESTART WITHOUT PAGE RELOAD
═══════════════════════════════════════════════════

\`\`\`javascript
function restartGame() {
  // Reset all state
  enemies          = [];
  towers           = [];
  projectiles      = [];
  floatingTexts    = [];
  lightningArcs    = [];
  gold             = STARTING_GOLD;
  lives            = 20;
  wave             = 0;
  gameState        = 'idle';    // back to pre-wave state
  speedIndex       = 0;
  gameSpeed        = 1;
  selectedTower    = null;
  selectedTowerType = null;
  waveInProgress   = false;

  updateInfoBar(null);
  updateHUD();
  document.getElementById('screen-gameover').style.display = 'none';
  document.getElementById('btn-speed').textContent = 'x1 ▶';
}
\`\`\`

Game over screen (HTML overlay):
- "Game Over" heading
- "Survived [N] waves"
- "Enemies defeated: [X]"
- "Gold earned: [X]"
- [ Try Again ] button → restartGame()
- [ Main Menu ] button (if applicable)

═══════════════════════════════════════════════════
### HUD LAYOUT
═══════════════════════════════════════════════════

Top bar (HTML, above canvas):
[ 💰 Gold: 200 ] [ ❤ Lives: 20 ] [ Wave: 0/20 ] [ 🌊 Start Wave ] [ x1 ▶ Speed ]

Tower shop (HTML, side panel or below canvas):
[ Basic 75g ] [ Cannon 150g ] [ Slow 100g ] [ Tesla 200g ] [ Sniper 175g ] [ MG 125g ]
Selected tower type highlighted in shop.

Info bar (HTML, fixed bottom):
Shows selected tower stats or "Click a tower to see its stats"

═══════════════════════════════════════════════════
### GAME STATE MACHINE
═══════════════════════════════════════════════════

\`\`\`javascript
// States: 'idle' | 'wave' | 'between' | 'paused' | 'gameover' | 'victory'
// idle     → player builds towers, clicks Start Wave
// wave     → enemies spawning and moving, towers firing
// between  → wave complete, wave bonus awarded, brief delay before next wave available
// gameover → lives reached 0, show overlay
// victory  → all waves cleared, show victory screen
\`\`\`

### Visual Style
- ${safe(a.style, "Dark modern")}
- Dark navy grid background (#1a1a2e)
- Path: sand/dirt colored (#8B7355)
- Each tower type has distinct color and shape (circle, square, diamond, etc.)
- Enemy shapes: Normal=circle, Fast=triangle, Tank=square, Boss=pentagon
- Range preview: semi-transparent circle on hover
- Tower level pips below each tower
- Level 5 towers: golden glow ring

### Technical Requirements
${formatList(a.constraints, "- Single file\n- No libraries\n- Mobile-friendly")}
- Use <canvas> for game rendering (enemies, towers, projectiles, effects)
- Use HTML elements for HUD, shop, info bar, upgrade panel (not canvas)
- requestAnimationFrame with running flag
- Separate arrays: towers[], enemies[], projectiles[], floatingTexts[], lightningArcs[]
- Remove dead entities immediately with splice or filter
- Never let any array grow unbounded

### Game Flow
${formatList(a.gameFlow, "- Start screen\n- Build phase\n- Wave start button\n- Game over screen\n- Victory screen")}

### Advanced Options
${formatList(a.advanced, "- None")}

${qualityRules}

### FINAL OUTPUT REQUIREMENTS
- Single complete HTML/CSS/JS file
- All features in MANDATORY CHECKLIST implemented and working
- Right-click upgrade panel fully functional
- Floating text spawns on: damage dealt, gold earned, level up, wave bonus
- Speed toggle affects enemy movement and slow timers, NOT tower fire cooldowns
- Path collision prevents tower placement on path tiles
- Game restarts fully on "Try Again" without page reload
- Boss appears every 5th wave with health scaled ×(wave/5) additionally
- Gold scaling formula applied to all enemy types on every wave
- Code commented by section
`;
}

function buildPlatformer(a) {
  return `
### Game
${safe(a.name, "Unnamed Platformer")}

### Setting / Theme
${safe(a.theme, "Classic platformer world")}

### Objective
Build a fully working, bug-free platformer game using ${safe(a.tech, "HTML, CSS, and JavaScript")}.

### Core Features
${formatList(a.features, "- Jumping\n- Gravity\n- Platform collision\n- Levels")}

### Controls
${formatList(a.controls, defaultControls)}

### Visual Style
- ${safe(a.style, "Pixel art")}

### Difficulty
- ${safe(a.difficulty, "Progressive")}
- Increase platform gap and enemy speed per level
- Player must always have at least one reachable platform ahead

### Technical Requirements
${formatList(a.constraints, "- Single file\n- No libraries\n- Mobile-friendly")}
- Use <canvas>
- Use requestAnimationFrame with a running flag to control the loop

### Physics Rules
- Apply gravity every frame as a velocity delta, not a position delta
- Cap fall speed to prevent tunneling through platforms
- Collision detection must check all 4 sides separately (top, bottom, left, right)
- Player must never fall through a platform regardless of frame rate

### Game Flow
${formatList(a.gameFlow, "- Start screen\n- Restart button\n- Game over screen")}
- Restart must reset player position, velocity, score, level, and all arrays

${qualityRules}

### Output
- Fully playable, bug-free platformer
- Smooth physics with no jitter or tunneling
- Clean production-ready code with comments on each major section
`;
}

function buildPuzzle(a) {
  return `
### Game
${safe(a.name, "Unnamed Puzzle Game")}

### Setting / Theme
${safe(a.theme, "Minimal modern")}

### Objective
Build a fully working, bug-free puzzle game using ${safe(a.tech, "HTML, CSS, and JavaScript")}.

### Core Mechanics
${formatList(a.mechanics, "- Drag and drop\n- Tile matching\n- Logical solving")}

### Controls
${formatList(a.controls, "- Mouse click and drag\n- Touch support")}

### Difficulty
- ${safe(a.difficulty, "Progressive")}
- Each level must be solvable — never generate an unsolvable puzzle
- Validate puzzle solvability before presenting to the player

### Visual Style
- ${safe(a.style, "Minimal modern")}

### Technical Requirements
${formatList(a.constraints, "- Single file\n- No libraries\n- Mobile-friendly")}

### Game Flow
${formatList(a.gameFlow, "- Start screen\n- Restart button\n- Level progression")}
- Completing a level must always advance to the next
- Restart must fully reset the board and all state

${qualityRules}

### Output
- Fully playable, bug-free puzzle game
- Every level must be winnable
- Clean production-ready code with comments on each major section
`;
}
