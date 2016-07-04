'use strict'

var path = require('path');

module.exports = function(grunt) {
    var _ = grunt.util._;

    grunt.loadNpmTasks('adaptivejs');
    grunt.loadNpmTasks('grunt-iconpack');

    // By default, we load all local tasks from the tasks directory.
    grunt.file.expand('tasks/*').forEach(function(task) {
        grunt.loadTasks(task);
    });

    var configPaths = [
        'node_modules/adaptivejs/tasks/config/*',
        'tasks/config/*'
    ];

    // Populate the config object
    var config = {};
    grunt.file.expand(configPaths).forEach(function(configPath) {
        // Get the grunt-task name to put in the config which is based on the
        // name of the config file
        var configName = configPath.match(/\/([^\/]*)\.js/)[1];
        var option = require(path.join(__dirname + '/' + configPath))(grunt);
        config[configName] = _.extend(config[configName] || {}, option);
    });

    // We hash each file inside of build/assets in order to do cache busting
    // *only* when the file changes. If you have files/folders that you want
    // to hash that aren't in build/assets, add them here:
    config.cachebuster.assets.src.push(
        'build/node_modules/deckard/dist/deckard.min.js'
    );

    grunt.initConfig(config);

    grunt.registerTask('build_dev', 'Builds the project with development settings', ['adaptive-clean_build', 'iconpack', 'adaptive-compile-css__dev','adaptive-build_dev']);
    grunt.registerTask('build_prod', 'Builds the project with production settings', ['adaptive-clean_build','adaptive-compile-css__prod', 'iconpack', 'adaptive-build_prod']);
    grunt.registerTask('preview', 'Builds the project with development settings and starts a server using HTTP port 8080 / HTTPS port 8443. Options: [--port <http_port>] [--https-port <https_port>]', ['build-with-styleguide','adaptive-preview']);
    grunt.registerTask('push', 'Builds the project with production settings and uploads a bundle to Mobify Cloud. Options: [-m | --message "<your_bundle_message>"]', ['adaptive-clean_build', 'iconpack', 'adaptive-compile-css__prod','adaptive-push']);
    grunt.registerTask('test', 'Builds the project with development settings and runs automated tests specified in tests/runner/testRunner.js', ['lint:dev','scsslint','build_dev','adaptive-test']);
    grunt.registerTask('test_ci', 'Task for running tests in continuous integration environments, like CircleCI', ['lint:prod','scsslint','build_prod','adaptive-test_ci']);
    grunt.registerTask('test_skip_build', 'Runs automated tests specified in tests/runner/testRunner.js without building the project', ['lint:dev','scsslint','adaptive-test']);
    grunt.registerTask('test_browser', 'Builds your project with test settings and and starts a server. Run your tests in the browser by visiting http://localhost:8888/tests', ['lint:dev','scsslint','build_dev','adaptive-test_browser']);
    grunt.registerTask('lint-all', 'Task for running all linters in the project', ["scsslint","lint:prod"]);
};
