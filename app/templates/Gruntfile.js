'use strict';


var livereloadSnippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet;
var mountFolder = function(connect, dir) {
    return connect.static(require('path').resolve(dir));
};

module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({

        watch: {
            options: {
                livereload: true,
            },
            css: {
                files: 'app/css/**/*.scss',
                tasks: ['compass:dev']
            },
            js: {
                files: ['app/js/**/*.js'],
                tasks: ['concat'],
            },
            html: {
                files: ['app/**/*.hbs'],
                tasks: ['assemble']
            }
        },

        assemble: {
            options: {
                assets: 'assets',
                plugins: ['permalinks'],
                partials: ['app/partials/**/*.hbs'],
                layoutdir: 'app/layouts',
                data: ['app/data/*.{json,yml}']
            },
            site: {
                options: {
                    layout: 'layout.hbs'
                },
                expand: true,
                cwd: 'app/pages/',
                src: ['**/*.hbs'],
                dest: 'build/'
            }
        },

        jshint: {
            all: [
                'app/js/**/*.js',
                '!app/js/vendor/**/*.js'
            ]
        },

        compass: {
            build: {
                options: {
                    sassDir: 'app/css',
                    cssDir: 'build/css',
                    environment: 'production'
                }
            },
            dev: {
                options: {
                    sassDir: 'app/css',
                    cssDir: 'build/css'
                }
            }
        },

        copy: {
            js: {
                files: [{
                    expand: true,
                    cwd: 'app/js/vendor/',
                    src: '**/*',
                    dest: 'build/js/vendor/'
                }, ],
            },
            iejs: {
                files: [{
                    expand: true,
                    cwd: 'app/js',
                    src: 'ie.js',
                    dest: 'build/js'
                }, ],
            },
            img: {
                files: [{
                    expand: true,
                    cwd: 'app/img/',
                    src: '**/*',
                    dest: 'build/img/'
                }, ],
            },
            fonts: {
                files: [{
                    expand: true,
                    cwd: 'app/fonts/',
                    src: '**/*',
                    dest: 'build/fonts/'
                }, ],
            }
        },

        concat: {
            build: {
                src: ['app/js/partials/**/*.js'],
                dest: 'build/js/main.js',
            },
        },

        uglify: {
            mainjs: {
                src: 'build/js/main.js',
                dest: {
                    'build/js/main.min.js': 'dist/js/frontend.js'
                }
            },
            iejs: {
                src: 'app/js/ie.js',
                dest: 'build/js/ie.min.js'
            }
        },

        connect: {
            options: {
                port: 9090,
                hostname: 'localhost' // change this to '0.0.0.0' to access the server from outside
            },
            livereload: {
                options: {
                    middleware: function(connect) {
                        return [
                            livereloadSnippet,
                            mountFolder(connect, 'build')
                        ];
                    }
                }
            },
            dist: {
                options: {
                    middleware: function(connect) {
                        return [
                            mountFolder(connect, 'build')
                        ];
                    }
                }
            }
        },

        clean: {
            build: ['build'],
            js: ['build/js'],
            css: ['build/css'],
            img: ['build/img']
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('assemble');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Default task(s).
    grunt.registerTask('default', ['jshint', 'assemble', 'compass:dev', 'concat', 'copy', 'connect:livereload', 'watch']);

    grunt.registerTask('build', ['clean:css', 'clean:js', 'jshint', 'assemble', 'compass:build', 'concat', 'copy', 'uglify']);

};