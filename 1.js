$(document).ready(function() {
	let changeBlock = function() {
		const $w = $(window),
			  $out = $('.out'),
			  $body = $('body'),
			  $middle = $('.middle');

		const widthWithScrollBars = $w.outerWidth(true),
			  heightWithScrollBars = $w.outerHeight(true);

		$body.removeClass();

		if (heightWithScrollBars < widthWithScrollBars) {
			$body.addClass('horisontal');
			let x = $middle.height();
			$middle.css({'width': x, 'height': ''});
			$out.css({'width': (widthWithScrollBars - heightWithScrollBars) / 2, 'height': ''});
		}
		else {
			$body.addClass('vertical');
			let x = $middle.width();
			$middle.css({'height': x, 'width': ''});
			$out.css({'height': (heightWithScrollBars - widthWithScrollBars) / 2, 'width': ''});
		}
	};
	
	$(window).resize(changeBlock);
	changeBlock();
})
