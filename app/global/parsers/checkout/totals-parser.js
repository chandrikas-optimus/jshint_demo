define([
    '$'
], function($) {


    var _parse = function($totalTable) {
        return {
            modifierClass: 'c--bordered u-margin-bottom-sm',
            ledgerEntries: $totalTable.find('tr').map(function(i, row) {
                var $row = $(row);
                var $cells = $row.children();
                var description = $cells.first().text().trim();
                if ($row.hasClass('promoRow')) {
                    return {
                        buttonClass: 'js-promo-tooltip-button',
                        entryModifierClass: 'u-text-size-small',
                        description: $row.find('.promoColor').remove().text().trim(),
                        tooltipContent: $row.find('[id*="PromoDesc"]').remove().removeClass(),
                        number: $row.find('.totals.last, .amount').text().trim(),
                        tooltipTitle: 'Promotion'
                    };
                }

                // CF-646: Hide special handling charges
                if (/Special Handling Charges/.test(description) && $cells.last().text().trim() === '$0.00') {
                    return;
                }

                if (description !== '') {
                    return {
                        description: description,
                        number: $cells.last().text(),
                        entryModifierClass: $row.is(':last-of-type') ? 'c--total c--bordered' : ''
                    };
                }
            })
        };
    };

    return {
        parse: _parse
    };
});
