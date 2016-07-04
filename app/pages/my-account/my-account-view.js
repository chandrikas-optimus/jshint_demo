define([
    '$',
    'global/baseView',
    'dust!pages/my-account/my-account'
],
function($, BaseView, template) {
    return {
        template: template,
        extend: BaseView,

        context: {
            templateName: 'my-account',
            pageTitle: function() {
                return $('.myAccount h1').text();
            },
            intro: function() {
                var $intro = $('.overviewWrapper .imaForm p').last().attr('style', null);
                $intro.find('br').replaceWith(' ');
                return $intro;
            },
            passwordResetText: function() {
                return $('.reset-password-msg').next('p').text();
            },
            links: function() {
                var iconMap = {
                    'order history': 'history',
                    'change email ': 'mail',
                    'change password': 'password',
                    'change payment info': 'payment',
                    'address book': 'address',
                    'email preferences': 'settings',
                    'wish registry': 'registry',
                    'wish list': 'favourite'
                };

                return $('.myAccount a').map(function() {
                    var $link = $(this);
                    return {
                        href: $link.attr('href'),
                        prefix: iconMap[$link.text().toLowerCase()],
                        content: $link.text(),
                        suffix: 'arrow-forward'
                    };
                });
            },
            signOutButton: function(context) {
                var $signOutButton = $('[id="login"] a:first');

                return $signOutButton.length ? $signOutButton : false;
            }
        }
    };
});
