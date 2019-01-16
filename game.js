const readline = require('readline');

const rl = readline.createInterface(process.stdin, process.stdout);

const choise = ['l', 'r', 'u', 'd', 'q'];
// const choise  = ['left', 'right','up', 'down', 'exit'];

const playingField = [];
const duplicate = [];
const n = 4;

let help; let i; let k; let j; let l; let m; let q; let over;

function rand(field) {
  const random = Math.floor(Math.random() * field.length);
  return random;
}
function newField() {
  for (i = 0; i < n * n; i += 1) {
	  playingField[i] = 0;
  }
  const first = rand(playingField);
  let second = first;
  playingField[first] = 2;
  while (second == first) {
    second = rand(playingField);
  }
  playingField[second] = 2;
}
function algorithm(field) {
  if (field[0] === 0) { help = true; }
  let check = 0;
  for (i = 0; i < n * n; i += n) {
    for (j = i; j < i + n; j += 1) {
      if (field[j] === field[j + 1] && field[j] !== 0 && j + 1 < i + n) {
        check += 1;
      } else if (field[j] != 0 && field[j - 1] == 0 && j - 1 >= i) {
      	check += 1;
      }
    }
  }
  for (i = 0; i < n * n; i += n) {
    for (j = i; j < i + n; j += 1) {
      let w = j + 1;
      if (field[j] === 0) {
        if (field[j + 1] === 0 && j + 1 < i + n) {
          while (field[w] === 0 && w < i + n) {
            w += 1;
          }
          if (w < i + n) {
            for (k = j, q = w; q < i + n; q += 1, k += 1) {
              field[k] = field[q];
            }
            for (m = i + n - 1; m >= i + n - w + j; m -= 1) {
              field[m] = 0;
            }
          }
        } else {
          for (k = j; k < i + n - 1; k += 1) {
            field[k] = field[k + 1];
          }
          field[i + n - 1] = 0;
        }
      }
    }
  }
  for (i = 0; i < n * n; i += n) {
    for (j = i; j < i + n; j += 1) {
      if (field[j] === field[j + 1] && field[j] !== 0 && j + 1 < i + n) {
        field[j] = field[j] * 2;
        for (k = j + 1; k < i + n - 1; k += 1) {
          field[k] = field[k + 1];
        }
        field[i + n - 1] = 0;
      }
    }
  }
  if (check > 0) {
    const arr = [];
    for (i = 0; i < n * n; i += 1) {
      if (field[i] === 0) {
        arr.push(i);
      }
    }
    field[arr[rand(arr)]] = 2;
  }
  over = 0;
  for (i = 0; i < n * n; i += n) {
    for (j = i; j < i + n; j += 1) {
      if (field[j] === field[j + 1] && field[j] !== 0 && j + 1 < i + n) {
        over += 1;
      } else if (field[j] === field[j + n] && j < n * n - n && field[j] !== 0) {
      	over += 1;
      } else if (field[j] === 0) {
      	over += 1;
      }
    }
  }
}
function overCheck() {
  if (over === 0) {
    console.log('Game over.');
    rl.close();
  }
}
function showing(field) {
  for (i = 0; i < n * n; i += n) {
    const show = [];
    for (j = i; j < i + n; j += 1) {
      show.push(field[j]);
    }
    console.log(show.join('  '));
  }
}
function mirror(duplicate, field) {
  for (i = 0; i < n * n; i += n) {
    for (j = i, k = i + n - 1; j < i + n, k >= i; k -= 1, j += 1) {
    	duplicate[j] = field[k];
    }
  }
}
function rotate(field) {
  for (i = k = 0; i < n, k < n * n; i += 1, k += n) {
    for (j = i - n, l = k; j < i + n * n - n, l < k + n; j += n, l += 1) {
      duplicate[j + n] = field[l];
    }
  }
}
function comeBack(field) {
  for (i = k = 0; i < n, k < n * n; i += 1, k += n) {
    for (j = i - n, l = k; j < i + n * n - n, l < k + n; j += n, l += 1) {
      field[l] = duplicate[j + n];
    }
  }
}

newField();
console.log('Original');
showing(playingField);
console.log('You can choose:', choise.join(', '));
rl.setPrompt('Your answer: ');
rl.prompt();
rl.on('line', (line) => {
  switch (line) {
    case choise[0]:
      algorithm(playingField);
      break;
    case choise[1]:
      mirror(duplicate, playingField);
      algorithm(duplicate);
      mirror(playingField, duplicate);
      break;
    case choise[2]:
      rotate(playingField);
      algorithm(duplicate);
      comeBack(playingField);
      break;
    case choise[3]:
      rotate(playingField);
      mirror(playingField, duplicate);
      algorithm(playingField);
      mirror(duplicate, playingField);
      comeBack(playingField);
      break;
    case choise[4]:
      rl.close();
      break;
    default:
      console.log('Incorrect answer. Please try again)');
      break;
  }
  showing(playingField);
  overCheck();
  rl.prompt();
}).on('close', () => { process.exit(0); });
