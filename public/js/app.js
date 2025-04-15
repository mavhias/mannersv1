$(document).foundation();

$('#menu-open').on('click', function() {
	$('#main-menu').fadeIn();
})

$('#menu-close').on('click', function() {
	$('#main-menu').fadeOut();
})

if($('#slideshow').length) {
	$('#slideshow').slick({
		speed: 3000,
		fade: true,
		autoplay: true,
		prevArrow: '<i class="fa fa-angle-left"></i>',
		nextArrow: '<i class="fa fa-angle-right"></i>'
	})
}

if($('#newsletter-box').length) {
	$('#close-newsletter').on('click', function() {
		$('#newsletter-box').fadeOut();
	})
}


new WOW().init();