define([
    '$',
    'global/includes/footer/parsers/accordion-parser',
    'global/includes/footer/parsers/social-parser',
    'global/includes/footer/parsers/email-parser'
], function($, accordionParser, socialParser, emailParser) {
    return {
        context: {
            footerLinks: function() {
                var $links = $('.partners > li').not(':last');

                $links.find('span').removeAttr('style');
                $links.find('a').addClass('c-note');

                $links = $links.filter(function(i, link) {
                    return !/site\smap/i.test(link.textContent); // removes Site map link
                });

                return $links;
            },
            copyright: function() {
                return $('#copyright .cr').text();
            },
            sourceCode: function() {
                var $sourceCode = $('#sourceCode');

                return $sourceCode;
            },
            sourceCodeHidden: function() {
                return $('#display_source_code');
            },
            accordions: function() {
                return accordionParser.parse($('.siteLinks .links'));
            },
            social: function() {
                return socialParser.parse($('#socialmedia a'));
            },
            enterEmail: function() {
                return emailParser.parse($('#emailUpdates'));
            }
        }
    };
});
