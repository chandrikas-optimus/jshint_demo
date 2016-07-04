define([
    '$',
    'global/ui/tooltip-ui',
    'pages/checkout-review-and-payment/ui/payment-ui',
    'pages/checkout-review-and-payment/ui/review-ui',
    'components/reveal/reveal-ui'
], function(
    $,
    tooltipUI,
    paymentUI,
    reviewUI,
    revealUI
) {
    var bindEvents = function() {
        // CF-573: Show page loader when selecting shipping options
        $('.js-shipping-option').on('click', function(e) {
            $('.js-page-loading').removeAttr('hidden');
        });
    };

    var checkoutReviewAndPaymentUI = function() {
        var addHeaderToTooltips = true;
        tooltipUI(addHeaderToTooltips);
        reviewUI.setUpSection();
        paymentUI.init();
        revealUI.init();

        bindEvents();
    };

    return checkoutReviewAndPaymentUI;
});
