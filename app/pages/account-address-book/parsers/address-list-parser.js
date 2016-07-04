define([
    '$',
    'global/utils/dummy-element',
    'removeStyle'
], function($, DummyElement) {

    var _parseItems = function($items) {
        return $items.map(function(_, item) {
            var $item = $(item);

            var $itemContent = $item.find('.gwt-addrbk-addrpanel');
            var $itemTitle = $itemContent.find('.gwt-addr-disp').first();
            var $itemProps = $itemContent.find('.gwt-addr-disp').not(':first-child');

            // Tag
            var $itemTagLine = $item.find('.gwt-addrbk-billshipindpanel').remove();
            var $itemTag = $itemTagLine.find('.gwt-addrbk-billshipind.gwt-addrbk-billshipind-on').removeStyle(true);

            // Buttons
            var $itemButtonsPanel = $item.find('.gwt-addrbk-addritem-btnpanel');
            var $editButton = $itemButtonsPanel.find('button.button').first();
            var $removeButton = $itemButtonsPanel.find('button.button').last();

            return {
                tag: $itemTag,
                title: $itemTitle.text(),
                address: $itemProps,
                editButton: DummyElement.getSubstitute($editButton),
                removeButton: DummyElement.getSubstitute($removeButton)
            };
        });
    };


    var parse = function($context) {
        var $items = $context.find('.gwt-addrbk-addritempanel');
        var $addButton = $context.find('.gwt-addrbk-btnpanel button.button');

        return {
            items: _parseItems($items),
            addbutton: DummyElement.getSubstitute($addButton)
        };
    };

    return {
        parse: parse
    };
});
