define([
    '$',
    'global/utils/dummy-element'
], function(
    $,
    DummyElement
) {

    var MAX_NUM_OF_SWATCHES_SHOWN = 6;

    var _higherResSwatch = function(url) {
        return url.replace(/\$[^$]+\$/, '');
    };
    var _higherResPhoto = function(url) {
        if (url) {
            return url.replace(/&?sizeType=SLI_GridView/i, '');
        }
    };
    var _getHigherResPhoto = function($el) {
        if (!$el.is('img')) {
            $el = $el.find('img');
        }
        $el.attr('x-src', _higherResPhoto($el.attr('x-src')));
        $el.attr('src', _higherResPhoto($el.attr('src')));

        return $el;
    };

    var _getSwatches = function($container, hrefForMore) {
        var $swatches = $container.find('.swatches li');

        var swatches = $swatches.map(function() {
            var $swatch = $(this).find('img');
            return {
                swatchURL: _higherResSwatch($swatch.attr('src') || $swatch.attr('x-src')),
                photoURL: _higherResPhoto($swatch.attr('alt')),
                swatchName: $swatch.attr('title')
            };
        });

        if (swatches.length > MAX_NUM_OF_SWATCHES_SHOWN) {
            // Minus 1 to leave room for the 'More' swatch
            swatches = swatches.slice(0, MAX_NUM_OF_SWATCHES_SHOWN - 1);
            return {
                swatches: swatches,
                linkToMoreSwatches: hrefForMore
            };
        } else {
            return {
                swatches: swatches
            };
        }

    };

    var _getPrices = function($container) {
        var $price = $container.find('.gwt-product-info-panel-avail');
        if (!$price.length) {
            $price = $container.find('.priceLine .price');
        }
        if ($price.length > 0) {
            return {
                priceOriginal: $price.text().match(/\$.*/),
                hidePricesInitially: false
            };
        } else {
            return {
                priceOriginal: $container.find('.was-price').text() || $container.find('.priceLine').find('.priceWas').text(),
                priceSale: $container.find('.now-price').text() || $container.find('.priceLine').find('.priceNow').text(),
                hidePricesInitially: false
            };
        }
    };

    var _getError = function($container) {
        var text = $container.find('.gwt-product-info-panel-avail').text();
        var hasCurrency = /\$\d/.test(text);
        return hasCurrency ? null : text;
    };

    // $container is just a _single_ tile
    var parseSLI = function($container, hidePricesInitially) {
        var $tileImage = $container.find('.thumbImage a');

        return {
            tileClasses: 'c--horizontal',
            tileImage: _getHigherResPhoto($tileImage),
            tileTitle: $container.find('.prodName a').wrapInner('<span class="c-tile__title">').children(),
            tileHref: $tileImage.attr('href'),
            price: hidePricesInitially ? {
                // This is dynamic price, so grabbing the container for now
                priceOriginal: $container.find('.priceLine'),
                hidePricesInitially: hidePricesInitially
            } : _getPrices($container),
            exclusive: $container.find('.exclusive').text(),
            error: _getError($container),
            swatches: _getSwatches($container, $tileImage.attr('href')),
            hideErrorInitially: true
        };
    };

    // $container is just a _single_ tile
    var parseWebsphere = function($container) {
        var $tileImage = DummyElement.getSubstitute(
            _getHigherResPhoto($container.find('.gwt-browse-product-image').parent('a'))
        );
        var $titleLink = $container.find('.gwt-sub-category-info-panel-link');

        $titleLink.addClass('c-tile__title');

        return {
            tileClasses: 'c--horizontal',
            tileImage: $tileImage,
            // Use the title link not the image, since the image isn't always there
            tileHref: $titleLink.attr('href'),
            tileTitle: DummyElement.getSubstitute($titleLink),
            price: _getPrices($container),
            exclusive: $container.find('.exclusive').text(),
            // "This product is no longer available"
            error: _getError($container),
            hideErrorInitially: false
        };
    };

    return {
        parse: parseSLI,
        parseSLI: parseSLI,
        parseWebsphere: parseWebsphere
    };
});
