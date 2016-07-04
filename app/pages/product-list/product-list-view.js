define([
    '$',
    'global/baseView',
    'dust!pages/product-list/product-list',
    'dust!pages/product-list/partials/filter',
    'pages/product-list/parsers/product-list-filter-parser',
    'components/breadcrumbs/parsers/breadcrumbs-parser',
    'pages/product-list/parsers/tile-parser',
    'pages/product-list/parsers/sort-by-sheet-parser',
    'pages/product-list/parsers/pagination-parser'
],
function($,
    BaseView,
    template,
    FilterTemplate,
    productListFilterParser,
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
            templateName: 'product-list',

            isSearchPage: function() {
                // CF-846: PLPs were being treated like search pages
                // If the category menu has a title inside it, it isn't the search page
                var hasProductSearch = !!$('.area-ProductSearch').length;
                var hasCategoryHeading = !!$('#sli_catmenu .heading').length;
                var hasSearchResultHeading = /search results/i.test($('#sli_catmenu + .heading').text());
                return hasProductSearch || (!hasCategoryHeading && hasSearchResultHeading);
            },
            bannerTop: function() {
                return $('#bannerTop');
            },
            // TODO: verify
            isClearance: function() {
                return /sale-clearance/.test(window.location.href);
            },
            breadcrumbs: function() {
                var $crumbs = $('#breadcrumbs_ul li').filter(function() {
                    return $(this).text().trim() !== '';
                });
                $('.sli_bct > .sli_left').not($('.sli_bct > .sli_left:has(a)')).map(function(_, breadcrumb) {
                    if (!!$(breadcrumb).text().trim()) {
                        $(breadcrumb).contents().wrap('<a>');
                    }
                });
                if ($crumbs.length === 0) {
                    $crumbs = $('.sli_bct > .sli_left a').parent();
                }

                return breadcrumbsParser.parse($crumbs, '');
            },
            breadcrumbsInitiallyHidden: function(context) {
                return context.breadcrumbs.length <= 1;
            },
            pageTitle: function() {
                // Taken from the left side menu
                // Note, HTML is lightly different for CF-233 and CF-241, “#leftNav .heading” should match both
                // First look for a selected subcategory
                var $title = $('#sli_catmenu li.selected');

                if (!$title.length) {
                    $title = $('#sli_bct > h1');
                }

                // If that didn't work, try to grab the category heading
                if (!$title.length) {
                    $title = $('#leftNav .heading');
                }

                // Last attempt
                if (!$title.length) {
                    $title = $('#sideBoxContent li.active');
                }

                return $title.last().text().toLowerCase();
            },
            searchResultsText: function(context) {
                // Only show this message for search results page
                if (context.isSearchPage) {
                    return $('#leftNav .message').text();
                }
            },
            sortby: function() {
                var $sort = $('.sli_sort');

                return sortBySheetParser.parse($sort);
            },
            activeSortFilter: function() {
                return $('.sli_sort .on').text();
            },
            numItems: function() {
                return $('.sli_bct_total_records').text();
            },
            hasFilterAndSort: function() {
                return !!$('.sli_facet_container').length && !!$('#sli_view_sort').length;
            },
            filter: function() {
                var $filters;

                var filterContent = productListFilterParser.parse($('.sli_facet_container > div'));
                new FilterTemplate({filterCategories: filterContent}, function(err, html) {
                    $filters = $(html);
                });

                return $filters;
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
                        return tileParser.parse($(this), !$('.priceLine').first().text().trim());
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
