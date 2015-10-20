var firebaseRef = new Firebase("https://boiling-heat-9947.firebaseio.com/");
var media = {}; 

function init(){      
      $(function() {

                //set up webcam feed
                (function() {

                    var video = document.querySelector("#videoElement");

                    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;

                    if (navigator.getUserMedia) {
                        navigator.getUserMedia({video: true, audio: true}, handleVideo, videoError);
                    }

                    function handleVideo(stream) {

                        video.src = window.URL.createObjectURL(stream);
                        video.volume = 0;

                    }

                    function videoError(e) {
                        console.log('error, no webcam support found');
                    }

                })();

                //Get and set washingtonPost content
                var washingtonPostData;
                $.ajax({
                 url      : document.location.protocol + '//ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=10&callback=?&q=' + encodeURIComponent('http://feeds.washingtonpost.com/rss/blogs/rss_the-switch'),
                  dataType : 'json',
                  success  : function (data) {
                    console.log(data);
                    washingtonPostData = data;
                    var current = data.responseData.feed.entries[0];
                    $('.washingtonPostArticleTitle').html(current.title);
                    $('.washingtonPostArticleContent').html(current.contentSnippet);
                    $('.washingtonPostArticleAuthor').html(current.author);
                    console.log(current.publishedDate);
                    var res = current.publishedDate.slice(5,25);

                    //September abbreviation is Sept so it adds another character and requires special parsing
                    if (res.slice(3,6) === 'Sep') {
                      var month = 9;
                      var day = res.slice(0,2);
                      var year = res.slice(8,12);
                      var dayTime = res.slice(13,21);
                    }
                    console.log(res);
                    var day = res.slice(0,2);
                    console.log(day);
                    var month = res.slice(3,6);
                    console.log(month);
                    var year = res.slice(7,11);
                    console.log(year);
                    var dayTime = res.slice(12,20);
                    console.log(dayTime);

                  },
                  error : function(data){
                    console.log(data)
                  }
                });
                //get firebase info
                firebaseRef.once('value', function(snapshot) {

                    //use this function if you want to write firebase data easily. Note to add a slide copy object of type you wish to add and place in the order you want. make sure that order is ascending by number
                    /*
                    (function(){
                        firebaseRef.set({
                              1: {
                                    type: "logo",
                                    transitions: {
                                        entry: 'fade',
                                        exit: 'fade'
                                    },
                                    timing: {
                                        slideTime:5000 ,
                                        transitionTime: 2000,
                                    }
                              },
                              2: {
                                  type: "liveVideoOverlay",
                                  transitions: {
                                      entry: 'fade',
                                      exit: 'fade'
                                  },
                                  timing: {
                                      slideTime: 5000,
                                      transitionTime: 2000,
                                      audioFadeTime: 2000,
                                  },
                                  content: {
                                      overlay: 'Customer-driven software <br/> development for government <br/> and commercial enterprises.',
                                      overlayColor: '#FAFCFA',
                                  }
                              },
                              3: {
                                  type: "bioPanels",
                                  transitions: {
                                      entry: 'fade',
                                      exit: 'fade'
                                  },
                                  timing: {
                                      openFirstSection: 3000,
                                      openSection: 1000,
                                      sectionTime: 5000,
                                      transitionTime:1000,
                                  },
                                  content: {
                                      content: [{"name":"Jamil Evans","bio":"As President of Evans & Chambers Technology, Jamil Evans is charged with maintaining good relationships with stakeholders in the Federal Government and Intelligence Community. He manages the technical director of the company to ensure that EC's core competencies and innovations are aligned with our customer base. Jamil's uncommon mixture of hard-core technical expertise and strategic relationship management skills drive the company's winning results. Jamil is an expert in service oriented architectures (SOA), secure web service standards definition, and the design and implementation of mission-critical enterprise services and systems. Prior to founding Evans & Chambers Technology, Jamil served as a senior software engineer at Booz Allen Hamilton, providing vendor analysis and software development services to an Intelligence Community customer."},{"name":"Mary Sabatino","bio":"As a Program Manager for Evans & Chambers Technology, Mary Sabatino plays a key role in transforming customer requirements into application design and managing the resources needed to complete projects. She also works closely with development teams to keep the project within scope and to meet production and budget targets. She supports the entire Software Development Life Cycle, including requirements definition, functional design, development, system testing, documentation, training, implementation, maintenance, and customer support. Prior to working with EC, Mary managed projects with L-3 Communications and CACI to support complex information technology projects.  Mary finds it very rewarding to watch a design “come to life” in the form of a working application and her customers praise her dedication, thoroughness, and ability to go above and beyond to ensure that her projects are managed and executed efficiently."},{"name":"Ryan Gross","bio":"Ryan Gross joined Evans & Chambers Technology (EC) in November 2013. Before joining the team, he worked on a commercial project for EC, developing a workflow management tool built on Java using the Grails framework and utilizing a MySQL database. His previous experience in Java development and web development prepared him for his new role at EC as a Software Developer / Engineer I. Ryan enjoys the challenge of developing and enjoys the opportunity to work on projects that provide a positive impact."},{"name":"Vik David","bio":"Vik David is a Software Engineer for Evans & Chambers Technology's and has been working with EC since September 2010. Vik takes a lot of satisfaction in creating something that will help his clients in their jobs. His focus is on front-end technologies and he recently re-wrote and improved a widely-used dashboard report for his client."}],
                                  }
                              },
                              4: {
                                  type: "weather",
                                  transitions: {
                                      entry: 'fade',
                                      exit: 'fade'
                                  },
                                  timing: {
                                      slideTime: 10000,
                                      transitionTime: 2000,
                                  },
                                  content: {
                                      overlayColor: '#FAFCFA',
                                      zip: '20001'
                                  }
                              },
                              5: {
                                  type: "picture",
                                  transitions: {
                                      entry: 'fade',
                                      exit: 'fade'
                                  },
                                  timing: {
                                      slideTime: 10000,
                                      transitionTime: 2000,
                                  },
                                  content: {
                                      caption: "Photo caption goes here"
                                  },
                              }
                            });
                    })(); */

                    //holder array to specify slide order
                    var slideOrder = [];
                    //calculate total slideshow time
                    var totalTime = function() {
                        var time=2000;
                        snapshot.forEach(function(childSnapshot) {

                            var key = childSnapshot.val();
                            slideOrder.push(key.type); //fill in order array

                            if(key.type ==='logo' || key.type==='liveVideoOverlay' || key.type==='picture' || key.type==='staticVideoOverlay'){
                              time+= (key.timing.slideTime + key.timing.transitionTime);
                            } else if (key.type==='bioPanels'){
                              time+= (key.timing.openFirstSection + (key.timing.openSection*6) + (key.timing.sectionTime*6) + key.timing.transitionTime);
                          } else if(key.type==='weather'){ //if type is weather then add time same as others and get weather info from api
                              time+= (key.timing.slideTime + key.timing.transitionTime);
                              $.ajax({
                                 url: 'http://api.openweathermap.org/data/2.5/weather?zip='+ key.content.zip + ',us&units=imperial&APPID=8cbe87b8668498c44b0ade0ce19afd6b',
                                 data: {
                                    format: 'json'
                                 },
                                 error: function() {
                                    console.error("something went wrong with ajax call")
                                 },
                                 dataType: 'jsonp',
                                 success: function(data) {
                                    $('.weather p').html("<div>" + data.name + "</div>" + data.main.temp + "º | " +toCamelCase(data.weather[0].description));
                                 },
                                 type: 'GET'
                             });

                          }

                        });
                      return time;
                    };

                    // start interval
                    (function(){
                        setInterval(function(){                          
                            window[slideOrder[0]](snapshot.val(), slideOrder, 0);
                        }, totalTime());
                    })();

                    window[slideOrder[0]](snapshot.val(), slideOrder, 0); //pass slide1 the firebase data & array
                    
                    preloadMedia(snapshot.val());
                    

                }, function (err) { // throw error if get request fails
                    console.error(err);
                }

                );

            });
}


//Caches photos and videos immediately so media is loaded in time
function preloadMedia(slides){
  for(i in slides){
    if(slides[i] != undefined){
      if(slides[i].type == "picture"){
        var image = new Image();
        image.src = slides[i].content.imageUrl;
        media["fullScreen"] = image;
        $('.picture img').attr('src', media["fullScreen"].src);
      }
      else if(slides[i].type == "staticVideoOverlay"){
        var video = new Image();
        video.src = slides[i].content.videoUrl;
        media["staticVideoOverlay"] = video;
      }
      else if(slides[i].type == "bioPanels"){
        for(k in slides[i].content.content){
          var imageCover = new Image();
          imageCover.src = slides[i].content.content[k].imageUrlCover;
          media["bioCover"+k] = imageCover;

          var imageContent = new Image();
          imageContent.src = slides[i].content.content[k].imageUrlContent;
          media["bioContent"+k] = imageContent;
        }
      }
    }
  }
}