//TODO: Need to make this a dynamic number of sections rather than hardcoding

var bioPanels = function(data, order, previous){

    // copy of JSON information [{"name":"Jamil Evans","bio":"As President of Evans & Chambers Technology, Jamil Evans is charged with maintaining good relationships with stakeholders in the Federal Government and Intelligence Community. He manages the technical director of the company to ensure that EC's core competencies and innovations are aligned with our customer base. Jamil's uncommon mixture of hard-core technical expertise and strategic relationship management skills drive the company's winning results. Jamil is an expert in service oriented architectures (SOA), secure web service standards definition, and the design and implementation of mission-critical enterprise services and systems. Prior to founding Evans & Chambers Technology, Jamil served as a senior software engineer at Booz Allen Hamilton, providing vendor analysis and software development services to an Intelligence Community customer."},{"name":"Mary Sabatino","bio":"As a Program Manager for Evans & Chambers Technology, Mary Sabatino plays a key role in transforming customer requirements into application design and managing the resources needed to complete projects. She also works closely with development teams to keep the project within scope and to meet production and budget targets. She supports the entire Software Development Life Cycle, including requirements definition, functional design, development, system testing, documentation, training, implementation, maintenance, and customer support. Prior to working with EC, Mary managed projects with L-3 Communications and CACI to support complex information technology projects.  Mary finds it very rewarding to watch a design “come to life” in the form of a working application and her customers praise her dedication, thoroughness, and ability to go above and beyond to ensure that her projects are managed and executed efficiently."},{"name":"Ryan Gross","bio":"Ryan Gross joined Evans & Chambers Technology (EC) in November 2013. Before joining the team, he worked on a commercial project for EC, developing a workflow management tool built on Java using the Grails framework and utilizing a MySQL database. His previous experience in Java development and web development prepared him for his new role at EC as a Software Developer / Engineer I. Ryan enjoys the challenge of developing and enjoys the opportunity to work on projects that provide a positive impact."},{"name":"Vik David","bio":"Vik David is a Software Engineer for Evans & Chambers Technology's and has been working with EC since September 2010. Vik takes a lot of satisfaction in creating something that will help his clients in their jobs. His focus is on front-end technologies and he recently re-wrote and improved a widely-used dashboard report for his client."}]
    var current = (previous+1);
    var copyArray = order.slice();
    copyArray.splice(0,1);

    //set slide content
    for (var i=0; i<6; i++){
        var stringifiedData = JSON.stringify(data[current].content.content),
        content = JSON.parse(stringifiedData),
        fullName = content[i].name,
        firstName = content[i].name.split(" ")[0];
        $('#section' + (i+1) + ' .bl-box img').attr('src', content[i].pic);
        $('#section' + (i+1) + ' .bl-box h2').text(firstName);
        $('#section' + (i+1) + ' .bl-content h2').text(fullName);
        $('#section' + (i+1) + ' .bl-content p').text(content[i].bio);
    }

    //choose transition
    if (data[current].transitions.entry === 'fade') {
        $('#bl-main').removeClass('hidden');
        $(".container").fadeIn("slow");
        $('.container').css('background-color', 'grey');
    }

    //Show underline
    $('#section1 .bl-box .bl-underline').removeClass('hidden');

    //work in progress
    var $el = $( '#bl-main' ),
		$sections = $el.children( 'section' ),
        $section1 = $('#section1');
        $section2 = $('#section2');
        $section3 = $('#section3');
        $section4 = $('#section4');
        $section5 = $('#section5');
        $section6 = $('#section6');
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

                        $('#section1 .bl-box .bl-underline').addClass('hidden');
                        $('#section2 .bl-box .bl-underline').removeClass('hidden');

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

                                        $('#section2 .bl-box .bl-underline').addClass('hidden');
                                        $('#section3 .bl-box .bl-underline').removeClass('hidden');

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

                                                        $('#section3 .bl-box .bl-underline').addClass('hidden');
                                                        $('#section4 .bl-box .bl-underline').removeClass('hidden');

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

                                                                        $('#section4 .bl-box .bl-underline').addClass('hidden');
                                                                        $('#section5 .bl-box .bl-underline').removeClass('hidden');

                                                                        $section4.data( 'open', false ).removeClass( 'bl-expand' ).on( transEndEventName, function( event ) {
                                                                            $( "#section4" ).off( transEndEventName ).removeClass( 'bl-expand-top' );
                                                                        } );

                                                                        if( !supportTransitions ) {
                                                                            $section1.removeClass( 'bl-expand-top' );
                                                                        }

                                                                        $el.removeClass( 'bl-expand-item' );
                                                                        
                                                                        //Slide5 Open
                                                                        setTimeout(function() {

                                                                            $section5.data( 'open', true ).addClass( 'bl-expand bl-expand-top' );
                                                                            $el.addClass( 'bl-expand-item' );

                                                                                //Slide5 Close
                                                                                setTimeout(function() {

                                                                                        $('#section5 .bl-box .bl-underline').addClass('hidden');
                                                                                        $('#section6 .bl-box .bl-underline').removeClass('hidden');

                                                                                        $section5.data( 'open', false ).removeClass( 'bl-expand' ).on( transEndEventName, function( event ) {
                                                                                            $( "#section5" ).off( transEndEventName ).removeClass( 'bl-expand-top' );
                                                                                        } );

                                                                                        if( !supportTransitions ) {
                                                                                            $section1.removeClass( 'bl-expand-top' );
                                                                                        }

                                                                                        $el.removeClass( 'bl-expand-item' );
                                                                                        
                                                                                        //Slide6 Open
                                                                                        setTimeout(function() {

                                                                                            $section6.data( 'open', true ).addClass( 'bl-expand bl-expand-top' );
                                                                                            $el.addClass( 'bl-expand-item' );

                                                                                                //Slide6 Close
                                                                                                setTimeout(function() {

                                                                                                        $('#section6 .bl-box .bl-underline').removeClass('hidden');

                                                                                                        $section6.data( 'open', false ).removeClass( 'bl-expand' ).on( transEndEventName, function( event ) {
                                                                                                            $( "#section6" ).off( transEndEventName ).removeClass( 'bl-expand-top' );
                                                                                                        } );

                                                                                                        if( !supportTransitions ) {
                                                                                                            $section1.removeClass( 'bl-expand-top' );
                                                                                                        }

                                                                                                        $el.removeClass( 'bl-expand-item' );
                                                                                                        $(".container").fadeOut("slow"); //first fade out the current container
                                                                                                        
                                                                                                        setTimeout(function() {


                                                                                                                $('#bl-main').addClass('hidden');

                                                                                                                if (copyArray.length!==0) {
                                                                                                                    window[copyArray[0]](data, copyArray, previous+1); //Call the next slide function
                                                                                                                }


                                                                                                        }, data[current].timing.transitionTime);

                                                                                                }, data[current].timing.sectionTime);

                                                                                        }, data[current].timing.openSection);

                                                                                }, data[current].timing.sectionTime);

                                                                        }, data[current].timing.openSection);

                                                                }, data[current].timing.sectionTime);

                                                        }, data[current].timing.openSection);

                                                }, data[current].timing.sectionTime);

                                        }, data[current].timing.openSection);

                                }, data[current].timing.sectionTime);

                        }, data[current].timing.openSection);

                }, data[current].timing.sectionTime);

        }, data[current].timing.openFirstSection);

}