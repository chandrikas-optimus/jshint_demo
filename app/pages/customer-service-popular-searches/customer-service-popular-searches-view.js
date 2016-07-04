define([
    '$',
    'global/baseView',
    'dust!pages/customer-service-popular-searches/customer-service-popular-searches'
],
function($, BaseView, template) {
    return {
        template: template,
        extend: BaseView,

        context: {
            templateName: 'customer-service-popular-searches',
            pageTitle: function() {
                var alphaIndex = $('.sli_alpha_nav').find('b').text();
                return {
                    mainText: $('#sli_default h1.sli_h1').text(),
                    alphaIndex: (alphaIndex ? alphaIndex : '')
                };
            },
            searchTags: function() {
                var $container = $('ul.sli_alpha_suggested');

                var items = $container.map(function(_, container) {
                    var $container = $(container);

                    // Find all the anchors
                    var $links = $container.find('a');

                    return $links.map(function(_, link) {
                        var $link = $(link);
                        return {
                            href: $link.attr('href'),
                            label: $link.text()
                        };
                    });
                })[0];
                return {
                    items: items
                };
            },
            sidenav: function() {
                var $sideBox = $('.sli_alpha_nav');
                return $sideBox.map(function(_, box) {
                    var $box = $(box);
                    var $content = $box.find('a');

                    $content.map(function(_, item) {
                        var $item = $(item);
                        $item.wrap('<div class="c-stack__item"/>');
                        return $item;
                    });
                    $box.find('.c-stack__item').wrapAll('<div class="c-stack"/>');

                    return {
                        headerContent: $('#sli_default h1.sli_h1').text() || 'Popular Searches',
                        content: {data: $box.find('.c-stack')}
                    };
                });
            }
        }

        /**
         * If you wish to override preProcess/postProcess in this view, have a look at the documentation:
         * http://adaptivejs.mobify.com/v1.0/docs/views
         */
    };
});
