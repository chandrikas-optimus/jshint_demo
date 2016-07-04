define([
    '$',
    'dust!pages/desktop/desktop'
],
function($, template) {
    return {
        template: template,

        preProcess: function() {
            var $headTag = $('head');

            // CF-92 Footer (Epilogue) - The epilogue desktop pages should fit the screen
            var $viewport = $headTag.find('meta[name="viewport"]');

            if (!$viewport.length) {
                $viewport = $('<meta>', {
                    name: 'viewport',
                }).appendTo($headTag);
            }

            // Fix an issue where scale is remembered from the page the browser navigates from
            $viewport.attr('content', 'width=device-width, initial-scale=0.1');
        },

        context: {
            templateName: 'desktop',
            html: function() {
                return $('html');
            }
        }
    };
});
