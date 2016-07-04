/**
 * RequireJS paths for the adaptive bundle
 */

require.config({
    'baseUrl': '.',
    'keepBuildDir': true,
    'paths': {
        'buildConfig': '../build/buildConfig',
        'dust-helpers': '../node_modules/dustjs-helpers/dist/dust-helpers',
        'dust-icon-helper': 'global/utils/dust-icon-svg',
        'translator': 'global/i18n/translator',
        'includes': 'global/includes/',
        'libs': '../node_modules',
        'package': '../package.json',
        'resizeImages': '../node_modules/imageresize-client/resizeImages',
        'descript': '../node_modules/descript/dist/descript',
        'baseSelectorLibrary': 'vendor/jquery',
        'svg-icon': 'components/icon/icon',
        'removeStyle': '../node_modules/selector-utils/src/selector/removeStyle',
        'capitalize': '../node_modules/selector-utils/src/utils/capitalize',
        'swap': '../node_modules/selector-utils/src/selector/swap'
    },
    'shim': {
        'baseSelectorLibrary': {
            'exports': 'jQuery'
        }
    }
});
