$(document).ready(function () {
	let changeBlock = function() {
		let heightWithScrollBars = $(window).outerHeight(true);
		let widthWithScrollBars = $(window).outerWidth(true);
		$('body').removeClass();
		$('.middle').css('width', '').css('height', '');
		$('.span').css('width', '').css('height', '');
		$('.out').css('width', '').css('height', '');
		if (heightWithScrollBars < widthWithScrollBars ) {
			$('body').addClass('horisontal');
			let x = $('.middle').height();	
			$('.middle').css({'width': x});
			$('.out').css({ 'width': (widthWithScrollBars -heightWithScrollBars)/2 });									
		}				
		else {
			$('body').addClass('vertical');
			let x = $('.middle').width();			
			$('.middle').css({'height': x});
			$('.out').css({'height':(heightWithScrollBars - widthWithScrollBars)/2 });			
		}
	};
	$(window).resize(changeBlock);
	changeBlock();	
})