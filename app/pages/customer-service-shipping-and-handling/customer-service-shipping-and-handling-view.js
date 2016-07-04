define([
    '$',
    'global/baseView',
    'global/includes/sidenav/sidenav-context',
    'components/breadcrumbs/parsers/breadcrumbs-parser',
    'global/parsers/shipping-and-handling-parser',
    'dust!pages/customer-service-shipping-and-handling/customer-service-shipping-and-handling'
],
function(
    $,
    BaseView,
    sideNav,
    breadcrumbsParser,
    shippingInfoParser,
    template
) {

    return {
        template: template,
        extend: BaseView,
        includes: {
            sidenav: sideNav
        },

        context: {
            templateName: 'customer-service-shipping-and-handling',
            pageTitle: function() {
                return $('h1.shippingInfoHeader').text() || 'Shipping & Handling';
            },
            breadcrumbs: function() {
                var $crumbs = $('.breadcrumbs li');

                // Getting current page title from header since it was not passed as anchor
                return breadcrumbsParser.parse($crumbs, $('h1.shippingInfoHeader').text());
            },
            shippingInfo: function() {
                var $container = $('.borderLine').addClass('u-padding');
                return shippingInfoParser.parse($container);
            }
        }

    };
});
