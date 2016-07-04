define([
    '$',
    'global/checkoutBaseView',
    'dust!pages/checkout-sign-in/checkout-sign-in',
    'global/utils',
    'swap'
],
function($, BaseView, template, Utils) {
    var _getField = function($container, $hint) {
        return {
            input: $container.find('input, script'),
            label: $container.find('label').addClass('c-label'),
            hint: $hint && $hint.length ? $hint : ''
        };
    };

    var _parseRememberMe = function($container) {
        var $input = $container.find('input');
        var $tooltip = $container.find('.rememberMeDescriptionPopup');
        var $label = $container.find('.rememberMeLink').addClass('c-label').swap('label');

        $tooltip.find('b').first().remove();
        $tooltip.find('br').remove();

        $label[0].removeAttr('href');
        $label[0].removeAttr('onclick');

        return {
            input: $input,
            isCheckRadio: true,
            // Add dummy [for] attribute to bypass CSS pointer-events none rule
            label: $label[0].attr('for', $input.attr('id')),
            tooltipContent: $tooltip
        };
    };

    return {
        template: template,
        extend: BaseView,
        context: {
            templateName: 'checkout-sign-in',
            pageTitle: function() {
                return $('#mainContent > .custom').attr('title');
            },
            errorContainer: function() {
                return $('#gwt-error-placement-div');
            },
            forgotPasswordParams: function() {
                return $('#gwt_forgot_password_params');
            },
            loginForm: function() {
                var $form = $('#userLogonForm');
                var $forgotPassword = $form.find('#forgotpw a');

                $forgotPassword.html($forgotPassword.find('span:not(.red-star, .green_inline_link)'));

                return {
                    form: $form,
                    hiddenInputs: $form.find('input[type="hidden"]'),
                    title: $form.find('h3').text(),
                    email: _getField($form.find('.logonId')),
                    password: _getField($form.find('.password'), $forgotPassword),
                    rememberMe: _parseRememberMe($form.find('.rememberMe')),
                    loginButton: $form.find('#logonButton').addClass('c-button c--primary c--full-width js-sign-in-button')
                };
            },
            guestLoginForm: function() {
                var $form = $('#guestLogon');

                return {
                    form: $form,
                    hiddenInputs: $form.find('input[type="hidden"]'),
                    title: $form.find('h3').text(),
                    createAccountButton: $form.find('.button.primary').append('as guest').addClass('c-button c--outline c--full-width'),
                    message: $form.children('div:not(.actions)').text()
                };
            }
        }
    };
});
