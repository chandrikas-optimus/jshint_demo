define([
    '$',
    'hijax',
    'global/utils/dummy-element',
    'pages/account-address-book/parsers/address-list-parser',
    'dust!pages/account-address-book/partials/address-list',
], function(
    $,
    Hijax,
    DummyElement,
    addressListParser,
    addressListTemplate
) {
    var _decorateAddressList = function() {
        var $addressList = $('.js-address-book-list');
        var $addressListSource = $('.js-address-book-list-source');
        var addressListData = addressListParser.parse($addressListSource);

        addressListTemplate(addressListData, function(err, html) {
            $addressList.html(html);
            DummyElement.replaceAllSubstitutes($addressList);
        });
    };

    var _bindAddressListTransform = function() {
        var hijax = new Hijax();

        hijax.set(
            'address-book-list',
            function(url) {
                return /GetAddressBookView/.test(url);
            }, {
                complete: function(data, xhr) {
                    // Note: cannot use dust partial here, for desktop event listeneres will be lost
                    _decorateAddressList();
                }
            }
        );
    };

    var addressListUI = function() {
        _bindAddressListTransform();
    };

    return addressListUI;
});
