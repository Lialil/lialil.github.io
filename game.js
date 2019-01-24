function addTwo(field) {
  const zeroElements = [];
  field.forEach((item, index) => {
    if (item === 0) {
      zeroElements.push(index);
    }
  });
  const randomZeroElement = Math.floor(Math.random() * zeroElements.length);
  if (zeroElements.length !== 0) {
    field[zeroElements[randomZeroElement]] = 2;
    return true;
  }
  return false;
}

function fieldSize(field) {
  return Math.sqrt(field.length);
}

function createRow(row, field) {
  const n = fieldSize(field);
  row *= n;
  return field.slice(row, row + n);
}

exports.createField = function (n) {
  const field = Array(n * n).fill(0);
  addTwo(field);
  addTwo(field);
  return field;
};

exports.showing = function (field) {
  const n = fieldSize(field);
  for (let i = 0; i < n; i++) {
    const rowOfField = createRow(i, field);
    console.log(rowOfField.join('  '));
  }
};

function replaceValueRow(field, row, column) {
  row.forEach((item, index) => {
    field.splice(index + column, 1, row[index]);
  });
}

function mirror(field) {
  const n = fieldSize(field);
  for (let i = 0; i < n; i++) {
    const rowOfField = createRow(i, field);
    rowOfField.reverse();
    replaceValueRow(field, rowOfField, i * n);
  }
}

function rotate(field) {
  const newField = [];
  const n = fieldSize(field);
  for (let i = 0; i < n; i++) {
    for (let j = i; j < n * n; j += n) {
      newField.push(field[j]);
    }
  }
  replaceValueRow(field, newField, 0);
}

function moveNoZeroElementsInLeft(row) {
  const noZeroElements = row.filter(element => element !== 0);
  row.fill(0);

  replaceValueRow(row, noZeroElements, 0);
}

function mergeSameElements(row) {
  row.forEach((item, index) => {
    if (item !== 0 && item === row[index + 1]) {
      row[index] += row[index];
      row[index + 1] = 0;
    }
  });
  moveNoZeroElementsInLeft(row);
}

function canSwipeInLeft(row) {
  return row.some((item, index) => item > 0 && (item === row[index + 1] || row[index - 1] === 0));
}

function isFreeCell(field) {
  const n = fieldSize(field);
  for (let i = 0; i < n; i++) {
    const rowOfField = createRow(i, field);
    if (canSwipeInLeft(rowOfField)) {
      return true;
    }
  }
  return false;
}

function swipe(field) {
  const n = fieldSize(field);
  const check = isFreeCell(field);
  for (let i = 0; i < n; i++) {
    const rowOfField = createRow(i, field);
    moveNoZeroElementsInLeft(rowOfField);
    mergeSameElements(rowOfField);
    replaceValueRow(field, rowOfField, i * n);
  }
  if (check) {
    addTwo(field);
  }
}

exports.gameOver = function (field) {
  const n = fieldSize(field);
  if (field.some(element => element === 0)) {
    return false;
  }
  if (field.some((item, index) => item === field[index + n])) {
    return false;
  }
  if (field.some((item, index) => field[index] === field[index + 1] && index + 1 < index + n)) {
    return false;
  }
  return true;
};

exports.handleLeft = function (field) {
  swipe(field);
};

exports.handleRight = function (field) {
  mirror(field);
  swipe(field);
  mirror(field);
};

exports.handleUp = function (field) {
  rotate(field);
  swipe(field);
  rotate(field);
};

exports.handleDown = function (field) {
  rotate(field);
  mirror(field);
  swipe(field);
  mirror(field);
  rotate(field);
};
