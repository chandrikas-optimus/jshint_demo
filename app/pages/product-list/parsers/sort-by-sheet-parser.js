define([
    '$',
    'pages/product-list/parsers/sort-by-list-parser',
    'dust!pages/product-list/partials/sort-by-list'
], function($, sortByListParser) {
    var parse = function($container) {
        return {
            class: 'js-sort-by-sheet',
            effect: 'sheetBottom',
            coverage: '100%',
            headerContent: 'Sort By',
            bodyClass: 'u-padding-none ',
            closeClass: 'js-cancel-sort-by',
            content: {
                data: {
                    filters: sortByListParser.parse($container)
                },
                contentTemplate: 'pages/product-list/partials/sort-by-list'
            },
        };
    };

    return {
        parse: parse
    };
});
