console.clear();
const cells = document.querySelectorAll(".cell");
const gameBoard = document.getElementById("gameBoard");
const restartButton = document.getElementById("restartButton");
const status = document.getElementById("status");
const resetScoresBtn = document.getElementById("resetScores");
const scoreXEl = document.getElementById("scoreX");
const scoreOEl = document.getElementById("scoreO");
const scoreTiesEl = document.getElementById("scoreTies");

let isX = true;

// لوحة النقاط - حالة محفوظة
let scores = { X: 0, O: 0, T: 0 };

function loadScores() {
  try {
    const raw = localStorage.getItem("xoScores");
    if (raw) scores = JSON.parse(raw);
  } catch (e) {
    scores = { X: 0, O: 0, T: 0 };
  }
  updateScoreboardUI();
}

function saveScores() {
  localStorage.setItem("xoScores", JSON.stringify(scores));
}

function updateScoreboardUI() {
  if (scoreXEl) scoreXEl.textContent = String(scores.X);
  if (scoreOEl) scoreOEl.textContent = String(scores.O);
  if (scoreTiesEl) scoreTiesEl.textContent = String(scores.T);
}

function addWin(player) {
  if (player === "X") scores.X++;
  else scores.O++;
  saveScores();
  updateScoreboardUI();
}

function addTie() {
  scores.T++;
  saveScores();
  updateScoreboardUI();
}

function updateStatus(text) {
  if (status) status.textContent = text;
}

cells.forEach((cell) => {
  cell.addEventListener("mouseover", () => {
    if (!cell.classList.contains("disabled")) cell.style.backgroundColor = "#f1f5f9";
  });

  cell.addEventListener("mouseout", () => {
    if (!cell.classList.contains("disabled")) cell.style.backgroundColor = "";
  });
});

gameBoard.addEventListener("click", (e) => {
  const cell = e.target;

  if (
    cell.classList.contains("cell") &&
    !cell.classList.contains("disabled") &&
    cell.textContent === ""
  ) {
    cell.textContent = isX ? "X" : "O";
    isX = !isX;
    cell.classList.add("disabled");

    checkWinner();
    updateStatus(`Turn: ${isX ? "X" : "O"}`);
  }
});

function checkWinner() {
  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // Rows
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // Columns
    [0, 4, 8],
    [2, 4, 6], // Diagonals
  ];

  for (const combination of winningCombinations) {
    const [a, b, c] = combination;
    if (
      cells[a].textContent &&
      cells[a].textContent === cells[b].textContent &&
      cells[a].textContent === cells[c].textContent
    ) {
      const winners = [a, b, c];
      cells.forEach((cell, idx) => {
        if (winners.includes(idx)) {
          cell.classList.add("winner");
        } else {
          cell.classList.add("disabled");
        }
        cell.style.pointerEvents = "none";
      });

      const player = cells[a].textContent;
      addWin(player);
      updateStatus(`${player} is the winner`);
      return;
    }
  }

  if (Array.from(cells).every((cell) => cell.textContent !== "")) {
    addTie();
    updateStatus("It's a tie");
  }
}

restartButton.addEventListener("click", () => {
  cells.forEach((cell) => {
    cell.textContent = "";
    cell.classList.remove("disabled", "winner");
    cell.style.pointerEvents = "";
    cell.style.border = "";
    cell.style.backgroundColor = "";
  });
  console.clear();
  isX = true;
  updateStatus("Turn: X");
});

// إعادة تعيين لوحة النقاط
if (resetScoresBtn) {
  resetScoresBtn.addEventListener("click", () => {
    scores = { X: 0, O: 0, T: 0 };
    saveScores();
    updateScoreboardUI();
  });
}

// تحميل النقاط عند التحميل
loadScores();
