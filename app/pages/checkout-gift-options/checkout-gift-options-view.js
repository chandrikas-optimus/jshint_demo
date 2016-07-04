define([
    '$',
    'global/checkoutBaseView',
    'dust!pages/checkout-gift-options/checkout-gift-options'
],
function($, BaseView, template) {
    return {
        template: template,
        extend: BaseView,
        preProcess: function(context) {
            if (BaseView.preProcess) {
                context = BaseView.preProcess(context);
            }

            $('.JSON').addClass('x-skip');
            $('.JSON').parent().addClass('x-skip');

            return context;
        },
        postProcess: function(context) {
            if (BaseView.postProcess) {
                context = BaseView.postProcess(context);
            }

            // This checkout page has the custom return button
            context.footer.hasReturnButton = true;

            // Custom return button should navigate to cart
            context.footer.returnButtonAction = 'window.location.pathname = "/ShoppingCartView";';

            var $breadcrumbs = $('.breadcrumbs li');
            var $giftBreadcrumb = $breadcrumbs.first();
            var shippingStep;
            var giftStep;
            var steps;

            context.header.progressBar = context.header.progressBarWithGift;
            giftStep = context.header.progressBar.steps[0];

            giftStep.status = 'c--active';
        },

        context: {
            templateName: 'checkout-gift-options',
            hiddenInputs: function() {
                return $('input[type="hidden"]');
            },
            hiddenForms: function() {
                return $('form.hidden');
            },
            container: function() {
                var $mainContainer = $('#mainContent');

                $mainContainer.find('.breadcrumbs').remove();

                return $mainContainer;
            },
            pcProductCount: function() {
                // counts number of configurable (princess dresses) products, which we need to wait before
                // transforming the gift options
                // CF-830: Exclude PC items that aren't gifts
                return ($('#gwt_gift_boxing').find('.JSON').text().match(/\"isGift\"\:\"?true\"?[^{}]+\"isPcProduct\"\:\"true\"/g) || []).length;
            }
        }
    };
});
