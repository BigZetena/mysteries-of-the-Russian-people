import { home, outside, human } from "./data.js";
const homeButton = document.querySelector(".myst__house");
const outsideButton = document.querySelector(".myst__outside");
const humanButton = document.querySelector(".myst__people");
const section = document.querySelector(".myst__section");

let homeCopy = home;
let outsideCopy = outside;
let humanCopy = human;

let homeCount = -1;
let homeFailCount = 0;
let outsideCount = -1;
let outsideFailCount = 0;
let humanCount = -1;
let humanFailCount = 0;

drowThemeCounter(homeCopy, true);
drowThemeCounter(outsideCopy, true);
drowThemeCounter(humanCopy, true);

function drowThemeCounter(arr, param) {
  let buttonSelector;
  let i;
  let f;
  if (param) {
    switch (arr) {
      case homeCopy:
        homeCount++;
        break;
      case outsideCopy:
        outsideCount++;
        break;
      case humanCopy:
        humanCount++;
        break;
    }
  } else {
    switch (arr) {
      case homeCopy:
        homeFailCount++;
        break;
      case outsideCopy:
        outsideFailCount++;
        break;
      case humanCopy:
        humanFailCount++;
        break;
    }
  }
  switch (arr) {
    case homeCopy:
      buttonSelector = homeButton;
      f = homeFailCount;
      i = homeCount;
      break;
    case outsideCopy:
      buttonSelector = outsideButton;
      f = outsideFailCount;
      i = outsideCount;
      break;
    case humanCopy:
      buttonSelector = humanButton;
      f = humanFailCount;
      i = humanCount;
      break;
  }

  const counter = buttonSelector.querySelector(".myst__counter");
  const failCounter = buttonSelector.querySelector(".myst__fail");
  counter.textContent = `${i}/${arr.length} отгадано`;
  failCounter.textContent = `${f} раз сдался`;
}

function drowCard(arr, card, id) {
  if (!id) id = Math.floor(Math.random() * arr.length);
  card.className = "myst__card";
  card.innerHTML = `
  <div class="card__info">
     <p class="card__text">${arr[id].text}</p>
     <input type="text" class="card__input" placeholder = "Введите ответ" tabindex="-1">
    </div>
   <div class="card_navigation">
      <div class="card__buttons">
    <button class="card__button__help ">Подсказка</button>
    <button class="card__button__replace ">Заменить</button>
   
  </div> 
  <div class="card__answer">
    <button class="card__button__answer ">Сдаешься?</button>
  </div>   
    </div>`;
  const input = card.querySelector(".card__input");
  const help = card.querySelector(".card__button__help");
  const replace = card.querySelector(".card__button__replace");
  const answer = card.querySelector(".card__button__answer");
  const cardButtons = card.querySelector(".card_navigation");
  help.addEventListener("click", () => {
    help.textContent = ucFirst(arr[id].help);
    help.className = "card__button__help__show";
  });

  replace.addEventListener("click", () => drowCard(arr, card));
  answer.addEventListener("click", () =>
    showAnswer(arr, id, cardButtons, card)
  );
  input.addEventListener("change", (event) => {
    event.preventDefault();
    if (input.value.toLowerCase() === arr[id].answer) {
      card.innerHTML = `<div class="card__win__div">
            <p class="card__win__text">Умница!</p>
      </div>`;
      arrReduse(arr);
      drowThemeCounter(arr, true);
      setTimeout(() => drowCard(arr, card), 1500);
    } else {
      card.innerHTML = `<div class="card__fail__div">
            <p class="card__win__text">Неверно!</p>
      </div>`;
      setTimeout(() => drowCard(arr, card, id), 1500);
    }
  });
}

function showAnswer(arr, id, cardButtons, card) {
  cardButtons.innerHTML = `<p class= "card__button__answer__show">${ucFirst(
    arr[id].answer
  )}</p>`;
  arrReduse(arr, arr[id].id);
  drowThemeCounter(arr, false);
  setTimeout(() => drowCard(arr, card), 2500);
}

function arrReduse(arr, id) {
  const index = arr.findIndex((n) => n.id === id);
  if (index !== -1) {
    arr.splice(index, 1);
  }
}

function drowThemeCard(arr, count) {
  section.innerHTML = "";
  for (let i = 0; i < count; i++) {
    const card = document.createElement("div");
    drowCard(arr, card);
    section.append(card);
  }
}

function ucFirst(str) {
  if (!str) return str;

  return str[0].toUpperCase() + str.slice(1);
}

homeButton.addEventListener("click", () => drowThemeCard(homeCopy, 6));
outsideButton.addEventListener("click", () => drowThemeCard(outsideCopy, 6));
humanButton.addEventListener("click", () => drowThemeCard(humanCopy, 6));
