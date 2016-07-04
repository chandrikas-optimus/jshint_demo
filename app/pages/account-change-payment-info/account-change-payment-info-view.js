define([
    '$',
    'global/baseView',
    'components/breadcrumbs/parsers/breadcrumbs-parser',
    'dust!pages/account-change-payment-info/account-change-payment-info'
],
function($,
    BaseView,
    breadcrumbsParser,
    template
) {
    return {
        template: template,
        extend: BaseView,

        context: {
            templateName: 'account-change-payment-info',
            breadcrumbs: function() {
                return breadcrumbsParser.parseAccount();
            },
            pageTitle: function() {
                // Note ,tutle is different on desktop site
                return 'Change Payment Info';
            },
            intro: function() {
                return $('#act > p');
            },
            changePaymentInfoForm: function() {
                var $changePasswordForm = $('#creditCardEditForm');

                return $changePasswordForm.map(function(_, form) {
                    var $form = $(form);
                    var $hiddenInputs = $form.find('input[type=hidden]').remove();
                    var $rows = $form.find('.spot:not(.actions)');
                    var $expirationDateRow = $form.find('#exp-date-row');

                    $expirationDateRow.find('.required').addClass('u-text-warning');
                    $rows.find('.required').addClass('u-text-warning');

                    // Style require asterisks
                    $form.find('label .required').addClass('u-text-warning');

                    // Numeric keyboard for CC number
                    $form.find('input.cidNumber').attr('type', 'tel');

                    return {
                        form: $form,
                        errorsContainer: $form.find('#gwt-error-placement-div'),
                        hiddenInputs: $hiddenInputs,
                        inputs: $rows.map(function(_, row) {
                            var $row = $(row);
                            var $label = $row.find('label');
                            var $input = $row.find('input');
                            var $select = $row.find('select');

                            return {
                                label: $label,
                                input: $input,
                                select: $select,
                                isSelect: $select.length > 0
                            };
                        }),
                        expirationDate: $expirationDateRow.map(function(_, row) {
                            var $row = $(row);
                            var $month = $row.find('#monthParent');

                            var $monthLabel = $month.find('label');
                            var $monthInput = $month.find('select#cardExpiryMonth');

                            // the hidden label element is required by valisdation scripts, so it is handled with hiddenElements
                            var $yearLabel = $row.find('label#credit_card_expyear_label');
                            var $yearInput = $row.find('select#cardExpiryYear');

                            return {
                                month: {
                                    label: $monthLabel,
                                    select: $monthInput,
                                    isSelect: true
                                },
                                year: {
                                    label: false,
                                    hiddenElements: $yearLabel,
                                    select: $yearInput,
                                    isSelect: true
                                }
                            };
                        }),

                        button: $form.find('.button.primary')
                    };
                });
            }
        }
    };
});
