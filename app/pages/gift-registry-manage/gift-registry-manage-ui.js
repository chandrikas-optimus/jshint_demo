define([
    '$',
    'global/ui/registry-ui',
    'components/sheet/sheet-ui',
    'components/add-to-cart/add-to-cart-ui'
],
function($, registryUI, sheet, AddToCart) {

    var _bindEvents = function() {
        var $regNavPinny = $('.js-reg-nav-pinny');
        var regNavSheet = sheet.init($regNavPinny);
        var $navSelect = $('.js-reg-nav select');

        regNavSheet.setBody($('.js-select-registry-list').html());

        $('.js-reg-nav__trigger').on('click', function(e) {
            regNavSheet.open();
        });

        $('.js-reg-nav__option').on('click', function(e) {
            var $optionLink = $(this);
            var selectedVal = $optionLink.attr('data-value');
            e.preventDefault();

            $navSelect.val(selectedVal);
            $navSelect.trigger('change');
        });
    };

    var _initAddToCartButtons = function() {
        var $cartAlert = $('.js-cart-alert');
        var $genericPinny = $('.js-generic-pinny');

        $('.js-cart-item .js-flip').each(function() {
            var $addToCartFlip = $(this);
            var $cartItem = $addToCartFlip.closest('.js-cart-item');
            var $toPurchaseStepper = $cartItem.find('.c-cart-item__stepper .c-arrange__item').last();

            AddToCart.init($addToCartFlip, $cartAlert, $genericPinny, {
                getReadyProducts: function() {
                    // Quantity stepper for 'To Purchase'
                    // (to make sure we don't accidentally count the value of the other steppers)
                    return $toPurchaseStepper;
                }
            });
        });
    };

    var giftRegistryManageUI = function() {
        _initAddToCartButtons();
        registryUI();
        _bindEvents();
    };

    return giftRegistryManageUI;
});
