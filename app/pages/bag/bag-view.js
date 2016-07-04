/**
 * Bag View
 */

define([
    '$',
    'global/baseView',
    'dust!pages/bag/bag',
    'pages/bag/parsers/products-parser',
    'global/parsers/checkout/totals-parser'
],
function($, baseView, template, productsParser, totalsParser) {
    return {
        template: template,
        extend: baseView,
        preProcess: function(context) {
            if (baseView.preProcess) {
                context = baseView.preProcess(context);
            }

            $('[id*="gwt_order_item_uber"] .JSON').addClass('x-skip').parent().addClass('x-skip');

            // CF-645: We have to include this json or the free gift modal breaks
            $('#gwt_recently_viewed .JSON').addClass('x-skip').parent().addClass('x-skip');

            return context;
        },
        context: {
            templateName: 'bag',

            pageTitle: function() {
                return 'Shopping Bag';
            },
            emptyBag: function() {
                return $('.data div:first-child').text().replace(/cart/g, 'bag');
            },
            requiredLabels: function() {
                return $('#gwt_order_item_uber_disp_strings, #analyticsDataShop5');
            },
            cartContainer: function() {
                var $form = $('#ShopCartForm');

                return $form.length ? {
                    form: $form,
                    hiddenInputs: $form.find('input[type="hidden"]'),
                    products: productsParser.parse($form)
                } : null;
            },
            checkoutButton: function() {
                return $('.button.primary').addClass('c-button c--full-width u-margin-bottom');
            },
            continueButton: function() {
                return $('.button.secondary').addClass('c-button c--full-width c--outline');
            },
            hiddenForms: function() {
                var $hiddenForms = $('form.hidden');
                return $hiddenForms.add($('#gwt_view_name').parent());
            },
            promoCodeForm: function() {
                return $('#PromotionCodeForm');
            },
            promoCodeContent: function(context) {
                if (!context.cartContainer) {
                    return;
                }

                var $promoContainer = context.cartContainer.form.find('.promoCode');

                return {
                    label: $promoContainer.find('.showPromoCodeInfo').text().replace(':', ''),
                    tooltipContent: $promoContainer.find('.showPromoCodeInfoPopup'),
                    input: $promoContainer.find('#promoCode'),
                    applyButton: $promoContainer.find('.button').addClass('c-button c--outline c--full-width u-margin-top-lg js-apply-button').attr('disabled', 'true'),
                    errorContainer: $promoContainer.find('.error').addClass('u-margin-top-sm u-text-error'),
                };
            },
            giftFlagForm: function() {
                return $('#ItemGiftFlagUpdateForm');
            },
            itemQuantityUpdateForm: function() {
                return $('#ItemQuantityUpdateForm');
            },
            recommendationsContainer: function() {
                return $('#gwt_recommendations_cart_1').attr('hidden', 'true');
            },
            totals: function(context) {
                if (!context.cartContainer) {
                    return;
                }

                var $totalsContainer = context.cartContainer.form.find('.totals');
                var $note = $totalsContainer.find('.messages');

                $totalsContainer.find('.estimateShipping_tr').remove();

                $note.parent().remove();

                return {
                    note: $note.children(),
                    ledgerContent: totalsParser.parse($totalsContainer)
                };
            }
        }
    };
});
