define([
    '$',
    'global/baseView',
    'dust!pages/view-wishlist/view-wishlist',
    'components/breadcrumbs/parsers/breadcrumbs-parser',
    'global/parsers/checkout/cart-item-parser'
],
function($, BaseView, template, breadcrumbParser, cartItemParser) {
    return {
        template: template,
        extend: BaseView,
        preProcess: function(context) {
            if (BaseView.preProcess) {
                context = BaseView.preProcess(context);
            }

            $('[id*="gwt_giftregistry_item_display"] .JSON').addClass('x-skip').parent().addClass('x-skip');

            return context;
        },
        context: {
            templateName: 'view-wishlist',
            breadcrumbs: function() {
                return breadcrumbParser.parse($('#breadcrumbs_ul li'));
            },
            hiddenForms: function() {
                var $hiddenForms = $('form.hidden');
                return $hiddenForms.add($('#gwt_view_name').parent());
            },
            wishlistLink: function() {
                return $('#wishlist');
            },
            deleteButton: function() {
                return $('#wish_list_remove').remove().addClass('c-button c--outline c--full-width c--small');
            },
            createButton: function() {
                return $('#createWishList').addClass('c-button c--outline c--full-width c--small');
            },
            itemCountMessage: function() {
                var $itemCount = $('.gift_registry_items_count');

                return {
                    count: $itemCount.find('.gift_registry_items_count_number').text(),
                    message: $itemCount.find('.gift_registry_items_count_msg').text()
                };
            },
            wishlistName: function() {
                return $('.wishListName').text();
            },
            selectAnotherWishlistLabel: function() {
                return $('#registry_name').text().replace(':', '').replace(' a ', ' ');
            },
            wishlists: function() {
                return $.makeArray($('#existingRegistry a')).map(function(el) {
                    var $el = $(el);

                    return {
                        href: $el.attr('href'),
                        label: $el.text()
                    };
                });
            },
            errorMessagesContainer: function() {
                return $('#topErrorMessages');
            },
            isEmpty: function(context) {
                return !!context.errorMessagesContainer.length;
            },
            emptyListMessage: function(context) {
                if (context.isEmpty) {
                    return context.errorMessagesContainer.children('p');
                }
            },
            addProductsButton: function(context) {
                return context.errorMessagesContainer.find('.button.primary').addClass('c-button c--primary c--full-width');
            },
            socialButtons: function() {
                return $('#socialPlugins').addClass('js-social').attr('hidden', 'true');
            },
            addItemsToCart: function() {
                return $('#wish_list_add_all_items_to_cart').addClass('c-button c--neutral c--outline c--full-width').text('Add All Items to Bag');
            },
            itemsForm: function() {
                var $form = $('#giftRegistryQuantityForm');

                return {
                    form: $form,
                    hiddenInputs: $form.find('[type="hidden"]'),
                    products: cartItemParser.parseWishlistItem($form.find('.GRProductsInView tbody tr')),
                    itemClass: 'c--dashed u-text-align-start',
                    priceClasses: 'u-margin-bottom-sm'
                };
            },
            sortBySelect: function() {
                var $form = $('#wishListItemsForm');

                return $form.length ? {
                    form: $form,
                    hiddenContents: $form.contents(),
                    select: $form.find('#sortBy').remove().addClass('u-padding-none u-unstyle-select u-text-capitalize')
                } : null;
            }
        }
    };
});
