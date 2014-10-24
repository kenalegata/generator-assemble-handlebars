'use strict';

module.exports = function(grunt) {

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Project configuration.
    grunt.initConfig({

        watch: {
            css: {
                files: 'app/assets/css/**/*.scss',
                tasks: ['compass:dev']
            },
            js: {
                files: ['app/assets/js/**/*.js'],
                tasks: ['concat'],
            },
            html: {
                files: ['app/**/*.hbs'],
                tasks: ['assemble']
            },
            img: {
                files: ['app/assets/images/**/*.{jpg,gif,png}'],
                tasks: ['copy:img']
            },
            fonts: {
                files: ['app/assets/fonts/**/*.{otf,ttf,woff,eot}'],
                tasks: ['copy:fonts']
            },
            json: {
                files: ['app/data/**/*.json'],
                tasks: ['assemble']
            },
            livereload: {
                options: {
                    livereload: 35729
                },
                files: [
                    'app/**/*.hbs',
                    'app/assets/css/**/*.scss',
                    'app/assets/img/**/*.{png,jpg,jpeg,gif,webp,svg}'
                ]
            }
        },

        connect: {
            options: {
                port: 9090,
                hostname: 'localhost', // change this to '0.0.0.0' to access the server from outside
                livereload: 35729
            },
            livereload: {
                options: {
                    middleware: function(connect) {
                        return [
                            connect.static('build')
                        ];
                    }
                }
            },
            dist: {
                options: {
                    middleware: function(connect) {
                        return [
                            connect.static('build')
                        ];
                    }
                }
            }
        },

        assemble: {
            options: {
                assets: 'assets',
                plugins: ['permalinks'],
                partials: ['app/partials/**/*.hbs'],
                layoutdir: 'app/layouts',
                data: ['app/data/**/*.{json,yml}']
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
                'app/assets/js/**/*.js',
                '!app/assets/js/vendor/**/*.js'
            ]
        },

        compass: {
            build: {
                options: {
                    sassDir: 'app/assets/css',
                    cssDir: 'build/assets/css',
                    environment: 'production'
                }
            },
            dev: {
                options: {
                    sassDir: 'app/assets/css',
                    cssDir: 'build/assets/css'
                }
            }
        },

        copy: {
            js: {
                files: [{
                    expand: true,
                    cwd: 'app/assets/js/vendor/',
                    src: '**/*',
                    dest: 'build/assets/js/vendor/'
                }, ],
            },
            mainjs: {
                files: [{
                    expand: true,
                    cwd: 'app/assets/js/',
                    src: 'main.js',
                    dest: 'build/assets/js/'
                }, ],
            },
            iejs: {
                files: [{
                    expand: true,
                    cwd: 'app/assets/js',
                    src: 'ie.js',
                    dest: 'build/assets/js'
                }, ],
            },
            img: {
                files: [{
                    expand: true,
                    cwd: 'app/assets/img/',
                    src: '**/*',
                    dest: 'build/assets/img/'
                }, ],
            },
            fonts: {
                files: [{
                    expand: true,
                    cwd: 'app/assets/fonts/',
                    src: '**/*',
                    dest: 'build/assets/fonts/'
                }, ],
            },
            etc: {
                files: [{
                    expand: true,
                    cwd: 'app/',
                    src: '*.{png,ico,jpg,gif,md,txt}',
                    dest: 'build/'
                }]
            }
        },

        concat: {
            build: {
                src: ['app/assets/js/functions/**/*.js'],
                dest: 'build/assets/js/functions.js',
            },
        },

        uglify: {
            mainjs: {
                src: 'build/assets/js/main.js',
                dest: 'build/assets/js/main.min.js'

            },
            iejs: {
                src: 'app/assets/js/ie.js',
                dest: 'build/assets/js/ie.min.js'
            }
        },

        clean: {
            html: ['build/**/*.html'],
            js: ['build/assets/js'],
            css: ['build/assets/css'],
            img: ['build/assets/img']
        }
    });

    grunt.loadNpmTasks('assemble'); // Special case

    // Default task(s).
    grunt.registerTask('default', [
        'jshint',
        'assemble',
        'compass:dev',
        'concat',
        'copy',
        'connect:livereload',
        'watch'
    ]);

    grunt.registerTask('build', [
        'clean',
        'jshint',
        'assemble',
        'compass:build',
        'concat',
        'copy',
        'uglify'
    ]);

};