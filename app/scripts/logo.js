var logo = function(data, order) {


        order.splice(0,1);
        console.log(order);
        //console.log(order);
        //console.log(window.order[0]);

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

                        //console.log(window[order[0]]);
                        if (order.length!==0) {
                            window[order[0]](data, order); //Call the next slide function
                        }

                }, data.slide1.timing.transitionTime);

        }, data.slide1.timing.slideTime);

}
