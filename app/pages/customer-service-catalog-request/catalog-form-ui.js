define([
    '$',
    'global/utils',
    'components/alert/alert-ui',
    'components/reveal/reveal-ui',
    'global/utils/dummy-element',
    'pages/customer-service-catalog-request/parsers/catalog-form-parser',
    'dust!pages/customer-service-catalog-request/partials/form',
], function(
    $,
    Utils,
    Alert,
    Reveal,
    DummyElement,
    formParser,
    formTemplate
) {
    var styleRequired = function() {
        $('.required').addClass('u-text-warning');
    };

    var catalogFormUI = function(selectors) {

        var $addressForm = $('.js-form-address');
        var $emailForm = $('.js-form-email');
        var $birthdayForm = $('.js-form-birthday');
        var $submitButton = $('.js-form-submit');

        var parsedForms = selectors.map(function(selector) {
            return formParser.parse(selector);
        });

        // I would love to call .reduce to combine the inputs, but jQuery does not
        // support reduce
        formTemplate(parsedForms[0], function(err, html) {
            $addressForm.html(html);
        });
        formTemplate(parsedForms[1], function(err, html) {
            $emailForm.html(html);
        });
        formTemplate(parsedForms[2], function(err, html) {
            $birthdayForm.html(html);
        });
        formTemplate(parsedForms[3], function(err, html) {
            $submitButton.html(html);
        });

        // Clean up the desktop form
        $('.form.catreqdouble').remove();
        // $('.js-form-address, .js-form-email, .js-form-birthday, .js-form-submit').wrapAll('<div class="form catreqdouble" />');

        DummyElement.replaceAllSubstitutes($('.js-form-address, .js-form-email, .js-form-birthday, .js-form-submit'));

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
    };

    return catalogFormUI;
});
