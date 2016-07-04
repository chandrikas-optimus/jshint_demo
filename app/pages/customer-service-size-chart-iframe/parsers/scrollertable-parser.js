define(['$'], function($) {
    var tableParser = function($table) {
        var fixedTable = $table.find('tr > td:nth-child(1) > strong').map(function(_, row) {
            var $row = $(row);
            return {
                rowData: [{
                    content: $.trim($row.text())
                }]
            };
        });

        var scrollerTableHeader = $table.find('tr:eq(2)').find('strong').map(function(_, row) {
            var $row = $(row);
            return {
                title: $.trim($row.text())
            };
        });

        var scrollerTableRows = $table.find('tr').slice(4).map(function(_, row) {
            var $row = $(row);
            var $tableData = $row.find('td').slice(1);
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

        // Process data to remove unnecessary Items
        var dataPreserveRegex = /^[0-9]|^nb|^kid/;
        var headerExcludeRegex = /^us/;

        return {
            headerText: $('<h4 class="c-heading c--4 c--no-border">' + fixedTable[0].rowData[0].content + '</h4>'),
            scrollerTable: {
                table: {
                    items: [{
                        headerRows: [{
                            rowData: [
                                {
                                    title: (fixedTable[1].rowData[0].content.match(dataPreserveRegex)) ? 'Size/Age' : fixedTable[1].rowData[0].content
                                }
                            ]
                        }],
                        tableRows: (fixedTable[1].rowData[0].content.match(dataPreserveRegex)) ? fixedTable.slice(1) : fixedTable.slice(2)
                    }]
                },
                scroller: {
                    items: [{
                        headerRows: [{
                            rowData: (scrollerTableHeader[0].title.match(headerExcludeRegex)) ? scrollerTableHeader.slice(1) : scrollerTableHeader
                        }],
                        tableRows: scrollerTableRows
                    }]
                }
            }
        };
    };
    var parse = function($table) {
        return tableParser($table);
    };
    return {
        parse: parse
    };
});
