define([
    '$',
    'global/parsers/checkout/cart-item-parser',
    'global/parsers/checkout/address-parser'
], function($, cartItemParser, addressParser) {
    // order recap and order confirmation has different markup of where the shipping address is
    // this adapter aims to unify data for the parser
    var _addressAdapter = function($itemTable) {
        if ($itemTable.prev('.sts-address').length) {
            return $itemTable.prev('.sts-address');
        } else if ($itemTable.closest('table').prev('.line').find('.vcard').length) {
            return $itemTable.closest('table').prev('.line').find('.vcard');
        }

        return;
    };

    var _parse = function($itemsTable, isButton, showHeading) {
        return $itemsTable.map(function(i, itemTable) {
            var $itemTable = $(itemTable);
            var $itemRow = $itemTable.is('.orderItemRow') ? $itemTable : $itemTable.find('.orderItemRow');
            var orderItems = cartItemParser.parse($itemRow);
            var $address = _addressAdapter($itemTable);

            return {
                heading: $address ? showHeading : false,
                items: orderItems,
                address: $address ? addressParser.parse($address, true) : '',
                itemCount: $address ? orderItems.length : ''
            };
        });
    };

    return {
        parse: _parse
    };
});
