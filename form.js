document.addEventListener('DOMContentLoaded', () => {
  const changeBlock = function () {
    const browserHeight = document.documentElement.clientHeight;
    const browserWidth = document.documentElement.clientWidth;

    const body = document.querySelector('body');

    let position, x, y, z;

    body.classList.remove('horisontal', 'vertical');

    if (browserWidth > browserHeight) {
      position = 'horisontal';
      height = `${browserHeight}px`;
      width = `${browserHeight}px`;
      changedWidth = `${(browserWidth - browserHeight) / 2}px`;
    } else {
      position = 'vertical';
      height = `${browserWidth}px`;
      width = `${(browserHeight - browserWidth) / 2}px`;
      changedWidth = `${browserWidth}px`;
    }

    body.classList.add(position);
    [].forEach.call(document.querySelectorAll('.middle'), (el) => { el.style.width = height; el.style.height = height; });
    [].forEach.call(document.querySelectorAll('.out'), (el) => { el.style.width = changedWidth; el.style.height =width; });
  };


  window.onresize = changeBlock;
  changeBlock();
});
