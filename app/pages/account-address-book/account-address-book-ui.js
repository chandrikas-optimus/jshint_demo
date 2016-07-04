define([
    '$',
    'pages/account-address-book/address-edit-ui',
    'pages/account-address-book/address-list-ui',
    'pages/account-address-book/address-remove-ui',
    'components/alert/alert-ui',
], function(
    $,
    addressEditUI,
    addressListUI,
    addressRemoveUI,
    Alert
) {

    var accountAddressBookUI = function() {
        Alert.init();
        addressEditUI();
        addressListUI();
        addressRemoveUI();
    };

    return accountAddressBookUI;
});
