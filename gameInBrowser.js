const CurrentPage = require('./renderPage.js').RenderPage;

document.addEventListener('DOMContentLoaded', () => {
  const n = 4;
  const playingField = document.getElementById('playingField');
  const play = new CurrentPage(n, playingField);

  document.onkeydown = function choise(event) {
    play.userChoise(event.which);
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
    play.userChoise(swipedir);
  });
});
