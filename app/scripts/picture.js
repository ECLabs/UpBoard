var pictureArrayIndex = 0;

var picture = function(data, order, previous){
    var current = (previous+1); //find out what the current slide is in the array
    var copyArray = order.slice(); //make a copy of the array
    copyArray.splice(0,1); //remove the current slide from the copy of the order array so we can call copyArray[0] to call the next function easily later

    $('.picture img').attr('src', media["fullScreen"][pictureArrayIndex].src);
    incrementPictureArrayIndex();

    //insert caption
    $('.picture p').html(data[current].content.caption);

    //first remove hidden class from slide elements
    $('.picture').removeClass('hidden');

    if (data[current].transitions.entry === 'fade') {
        //fade container back in
        $(".container").fadeIn("slow");
    }

    setTimeout(function() { //Fade Container

            $(".container").fadeOut("slow"); //first fade out the current container
            //wait & call the rest of the transition

            setTimeout(function() { //transition timing

                    $('.picture').addClass('hidden');
                    if (copyArray.length!==0) {
                        window[copyArray[0]](data, copyArray, previous+1);
                    }

            }, data[current].timing.transitionTime);

    }, data[current].timing.slideTime);

}

function incrementPictureArrayIndex(){
    if(pictureArrayIndex == (media["fullScreen"].length-1))
    {
        pictureArrayIndex = 0;
    }else{
        pictureArrayIndex++;
    }
}