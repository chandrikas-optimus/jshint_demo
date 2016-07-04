define([
    '$',
    'global/utils',
    'hijax',
    'pages/product-list/parsers/tile-parser',
    'dust!pages/product-list/partials/product-tiles',
    'dust!components/price/price',
    'global/parsers/price-parser',
    'global/utils/dummy-element',
    'dust!components/loading/loading'
], function(
    $,
    Utils,
    Hijax,
    tileParser,
    productTilesTemplate,
    priceTemplate,
    priceParser,
    DummyElement,
    loadingTemplate
) {

    if (Adaptive.evaluatedContext.templateName !== 'product-list') {
        return; // exit early
    }

    var $container = $('.js-product-tiles');
    var $loader = $container.find('.js-product-tiles-loader');
    var $content = $container.find('.js-product-tiles-content');

    var _animate = {
        showNewTiles: function() {
            $loader.velocity({opacity: 0}, {
                complete: function() {
                    $loader.prop('hidden', true);
                    $content.velocity({opacity: 1});
                }
            });
        },

        hideExistingTiles: function() {
            $content.velocity({opacity: 0}, {
                // Allow to interrupt existing animation
                // for scenario when you're on a page other page 1 (SLI version):
                queue: false,

                complete: function() {
                    $loader.prop('hidden', false);
                    $loader.velocity({opacity: 1});
                }
            });
        },

        showNewPhoto: function($photo, $loader, callback) {
            $loader.velocity(
                { opacity: 0 },
                {
                    // Allow to interrupt existing animation
                    queue: false,
                    // To avoid interfering with our css translate values
                    mobileHA: false,

                    complete: function() {
                        $loader.prop('hidden', true);
                        $photo.velocity(
                            { opacity: 1 },
                            { duration: 200 }
                        );

                        callback();
                    }
                }
            );
        },

        hideExistingPhoto: function($photo, $loader, callback) {
            $photo.velocity(
                { opacity: 0 },
                {
                    duration: 200,
                    // Allow to interrupt existing animation
                    queue: false,

                    complete: function() {
                        $loader.prop('hidden', false);
                        $loader.velocity(
                            { opacity: 1 },
                            // To avoid interfering with our css translate values
                            { mobileHA: false }
                        );

                        callback();
                    }
                }
            );
        },

        slideInTilesOnScroll: function($tiles) {
            /* eslint-disable */
            (function($) {
                $.fn.visible = function(partial) {
                    var $t            = $(this),
                      $w            = $(window),
                      viewTop       = $w.scrollTop(),
                      viewBottom    = viewTop + $w.height(),
                      _top          = $t.offset().top,
                      _bottom       = _top + $t.height(),
                      compareTop    = partial === true ? _bottom : _top,
                      compareBottom = partial === true ? _top : _bottom;

                    return ((compareBottom <= viewBottom) && (compareTop >= viewTop));
                };

                var win = $(window);

                $tiles.each(function(i, el) {
                    var el = $(el);
                    if (el.visible(true)) {
                        el.addClass('c--already-visible');
                    }
                });

                var ifVisibleApplyEffect = function(event) {
                    $tiles.each(function(i, el) {
                      var el = $(el);
                        if (el.visible(true)) {
                          el.addClass('c--come-in');
                        }
                    });
                };

                win
                    // make sure to bind only once
                    .off('scroll.mobify')
                    .on('scroll.mobify', ifVisibleApplyEffect);

            })(jQuery);
            /* eslint-enable */
        }
    };  // end _animate

    var _replacePhoto = function($photo, photoURL) {
        var $loader;
        loadingTemplate({class: 'c-tile__loading'}, function(err, html) {
            $loader = $(html)
                .prop('hidden', true)
                .css('opacity', 0);
        });

        $loader.appendTo($photo.closest('.c-tile__image'));

        _animate.hideExistingPhoto($photo, $loader, function() {
            // After hiding the old photo, replace it with new one
            $photo.attr('src', photoURL);
        });

        $photo.one('load', function() {
            _animate.showNewPhoto($photo, $loader, function() {
                // After revealing the new photo, scrap the loading spinner
                $loader.remove();
            });
        });
    };

    var _updateProducts = function($desktopHTML) {
        var data = $desktopHTML.find('.thumbItem').map(function() {
            return tileParser.parseSLI($(this), true);
        });

        productTilesTemplate({
            items: data,
            desktopScripts: $desktopHTML.find('script')
        }, function(err, html) {
            $content.html(html);

            window.priceAPI(
                Adaptive.evaluatedContext.isClearance,
                Adaptive.evaluatedContext.isSearchPage
            );

            $content.trigger('updateEnd.mobify');
        });
    };

    var _updatePricesAndErrors = function() {
        $content.find('.js-product-price').each(function() {
            var $self = $(this);
            var $desktopPrice = $self.find('.priceLine');
            var desktopError = $desktopPrice.find('.removed').text();
            var data = priceParser.parse($self);

            priceTemplate(data, function(err, html) {

                // Price
                if (data.priceOriginal || data.promo || data.pricingMessage) {
                    $self.find('.c-price').replaceWith(html);
                    $self.prop('hidden', false);
                }

                // Error message
                if (desktopError) {
                    $self.parents('.c-tile__content:first').find('.js-error-text')
                        .text(desktopError)
                        .prop('hidden', false);

                    // CF-468: Make unavailable items translucent
                    $self.parents('.c-tile').addClass('c--unavailable');
                }
            });
        });
    };

    // Setting hijax here _before_ desktop scripts run
    var hijax = new Hijax();
    hijax.set('productsUpdate',
        function(url) {
            return /slisearchcf/.test(url);
        },
        {
            complete: function(data, xhr) {
                // If the use search an item sku, the results may come page with a
                // JUMPTOURL, if this exists don't process the product results.
                if (/JUMPTOURL/.test(data)) { return; }

                // Use higher-res photos
                data = data.replace(/&?sizeType=SLI_GridView/ig, '');

                var $desktopHTML = $('<div>' + data + '</div>');
                _updateProducts($desktopHTML);

                if ($desktopHTML.find('#noResultsCorrected').length === 0) {
                    $('.js-no-search-results').prop('hidden', true);
                    $('.js-product-tiles-heading').hide();
                    $('.js-filters').show();
                }
            }
        }
    );

    hijax.set('pricesUpdate',
        function(url) {
            return /JSONPricingAPI/.test(url);
        },
        { complete: _updatePricesAndErrors }
    );

    $content.on('updateStart.mobify', function() {
        _animate.hideExistingTiles();

        // Scroll to top of page to reveal the new content
        $.scrollTo($('body'), {duration: 700});
    });

    $content.on('updateEnd.mobify', function() {
        _animate.showNewTiles();
        _animate.slideInTilesOnScroll($('.c-tile'));
    });



    var productTilesUI = function() {
        // By this time, the desktop scripts have been executed

        _animate.slideInTilesOnScroll($('.c-tile'));

        // Clicking a different color swatch would refresh the product photo
        $content.on('click', '.js-swatches-item', function() {
            var photoURL = $(this).attr('data-product-photo');
            var $tile = $(this).closest('.c-tile');
            var $photo = $tile.find('.c-tile__image img');

            _replacePhoto($photo, photoURL);
        });

        if (Adaptive.evaluatedContext.isWebsphere) {
            _animate.hideExistingTiles(); // no content actually, but doing this to prepare the animations

            Utils.afterAppendChild('#gwt_products_display', function($container) {
                var $desktopProducts = $container.find('.gwt-products-display-panel');

                var data = $desktopProducts.find('.gwt-product-info-panel').map(function() {
                    return tileParser.parseWebsphere($(this));
                });

                productTilesTemplate({items: data}, function(err, html) {
                    $content.html(html);
                    DummyElement.replaceAllSubstitutes($content);

                    // Hackish, and doesn't avoid downloads of original images
                    // but it'll do for now.
                    setTimeout(function() {
                        // By this time, the image src should be inserted by GWT already
                        $content.find('img').each(function() {
                            var $img = $(this);
                            var higherResPhoto = $img.attr('src').replace('$B_SubSubProd$', '');
                            $img.attr('src', higherResPhoto);
                        });
                    }, 1000);

                    _animate.showNewTiles();
                    _animate.slideInTilesOnScroll($('.c-tile'));
                });
            });
            // NOTE: if we want to intercept the image URLs, override appendChild()
            // and make sure that the images are _not_ inserted yet into the page.
        }
    };

    return productTilesUI;
});
