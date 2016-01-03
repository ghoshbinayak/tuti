module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'frontend/js/<%= pkg.name %>.js',
        dest: 'public/js/<%= pkg.name %>.min.js'
      }
    },
    browserify: {
      options: {
        alias: {
          'jquery': 'zepto-browserify'
        }
      },
      build: {
        src: 'frontend/js/src/spa.js',
        dest: 'frontend/js/<%= pkg.name %>.js'
      }
    },
    less: {
      build: {
        src: 'frontend/css/*.less',
        dest: 'frontend/css/<%= pkg.name %>.css'
      }
    },
    cssmin: {
      build: {
        src: 'frontend/css/<%= pkg.name %>.css',
        dest: 'public/css/<%= pkg.name %>.min.css'
      }
    },
    watch: {
      minifyjs: {
        files: ['frontend/js/src/spa.js'],
        tasks: ['browserify', 'uglify'],
        options: {
          spawn: false,
        },
      },
      minifycss: {
        files: ['frontend/css/*.less'],
        tasks: ['less', 'cssmin'],
        options: {
          spawn: false,
        }        
      }
    }
  });

  // Load Tasks
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-browserify');

  // Default task(s).
  grunt.registerTask('default', ['uglify']);

};