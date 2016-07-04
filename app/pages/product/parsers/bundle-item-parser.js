define([
    '$',
    'global/utils/dummy-element',
    'dust!pages/product/partials/bundle-item-options',
    'pages/product/parsers/product-data-parser',
    'global/parsers/price-parser'
], function($, DummyElement, bundleItemTemplate, productDataParser, priceParser) {

    // CF-662: We need to use our own counter for the stepper class instead of index
    // Using index will result in the stepper class index being out of sync with
    // the actual number of QTY selects if a bundle PDP has an unavailble item
    var qtyCount;

    var _parseQty = function($quantity) {
        var data = {
            class: 'js-stepper-' + qtyCount,
            count: $quantity.val(),
            minValue: $quantity.children('option').first().text(),
            maxValue: $quantity.children('option').last().text()
        };
        qtyCount++;

        return data;
    };


    var parse = function($items, sizeChart) {
        qtyCount = 0;
        var itemList = $items.map(function(index, item) {
            var $item = $(item);
            var id = DummyElement.randomId();

            // Manually trigger this so the client script append rest of the product details
            $item.find('.gwt-long-desc-panel').find('a').triggerGWT('click');

            var $optionDropdowns = $item.find('.gwt-product-option-panel-listbox select');
            var $stockMessageContainer = $item.find('.gwt-product-detail-widget-dynamic-info-panel');
            var $quantity = $item.find('.gwt-product-detail-widget-quantity-panel select');
            var $errorMessagesContainer = $item.find('[id^="gwt-error-placement-div"]');
            var $personalizationTriggerContainer = $item.find('.gwt-product-detail-widget-personalization-panel').addClass('c-action__label');
            var $personalizationTrigger = $item.find('.gwt-product-detail-widget-personalization-panel .gwt-personalize-link-style');

            var sizeChartContent = productDataParser.getSizeChart(index);
            // Always show the size chart for the first item in the bundle
            var hasSizeChart = $item.find('.gwt-Anchor:contains("size chart")').length > 0 || index === 0;

            return {
                id: id,
                class: $quantity.attr('name'),
                image: {
                    src: $item.find('.gwt-pdp-collection-thumbnail-image').attr('src').replace('?$P_CollThumb$', ''),
                    alt: $item.find('.gwt-pdp-collection-thumbnail-image').attr('alt')
                },
                expired: $item.find('.gwt-product-detail-widget-base-expired-label').text(),
                heading: $item.find('.bundle-info-product-name > h3').text(),
                itemNo: $item.find('.gwt-product-detail-widget-title').text(),
                exclusive: $item.find('.exclusive').text(),
                isChokingHazard: $item.find('.choking-hazards-panel'),
                price: priceParser.parse($item),
                productDetail: {
                    id: id,
                    headerContent: 'Details',
                    content: {
                        data: $item.find('.gwt-long-desc-panel .gwt-HTML, .choking-hazards-panel')
                    }
                },
                content: {
                    contentTemplate: 'pages/product/partials/bundle-item-options',
                    data: {
                        options: $optionDropdowns.map(function() {
                            var $select = $(this);
                            var labelText = $select.attr('name');

                            return {
                                class: 'c--condensed ' + $quantity.attr('name'),
                                label: $('<label>' + labelText + '</label>'),
                                select: DummyElement.getSubstitute($select),
                                isSelect: true,
                            };
                        }),
                        stockRelatedMessage: DummyElement.getSubstitute($stockMessageContainer),
                        personalizeItem: {
                            class: 'js-personalize-link',
                            desktop: DummyElement.getSubstitute($personalizationTriggerContainer)
                        },
                        quantity: $quantity.length ? _parseQty($quantity) : null,
                        errorMessages: DummyElement.getSubstitute($errorMessagesContainer),
                        hasSizeChart: hasSizeChart,
                        sizeChartContent: sizeChartContent,
                        sizeChartText: $item.find('.gwt-custom-link a').text() || 'Size Chart'
                    }
                }
            };
        });
        return itemList;
    };

    return {
        parse: parse
    };
});
