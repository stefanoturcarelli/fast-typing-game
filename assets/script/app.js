"use strict";

// localStorage.clear();

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
const pastScoresBtn = select(".past-scores-btn");
const gameOverContainer = select(".game-over-container");
const scoreContainer = select(".scores-container");
const scoreBtn = select(".scores-btn");
const scoreList = select(".scores-list");
const continueBtn = select(".continue-btn");
const resetBtn = select(".reset-btn");
const restartBtn = selectAll(".restart-btn");
const dataValues = selectAll(".data-value");
const input = select(".input");

const word = select(".word");
const usedWordsArray = [];

const music = new Audio("./assets/media/sound/music.mp3");
music.volume = 0.1;

const endingSound = new Audio("./assets/media/sound/ending.mp3");
endingSound.volume = 0.1;

let time = 20;
let timerInterval;
let totalWords = wordsArray.length;

let points = 0;
let percentage = 0;

const scoreArray = [];

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

      let score = {
        points: points,
        percentage: percentage,
        date: new Date().toLocaleString(),
      };

      let highestScore = parseInt(localStorage.getItem("highestScore")) || 0;

      if (points > highestScore) {
        localStorage.setItem("highestScore", points);
        scoreArray.push(score);
      }

      scoreArray.sort((a, b) => {
        return b.points - a.points;
      });

      if (scoreArray.length > 9) {
        scoreArray.pop();
      }

      scoreList.innerHTML = "";

      scoreArray.forEach((score) => {
        localStorage.setItem("scores", JSON.stringify(scoreArray));

        const paragraph = create("p");
        paragraph.innerHTML = `#${
          scoreArray.indexOf(score) + 1
        } Points: <span class="score-points">${
          score.points
        }</span> Date: <span class="score-date">${score.date}</span>`;
        scoreList.appendChild(paragraph);
      });

      gameOverContainer.style.display = "block";

      music.pause();
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
  messageContainer.classList.add("hide");
  overlay.classList.add("hide");
}

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
    usedWordsArray.push(currentWord);
    wordsArray.shift(currentWord);

    points++;
    dataValues[0].textContent = points;

    percentage = Math.round((points / totalWords) * 100, 2);
    dataValues[1].textContent = percentage;

    input.value = "";
    word.textContent = getRandomWordFromShuffledArray();
  }
}

function resetGameValues() {
  overlay.style.display = "none";
  wordsArray.push(...usedWordsArray);
  usedWordsArray.splice(0, usedWordsArray.length);

  if (gameOverContainer.style.display === "block") {
    gameOverContainer.style.display = "none";
  }

  if (scoreContainer.style.display === "block") {
    scoreContainer.style.display = "none";
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
  music.play();
  input.value = "";

  word.style.display = "block";
  input.style.display = "block";
  input.focus();
}

function showPastScores() {
  scoreContainer.style.display = "block";
  messageContainer.style.display = "none";

  scoreList.innerHTML = "";

  scoreArray.forEach((score) => {
    const paragraph = create("p");
    paragraph.innerHTML = `#${
      scoreArray.indexOf(score) + 1
    } Points: <span class="score-points">${
      score.points
    }</span> Date: <span class="score-date">${score.date}</span>`;
    scoreList.appendChild(paragraph);
  });

  localStorage.getItem("scores");
}

function checkIfThereAreScores() {
  if (localStorage.getItem("scores") !== null) {
    pastScoresBtn.style.display = "block";
    const scores = JSON.parse(localStorage.getItem("scores"));
    scores.forEach((score) => {
      scoreArray.push(score);
    });
  }
}

// ! ---------------------------------------------------------------------------
// ! Event listeners
// ! ---------------------------------------------------------------------------

onEvent("click", continueBtn, () => {
  word.textContent = getRandomWordFromShuffledArray(shuffleArray(wordsArray));

  input.focus();
  music.play();
  hideMessageWithOverlay();
  startTimer();
});

restartBtn.forEach((btn) => {
  onEvent("click", btn, () => {
    startTimer();
    resetGameValues();
  });
});

onEvent("click", scoreBtn, () => {
  scoreContainer.style.display = "block";
  gameOverContainer.style.display = "none";
});

onEvent("click", pastScoresBtn, () => {
  showPastScores();
});

onEvent("input", input, () => {
  checkWord();
});

onEvent("load", window, () => {
  checkIfThereAreScores();
});
