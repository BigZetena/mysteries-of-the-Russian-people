import { home, outside, human } from "./data.js";
const homeButton = document.querySelector(".myst__house");
const outsideButton = document.querySelector(".myst__outside");
const humanButton = document.querySelector(".myst__people");
const section = document.querySelector(".myst__section");

//создаем копии чтобы не мутировать дату
let homeCurrent = home;
let outsideCurrent = outside;
let humanCurrent = human;

//создаем массивы с id объектов первоначальных отрисовок
let homeIdArr = getRandomId(homeCurrent, 6);
let outsideIdArr = getRandomId(outsideCurrent, 6);
let humanIdArr = getRandomId(humanCurrent, 6);

drowCounters(); //первичная отрисовка счетчиков

function getRandomId(arr, allСycles) {
  let array = [];
  let result = [];
  let id;

  for (let i = 0; i <= arr.length; i++) {
    array.push(i);
  }

  for (let countCycles = 1; countCycles <= allСycles; countCycles++) {
    id = array.splice(Math.random() * (array.length - 1), 1)[0];
    result.push(id);
  }
  console.log(result);
  for (let countId = 0; countId <= result.length - 1; countId++) {
    //во время создания id присваеваем объекту ключ, что он уже отрисован
    arr[result[countId]].display = true;
  }
  console.log(result);
  return result;
}

// перерисовка карточек темы
function drowThemeCards(arr, idArr) {
  section.innerHTML = "";
  if (!idArr.length) {
    console.log("ee");
    section.innerHTML = `<p class="myst__text">Загадки в теме закончились</p>`;
  }
  // находим индекс карточки с нужным нам id
  let objIdArr = idArr.map((id) => {
    return arr.findIndex((obj) => obj.id === id);
  });
  objIdArr.forEach((id) => {
    drowCard(arr[id], arr, idArr);
  });
  drowCounters();
}

function drowCounters() {
  drowThemeCounter(homeCurrent, homeButton);
  drowThemeCounter(outsideCurrent, outsideButton);
  drowThemeCounter(humanCurrent, humanButton);
}

function drowThemeCounter(arr, button) {
  const i = arr.filter((obj) => obj.done === true).length;
  const f = arr.filter((obj) => obj.fail === true).length;
  const last = arr.filter(
    (obj) => obj.done === false && obj.fail === false
  ).length;
  const counter = button.querySelector(".myst__counter");
  counter.innerHTML = `<p class="myst__counter"">
                      <span class="myst__counter">${i}</span>
                      <span class="myst__branch">/</span>
                      <span class="myst__fail">${f}</span></p>
                      <p class="myst__branch">${last} Осталось</p>`;
}

//отрисовка одной карточки
function drowCard(obj, arr, idArr) {
  const card = document.createElement("div");
  card.className = "myst__card";
  card.innerHTML = `<div class="card__info">
                      <p class="card__text">${obj.text}</p>
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
  //показать подсказку
  help.addEventListener("click", () => {
    help.textContent = ucFirst(obj.help);
    help.className = "card__button__help__show";
  });
  //замена карточки
  replace.addEventListener("click", () => {
    replaceCard(obj, arr, idArr);
  });
  answer.addEventListener("click", () =>
    showAnswer(obj, arr, idArr, cardButtons, card)
  );
  input.addEventListener("change", (event) => {
    event.preventDefault();
    checkAnswer(obj, arr, idArr, card, event.target.value);
  });
  section.append(card);
  console.log(idArr);
}

// функция замены карточки
function replaceCard(obj, arr, idArr) {
  //заменяемой карточке присваевам ключ, что она уже не отрисована
  obj.display = false;
  //находим индекс объекта в дате с нужным нам id в объекте
  let indexArr = arr.findIndex((elem) => elem === obj);
  let indexIdArr = idArr.findIndex((elem) => elem === indexArr);
  //фильтруем дату отсекая завершенные, проваленные, и те что сейчас на экране
  let arrFiltert = arr.filter(
    (obj) => obj.done === false && obj.fail === false && obj.display === false
  );
  if (!arrFiltert.length) {
    idArr.splice(indexIdArr, 1);
    drowThemeCards(arr, idArr);
    return;
  }
  //выбираем id случайной карточки из отфильтрованного массива
  let id = Math.floor(Math.random() * arrFiltert.length);
  id = arrFiltert[id].id;
  //заменяем в массиве id заменяемой карточки на новую
  idArr.splice(indexIdArr, 1, id);
  //новой карточке присваевам ключ, что она уже отрисована
  console.log(idArr);
  arr[id].display = true;
  drowThemeCards(arr, idArr);
}

function checkAnswer(obj, arr, idArr, card, value) {
  if (value.toLowerCase().trim() === obj.answer) {
    card.innerHTML = `<div class="card__win__div">
            <p class="card__win__text">Умница!</p>
      </div>`;
    obj.done = true;
    setTimeout(() => {
      drowThemeCards(arr, idArr);
      replaceCard(obj, arr, idArr);
    }, 1500);
  } else {
    card.innerHTML = `<div class="card__fail__div">
            <p class="card__win__text">Неверно!</p>
      </div>`;
    setTimeout(() => drowThemeCards(arr, idArr), 1100);
  }
}

function showAnswer(obj, arr, idArr, cardButtons) {
  cardButtons.innerHTML = `<p class= "card__button__answer__show">${ucFirst(
    obj.answer
  )}</p>`;
  obj.fail = true;
  setTimeout(() => replaceCard(obj, arr, idArr), 2500);
}

function ucFirst(str) {
  if (!str) return str;
  return str[0].toUpperCase() + str.slice(1);
}

function showBlock(block) {
  block.classList.add("b-show");
}

homeButton.addEventListener("click", () =>
  drowThemeCards(homeCurrent, homeIdArr)
);
outsideButton.addEventListener("click", () =>
  drowThemeCards(outsideCurrent, outsideIdArr)
);
humanButton.addEventListener("click", () =>
  drowThemeCards(humanCurrent, humanIdArr)
);
