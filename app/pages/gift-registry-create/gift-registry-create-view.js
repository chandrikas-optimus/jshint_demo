define([
    '$',
    'global/baseView',
    'dust!pages/gift-registry-create/gift-registry-create',
    'components/breadcrumbs/parsers/breadcrumbs-parser'
],
function($, BaseView, template, breadcrumbParser) {
    return {
        template: template,
        extend: BaseView,

        context: {
            templateName: 'gift-registry-create',
            breadcrumbs: function() {
                var $crumbs = breadcrumbParser.parse($('#breadcrumbs_ul li'));

                // "Create A Registry : Step1"
                var lastCrumb = $crumbs.last().get(0);
                lastCrumb.title = lastCrumb.title.split(':')[0];

                return $crumbs;
            },
            hiddenData: function() {
                return $('input[type="hidden"], .nodisplay, .breadcrumbs, #gwt_user_state');
            },
            errors: function() {
                return $('#gwt-error-placement-div');
            },
            formContent: function() {
                return $('#giftRegistryVisitView');
            },
        }

        /**
         * If you wish to override preProcess/postProcess in this view, have a look at the documentation:
         * http://adaptivejs.mobify.com/v1.0/docs/views
         */
    };
});
