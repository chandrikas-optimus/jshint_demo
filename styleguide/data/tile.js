define([
    '$'
], function ($) {


    return {
        items: [
            {
                img: '../img/placeholder-product.jpeg',
                tileTitle: 'Pixie Girl Swirly Ruffles Maxi Dress',
                exclusive: 'Exclusively Ours',
                price: {
                    priceSale: '15.00',
                    priceOriginal: '30.00'
                }
            },
            {
                img: '../img/placeholder-product.jpeg',
                tileTitle: 'Pixie Girl Swirly Ruffles Maxi Dress',
                error: 'This Product is No Longer Available',
                price: {
                    priceSale: '15.00',
                    priceOriginal: '30.00'
                }
            },
            {
                class: 'c--center',
                img: '../img/placeholder-product.jpeg',
                tileTitle: 'Dresses',
                isCLP: true,
                swatches: false,
                tileClasses: 'c--center',
                headingClasses: 'c--2'
            }
        ]
    };


});
