/*
 * grunt-grover
 * https://github.com/Samuel/grunt-grover
 *
 * Copyright (c) 2015 Samuel Attard
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp']
    },

    // Configuration to be run (and then tested).
    grover: {
      default_options: {
        options: {
          path: 'test/js/*.html',
          'execution-path': '../..',
          logLevel: 2,
          failOnFirst: false,
          concurrent: 15,
          timeout: false,
          import: false,
          prefix: false,
          suffix: false,
          outfile: false,
          outtype: 'tap',
          server: false,
          port: 8000,
          'phantom-bin': false,
          'no-run': false,
          coverage: {
            on: false,
            warn: 80,
            istanbul: false,
            reportFile: false,
            sourcePrefix: false
          }
        }
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js']
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'grover']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
