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
