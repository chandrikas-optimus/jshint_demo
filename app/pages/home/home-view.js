/**
 * Home View
 */

define([
    '$',
    'global/baseView',
    'dust!pages/home/home'
],
function($, baseView, template) {
    return {
        template: template,
        extend: baseView,
        context: {
            templateName: 'home',
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
                    links: $links,
                    heading: $('.mobify-feature img').attr('alt'),
                };
            },
            firstp: function() {
                return $('p').first().text() || 'Could not find the first paragraph text in your page';
            },
            excludeBackToTop: function() { return true; },
            videoFrame: function() {
                var $videoFrame = $('.hp-row-content iframe');

                $videoFrame.attr('x-src', $videoFrame.data('src'));
                $videoFrame.removeAttr('width');
                $videoFrame.removeAttr('height');

                return $videoFrame;
            },
            promoImages: function() {
                return $('.hp-row-content a img[data-mobile-src]').map(function(_, img) {
                    var $img = $(img);

                    return {
                        href: $img.parent().attr('href'),
                        imgSrc: $img.data('mobile-src').replace(/>/g, ''),

                        // TODO: We are pulling in the whole string; it should
                        //       only be the whatever comes in after the final
                        //       '/' (i.e. the last page in the url)
                        buttonText: /\/([a-z-0-9]+)$/.exec($img.parent().attr('href'))[1].replace(/-/g, ' ')
                    };
                });
            }
        }

        /**
         * If you wish to override preProcess/postProcess in this view, have a
         * look at the documentation:
         *
         * http://adaptivejs.mobify.com/v1.0/docs/views
         */
    };
});
