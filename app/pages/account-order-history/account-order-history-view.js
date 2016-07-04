define([
    '$',
    'global/baseView',
    'components/breadcrumbs/parsers/breadcrumbs-parser',
    'dust!pages/account-order-history/account-order-history',
    'dust!components/table/table'
],
function(
    $,
    BaseView,
    breadcrumbsParser,
    template
) {
    return {
        template: template,
        extend: BaseView,

        context: {
            templateName: 'account-order-history',
            breadcrumbs: function() {
                return breadcrumbsParser.parseAccount();
            },
            pageTitle: function() {
                return $('#mainContent h1').first().attr('title') || 'Order History';
            },
            intro: function() {
                return $('#act > p');
            },
            orderContainer: function() {
                return $('#orderHistory');
            }
        }
    };
});
