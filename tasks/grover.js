/*
 * grunt-grover
 * https://github.com/Samuel/grunt-grover
 *
 * Copyright (c) 2015 Samuel Attard
 * Licensed under the MIT license.
 */

'use strict';
var exec = require('child_process').exec,
    grunt = require('grunt'),
    path = require('path'),
    glob = require('glob'),
    phantom = require('phantomjs'),
    phantomPath = phantom.path,
    outputTypes = ['tap', 'xml', 'json', 'junit'];

function pathVar(attr, flag) {
    if (typeof attr === 'string') {
        if (grunt.file.exists(attr)) {
            return ' -' + flag + ' ' + path.normalize(attr);
        } else {
            grunt.fail.fatal('The specified file (' + attr + ') does not exist');
        }
    }
    return '';
}
function numVar(attr, flag) {
    if (attr !== false) {
        if (typeof attr === 'number') {
            return ' -' + flag + ' ' + parseInt(attr);
        } else {
            grunt.fail.fatal('Expected value: ' + attr + ' to be a number, got a ' + typeof attr);
        }
    }
    return '';
}
function boolVar(attr, flag) {
    if (attr !== false) {
        if (typeof attr === 'boolean' && attr === true) {
            return ' -' + flag;
        } else {
            grunt.fail.fatal('Expected value: ' + attr + ' to be a boolean, got a ' + typeof attr);
        }
    }
    return '';
}

function stringVar(attr, flag) {
    if (attr !== false) {
        if (typeof attr === 'string') {
            return ' -' + flag + ' ' + attr;
        } else {
            grunt.fail.fatal('Expected value: ' + attr + ' to be a string, got a ' + typeof attr);
        }
    }
    return '';
}

module.exports = function(grunt) {

    // Please see the Grunt documentation for more information regarding task
    // creation: http://gruntjs.com/creating-tasks
    grunt.registerMultiTask('grover', 'A grunt task to run yui tests with grover', function() {
        // Merge task-specific and/or target-specific options with these defaults.
        var options = this.options({
                path: false,
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
                'phantom-bin': phantomPath,
                'no-run': false,
                cwd: false,
                coverage: {
                    on: false,
                    warn: 80,
                    istanbul: false,
                    reportFile: false,
                    sourcePrefix: false
                }
            }),
            cmd = path.resolve('' + path.normalize('node_modules/.bin/grover')),
            cb = this.async(),
            execPath;


        if (typeof options.path === 'string') {
            if (glob.sync(options.path).length !== 0) {
                cmd += ' ' + path.resolve(options.path);
            } else {
                grunt.fail.fatal('The specified path matches no files');
            }
        } else {
            grunt.fail.fatal('The path option must be set to a string');
        }

        if (typeof options.cwd === 'string') {
            grunt.log.ok('cwd: ' + options.cwd);
            execPath = path.resolve(options.cwd);
        }


        switch (options.logLevel) {
            case 0:
                cmd += ' -s';
                break;
            case 1:
                cmd += ' -q';
                break;
        }

        cmd += boolVar(options.failOnFirst, 'f');

        cmd += numVar(options.concurrent, 'c');
        cmd += numVar(options.timeout, 't');

        cmd += pathVar(options.import, 'i');

        cmd += stringVar(options.prefix, 'p');
        cmd += stringVar(options.suffix, 's');
        if (typeof options.outfile === 'string') {
            grunt.file.write(options.outfile, '');
            cmd += ' -o ' + path.resolve(options.outfile);
            if (outputTypes.indexOf(options.outtype) !== -1) {
                cmd += boolVar(true, '-' + options.outtype);
            } else {
                cmd += boolVar(true, '--tap');
            }
        }

        if (typeof options.server === 'boolean' && options.server === true) {
            cmd += boolVar(options.server, '-server');
            cmd += numVar(options.port, '-port');
        }

        cmd += boolVar(options['no-run'], '-no-run');

        // Coverage options
        if (typeof options.coverage === 'object' && typeof options.coverage.on === 'boolean' && options.coverage.on === true) {
            cmd += boolVar(true, '-coverage');
            if (typeof options.coverage.warn === 'undefined') {
                options.coverage.warn = 80;
            }
            cmd += numVar(options.coverage.warn, '-coverage-warn');
            if (typeof options.coverage.istanbul === 'string') {
                grunt.file.mkdir(options.coverage.istanbul);
                cmd += ' --istanbul-report ' + path.resolve(options.coverage.istanbul);
            }
            if (typeof options.coverage.reportFile === 'string') {
                grunt.file.write(options.coverage.reportFile, '');
                cmd += ' -co ' + path.resolve(options.coverage.reportFile);
            }
            cmd += pathVar(options.coverage.sourcePrefix, 'sp');
        }

        if (typeof options['phantom-bin'] === 'string' && grunt.file.exists(options['phantom-bin'])) {
            cmd += ' --phantom-bin ' + path.resolve(options['phantom-bin']);
        } else if (grunt.file.exists(phantomPath)) {
            grunt.log.ok('Using default node phantomjs path');
            cmd += ' --phantom-bin ' + path.resolve(phantomPath);
	} else {
            grunt.fail.fatal('phantomjs binary could not be found');
        }
        exec(cmd, {cwd: execPath}, function(error, stdout, stderr) {
            if (error !== null && stderr === '') {
                stderr = 'There were test failures, please check the log';
            }
            grunt.log.writeln(stdout);
            if (error !== null) {
                grunt.fail.fatal(stderr);
            } else {
                grunt.log.ok('All tests passed, good job!!');
            }
            cb(error === null);
        });
    });

};
