define([
    '$',
    'global/baseView',
    'global/includes/sidenav/sidenav-context',
    'components/breadcrumbs/parsers/breadcrumbs-parser',
    'dust!pages/customer-service-size-chart/customer-service-size-chart'
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
            templateName: 'customer-service-size-chart',
            pageTitle: function() {
                return 'Size charts & How to Measure';
            },
            frame: function() {
                return $('iframe[x-src*="sizecharts"]').removeAttr('width height scrolling border style').addClass('js-sizechart-frame');
            },
            breadcrumbs: function() {
                var $crumbs = $('.breadcrumbs li');

                // Getting current page title from header since it was not passed as anchor
                return breadcrumbsParser.parse($crumbs, ($('title').last().text() || 'Chasing Fireflies Size Charts'));
            }
        }

        /**
         * If you wish to override preProcess/postProcess in this view, have a look at the documentation:
         * http://adaptivejs.mobify.com/v1.0/docs/views
         */
    };
});
