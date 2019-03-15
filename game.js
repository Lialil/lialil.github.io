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
