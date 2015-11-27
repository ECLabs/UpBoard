var staticVideoOverlay = function(data, order, previous){
    var current = (previous+1);
    var copyArray = order.slice();
    copyArray.splice(0,1);

    //set slide content and color
    $('.box p').html(data[current].content.overlay);
    //default color #FAFCFA
    if( data[current].content.overlayColor ){
        $('.box').css('color', data[current].content.overlayColor)
    };

    $('.missionStatement video').attr('src', media["staticVideoOverlay"].src);

    $('.missionStatement video').get(0).play()

    //first remove hidden class from slide elements
    $('.missionStatement').removeClass('hidden');

    //add webcamBlur animation so it starts on time
    $('.missionStatement video').css('animation-name', 'webcamBlur');    
    $('.missionStatement video').css('animation-duration', data[current].timing.slideTime/1000+'s');    
    //add overlay fade in animation
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
                            $(".missionStatement").addClass("hidden");

                            //Remove and add video to kill animations
                            $('.missionStatement video').remove();
                            $('.missionStatement').prepend("<video></video>");

                            $('.box').remove();
                            $('.missionStatement').append('<div class="box">'+
                                                              '<p></p>'+
                                                              '<div class="boxBottomLeft"></div>'+
                                                              '<img id="star"></img>'+
                                                              '<div class="boxBottomRight"></div>'+                
                                                          '</div>');

                            if (copyArray.length!==0) {
                                window[copyArray[0]](data, copyArray, previous+1);
                            }

                    }, data[current].timing.transitionTime);

            }, data[current].timing.slideTime);

    }, data[current].timing.audioFadeTime);

}
