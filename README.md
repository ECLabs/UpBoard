# UpBoard
Digital Signage for Corporations

all data for the slideshow is stored at https://boiling-heat-9947.firebaseio.com/#

to add a slide make a new node named 'slide' + 'i', where i is the number of the slide.
slides will be shown in the order in which they appear in the database. not the 'i'. I intend to update this soon.

a slide type must then be specified. The types are logo, liveVideoOverlay, and fourPanel.
each of these types has a spcific set of parameters to be filled out.

with the exception of the logo slide the slide must also have a timing,transitions, and content field.

Timing:


fourPanel slide info stored in an array of JSON objects of the form

    [
        {
            name:'Jamil Evans',
            bio: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
        },
        {
            name: 'Kole Myers',
            bio: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
        }
    ]

the liveVideoOverlay content.overlay can be passed html. it may be necessary to include <br> in the text to ensure the text fits in the box well.
