define(['$'], function($) {

    var parse = function($form) {
        var $emailLabel = $('label[for="email"], label[for="unsubemail"]');
        var $confirmEmailLabel = $('label[for="email2"]');
        var $emailInput = $('#email, #unsubemail');
        var $confirmEmailInput = $('#email2');
        var $headline = $form.find('.headline'); // Use this as an anchor point.
        var $heading = $headline.next('p');
        var $description = $heading.next('p');

        $emailLabel.find('.required').removeClass().addClass('u-text-warning');
        $confirmEmailLabel.find('.required').removeClass().addClass('u-text-warning');

        if (!/embed=1/.test(window.location.href)) {
            $form.addClass('u-padding-all');
        }

        return {
            form: $form,
            heading: $heading.length ? $heading.text() : false,
            description: $description.length ? $description.text() : false,
            hiddenInputs: $form.find('input[type="hidden"]'),
            email: $emailLabel.length && $emailInput.length ? {
                label: $emailLabel,
                input: $emailInput
            } : false,
            confirmEmail: $confirmEmailLabel.length && $confirmEmailInput.length ? {
                label: $confirmEmailLabel,
                input: $confirmEmailInput
            } : false,
            button: $('#submit, #unsub')
        };
    };

    return {
        parse: parse
    };
});
