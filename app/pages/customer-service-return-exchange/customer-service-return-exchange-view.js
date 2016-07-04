define([
    '$',
    'global/baseView',
    'global/includes/sidenav/sidenav-context',
    'components/breadcrumbs/parsers/breadcrumbs-parser',
    'dust!pages/customer-service-return-exchange/customer-service-return-exchange',
    'removeStyle'
],
function($, BaseView, sideNav, breadcrumbsParser, template) {
    return {
        template: template,
        extend: BaseView,
        includes: {
            sidenav: sideNav
        },

        context: {
            templateName: 'customer-service-return-exchange',
            pageTitle: function() {
                // Static image again, so have to hard code
                return 'Returns & Exchanges';
            },
            breadcrumbs: function() {
                var $crumbs = $('.breadcrumbs li');
                // Getting current page title from header since it was not passed as anchor
                return breadcrumbsParser.parse($crumbs, ($('title').last().text() || 'Returns & Exchanges at Chasing Fireflies'));
            },
            pageContent: function() {
                var $textContent = $('#standard');

                return $textContent.map(function(_, content) {
                    var $content = $(content);

                    // Remove header image
                    $content.find('h1.custom').remove();

                    $content.find('ol').addClass('c-number-list u-margin-bottom-lg');
                    $content.find('ol li').addClass('c-number-list__item');
                    $content.find('p').addClass('u-margin-bottom-lg');
                    $content.find('h3').addClass('c-heading c--2 u-margin-bottom-lg');

                    //  Remove inline styles
                    $content.removeStyle();
                    return $content;
                });

            }
        }

        /**
         * If you wish to override preProcess/postProcess in this view, have a look at the documentation:
         * http://adaptivejs.mobify.com/v1.0/docs/views
         */
    };
});
