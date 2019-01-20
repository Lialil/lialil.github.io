const readline = require('readline');

const rl = readline.createInterface(process.stdin, process.stdout);

const n = 4;

const choise = ['l', 'r', 'u', 'd', 'q'];
// const choise  = ['left', 'right','up', 'down', 'exit'];

const playingField = [];

const duplicate = [];

function newField(field) {
  for (let i = 0; i < n * n; i += 1) {
	  field[i] = 0;
  }
}

function addTwo(field) {
  const arr = [];
  for (let i = 0; i < n * n; i += 1) {
    if (field[i] === 0) {
      arr.push(i);
    }
  }
  const random = Math.floor(Math.random() * arr.length);
  field[arr[random]] = 2;
  if (field[arr[random]] == 2) {
  	return true;
  }
  	return false;
}

function check(field) {
  let check = 0;
  for (let i = 0; i < n * n; i += n) {
    for (let j = i; j < i + n; j += 1) {
      if (field[j] === field[j + 1] && field[j] !== 0 && j + 1 < i + n) {
        check += 1;
      } else if (field[j] !== 0 && field[j - 1] == 0 && j - 1 >= i) {
      	check += 1;
      }
    }
  }
  if (check > 0) {
  	return true;
  }
  	return false;
}

function swipe(field) {
  for (let i = 0; i < n * n; i += n) {
    for (let j = i; j < i + n; j += 1) {
      let w = j + 1;
      if (field[j] === 0) {
        if (field[j + 1] === 0 && j + 1 < i + n) {
          while (field[w] === 0 && w < i + n) {
            w += 1;
          }
          if (w < i + n) {
            for (let k = j, q = w; q < i + n; q += 1, k += 1) {
              field[k] = field[q];
            }
            for (let m = i + n - 1; m >= i + n - w + j; m -= 1) {
              field[m] = 0;
            }
          }
        } else {
          for (let k = j; k < i + n - 1; k += 1) {
            field[k] = field[k + 1];
          }
          field[i + n - 1] = 0;
        }
      }
    }
  }

  for (let i = 0; i < n * n; i += n) {
    for (let j = i; j < i + n; j += 1) {
      if (field[j] === field[j + 1] && field[j] !== 0 && j + 1 < i + n) {
        field[j] = field[j] * 2;
        for (let k = j + 1; k < i + n - 1; k += 1) {
          field[k] = field[k + 1];
        }
        field[i + n - 1] = 0;
      }
    }
  }
}

function gameOver(field) {
  let over = 0;
  for (let i = 0; i < n * n; i += n) {
    for (let j = i; j < i + n; j += 1) {
      if (field[j] === field[j + 1] && field[j] !== 0 && j + 1 < i + n) {
        over += 1;
      } else if (field[j] === field[j + n] && j < n * n - n && field[j] !== 0) {
      	over += 1;
      } else if (field[j] === 0) {
      	over += 1;
      }
    }
  }
  if (over === 0) {
    console.log('Game over.');
    rl.close();
  }
}


function showing(field) {
  for (let i = 0; i < n * n; i += n) {
    const show = [];
    for (let j = i; j < i + n; j += 1) {
      show.push(field[j]);
    }
    console.log(show.join('  '));
  }
}

function mirror(duplicate, field) {
  for (let i = 0; i < n * n; i += n) {
    for (let j = i, k = i + n - 1; j < i + n, k >= i; k -= 1, j += 1) {
    	duplicate[j] = field[k];
    }
  }
}
function rotate(field) {
  for (let i = k = 0; i < n, k < n * n; i += 1, k += n) {
    for (let j = i - n, l = k; j < i + n * n - n, l < k + n; j += n, l += 1) {
      duplicate[j + n] = field[l];
    }
  }
}
function comeBack(field) {
  for (let i = k = 0; i < n, k < n * n; i += 1, k += n) {
    for (let j = i - n, l = k; j < i + n * n - n, l < k + n; j += n, l += 1) {
      field[l] = duplicate[j + n];
    }
  }
}

newField(playingField);
addTwo(playingField);
addTwo(playingField);
showing(playingField);

console.log('You can choose:', choise.join(', '));
rl.setPrompt('Your answer: ');
rl.prompt();
rl.on('line', (line) => {
  switch (line) {
    case choise[0]:
    	check(playingField);      
      swipe(playingField);
      if(check){
      	addTwo(playingField);
      }      
      break;
    case choise[1]:
      mirror(duplicate, playingField);
      check(duplicate);      
      swipe(duplicate);
      if(check){
      	addTwo(duplicate);
      }
      mirror(playingField, duplicate);
      break;
    case choise[2]:
      rotate(playingField);
      check(duplicate);      
      swipe(duplicate);
      if(check){
      	addTwo(duplicate);
      }
      comeBack(playingField);
      break;
    case choise[3]:
      rotate(playingField);
      mirror(playingField, duplicate);
      swipe(playingField);
      if(check){
      	addTwo(playingField);
      } 
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
  gameOver(playingField);
  rl.prompt();
}).on('close', () => { process.exit(0); });
