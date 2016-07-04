define([
    '$',
    'global/baseView',
    'dust!pages/wishlist-landing/wishlist-landing',
    'components/breadcrumbs/parsers/breadcrumbs-parser'
],
function($, BaseView, template, breadcrumbsParser) {
    return {
        template: template,
        extend: BaseView,

        context: {
            templateName: 'wishlist-landing',
            breadcrumbs: function() {
                var $crumbs = $('.breadcrumbs li');

                // Force wishlist to show up as a link
                $crumbs.filter('.current').wrapInner('<a href="/WishListHomeView">');

                return breadcrumbsParser.parse($crumbs);
            },

            heading: function() {
                return $('.gr-header').text();
            },
            noWishlistsMessageDOM: function() {

                var $wishlistMessage = $('.no_wish_list_message_div').addClass('u-text-capitalize');
                return $wishlistMessage;
            },
            createWishlistButtonDOM: function() {
                var $createButton = $('#createWishList');

                $createButton.addClass('c-button c--full-width u-margin-top-lg');

                return $createButton;
            }
        }
    };
});
