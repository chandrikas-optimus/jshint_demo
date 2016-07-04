module.exports = function(grunt) {
    var importOnce = require('node-sass-import-once');

    return {
        prod: {
            options: {
                outputStyle: 'compressed',
                includePaths: [
                    'app/',
                    'node_modules/'
                ],
                importer: importOnce,
                importOnce: {
                    index: false,
                    css: false
                }
            },
            files: [{
                expand: true,
                cwd: 'app/',
                src: [
                    '**/*.scss',
                    '!node_modules/**/*.scss'
                ],
                dest: 'build/css',
                ext: '.min.css',
            }]
        },
        dev: {
            options: {
                outputStyle: 'expanded',
                sourceComments: true,
                includePaths: [
                    'app/',
                    'node_modules/'
                ],
                importer: importOnce,
                importOnce: {
                    index: false,
                    css: false
                },
                indentWidth: 4
            },
            files: [{
                expand: true,
                cwd: 'app/',
                src: [
                    '**/*.scss',
                    '!node_modules/**/*.scss'
                ],
                dest: 'build/css',
                ext: '.css',
            }]
        },
        styleguide: {
            options: {
                outputStyle: 'expanded',
                sourceComments: true,
                includePaths: [
                    'styleguide/',
                    'app/',
                    'node_modules/'
                ],
                importer: importOnce,
                importOnce: {
                    index: false,
                    css: false
                },
                indentWidth: 4
            },
            files: [{
                expand: true,
                cwd: 'styleguide/',
                src: [
                    '**/*.scss'
                ],
                dest: 'styleguide/build/',
                ext: '.css',
            }]
        }
    };
};
