define([
    '$',
    'global/utils/dom-operation-override',
    'pages/product-configurator/preview-banner-ui',
    'dust!pages/product-configurator/partials/configurator-bellows',
    'pages/product/add-to-cart-registry-ui',
    'pages/product-configurator/product-configurator-ui-helpers',
    'dust!pages/product-configurator/partials/confirmation-modal',
    'components/sheet/sheet-ui',
    'pages/product/validate-add-to-cart-ui',
    'pages/product/size-chart-ui',
    'pages/product-configurator/product-configurator-ui-helpers',
    'dust!components/loading/loading'
], function(
    $,
    DomOverride,
    previewBannerUI,
    ConfiguratorBellowsTemplate,
    AddToCartRegistry,
    ConfiguratorHelpers,
    ConfirmationModalTemplate,
    Sheet,
    Validation,
    sizeChartUI,
    ConfiguratorHelpers,
    LoadingTmpl
) {
    var getParent = function($innerElement) {
        return $innerElement.is('.js-configure__configurator-section') ?
            $innerElement : $innerElement.parents('.js-configure__configurator-section');
    };

    var getDesktopParent = function(idx) {
        return $('#gwt_product_configurator_detail_json .js-configure__section-' + idx);
    };

    var parseBellowContent = function($content, idx, optional) {
        var $rightBtn =  $content.find('.tabs-button-panel').find('.next, .finish');
        var $personalization;
        var $warning;

        if ($content.find('.gwt-personalize-link-style').length) {
            if ($.trim($content.find('.gwt-product-detail-widget-personalization-chosen-values').text()) !== '') {
                $personalization = {
                    button: $content.find('.gwt-product-detail-widget-personalization-panel').clone().addClass('c-action__label')
                };
            } else {
                $personalization = true;
            }
        }

        // CF-739: Add choking hazard message
        if ($content.find('.choking-hazards-panel').length) {
            $warning = $content.find('.choking-hazards-panel').text();
        }

        return {
            addToCartClass: optional ? 'js-add-to-cart-optional-require' : 'js-add-to-cart-require',
            tooltip: $('.js-configurator-section__data-tooltip-' + idx).addClass('u-text-soft u-text-size-small'),
            swatches: $content.find('.gwt-image-picker-option-image').map(function(_, img) {
                var $img = $(img);
                return {
                    selected: $img.hasClass('gwt-image-picker-option-image-selected'),
                    swatchURL: $img.attr('src').replace('$P_Swatch$', '$ColorChipLargerView$'),
                    swatchName: $img.attr('alt')
                };
            }),
            options: $content.find('.gwt-ListBox').map(function(_, select) {
                var $select = $(select);
                return {
                    select: $select.clone(),
                    selectLabel: $select.attr('name')
                };
            }),
            personalize: $personalization,
            warning: $warning,
            navigationButtons: [{
                isDisabled: idx === 0 ? true : null,
                buttonClass: 'c--outline js-previous-btn',
                buttonLabel: $content.find('.tabs-button-panel .previous').text()
            }, {
                buttonClass: $rightBtn.is('.next') ? 'js-next-btn' : 'js-finish-btn',
                buttonLabel: $rightBtn.text()
            }]
        };
    };

    var parseSelectedSwatch = function($swatch) {
        var $selectedSwatch = $swatch.find('img');

        return {
            hidden: typeof $selectedSwatch.attr('src') === 'undefined' ? true : null,
            swatchImage: $selectedSwatch,
            swatchBanner: 'change'
        };
    };

    var parseConfiguratorBellowItems = function() {
        return $('.tabheader').map(function(idx, header) {
            var $header = $(header);
            var referencingID = 'js-configure__section-' + idx;
            var bellowClass = '';
            var optional = $header.find('.gwt-pc-optional-step').length;
            var initiallyOpened = false;

            $header.addClass('js-configure__section-header-' + idx);

            if (idx === 0) {
                bellowClass = 'bellows--is-open ';
                initiallyOpened = true;
            }

            return {
                isInitiallyOpenedItem: initiallyOpened,
                referencingIndex: '' + idx,
                bellowsItemClass: bellowClass + 'js-configure__configurator-section ' + referencingID,
                bellowsHeaderClass: $header.is('.unavailable') ? 'c--disabled' : '',
                stepText: (idx + 1) + '. ',
                bellowsTitle: $header.find('.gwt-pc-option-name').text(),
                optional: optional ? $header.find('.gwt-pc-optional-step').text() : null,
                resetButton: $header.find('.reset-option-button').text(),
                sectionCaption: $header.find('.selectedOption'),
                selectedSwatch: parseSelectedSwatch($header.find('.gwt-pc-selected-option-value-panel')),
                bellowsContent: parseBellowContent($('.tabcontent').eq(idx).addClass(referencingID), idx, optional)
            };
        });
    };

    var validateSectionContent = function($parent, $desktopParent) {
        var $errorContainer = $parent.find('.js-section-errors').attr('hidden', '').empty();
        var $personalizationError = $desktopParent.find('.gwt-csb-error-panel');
        var optionalCount = $parent.find('.js-add-to-cart-optional-require').length;

        // Color not selected
        if (!$parent.find('.js-swatches-label.c--selected').length) {
            $errorContainer.append('<div>Please choose a color</div>');
        }

        // Size not selected
        $parent.find('select').each(function(_, select) {
            var $select = $(select);
            if ($select.val() === $select.find('option').first().attr('value')) {
                $errorContainer.append('<div>Please choose a ' + $select.attr('name') + '</div>');
            }
        });

        var havePersonalization = $parent.find('.js-section-personalize-btn').length;
        if (havePersonalization) {
            // Personalization not added
            var chosenPersonalizationText = $.trim($parent.find('.gwt-product-detail-widget-personalization-chosen-values').text());
            if (!chosenPersonalizationText.length) {
                $errorContainer.append('<div>Please personalize this item</div>');
            } else {
                // Personalization error - avoid duplicated errors that the desktop is doing
                $errorContainer.append($desktopParent.find('.gwt-csb-error-panel .gwt-HTML').first().clone());
            }
        }

        var errorLength = $errorContainer.children().length;

        // If this is an optional section, validate true if no options are selected
        var totalErrorLength = havePersonalization + optionalCount;
        if (optionalCount && optionalCount === errorLength) {
            return true;
        }

        if (errorLength) {
            $errorContainer.removeAttr('hidden');
            return false;
        }
        return true;
    };

    var updatePersonalization = function() {
        $('.js-configure__configurator-section').each(function() {
            var $parent = getParent($(this));
            var index = $parent.attr('data-index');
            var $desktopParent = getDesktopParent(index);
            var $personalizationBtn = $parent.find('.js-section-personalize-btn');

            if ($personalizationBtn.length && $.trim($desktopParent.find('.gwt-product-detail-widget-personalization-chosen-values').text()) !== '') {
                $personalizationBtn.find('.c-action__label').remove();
                $personalizationBtn.prepend($desktopParent.find('.gwt-product-detail-widget-personalization-panel').clone().addClass('c-action__label'));
            } else {
                $personalizationBtn.find('.c-action__label').remove();
                $personalizationBtn.prepend($('<label class="c-action__label">Personalize <span class="u-text-warning">*</span></label>'));
            }
        });
    };

    var updateExtraOptions = function() {
        var $shippingMessage = $('#gwt_product_configurator_detail_json').find('.gwt-pc-pdp-shipping-msg, .gwt-com-shop-pdp-availability-msg-fp').clone();
        $('.js-shipping-message').empty().append($shippingMessage);
    };

    var updateContentSelectedSwatch = function($parent, $desktopParent) {
        var $desktopSelectedImg = $desktopParent.find('.gwt-image-picker-option-image-selected');
        var searchString = $.trim($desktopSelectedImg.attr('alt'));
        $parent.find('.js-swatches-label.c--selected').removeClass('c--selected');
        $parent.find('img[alt*="' + searchString.trim() + '"]').parents('.js-swatches-label').addClass('c--selected');
    };

    var validatePersonalization = function() {
        var $currentParent = $('.js-configure__configurator-section.bellows--is-open');
        var $currentDesktopParent = getDesktopParent($currentParent.attr('data-index'));
        updateContentSelectedSwatch($currentParent, $currentDesktopParent);
        validateSectionContent($currentParent, $currentDesktopParent);
    };

    var updateSectionHeader = function() {
        setTimeout(function() {
            $('.js-configure__configurator-section').each(function() {
                var $parent = $(this);
                var index = $parent.attr('data-index');
                var $header = $('#gwt_product_configurator_detail_json .js-configure__section-header-' + index);
                var $bellowHeader = $parent.find('.bellows__header');
                var $selectedLabel = $parent.find('.js-swatches-label.c--selected');
                var noSelectionsMade = !$selectedLabel.length && /select\ssize/i.test($parent.find('.js-add-to-cart-require select').val());

                // Update title
                if ($header.find('.option-unavailable-label').length) {
                    $parent.addClass('bellows--is-disabled');
                    $bellowHeader.addClass('c--disabled');
                    $parent.find('.js-configurator__caption-label').text($header.find('.option-unavailable-label'));
                } else {
                    $parent.removeClass('bellows--is-disabled');
                    $bellowHeader.removeClass('c--disabled');
                    $parent.find('.js-configurator__caption-label').empty().append($header.find('.selectedOption'));
                }

                // Update selected swatch
                var $desktopSelectedImg = $header.find('.gwt-pc-selected-option-value-panel img');
                var $imgContainer = $parent.find('.js-section__selected-swatch');

                $selectedLabel.removeClass('c--selected');
                if (typeof $desktopSelectedImg.attr('src') === 'undefined') {
                    $imgContainer.attr('hidden', '');
                } else {
                    $imgContainer.find('img')
                        .attr('src', $desktopSelectedImg.attr('src').replace('?$P_Swatch$', ''))
                        .attr('alt', $desktopSelectedImg.attr('alt'));
                    $imgContainer.removeAttr('hidden');

                    // Check if an image swatch is selected
                    updateContentSelectedSwatch($parent, getDesktopParent(index));
                }

                // Update Reset button
                var $resetButton = $parent.find('.js-section-reset-button');

                if ($header.find('.reset-option-button').hasClass('nodisplay') || noSelectionsMade) {
                    $resetButton.attr('hidden', 'true');
                } else {
                    $resetButton.removeAttr('hidden');
                }

                // Update Optional pricing
                var optionalPrice = $.trim($header.find('.option-price-panel').text());
                var $optionalPrice = $parent.find('.js-section-optional-cost');
                if (optionalPrice !== '') {
                    $optionalPrice
                        .empty()
                        .removeAttr('hidden')
                        .append(optionalPrice);
                } else {
                    $optionalPrice.attr('hidden', '');
                }
            });
            previewBannerUI.updateBanner();

            // Also update extra options bar
            updateExtraOptions();

            var $price = $('.gwt-right-bottom-product-options > .price-panel');
            if ($price.hasClass('nodisplay')) {
                $('.js-pricing').empty().append($('.configure-price-panel').clone());
            } else {
                $('.js-pricing').empty().append($price.find('.gwt-product-detail-top-price, .gwt_price_as_shown_label').clone());
            }
        }, 100);
    };

    var updateSelectedMainImage = function() {
        var $selectedTile = $('#gwt-pdp-main-image-wrapper .carouselTile.selected');
        var $tiles = $('.js-thumbnails-and-swatches .c-slideshow__slide');

        $tiles.eq($selectedTile.index()).find('img').click();
    };

    var updateSectionContent = function($parent, $desktopParent) {
        var $selects = $parent.find('select');
        $desktopParent.find('select').each(function(idx, select) {
            var $select = $(select);
            $selects.eq(idx).val($select.val());
        });

        updateContentSelectedSwatch($parent, $desktopParent);
    };

    var updateConfigurator = function() {
        setTimeout(function() {
            $('.js-configure__configurator-section').each(function() {
                var $parent = getParent($(this));
                var index = $parent.attr('data-index');
                var $desktopParent = getDesktopParent(index);

                updateSectionContent($parent, $desktopParent);
            });
        }, 100);
        updateSectionHeader();
    };

    var bindSectionSwatchEvent = function($parent, $desktopParent) {
        $parent.find('.js-swatches-label').on('click', function() {
            var $this = $(this);
            var searchString = $this.find('img').attr('alt');
            var isSelected = $this.hasClass('c--selected');

            $parent.find('.js-swatches-label.c--selected').removeClass('c--selected');

            if (!isSelected) {
                $this.addClass('c--selected');
            }

            if (searchString.length) {
                var $selectedElement = $desktopParent.find('img[alt*="' + searchString.trim() + '"]');

                if ($selectedElement.length) {
                    $selectedElement.triggerGWT('click');
                }
            }

            updateSectionHeader();
            setTimeout(updateSelectedMainImage, 1000);
            setTimeout(updatePersonalization, 1000);
        });
    };

    var bindSectionSelectEvent = function($parent, $desktopParent) {
        $parent.find('select').on('change', function() {
            var $this = $(this);
            var $selectedElement = $desktopParent.find('select[name="' + $this.attr('name') + '"]');

            $selectedElement.val($this.val()).triggerGWT('change');

            updateSectionHeader();
            setTimeout(updateSelectedMainImage, 1000);
            setTimeout(updatePersonalization, 1000);
        });
    };

    var bindSectionResetEvent = function($parent, $desktopParent, $desktopHeaderParent) {
        $parent.find('.js-section-reset-button').on('click', function(e) {
            $desktopHeaderParent.find('.reset-option-button').triggerGWT('click');

            updateSectionHeader();
            updateSectionContent($parent, $desktopParent);
        });
    };

    var bindAllSectionEvents = function() {
        $('.js-configure__configurator-section').each(function() {
            var $parent = getParent($(this));
            var index = $parent.attr('data-index');
            var $desktopParent = getDesktopParent(index);

            bindSectionSwatchEvent($parent, $desktopParent);
            bindSectionSelectEvent($parent, $desktopParent);
            bindSectionResetEvent($parent, $desktopParent, $('#gwt_product_configurator_detail_json .js-configure__section-header-' + index));

            $parent.find('.js-section-personalize-btn').on('click', function() {
                $desktopParent.find('.gwt-product-detail-widget-personalization-panel > .gwt-personalize-link-style').triggerGWT('click');
                setTimeout(function() {
                    validateSectionContent($parent, $desktopParent);
                }, 300);
            });
        });
    };

    var bindBellowControlButtons = function() {
        $('.js-previous-btn').on('click', function() {
            var index = parseInt($(this).parents('.js-configure__configurator-section').attr('data-index'));
            if (index > 0) {
                $('.c-configurator.bellows').bellows('open', index - 1);
            }
        });
        $('.js-next-btn').on('click', function() {
            var $parent = getParent($(this));
            var index = $parent.attr('data-index');
            var $desktopParent = getDesktopParent(index);
            var validated = validateSectionContent($parent, $desktopParent);

            if (validated && index < $('.js-product-options .js-configure__configurator-section').length) {
                $('.c-configurator.bellows').bellows('open', parseInt(index) + 1);
            }
        });
        $('.js-finish-btn').on('click', function() {
            var $parent = getParent($(this));
            var index = $parent.attr('data-index');
            var $desktopParent = getDesktopParent(index);
            var validated = validateSectionContent($parent, $desktopParent);

            if (validated) {
                $('.c-configurator.bellows').bellows('close', parseInt(index));
            }
        });
    };

    var bindEvents = function() {
        $('.js-reset-configurator').on('click', function(e) {
            $('.gwt-start-over-button-panel .button').triggerGWT('click');
        });

        $('.js-share-my-design').on('click', function(e) {
            $('#copyId').triggerGWT('click');
        });

        bindAllSectionEvents();
        bindBellowControlButtons();
    };

    var parseConfiguratorBellows = function() {
        console.log('Parsing configurator...');

        var pollingForConfiguratorComplete = setInterval(function() {
            if ($('.gwt-product-detail-widget').last().find('.gwt-image-picker-option-image').first().attr('src')) {
                new ConfiguratorBellowsTemplate({
                    items: parseConfiguratorBellowItems()
                }, function(err, html) {
                    var $mainContainer = $('.js-product-options');

                    $('.js-summary-action-bar, .js-preview-banner').removeAttr('hidden');
                    $mainContainer.empty().append(html);
                    $mainContainer.find('.bellows').bellows({
                        singleItemOpen: true,
                        open: function(event, data) {
                            var $bellowsItem = data.item;
                            var $icon = $bellowsItem.find('.bellows__header .c-icon').first();
                            $icon.find('use').attr('xlink:href', '#icon-minus');

                        },
                        close: function(event, data) {
                            var $bellowsItem = data.item;
                            var $icon = $bellowsItem.find('.bellows__header .c-icon').first();
                            $icon.find('use').attr('xlink:href', '#icon-plus');
                        },
                        opened: function(event, data) {
                            var $bellowHeader = data.item;
                            if ($bellowHeader.is('.bellows--is-open')) {
                                $.scrollTo($bellowHeader, {offset: -50});
                            }
                        }
                    });

                    bindEvents();

                    previewBannerUI.updateBanner();

                    // Specify the container to find ATC buttons
                    AddToCartRegistry.init($('.gwt-right-bottom-product-options'));

                    updateExtraOptions();
                    updateConfigurator();
                    setTimeout(updatePersonalization, 1000);
                });
                clearInterval(pollingForConfiguratorComplete);
            }
        }, 300);
    };

    // Confirmation Modal
    var confirmationModalClose = function() {
        var $dialog = $('.gwt-DialogBox.ok-cancel-dlog');

        if ($dialog.find('.button.secondary').length) {
            $dialog.find('.button.secondary').triggerGWT('click');
        } else {
            $dialog.find('.button').triggerGWT('click');
        }
    };

    var $confirmationPinny = Sheet.init($('.js-confirmation-pinny'), {
        closed: function() {
            confirmationModalClose();
            $('body').trigger('confirmationClosed.mobify');
        }
    });

    var $shareMyDesignPinny = Sheet.init($('.js-share-my-design-pinny'), {
        closed: confirmationModalClose
    });

    var showConfirmation = function() {
        var $modalContent = $('.gwt-DialogBox.ok-cancel-dlog').eq(0);
        var $pinny;

        setTimeout(function() {
            var $content = $modalContent.find('.pc-copy-paste-url');

            if (!$content.length) {
                $content = $modalContent.find('.gwt-HTML');
                $pinny = $confirmationPinny;
            } else {
                // Share my design modal
                $content.find('.copy-paste-wwcm-bottom').remove();
                $pinny = $shareMyDesignPinny;
            }

            new ConfirmationModalTemplate({
                message: $content,
                secondaryBtnText: $modalContent.find('.button.secondary').text(),
                primaryBtnText: $content.is('.pc-copy-paste-url') ? null : $modalContent.find('.button.primary').text()
            }, function(err, html) {
                $pinny.setBody(html);

                var $shareDesignModal = $('.js-share-my-design-pinny #copy-paste-url');

                if ($shareDesignModal.length) {
                    setTimeout(function() {
                        $shareDesignModal.val($('.gwt-DialogBox.ok-cancel-dlog #copy-paste-url').val());
                    }, 500);

                    $('.js-confirmation__primary-button').on('click', function() {
                        $('#copy-paste-url').select();
                    });
                }

                $modalContent.addClass('js-ready');
                $pinny.open();

                $('.js-confirmation__secondary-button').on('click', function() {
                    $modalContent.find('.button.secondary').triggerGWT('click');
                    $pinny.close();
                });

                $('.js-confirmation__primary-button').on('click', function() {
                    // Immediately show the loading spinner
                    var $startOverButton = $(this);
                    new LoadingTmpl({class: 'c--small'}, function(err, html) {
                        $startOverButton.html(html);
                    });

                    $('body').one('confirmationClosed.mobify', function() {
                        $('.c-configurator.bellows').bellows('open', 0);
                    });

                    // Delay slow desktop script (and allowing the loading spinner to animate smoothly)
                    setTimeout(function() {
                        $modalContent.find('.button.primary').triggerGWT('click');  // expensive operation
                        updateConfigurator();

                        $pinny.close();
                    }, 400);
                });
            });
        }, 300);
    };

    var timerGuard;
    var showPageError = function() {
        clearTimeout(timerGuard);
        timerGuard = setTimeout(function() {
            ConfiguratorHelpers.displayConfiguratorErrors();
        }, 50);
    };

    var genericModalGuard = function() {
        var $modalContent = $('.gwt-DialogBox.ok-cancel-dlog').eq(0);
        var modalId = $modalContent.attr('id');

        if (typeof modalId !== 'undefined' || (modalId !== '' && $.trim($modalContent.attr('class')) !== 'gwt-DialogBox ok-cancel-dlog')) {
            $modalContent.addClass('js-ready');
            return;
        }

        showConfirmation();
    };

    var productConfiguratorUI = function() {
        console.log('productConfigurator UI');

        DomOverride.on('domAppend', '.gwt-pc-options-panel', parseConfiguratorBellows);
        DomOverride.on('domRemove', '#gwt-personalization-modal-V2', function() {
            updatePersonalization();
            validatePersonalization();
        });
        DomOverride.on('domAppend', '.gwt-DialogBox.ok-cancel-dlog', genericModalGuard);
        DomOverride.on('domAppend', null, showPageError, '#gwt-error-placement-div_PC');

        $('.js-product-options').parent().removeAttr('hidden');
        previewBannerUI.init();
        sizeChartUI.init();
    };

    return productConfiguratorUI;
});
