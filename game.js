const readline = require('readline');

const rl = readline.createInterface(process.stdin, process.stdout);

const choise = ['l', 'r', 'u', 'd', 'q'];
// let choise  = ['left', 'right','up', 'down', 'exit'];

const rotation = [];
const pole = [];

const n = 16;
const m = 4;

let help; let i; let k; let j; let l;
// const pole = {0:0,1:2,2:2,3:0,4:0,5:2,6:4,7:2,8:2,9:2,10:4,11:4,12:2,13:0,14:2,15:2};
// const pole = {0: 7, 1: 2, 2: 0, 3: 3, 4: 9, 5: 3, 6: 8, 7: 1, 8: 2, 9: 1, 10: 9, 11: 5, 12: 2, 13: 5, 14: 3, 15: 6};
for (i = 0; i < m * m; i += 1) {
  pole[i] = 0;
}
const rand = Math.floor(Math.random() * pole.length);
pole[rand] = 2;
const rand2 = Math.floor(Math.random() * pole.length);
pole[rand2] = 2;

function algorithm(pole) {
  let arr1 = 0;
  for (i = 0; i < m * m; i += m) {
    for (j = i; j < i + m; j++) {
      if (pole[j] === pole[j + 1] && pole[j] !== 0 && j + 1 < i + 4 || pole[j - 1] === 0 && j - 1 > i) {
        arr1 += 1;
      }
    }
  }

  if (pole[0] === 0) { help = true; }

  for (i = 0; i < m * m; i += m) {
    for (j = i; j < i + m; j += 1) {
      if (pole[j] === pole[j + 1] && j + 1 < i + 4) {
        pole[j] = pole[j] * 2;
        pole[j + 1] = 0;
        if (pole[j - 1] === 0 && pole[j - 2] === 0 && j - 1 >= i && j - 2 >= i) {
          pole[j - 2] = pole[j];
          pole[j] = 0;
        } else if (pole[j - 1] === 0 && j - 1 >= i) {
          pole[j - 1] = pole[j];
          pole[j] = 0;
        }
      } else if (pole[j] === pole[j + 2] && pole[j + 1] === 0 && j + 2 < i + 4 && j + 1 < i + 4) {
        pole[j] = pole[j] * 2;
        pole[j + 1] = 0;
        pole[j + 2] = 0;
        if (pole[j - 1] === 0 && j - 1 >= i) {
          pole[j - 1] = pole[j];
          pole[j] = 0;
        }
      } else if (pole[j] === pole[j + 3] && pole[j + 1] === 0 && pole[j + 2] === 0 && j + 3 < i + 4 && j + 3 < i + 4 && j + 1 < i + 4) {
        pole[j] = pole[j] * 2;
        pole[j + 1] = 0;
        pole[j + 2] = 0;
        pole[j + 3] = 0;
      } else if (pole[j - 1] === 0 && pole[j - 2] === 0 && pole[j - 3] === 0 && j - 1 >= i && j - 2 >= i && j - 3 >= i) {
        pole[j - 3] = pole[j];
        pole[j] = 0;
      } else if (pole[j - 1] === 0 && pole[j - 2] === 0 && j - 1 >= i && j - 2 >= i) {
        pole[j - 2] = pole[j];
        pole[j] = 0;
      } else if (pole[j - 1] === 0 && j - 1 >= i) {
        pole[j - 1] = pole[j];
        pole[j] = 0;
      }
    }
  }

  if (arr1 > 0 || help === true) {
    const arr = [];
    for (i = 0; i < m * m; i += 1) {
      if (pole[i] === 0) {
        arr.push(i);
      }
    }
    const rand = Math.floor(Math.random() * arr.length);
    pole[arr[rand]] = 2;
  }

  let arr2 = 0;
  for (i = 0; i < m * m; i += m) {
    for (j = i; j < i + m; j += 1) {
      if (pole[j] === pole[j + 1] && pole[j] !== 0 && j + 1 < i + 4 || pole[j] === pole[j + 4] && j < 12 && pole[j] !== 0 || pole[j] === 0) {
        arr2 += 1;
      }
    }
  }

  if (arr2 === 0) {
    console.log('Game over.');
    rl.close();
  }
}

function showing(pole) {
  for (i = 0; i < m * m; i += m) {
    console.log(pole[i], pole[i + 1], pole[i + 2], pole[i + 3]);
  }
}
function mirror(rotation, pole) {
  for (i = 0; i < m * m; i += m) {
    for (j = i, k = i + m - 1; j < i + m, k >= i; k -= 1, j += 1) {
      rotation[j] = pole[k];
    }
  }
}
function roll() {
  for (i = k = 0; i < m, k < m * m; i += 1, k += m) {
    for (j = i - m, l = k; j < i + m * m - m, l < k + m; j += m, l += 1) {
    	rotation[j + m] = pole[l];
    }
  }
}
function comeBack() {
  for (i = k = 0; i < m, k < n; i += 1, k += m) {
    for (j = i - m, l = k; j < i + m * m - m, l < k + m; j += m, l += 1) {
      pole[l] = rotation[j + m];
    }
  }
}
console.log('Original');
showing(pole);
console.log('You can choose:', choise.join(', '));
rl.setPrompt('Your answer: ');
rl.prompt();
rl.on('line', (line) => {
  switch (line) {
    case choise[0]:
      algorithm(pole);
      break;
    case choise[1]:
      mirror(rotation, pole);
	  algorithm(rotation);
	  mirror(pole, rotation);
	  break;
    case choise[2]:
      roll();
      algorithm(rotation);
      comeBack();
      break;
    case choise[3]:
      roll();
      mirror(pole, rotation);
      algorithm(pole);
      mirror(rotation, pole);
      comeBack();
      break;
    case choise[4]:
      rl.close();
      break;
    default:
      console.log('Incorrect answer. Please try again)');
      break;
  }
  showing(pole);
  rl.prompt();
}).on('close', () => { process.exit(0); });