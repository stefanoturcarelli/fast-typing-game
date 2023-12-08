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

let time = 20;
let timerInterval;
let totalWords = wordsArray.length;

let points = 0;
let percentage = 0;
let date = new Date();

const scoreArray = [];

// ! ---------------------------------------------------------------------------
// ! Game mechanics
// ! ---------------------------------------------------------------------------

dataValues[2].textContent = time;
const timerElement = dataValues[2];

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

      console.log(scoreArray);

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
  const inputValue = input.value.toLowerCase().trim();

  if (currentWord === inputValue) {
    console.log("correct");
    
    usedWordsArray.push(currentWord); // This is to add the used words to the array
    wordsArray.shift(currentWord); // This is to remove the used words from the array

    // console.log(`Words Arra: ${wordsArray}`);
    // console.log(`Used Words Array: ${usedWordsArray}`);
    // console.log(`Words Array Length: ${wordsArray.length}`);
    // console.log(`Used Words Array Length: ${usedWordsArray.length}`);

    points++;
    dataValues[0].textContent = points;

    percentage = Math.round((points / totalWords) * 100, 2);
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

    wordsArray.push(...usedWordsArray); // This is to add the used words back to the array
    usedWordsArray.splice(0, usedWordsArray.length); // This is to empty the array

    // console.log(`Words Arra: ${wordsArray}`);
    // console.log(`Used Words Array: ${usedWordsArray}`);
    // console.log(`Words Array Length: ${wordsArray.length}`);
    // console.log(`Used Words Array Length: ${usedWordsArray.length}`);

    if (gameOverContainer.style.display === "block") {
      gameOverContainer.style.display = "none";
    }

    if (resetBtn.style.display === "none") {
      resetBtn.style.display = "block";
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
