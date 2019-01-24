const readline = require('readline');

const rl = readline.createInterface(process.stdin, process.stdout);
const importFunction = require('./game.js');

const playingField = importFunction.createField(4);
importFunction.showing(playingField);

const choise = ['l', 'r', 'u', 'd', 'e'];

console.log('You can choose:', choise.join(', '));


rl.setPrompt('Your answer: ');
rl.prompt();
rl.on('line', (line) => {
  switch (line) {
    case choise[0]:
      importFunction.handleLeft(playingField);
      break;
    case choise[1]:
      importFunction.handleRight(playingField);
      break;
    case choise[2]:
      importFunction.handleUp(playingField);
      break;
    case choise[3]:
      importFunction.handleDown(playingField);
      break;
    case choise[4]:
      rl.close();
      break;
    default:
      console.log('Incorrect answer. Please try again)');
      break;
  }

  importFunction.showing(playingField);
  if (importFunction.gameOver(playingField)) {
    console.log('Game over.');
    rl.close();
  }
  rl.prompt();
}).on('close', () => { process.exit(0); });
