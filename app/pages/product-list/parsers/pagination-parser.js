define(['$'], function($) {

    var parseSLI = function($container) {
        if (!$container.is('.pageselectortext')) {
            $container = $container.find('.pageselectortext');
        }
        if ($container.children().length === 0) {
            return;
        }

        var $viewAllLink, $viewFewerLink;
        $viewAllLink = $container.children('a').last().remove();
        if (/fewer/i.test($viewAllLink.text())) {
            $viewFewerLink = $viewAllLink;
            $viewAllLink = null;
        }

        var data = {
            paginationLinkPrev: $container.children('.pageselectorprev').attr('href'),
            paginationLinkNext: $container.children('.pageselectornext').attr('href'),
            paginationCurrent: $container.children('.pageactive').trimmedText(),
        };

        if ($viewAllLink) {
            data.paginationLinkAll = {
                href: $viewAllLink.attr('href'),
                onclick: $viewAllLink.attr('onclick')
            };
        } else {
            data.viewFewerLink = $viewFewerLink;
        }

        return data;
    };

    var parseWebsphere = function($container) {
        var data = {
            paginationLinkPrev: $container.find('.prev a').attr('href'),
            paginationLinkNext: $container.find('.next a').attr('href'),
            paginationCurrent: $container.find('.active').trimmedText(),
        };

        if (data.paginationCurrent) {
            data.paginationLinkAll = {
                element: $('<a class="js-view-all">View All</a>')
            };
        } else {
            var $desktopDropdown = $container.find('#topItemsPerPage');

            if ($desktopDropdown.val() === '0') {
                // We're currently showing _all_ products
                data.viewFewerLink = $('<a class="js-view-fewer">View Fewer</a>');
            } else {
                // We're looking at a page without many products
                // No need to show pagination
                data = null;
            }
        }

        return data;
    };

    return {
        parse: parseSLI,
        parseSLI: parseSLI,
        parseWebsphere: parseWebsphere
    };
});
