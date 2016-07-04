define([
    '$',
    'global/baseView',
    'dust!pages/customer-service-gift-certificate/customer-service-gift-certificate',
    'components/breadcrumbs/parsers/breadcrumbs-parser',
    'pages/product-list/parsers/tile-parser',
    'pages/product-list/parsers/sort-by-sheet-parser',
    'pages/product-list/parsers/pagination-parser'
],
function($,
    BaseView,
    template,
    breadcrumbsParser,
    tileParser,
    sortBySheetParser,
    paginationParser
) {

    return {
        template: template,
        extend: BaseView,

        preProcess: function(context) {
            var beforeBasePreProcess = function() {
                context.isSLI = $('#sli_resultsSection').length > 0;
                context.isWebsphere = $('#gwt_products_display').length > 0;

                // Doing it here before the inner script gets removed by Descript
                context.desktopWebsphereProducts = $('#gwt_products_display').remove();
            };

            var afterBasePreProcess = function() {
            };

            if (BaseView.preProcess) {
                beforeBasePreProcess();
                context = BaseView.preProcess(context);
                afterBasePreProcess();
            }

            return context;
        },

        context: {
            templateName: 'customer-service-gift-certificate',

            breadcrumbs: function() {
                // Client's desktop doesn't have crumbs in place
                $('<li><a></a></li>').insertAfter($('#breadcrumbs_ul li'));
                var $crumbs = $('#breadcrumbs_ul li');
                if ($crumbs.length === 0) {
                    $crumbs = $('.sli_bct > .sli_left a').parent();
                }
                return breadcrumbsParser.parse($crumbs, ($('#sideBoxHeader h2 img').attr('alt') || 'Wish Certificates'));
            },
            pageTitle: function() {
                // Taken from the left side menu
                return $('#sideBoxHeader h2 img').attr('alt') || 'Wish Certificates';
            },
            products: function(context) {
                // for SLI version, initial products are already in source html
                // clicking on pagination causes ajax

                // for websphere, initial products are generated dynamically (from a json data wrapped in inline script)..
                // clicking on pagination does a page refresh.

                var $container = $('#sli_loadingDiv');
                var data = {
                    container: $container,
                    items: $container.find('.thumbItem').map(function() {
                        return tileParser.parse($(this), true);
                    })
                };

                if (context.isWebsphere) {
                    data.form = $('#changepageSizeForm');
                    data.hiddenInputs = data.form.find('input[type=hidden]').remove();
                    data.desktopDropdowns = $('[name="sortBy"], [name="pageSize"], [name="pageSizeBottom"]');
                }

                return data;
            },
            pagination: function(context) {
                if (context.isSLI) {
                    return paginationParser.parseSLI($('#sli_pagination_header .pageselectortext'));
                } else {
                    return paginationParser.parseWebsphere($('#topPaginationNavBar'));
                }
            }
        }

        /**
         * If you wish to override preProcess/postProcess in this view, have a look at the documentation:
         * http://adaptivejs.mobify.com/v1.0/docs/views
         */
    };
});
