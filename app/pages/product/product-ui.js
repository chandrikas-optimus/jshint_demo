define([
    '$',
    'global/utils/dom-operation-override',
    'global/includes/sizechart/size-chart-parser',
    'hijax',
    'components/sheet/sheet-ui',
    'components/stepper/stepper-ui',
    'pages/product/tell-a-friend-ui',
    'global/ui/wishlist-modal-ui',
    'pages/product/sign-in-ui',
    'pages/product/personalization-ui',
    'pages/product/product-images-ui',
    'pages/product/tell-a-friend-ui',

    //No args
    'bellows',
    'pinny',
    'magnifik',
], function(
    $,
    DomOverride,
    SizeChartParser,
    Hijax,
    Sheet,
    Stepper,
    tellAFriendUI,
    wishlistUI,
    signInUI,
    personalizationUI,
    ProductImages,
    tellAFriendUI,

    bellows,
    Pinny,
    magnifik
) {
    if ($('.t-product').length === 0) {
        return; // exit early
    }

    var insertShareButton = function() {
        // TODO: refactor into its own file
        $('.facebookLike, .twitterShare, .pinterestPinIt, .plusContent,.socialIconFacebook, .socialIconTwitter, .socialIconPinterest, .socialIconGoogle').prependTo('.js-share');
    };

    var initHijax = function() {
        var hijax = new Hijax();

        hijax.set(
            'tell-a-friend-proxy',
            function(url) {
                return url.indexOf('SendTellAFriendEmail') > -1;
            },
            {
                complete: function(data, xhr) {
                    if (data.success === 'true') {
                        tellAFriendUI.closeModal();
                    }
                }
            }
        );

        hijax.set(
            'size-charts',
            function(url) {
                return url.indexOf('sizecharts') > -1;
            },
            {
                complete: function(data, xhr) {
                    var sizeChartUrl = $(data).filter('iframe').remove().attr('src');
                    // Using Ajax to load the size charts
                    SizeChartParser.showSizeChart(sizeChartUrl);

                }
            }
        );

        hijax.set(
            'login-success',
            function(url) {
                return url.indexOf('Logon') > -1;
            },
            {
                complete: function(data, xhr) {
                    if (data.success === 'true') {
                        $('.js-sign-in-pinny').pinny('close');
                    }
                }
            }
        );
    };



    var triggerModal = function() {
        if (event.animationName === 'modalAdded') {
            var $addWishlistModal = $('#gwt-add-to-gift-registry-modal');
            var $newWishlistModal = $('#gwt-wishlist-create-modal');
            var $addedToWishlistModal = $('.gwt-added-to-wish-list-modal, .gwt-added-to-gift-registry-modal.nodisplay');
            var $signInModal = $('#gwt-sign-in-modal');
            var $forgotPasswordModal = $('#passwordReset');
            var $personalizationModal = $('#gwt-personalization-modal-V2');
            var $sizeChartModal = $('.gwt-defining-attribute-url-content');
            var $sizeChartPanel = $('.gwt-PopupPanelGlass');

            // CF-588: New modal for PDP configurator errors
            var $configuratorErrorModal = $('.gwt-unselected-options-error-dialog');

            if ($sizeChartModal.length) {
                $sizeChartModal.find('.okCancelPanel').find('.button.primary').triggerGWT('click');
            }

            if ($signInModal.length) {
                if ($signInModal.find('.pinny--is-open').length > 0) {
                    // CF-732: For some reason on Android device, this gets triggered again. We'll do nothing.
                } else {
                    signInUI.showSignInModal($signInModal);
                }
            } else if ($forgotPasswordModal.length) {
                if ($forgotPasswordModal.find('.pinny--is-open').length > 0) {
                    // CF-732: For some reason on Android device, this gets triggered again. We'll do nothing.
                } else {
                    signInUI.showForgotPasswordModal($forgotPasswordModal);
                }
            } else if ($newWishlistModal.length) {
                wishlistUI.showNewWishlistModal($newWishlistModal);
            } else if ($addWishlistModal.length && !$addWishlistModal.children('.c-sheet').length) {
                wishlistUI.showAddToWishlistModal($addWishlistModal);
            } else if ($addedToWishlistModal.length) {
                wishlistUI.triggerWishlistNotification($addedToWishlistModal);
            } else if ($personalizationModal.length) {
                // for some reason iOS repaints when scroll...
                if ($('.js-personalization-pinny').closest('.pinny--is-open').length) {
                    return;
                }

                // Ensure that the modal is closed when closing the pinny quickly so desktop + mobile don't go out of sync
                if ($personalizationModal.css('visibility') === 'hidden') {
                    personalizationUI.build($personalizationModal);
                } else {
                    $('.js-cancel-personalization span').click();
                    $('.js-cancel-personalization span').trigger('click');
                }
            } else if ($configuratorErrorModal.length) {
                // Always dismiss configurator modal errors
                $configuratorErrorModal.find('.button.primary').triggerGWT('click');
            }
        }
    };

    // Similar to _resetPinnyMarkUp() in wishlist-modal-ui.js
    // Make sure that our pinny doesn't get eaten by the desktop modal
    var resetPinnyMarkUp = function($pinny) {
        var $lockup = $('.lockup__container');
        var $pinnyContainer = $pinny.closest('.pinny');
        var $pinnyShade = $pinnyContainer.next('.shade');

        if ($pinnyShade.length === 0) {
            $pinnyShade = $pinnyContainer.siblings('.shade');
        }

        $lockup
            .append($pinnyContainer)
            .append($pinnyShade);
    };

    var initGenericPinny = function($pinny) {
        var $desktopCloseBtn;

        var sheet = Sheet.init($pinny, {
            close: function() {
                if ($pinny.closest('.gwt-DialogBox').length > 0) {
                    resetPinnyMarkUp($pinny);
                }
            },
            closed: function() {
                $pinny.find('.pinny__title, .pinny__footer').empty();
                $pinny.find('.pinny__content *').not('.pinny__spacer').remove();

                $desktopCloseBtn && $desktopCloseBtn.triggerGWT('click');
            }
        });

        // Make sure the closed state of our pinny and desktop modal are in sync
        $pinny.on('click', '.button.secondary', function() {
            // Clean up time.. desktop modal is closing itself,
            // so we'll do the same to our pinny.
            sheet.close();
        });
        $pinny.on('click', '.pinny__close', function() {
            $desktopCloseBtn = $pinny.closest('.gwt-DialogBox').find('.ok-cancel-close-btn');
            // As soon as our pinny's closing animation is done,
            // we'll click the above button to close desktop modal.
        });
    };

    var initSheets = function() {
        wishlistUI.initSheet();
        signInUI.initSheet();

        initGenericPinny($('.js-generic-pinny'));
    };

    var bindPersonalizationEvents = function() {
        $('body').on('click', '.js-personalize-link', function(e) {
            var $target = $(e.target);

            // CF-467: For bundles, items selected for personalization must be tagged
            // so that only the selected item's data is used for the modal
            $('.js-selected-personalization-item').removeClass('js-selected-personalization-item');

            if ($('.js-product-options .js-personalize-link').length > 1) {
                // Bundled items need to have the item to be personalized marked as selected
                $target.parents('.c-accordion__item').addClass('js-selected-personalization-item');
            }

            if ($target.closest('.gwt-product-detail-widget-personalization-panel').length) {
                return;
            }

            var $personalizeLink = $(this).find('.gwt-product-detail-widget-personalization-panel .gwt-personalize-link-style').filter(function() {
                return /personalize/ig.test($(this).text());
            });

            if ($personalizeLink.length) {
                $personalizeLink[0].dispatchEvent(new CustomEvent('click'));
            }
        });
    };

    // Quickly initialize magnifik
    ProductImages.initMagnifik();

    var _productDetailProducts = function() {
        return $('.gwt-product-detail-widget');
    };

    var productUI = function() {
        console.log('product UI');
        // Add any scripts you would like to run on the product page only here

        ProductImages.init();
        initHijax();
        initSheets();
        personalizationUI.init();

        // Personalization Modal
        document.addEventListener('animationStart', triggerModal);
        document.addEventListener('webkitAnimationStart', triggerModal);

        DomOverride.on('domAppend', '.tell-friend-button', function() {
            tellAFriendUI.init();
            insertShareButton();
        });

        Stepper.init();
        bindPersonalizationEvents();

        wishlistUI.bindEvents();
    };

    return productUI;
});
