define([
    '$',
    'global/baseView',
    'dust!pages/email-subscribe/email-subscribe'
],
function($, BaseView, template) {
    return {
        template: template,
        extend: BaseView,

        context: {
            templateName: 'email-subscribe',
            pageHeaderText: function() {
                return $('.custom').attr('title');
            },
            emailInfo: function() {
                var $emailInfo = $('.infoPages').clone().removeClass().addClass('c-text-content');

                $emailInfo.find('img').remove();
                $emailInfo.find('p').not(':first').remove();
                $emailInfo.find('ul').addClass('c-bullet-list');
                $emailInfo.find('li').addClass('c-bullet-list__item');

                return $emailInfo;
            },
            emailForm: function() {
                return $('.emailSubscribeIframe, .emailUnsubscribeIframe');
            },
            privacyInfo: function() {
                var $privacyInfo = $('.infoPages p').not(':first').not(':last');

                $privacyInfo.first().html($privacyInfo.first().html().replace(/<br>/g, ' '));

                return $privacyInfo.contents();
            }
        }

        /**
         * If you wish to override preProcess/postProcess in this view, have a look at the documentation:
         * http://adaptivejs.mobify.com/v1.0/docs/views
         */
    };
});
