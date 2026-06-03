const quotes = [
  "The quick brown fox jumps over the lazy dog.",
  "Typing is a skill that improves with practice.",
  "Stay focused and keep improving your speed.",
  "Success comes to those who never give up.",
  "Practice makes progress, not perfection.",
  "Every expert was once a beginner.",
  "Consistency beats intensity in the long run.",
  "Small steps every day lead to big results.",
  "The future depends on what you do today.",
  "Knowledge grows when it is shared with others.",
  "Hard work often beats talent when talent does not work hard.",
  "Believe in yourself and all that you are.",
  "Patience and persistence make an unbeatable combination.",
  "Dream big, start small, and act now.",
  "Challenges are opportunities in disguise.",
  "Learning never exhausts the mind.",
  "Great things take time and dedication.",
  "Discipline is choosing what you want most over what you want now.",
  "Success is the sum of small efforts repeated daily.",
  "Your only limit is your willingness to try.",
  "A journey of a thousand miles begins with a single step.",
  "The best preparation for tomorrow is doing your best today.",
  "Do not watch the clock; do what it does and keep going.",
  "Opportunities do not happen, you create them.",
  "Mistakes are proof that you are trying.",
  "Focus on progress, not perfection.",
  "The harder you work, the luckier you become.",
  "Every accomplishment starts with the decision to try.",
  "Stay hungry, stay curious, and keep learning.",
  "Success is not final, failure is not fatal.",
  "Typing quickly requires accuracy before speed.",
  "A calm mind helps you perform better under pressure.",
  "Technology is best when it brings people together.",
  "The secret of getting ahead is getting started.",
  "Quality is never an accident; it is always the result of effort."
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
  resultEl.textContent = "";
  timerEl.textContent = "0.00";

  // start timer
  startTime = Date.now();
  timerInterval = setInterval(updateTimer, 10);
  startBtn.textContent = "Restart Test";
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