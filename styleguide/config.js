require.config({
    'wrap': true,
    'baseUrl': '.',
    'keepBuildDir': true,
    'paths': {
        '$': '../node_modules/jquery/dist/jquery',
        'adaptivejs': '../node_modules/adaptivejs/src',
        'bouncefix': '../node_modules/bouncefix.js/dist/bouncefix.min',
        'buildConfig': '../build/buildConfig', // built by `grunt preview`
        'components': '../app/components',
        'svg-icon': '../app/components/icon/icon',
        'component-installed': '../app/config/system/component-installed.json',
        'component-locations': '../app/config/component.json',
        'deckard': '../node_modules/deckard/dist/deckard.min',
        'dust': '../node_modules/adaptivejs/lib/dust-requirejs',
        'dust-core': '../node_modules/adaptivejs/node_modules/dustjs-linkedin/dist/dust-core',
        'dust-component-helper': '../node_modules/adaptivejs/lib/dust-component-helper',
        'dust-component-sugar': '../node_modules/adaptivejs/lib/dust-component-sugar',
        'dust-full': '../node_modules/adaptivejs/node_modules/dustjs-linkedin/dist/dust-full',
        'dust-custom': '../node_modules/adaptivejs/lib/dustPatch',
        'dust-helpers': '../node_modules/dustjs-helpers/dist/dust-helpers',
        'dust-icon-helper': '../app/global/utils/dust-icon-svg',
        'dust-element-attributes': '../app/global/utils/dust-element-attributes',
        'event-polyfill': '../node_modules/pinny/src/js/utils/event-polyfil',
        'includes': 'views/includes',
        'isChildOf': '../node_modules/selector-utils/src/selector/isChildOf',
        'jquery-ui': '../node_modules/jquery-ui/ui',
        'libs': '../node_modules',
        'lockup': '../node_modules/lockup/dist/lockup.min',
        'mobifyjs/utils': '../node_modules/adaptivejs/node_modules/mobifyjs-utils/utils',
        'optional-text': '../node_modules/adaptivejs/lib/optional-text-requirejs',
        'pinny': '../node_modules/pinny/dist/pinny.min',
        'bellows': '../node_modules/bellows/src/js/bellows',
        'plugin': '../node_modules/plugin/dist/plugin.min',
        'shade': '../node_modules/shade/dist/shade.min',
        'sheet-right': '../node_modules/pinny/src/js/effect/sheet-right',
        'text': '../node_modules/adaptivejs/bower_components/requirejs-plugins/lib/text',
        'velocity': '../node_modules/velocity-animate/velocity.min',
    },
    'shim': {
        'dust-core': {
            'exports': 'dust'
        },
        'dust-full': {
            'exports': 'dust'
        },
        '$': {
            'exports': '$'
        }
    },

    // this ensures that dust-full does not get included in the build
    'stubModules': ['dust'],
    'exclude': ['dust-full']
});
