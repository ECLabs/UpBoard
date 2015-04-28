var slide2 = function(){

    //timing control box
    var timing = {
        overlay:2000,
        slide2Fade:5000, //Fade after this delay
        slide2Transition:2000, //Transition takes this long
    };

    //first remove hidden class from slide elements
    $('#videoElement').removeClass('hidden');
    $('.box').removeClass('hidden');
    //set display to table. If set intially it overides the display hidden on box so it must be set here
    $('.box').css('display', 'table');
    //add webcamBlur animation so it starts on time
    $('#videoElement').css('animation-name', 'webcamBlur');
    //add overlay fade in animation
    $('.box').css('animation-name', 'overlay');
    //fade container back in
    $(".container").fadeIn("slow");

    setTimeout(function() {

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

    }, timing.overlay);



}
