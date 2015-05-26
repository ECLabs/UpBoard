var liveVideoOverlay = function(data, order){

    order.splice(0,1);

    //first remove hidden class from slide elements
    $('#videoElement').removeClass('hidden');
    $('.box').removeClass('hidden');

    //add webcamBlur animation so it starts on time
    $('#videoElement').css('animation-name', 'webcamBlur');
    //add overlay fade in animation
    $('.box').css('visibility', "visible");
    $('.box').css('animation-name', 'overlay');
    //fade container back in
    $(".container").fadeIn("slow");


    setTimeout(function() {
        $('.container').css('background-color', '#1B1B1C');//without making the background dark there is a bright halo around the edge of the container from the blur
        $('#videoElement').animate({volume: 0}, 5000,"linear");//This doesn't work super well but it's the only volume method I've found

            setTimeout(function() { //Fade Container



                    $(".container").fadeOut("slow"); //first fade out the current container
                    //wait & call the rest of the transition

                    setTimeout(function() {

                            //hide previous

                            $("#videoElement").addClass("hidden");
                            $('.box').css('opacity', 0);
                            $('.box').css('visibility', "hidden");
                            $(".box").addClass("hidden");

                            if (order.length!==0) {
                                window[order[0]](data, order); //Call the next slide function
                            }
                            
                    }, data.slide2.timing.transitionTime);

            }, data.slide2.timing.slideTime);

    }, data.slide2.timing.audioFadeTime);

}
