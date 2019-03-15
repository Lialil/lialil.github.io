
const CurrentGame = require('./game.js').Game2048;
const CurrentSteps = require('./animation.js').CountSteps;

function RenderPage(n, playingField) {
  this.n = n;
  this.sizeOfStep = 100 + 2 * this.n;
  this.cellSize = `${(100 - this.n * 2) / this.n}%`;
  this.playingField = playingField;
  this.currentField = [];
  this.check = [];
  this.game = new CurrentGame(this.n);
  this.currentField = this.game.createField();
  this.showing(this.currentField);
}

module.exports.RenderPage = RenderPage;

RenderPage.prototype.showing = function showing(field) {
  while (this.playingField.firstChild) {
    this.playingField.removeChild(this.playingField.firstChild);
  }
  let count = 1;
  const currentCkeck = [];
  field.forEach(() => { currentCkeck.push([]); });
  field.forEach((row, indexOfRow) => {
    row.forEach((cell, index) => {
      const div = document.createElement('div');
      div.className = 'cellOfField';
      const innerDiv = document.createElement('div');
      innerDiv.className = `cell cell-${cell}`;
      if (cell !== 0) {
        innerDiv.id = `move-${count}`;
        innerDiv.innerHTML = cell;
        div.appendChild(innerDiv);
        currentCkeck[indexOfRow][index] = count;
      } else {
        currentCkeck[indexOfRow][index] = false;
      }
      this.playingField.appendChild(div);
      count += 1;
    });
  });
  this.check = currentCkeck;
  [].forEach.call(document.querySelectorAll('.cellOfField'), (el) => {
    el.style.width = this.cellSize;
    el.style.height = this.cellSize;
  });
};

RenderPage.prototype.counter = function counter(iteration) {
  let count = 0;
  iteration.forEach((row) => {
    row.forEach((cell) => {
      if (cell) {
        count += 1;
      }
    });
  });
  return count;
};

RenderPage.prototype.animation = function animation(field, direction, xORy, plusORminus) {
  const steps = new CurrentSteps(this.currentField, direction);
  const count = this.counter(steps);
  let currentCount = 0;
  this.currentField.forEach((row, indexOfRow) => {
    row.forEach((element, index) => {
      if (this.check[indexOfRow][index]) {
        const cell = document.getElementById(`move-${this.check[indexOfRow][index]}`);
        const animationCell = cell.animate([
          { transform: 'translate(0)' },
          { transform: `translate${xORy}(${plusORminus}${this.sizeOfStep * steps[indexOfRow][index]}%)` },
        ], 200);
        animationCell.addEventListener('finish', () => {
          cell.style.transform = `translate${xORy}(${plusORminus}${this.sizeOfStep * steps[indexOfRow][index]}%)`;
          currentCount += 1;
          if (currentCount >= count) {
            this.currentField = field;
            this.showing(this.currentField);
          }
        });
      }
    });
  });
};

RenderPage.prototype.userChoise = function userChoise(choise) {
  switch (choise) {
    case 37:
      this.animation(this.game.handleLeft(), 'left', 'X', '-');
      break;
    case 39:
      this.animation(this.game.handleRight(), 'right', 'X', '+');
      break;
    case 38:
      this.currentField = this.game.handleUp();
      this.showing(this.currentField);
      break;
    case 40:
      this.currentField = this.game.handleDown();
      this.showing(this.currentField);
      break;
    default:
      break;
  }
};
