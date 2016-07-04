define([
    '$',
    'global/utils/dom-operation-override',
    'components/sheet/sheet-ui',
    'dust!components/accordion/accordion',
    'dust!components/field-row/field-row',
    'global/utils/dummy-element',
    'global/parsers/product-details-tab-parser'
],
function(
    $,
    domOverride,
    sheet,
    BellowsTemplate,
    FieldRowTemplate,
    DummyElement,
    ProductDetailsTabParser
) {
    var $freeGiftPinny = $('.js-free-gift-pinny');
    var $detailsPinny = $('.js-details-pinny');
    var freeGiftSheet;
    var detailsSheet;

    var transformItemName = function($originalModal, $itemDetails) {
        // Split the item title into its name and number so we can style it appropriately
        var nameParts = $originalModal.find('.gwt-product-detail-widget-title').text().split(' - ');
        var itemNumber = 'Item ' + nameParts[0];
        var itemName = nameParts[1];
        var $name = $('<h3 class="u-margin-bottom-sm c-cart-item__name u-text-capitalize">');
        var $number = $('<em class="c-cart-item__item-number">');

        $name.text(itemName);
        $number.text(itemNumber);
        $itemDetails.append($name);
        $itemDetails.append($number);
    };

    var transformPrice = function($originalModal, $itemDetails) {
        var $pricePanel = $originalModal.find('.gwt-product-detail-widget-price-column');
        $pricePanel.addClass('c-price');

        // Replace the divs with spans so the content wraps correctly
        $pricePanel.children().each(function(_, el) {
            var $el = $(el);
            var $span = $('<span>');

            if ($el.text().trim().length) {
                $span.text($el.text());
                $span.addClass('u-margin-end-sm');

                // Style the price if it's reduced
                if ($el.is('.gwt-product-detail-widget-price-now')) {
                    $span.addClass('c-price__sale');
                } else if ($el.is('.gwt-product-detail-widget-price-was')) {
                    $span.addClass('c-price__original');
                }

                $el.replaceWith($span);
            } else {
                $el.remove();
            }
        });

        $itemDetails.append($pricePanel);
    };

    var transformViewDetailsButton = function($originalModal, $itemDetails) {
        var $viewDetailsButton = $originalModal.find('.gwt-quickshop-product-detail-widget-image-column .pdp-linkpanel a').last();
        $viewDetailsButton.addClass('u-text-weight-bold');
        $viewDetailsButton.text('+ ' + $viewDetailsButton.text());
        $viewDetailsButton.wrap('<div class="u-margin-top-sm u-margin-bottom-sm">');
        $itemDetails.append($viewDetailsButton.parent());
    };

    var transformQuantity = function($originalModal, $itemDetails) {
        var $itemQuantity = $originalModal.find('.gwt-product-detail-widget-quantity-panel');

        // If the quantity selector only contains one option, just show that option as text
        if ($itemQuantity.find('option').length === 1) {
            var qty = $itemQuantity.find('option').val();
            var $label = $itemQuantity.find('.gwt-product-detail-widget-quantity-label');
            var newText = $label.text() + ': ' + qty;

            $label.text(newText);
            $itemQuantity.find('.gwt-product-detail-widget-quantity-panel-container').remove();
        }

        $itemQuantity.addClass('u-margin-bottom-md u-padding-top-md u-padding-bottom-md   u-border-top-bottom u-border-right-left-none u-border-dashed u-border-gray');
        $itemDetails.append($itemQuantity);
    };

    var transformFreeGiftDetails = function($originalModal) {
        var $itemDetails = $('<div class="c-cart-item__details c-arrange__item">');

        transformItemName($originalModal, $itemDetails);
        transformViewDetailsButton($originalModal, $itemDetails);
        transformQuantity($originalModal, $itemDetails);
        transformPrice($originalModal, $itemDetails);

        return $itemDetails;
    };

    var transformOptions = function($originalModal) {
        var $optionsContainer = $('<div class="u-margin-bottom-md u-margin-top-md">');

        var $options = $originalModal.find('.gwt-product-option-panel').children();

        if (!$options.find('select').length) {
            return;
        }

        $options.each(function(i, el) {
            var $el = $(el);
            var labelText = $el.find('.gwt-product-options-panel-option-title').text();
            var $select = $el.find('select');

            labelText = labelText.replace('Select', '');

            var templateContent = {
                fields: [{
                    isSelect: true,
                    select: DummyElement.getSubstitute($select),
                    label: $('<label class="u-text-capitalize">' + labelText + '</label>'),
                    class: 'c--condensed'
                }]
            };

            new FieldRowTemplate(templateContent, function(err, html) {
                $optionsContainer.append(html);

                DummyElement.replaceAllSubstitutes($optionsContainer);
            });
        });

        return $optionsContainer;
    };

    var transformButtons = function($originalModal) {
        var $buttons = $originalModal.find('.gwt-submit-cancel-dialog-button-panel');
        var $primary = $buttons.find('.primary');
        var $secondary = $buttons.find('.secondary');

        $primary.addClass('c-button c--primary c--full-width');
        $primary.text($primary.text().replace('Cart', 'Bag'));
        $secondary.addClass('c-button c--outline c--full-width u-margin-top-md');
        $secondary.insertAfter($primary);
        $buttons.addClass('u-margin-top-md');

        return $buttons;
    };

    var transformFreeGiftModal = function(originalModal) {
        var $originalModal = $(originalModal);
        var $body = $('<div>');
        var title = $originalModal.find('.gwt-gwp-modal-descriptive-text').text();
        var $itemContainer = $('<div class="c-arrange">');
        var $imageContainer = $('<div class="c-cart-item__image c-arrange__item">');
        var $itemDetails = $('<div class="c-cart-item__details c-arrange__item">');

        // Remove the second half of the title
        title = title.split('.')[0];

        $imageContainer.append($originalModal.find('.gwt-pdp-gift-image'));

        $itemContainer.append($imageContainer);
        $itemContainer.append(transformFreeGiftDetails($originalModal));

        $body.append($itemContainer);
        $body.append(transformOptions($originalModal));
        $body.append(transformButtons($originalModal));

        // On old android devices,
        // desktop scripts block the user from clicking outside the modal
        // So, we need to put our sheet inside their modal
        $originalModal.addClass('c--contains-sheet');
        $originalModal.append(freeGiftSheet.$el.parent());

        freeGiftSheet.setTitle(title);
        freeGiftSheet.setBody($body);
        freeGiftSheet.open();
    };

    var transformDetailModal = function(originalModal) {
        var $modalContent = $(originalModal);
        var templateContent = ProductDetailsTabParser.parse($modalContent);
        var $content, title;

        $modalContent.find('ul').addClass('c-list-bullets');

        if (templateContent.items.length > 1) {
            templateContent.items[0].isOpen = true;
            title = $modalContent.find('.Caption').text();

            new BellowsTemplate(templateContent, function(err, html) {
                $content = $(html);
                $content.bellows();
            });
        } else {
            title = $modalContent.find('.gwt-TabBarItem').text();
            $content = $modalContent.find('.gwt-TabPanelBottom .gwt-HTML');
        }

        $modalContent.addClass('c--contains-sheet');
        $modalContent.append(detailsSheet.$el.parent());

        detailsSheet.setTitle(title);
        detailsSheet.setBody($content);

        freeGiftSheet.close();
        detailsSheet.open();
    };

    var freeGiftUI = function() {
        freeGiftSheet = sheet.init($freeGiftPinny);
        detailsSheet = sheet.init($detailsPinny, {
            closed: function() {
                freeGiftSheet.open();
            }
        });

        // We aren't providing this as the closed callback
        // because we want to be able to close and reopen the modal
        freeGiftSheet.$el.find('.pinny__close').on('click', function() {
            var $freeGiftModal = $('#gwt-gift-with-purchase-modal');

            // Move it out of the closing desktop modal
            $('body').append(freeGiftSheet.$el.parent());

            // There is no close button on the desktop site
            // The user either has to accept or reject the gift
            // For now, match the behaviour on GH and reject the gift on close
            freeGiftSheet.$el.find('.secondary').triggerGWT('click');
        });

        detailsSheet.$el.find('.pinny__close').on('click', function() {
            var $detailsModal = $('#gwt-product-detail-info-modal');

            // Move it out of the closing desktop modal
            $('body').append(detailsSheet.$el.parent());

            $detailsModal.find('.secondary').triggerGWT('click');
        });

        domOverride.on('domAppend', '#gwt-gift-with-purchase-modal', transformFreeGiftModal);
        domOverride.on('domAppend', '#gwt-product-detail-info-modal', transformDetailModal);
    };

    return freeGiftUI;
});
