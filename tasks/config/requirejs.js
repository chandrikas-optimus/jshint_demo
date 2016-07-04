module.exports = function(grunt) {
    return {
        styleguide: {
            options: {
                almond: true,
                mainConfigFile: './styleguide/config.js',
                optimize: 'none',
                keepBuildDir: true,
                name: './ui',
                out: './styleguide/build/styleguide.js'
            }
        },
    };
};
