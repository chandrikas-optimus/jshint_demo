define([
    '$',
    'hijax',
    'dust!pages/product-list/partials/no-search-results',
    'pages/product-list/parsers/no-search-results-parser'
], function(
    $,
    Hijax,
    noSearchResultsTemplate,
    noSearchResultsParser
) {

    if (Adaptive.evaluatedContext.templateName !== 'product-list') {
        return; // exit early
    }

    var _renderContent = function($desktopHTML) {
        var noSearchResultsData = noSearchResultsParser.parse($desktopHTML);

        // http://stagewcs.chasing-fireflies.com/slisearchcf?sli_path=ProductSearch2&sli_env=stagewcs&sli_countryCode=US&sli_currencyCode=USD&w=dsafaf&ts=ajax&sli_view_override=grid
        noSearchResultsTemplate(noSearchResultsData, function(err, html) {
            $('.js-no-search-results')
                // TODO: need to figure out when to hide it later?
                .prop('hidden', false)
                .html(html);
        });

        $('.js-product-tiles-heading').text($desktopHTML.find('#sli_noresults_products').text());
        $('.js-product-tiles-heading').show();
    };

    // Setting hijax here _before_ desktop scripts run
    var hijax = new Hijax();
    hijax.set('noSearchResults',
        function(url) {
            return /slisearchcf/.test(url);
        },
        {
            complete: function(data, xhr) {
                var $desktopHTML = $('<div>' + data + '</div>');
                var isNoSearchResults = $desktopHTML.find('#noResultsCorrected').length > 0;

                if (isNoSearchResults) {
                    _renderContent($desktopHTML);

                    if ($('.js-filters-bellows').children().length === 0) {
                        $('.js-filters').hide();
                    }

                    // Trigger custom event, in case other scripts need to know
                    $('body').trigger('noSearchResults.mobify');
                }
            }
        }
    );

    var noSearchResultsUI = function() {
        // By this time, the desktop scripts have been executed

    };

    return noSearchResultsUI;
});
