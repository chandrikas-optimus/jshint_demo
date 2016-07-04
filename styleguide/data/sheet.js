define([
    '$'
], function ($) {

    var sheetHeaderContent = 'Sheet Component';
    var $sheetBodyContent = $('<div>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis assumenda praesentium itaque saepe voluptatem magnam harum omnis. Alias facere explicabo, dolores, soluta magni laborum, provident velit praesentium inventore voluptatem saepe!</div>');

    return [
        {
            headerContent: sheetHeaderContent,
            // bodyClass: 'c--bleed',
            bodyContent: $sheetBodyContent,
            footerContent: ''
        }
    ];
});
