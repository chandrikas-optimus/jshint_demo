define(['$'], function($) {
    var emailSubscribeUI = function() {
        // Set iframe height
        // Listen to message from child window
        window.addEventListener('message', function(e) {
            $('.t-email-subscribe__iframe iframe').css('height', e.data + 'px');
        }, false);
    };

    return emailSubscribeUI;
});
