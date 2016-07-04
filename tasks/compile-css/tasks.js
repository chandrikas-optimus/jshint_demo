module.exports = function(grunt) {

    ['sass', 'autoprefixer'].forEach(function(name) {
        grunt.loadNpmTasks('grunt-' + name);
    });

    grunt.registerTask('adaptive-compile-css__dev',  ['sass:dev',  'autoprefixer']);
    grunt.registerTask('adaptive-compile-css__prod', ['sass:prod', 'autoprefixer']);
    grunt.registerTask('adaptive-compile-css', ['adaptive-compile-css__dev']);
};
