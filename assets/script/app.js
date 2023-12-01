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

const buttonSettings = select(".header-menu-btn-1");
const buttonCoins = select(".header-menu-btn-2");
const buttonGems = select(".header-menu-btn-3");
const buttonMenu = select(".header-menu-btn-4");
const buttonStart = select(".game-start-btn");
const buttonReset = select(".game-reset-btn");
const inputWord = select(".game-input");
const randomWordDisplay = select(".random-word-display");
const gameTimer = select(".game-timer");

// Game timer
function startTimer() {
  const timer = setInterval(() => {
    game.seconds--;
    gameTimer.textContent = game.seconds;
    if (game.seconds === 0) {
      clearInterval(timer);
      game.isGameFinished = true;
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
  const audio = new Audio("./assets/media/music/music.mp3");
  audio.play();
}

onEvent("click", buttonSettings, playButtonSound);
onEvent("click", buttonCoins, playButtonSound);
onEvent("click", buttonGems, playButtonSound);
onEvent("click", buttonMenu, playButtonSound);
onEvent("click", buttonStart, () => {
  playButtonSound();
  playMusic();
  startTimer();
});
onEvent("click", buttonReset, playButtonSound);

onEvent("keydown", document, playKeySound);

// Avoid the key sound to repeat when the user holds the key
onEvent("keydown", document, (event) => {
  if (event.repeat) {
    event.preventDefault();
  }
});

// ! Game logic

const game = {
  words: words,
  usedWords: [],
  seconds: 99,
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
  game.usedWords.push(randomWord); // Add the word to usedWords
  return randomWord;
}

function printRandomWordFromArray() {
  const randomWord = getRandomWord();
  randomWordDisplay.textContent = randomWord;
  return randomWord;
}

onEvent("click", buttonStart, () => {
  // Start the game
  game.isGameStarted = true;
  game.isGameFinished = false;
  game.isGamePaused = false;
  game.isGameReset = false;
  game.isGameMuted = false;
  game.isGameMusicMuted = false;
  game.isGameSoundMuted = false;

  game.currentWord = printRandomWordFromArray();
  game.currentWordIndex = game.words.indexOf(game.currentWord);
  print(game.currentWordIndex);
  print(game.currentWord);
  print(game.words.length);

  // Hide the start button
  buttonStart.classList.add("hidden");
  // Show the reset button
  buttonReset.classList.remove("hidden");
  // Show timer
  gameTimer.style.visibility = "visible";
});

onEvent("input", inputWord, () => {
  const typedWord = inputWord.value.trim().toLowerCase();

  if (typedWord === game.currentWord.toLowerCase()) {
    game.points++;
    print(game.points);
    inputWord.value = ""; // Clear the input field
    game.currentWord = printRandomWordFromArray();
    game.currentWordIndex = game.words.indexOf(game.currentWord);
    print(game.currentWordIndex);
    print(game.currentWord);
    print(game.words.length);
  }
});
