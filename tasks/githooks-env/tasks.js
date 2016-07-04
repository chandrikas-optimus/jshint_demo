module.exports = function(grunt) {
    grunt.registerTask('setup-githooks', ['setup-githooks-node-env', 'githooks']);

    grunt.registerTask('setup-githooks-node-env', function() {
        var exec = require('child_process').execSync;

        exec('githooks/setup-githooks-node-env.sh');
    });
};
