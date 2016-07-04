// NOTE: parser intended for the Alert component
define(['$'], function($) {
    // TODO: FYI we're going to change the component's markup later

    var maxNumOfMessages = 3;

    var parse = function($container, fn) {
        var $allMessages = fn($container);

        var $messages = $allMessages.slice(0, maxNumOfMessages);
        var $overflow = $allMessages.slice(maxNumOfMessages);

        if ($overflow.length > 0) {
            return {
                messages: $messages,
                overflow: $overflow
            };
        } else {
            return {
                messages: $messages
            };
        }

    };

    return {
        parse: parse
    };
});
