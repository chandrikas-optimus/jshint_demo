define([
    '$',
    'dust!pages/sign-in/partials/sign-in-form'
], function($) {
    var parse = function($form) {
        var $hiddenInputs = $form.find('input[type=hidden]').remove();
        var $password = $form.find('#logonPassword');
        var $emailContainer = $form.find('.logonId');

        var $intro = $form.find('h3 p');
        $intro.find('br, .red-star').remove();

        var $rememberMeLink = $form.find('#rememberMeLink');

        return {
            title: 'Sign In',
            contentTemplate: 'pages/sign-in/partials/sign-in-form',
            content: {
                form: $form,
                hiddenInputs: $hiddenInputs,
                heading: $form.find('h3 div').first().text(),
                intro: $intro,
                email: {
                    // This desktop script would generate the email input
                    input: $emailContainer.find('script'),
                    label: $emailContainer.find('label')
                },
                password: {
                    input: $password,
                    label: $password.siblings('label'),
                    // Forgot password
                    hint: $form.find('#forgotpw a').clone()
                        .addClass('t-sign-in__forgot-password-link js-forgot-password-link')
                        .attr('disabled', 'disabled')
                        .text('forgot your password?')
                },
                rememberMe: {
                    isCheckRadio: true,
                    input: $form.find('#rememberMe'),
                    label: $('<label for="rememberMe">').text('Remember Me On This Device')
                },
                button: $form.find('#logonButton')
            }
        };
    };

    return {
        parse: parse
    };
});
