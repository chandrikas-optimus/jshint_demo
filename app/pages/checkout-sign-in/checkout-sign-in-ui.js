define([
    '$',
    'global/ui/tooltip-ui',
    'pages/checkout-sign-in/ui/forgot-password-modal-ui',
    'global/utils',
    'components/alert/alert-ui'
], function($, tooltipUI, forgotPasswordModalUI, Utils, Alert) {

    var _checkForErrors = function() {
        var $errors = $('#gwt-error-placement-div .gwt-csb-error-panel');

        if ($errors.length) {
            $('body').trigger('formSubmit.mobify', [$('#userLogonForm')]);
        }
    };


    var checkoutSignInUI = function() {
        Utils.overrideFormFunctions('submitUserLogon');
        Alert.init();
        _checkForErrors();
        tooltipUI();
        forgotPasswordModalUI.init();
    };

    return checkoutSignInUI;
});
