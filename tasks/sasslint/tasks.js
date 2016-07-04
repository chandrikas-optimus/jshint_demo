module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-sass-lint');

    grunt.registerTask('scsslint', ['sasslint']);
};
