define([
    '$',
    'global/baseView',
    'global/utils',
    'dust!pages/category-list/category-list',
    'components/breadcrumbs/parsers/breadcrumbs-parser',
    'pages/category-list/parsers/category-sheet-parser',
    'global/utils/template-reader',
    'pages/category-list/parsers/category-tiles-parser'
],
function($, BaseView, Utils, template, breadcrumbParser, categorySheetParser, JSONTemplate, categoryTilesParser) {
    return {
        template: template,
        extend: BaseView,

        preProcess: function(context) {
            var beforeBasePreProcess = function() {
                var $scriptsToPreserve = $('.JSON script');

                Utils.preserveInlineScripts($scriptsToPreserve);
            };

            var afterBasePreProcess = function() {
            };

            if (BaseView.preProcess) {
                beforeBasePreProcess();
                context = BaseView.preProcess(context);
                afterBasePreProcess();
            }

            return context;
        },

        context: {
            templateName: 'category-list',
            pageTitle: function() {
                return $('#sideBoxLink').text();
            },



            featuredImage: function() {
                var $links = $('.mobify-feature a').map(function(_, anchor) {
                    var $anchor = $(anchor);

                    return {
                        href: $anchor.attr('href'),
                        text: $anchor.text()
                    };
                });

                return {
                    image: {
                        src: $('.mobify-feature img').data('mobile-src'),
                        alt: $('.mobify-feature img').attr('alt')
                    },
                    href: $links.length ? $links[0].href : null,
                    links: $links,
                    heading: $('.mobify-feature img').attr('alt'),
                };
            },



            categoryTiles: function() {
                var categoryTilesJSON = JSONTemplate.parse($('#gwt_subcategories_dp'));

                return categoryTilesParser.parse(categoryTilesJSON);
            },
            breadcrumbs: function() {
                return breadcrumbParser.parse($('#breadcrumbs_ul li'));
            },
            categoriesSheet: function() {
                var $categories = $('#sideBoxContent .active').length ? $('#sideBoxContent .active li:not(".moreCats") a') : $('#sideBoxContent li:not(".moreCats") a');

                return categorySheetParser.parse($categories);
            },
            SEO: function() {
                var $container = $('.xpanda .info');

                return $container.length ? {
                    showLabel: $('<div>' + '<span class="u-text-default u-text-size-default u-text-weight-normal">' + $container.text().slice(0, 100) + '...' + '</span>' + '<span class="u-margin-start-md">Read more</span>' + '</div>'),
                    content: $('<div class="c-text-content" />').append($container.contents())
                } : null;
            }
        }

        /**
         * If you wish to override preProcess/postProcess in this view, have a look at the documentation:
         * http://adaptivejs.mobify.com/v1.0/docs/views
         */
    };
});
