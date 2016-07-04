define([
    '$',
    'components/alert/alert-ui',
    'global/parsers/alert-parser'
], function(
    $,
    Alert,
    alertParser
) {
    var _displayConfiguratorErrors = function() {
        Alert.init();

        var $errors = $('#gwt-error-placement-div_PC').clone();
        var errorData = alertParser.parse(
            $errors,
            function($container) {
                return $container.find('.gwt-HTML').each(function(_, msg) {
                    var $msg = $(msg);
                    $msg.text($msg.text().substr(0, 1).toUpperCase() + $msg.text().substr(1));
                });
            }
        );

        $('.js-error-messages').prop('hidden', false);

        errorData.class = 'c--fixed';

        Alert.update($('.c-alert'), errorData);
    };

    return {
        displayConfiguratorErrors: _displayConfiguratorErrors
    };
});
