define([
    '$',
    'global/utils',
    'global/utils/dom-operation-override',
    'components/sheet/sheet-ui',
    'global/ui/tooltip-ui',
    'components/alert/alert-ui',
    'components/reveal/reveal-ui',
    // Parsers,
    'pages/checkout-gift-options/parsers/product-item-parser',
    'global/parsers/alert-parser',
    // Partials
    'dust!pages/checkout-gift-options/partials/product-item',
    // Components
    'dust!components/scroller/scroller'
], function(
    $,
    Utils,
    DomOverride,
    sheet,
    tooltipUI,
    alertUI,
    Reveal,
    // Parsers
    ProductItemParser,
    alertParser,
    // Partials
    ProductItemTmpl,
    // Components
    ScrollerTmpl) {

    var $giftContainer = $('.js-gift-recipients');
    var $radioIcon = $('<svg class="c-icon c-check-radio__icon"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-checkmark"></use></svg>');
    var $cField = $('<div class="c-field"></div>');
    var $cFieldInput = $('<div class="c-field__input"></div>');

    // wait for princess dresses (configurable products) to finish loading
    // before rendering the page
    var pcProductCount = 1;
    var thresholdCount = Adaptive.evaluatedContext.pcProductCount * 2;

    var _buildAnotherBoxToggle = function($giftBoxesContainer) {
        var lastIndex = $giftBoxesContainer.find('.js-gift-box').length - 1;
        var toggleClasses = 'c-button c--plain c--small c--brand c--plus u-text-weight-bold u-text-size-small u-padding u--none u-margin-bottom-md';

        $giftBoxesContainer.find('.js-gift-box').each(function(index) {
            // skip the first one
            if (index === 0) {
                return;
            }

            Utils.buildToggle($(this), 'Add Another Box', toggleClasses, true);
        });
    };

    var _bindRadioButtonsAsCheckboxes = function() {
        var $giftBox = $('.js-gift-boxes');

        $('body').on('click', '.js-item', function(e) {
            var $target = $(e.target);
            var checkedClasses = 'c--checked js-checked';

            if ($target.is('[type="radio"]') && $target.prop('checked') && $target.hasClass('js-checked')) {
                // clicking on a checked radio
                var radioName = $target.attr('name');
                var $noBox = $giftBox.find('.js-no-box').filter(function() {
                    return $(this).attr('name') === radioName;
                });

                $noBox.prop('checked', 'checked');
                $giftBox.find('[name="' + radioName + '"]').removeClass(checkedClasses);
            }

            $giftBox.find('[type="radio"]').removeClass(checkedClasses);
            $giftBox.find('[type="radio"]').filter(function() {
                return $(this).prop('checked');
            }).addClass(checkedClasses);
        });
    };

    var _saveSelectedStyle = function($boxesContainer) {
        var $select = $boxesContainer.find('select');
        var selectedStyle = $boxesContainer.find('.js-active').find('.gwt-Label').text();

        if (!$select.length || selectedStyle === '') {
            return;
        }

        var $selectedStyleOption = $select.find('option').filter(function() {
            return selectedStyle.toUpperCase() === $(this).text().toUpperCase();
        });

        $select.val($selectedStyleOption.val());
        $select[0].dispatchEvent(new CustomEvent('change'));
    };

    var _bindGiftBoxStylesToSelect = function() {
        $('body').on('click', '.js-gift-box-style', function(e) {
            var $container = $(this).closest('.js-gift-boxes-container');
            var activeClassNames = 'c--active js-active';

            $container.find('.js-gift-box-style').removeClass(activeClassNames);
            $(this).addClass(activeClassNames);

            _saveSelectedStyle($container);
        });
    };

    var _setInitialState = function() {
        var $radioOption = $('[type="radio"]');

        $radioOption.each(function() {
            var $radio = $(this);
            var selector = '[for="' + $radio.attr('id') + '"]';
            var $label = $(selector);

            if ($radio.prop('checked')) {
                $label[0].click();
                $radio[0].click();
            }
        });
    };

    var _bindToggles = function() {
        // CF-523: Use reveal components
        $('.c-reveal').each(function(i, reveal) {
            Reveal.init($(reveal));
        });
    };

    var _updateReveal = function() {
        // wipe reveals that don't have personalization in them
        $('.js-details-container').each(function() {
            var $details = $(this);
            if ($details.children().length <= 2) {
                $details.closest('.c-reveal').replaceWith($details);
            }

            if (!$details.children().length) {
                $details.parent().remove();
            }
        });
    };

    // there are no id's
    var _bindAccordions = function() {
        $('body').on('click', '.js-accordion-item', function(e) {
            var $clicked = $(this);
            var $container = $clicked.closest('.js-gift-options-container');
            var $radioBtn = $clicked.find('input[type="radio"]');
            var selector = $clicked.attr('data-target');

            // reset all states
            $container.find('.js-gift-message-container, .js-gift-boxes').attr('hidden', 'true');

            $container.find(selector).removeAttr('hidden');

            // CF-507: check the radio button if user clicks on whitespace
            $radioBtn.prop('checked', true);
            $radioBtn[0].dispatchEvent(new CustomEvent('click'));
        });
    };

    var _bindGiftMsgTextBox = function() {
        // CF-503: Text box should highlight red when max count is reached
        $('body').on('keyup', '.giftMsgTextBox, .giftBoxMessageBox', function() {
            var $this = $(this);

            if ($this.val().length >= $this.attr('maxlength')) {
                $this.closest('.c-field').addClass('c--error');
            } else {
                $this.closest('.c-field').removeClass('c--error');
            }
        });
    };

    var _bindEvents = function() {
        // bind the magic from radio buttons to checkboxes
        _bindRadioButtonsAsCheckboxes();
        _bindGiftBoxStylesToSelect();
        _bindToggles();
        _bindAccordions();
        _bindGiftMsgTextBox();
        _updateReveal();
    };

    var _transformGiftMessages = function($giftMessagesContainer, $productTable) {
        if (!$productTable.length) {
            return;
        }

        $productTable.find('.giftMsgTextBox').each(function() {
            var $giftMsgInput = $(this);
            var $product = $giftMsgInput.closest('.gwt-oid-panel, .gwt-giftMsgTablePanel');
            var $giftMessageContainer = $('<div class="c-field u-margin-bottom-lg js-gift-message"></div>');
            var $productName = $('<label class="c-label u-margin-end-sm u-text-weight-bold" />');

            $giftMessageContainer.append($product.find('.spot').contents());
            $giftMessageContainer.find('.character-count-label').addClass('c-field__caption');
            $productName.text($product.find('.gwt-oid-name').text());
            $giftMessageContainer.prepend($productName);

            $giftMessagesContainer.append($giftMessageContainer);

            // styles
            $giftMessageContainer.find('label').addClass('c-label');

            $giftMsgInput.attr('autocomplete', 'off');
        });
    };

    var _buildShippingAddress = function($recipientAddress) {
        var recipientAddressText = [];

        $recipientAddress.find('.gwt-addr-disp').each(function() {
            var $addressValue = $(this);
            if (!/display\:\s?none/.test($addressValue.attr('style'))) {
                recipientAddressText.push($addressValue.text());
            }
        });

        var $shippingAddressContainer = $('<div>');
        var $shippingAddressHeader = $('<b>', {
            text: 'Shipping Address'
        });
        var $shippingAddress = $('<p>', {
            class: 'u-margin-top-sm u-margin-bottom-lg',
            text: recipientAddressText.join(' | ')
        });

        $shippingAddressContainer.append($shippingAddressHeader).append($shippingAddress);

        return $shippingAddressContainer;
    };

    var _buildGiftBoxStyles = function($giftOptionsContainer) {
        var $sampleGiftBoxes = $giftOptionsContainer.find('.giftBoxStyleThumbPanel').clone();

        var scrollerObj = {
            scrollerClass: 'c--fade-before c--fade-after t-checkout-gift-options__gift-box-selections js-gift-box-selections-container',
            slider: {
                class: 'js-gift-box-style',
                slides: $sampleGiftBoxes.map(function(_, giftBox) {
                    var $giftBox = $(giftBox);
                    $giftBox.find('.gwt-Label').addClass('u-text-soft u-text-size-xxsmall u-text-align-center');

                    return {
                        slideContent: $giftBox
                    };
                })
            }
        };

        var $giftBoxSelectionContainer;

        new ScrollerTmpl(scrollerObj, function(err, html) {
            $giftBoxSelectionContainer = $(html);
        });

        return $giftBoxSelectionContainer;
    };

    var _getItemDescription = function($row) {
        var $description = $row.find('.gwt-oid-panel');

        // If we found the description leave and don't do anything else.
        if ($description.length) { return $description; }

        // Ser row to previous row.
        $row = $row.prev('tr');

        return $row.length ? _getItemDescription($row) : $([]);
    };

    var _transformGiftBoxItems = function($matrix, $desktopData) {
        if (!$matrix.length) {
            return;
        }

        var $giftBoxesContainer = $('<div>', {
            class: 'js-gift-boxes'
        });

        $matrix.find('.gwt-ListBox').each(function(index) {
            var $giftBoxSelect = $(this);
            var $transformedGiftBox = $('<ol>', {
                class: 'c-number-list u-margin-bottom-md js-gift-box'
            });
            var $title = $('<p>', {
                class: 'u-text-weight-bold u-margin-bottom-md',
                text: 'Gift Box ' + (index + 1)
            });
            var $itemsList = $('<div>', {
                class: 'js-items-list'
            });
            var boxNumber = index + 1; // 0 is no box

            var $boxItemPoints = $matrix.find('.gwt-RadioButton').filter(function() {
                return (boxNumber === parseInt($(this).attr('value')));
            });

            $giftBoxSelect.attr('data-bind-styles', Utils.generateUid());


            $boxItemPoints.each(function() {
                var $boxItemPoint = $(this);
                var $originalItem = $boxItemPoint.closest('tr');
                var $item = $originalItem.clone();
                var $itemDescContainer = _getItemDescription($originalItem);
                var name = $itemDescContainer.find('.gwt-oid-name').text();
                var $value = $itemDescContainer.find('.ois-option-value');
                var valueText = '';
                var itemText;

                // CF-506: Separate each value with '/' character
                $value.each(function(index, item) {
                    if (index > 0) {
                        valueText += ' / ' + $(item).text();
                    } else {
                        valueText = $(item).text();
                    }
                });

                itemText = name + '<br />' + valueText;

                var $itemRow = $('<div>', {
                    class: 'c-field u-margin-bottom-lg js-item'
                });

                var $noBoxPoint = $boxItemPoint.closest('tr').find('.gwt-RadioButton[box="no"]').attr('hidden', true);
                var checkboxName = $boxItemPoint.find('[type="radio"]').attr('id');
                var $itemText = '<label class="c-label" for="' + checkboxName + '">' + itemText + '</label>';
                var $boxItemPointRadio = $boxItemPoint.find('[type="radio"]');

                $boxItemPoint.addClass('c-arrange c--align-middle');
                $boxItemPointRadio
                    .wrap('<div class="c-check-radio c--squared c--grey"></div>')
                    .after($radioIcon.clone());
                $boxItemPoint.find('label').remove();
                $boxItemPoint.append($itemText);
                $boxItemPoint.wrap('<div class="c-field c--check-radio"></div>');

                $noBoxPoint.find('input').addClass('js-no-box');

                $itemRow
                    .append($boxItemPoint)
                    .append($noBoxPoint);

                $itemRow.append($noBoxPoint);

                $itemsList.append($itemRow);
            });

            // sequentially remove/append giftbox input fields
            var $giftBoxMessage = $('<li class="c-number-list__item">');
            var $contents = $matrix.find('.opt2GiftMsgPanel .giftBoxMessageBox').first().closest('.spot').contents();
            var $giftField = $cFieldInput.clone();

            $giftField.append($contents);
            $giftField.find('input').addClass('c-input');
            $giftField.find('.gwt-RealLabel')
                .addClass('u-text-size-small')
                .text($giftField.find('.gwt-RealLabel').text() + ' (optional)');

            $giftField.find('.character-count-label').addClass('c-field__caption');

            $giftBoxMessage.append($giftField.wrap($cField.clone()).parent());

            Utils.disablePredictiveText($giftField.find('.giftBoxMessageBox'));

            var $boxStylesContainer = $('<li>', {
                class: 'c-number-list__item u-margin-bottom-lg js-gift-boxes-container'
            });

            var $chooseStyleTitle = $('<label>', {
                text: 'Choose style for Gift Box ' + boxNumber,
                class: 'u-text-size-small'
            });

            $giftBoxSelect = $giftBoxSelect.wrap($('<div>', {
                class: 'js-gift-box-select'
            })).parent();

            $giftBoxSelect.attr('hidden', 'true');

            $boxStylesContainer
                .append($chooseStyleTitle)
                .append(_buildGiftBoxStyles($desktopData))
                .append($giftBoxSelect).find('select').removeAttr('style');

            var $itemsListTitle = $('<label>', {
                class: 'u-margin-bottom-lg u-text-size-small',
                text: 'Add items to Gift Box ' + boxNumber
            });

            $itemsList.prepend($itemsListTitle);

            $transformedGiftBox
                .append($title)
                .append($boxStylesContainer)
                .append($itemsList.wrap($('<li class="c-number-list__item u-margin-bottom-lg">')).parent())
                .append($giftBoxMessage);

            $giftBoxesContainer.append($transformedGiftBox);
        });

        _buildAnotherBoxToggle($giftBoxesContainer);

        // some items can't have gift boxes, so show the message that tells the user they can't
        // add a gift box
        if (!$giftBoxesContainer.contents().length) {
            $matrix.find('.gwt-gift-message-box')
                .wrap($('<div class="c-field"></div>'))
                .parent().appendTo($giftBoxesContainer);
        }

        $matrix.empty().append($giftBoxesContainer);
    };

    var _buildAccordionToggles = function($optionsContainer) {
        var togglesMap = ['.js-gift-message-container', '.js-gift-boxes', ''];

        $optionsContainer.find('.js-accordion-item').each(function(i) {
            // bind our own show/hide toggles
            $(this).attr('data-target', togglesMap[i]);
        });
    };

    var _transformOptions = function($container) {
        var $optionsContainer = $container.find('.js-gift-options-container');
        var $bellowsItemWrapper = $('<div>', {
            class: 't-checkout-gift-options__block-option js-accordion-item'
        });
        var $accordionWrapper = $('<div>', {
            class: 'c-block-option__container u-margin-bottom-lg js-gift-options'
        });

        var $accordionHeaders = $container.find('.optionBtnPanel .gwt-RadioButton');

        $accordionHeaders.find('input')
            .wrap('<div class="c-check-radio c--grey"><div class="c-block-option__input"></div></div>')
            .after($radioIcon.clone());

        var $giftMessageContainer = $('<div>', {
            class: 't-checkout-gift-options__message js-gift-message-container'
        });

        var $productTable = $container.find('.simpleOrderItemTable');

        _transformGiftMessages($giftMessageContainer, $productTable);

        // Transform Option 2: gift boxes
        var $giftBoxMatrix = $container.find('.option2OrderItemTable').append($container.find('.opt2GiftMsgPanel'));
        _transformGiftBoxItems($giftBoxMatrix, $container);

        // Miscellaneous transforms
        Utils.disablePredictiveText($giftMessageContainer.find('.giftMessageBox'));

        // remove 'Option #' from header text
        $accordionHeaders.each(function(i) {
            var $header = $(this);
            var headerText = $header.text().replace(/Option\s*\d*\s*/i, '');

            headerText = headerText.replace(/\(/, ' (');
            $header.find('label').addClass('c-label').text(headerText);
        });

        $accordionHeaders.wrap($bellowsItemWrapper);
        $accordionHeaders.addClass('c-block-option');

        $container.find('.optionBtnPanel').wrap($accordionWrapper).parent().appendTo($optionsContainer);

        _buildAccordionToggles($optionsContainer);

        $optionsContainer.append($giftMessageContainer.attr('hidden', 'true'));
        $optionsContainer.append($container.find('.js-gift-boxes').attr('hidden', 'true'));
        $optionsContainer.find('.optionBtnPanel').find('.js-accordion-item').last().addClass('js-no-box-option');
    };

    var _buildProductItems = function($productList) {
        if (!$productList.length) {
            return;
        }

        var $transformedProductList = $('<div>', {
            class: 'js-product-items'
        });

        $productList.find('.gwt-oid-panel').each(function() {
            var $productItem = $(this);
            var $personalization = $productItem.find('.perzdesc');
            var productItemObj = ProductItemParser.parse($productItem, $personalization);
            var transformedMarkup;

            new ProductItemTmpl(productItemObj, function(err, html) {
                transformedMarkup = html;
            });

            $transformedProductList.append(transformedMarkup);
        });

        return $transformedProductList;
    };

    var transformGiftRecipient = function($recipient) {
        if (!$recipient.length) {
            return;
        }

        var $recipientAddress = $recipient.find('.gwt-addr-disp').parent().remove();
        var $productList = $recipient.find('.simpleOrderItemTable').attr('hidden', 'hidden');
        var $pricesCheckbox = $recipient.find('.rmvPriceCBPanel').addClass('u-margin-bottom-lg');
        var transformedProductList = _buildProductItems($productList);
        var $optionsContainer = $('<div class="js-gift-options-container"></div>').appendTo($recipient);

        _transformOptions($recipient);

        var $giftRecipientContainer = $('<div>', {
            class: 'js-gift-recipient'
        });
        var $giftOptionsSection = $('<div>');
        var $pricesCheckboxInner = $('<div class="c-check-radio" />');

        $pricesCheckbox
            .find('.gwt-CheckBox')
            .addClass('c-arrange c--align-middle')
            .append($pricesCheckboxInner)
            .append($pricesCheckbox.find('label').addClass('c-label'));

        $pricesCheckboxInner
            .append($pricesCheckbox.find('input'))
            .append($radioIcon.clone());

        $giftOptionsSection
            .append('<div class="c-divider c--dashed c--grey c--no-margin u-margin-bottom-lg" />')
            .append($pricesCheckbox)
            .append($optionsContainer);

        $giftRecipientContainer
            .append(_buildShippingAddress($recipientAddress))
            .append(transformedProductList)
            .append($giftOptionsSection);

        $giftContainer.append($giftRecipientContainer);
    };

    var _transformGiftOptions = function() {
        var $giftOptionsContainer = $(arguments[0]);

        $('.js-loader').attr('hidden', 'true');

        $giftOptionsContainer.find('.destinationBox').each(function() {
            var $giftRecipient = $(this);

            // only do transformations on addresses that have items shipping to them
            if ($giftRecipient.find('.gwt-RadioButton').length) {
                transformGiftRecipient($giftRecipient);
            }
        });

        var $submitButton = $giftOptionsContainer.find('.buttonpanel button')
            .addClass('c-button c--primary c--full-width');

        $submitButton.text('Continue to Payment');
        var $buttonsWrapper = $('<div class="u-bleed-horizontal u-padding u-padding-top-lg u-border-top">');

        $buttonsWrapper.append($submitButton);

        $giftContainer.append($buttonsWrapper);

        setTimeout(function() {
            _bindEvents();
            _setInitialState();
        }, 100);

        Utils.replaceWithPrototypeElements('.simpleOrderItemTable');
        $('.js-errors').append($('#gwt-error-placement-div'));
    };

    var _transformGiftOptionsWithPcProduct = function() {
        // this hook triggers every time a pc product gets loaded,
        // but each pc product loads twice, once for gift messages table
        // once of gift box table
        pcProductCount++;

        if (pcProductCount > thresholdCount) {
            // start transforming
            var $giftOptionsContainer = $('#gwt_gift_boxing');
            _transformGiftOptions($giftOptionsContainer);
        }

        return;
    };

    var _waitForPcProduct = function() {
        DomOverride.on('domAppend', '.moreContentExpander', _transformGiftOptionsWithPcProduct);
    };

    var _transformErrors = function(errorPanel) {
        var $errorPanel = $(errorPanel);

        if ($errorPanel.contents().length) {
            var errorData = alertParser.parse(
                $errorPanel,
                function($container) {
                    return $container.children();
                }
            );
            var $errorsContainer = $('.js-error-messages');

            errorData.class = 'c--fixed';

            $errorsContainer.prop('hidden', false);
            alertUI.update($('.c-alert'), errorData);

            // decorate error fields on page
            $('.error').addClass('u-text-warning');

            $('.outlinedListBox').closest('.js-gift-boxes').find('.js-items-list label').first().addClass('u-text-warning');

            $(window).scrollTop($('.js-gift-options-container .u-text-warning').first().position().top);
        }
    };

    var _transformPersonalization = function() {
        var $personalization = $(arguments[0][0]);
        var $personalizationContainer = $(this);
        var $addressContainer = $personalizationContainer.closest('.simpleOrderItemTable');

        // hook fires twice because there are 2 of the same product items on desktop in 2 different tables
        if ($personalization.children().length && $addressContainer.length) {
            var $container = $(this).closest('.gwt-oid-panel');
            var productIndex;
            var addressIndex;
            var $indexContainer = $container.closest('tbody');
            $indexContainer.find('.gwt-oid-panel').each(function(i) {
                if ($(this).is($container)) {
                    productIndex = i;
                }
            });

            $('.simpleOrderItemTable').each(function(i) {
                if ($(this).is($addressContainer)) {
                    addressIndex = i;
                }
            });

            var $personalizedItem = $('.js-gift-recipient').eq(addressIndex)
                .find('.c-cart-item').eq(productIndex)
                .find('.js-details-container');

            var $persContent = $('<p/>').text($personalization.text().replace(/:/g, ': '));

            $personalizedItem.append($persContent);
        }

        // no reliable way to tell when all the personalizations are finished...
        setTimeout(function() {
            _bindToggles();
            _updateReveal();
        }, 500);
    };

    var checkoutGiftOptionsUI = function() {
        // Add any scripts you would like to run on the checkoutGiftOptions page only here
        if (thresholdCount > 0) {
            DomOverride.on('domAppend', '', _waitForPcProduct, '#gwt_gift_boxing');
        } else {
            DomOverride.on('domAppend', '', _transformGiftOptions, '#gwt_gift_boxing');
            DomOverride.on('domAppend', '', _transformPersonalization, '.perzdesc');
        }

        DomOverride.on('domAppend', '', _transformErrors, '#gwt-error-placement-div');

        tooltipUI();
        alertUI.init();
    };

    return checkoutGiftOptionsUI;
});
