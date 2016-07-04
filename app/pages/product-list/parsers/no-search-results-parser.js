define([
    '$'
], function($) {
    var parse = function($container) {
        var popularSearchItemsData = $container.find('.sli_alpha_suggested li a').map(function(_, item) {
            var $item = $(item);

            return {
                label: $item.text(),
                href: $item.attr('href')
            };
        });

        return {
            message: $container.find('#noResultsCorrected'),
            searchHeading: $container.find('.search_tips .head').text(),
            searchTips: $container.find('.search_tips ul li').addClass('c-bullet-list__item'),
            popularSearchText: $container.find('.sli_noresults_header').eq(1).text(),
            popularSearchItems: {
                items: popularSearchItemsData
            }
        };
    };

    return {
        parse: parse
    };
});
