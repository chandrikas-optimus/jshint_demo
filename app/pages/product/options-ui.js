define([
    '$',
    'global/utils/dummy-element',
    'global/utils',
    'pages/product/parsers/bundle-item-parser',
    'dust!pages/product/partials/options',
    'pages/product/validate-add-to-cart-ui',
    'pages/product/size-chart-ui'
], function(
    $,
    DummyElement,
    Utils,
    bundleItemParser,
    optionsTemplate,
    Validation,
    sizeChartUI
) {

    var $container = $('.js-product-options');
    var $qtyStepper;
    var $optionDropdowns;
    var $personalizationTrigger;

    var _syncQuantity = function($ourStepper, $desktopQty) {
        var val = $desktopQty.val();
        $ourStepper.find('.c-stepper__count').text(val);
    };

    var _productDetailProducts = function() {
        return $('.gwt-product-detail-widget');
    };

    var _parseSizeChart = function() {
        // Grabbing the sizechart image
        var $imageSizingChart = $('#img1').find('img');
        // Return the image or use a placeholer span that will be replaced by Hijax
        return ($('.gwt-Anchor:contains("size chart")').length === 0) ? $imageSizingChart : $('<span id="js-size-chart-content"></span>');
    };

    var _updateProductImage = function(element) {
        var colorRegex = /^([a-z ]+)? \$[0-9.]+/;
        if (element.name === 'color') {
            var $element = $(element);
            var selectedColor = $element.find('option[value="' + $element.val() + '"]').text();
            if (colorRegex.test(selectedColor)) {
                var $swatchElement = $('.js-swatches').find('.js-swatches-label').has('span:contains(' + colorRegex.exec(selectedColor)[1] + ')');
                $swatchElement.click();
            }
        }
    };

    var _updateBundleItemImage = function(element) {
        if (element.name === 'color') {
            var $colorSelect = $(element);
            var colourValue = $colorSelect.find(':selected').attr('color');
            var $itemContainer = $colorSelect.closest('.c-accordion');
            var $img = $itemContainer.find('.c-product-summary__image');
            var filenameMatch = /\d+_([A-Za-z]+)/.exec($img.attr('src'));
            var newSrc;
            var newZoomSrc;

            // If there are only two options (default and a colour) then we don't need to change the img
            if (filenameMatch && colourValue && $colorSelect.children().length > 2) {
                var filename = filenameMatch[0].replace(filenameMatch[1], colourValue);
                newSrc = Utils.getImageUrl(false, filename);
                newZoomSrc = Utils.getImageUrl(true, filename);

                $img.attr('src', newSrc)
                    .siblings('.js-magnifik')
                    .attr('href', newZoomSrc)
                    .find('img')
                    .attr('src', newZoomSrc);
            }
        }
    };

    var init = function() {
        // Assume that desktop content is ready
        var $bundledItems = _productDetailProducts();
        var desktop = {
            $optionDropdowns: $('.gwt-product-option-panel-listbox select'),
            $quantity: $('.gwt-product-detail-widget-quantity-panel select'),
            $stockMessageContainer: $('.gwt-product-detail-widget-dynamic-info-panel'),
            $errorMessagesContainer: $('[id^="gwt-error-placement-div"]').addClass('u-text-warning u-margin-top-md'),
            $personalizationTriggerContainer: $('.gwt-product-detail-widget-personalization-panel').addClass('c-action__label'),
            $personalizationTrigger: $('.gwt-product-detail-widget-personalization-panel .gwt-personalize-link-style'),
            notAvailableMessage: $.trim($('.gwt-product-detail-widget-base-expired-label').text()),
            $hazard: $('.choking-hazards-panel')
        };

        var isSingle = ($bundledItems.length === 1);

        var notAvailable;
        if (isSingle && desktop.notAvailableMessage !== '') {
            notAvailable = desktop.notAvailableMessage;
            $('.js-call-to-actions').parent().attr('hidden', '');
        }

        var sizeChart = {
            headerContent: 'Size Chart',
            content: {
                data: _parseSizeChart()
            },
            bodyClass: 'c--bleed '
        };

        // Parsing
        var data = {
            options: isSingle ? desktop.$optionDropdowns.map(function() {
                var $select = $(this);
                var labelText = $select.attr('name');

                return {
                    class: 'c--condensed',
                    label: $('<label>' + labelText + '</label>'),
                    select: DummyElement.getSubstitute($select),
                    isSelect: true,
                };
            }) : {},
            isSingle: isSingle,
            stockRelatedMessage: isSingle ? DummyElement.getSubstitute(desktop.$stockMessageContainer) : '',
            notAvailableMessage: notAvailable,
            personalizeItem: isSingle ? {
                class: 'js-personalize-link',
                desktop: DummyElement.getSubstitute(desktop.$personalizationTriggerContainer),
            } : {},
            quantity: isSingle ? {
                count: desktop.$quantity.val(),
                minValue: desktop.$quantity.children('option').first().text(),
                maxValue: desktop.$quantity.children('option').last().text()
            } : {},
            bundledItems: isSingle ? {} : bundleItemParser.parse($bundledItems, sizeChart),
            errorMessages: isSingle ? DummyElement.getSubstitute(desktop.$errorMessagesContainer) : '',
            hasSizeChart: $('.gwt-Anchor:contains("size chart")').length > 0,
            sizechart: sizeChart,
            sizeChartText: $('.gwt-custom-link a.gwt-Anchor').text() || 'Size Chart',
            isChokingHazard: desktop.$hazard
        };

        // Render template
        optionsTemplate(data, function(err, html) {
            $container.html(html);
            $container.parent().removeAttr('hidden');

            DummyElement.replaceAllSubstitutes($container);

            $qtyStepper = $container.find('.c-stepper');
            $optionDropdowns = $container.find('.c-select');
            $personalizationTrigger = $container.find('.js-personalize-link');

            sizeChartUI.init();

            // If single item
            if ($bundledItems.length === 1) {

                // Bind our handlers

                $qtyStepper.on('change.mobify', function(e, newCount) {
                    desktop.$quantity
                        .val(newCount)
                        .triggerGWT('change');
                });


                // Validate size and colour before you're allowed to click Add To Cart
                Validation.updateAddToCartButton($container.parent());
                $optionDropdowns.on('change', function(e) {
                    _updateProductImage(e.target);
                    Validation.updateAddToCartButton($container.parent());
                });
                desktop.$quantity.on('change', function() {
                    Validation.updateAddToCartButton($container.parent());
                });
            } else {
                // If bundled item
                $qtyStepper.on('change.mobify', function(e, newCount) {
                    desktop.$quantity.eq(/^js-stepper-([0-9])$/.exec(e.target.classNames().toArray()[1])[1])
                        .val(newCount)
                        .triggerGWT('change');
                });
                // Validate size and colour before you're allowed to click Add To Cart
                Validation.updateAddToCartButton($container.parent());
                $optionDropdowns.on('change', function(e) {
                    _updateProductImage(e.target);
                    _updateBundleItemImage(e.target);
                    Validation.updateAddToCartButton($('.' + e.target.parentElement.classNames().toArray()[2]));
                });
                desktop.$quantity.on('change', function(e) {
                    Validation.updateAddToCartButton($('.' + e.target.name));
                });


                $container.find('.c-product-summary__image').on('error', function(e) {
                    var $img = $(this);
                    var $magnifik = $img.siblings('.js-magnifik');
                    var newSrc = $img.attr('src').replace(/[A-Za-z]+(\?|$)/, 'main?');
                    var newZoomSrc = $magnifik.attr('href').replace(/[A-Za-z]+(\?|$)/, 'main?');

                    $img.attr('src', newSrc);
                    $magnifik
                        .attr('href', newZoomSrc)
                        .find('img').attr('src', newZoomSrc);
                });
            }



        });
    };

    return {
        init: init
    };
});
