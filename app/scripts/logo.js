var logo = function(data, order, previous) {
    var current = (previous+1);
    //copy order array
    var copyArray = order.slice();
    copyArray.splice(0,1);

    //reset background color to white
    $('.container').css('background-color', 'white');

    if (data[current].transitions.entry === 'fade') {
        $(".movingBackground").removeClass("hidden");
        $(".logo").removeClass("hidden");
        $(".container").fadeIn("slow");

    }

    setTimeout(function() { //first Timeout

            $(".container").fadeOut("slow"); //first fade out the current container
            //wait & call the rest of the transition


            setTimeout(function() {

                    //hide previous
                    $('.movingBackground').addClass("hidden");
                    $('.logo').addClass("hidden");

                    //check if this is the end if not call next slide
                    if (order.length!==0) {
                        window[copyArray[0]](data, copyArray, previous+1);
                    }

            }, data[current].timing.transitionTime);

    }, data[current].timing.slideTime);

}
