
const readline = require('readline');
const rl = readline.createInterface(process.stdin, process.stdout);

const choise = ['l', 'r', 'u', 'd', 'e'];

let playingField = [];

function createField(n) {
  return Array(n * n).fill(0);
}

function addTwo(field) {
  const zeroElements = [];
  const n = field.length;
  for (let i = 0; i < n; i += 1) {
    if (field[i] === 0) {
      zeroElements.push(i);
    }
  }
  const randomZeroElement = Math.floor(Math.random() * zeroElements.length);
  if (zeroElements.length !== 0) {
    field[zeroElements[randomZeroElement]] = 2;
    return true;
  }
  return false;
}

function row(m, field) {
  const n = fieldSize(field);
  return field.slice(m, m + n);
}

function fieldSize(field){
  return Math.sqrt(field.length);
}

function isAllZero(element) {
  return element !== 0;
}

function isFreeCell(field) {
  const n = fieldSize(field);
  for (let i = 0; i < n * n; i += n) {
    const rowOfField = row(i, field);
    if (twoEqualElements(rowOfField)) {
      return true;
    }
    if (zeroInLeft(rowOfField)) {
      return true;
    }
  }
  return false;
}

function twoEqualElements(row) {
  const n = row.length;
  for (let i = 0; i < n; i += 1) {
    if (row[i] === row[i + 1] && row[i] !== 0 && i + 1 < n) {
      return true;
    }
  }
  return false;
}

function zeroInLeft(row) {
  const n = row.length;
  for (let i = 0; i < n; i += 1) {
    if (row[i] !== 0 && row[i - 1] === 0 && i - 1 >= 0) {
      return true;
    }
  }
  return false;
}

function moveNoZeroElementsInLeft(field) {
  const n = fieldSize(field);
  for (let i = 0; i < n * n; i += n) {
    const noZeroElements = [];
    for (let j = i; j < i + n; j += 1) {
      if (field[j] !== 0) {
        noZeroElements.push(field[j]);
        field[j] = 0;
      }
    }
    for (let j = 0; j < noZeroElements.length; j += 1) {
      field[j + i] = noZeroElements[j];
    }
  }
}

function mergeSameElements(field) {
  const n = fieldSize(field);
  for (let i = 0; i < n * n; i += n) {
    for (let j = i; j < i + n; j += 1) {
      if (field[j] === field[j + 1] && field[j] !== 0 && j + 1 < i + n) {
        field[j] = field[j + 1] * 2;
        field[j + 1] = 0;
      }
    }
  }
  moveNoZeroElementsInLeft(field);
}

function gameOver(field) {
  const n = fieldSize(field); 
  for (let i = 0; i < n * n; i += n) {
    for (let j = i; j < i + n; j += 1) {
      if (field[j] === field[j + 1] && field[j] !== 0 && j + 1 < i + n) {
        return false;
      }
      if (field[j] === field[j + n] && j < n * n - n && field[j] !== 0) {
        return false;
      }      
    }
  }
  return field.every(isAllZero);
}

function mirror(field) {
  const newField = [];
  const n = fieldSize(field);
  for (let i = n; i <= n * n; i += n) {
    for (let j = i - 1; j >= i - n; j += -1) {
      newField.push(field[j]);
    }
  }
  for(let i = 0; i<n*n; i+=1){
    field[i] = newField[i];
  }
}

function rotate(field) {
  const newField = [];
  const n = fieldSize(field);
  for (let i = 0; i < n; i += 1) {
    for (let j = i; j < n * n; j += n) {
      newField.push(field[j]);
    }
  }
  for(let i = 0; i<n*n; i+=1){
    field[i] = newField[i];
  }
}

function showing(field) {
  const n = fieldSize(field);
  for (let i = 0; i < n * n; i += n) {
    const rowOfField = row(i, field);
    console.log(rowOfField.join('  '));
  }
}

function swipe(field) {
  const check = isFreeCell(field);
  moveNoZeroElementsInLeft(field);
  mergeSameElements(field);
  if (check) {
    addTwo(field);
  }
}

playingField =  createField(4);
addTwo(playingField);
addTwo(playingField);
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