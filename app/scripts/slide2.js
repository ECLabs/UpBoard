var slide2 = function(){

    //timing control box
    var timing = {
        slide2Fade:9000, //Fade after this delay
        slide2Transition:2000, //Transition takes this long
        slide2Audio: 2000, //Wait 2 Seconds so the webcam Volume fades synchronously with the blur and grayscale
    };

    //first remove hidden class from slide elements
    $('#videoElement').removeClass('hidden');
    $('.box').removeClass('hidden');

    //add webcamBlur animation so it starts on time
    $('#videoElement').css('animation-name', 'webcamBlur');
    //add overlay fade in animation
    $('.box').css('animation-name', 'overlay');
    //fade container back in
    $(".container").fadeIn("slow");

    setTimeout(function() {

        $('#videoElement').animate({volume: 0}, 5000,"linear");

            setTimeout(function() { //first Timeout

                    $(".container").fadeOut("slow"); //first fade out the current container
                    //wait & call the rest of the transition

                    setTimeout(function() {

                            //hide previous
                            $('.box').css('display', 'none');
                            $("#videoElement").addClass("hidden");
                            $(".box").addClass("hidden");
                            $('.container').css('background-color', 'grey');

                            slide3(); //Call the next slide function

                    }, timing.slide2Transition);

            }, timing.slide2Fade);

    }, timing.slide2Audio);



}
