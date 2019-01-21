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

function oneLine(m) {
  return playingField.slice(m, m + Math.sqrt(playingField.length));
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

function addTwo() {
  const temporary = [];
  for (let i = 0; i < playingField.length; i += 1) {
    if (playingField[i] === 0) {
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

function checkNull() {
  const n = Math.sqrt(playingField.length);
  let boolean = false;
  for (let i = 0; i < n * n; i += n) {
    const temporary = oneLine(i);
    if (boolean === false) {
      boolean = doubleElements(temporary);
    }
    if (boolean === false) {
      boolean = zero(temporary);
    }
  }
  return boolean;
}


function removeNulls() {
  const n = Math.sqrt(playingField.length);
  for (let i = 0; i < n * n; i += n) {
    const temporary = [];
    for (let j = i; j < i + n; j += 1) {
      if (playingField[j] !== 0) {
        temporary.push(playingField[j]);
        playingField[j] = 0;
      }
    }
    for (let j = 0; j < temporary.length; j += 1) {
      playingField[j + i] = temporary[j];
    }
  }
}

function addElements() {
  const n = Math.sqrt(playingField.length);
  for (let i = 0; i < n * n; i += n) {
    for (let j = i; j < i + n; j += 1) {
      if (playingField[j] === playingField[j + 1] && playingField[j] !== 0 && j + 1 < i + n) {
        playingField[j] = playingField[j + 1] * 2;
        playingField[j + 1] = 0;
      }
    }
  }
  removeNulls();
}

function gameOver() {
  const n = Math.sqrt(playingField.length);
  let boolean = true;
  for (let i = 0; i < n * n; i += n) {
    for (let j = i; j < i + n; j += 1) {
      if (playingField[j] === playingField[j + 1] && playingField[j] !== 0 && j + 1 < i + n) {
        boolean = false;
      } else if (playingField[j] === playingField[j + n] && j < n * n - n && playingField[j] !== 0) {
        boolean = false;
      } else if (playingField[j] === 0) {
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
    const temporary = oneLine(i);
    console.log(temporary.join('  '));
  }
}

function mirror() {
  const temporary = [];
  const n = Math.sqrt(playingField.length);
  for (let i = n; i <= n * n; i += n) {
    for (let j = i - 1; -j <= -(i - n); j += -1) {
      temporary.push(playingField[j]);
    }
  }
  playingField = temporary;
}

function rotate() {
  const temporary = [];
  const n = Math.sqrt(playingField.length);
  for (let i = 0; i < n; i += 1) {
    for (let j = i; j < n * n; j += n) {
      temporary.push(playingField[j]);
    }
  }
  playingField = temporary;
}
newField(4);
addTwo();
addTwo();
showing();

console.log('You can choose:', choise.join(', '));
rl.setPrompt('Your answer: ');
rl.prompt();
let check1;
rl.on('line', (line) => {
  switch (line) {
    case choise[0]:
      check1 = checkNull();
      removeNulls();
      addElements();
      if (check1) {
        addTwo();
      }
      break;
    case choise[1]:
      mirror();
      check1 = checkNull();
      removeNulls();
      addElements();
      if (check1) {
        addTwo();
      }
      mirror();
      break;
    case choise[2]:
      rotate();
      check1 = checkNull();
      removeNulls();
      addElements();
      if (check1) {
        addTwo();
      }
      rotate();
      break;
    case choise[3]:
      rotate();
      mirror();
      check1 = checkNull();
      removeNulls();
      addElements();
      if (check1) {
        addTwo();
      }
      mirror();
      rotate();
      break;
    case choise[4]:
      rl.close();
      break;
    default:
      console.log('Incorrect answer. Please try again)');
      break;
  }
  showing();
  gameOver();
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
// addTwo();
// console.log(playingField);


// // kk(ar);
// // for(let i = 0; i < n * n; i += n){
// //   let temporary = [];
// //   temporary = oneLine(i,ar,n);
// //   console.log(temporary);

// // }


// let y = kk1(playingField);;
// console.log(y);


// function addTwo(field) {
//   const field = field;
//   const temporary = [];
//   for (let i = 0; i < field.length; i += 1) {
//     if (field[i] === 0) {
//       temporary.push(i);
//     }
//   }
//   const random = Math.floor(Math.random() * temporary.length);
// debugger;
//   field[temporary[random]] = 2;
//   if (temporary.length !== 0) {
//     return true;
//   }
//   return false;
// }

// const a = [1,2,3,4];
// addTwo(a);
