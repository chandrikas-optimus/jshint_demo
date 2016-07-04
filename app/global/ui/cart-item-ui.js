define([
    '$',
    'global/utils/dom-operation-override',
    'dust!pages/checkout-review-and-payment/partials/options',
    'components/reveal/reveal-ui',
    'capitalize'
],
function($, domOverride, OptionsTemplate, Reveal) {

    var includePersonalizationTitle = Adaptive.evaluatedContext.templateName === 'bag';

    var _addOptions = function($optionContainer, $itemPanel) {
        var $options = $itemPanel.find('.oios-summary-panel > .oios-option-line');
        var $personalizationContainer = $optionContainer.siblings('.js-personalization');
        var options = $options.map(function(i, option) {
            var $option = $(option);
            var $summary = $option.next('.oios-pcat-summary-panel');
            var $personalization = $summary.next('.oios-pcat-pers-summary-panel');
            var value = $.trim($option.find('.ois-option-value').text());
            var indent = !value ? 'true' : null;

            return {
                label: $.capitalize($option.find('.ois-option-name').text()),
                value: value,
                indent: indent,
                summary: $summary.find('.oios-option-line').map(function(i, summaryLine) {
                    var $summaryLine = $(summaryLine);
                    return {
                        label: $.capitalize($summaryLine.find('.ois-option-name').text()),
                        value: $summaryLine.find('.ois-option-value').text(),
                    };
                }),
                personalization: $personalization.length ? {
                    title: $personalization.children('.gwt-InlineLabel').text(),
                    label: $.capitalize($personalization.find('.ois-option-name').text()),
                    value: $personalization.find('.ois-option-value').text(),
                } : ''
            };
        });
        var shouldHide = options.length > 2;

        new OptionsTemplate({options: options, shouldHide: shouldHide}, function(err, html) {
            if (shouldHide && $personalizationContainer.length) {
                $personalizationContainer.html(html);
                $personalizationContainer.removeAttr('hidden');
            } else {
                $optionContainer.html(html);
            }
        });
    };

    var _updateAvailability = function($itemContainer, $desktopContent) {
        var $singleAvailabilityMsg = $desktopContent.closest('.js-desktop-cart-item').find('[id*="single_ESD_content"]');
        var $multiAvailabilityMsg = $singleAvailabilityMsg.siblings('.multi_ESD_content');
        var availabilityMsg;

        if ($singleAvailabilityMsg.length) {

            if ($singleAvailabilityMsg.hasClass('hide-single-or-multi-ESD')) {
                $multiAvailabilityMsg.find('.ESD-remove').remove();
                availabilityMsg = $multiAvailabilityMsg;

                availabilityMsg.children().removeAttr('class');
            } else {
                availabilityMsg = $singleAvailabilityMsg.children(':not(.nodisplay)').text();
            }

            $itemContainer.find('.js-availability').append(availabilityMsg);

            var isInStock = /([0-9]{2}\/[0-9]{2}\/[0-9]{4})/i.test(availabilityMsg) ? false : /in-stock/i.test(availabilityMsg);
            if (isInStock) {
                $itemContainer.find('.js-availability').addClass('u-text-dark-brand');
            }
        }

    };

    var _addDeliveryMethods = function($cartItem) {
        var $deliveryOptionsContainer = $cartItem.find('.js-desktop-cart-item .gwt-ship-to-store-delivery-method-panel');
        var $cartItemDeliveryMethods = $cartItem.find('.js-delivery-methods');

        if ($deliveryOptionsContainer.length) {
            $deliveryOptionsContainer.find('.gwt-RadioButton').each(function(i, deliveryOption) {
                var $deliveryOption = $(deliveryOption);
                var $container = $('<div>');

                $deliveryOption.addClass('c-field');
                $deliveryOption.find('label').addClass('c-label');

                $container.append($deliveryOption.next('.gwt-Label'));
                $container.prepend($('<div class="c-field-row">').html($deliveryOption));
                $cartItemDeliveryMethods.append($container);
            });
        }

    };

    var _bindEvents = function() {
        // CF-523: Use reveal components
        $('.c-reveal').each(function(i, reveal) {
            Reveal.init($(reveal));
        });
    };

    var _transformCartItem = function(itemPanel) {
        var $itemPanel = $(itemPanel).parent();
        var $mainItemContainer = $(this).parents('.js-cart-item');

        _updateAvailability($mainItemContainer, $itemPanel.parent());

        // Add Image
        $mainItemContainer.find('.js-product-image').append($itemPanel.find('.gwt-oid-image-panel img'));

        _addOptions($mainItemContainer.find('.js-options'), $itemPanel);

        _addDeliveryMethods($mainItemContainer);

        _bindEvents(); // rebind
    };

    var _transformPersonalizationInfo = function() {
        var $desktopPersContent = $(this).closest('.js-personalization-content');
        var $cartItemPersonalization = $desktopPersContent.closest('.js-cart-item').find('.js-personalization');
        var details = $desktopPersContent.find('.gwt-HTML').last().text().split(',');

        $cartItemPersonalization.removeAttr('hidden');
        $cartItemPersonalization.append($('<p>').html(''));

        $.each(details, function(i, text) {
            $cartItemPersonalization.append($('<p class="c-cart-item__personalization-item">').text(text));
        });
    };

    var cartItemUI = function() {
        _bindEvents();
        domOverride.on('domAppend', '.gwt-oid-description-panel', _transformCartItem);
        domOverride.on('domAppend', '', _transformPersonalizationInfo, '[id*="perzqty"]');
    };

    return cartItemUI;
});
