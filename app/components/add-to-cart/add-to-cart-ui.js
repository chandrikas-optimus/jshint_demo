define([
    '$',
    'components/flip/flip-ui',
    'components/alert/alert-ui',
    'dust!components/loading/loading',
    'dust!pages/product/partials/added-to-cart-alert',
    'components/sheet/sheet-ui',
    'dust!components/product-summary/product-summary',
    'global/parsers/price-parser'
], function(
    $,
    Flip,
    Alert,
    loadingTemplate,
    cartAlertTemplate,
    Sheet,
    productSummaryTemplate,
    priceParser
) {

    var _addToCartClicked = function(getReadyProducts, callbackAfterLoading, callbackAfterLongDelay) {
        var self = this;
        self._showLoadingSpinner();

        // First, wait for the desktop modal to finish its rendering
        // CF-162: This event is from _nodeInserted animation styles listened for in global ui
        $('body').one('mobify:addedToCart', function() {

            // Wait until some time has passed..
            setTimeout(function() {
                if (self.$addToCartFlip.find('.c--flipped').length > 0) {
                    callbackAfterLongDelay && callbackAfterLongDelay();

                    self.addToCartFlip.halfFlip({
                        halfFlipped: function() {
                            // Show 'View Bag/Checkout' button
                            self.$viewCartButton.prop('hidden', false);
                            self.$addedToCartButton.prop('hidden', true);

                            // Half flip again to make back of card visible
                            self.addToCartFlip.halfFlip();
                        }
                    });
                }
            }, 3000);

            // NOTE: this timeout would run first
            setTimeout(function() {
                // Show 'Added to Shopping Bag'
                self.addToCartFlip.flip({
                    flipped: function() {
                        self._hideLoadingSpinner();
                    }
                });

                self._renderCartAlert(getReadyProducts());

                self._parseDesktopModal();
                self._closeDesktopModal();

                callbackAfterLoading && callbackAfterLoading();
            }, 10);
        });

        // CF-591: Flip the CTA back to add to cart after user makes a change on PDP option
        $('body').one('change.mobify', function() {
            if (self.$addToCartFlip.find('.c--flipped').length > 0) {
                self.addToCartFlip.flip({
                    flipped: function() {
                        // The next time the card is flipped,
                        // we'll show the 'Added to Shopping Bag'
                        self.$addedToCartButton.prop('hidden', false);
                        self.$viewCartButton.prop('hidden', true);
                    }
                });
            }
        });
    };

    // Constructor
    var AddToCart = function AddToCart($flipContainer, $alertContainer, $reviewItemsPinny, options) {
        this.$addToCartFlip = $flipContainer;
        this.addToCartFlip = Flip.init(this.$addToCartFlip);

        this.$addToCartButton = $flipContainer.find('.js-add-to-cart-container').find('a, button').first();
        this.$addedToCartButton = $flipContainer.find('.js-added-to-cart');
        this.$viewCartButton = $flipContainer.find('.js-view-cart');

        this.$cartAlert = $alertContainer;
        Alert.init();

        this.reviewItemsSheet = Sheet.init($reviewItemsPinny);

        var self = this;
        this.$addToCartButton.on('click', function() {
            setTimeout(function() {
                if (options.checkErrors) {
                    var passed = options.checkErrors();
                    if (passed) {
                        _addToCartClicked.call(self, options.getReadyProducts, options.callbackAfterLoading, options.callbackAfterLongDelay);
                    }
                } else {
                    _addToCartClicked.call(self, options.getReadyProducts, options.callbackAfterLoading, options.callbackAfterLongDelay);
                }
            });
        });
    };

    // NOTE: there's a similar parser at wishlist-product-added-parser.js
    AddToCart.prototype._parseDesktopModal = function() {
        var self = this;
        var $desktopModal = $('.gwt_addtocart_div');

        // Holding area for all added-to-cart pinny data
        var $pinnyData = $('.js-added-to-cart-pinny-data').empty();

        // Parse out data from desktop modal that we'll need for the added-to-cart modal
        var $desktopContent = $desktopModal.find('.gwt_addtocartdiv_content_area');
        $pinnyData.append('<span class="js-title">' + $desktopModal.find('.dialogTopCenterInner').text() + '</span>');
        $pinnyData.append('<div class="js-body" />');
        $pinnyData.append('<div class="js-footer u-padding-all" />');

        // Populate body
        var $items = $desktopContent.find('.addToCartItem');
        $items.each(function(i, item) {
            var $item = $(item);
            var heading = $item.find('.addToCartProductName').text();
            var itemNum = $item.find('.gwt_addtocartdiv_itemnumber').text();
            var $img = $item.find('img');

            // Build up table
            var table = [];

            // Push size + color info
            $item.find('.moreContentExpander .oios-option-line').each(function(i, line) {
                var $line = $(line);
                var value = $.trim($line.find('.ois-option-value').text());
                var indent = $line.parents('.oios-pcat-summary-panel, .oios-pcat-pers-summary-panel').length;

                table.push({
                    setFontWeightBold: !value ? true : null,
                    indentClass: indent ? 'u-padding-start-md u-border-left' : '',
                    label: $line.find('.ois-option-name').text(),
                    value: value
                });
            });

            // CF-624: Add Personalization details to item summary
            if ($item.find('.gwt_personalization_wrapper').length) {
                $item.find('.gwt_personalization_wrapper .gwt_personalization_div').each(function() {
                    table.push({
                        // Dust template already includes ":" separator
                        label: $(this).find('.label').text().replace(':', ''),
                        value: $(this).find('.value').text().replace(':', '')
                    });
                });
            }

            // Push quantity info
            var $quantity = $item.find('.gwt_quantity_div');
            if ($quantity.length) {
                table.push({
                    label: ($quantity.find('.gwt_addtocartdiv_quanitylabel').text() + '').replace(':', ''),
                    value: $quantity.find('.gwt_addtocartdiv_quanity').text()
                });
            }

            var $cloneImg = $img.clone();
            var reviewCartItemReference = 'js-review-cart-item-' + i;
            var imgSrc = $img.attr('src');
            // Sometimes image is not ready, but we don't want the script die because we cannot regex the image source
            if ($img.length && imgSrc) {
                $cloneImg.attr('src', imgSrc.replace('?$C_Thumb_2$', ''));
            } else {
                $img[0].onload = function() {
                    Adaptive.$('.' + reviewCartItemReference).attr('src', Adaptive.$(this).attr('src').replace('?$C_Thumb_2$', ''));
                };
            }

            var summaryData = {
                containerClass: 'c--dashed u-border-gray',
                leftColumnClass: 'c--shrink',
                imageContainerClass: 'c--medium',
                image: $cloneImg.addClass(reviewCartItemReference),
                heading: heading,
                itemNum: itemNum,
                table: table,
                price: priceParser.parse($item),
                additionalMessage: $item.find('.gwt_addtocartdiv_shipping_message, .gwt_addtocartdiv_fInventoryMessageLabel')
            };

            productSummaryTemplate(summaryData, function(err, html) {
                $pinnyData.find('.js-body').append(html);
            });

        });

        // Populate footer
        // Just use the minicart's checkout button
        $pinnyData.find('.js-footer').append(
            $('.c-minicart .js-minicart-checkout').first().clone()
            .removeClass('u-margin-bottom-xxlg')
            .addClass('u-margin-bottom-md needsclick')
        );

        $pinnyData.find('.js-footer').append(
            '<p class="c-note">' + $desktopModal.find('.gwt_addToCartDiv_shipping_message').text() + '</p>'
        );

        // Bind the review items button to open the Pinny
        this.$cartAlert.find('.js-review-items').on('click', function() {

            // Open pinny only after the alert has been closed
            $('body').one('alertClosed.mobify', function() {
                // Get pinny data from hidden div
                self.reviewItemsSheet.setTitle($pinnyData.find('.js-title').text());
                self.reviewItemsSheet.setBody($pinnyData.find('.js-body'));
                self.reviewItemsSheet.setFooter($pinnyData.find('.js-footer'));

                self.reviewItemsSheet.open();
            });

            // Dismiss alert
            Alert.hide(self.$cartAlert.find('.c-alert'));
        });

    };

    AddToCart.prototype._closeDesktopModal = function() {
        var $closeButton = $('.gwt_addtocart_div .ok-cancel-close-btn');
        $closeButton.triggerGWT('click');
    };

    AddToCart.prototype._renderCartAlert = function($products) {
        var self = this;
        var count = 0;

        if ($products.find('.c-configurator').length) {
            count = {
                innerText: 1
            };
        } else {
            var steppers = $products.find('.c-stepper__count').toArray();
            count = steppers.reduce(function(previous, current) {
                var previousCount = previous.innerText;
                var currentCount = current.innerText;

                if (previousCount !== undefined) {
                    previousCount = parseInt(previousCount);
                }

                if (currentCount !== undefined) {
                    currentCount = parseInt(currentCount);
                }

                return {
                    innerText: (previousCount !== undefined ? previousCount : 0) + (currentCount !== undefined ? currentCount : 0)
                };
            }, 0);
        }

        var data = {
            class: 'c--fixed',
            count: count.innerText,
            plural: count.innerText > 1
        };

        cartAlertTemplate(data, function(err, html) {
            self.$cartAlert.html(html);

            self.$cartAlert.prop('hidden', false);
            Alert.show(self.$cartAlert.find('.c-alert'));
        });
    };

    AddToCart.prototype._showLoadingSpinner = function() {
        var $loadingSpinnerButton = $('<button type="button" class="c-button c--full-width js-loading-button">');
        loadingTemplate({class: 'c--small'}, function(err, html) {
            $loadingSpinnerButton.html(html);
        });

        this.$addToCartButton
            .prop('hidden', true)
            .after($loadingSpinnerButton);
    };

    AddToCart.prototype._hideLoadingSpinner = function() {
        this.$addToCartButton.siblings('.js-loading-button').remove();
        this.$addToCartButton.prop('hidden', false);
    };

    // NOTE:
    // It is allowed to call init() multiple times
    // using the same $alertContainer and $reviewItemsPinny elements
    var init = function($flipContainer, $alertContainer, $reviewItemsPinny, options) {
        if ($flipContainer.length === 0 || $alertContainer.length === 0 || $reviewItemsPinny.length === 0) {
            console.error('Cannot find all of the expected elements');
        }
        new AddToCart($flipContainer, $alertContainer, $reviewItemsPinny, options);
    };



    return {
        init: init
    };
});
