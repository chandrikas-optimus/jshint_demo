define([
    '$',
    'external!global/utils',
    'global/utils/dom-operation-override',
    // Parsers
    'pages/checkout-multi-address/parsers/shipping-item-parser',
    // UI
    'global/ui/address-modal-ui',
    'global/ui/tooltip-ui',
    // Tmpl
    'dust!pages/checkout-multi-address/partials/shipping-item',
    'dust!components/accordion/accordion'
],
function(
    $,
    Utils,
    DomOverride,
    // Parser
    ShippingItemParser,
    // UI
    AddressModal,
    tooltipUI,
    // Tmpl
    ShippingItemTmpl,
    BellowsTmpl) {


    var checkoutMultiAddressDecorator = function() {
        $('.js-shipping-item').last().find('hr');
    };

    var buildCta = function() {
        var bindId = Utils.generateUid();
        var $originalButton = $('.gwt-pdp-hl-center')
                                    .attr('data-bind-click', bindId);

        var $continueButton = $('<button>', {
            class: 'js-bind c-button c--primary c--full-width',
            'data-bind-click': bindId,
            text: 'Continue'
        });

        $('.js-cta').append($continueButton);
    };

    var parseItemsTable = function() {
        var $shippingItems = $('.gwt-multiple-address-container').find('.gwt-multiple-address-row');
        var shippingItemsObj = {
            shippingItems: ShippingItemParser.parse($shippingItems)
        };

        var $shippingItemsContainer;

        new ShippingItemTmpl(shippingItemsObj, function(err, html) {
            $shippingItemsContainer = $(html);
        });

        $('.js-multiple-address-container').append($shippingItemsContainer);
        buildCta();

        Utils.replaceWithPrototypeElements('#gwt_order_item_product_json');

        checkoutMultiAddressDecorator();

        $('.js-loader').attr('hidden', 'true');
    };

    var bindClicks = function() {
        $('body').on('click', '.js-bind', function(e) {
            e.preventDefault();

            var $this = $(this);
            var bindId = $this.attr('data-bind-click');
            var $original = $('[data-bind-click="' + bindId + '"]').filter(function() {
                return !$(this).hasClass('js-bind');
            });

            $original[0].dispatchEvent(new CustomEvent('click'));
        });

    };


    var _transformModals = function() {
        var $modal = $(arguments[0]);

        AddressModal.showModal($modal);
    };

    var _addPersonalization = function() {
        var $personalization = $(this);
        var index = $personalization.parent().index('.gwt-multiple-address-row_pers');

        $personalization.find('#perz_label').remove();
        $('.js-personalization-text').eq(index).text($personalization.text());

    };


    var checkoutMultiAddressUI = function() {
        DomOverride.on('domAppend', '', parseItemsTable, '#gwt_order_item_product_json');
        DomOverride.on('domAppend', '.perz-text', _addPersonalization);
        DomOverride.on('domAppend', '#editAddressModal', _transformModals, '');
        DomOverride.on('domAppend', '#addAddressModal', _transformModals, '');

        bindClicks();
        AddressModal.initSheet();
        tooltipUI();
    };

    return checkoutMultiAddressUI;
});
