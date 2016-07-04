define([
    '$',
    'global/checkoutBaseView',
    'dust!pages/checkout-review-and-payment/checkout-review-and-payment',
    'global/parsers/checkout/address-parser',
    'global/parsers/checkout/items-shipping-parser',
    'global/parsers/checkout/cart-item-parser',
    'global/parsers/checkout/totals-parser',
    'global/parsers/shipping-and-handling-parser'
],
function(
    $,
    BaseView,
    template,
    addressParser,
    itemsShippingParser,
    cartItemParser,
    totalsParser,
    shippingInfoParser
) {

    var _decorateCardID = function($tooltip) {
        $tooltip.removeAttr('style');
        $tooltip.find('[style]').removeAttr('style');
    };

    var _parseRow = function($label, $tooltip, labelText) {

        if (labelText) {
            $label.html($label.html().replace('Card Identification Number', labelText));
        }

        $label.siblings('#cvv-container').addClass('t-checkout-review-and-payment__cvv');

        return {
            input: $label.siblings('input, #cvv-container').addClass('c-input'),
            label: $label.addClass('c-label'),
            select: $label.siblings('select'),
            inputScript: $label.siblings('script'),
            tooltip: $tooltip
        };
    };

    var cardTypes = {
        'American Express': 'amex',
        'amex': '',
        'Visa': 'visa',
        'Discover': 'discover',
        'Master Card': 'mastercard',
        'JCB': 'jcb'
    };

    // Desktop uses PrototypeJS which has this function
    // CVV desktop scripts calls setValue to switch whether CVV value should
    // come from iFrame or an <input>
    var _addSetValueFunction = function() {
        Element.prototype.setValue = function(value) {
            this.value = value;
        };
    };

    return {
        template: template,
        extend: BaseView,
        preProcess: function(context) {
            if (BaseView.preProcess) {
                context = BaseView.preProcess(context);
            }

            $('[id*="gwt_order_item_uber"] .JSON').addClass('x-skip').parent().addClass('x-skip');

            return context;
        },
        postProcess: function(context) {
            if (BaseView.postProcess) {
                context = BaseView.postProcess(context);
            }

            var steps = context.header.progressBar.steps;
            var shippingStep = steps[0];
            var paymentStep = steps[1];


            shippingStep.status = 'c--completed';
            shippingStep.statusText = 'Completed';


            paymentStep.status = 'c--current-step';

            context.footer.hasReturnButton = true;

            _addSetValueFunction();

            return context;
        },
        context: {
            templateName: 'checkout-review-and-payment',
            hiddenForms: function() {
                var $hiddenForms = $('form.hidden');
                return $hiddenForms.add($('#gwt_view_name').parent()).remove();
            },
            selectAddressLabels: function() {
                return $('#gwt_address_select');
            },
            requiredLabels: function() {
                return $('#mainContent').children('.nodisplay, [id*="gwt_errmsg"]');
            },
            pleaseWaitContainer: function() {
                return $('#pleaseWait').attr('hidden', 'true');
            },
            giftMessages: function() {
                return $('#gift_box_reset_message, #gwt_confirmation_title');
            },
            requiredForms: function() {
                return $('#ShipModeUpdateForm, #AlternateShipModeUpdateForm, #AddressUpdateForm, #OrderCopyForm, #payPalForm, #selectedPaymentMethodForm').remove();
            },
            mergedOrderNotice: function() {
                var $message = $('.mergedOrderMessage');
                return $message.text();
            },
            errorContainer: function() {
                return $('#ok-placement-div');
            },
            specialDate: function() {
                var $container = $('.eventDate-dlog');
                var $datePickerButton = $container.find('.date-Picker-Button');

                $datePickerButton.addClass('c-field__calendar-icon js-date-picker-trigger');
                // Remove the JS that focuses the input
                $datePickerButton.attr('onclick', $datePickerButton.attr('onclick').replace(/jQuery\(\'[\w\s\#\.]+\'\)\.focus\(\);/, ''));

                return {
                    containerID: 'eventdate_div',
                    infoText: $container.find('.eventDateLabel').text(),
                    hiddenInput: $container.find('#datePickerBasic').attr('hidden', 'true'),
                    input: $container.find('#datePicker').addClass('c-input'),
                    button: $datePickerButton
                };
            },
            birthdayReminders: function() {
                var $container = $('.orderReviewRelativesBirthDays');
                return {
                    title: $container.find('.orderReviewRelativesBirthDaysContentHeader').text(),
                    infoText: $container.find('.orderReviewRelativesBirthDaysContent'),
                    formContainer: $container.find('.orderReviewRelativesBirthDaysSection')
                };
            },
            paymentForm: function(context) {
                var $form = $('#creditCardForm').remove();
                var $expiryRow = $form.find('#exp-date-row');
                var $ctaContainer = $form.find('#processOrderContainer');
                var $cancelBtn = $ctaContainer.find('#processOrderCancelButton');
                var $emailOptIn = $form.find('.emailOptIn');
                var $paymentMethodLabel = $form.find('#pay_method_id_label');
                var cardTypeInputLabel = cardTypes[$paymentMethodLabel.next().val()];
                var $finalTotal = $('#order_total_table').find('tr').last();
                var $creditCardPaymentType = $form.find('.creditCard #payment-type-holder');
                var $paypalPaymentType = $form.find('.paymentOption.payPal');
                var $cardIDLabel = $form.find('#card_id_number_label');
                var $paymentErrors = $form.find('#payment-error-cvv');

                // CF-720
                $paymentErrors = $paymentErrors.add($('#topErrorMessages'));

                context.footer.returnButtonAction = $cancelBtn.attr('onclick');

                return {
                    form: $form,
                    sectionTitle: $form.find('h3').text(),
                    // This hidden input will be converted to a text input if the cvv iframe fails to load
                    // So we need to place it with the cvv iframe
                    cvvInput: $form.find('#card_id_number').remove(),
                    hiddenInputs: $form.find('input[type="hidden"], .nodisplay'),
                    paymentError: $paymentErrors,
                    creditCardPaymentType: {
                        input: $creditCardPaymentType.find('#credit'),
                        label: $creditCardPaymentType.find('label').html('Credit Card')
                    },
                    paypalPaymentType: {
                        input: $paypalPaymentType.find('input'),
                        label: $paypalPaymentType.find('label'),
                        tooltipLink: $paypalPaymentType.find('.whatIsPayPalLink a')
                    },
                    paymentMethod: _parseRow($paymentMethodLabel),
                    cardType: cardTypeInputLabel,
                    ccNumber: _parseRow($form.find('#account_label')),
                    cardID: _parseRow($cardIDLabel, $form.find('#showCardId')),
                    expiry: {
                        label: $expiryRow.find('#expire_month_label').addClass('c-label'),
                        month: $expiryRow.find('#expire_month'),
                        year: $expiryRow.find('#expire_year'),
                        yearLabel: $expiryRow.find('#expire_year_label')
                    },
                    saveCC:_parseRow($form.find('#ccsave-holder label')),
                    emailOptIn: {
                        label: $emailOptIn.find('label').addClass('c-label'),
                        input: $emailOptIn.find('input').addClass('js-skip-disable')
                    },
                    ctas: {
                        container: $ctaContainer,
                        cancel: $cancelBtn,
                        placeOrder: $ctaContainer.find('.primary'),
                        placeOrderBottom: $('#processBottom')
                    },
                    finalTotal: {
                        label: $finalTotal.find('.grandLabel').text(),
                        price: $finalTotal.find('td').last().find('strong').text()
                    }
                };
            },
            cardIDTooltip: function(context) {
                return _decorateCardID(context.paymentForm.form.find('#showCardId'));
            },
            notifyStop: function() {
                return $('#notifyStop');
            },
            giftCartForm: function() {
                var $form = $('#giftCardForm').remove();
                var $label = $form.find('#giftcard-label');

                $label.html($label.text());

                return {
                    form: $form,
                    hiddenInputs: $form.find('input[type="hidden"]'),
                    input: $form.find('#account'),
                    sectionTitle: 'Add Gift Card / coupon (optional)',
                    label: $label.addClass('c-label'),
                    applyButton: $form.find('.button').addClass('c-button c--full-width u-margin-top-lg').attr('disabled', 'true'),
                    tooltip: $form.find('#giftingInfo'),
                    tooltipTitle: 'Gift Card / Coupon Number'
                };
            },
            promoCodeForm: function() {
                var $form = $('#promotionCodeForm').remove();
                var $label = $form.find('#promo-code-label');

                $label.html($label.text());

                return {
                    form: $form,
                    hiddenInputs: $form.find('input[type="hidden"]'),
                    input: $form.find('#promoCode'),
                    sectionTitle: 'Add promotion code (optional)',
                    label: $label.addClass('c-label'),
                    applyButton: $form.find('#promoButton').addClass('c-button c--full-width u-margin-top-lg').attr('disabled', 'true'),
                    errorMessage: $form.find('#not-valid-error-message'),
                    tooltip: $form.find('#promoCodeInfo'),
                    tooltipTitle: 'Promotion Code'
                };
            },
            billingAddress: function() {
                var $container = $('#billingAddress');
                return addressParser.parse($container, true, true);
            },
            shippingAddress: function(context) {
                var $shippingAddress = context.billingAddress.container.next(':not(.orderReviewContentSpot)');

                if ($shippingAddress.length) {
                    return addressParser.parse($shippingAddress, true, true);
                }
            },
            shipToStore: function() {
                return $('#shipToStoreAddressContainter');

            },
            shipToMutipleAddresses: function() {
                var $multipleAddressesButton = $('.lineAndOrderSummary .button').last();

                if (!$multipleAddressesButton.hasClass('disabled')) {
                    return $multipleAddressesButton.addClass('c-button c--outline c--full-width u-margin-top-md u-margin-bottom-xlg');
                }
            },
            totals: function() {
                var $totalsTable = $('#order_total_table');
                var totals = totalsParser.parse($totalsTable);

                totals.title = $('.orderSummaryHeader:first').text();

                return totals;
            },
            grandTotal: function(context) {
                return context.totals.ledgerEntries.last()[0].number;
            },
            shippingInfo: function() {
                var $shippingDetails = $('.detShipInfo').first();

                return {
                    headerContent: $shippingDetails.find('.shippingSubrealmHeader').text(),
                    content: {
                        contentTemplate: 'global/partials/shipping-and-handling',
                        data: shippingInfoParser.parse($shippingDetails.find('.shippingSubrealmWrap'))
                    }
                };
            },
            orderItems: function(context) {
                var $itemsTable = $('[id="orderItemTable"]');

                if ($itemsTable.length === 1) {
                    var cartItems = cartItemParser.parse($('.orderItemRow'), true);
                    return {
                        items: cartItems
                    };
                }

                return itemsShippingParser.parse($itemsTable, true);
            },
            hiddenInputs: function() {
                return $('input[type="hidden"], #shipModes, #multiShipTos, #giftCardRedeemed, #promotionApplied, #gwt_user_state');
            }
        }

    };
});
