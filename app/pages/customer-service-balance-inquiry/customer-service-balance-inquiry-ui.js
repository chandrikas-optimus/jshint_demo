define([
    '$',
    'dust!pages/customer-service-balance-inquiry/partials/form',
    'global/utils',
    'global/utils/dummy-element',
    'components/alert/alert-ui',
    'components/sheet/sheet-ui',
    'components/reveal/reveal-ui',
    'hijax'
], function(
    $,
    formTemplate,
    Utils,
    DummyElement,
    Alert,
    Sheet,
    Reveal,
    Hijax
) {
    var styleRequired = function() {
        $('.required').addClass('u-text-warning');
    };

    var initHijax = function() {
        var hijax = new Hijax();

        hijax.set(
            'gift-card-balance-inquiry',
            function(url) {
                return url.indexOf('GiftCardBalanceJSONView') > -1;
            },
            {
                complete: function(data, xhr) {
                    if (!data.ErrorCode) {
                        $('.js-balance-display').removeAttr('hidden');
                        $('.js-balance').text('$' + data.giftCardBalance);
                        // var $sheet = $('.js-balance-info');
                        // var sheet = Sheet.init($sheet);
                        // sheet.open();
                    }
                }
            }
        );
    };

    var parseForm = function($form) {
        return $form.map(function(_, form) {
            var $form = $(form);
            var $hiddenInputs = $form.find('input[type=hidden]').remove();
            var $rows = $form.find('.spot:not(.action):has(input)');

            var $inputs = $rows.map(function(_, row) {
                var $row = $(row);
                var $label = $row.find('label');
                var $input = $row.find('input');

                $input.hint = $('<a>Find your number</a>');

                return {
                    label: $label,
                    input: DummyElement.getSubstitute($input)
                };
            });
            return {
                form: $form,
                hiddenInputs: $hiddenInputs,
                inputs: $inputs,
                button: DummyElement.getSubstitute($form.find('.button.primary'))
            };
        })[0];
    };
    var customerServiceBalanceInquiryUI = function() {
        var document = $('document');
        var $inquiryForm = $('.js-inquiry-form');
        if (window.CSBEntryPoint) {
            var installRunAsyncCode = window.CSBEntryPoint.__installRunAsyncCode;
            window.CSBEntryPoint.__installRunAsyncCode = function() {
                var results = installRunAsyncCode.apply(this, arguments);
                window.setTimeout(function() {
                    var $form = $('div.form.giftCardBalancePanel');
                    if ($form.length && $form.has('.js-form-submit').length < 1) {
                        formTemplate(parseForm($form), function(err, html) {
                            $inquiryForm.html(html);
                            // Restore callback
                            window.CSBEntryPoint.__installRunAsyncCode = installRunAsyncCode;

                            DummyElement.replaceAllSubstitutes($inquiryForm);

                            var $submitButton = $('.js-form-submit button');
                            var desktopSubmitFunction = $submitButton[0].onclick;
                            $submitButton[0].onclick = '';

                            $submitButton.click(function(event) {
                                if (typeof desktopSubmitFunction === 'function') {
                                    if (desktopSubmitFunction.call(this, event) === false) {
                                        event.preventDefault();
                                    }
                                }
                                // Detect errors in the form and display them if they exist
                                Utils.decorateErrorsAlert();
                                // Decorate the input fields
                                $('.errortxt').closest('.c-field').addClass('c--error');
                                $('body').on('alertClosed.mobify', function(e, $alert) {
                                    var $errorsContainer = $('.js-error-messages');
                                    $errorsContainer.prop('hidden', true);
                                });
                            });

                            styleRequired();
                            Reveal.init();
                            Alert.init();
                            initHijax();
                        });
                    }
                });
                return results;
            };
        }
    };

    return customerServiceBalanceInquiryUI;
});
