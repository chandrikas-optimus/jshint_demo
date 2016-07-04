
module.exports = function(grunt) {

    var spawnTask = function(env, callback) {
        var spawnArgs = ['node_modules/nightwatch/bin/runner.js', '-c', 'tests/system/nightwatch-config.js'];

        if (arguments.length === 1) {
            callback = env;
            env = undefined;
        }

        if (env) {
            spawnArgs.push('-e', env);
        }

        grunt.util.spawn({
            cmd: 'node',
            args: [].concat(spawnArgs, grunt.option.flags()),
            opts: {stdio: 'inherit'}
        },
            function(error, result, code) {
                if (code !== 0) {
                    grunt.fail.fatal('Tests failed', code);
                }
                callback();
            }
        );
    };

    grunt.registerTask('nightwatch', function() {
        var callback = this.async();
        spawnTask(callback);
    });

    grunt.registerTask('nightwatch-parallel', function() {
        var callback = this.async();
        spawnTask('workflows,components,pages', callback);
    });

    grunt.registerTask('android', function() {
        var callback = this.async();
        spawnTask('android', callback);
    });

    grunt.registerTask('ios', function() {
        var callback = this.async();
        spawnTask('ios', callback);
    });

    grunt.registerTask('sauce-android', function() {
        var callback = this.async();
        spawnTask('sauce-android', callback);
    });

    grunt.registerTask('sauce-ios', function() {
        var callback = this.async();
        spawnTask('sauce-ios', callback);
    });
};
