/**********************
 * SUDOKU COMPLETO JS *
 **********************/

let seconds = 0;
let timerInterval = null;
let selectedLevel = null;
let solvedBoard = null;
let currentPuzzle = null;
let paused = false;

const grid = document.getElementById("grid");
const msg = document.getElementById("msg");
const btnCheck = document.getElementById("check");
const btnReset = document.getElementById("reset");
const timeEl = document.getElementById("time");

const menuEl = document.getElementById("menu");
const homeBtn = document.getElementById("home");
const solveBtn = document.getElementById("solve");
const pauseBtn = document.getElementById("pause");

/* =====================
   TIMER
===================== */
function updateTimer() {
  if (!timeEl) return;
  const min = String(Math.floor(seconds / 60)).padStart(2, "0");
  const sec = String(seconds % 60).padStart(2, "0");
  timeEl.textContent = `${min}:${sec}`;
}

function startTimer() {
  stopTimer();
  seconds = 0;
  updateTimer();
  timerInterval = setInterval(() => {
    seconds++;
    updateTimer();
  }, 1000);
}

function resumeTimer() {
  stopTimer();
  timerInterval = setInterval(() => {
    seconds++;
    updateTimer();
  }, 1000);
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

/* =====================
   SUDOKU GENERATOR
===================== */
function generateSolvedBoard() {
  const board = Array.from({ length: 9 }, () => Array(9).fill(0));
  solve(board);
  return board;
}

function solve(board) {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r][c] === 0) {
        const nums = shuffle([1,2,3,4,5,6,7,8,9]);
        for (let n of nums) {
          if (isValidAt(board, r, c, n)) {
            board[r][c] = n;
            if (solve(board)) return true;
            board[r][c] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}

function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

function removeNumbers(board, difficulty) {
  const holes = { easy: 35, normal: 45, medium: 55, hard: 65 };
  let removed = 0;
  const target = holes[difficulty] ?? 45;

  while (removed < target) {
    const r = Math.floor(Math.random() * 9);
    const c = Math.floor(Math.random() * 9);
    if (board[r][c] !== 0) {
      board[r][c] = 0;
      removed++;
    }
  }
  return board;
}

/* =====================
   UI / TABLERO
===================== */
function buildGrid() {
  if (!currentPuzzle) return;

  grid.innerHTML = "";
  msg.textContent = "";

  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const cell = document.createElement("div");
      cell.className = "cell";

      if (c === 2 || c === 5) cell.classList.add("bold-r");
      if (r === 2 || r === 5) cell.classList.add("bold-b");

      const input = document.createElement("input");
      input.inputMode = "numeric";
      input.maxLength = 1;
      input.dataset.r = r;
      input.dataset.c = c;

      if (currentPuzzle[r][c] !== 0) {
        cell.classList.add("fixed");
        input.value = currentPuzzle[r][c];
        input.disabled = true;
      } else {
        input.value = "";
        input.disabled = false;
        input.addEventListener("input", onType);
      }

      cell.appendChild(input);
      grid.appendChild(cell);
    }
  }
}

function onType(e) {
  const el = e.target;
  if (!/^[1-9]$/.test(el.value)) el.value = "";
  validateLive();
}

function getBoard() {
  const board = Array.from({ length: 9 }, () => Array(9).fill(0));
  grid.querySelectorAll("input").forEach(inp => {
    const r = +inp.dataset.r;
    const c = +inp.dataset.c;
    board[r][c] = inp.value ? +inp.value : 0;
  });
  return board;
}

function isValidAt(board, r, c, val) {
  for (let i = 0; i < 9; i++) {
    if (i !== c && board[r][i] === val) return false;
    if (i !== r && board[i][c] === val) return false;
  }

  const br = Math.floor(r / 3) * 3;
  const bc = Math.floor(c / 3) * 3;
  for (let y = br; y < br + 3; y++) {
    for (let x = bc; x < bc + 3; x++) {
      if ((y !== r || x !== c) && board[y][x] === val) return false;
    }
  }
  return true;
}

function validateLive() {
  const board = getBoard();
  grid.querySelectorAll(".cell").forEach(c => c.classList.remove("bad"));

  grid.querySelectorAll("input").forEach(inp => {
    const r = +inp.dataset.r;
    const c = +inp.dataset.c;
    const val = inp.value ? +inp.value : 0;
    if (!val) return;

    if (!isValidAt(board, r, c, val)) {
      inp.parentElement.classList.add("bad");
    }
  });
}

function isComplete(board) {
  return board.flat().every(n => n !== 0);
}

/* =====================
   INICIAR PARTIDA
===================== */
function startNewGame(level) {
  selectedLevel = level;
  paused = false;
  if (pauseBtn) {
    pauseBtn.textContent = "⏸";
    pauseBtn.classList.remove("paused");
  }

  solvedBoard = generateSolvedBoard();
  currentPuzzle = removeNumbers(
    JSON.parse(JSON.stringify(solvedBoard)),
    selectedLevel
  );

  if (menuEl) menuEl.style.display = "none";
  buildGrid();
  startTimer();
}

/* =====================
   EVENTOS
===================== */

// COMPROBAR
btnCheck?.addEventListener("click", () => {
  validateLive();
  const board = getBoard();

  if (grid.querySelector(".bad")) {
    msg.textContent = "❌ Hay errores en rojo";
    return;
  }
  if (!isComplete(board)) {
    msg.textContent = "🧩 Aún faltan números";
    return;
  }

  msg.textContent = "🎉 Sudoku completado correctamente";
  stopTimer();
});

// REINICIAR (NUEVA PARTIDA con confirm)
btnReset?.addEventListener("click", () => {
  if (!selectedLevel) return;

  const ok = confirm("¿Seguro que deseas iniciar una nueva partida?");
  if (!ok) return;

  startNewGame(selectedLevel);
});

// MENU: elegir nivel
document.querySelectorAll(".menu-levels button").forEach(btn => {
  btn.addEventListener("click", () => {
    startNewGame(btn.dataset.level);
  });
});

// INICIO (volver al menú)
homeBtn?.addEventListener("click", () => {
  stopTimer();
  paused = false;
  if (pauseBtn) {
    pauseBtn.textContent = "⏸";
    pauseBtn.classList.remove("paused");
  }
  if (menuEl) menuEl.style.display = "flex";
  grid.innerHTML = "";
  msg.textContent = "";
  seconds = 0;
  updateTimer();
  selectedLevel = null;
  solvedBoard = null;
  currentPuzzle = null;
});

// RESOLVER
solveBtn?.addEventListener("click", () => {
  if (!solvedBoard) return;

  stopTimer();

  grid.querySelectorAll("input").forEach(inp => {
    const r = +inp.dataset.r;
    const c = +inp.dataset.c;
    inp.value = solvedBoard[r][c];
    inp.disabled = true;
  });

  msg.textContent = "🧠 Sudoku resuelto";
});

// PAUSA / REANUDAR (sin reiniciar tiempo)
pauseBtn?.addEventListener("click", () => {
  if (!selectedLevel) return;

  if (!paused) {
    stopTimer();
    pauseBtn.textContent = "▶";
    pauseBtn.classList.add("paused");
    paused = true;
  } else {
    resumeTimer();
    pauseBtn.textContent = "⏸";
    pauseBtn.classList.remove("paused");
    paused = false;
  }
});

/* =====================
   INICIO
===================== */
updateTimer();
// OJO: ya no llamo buildGrid() aquí, porque ahora todo arranca desde el menú
