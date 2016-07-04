define([
    '$',
    'global/ui/promo-code-ui',
    'components/sheet/sheet-ui',
    'global/utils/dom-operation-override',
    'global/parsers/alert-parser',
    'pages/checkout-review-and-payment/ui/birthday-reminder-ui',
    'global/utils',
    'components/alert/alert-ui',
    'global/utils/selector-extensions',
    'validator'
], function($, promoCodeUI, sheet, domOverride, alertParser, birthdayReminderUI, Utils, Alert) {

    var cardTypes = {
        'amex': 'American Express',
        'visa': 'Visa',
        'discover': 'Discover',
        'mastercard': 'Master Card',
        'jcb': 'JCB'
    };
    var $datePickerPinny = $('.js-date-picker-pinny');
    var $chevronIcon = $('<svg class="c-icon "><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-arrow-downward"></use></svg>');
    var $datePickerContainer;
    var datePickerSheet;

    var _bindEvents = function() {
        var $cardSelect = $('.js-card-type select');
        var ccIDSheet = sheet.init($('.js-cvv-pinny'));

        $cardSelect.removeAttr('onchange');

        jQuery('.js-cc-input input').validateCreditCard(function(result) {
            var $input = $(this);
            var $container = $input.closest('.js-cc-input-container');
            var type = result.card_type;

            if ($input.val().indexOf('*') > -1) {
                // The user has saved CC info, so it's been pre-filled
                return;
            }

            if (type && type.name) {
                $container.addClass('c--' + type.name);
                $cardSelect.children('[value="' + cardTypes[type.name] + '"]').prop('selected', true);
                $cardSelect.trigger('change');
                // Hide all other card ID info blocks (CC ID tooltip)
                $('.js-ccID-tooltip .js-card-id-block').not('.js-' + type.name).addClass('u-visually-hidden');
            } else {
                $container.attr('class', 'c-field__credit-card u-margin-top-sm js-cc-input-container');
                $('.js-ccID-tooltip .js-card-id-block.u-visually-hidden').removeClass('u-visually-hidden');
            }
        });

        $('.js-toggle').on('click', function(e) {
            var $button = $(this);
            var $target = $button.next($button.attr('data-target'));
            e.preventDefault();

            $button.attr('hidden', 'true');
            $target.removeAttr('hidden');

        });

        $('.js-apply-input input').on('focus input keyup', function() {
            var $input = $(this);
            var $button = $input.parent().next().find('button');

            if ($input.val() !== '') {
                $button.removeAttr('disabled');
            } else {
                $button.attr('disabled', 'true');
            }
        });

        $('.js-form-toggle').on('click', function() {
            var $toggle = $(this);
            var $target = $($toggle.attr('data-target'));

            $target.siblings('.js-form-container').attr('hidden', 'true');
            $target.removeAttr('hidden');
        });

        $('.js-submit').on('click', function(e) {
            $('.js-desktop-place-order .primary').triggerGWT('click');
        });

        $('.js-ccID-trigger').on('click', function(e) {
            ccIDSheet.open();
        });
    };

    var _updateFieldsAndButtons = function() {
        var $ccField = $('#accountcc');
        var $placeOrderButton = $('.js-place-order .primary');
        var cvvStyles = {
            'box-sizing': 'border-box',
            width: '100%',
            height: '44px',
            'min-height': '44px',
            padding: '0 12px',
            border: '1px solid #dcdbd8',
            'border-radius': '0',
            'background-color': '#fff',
            color: 'inherit',
            'font-family': '"Fira Sans", "Roboto", "Helvetica Neue", sans-serif',
            'font-size': '15px',
            'line-height': '22px',
            '-webkit-appearance': 'none',
            '-webkit-tap-highlight-color': 'transparent'
        };

        $ccField.removeAttr('onkeyup');
        $ccField.removeAttr('pattern');
        $ccField.attr('type', 'tel');

        $placeOrderButton.addClass('c-button c--primary c--full-width js-submit');
        $placeOrderButton.removeAttr('disabled');
        $placeOrderButton.removeClass('disabled');

        if (window.cvvLogicEnabled) {
            // Desktop JS function that allows us to apply inline styles to the CVV field in an iframe
            window.ccTokenizerSocket.setCVVFieldStyleByObject(cvvStyles);
        }

        $('#cvv-container iframe').on('load', function(e) {
            $(this).height('44px');
        });
    };

    var _checkForErrors = function() {
        var $otherErrors = $('#ok-placement-div .gwt-csb-error-panel, #not-valid-error-message[style*="block"], #payment-error-cvv[style*="block"], #topErrorMessages[style*="block"]');

        if ($otherErrors.length) {
            var errorData = alertParser.parse(
                $otherErrors,
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


    var _overrideSubmit = function() {
        var _submitForm = window.submitCreditCardForm;

        window.submitCreditCardForm = function() {
            $('.js-payment-block').find('input, select').removeAttr('disabled');
            var result = _submitForm.apply(this, arguments);

            return result;
        };
    };

    var _transformPicker = function($datePickerContainer) {
        var $pickerHeader = $datePickerContainer.find('.ui-datepicker-header');
        var $next = $pickerHeader.find('.ui-datepicker-next');
        var $prev = $pickerHeader.find('.ui-datepicker-prev');

        if ($pickerHeader.hasClass('js--transformed')) {
            return;
        }

        $next.find('.ui-icon').html('<svg class="c-icon "><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-arrow-forward"></use></svg>');
        $prev.find('.ui-icon').html('<svg class="c-icon "><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-arrow-backward"></use></svg>');

        $pickerHeader.find('.ui-datepicker-title')
            .addClass('c-arrange c--gutters')
            .after($next);

        $pickerHeader.find('select').each(function(i, select) {
            var $select = $(select);

            $select.wrap('<div class="c-datepicker__select c-select c-arrange__item">');
            $select.after($chevronIcon.clone());
        });

        $pickerHeader.addClass('c-arrange c--justify-between js--transformed');

        $pickerHeader.find('.ui-datepicker-title').wrap('<div class="c-arrange__item c--shrink">');
    };

    var _setUpDatePicker = function() {
        var _selectDate = jQuery.datepicker._selectDate;
        var _updateDatePicker = jQuery.datepicker._updateDatepicker;
        $datePickerContainer = $('#ui-datepicker-div');

        $datePickerContainer.addClass('c-datepicker');

        datePickerSheet = sheet.init($datePickerPinny);

        datePickerSheet.setBody($datePickerContainer);


        $('.js-date-picker-trigger').on('click', function() {
            $datePickerContainer.removeAttr('style');
            datePickerSheet.open();
        });

        jQuery.datepicker._selectDate = function() {
            var result = _selectDate.apply(this, arguments);

            datePickerSheet.close();

            return result;
        };

        jQuery.datepicker._updateDatepicker = function() {
            var result = _updateDatePicker.apply(this, arguments);
            _transformPicker($datePickerContainer);

            return result;
        };

    };

    var _init = function() {
        _setUpDatePicker();
        promoCodeUI.init();
        _updateFieldsAndButtons();
        _bindEvents();
        _overrideSubmit();
        _checkForErrors();
        domOverride.on('domAppend', '.gwt-csb-error-panel', _checkForErrors);
        birthdayReminderUI();
        Utils.overrideFormFunctions('submitCreditCardForm');
        Alert.init();
    };

    return {
        init: _init
    };
});
