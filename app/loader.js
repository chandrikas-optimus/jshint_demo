/**
 * Scripts required here will be combined into adaptive.js
 */

require([
    'adaptivejs/utils/assets',
    'adaptivejs/utils/isLocal',
    'adaptivejs/utils/isCapturing',
    'buildConfig'
],
function(AssetUtils, isLocal, isCapturing, buildConfig) {

    if (isCapturing()) {
        var local = isLocal();
        var adaptationScript = 'adaptation.' + (local ? '' : 'min.') + 'js';
        var stylesheetName = 'css/stylesheet.' + (local ? '' : 'min.') + 'css';

        AssetUtils.loadAsset('script', {src: AssetUtils.getAssetUrl(adaptationScript), async: true, className: 'capture-remove', id: 'adaptive-build-script'});
        AssetUtils.loadAsset('script', {src: buildConfig.captureLib || '//cdn.mobify.com/capturejs/capture-latest.min.js', async: true, className: 'capture-remove'});

        // Preload assets (on webkit only, as this breaks Firefox)
        if (!/webkit/i.test(navigator.userAgent)) {
            return;
        }

        AssetUtils.loadAsset('link', {href: AssetUtils.getAssetUrl(stylesheetName), rel: 'stylesheet', type: 'text/css', className: 'capture-remove'});
    }

}, null, true); // relPath, forceSync
