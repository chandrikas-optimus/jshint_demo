define([
    '$',
    'global/utils',
    'components/sheet/sheet-ui',
    'dust!components/accordion/accordion',
    'dust!components/product-summary/product-summary',
    'dust!components/loading/loading',
    'global/utils/dom-operation-override',
], function($, Utils, sheet, AccordionTmpl, productSummaryTemplate, loadingTemplate, DomOverride) {
    var $personalizationPinny = $('.js-personalization-pinny');
    var $pinnyContent = $personalizationPinny.find('.js-personalization-content');
    var LONG_WAIT = 3000;

    $personalizationPinny.find('.pinny__content').addClass('u-padding-all-0 c--bleed');

    var bindStepsBellows = function() {
        // initial state
        var $bellows = $('.js-personalization-bellows');
        // CF-462: Find the first bellows item to open
        var firstToOpenIndex = 0;

        var openedTab = $('.gwt-accordion-tab-header.tabopen .gwt-tab-header-title').text();
        $bellows.find('.c-accordion__header').each(function(i, el) {
            if ($(el).text().trim().indexOf(openedTab) === 0) {
                firstToOpenIndex = i; // bellows index resolution
                return false;
            }
        });

        $bellows.bellows('open', firstToOpenIndex);

        $bellows.on('click', '.js-next-step', function(e) {
            e.preventDefault();

            var $currentStep = $(this);
            var $bellows = $currentStep.closest('.bellows');
            var $currentBellowsItem = $currentStep.closest('.bellows__item');
            var $nextBellowsItem = $currentBellowsItem.next('.bellows__item');

            $bellows.bellows('closeAll');
            $bellows.bellows('open', $nextBellowsItem);
        });

        var ua = navigator.userAgent.toLowerCase();
        if (ua.indexOf('android') > -1) {
            $('.js-personalization-bellows input').on('touchstart', function(e) {
                var $sheetContent = $('.js-personalization-pinny .pinny__content');
                var $option = $sheetContent.find('.c-accordion__item.bellows--is-open');

                if ($option.length) {
                    $sheetContent.animate({
                        'scrollTop': $option[0].offsetTop
                    });
                }
            });
        }
    };

    var buildProductSummary = function($personalization) {
        // CF-467: For bundle items, scrape product summary data from selected personalization item
        var $selectedPersonalizationItem = $('.js-selected-personalization-item');
        var _heading = $selectedPersonalizationItem.length ?
            $selectedPersonalizationItem.find('.c-product-summary__heading').text() :
            $personalization.find('.Caption').text();
        var _src = $selectedPersonalizationItem.length ?
            $selectedPersonalizationItem.find('.c-product-summary__image').attr('src') :
            $personalization.find('.gwt-personalization-main-image').attr('src');
        var _itemNum = $selectedPersonalizationItem.length ?
            $selectedPersonalizationItem.find('.c-product-summary__item-number').text() :
            $('.js-item-number').text();
        var _exclusive = $selectedPersonalizationItem.length ?
            $selectedPersonalizationItem.find('.c-product-summary__exclusive').text() :
            $('.js-item-description').text();

        // For prices, first default to single item case
        var _salePrice = $('.js-pricing .c-price__sale').length ? $('.js-pricing .c-price__sale').text() : '';
        var _retailPrice = $('.js-pricing .c-price__sale').length ? $('.js-pricing .c-price__original').text() : $('.js-pricing .c-price__retail').text();
        if ($selectedPersonalizationItem.length) {
            // Now look for prices for a selected item
            _salePrice = $selectedPersonalizationItem.find('.c-price .c-price__sale').length ?
                $selectedPersonalizationItem.find('.c-price .c-price__sale').text() :
                '';
            _retailPrice = $selectedPersonalizationItem.find('.c-price .c-price__sale').length ?
                $selectedPersonalizationItem.find('.c-price .c-price__original').text() :
                $selectedPersonalizationItem.find('.c-price .c-price__retail').text();
        }

        var productSummaryData = {
            heading: _heading,
            image: {
                src: _src
            },
            exclusive: _exclusive,
            table: {
                value: $('<em>' + _itemNum + '</em>'),
                noPadding: true
            },
            price: {
                salePrice: _salePrice,
                retailPrice: _retailPrice
            },
            imageContainerClass: 'c--medium',
            leftColumnClass: 'c--shrink',
            containerClass: 'u-padding u-padding-top u-padding-bottom'
        };
        var $productSummary;

        productSummaryTemplate(productSummaryData, function(_, out) {
            $productSummary = $(out);
        });

        return $productSummary;
    };

    // stick bellows inside gwt modal so the gwt events stay intact
    var buildStepsBellows = function($personalization) {
        $personalization.find('.c-bellows').remove(); // not sure why it's not cleared second time it's opened
        var bellowsMarkup;
        var isTwoStep = $personalization.find('.gwt-accordion-tab-content').length === 2;
        var $personalizationItems = $personalization.find('.gwt-accordion-tab').filter(function(_, item) {
            var $item = $(item);
            var $headerText = $item.find('.gwt-tab-header-title').trimmedText();

            // CF-462: Customer wants size and color bellows included
            if (!($headerText === 'month')) {
                return true;
            }
        });
        var $items = $personalizationItems.map(function(index, item) {
            var $continueButton = $('<button>', {
                class: 'c-button c--full-width js-next-step u-margin-top-md',
                text: 'Continue'
            });

            return {
                sectionTitle: $(item).find('.gwt-tab-header-title').text(),
                content: index !== $personalizationItems.length - 1 ? $continueButton : ''
            };
        });

        var bellowsData = {
            accordionClass: 'c--grey-bg u-border-top-remove c--personalization-bellows js-personalization-bellows',
            items: $items
        };

        new AccordionTmpl(bellowsData, function(err, html) {
            bellowsMarkup = html;
        });

        var $bellowsContainer = $(bellowsMarkup);

        $personalization.append($bellowsContainer);

        $personalizationItems.each(function(index) {
            var $this = $(this);
            var $content = $this.find('.gwt-accordion-tab-content').contents().unwrap();
            var $heading = $this.find('.gwt-tab-header-selected-option').addClass('t-product__personalization u-inline-block u-text-weight-bold u-text-soft');

            $personalization.find('.bellows__content').eq(index).append($content[0]);
            $heading.insertBefore($personalization.find('.bellows__header svg').eq(index));
        });

        // we are hiding the rest of the container except for the bellows content
        $personalization.children().attr('hidden', 'hidden');
        $personalization.append($bellowsContainer);
        $bellowsContainer.removeAttr('hidden');

        var $buttons = $personalization.find('.gwt-submit-cancel-dialog-button-panel').addClass('u-margin-top-lg u-padding');

        var $saveClose = $personalization.find('.button.primary');

        $saveClose.text($saveClose.text().replace(/Save and Close/g, 'Save & Close'));

        var $note = $personalization.find('.gwt-personalization-modal-espotpanel').addClass('c-note u-margin-top-md u-margin-bottom-lg u-padding');

        $note.html($note.html().replace(/\*/g, '<span class="u-text-warning">*</span>'));

        $buttons.appendTo($bellowsContainer.parent());
        $note.appendTo($bellowsContainer.parent());
        $personalization.find('#gwt-error-placement-div').addClass('u-text-warning u-text-bottom-md').prependTo($bellowsContainer.parent());
        buildProductSummary($personalization).prependTo($bellowsContainer.parent());

        // CF-424: Make trademark text have c-note styling
        if ($personalization.find('.gwt-personalization-modal-instruction').length) {
            $personalization.find('.gwt-personalization-modal-instruction').addClass('c-note');
        }

        // CF-464: Hacky workaround for Android not respecting maxlength attr
        if ($.os.android && $personalization.find('input[maxlength]').length > 0) {
            $personalization.find('input[maxlength]').each(function(i, input) {
                $(input).on('keyup blur focusout', function(e) {
                    var $el = $(e.target);
                    var max = parseInt($el.attr('maxlength'));
                    if ($el.val().length >= max) {
                        var truncatedText = $el.val().slice(0, max);

                        $el.val(truncatedText);

                        // Force the label to change as well
                        $el.parents('.c-accordion__item').find('.gwt-Label').text(truncatedText);
                    }
                });
            });
        }

        // CF-567: Remove size chart from personalization steps
        $personalization.find('.gwt-Anchor:contains("size chart")').remove();

        return $personalization;
    };

    // stick relevant content into relevant bellows steps
    var transformPinnyContent = function() {
        var $personalization = $pinnyContent.find('#gwt-personalization-modal-V2');
        var $personalizationBellows = $pinnyContent.find('.js-personalization-bellows');
        var $personalizationTextLabels = $personalizationBellows.find('.gwt-personalization-textbox-description');

        // All Steps
        $pinnyContent.find('.gwt-personalization-modal-accordions-content').parent();
        var reorderButtons = $pinnyContent.find('.js-next-step').each(function(index) {
            var $button = $(this).unwrap();
            var $bellowsContent = $button.closest('.bellows__content');

            $bellowsContent.append($button);
        });

        $pinnyContent.find('.js-next-step').wrap($('<div>', {
            class: ''
        }));

        $pinnyContent.find('.step-button').remove();
        $pinnyContent.find('.button.primary').addClass('c-button c--full-width js-close-pinny');
        $pinnyContent.find('.button.secondary').addClass('u-visually-hidden js-cancel-personalization');
        $pinnyContent.find('.gwt-personalization-dropdown-label').addClass('u-visually-hidden');
        $pinnyContent.find('.gwt-personalization-textbox-label').addClass('u-visually-hidden');

        $pinnyContent.find('.gwt-personalization-dropdown-description').each(function(_, item) {
            var $item = $(item);

            $item.addClass('c-label');
            $item.prependTo($item.parent());
        });

        $pinnyContent.find('.gwt-personalization-modal-accordions-content').addClass('c-field');
        $pinnyContent.find('.gwt-personalization-modal-accordions-content-option').addClass('c-field__input');

        // CF-466: Decorate swatches into a grid layout
        var $swatchPicker = $pinnyContent.find('.gwt-personalization-modal-accordions-content-option').find('.gwt-swatch-picker, .gwt-image-picker');
        var $swatches = $swatchPicker.find('.gwt-personalization-image-picker-option, .gwt-image-picker-option');
        if ($swatchPicker.length) {
            $pinnyContent.find('.gwt-personalization-modal-accordions-content-option .gwt-personalization-image-picker-label, .prevArrow, .nextArrow, .gwt-product-option-panel-chosen-selection').hide();
            $swatches.addClass('c-grid__span c-swatches-label c--full');
            $swatches.parent().addClass('c-grid c--4up c--gutters');
            $swatchPicker.find('.gwt-image-picker-option-image, .gwt-personalization-image-picker-option-image').wrap('<div class="c-swatches-label__image c--full" />');
            $swatchPicker.find('.gwt-image-picker-option-image-selected').closest('.gwt-image-picker-option').addClass('c--selected');
            $swatchPicker.find('.gwt-tab-header-selected-option .gwt-HTML').hide();

            $swatchPicker.find('.gwt-image-picker-option-image').each(function() {
                var $image = $(this);
                var imgSrc = $image.attr('src');

                if (imgSrc) {
                    $image.attr('src', imgSrc.replace('?$P_Swatch$', ''));
                }
            });
        }

        $personalizationBellows.find('select').wrap('<div class="c-select c-input">');
        $personalizationBellows.find('input').addClass('c-input');
        $personalizationTextLabels.addClass('c-note u-margin-top-sm u-margin-bottom-md');

        $personalizationTextLabels.each(function(_, label) {
            var $label = $(label);

            $label.html($label.html().replace(/\*/g, '<span class="u-text-warning">*</span>'));
        });

        $('<svg class="c-icon "><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-arrow-downward"></use></svg>').insertAfter($personalizationBellows.find('select'));

        // CF-465: Pinny close button in header must be inside gwt-DialogBox in order to be clickable
        $pinnyContent.parents('.js-personalization-pinny').find('.pinny__header').insertBefore($personalization.find('.c-product-summary'));
    };

    var validateForm = function() {
        var $buttonToToggle = $('.js-personalization-pinny .js-close-pinny');
        var $formInputs = $('.js-personalization-pinny').find('.gwt-TextBox, .gwt-ListBox');

        Utils.checkValidation($formInputs, $buttonToToggle);
    };

    // bind close pinny interactions with desktop modal
    var bindPinnyEvents = function($desktopModal) {

        var $cancelButton = $personalizationPinny.find('.js-cancel-personalization span');

        $personalizationPinny.find('.js-close-pinny').on('click', function() {
            // CF-465: Put pinny header back into place so it doesn't get lost
            $personalizationPinny.find('.pinny__header').insertBefore($personalizationPinny.find('.pinny__content'));

            setTimeout(function() {
                var $errorContainer = $('#gwt-error-placement-div').not(':empty');
                if ($errorContainer.length === 0) {
                    $personalizationPinny.pinny('close');
                } else {
                    $errorContainer.hide();
                    Utils.decorateErrorsAlert();
                }
            });
        });

        $personalizationPinny.find('.pinny__close').on('click', function() {
            // CF-465: Put pinny header back into place so it doesn't get lost
            $personalizationPinny.find('.pinny__header').insertBefore($personalizationPinny.find('.pinny__content'));

            $cancelButton.click();
            $cancelButton.trigger('click');
        });

        $personalizationPinny.on('blur keyup', '.gwt-TextBox', validateForm);
        $personalizationPinny.on('change', '.gwt-ListBox', validateForm);

        $personalizationPinny.find('.c-accordion__content').each(function(_, accordion) {
            var $accordion = $(accordion);
            var $swatches = $accordion.find('.c-swatches-label');
            $swatches.on('click', function() {
                var $swatch = $(this);
                $swatches.removeClass('c--selected');
                $swatch.addClass('c--selected');
            });
        });
    };

    var buildPinny = function($modal) {
        $modal.removeStyle(true);
        $modal.show();

        // we need to hide this instead of removing because desktop scripts
        // will try to remove this container upon dialogbox closing
        // if it's removed, then it'll cause desktop script failing silently
        // and cause personalization pinny to be out of sync
        $('.gwt-PopupPanelGlass').addClass('u-visually-hidden');

        var headerText = 'Personalization';

        $personalizationPinny.find('.c-sheet__title').html(headerText);

        // we can't use a partial template here without losing all event listeners
        // So instead we need to transform the content in place
        $pinnyContent.empty().append(buildStepsBellows($modal));
        transformPinnyContent($modal);

        bindPinnyEvents($modal);

        $('.js-personalization-bellows').bellows({
            singleItemOpen: true,
            opened: function(e, ui) {
                // CF-623: Scroll the bellows item into view when opening
                $('.js-personalization-pinny .pinny__content').animate({'scrollTop': ui.item[0].offsetTop});
            }
        });

        bindStepsBellows();

        validateForm();

        $personalizationPinny.pinny('open');
    };

    var initSheet = function() {
        // Initialize these separately from the other plugins,
        // since we don't have to wait until the product image is loaded for these.
        var sheetObj = sheet.init($personalizationPinny);

        // CF-590: Some devices where having scroll issues after focusing a text input and
        // blurring it on first open of the personalization sheet. This only happens when
        // the input is focused soon after opening. Only found solution is to delay interaction.
        var pinny = $personalizationPinny.data('pinny');
        pinny.options.opened = function() {
            // Hide the loader afer preset amount of time.
            setTimeout(function() {
                sheetObj.hideMask();
            }, LONG_WAIT);

            // Reset closed callback.
            pinny.options.opened = function() {};
        };
    };

    var _init = function() {
        initSheet();
        DomOverride.on('domRemove', '#gwt-personalization-modal-V2', function() {
            $personalizationPinny.pinny('close');
        });
    };

    return {
        init: _init,
        build: buildPinny
    };
});
