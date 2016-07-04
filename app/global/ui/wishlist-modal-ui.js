define([
    '$',
    'components/sheet/sheet-ui',
    'dust!pages/product/partials/wishlist-list',
    'pages/product/parsers/wishlist-list-parser',
    'dust!pages/product/partials/wishlist-product-added',
    'pages/product/parsers/wishlist-product-added-parser'
], function($, sheet, wishlistListTemplate, wishlistListParser, wishlistProductAddedTemplate, wishlistProductAddedParser) {


    var $loader = $('<div class="c-loading c--small"><p class="u-visually-hidden">Loading...</p><div class="bounce1 c-loading__dot c--1"></div><div class="bounce2 c-loading__dot c--2"></div><div class="bounce3 c-loading__dot c--3"></div></div>');
    var $check = $('<svg class="c-icon-svg " title="Checks"><title>Check</title><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-check-button"></use></svg>');
    var $wishlistPinny = $('.js-wishlist-pinny');
    var $wishlistShade;
    var $wishlistButton;
    var viewListHrefValue;

    var _bindEvents = function() {
        var $wishlistPinny = $('.js-wishlist-pinny');
        $wishlistButton = $('.js-add-to-wishlist');
        var $origWishlistButton = $('.gwt-product-detail-buttons-panel').find('button').filter(function() {
            return /wish list/i.test($(this).text());
        });

        $wishlistPinny.on('click', '.js-wishlist-option', function() {
            $(this).find('input').prop('checked', true);
        });

        $wishlistPinny.on('click', '.js-save-wishlist', function() {
            var $value = $('.js-wishlist-option input:checked').data('value');
            $('.js-wishlist-select').val($value);
            $('.js-wishlist-select')[0].dispatchEvent(new CustomEvent('change'));
            $('.js-wishlist-add')[0].dispatchEvent(new CustomEvent('click'));
            viewListHrefValue = $value.replace(':1', '');
        });

        $('body').on('click', '.js-add-to-wishlist', function(e) {
            var $button = $(this);
            e.preventDefault();

            if ($button.hasClass('js-to-list')) {
                window.location.href = $('.js-view-list').attr('href');
            } else {
                $button.html($loader);
                // Wishlist opens a popup, will need to add transformations
                $origWishlistButton.find('span').click();
            }
        });
    };

    var _resetPinnyMarkUp = function() {
        // The wishlist pinny and shade had to be moved inside the desktop popup
        // so that events worked correctly (the desktop JS blocks all events outside their popup).
        // Now that the desktop modal is closed, move the elements back to where they should be.
        var $lockup = $('.lockup__container');
        // $wishlistButton.html(translator.translate('wishlist_button'));
        $wishlistPinny.parent().appendTo($lockup);
        $wishlistShade.appendTo($lockup);
    };

    var _revertWishlistButtonToDefault = function() {
        // $wishlistButton.html(translator.translate('wishlist_button'));
        $wishlistButton.removeClass('c--success c--check js-to-list');
    };

    var _changeButtonToViewList = function() {
        $wishlistButton.addClass('js-to-list');
        // $wishlistButton.html(translator.translate('view_list_button_text'));

        setTimeout(_revertWishlistButtonToDefault, 5000);
    };

    var _changeWishlistToSuccess = function() {
        $wishlistButton.html($check);
        $wishlistButton.addClass('c--success c--check');

        setTimeout(_changeButtonToViewList, 2000);
    };


    var _bindSelectEvent = function($select, $addButton) {
        $select.on('change', function(e) {
            var $selected = $select.find(':selected');
        });
    };

    var _transformWishlistContent = function($content) {
        var $mainTable = $content.find('table');
        var $newContent = $('<div>');
        var $selectIcon = $('<svg class="c-icon"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-arrow-downward"></use></svg>');
        var $selectContainer = $('<div class="c-select c-input u-margin-bottom-md">');
        var $addButton = $content.find('.button.primary');
        var $select = $content.find('.gift-registry-list-bx').addClass('js-wishlist-select');

        // Replace table layout
        // We can't use a template partial here without losing all of the desktop event handlers
        $selectContainer.append($select);
        $selectContainer.append($selectIcon);
        $selectContainer.hide();
        $newContent.append($('<strong>').text($mainTable.find('.gift-registry-instruction-lbl').text()));
        $newContent.append($selectContainer);

        _bindSelectEvent($select, $addButton);

        $mainTable.replaceWith($newContent);

        // Transform Buttons
        $addButton.addClass('c-button c--primary c--full-width');
        if ($addButton.attr('disabled')) {
            $addButton.addClass('c--is-disabled');
        }
        $content.find('.button.secondary').addClass('u-visually-hidden js-close-modal');
        $content.find('.button.primary').addClass('u-visually-hidden js-wishlist-add');

        var $wishlistListData = wishlistListParser.parse($select);

        wishlistListTemplate($wishlistListData, function(_, out) {
            $(out).insertAfter($newContent.find('strong'));
        });
    };

    var _transformNewWishlistContent = function($content) {
        var $mainTable = $content.find('table');
        var $newContainer = $('<div>');
        var $inputContainer = $('<div class="c-field__row">');
        var $nameInput = $mainTable.find('#wishlist_name_id');
        var maxInputLength = $nameInput.attr('maxlength');

        // Error Containers
        $newContainer.append($mainTable.find('#WishlistCreateErrorPanel').addClass('u-text-warning'));
        $newContainer.append($mainTable.find('#gwt-gift-registry-custom-message-error-text').addClass('u-text-warning'));

        // field label
        $('<label for="' + $nameInput.attr('id') + '">Wishlist Name</label>').appendTo($inputContainer);

        // name input
        $inputContainer.append($('<div class="c-input">').append($nameInput));
        $newContainer.append($inputContainer);

        // Buttons
        $newContainer.append($mainTable.find('.button.secondary').addClass('js-close-modal u-visually-hidden'));
        $newContainer.append($mainTable.find('.button.primary').addClass('c-button c--primary c--full-width u-margin-top-lg'));

        $mainTable.replaceWith($newContainer);

        // Event handlers
        // CF-730: Work around for android v4.1+ maxlength atttibute not working
        // see: http://stackoverflow.com/questions/28198466/maxlength-of-input-tag-with-type-text-using-html5-in-android-webview-not-working
        // and https://code.google.com/p/android/issues/detail?id=35264
        $nameInput.on('keyup', function(e) {
            if (this.value.length >= maxInputLength) {
                var value = this.value;
                this.value = value.substr(0, maxInputLength);
            }
        });
    };

    var _showAddToWishlistModal = function($modal) {
        var $content = $modal.find('.gwt-submit-cancel-dialog-content-panel');
        var title = $modal.find('.dialogTopCenterInner').text();
        var $signInPinny = $('.js-sign-in-pinny');

        _resetPinnyMarkUp();

        if ($signInPinny.parent().hasClass('pinny--is-open')) {
            $signInPinny.pinny('close');
        }

        //$content.find('.button.secondary span').click();
        $modal.removeAttr('style');

        _transformWishlistContent($content);

        $wishlistPinny.find('.pinny__title').html(title);
        $wishlistPinny.find('.pinny__content').html($content);
        // The pinny has to be within the outer modal container, so all elements inside it are still clickable.
        // This GWT modal has been set to block all clicks outside of the modal itself.
        // So we need all of the pinny elements within it so it can still function
        // The pinny will be added back to the correct position when it closes.
        $modal.html($wishlistPinny.parent());
        $modal.append($wishlistShade);
        $wishlistPinny.closest('.gwt-DialogBox').addClass('js-ready');  // for pdp configurator
        $wishlistPinny.pinny('open');
    };

    var _showNewWishlistModal = function($modal) {
        var $content = $modal.find('.dialogContent');
        // var title = $modal.find('.Caption .gwt-HTML').text();
        // CF-742: Design feedback. Requires hardcoding the title
        var title = 'New Wish List';

        if (!$content.length) {
            // The transformation has already run.
            return;
        }

        _resetPinnyMarkUp();
        _transformNewWishlistContent($content);


        $wishlistPinny.find('.pinny__title').html(title);
        $wishlistPinny.find('.pinny__content').html($content);

        // CF-599: Hide the original modal
        $modal.attr('hidden', 'hidden');

        // The pinny has to be within the outer modal container, so all elements inside it are still clickable.
        // This GWT modal has been set to block all clicks outside of the modal itself.
        // So we need all of the pinny elements within it so it can still function
        // The pinny will be added back to the correct position when it closes.
        // $modal.html($wishlistPinny.parent());
        // $modal.append($wishlistShade);

        if (!$wishlistPinny.parent().hasClass('pinny--is-open')) {
            $wishlistPinny.closest('.gwt-DialogBox').addClass('js-ready');  // for pdp configurator
            $wishlistPinny.pinny('open');
        }
    };

    // NOTE: this function will _not_ be using $wishlistPinny like the rest of the code
    var _triggerWishlistNotification = function($modal) {
        var $productAddedPinny = $('.js-generic-pinny');
        var $productAddedShade = $productAddedPinny.closest('.pinny').next('.shade');
        var $productImage = $modal.find('.gwt-shoppingcart-thumbnail-image, .gwt-add-to-cart-thumbnail-image').clone();
        var $desktopModalContent = $modal.find('> div:first').addClass('u-visually-hidden js-desktop-modal-content');
        // CF-845: On some older android phones, this function is called twice for a single modal
        // So make sure that we only parse the original modal content
        var wishlistContent = wishlistProductAddedParser.parse($desktopModalContent);

        // For this notification, we'll be using .js-generic-pinny instead
        // so we can close this wishlist pinny
        $wishlistPinny.pinny('close');

        _changeWishlistToSuccess();

        wishlistProductAddedTemplate(wishlistContent, function(_, out) {
            var $content = $(out);
            $productAddedPinny.find('.pinny__title').text(wishlistContent.heading);

            // CF-729: If we've added multiple items, we'll need to add each image separately
            $content.find('.js-image-container').each(function(index, imageContainer) {
                $(imageContainer).append($productImage.eq(index).addClass('c-product-summary__image'));
            });

            $productAddedPinny.find('.pinny__content').html($content);

            // The pinny has to be within the outer modal container, so all elements inside it are still clickable.
            // This GWT modal has been set to block all clicks outside of the modal itself.
            // So we need all of the pinny elements within it so it can still function
            // The pinny will be added back to the correct position when it closes.
            $modal.prepend($productAddedPinny.parent());
            $modal.append($productAddedShade);

            $productAddedPinny.closest('.gwt-DialogBox').addClass('js-ready');  // for pdp configurator
            $productAddedPinny.pinny('open');
        });

        // bind up the events.
        $productAddedPinny
            .off('keyup', '.js-registry-message .gwt-gift-registry-message-textbox')
            .on('keyup', '.js-registry-message .gwt-gift-registry-message-textbox', function() {
                var $input = $(this);
                var $modal = $('.gwt-added-to-gift-registry-modal');

                $modal.find('> div .gwt-gift-registry-message-textbox').val($input.val());
            });

        $productAddedPinny
            .off('click', '.js-view-list')
            .on('click', '.js-view-list', function() {
                $desktopModalContent.find('.button.primary').triggerGWT('click');
            });

        $productAddedPinny
            .off('click', '.js-continue-shopping')
            .on('click', '.js-continue-shopping', function() {
                $desktopModalContent.find('.button.secondary').triggerGWT('click');
            });
    };


    var _onPinnyClose = function() {
        var $closeButton = $wishlistPinny.find('.js-close-modal');
        $wishlistPinny.closest('.gwt-DialogBox').append($closeButton);
        _resetPinnyMarkUp();
        // Remove the loader and revert back to the original btn text.
        $closeButton.click();
        $closeButton.find('span').click();
    };

    var _initSheet = function() {
        sheet.init($wishlistPinny, {
            close: _onPinnyClose,
            disableScrollTop: true,
            shade: {
                cssClass: 'js-wishlist-shade',
                zIndex: 100 // Match our standard modal z-index from our CSS ($z3-depth)
            }
        });


        $wishlistShade = $('.js-wishlist-shade');
    };

    return {
        bindEvents: _bindEvents,
        showAddToWishlistModal: _showAddToWishlistModal,
        initSheet: _initSheet,
        showNewWishlistModal: _showNewWishlistModal,
        triggerWishlistNotification: _triggerWishlistNotification
    };
});
