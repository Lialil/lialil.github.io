function game2048(size) {
  this.size = size;
  this.field = [];
}

module.exports.game2048 = game2048;

game2048.prototype.addTwo = function addTwo() {
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

game2048.prototype.createField = function createField() {
  this.field = Array(this.size * this.size).fill(0);
  this.addTwo();
  this.addTwo();
  return this.changeView();
};

game2048.prototype.fieldSize = function fieldSize(field) {
  return Math.sqrt(field.length);
};

game2048.prototype.createRow = function createRow(row) {
  const n = this.fieldSize(this.field);
  row *= n;
  return this.field.slice(row, row + n);
};

game2048.prototype.changeView = function changeView() {
  const n = this.fieldSize(this.field);
  const anotherField = [];
  for (let i = 0; i < n; i++) {
    const rowOfField = this.createRow(i);
    anotherField[i] = rowOfField;
  }
  return anotherField;
};

game2048.prototype.replaceValueRow = function replaceValueRow(field, row, column) {
  row.forEach((item, index) => {
    field.splice(index + column, 1, row[index]);
  });
};

game2048.prototype.mirror = function mirror() {
  const n = this.fieldSize(this.field);
  for (let i = 0; i < n; i++) {
    const rowOfField = this.createRow(i);
    rowOfField.reverse();
    this.replaceValueRow(this.field, rowOfField, i * n);
  }
};

game2048.prototype.rotate = function rotate() {
  const newField = [];
  const n = this.fieldSize(this.field);
  for (let i = 0; i < n; i++) {
    for (let j = i; j < n * n; j += n) {
      newField.push(this.field[j]);
    }
  }
  this.replaceValueRow(this.field, newField, 0);
};

game2048.prototype.moveNoZeroElementsInLeft = function moveNoZeroElementsInLeft(row) {
  const noZeroElements = row.filter(element => element !== 0);
  row.fill(0);

  this.replaceValueRow(row, noZeroElements, 0);
};

game2048.prototype.mergeSameElements = function mergeSameElements(row) {
  row.forEach((item, index) => {
    if (item !== 0 && item === row[index + 1]) {
      row[index] += row[index];
      row[index + 1] = 0;
    }
  });
  this.moveNoZeroElementsInLeft(row);
};

game2048.prototype.canSwipeInLeft = function canSwipeInLeft(row) {
  return row.some((item, index) => item > 0 && (item === row[index + 1] || row[index - 1] === 0));
};

game2048.prototype.isFreeCell = function isFreeCell() {
  const n = this.fieldSize(this.field);
  for (let i = 0; i < n; i++) {
    const rowOfField = this.createRow(i);
    if (this.canSwipeInLeft(rowOfField)) {
      return true;
    }
  }
  return false;
};

game2048.prototype.swipe = function swipe() {
  const n = this.fieldSize(this.field);
  const check = this.isFreeCell();
  for (let i = 0; i < n; i++) {
    const rowOfField = this.createRow(i);
    this.moveNoZeroElementsInLeft(rowOfField);
    this.mergeSameElements(rowOfField);
    this.replaceValueRow(this.field, rowOfField, i * n);
  }
  if (check) {
    this.addTwo();
  }
};

game2048.prototype.gameOver = function gameOver() {
  const n = this.fieldSize(this.field);
  if (this.field.some(element => element === 0)) {
    return false;
  }
  if (this.field.some((item, index) => item === this.field[index + n])) {
    return false;
  }
  if (this.field.some((item, i) => this.field[i] === this.field[i + 1] && i + 1 < i + n)) {
    return false;
  }
  return true;
};

game2048.prototype.handleLeft = function handleLeft() {
  this.swipe(this.field);
  return this.changeView();
};

game2048.prototype.handleRight = function handleRight() {
  this.mirror(this.field);
  this.swipe(this.field);
  this.mirror(this.field);
  return this.changeView();
};

game2048.prototype.handleUp = function handleUp() {
  this.rotate(this.field);
  this.swipe(this.field);
  this.rotate(this.field);
  return this.changeView();
};

game2048.prototype.handleDown = function handleDown() {
  this.rotate(this.field);
  this.mirror(this.field);
  this.swipe(this.field);
  this.mirror(this.field);
  this.rotate(this.field);
  return this.changeView();
};
