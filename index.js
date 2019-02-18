document.addEventListener('DOMContentLoaded', () => {
  const changeBlock = function changeBlock() {
    const browserHeight = document.documentElement.clientHeight;
    const browserWidth = document.documentElement.clientWidth;

    const body = document.querySelector('body');

    let position; let cellSize; let outHeight; let outWidth;

    body.classList.remove('horizontal', 'vertical');

    if (browserWidth > browserHeight) {
      position = 'horizontal';
      cellSize = `${browserHeight}px`;
      outHeight = `${browserHeight}px`;
      outWidth = `${(browserWidth - browserHeight) / 2}px`;
    } else {
      position = 'vertical';
      cellSize = `${browserWidth}px`;
      outHeight = `${(browserHeight - browserWidth) / 2}px`;
      outWidth = `${browserWidth}px`;
    }

    body.classList.add(position);
    [].forEach.call(document.querySelectorAll('.middle'), (el) => { el.style.width = cellSize; el.style.height = cellSize; });
    [].forEach.call(document.querySelectorAll('.out'), (el) => { el.style.width = outWidth; el.style.height = outHeight; });
  };

  window.onresize = changeBlock;
  changeBlock();
});
