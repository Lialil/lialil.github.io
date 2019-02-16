document.addEventListener('DOMContentLoaded', () => {
  const n = 5;
  const game = new Game2048(n);
  const cellWidth = `${8}%`;

  const playingField = document.getElementById('playingField');
  const showing = function showing(field) {
    while (playingField.firstChild) {
      playingField.removeChild(playingField.firstChild);
    }
    let t = '';
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (field[i][j] === 0) {
          t += "<div class = 'cell'></div>";
        } else {
          t += `<div class = 'cell'>${field[i][j]}</div>`;
        }
      }
    }
    playingField.innerHTML += t;
    [].forEach.call(document.querySelectorAll('.cell'), (el) => { el.style.width = cellWidth; el.style.height = cellWidth; });
  };
  showing(game.createField());

  document.getElementById('up').onclick = function up() {
    showing(game.handleUp());
  };
  document.getElementById('left').onclick = function left() {
    showing(game.handleLeft());
  };
  document.getElementById('right').onclick = function right() {
    showing(game.handleRight());
  };
  document.getElementById('down').onclick = function down() {
    showing(game.handleDown());
  };
});
