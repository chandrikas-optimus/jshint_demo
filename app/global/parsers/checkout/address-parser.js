define([
    '$'
], function($) {


    var _parse = function($addressContainer, includeEdit) {
        var $name = $addressContainer.find('.fn');
        var $addresslines = $addressContainer.find('.street-address');
        var $street = $addresslines.first();
        var $apt = $addresslines.length > 1 ? $addresslines.last() : '';
        var $editButton = $addressContainer.find('.button').first();

        return {
            container: $addressContainer,
            sectionTitle: $addressContainer.find('h3').text(),
            name: $name.first().text(),
            company: $name.length > 1 ? $name.last().text() : '',
            street: $street.text(),
            apt: $apt ? $apt.text() : '',
            city: $addressContainer.find('.locality').text(),
            state: $addressContainer.find('.region').text(),
            postalCode: $addressContainer.find('.postal-code').text(),
            country: $addressContainer.find('.country').text(),
            phoneNumber: $addressContainer.find('.phone-number').text(),
            editButton: includeEdit ? {
                text: $editButton.text(),
                onclick: $editButton.attr('onclick')
            } : ''
        };
    };

    return {
        parse: _parse
    };
});
