define([
    '$',
    'global/utils',
    'components/alert/alert-ui',
], function(
    $,
    Utils,
    Alert
) {

    var styleRequired = function() {
        $('.required').addClass('u-margin-start-sm u-text-warning');
    };

    var accountChangePasswordUI = function() {
        styleRequired();
        Utils.overrideFormFunctions('validateForm');
        Utils.decorateErrorsAlert();
        Alert.init();

        // Hook into desktop error Handling
        $('#gwt-error-placement-div').on('DOMNodeInserted', function(e) {
            Utils.decorateErrorsAlert();
        });
    };

    return accountChangePasswordUI;
});
