define([
    '$',
    'pages/product/validate-add-to-cart-ui',
    'components/add-to-cart/add-to-cart-ui'
], function(
    $,
    Validation,
    AddToCart
) {

    var $addToCartButton;
    var $addToRegistryButton;
    var $addToCartFlip = $('.js-call-to-actions .c-flip');


    var _syncQuantity = function() {
        var $steppersCount = $('.c-stepper .c-stepper__count');

        if ($steppersCount.length > 1 ) {
            $steppersCount.each(function(_, count) {
                var $count = $(count);

                $count.text($('.csb-quantity-listbox[name="' + $count.closest('div[class*="quantity_"]').attr('class') + '"]').find('option:selected').text());
            });
        } else {
            $steppersCount.text($('.csb-quantity-listbox option:selected').text());
        }
    };

    var _transformButtons = function() {
        // Add bag icon to the checkout button
        $('<svg class="c-icon c-button__icon">' +
          '<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-bag">' +
          '</use></svg>').insertBefore($addToCartButton.find('span'));

        // Remove icon from text
        var $addToRegistrySpan = $addToRegistryButton.find('span');
        var addToRegistryText = $addToRegistrySpan.length > 0 ?
            /^([ \w]+)/ig.exec($addToRegistrySpan.text())[0] :
            '';
        $addToRegistrySpan.text(addToRegistryText);

        // Add heart icon to the registry button
        $('<svg class="c-icon c-button__icon">' +
          '<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-favourite">' +
          '</use></svg>').insertBefore($addToRegistrySpan);

        $addToCartButton
            .addClass('c-button c--full-width js-add-to-cart')
            .appendTo('.js-add-to-cart-container');

        $addToRegistryButton
            .addClass('c-button c--outline c--full-width')
            .appendTo('.js-add-to-registry-container');
    };

    var _initAddToCartButton = function() {
        var $cartAlert = $('.js-cart-alert');
        var $genericPinny = $('.js-generic-pinny');

        AddToCart.init($addToCartFlip, $cartAlert, $genericPinny, {
            getReadyProducts: Validation.getReadyProducts,
            callbackAfterLoading: function() {
                // Note: once desktop modal is closed,
                // desktop script would reset the size/color dropdowns
                // Must synchronize our stepper count with desktops select dropdown for quantity after
                _syncQuantity();
            },
            callbackAfterLongDelay: function() {
                // Revalidate the fields
                Validation.updateAddToCartButton($('.js-product-options').parent());
            },
            checkErrors: function() {
                // CF-532: Check for errors before adding to cart
                return $('.gwt-csb-error-panel').contents().length < 1;
            }
        });
    };



    var init = function($productDetailPanel) {
        var $productDetailPanel = $productDetailPanel || $('.gwt-product-detail-buttons-panel');

        $addToCartButton = $productDetailPanel.find('.button.primary');
        $addToRegistryButton = $productDetailPanel.find('.button.secondary');

        // We are on the bundle pdp
        if ($addToCartButton.length < 1 || $addToRegistryButton.length < 1) {
            $addToCartButton = $productDetailPanel.first().find('.gwt-add-to-cart-btn');
            $addToRegistryButton = $productDetailPanel.first().find('button.secondary');
        }

        _transformButtons();

        // Bind our handlers now

        _initAddToCartButton();
    };

    return {
        init: init
    };
});
