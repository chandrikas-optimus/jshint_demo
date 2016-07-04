define([
    '$',
    'global/ui/cart-item-ui',
    'components/sheet/sheet-ui',
    'global/ui/tooltip-ui'
], function($, cartItemUI, sheet, tooltipUI) {
    var initSheet = function() {
        var $shippingPinny = $('.js-shipping-details-pinny');

        sheet.init($shippingPinny);

        $('.js-pinny-button').on('click', function() {
            $shippingPinny.pinny('open');
        });
    };

    var checkoutConfirmationDetailsUI = function() {
        cartItemUI();
        initSheet();
        tooltipUI();
    };

    return checkoutConfirmationDetailsUI;
});
