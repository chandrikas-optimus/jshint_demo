define([
    '$',
    'dust!pages/sign-in/partials/register-form'
], function($) {
    var parse = function($form) {
        var $hiddenInputs = $form.find('input[type=hidden]').remove();
        var $intro = $form.find('p:not(:empty)').first();
        $intro.text($intro.text().replace(/ \:/g, ':'));

        return {
            title: 'Register',
            contentTemplate: 'pages/sign-in/partials/register-form',
            content: {
                form: $form,
                hiddenInputs: $hiddenInputs,
                heading: $form.find('h3').first().text(),
                intro: $intro,
                listOfBenefits: $form.find('.registration-point .point'),
                button: $form.find('.actions button')
            }
        };
    };

    return {
        parse: parse
    };
});
