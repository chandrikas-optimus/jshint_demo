define(['$'], function($) {
    var parse = function($breadcrumbs, defaultText) {
        return $breadcrumbs.map(function(_, breadcrumb) {
            var $breadcrumb = $(breadcrumb);
            var $breadcrumbLink = $breadcrumb.find('a, h1');

            return {
                href: $breadcrumbLink.length ? $breadcrumbLink.attr('href') : '',
                title: ($breadcrumbLink.text() || $breadcrumb.text()) || defaultText
            };
        });
    };

    var parseAccount = function() {
        return $('#myAccount a').map(function(_, breadcrumb) {
            var $breadcrumb = $(breadcrumb);

            return {
                href: $breadcrumb.attr('href'),
                title: 'Back to ' + $breadcrumb.text()
            };
        });
    };


    return {
        parse: parse,
        parseAccount: parseAccount
    };
});
