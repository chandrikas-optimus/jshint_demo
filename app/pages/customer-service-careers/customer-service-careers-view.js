define([
    '$',
    'global/baseView',
    'global/includes/sidenav/sidenav-context',
    'components/breadcrumbs/parsers/breadcrumbs-parser',
    'dust!pages/customer-service-careers/customer-service-careers'
],
function(
    $,
    BaseView,
    sideNav,
    breadcrumbsParser,
    template
) {
    return {
        template: template,
        extend: BaseView,
        includes: {
            sidenav: sideNav
        },

        context: {
            templateName: 'customer-service-careers',
            pageTitle: function() {
                return $('h1.inner').text();
            },
            breadcrumbs: function() {
                var $crumbs = $('.breadcrumbs li');
                return breadcrumbsParser.parse($crumbs, ($('title').last().text()));
            },
            textContent: function() {
                return $('#standard').first().addClass('c-text-content');
            }
        }

        /**
         * If you wish to override preProcess/postProcess in this view, have a look at the documentation:
         * http://adaptivejs.mobify.com/v1.0/docs/views
         */
    };
});
