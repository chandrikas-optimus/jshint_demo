define([
    '$',
    'global/baseView',
    'global/includes/sidenav/sidenav-context',
    'dust!pages/customer-service-terms/customer-service-terms',
    'swap'
],
function($, BaseView, sideNav, template) {
    return {
        template: template,
        extend: BaseView,
        includes: {
            sidenav: sideNav
        },

        context: {
            templateName: 'customer-service-terms',
            pageTitle: function() {
                return $('#standard h1').first().remove().text() || 'Terms & Conditions';
            },
            terms: function() {
                var $textContent = $('#standard');

                return $textContent.map(function(_, content) {
                    var $content = $(content);

                    $content.addClass('u-padding u-margin-bottom-md c-text-content');

                    // Remove inline styles, will be replaced by removeStyle() after cf-147 is merged
                    $content.removeStyle();

                    // Add .u-tex-weight-bold to every h3
                    $content.find('h3').addClass('u-tex-weight-bold');

                    // Adding style to text content
                    $content.find('p').addClass('u-margin-bottom-md');

                    // CF-610: Change heading style
                    $content.find('h3').addClass('u-text-size-x-large');

                    return $content;
                });
            }
        }

        /**
         * If you wish to override preProcess/postProcess in this view, have a look at the documentation:
         * http://adaptivejs.mobify.com/v1.0/docs/views
         */
    };
});
