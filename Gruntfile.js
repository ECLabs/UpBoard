// Generated on 2015-11-18 using generator-angularfire 1.0.0
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Configurable paths for the application
  var appConfig = {
    app: require('./bower.json').appPath || 'app',
    dist: 'dist',
    moduleName: require('./bower.json').moduleName
  };

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    yeoman: appConfig,
    pkg: grunt.file.readJSON('package.json'),

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      backend: { 
				files: [
					'<%= yeoman.app %>/backend/{,*/}*.js',
					'<%= yeoman.app %>/server.js',
					'<%= yeoman.app %>/config.json'
				], 
        tasks: ['newer:jshint:all', 'express:dev'], 
				options: { 
					spawn: false 
				} 
			},
      bower: {
        files: ['bower.json'],
        tasks: ['wiredep']
      },
      frontend: {
        files: ['<%= yeoman.app %>/frontend/scripts/{,*/}*.js'],
        tasks: ['newer:jshint:all']
//        ,
//        options: {
//          livereload: '<%= connect.options.livereload %>'
//        }
      },
      jsTest: {
        files: ['test/spec/{,*/}*.js'],
        tasks: ['newer:jshint:test', 'karma']
      },
      compass: {
        files: ['<%= yeoman.app %>/frontend/styles/{,*/}*.{scss,sass}'],
        tasks: ['compass:server', 'autoprefixer']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      livereload: {
        options: {
          livereload: 35729
        },
        files: [
          '<%= yeoman.app %>/frontend/{,*/}*.html',
          '.tmp/styles/{,*/}*.css',
          '<%= yeoman.app %>/frontend/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },
      
    express: {
      options: {
        // Override defaults here
      },
      dev: {
        options: {
          script: '<%= yeoman.app%>/server.js'
        }
      },
      prod: {
        options: {
          script: '<%= yeoman.dist%>/server.js',
          node_env: 'production'
        }
      },
      test: {
        options: {
          script: '<%= yeoman.app%>/server.js'
        }
      }
    },

    // The actual grunt server settings
//    connect: {
//      options: {
//        port: 9000,
//        // Change this to '0.0.0.0' to access the server from outside.
//        hostname: 'localhost',
//        livereload: 35729
//      },
//      livereload: {
//        options: {
//          open: true,
//          middleware: function (connect) {
//            return [
//              connect.static('.tmp'),
//              connect().use(
//                '/bower_components',
//                connect.static('./bower_components')
//              ),
//              connect().use(
//                '/app/styles',
//                connect.static('./app/styles')
//              ),
//              connect.static(appConfig.app)
//            ];
//          }
//        }
//      },
//      test: {
//        options: {
//          port: 9001,
//          middleware: function (connect) {
//            return [
//              connect.static('.tmp'),
//              connect.static('test'),
//              connect().use(
//                '/bower_components',
//                connect.static('./bower_components')
//              ),
//              connect.static(appConfig.app)
//            ];
//          }
//        }
//      },
//      dist: {
//        options: {
//          open: true,
//          base: '<%= yeoman.dist %>'
//        }
//      }
//    },

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: {
        src: [
          'Gruntfile.js',
          '<%= yeoman.app %>/frontend/scripts/{,*/}*.js'
        ]
      },
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/spec/{,*/}*.js']
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= yeoman.dist %>/{,*/}*',
            '!<%= yeoman.dist %>/.git{,*/}*'
          ]
        }]
      },
      server: '.tmp'
    },

    // Add vendor prefixed styles
    autoprefixer: {
      options: {
        browsers: ['last 1 version']
      },
      server: {
        options: {
          map: true,
        },
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,*/}*.css',
          dest: '.tmp/styles/'
        }]
      },
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,*/}*.css',
          dest: '.tmp/styles/'
        }]
      }
    },

    // Automatically inject Bower components into the app
    wiredep: {
      options: {
        cwd: ''
      },
      app: {
        src: ['<%= yeoman.app %>/frontend/index.html'],
        ignorePath: /\.\.\/\.\.\//
      },
      test: {
        devDependencies: true,
        src: '<%= karma.unit.configFile %>',
        ignorePath: /\.\.\//,
        fileTypes:{
          js: {
            block: /(([\s\t]*)\/{2}\s*?bower:\s*?(\S*))(\n|\r|.)*?(\/{2}\s*endbower)/gi,
              detect: {
                js: /'(.*\.js)'/gi
              },
              replace: {
                js: '\'{{filePath}}\','
              }
            }
          }
      },
      sass: {
        src: ['<%= yeoman.app %>/frontend/styles/{,*/}*.{scss,sass}'],
        ignorePath: /(\.\.\/\.\.\/\.\.\/){1,2}bower_components\//
      }
    },

    // Compiles Sass to CSS and generates necessary files if requested
    compass: {
      options: {
        sassDir: '<%= yeoman.app %>/frontend/styles',
        cssDir: '.tmp/styles',
        generatedImagesDir: '.tmp/images/generated',
        imagesDir: '<%= yeoman.app %>/frontend/images',
        javascriptsDir: '<%= yeoman.app %>/frontend/scripts',
        fontsDir: '<%= yeoman.app %>/frontend/styles/fonts',
        importPath: './bower_components',
        httpImagesPath: '/images',
        httpGeneratedImagesPath: '/images/generated',
        httpFontsPath: '/styles/fonts',
        relativeAssets: false,
        assetCacheBuster: false,
        raw: 'Sass::Script::Number.precision = 10\n'
      },
      dist: {
        options: {
          generatedImagesDir: '<%= yeoman.dist %>/frontend/images/generated'
        }
      },
      server: {
        options: {
          sourcemap: true
        }
      }
    },

    // Renames files for browser caching purposes
    filerev: {
      dist: {
        src: [
          '<%= yeoman.dist %>/frontend/scripts/{,*/}*.js',
          '<%= yeoman.dist %>/frontend/styles/{,*/}*.css',
          '<%= yeoman.dist %>/frontend/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
          '<%= yeoman.dist %>/frontend/styles/fonts/*'
        ]
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      html: '<%= yeoman.app %>/frontend/index.html',
      options: {
        dest: '<%= yeoman.dist %>/frontend',
        flow: {
          html: {
            steps: {
              js: ['concat', 'uglifyjs'],
              css: ['cssmin']
            },
            post: {}
          }
        }
      }
    },

    // Performs rewrites based on filerev and the useminPrepare configuration
    usemin: {
      html: ['<%= yeoman.dist %>/frontend/{,*/}*.html'],
      css: ['<%= yeoman.dist %>/frontend/styles/{,*/}*.css'],
      options: {
        assetsDirs: [
          '<%= yeoman.dist %>/frontend',
          '<%= yeoman.dist %>/frontend/images',
          '<%= yeoman.dist %>/frontend/styles'
        ]
      }
    },

    // The following *-min tasks will produce minified files in the dist folder
    // By default, your `index.html`'s <!-- Usemin block --> will take care of
    // minification. These next options are pre-configured if you do not wish
    // to use the Usemin blocks.
    // cssmin: {
    //   dist: {
    //     files: {
    //       '<%= yeoman.dist %>/styles/main.css': [
    //         '.tmp/styles/{,*/}*.css'
    //       ]
    //     }
    //   }
    // },
    // uglify: {
    //   dist: {
    //     files: {
    //       '<%= yeoman.dist %>/scripts/scripts.js': [
    //         '<%= yeoman.dist %>/scripts/scripts.js'
    //       ]
    //     }
    //   }
    // },
    // concat: {
    //   dist: {}
    // },

    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/frontend/images',
          src: '{,*/}*.{png,jpg,jpeg,gif}',
          dest: '<%= yeoman.dist %>/frontend/images'
        }]
      }
    },

    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/frontend/images',
          src: '{,*/}*.svg',
          dest: '<%= yeoman.dist %>/frontend/images'
        }]
      }
    },

    htmlmin: {
      dist: {
        options: {
          collapseWhitespace: true,
          conservativeCollapse: true,
          collapseBooleanAttributes: true,
          removeCommentsFromCDATA: true,
          removeOptionalTags: true
        },
        files: [{
          expand: true,
          cwd: '<%= yeoman.dist %>/frontend',
          src: ['*.html', 'views/{,*/}*.html'],
          dest: '<%= yeoman.dist %>/frontend'
        }]
      }
    },

    // ng-annotate tries to make the code safe for minification automatically
    // by using the Angular long form for dependency injection.
    ngAnnotate: {
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/concat/scripts',
          src: '*.js',
          dest: '.tmp/concat/scripts'
        }]
      }
    },

    // Replace Google CDN references
    cdnify: {
      dist: {
        html: ['<%= yeoman.dist %>/frontend/*.html']
      }
    },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          expand: true,
          cwd: '.',
          dest: '<%= yeoman.dist %>',
          src: 'package.json'
        }, {
          expand: true,
          cwd: '<%= yeoman.app %>/backend',
          dest: '<%= yeoman.dist %>/backend',
          src: '{,*/}*.*'
        }, {
          expand: true,
          cwd: '<%= yeoman.app %>',
          dest: '<%= yeoman.dist %>',
          src: ['config.json', 'server.js']
        }, {
          expand: true,
          dot: true,
          cwd: '<%= yeoman.app %>/frontend',
          dest: '<%= yeoman.dist %>/frontend',
          src: [
            '*.{ico,png,txt}',
            '.htaccess',
            '*.html',
//            'views/{,*/}*.html',
            'images/{,*/}*.{webp}',
            'styles/fonts/{,*/}*.*'
          ]
        }, {
          expand: true,
          cwd: '.tmp/images',
          dest: '<%= yeoman.dist %>/frontend/images',
          src: ['generated/*']
        }, {
          expand: true,
          cwd: '.',
          dest: '<%= yeoman.dist %>/frontend',
          src: 'bower_components/bootstrap-sass-official/assets/fonts/bootstrap/*'
        }]
      },
      styles: {
        expand: true,
        cwd: '<%= yeoman.app %>/frontend/styles',
        dest: '.tmp/styles/',
        src: '{,*/}*.css'
      }
    },

    // Run some tasks in parallel to speed up the build process
    concurrent: {
      server: [
        'compass:server'
      ],
      test: [
        'compass'
      ],
      dist: [
        'compass:dist',
        'imagemin',
        'svgmin'
      ]
    },

    // Test settings
    karma: {
      unit: {
        configFile: 'test/karma.conf.js',
        singleRun: true
      }
    },

    // Compression settings
    compress:{
      zip: {
        options: {
          archive: 'tmp/<%= pkg.name%>.zip'
        },
        files: [
          {expand: true, cwd: '<%= yeoman.dist%>', src: ['**/*']}
        ]
      },
      tar: {
        options: {
          archive: 'tmp/<%= pkg.name%>.tar'
        },
        files: [
          {expand: true, cwd: '<%= yeoman.dist%>', src: ['**/*']}
        ]
      },
      tgz: {
        options: {
          archive: 'tmp/<%= pkg.name%>.tgz'
        },
        files: [
          {expand: true, cwd: '<%= yeoman.dist%>', src: ['**/*']}
        ]
      }
    },

    // SFTP deployment settings
    'sftp-deploy': {
      build: {
        auth: {
          host: 'ec2-52-23-225-157.compute-1.amazonaws.com',
          port: 22,
          authKey: 'key1' // defined in .ftppass - reference grunt-sftp-deploy project for file format
        },
        cache: false,
        src: 'tmp',
        dest: '/tmp',
        serverSep: '/',
        concurrency: 4,
        progress: true
      }
    },
      
      
    ngtemplates: {
      app: {
        src:      ['app/frontend/scripts/directives/**/*.html', 'app/frontend/views/**/*.html'], 
        dest:     '.tmp/scripts/templates.js', // single file for $templateCache
        options: {
            module: '<%= yeoman.moduleName %>',
            prefix: '/'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-express-server');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-sftp-deploy');
  grunt.loadNpmTasks('grunt-angular-templates');

  grunt.registerTask('serve', 'Compile then start a connect web server', function (target) {
    if (target === 'dist') {
      return grunt.task.run([
        'build', 
        //'connect:dist:keepalive'
        'express:prod'
      ]);
    }

    grunt.task.run([
      'clean:server',
      'wiredep',
      'ngtemplates',
      'concurrent:server',
      'autoprefixer:server',
//      'connect:livereload',
      'express:dev',
      'watch'
    ]);
  });

  grunt.registerTask('server', 'DEPRECATED TASK. Use the "serve" task instead', function (target) {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run(['serve:' + target]);
  });

  grunt.registerTask('test', [
    'clean:server',
    'wiredep',
    'concurrent:test',
    'autoprefixer',
//    'connect:test',
    'express:test',
    'karma'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    'wiredep',
    'ngtemplates',  
    'useminPrepare',
    'concurrent:dist',
    'autoprefixer',
    'concat',
    'ngAnnotate',
    'copy:dist',
    'cdnify',
    'cssmin',
    'uglify',
    'filerev',
    'usemin',
    'htmlmin'
  ]);

  grunt.registerTask('default', [
    'newer:jshint',
    'test',
    'build'
  ]);

  grunt.registerTask('deploy', [
    'build',
    'compress:tgz',
    'sftp-deploy'
  ]);
};
