define(['$', 'translator'],
    function($, translator) {


        var parse = function($filters) {
            var content = [];

            $filters.each(function(i, filterCategory) {
                var $filterCategory = $(filterCategory);
                var $resetLink = $filterCategory.find('.sli_reset').remove();
                var filterTitle = $filterCategory.find('.facetHeading').text();
                var $filtersContainer = $filterCategory.children('.sli_facets');

                var $viewMore = $filtersContainer.children('.sli_moreless').find('a')
                    .addClass('c-button c--plain c--brand c--plus u-text-weight-bold');
                if (/less/i.test($viewMore.text())) {
                    $viewMore
                        .removeClass('c--plus')
                        .addClass('c--minus');
                }

                content.push({
                    resetHref: $resetLink.attr('href'),
                    resetLinkText: $resetLink.text(),
                    filterTitle: filterTitle,
                    filterType: 'js-' + filterTitle.trim().replace(/ /g, '-'),
                    slider: $filterCategory.find('.sli_slider_container').children(),
                    filters: $filtersContainer.children(':not(.sli_moreless)').filter(':not([id*=slider])').map(function(j, filter) {
                        var $filter = $(filter);
                        var $filterLink = $filter.children('.sli_facetName').find('a');
                        var childFilters = $filter.find('.sli_facets.sli_children').children().map(function(k, childFilter) {
                            var $childFilter = $(childFilter);
                            var $filterLink = $childFilter.children('.sli_facetName').find('a');
                            return {
                                filterName: $filterLink.text(),
                                filterHref: $filterLink.attr('href'),
                                selected: $childFilter.is('.sli_selected')
                            };
                        });
                        return {
                            filterName: $filterLink.text(),
                            filterHref: $filterLink.attr('href'),
                            selected: $filter.is('.sli_selected'),
                            childFilters: childFilters
                        };
                    }),
                    viewMore: $viewMore
                });
            });

            // Remove the empty slider
            content = content.filter(function(item) {
                return (item.filters.length || item.slider.length);
            });

            return content;
        };

        return {
            parse: parse
        };
    });
