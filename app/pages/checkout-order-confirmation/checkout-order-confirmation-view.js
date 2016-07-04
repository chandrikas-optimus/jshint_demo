define([
    '$',
    'global/checkoutBaseView',
    'dust!pages/checkout-order-confirmation/checkout-order-confirmation',
    'swap'
],
function($, BaseView, template) {
    return {
        template: template,
        extend: BaseView,
        postProcess: function(context) {
            if (BaseView.postProcess) {
                context = BaseView.postProcess(context);
            }

            var steps = context.header.progressBar.steps;
            var stepsLength = steps.length;
            var i;

            for (i = 0; i < stepsLength; i++) {
                steps[i].status = 'c--completed';
                steps[i].statusText = 'Completed';
            }

            context.header.progressBarTitle = 'You are all done!';

            return context;
        },
        context: {
            templateName: 'checkout-order-confirmation',
            hiddenForms: function() {
                return $('form.hidden').add($('#gwt_view_name').parent());
            },
            hiddenInputs: function() {
                return $('#container').children('input[type="hidde"]');
            },
            analyticsContainer: function() {
                return $('#analyticsDataShop9');
            },
            orderConfirmationContainer: function() {
                return $('#orderConfirmation');
            },
            orderError: function(context) {
                return context.orderConfirmationContainer.children('.error');
            },
            gwtConfirmation: function(context) {
                return context.orderConfirmationContainer.find('#gwt_wwcm_order_confirmation');
            },
            messages: function(context) {
                var $text = context.gwtConfirmation.find('p');
                var $successMessage = $text.slice(0, 2);

                $successMessage.addClass('u-margin-bottom-md');

                return {
                    successMessage: $successMessage,
                    helpMessage: $text.slice(-2, -1).addClass('u-margin-bottom-md')
                };
            },
            orderInfo: function(context) {
                var $orderInfoTable = context.orderConfirmationContainer.find('.order_confirmation_info');

                return $orderInfoTable.find('tr').map(function(i, orderRow) {
                    var $orderCells = $(orderRow).children();

                    return {
                        label: $orderCells.first().text(),
                        value: $orderCells.last().text()
                    };
                });
            },
            finePrint: function(context) {
                var $finePrint = context.gwtConfirmation.find('p:last');
                var $brs = $finePrint.find('br');

                $brs.first().remove();
                $brs.eq(1).remove();

                var $heading = $finePrint.find('b').remove().addClass('c-heading c--2').swap('h3');

                return {
                    heading: $heading,
                    finePrint: $finePrint
                };
            },
            continueShopping: function(context) {
                return context.orderConfirmationContainer.find('.actions a').addClass('c-button c--full-width c--primary u-margin-bottom-lg');
            },
            guestRegistrationContainer: function(context) {
                return context.orderConfirmationContainer.find('#gwt_guest_user_reg');
            },
            viewOrderLink: function(context) {
                var $link = context.orderConfirmationContainer.find('#printlink');

                $link.text($link.text().replace(/\/print/i, ''));

                return $link.addClass('c-button c--outline c--full-width');
            }
        }

    };
});
