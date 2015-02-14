/*
 * grunt-grover
 * https://github.com/Samuel/grunt-grover
 *
 * Copyright (c) 2015 Samuel Attard
 * Licensed under the MIT license.
 */

'use strict';
var exec = require('child_process').exec,
    path = require('path'),
    glob = require('glob'),
    phantomWin = 'node_modules/phantomjs/lib/phantom/phantomjs.exe',
    phantomLin = 'node_modules/phantomjs/lib/phantom/bin/phantomjs',
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
                'phantom-bin': phantomWin,
                'no-run': false,
                coverage: {
                    on: false,
                    'coverage-warn': 80,
                    istanbul: false,
                    reportFile: false,
                    sourcePrefix: false
                }
            }),
            cmd = '' + path.normalize('node_modules/.bin/grover'),
            cb = this.async();

        if (typeof options.path === 'string') {
            if (glob.sync(options.path).length !== 0) {
                cmd += ' ' + options.path;
            } else {
                grunt.fail.fatal('The specified path matches no files');
            }
        } else {
            grunt.fail.fatal('The path option must be set to a string');
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
            cmd += ' -o ' + path.normalize(options.outfile);
            if (outputTypes.indexOf(options.outtype) !== -1) {
                cmd += boolVar(true, '-' + options.outtype);
            } else {
                cmd += boolVar(trye, '--tap');
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
            cmd += numVar(options.coverage.warn, '-coverage-warn');
            if (typeof options.coverage.istanbul === 'string') {
                grunt.file.mkdir(options.coverage.istanbul);
                cmd += ' --istanbul-report ' + path.normalize(options.coverage.istanbul);
            }
            if (typeof options.coverage.reportFile === 'string') {
                grunt.file.write(options.coverage.reportFile, '');
            }
            cmd += pathVar(options.coverage.sourcePrefix, 'sp');
        }

        if (typeof options['phantom-bin'] === 'string' && grunt.file.exists(options['phantom-bin'])) {
            cmd += ' --phantom-bin ' + path.normalize(options['phantom-bin']);
        } else if (grunt.file.exists(phantomWin)) {
            grunt.log.ok('Using default windows phantomjs path');
            cmd += ' --phantom-bin ' + path.normalize(phantomWin);
        } else if (grunt.file.exists(phantomLin)) {
            grunt.log.ok('Using default linux phantomjs path');
            cmd += ' --phantom-bin ' + path.normalize(phantomLin);
        } else {
            grunt.fail.fatal('phantomjs binary could not be found');
        }

        exec(cmd, function(error, stdout, stderr) {
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
