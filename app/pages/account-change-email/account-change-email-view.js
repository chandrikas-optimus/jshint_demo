define([
    '$',
    'global/baseView',
    'components/breadcrumbs/parsers/breadcrumbs-parser',
    'dust!pages/account-change-email/account-change-email'
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
            templateName: 'account-change-email',
            breadcrumbs: function() {
                return breadcrumbsParser.parseAccount();
            },
            pageTitle: function() {
                return $('#mainContent h1').first().attr('title') || 'Change Email Address';
            },
            intro: function() {
                return $('#act > p');
            },
            changeEmailForm: function() {
                var $changeEmailForm = $('#changeEmailForm');

                return $changeEmailForm.map(function(_, form) {
                    var $form = $(form);
                    var $hiddenInputs = $form.find('input[type=hidden]').remove();
                    var $oldEmailInput = $form.find('input#logonId_old');
                    var $newEmailInput = $form.find('input#logonId');
                    var $confirmEmailInput = $form.find('input#reEnterEmail');
                    var $rows = $form.find('.spot:not(.actions)');

                    // Success message is just a text node
                    var message = $form.contents().filter(function() {
                        return this.nodeType === 3 && $.trim(this.textContent) !== '';
                    }).first().text();

                    // Style require asterisks
                    $form.find('label .required').addClass('u-text-warning');

                    // Make old email input readonly before desktop ui scripts
                    $oldEmailInput.attr('type', 'email').prop('readonly', true);

                    // Change input type
                    $newEmailInput.attr('type', 'email');
                    $confirmEmailInput.attr('type', 'email');

                    return {
                        form: $form,
                        message: message,
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
