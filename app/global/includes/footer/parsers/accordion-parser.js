define(['$'], function($) {

    var _parseStack = function($list) {
        if ($list.is('ul')) {
            $list.addClass('c-stack');
            $list.find('li').addClass('c-stack__item c--no-space');
        }

        $list.find('li').each(function() {
            var $listItem = $(this);

            if ($listItem.has('a').length > 0) {
                $listItem = $listItem.find('a');
            } else {
                // This happens when there is only text in the list
                $listItem = $listItem.wrapInner('<div>').children();
            }

            if ($listItem.find('br').length) {
                $listItem.html($listItem.html().replace(/<br>/g, ' '));
            }

            if (/1\-888/.test($listItem.text())) {
                var $telLink = $('<a>', {
                    href: 'tel:1-888-700-9474',
                    class: 'c-list-item c--default-fonts c-list-item__content u-padding u--none u-text-capitalize'
                });

                $listItem.contents().wrap($telLink);
            }

            $listItem
                .addClass('c-list-item c--default-fonts')
                .wrapInner('<div class="c-list-item__content u-padding u--none u-text-capitalize" />');
        });

        return $list;
    };

    var parse = function($items) {
        var $accordionItems = $items.map(function(_, item) {
            var $item = $(item);
            var $stack = _parseStack($item.find('ul'));
            var $title = $item.find('strong');

            if ($title.trimmedText().includes('account')) {
                var $subMenu = $('.SubMenu');
                var $element = {};

                // Logged in
                if ($subMenu.find('#login:contains("Sign Out")').length) {
                    $element = $('<li class="c-stack__item c--no-space" />');
                    $element.append($subMenu.find('#myAccount > a').addClass('c-list-item c--default-fonts').clone().empty().append($('<div class="c-list-item__content u-padding u--none u-text-capitalize">My Account</div>')));
                    $element.append($subMenu.find('#login > a').addClass('c-list-item c--default-fonts').clone().empty().append($('<div class="c-list-item__content u-padding u--none u-text-capitalize">Sign Out</div>')));

                } else {
                    $element = $('<li class="c-stack__item c--no-space" />');
                    $element.append($subMenu.find('#login > a').addClass('c-list-item c--default-fonts').clone().empty().append($('<div class="c-list-item__content u-padding u--none u-text-capitalize">Sign In/Register</div>')));
                }

                $element.insertBefore($stack.find('.c-stack__item').first());

            } else if ($title.trimmedText().includes('about')) {
                $stack.find('.c-stack__item:contains("cares")').remove();
                $stack.find('.c-stack__item:contains("Careers")').remove();

            } else if ($title.trimmedText().includes('shop')) {
                $stack.find('.c-stack__item:contains("quick")').remove();

            }

            return {
                sectionTitle: $title.trimmedText(),
                content: $stack
            };
        });

        return {
            'items': $accordionItems
        };
    };

    return {
        parse: parse
    };
});
