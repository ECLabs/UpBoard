var weather = function(data, order, previous){
    var current = (previous+1); //find out what the current slide is in the array
    var copyArray = order.slice(); //make a copy of the array
    copyArray.splice(0,1); //remove the current slide from the copy of the order array so we can call copyArray[0] to call the next function easily later


    //default color #FAFCFA
    if( data[current].content.overlayColor ){
        $('.box').css('color', data[current].content.overlayColor)
    };

    //first remove hidden class from slide elements
    $('.weather').removeClass('hidden');
    $('.weather').css('visibility', "visible");
    $('#videoElement').addClass('noAnimate');
    $('#videoElement').removeClass('hidden');

    if (data[current].transitions.entry === 'fade') {
        //fade container back in
        $(".container").fadeIn("slow");
    }



            setTimeout(function() { //Fade Container

                    $(".container").fadeOut("slow"); //first fade out the current container
                    //wait & call the rest of the transition

                    setTimeout(function() { //transition timing

                            $("#videoElement").addClass("hidden");//set video background to hidden so it doesn't interfere with anything
                            $('.weather').css('visibility', "hidden");
                            $('#videoElement').removeClass('noAnimate');
                            if (order.length!==0) {
                                window[copyArray[0]](data, copyArray, previous+1);
                            }

                    }, data[current].timing.transitionTime);

            }, data[current].timing.slideTime);

}
