define([
    '$',
    'dust!pages/category-list/partials/shop-by-category-list'
], function($) {
    var parse = function($categories) {
        var categoriesData = $categories.map(function(_, category) {
            var $category = $(category);

            return {
                href: $category.attr('href'),
                name: $category.text()
            };
        });

        return {
            class: 'js-categories-sheet',
            effect: 'sheetBottom',
            coverage: '100%',
            disableMask: true,
            headerContent: 'Shop by Category',
            bodyClass: 'u-padding u--none',
            content: {
                data: {
                    categories: categoriesData
                },
                contentTemplate: 'pages/category-list/partials/shop-by-category-list'
            }
        };
    };

    return {
        parse: parse
    };
});
