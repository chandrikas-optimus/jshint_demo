define([
    '$'
], function($) {
    var parse = function($container) {
        return $container.find('.on, a').map(function(_, filter) {
            var $filter = $(filter);

            return {
                content: $filter.text(),
                stackItemClass: 'c--no-space u-border-gray  u-padding-start-sm u-padding-right js-sort-filter',
                class: 'c--default-fonts',
                suffix: {
                    checkRadio: {
                        class: 'c--grey c--no-space',
                        type: 'radio',
                        name: 'sort-filters',
                        checked: $filter.hasClass('on'),
                        href: $filter.attr('href')
                    }
                }
            };
        });
    };

    return {
        parse: parse
    };
});
