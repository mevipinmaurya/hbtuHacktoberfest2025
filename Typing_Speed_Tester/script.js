const quotes = [
  "The quick brown fox jumps over the lazy dog.",
  "Typing is a skill that improves with practice.",
  "Stay focused and keep improving your speed.",
  "Success comes to those who never give up.",
  "Practice makes progress, not perfection."
];

const quoteEl = document.getElementById("quote");
const inputEl = document.getElementById("input");
const timerEl = document.getElementById("timer");
const resultEl = document.getElementById("result");
const startBtn = document.getElementById("start-btn");

let startTime;
let timerInterval;
let currentQuote = "";

startBtn.addEventListener("click", startTest);

function startTest() {
  // pick random quote
  currentQuote = quotes[Math.floor(Math.random() * quotes.length)];
  quoteEl.textContent = currentQuote;

  // reset everything
  inputEl.value = "";
  inputEl.disabled = false;
  inputEl.focus();
  startBtn.disabled = true;
  resultEl.textContent = "";
  timerEl.textContent = "0.00";

  // start timer
  startTime = Date.now();
  timerInterval = setInterval(updateTimer, 10);

  // listen for typing
  inputEl.addEventListener("input", checkTyping);
}

function updateTimer() {
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
  timerEl.textContent = elapsed;
}

function checkTyping() {
  if (inputEl.value.trim() === currentQuote) {
    clearInterval(timerInterval);
    inputEl.disabled = true;
    startBtn.disabled = false;
    startBtn.textContent = "Restart Test";

    const totalTime = ((Date.now() - startTime) / 1000).toFixed(2);
    resultEl.textContent = `🎉 You completed it in ${totalTime} seconds!`;
  }
}

