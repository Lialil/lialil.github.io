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
    console.log('eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee');
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhbmltYXRpb24uanMiLCJnYW1lLmpzIiwiZ2FtZUluQnJvd3Nlci5qcyIsInJlbmRlclBhZ2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJmdW5jdGlvbiBDb3VudFN0ZXBzKHBsYXlpbmdGaWVsZCwgZGlyZWN0aW9uKSB7XG4gIHRoaXMuZGlyZWN0aW9uID0gZGlyZWN0aW9uO1xuICB0aGlzLnBsYXlpbmdGaWVsZCA9IHBsYXlpbmdGaWVsZDtcbiAgdGhpcy5uID0gcGxheWluZ0ZpZWxkLmxlbmd0aDtcblxuICB0aGlzLnBlcm11dGF0aW9uRWxlbWVudHModGhpcy5wbGF5aW5nRmllbGQpO1xuICB0aGlzLm1lcmdpbmdDZWxscyA9IEFycmF5KHRoaXMubiAqIHRoaXMubikuZmlsbChmYWxzZSk7XG4gIHRoaXMuY291bnRTdGVwcyA9IEFycmF5KHRoaXMubiAqIHRoaXMubikuZmlsbCgwKTtcbiAgdGhpcy5jb3B5T2ZGaWVsZCA9IFtdO1xuXG4gIHRoaXMubWVyZ2luZ0NlbGxzID0gdGhpcy5pbWFnaW5lQXNEb3VibGVBcnJheSh0aGlzLm1lcmdpbmdDZWxscyk7XG4gIHRoaXMuY291bnRTdGVwcyA9IHRoaXMuaW1hZ2luZUFzRG91YmxlQXJyYXkodGhpcy5jb3VudFN0ZXBzKTtcbiAgdGhpcy5jb3B5RmllbGQoKTtcbiAgdGhpcy5jcmVhdGVTdGVwcygpO1xuICB0aGlzLmlzQ2VsbE1lcmdpbmcoKTtcbiAgdGhpcy5wZXJtdXRhdGlvbkVsZW1lbnRzKHRoaXMuY291bnRTdGVwcyk7XG5cbiAgcmV0dXJuIHRoaXMuY291bnRTdGVwcztcbn1cblxubW9kdWxlLmV4cG9ydHMuQ291bnRTdGVwcyA9IENvdW50U3RlcHM7XG5cbkNvdW50U3RlcHMucHJvdG90eXBlLnBlcm11dGF0aW9uRWxlbWVudHMgPSBmdW5jdGlvbiBwZXJtdXRhdGlvbkVsZW1lbnRzKGZpZWxkKSB7XG4gIHN3aXRjaCAodGhpcy5kaXJlY3Rpb24pIHtcbiAgICBjYXNlICdsZWZ0JzpcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ3JpZ2h0JzpcbiAgICAgIGZpZWxkLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgICAgaXRlbS5yZXZlcnNlKCk7XG4gICAgICB9KTtcbiAgICAgIGJyZWFrO1xuICAgIGRlZmF1bHQ6XG4gICAgICBicmVhaztcbiAgfVxufTtcblxuQ291bnRTdGVwcy5wcm90b3R5cGUuY29weUZpZWxkID0gZnVuY3Rpb24gY29weUZpZWxkKCkge1xuICB0aGlzLnBsYXlpbmdGaWVsZC5mb3JFYWNoKChyb3csIGluZGV4KSA9PiB7XG4gICAgY29uc3QgbmV3RmllbGQgPSBbXTtcbiAgICByb3cuZm9yRWFjaCgoZWxlbWVudCwgaW5kZXhPZlJvdykgPT4ge1xuICAgICAgbmV3RmllbGRbaW5kZXhPZlJvd10gPSBlbGVtZW50O1xuICAgIH0pO1xuICAgIHRoaXMuY29weU9mRmllbGRbaW5kZXhdID0gbmV3RmllbGQ7XG4gIH0pO1xufTtcblxuQ291bnRTdGVwcy5wcm90b3R5cGUuaW1hZ2luZUFzRG91YmxlQXJyYXkgPSBmdW5jdGlvbiBpbWFnaW5lQXNEb3VibGVBcnJheShmaWVsZCkge1xuICBjb25zdCBuZXdGaWVsZCA9IFtdO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMubjsgaSsrKSB7XG4gICAgY29uc3Qgcm93T2ZGaWVsZCA9IGZpZWxkLnNsaWNlKGksIGkgKyB0aGlzLm4pO1xuICAgIG5ld0ZpZWxkW2ldID0gcm93T2ZGaWVsZDtcbiAgfVxuICByZXR1cm4gbmV3RmllbGQ7XG59O1xuXG5Db3VudFN0ZXBzLnByb3RvdHlwZS5jb3VudFNhbWVFbGVtZW50cyA9IGZ1bmN0aW9uIGNvdW50U2FtZUVsZW1lbnRzKGN1cnJlbnRJbmRleCwgcm93LCBpbmRleE9mUm93KSB7XG4gIHJvdy5mb3JFYWNoKChpdGVtLCBpbmRleCkgPT4ge1xuICAgIGlmIChpbmRleCA+PSBjdXJyZW50SW5kZXggJiYgdGhpcy5wbGF5aW5nRmllbGRbaW5kZXhPZlJvd11baW5kZXhdICE9PSAwKSB7XG4gICAgICB0aGlzLmNvdW50U3RlcHNbaW5kZXhPZlJvd11baW5kZXhdID0gdGhpcy5jb3VudFN0ZXBzW2luZGV4T2ZSb3ddW2luZGV4XSArIDE7XG4gICAgfVxuICB9KTtcbn07XG5cbkNvdW50U3RlcHMucHJvdG90eXBlLmNvdW50U3RlcHNGb3JDZWxsID0gZnVuY3Rpb24gY291bnRTdGVwc0ZvckNlbGwoY3VycmVudEluZGV4LCByb3csIGluZGV4T2ZSb3cpIHtcbiAgbGV0IHN0ZXBCYWNrID0gY3VycmVudEluZGV4O1xuICB3aGlsZSAocm93W3N0ZXBCYWNrIC0gMV0gPT09IDApIHtcbiAgICByb3dbc3RlcEJhY2sgLSAxXSA9IHJvd1tzdGVwQmFja107XG4gICAgcm93W3N0ZXBCYWNrXSA9IDA7XG4gICAgc3RlcEJhY2sgLT0gMTtcbiAgICB0aGlzLmNvdW50U3RlcHNbaW5kZXhPZlJvd11bY3VycmVudEluZGV4XSA9IHRoaXMuY291bnRTdGVwc1tpbmRleE9mUm93XVtjdXJyZW50SW5kZXhdICsgMTtcbiAgfVxuICBpZiAocm93W3N0ZXBCYWNrXSA9PT0gcm93W3N0ZXBCYWNrIC0gMV0pIHtcbiAgICB0aGlzLmNvdW50U3RlcHNbaW5kZXhPZlJvd11bY3VycmVudEluZGV4XSA9IHRoaXMuY291bnRTdGVwc1tpbmRleE9mUm93XVtjdXJyZW50SW5kZXhdICsgMTtcbiAgICB0aGlzLmNvdW50U2FtZUVsZW1lbnRzKGN1cnJlbnRJbmRleCArIDEsIHJvdywgaW5kZXhPZlJvdyk7XG4gICAgcm93W3N0ZXBCYWNrXSA9IDE7XG4gICAgdGhpcy5tZXJnaW5nQ2VsbHNbaW5kZXhPZlJvd11bc3RlcEJhY2sgLSAxXSA9IHRydWU7XG4gIH1cbn07XG5cbkNvdW50U3RlcHMucHJvdG90eXBlLm1lcmdlQ2VsbHMgPSBmdW5jdGlvbiBtZXJnZUNlbGxzKHJvdywgY3VycmVudEluZGV4KSB7XG4gIHJvdy5mb3JFYWNoKChlbGVtZW50LCBpbmRleCkgPT4ge1xuICAgIGlmIChpbmRleCA+IGN1cnJlbnRJbmRleCAmJiBlbGVtZW50ID09PSB0cnVlKSB7XG4gICAgICByb3dbaW5kZXhdID0gZmFsc2U7XG4gICAgICByb3dbaW5kZXggLSAxXSA9IHRydWU7XG4gICAgfVxuICB9KTtcbn07XG5cbkNvdW50U3RlcHMucHJvdG90eXBlLmlzQ2VsbE1lcmdpbmcgPSBmdW5jdGlvbiBpc0NlbGxNZXJnaW5nKCkge1xuICB0aGlzLm1lcmdpbmdDZWxscy5mb3JFYWNoKChyb3cpID0+IHtcbiAgICByb3cuZm9yRWFjaCgoZWxlbWVudCwgaW5kZXgpID0+IHtcbiAgICAgIGlmIChlbGVtZW50ID09PSB0cnVlKSB7XG4gICAgICAgIHRoaXMubWVyZ2VDZWxscyhyb3csIGluZGV4KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG59O1xuXG5Db3VudFN0ZXBzLnByb3RvdHlwZS5jcmVhdGVTdGVwcyA9IGZ1bmN0aW9uIGNyZWF0ZVN0ZXBzKCkge1xuICB0aGlzLmNvcHlPZkZpZWxkLmZvckVhY2goKHJvdywgaW5kZXhPZlJvdykgPT4ge1xuICAgIHJvdy5mb3JFYWNoKChlbGVtZW50LCBpbmRleCkgPT4ge1xuICAgICAgaWYgKGVsZW1lbnQgIT09IDApIHtcbiAgICAgICAgdGhpcy5jb3VudFN0ZXBzRm9yQ2VsbChpbmRleCwgcm93LCBpbmRleE9mUm93KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG59O1xuIiwiZnVuY3Rpb24gR2FtZTIwNDgoc2l6ZSkge1xuICB0aGlzLnNpemUgPSBzaXplO1xuICB0aGlzLmZpZWxkID0gW107XG59XG5tb2R1bGUuZXhwb3J0cy5HYW1lMjA0OCA9IEdhbWUyMDQ4O1xuXG5HYW1lMjA0OC5wcm90b3R5cGUuYWRkVHdvID0gZnVuY3Rpb24gYWRkVHdvKCkge1xuICBjb25zdCB6ZXJvRWxlbWVudHMgPSBbXTtcbiAgdGhpcy5maWVsZC5mb3JFYWNoKChpdGVtLCBpbmRleCkgPT4ge1xuICAgIGlmIChpdGVtID09PSAwKSB7XG4gICAgICB6ZXJvRWxlbWVudHMucHVzaChpbmRleCk7XG4gICAgfVxuICB9KTtcbiAgY29uc3QgcmFuZG9tWmVyb0VsZW1lbnQgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiB6ZXJvRWxlbWVudHMubGVuZ3RoKTtcbiAgaWYgKHplcm9FbGVtZW50cy5sZW5ndGggIT09IDApIHtcbiAgICB0aGlzLmZpZWxkW3plcm9FbGVtZW50c1tyYW5kb21aZXJvRWxlbWVudF1dID0gMjtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59O1xuXG5HYW1lMjA0OC5wcm90b3R5cGUuY3JlYXRlRmllbGQgPSBmdW5jdGlvbiBjcmVhdGVGaWVsZCgpIHtcbiAgdGhpcy5maWVsZCA9IEFycmF5KHRoaXMuc2l6ZSAqIHRoaXMuc2l6ZSkuZmlsbCgwKTtcbiAgdGhpcy5hZGRUd28oKTtcbiAgdGhpcy5hZGRUd28oKTtcbiAgcmV0dXJuIHRoaXMuY2hhbmdlVmlldygpO1xufTtcblxuR2FtZTIwNDgucHJvdG90eXBlLmNyZWF0ZVJvdyA9IGZ1bmN0aW9uIGNyZWF0ZVJvdyhyb3cpIHtcbiAgcm93ICo9IHRoaXMuc2l6ZTtcbiAgcmV0dXJuIHRoaXMuZmllbGQuc2xpY2Uocm93LCByb3cgKyB0aGlzLnNpemUpO1xufTtcblxuR2FtZTIwNDgucHJvdG90eXBlLmNoYW5nZVZpZXcgPSBmdW5jdGlvbiBjaGFuZ2VWaWV3KCkge1xuICBjb25zdCBuZXdGaWVsZCA9IFtdO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuc2l6ZTsgaSsrKSB7XG4gICAgY29uc3Qgcm93T2ZGaWVsZCA9IHRoaXMuY3JlYXRlUm93KGkpO1xuICAgIG5ld0ZpZWxkW2ldID0gcm93T2ZGaWVsZDtcbiAgfVxuICByZXR1cm4gbmV3RmllbGQ7XG59O1xuXG5HYW1lMjA0OC5wcm90b3R5cGUucmVwbGFjZVZhbHVlUm93ID0gZnVuY3Rpb24gcmVwbGFjZVZhbHVlUm93KGZpZWxkLCByb3csIGNvbHVtbikge1xuICByb3cuZm9yRWFjaCgoaXRlbSwgaW5kZXgpID0+IHtcbiAgICBmaWVsZC5zcGxpY2UoaW5kZXggKyBjb2x1bW4sIDEsIHJvd1tpbmRleF0pO1xuICB9KTtcbn07XG5cbkdhbWUyMDQ4LnByb3RvdHlwZS5taXJyb3IgPSBmdW5jdGlvbiBtaXJyb3IoKSB7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5zaXplOyBpKyspIHtcbiAgICBjb25zdCByb3dPZkZpZWxkID0gdGhpcy5jcmVhdGVSb3coaSk7XG4gICAgcm93T2ZGaWVsZC5yZXZlcnNlKCk7XG4gICAgdGhpcy5yZXBsYWNlVmFsdWVSb3codGhpcy5maWVsZCwgcm93T2ZGaWVsZCwgaSAqIHRoaXMuc2l6ZSk7XG4gIH1cbn07XG5cbkdhbWUyMDQ4LnByb3RvdHlwZS5yb3RhdGUgPSBmdW5jdGlvbiByb3RhdGUoKSB7XG4gIGNvbnN0IG5ld0ZpZWxkID0gW107XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5zaXplOyBpKyspIHtcbiAgICBmb3IgKGxldCBqID0gaTsgaiA8IHRoaXMuc2l6ZSAqIHRoaXMuc2l6ZTsgaiArPSB0aGlzLnNpemUpIHtcbiAgICAgIG5ld0ZpZWxkLnB1c2godGhpcy5maWVsZFtqXSk7XG4gICAgfVxuICB9XG4gIHRoaXMucmVwbGFjZVZhbHVlUm93KHRoaXMuZmllbGQsIG5ld0ZpZWxkLCAwKTtcbn07XG5cbkdhbWUyMDQ4LnByb3RvdHlwZS5tb3ZlTm9aZXJvRWxlbWVudHNJbkxlZnQgPSBmdW5jdGlvbiBtb3ZlTm9aZXJvRWxlbWVudHNJbkxlZnQocm93KSB7XG4gIGNvbnN0IG5vWmVyb0VsZW1lbnRzID0gcm93LmZpbHRlcihlbGVtZW50ID0+IGVsZW1lbnQgIT09IDApO1xuICByb3cuZmlsbCgwKTtcblxuICB0aGlzLnJlcGxhY2VWYWx1ZVJvdyhyb3csIG5vWmVyb0VsZW1lbnRzLCAwKTtcbn07XG5cbkdhbWUyMDQ4LnByb3RvdHlwZS5tZXJnZVNhbWVFbGVtZW50cyA9IGZ1bmN0aW9uIG1lcmdlU2FtZUVsZW1lbnRzKHJvdykge1xuICByb3cuZm9yRWFjaCgoaXRlbSwgaW5kZXgpID0+IHtcbiAgICBpZiAoaXRlbSAhPT0gMCAmJiBpdGVtID09PSByb3dbaW5kZXggKyAxXSkge1xuICAgICAgcm93W2luZGV4XSArPSByb3dbaW5kZXhdO1xuICAgICAgcm93W2luZGV4ICsgMV0gPSAwO1xuICAgIH1cbiAgfSk7XG4gIHRoaXMubW92ZU5vWmVyb0VsZW1lbnRzSW5MZWZ0KHJvdyk7XG59O1xuXG5HYW1lMjA0OC5wcm90b3R5cGUuY2FuU3dpcGVJbkxlZnQgPSBmdW5jdGlvbiBjYW5Td2lwZUluTGVmdChyb3cpIHtcbiAgcmV0dXJuIHJvdy5zb21lKChpdGVtLCBpbmRleCkgPT4gaXRlbSA+IDAgJiYgKGl0ZW0gPT09IHJvd1tpbmRleCArIDFdIHx8IHJvd1tpbmRleCAtIDFdID09PSAwKSk7XG59O1xuXG5HYW1lMjA0OC5wcm90b3R5cGUuaXNGcmVlQ2VsbCA9IGZ1bmN0aW9uIGlzRnJlZUNlbGwoKSB7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5zaXplOyBpKyspIHtcbiAgICBjb25zdCByb3dPZkZpZWxkID0gdGhpcy5jcmVhdGVSb3coaSk7XG4gICAgaWYgKHRoaXMuY2FuU3dpcGVJbkxlZnQocm93T2ZGaWVsZCkpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gZmFsc2U7XG59O1xuXG5HYW1lMjA0OC5wcm90b3R5cGUuc3dpcGUgPSBmdW5jdGlvbiBzd2lwZSgpIHtcbiAgY29uc3QgY2hlY2sgPSB0aGlzLmlzRnJlZUNlbGwoKTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnNpemU7IGkrKykge1xuICAgIGNvbnN0IHJvd09mRmllbGQgPSB0aGlzLmNyZWF0ZVJvdyhpKTtcbiAgICB0aGlzLm1vdmVOb1plcm9FbGVtZW50c0luTGVmdChyb3dPZkZpZWxkKTtcbiAgICB0aGlzLm1lcmdlU2FtZUVsZW1lbnRzKHJvd09mRmllbGQpO1xuICAgIHRoaXMucmVwbGFjZVZhbHVlUm93KHRoaXMuZmllbGQsIHJvd09mRmllbGQsIGkgKiB0aGlzLnNpemUpO1xuICB9XG4gIGlmIChjaGVjaykge1xuICAgIHRoaXMuYWRkVHdvKCk7XG4gIH1cbn07XG5cbkdhbWUyMDQ4LnByb3RvdHlwZS5nYW1lT3ZlciA9IGZ1bmN0aW9uIGdhbWVPdmVyKCkge1xuICBpZiAodGhpcy5maWVsZC5zb21lKGVsZW1lbnQgPT4gZWxlbWVudCA9PT0gMCkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgaWYgKHRoaXMuZmllbGQuc29tZSgoaXRlbSwgaW5kZXgpID0+IGl0ZW0gPT09IHRoaXMuZmllbGRbaW5kZXggKyB0aGlzLnNpemVdKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBpZiAodGhpcy5maWVsZC5zb21lKChpdGVtLCBpKSA9PiB0aGlzLmZpZWxkW2ldID09PSB0aGlzLmZpZWxkW2kgKyAxXSAmJiBpICsgMSA8IGkgKyB0aGlzLnNpemUpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHJldHVybiB0cnVlO1xufTtcblxuR2FtZTIwNDgucHJvdG90eXBlLmhhbmRsZUxlZnQgPSBmdW5jdGlvbiBoYW5kbGVMZWZ0KCkge1xuICB0aGlzLnN3aXBlKHRoaXMuZmllbGQpO1xuICByZXR1cm4gdGhpcy5jaGFuZ2VWaWV3KCk7XG59O1xuXG5HYW1lMjA0OC5wcm90b3R5cGUuaGFuZGxlUmlnaHQgPSBmdW5jdGlvbiBoYW5kbGVSaWdodCgpIHtcbiAgdGhpcy5taXJyb3IodGhpcy5maWVsZCk7XG4gIHRoaXMuc3dpcGUodGhpcy5maWVsZCk7XG4gIHRoaXMubWlycm9yKHRoaXMuZmllbGQpO1xuICByZXR1cm4gdGhpcy5jaGFuZ2VWaWV3KCk7XG59O1xuXG5HYW1lMjA0OC5wcm90b3R5cGUuaGFuZGxlVXAgPSBmdW5jdGlvbiBoYW5kbGVVcCgpIHtcbiAgdGhpcy5yb3RhdGUodGhpcy5maWVsZCk7XG4gIHRoaXMuc3dpcGUodGhpcy5maWVsZCk7XG4gIHRoaXMucm90YXRlKHRoaXMuZmllbGQpO1xuICByZXR1cm4gdGhpcy5jaGFuZ2VWaWV3KCk7XG59O1xuXG5HYW1lMjA0OC5wcm90b3R5cGUuaGFuZGxlRG93biA9IGZ1bmN0aW9uIGhhbmRsZURvd24oKSB7XG4gIHRoaXMucm90YXRlKHRoaXMuZmllbGQpO1xuICB0aGlzLm1pcnJvcih0aGlzLmZpZWxkKTtcbiAgdGhpcy5zd2lwZSh0aGlzLmZpZWxkKTtcbiAgdGhpcy5taXJyb3IodGhpcy5maWVsZCk7XG4gIHRoaXMucm90YXRlKHRoaXMuZmllbGQpO1xuICByZXR1cm4gdGhpcy5jaGFuZ2VWaWV3KCk7XG59O1xuIiwiY29uc3QgQ3VycmVudFBhZ2UgPSByZXF1aXJlKCcuL3JlbmRlclBhZ2UuanMnKS5SZW5kZXJQYWdlO1xuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4ge1xuICBjb25zdCBuID0gNDtcbiAgY29uc3QgcGxheWluZ0ZpZWxkID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BsYXlpbmdGaWVsZCcpO1xuICBjb25zdCBwbGF5ID0gbmV3IEN1cnJlbnRQYWdlKG4sIHBsYXlpbmdGaWVsZCk7XG5cbiAgZG9jdW1lbnQub25rZXlkb3duID0gZnVuY3Rpb24gY2hvaXNlKGV2ZW50KSB7XG4gICAgY29uc29sZS5sb2coJ2VlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlJyk7XG4gICAgcGxheS51c2VyQ2hvaXNlKGV2ZW50LndoaWNoKTtcbiAgfTtcblxuICBmdW5jdGlvbiBzd2lwZWRldGVjdChjYWxsYmFjaykge1xuICAgIGNvbnN0IHRvdWNoc3VyZmFjZSA9IHBsYXlpbmdGaWVsZDtcbiAgICBsZXQgc3dpcGVkaXI7XG4gICAgbGV0IHN0YXJ0WDtcbiAgICBsZXQgc3RhcnRZO1xuICAgIGxldCBkaXN0WDtcbiAgICBsZXQgZGlzdFk7XG4gICAgY29uc3QgdGhyZXNob2xkID0gMTUwO1xuICAgIGNvbnN0IHJlc3RyYWludCA9IDEwMDtcbiAgICBcbiAgICBjb25zdCBhbGxvd2VkVGltZSA9IDMwMDtcbiAgICBsZXQgZWxhcHNlZFRpbWU7XG4gICAgbGV0IHN0YXJ0VGltZTtcbiAgICBjb25zdCBoYW5kbGVzd2lwZSA9IGNhbGxiYWNrIHx8IGZ1bmN0aW9uIChzd2lwZWRpcikge307XG5cbiAgICB0b3VjaHN1cmZhY2UuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIChlKSA9PiB7XG4gICAgICBjb25zdCB0b3VjaG9iaiA9IGUuY2hhbmdlZFRvdWNoZXNbMF07XG4gICAgICBzd2lwZWRpciA9ICdub25lJztcbiAgICAgIHN0YXJ0WCA9IHRvdWNob2JqLnBhZ2VYO1xuICAgICAgc3RhcnRZID0gdG91Y2hvYmoucGFnZVk7XG4gICAgICBzdGFydFRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICB9LCBmYWxzZSk7XG5cbiAgICB0b3VjaHN1cmZhY2UuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgKGUpID0+IHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICB9LCBmYWxzZSk7XG5cbiAgICB0b3VjaHN1cmZhY2UuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCAoZSkgPT4ge1xuICAgICAgY29uc3QgdG91Y2hvYmogPSBlLmNoYW5nZWRUb3VjaGVzWzBdO1xuICAgICAgZGlzdFggPSB0b3VjaG9iai5wYWdlWCAtIHN0YXJ0WDtcbiAgICAgIGRpc3RZID0gdG91Y2hvYmoucGFnZVkgLSBzdGFydFk7XG4gICAgICBlbGFwc2VkVGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gc3RhcnRUaW1lO1xuICAgICAgaWYgKGVsYXBzZWRUaW1lIDw9IGFsbG93ZWRUaW1lKSB7XG4gICAgICAgIGlmIChNYXRoLmFicyhkaXN0WCkgPj0gdGhyZXNob2xkICYmIE1hdGguYWJzKGRpc3RZKSA8PSByZXN0cmFpbnQpIHtcbiAgICAgICAgICBzd2lwZWRpciA9IChkaXN0WCA8IDApID8gJ2xlZnQnIDogJ3JpZ2h0JztcbiAgICAgICAgfSBlbHNlIGlmIChNYXRoLmFicyhkaXN0WSkgPj0gdGhyZXNob2xkICYmIE1hdGguYWJzKGRpc3RYKSA8PSByZXN0cmFpbnQpIHtcbiAgICAgICAgICBzd2lwZWRpciA9IChkaXN0WSA8IDApID8gJ3VwJyA6ICdkb3duJztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaGFuZGxlc3dpcGUoc3dpcGVkaXIpO1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH0sIGZhbHNlKTtcbiAgfVxuXG4gIHN3aXBlZGV0ZWN0KChzd2lwZWRpcikgPT4ge1xuICAgIHBsYXkudXNlckNob2lzZShzd2lwZWRpcik7XG4gIH0pO1xufSk7XG4iLCJcbmNvbnN0IEN1cnJlbnRHYW1lID0gcmVxdWlyZSgnLi9nYW1lLmpzJykuR2FtZTIwNDg7XG5jb25zdCBDdXJyZW50U3RlcHMgPSByZXF1aXJlKCcuL2FuaW1hdGlvbi5qcycpLkNvdW50U3RlcHM7XG5cbmZ1bmN0aW9uIFJlbmRlclBhZ2UobiwgcGxheWluZ0ZpZWxkKSB7XG4gIHRoaXMubiA9IG47XG4gIHRoaXMuc2l6ZU9mU3RlcCA9IDEwMCArIDIgKiB0aGlzLm47XG4gIHRoaXMuY2VsbFNpemUgPSBgJHsoMTAwIC0gdGhpcy5uICogMikgLyB0aGlzLm59JWA7XG4gIHRoaXMucGxheWluZ0ZpZWxkID0gcGxheWluZ0ZpZWxkO1xuICB0aGlzLmN1cnJlbnRGaWVsZCA9IFtdO1xuICB0aGlzLmNoZWNrID0gW107XG4gIHRoaXMuZ2FtZSA9IG5ldyBDdXJyZW50R2FtZSh0aGlzLm4pO1xuICB0aGlzLmN1cnJlbnRGaWVsZCA9IHRoaXMuZ2FtZS5jcmVhdGVGaWVsZCgpO1xuICB0aGlzLnNob3dpbmcodGhpcy5jdXJyZW50RmllbGQpO1xufVxuXG5tb2R1bGUuZXhwb3J0cy5SZW5kZXJQYWdlID0gUmVuZGVyUGFnZTtcblxuUmVuZGVyUGFnZS5wcm90b3R5cGUuc2hvd2luZyA9IGZ1bmN0aW9uIHNob3dpbmcoZmllbGQpIHtcbiAgd2hpbGUgKHRoaXMucGxheWluZ0ZpZWxkLmZpcnN0Q2hpbGQpIHtcbiAgICB0aGlzLnBsYXlpbmdGaWVsZC5yZW1vdmVDaGlsZCh0aGlzLnBsYXlpbmdGaWVsZC5maXJzdENoaWxkKTtcbiAgfVxuICBsZXQgY291bnQgPSAxO1xuICBjb25zdCBjdXJyZW50Q2tlY2sgPSBbXTtcbiAgZmllbGQuZm9yRWFjaCgoKSA9PiB7IGN1cnJlbnRDa2Vjay5wdXNoKFtdKTsgfSk7XG4gIGZpZWxkLmZvckVhY2goKHJvdywgaW5kZXhPZlJvdykgPT4ge1xuICAgIHJvdy5mb3JFYWNoKChjZWxsLCBpbmRleCkgPT4ge1xuICAgICAgY29uc3QgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICBkaXYuY2xhc3NOYW1lID0gJ2NlbGxPZkZpZWxkJztcbiAgICAgIGNvbnN0IGlubmVyRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICBpbm5lckRpdi5jbGFzc05hbWUgPSBgY2VsbCBjZWxsLSR7Y2VsbH1gO1xuICAgICAgaWYgKGNlbGwgIT09IDApIHtcbiAgICAgICAgaW5uZXJEaXYuaWQgPSBgbW92ZS0ke2NvdW50fWA7XG4gICAgICAgIGlubmVyRGl2LmlubmVySFRNTCA9IGNlbGw7XG4gICAgICAgIGRpdi5hcHBlbmRDaGlsZChpbm5lckRpdik7XG4gICAgICAgIGN1cnJlbnRDa2Vja1tpbmRleE9mUm93XVtpbmRleF0gPSBjb3VudDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGN1cnJlbnRDa2Vja1tpbmRleE9mUm93XVtpbmRleF0gPSBmYWxzZTtcbiAgICAgIH1cbiAgICAgIHRoaXMucGxheWluZ0ZpZWxkLmFwcGVuZENoaWxkKGRpdik7XG4gICAgICBjb3VudCArPSAxO1xuICAgIH0pO1xuICB9KTtcbiAgdGhpcy5jaGVjayA9IGN1cnJlbnRDa2VjaztcbiAgW10uZm9yRWFjaC5jYWxsKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5jZWxsT2ZGaWVsZCcpLCAoZWwpID0+IHtcbiAgICBlbC5zdHlsZS53aWR0aCA9IHRoaXMuY2VsbFNpemU7XG4gICAgZWwuc3R5bGUuaGVpZ2h0ID0gdGhpcy5jZWxsU2l6ZTtcbiAgfSk7XG59O1xuXG5SZW5kZXJQYWdlLnByb3RvdHlwZS5jb3VudGVyID0gZnVuY3Rpb24gY291bnRlcihpdGVyYXRpb24pIHtcbiAgbGV0IGNvdW50ID0gMDtcbiAgaXRlcmF0aW9uLmZvckVhY2goKHJvdykgPT4ge1xuICAgIHJvdy5mb3JFYWNoKChjZWxsKSA9PiB7XG4gICAgICBpZiAoY2VsbCkge1xuICAgICAgICBjb3VudCArPSAxO1xuICAgICAgfVxuICAgIH0pO1xuICB9KTtcbiAgcmV0dXJuIGNvdW50O1xufTtcblxuUmVuZGVyUGFnZS5wcm90b3R5cGUuYW5pbWF0aW9uID0gZnVuY3Rpb24gYW5pbWF0aW9uKGZpZWxkLCBkaXJlY3Rpb24sIHhPUnksIHBsdXNPUm1pbnVzKSB7XG4gIGNvbnN0IHN0ZXBzID0gbmV3IEN1cnJlbnRTdGVwcyh0aGlzLmN1cnJlbnRGaWVsZCwgZGlyZWN0aW9uKTtcbiAgY29uc3QgY291bnQgPSB0aGlzLmNvdW50ZXIoc3RlcHMpO1xuICBsZXQgY3VycmVudENvdW50ID0gMDtcbiAgdGhpcy5jdXJyZW50RmllbGQuZm9yRWFjaCgocm93LCBpbmRleE9mUm93KSA9PiB7XG4gICAgcm93LmZvckVhY2goKGVsZW1lbnQsIGluZGV4KSA9PiB7XG4gICAgICBpZiAodGhpcy5jaGVja1tpbmRleE9mUm93XVtpbmRleF0pIHtcbiAgICAgICAgY29uc3QgY2VsbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGBtb3ZlLSR7dGhpcy5jaGVja1tpbmRleE9mUm93XVtpbmRleF19YCk7XG4gICAgICAgIGNvbnN0IGFuaW1hdGlvbkNlbGwgPSBjZWxsLmFuaW1hdGUoW1xuICAgICAgICAgIHsgdHJhbnNmb3JtOiAndHJhbnNsYXRlKDApJyB9LFxuICAgICAgICAgIHsgdHJhbnNmb3JtOiBgdHJhbnNsYXRlJHt4T1J5fSgke3BsdXNPUm1pbnVzfSR7dGhpcy5zaXplT2ZTdGVwICogc3RlcHNbaW5kZXhPZlJvd11baW5kZXhdfSUpYCB9LFxuICAgICAgICBdLCAyMDApO1xuICAgICAgICBhbmltYXRpb25DZWxsLmFkZEV2ZW50TGlzdGVuZXIoJ2ZpbmlzaCcsICgpID0+IHtcbiAgICAgICAgICBjZWxsLnN0eWxlLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGUke3hPUnl9KCR7cGx1c09SbWludXN9JHt0aGlzLnNpemVPZlN0ZXAgKiBzdGVwc1tpbmRleE9mUm93XVtpbmRleF19JSlgO1xuICAgICAgICAgIGN1cnJlbnRDb3VudCArPSAxO1xuICAgICAgICAgIGlmIChjdXJyZW50Q291bnQgPj0gY291bnQpIHtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudEZpZWxkID0gZmllbGQ7XG4gICAgICAgICAgICB0aGlzLnNob3dpbmcodGhpcy5jdXJyZW50RmllbGQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xufTtcblxuUmVuZGVyUGFnZS5wcm90b3R5cGUudXNlckNob2lzZSA9IGZ1bmN0aW9uIHVzZXJDaG9pc2UoY2hvaXNlKSB7XG4gIHN3aXRjaCAoY2hvaXNlKSB7XG4gICAgY2FzZSAzNzpcbiAgICAgIHRoaXMuYW5pbWF0aW9uKHRoaXMuZ2FtZS5oYW5kbGVMZWZ0KCksICdsZWZ0JywgJ1gnLCAnLScpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAzOTpcbiAgICAgIHRoaXMuYW5pbWF0aW9uKHRoaXMuZ2FtZS5oYW5kbGVSaWdodCgpLCAncmlnaHQnLCAnWCcsICcrJyk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIDM4OlxuICAgICAgdGhpcy5jdXJyZW50RmllbGQgPSB0aGlzLmdhbWUuaGFuZGxlVXAoKTtcbiAgICAgIHRoaXMuc2hvd2luZyh0aGlzLmN1cnJlbnRGaWVsZCk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIDQwOlxuICAgICAgdGhpcy5jdXJyZW50RmllbGQgPSB0aGlzLmdhbWUuaGFuZGxlRG93bigpO1xuICAgICAgdGhpcy5zaG93aW5nKHRoaXMuY3VycmVudEZpZWxkKTtcbiAgICAgIGJyZWFrO1xuICAgIGRlZmF1bHQ6XG4gICAgICBicmVhaztcbiAgfVxufTtcbiJdfQ==
