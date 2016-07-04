define([
    '$'
], function($) {
    var parse = function($item) {
        var priceRegex = /\$\d+\.?\d*/;
        var $retailPrice;
        var $originalPrice;
        var $salePrice;

        var useRegex = $item.find('.priceLine').length;

        // CF-619: Add support for 3 tier promo pricing
        if ($item.find('.gwt-promo-discount-now-label').not('[aria-hidden]').length) {
            return {
                pricingMessage: $item.find('.pc'),
                promo: {
                    now: $item.find('.gwt-promo-discount-now-label').text(),
                    was: $item.find('.gwt-promo-discount-was-label').text(),
                    original: $item.find('.gwt-promo-discount-orginal-label').text()
                }
            };
        }

        // The PLP has different 3 tier promo markup :(
        if ($item.find('.priceLine .priceWas').length > 1) {
            var $priceWas = $item.find('.priceLine .priceWas');
            return {
                pricingMessage: $item.find('.pc'),
                promo: {
                    now: $item.find('.priceLine .priceNow').text().match(priceRegex),
                    was: $priceWas.eq(1).text().match(priceRegex),
                    original: $priceWas.eq(0).text().match(priceRegex)
                }
            };
        }

        // 1 tier pricing
        // PDP/BDP
        $retailPrice = $item.find('.gwt-product-detail-widget-price-column > .gwt-HTML').not('[aria-hidden]');
        // Add to cart/wishlist/registry modal
        $retailPrice = $retailPrice.add($item.find('.gwt_addtocartdiv_price'));
        // PLP
        $retailPrice = $retailPrice.add($item.find('.priceLine .price'));

        if ($retailPrice.length) {
            return {
                pricingMessage: $item.find('.pc'),
                priceOriginal: useRegex ? $retailPrice.first().text().match(priceRegex) : $retailPrice.first().text()
            };
        }


        // 2 tier pricing
        // PDP/BDP
        $originalPrice = $item.find('.gwt-product-detail-widget-price-was');
        $salePrice = $item.find('.gwt-product-detail-widget-price-now');
        // Add to cart/wishlist/registry modal
        $originalPrice = $originalPrice.add($item.find('.gwt_addtocartdive_waspricediv, .gwt_addtocartdiv_waspricediv'));
        $salePrice = $salePrice.add($item.find('.gwt_addtocartdive_nowpricediv, .gwt_addtocartdiv_nowpricediv'));
        // PLP
        $originalPrice = $originalPrice.add($item.find('.priceLine .priceWas'));
        $salePrice = $salePrice.add($item.find('.priceLine .priceNow'));

        return {
            pricingMessage: $item.find('.pc'),
            priceOriginal: useRegex ? $originalPrice.first().text().match(priceRegex) : $originalPrice.first().text(),
            priceSale: useRegex ? $salePrice.first().text().match(priceRegex) : $salePrice.first().text()
        };
    };

    return {
        parse: parse
    };
});
