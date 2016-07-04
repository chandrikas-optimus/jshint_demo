define([
    '$',
    'global/utils/dummy-element'
], function($, DummyElement) {

    var _parseFields = function($context) {
        return $context.map(function(_, field) {
            var $field = $(field);
            var $input = $field.find('input');
            var $select = $field.find('select');

            // Style require asterisks
            $field.find('label .required').addClass('u-text-warning');

            return {
                label: DummyElement.getSubstitute($field.find('label')),
                input: DummyElement.getSubstitute($input),
                select: DummyElement.getSubstitute($select),
                isCheckRadio: $input.is('[type="checkbox"],[type="radio"]'),
                isSelect: $select.length > 0
            };
        });
    };

    var _parseForm = function($context) {
        var $addressType = $context.find('#addr_addressTypeSpot .gwt-CheckBox');
        var $errors = $context.find('#addrEditErrorPanel');
        var $fields = $context.find('.gwt-addr-dlog .spot');
        var $buttons = $context.find('.okCancelPanel .button');

        // Change input types
        $context.find('#addr_zipbox').attr('type', 'tel');
        $context.find('#addr_phone1box').attr('type', 'tel');
        $context.find('#addr_phone1box').attr('type', 'tel');
        $context.find('#addr_phone2box').attr('type', 'tel');

        return {
            errorsContainer: DummyElement.getSubstitute($errors),
            addressType: _parseFields($addressType),
            firstName: _parseFields($fields.filter('.AddrFNameSpot')),
            middleName: _parseFields($fields.filter('.AddrMNameSpot')),
            lastName: _parseFields($fields.filter('.AddrLNameSpot')),
            companyName: _parseFields($fields.filter('.AddrCompanySpot')),

            streetAddress: _parseFields($fields.filter('.addrStreet1Spot, .addrStreet2Spot, .addrStreet3Spot')),
            cityAddress: _parseFields($fields.filter('.addrCitySpot')),
            stateAddress: _parseFields($fields.filter('.addrStateSpot')),
            zipAddress: _parseFields($fields.filter('.addrZipSpot')),
            countryAddress: _parseFields($fields.filter('.addrCountrySpot')),

            dayPhone: _parseFields($fields.filter('.addrPhone1Spot')),
            eveningPhone: _parseFields($fields.filter('.addrPhone2Spot')),
            faxNumber: _parseFields($fields.filter('.addrFaxSpot')),

            submitButton: DummyElement.getSubstitute($buttons.filter('.primary')),
            cancelButton: DummyElement.getSubstitute($buttons.filter('.secondary'))
        };
    };

    var parse = function($context) {
        var $title = $context.find('.dialogTop .Caption');
        var $content = $context.find('.dialogContent');
        return {
            title: $title.text(),
            content: _parseForm($content)
        };
    };

    return {
        parse: parse
    };
});
