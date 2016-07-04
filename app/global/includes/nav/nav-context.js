define([
    '$',
    'global/includes/nav/parsers/navitron-parser'
], function($, navitronParser) {
    return {
        context: {
            items: function() {
                var $categories = $('#flyout > .menuItem');

                return navitronParser.parse($categories);
            },
            subMenu: function() {
                // CF-96: Optin and forcefully decide on the order for these
                //        elements to appear in our navigation.
                var optin = [];
                var $subMenu = $('.SubMenu');

                if ($subMenu.find('#login:contains("Sign Out")').length) {
                    optin = [ '#myAccount', '#login', '#orderStatus', '#emailSignupLink' ];
                } else {
                    optin = [ '#login', '#orderStatus', '#emailSignupLink' ];
                }

                return optin.map(function(idSelector, _) {
                    var $item = $subMenu.find(idSelector);
                    var $anchor = $item.find('a');

                    return {
                        href: $anchor.attr('href'),
                        content: $anchor.text()
                    };
                });
            }
        }
    };
});
