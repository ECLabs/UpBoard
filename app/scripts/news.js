$( ".logoImg" ).animate({
    opacity: 1,
    marginLeft: ($(".logoImg").parent().width() / 2) - ($(".logoImg").width() / 2)
  }, 400, function() {

});
$(".innerBottom").fadeIn( "slow", function() {
    // Animation complete
});
