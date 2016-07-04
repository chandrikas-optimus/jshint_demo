define([
    '$',
    'global/registryBaseView',
    'dust!pages/gift-registry-view/gift-registry-view',
    'global/parsers/checkout/cart-item-parser'
],
function($, BaseView, template, cartItemParser) {
    return {
        template: template,
        extend: BaseView,

        context: {
            templateName: 'gift-registry-view',
            manageHref: function() {
                return $('.gr_manage_registry_link').attr('href');
            },
            itemsForm: function() {
                var $items = $('.GRProductsInView tbody tr');
                if ($items.length) {
                    return {
                        products: cartItemParser.parseWishlistItem($items, true, true)
                    };
                }
            },
            isView: function() {
                return true;
            },
            backToManageLink: function() {
                return $('.gr_manage_registry_link');
            },
            isAnonymousUser: function(context) {
                return typeof context.manageHref === 'undefined';
            },
            registryName: function() {
                return $('.registy-registrant-name .gr-data');
            }
        }
    };
});
