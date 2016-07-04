define([
    '$'
], function($) {
    var parse = function(JSON) {
        return $(JSON.subcategories).map(function(_, subcategory) {
            // CF-469: Fix HTML special characters
            var title = $('<div>').html($('<div>').html(subcategory.title).text());
            return {
                tileHref: subcategory.targetURL,
                tileImage: $('<img src="' + subcategory.thumbNail + '"></img>'),
                tileTitle: title,
                headingClasses: 'c--3 u-text-align-center'
            };
        });
    };

    return {
        parse: parse
    };
});
