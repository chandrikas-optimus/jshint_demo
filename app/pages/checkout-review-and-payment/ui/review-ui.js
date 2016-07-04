define([
    '$',
    'global/ui/cart-item-ui',
    'external!global/utils',
    'components/sheet/sheet-ui',
    'global/ui/address-modal-ui'
], function($, cartItemUI, utils, sheet, AddressModal) {

    var desktopOverridden = false;
    var overrideInterval;


    var _overrideDesktop = function() {
        if (!desktopOverridden && window.showAddressSelectModal) {
            var _showSelectModal = window.showAddressSelectModal;

            desktopOverridden = true;
            clearInterval(overrideInterval);

            window.showAddressSelectModal = function() {
                _showSelectModal.apply(this, arguments);
                AddressModal.showModal($('.ok-cancel-dlog'), true);
            };
        }
    };

    var _resetPlaceOrderButton = function() {
        $('.js-place-order .primary').addClass('c-button c--full-width c--primary').removeAttr('disabled');
    };

    var _initPlugins = function() {
        var title = $('.js-menu-title').first().text();
        var $shippingPinny = $('.js-shipping-details-pinny');


        AddressModal.initSheet();

        AddressModal.addCloseCallback(_resetPlaceOrderButton);

        sheet.init($shippingPinny);

        $('.js-pinny-button').on('click', function() {
            $shippingPinny.pinny('open');
        });
    };


    var _nodeInserted = function() {
        if (event.animationName === 'modalAdded') {
            var $editAddressModal = $('#editAddressModal, #addAddressModal');

            _resetPlaceOrderButton();

            if ($editAddressModal.length) {
                AddressModal.showModal($editAddressModal);
            }
        }
    };

    var _bindEvents = function() {
        $('.js-shipping-option').on('click', function(e) {
            var $option = $(this);
            var $select = $option.closest('.js-option-container').find('select');

            $select.val($option.attr('data-value'));
            $select[0].dispatchEvent(new CustomEvent('change'));
        });

        document.addEventListener('animationStart', _nodeInserted);
        document.addEventListener('webkitAnimationStart', _nodeInserted);
    };


    var _setUpSection = function() {
        cartItemUI();

        _bindEvents();
        _initPlugins();

        overrideInterval = setInterval(_overrideDesktop, 500);

    };

    return {
        setUpSection: _setUpSection
    };
});
