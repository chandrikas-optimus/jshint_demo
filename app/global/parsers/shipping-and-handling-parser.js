define([
    '$',
    'translator'
],
function($, translator) {
    // Will pull this out as a seperate parser in sizing chart
    var tableParser = function($table) {
        var scrollerTableHeader = $table.find('tr > th').map(function(_, row) {
            var $row = $(row);
            return {
                title: $.trim($row.text())
            };
        });

        var scrollerTableRows = $table.find('tr').slice(1).map(function(_, row) {
            var $row = $(row);
            var $tableData = $row.find('td');
            var $processedData = $tableData.map(function(_, data) {
                var $data = $(data);
                return {
                    content: $.trim($data.text())
                };
            });
            return {
                rowData: $processedData
            };
        });
        return {
            items: [{
                headerRows: [{
                    rowData: scrollerTableHeader
                }],
                tableRows: scrollerTableRows
            }]
        };
    };
    var scrollerTableParser = function($table, removePrice) {
        var fixedTableHeader = $table.find('tr > td:nth-child(1)').map(function(_, row) {
            var $row = $(row);
            return {
                rowData: [{
                    content: $.trim($row.text())
                }]
            };
        });
        var scrollerTableHeader = $table.find('tr > th').slice(1).map(function(_, row) {
            var $row = $(row);
            return {
                title: $.trim($row.text())
            };
        });

        var scrollerTableRows = $table.find('tr').slice(1).map(function(_, row) {
            var $row = $(row);
            var $tableData = $row.find('td').slice(1);
            var $processedData = $tableData.map(function(_, data) {
                var $data = $(data);
                return {
                    content: removePrice ? /\n*(\$[0-9.]+)$/.exec($.trim($data.text()))[1] : $.trim($data.text())
                };
            });
            return {
                rowData: $processedData
            };
        });

        return {
            table: {
                items: [{
                    headerRows: [{
                        rowData: [
                            {
                                title: $.trim($table.find('tr > th').first().text())
                            }
                        ]
                    }],
                    tableRows: fixedTableHeader
                }]
            },
            scroller: {
                items: [{
                    headerRows: [{
                        rowData: scrollerTableHeader
                    }],
                    tableRows: scrollerTableRows
                }]
            }
        };
    };
    var _parse = function($container) {
        $container.find('h3').addClass('u-margin-top-xxlg u-margin-bottom-md u-text-size-x-large');
        $container.find('br').remove();
        $container.find('p').addClass('u-margin-bottom-lg');

        return $container.map(function(_, container) {
            var $container = $(container);

            // Will replace to use removeStyle once CF-147 is merged
            $container.find('*').removeAttr('style');

            var $list = $($container.find('table:eq(1)').nextUntil('h3:contains("Shipping & Handling Rates")').get(2));
            var processedList = $list.map(function(_, list) {
                $list = $(list);
                var contentToWrap = $list.html().split('*').filter(function(item) {return item !== '';});
                return contentToWrap.map(function(content) {
                    return $('<li>*' + content + '</li>');
                });
            });
            $list.replaceWith('<ul class="u-margin-bottom-lg js-bullet-list"></ul>');
            $('.js-bullet-list').append(jQuery.makeArray(processedList));

            var $shippingTimeTable = $container.find('table').first();
            var shippingTimeTableWidth = $shippingTimeTable.find('tr').first().children().length;
            var $personalizedShippingTable = $container.find('table:eq(1)');
            var personalizedShippingTableWidth = $container.find('table:eq(1)').find('tr').first().children().length;

            return {
                heading: $container.find('p').first(),
                contentsBeforeTable: $container.find('p').first().nextUntil('table'),
                shippingTimeTableScroller: shippingTimeTableWidth > 2,
                shippingTimeTable: shippingTimeTableWidth > 2 ? scrollerTableParser($shippingTimeTable) : tableParser($shippingTimeTable),
                personalizedShippingTableHeader: $container.find('table').first().nextUntil('table'),
                personalizedShippingTableScroller: personalizedShippingTableWidth > 2,
                personalizedShippingTable: personalizedShippingTableWidth > 2 ? scrollerTableParser($personalizedShippingTable) : tableParser($personalizedShippingTable),
                personalizedShippingContent: $container.find('table:eq(1)').nextUntil('h3:contains("Shipping & Handling Rates")'),
                contentsAfterTable: $container.find('table').last().nextAll(),
                table: scrollerTableParser($container.find('table').last()),
                tableHeader: $container.find('h3:contains("Shipping & Handling Rates")')
            };
        });
    };

    return {
        parse: _parse,
        scrollerTableParser: scrollerTableParser
    };
});
