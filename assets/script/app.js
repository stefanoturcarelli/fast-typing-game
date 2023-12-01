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

// ! Requirements:
// Players have 99 seconds to enter as many words as possible
// (in an input field).
// Game randomizes the words
// Game displays a new word as soon as the player enter the previous one.
// Players can't go to the next word unless they get the current word right.
// Game displays the remaining seconds and the number of hits/points.
// Web page plays a background music when the game starts

// Game contains 120 words (see the array below).

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

// Create a Score object when the timer reaches 0
let hits = 0;
let percentage = 0;

// Game timer
function startTimer() {
  const timer = setInterval(() => {
    game.seconds--;
    gameTimer.textContent = game.seconds;
    if (game.seconds === 0) {
      // Pause the music when the timer reaches 0
      stopMusic();
      let date = new Date();
      const score = new Score(date, hits, percentage);
      print(`score: ${score.getScore()}`);
      clearInterval(timer);
      game.isGameFinished = true;
      playEndingsound();
    }
  }, 1000);
}

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

onEvent("click", buttonSettings, () => {
  playButtonSound();
  showOverlay();
});

onEvent("click", buttonCoins, playButtonSound);
onEvent("click", buttonGems, playButtonSound);
onEvent("click", buttonMenu, playButtonSound);
onEvent("click", buttonStart, () => {
  playButtonSound();
  playMusic();
  startTimer();
});
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

onEvent("keydown", document, playKeySound);

const game = {
  words: words,
  usedWords: [],
  seconds: 30,
  points: 0,
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

function startGame() {}

function grabWordFromInput() {
  const word = inputWord.value.trim().toLowerCase();
  inputWord.value = "";
  return word;
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

function printRandomWordFromArray() {
  const randomWord = getRandomWord();
  randomWordDisplay.textContent = randomWord;
  return randomWord;
}

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
  // Show input
  // inputWord.style.visibility = "visible";
});

onEvent("input", inputWord, () => {
  const typedWord = inputWord.value.trim().toLowerCase();

  if (typedWord === game.currentWord.toLowerCase()) {
    hits++;
    game.points++;
    inputWord.value = ""; // Clear the input field
    game.currentWord = printRandomWordFromArray();
    game.currentWordIndex = game.words.indexOf(game.currentWord);
  }
});

function showOverlay() {
  overlay.classList.add("visible");
}

function hideOverlay() {
  overlay.classList.remove("visible");
}

onEvent("submit", gameForm, (event) => {
  // Prevent the default form submission behavior
  event.preventDefault();

  const typedWord = inputWord.value.trim().toLowerCase();

  if (typedWord === game.currentWord.toLowerCase()) {
    hits++;
    game.points++;
    inputWord.value = ""; // Clear the input field
    game.currentWord = printRandomWordFromArray();
    game.currentWordIndex = game.words.indexOf(game.currentWord);
  }
});
