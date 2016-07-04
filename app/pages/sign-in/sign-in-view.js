define([
    '$',
    'global/baseView',
    'dust!pages/sign-in/sign-in',
    'global/utils',
    'pages/sign-in/parsers/sign-in-form-parser',
    'pages/sign-in/parsers/register-form-parser'
],
function(
    $,
    BaseView,
    template,
    Utils,
    signInFormParser,
    registerInFormParser
) {

    return {
        template: template,
        extend: BaseView,

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
            templateName: 'sign-in',
            pageTitle: function() {
                return $('h1').first().attr('title') || 'Sign In/Register';
            },
            hiddenParam: function() {
                return $('#gwt_forgot_password_params');
            },
            tabs: function() {
                var $forms = $('#userLogonForm, #userLogonRegistration');
                var data = [];

                $forms.map(function(index, item) {
                    var $form = $(this);
                    var tabData = [];

                    if ($form.is('#userLogonForm')) {
                        tabData = signInFormParser.parse($form);
                        tabData = $.extend({}, tabData, { class: 'c--current', labelClass: 'c--current u-border-top-none' });
                    } else if ($form.is('#userLogonRegistration')) {
                        tabData = registerInFormParser.parse($form);
                        tabData = $.extend({}, tabData, { labelClass: 'u-border-top-none' });
                    }

                    data.push(tabData);
                });

                return data;
            }
        }

        /**
         * If you wish to override preProcess/postProcess in this view, have a look at the documentation:
         * http://adaptivejs.mobify.com/v1.0/docs/views
         */
    };
});
