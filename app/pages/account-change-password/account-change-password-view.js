define([
    '$',
    'global/baseView',
    'components/breadcrumbs/parsers/breadcrumbs-parser',
    'dust!pages/account-change-password/account-change-password'
],
function(
    $,
    BaseView,
    breadcrumbsParser,
    template
) {
    return {
        template: template,
        extend: BaseView,

        context: {
            templateName: 'account-change-password',
            breadcrumbs: function() {
                return breadcrumbsParser.parseAccount();
            },
            pageTitle: function() {
                return $('#sideBox li.on.active a').first().text() || 'Change Password';
            },
            intro: function() {
                return $('#act > p');
            },
            changePasswordForm: function() {
                var $changePasswordForm = $('#changePasswordForm');



                return $changePasswordForm.map(function(_, form) {
                    var $form = $(form);
                    var $hiddenInputs = $form.find('input[type=hidden]').remove();
                    var $rows = $form.find('.spot:not(.action)');

                    // Style require asterisks
                    $form.find('label .required').addClass('u-text-warning');

                    return {
                        form: $form,
                        errorsContainer: $form.find('#gwt-error-placement-div'),
                        hiddenInputs: $hiddenInputs,
                        inputs: $rows.map(function(_, row) {
                            var $row = $(row);
                            var $label = $row.find('label');
                            var $input = $row.find('input');

                            return {
                                label: $label,
                                input: $input
                            };
                        }),

                        button: $form.find('.button.primary')
                    };
                });
            }
        }
    };
});
