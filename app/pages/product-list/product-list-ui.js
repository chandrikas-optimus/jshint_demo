define([
    '$',
    'components/sheet/sheet-ui',
    'hijax',
    'bellows',
    'pages/product-list/product-tiles-ui',
    'dust!components/accordion/accordion',
    'pages/product-list/parsers/sort-by-list-parser',
    'dust!pages/product-list/partials/sort-by-list',
    'pages/product-list/parsers/pagination-parser',
    'dust!components/pagination/pagination',
    'pages/product-list/no-search-results-ui',
    'dust!pages/product-list/partials/inner-filter',
    'dust!pages/product-list/partials/filter',
    'dust!pages/product-list/partials/applied-filters',
    'pages/product-list/parsers/product-list-filter-parser',
    'dust!components/breadcrumbs/breadcrumbs',
    'components/breadcrumbs/parsers/breadcrumbs-parser'
], function(
    $,
    Sheet,
    Hijax,
    bellows,
    productTilesUI,
    accordionTemplate,
    sortByListParser,
    sortByListTemplate,
    paginationParser,
    paginationTemplate,
    noSearchResultsUI,
    InnerFilterTemplate,
    FilterTemplate,
    AppliedFiltersTemplate,
    productListFilterParser,
    breadcrumbsTemplate,
    breadcrumbsParser
) {

    if (Adaptive.evaluatedContext.templateName !== 'product-list') {
        return; // exit early
    }

    var closeFilterPinny = function() {
        var $filterPinny = $('.js-filters-sheet');
        if ($filterPinny.data('pinny')) {
            $filterPinny.pinny('close');
        }
    };

    var bindEvents = function() {
        $('body').on('click', '.js-filter-checkbox', function(e) {
            var $checkbox = $(this);

            // Pareent until will not work for multilevel items
            var $link = $checkbox.parent().parent().find('.js-filter-link');

            // Test to see if this is a url
            if (/^((http[s]?|ftp):\/)?\/?([^:\/\s]+)((\/\w+)*\/)([\w\-\.]+[^#?\s]+)(.*)?(#[\w\-]+)?$/.test($link.attr('href'))) {
                window.location = $link.attr('href');
            } else {
                eval($link.attr('href'));
            }

            closeFilterPinny();
        });
        $('body').on('click', '.js-filter-link, .js-filter-reset', function(e) {
            closeFilterPinny();
        });
    };

    var initSortBy = function() {
        var $sheet = $('.js-sort-by-sheet');
        var sheet = Sheet.init($sheet);

        $('.js-open-sort-by').on('click', function() {
            sheet.open();
        });

        $sheet.on('click', '.js-save-sort-by', function() {
            var $checkedInputHref = $sheet.find('.js-sort-by-filters input:checked').data('href');

            sheet.close();

            if ($checkedInputHref !== undefined) {
                window.location.href = $checkedInputHref;
            }
        });

        $sheet.on('click', '.js-sort-filter', function() {
            $(this).find('input').prop('checked', true);
        });

        $sheet.on('click', '.js-cancel-sort-by', function() {
            $('.js-sort-by-filters li:contains("' + $('.js-active-sort-filter').text() + '")').find('input').prop('checked', true);
        });
    };

    var updateSortLinks = function($sortFilters) {
        var sortByData = {
            filters: sortByListParser.parse($sortFilters)
        };

        $('.js-active-sort-filter').text($sortFilters.find('.on').text());

        sortByListTemplate(sortByData, function(_, out) {
            $('.js-sort-by-sheet .pinny__content *').not('.pinny__spacer').remove();
            $(out).prependTo('.js-sort-by-sheet .pinny__content');
        });
    };


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

    var updateHeader = function($container) {
        var $heading = $container.find('.sli_bct_search_results');
        var $numItems = $container.find('.sli_bct_total_records');

        $heading = $heading.length ? $heading : $container.filter('.sli_bct_search_results');
        $numItems = $numItems.length ? $numItems : $container.filter('.sli_bct_total_records');

        $('.js-page-header').empty();
        $('<div>' + $heading.parentText() +
        '<div><em class="u-text-transform-initial">' + $heading.find('.sli_bct_keyword').text() +
        '</em></div></div>').appendTo($('.js-page-header'));
    };

    var updateSearchResultsText = function($numResults) {
        if ($numResults.length && Adaptive.evaluatedContext.isSearchPage) {
            $('.js-search-results-text').text($numResults.text());
            $('.js-search-results-text').show();
        } else {
            $('.js-search-results-text').hide();
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

    var updateFilter = function($newFilter) {
        var filterContent = productListFilterParser.parse($newFilter);
        var $filterBody = $('.js-filter-body');
        var $filters = $('.js-filter-section');
        var openFilters = $('.js-filter-section.bellows--is-open').map(function(i, filter) {
            return $(filter).attr('id');
        });

        new FilterTemplate({filterCategories: filterContent}, function(err, html) {
            $filterBody.html(html);
            // Re-open any filters that were open before.
            $.each(openFilters, function(i, openName) {
                $filterBody.find('#' + openName).addClass('bellows--is-open');
            });
            $('.js-filters-bellows').bellows();
            bindEvents();
        });
    };

    var updateFilterCount = function($filterCount) {
        var count = $filterCount.text();
        if (count) {
            $('.js-num-items').text(count + ' items');
        }
    };

    var updateAppliedFilters = function($content) {
        var $appliedFiltersContainer = $('.js-applied-filters');
        var templateContent = $content.find('.sli_bct_category, .sli_browse_other').map(function(i, filter) {
            return {
                text: filter.textContent,
                removeHandler: $(filter).find('img').attr('onclick')
            };
        });

        new AppliedFiltersTemplate({appliedFilters: templateContent}, function(err, html) {
            $appliedFiltersContainer.html(html);
            $appliedFiltersContainer.removeAttr('hidden');
        });
    };

    var applyDefaultView = function() {
        if (Adaptive.evaluatedContext.isSearchPage) {
            // We reached a search page
            if (!window.location.hash.include('&view=grid')) {
                // Make default grid view
                window.location.hash = window.location.hash + '&view=grid';
            }
        }
    };

    var initFilters = function() {
        var $filterPinny = $('.js-filters-sheet');
        Sheet.init($filterPinny);
        $('.js-filter-bellows').bellows();

        $('.js-open-filters').on('click', function(e) {
            $filterPinny.pinny('open');
        });
    };

    var initPlugins = function() {
        initFilters();
        initSortBy();
    };

    var updateAndShowBreadcrumbs = function($content) {
        var $home = $content.filter('a').first()
            .wrap('<span>').parent();
        var $searchKeyword = $content.find('.sli_bct_keyword');

        var data = breadcrumbsParser.parse($home.add($searchKeyword), '');

        breadcrumbsTemplate({breadcrumbs: data}, function(err, html) {
            $('.js-breadcrumbs')
                .html(html)
                .prop('hidden', false);
        });
    };

    var overrideDesktop = function() {
        var _oldLoadContent = window.sli_loadContent;
        window.sli_loadContent = function() { // eslint-disable-line
            var location = arguments[1];
            var $content = $(arguments[0]);

            if (location === '#leftNav') {
                updateSearchResultsText($content.filter('.message'));
                updateFilter($content.filter('.sli_facet_container').children('div'));
                // updateHeader($.capitalize($content.filter('.heading').text(), true));
            } else if (location === '#sli_view_sort') {
                updateSortLinks($content.find('.sli_sort'));
            } else if (location === '#sli_bct_inner') {
                var $totalRecords = $content.find('.sli_bct_total_records');
                updateFilterCount($totalRecords.length ? $totalRecords : $content.filter('.sli_bct_total_records'));
                // updateAppliedFilters($content);
                if ($content.find('.sli_bct_search_results').length || $content.filter('.sli_bct_search_results').length) {
                    updateHeader($content);

                    // CF-320
                    if (Adaptive.evaluatedContext.breadcrumbsInitiallyHidden) {
                        updateAndShowBreadcrumbs($content);
                    }
                }
            } else if (location === '#sli_pagination_header') {
                updateFilterCount($content.find('.sli_bct_total_records'));
                updatePagination($content.filter('.pageselectortext'));
            }

            _oldLoadContent.apply(this, arguments);
        };
    };

    // Execute this outside productListUI, so it's set in time for some of the desktop scripts,
    // which run before productListUI will execute
    overrideDesktop();

    var productListUI = function() {
        bindEvents();
        applyDefaultView();
        // Add any scripts you would like to run on the productList page only here

        initPlugins();

        productTilesUI();
        noSearchResultsUI();

        // This is for Websphere
        initPagination();
    };

    return productListUI;
});
