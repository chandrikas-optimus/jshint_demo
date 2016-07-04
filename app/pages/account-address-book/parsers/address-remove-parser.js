define([
    '$',
    'global/utils/dummy-element'
], function($, DummyElement) {

    var _parseContent = function($context) {
        var $buttons = $context.find('.okCancelPanel .button');
        var $confirmButton = $buttons.filter('.primary');
        var $cancelButton = $buttons.filter('.secondary');

        return {
            confirmButton: DummyElement.getSubstitute($confirmButton),
            cancelButton: DummyElement.getSubstitute($cancelButton)
        };
    };

    var parse = function($context) {
        var $title = $context.find('.dialogTop .Caption');
        var $content = $context.find('.dialogContent');
        return {
            title: $title.text(),
            content: _parseContent($content)
        };
    };

    return {
        parse: parse
    };
});
