define([
    '$',
    'global/utils',
    'components/sheet/sheet-ui',
    'components/reveal/reveal-ui'
], function(
    $,
    Utils,
    Sheet,
    Reveal
) {
    var initCategorySheet = function() {
        var $sheet = $('.js-categories-sheet');
        var sheet = Sheet.init($sheet);

        $('.js-categories').on('click', function() {
            sheet.open();
        });
    };

    var categoryListUI = function() {
        // Add any scripts you would like to run on the accountInfo page only here
        initCategorySheet();
        Reveal.init($('.t-category-list__seo-copy'));
    };

    return categoryListUI;
});
