var logo = function(data, order, previous) {
    var current = 'slide' + (previous+1);
    //copy order array
    var copyArray = order.slice();
    copyArray.splice(0,1);

    $('.container').css('background-color', 'white'); //reset background color to white
    $(".movingBackground").removeClass("hidden");
    $(".logo").removeClass("hidden");
    $(".container").fadeIn("slow");

    setTimeout(function() { //first Timeout

            $(".container").fadeOut("slow"); //first fade out the current container
            //wait & call the rest of the transition

            $('#videoElement').animate({volume: 1}, 2000, "linear");
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
