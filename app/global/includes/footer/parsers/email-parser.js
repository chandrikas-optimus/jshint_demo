define(['$'], function($) {

    var parse = function($container) {
        var $form = $container.find('form');
        var $emailSignUpInput = $form.find('#emailSignUp');
        $emailSignUpInput.attr('placeholder', $emailSignUpInput.attr('value'));
        $emailSignUpInput.removeAttr('value');

        return {
            form: $form,
            hiddenInputs: $form.find('input[type="hidden"]'),
            input: $emailSignUpInput
        };
    };

    return {
        parse: parse
    };
});
