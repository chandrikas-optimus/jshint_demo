define([
    '$',
    'global/baseView',
    'dust!global/base',
    'translator',
    'components/breadcrumbs/parsers/breadcrumbs-parser'
],
function($, BaseView, baseTemplate, translator, breadcrumbParser) {
    var descript;

    var parseDetailsSection = function($section) {
        return {
            title: $section.find('.title').text(),
            data: $section.find('.gr-data').text(),
            href: $section.find('.gr_info_edit_link').attr('href')
        };
    };

    return {
        template: baseTemplate,
        extend: BaseView,
        preProcess: function(context) {
            if (BaseView.preProcess) {
                context = BaseView.preProcess(context);
            }

            $('[id*="gwt_giftregistry_item_display"] .JSON').addClass('x-skip').parent().addClass('x-skip');

            return context;
        },
        context: {
            templateName: 'registry-base',
            breadcrumbs: function() {
                return breadcrumbParser.parse($('#breadcrumbs_ul li'));
            },
            hiddenForms: function() {
                var $hiddenForms = $('form.hidden, #giftRegistryHomeViewForm, #gwt_gift_registry_create, #gift_registry_delete_message');
                return $hiddenForms.add($('#gwt_view_name').parent());
            },
            hiddenLabels: function() {
                return $('#mainContent').children('.nodisplay, [style*="display:none"]');
            },
            wishlistLink: function() {
                return $('#wishlist');
            },
            registryDetailsLabel: function() {
                return $('.gr-details-header').text();
            },
            pageTitle: function() {
                return $('.gr-inner-header').text();
            },
            eventDate: function() {
                return $('.gr-event-date');
            },
            countDown: function() {
                var $countDownContainer = $('<div class="u-text-weight-bold">');
                $countDownContainer.text($('.gr_count-down_text').text());
                return $countDownContainer;
            },
            detailsSectionTitle: function() {
                return $('.gr-details-header').text();
            },
            details: function() {
                var $privacyContainer = $('.registry-policy');
                return {
                    name: parseDetailsSection($('.registry-name')),
                    date: parseDetailsSection($('.registry-date')),
                    number: parseDetailsSection($('.registry-number')),
                    type: parseDetailsSection($('.registry-type')),
                    privacy: {
                        href: $privacyContainer.find('.gr_info_edit').remove().find('a').attr('href'),
                        data: $privacyContainer.text()
                    }
                };
            },
            shipTo: function() {
                var $shippingAddress = $('.selected-ship-address');
                return {
                    href: $shippingAddress.find('.gr_info_edit_link').attr('href'),
                    title: $shippingAddress.find('.title').text().toLowerCase(),
                    name: $shippingAddress.find('.gr-data')
                };
            },
            registrant: function() {
                var $registryInfo = $('.registry-info-address');
                return {
                    href: $registryInfo.find('.gr_info_edit_link').attr('href'),
                    title: $registryInfo.find('.GR-shipping-address').first().text(),
                    content: $registryInfo.find('.adr').first()
                };
            },
            coregistrant: function() {
                var $coRegistrantInfo = $('.coregistrant-info-address');
                var $coRegistrantContent = $coRegistrantInfo.find('.adr');

                return {
                    editHref: $coRegistrantInfo.find('.gr_info_edit_link').attr('href'),
                    title: $coRegistrantInfo.find('.GR-shipping-address').first().text(),
                    content: $coRegistrantContent,
                    deleteHref: $coRegistrantInfo.find('.gr_info_delete_link').attr('href')
                };
            },
            message: function() {
                var $messageContainer = $('.registry-message-to-guests-container, .registry-message-to-guests');
                var messageText = $messageContainer.find('.adr').text();



                return {
                    href: $messageContainer.find('.gr-info-delete').remove().find('a').attr('href'),
                    title: $messageContainer.find('.GR-shipping-address').text(),
                    content: messageText
                };
            },
            giftCard: function() {
                return $('#gwt_GR_GC_part_number');
            },
            socialLinks: function() {
                return $('#socialPlugins').addClass('js-social');
            },
            countMessage: function() {
                var $messageContainer = $('.gift_registry_items_count');
                if ($messageContainer.length) {
                    return $messageContainer.find('.gift_registry_items_count_number').remove().text()
                        + ' '
                        + $messageContainer.text();
                }
            },
            addItemsToCart: function() {
                // CF-724: Design feedback. Hardcoding text
                return $('#gift_registry_add_all_items_to_cart')
                    .addClass('c-button c--outline c--full-width u-margin-bottom-lg')
                    .text('Add Remaining Items to Bag');
            },
            continueShoppingButton: function() {
                return $('.contshop .primary').addClass('c-button c--outline c--full-width');
            },
            sort: function() {
                var $sortForm = $('#giftRegistryItemsForm');
                var $sortDropDown = $sortForm.find('#sortBy').remove();

                $sortDropDown.children('[value="NA"]').text('Default');

                return {
                    form: $sortForm,
                    data: $sortForm.find('.data'),
                    hiddenInputs: $sortForm.find('input[type="hidden"]'),
                    select: $sortDropDown,
                    id: $sortDropDown.attr('id')
                };
            },
        }
    };

});
