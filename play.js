const readline = require('readline');

const rl = readline.createInterface(process.stdin, process.stdout);

const choise = ['l', 'r', 'u', 'd', 'e'];
console.log('You can choose:', choise.join(', '));

const Game2048 = require('./game.js').Game2048;

const game = new Game2048(4);

function showing(field) {
  const n = field.length;
  for (let i = 0; i < n; i++) {
    console.log(field[i].join('  '));
  }
}

showing(game.createField());
rl.setPrompt('Your answer: ');
rl.prompt();
rl.on('line', (line) => {
  switch (line) {
    case choise[0]:
      showing(game.handleLeft());
      break;
    case choise[1]:
      showing(game.handleRight());
      break;
    case choise[2]:
      showing(game.handleUp());
      break;
    case choise[3]:
      showing(game.handleDown());
      break;
    case choise[4]:
      rl.close();
      break;
    default:
      console.log('Incorrect answer. Please try again)');
      break;
  }
  if (game.gameOver()) {
    console.log('Game over.');
    rl.close();
  }
  rl.prompt();
}).on('close', () => { process.exit(0); });
