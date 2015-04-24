var slide2 = function(){

    //timing control box
    var timing = {
        slide2Fade:10000, //Fade after this delay
        slide2Transition:2000, //Transition takes this long
    };

    //first remove hidden class from slide elements
    $('#videoElement').removeClass('hidden');
    $('.box').removeClass('hidden');
    //set display to table. If set intially it overides the display hidden on box so it must be set here
    $('.box').css('display', 'table');
    //add webcamBlur animation so it starts on time
    $('#videoElement').css('animation-name', 'webcamBlur');
    //fade container back in
    $(".container").fadeIn("slow");

    /*setTimeout(function() { //first Timeout

            $(".container").fadeOut("slow"); //first fade out the current container
            //wait & call the rest of the transition

            setTimeout(function() {

                    //hide previous
                    $("#videoElement").addClass("hidden");
                    $(".box").addClass("hidden");

                    slide3(); //Call the next slide function

            }, timing.slide2Transition);

    }, timing.slide2Fade);*/



}
