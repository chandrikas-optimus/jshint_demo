define([
    '$',
    'global/baseView',
    'dust!pages/gift-registry-find/gift-registry-find',
    'components/breadcrumbs/parsers/breadcrumbs-parser'
],
function($, BaseView, template, breadcrumbParser) {
    return {
        template: template,
        extend: BaseView,

        context: {
            templateName: 'gift-registry-find',
            breadcrumbs: function() {
                return breadcrumbParser.parse($('#breadcrumbs_ul li'));
            },
            heading: function() {
                return $('h1').attr('title');
            },
            hiddenData: function() {
                return $('form.hidden, input[type="hidden"]');
            },
            errors: function() {
                return $('#gwt-error-placement-div');
            },
            findRegistryByName: function() {
                return $('#giftRegSearchFormPanel');
            },
            findRegistryByNumber: function() {
                return $('#giftRegIdPanel');
            }
        }
    };
});
