define(['$'], function($) {

    var _parse = function($suggestionContainer, urls) {
        var urls = urls;
        var $suggestions = $suggestionContainer.find('.sli_ac_suggestion, .sli_rac_container');

        return {
            suggestions: $suggestions.map(function(i, suggestion) {
                var $suggestion = $(suggestion);

                if (!$suggestion.is('.sli_ac_suggestion')) {
                    return;
                }

                return {
                    url: urls[i],
                    content: $suggestion
                };
            }),

            productHeading: $suggestionContainer.find('.sli_ac_products h2').text(),

            products: $suggestions.map(function(i, suggestion) {
                var $suggestion = $(suggestion);
                var $priceContainer = $suggestion.find('.rac_priceLine');

                if (!$suggestion.is('.sli_rac_container')) {
                    return;
                }

                return {
                    url: urls[i],
                    image:{
                        src: $suggestion.find('.sli_ac_image').attr('src')
                    },
                    heading: $suggestion.find('h3').html(),
                    price: {
                        salePrice: $priceContainer.find('.priceNow').length ? $priceContainer.find('.priceNow').text() : '',
                        retailPrice: $priceContainer.find('.priceWas').length ? $priceContainer.find('.priceWas').text() : $priceContainer.find('.price').text()
                    },
                    priceContainer: $priceContainer.attr('hidden', 'hidden')
                };
            })
        };
    };

    return {
        parse: _parse
    };
});
