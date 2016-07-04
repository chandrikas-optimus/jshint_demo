define([
    '$',
    'global/includes/sidenav/sidenav-ui',
    'global/utils',
    'components/alert/alert-ui'
], function(
    $,
    sideNavUI,
    Utils,
    Alert
) {

    var styleForm = function() {
        $('.required').addClass('u-text-warning');
        $('.c-field__caption').addClass('c-note');
        $('.c-field-row').first().addClass('c--3-4');
    };

    var customerServiceContactUsUI = function() {
        sideNavUI.init();
        styleForm();

        Utils.overrideFormFunctions('submitCustomerServiceForm');

        Alert.init();
    };

    return customerServiceContactUsUI;
});
