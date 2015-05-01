var slide1 = function() {

    //timing control box
    var timing = {
        slide1Fade : 10000, //fade starts after 1 second of slide time
        slide1Transition: 2000, //2 second transition
        //Total Slide 1 Time = slide1Fade + slide1Transition
    };


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
                    $(".movingBackground").addClass("hidden");
                    $(".logo").addClass("hidden");

                    slide2(); //Call the next slide function

            }, timing.slide1Transition);

    }, timing.slide1Fade);


}
