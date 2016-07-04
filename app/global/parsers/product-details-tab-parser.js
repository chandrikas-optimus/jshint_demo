define([
    '$'
], function($, translator) {


    var _parse = function($container) {
        var $tabs = $container.find('.gwt-TabBarItem');
        var $tabPanels = $container.find('.pdp-single-tab-content');

        return {
            items: $tabs.map(function(i, tab) {
                var $content = $tabPanels.eq(i);

                if ($content.find('#pdpSizingChart').length) {
                    $content.find('span').addClass('u-text-weight-bold');
                }
                return {
                    sectionTitle: $(tab).text(),
                    content: $content
                };
            })
        };
    };

    return {
        parse: _parse
    };
});
