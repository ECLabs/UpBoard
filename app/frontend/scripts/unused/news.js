var news = function(data, order, previous){
    var current = (previous+1); //find out what the current slide is in the array
    var copyArray = order.slice(); //make a copy of the array
    copyArray.splice(0,1); //remove the current slide from the copy of the order array so we can call copyArray[0] to call the next function easily later

    //first remove hidden class from slide elements
    $('.news').removeClass('hidden');

    if (data[current].transitions.entry === 'fade') {
        //fade container back in
        $(".container").fadeIn("slow");
    }

    $( ".logoImg" ).animate({
	    opacity: 1,
	    marginLeft: ($(".logoImg").parent().width() / 2) - ($(".logoImg").width() / 2)
	  }, 400, function() {

	});

    setTimeout(function() { //Fade Container

            $(".container").fadeOut("slow"); //first fade out the current container
            //wait & call the rest of the transition

            setTimeout(function() { //transition timing

                    $('.news').addClass('hidden');
                    if (copyArray.length!==0) {
                        window[copyArray[0]](data, copyArray, previous+1);
                    }

            }, data[current].timing.transitionTime);

    }, data[current].timing.slideTime);

}

$(".innerBottom").fadeIn( "slow", function() {
    // Animation complete
});
