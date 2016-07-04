define([
    '$',
    'pages/customer-service-size-chart-iframe/parsers/scrollertable-parser',

    // Items does not require instance
    'dust!components/table-scroller/table-scroller',
    'dust!components/accordion/accordion',
    'dust!pages/customer-service-size-chart-iframe/partials/accordion',
    'dust!pages/customer-service-size-chart-iframe/partials/table-scroller'
],
function($, ScrollerTable) {


    var parse = function($context) {
        return {
            tabs: function() {
                var accordion = $context.find('.menu > li').map(function(_, item) {
                    var $item = $(item);

                    // ScrollerTable.parse($('div.' + $item.attr('id')).find('table'));
                    var tableContent = $context.find('div.' + $item.attr('id')).find('table').map(function(_, table) {
                        var $table = $(table);
                        return {
                            contentTemplate: 'pages/customer-service-size-chart-iframe/partials/table-scroller',
                            data: ScrollerTable.parse($table)
                        };
                    });
                    return {
                        sectionTitle: $item.text(),
                        content: tableContent
                    };
                });

                var tabs = $context.find('.topNav > li').map(function(_, item) {
                    var $item = $(item);
                    var $link = $item.find('a');
                    var isCurrent = $item.hasClass('highlight');

                    // Style the how to measure heading

                    return {
                        title: $link.text(),
                        dataHref: $link.attr('href'),

                        labelClass: isCurrent ? 'c--current' : '',
                        labelId: isCurrent ? 'current' : '',
                        content: isCurrent ? {
                            howToMeasureHeader: $context.find('#pCont').find('p').first().next().remove().text(),
                            howToMeasure: $context.find('#pCont').find('p').first().nextAll(),
                            header: $context.find('#pCont').find('p').first(),
                            items: accordion
                        } : '',
                        contentTemplate: 'pages/customer-service-size-chart-iframe/partials/accordion'
                    };
                });
                return {
                    tabs: tabs,
                    controlsClass: 'c--row-reverse',
                };
            }
        };
    };

    return {
        parse: parse
    };
});
