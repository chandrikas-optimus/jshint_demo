define([
    '$',
    'global/utils/template-reader',
    'global/parsers/price-parser',
    'capitalize'
], function($, JSONTemplate, priceParser) {
    var _getQty = function(itemData, $item) {
        var $container = $item.find('[id*="gwt_quantity_control"]').addClass('u-visually-hidden js-qty-select');
        var value = itemData.quantity;

        // CF-645: The user can't change the quantity of a free item
        if (!$container.length) {
            return {
                staticQuantity: $item.find('.qty li').first().text()
            };
        }

        return {
            count: value,
            container: $container,
            isMax: value === $container.data('maxquantity'),
            isMin: value === 1
        };
    };

    var _parsePersonalizationRow = function($cartItem) {
        var $personalizationRow = $cartItem.find('[id*="personalizationRow"]');

        return {
            id: $personalizationRow.attr('id'),
            content: $personalizationRow.children().map(function(i, cell) {
                return {
                    class: cell.className,
                    id: cell.id,
                    cellContent: $(cell).html()
                };
            })
        };
    };

    var _parsePrice = function($product) {
        var $priceOriginal = $product.find('.orig, .listPrice');
        var $discountPrice = $product.find('.discountPrice:first');
        var priceSingle = $priceOriginal.text();

        // CF-645: Show the free item message instead of a price
        if ($product.find('.freeItem').length) {
            var message = $product.find('.freeItem').first().text();
            message += $product.find('.itemLevelAdj a').text();

            return {
                freeItemMessage: message
            };
        }

        // CF-619: Replace the labels with ones that match the PDP
        var discountPrice = $discountPrice.text().replace(/was/i, '').trim();
        var itemSalePrice = $product.find('.nowLabel').text().replace(/sale/i, '').trim();

        return {
            quantity: $product.find('.qty [id*="gwt_quantity_control"]').attr('data-initialquantity'),
            priceSingle: priceSingle.trim().replace(/was/i, ''),
            promoText: $product.find('a[id*="itemPromoDesc"]').text().trim(),
            promoTooltip: $product.find('div[id*="itemPromoDesc"]'),
            discountPrice: discountPrice,
            itemSalePrice: itemSalePrice,
            priceOriginal: $product.find('.totalPriceCurrentOrderDisplay, .totalPriceOrderReview').text().trim(), // The total price
            tier1: !!(priceSingle.length && !itemSalePrice.length && !discountPrice.length),
            tier2: !!(priceSingle.length && itemSalePrice.length && !discountPrice.length),
            tier2Promo: !!(priceSingle.length && !itemSalePrice.length && discountPrice.length),
            tier3: !!(priceSingle.length && itemSalePrice.length && discountPrice.length)
        };
    };

    var _capitalizeTitle = function(title) {
        return $.capitalize(title).replace(/(-)\S/g, function(a) {
            return a.toUpperCase();
        });
    };

    var _parseShippingSurcharge = function($product) {
        var $surchargeRow = $product.find('#shipSurcharge_');

        if ($surchargeRow.length) {
            var text = $surchargeRow.find('#shipSurchargedesc').text().trim();
            var totalPrice = $surchargeRow.find('.totalprice').text();

            return text + ': ' + totalPrice;
        }
    };

    var parse = function($container) {
        var $products = $container.find('> table > tbody > tr');

        return $products.map(function(_, product) {
            var $product = $(product);
            var $productRow = $product.find('tr').first();
            // CF-645: Only use the first, as free gift items have two JSON containers
            var $json = $product.find('.JSON').first();
            var prodData = $product.find('.JSON').length ? JSONTemplate.parse($json, true).pageProduct : '';

            if (!prodData) {
                return;
            }

            var colorSizeData = prodData;
            var $lowStock = $product.find('.lowInv_msg');
            var isLowStock = $lowStock.length > 0;
            var prodStock = isLowStock ? $lowStock.text() : $product.find('.availability').text(); // CF-492: Use full text
            var $giftCheckboxInput = $product.find('.gift-checkbox input');

            $giftCheckboxInput.attr('id', prodData.mfPartNumber);

            var $editButton = $product.find('[id*="editButton"] button');

            if (!$editButton.length) {
                // CF-645: The edit button has a different parent if the item is free
                $editButton = $product.find('.actions button').first();
            }

            $editButton.removeClass().addClass('c-button c--outline c--small c--full-width');

            return {
                edit: $editButton,
                remove: $product.find('.remove').removeClass().addClass('c-button c--outline c--small c--full-width'),
                price: _parsePrice($product),
                giftCheckbox: {
                    isCheckRadio: true,
                    label: $('<label for="' + prodData.mfPartNumber + '" class="u-text-transform-initial">' + $product.find('.gift-checkbox a').text() + '</label>'),
                    input: $giftCheckboxInput,
                    tooltipContentDOM: $product.find('.showGiftInfoPopup')
                },
                prodName: _capitalizeTitle(prodData.prodName.replace(/&amp;/g, '&')),
                prodHref: prodData.productDetailTargetURL,
                colorSize: colorSizeData,
                prodNum: prodData.mfPartNumber,
                prodStock: prodStock,
                lowStock: isLowStock,
                stepper: _getQty(prodData, $product),
                personalizationRow: _parsePersonalizationRow($product),
                originalContent: $productRow.find('td').map(function(i, cell) {
                    var $cell = $(cell);
                    return {
                        class: $cell.attr('class'),
                        content: $cell.html()
                    };
                }),
                registryMessage: $product.find('.cart-giftreg-msg'),
                shippingSurcharge: _parseShippingSurcharge($product),
            };
        });
    };

    return {
        parse: parse
    };
});
