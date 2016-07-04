define([
    '$',
    'global/parsers/size-chart-pinny-parser',
    'dust!global/partials/size-chart/size-chart-main-page'
], function($, sizeChartParser, SizeChartTemplate) {


    var $loader = $('<div class="c-loading c--small"><p class="u-visually-hidden">Loading...</p><div class="bounce1 c-loading__dot c--1"></div><div class="bounce2 c-loading__dot c--2"></div><div class="bounce3 c-loading__dot c--3"></div></div>');
    var currentChartURL;
    var $sizeChartContent;
    var $titleContainer;
    var _showSizeChart;

    var _getFullUrl = function(partialHref) {
        var urlPartialMatch = /[^\/]+.html/.exec(currentChartURL);

        if (urlPartialMatch) {
            return currentChartURL.replace(urlPartialMatch[0], partialHref);
        }
    };

    var _bindEvents = function() {
        $sizeChartContent.find('.js-tab-select').on('change', function(e) {
            var $selected = $(this).children(':selected');
            var newHref = $selected.attr('data-tab-href');
            var url = _getFullUrl(newHref);

            e.stopPropagation();

            _showSizeChart(url);
        });

        $('.js-size-chart-link').on('click', function(e) {
            e.preventDefault();
            var url = _getFullUrl($(this).attr('href'));
            _showSizeChart(url, true);
        });

        $('.js-size-chart-tab').on('click', function(e) {
            e.preventDefault();
            var url = _getFullUrl($(this).attr('href'));
            _showSizeChart(url, false);
        });
    };

    _showSizeChart = function(sizeChartUrl, updatePinnyHeader) {
        $sizeChartContent.html($loader);
        currentChartURL = sizeChartUrl;

        $.ajax({
            url: sizeChartUrl,
            complete: function(xhr) {
                var $response = $(xhr.responseText);
                var templateContent = sizeChartParser.parse($response.filter('table'), currentChartURL);

                if (updatePinnyHeader) {
                    $titleContainer.html($response.filter('title').text());
                }

                new SizeChartTemplate(templateContent, function(err, html) {
                    $sizeChartContent.html(html);
                    _bindEvents();
                });
            }
        });
    };

    var _init = function(url, $container, $header) {
        var addTitle = false;
        $sizeChartContent = $container.find('.js-size-chart-body');

        if ($header && $header.length) {
            addTitle = true;
            $titleContainer = $header;
        } else {
            $titleContainer = $sizeChartContent.prev('.c-sheet__header').find('.c-sheet__title');
        }

        _showSizeChart(url, addTitle);
    };


    return {
        init: _init
    };
});
