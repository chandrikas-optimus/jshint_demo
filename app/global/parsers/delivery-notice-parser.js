define([
    '$',
    'translator'
],
function($, translator) {


    var _parse = function($shippingNotice) {
        var $note = $shippingNotice.find('strong').first().remove();
        return {
            note: $note.removeAttr('style'),
            tooltipContent: $shippingNotice.html(),
            deliveryRestrictions: translator.translate('delivery_restrictions')
        };
    };

    return {
        parse: _parse
    };
});
