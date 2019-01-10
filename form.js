document.addEventListener('DOMContentLoaded', () => {
  const changeBlock = function () {
    const browserHeight = document.documentElement.clientHeight;
    const browserWidth = document.documentElement.clientWidth;

    const body = document.querySelector('body');

    let clas, x, y, z;

    body.classList.remove('horisontal', 'vertical');

    if (browserWidth > browserHeight) {
      clas = 'horisontal';
      x = `${browserHeight}px`;
      y = `${browserHeight}px`;
      z = `${(browserWidth - browserHeight) / 2}px`;
    } else {
      clas = 'vertical';
      x = `${browserWidth}px`;
      y = `${(browserHeight - browserWidth) / 2}px`;
      z = `${browserWidth}px`;
    }

    body.classList.add(clas);
    [].forEach.call(document.querySelectorAll('.middle'), (el) => { el.style.width = x; el.style.height = x; });
    [].forEach.call(document.querySelectorAll('.out'), (el) => { el.style.width = z; el.style.height = x; });
  };


  window.onresize = changeBlock;
  changeBlock();
});
