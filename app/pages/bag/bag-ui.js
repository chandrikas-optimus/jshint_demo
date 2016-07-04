define([
    '$',
    'global/ui/tooltip-ui',
    'global/ui/cart-item-ui',
    'global/utils',
    'components/alert/alert-ui',
    'global/parsers/alert-parser',
    'dust!components/loading/loading',
    'pages/bag/free-gift-ui'
],
function(
    $,
    tooltipUI,
    cartItemUI,
    Utils,
    Alert,
    alertParser,
    LoadingTmpl,
    freeGiftUI
) {
    var $freeGiftPinny = $('.js-free-gift-pinny');
    var $detailsPinny = $('.js-details-pinny');
    var freeGiftSheet;
    var detailsSheet;

    var setScrollCookie = function() {
        document.cookie = 'scroll_y=' + window.scrollY;
    };

    var initStepper = function() {
        $('.js-stepper').on('click', function(e) {
            var $stepper = $(this);
            var isMinus = $stepper.hasClass('js--minus');
            var $stepperVal = $stepper.siblings('.js-val');
            var newVal = parseInt($stepperVal.text());
            var $selectContainer = $stepper.siblings('.js-qty-select');
            var $select = $selectContainer.find('select');

            e.preventDefault();

            if (isMinus) {
                newVal--;

                if (newVal === 1) {
                    $stepper.addClass('c--disabled');
                }
            } else {
                newVal++;
                if (newVal === $selectContainer.data('maxquantity')) {
                    $stepper.addClass('c--disabled');
                }
            }

            $stepperVal.html(newVal);
            $('.js-page-loading').removeAttr('hidden');
            setScrollCookie();
            $select.val(newVal);
            $select[0].dispatchEvent(new CustomEvent('change'));
        });
    };

    var bindEvents = function() {
        var $tooltipPinny = $('.js-tooltip-pinny');
        $('.js-apply-input').keypress(function(e) {
            var code = (e.keyCode ? e.keyCode : e.which);
            if ((code === 13) || (code === 10)) {
                e.preventDefault();
            }
        });
        $('.js-apply-input').on('focus input keyup', function() {
            var $input = $(this);
            var $button = $('.js-apply-button');

            if ($input.val() !== '') {
                $button.removeAttr('disabled');
            } else {
                $button.attr('disabled', 'true');
            }
        });

        $('.js-gift-tooltip-button, .js-promo-tooltip-button').on('click', function() {
            $tooltipPinny.closest('.pinny').removeClass('c--notice');
        });

        // CF-576: Loading state for checkout button
        $('.button.primary').on('click', function() {
            var $this = $(this);

            new LoadingTmpl({ class: 'c--small' }, function(err, out) {
                $this.html(out);

                // Hide / Show button to trigger loading CSS animation
                $this.hide();
                $this.show();
            });
        });
    };

    var checkForPromoErrors = function() {
        var $promoErrors = $('.js-promo-errors');
        var $visibleError = $promoErrors.children('[style*="display:block"]');

        if ($visibleError.length) {
            var errorData = alertParser.parse(
                $visibleError,
                function($container) {
                    return $container.children();
                }
            );
            var $errorsContainer = $('.js-error-messages');

            errorData.class = 'c--fixed';

            $errorsContainer.prop('hidden', false);
            Alert.update($('.c-alert'), errorData);
        }
    };

    var styleEmptyBag = function() {
        $('.t-bag__empty p:contains("Add to shopping bag")').html(function(_, html) {
            return html.replace(/(Add to shopping bag)/g, '<strong class="u-text-capitalize">$1</strong>');
        });
    };

    var checkScrollPosition = function() {
        var pageY = /scroll_y=(\d+)/.exec(document.cookie);


        if (pageY) {
            $('body').scrollTo({
                offset: pageY[1]
            });
            document.cookie = 'scroll_y=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        }
    };

    var bagUI = function() {
        checkScrollPosition();
        styleEmptyBag();
        initStepper();
        tooltipUI();
        bindEvents();
        cartItemUI();
        checkForPromoErrors();
        Alert.init();

        freeGiftUI();
    };

    return bagUI;
});
