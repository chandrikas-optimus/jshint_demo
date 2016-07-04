define([
    '$'
], function($) {

    var _parseHeaders = function($headersTable) {
        return $headersTable.map(function(_, headers) {
            var $headers = $(headers).find('th, td');

            return  {
                rowData: $headers.map(function(_, header) {
                    var $header = $(header);

                    return {
                        title: $header.text()
                    };
                })
            };
        });
    };

    var _parseItems = function($items) {
        return $items.map(function(_, item) {
            var $item = $(item);
            var $cells = $item.find('td');

            return {
                rowData: $cells.map(function(_, cell) {
                    var $cell = $(cell);
                    var $link = $cell.find('a');

                    return {
                        content: $link.length ? $link : $cell.text()
                    };
                })
            };
        });
    };


    var parse = function($context) {
        // Create structure for table component partial
        var $tables = $context.find('.gwt-order-history-widget-mainPanel');

        return $tables.map(function(_, table) {
            var $table = $(table);
            var $headers = $table.find('.gwt-order-history-widget-headerRow');
            var $items = $table.find('.gwt-order-history-widget-flexTable tr');

            return {
                modifierClass: 'c--default',
                headerRows: _parseHeaders($headers),
                tableRows: _parseItems($items)
            };
        });
    };

    return {
        parse: parse
    };
});
