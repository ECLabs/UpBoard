# UpBoard
Digital Signage for Corporations

##Getting Started:

Uses Grunt & Bower
You can use 'grunt serve' for testing

all data for the slideshow is stored at https://boiling-heat-9947.firebaseio.com/
this can be easily updated by changing the URL in index.html

to add a slide make a new node with the number the slide will be (slides added directly to firebase can only be added at the end without deleting and re-writing the previous slides). If you wish to add many new slides I suggest uncommenting and using the function I provide in index.html. If you wish to add a slide manually to firebase then be sure to follow the format of the slide type you wish. These are listed below

slides will be shown in the order in which they appear in the database. not their number, however the number is important and must match the order they appear in the database.

a slide type must then be specified. The types are logo, liveVideoOverlay, fourPanel, and weather.
each of these types has a specific set of parameters to be filled out.

with the exception of the logo slide & weather the slide must also have a timing,transitions, and content field.

##IMPORTANT

Because each slide must call the next slide function from within itself, each slide function will not complete until the *final* slide function completes. This means if you have a lot of slides in the show then you will use a lot of memory. **You have been warned**

##Logo slide data structure:

    1: {
          type: "logo",
          transitions: {
              entry: 'fade', //currently fade is the only type supported
              exit: 'fade' //currently fade is the only type supported
          },
          timing: {
              slideTime:10000 , //Time spent on the slide
              transitionTime: 2000, //Total Transition fade time
          }
    },

##liveVideoOverlay data structure:

    2: {
        type: "liveVideoOverlay",
        transitions: {
            entry: 'fade', //currently fade is the only type supported
            exit: 'fade' //currently fade is the only type supported
        },
        timing: {
            slideTime: 10000, //Time spent on slide
            transitionTime: 2000, //Total transition time
            audioFadeTime: 2000, //Time between slide fading in and audio beginning to fade
        },
        content: {
            overlay: 'Customer-driven software <br/> development for government <br/> and commercial enterprises.', //Note this section takes html, it may be necessary to include the <br/> tags to get the text spacing correct

            overlayColor: '#FAFCFA',
        }
    },

##fourPanel Slide data structure:

    3: {
        type: "fourPanel",
        transitions: {
            entry: 'fade', //currently fade is the only type supported
            exit: 'fade' //currently fade is the only type supported
        },
        timing: {
            openFirstSection: 3000, //Time between the fourpanel fading in and opening the first section
            openSection: 1000, //Time between previous closing and next opening
            sectionTime: 20000, //Time spent on each slide
            transitionTime:1000, //Time to fade the page away
        },
        content: {
            content: array of json objects format shown below
        }
    },


###fourPanel slide info stored in an array of JSON objects of the form

    [
        {
            //This will be diplayed in the Upper-Left Corner of the four panels
            name:'Jamil Evans',
            bio: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
        },
        {
            //This will be diplayed in the Upper-Right Corner of the four panels
            name: 'Kole Myers',
            bio: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
        },
        {
            //This will be diplayed in the Lower-Left Corner of the four panels
            name: 'Spike Spiegel',
            bio: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
        },
        {
            //This will be diplayed in the Lower-Right Corner of the four panels
            name: 'Tyrion Lannister',
            bio: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
        }
    ]

##Logo slide data structure:
    4: {
        type: "weather",
        transitions: {
            entry: 'fade', //still only supported type
            exit: 'fade'
        },
        timing: {
            slideTime: 10000, //same as liveVideoOverlay, time spent on slide
            transitionTime: 2000, ////transition time
        },
        content: {
            overlayColor: '#FAFCFA', //text color
            zip: '20001' //set zip code for weather, US only
        }
    }

Thanks to [Mary Lou](http://tympanus.net/codrops/author/crnacura/) for the [fourPanel Page Transitions](http://tympanus.net/codrops/2013/04/23/fullscreen-layout-with-page-transitions/)
