define([
    '$',
    'global/utils',
    'components/alert/alert-ui'
], function(
    $,
    Utils,
    Alert
) {

    var styleRequired = function() {
        $('.required').addClass('u-text-warning');
    };

    var customerServiceOrderStatusUI = function() {
        console.log('customerServiceOrderStatus UI');

        Utils.overrideFormFunctions('submitOrderStatusForm');

        Alert.init();

        styleRequired();

        // Add any scripts you would like to run on the customerServiceOrderStatus page only here
    };

    return customerServiceOrderStatusUI;
});
