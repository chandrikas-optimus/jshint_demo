define([
    '$',
    'global/utils/dom-operation-override',
    'global/parsers/alert-parser',
    'components/alert/alert-ui'
], function($, domOverride, alertParser, Alert) {
    var _initDuplicateEmail = function() {
        var $duplicateInput = $('.js-duplicate input');

        // Disable the input to avoid tab errors
        $duplicateInput.attr('disabled', 'true');

        $('.js-fill-duplicate input').on('blur', function(e) {
            $duplicateInput.val($(this).val());
        });
    };

    var _transformModal = function($modal) {
        var $table = $modal.find('> div > table');
        var $newContent = $('<div>');
        var $whyRegister = $table.find('.why_register');
        var $emailSignUp = $table.find('#sendmeemails');
        var headingText = $modal.find('.Caption').text();
        $modal.addClass('js-transformed');

        $whyRegister.addClass('u-margin-bottom-md');
        $whyRegister.find('ul').addClass('c-list');
        $whyRegister.find('li').addClass('c-list__item');

        $newContent.append($('<h2 class="u-margin-bottom-sm">').text(headingText));
        $newContent.append($table.find('.gwt-guest-reg-error-panel').attr('hidden', 'true'));
        $newContent.append($whyRegister);

        $table.find('.spot').each(function(i, inputContainer) {
            var $inputContainer = $(inputContainer);
            var $fieldRow = $('<div class="c-field-row">');
            var $fieldContainer = $('<div class="c-field"><div class="c-field__input">');
            var $input = $inputContainer.find('input');

            $fieldContainer.append($inputContainer.find('label').addClass('c-label'));
            $fieldContainer.append($input.addClass('c-input'));

            if ($input.is('#email')) {
                $fieldContainer.addClass('js-fill-duplicate');
            } else if ($input.is('#logonIdVerify')) {
                $fieldContainer.addClass('js-duplicate');
                $fieldRow.attr('hidden', 'true');
            }

            $fieldRow.append($fieldContainer);
            $newContent.append($fieldRow);
        });

        $emailSignUp.addClass('c-field__input');
        $emailSignUp.wrap('<div class="c-field c--check-radio">');
        $emailSignUp.find('label').addClass('c-label');
        $emailSignUp.find('input')
            .addClass('c-input')
            .wrap('<div class="c-check-radio">')
            .after($('<svg class="c-icon c-check-radio__icon"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-checkmark"></use></svg>'));

        $newContent.append($('<div class="c-field-row">').append($emailSignUp.parent()));

        $newContent.append($table.find('.primary').addClass('c-button c--full-width c--primary u-margin-top-md'));

        $table.replaceWith($newContent);
        _initDuplicateEmail();
    };

    var _modalAdded = function() {
        var $registerModal = $(arguments[0]);

        $registerModal.removeAttr('style');
        _transformModal($registerModal);

        $('.js-registration-container').html($registerModal);
    };

    var _bindEvents = function() {
        domOverride.on('domAppend', '.guest-checkout-reg-modal:not(.js-transformed)', _modalAdded);
    };

    var _errorHandler = function($errors) {
        var errorData = alertParser.parse(
            $errors,
            function($container) {
                return $container.children();
            }
        );
        var $errorsContainer = $('.js-error-messages');

        errorData.class = 'c--fixed';

        $errorsContainer.prop('hidden', false);
        Alert.update($('.c-alert'), errorData);
    };

    var _showError = function() {
        var $error = Adaptive.evaluatedContext.orderError;

        if ($error.text().trim() !== '') {
            _errorHandler($('<div>').html($error));
        }
    };

    var _registrationError = function(errors) {
        var $errors = $(errors);

        $('.js-registration-container .errortxt').closest('.c-field').addClass('c--error');
        _errorHandler($errors);
    };


    var _sendTransactionData = function() {
        try {
            var Transaction = Mobify.analytics.transaction;
            var orderInfo = window.trkpix_json;
            var orderNumber = orderInfo.trkpix_merchant_order_id;
            var shippingMatch = /\d+\.\d+/.exec(orderInfo.trkpix_order_shipping_formatted);
            var taxMatch = /\d+\.\d+/.exec(orderInfo.trkpix_order_tax_formatted);
            var tax = taxMatch ? taxMatch[0] : '0';
            var shipping = shippingMatch ? shippingMatch[0] : '0';
            var orderVal = orderInfo.trkpix_order_value;
            var revenue = parseFloat(orderVal) + parseFloat(tax) + parseFloat(shipping);
            var items = [];


            $.each(orderInfo.trkpix_oItems, function(i, orderItem) {
                var item = orderItem.oitem;
                var categories = item.catPath;
                items.push({
                    name: item.name,
                    sku: item.itemsProductmfpartNo,
                    price: item.price,
                    quantity: item.qty,
                    category: (categories && categories[0]) ? categories[0].path : ''
                });
            });

            Transaction.init(Mobify.analytics.ua, 'mobifyTracker');


            if (orderNumber && items.length) {

                Transaction.send({
                    transactionID: orderNumber,
                    affiliation: 'Chasing Fireflies',
                    transaction: {
                        revenue: revenue.toString(),
                        shipping: shipping,
                        tax: tax,
                        currency: orderInfo.trkpix_order_currency
                    },
                    transactionItems: items
                });
            }
        } catch (e) {
            console.error('unable to send transaction data', e);
        }
    };
    var checkoutOrderConfirmationUI = function() {
        _bindEvents();
        _showError();
        _sendTransactionData();

        Alert.init();

        domOverride.on('domAppend', '.gwt-csb-error-panel', _registrationError);
    };

    return checkoutOrderConfirmationUI;
});
