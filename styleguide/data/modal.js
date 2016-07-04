define([
    '$'
], function ($) {

    // var sheetHeaderContent = 'Modal Component';
    var $sheetBodyContent = $('<div>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis assumenda praesentium itaque saepe voluptatem magnam harum omnis. Alias facere explicabo, dolores, soluta magni laborum, provident velit praesentium inventore voluptatem saepe!</div>');

    return [
        {
            // headerContent: sheetHeaderContent,
            // bodyClass: 'c--bleed',
            bodyContent: $sheetBodyContent,
            footerContent: ''
        },
        {
            // headerContent: sheetHeaderContent,
            // bodyClass: 'c--bleed',
            bodyContent: $sheetBodyContent,
            footerContent: '',
            background: 'http://www.chasing-fireflies.com/wcsstore/images/ChasingFireflies/_wcm/wccm_EmailSubScribe.jpg'
        }
    ];
});
