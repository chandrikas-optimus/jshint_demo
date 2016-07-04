define([
    '$',
    'global/baseView',
    'dust!pages/gift-registry-landing/gift-registry-landing',
    'components/breadcrumbs/parsers/breadcrumbs-parser'
],
function($, BaseView, template, breadcrumbParser) {
    return {
        template: template,
        extend: BaseView,

        context: {
            templateName: 'gift-registry-landing',
            breadcrumbs: function() {
                return breadcrumbParser.parse($('#breadcrumbs_ul li'));
            },
            subtitle: function() {
                var $subtitle = $('.imaForm p').eq(1);

                $subtitle.removeAttr('style');
                $subtitle[0].innerHTML = $subtitle[0].innerHTML.replace(/<br>/ig, ' ');

                return $subtitle;
            },
            registryButtons: function() {
                var $buttons = $('.gift-registry-home-leftWCMM a');

                return $.makeArray($buttons).map(function(el) {
                    var $el = $(el);

                    return {
                        href: $el.attr('href'),
                        label: $el.text(),
                        class: 'c--borderless u-border-bottom',
                        labelClass: 'u-text-size-default'
                    };
                });
            }
        }
    };
});
