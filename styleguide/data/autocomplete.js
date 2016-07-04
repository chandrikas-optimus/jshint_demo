define(['$'], function ($) {

    return [
        {
            suggestions: [
                { content: $('<b>princess</b>') },
                { content: $('<span><b>princess</b> dress<span>') },
                { content: $('<span>design your own <b>princess</b> dress<span>') }
            ],
            products: [
                {
                    'image': {
                        'src': 'http://chasingfireflies.resultspage.com/thumb.php?base=http://chasingfireflies.scene7.com/is/image/ChasingFireflies/T_WithoutZoom?$&sizeType=SLI_MiniThumb&mfpart=52407&sale=&defAtt=main',
                        'alt': 'Something about princesses'
                    },
                    'heading': $('<span>design a <b>princess</b> gown &amp; accessory set</span>'),
                    'price': {
                        'salePrice': '$149.00',
                        'retailPrice': '$175.00'
                    }
                }, {
                    'image': {
                        'src': 'http://chasingfireflies.resultspage.com/thumb.php?base=http://chasingfireflies.scene7.com/is/image/ChasingFireflies/T_WithoutZoom?$&sizeType=SLI_MiniThumb&mfpart=52945&sale=&defAtt=main',
                        'alt': 'Something about princesses'
                    },
                    'heading': $('<span>Easter Basket & Personalized <b>Princess</b> Liner</span>'),
                    'price': {
                        'retailPrice': '$149.00'
                    }
                }
            ]
        }
    ];
});
