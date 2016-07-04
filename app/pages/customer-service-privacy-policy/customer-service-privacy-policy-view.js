define([
    '$',
    'global/baseView',
    'global/includes/sidenav/sidenav-context',
    'components/breadcrumbs/parsers/breadcrumbs-parser',
    'dust!pages/customer-service-privacy-policy/customer-service-privacy-policy',
    'removeStyle'
],
function(
    $,
    BaseView,
    sideNav,
    breadcrumbsParser,
    template
) {
    return {
        template: template,
        extend: BaseView,
        includes: {
            sidenav: sideNav
        },

        context: {
            templateName: 'customer-service-privacy-policy',
            pageTitle: function() {
                return $('#standard h2').first().text() || 'Privacy Policy';
            },
            breadcrumbs: function() {
                var $crumbs = $('.breadcrumbs li');

                // Getting current page title from header since it was not passed as anchor
                return breadcrumbsParser.parse($crumbs, $('#standard h2').first().text() || 'Privacy Policy');
            },
            pageContent: function() {
                var $textContent = $('#standard');

                return $textContent.map(function(_, content) {
                    var $content = $(content);

                    $content.addClass('u-padding u-margin-bottom-md c-text-content');
                    $content.find('p').first().remove();

                    // Remove inline styles, will be replaced by removeStyle() after cf-147 is merged
                    $content.removeStyle();

                    // Remove duplicate title
                    $textContent.find('h2').remove();

                    // CF-376 Client request remove list style on this specific element
                    $textContent.find('li:contains("California Residents")').find('ul > li:nth-child(1)').addClass('t-customer-service-privacy-policy__list-item');

                    $textContent.find('em').addClass('u-text-style-normal');

                    // Adding style to text content
                    $content.find('p').addClass('u-margin-bottom-md');

                    // Increase font size of h3s for CF-376
                    $content.find('h3').addClass('u-text-size-x-large');

                    return $content;
                });

            },
            hasNav: function() {
                return $('.customerServiceSideBox').length > 0;
            }
        }

        /**
         * If you wish to override preProcess/postProcess in this view, have a look at the documentation:
         * http://adaptivejs.mobify.com/v1.0/docs/views
         */
    };
});
