const readline = require('readline');

const rl = readline.createInterface(process.stdin, process.stdout);

const choise = ['l', 'r', 'u', 'd', 'e'];
// const choise  = ['left', 'right','up', 'down', 'exit'];

let playingField = [];

function newField(field, n) {
  const cell = field;
  for (let i = 0; i < n * n; i += 1) {
    cell[i] = 0;
  }
}

function oneLine(m, field) {
  const array = [];
  const cell = field;
  const n = Math.sqrt(cell.length);
  for (let i = m; i < m + n; i += 1) {
    array.push(field[i]);
  }
  return array;
}

function doubleElements(field) {
  const cell = field;
  const n = cell.length;
  let boolean = false;
  for (let i = 0; i < n; i += 1) {
    if (cell[i] === cell[i + 1] && cell[i] !== 0 && i + 1 < n) {
      boolean = true;
    }
  }
  return boolean;
}

function zero(field) {
  const cell = field;
  const n = cell.length;
  let boolean = false;
  for (let i = 0; i < n; i += 1) {
    if (cell[i] !== 0 && cell[i - 1] === 0 && i - 1 >= 0) {
      boolean = true;
    }
  }
  return boolean;
}

function addTwo(field) {
  const cell = field;
  const array = [];
  for (let i = 0; i < cell.length; i += 1) {
    if (cell[i] === 0) {
      array.push(i);
    }
  }
  const random = Math.floor(Math.random() * array.length);
  cell[array[random]] = 2;
  if (array.length !== 0) {
    return true;
  }
  return false;
}

function checkNull(field) {
  const cell = field;
  const n = Math.sqrt(cell.length);
  let boolean = false;
  for (let i = 0; i < n * n; i += n) {
    const array = oneLine(i, cell);
    if (boolean === false) {
      boolean = doubleElements(array);
    }
    if (boolean === false) {
      boolean = zero(array);
    }
  }
  return boolean;
}

function removeNulls(field) {
  const cell = field;
  const n = Math.sqrt(cell.length);
  for (let i = 0; i < n * n; i += n) {
    const array = [];
    for (let j = i; j < i + n; j += 1) {
      if (cell[j] !== 0) {
        array.push(cell[j]);
        cell[j] = 0;
      }
    }
    for (let j = 0; j < array.length; j += 1) {
      cell[j + i] = array[j];
    }
  }
}

function addElements(field) {
  const cell = field;
  const n = Math.sqrt(cell.length);
  for (let i = 0; i < n * n; i += n) {
    for (let j = i; j < i + n; j += 1) {
      if (cell[j] === cell[j + 1] && cell[j] !== 0 && j + 1 < i + n) {
        cell[j] = cell[j + 1] * 2;
        cell[j + 1] = 0;
      }
    }
  }
  removeNulls(cell);
}

function gameOver(field) {
  const cell = field;
  const n = Math.sqrt(cell.length);
  let boolean = true;
  for (let i = 0; i < n * n; i += n) {
    for (let j = i; j < i + n; j += 1) {
      if (cell[j] === cell[j + 1] && cell[j] !== 0 && j + 1 < i + n) {
        boolean = false;
      } else if (cell[j] === cell[j + n] && j < n * n - n && cell[j] !== 0) {
        boolean = false;
      } else if (cell[j] === 0) {
        boolean = false;
      }
    }
  }
  if (boolean) {
    console.log('Game over.');
    rl.close();
  }
}

function showing(field) {
  const cell = field;
  const n = Math.sqrt(cell.length);
  for (let i = 0; i < n * n; i += n) {
    const array = oneLine(i, cell);
    console.log(array.join('  '));
  }
}

function mirror(field) {
  const cell = field;
  const array = [];
  const n = Math.sqrt(cell.length);
  for (let i = n; i <= n * n; i += n) {
    for (let j = i - 1; -j <= -(i - n); j += -1) {
      array.push(cell[j]);
    }
  }
  playingField = array;
}

function rotate(field) {
  const cell = field;
  const array = [];
  const n = Math.sqrt(cell.length);
  for (let i = 0; i < n; i += 1) {
    for (let j = i; j < n * n; j += n) {
      array.push(playingField[j]);
    }
  }
  playingField = array;
}

newField(playingField, 4);
addTwo(playingField);
addTwo(playingField);
showing(playingField);

console.log('You can choose:', choise.join(', '));
rl.setPrompt('Your answer: ');
rl.prompt();
let check1;
rl.on('line', (line) => {
  switch (line) {
    case choise[0]:
      check1 = checkNull(playingField);
      removeNulls(playingField);
      addElements(playingField);
      if (check1) {
        addTwo(playingField);
      }
      break;
    case choise[1]:
      mirror(playingField);
      check1 = checkNull(playingField);
      removeNulls(playingField);
      addElements(playingField);
      if (check1) {
        addTwo(playingField);
      }
      mirror(playingField);
      break;
    case choise[2]:
      rotate(playingField);
      check1 = checkNull(playingField);
      removeNulls(playingField);
      addElements(playingField);
      if (check1) {
        addTwo(playingField);
      }
      rotate(playingField);
      break;
    case choise[3]:
      rotate(playingField);
      mirror(playingField);
      check1 = checkNull(playingField);
      removeNulls(playingField);
      addElements(playingField);
      if (check1) {
        addTwo(playingField);
      }
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
  gameOver(playingField);
  rl.prompt();
}).on('close', () => { process.exit(0); });


// // let ar = [6,7,7,9];
// const n = 4
// let d = 0;
//   for (let i = 0; i < n * n; i += 1) {
//     playingField[i] = d;
//     d=d+1;
//   }
// playingField[6] = 7;
// console.log(playingField);
// // kk(ar);
// // for(let i = 0; i < n * n; i += n){
// //   let array = [];
// //   array = oneLine(i,ar,n);
// //   console.log(array);

// // }


// let y = kk1(playingField);;
// console.log(y);
