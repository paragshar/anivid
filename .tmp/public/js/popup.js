
/*for displaying and closing sing in pop up*/
$(document).ready(function() {

	$('.signin-link-li').click(function(e){
		e.stopPropagation();
	  	$('.signin-popup-display').fadeToggle(200);
	  	var width=window.innerWidth
	  	if(width<=768)
	    	$('.menu').hide();
	});

	$(document).click(function(e){
		var container = $(".signin-popup-display");    
		if (container.has(e.target).length == 0){
 			container.fadeOut('200');
		}
	});


$(".signin-popup-close").click(function(){
	// console.log("close button working?");
	$('.signin-popup-display').fadeOut(200);
});

/* signup popup script*/


	$('.signup-link-li').click(function(e){
		e.stopPropagation();
	  	$('.signup-popup-display').fadeToggle(200);
	  	var width=window.innerWidth
	  	if(width<=768)
	    	$('.menu').hide();
	});

	$(document).click(function(e){
		var container = $(".signup-popup-display");    
		if (container.has(e.target).length == 0){
 			container.fadeOut('200');
		}
	});

	$(".signup-popup-close").click(function(){
		// console.log("close button working?");
		$('.signup-popup-display').fadeOut(200);
	});


});