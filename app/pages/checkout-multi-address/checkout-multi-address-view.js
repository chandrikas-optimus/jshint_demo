define([
    '$',
    'global/checkoutBaseView',
    'dust!pages/checkout-multi-address/checkout-multi-address'
],
function($, BaseView, template) {

    return {
        template: template,
        extend: BaseView,
        preProcess: function(context) {
            if (BaseView.preProcess) {
                context = BaseView.preProcess(context);
            }

            $('[id*="lptopspacer"]').remove();
        },

        postProcess: function(context) {
            if (BaseView.postProcess) {
                context = BaseView.postProcess(context);
            }

            context.footer.hasReturnButton = true;
            // Custom return button should navigate to cart
            context.footer.returnButtonAction = 'window.location.pathname = "/ShoppingCartView";';

            context.header.progressBar.steps[0].status = 'c--half-completed';
        },
        context: {
            templateName: 'checkout-multi-address',
            hiddenInputs: function() {
                return $('input[type="hidden"]');
            },
            desktopContent: function() {
                return $('#content');
            },
            introText: function(context) {
                return context.desktopContent.find('.inst-copy').text();
            }
        }
    };
});
