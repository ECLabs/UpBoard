var liveVideoOverlay = function(data, order, previous){
    var current = (previous+1);
    var copyArray = order.slice();
    copyArray.splice(0,1);

    //set slide content and color
    $('.box p').html(data[current].content.overlay);
    //default color #FAFCFA
    if( data[current].content.overlayColor ){
        $('.box').css('color', data[current].content.overlayColor)
    };

    $('.missionStatement video').attr('src', 'http://www.w3schools.com/HTML/mov_bbb.mp4');
    $('.missionStatement video').get(0).play()

    //first remove hidden class from slide elements
    $('.box').removeClass('hidden');
    $('.missionStatement video').removeClass('noAnimate');
    $('.box').removeClass('noAnimate');
    $('.missionStatement').removeClass('hidden');

    //add webcamBlur animation so it starts on time
    $('.missionStatement video').css('animation-name', 'webcamBlur');
    //add overlay fade in animation
    $('.box').css('visibility', "visible");
    $('.box').css('animation-name', 'overlay');

    if (data[current].transitions.entry === 'fade') {
        //fade container back in
        $(".container").fadeIn("slow");
    }
    $('.missionStatement video').animate({volume: 1}, 2000, "linear");

    setTimeout(function() {
        $('.container').css('background-color', '#1B1B1C');//without making the background dark there is a bright halo around the edge of the container from the blur
        $('.missionStatement video').animate({volume: 0}, 5000,"linear");//This doesn't work super well but it's the only volume method I've found

            setTimeout(function() { //Fade Container

                    $(".container").fadeOut("slow"); //first fade out the current container
                    //wait & call the rest of the transition

                    setTimeout(function() {

                            //hide previous

                            $('.box').css('opacity', 0);
                            $('.missionStatement video').addClass('noAnimate');
                            $('.box').addClass('noAnimate');
                            $('.box').css('visibility', "hidden");
                            $('.box').addClass("hidden");
                            $(".missionStatement").addClass("hidden");

                            if (copyArray.length!==0) {
                                window[copyArray[0]](data, copyArray, previous+1);
                            }

                    }, data[current].timing.transitionTime);

            }, data[current].timing.slideTime);

    }, data[current].timing.audioFadeTime);

}
