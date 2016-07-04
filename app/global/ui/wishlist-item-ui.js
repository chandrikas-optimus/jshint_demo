define([
    '$',
    'global/utils/dom-operation-override',
    'global/ui/tooltip-ui',
    'magnifik',
    'dust!components/product-summary/partials/product-summary-table'
], function($, domOperation, tooltipUI, magnifik, productSummaryTableTemplate) {

    var $favouriteIcon = $('<div class="c--column u-margin-bottom-neg-lg u-margin-top-neg c-fill-button "><svg class="c-icon">'
        + '<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-favourite"></use>'
        + '</svg></div>');

    var _addOptions = function($optionContainer, $descriptionContainer) {
        var $options = $descriptionContainer.children('.gwt-HTML').not('.gwt_gr_number_label, .clearboth');

        $options.each(function(i, option) {
            $optionContainer.append($('<p>').text(option.textContent));
        });

        var $pdpConfiguratorOptions = $descriptionContainer.find('.moreContentExpander .oios-summary-panel');
        if ($pdpConfiguratorOptions.length > 0) {
            var tableRows = [];

            $pdpConfiguratorOptions.find('.oios-option-line').each(function() {
                var $line = $(this);
                var value = $.trim($line.find('.ois-option-value').text());
                var toBeIndented = $line.closest('.oios-pcat-summary-panel, .oios-pcat-pers-summary-panel').length > 0;

                tableRows.push({
                    label: $line.find('.ois-option-name').text(),
                    value: value,
                    setFontWeightBold: !value ? true : null,
                    indentClass: toBeIndented ? 'u-padding-start-md u-border-left' : '',
                });
            });

            productSummaryTableTemplate({table: tableRows}, function(err, html) {
                $optionContainer.append(html);
            });
        }
    };

    var _transformPersonalization = function(option) {
        var $option = $(option);
        var $cartItem = $option.closest('.js-cart-item');

        if ($option.is('.gwt-HTML:not(.clearboth)') && $cartItem.length) {
            var $cartItemPersonalization = $cartItem.find('.js-personalization');

            // CF-747: Add space after ':' inbetween attribute values
            $cartItemPersonalization.append($('<div class="c-cart-item__personalization-item">').text($option.text().replace(':', ': ')));
            $cartItemPersonalization.removeAttr('hidden');
        }
    };

    var _addFavouriteLink = function($favouriteContainer, $mainItemContainer) {
        var $link = $favouriteContainer.find('.gwt-HTML');
        var $title = $mainItemContainer.find('.js-title');
        $link.html($favouriteIcon.clone());


        if ($favouriteContainer.hasClass('selected')) {
            $link.children().addClass('c--fill');
        }

        $link.append('<span class="u-text-size-xxsmall">favorite</span>');
        $link.addClass('u-text-align-center');


        $favouriteContainer.addClass('c-arrange__item c--shrink js-favourite-link');
        $title.addClass('c-arrange__item');
        $title.wrap('<div class="c-arrange">');

        $title.after($favouriteContainer);

        $favouriteContainer.on('click', function(e) {
            $(this).find('.c-fill-button').toggleClass('c--fill');
        });
    };


    var _transformWishlistItem = function(itemPanel) {
        var $ = Adaptive.$;
        var $itemPanel = $(itemPanel);
        var $mainItemContainer = $(this).parents('.js-cart-item');
        var $detailsLink = $itemPanel.find('.gwt-gr-image-details-link');
        var $zoomLink = $itemPanel.find('.pdp-linkpanel a');
        var $imageContainer = $mainItemContainer.find('.js-product-image');
        var availabilityMessage = $itemPanel.find('.gr-availability-panel').text();
        var $availabilityContainer = $mainItemContainer.find('.js-availability');
        var $productDetailsButton = $itemPanel.find('.gwt-gr-image-details-link');
        var $imageLink = $('<a class="magnifik">');
        var $image = $itemPanel.find('.gwt-shoppingcart-thumbnail-image, .gwt-gift-registry-pc-thumbnail-image');
        var $options = $mainItemContainer.find('.js-options');
        var $customMessage = $itemPanel.find('.gr-item-message-panel');

        var getHigherResImage = function(src) {
            return src.replace('$P_QOrder_Thumb$', '$pczoom$');
        };

        if ($image.attr('src')) {
            $imageLink.attr('href', getHigherResImage($image.attr('src')));
        } else {
            // Wait until 'src' attribute is ready for us to parse
            $image.on('load', function() {
                $imageLink.attr('href', getHigherResImage($image.attr('src')));
            });
        }
        $imageLink.append($image);

        $mainItemContainer.find('.js-zoom').on('click', function() {
            var $zoomLink = $(this);

            $zoomLink.siblings('.magnifik').find('img').trigger('click');
        });

        // Add Favourite Link
        _addFavouriteLink($itemPanel.find('.gwt_gr_top5_panel'), $mainItemContainer);

        // Add Image
        $imageContainer.prepend($imageLink);
        $imageContainer.find('.js-zoom').removeAttr('hidden');

        // Add options
        _addOptions($options, $itemPanel.find('.gwt_gr_details_panel'));

        if ($customMessage.length) {
            // Add custom message
            $options.append($('<p>').text($customMessage.text().replace(':', ': ')));
        }


        // Add product details button
        $productDetailsButton.prepend('+ ');
        $mainItemContainer.find('.js-product-details-button').append($productDetailsButton.addClass('u-text-brand'));

        // Add avilability
        availabilityMessage = availabilityMessage.replace(':', ': ');
        $availabilityContainer.html(availabilityMessage);

        if (/in-stock/i.test(availabilityMessage)) {
            $availabilityContainer.addClass('u-text-dark-brand');
        }

        if ($mainItemContainer.is($('.js-cart-item').last())) {
            domOperation.on('domAppend', '', _transformPersonalization, '.gwt_gr_details_panel');

            $('.magnifik').magnifik({
                stageHTML: function() {
                    var closeIcon = '<svg class="c-icon "><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-delete"></use></svg>';
                    return '<div class="' + this._getClass('canvas') + '"><div class="m-close c-zoom c--top-right">' + closeIcon + '</div><img class="'
                        + this._getClass('thumb') + '"><img class="'
                        + this._getClass('full') + '"></div>';
                }
            });
        }
    };

    var wishlistItemUI = function() {
        domOperation.on('domAppend', '', _transformWishlistItem, '[id*="gwt_giftregistry_item_display"]');
        tooltipUI();
    };

    return wishlistItemUI;
});
