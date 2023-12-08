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

// import Score from "./Score.js";

import wordsArray from "./words.js";

const overlay = select(".overlay");
const messageContainer = select(".message-container");
const gameOverContainer = select(".game-over-container");
const continueBtn = select(".continue-btn");
const resetBtn = select(".reset-btn");
const restartBtn = selectAll(".restart-btn");
const dataValues = selectAll(".data-value");
const input = select(".input");
const word = select(".word");

const music = new Audio("./assets/media/sound/music.mp3");
music.volume = 0.1;

const endingSound = new Audio("./assets/media/sound/ending.mp3");
endingSound.volume = 0.1;

let points = 0;
let totalWords = wordsArray.length;
let percentage = 0;

let time = 20;
dataValues[2].textContent = time;
const timerElement = dataValues[2];
let timerInterval;

function startTimer() {
  resetTimer();

  clearInterval(timerInterval);

  timerInterval = setInterval(() => {
    if (time >= 0) {
      timerElement.textContent = time--;
    } else {
      clearInterval(timerInterval);
      input.style.display = "none";
      word.style.display = "none";
      console.log("game over");
      gameOverContainer.style.display = "block";
      // music.pause();
      endingSound.play();
      if (gameOverContainer.style.display === "block") {
        resetBtn.style.display = "none";
      }
    }
  }, 1000);
}

function resetTimer() {
  time = 20;
  dataValues[2].textContent = time;
}

function hideMessageWithOverlay() {
  console.log("continue");
  messageContainer.classList.add("hide");
  overlay.classList.add("hide");
}

// ! ---------------------------------------------------------------------------
// ! Word mechanics
// ! ---------------------------------------------------------------------------

const usedWordsArray = [];

function shuffleArray(array) {
  const shuffledArray = array.sort(() => Math.random() - 0.5);
  return shuffledArray;
}

function getRandomWordFromShuffledArray() {
  const shuffledArray = shuffleArray(wordsArray);
  const randomWord = shuffledArray[0];

  return randomWord;
}

function checkWord() {
  const currentWord = word.textContent;
  const inputValue = input.value;

  if (currentWord === inputValue) {
    console.log("correct");
    wordsArray.shift(currentWord);
    console.log(wordsArray.length);
    points++;
    dataValues[0].textContent = points;

    percentage = Math.floor((points / totalWords) * 100);
    dataValues[1].textContent = percentage;

    input.value = "";
    word.textContent = getRandomWordFromShuffledArray();
  }
}

// ! ---------------------------------------------------------------------------
// ! Event listeners
// ! ---------------------------------------------------------------------------

onEvent("click", continueBtn, () => {
  word.textContent = getRandomWordFromShuffledArray(shuffleArray(wordsArray));

  input.focus();
  // music.play();
  hideMessageWithOverlay();
  startTimer();
});

restartBtn.forEach((btn) => {
  onEvent("click", btn, () => {
    console.log("reset");
    if (gameOverContainer.style.display === "block") {
      gameOverContainer.style.display = "none";
    }

    word.textContent = getRandomWordFromShuffledArray(shuffleArray(wordsArray));

    points = 0;
    dataValues[0].textContent = points;

    percentage = 0;
    dataValues[1].textContent = percentage;

    music.currentTime = 0;
    // music.play();
    input.value = "";
    startTimer();
    word.style.display = "block";
    input.style.display = "block";
    input.focus();
  });
});

onEvent("input", input, () => {
  checkWord();
});
