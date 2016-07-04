define(['$'], function($) {

    var parse = function($items) {
        return $items.map(function(_, item) {
            var $item = $(item);
            var $socialHref = $item.attr('href');
            var socialName = '';

            if ($socialHref.indexOf('google') > -1) {
                socialName = 'google-plus';
            } else if ($socialHref.indexOf('facebook') > -1) {
                socialName = 'facebook';
            } else if ($socialHref.indexOf('twitter') > -1) {
                socialName = 'twitter';
            } else if ($socialHref.indexOf('instagram') > -1) {
                socialName = 'instagram';
            } else if ($socialHref.indexOf('pinterest') > -1) {
                socialName = 'pinterest';
            }

            return {
                icon: socialName,
                link: $item
            };
        });
    };

    return {
        parse: parse
    };
});
