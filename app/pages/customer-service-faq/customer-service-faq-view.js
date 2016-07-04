define([
    '$',
    'global/baseView',
    'global/includes/sidenav/sidenav-context',
    'global/parsers/shipping-and-handling-parser',
    'components/breadcrumbs/parsers/breadcrumbs-parser',
    'dust!pages/customer-service-faq/customer-service-faq',
    'dust!pages/customer-service-faq/partials/question-content'
],
function(
    $,
    BaseView,
    sideNav,
    scrollerTableParser,
    breadcrumbsParser,
    template
) {
    var _scrollerTableParser = function($table) {
        var fixedTableHeader = $table.find('tr > td:nth-child(1)').slice(1).map(function(_, row) {
            var $row = $(row);
            return {
                rowData: [{
                    content: $.trim($row.text())
                }]
            };
        });
        var scrollerTableHeader = $table.find('tr').first().find('td').slice(1).map(function(_, row) {
            var $row = $(row);
            return {
                title: $.trim($row.text())
            };
        });

        var scrollerTableRows = $table.find('tr').slice(1).map(function(_, row) {
            var $row = $(row);
            var $tableData = $row.find('td').slice(1);
            var $processedData = $tableData.map(function(_, data) {
                var $data = $(data);
                return {
                    content: $.trim($data.text())
                };
            });
            return {
                rowData: $processedData
            };
        });

        return {
            table: {
                items: [{
                    headerRows: [{
                        rowData: [
                            {
                                title: $.trim($table.find('tr > td').first().text())
                            }
                        ]
                    }],
                    tableRows: fixedTableHeader
                }]
            },
            scroller: {
                items: [{
                    headerRows: [{
                        rowData: scrollerTableHeader
                    }],
                    tableRows: scrollerTableRows
                }]
            }
        };
    };

    return {
        template: template,
        extend: BaseView,
        includes: {
            sidenav: sideNav
        },

        context: {
            templateName: 'customer-service-faq',
            pageTitle: function() {
                return $('#standard h3').first().text() || 'What\'s the best month to chase fireflies?';
            },
            breadcrumbs: function() {
                var $crumbs = $('.breadcrumbs li');

                // Hard coding since the current breadcrumbs is empty and there isn't other way to get this other than document.title
                return breadcrumbsParser.parse($crumbs, ($('title').last().text() || 'Chasing Fireflies FAQ'));
            },
            textContent: function() {
                return $('#standard p').first();
            },
            questions: function() {
                var $container = $('#standard');
                return {
                    manualInit: true,
                    items: $container.map(function(_, container) {
                        var $container = $(container);

                        // Remove items that will not be included in accordion processing
                        $container.find('h1').first().remove();
                        $container.find('h3').first().remove();
                        $container.find('p').first().remove();
                        $container.find('ul').first().remove();
                        $container.find('ol').addClass('c-ordered-list');
                        $container.find('ol li').addClass('c-ordered-list__item u-margin-bottom-md');
                        return $container.find('h3:not(.shipInf)').map(function(_, element) {
                            var $element = $(element);

                            var $beforeTable = {};
                            var $afterTable = {};
                            var $content = $element.nextUntil('h3:not(.shipInf)');
                            var $table = $content.filter('table');
                            var hasTable = ($table.length > 0);
                            if (hasTable) {
                                $beforeTable = $element.nextUntil('table');
                                $afterTable = $table.nextUntil('h3:not(.shipInf)');
                            } else {
                                $beforeTable = $content;
                            }

                            return {
                                sectionTitle: $element.text(),
                                filterType: $element.find('a').attr('name'),
                                content: {
                                    contentTemplate: 'pages/customer-service-faq/partials/question-content',
                                    data: {
                                        beforeTable: $beforeTable,
                                        table: (($table.find('tr > th:nth-child(1):contains("ORDER TOTAL")').length > 0) && hasTable) ? scrollerTableParser.scrollerTableParser($table, true) : [],
                                        afterTable: $afterTable.length ? $afterTable : false,
                                        scroller: (($table.find('tr > td:nth-child(1):contains("Method:")').length > 0) && hasTable) ? _scrollerTableParser($table) : []
                                    }
                                }
                            };
                        });
                    })[0]
                };
            }
        }

        /**
         * If you wish to override preProcess/postProcess in this view, have a look at the documentation:
         * http://adaptivejs.mobify.com/v1.0/docs/views
         */
    };
});
