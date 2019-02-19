document.addEventListener('DOMContentLoaded', () => {
  const n = 8;
  const cellSize = `${(100-n*2)/n}%`;
  
  const game = new Game2048(n);


  const playingField = document.getElementById('playingField');

 const showing = function showing(field){
    while (playingField.firstChild) {
      playingField.removeChild(playingField.firstChild);
    }
    field.forEach((row) => {
      row.forEach((cell)=>{
        const div = document.createElement('div');
        div.className = "cell";
        if (cell !== 0) {
          div.innerHTML = cell;
        }
        playingField.appendChild(div);
      });
    });
    [].forEach.call(document.querySelectorAll('.cell'), (el) => { el.style.width = cellSize; el.style.height = cellSize; });
  }

  showing(game.createField());

  document.onkeydown = function choise(event) {
    switch (event.which) {
      case 37:
        showing(game.handleLeft());
        break;
      case 39:
        showing(game.handleRight());
        break;
      case 38:
        showing(game.handleUp());
        break;
      case 40:
        showing(game.handleDown());
        break;
      default:
      break;
    }
  } 

 





});
