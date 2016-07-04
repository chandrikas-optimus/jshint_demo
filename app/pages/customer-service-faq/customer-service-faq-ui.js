define(['$', 'global/includes/sidenav/sidenav-ui'], function($, sideNavUI) {

    var hashChanged = function($FAQBellows, hash) {
        if (hash) {
            var $bellowsItem = $(hash);
            $FAQBellows.bellows('open', $bellowsItem);
        }
    };

    var customerServiceFaqUI = function() {
        sideNavUI.init();

        var $FAQBellows = $('.bellows[data-bellows-manual-init]');
        $FAQBellows.bellows();

        // Make bellows behave like desktop anchor
        if ('onhashchange' in window) { // event supported?
            window.onhashchange = function() {
                hashChanged($FAQBellows, window.location.hash);
            };
        } else { // event not supported:
            var storedHash = window.location.hash;
            window.setInterval(function() {
                if (window.location.hash !== storedHash) {
                    storedHash = window.location.hash;
                    hashChanged($FAQBellows, storedHash);
                }
            }, 100);
        }
        hashChanged($FAQBellows, window.location.hash);
    };

    return customerServiceFaqUI;
});
