document.addEventListener('DOMContentLoaded', () => {
  const n = 4;
  const cellSize = `${(100 - n * 2) / n}%`;
  const fontSize = 10 - n;

  // const game = [[2,4,8,16],[32,64,128,256],[512,1024,2048,4096],[0,0,0,0,]];

  const game = new Game2048(n);


  const playingField = document.getElementById('playingField');
  const showing = function showing(field) {
    while (playingField.firstChild) {
      playingField.removeChild(playingField.firstChild);
    }
    field.forEach((row) => {
      row.forEach((cell) => {
        const div = document.createElement('div');
        div.className = `cell cell-${cell}`;
        if (cell !== 0) {
          div.innerHTML = cell;
        }
        playingField.appendChild(div);
      });
    });
    [].forEach.call(document.querySelectorAll('.cell'), (el) => { el.style.width = cellSize; el.style.height = cellSize; });
  };
  // showing(game);

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
  };


  function swipedetect(callback) {
    const touchsurface = playingField;
    let swipedir;
    let startX;
    let startY;
    let distX;
    let distY;
    const threshold = 150;
    const restraint = 100;
    const allowedTime = 300;
    let elapsedTime;
    let startTime;
    const handleswipe = callback || function (swipedir) {};

    touchsurface.addEventListener('touchstart', (e) => {
      const touchobj = e.changedTouches[0];
      swipedir = 'none';
      dist = 0;
      startX = touchobj.pageX;
      startY = touchobj.pageY;
      startTime = new Date().getTime();
      e.preventDefault();
    }, false);

    touchsurface.addEventListener('touchmove', (e) => {
      e.preventDefault();
    }, false);

    touchsurface.addEventListener('touchend', (e) => {
      const touchobj = e.changedTouches[0];
      distX = touchobj.pageX - startX;
      distY = touchobj.pageY - startY;
      elapsedTime = new Date().getTime() - startTime;
      if (elapsedTime <= allowedTime) {
        if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint) {
          swipedir = (distX < 0) ? 'left' : 'right';
        } else if (Math.abs(distY) >= threshold && Math.abs(distX) <= restraint) {
          swipedir = (distY < 0) ? 'up' : 'down';
        }
      }
      handleswipe(swipedir);
      e.preventDefault();
    }, false);
  }


  swipedetect((swipedir) => {
    switch (swipedir) {
      case 'left':
        showing(game.handleLeft());
        break;
      case 'right':
        showing(game.handleRight());
        break;
      case 'up':
        showing(game.handleUp());
        break;
      case 'down':
        showing(game.handleDown());
        break;
      default:
        break; 
    }
  });
});
