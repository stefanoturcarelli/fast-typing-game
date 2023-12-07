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

import wordsArray from "./words.js";

const overlay = select(".overlay");
const messageContainer = select(".message-container");
const continueBtn = select(".continue-btn");
const resetBtn = select(".reset-btn");
const dataValues = selectAll(".data-value");
const input = select(".input");
const word = select(".word");

// Import music
const music = new Audio("./assets/media/sound/music.mp3");
// volume
music.volume = 0.1;

let time = 99;
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
      console.log("game over");
    }
  }, 1000);
}

function resetTimer() {
  time = 99;
  dataValues[2].textContent = time;
}

console.log(`wordsArray: ${wordsArray}`);

const wordsArrayCopy = [...wordsArray];
console.log(`wordsArrayCopy: ${wordsArrayCopy}`);

function shuffleArray(array) {
  array.sort(() => Math.random() - 0.5);
  console.log(`Array shuffled: ${array}`);
}

shuffleArray(wordsArrayCopy);
console.log(`Shuffled wordsArrayCopy: ${wordsArrayCopy}`);

let usedWordsArray = [];

function hideMessageWithOverlay() {
  console.log("continue");
  messageContainer.classList.add("hide");
  overlay.classList.add("hide");
}

onEvent("click", continueBtn, () => {
  input.focus();
  music.play();
  hideMessageWithOverlay();
  startTimer();
  shuffleArray(wordsArrayCopy);
  getWord();
});

onEvent("click", resetBtn, () => {
  console.log("reset");

  // set music to 0
  music.currentTime = 0;
  music.play();

  input.value = "";
  input.focus();
  startTimer();
  const newArray = [...wordsArray];
  shuffleArray(newArray);
  getWord();
  usedWordsArray = [];
});

function getWord() {
  shuffleArray(wordsArrayCopy);
  const currentWord = wordsArrayCopy[0];
  word.textContent = currentWord;
  console.log(`Current word: ${currentWord}`);
}

function compareWords(inputValue, currentWord) {
  let isInputEqualToCurrentWord = false;
  if (inputValue === currentWord) {
    removeWordFromArray(wordsArrayCopy, currentWord);
    pushWordToUsedWordsArray(usedWordsArray, currentWord);
    getWord();

    console.log(`wordsArrayCopy: ${wordsArrayCopy}`);
    console.log(`usedWordsArray: ${usedWordsArray}`);

    input.value = "";
    return (isInputEqualToCurrentWord = true);
  }
}

function removeWordFromArray(array, word) {
  const index = array.indexOf(word);
  if (index > -1) {
    array.splice(index, 1);
  }
}

function pushWordToUsedWordsArray(array, word) {
  array.push(word);
}

onEvent("input", input, () => {
  const inputValue = input.value;
  const currentWord = wordsArrayCopy[0];

  compareWords(inputValue, currentWord);

  // Get the input value
  // Get the first word from the wordsArrayCopy shuffled array
  // Check if the input value is equal to the word
  // If it is equal, remove the word from the wordsArrayCopy array and
  // add it to the usedWordsArray array
  // Get the next word from the wordsArrayCopy array and repeat the process
});
