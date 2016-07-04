define([
    '$',
    'global/includes/sidenav/sidenav-ui',
    'global/includes/sizechart/size-chart-parser'
], function(
    $,
    sideNavUI,
    Sizechart
) {

    var customerServiceSizeChartUI = function() {
        sideNavUI.init();

        // ajax the iframe
        var $sizechartIframe = $('.js-sizechart-frame').remove();
        Sizechart.showSizeChart($sizechartIframe.attr('src'));

    };

    return customerServiceSizeChartUI;
});
