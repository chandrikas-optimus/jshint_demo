define([
    '$',
    'global/baseView',
    'dust!pages/email-subscribe-form/email-subscribe-form',
    'pages/email-subscribe-form/parsers/email-subscribe-form-parser'
],
function($, BaseView, template, emailSubscribeFormParser) {
    return {
        template: template,
        extend: BaseView,

        context: {
            templateName: 'email-subscribe-form',
            emailForm: function() {
                return emailSubscribeFormParser.parse($('form[action*="fireflies-email"]'));
            },
            success: function() {
                var $unsubform = $('#form1 p:contains("sorry to see you go")');
                return ($('#success_page').length > 0) || ($unsubform.length > 0);
            },
            successContent: function() {
                var $content = $('<div class="c-section"><strong></strong></div>');

                $('#success_page p, #form1 p').contents().appendTo($content.find('strong'));

                return $content;
            }
        }
    };
});
