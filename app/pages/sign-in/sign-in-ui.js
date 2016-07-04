define([
    '$',
    'global/utils',
    'global/utils/dom-operation-override',
    'components/alert/alert-ui',
    'components/reveal/reveal-ui',
    'components/tabs/tabs-ui',
    'pages/sign-in/reset-password-ui'
], function(
    $,
    Utils,
    domOverride,
    Alert,
    Reveal,
    Tabs,
    resetPasswordUI
) {

    var showOnPageErrors = function() {
        var hasErrors = false;

        // Determine if there are any loaded errors on the page.
        hasErrors = $('#gwt-error-placement-div .gwt-csb-error-panel').length > 0;

        if (hasErrors) {
            Utils.decorateErrorsAlert();
        } else {
            // It's possible this UI script ran before the gwt application had time
            // to set the page errors. So wire up a `domAppend` event to show the
            // error if and when it's added to the page.
            domOverride.on('domAppend', '.gwt-csb-error-panel', function() {
                Utils.decorateErrorsAlert();
            });
        }
    };

    var signInUI = function() {
        // Add any scripts you would like to run on the signIn page only here

        Utils.overrideFormFunctions('submitUserLogon');

        // Show any errors that are loaded after the page load.
        showOnPageErrors();

        Alert.init();
        Reveal.init();
        Tabs.init();

        resetPasswordUI();

    };

    return signInUI;
});
