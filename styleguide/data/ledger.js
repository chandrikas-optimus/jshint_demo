define(['$'], function ($) {
    return [
        {
            modifierClass: '',
            ledgerEntries: [
                {
                    entryModifierClass: '',
                    description: 'SKU #',
                    number: '1337'
                },
                {
                    entryModifierClass: '',
                    description: 'Price',
                    number: '$13.37'
                }
            ]
        },
        {
            modifierClass: 'c--bordered',
            ledgerEntries: [
                {
                    entryModifierClass: '',
                    description: 'Subtotal',
                    number: '$13.37'
                },
                {
                    entryModifierClass: '',
                    description: 'Tax',
                    number: '$0.63'
                },
                {
                    entryModifierClass: 'c--total c--bordered',
                    description: 'Total',
                    number: '$14.00'
                }
            ]
        }
    ];
});
