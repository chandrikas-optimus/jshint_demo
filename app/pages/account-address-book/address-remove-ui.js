define([
    '$',
    'pages/account-address-book/parsers/address-remove-parser',
    'dust!pages/account-address-book/partials/address-remove',

    'hijax',
    'global/utils/dummy-element',
    'components/sheet/sheet-ui'
], function(
    $,
    addressRemoveParser,
    addressRemoveTemplate,

    Hijax,
    DummyElement,
    Sheet
) {
    var _initRemoveConfirmationModal = function() {
        var $removeSheet = $('.js-address-remove-sheet');
        var hijax = new Hijax();
        var sheet = Sheet.init($removeSheet, {
            close: function() {
                // Remove desktop dialog
                $('#gwt-removeConfirmDlog-content_modal, .gwt-PopupPanelGlass').remove();
            }
        });

        var removeModalCallback = function() {
            var $removeModal = $('#gwt-removeConfirmDlog-content_modal');
            $removeModal.prop('hidden', true);
            $('.gwt-PopupPanelGlass').prop('hidden', true);

            if ($removeModal.length) {
                var addressRemoveData = addressRemoveParser.parse($removeModal);

                sheet.setTitle(addressRemoveData.title);

                addressRemoveTemplate(addressRemoveData.content, function(err, html) {
                    sheet.setBody(html);
                    DummyElement.replaceAllSubstitutes($removeSheet);

                    // Close modal on No button click
                    $removeSheet.find('.js-address-remove-cancel-button').on('click', function(e) {
                        sheet.close();
                    });
                });
            }

            sheet.open();
        };

        // Open modal on Add or Edit buttons click
        $('body').on('click', '.js-remove-address', function() {
            window.setTimeout(removeModalCallback);
        });

        // Close modal upon successful address removal
        hijax.set(
            'address-update-success',
            function(url) {
                return /AddressDelete/.test(url);
            }, {
                beforeSend: function(data, xhr) {
                    // Disable YES button to indicate progress
                    $removeSheet.find('.js-address-remove-confirm-button').prop('disabled', true);
                },
                complete: function(data, xhr) {
                    if (data && data.success === 'true') {
                        sheet.close();
                    }
                }
            }
        );

    };

    var addressEditUI = function() {
        _initRemoveConfirmationModal();
    };

    return addressEditUI;
});
