module.exports = function(grunt) {
    var directories = [
        'styleguide/',
        'build/',
        'vendor/'
    ];

    return {
        styleguide: {
            options: {
                hostname: '0.0.0.0',
                port: (grunt.option('styleguide-port') || 4444),
                base: directories
            }
        }
    };
};
