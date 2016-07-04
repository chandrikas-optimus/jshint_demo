define([
    '$',
    'global/utils',
    'components/alert/alert-ui',
], function(
    $,
    Utils,
    Alert
) {
    var accountChangePaymentInfoUI = function() {
        Utils.overrideFormFunctions('submitCreditCardEditForm');
        Alert.init();
    };

    return accountChangePaymentInfoUI;
});
