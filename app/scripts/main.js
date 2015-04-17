$( document ).ready(function() {

//Set up Webcam
(function() {
    var video = document.querySelector("#videoElement");
    console.log(video);

    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;

    if (navigator.getUserMedia) {
        navigator.getUserMedia({video: true}, handleVideo, videoError);
    }

    function handleVideo(stream) {
        video.src = window.URL.createObjectURL(stream);
    }

    function videoError(e) {
        console.log('error, no webcam support found');
    }

})();

//timing
var transitionFunction = function(){
    //fade out container
    $(".container").fadeOut("slow");
    //wait 2 seconds
    setTimeout(function() {
        //hide previous
        $(".movingBackground").addClass("hidden");
        $(".logo").addClass("hidden");
        //show current
        $('#videoElement').removeClass('hidden');
        $('.box').removeClass('hidden');
        //fade container back in
        $(".container").fadeIn("slow");
    }, 2000);
}


//first Transition
setTimeout(function() {
    transitionFunction();
    //set value to desired transition speed
}, 1000);


});
