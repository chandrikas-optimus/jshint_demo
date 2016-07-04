define([
    '$',
    'global/parsers/price-parser'
], function($, priceParser) {

    // NOTE: there's a similar parser at add-to-cart-ui.js (_parseDesktopModal function)
    var _getProductInfo = function($container) {
        var productAttrs = [];
        var $salePrice = $container.find('.gwt_addtocartdiv_nowpricediv');
        var registryMessageData;
        var $registryMessage = $container.find('.gwt-gift-registry-message');

        // Find all product options and add them to the table.
        $container.find('.oios-option-line, .gwt_quantity_div').each(function(_, attribute) {
            var $attribute = $(attribute);
            var isSizeColor = $attribute.hasClass('oios-option-line');
            var indent = $attribute.closest('.oios-pcat-summary-panel, .oios-pcat-pers-summary-panel').length > 0;
            var value = isSizeColor ? $attribute.find('.ois-option-value').text() : $attribute.find('.gwt_addtocartdiv_quanity').text();

            productAttrs.push({
                label: isSizeColor ? $attribute.find('.ois-option-name').text() : $attribute.find('.gwt_addtocartdiv_quanitylabel').text().replace(':', ''),
                value: value,
                setFontWeightBold: !value ? true : null,
                indentClass: indent ? 'u-padding-start-md u-border-left' : ''
            });
        });

        // If there are ersonalization options, add them to the table too.
        if ($container.find('.gwt_personalization_wrapper').length) {
            $container.find('.gwt_personalization_wrapper .gwt_personalization_div').each(function() {
                productAttrs.push({
                    // Dust template already includes ":" separator
                    label: $(this).find('.label').text().replace(':', ''),
                    value: $(this).find('.value').text().replace(':', '')
                });
            });
        }

        // If there are ersonalization options, add them to the table too.
        if ($registryMessage.length) {
            registryMessageData = {
                label: $registryMessage.find('.gwt-gift-registry-custom-message-text').clone(),
                input: $registryMessage.find('.gwt-gift-registry-message-textbox').clone()
            };
        }

        return {
            leftColumnClass: 'c--shrink',
            imageContainerClass: 'js-image-container c--medium',
            heading: $container.find('.addToCartProductName .gwt-HTML').text(),
            table: productAttrs,
            itemNum: $container.find('.gwt_addtocartdiv_itemnumber').text(),
            price: priceParser.parse($container),
            containerClass: 'u-margin-bottom-lg',
            registryMessage: registryMessageData
        };
    };

    var parse = function($container) {
        // CF-845: On some older phones, this modal is opened twice in a row
        // Use the cloned elements so we don't accidentally make changes to the originals
        var products = $.makeArray($container.find('.addToCartItem')).map(function(el) {
            return _getProductInfo($(el).clone());
        });

        // Reverse button order
        var $actions = $container.find('.okCancelPanel').clone();
        var $actionButtons = $actions.find('.button').toArray().reverse();

        $actions
            .empty()
            .append($actionButtons);

        // Decorate buttons
        $actions.find('button.primary').addClass('c-button c--full-width u-margin-bottom-lg js-view-list');
        $actions.find('button.secondary').addClass('c-button c--outline c--full-width u-margin-bottom-lg js-continue-shopping');

        // Fix desktop tables not wrapping becuase of our base styles.
        $container.find('table.form').addClass('c-table c--wrap');

        return {
            actions: $actions,
            disclaimer: $container.find('.gwt_addToCartDiv_shipping_message').text(),
            loginRegister: $container.find('.gwt-wishlist-login-message .gwt-HTML').clone().contents(),
            products: products,
            heading: $container.find('.dialogTopCenterInner .gwt-HTML').text()
        };
    };

    return {
        parse: parse
    };
});
