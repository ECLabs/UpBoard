var slide1 = function(data) {

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

                        slide2(data); //Call the next slide function

                }, data.slide1.timing.transitionTime);

        }, data.slide1.timing.slideTime);

}
