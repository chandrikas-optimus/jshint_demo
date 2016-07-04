define([
    '$',
    'global/checkoutBaseView',
    'dust!pages/checkout-confirmation-details/checkout-confirmation-details',
    'global/parsers/checkout/address-parser',
    'global/parsers/checkout/items-shipping-parser',
    'global/parsers/checkout/totals-parser',
    'global/parsers/shipping-and-handling-parser'
],
function($, BaseView, template, addressParser, itemsShippingParser, totalsParser, shippingInfoParser) {
    return {
        template: template,
        extend: BaseView,
        preProcess: function(context) {
            if (BaseView.preProcess) {
                context = BaseView.preProcess(context);
            }

            $('[id*="gwt_order_item_uber"] .JSON').addClass('x-skip').parent().addClass('x-skip');

            return context;
        },
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
            templateName: 'checkout-confirmation-details',
            hiddenForms: function() {
                return $('form.hidden').add($('#gwt_view_name').parent());
            },
            hiddenInputs: function() {
                return $('#container').children('input[type="hidde"]');
            },
            orderContainer: function() {
                return $('#orderReviewDisplayViewDiv');
            },
            orderInfo: function(context) {
                var $infoContainer = context.orderContainer.children('.vcard');

                return $infoContainer.children().map(function(i, row) {
                    var $row = $(row);
                    return {
                        label: $row.find('b').remove().text(),
                        value: $row.text()
                    };
                });
            },
            billingAddress: function(context) {
                return addressParser.parse(context.orderContainer.find('.od-bill'));
            },
            shippingAddress: function(context) {
                if (!context.orderContainer.find('.od-shipping').length) {
                    return;
                }

                return addressParser.parse(context.orderContainer.find('.od-shipping'));
            },
            paymentDetails: function(context) {
                var $paymentContainer = context.orderContainer.find('.od-bill-payment');
                var cardText = $paymentContainer.find('.vcard').contents().filter(function(i, node) {
                    return node.nodeType === Node.TEXT_NODE;
                });
                var cards = [];
                var i;

                for (i = 0; i < cardText.length; i = i + 2) {
                    var currentNode = cardText[i];
                    var nextNode = cardText[i + 1];
                    if (currentNode && nextNode) {
                        cards.push({
                            cardName: currentNode.textContent,
                            cardInfo: nextNode.textContent.replace('Card#', '')
                        });
                    }
                }

                if (cardText) {
                    return {
                        sectionTitle: $paymentContainer.find('h3').text(),
                        cards: cards
                    };
                }
            },
            shippingInfo: function() {
                var $shippingDetails = $('.detShipInfo').first();

                return {
                    headerContent: $shippingDetails.find('.shippingSubrealmHeader').text(),
                    content: {
                        contentTemplate: 'global/partials/shipping-and-handling',
                        data: shippingInfoParser.parse($shippingDetails.find('.shippingSubrealmWrap'))
                    }
                };
            },
            orderItems: function(context) {
                return itemsShippingParser.parse(context.orderContainer.find('[id="orderItemTable"]'), false, true);
            },
            totals: function(context) {
                return totalsParser.parse($('#order_total_table'));
            }
        }

    };
});
