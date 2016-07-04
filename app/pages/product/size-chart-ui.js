define([
    '$',
    'components/sheet/sheet-ui',
    'global/includes/sizechart/size-chart-parser'
], function(
    $,
    Sheet,
    SizeChartParser
) {
    var init = function() {
        // Bind Size Charts handlers
        var $sheet = $('.js-sizing-chart');
        var sheet = Sheet.init($sheet, {disableScrollTop: true});
        $('.js-sizing-chart-link').on('click', function() {
            var $link = $(this);
            // Trigger the size chart button so client script can do the XHR request
            sheet.setBody('');

            // CF-568: Size chart modal title should be the same as whatever the user clicked
            sheet.setTitle($link.text());

            var $sizeChartContent = $(this).parents('.js-size-chart-link-container').find('.js-size-chart-hidden-content').clone();

            if (!$sizeChartContent.children().length) {
                // Show the default size chart if no specific one is available
                sheet.setBody($('<span id="js-size-chart-content"></span>'));

                var $sizeChartAnchor = $('.gwt-Anchor:contains("size chart")').first();
                if ($sizeChartAnchor.length) {
                    $sizeChartAnchor.triggerGWT('click');
                } else {
                    SizeChartParser.showSizeChart('/wcsstore/images/ChasingFireflies/sizecharts/childrens2.html');
                }
            } else {
                sheet.setBody($sizeChartContent);
            }

            sheet.open();
        });
    };

    return {
        init: init
    };
});
