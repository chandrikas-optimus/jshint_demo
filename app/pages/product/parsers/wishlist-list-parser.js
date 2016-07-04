define(['$'], function($) {

    var parse = function($select) {
        var $items = $select.find('option').not('[value="select"]').map(function(_, option) {
            var $option = $(option);

            return {
                content: $option.text(),
                stackItemClass: 'c--no-space u-padding-sides-sm js-wishlist-option',
                class: 'c--default-fonts',
                suffix: {
                    checkRadio: {
                        class: 'c--grey',
                        type: 'radio',
                        name: 'wishlist-list',
                        checked: $option.val() === $select.find('option:selected').val(),
                        value: $option.val()
                    }
                }
            };
        });

        return {
            class: 'u-margin-top-lg',
            items: $items
        };
    };

    return {
        parse: parse
    };
});
