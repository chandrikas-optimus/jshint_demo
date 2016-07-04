define([
    '$',
], function(
    $
) {
    // NOTE: initially copied from Ballard

    var trackValid = function(currentState, newState) {
        return currentState && newState ? true : false;
    };

    var checkSelect = function($el) {
        return !/select/i.test($el.val());
    };

    var checkQty = function($el) {
        // return $el.text() !== '0';
        return $el.val() !== '0';
    };

    var checkSwatch = function($el) {
        return $el.text() !== '0';
    };

    var iterateElements = function($els, fn) {
        var state = true;
        $els.each(function(_, el) {
            var $el = $(el);
            state = trackValid(state, fn($el));
        });
        return state;
    };

    var validateAddToCart = function($parent) {
        var valid = true;
        $parent.find('.js-add-to-cart-require').each(function() {
            var $this = $(this);
            var $optionDropdowns = $this.find('.c-select select');
            var $desktopQuantity = $this.find('select');
            var $stepper = $this.find('.c-stepper__count');

            valid = trackValid( valid, iterateElements($optionDropdowns, checkSelect));
            valid = trackValid( valid, iterateElements($desktopQuantity, checkQty));
            valid = trackValid( valid, iterateElements($stepper, checkSwatch));
            // valid = trackValid( valid, iterateElements($this.find('.js-qty'), checkSwatch));
        });
        return valid;
    };

    var toggleAddToCartAndRegistryButtons = function(state) {
        var $buttons = $('.js-add-to-cart, .js-add-to-registry-container button');
        if (state) {
            $buttons.removeClass('c--disabled');
        } else {
            $buttons.addClass('c--disabled');
        }
    };

    var getReadyProducts = function() {
        var $bundleProducts = $('.js-product-options .c-stack__item input:checked').parents('.c-stack__item');
        var $singleProduct = $('.js-product-options');

        if ($bundleProducts.length) {
            return $bundleProducts.filter(function(_, product) {
                return validateAddToCart($(product));
            });
        } else if (validateAddToCart($singleProduct)) {
            return $singleProduct;
        }

        return [];
    };

    var updateAddToCartButton = function($parent) {
        setTimeout(function() {
            toggleAddToCartAndRegistryButtons(!!getReadyProducts().length);
        }, 300);
    };

    return {
        updateAddToCartButton: updateAddToCartButton,
        validate: validateAddToCart,
        getReadyProducts: getReadyProducts
    };
});
