define([
    '$',
    'global/utils',
    'global/baseView',
    'dust!pages/registration/registration'
],
function($, Utils, BaseView, template) {
    return {
        template: template,
        extend: BaseView,

        // TODO: refactor this duplicate code
        preProcess: function(context) {
            var beforeBasePreProcess = function() {
                var $scriptsToPreserve = $('script').not('[x-src]').filter(function() {
                    // TODO: this might match some 3rd party scripts.. see checkoutBaseView.js
                    return /document\.write/.test($(this).text());
                });

                $scriptsToPreserve.each(function() {
                    var $script = $(this);

                    // On mobile, we'd like the email field to use input[type=email]
                    $script.text(
                        $script.text().replace('useNonDefaultKeyboard()', 'true')
                    );
                });

                Utils.preserveInlineScripts($scriptsToPreserve);
            };

            var afterBasePreProcess = function() {
            };

            if (BaseView.preProcess) {
                beforeBasePreProcess();
                context = BaseView.preProcess(context);
                afterBasePreProcess();
            }

            return context;
        },

        context: {
            templateName: 'registration',
            pageTitle: function() {
                return $('h1').first().attr('title') || 'Registration';
            },
            intro: function() {
                return $('.data h2 + p');
            },
            passwordRequirement: function() {
                return $('.data h2 ~ p').eq(1);
            },
            // TODO: parser
            registrationForm: function() {
                var $form = $('#userRegistrationForm');
                var $hiddenInputs = $form.find('input[type=hidden]').remove();
                var $emailLabel = $form.find('#email_label');
                var $confirmEmailLabel = $form.find('#verify_email_label');
                var $passwordField = $form.find('#logonPassword');
                var $confirmPasswordField = $form.find('#logonPasswordVerify');
                var $receiveEmailsCheckbox = $form.find('#sendMeEmails');

                $form.find('span.required').addClass('u-text-warning u-margin-start-sm');

                return {
                    form: $form,
                    hiddenInputs: $hiddenInputs,

                    email: {
                        label: $emailLabel,
                        input: $emailLabel.siblings('script')
                    },
                    confirmEmail: {
                        label: $confirmEmailLabel,
                        input: $confirmEmailLabel.siblings('script')
                    },
                    password: {
                        input: $passwordField,
                        label: $passwordField.siblings('label')
                    },
                    confirmPassword: {
                        input: $confirmPasswordField,
                        label: $confirmPasswordField.siblings('label')
                    },
                    receiveEmails: {
                        isCheckRadio: true,
                        input: $receiveEmailsCheckbox,
                        label: $('<label for="sendMeEmails">').text(
                            $receiveEmailsCheckbox.parent().text()
                        )
                    },

                    button: $form.find('#continue')
                };
            }
        }

        /**
         * If you wish to override preProcess/postProcess in this view, have a look at the documentation:
         * http://adaptivejs.mobify.com/v1.0/docs/views
         */
    };
});
