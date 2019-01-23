
const readline = require('readline');

const rl = readline.createInterface(process.stdin, process.stdout);

const choise = ['l', 'r', 'u', 'd', 'e'];

function createField(n) {
  return Array(n * n).fill(0);
}

function fieldSize(field) {
  return Math.sqrt(field.length);
}

function createRow(m, field) {
  const n = fieldSize(field);
  return field.slice(m, m + n);
}

function replaceValueRow(field, row, column) {
  const n = row.length;
  for (let i = 0; i < n; i += 1) {
    field[i + column] = row[i];
  }
}

function addTwo(field) {
  const zeroElements = [];
  field.forEach((item, index) => {
    if (item === 0) { zeroElements.push(index); }
  });
  const randomZeroElement = Math.floor(Math.random() * zeroElements.length);
  if (zeroElements.length !== 0) {
    field[zeroElements[randomZeroElement]] = 2;
    return true;
  }
  return false;
}

function canSwipeInLeft(row) {
  const n = row.length;
  for (let i = 0; i < n; i += 1) {
    if (row[i] !== 0) {
      if (row[i] === row[i + 1] || row[i - 1] === 0) { return true; }
    }
  }
  return false;
}

function isFreeCell(field) {
  const n = fieldSize(field);
  for (let i = 0; i < n * n; i += n) {
    const rowOfField = createRow(i, field);
    if (canSwipeInLeft(rowOfField)) { return true; }
  }
  return false;
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

function swipe(field) {
  const check = isFreeCell(field);
  const n = fieldSize(field);
  for (let i = 0; i < n * n; i += n) {
    const rowOfField = createRow(i, field);
    moveNoZeroElementsInLeft(rowOfField);
    mergeSameElements(rowOfField);
    replaceValueRow(field, rowOfField, i);
  }
  if (check) {
    addTwo(field);
  }
}

function gameOver(field) {
  const n = fieldSize(field);
  for (let i = 0; i < n * n; i += n) {
    for (let j = i; j < i + n; j += 1) {
      if (field[j] !== 0 && field[j] === field[j + 1] && j + 1 < i + n) {
        return false;
      }
      if (field[j] !== 0 && field[j] === field[j + n] && j < n * n - n) {
        return false;
      }
    }
  }
  return field.every(element => element !== 0);
}

function mirror(field) {
  const newField = [];
  const n = fieldSize(field);
  for (let i = n; i <= n * n; i += n) {
    for (let j = i - 1; -j <= -(i - n); j -= 1) {
      newField.push(field[j]);
    }
  }
  replaceValueRow(field, newField, 0);
}

function rotate(field) {
  const newField = [];
  const n = fieldSize(field);
  for (let i = 0; i < n; i += 1) {
    for (let j = i; j < n * n; j += n) {
      newField.push(field[j]);
    }
  }
  replaceValueRow(field, newField, 0);
}

function showing(field) {
  const n = fieldSize(field);
  for (let i = 0; i < n * n; i += n) {
    const rowOfField = createRow(i, field);
    console.log(rowOfField.join('  '));
  }
}

const playingField = createField(4);
addTwo(playingField);
addTwo(playingField);
// playingField = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,0];

showing(playingField);
console.log('You can choose:', choise.join(', '));
rl.setPrompt('Your answer: ');
rl.prompt();
rl.on('line', (line) => {
  switch (line) {
    case choise[0]:
      swipe(playingField);
      break;
    case choise[1]:
      mirror(playingField);
      swipe(playingField);
      mirror(playingField);
      break;
    case choise[2]:
      rotate(playingField);
      swipe(playingField);
      rotate(playingField);
      break;
    case choise[3]:
      rotate(playingField);
      mirror(playingField);
      swipe(playingField);
      mirror(playingField);
      rotate(playingField);
      break;
    case choise[4]:
      rl.close();
      break;
    default:
      console.log('Incorrect answer. Please try again)');
      break;
  }
  showing(playingField);
  if (gameOver(playingField)) {
    console.log('Game over.');
    rl.close();
  }
  rl.prompt();
}).on('close', () => { process.exit(0); });
