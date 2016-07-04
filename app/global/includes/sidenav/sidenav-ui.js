define(['$', 'components/sheet/sheet-ui'], function($, Sheet) {
    var init = function() {
        var $sheet = $('.js-sidebox-nav');
        var sheet = Sheet.init($sheet);

        $('.js-customer-service-navigation-button').on('click', function() {
            sheet.open();
        });
    };

    return {
        init: init
    };
});
