"use strict";

import {
  onEvent,
  getElement,
  select,
  selectAll,
  print,
  sleep,
  randomNumber,
  filterArray,
  create,
} from "./utils.js";

import Score from "./Score.js";

const wordsArray = [
  "dinosaur",
  "love",
  "pineapple",
  "calendar",
  "robot",
  "building",
  "population",
  "weather",
  "bottle",
  "history",
  "dream",
  "character",
  "money",
  "absolute",
  "discipline",
  "machine",
  "accurate",
  "connection",
  "rainbow",
  "bicycle",
  "eclipse",
  "calculator",
  "trouble",
  "watermelon",
  "developer",
  "philosophy",
  "database",
  "periodic",
  "capitalism",
  "abominable",
  "component",
  "future",
  "pasta",
  "microwave",
  "jungle",
  "wallet",
  "canada",
  "coffee",
  "beauty",
  "agency",
  "chocolate",
  "eleven",
  "technology",
  "promise",
  "alphabet",
  "knowledge",
  "magician",
  "professor",
  "triangle",
  "earthquake",
  "baseball",
  "beyond",
  "evolution",
  "banana",
  "perfume",
  "computer",
  "management",
  "discovery",
  "ambition",
  "music",
  "eagle",
  "crown",
  "chess",
  "laptop",
  "bedroom",
  "delivery",
  "enemy",
  "button",
  "superman",
  "library",
  "unboxing",
  "bookstore",
  "language",
  "homework",
  "fantastic",
  "economy",
  "interview",
  "awesome",
  "challenge",
  "science",
  "mystery",
  "famous",
  "league",
  "memory",
  "leather",
  "planet",
  "software",
  "update",
  "yellow",
  "keyboard",
  "window",
  "beans",
  "truck",
  "sheep",
  "band",
  "level",
  "hope",
  "download",
  "blue",
  "actor",
  "desk",
  "watch",
  "giraffe",
  "brazil",
  "mask",
  "audio",
  "school",
  "detective",
  "hero",
  "progress",
  "winter",
  "passion",
  "rebel",
  "amber",
  "jacket",
  "article",
  "paradox",
  "social",
  "resort",
  "escape",
];

const usedWordsArray = [];

const gameForm = select("#game-form");
const buttonAbout = select(".header-menu-btn-1");
const buttonCoins = select(".header-menu-btn-2");
const buttonGems = select(".header-menu-btn-3");
const buttonMenu = select(".header-menu-btn-4");
const buttonStart = select(".game-start-btn");
const buttonReset = select(".game-reset-btn");
const inputWord = select(".game-input");
const randomWordDisplay = select(".random-word-display");
const gameTimer = select(".game-timer");
const scoresArrayDisplay = select(".scores-array-container");
const statsDisplay = select(".stats");

// Overlay
const overlayAbout = select(".overlay-about");
const overlayCoins = select(".overlay-coins");
const overlayGems = select(".overlay-gems");
const overlayMenu = select(".overlay-menu");
const overlayCloseBtns = selectAll(".overlay-content-close-btn");

const gameWords = select(".game-words");
const gamePercentage = select(".game-percentage");
const gameDateScore = select(".game-date-score");

let seconds = 30;
let points = 0;
let percentage = 0;
let currentWord = "";
let currentWordIndex = 0;

const scoresArray = [];

const backgroundMusic = new Audio("./assets/media/sound/music.mp3");
const endingSound = new Audio("./assets/media/sound/ending.mp3");
const buttonSound = new Audio("./assets/media/sound/button.mp3");

function playKeySound() {
  const audio = new Audio("./assets/media/sound/key.mp3");
  audio.play();
}

function stopBackgroundMusic() {
  backgroundMusic.pause();
  backgroundMusic.currentTime = 0;
}

function printRandomWordFromArray() {
  const randomWord = getRandomWord();
  randomWordDisplay.textContent = randomWord;
  return randomWord;
}

function getRandomWord() {
  const remainingWords = wordsArray.filter(
    (word) => !usedWordsArray.includes(word)
  );
  if (remainingWords.length === 0) {
    usedWordsArray = [];
  }

  const randomIndex = randomNumber(0, remainingWords.length - 1);
  const randomWord = remainingWords[randomIndex];
  usedWordsArray.push(randomWord);
  return randomWord;
}

function compareWords() {
  const typedWord = inputWord.value.trim().toLowerCase();

  if (typedWord === currentWord.toLowerCase()) {
    points++;
    inputWord.value = "";
    currentWord = printRandomWordFromArray();
    currentWordIndex = wordsArray.indexOf(currentWord);
  }
}

// * About button and overlay
function showOverlayAbout() {
  overlayAbout.classList.add("visible");
}

