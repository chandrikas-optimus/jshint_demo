define([
    '$',
    'global/ui/wishlist-modal-ui',
    'components/sheet/sheet-ui'
], function($, wishlistModalUI, sheet) {
    var triggerModal = function() {
        if (event.animationName === 'modalAdded') {
            var $newWishlistModal = $('#gwt-wishlist-create-modal');

            if ($newWishlistModal.length) {
                wishlistModalUI.showNewWishlistModal($newWishlistModal);
            }
        }
    };

    var wishlistLandingUI = function() {
        document.addEventListener('animationStart', triggerModal);
        document.addEventListener('webkitAnimationStart', triggerModal);
        wishlistModalUI.initSheet();
    };

    return wishlistLandingUI;
});
