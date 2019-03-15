(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
function CountSteps(playingField, direction) {
  this.direction = direction;
  this.playingField = playingField;
  this.n = playingField.length;

  this.permutationElements(this.playingField);
  this.mergingCells = Array(this.n * this.n).fill(false);
  this.countSteps = Array(this.n * this.n).fill(0);
  this.copyOfField = [];

  this.mergingCells = this.imagineAsDoubleArray(this.mergingCells);
  this.countSteps = this.imagineAsDoubleArray(this.countSteps);
  this.copyField();
  this.createSteps();
  this.isCellMerging();
  this.permutationElements(this.countSteps);

  return this.countSteps;
}

module.exports.CountSteps = CountSteps;

CountSteps.prototype.permutationElements = function permutationElements(field) {
  switch (this.direction) {
    case 'left':
      break;
    case 'right':
      field.forEach((item) => {
        item.reverse();
      });
      break;
    default:
      break;
  }
};

CountSteps.prototype.copyField = function copyField() {
  this.playingField.forEach((row, index) => {
    const newField = [];
    row.forEach((element, indexOfRow) => {
      newField[indexOfRow] = element;
    });
    this.copyOfField[index] = newField;
  });
};

CountSteps.prototype.imagineAsDoubleArray = function imagineAsDoubleArray(field) {
  const newField = [];
  for (let i = 0; i < this.n; i++) {
    const rowOfField = field.slice(i, i + this.n);
    newField[i] = rowOfField;
  }
  return newField;
};

CountSteps.prototype.countSameElements = function countSameElements(currentIndex, row, indexOfRow) {
  row.forEach((item, index) => {
    if (index >= currentIndex && this.playingField[indexOfRow][index] !== 0) {
      this.countSteps[indexOfRow][index] = this.countSteps[indexOfRow][index] + 1;
    }
  });
};

CountSteps.prototype.countStepsForCell = function countStepsForCell(currentIndex, row, indexOfRow) {
  let stepBack = currentIndex;
  while (row[stepBack - 1] === 0) {
    row[stepBack - 1] = row[stepBack];
    row[stepBack] = 0;
    stepBack -= 1;
    this.countSteps[indexOfRow][currentIndex] = this.countSteps[indexOfRow][currentIndex] + 1;
  }
  if (row[stepBack] === row[stepBack - 1]) {
    this.countSteps[indexOfRow][currentIndex] = this.countSteps[indexOfRow][currentIndex] + 1;
    this.countSameElements(currentIndex + 1, row, indexOfRow);
    row[stepBack] = 1;
    this.mergingCells[indexOfRow][stepBack - 1] = true;
  }
};

CountSteps.prototype.mergeCells = function mergeCells(row, currentIndex) {
  row.forEach((element, index) => {
    if (index > currentIndex && element === true) {
      row[index] = false;
      row[index - 1] = true;
    }
  });
};

CountSteps.prototype.isCellMerging = function isCellMerging() {
  this.mergingCells.forEach((row) => {
    row.forEach((element, index) => {
      if (element === true) {
        this.mergeCells(row, index);
      }
    });
  });
};

CountSteps.prototype.createSteps = function createSteps() {
  this.copyOfField.forEach((row, indexOfRow) => {
    row.forEach((element, index) => {
      if (element !== 0) {
        this.countStepsForCell(index, row, indexOfRow);
      }
    });
  });
};

},{}],2:[function(require,module,exports){
function Game2048(size) {
  this.size = size;
  this.field = [];
}
module.exports.Game2048 = Game2048;

Game2048.prototype.addTwo = function addTwo() {
  const zeroElements = [];
  this.field.forEach((item, index) => {
    if (item === 0) {
      zeroElements.push(index);
    }
  });
  const randomZeroElement = Math.floor(Math.random() * zeroElements.length);
  if (zeroElements.length !== 0) {
    this.field[zeroElements[randomZeroElement]] = 2;
    return true;
  }
  return false;
};

Game2048.prototype.createField = function createField() {
  this.field = Array(this.size * this.size).fill(0);
  this.addTwo();
  this.addTwo();
  return this.changeView();
};

Game2048.prototype.createRow = function createRow(row) {
  row *= this.size;
  return this.field.slice(row, row + this.size);
};

Game2048.prototype.changeView = function changeView() {
  const newField = [];
  for (let i = 0; i < this.size; i++) {
    const rowOfField = this.createRow(i);
    newField[i] = rowOfField;
  }
  return newField;
};

Game2048.prototype.replaceValueRow = function replaceValueRow(field, row, column) {
  row.forEach((item, index) => {
    field.splice(index + column, 1, row[index]);
  });
};

Game2048.prototype.mirror = function mirror() {
  for (let i = 0; i < this.size; i++) {
    const rowOfField = this.createRow(i);
    rowOfField.reverse();
    this.replaceValueRow(this.field, rowOfField, i * this.size);
  }
};

Game2048.prototype.rotate = function rotate() {
  const newField = [];
  for (let i = 0; i < this.size; i++) {
    for (let j = i; j < this.size * this.size; j += this.size) {
      newField.push(this.field[j]);
    }
  }
  this.replaceValueRow(this.field, newField, 0);
};

Game2048.prototype.moveNoZeroElementsInLeft = function moveNoZeroElementsInLeft(row) {
  const noZeroElements = row.filter(element => element !== 0);
  row.fill(0);

  this.replaceValueRow(row, noZeroElements, 0);
};

Game2048.prototype.mergeSameElements = function mergeSameElements(row) {
  row.forEach((item, index) => {
    if (item !== 0 && item === row[index + 1]) {
      row[index] += row[index];
      row[index + 1] = 0;
    }
  });
  this.moveNoZeroElementsInLeft(row);
};

Game2048.prototype.canSwipeInLeft = function canSwipeInLeft(row) {
  return row.some((item, index) => item > 0 && (item === row[index + 1] || row[index - 1] === 0));
};

Game2048.prototype.isFreeCell = function isFreeCell() {
  for (let i = 0; i < this.size; i++) {
    const rowOfField = this.createRow(i);
    if (this.canSwipeInLeft(rowOfField)) {
      return true;
    }
  }
  return false;
};

Game2048.prototype.swipe = function swipe() {
  const check = this.isFreeCell();
  for (let i = 0; i < this.size; i++) {
    const rowOfField = this.createRow(i);
    this.moveNoZeroElementsInLeft(rowOfField);
    this.mergeSameElements(rowOfField);
    this.replaceValueRow(this.field, rowOfField, i * this.size);
  }
  if (check) {
    this.addTwo();
  }
};

Game2048.prototype.gameOver = function gameOver() {
  if (this.field.some(element => element === 0)) {
    return false;
  }
  if (this.field.some((item, index) => item === this.field[index + this.size])) {
    return false;
  }
  if (this.field.some((item, i) => this.field[i] === this.field[i + 1] && i + 1 < i + this.size)) {
    return false;
  }
  return true;
};

Game2048.prototype.handleLeft = function handleLeft() {
  this.swipe(this.field);
  return this.changeView();
};

Game2048.prototype.handleRight = function handleRight() {
  this.mirror(this.field);
  this.swipe(this.field);
  this.mirror(this.field);
  return this.changeView();
};

Game2048.prototype.handleUp = function handleUp() {
  this.rotate(this.field);
  this.swipe(this.field);
  this.rotate(this.field);
  return this.changeView();
};

Game2048.prototype.handleDown = function handleDown() {
  this.rotate(this.field);
  this.mirror(this.field);
  this.swipe(this.field);
  this.mirror(this.field);
  this.rotate(this.field);
  return this.changeView();
};

},{}],3:[function(require,module,exports){
const CurrentPage = require('./renderPage.js').RenderPage;

document.addEventListener('DOMContentLoaded', () => {
  const n = 4;
  const playingField = document.getElementById('playingField');
  const play = new CurrentPage(n, playingField);

  document.onkeydown = function choise(event) {
    play.userChoise(event.which);
  };

  function swipedetect(callback) {
    const touchsurface = playingField;
    let swipedir;
    let startX;
    let startY;
    let distX;
    let distY;
    const threshold = 150;
    const restraint = 100;
    const allowedTime = 300;
    let elapsedTime;
    let startTime;
    const handleswipe = callback || function (swipedir) {};

    touchsurface.addEventListener('touchstart', (e) => {
      const touchobj = e.changedTouches[0];
      swipedir = 'none';
      startX = touchobj.pageX;
      startY = touchobj.pageY;
      startTime = new Date().getTime();
      e.preventDefault();
    }, false);

    touchsurface.addEventListener('touchmove', (e) => {
      e.preventDefault();
    }, false);

    touchsurface.addEventListener('touchend', (e) => {
      const touchobj = e.changedTouches[0];
      distX = touchobj.pageX - startX;
      distY = touchobj.pageY - startY;
      elapsedTime = new Date().getTime() - startTime;
      if (elapsedTime <= allowedTime) {
        if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint) {
          swipedir = (distX < 0) ? 'left' : 'right';
        } else if (Math.abs(distY) >= threshold && Math.abs(distX) <= restraint) {
          swipedir = (distY < 0) ? 'up' : 'down';
        }
      }
      handleswipe(swipedir);
      e.preventDefault();
    }, false);
  }

  swipedetect((swipedir) => {
    play.userChoise(swipedir);
  });
});

},{"./renderPage.js":4}],4:[function(require,module,exports){

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

},{"./animation.js":1,"./game.js":2}]},{},[3])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL0FwcERhdGEvUm9hbWluZy9ucG0vbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImFuaW1hdGlvbi5qcyIsImdhbWUuanMiLCJnYW1lSW5Ccm93c2VyLmpzIiwicmVuZGVyUGFnZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiZnVuY3Rpb24gQ291bnRTdGVwcyhwbGF5aW5nRmllbGQsIGRpcmVjdGlvbikge1xuICB0aGlzLmRpcmVjdGlvbiA9IGRpcmVjdGlvbjtcbiAgdGhpcy5wbGF5aW5nRmllbGQgPSBwbGF5aW5nRmllbGQ7XG4gIHRoaXMubiA9IHBsYXlpbmdGaWVsZC5sZW5ndGg7XG5cbiAgdGhpcy5wZXJtdXRhdGlvbkVsZW1lbnRzKHRoaXMucGxheWluZ0ZpZWxkKTtcbiAgdGhpcy5tZXJnaW5nQ2VsbHMgPSBBcnJheSh0aGlzLm4gKiB0aGlzLm4pLmZpbGwoZmFsc2UpO1xuICB0aGlzLmNvdW50U3RlcHMgPSBBcnJheSh0aGlzLm4gKiB0aGlzLm4pLmZpbGwoMCk7XG4gIHRoaXMuY29weU9mRmllbGQgPSBbXTtcblxuICB0aGlzLm1lcmdpbmdDZWxscyA9IHRoaXMuaW1hZ2luZUFzRG91YmxlQXJyYXkodGhpcy5tZXJnaW5nQ2VsbHMpO1xuICB0aGlzLmNvdW50U3RlcHMgPSB0aGlzLmltYWdpbmVBc0RvdWJsZUFycmF5KHRoaXMuY291bnRTdGVwcyk7XG4gIHRoaXMuY29weUZpZWxkKCk7XG4gIHRoaXMuY3JlYXRlU3RlcHMoKTtcbiAgdGhpcy5pc0NlbGxNZXJnaW5nKCk7XG4gIHRoaXMucGVybXV0YXRpb25FbGVtZW50cyh0aGlzLmNvdW50U3RlcHMpO1xuXG4gIHJldHVybiB0aGlzLmNvdW50U3RlcHM7XG59XG5cbm1vZHVsZS5leHBvcnRzLkNvdW50U3RlcHMgPSBDb3VudFN0ZXBzO1xuXG5Db3VudFN0ZXBzLnByb3RvdHlwZS5wZXJtdXRhdGlvbkVsZW1lbnRzID0gZnVuY3Rpb24gcGVybXV0YXRpb25FbGVtZW50cyhmaWVsZCkge1xuICBzd2l0Y2ggKHRoaXMuZGlyZWN0aW9uKSB7XG4gICAgY2FzZSAnbGVmdCc6XG4gICAgICBicmVhaztcbiAgICBjYXNlICdyaWdodCc6XG4gICAgICBmaWVsZC5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICAgIGl0ZW0ucmV2ZXJzZSgpO1xuICAgICAgfSk7XG4gICAgICBicmVhaztcbiAgICBkZWZhdWx0OlxuICAgICAgYnJlYWs7XG4gIH1cbn07XG5cbkNvdW50U3RlcHMucHJvdG90eXBlLmNvcHlGaWVsZCA9IGZ1bmN0aW9uIGNvcHlGaWVsZCgpIHtcbiAgdGhpcy5wbGF5aW5nRmllbGQuZm9yRWFjaCgocm93LCBpbmRleCkgPT4ge1xuICAgIGNvbnN0IG5ld0ZpZWxkID0gW107XG4gICAgcm93LmZvckVhY2goKGVsZW1lbnQsIGluZGV4T2ZSb3cpID0+IHtcbiAgICAgIG5ld0ZpZWxkW2luZGV4T2ZSb3ddID0gZWxlbWVudDtcbiAgICB9KTtcbiAgICB0aGlzLmNvcHlPZkZpZWxkW2luZGV4XSA9IG5ld0ZpZWxkO1xuICB9KTtcbn07XG5cbkNvdW50U3RlcHMucHJvdG90eXBlLmltYWdpbmVBc0RvdWJsZUFycmF5ID0gZnVuY3Rpb24gaW1hZ2luZUFzRG91YmxlQXJyYXkoZmllbGQpIHtcbiAgY29uc3QgbmV3RmllbGQgPSBbXTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLm47IGkrKykge1xuICAgIGNvbnN0IHJvd09mRmllbGQgPSBmaWVsZC5zbGljZShpLCBpICsgdGhpcy5uKTtcbiAgICBuZXdGaWVsZFtpXSA9IHJvd09mRmllbGQ7XG4gIH1cbiAgcmV0dXJuIG5ld0ZpZWxkO1xufTtcblxuQ291bnRTdGVwcy5wcm90b3R5cGUuY291bnRTYW1lRWxlbWVudHMgPSBmdW5jdGlvbiBjb3VudFNhbWVFbGVtZW50cyhjdXJyZW50SW5kZXgsIHJvdywgaW5kZXhPZlJvdykge1xuICByb3cuZm9yRWFjaCgoaXRlbSwgaW5kZXgpID0+IHtcbiAgICBpZiAoaW5kZXggPj0gY3VycmVudEluZGV4ICYmIHRoaXMucGxheWluZ0ZpZWxkW2luZGV4T2ZSb3ddW2luZGV4XSAhPT0gMCkge1xuICAgICAgdGhpcy5jb3VudFN0ZXBzW2luZGV4T2ZSb3ddW2luZGV4XSA9IHRoaXMuY291bnRTdGVwc1tpbmRleE9mUm93XVtpbmRleF0gKyAxO1xuICAgIH1cbiAgfSk7XG59O1xuXG5Db3VudFN0ZXBzLnByb3RvdHlwZS5jb3VudFN0ZXBzRm9yQ2VsbCA9IGZ1bmN0aW9uIGNvdW50U3RlcHNGb3JDZWxsKGN1cnJlbnRJbmRleCwgcm93LCBpbmRleE9mUm93KSB7XG4gIGxldCBzdGVwQmFjayA9IGN1cnJlbnRJbmRleDtcbiAgd2hpbGUgKHJvd1tzdGVwQmFjayAtIDFdID09PSAwKSB7XG4gICAgcm93W3N0ZXBCYWNrIC0gMV0gPSByb3dbc3RlcEJhY2tdO1xuICAgIHJvd1tzdGVwQmFja10gPSAwO1xuICAgIHN0ZXBCYWNrIC09IDE7XG4gICAgdGhpcy5jb3VudFN0ZXBzW2luZGV4T2ZSb3ddW2N1cnJlbnRJbmRleF0gPSB0aGlzLmNvdW50U3RlcHNbaW5kZXhPZlJvd11bY3VycmVudEluZGV4XSArIDE7XG4gIH1cbiAgaWYgKHJvd1tzdGVwQmFja10gPT09IHJvd1tzdGVwQmFjayAtIDFdKSB7XG4gICAgdGhpcy5jb3VudFN0ZXBzW2luZGV4T2ZSb3ddW2N1cnJlbnRJbmRleF0gPSB0aGlzLmNvdW50U3RlcHNbaW5kZXhPZlJvd11bY3VycmVudEluZGV4XSArIDE7XG4gICAgdGhpcy5jb3VudFNhbWVFbGVtZW50cyhjdXJyZW50SW5kZXggKyAxLCByb3csIGluZGV4T2ZSb3cpO1xuICAgIHJvd1tzdGVwQmFja10gPSAxO1xuICAgIHRoaXMubWVyZ2luZ0NlbGxzW2luZGV4T2ZSb3ddW3N0ZXBCYWNrIC0gMV0gPSB0cnVlO1xuICB9XG59O1xuXG5Db3VudFN0ZXBzLnByb3RvdHlwZS5tZXJnZUNlbGxzID0gZnVuY3Rpb24gbWVyZ2VDZWxscyhyb3csIGN1cnJlbnRJbmRleCkge1xuICByb3cuZm9yRWFjaCgoZWxlbWVudCwgaW5kZXgpID0+IHtcbiAgICBpZiAoaW5kZXggPiBjdXJyZW50SW5kZXggJiYgZWxlbWVudCA9PT0gdHJ1ZSkge1xuICAgICAgcm93W2luZGV4XSA9IGZhbHNlO1xuICAgICAgcm93W2luZGV4IC0gMV0gPSB0cnVlO1xuICAgIH1cbiAgfSk7XG59O1xuXG5Db3VudFN0ZXBzLnByb3RvdHlwZS5pc0NlbGxNZXJnaW5nID0gZnVuY3Rpb24gaXNDZWxsTWVyZ2luZygpIHtcbiAgdGhpcy5tZXJnaW5nQ2VsbHMuZm9yRWFjaCgocm93KSA9PiB7XG4gICAgcm93LmZvckVhY2goKGVsZW1lbnQsIGluZGV4KSA9PiB7XG4gICAgICBpZiAoZWxlbWVudCA9PT0gdHJ1ZSkge1xuICAgICAgICB0aGlzLm1lcmdlQ2VsbHMocm93LCBpbmRleCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xufTtcblxuQ291bnRTdGVwcy5wcm90b3R5cGUuY3JlYXRlU3RlcHMgPSBmdW5jdGlvbiBjcmVhdGVTdGVwcygpIHtcbiAgdGhpcy5jb3B5T2ZGaWVsZC5mb3JFYWNoKChyb3csIGluZGV4T2ZSb3cpID0+IHtcbiAgICByb3cuZm9yRWFjaCgoZWxlbWVudCwgaW5kZXgpID0+IHtcbiAgICAgIGlmIChlbGVtZW50ICE9PSAwKSB7XG4gICAgICAgIHRoaXMuY291bnRTdGVwc0ZvckNlbGwoaW5kZXgsIHJvdywgaW5kZXhPZlJvdyk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xufTtcbiIsImZ1bmN0aW9uIEdhbWUyMDQ4KHNpemUpIHtcbiAgdGhpcy5zaXplID0gc2l6ZTtcbiAgdGhpcy5maWVsZCA9IFtdO1xufVxubW9kdWxlLmV4cG9ydHMuR2FtZTIwNDggPSBHYW1lMjA0ODtcblxuR2FtZTIwNDgucHJvdG90eXBlLmFkZFR3byA9IGZ1bmN0aW9uIGFkZFR3bygpIHtcbiAgY29uc3QgemVyb0VsZW1lbnRzID0gW107XG4gIHRoaXMuZmllbGQuZm9yRWFjaCgoaXRlbSwgaW5kZXgpID0+IHtcbiAgICBpZiAoaXRlbSA9PT0gMCkge1xuICAgICAgemVyb0VsZW1lbnRzLnB1c2goaW5kZXgpO1xuICAgIH1cbiAgfSk7XG4gIGNvbnN0IHJhbmRvbVplcm9FbGVtZW50ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogemVyb0VsZW1lbnRzLmxlbmd0aCk7XG4gIGlmICh6ZXJvRWxlbWVudHMubGVuZ3RoICE9PSAwKSB7XG4gICAgdGhpcy5maWVsZFt6ZXJvRWxlbWVudHNbcmFuZG9tWmVyb0VsZW1lbnRdXSA9IDI7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuR2FtZTIwNDgucHJvdG90eXBlLmNyZWF0ZUZpZWxkID0gZnVuY3Rpb24gY3JlYXRlRmllbGQoKSB7XG4gIHRoaXMuZmllbGQgPSBBcnJheSh0aGlzLnNpemUgKiB0aGlzLnNpemUpLmZpbGwoMCk7XG4gIHRoaXMuYWRkVHdvKCk7XG4gIHRoaXMuYWRkVHdvKCk7XG4gIHJldHVybiB0aGlzLmNoYW5nZVZpZXcoKTtcbn07XG5cbkdhbWUyMDQ4LnByb3RvdHlwZS5jcmVhdGVSb3cgPSBmdW5jdGlvbiBjcmVhdGVSb3cocm93KSB7XG4gIHJvdyAqPSB0aGlzLnNpemU7XG4gIHJldHVybiB0aGlzLmZpZWxkLnNsaWNlKHJvdywgcm93ICsgdGhpcy5zaXplKTtcbn07XG5cbkdhbWUyMDQ4LnByb3RvdHlwZS5jaGFuZ2VWaWV3ID0gZnVuY3Rpb24gY2hhbmdlVmlldygpIHtcbiAgY29uc3QgbmV3RmllbGQgPSBbXTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnNpemU7IGkrKykge1xuICAgIGNvbnN0IHJvd09mRmllbGQgPSB0aGlzLmNyZWF0ZVJvdyhpKTtcbiAgICBuZXdGaWVsZFtpXSA9IHJvd09mRmllbGQ7XG4gIH1cbiAgcmV0dXJuIG5ld0ZpZWxkO1xufTtcblxuR2FtZTIwNDgucHJvdG90eXBlLnJlcGxhY2VWYWx1ZVJvdyA9IGZ1bmN0aW9uIHJlcGxhY2VWYWx1ZVJvdyhmaWVsZCwgcm93LCBjb2x1bW4pIHtcbiAgcm93LmZvckVhY2goKGl0ZW0sIGluZGV4KSA9PiB7XG4gICAgZmllbGQuc3BsaWNlKGluZGV4ICsgY29sdW1uLCAxLCByb3dbaW5kZXhdKTtcbiAgfSk7XG59O1xuXG5HYW1lMjA0OC5wcm90b3R5cGUubWlycm9yID0gZnVuY3Rpb24gbWlycm9yKCkge1xuICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuc2l6ZTsgaSsrKSB7XG4gICAgY29uc3Qgcm93T2ZGaWVsZCA9IHRoaXMuY3JlYXRlUm93KGkpO1xuICAgIHJvd09mRmllbGQucmV2ZXJzZSgpO1xuICAgIHRoaXMucmVwbGFjZVZhbHVlUm93KHRoaXMuZmllbGQsIHJvd09mRmllbGQsIGkgKiB0aGlzLnNpemUpO1xuICB9XG59O1xuXG5HYW1lMjA0OC5wcm90b3R5cGUucm90YXRlID0gZnVuY3Rpb24gcm90YXRlKCkge1xuICBjb25zdCBuZXdGaWVsZCA9IFtdO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuc2l6ZTsgaSsrKSB7XG4gICAgZm9yIChsZXQgaiA9IGk7IGogPCB0aGlzLnNpemUgKiB0aGlzLnNpemU7IGogKz0gdGhpcy5zaXplKSB7XG4gICAgICBuZXdGaWVsZC5wdXNoKHRoaXMuZmllbGRbal0pO1xuICAgIH1cbiAgfVxuICB0aGlzLnJlcGxhY2VWYWx1ZVJvdyh0aGlzLmZpZWxkLCBuZXdGaWVsZCwgMCk7XG59O1xuXG5HYW1lMjA0OC5wcm90b3R5cGUubW92ZU5vWmVyb0VsZW1lbnRzSW5MZWZ0ID0gZnVuY3Rpb24gbW92ZU5vWmVyb0VsZW1lbnRzSW5MZWZ0KHJvdykge1xuICBjb25zdCBub1plcm9FbGVtZW50cyA9IHJvdy5maWx0ZXIoZWxlbWVudCA9PiBlbGVtZW50ICE9PSAwKTtcbiAgcm93LmZpbGwoMCk7XG5cbiAgdGhpcy5yZXBsYWNlVmFsdWVSb3cocm93LCBub1plcm9FbGVtZW50cywgMCk7XG59O1xuXG5HYW1lMjA0OC5wcm90b3R5cGUubWVyZ2VTYW1lRWxlbWVudHMgPSBmdW5jdGlvbiBtZXJnZVNhbWVFbGVtZW50cyhyb3cpIHtcbiAgcm93LmZvckVhY2goKGl0ZW0sIGluZGV4KSA9PiB7XG4gICAgaWYgKGl0ZW0gIT09IDAgJiYgaXRlbSA9PT0gcm93W2luZGV4ICsgMV0pIHtcbiAgICAgIHJvd1tpbmRleF0gKz0gcm93W2luZGV4XTtcbiAgICAgIHJvd1tpbmRleCArIDFdID0gMDtcbiAgICB9XG4gIH0pO1xuICB0aGlzLm1vdmVOb1plcm9FbGVtZW50c0luTGVmdChyb3cpO1xufTtcblxuR2FtZTIwNDgucHJvdG90eXBlLmNhblN3aXBlSW5MZWZ0ID0gZnVuY3Rpb24gY2FuU3dpcGVJbkxlZnQocm93KSB7XG4gIHJldHVybiByb3cuc29tZSgoaXRlbSwgaW5kZXgpID0+IGl0ZW0gPiAwICYmIChpdGVtID09PSByb3dbaW5kZXggKyAxXSB8fCByb3dbaW5kZXggLSAxXSA9PT0gMCkpO1xufTtcblxuR2FtZTIwNDgucHJvdG90eXBlLmlzRnJlZUNlbGwgPSBmdW5jdGlvbiBpc0ZyZWVDZWxsKCkge1xuICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuc2l6ZTsgaSsrKSB7XG4gICAgY29uc3Qgcm93T2ZGaWVsZCA9IHRoaXMuY3JlYXRlUm93KGkpO1xuICAgIGlmICh0aGlzLmNhblN3aXBlSW5MZWZ0KHJvd09mRmllbGQpKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuR2FtZTIwNDgucHJvdG90eXBlLnN3aXBlID0gZnVuY3Rpb24gc3dpcGUoKSB7XG4gIGNvbnN0IGNoZWNrID0gdGhpcy5pc0ZyZWVDZWxsKCk7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5zaXplOyBpKyspIHtcbiAgICBjb25zdCByb3dPZkZpZWxkID0gdGhpcy5jcmVhdGVSb3coaSk7XG4gICAgdGhpcy5tb3ZlTm9aZXJvRWxlbWVudHNJbkxlZnQocm93T2ZGaWVsZCk7XG4gICAgdGhpcy5tZXJnZVNhbWVFbGVtZW50cyhyb3dPZkZpZWxkKTtcbiAgICB0aGlzLnJlcGxhY2VWYWx1ZVJvdyh0aGlzLmZpZWxkLCByb3dPZkZpZWxkLCBpICogdGhpcy5zaXplKTtcbiAgfVxuICBpZiAoY2hlY2spIHtcbiAgICB0aGlzLmFkZFR3bygpO1xuICB9XG59O1xuXG5HYW1lMjA0OC5wcm90b3R5cGUuZ2FtZU92ZXIgPSBmdW5jdGlvbiBnYW1lT3ZlcigpIHtcbiAgaWYgKHRoaXMuZmllbGQuc29tZShlbGVtZW50ID0+IGVsZW1lbnQgPT09IDApKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGlmICh0aGlzLmZpZWxkLnNvbWUoKGl0ZW0sIGluZGV4KSA9PiBpdGVtID09PSB0aGlzLmZpZWxkW2luZGV4ICsgdGhpcy5zaXplXSkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgaWYgKHRoaXMuZmllbGQuc29tZSgoaXRlbSwgaSkgPT4gdGhpcy5maWVsZFtpXSA9PT0gdGhpcy5maWVsZFtpICsgMV0gJiYgaSArIDEgPCBpICsgdGhpcy5zaXplKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn07XG5cbkdhbWUyMDQ4LnByb3RvdHlwZS5oYW5kbGVMZWZ0ID0gZnVuY3Rpb24gaGFuZGxlTGVmdCgpIHtcbiAgdGhpcy5zd2lwZSh0aGlzLmZpZWxkKTtcbiAgcmV0dXJuIHRoaXMuY2hhbmdlVmlldygpO1xufTtcblxuR2FtZTIwNDgucHJvdG90eXBlLmhhbmRsZVJpZ2h0ID0gZnVuY3Rpb24gaGFuZGxlUmlnaHQoKSB7XG4gIHRoaXMubWlycm9yKHRoaXMuZmllbGQpO1xuICB0aGlzLnN3aXBlKHRoaXMuZmllbGQpO1xuICB0aGlzLm1pcnJvcih0aGlzLmZpZWxkKTtcbiAgcmV0dXJuIHRoaXMuY2hhbmdlVmlldygpO1xufTtcblxuR2FtZTIwNDgucHJvdG90eXBlLmhhbmRsZVVwID0gZnVuY3Rpb24gaGFuZGxlVXAoKSB7XG4gIHRoaXMucm90YXRlKHRoaXMuZmllbGQpO1xuICB0aGlzLnN3aXBlKHRoaXMuZmllbGQpO1xuICB0aGlzLnJvdGF0ZSh0aGlzLmZpZWxkKTtcbiAgcmV0dXJuIHRoaXMuY2hhbmdlVmlldygpO1xufTtcblxuR2FtZTIwNDgucHJvdG90eXBlLmhhbmRsZURvd24gPSBmdW5jdGlvbiBoYW5kbGVEb3duKCkge1xuICB0aGlzLnJvdGF0ZSh0aGlzLmZpZWxkKTtcbiAgdGhpcy5taXJyb3IodGhpcy5maWVsZCk7XG4gIHRoaXMuc3dpcGUodGhpcy5maWVsZCk7XG4gIHRoaXMubWlycm9yKHRoaXMuZmllbGQpO1xuICB0aGlzLnJvdGF0ZSh0aGlzLmZpZWxkKTtcbiAgcmV0dXJuIHRoaXMuY2hhbmdlVmlldygpO1xufTtcbiIsImNvbnN0IEN1cnJlbnRQYWdlID0gcmVxdWlyZSgnLi9yZW5kZXJQYWdlLmpzJykuUmVuZGVyUGFnZTtcblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsICgpID0+IHtcbiAgY29uc3QgbiA9IDQ7XG4gIGNvbnN0IHBsYXlpbmdGaWVsZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwbGF5aW5nRmllbGQnKTtcbiAgY29uc3QgcGxheSA9IG5ldyBDdXJyZW50UGFnZShuLCBwbGF5aW5nRmllbGQpO1xuXG4gIGRvY3VtZW50Lm9ua2V5ZG93biA9IGZ1bmN0aW9uIGNob2lzZShldmVudCkge1xuICAgIHBsYXkudXNlckNob2lzZShldmVudC53aGljaCk7XG4gIH07XG5cbiAgZnVuY3Rpb24gc3dpcGVkZXRlY3QoY2FsbGJhY2spIHtcbiAgICBjb25zdCB0b3VjaHN1cmZhY2UgPSBwbGF5aW5nRmllbGQ7XG4gICAgbGV0IHN3aXBlZGlyO1xuICAgIGxldCBzdGFydFg7XG4gICAgbGV0IHN0YXJ0WTtcbiAgICBsZXQgZGlzdFg7XG4gICAgbGV0IGRpc3RZO1xuICAgIGNvbnN0IHRocmVzaG9sZCA9IDE1MDtcbiAgICBjb25zdCByZXN0cmFpbnQgPSAxMDA7XG4gICAgY29uc3QgYWxsb3dlZFRpbWUgPSAzMDA7XG4gICAgbGV0IGVsYXBzZWRUaW1lO1xuICAgIGxldCBzdGFydFRpbWU7XG4gICAgY29uc3QgaGFuZGxlc3dpcGUgPSBjYWxsYmFjayB8fCBmdW5jdGlvbiAoc3dpcGVkaXIpIHt9O1xuXG4gICAgdG91Y2hzdXJmYWNlLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCAoZSkgPT4ge1xuICAgICAgY29uc3QgdG91Y2hvYmogPSBlLmNoYW5nZWRUb3VjaGVzWzBdO1xuICAgICAgc3dpcGVkaXIgPSAnbm9uZSc7XG4gICAgICBzdGFydFggPSB0b3VjaG9iai5wYWdlWDtcbiAgICAgIHN0YXJ0WSA9IHRvdWNob2JqLnBhZ2VZO1xuICAgICAgc3RhcnRUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgfSwgZmFsc2UpO1xuXG4gICAgdG91Y2hzdXJmYWNlLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIChlKSA9PiB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgfSwgZmFsc2UpO1xuXG4gICAgdG91Y2hzdXJmYWNlLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgKGUpID0+IHtcbiAgICAgIGNvbnN0IHRvdWNob2JqID0gZS5jaGFuZ2VkVG91Y2hlc1swXTtcbiAgICAgIGRpc3RYID0gdG91Y2hvYmoucGFnZVggLSBzdGFydFg7XG4gICAgICBkaXN0WSA9IHRvdWNob2JqLnBhZ2VZIC0gc3RhcnRZO1xuICAgICAgZWxhcHNlZFRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKSAtIHN0YXJ0VGltZTtcbiAgICAgIGlmIChlbGFwc2VkVGltZSA8PSBhbGxvd2VkVGltZSkge1xuICAgICAgICBpZiAoTWF0aC5hYnMoZGlzdFgpID49IHRocmVzaG9sZCAmJiBNYXRoLmFicyhkaXN0WSkgPD0gcmVzdHJhaW50KSB7XG4gICAgICAgICAgc3dpcGVkaXIgPSAoZGlzdFggPCAwKSA/ICdsZWZ0JyA6ICdyaWdodCc7XG4gICAgICAgIH0gZWxzZSBpZiAoTWF0aC5hYnMoZGlzdFkpID49IHRocmVzaG9sZCAmJiBNYXRoLmFicyhkaXN0WCkgPD0gcmVzdHJhaW50KSB7XG4gICAgICAgICAgc3dpcGVkaXIgPSAoZGlzdFkgPCAwKSA/ICd1cCcgOiAnZG93bic7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGhhbmRsZXN3aXBlKHN3aXBlZGlyKTtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICB9LCBmYWxzZSk7XG4gIH1cblxuICBzd2lwZWRldGVjdCgoc3dpcGVkaXIpID0+IHtcbiAgICBwbGF5LnVzZXJDaG9pc2Uoc3dpcGVkaXIpO1xuICB9KTtcbn0pO1xuIiwiXG5jb25zdCBDdXJyZW50R2FtZSA9IHJlcXVpcmUoJy4vZ2FtZS5qcycpLkdhbWUyMDQ4O1xuY29uc3QgQ3VycmVudFN0ZXBzID0gcmVxdWlyZSgnLi9hbmltYXRpb24uanMnKS5Db3VudFN0ZXBzO1xuXG5mdW5jdGlvbiBSZW5kZXJQYWdlKG4sIHBsYXlpbmdGaWVsZCkge1xuICB0aGlzLm4gPSBuO1xuICB0aGlzLnNpemVPZlN0ZXAgPSAxMDAgKyAyICogdGhpcy5uO1xuICB0aGlzLmNlbGxTaXplID0gYCR7KDEwMCAtIHRoaXMubiAqIDIpIC8gdGhpcy5ufSVgO1xuICB0aGlzLnBsYXlpbmdGaWVsZCA9IHBsYXlpbmdGaWVsZDtcbiAgdGhpcy5jdXJyZW50RmllbGQgPSBbXTtcbiAgdGhpcy5jaGVjayA9IFtdO1xuICB0aGlzLmdhbWUgPSBuZXcgQ3VycmVudEdhbWUodGhpcy5uKTtcbiAgdGhpcy5jdXJyZW50RmllbGQgPSB0aGlzLmdhbWUuY3JlYXRlRmllbGQoKTtcbiAgdGhpcy5zaG93aW5nKHRoaXMuY3VycmVudEZpZWxkKTtcbn1cblxubW9kdWxlLmV4cG9ydHMuUmVuZGVyUGFnZSA9IFJlbmRlclBhZ2U7XG5cblJlbmRlclBhZ2UucHJvdG90eXBlLnNob3dpbmcgPSBmdW5jdGlvbiBzaG93aW5nKGZpZWxkKSB7XG4gIHdoaWxlICh0aGlzLnBsYXlpbmdGaWVsZC5maXJzdENoaWxkKSB7XG4gICAgdGhpcy5wbGF5aW5nRmllbGQucmVtb3ZlQ2hpbGQodGhpcy5wbGF5aW5nRmllbGQuZmlyc3RDaGlsZCk7XG4gIH1cbiAgbGV0IGNvdW50ID0gMTtcbiAgY29uc3QgY3VycmVudENrZWNrID0gW107XG4gIGZpZWxkLmZvckVhY2goKCkgPT4geyBjdXJyZW50Q2tlY2sucHVzaChbXSk7IH0pO1xuICBmaWVsZC5mb3JFYWNoKChyb3csIGluZGV4T2ZSb3cpID0+IHtcbiAgICByb3cuZm9yRWFjaCgoY2VsbCwgaW5kZXgpID0+IHtcbiAgICAgIGNvbnN0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgZGl2LmNsYXNzTmFtZSA9ICdjZWxsT2ZGaWVsZCc7XG4gICAgICBjb25zdCBpbm5lckRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgaW5uZXJEaXYuY2xhc3NOYW1lID0gYGNlbGwgY2VsbC0ke2NlbGx9YDtcbiAgICAgIGlmIChjZWxsICE9PSAwKSB7XG4gICAgICAgIGlubmVyRGl2LmlkID0gYG1vdmUtJHtjb3VudH1gO1xuICAgICAgICBpbm5lckRpdi5pbm5lckhUTUwgPSBjZWxsO1xuICAgICAgICBkaXYuYXBwZW5kQ2hpbGQoaW5uZXJEaXYpO1xuICAgICAgICBjdXJyZW50Q2tlY2tbaW5kZXhPZlJvd11baW5kZXhdID0gY291bnQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjdXJyZW50Q2tlY2tbaW5kZXhPZlJvd11baW5kZXhdID0gZmFsc2U7XG4gICAgICB9XG4gICAgICB0aGlzLnBsYXlpbmdGaWVsZC5hcHBlbmRDaGlsZChkaXYpO1xuICAgICAgY291bnQgKz0gMTtcbiAgICB9KTtcbiAgfSk7XG4gIHRoaXMuY2hlY2sgPSBjdXJyZW50Q2tlY2s7XG4gIFtdLmZvckVhY2guY2FsbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuY2VsbE9mRmllbGQnKSwgKGVsKSA9PiB7XG4gICAgZWwuc3R5bGUud2lkdGggPSB0aGlzLmNlbGxTaXplO1xuICAgIGVsLnN0eWxlLmhlaWdodCA9IHRoaXMuY2VsbFNpemU7XG4gIH0pO1xufTtcblxuUmVuZGVyUGFnZS5wcm90b3R5cGUuY291bnRlciA9IGZ1bmN0aW9uIGNvdW50ZXIoaXRlcmF0aW9uKSB7XG4gIGxldCBjb3VudCA9IDA7XG4gIGl0ZXJhdGlvbi5mb3JFYWNoKChyb3cpID0+IHtcbiAgICByb3cuZm9yRWFjaCgoY2VsbCkgPT4ge1xuICAgICAgaWYgKGNlbGwpIHtcbiAgICAgICAgY291bnQgKz0gMTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG4gIHJldHVybiBjb3VudDtcbn07XG5cblJlbmRlclBhZ2UucHJvdG90eXBlLmFuaW1hdGlvbiA9IGZ1bmN0aW9uIGFuaW1hdGlvbihmaWVsZCwgZGlyZWN0aW9uLCB4T1J5LCBwbHVzT1JtaW51cykge1xuICBjb25zdCBzdGVwcyA9IG5ldyBDdXJyZW50U3RlcHModGhpcy5jdXJyZW50RmllbGQsIGRpcmVjdGlvbik7XG4gIGNvbnN0IGNvdW50ID0gdGhpcy5jb3VudGVyKHN0ZXBzKTtcbiAgbGV0IGN1cnJlbnRDb3VudCA9IDA7XG4gIHRoaXMuY3VycmVudEZpZWxkLmZvckVhY2goKHJvdywgaW5kZXhPZlJvdykgPT4ge1xuICAgIHJvdy5mb3JFYWNoKChlbGVtZW50LCBpbmRleCkgPT4ge1xuICAgICAgaWYgKHRoaXMuY2hlY2tbaW5kZXhPZlJvd11baW5kZXhdKSB7XG4gICAgICAgIGNvbnN0IGNlbGwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChgbW92ZS0ke3RoaXMuY2hlY2tbaW5kZXhPZlJvd11baW5kZXhdfWApO1xuICAgICAgICBjb25zdCBhbmltYXRpb25DZWxsID0gY2VsbC5hbmltYXRlKFtcbiAgICAgICAgICB7IHRyYW5zZm9ybTogJ3RyYW5zbGF0ZSgwKScgfSxcbiAgICAgICAgICB7IHRyYW5zZm9ybTogYHRyYW5zbGF0ZSR7eE9SeX0oJHtwbHVzT1JtaW51c30ke3RoaXMuc2l6ZU9mU3RlcCAqIHN0ZXBzW2luZGV4T2ZSb3ddW2luZGV4XX0lKWAgfSxcbiAgICAgICAgXSwgMjAwKTtcbiAgICAgICAgYW5pbWF0aW9uQ2VsbC5hZGRFdmVudExpc3RlbmVyKCdmaW5pc2gnLCAoKSA9PiB7XG4gICAgICAgICAgY2VsbC5zdHlsZS50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlJHt4T1J5fSgke3BsdXNPUm1pbnVzfSR7dGhpcy5zaXplT2ZTdGVwICogc3RlcHNbaW5kZXhPZlJvd11baW5kZXhdfSUpYDtcbiAgICAgICAgICBjdXJyZW50Q291bnQgKz0gMTtcbiAgICAgICAgICBpZiAoY3VycmVudENvdW50ID49IGNvdW50KSB7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRGaWVsZCA9IGZpZWxkO1xuICAgICAgICAgICAgdGhpcy5zaG93aW5nKHRoaXMuY3VycmVudEZpZWxkKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9KTtcbn07XG5cblJlbmRlclBhZ2UucHJvdG90eXBlLnVzZXJDaG9pc2UgPSBmdW5jdGlvbiB1c2VyQ2hvaXNlKGNob2lzZSkge1xuICBzd2l0Y2ggKGNob2lzZSkge1xuICAgIGNhc2UgMzc6XG4gICAgICB0aGlzLmFuaW1hdGlvbih0aGlzLmdhbWUuaGFuZGxlTGVmdCgpLCAnbGVmdCcsICdYJywgJy0nKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgMzk6XG4gICAgICB0aGlzLmFuaW1hdGlvbih0aGlzLmdhbWUuaGFuZGxlUmlnaHQoKSwgJ3JpZ2h0JywgJ1gnLCAnKycpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAzODpcbiAgICAgIHRoaXMuY3VycmVudEZpZWxkID0gdGhpcy5nYW1lLmhhbmRsZVVwKCk7XG4gICAgICB0aGlzLnNob3dpbmcodGhpcy5jdXJyZW50RmllbGQpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSA0MDpcbiAgICAgIHRoaXMuY3VycmVudEZpZWxkID0gdGhpcy5nYW1lLmhhbmRsZURvd24oKTtcbiAgICAgIHRoaXMuc2hvd2luZyh0aGlzLmN1cnJlbnRGaWVsZCk7XG4gICAgICBicmVhaztcbiAgICBkZWZhdWx0OlxuICAgICAgYnJlYWs7XG4gIH1cbn07XG4iXX0=
