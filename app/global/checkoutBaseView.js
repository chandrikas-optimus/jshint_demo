define([
    '$',
    'global/includes/checkout-header/context',
    'global/includes/checkout-footer/context',
    'global/baseView',
    'dust!global/checkoutBase',
    'global/parsers/delivery-notice-parser',
    'global/utils'
],
function($, checkoutHeader, checkoutFooter, BaseView, baseTemplate, deliveryNoticeParser, Utils) {
    var descript;

    return {
        template: baseTemplate,
        extend: BaseView,
        includes: {
            header: checkoutHeader,
            footer: checkoutFooter
        },
        preProcess: function(context) {
            var beforeBasePreProcess = function() {
                var $scriptsToPreserve = $('script').not('[x-src]').filter(function() {
                    var script = $(this).text();
                    return /document\.write/.test(script) && /useNonDefaultKeyboard\(\)/.test(script);
                });


                $('#emailUpdates').remove();
                $('script[x-src*="sli"]').remove();

                $scriptsToPreserve.each(function() {
                    var $script = $(this);

                    // On mobile, we'd like the email field to use input[type=email]
                    $script.text(
                        $script.text().replace('useNonDefaultKeyboard()', 'true')
                    );
                });

                Utils.preserveInlineScripts($scriptsToPreserve);
            };


            if (BaseView.preProcess) {
                beforeBasePreProcess();
                context = BaseView.preProcess(context);
            }

            return context;
        },
        postProcess: function(context) {
            if (BaseView.postProcess) {
                context = BaseView.postProcess(context);
            }

            return context;
        },
        context: {
            templateName: 'checkout-base',
        }
    };

});
