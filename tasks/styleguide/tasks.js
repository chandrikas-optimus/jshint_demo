module.exports = function(grunt) {
    grunt.registerTask('clean_styleguide', function() {
        grunt.file.delete('styleguide/build/');
        grunt.file.mkdir('styleguide/build/');
    });

    grunt.registerTask('build-with-styleguide', [
        'clean_styleguide',
        'build_dev',
        'sass:styleguide',
        'requirejs:styleguide',
        'iconpack:styleguide',
        'connect:styleguide'
    ]);

    grunt.registerTask('styleguide', [
        'build-with-styleguide',
        'watch:styleguide'
    ]);
};
