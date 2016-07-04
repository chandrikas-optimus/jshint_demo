define([
    '$',
    'global/registryBaseView',
    'dust!pages/gift-registry-manage/gift-registry-manage',
    'global/parsers/checkout/cart-item-parser',
    'translator'
],
function($, BaseView, template, cartItemParser, translator) {

    return {
        template: template,
        extend: BaseView,
        context: {
            templateName: 'gift-registry-manage',
            registryConfirmationData: function() {
                return $('#newGiftRegistryConfirmationDiv');
            },
            chooseRegistry: function() {
                var $select = $('#descriptionGR');
                return {
                    label: $('#registry_name').text(),
                    select: $select,
                    registries: $select.children().map(function(i, registry) {
                        return {
                            label: registry.textContent,
                            value: registry.value,
                            class: 'js-reg-nav__option'
                        };
                    })
                };
            },
            viewAsGuest: function() {
                var $link = $('.gr_view_as_guest_link');

                return {
                    text: $link.text(),
                    href: $link.attr('href') || '#'
                };
            },
            chooseGifts: function() {
                var $chooseGifts = $('.gift_registry_manage_WWCM');

                $chooseGifts.children('div').each(function() {
                    var $content = $(this);

                    $content[0].innerHTML = $content[0].innerHTML.replace(/<br>/ig, ' ');
                });

                return $chooseGifts;
            },
            beginRegistry: function() {
                return $('.begin_creating_your_reg').find('.button').addClass('c-button c--primary c--full-width u-margin-bottom-md');
            },
            deleteRegistry: function() {
                return $('.gr_delete_link').addClass('c-arrange__item c-button c--outline c--small c--full-width');
            },
            itemsForm: function() {
                var $form = $('#giftRegistryQuantityForm');
                if ($form.length) {
                    return {
                        form: $form,
                        hiddenInputs: $form.find('[type="hidden"]'),
                        products: cartItemParser.parseWishlistItem($form.find('.GRProductsInView tbody tr'), true),
                        itemClass: ''
                    };
                }

                return;
            }
        }
    };
});
