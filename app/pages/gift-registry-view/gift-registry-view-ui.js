define([
    '$',
    'global/ui/registry-ui',
    'components/add-to-cart/add-to-cart-ui'
], function($, registryUI, AddToCart) {

    var _initAddToCartButtons = function() {
        var $cartAlert = $('.js-cart-alert');
        var $genericPinny = $('.js-generic-pinny');

        $('.js-cart-item .js-flip').each(function() {
            var $addToCartFlip = $(this);
            var $cartItem = $addToCartFlip.closest('.js-cart-item');

            AddToCart.init($addToCartFlip, $cartAlert, $genericPinny, {
                getReadyProducts: function() {
                    return $cartItem;
                }
            });
        });
    };

    var giftRegistryViewUI = function() {
        _initAddToCartButtons();
        registryUI();
    };

    return giftRegistryViewUI;
});
