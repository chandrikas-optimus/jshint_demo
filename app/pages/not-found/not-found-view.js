/**
 * Home View
 */

define([
    '$',
    'global/baseView',
    'dust!pages/not-found/not-found'
],
function($, baseView, template) {
    return {
        template: template,
        extend: baseView,
        context: {
            templateName: 'not-found',
            pageTitle: function() {
                return ('We’re sorry, we can’t find this page…');
            },
            pageContent: function() {
                return $('.error404spot1 .default');
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
