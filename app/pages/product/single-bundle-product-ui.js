define([
    '$',
    'global/utils',
    'global/ui/wishlist-modal-ui',
    'pages/product/add-to-cart-registry-ui',
    'pages/product/options-ui',
    'components/reveal/reveal-ui',
    'dust!components/price/price',
    'components/sheet/sheet-ui'
], function(
    $,
    Utils,
    wishlistUI,
    AddToCartRegistry,
    ProductOptions,
    Reveal,
    priceTemplate,
    Sheet
) {
    var isDesktopContentReady = false;

    var _initPrice = function($target) {

        var pricingData = {};
        var $price1 = $('.gwt-product-detail-top-price').filter(function() {
            // price of a product item that isn't in the cross-sell carousels
            return !$(this).closest('.carouselTile').length;
        });
        if ($price1.length) {
            // example: http://stagewcs.chasing-fireflies.com/kids-personalized-low-top-chuck-taylors/194354
            pricingData.priceOriginal = $price1.first().text();
            // Removed not("[style]") due to this part of markup will become like <div style>$25</div> on safari

        } else if ($('.gwt-promo-discount-was-label').length) {
            // CF-619: 3 tier promo pricing
            // example BDP: http://devwcs.chasing-fireflies.com/personalized-vintage-kitty-doll-pj-27s/sale/toys-sale/174679
            // example PDP: http://devwcs.chasing-fireflies.com/polynesian-princess-doll-costume/sale/toys-sale/155081
            // A certain promo must be enabled; see ticket for details

            pricingData.promo = {
                now: $('.gwt-promo-discount-now-label').first().text(),
                was: $('.gwt-promo-discount-was-label').not('[aria-hidden]').first().text(),
                original: $('.gwt-promo-discount-orginal-label').first().text()
            };

        } else if ($('.gwt-product-detail-widget-price-holder > .gwt-HTML').first().text().length > 0) {
            // example: http://stagewcs.chasing-fireflies.com/mens-cowardly-lion-costume/costumes-dress-up/family-costumes/wizard-of-oz/158077
            pricingData.priceOriginal = $('.gwt-product-detail-widget-price-holder > .gwt-HTML').first().text();

        } else {
            // example: http://stagewcs.chasing-fireflies.com/zippy-mini-luge/sale/toys-sale/11529
            pricingData.priceOriginal = $('.gwt-product-detail-widget-price-was').first().text();
            pricingData.priceSale = $('.gwt-product-detail-widget-price-now').first().text();
        }

        priceTemplate(pricingData, function(err, html) {
            $target.html(html);
        });
    };

    var _productDetailProducts = function() {
        return $('.gwt-product-detail-widget');
    };

    var initBundleModals = function() {

        var $sheets = $('.js-product-detail');
        var sheets = Sheet.init($sheets, {disableScrollTop: true});

        $('.js-product-detail-link').on('click', function(event) {
            var linkedId = $(event.target).attr('link-id');
            var pinny = sheets.$el.filter('#' + linkedId).pinny('open');
        });
    };

    var initBundleMagnifik = function() {
        var $magnifik = $('.js-magnifik');
        var $zoom = $('.js-zoom');
        $magnifik.magnifik({
            stageHTML: function() {
                var closeIcon = '<svg class="c-icon "><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-delete"></use></svg>';
                return '<div class="' + this._getClass('canvas') + '"><div class="m-close c-zoom c--top-right">' + closeIcon + '</div><img class="'
                + this._getClass('thumb') + '"><img class="'
                + this._getClass('full') + '"></div>';
            }
        });
        $zoom.on('click', function(e) {
            var $magnifik = $(e.target.parentElement).parent().find('.js-magnifik');
            $magnifik.find('img').trigger('click');
        });
    };

    var init = function() {
        Utils.afterAppendChild('#fb-root', function() {
            if (isDesktopContentReady) {
                return;
            }
            isDesktopContentReady = true;

            AddToCartRegistry.init();

            _initPrice($('.js-pricing'));

            if (_productDetailProducts().length <= 1) {
                // We have a single PDP
                ProductOptions.init();

            } else {
                // We have a bundle PDP
                var productOptionsInterval = setInterval(function() {
                    // CF-456:
                    // We need to wait for these thumbnails src to be ready
                    // in order to avoid error in bundle-item-parser.js
                    if ($('.gwt-pdp-collection-thumbnail-image').attr('src')) {

                        clearInterval(productOptionsInterval);

                        ProductOptions.init();

                        // Do extra init for bundle PDP
                        initBundleMagnifik();
                        initBundleModals();
                        Reveal.init();

                        $('.bellows.bundledItems').bellows({
                            opened: function(e, ui) {
                                ui.item.find('.c-stepper__count').text('0');
                                ui.item.find('.js-stepper-increase').click();
                                ui.item.find('.js-zoom-container').removeAttr('hidden');
                                ui.item.find('input').prop('checked', true);
                            },
                            closed: function(e, ui) {
                                ui.item.find('.c-stepper__count').text('1');
                                ui.item.find('.js-stepper-decrease').click();
                                ui.item.find('.js-zoom-container').attr('hidden', 'hidden');
                                ui.item.find('input').prop('checked', false);
                            }
                        });
                    }
                }, 200);
            }

        });
    };

    return {
        init: init
    };
});
