define([
    '$',
    'global/utils/template-reader',
    'translator',
    'capitalize'
],
function($, templateReader, translator) {

    var count = 0;
    var _getSingleQty = function($qtyContainer, $item) {
        var count = $qtyContainer.data('initialquantity');
        var min = $qtyContainer.data('minquantity') !== undefined ? $qtyContainer.data('minquantity') : 1;
        var max = $qtyContainer.data('maxquantity');
        var $select = $qtyContainer.find('select');

        if (typeof count === 'string') {
            count = parseInt(count.replace(/[^\d]/g, ''));
        }

        if ($qtyContainer.length) {
            return {
                count: count.toString(),
                isMin: count === min,
                isMax: count === max,
                container: $select.length ? $select : $qtyContainer
            };
        } else {
            return {
                // TODO: this doesn't seem to be used
                isValOnly: true,
                count: $item.find('.qty').children().first().text()
            };
        }
    };

    var _getMultipleQtys = function($containers, $item) {
        return $containers.map(function(i, container) {
            var data = _getSingleQty($(container), $item);

            data.qtyTitle = translator.translate('registry_stepper_label_' + i);

            return data;
        });
    };

    var _getQuantity = function($item) {
        var $container = $item.find('[id*="gwt_quantity_control"]')
            .addClass('u-visually-hidden js-qty-select');

        $container.parent()
            .addClass('t-gift-registry-view__stepper');

        if ($container.length === 1) {
            return _getSingleQty($container, $item);
        } else if ($container.length === 0) {
            var count = $item.find('[id^="quantityToPur_"]').text();
            if (count) {
                // Must be PDP configurator item..
                // let's show a quantity stepper whose quantity is fixed (just like on desktop)
                return {
                    count: count,
                    isMin: true,
                    isMax: true
                };
            }
        } else {
            return _getMultipleQtys($container, $item);
        }
    };

    var _getRegistryQuantity = function($item) {
        var $containers = $item.find('.qtyReq, .qtyPur, .qtyToPur').filter(function() {
            return $(this).children().length > 0;
        });

        return $containers.map(function(i) {
            var $dropdown = $(this).find('[id*="gwt_quantity_control"]');
            var data;

            if ($dropdown.length > 0) {
                $dropdown.addClass('u-visually-hidden js-qty-select');
                data = _getSingleQty($dropdown, $item);
            } else {
                // Must be PDP configurator item..
                // let's show a quantity stepper whose quantity is fixed (just like on desktop)
                data = {
                    count: $(this).find('[id^="quantity"]').first().text(),
                    isMin: true,
                    isMax: true,
                };
            }

            data.qtyTitle = translator.translate('registry_stepper_label_' + i);
            return data;
        });
    };

    var _getViewQtys = function(itemData, $item) {
        var $cells = $item.find('[class*="qty"]');

        return $cells.map(function(i, cell) {
            var $cell = $(cell);
            var $form = $cell.find('form');

            if (!$cell.children().length) {
                return;
            }

            if ($form.length) {
                var $dropdown = $form.find('[id*="gwt_quantity_control"]');
                if ($dropdown.length > 0) {
                    return jQuery.extend({
                        form: $form,
                        hiddenInputs: $form.find('[type="hidden"]'),
                        qtyTitle: translator.translate('registry_stepper_label_' + i),
                    }, _getQuantity($cell));

                } else {
                    // Must be PDP configurator item..
                    // let's show a quantity stepper whose quantity is fixed (just like on desktop)
                    return {
                        form: $form,
                        hiddenInputs: $form.find('[type="hidden"]'),
                        qtyTitle: translator.translate('registry_stepper_label_' + i),
                        count: $form.find('[id*="quantityToPur_"]').text(),
                        isMin: true,
                        isMax: true
                    };
                }
            }

            return {
                count: $cell.text(),
                stepperDisabled: true,
                qtyTitle: translator.translate('registry_stepper_label_' + i)
            };
        });
    };

    var _parseButton = function($button) {
        return {
            buttonText: $button.text(),
            onclick: $button.attr('onclick'),
            buttonClasses: $button.attr('class'),
            buttonContainer: $button.parent()
        };
    };

    var _parseGiftOption = function($giftOptionContainer) {
        var $input = $giftOptionContainer.find('input');
        var $giftItemTooltip = $giftOptionContainer.find('.showGiftInfoPopup');

        $giftItemTooltip.find('ul').addClass('c-list c--bullet-list');
        $giftItemTooltip.find('p').addClass('u-margin-bottom-0');

        if (!$giftOptionContainer.length) {
            return;
        }

        return {
            input: {
                onclick: $input.attr('onclick'),
                id: $input.attr('id'),
                name: $input.attr('name'),
                value: $input.val(),
                checked: $input.attr('checked')
            },
            labelText: $giftOptionContainer.find('label').text(),
            tooltipContentDOM: $giftItemTooltip
        };
    };

    var _appendEachToPrice = function(priceText) {
        if (priceText === '' || /each/i.test(priceText)) {
            return priceText;
        }

        return priceText + ' each';
    };

    var _parsePrice = function($product) {
        var $priceOriginal = $product.find('.orig, .listPrice');
        var $discountPrice = $product.find('.discountPrice:first');
        var priceSingle = $priceOriginal.text();
        var $originalPrice = $product.find('.totalPriceCurrentOrderDisplay, .totalPriceOrderReview');

        // CF-619: Replace the labels with ones that match the PDP
        var discountPrice = $discountPrice.text().replace(/was/i, '').trim();
        var itemSalePrice = $product.find('.nowLabel').text().replace(/sale/i, '').trim();

        return {
            quantity: $product.find('.qty p:first').text().trim(),
            priceSingle: priceSingle.trim().replace(/was/i, ''),
            promoText: $product.find('a[id*="itemPromoDesc"]').text().trim(),
            promoTooltip: $product.find('div[id*="itemPromoDesc"]'),
            discountPrice: discountPrice,
            itemSalePrice: itemSalePrice,
            priceOriginal: $originalPrice.length ? $originalPrice.text().trim() : $product.text(), // The total price
            tier1: !!(priceSingle.length && !itemSalePrice.length && !discountPrice.length),
            tier2: !!(priceSingle.length && itemSalePrice.length && !discountPrice.length),
            tier2Promo: !!(priceSingle.length && !itemSalePrice.length && discountPrice.length),
            tier3: !!(priceSingle.length && itemSalePrice.length && discountPrice.length)
        };
    };

    var _parseShippingSurcharge = function($cartItem) {
        var $surchargeRow = $cartItem.find('[id*="shipSurcharge_"]');

        // CF-647: The surcharge info may not be in the item, it may be adjacent to the item
        if (!$surchargeRow.length) {
            var $nextItem = $cartItem.nextAll('.orderItemRow').first();
            var $possibleSurchargeRow = $cartItem.nextAll('[id*="shipSurcharge_"]').first();

            // If the next surcharge row is before the next item, then it belongs to the current item
            if (!$nextItem.length || $possibleSurchargeRow.index() < $nextItem.index()) {
                $surchargeRow = $possibleSurchargeRow;
            }
        }

        if ($surchargeRow.length) {
            var text = $surchargeRow.find('#shipSurchargedesc').text().trim();
            var totalPrice = $surchargeRow.find('.totalprice').text();

            return {
                message: text + ': ' + totalPrice
            };
        }

        return;
    };

    var _parsePersonalizationRow = function($cartItem) {
        var $personalizationRow = $cartItem.find('[id*="personalizationRow"]');
        if (!$personalizationRow.length) {
            $personalizationRow = $cartItem.next('.perzonalizationRow');
        }
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

    var _paresCoodinatingItem = function($cartItem) {
        var $upsellItemRow = $cartItem.find('.cartUpSellRow');

        if ($upsellItemRow.length) {
            var data = templateReader.parseJSONContainer($upsellItemRow.find('.JSON')).pageProduct;
            return {
                title: $upsellItemRow.find('.contentLeaderText').text(),
                widget: $upsellItemRow.find('.cartUpSellWidget').remove()
            };
        }
    };

    var _parseShippingMethod = function($cartItem) {
        var $shippingSelect = $cartItem.find('.shipmode');
        var $deliveryOptionsLink = $cartItem.find('.deliveryOptsLink a');

        count++;

        if ($shippingSelect.length) {
            return {
                shippingSelect: $shippingSelect.attr('hidden', 'true'),
                shippingOptions: $shippingSelect.children().map(function(i, option) {
                    return {
                        text: option.textContent,
                        value: option.value,
                        checked: option.selected,
                        type: 'radio',
                        name: 'js-shipping-method-' + count
                    };
                }),
                reviewLink: !!$deliveryOptionsLink.length ? {
                    href: $deliveryOptionsLink.attr('href'),
                    text: $deliveryOptionsLink.text()
                } : ''
            };
        }
    };

    var _parseGiftOptions = function($cartItem) {
        var $firstGiftRow = $cartItem.next('.perzonalizationRow').next('.giftMessageRow');
        var $editGiftLink = $cartItem.find('.edit_gift_option_link a');

        if ($editGiftLink.length) {
            $firstGiftRow = $firstGiftRow.add($firstGiftRow.next('.giftMessageRow'));

            return {
                editGiftOptionsLink: {
                    text: $editGiftLink.text(),
                    href: $editGiftLink.attr('href')
                },
                optionDetails: $firstGiftRow.map(function(i, giftRow) {
                    var $giftRow = $(giftRow);
                    return {
                        content: $giftRow.find('.gifting').text(),
                        price: $giftRow.find('.price').text()
                    };
                })
            };
        }
    };

    var _parseGiftMessage = function($giftMsg) {
        var giftMessageText = $giftMsg.text().trim();

        if (/^Gift Message\:\w/i.test(giftMessageText)) {
            giftMessageText = giftMessageText.replace(/Gift Message\:/, 'Gift Message: ');
        }

        return giftMessageText;
    };

    var _capitalizeTitle = function(title) {
        return $.capitalize(title).replace(/(-)\S/g, function(a) {
            return a.toUpperCase();
        });
    };

    var _parseJSON = function(itemData) {
        return {
            itemName:  _capitalizeTitle(itemData.prodName),
            itemHref: itemData.productDetailTargetURL,
            itemNumber: itemData.mfPartNumber,
        };
    };

    var _getRegistryMessage = function($cartItem) {
        var $registryMessage = $cartItem.find('.cart-giftreg-msg');
        var $registryRowContent = $cartItem.next('.perzonalizationRow').next('tr').find('.registryInfo');

        if ($registryMessage.length) {
            return $registryMessage;
        }

        if ($registryRowContent.length) {
            return $('<div>').html($registryRowContent.html());
        }
    };


    var _parse = function($cartItems) {
        return $cartItems.map(function(i, cartItem) {
            var $cartItem = $(cartItem);
            var $itemJSONContainer = $cartItem.find('.JSON');
            var itemJSON = $itemJSONContainer.length ? templateReader.parseUsingEval($itemJSONContainer.first()).pageProduct : {};
            if (!itemJSON) {
                return;
            }
            var jsonData = _parseJSON(itemJSON);
            var cartData = {
                itemNumberPrefix: 'Item #',
                quantity: _getQuantity($cartItem),
                editButtonDOM: $cartItem.find('[id*="editButton"] .button').addClass('t-cart__edit-button c-button c--link c--simple'),
                removeButtonDOM: $cartItem.find('.qty').find('a, button').addClass('c-button c--outline c--small'),
                giftOption: _parseGiftOption($cartItem.find('.gift-checkbox')),
                price: _parsePrice($cartItem),
                shippingSurcharge: _parseShippingSurcharge($cartItem),
                upsellItem: _paresCoodinatingItem($cartItem),
                originalContent: $cartItem.find('td').map(function(i, cell) {
                    var $cell = $(cell);
                    return {
                        class: $cell.attr('class'),
                        content: $cell.html()
                    };
                }),
                giftMessage: _parseGiftMessage($cartItem.find('.giftmessage')),
                includeDeliveryMethod: !!$cartItem.find('.delivryShipMethod').length,
                personalizationRow: _parsePersonalizationRow($cartItem),
                shippingMethod: _parseShippingMethod($cartItem),
                giftOptions: _parseGiftOptions($cartItem),
                registryMessage: _getRegistryMessage($cartItem)
            };


            return jQuery.extend(cartData, jsonData);
        });
    };

    var _parseWishlistItem = function($items, isRegistry, isView) {
        return $items.map(function(i, item) {
            var $item = $(item);
            var itemData = JSON.parse($item.find('.JSON').first().text()).pageProduct;
            var jsonData =  _parseJSON(itemData);
            var $removeButton = $item.find('.gr-item-remove_link a');
            var wishlistData = {
                isWishlist: true,
                complete: $item.find('.gr-item-met-amount-cpmplete'),
                addToCartButton: $item.find('[id*="gwt_add_to_cart_option_link"], .wish-list-add-to-cart').find('a'),
                removeButton: $removeButton,
                price: _parsePrice($item.find('.price').not('#perzuprice')),
                isRegistry: isRegistry,
                dateAdded: $item.find('.dateAdded').text(),
                completedText: $item.find('.gr-item-met-amount-cpmplete'),
                originalContent: $item.find('td').map(function(i, cell) {
                    var $cell = $(cell);
                    return {
                        class: $cell.attr('class'),
                        content: $cell.html()
                    };
                })
            };


            if (!$removeButton.length) {
                $removeButton = $item.find('.options > a');
                wishlistData.removeButton = $removeButton;
            }

            $removeButton.addClass('c-button c--small c--outline');
            $removeButton.text('Remove');

            if (!wishlistData.addToCartButton.length) {
                wishlistData.addToCartButton = $item.find('.primary');
            }

            wishlistData.addToCartButton.addClass('c-button c--full-width');

            if (isView) {
                wishlistData.qtySteppers = _getViewQtys(itemData, $item);
            } else if (isRegistry) {
                wishlistData.qtySteppers = _getRegistryQuantity($item);
            } else {
                wishlistData.quantity = _getQuantity($item);
            }

            jsonData.itemNumber = '#' + jsonData.itemNumber;


            return jQuery.extend(wishlistData, jsonData);
        });
    };

    return {
        parse: _parse,
        parseWishlistItem: _parseWishlistItem
    };
});
