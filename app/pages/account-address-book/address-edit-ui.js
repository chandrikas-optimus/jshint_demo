define([
    '$',
    'pages/account-address-book/parsers/address-form-parser',
    'dust!pages/account-address-book/partials/address-form',

    'hijax',
    'global/utils',
    'global/utils/dummy-element',
    'components/sheet/sheet-ui',
    'components/reveal/reveal-ui'
], function(
    $,
    addressFormParser,
    addressFormTemplate,

    Hijax,
    Utils,
    DummyElement,
    Sheet,
    Reveal
) {

    var _decorateValidation = function() {
        Utils.decorateErrorsAlert();
        Utils.decorateFieldErrors();
    };

    var _initAddressFormModal = function() {
        var $addressSheet = $('.js-address-form-sheet');
        var hijax = new Hijax();
        var sheet = Sheet.init($addressSheet, {
            close: function() {
                // Remove desktop dialog
                $('.gwt-DialogBox, .gwt-PopupPanelGlass').remove();
            }
        });

        var addressModalCallback = function() {
            var $addressModal = $('#editAddressModal');
            $addressModal.prop('hidden', true);
            $('.gwt-PopupPanelGlass').prop('hidden', true);

            // Parse form if it has been (re)generated
            if ($addressModal.length) {
                var addressFormData = addressFormParser.parse($addressModal);

                sheet.setTitle(addressFormData.title);
                sheet.setBody('');

                addressFormTemplate(addressFormData.content, function(err, html) {
                    sheet.setBody(html);
                    DummyElement.replaceAllSubstitutes($addressSheet);
                    Reveal.init($addressSheet.find('.c-reveal'));

                    // Close modal on Cancel button click
                    $addressSheet.find('.js-address-submit-button').on('click', _decorateValidation);

                    // Close modal on Cancel button click
                    $addressSheet.find('.js-address-cancel-button').on('click', function(e) {
                        sheet.close();
                    });
                });
            }

            sheet.open();
        };

        // Open modal on Add or Edit buttons click
        $('body').on('click', '.js-add-address, .js-edit-address', function() {
            window.setTimeout(addressModalCallback);
        });

        // Close modal upon successful address save
        hijax.set(
            'address-update-success',
            function(url) {
                return /AddressAdd|AddressUpdate/.test(url);
            }, {
                complete: function(data, xhr) {
                    if (data && data.success === 'true') {
                        sheet.close();
                    }
                }
            }
        );
    };

    var addressEditUI = function() {
        _initAddressFormModal();
    };

    return addressEditUI;
});
