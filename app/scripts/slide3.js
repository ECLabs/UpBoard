var slide3 = function(){

    var timing = {
        openSection1: 3000, //Open the first section after this amount of time showing all
        openSection: 1000, //open section after returning to layout
        closeSection: 3000, //close section after this delay
        fadeContainer: 1000, //Final Fade before restart
    };

    $('#bl-main').removeClass('hidden');
    $(".container").fadeIn("slow");
    $('.container').css('background-color', 'grey');

    //work in progress
    var $el = $( '#bl-main' ),
		$sections = $el.children( 'section' ),
        $section1 = $('#section1');
        $section2 = $('#section2');
        $section3 = $('#section3');
        $section4 = $('#section4');
		// works section
		$sectionWork = $( '#bl-work-section' ),
		// work items
		$workItems = $( '#bl-work-items > li' ),
		// work panels
		$workPanelsContainer = $( '#bl-panel-work-items' ),
		$workPanels = $workPanelsContainer.children( 'div' ),
		totalWorkPanels = $workPanels.length,
		// navigating the work panels
		$nextWorkItem = $workPanelsContainer.find( 'nav > span.bl-next-work' ),
		// if currently navigating the work items
		isAnimating = false,
		// close work panel trigger
		$closeWorkItem = $workPanelsContainer.find( 'nav > span.bl-icon-close' ),
		transEndEventNames = {
			'WebkitTransition' : 'webkitTransitionEnd',
			'MozTransition' : 'transitionend',
			'OTransition' : 'oTransitionEnd',
			'msTransition' : 'MSTransitionEnd',
			'transition' : 'transitionend'
		},
		// transition end event name
		transEndEventName = transEndEventNames[ Modernizr.prefixed( 'transition' ) ],
		// support css transitions
		supportTransitions = Modernizr.csstransitions;

        //Slide1 Open
        setTimeout(function() {

            $section1.data( 'open', true ).addClass( 'bl-expand bl-expand-top' );
            $el.addClass( 'bl-expand-item' );

                //Slide1 Close
                setTimeout(function() {

                        $section1.data( 'open', false ).removeClass( 'bl-expand' ).on( transEndEventName, function( event ) {
                            $( "#section1" ).off( transEndEventName ).removeClass( 'bl-expand-top' );
                        } );

                        if( !supportTransitions ) {
                            $section1.removeClass( 'bl-expand-top' );
                        }

                        $el.removeClass( 'bl-expand-item' );

                        //Slide2 Open
                        setTimeout(function() {

                            $section2.data( 'open', true ).addClass( 'bl-expand bl-expand-top' );
                            $el.addClass( 'bl-expand-item' );

                                //Slide2 Close
                                setTimeout(function() {

                                        $section2.data( 'open', false ).removeClass( 'bl-expand' ).on( transEndEventName, function( event ) {
                                            $( "#section2" ).off( transEndEventName ).removeClass( 'bl-expand-top' );
                                        } );

                                        if( !supportTransitions ) {
                                            $section2.removeClass( 'bl-expand-top' );
                                        }

                                        $el.removeClass( 'bl-expand-item' );

                                        //Slide3 Open
                                        setTimeout(function() {

                                            $section3.data( 'open', true ).addClass( 'bl-expand bl-expand-top' );
                                            $el.addClass( 'bl-expand-item' );

                                                //Slide3 Close
                                                setTimeout(function() {

                                                        $section3.data( 'open', false ).removeClass( 'bl-expand' ).on( transEndEventName, function( event ) {
                                                            $( "#section3" ).off( transEndEventName ).removeClass( 'bl-expand-top' );
                                                        } );

                                                        if( !supportTransitions ) {
                                                            $section1.removeClass( 'bl-expand-top' );
                                                        }

                                                        $el.removeClass( 'bl-expand-item' );

                                                        //Slide4 Open
                                                        setTimeout(function() {

                                                            $section4.data( 'open', true ).addClass( 'bl-expand bl-expand-top' );
                                                            $el.addClass( 'bl-expand-item' );

                                                                //Slide4 Close
                                                                setTimeout(function() {

                                                                        $section4.data( 'open', false ).removeClass( 'bl-expand' ).on( transEndEventName, function( event ) {
                                                                            $( "#section4" ).off( transEndEventName ).removeClass( 'bl-expand-top' );
                                                                        } );

                                                                        if( !supportTransitions ) {
                                                                            $section1.removeClass( 'bl-expand-top' );
                                                                        }

                                                                        $el.removeClass( 'bl-expand-item' );

                                                                        setTimeout(function() {

                                                                                $(".container").fadeOut("slow"); //first fade out the current container
                                                                                $('#bl-main').addClass('hidden');
                                                                                $('.container').css('background-color', 'white');

                                                                        }, timing.fadeContainer);


                                                                }, timing.closeSection);

                                                        }, timing.openSection);


                                                }, timing.closeSection);

                                        }, timing.openSection);



                                }, timing.closeSection);

                        }, timing.openSection);

                }, timing.closeSection);

        }, timing.openSection1);




}
