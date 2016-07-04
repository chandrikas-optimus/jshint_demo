define([
    '$',
    'global/baseView',
    'global/includes/sidenav/sidenav-context',
    'components/breadcrumbs/parsers/breadcrumbs-parser',
    'dust!pages/customer-service-about/customer-service-about'
],
function($, BaseView, sideNav, breadcrumbsParser, template) {
    return {
        template: template,
        extend: BaseView,
        includes: {
            sidenav: sideNav
        },

        context: {
            templateName: 'customer-service-about',
            pageTitle: function() {
                return $('#mainContent h1.inner').text() || 'About';
            },
            breadcrumbs: function() {
                var $crumbs = $('.breadcrumbs li');

                // Getting current page title from header since it was not passed as anchor
                return breadcrumbsParser.parse($crumbs, $('#mainContent h1.inner').text());
            },
            pageContent: function() {
                var $textContent = $('.imaForm');

                return $textContent.map(function(_, content) {
                    var $content = $(content);

                    //  Remove inline styles
                    $content.removeAttr('style');
                    $content.find('*').removeAttr('style');

                    // Adding style to content
                    $content.find('p').addClass('u-margin-bottom-md');
                    $content.find('img').addClass('u-margin-bottom-md');

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
