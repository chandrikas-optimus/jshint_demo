define([
    '$',
    'components/sheet/sheet-ui',
    'bellows',
    'pages/customer-service-gift-certificate/product-tiles-ui',
    'pages/product-list/parsers/pagination-parser',
    'dust!components/pagination/pagination'
], function(
    $,
    Sheet,
    bellows,
    productTilesUI,
    paginationParser,
    paginationTemplate
) {

    if (Adaptive.evaluatedContext.templateName !== 'customer-service-gift-certificate') {
        return; // exit early
    }

    var updatePagination = function($container) {
        var data = paginationParser.parse($container);

        if (!data) {
            $('.js-pagination').empty();
        } else {
            paginationTemplate(data, function(err, html) {
                $('.js-pagination').html(html);
            });
        }
    };

    var initPagination = function() {
        var $desktopDropdown = $('#topItemsPerPage');

        $('.js-view-all').on('click', function() {
            // Select 'view all'
            $desktopDropdown
                .val(0)
                .trigger('change');
        });
        $('.js-view-fewer').on('click', function() {
            // Select 12 items per page
            $desktopDropdown[0].selectedIndex = 1;
            $desktopDropdown.trigger('change');
        });
    };


    var customerServiceGiftCertificateUI = function() {

        productTilesUI();

        // This is for Websphere
        initPagination();
    };

    return customerServiceGiftCertificateUI;
});
