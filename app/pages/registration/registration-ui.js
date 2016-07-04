define([
    '$',
    'global/utils',
    'components/alert/alert-ui',
    'components/reveal/reveal-ui'
], function(
    $,
    Utils,
    Alert,
    Reveal
) {

    var registrationUI = function() {
        // Add any scripts you would like to run on the registration page only here

        Utils.overrideFormFunctions('submitUserRegistration');
        Utils.decorateErrorsAlert();

        Alert.init();
        Reveal.init();

        // Hook into desktop error Handling
        $('#gwt-error-placement-div').on('DOMNodeInserted', function(e) {
            Utils.decorateErrorsAlert();
        });
    };

    return registrationUI;
});
