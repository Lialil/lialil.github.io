const readline = require('readline');

const rl = readline.createInterface(process.stdin, process.stdout);

const choise = ['l', 'r', 'u', 'd', 'e'];
// const choise  = ['left', 'right','up', 'down', 'exit'];

let playingField = [];

function newField(n) {
  for (let i = 0; i < n * n; i += 1) {
    playingField[i] = 0;
  }
}

function oneLine(m, field) {
  const n = Math.sqrt(field.length);
  return field.slice(m, m + n);
}

function doubleElements(field) {
  const n = field.length;
  let boolean = false;
  for (let i = 0; i < n; i += 1) {
    if (field[i] === field[i + 1] && field[i] !== 0 && i + 1 < n) {
      boolean = true;
    }
  }
  return boolean;
}

function zero(field) {
  const n = field.length;
  let boolean = false;
  for (let i = 0; i < n; i += 1) {
    if (field[i] !== 0 && field[i - 1] === 0 && i - 1 >= 0) {
      boolean = true;
    }
  }
  return boolean;
}

function addTwo(field) {
  const temporary = [];
  const n = field.length;
  for (let i = 0; i < n; i += 1) {
    if (field[i] === 0) {
      temporary.push(i);
    }
  }
  const randomIndex = Math.floor(Math.random() * temporary.length);
  if (temporary.length !== 0) {
    playingField[temporary[randomIndex]] = 2;
    return true;
  }
  return false;
}

function checkNull(field) {
  const n = Math.sqrt(field.length);
  let boolean = false;
  for (let i = 0; i < n * n; i += n) {
    const temporary = oneLine(i, field);
    if (boolean === false) {
      boolean = doubleElements(temporary);
    }
    if (boolean === false) {
      boolean = zero(temporary);
    }
  }
  return boolean;
}

function removeNulls(field) {
  const n = Math.sqrt(field.length);
  for (let i = 0; i < n * n; i += n) {
    const temporary = [];
    for (let j = i; j < i + n; j += 1) {
      if (field[j] !== 0) {
        temporary.push(field[j]);
        field[j] = 0;
      }
    }
    for (let j = 0; j < temporary.length; j += 1) {
      field[j + i] = temporary[j];
    }
  }
}

function addElements(field) {
  const n = Math.sqrt(field.length);
  for (let i = 0; i < n * n; i += n) {
    for (let j = i; j < i + n; j += 1) {
      if (field[j] === field[j + 1] && field[j] !== 0 && j + 1 < i + n) {
        field[j] = field[j + 1] * 2;
        field[j + 1] = 0;
      }
    }
  }
  removeNulls(field);
}

function gameOver(field) {
  const n = Math.sqrt(field.length);
  let boolean = true;
  for (let i = 0; i < n * n; i += n) {
    for (let j = i; j < i + n; j += 1) {
      if (field[j] === field[j + 1] && field[j] !== 0 && j + 1 < i + n) {
        boolean = false;
      } else if (field[j] === field[j + n] && j < n * n - n && field[j] !== 0) {
        boolean = false;
      } else if (field[j] === 0) {
        boolean = false;
      }
    }
  }
  if (boolean) {
    console.log('Game over.');
    rl.close();
  }
}

function showing() {
  const n = Math.sqrt(playingField.length);
  for (let i = 0; i < n * n; i += n) {
    const temporary = oneLine(i, playingField);
    console.log(temporary.join('  '));
  }
}

function mirror(field) {
  const temporary = [];
  const n = Math.sqrt(field.length);
  for (let i = n; i <= n * n; i += n) {
    for (let j = i - 1; -j <= -(i - n); j += -1) {
      temporary.push(field[j]);
    }
  }
  playingField = temporary;
}

function rotate(field) {
  const temporary = [];
  const n = Math.sqrt(field.length);
  for (let i = 0; i < n; i += 1) {
    for (let j = i; j < n * n; j += n) {
      temporary.push(playingField[j]);
    }
  }
  playingField = temporary;
}
console.log(playingField);
newField(4);
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

// playingField[0] = 7;
// console.log(playingField);
// addTwo(playingField);
// console.log(playingField);


// // kk(ar);
// // for(let i = 0; i < n * n; i += n){
// //   let temporary = [];
// //   temporary = oneLine(i,ar,n);
// //   console.log(temporary);

// // }


// let y = kk1(playingField);;
// console.log(y);
