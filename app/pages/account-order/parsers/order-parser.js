define(['$'], function($) {

    var parseItems = function($context) {
        var $items = $context.find('table tbody tr');

        return $items.map(function(_, item) {
            var $item = $(item);
            var $cells = $item.find('td');

            var product = $cells.filter('.colProd').text();
            var productName = product.split('/');

            return {
                sku: productName[0],
                product: productName[1],
                quantity: $cells.filter('.qty').text(),
                status: $cells.filter('.tracking').text(),
                shippingMethod: $cells.filter('.shipmethod').text(),
                total: $cells.filter('.totals').text()
            };
        });
    };

    var parseShippingInfo = function($context) {
        if (!$context.length) {
            return false;
        }

        var $title = $context.filter('.od-ship');
        var $name = $context.filter('.od-name');
        var $address = $context.filter('.od-address-line');
        var $city = $context.filter('.od-city');
        var $state = $context.filter('.od-state');
        var $zip = $context.filter('.od-zip');
        var $country = $context.filter('.od-country');

        return {
            title: $title.text(),
            name: $name.text(),
            address: $address.text(),
            city: $city.text(),
            state: $state.text(),
            zip: $zip.text(),
            country: $country.text()
        };
    };

    var parseSummaryLedger = function($context) {
        return $context.map(function(_, summary) {
            var $summary = $(summary);

            return {
                ledgerEntries: $summary.children('p').map(function(_, item) {
                    var $item = $(item);

                    return {
                        entryModifierClass: 'c--emphasize-number',
                        description: $item.find('b').remove().text(),
                        number: $item.text()
                    };
                })
            };
        });
    };

    var parseTotal = function($context) {
        return $context.map(function(_, total) {
            var $total = $(total);
            var $totalRows = $total.find('tr.prod');
            var $disclaimer = $total.find('.pricedisclaimerindicatorrow td').html();

            return {
                ledgerEntries: $totalRows.map(function(_, item) {
                    var $item = $(item);

                    return {
                        description: $item.find('td.txtR').first().text(),
                        number: $item.find('td.totals').text()
                    };
                }),
                disclaimer: $disclaimer
            };
        });
    };

    return {
        parseItems: parseItems,
        parseShippingInfo: parseShippingInfo,
        parseSummaryLedger: parseSummaryLedger,
        parseTotal: parseTotal
    };
});
