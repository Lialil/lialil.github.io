const readline = require('readline');

const rl = readline.createInterface(process.stdin, process.stdout);

const choise = ['l', 'r', 'u', 'd', 'q'];
// let choise  = ['left', 'right','up', 'down', 'exit'];

const rotation = [];
const pole = [];

const n = 4;

let help; let i; let k; let j; let l; let k1; let q;
// const pole = {
//   0: 7, 1: 2, 2: 5, 3: 3, 4: 9, 5: 3, 6: 8, 7: 1, 8: 2, 9: 1, 10: 9, 11: 5, 12: 2, 13: 5, 14: 3, 15: 6,
// };


for (i = 0; i < n * n; i += 1) {
  pole[i] = 0;
}
const rand = Math.floor(Math.random() * pole.length);
pole[rand] = 2;
const rand2 = Math.floor(Math.random() * pole.length);
pole[rand2] = 2;

function algorithm(pole) {
  let check = 0;
  for (i = 0; i < n * n; i += n) {
    for (j = i; j < i + n; j += 1) {
      if (pole[j] === pole[j + 1] && pole[j] !== 0 && j + 1 < i + n) {
        check += 1;
      } else if (pole[j - 1] === 0 && j - 1 > i) {
      	check += 1;
      }
    }
  }
  if (pole[0] === 0) { help = true; }
  for (i = 0; i < n * n; i += n) {
    for (j = i; j < i + n; j += 1) {
      let w = j + 1;
      if (pole[j] === 0) {
        if (pole[j + 1] === 0 && j + 1 < i + n) {
          while (pole[w] === 0 && w < i + n) {
            w += 1;
          }
          if (w < i + n) {
            for (k = j, q = w; q < i + n; q += 1, k += 1) {
              pole[k] = pole[q];
            }
            for (k1 = i + n - 1; k1 >= i + n - w + j; k1 -= 1) {
              pole[k1] = 0;
            }
          }
        } else {
          for (k = j; k < i + n - 1; k += 1) {
            pole[k] = pole[k + 1];
          }
          pole[i + n - 1] = 0;
        }
      }
    }
  }
  for (i = 0; i < n * n; i += n) {
    for (j = i; j < i + n; j += 1) {
      if (pole[j] === pole[j + 1] && pole[j] !== 0 && j + 1 < i + n) {
        pole[j] = pole[j] * 2;
        for (k = j + 1; k < i + n - 1; k += 1) {
          pole[k] = pole[k + 1];
        }
        pole[i + n - 1] = 0;
      }
    }
  }

  if (check > 0 || help === true) {
    const arr = [];
    for (i = 0; i < n * n; i += 1) {
      if (pole[i] === 0) {
        arr.push(i);
      }
    }
    const rand3 = Math.floor(Math.random() * arr.length);
    pole[arr[rand3]] = 2;
  }

  let over = 0;
  for (i = 0; i < n * n; i += n) {
    for (j = i; j < i + n; j += 1) {
      if (pole[j] === pole[j + 1] && pole[j] !== 0 && j + 1 < i + n) {
        over += 1;
      } else if (pole[j] === pole[j + n] && j < n * n - n && pole[j] !== 0) {
      	over += 1;
      } else if (pole[j] === 0) {
      	over += 1;
      }
    }
  }

  if (over === 0) {
    console.log('Game over.');
    rl.close();
  }
}

function showing(pole) {
  for (i = 0; i < n * n; i += n) {
    const show = [];
    for (j = i; j < i + n; j += 1) {
      show.push(pole[j]);
    }
    console.log(show.join('  '));
  }
}

function mirror(rotation, pole) {
  for (i = 0; i < n * n; i += n) {
    for (j = i, k = i + n - 1; j < i + n, k >= i; k -= 1, j += 1) {
    	rotation[j] = pole[k];
    }
  }
}
function roll() {
  for (i = k = 0; i < n, k < n * n; i += 1, k += n) {
    for (j = i - n, l = k; j < i + n * n - n, l < k + n; j += n, l += 1) {
      rotation[j + n] = pole[l];
    }
  }
}
function comeBack() {
  for (i = k = 0; i < n, k < n * n; i += 1, k += n) {
    for (j = i - n, l = k; j < i + n * n - n, l < k + n; j += n, l += 1) {
      pole[l] = rotation[j + n];
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
