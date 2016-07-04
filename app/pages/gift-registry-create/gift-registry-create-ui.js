define([
    '$',
    'global/utils',
    'global/parsers/registry-form-parser-ui',
    'components/alert/alert-ui',
    'components/reveal/reveal-ui'
], function(
    $,
    Utils,
    formParser,
    Alert,
    Reveal
) {

    var _pageLoadTransform = function($appendingElement) {
        formParser.transformStep1($appendingElement);

        $('.js-container')
            .prop('hidden', false)
            .siblings('.c-loading').remove();
    };

    var _transforms = function($parent, $child) {
        var $appendingElement = $child;
        var $appendingTo = $parent;

        // on page load, #gwt_new_gift_registry_create is the right hook to start transforms
        // however, on page update (step 1 to 2, or 2 to 1), we need to
        // hook onto .GR_create_progressBar_Step
        if ($appendingTo.is('#gwt_new_gift_registry_create')) {
            _pageLoadTransform($appendingElement);
        } else if ($appendingElement.is('.GR_creat_step2') && !$appendingElement.find('.c-field').length) {
            formParser.transformStep2($appendingElement);
        } else if ($appendingElement.is('.GR_creat_step3') && !$appendingElement.find('.c-field').length) {
            formParser.transformStep3($appendingElement);
        }
    };

    var giftRegistryCreateUI = function() {
        console.log('giftRegistryCreate UI');
        // Add any scripts you would like to run on the giftRegistryCreate page only here

        Utils.afterAppendChild('*', _transforms);
        formParser.bindErrorsViaClick();
        Alert.init();
        Reveal.init();

        var backButtonSelector = '.GR_create_buttons_step3 button.secondary';
        $('body').on('click', backButtonSelector, function() {
            // Scroll to top of page
            window.scrollTo(0, 0);
        });
    };

    return giftRegistryCreateUI;
});
