define(['$'], function($) {
    var parse = function($container, previousLevel) {
        return $container.map(function(_, item) {
            var $item = $(item);
            var $nestedList = $item.find('> ul').children().length ? $item.find('> ul') : '';
            var currentLevelText = $item.find('> a').trimmedText();
            var $nestedListItems;

            if ($nestedList.length && previousLevel === undefined) {
                // Adding an All xxx link for first level navigation
                $nestedListItems = $.merge($item.clone().find('> ul').remove().end()
                    .find('div[id*="name"]').text('all ' + $item.find('div[id*="name"]').text()).end(), $nestedList.children());
            } else if ($nestedList.length) {
                $nestedListItems = $nestedList.children();
            }

            return {
                content: currentLevelText,
                href: $nestedList.length === 0 ? $item.find('a').attr('href') : '',
                class: $nestedList.length ? 'navitron__next-pane' : '',
                suffix: $nestedList.length ? 'arrow-forward' : '',
                nestedList: $nestedList.length ? {
                    items: parse($nestedListItems, currentLevelText),
                    currentLevel: currentLevelText
                } : ''
            };
        });
    };

    return {
        parse: parse
    };
});
