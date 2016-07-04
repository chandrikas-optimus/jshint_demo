define([
    '$',
    'global/utils',
    'components/alert/alert-ui',
], function(
    $,
    Utils,
    Alert
) {

    var cleanupStyles = function() {
        $('#logonId_old').removeAttr('style');
    };

    var accountChangeEmailUI = function() {
        cleanupStyles();

        Utils.overrideFormFunctions('submitChangeEmailForm');
        Alert.init();
    };

    return accountChangeEmailUI;
});
