module.exports = function(grunt) {
    return {
        options: {
            loadPaths: [
                'static/img/svg/**'
            ],
            svgPrefix: 'icon-'
        },
        default: {
            src: '**',
            dest: 'static/img/sprite.svg'
        },
        styleguide: {
            src: '**',
            dest: 'styleguide/sprite.svg'
        }
    }
};
