define([
    '$',
    'global/utils',
    'swap'
], function($, Utils, Swap) {

    var _parsePersonalization = function($option, $personalization) {
        var $pcPersonalization = $option.find('.oios-pcat-pers-summary-panel');

        if ($pcPersonalization.length) {
            return {
                title: $pcPersonalization.children('.gwt-InlineLabel').text(),
                label: $pcPersonalization.find('.ois-option-name').text(),
                value: $pcPersonalization.find('.ois-option-value').text(),
            };
        } else if ($personalization.length && $personalization.find('#perz_label').length) {
            return {
                title: $personalization.find('#perz_label').remove().text(),
                label: $personalization.text()
            };
        }

        return '';
    };

    var _parseOptions = function($itemPanel, $personalization) {
        var $options = $itemPanel.find('.oios-summary-panel > .oios-option-line');
        var $itemNumberContainer = $('.js-item-container');
        var options = $options.map(function(i, option) {
            var $option = $(option);
            var $summary = $option.next('.oios-pcat-summary-panel');

            return {
                label: $option.find('.ois-option-name').text(),
                value: $option.find('.ois-option-value').text(),
                summary: $summary.find('.oios-option-line').map(function(i, summaryLine) {
                    var $summaryLine = $(summaryLine);
                    return {
                        label: $summaryLine.find('.ois-option-name').text(),
                        value: $summaryLine.find('.ois-option-value').text(),
                    };
                }),
                personalization: $personalization.contents().length ? _parsePersonalization($option, $personalization) : ''
            };
        });
        var shouldHide = true;

        return {
            options: options,
            shouldHide: shouldHide
        };
    };

    var _parseStock = function($stockContainer) {
        var stockText = $stockContainer.text($stockContainer.text().replace(/Availability\:\s/, '')).text();

        stockText.trim();
        var isInStock = /([0-9]{2}\/[0-9]{2}\/[0-9]{4})/i.test(stockText) ? '' : /in-stock/i.test(stockText) ? 'u-text-dark-brand' : '';

        return {
            class: isInStock,
            text: stockText
        };
    };

    var _parse = function($productItem, $personalization) {
        var $placeholderImage = $productItem.find('.gwt-shoppingcart-thumbnail-image');
        var replaceId = Utils.generateUid();

        $placeholderImage.addClass('js-needs-replace').attr('data-replace-id', replaceId);

        return {
            productImage: $placeholderImage,
            productName: $productItem.find('.gwt-oid-name'),
            productOptions: _parseOptions($productItem.find('.gwt-oid-description-panel'), $personalization),
            productPrice: $productItem.find('.gwt-oid-number').next().text().split(':')[1],
            productSku: $productItem.find('.gwt-oid-number'),
            stock: _parseStock($productItem.find('.gwt-oid-availability'))
        };
    };

    return {
        parse: _parse
    };
});
