$( document ).ready(function() {

//all event times
var eventTiming = {
    slide1Time: 1000,
    slide1Transition:2000,
};

//Set up Webcam
(function() {
    var video = document.querySelector("#videoElement");
    console.log(video);

    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;

    if (navigator.getUserMedia) {
        navigator.getUserMedia({video: true, audio: true}, handleVideo, videoError);
    }

    function handleVideo(stream) {
        video.src = window.URL.createObjectURL(stream);
    }

    function videoError(e) {
        console.log('error, no webcam support found');
    }

})();


var slide1ToSlide2 = function(){
    //hide previous
    $(".movingBackground").addClass("hidden");
    $(".logo").addClass("hidden");
    //show current
    $('#videoElement').removeClass('hidden');
    $('.box').removeClass('hidden');
    //add webcamBlur animation so it starts on time
    $('#videoElement').css('animation-name', 'webcamBlur');
    //fade container back in
    $(".container").fadeIn("slow");
}


//timing
var transitionFunction = function(){
    //fade out container
    $(".container").fadeOut("slow");
    //wait & call the rest of the transition
    setTimeout(function() {
        slide1ToSlide2();
    }, eventTiming.slide1Transition);
}


//first Transition
setTimeout(function() {
    transitionFunction();
}, eventTiming.slide1Time);


});
