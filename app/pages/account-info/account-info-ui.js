define([
    '$',
    'global/utils',
    'components/alert/alert-ui',
    'global/parsers/alert-parser',
    'components/reveal/reveal-ui',
    'dust!components/reveal/reveal',
    'dust!pages/account-info/partials/address',
    'dust!components/field-row/field-row',
    'global/utils/dummy-element'
], function(
    $,
    Utils,
    Alert,
    alertParser,
    Reveal,
    revealTemplate,
    addressTemplate,
    fieldRowTemplate,
    DummyElement
) {

    var _showSideBySide = function(selector1, selector2, modifierClass) {
        var $field1 = $(selector1).closest('.c-field');
        var $field2 = $(selector2).closest('.c-field');

        $field2.insertAfter($field1);

        if (modifierClass) {
            $field1.closest('.c-field-row').addClass(modifierClass);
        }
    };

    var _initOptionalFieldToggle = function(fieldId) {
        var $field = $(fieldId).closest('.c-field');
        var $fieldWrapper = $field.parent();
        var labelText = $field.find('label').first().text();

        revealTemplate({
            content: DummyElement.getSubstitute($field),
            showLabel: '+ Add ' + labelText + ' (optional)'
        }, function(err, html) {
            $fieldWrapper.html(html);
            DummyElement.replaceAllSubstitutes($fieldWrapper);

            Reveal.init($fieldWrapper.find('.c-reveal'));
        });
    };

    var _hideUnneededFields = function(selector) {
        $(selector).closest('.c-field-row').hide();
    };

    var _transformAddress = function($panel) {
        var isShippingAddress = $panel.is('#gwt_shipaddr_panel');
        var isBillingAddress = $panel.is('#gwt_billaddr_panel');

        var $rows = $panel.find('.group .spot').map(function() {
            var $input = $(this).find('input');
            var $select = $(this).find('select');
            var $label = $(this).find('label');

            var data = {
                fields: [{
                    // For now, use dummy inputs and labels.
                    // Later they'll be switched with the original desktop's
                    input: DummyElement.getSubstitute($input),
                    select: DummyElement.getSubstitute($select),
                    label: DummyElement.getSubstitute($label)
                }]
            };
            if ($select.length > 0) {
                data.fields[0].isSelect = true;
            }

            return data;
        });

        addressTemplate({rows: $rows}, function(err, html) {
            $panel.html(html);
            DummyElement.replaceAllSubstitutes($panel);

            // Red asterisks
            $panel.find('label .required').addClass('u-text-warning');

            if (isShippingAddress) {
                _showSideBySide('#ship_fnbox', '#ship_mibox', 'c--3-4');
                _showSideBySide('#ship_region', '#ship_zipbox', 'c--3-4');

                _initOptionalFieldToggle('#ship_cnbox');
                _initOptionalFieldToggle('#ship_phone2box');

                // To be in sync with what's on desktop
                _hideUnneededFields('#ship_sa2box, #ship_sa3box, #ship_faxbox');

                // Finally, let's now hide the entire shipping form in our Reveal component
                var $panelWrapper = $panel.parent();
                revealTemplate({
                    class: 'js-reveal-shipping-address',
                    content: DummyElement.getSubstitute($panel),
                    showLabel: $('<div class="u-text-align-start">+ Add Shipping Address<br><span class="c-note u-text-weight-normal">(If different from Billing Address)</span></div>'),
                    hideLabel: '- Remove Shipping Address'

                }, function(err, html) {
                    $panelWrapper.append(html);
                    DummyElement.replaceAllSubstitutes($panelWrapper);

                    Reveal.init($panelWrapper.find('.c-reveal').first());
                });
            } else if (isBillingAddress) {
                _showSideBySide('#bill_fnbox', '#bill_mibox', 'c--3-4');
                _showSideBySide('#bill_region', '#bill_zipbox', 'c--3-4');

                _initOptionalFieldToggle('#bill_cnbox');
                _initOptionalFieldToggle('#bill_phone2box');

                // To be in sync with what's on desktop
                _hideUnneededFields('#bill_sa2box, #bill_sa3box, #bill_faxbox');
            }

            // Special keyboard
            $('[id$="_zipbox"], [id$="_phone1box"], [id$="_phone2box"]').attr('type', 'tel');
        });

    };

    var _transformSameAsBilling = function($panel) {
        // This will be hidden on mobile at all times
        $panel.prop('hidden', true);

        $panel.find('input[type=checkbox]')
            .addClass('js-same-as-billing');
    };

    var _transformSaveButton = function($panel) {
        $panel.find('button')
            .addClass('c-button c--full-width u-margin-bottom-xxlg js-save-button');
    };



    var accountInfoUI = function() {
        console.log('accountInfo UI');
        // Add any scripts you would like to run on the accountInfo page only here

        Utils.afterAppendChild('#gwt_billaddr_panel, #gwt_shipaddr_panel', _transformAddress);
        Utils.afterAppendChild('#gwt_sameasbilling_cb', _transformSameAsBilling);
        Utils.afterAppendChild('#gwt_billshipaddr_btn', _transformSaveButton);

        Alert.init();

        // On clicking '+ Add Shipping Address' or '- Remove Shipping Address'
        $('body').on('click', '.js-reveal-shipping-address > .c-reveal__trigger, .js-reveal-shipping-address > .c-reveal__content > .c-reveal__trigger', function() {
            var $desktopCheckbox = $('.js-same-as-billing');
            // Toggle the disabled state of the form fields
            $desktopCheckbox.trigger('click');

            var isClosingButton = $(this).is('.c--hide');
            if (isClosingButton) {
                // Scrolling the page up to re-orient yourself
                $.scrollTo($('.accountInfoShippingForm'));
            }
        });

        var $errorsContainer = $('.js-error-messages');

        $('body').on('click', '.js-save-button', function() {
            // TODO: make a util
            // Add our error class if necessary
            $('.account_info .errortxt')
                .closest('.c-field').addClass('c--error');

            // Remove the error class when it's no longer needed
            var $errors = $('.account_info .c--error');
            var $noLongerErrors = $errors.not($errors.has('.errortxt'));
            $noLongerErrors.removeClass('c--error');

            // TODO: refactor this duplicate code. It appears in utils.js too.

            var errorData = alertParser.parse(
                $('#gwt-error-placement-div'),
                function($container) {
                    return $container.find('.gwt-csb-error-panel .gwt-HTML');
                }
            );
            errorData.class = 'c--fixed';

            // TODO: make a util
            // Show error messages if necessary
            if (errorData.messages.length > 0) {
                $errorsContainer.prop('hidden', false);
                Alert.update($errorsContainer.find('.c-alert').first(), errorData);
            } else {
                // No errors!
                $errorsContainer.prop('hidden', true);
            }
        });

        $('body').on('alertClosed.mobify', function(e, $alert) {
            $errorsContainer.prop('hidden', true);
        });
    };

    return accountInfoUI;
});
