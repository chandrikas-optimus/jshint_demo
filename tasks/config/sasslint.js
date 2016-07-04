module.exports = function(grunt) {
    var lint = require('../scsslinting');

    return {
        options: {
            configFile: require.resolve('mobify-code-style/css/.sass-lint.yml')
        },
        target: lint.allFiles
    };
};
