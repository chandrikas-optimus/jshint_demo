define([
    '$',
    'hijax',
    'pages/account-order-history/parsers/order-list-parser',
    'dust!pages/account-order-history/partials/order-list',

    // Partials used in template
    'dust!components/table/table'
], function(
    $,
    Hijax,
    orderListParser,
    orderListTemplate
) {
    var _decorateOrderList = function() {
        var $orderList = $('.js-order-history-list');
        var $orderListSource = $('.js-order-history-list-source');
        var orderListData = orderListParser.parse($orderListSource);

        orderListTemplate(orderListData, function(err, html) {
            $orderList.html(html);
        });
    };

    var _bindOrderListTransform = function() {
        var hijax = new Hijax();

        hijax.set(
            'order-history-list',
            function(url) {
                return /OrderHistoryJSONView/.test(url);
            }, {
                complete: function(data, xhr) {
                    // Note: cannot use dust partial here, for desktop event listeneres will be lost
                    _decorateOrderList();
                }
            }
        );
    };

    var accountOrderHistoryUI = function() {
        _bindOrderListTransform();
    };

    return accountOrderHistoryUI;
});
