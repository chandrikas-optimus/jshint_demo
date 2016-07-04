define([
    '$',
    'pages/account-order-history/order-list-ui'
], function(
    $,
    orderListUI
) {
    var accountOrderHistoryUI = function() {
        orderListUI();
    };

    return accountOrderHistoryUI;
});
