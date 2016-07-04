define([
    '$',
    'global/baseView',
    'dust!pages/account-info/account-info',
    'dust!components/loading/loading'
],
function($, BaseView, template, loadingTemplate) {
    return {
        template: template,
        extend: BaseView,

        context: {
            templateName: 'account-info',
            // body: function() {
            //     return $('body');
            // },
            // TODO: why is this not causing the form fields to be generated?
            // content: function() {
            //     return $('#mainContent');
            // },
            // hiddenForm: function() {
            //     return $('#gwt_view_name').parent();
            // },
            // hiddenLabels: function() {
            //     return $('#mainContent').children('.nodisplay, [id^="gwt_errmsg"], [id$="label"]');
            // }

            pageTitle: function() {
                return $('h1').first().attr('title') || 'Account Information';
            },
            desktopErrorContainer: function() {
                return $('#gwt-error-placement-div').remove();
            },
            intro: function() {
                return $('.inst-copy');
            },
            accountInfo: function() {
                var $container = $('.account_info');
                var $billingWrapper = $container.find('.accountInfoBillingForm');
                var $shippingWrapper = $container.find('.accountInfoShippingForm');

                var setHeading = function($heading, text) {
                    $heading.replaceWith('<h2 class="c-heading c--2 u-margin-bottom-md">' + text + '</h2>');
                };

                // Transform headings
                setHeading($billingWrapper.find('h3'), 'Billing Address');
                setHeading($shippingWrapper.find('h3'), 'Shipping Address');

                // Insert divider
                $billingWrapper.after('<hr class="c-divider c--double u-margin-bottom-xxlg u-margin-top-xxlg">');

                // Insert loading spinner, while waiting for dynamic form fields to load
                loadingTemplate({}, function(err, html) {
                    $billingWrapper.find('#gwt_billaddr_panel').html(html);
                    $shippingWrapper.find('#gwt_shipaddr_panel').html(html);
                });

                return $container;
            },
            billingAddress: function() {
                return {
                    heading: $('.accountInfoBillingForm h3').text(),
                    container: $('#gwt_billaddr_panel')
                };
            },
            shippingAddress: function() {
                return {
                    heading: 'Shipping Address',  // different than desktop
                    container: $('#gwt_shipaddr_panel')
                };
            },
            saveButton: function() {
                return $('#gwt_billshipaddr_btn');
            },
        }

        /**
         * If you wish to override preProcess/postProcess in this view, have a look at the documentation:
         * http://adaptivejs.mobify.com/v1.0/docs/views
         */
    };
});
