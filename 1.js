$(document).ready(() => {
  const changeBlock = function () {
    const $w = $(window);


    const $out = $('.out');


    const $body = $('body');


    const $middle = $('.middle');

    const widthWithScrollBars = $w.outerWidth(true);


    const heightWithScrollBars = $w.outerHeight(true);

    $body.removeClass();

    if (heightWithScrollBars < widthWithScrollBars) {
      $body.addClass('horisontal');
      const x = $middle.height();
      $middle.css({ width: x, height: '' });
      $out.css({ width: (widthWithScrollBars - heightWithScrollBars) / 2, height: '' });
    } else {
      $body.addClass('vertical');
      const x = $middle.width();
      $middle.css({ height: x, width: '' });
      $out.css({ height: (heightWithScrollBars - widthWithScrollBars) / 2, width: '' });
    }
  };

  $(window).resize(changeBlock);
  changeBlock();

});


