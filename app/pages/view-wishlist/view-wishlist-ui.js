define([
    '$',
    'global/utils/dom-operation-override',
    'global/ui/stepper-ui',
    'global/ui/wishlist-item-ui',
    'global/ui/social-links-ui',
    'global/parsers/product-details-tab-parser',
    'components/sheet/sheet-ui',
    'dust!components/accordion/accordion',
    'global/ui/wishlist-modal-ui',
    'bellows',
    'components/add-to-cart/add-to-cart-ui'
],
function($, domOperation, stepperUI, wishlistItemUI, socialLinksUI, productDetailsTabParser, sheet, AccordionTemplate, wishlistModalUI, bellows, AddToCart) {
    var $deletePinny, $detailsPinny, $wishlistPinny;
    var deleteSheet, detailsSheet, wishlistSheet;


    var _transformProductDetailsModal = function(productDetails) {
        var $modalContent = $(productDetails).parent();
        var templateContent = productDetailsTabParser.parse($modalContent);
        var $content, title;

        $modalContent.find('ul').addClass('c-list-bullets');

        if (templateContent.items.length > 1) {
            templateContent.items[0].isOpen = true;
            title = $modalContent.find('.Caption').text();

            new AccordionTemplate(templateContent, function(err, html) {
                $content = $(html);
                $content.bellows({
                    open: function(e, data) {
                        var $target = $(data.item);
                        var $pinnyContainer = $target.closest('.pinny__content');

                        $pinnyContainer.css('zoom', '1.01');

                        window.setTimeout(function() {
                            $pinnyContainer.css('zoom', '1');
                        }, 0);
                    }
                });
            });
        } else {
            title = $modalContent.find('.gwt-TabBarItem').text();
            $content = $modalContent.find('.gwt-TabPanelBottom .gwt-HTML');
        }

        $modalContent.find('.secondary').triggerGWT('click');

        detailsSheet.setTitle(title);
        detailsSheet.setBody($content);

        detailsSheet.open();
    };


    var _showDeleteModal = function(deleteModal) {
        var $deleteModal = $(deleteModal);

        var $buttons = $deleteModal.find('.okCancelPanel');
        $deleteModal.removeAttr('style');
        $deleteModal.attr('hidden', 'true');

        $buttons.find('.secondary').addClass('c-button c--full-width c--outline u-text-lowercase u-margin-bottom-md js-close');
        $buttons.find('.primary').addClass('c-button c--full-width u-text-lowercase');

        deleteSheet.setTitle($deleteModal.find('.Caption').text());
        deleteSheet.setBody($buttons);

        deleteSheet.open();
    };

    var _showCreateModal = function(createModal) {
        wishlistModalUI.showNewWishlistModal($(createModal));
    };

    var _bindEvents = function() {
        var $selectWishlistButton = $('.js-select-wishlist');
        deleteSheet = sheet.init($deletePinny, {
            shade: {
                zIndex: 100 // Match our standard modal z-index from our CSS ($z3-depth)
            }
        });
        detailsSheet = sheet.init($detailsPinny, {disableScrollTop: true});
        // Already intialized in the wishlist modal ui
        wishlistSheet = $wishlistPinny.data('component');

        domOperation.on('domAppend', '.gwt-gr-delete-dialog', _showDeleteModal);
        domOperation.on('domAppend', '#gwt-wishlist-create-modal', _showCreateModal);
        domOperation.on('domAppend', '#gwt-product-detail-info-modal', _transformProductDetailsModal);

        $('body').on('click', '.js-close', function(e) {
            if (deleteSheet.isOpen) {
                deleteSheet.close();
            }
        });

        $('body').on('click', '.c-sheet__header-close', function(e) {
            var $closeButton = $('.js-close');
            $closeButton.click();
            $closeButton.find('span').click();
        });

        $('body').on('click', '.js-thumbnail', function(e) {
            var $thumbnail = $(this);
            var $thumbnailImage = $thumbnail.find('img');

            if ($thumbnail.hasClass('selected')) {
                return;
            }

            $thumbnail.addClass('selected');
            $thumbnail.siblings().removeClass('selected');

            $('.js-main-image img').attr('src', $thumbnailImage.attr('src').replace('thumb', 'main'));
        });


        $selectWishlistButton.on('click', function() {
            var $list = $('.js-select-wishlist-list');

            $list = $list.children().clone();
            wishlistSheet.setTitle($selectWishlistButton.text().trim());
            wishlistSheet.setBody($list);

            wishlistSheet.open();
        });
    };


    var _initLocalVariables = function() {
        $deletePinny = $('.js-delete-pinny');
        $detailsPinny = $('.js-details-pinny');
        $wishlistPinny = $('.js-wishlist-pinny');
    };

    var _initAddToCartButtons = function() {
        var $cartAlert = $('.js-cart-alert');
        var $genericPinny = $('.js-generic-pinny');

        $('.js-cart-item .js-flip').each(function() {
            var $addToCartFlip = $(this);
            var $cartItem = $addToCartFlip.closest('.js-cart-item');

            AddToCart.init($addToCartFlip, $cartAlert, $genericPinny, {
                getReadyProducts: function() {
                    return $cartItem;
                }
            });
        });
    };

    var viewWishlistUI = function() {
        _initLocalVariables();
        wishlistModalUI.initSheet();
        wishlistItemUI();
        socialLinksUI.init();
        _bindEvents();
        stepperUI();

        _initAddToCartButtons();
    };

    return viewWishlistUI;
});
