$(document).ready(function () {
	var changeBlock = function() {
		var heightWithScrollBars = $(window).outerHeight(true);
		var widthWithScrollBars = $(window).outerWidth(true);
		console.log(heightWithScrollBars, widthWithScrollBars);
		if (heightWithScrollBars < widthWithScrollBars ) {
			$('body').removeClass().addClass('horisontal');
			var x2 = $('.middle').height();						
			$('.middle').css({'width': x2 + 'px'});
			$('.out').css('width','').css({'width': (widthWithScrollBars -heightWithScrollBars)/2 + 'px'});
			$('.out').css('height','');							
		}		
		else {
			$('body').removeClass().addClass('vertical');
			$('.middle').css('width', '');
			var x1 = $('.middle').width();
			$('.middle').css('height','').css({'height': x1 + 'px'});
			$('.out').css('width', '');	
			$('.out').css({'height':(heightWithScrollBars - widthWithScrollBars)/2});		
		}
	};
	$(window).resize(changeBlock);
	changeBlock();	
})