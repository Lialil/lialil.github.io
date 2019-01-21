const readline = require('readline');

const rl = readline.createInterface(process.stdin, process.stdout);

const choise = ['l', 'r', 'u', 'd', 'e'];
// const choise  = ['left', 'right','up', 'down', 'exit'];

let playingField = [];

function createField(n) {
  for (let i = 0; i < n * n; i += 1) {
    playingField[i] = 0;
  }
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
    playingField[zeroElements[randomZeroElement]] = 2;
    return true;
  }
  return false;
}

function string(m, field) {
  const n = Math.sqrt(field.length);
  return field.slice(m, m + n);
}

function identicalElements(field) {
  const n = field.length;
  for (let i = 0; i < n; i += 1) {
    if (field[i] === field[i + 1] && field[i] !== 0 && i + 1 < n) {
      return true;
    }
  }
  return false;
}

function zeroInFront(field) {
  const n = field.length;
  for (let i = 0; i < n; i += 1) {
    if (field[i] !== 0 && field[i - 1] === 0 && i - 1 >= 0) {
      return true;
    }
  }
  return false;
}

function newElement(field) {
  const n = Math.sqrt(field.length);
  for (let i = 0; i < n * n; i += n) {
    const stringOfField = string(i, field);
    if (identicalElements(stringOfField) === true) {
      return true;
    }
    if (zeroInFront(stringOfField) === true) {
      return true;
    }
  }
  return false;
}

function moveNoZeroElements(field) {
  const n = Math.sqrt(field.length);
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

function totalizeIdenticalElements(field) {
  const n = Math.sqrt(field.length);
  for (let i = 0; i < n * n; i += n) {
    for (let j = i; j < i + n; j += 1) {
      if (field[j] === field[j + 1] && field[j] !== 0 && j + 1 < i + n) {
        field[j] = field[j + 1] * 2;
        field[j + 1] = 0;
      }
    }
  }
  moveNoZeroElements(field);
}

function gameOver(field) {
  const n = Math.sqrt(field.length);
  for (let i = 0; i < n * n; i += n) {
    for (let j = i; j < i + n; j += 1) {
      if (field[j] === field[j + 1] && field[j] !== 0 && j + 1 < i + n) {
        return false;
      }
      if (field[j] === field[j + n] && j < n * n - n && field[j] !== 0) {
        return false;
      }
      if (field[j] === 0) {
        return false;
      }
    }
  }
  return true;
}

function showing() {
  const n = Math.sqrt(playingField.length);
  for (let i = 0; i < n * n; i += n) {
    const stringOfField = string(i, playingField);
    console.log(stringOfField.join('  '));
  }
}

function mirror(field) {
  const newField = [];
  const n = Math.sqrt(field.length);
  for (let i = n; i <= n * n; i += n) {
    for (let j = i - 1; -j <= -(i - n); j += -1) {
      newField.push(field[j]);
    }
  }
  playingField = newField;
}

function rotate(field) {
  const newField = [];
  const n = Math.sqrt(field.length);
  for (let i = 0; i < n; i += 1) {
    for (let j = i; j < n * n; j += n) {
      newField.push(playingField[j]);
    }
  }
  playingField = newField;
}

function swipe(field) {
  const check = newElement(field);
  moveNoZeroElements(field);
  totalizeIdenticalElements(field);
  if (check) {
    addTwo(field);
  }
}

createField(4);
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
