module.exports = function(grunt) {

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),
    sass: {
      build: {
        options: {
          style: 'expanded',
          // sourcemap: true,
          debugInfo: true,
          unixNewlines: true,
          trace: true
        },

        files: {
          'public/stylesheets/style.css' : 'public/stylesheets/sass/style.scss'
        }
      },

      dist: {
        options: {
          style: 'compressed',
          unixNewlines: true
        },

        files: {
          'public/stylesheets/style.css' : 'public/stylesheets/sass/style.scss'
        }
      }
    },

    mocha: {

      test: {
        src: ['tests/**/*.html'],
        dest: 'tests/out/reporter.out'
      },

      options: {
        reporter: 'Spec',
        log: true,
        run: true
      }
    },

    watch: {
      sass: {
        files: ['public/stylesheets/sass/*.scss'],
        tasks: ['sass:build']
      },

      test: {
        files: ['public/javascripts/*.js', 'tests/*.js'],
        tasks: ['mocha:test']
      },

      livereload: {
        files:['public/**/*', 'views/**/*', 'routes/**/*'],
        options: {
          livereload: true
        }
      }
    }


  });

  grunt.registerTask('watch', ['watch']);
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-mocha');


};
