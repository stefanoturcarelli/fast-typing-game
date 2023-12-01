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

const words = [
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

const gameForm = select("#game-form");
const buttonSettings = select(".header-menu-btn-1");
const buttonCoins = select(".header-menu-btn-2");
const buttonGems = select(".header-menu-btn-3");
const buttonMenu = select(".header-menu-btn-4");
const buttonStart = select(".game-start-btn");
const buttonReset = select(".game-reset-btn");
const inputWord = select(".game-input");
const randomWordDisplay = select(".random-word-display");
const gameTimer = select(".game-timer");
const overlay = select(".overlay");
const overlayCloseBtn = select(".overlay-content-close-btn");

const backgroundMusic = new Audio("./assets/media/sound/music.mp3");

const game = {
  words: words,
  usedWords: [],
  seconds: 5,
  points: 0,
  percentage: 0,
  currentWord: "",
  currentWordIndex: 0,
  isGameStarted: false,
  isGameFinished: false,
  isGamePaused: false,
  isGameReset: false,
  isGameMuted: false,
  isGameMusicMuted: false,
  isGameSoundMuted: false,
};

/* 
!-------------------------------------------------------------------------------
! Game Timer
!-------------------------------------------------------------------------------
*/

function startTimer() {
  const timer = setInterval(() => {
    // Keydown event
    game.seconds--;
    gameTimer.textContent = game.seconds;
    if (game.seconds === 0) {
      inputWord.value = "";
      stopMusic();
      playEndingsound();
      let date = new Date();
      // Date options for the score (hours, minutes, and seconds)
      const options = {
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
      };
      const timeString = date.toLocaleTimeString("en-US", options);

      game.percentage = Math.round((game.points / game.words.length) * 100);

      const score = new Score(timeString, game.points, game.percentage);
      print(`score: ${score.getScore()}`);
      randomWordDisplay.textContent = `${score.getScore()}`;

      clearInterval(timer);
      game.isGameFinished = true;
      inputWord.style.display = "none";
      buttonStart.classList.remove("hidden");
      buttonReset.classList.add("hidden");
      gameTimer.style.visibility = "hidden";
      game.isGameFinished = true;
      document.removeEventListener("keydown", playKeySound);
      game.seconds = 5;
      game.points = 0;
      game.percentage = 0;
            
    }
  }, 1000);
}

/* 
!-------------------------------------------------------------------------------
! Game Overlay
!-------------------------------------------------------------------------------
*/

function showOverlay() {
  overlay.classList.add("visible");
}

function hideOverlay() {
  overlay.classList.remove("visible");
}

/* 
!-------------------------------------------------------------------------------
! Game Sounds
!-------------------------------------------------------------------------------
*/

function playButtonSound() {
  const audio = new Audio("./assets/media/sound/button.mp3");
  audio.play();
}

function playKeySound() {
  const audio = new Audio("./assets/media/sound/key.mp3");
  audio.play();
}

function playMusic() {
  backgroundMusic.play();
}

function stopMusic() {
  backgroundMusic.pause();
  // Reset the audio to the beginning
  backgroundMusic.currentTime = 0;
}

function playEndingsound() {
  const audio = new Audio("./assets/media/sound/ending.mp3");
  audio.play();
}

/* 
!-------------------------------------------------------------------------------
! Game Logic
!-------------------------------------------------------------------------------
*/

function printRandomWordFromArray() {
  const randomWord = getRandomWord();
  randomWordDisplay.textContent = randomWord;
  return randomWord;
}

function getRandomWord() {
  const remainingWords = game.words.filter(
    (word) => !game.usedWords.includes(word)
  );
  if (remainingWords.length === 0) {
    // All words have been used, reset the usedWords array
    game.usedWords = [];
  }

  const randomIndex = randomNumber(0, remainingWords.length - 1);
  const randomWord = remainingWords[randomIndex];
  // Add the word to usedWords
  game.usedWords.push(randomWord);
  return randomWord;
}

function compareWords() {
  const typedWord = inputWord.value.trim().toLowerCase();

  if (typedWord === game.currentWord.toLowerCase()) {
    game.points++;
    inputWord.value = "";
    game.currentWord = printRandomWordFromArray();
    game.currentWordIndex = game.words.indexOf(game.currentWord);
  }
}

/* 
!-------------------------------------------------------------------------------
! Event Listeners
!-------------------------------------------------------------------------------
*/

// Settings button
onEvent("click", buttonSettings, () => {
  playButtonSound();
  showOverlay();
});

// Coins button
onEvent("click", buttonCoins, () => {
  playButtonSound();
  showOverlay();
});

// Gems button
onEvent("click", buttonGems, () => {
  playButtonSound();
  showOverlay();
});

// Menu button
onEvent("click", buttonMenu, () => {
  playButtonSound();
  showOverlay();
});

// Start button
onEvent("click", buttonStart, () => {
  inputWord.style.display = "block";
  onEvent("keydown", document, playKeySound);
  playButtonSound();
  playMusic();
  startTimer();
});

// Reset button
onEvent("click", buttonReset, () => {
  inputWord.value = "";
  inputWord.style.visibility = "hidden";
  buttonStart.classList.remove("hidden");
  buttonReset.classList.add("hidden");
  gameTimer.style.visibility = "hidden";
  playButtonSound();
});

onEvent("click", overlayCloseBtn, () => {
  playButtonSound();
  hideOverlay();
});

onEvent("click", buttonStart, () => {
  // Focus on the input field
  inputWord.focus();

  // Start the game
  game.currentWord = printRandomWordFromArray();
  game.currentWordIndex = game.words.indexOf(game.currentWord);

  // Hide the start button
  buttonStart.classList.add("hidden");
  // Show the reset button
  buttonReset.classList.remove("hidden");
  // Show timer
  gameTimer.style.visibility = "visible";
});

onEvent("input", inputWord, () => {
  compareWords();
});

// Form submission
// Prevent the default form submission behavior
onEvent("submit", gameForm, (event) => {
  event.preventDefault();

  const typedWord = inputWord.value.trim().toLowerCase();

  if (typedWord === game.currentWord.toLowerCase()) {
    game.points++;
    inputWord.value = ""; // Clear the input field
    game.currentWord = printRandomWordFromArray();
    game.currentWordIndex = game.words.indexOf(game.currentWord);
  }
});
