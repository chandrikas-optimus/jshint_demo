define([
    '$',
    'external!global/utils'
], function($, Utils) {

    var _parseProductItemText = function($info) {
        var productItemText = $info.find('.gwt-multi-address-item-lbl').text();

        return productItemText.substr(productItemText.indexOf(':') + 1).replace(/^\s/, '');
    };

    var _parseProductOptions = function($info) {
        return $info.find('.gwt-multiple-address-component-panel-col1 .gwt-HTML').map(function(_, option) {
            return option.textContent;
        });
    };

    var _parse = function($item) {
        return $item.map(function(_, info) {
            var $info = $(info);

            var $personalizationInfo;

            if ($info.next('.gwt-multiple-address-row_pers').length) {
                $personalizationInfo = $('<span class="js-pers-text" />');
                var personalizationText = $info.next('.gwt-multiple-address-row_pers').first()
                                            .text().replace(/\:style\:/i, '').replace(/personalization\:/i, '');

                var details = personalizationText.split(',');

                $.each(details, function(i, text) {
                    $personalizationInfo.append($('<span>').text(text));
                });
            }

            var editId = Utils.generateUid();
            var addId = Utils.generateUid();
            var selectId = Utils.generateUid();
            var $editAddress = $info.find('.gwt-multiple-address-component-panel-col3 a')
                                .attr('data-bind-click', editId)
                                .clone();

            var $addAddress = $info.find('.gwt-multiple-address-component-panel-col4 a')
                                .attr('data-bind-click', addId)
                                .clone();

            var $select = $info.find('select')
                            .attr('data-replace-id', selectId)
                            .clone();

            var $inStock = $info.find('.gwt-multi-address-item-aval-lbl');
            var stockText = $inStock.text().split(':');

            // styling
            $editAddress.addClass('c-field__hint');
            $addAddress.addClass('c-button c--plain c--full-width c--brand c--plus u-text-weight-bold u-padding u--none');

            return {
                productName: $info.find('.gwt-multi-address-product-lbl').text(),
                productItem: _parseProductItemText($info),
                productOptions: _parseProductOptions($info),
                stock: {
                    inStock: /([0-9]{2}\/[0-9]{2}\/[0-9]{4})/i.test($inStock.text()) ? false : /in-stock/i.test($inStock.text()),
                    availabilityText: stockText[0] + ':',
                    text: stockText[1]
                },
                select: $select.addClass('js-needs-replace'),
                editAddress: $editAddress.addClass('js-bind'),
                addAddress: $addAddress.addClass('js-bind'),
                personalization: $personalizationInfo
            };
        });
    };

    return {
        parse: _parse
    };
});
