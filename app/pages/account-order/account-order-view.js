define([
    '$',
    'global/baseView',
    'components/breadcrumbs/parsers/breadcrumbs-parser',
    'pages/account-order/parsers/order-parser',
    'dust!pages/account-order/account-order'
],
function(
    $,
    BaseView,
    breadcrumbsParser,
    orderParser,
    template
) {
    return {
        template: template,
        extend: BaseView,

        context: {
            templateName: 'account-order',
            breadcrumbs: function() {
                var $backLink = $('.orderDetailsUtil .backLink');
                return breadcrumbsParser.parse($backLink);
            },
            pageTitle: function() {
                return $('#mainContent h1').first().attr('title') || 'Order Details';
            },
            orderSummary: function() {
                var $orderSummary = $('#mainContent .orderSummary');
                return orderParser.parseSummaryLedger($orderSummary);
            },

            // Note: multiple shippings are possible, define groups by shoppingCart data
            orderGroups: function() {
                var $shoppingCarts = $('#mainContent .shoppingCart');

                return $shoppingCarts.map(function(_, shoppingCart) {
                    var $shoppingCart = $(shoppingCart);
                    var $shippingInfo = $($shoppingCart.prevUntil('div', 'p[class^="od-"]').get().reverse());
                    var $total = $shoppingCart.find('> table > tfoot');

                    return {
                        orderShipping: orderParser.parseShippingInfo($shippingInfo),
                        orderItems: orderParser.parseItems($shoppingCart),
                        orderTotal: orderParser.parseTotal($total),
                    };
                });
            }
        }
    };
});
