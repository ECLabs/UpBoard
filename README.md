# UpBoard
Digital Signage for Corporations

#### Getting Started:

Requires **npm**, **grunt**, **bower**, and **compass**
* npm - see https://docs.npmjs.com/getting-started/installing-node
* grunt - see http://gruntjs.com/getting-started
* bower - see http://bower.io
* compass - see http://compass-style.org/install

After you've pulled the project down and installed the required tools above, in the project root run the following commands:

**npm install** - to load necessary node modules

**grunt build** - to create a dist folder for distribution

**grunt serve** - to run the app locally

All data for the slideshow is stored at https://boiling-heat-9947.firebaseio.com/.
This can be changed in the config.js file located in app/scripts/angularfire.

To add a slide make a new node with the number the slide will be (slides added directly to firebase can only be added at the end without deleting and re-writing the previous slides). If you wish to add a slide manually to firebase then be sure to follow the format of the slide type you wish. These are listed below.

Slides will be shown in the order in which they appear in the database and not by their number. However, the number is important and must match the order they appear in the database.

A slide type must then be specified. The types are:
* **logo**
* **picture**
* **liveVideoOverlay**
* **staticVideoOverlay**
* **bioPanels**
* **weather**

Each of these types has a specific set of parameters to be filled out.

Transition types currently supported are *fade* and *slide*.

#### logo slide data structure:

    {
          type: "logo",
          transitions: {
              entry: 'fade',
              exit: 'fade'
          },
          timing: {
              slideTime:10000 , // Time spent on the slide
              transitionTime: 2000, // Total Transition fade time
          }
    },

#### picture slide data structure:

    {
          type: "picture",
          transitions: {
              entry: 'fade',
              exit: 'fade'
          },
          timing: {
              slideTime:10000 , // Time spent on the slide
              transitionTime: 2000, // Total Transition fade time
          },
          content: {
            caption: "Test Innovation, Leadership, Expertise",
            imageUrl: "https://s3.amazonaws.com/upboard/buisinessImage.jpg"
          }
    },
    
#### liveVideoOverlay data structure:

    {
        type: "liveVideoOverlay",
        transitions: {
            entry: 'fade',
            exit: 'fade'
        },
        timing: {
            slideTime: 10000, // Time spent on slide
            transitionTime: 2000, // Total transition time
            audioFadeTime: 2000, // Time between slide fading in and audio beginning to fade
        },
        content: {
            overlay: 'Customer-driven software <br/> development for government <br/> and commercial enterprises.', // Note this section takes html, it may be necessary to include the <br/> tags to get the text spacing correct,
            overlayColor: '#FAFCFA'
        }
    },
    
#### staticVideoOverlay data structure:

    {
        type: "staticVideoOverlay",
        transitions: {
            entry: 'fade',
            exit: 'fade'
        },
        timing: {
            slideTime: 10000, // Time spent on slide
            transitionTime: 2000, // Total transition time
            audioFadeTime: 2000, // Time between slide fading in and audio beginning to fade
        },
        content: {
            overlay: 'Customer-driven software <br/> development for government <br/> and commercial enterprises.', // Note this section takes html, it may be necessary to include the <br/> tags to get the text spacing correct,
            overlayColor: '#FAFCFA',
            videoUrl: 'http://www.w3schools.com/HTML/mov_bbb.mp4' // url to static video to play in the background
        }
    },
    
#### bioPanels data structure:

    {
        type: "bioPanels",
        transitions: {
            entry: 'fade',
            exit: 'fade'
        },
        timing: {
            openFirstSection: 3000, // Time between the fourpanel fading in and opening the first section
            openSection: 1000, // Time between previous closing and next opening
            sectionTime: 20000, // Time spent on each slide
            transitionTime:1000, // Time to fade the page away
        },
        content: {
            content: array of arbitrary number of json objects, format shown below
        }
    },


##### bioPanels content format:

    [
        {
            name:'Jamil Evans',
            hireYear: '2001',
            imageUrlContent: 'https://s3.amazonaws.com/upboard/BioFullShots/jamil_full.png', // path to image to display in the bio content
            imageUrlCover: 'https://s3.amazonaws.com/upboard/BioHeadShots/jamil_headshot.jpg',   // path to image to display in the main cover page 
            bio: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
        },
        {
            name: 'Kole Myers',
            hireYear: '2010',
            imageUrlContent: 'https://s3.amazonaws.com/upboard/BioFullShots/kole_full.png',
            imageUrlCover: 'https://s3.amazonaws.com/upboard/BioHeadShots/kole_headshot.jpg',
            bio: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
        },
        {
            name: 'Spike Spiegel',
            hireYear: '2012',
            imageUrlContent: 'https://s3.amazonaws.com/upboard/BioFullShots/spike_full.png',
            imageUrlCover: 'https://s3.amazonaws.com/upboard/BioHeadShots/spike_headshot.jpg',
            bio: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
        },
        {
            name: 'Tyrion Lannister',
            hireYear: '2015',
            imageUrlContent: 'https://s3.amazonaws.com/upboard/BioFullShots/tyrion_full.png',
            imageUrlCover: 'https://s3.amazonaws.com/upboard/BioHeadShots/tyrion_headshot.jpg',
            bio: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
        }
    ]

#### weather slide data structure:
    {
        type: "weather",
        transitions: {
            entry: 'fade',
            exit: 'fade'
        },
        timing: {
            slideTime: 10000, // same as liveVideoOverlay, time spent on slide
            transitionTime: 2000, // transition time
        },
        content: {
            overlayColor: '#FAFCFA', // text color
            zip: '20001' // set zip code for weather, US only
        }
    }