function hideOverlayAbout() {
  overlayAbout.classList.remove("visible");
}

onEvent("click", buttonAbout, () => {
  buttonSound.play();
  showOverlayAbout();
});

// * Coins button and overlay

function showOverlayCoins() {
  overlayCoins.classList.add("visible");
}

function hideOverlayCoins() {
  overlayCoins.classList.remove("visible");
}

onEvent("click", buttonCoins, () => {
  buttonSound.play();
  showOverlayCoins();
});

// * Gems button and overlay

function showOverlayGems() {
  overlayGems.classList.add("visible");
}

function hideOverlayGems() {
  overlayGems.classList.remove("visible");
}

onEvent("click", buttonGems, () => {
  buttonSound.play();
  showOverlayGems();
});

// * Menu button and overlay

function showOverlayMenu() {
  overlayMenu.classList.add("visible");
}

function hideOverlayMenu() {
  overlayMenu.classList.remove("visible");
}

onEvent("click", buttonMenu, () => {
  buttonSound.play();
  showOverlayMenu();
});

overlayCloseBtns.forEach((btn) => {
  onEvent("click", btn, () => {
    buttonSound.play();
    hideOverlayAbout();
    hideOverlayCoins();
    hideOverlayGems();
    hideOverlayMenu();
  });
});

onEvent("click", buttonReset, () => {
  buttonSound.play();
  resetGame();
  gameTimer.textContent = seconds;
});

function resetGame() {
  stopBackgroundMusic();
  endingSound.play();
  clearInterval(timer);
  finalizeGame();
  resetGameValues();
}

function startGame() {
  backgroundMusic.play();
  initializeGameDisplay();
  onEvent("keydown", document, playKeySound);
  startTimer();
}

function initializeGameDisplay() {
  currentWord = printRandomWordFromArray();
  currentWordIndex = wordsArray.indexOf(currentWord);
  buttonStart.classList.add("hidden");
  buttonReset.classList.remove("hidden");
  gameTimer.style.visibility = "visible";
  gameDateScore.textContent = "";
  gameWords.textContent = "0";
  gamePercentage.textContent = "0";
  inputWord.style.opacity = "1";
}

let timer;

function startTimer() {
  timer = setInterval(() => {
    updateGameTimer();

    if (seconds === 0) {
      endGame(timer);
    }
  }, 1000);
}

function updateGameTimer() {
  seconds--;
  gameTimer.textContent = seconds;
}

onEvent("click", buttonStart, () => {
  inputWord.focus();
  buttonSound.play();
  startGame();
  statsDisplay.style.opacity = "1";
});

function endGame(timer) {
  inputWord.value = "";
  stopBackgroundMusic();
  endingSound.play();

  const timeString = getCurrentTimeString();
  updateGameScore(timeString);

  clearInterval(timer);
  finalizeGame();
}

function getCurrentTimeString() {
  const date = new Date();
  const options = {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  };
  return date.toLocaleTimeString("en-US", options);
}

function updateGameScore(timeString) {
  percentage = Math.round((points / wordsArray.length) * 100);
  const score = new Score(timeString, points, percentage);
  gameDateScore.textContent = score.getScore().split(",")[0];
  gameWords.textContent = score.getScore().split(",")[1];
  gamePercentage.textContent = score.getScore().split(",")[2];
  scoresArray.push(score);
  printScoresArray();
}

function printScoresArray() {
  scoresArrayDisplay.innerHTML = "";
  scoresArray.forEach((score) => {
    const scoreItem = create("li");
    scoreItem.textContent = `Time: ${score.getScore().split(",")[0]} - Words: ${
      score.getScore().split(",")[1]
    } - Percentage: ${score.getScore().split(",")[2]}%`;
    scoresArrayDisplay.appendChild(scoreItem);
  });
}

function finalizeGame() {
  inputWord.style.opacity = "0";
  randomWordDisplay.textContent = "Game Over";
  buttonStart.classList.remove("hidden");
  buttonReset.classList.add("hidden");
  gameTimer.style.visibility = "hidden";
  document.removeEventListener("keydown", playKeySound);
  resetGameValues();
}

function resetGameValues() {
  seconds = 30;
  points = 0;
  percentage = 0;
}

onEvent("input", inputWord, () => {
  compareWords();
  gameWords.textContent = points;
  gamePercentage.textContent = Math.round((points / wordsArray.length) * 100);
});

// Prevent the default form submission behavior
onEvent("submit", gameForm, (event) => {
  event.preventDefault();

  const typedWord = inputWord.value.trim().toLowerCase();

  if (typedWord === currentWord.toLowerCase()) {
    points++;
    inputWord.value = "";
    currentWord = printRandomWordFromArray();
    currentWordIndex = wordsArray.indexOf(currentWord);
  }
});
