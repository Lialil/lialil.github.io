<<<<<<< HEAD
$(document).ready(function () {
	var changeBlock = function() {
		var heightWithScrollBars = $(window).height();
		var widthWithScrollBars = $(window).width();
		if (heightWithScrollBars < widthWithScrollBars ) {
			var x2 = $('.pole').height();
			$('.pole').html("<h1>Hi!</h1>");
			
			$('.pole').css({'width': x2 + 'px'});
			$('.block').css({'width': (widthWithScrollBars -heightWithScrollBars)/2 + 'px'});						
		}		
		else {
			var x2 = $('.block1').width();
			$('.pole').html("<h1>Hi</h1>");
			$('.pole').css({'height': x2 + 'px'});
		}
	};

	$(window).resize(changeBlock);

	changeBlock();	
})
=======
$(document).ready(function () {
	var changeBlock = function() {
		var heightWithScrollBars = $(window).height();
		var widthWithScrollBars = $(window).width();
		if (heightWithScrollBars < widthWithScrollBars ) {
			var x2 = $('.pole').height();
			$('.pole').html("<h1>Hi!</h1>");
			
			$('.pole').css({'width': x2 + 'px'});
			$('.block').css({'width': (widthWithScrollBars -heightWithScrollBars)/2 + 'px'});						
		}		
		else {
			var x2 = $('.block1').width();
			$('.pole').html("<h1>Hi</h1>");
			$('.pole').css({'height': x2 + 'px'});
		}
	};

	$(window).resize(changeBlock);

	changeBlock();	
})
>>>>>>> 2000a728995fb6f8af680a61a52b0e74afd5ab5d
