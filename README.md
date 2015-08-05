# grunt-grover  [![Build Status](https://travis-ci.org/MarshallOfSound/grunt-grover.svg?branch=master)](https://travis-ci.org/MarshallOfSound/grunt-grover)

> A grunt task to run yui tests with grover

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-grover --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-grover');
```

## The "grover" task

### Overview
In your project's Gruntfile, add a section named `grover` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  grover: {
    options: {
      // Task-specific options go here.
    }
  },
});
```

### Options

#### options.path
*Required*  
Type: `String`

A glob format path to your YUI test files.  E.g. `'test/js/*.html'`

#### options.concurrent
Type: `Number`  
Default value: `15`

Number of tests to run concurrently

#### options.logLevel
Type: `Number`
Default value: `2`

Level of logging --
`2`: All output  
`1`: Only error output  
`0`: No output

#### options.failOnFirst
Type: `Boolean`  
Default value: `false`

Fail on the first error

#### options.timeout
Type: `Number`

Time in seconds, after which to consider a test failed

#### options.import
Type: `String`

Path to a JS file to include and use the export (an array) as the list of files to process

#### options.prefix
Type: `String`=

String to prefix all server URL's with (for dynamic server names)

#### options.suffix
Type: `String`

String to append to all server URL's (for dynamic server names)

#### options.outfile
Type: `String`

Path to a file to output the test results to, if the file does not exist it will be created for you  
The output type can be set with the `options.outtype` setting

#### options.outtype
Type: `String`  
Default value: `tap`

The format for the test results output file, it can be:  
`tap`: TAP export  
`xml`: XML export  
`json`: JSON export  
`junit`: JUnit XML export  

#### options.server
Type: `Boolean`  
Default value: `false`

Starts a static file server in the CWD, tests should be relative to this directory

#### options.port
Type: `Number`
Default value: `8000`

Port number to start the static file server on

#### options['phantom-bin']
Type: `String`  
Default value: `Searches for phantomjs in the node_modeuls directory`

Path to phantomjs if you don't want to use the node intergrated version

#### options['no-run']
Type: `Boolean`
Default value: `false`

Do not run the tests, just prep the server (used for other testing)

### Coverage Options

Coverage options are stored in a `optiones.coverage` object.  For coverage to work you must instument your own files with istanbul.

#### options.coverage.on
Type: `Boolean`
Default value: `false`

Generate a coverage report and print it to the screen

#### options.coverage.warn
Type: `Number`
Default value: `80`

Level of coverage to throw a Grunt warning at

#### options.coverage.istanbul
Type: `String`

Path to output a istanbul coverage report to, must be an empty directory.  If the directory does not exist it will be created for you

#### options.coverage.reportFile
Type: `String`

Path to output a basic coverage report file to, the file will be in a `lcov` format.  If the file does not exist it will be created for you.

#### options.coverage.sourcePrefix
Type: `String`

The relative path to the original source file for use in the coverage results.

### Usage Examples

#### Basic Options
In this example, basic options are setup to run yui test on all files in the `test/js` directory with full logging turned on.  A test report will be created at `reports/grover.tap` and coverage information will appear in the console.

```js
grunt.initConfig({
  grover: {
    default: {
      options: {
        path: 'test/js/*.html',
        logLevel: 2,
        concurrent: 15,
        outfile: 'reports/grover.tap',
        outtype: 'tap',
        coverage: {
            on: true
        }
      }
    }
  }
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
**0.1.0: ** *15/02/2015*
