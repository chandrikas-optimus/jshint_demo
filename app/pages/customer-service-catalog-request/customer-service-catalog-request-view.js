define([
    '$',
    'global/baseView',
    'dust!pages/customer-service-catalog-request/customer-service-catalog-request'
],
function($, BaseView, template) {
    return {
        template: template,
        extend: BaseView,

        context: {
            templateName: 'customer-service-catalog-request',
            desktopErrorContainer: function() {
                return $('#gwt-error-placement-div').remove();
            },
            pageTitle: function() {
                return $('#mainContent h1.custom').attr('title') || 'Catalog Request';
            },
            mainContent: function() {
                return $('#mainContent').attr('hidden', 'hidden');
            },
            relativeInfo: function() {
                return $('#relativeInfo');
            },
            products: function() {
                var $subscriptions = $('#subscriptions .subscription').remove();
                return $subscriptions.map(function(_, subscription) {
                    var $subscription = $(subscription);

                    var $checkBox = $subscription.find('input[type=checkbox]').addClass('c-input');
                    return {
                        hiddenFields: $subscription.find('input[type=hidden]').remove(),
                        checkBox: $checkBox,
                        image: {
                            src: $subscription.find('img.subscriptionImage').attr('x-src'),
                            alt: $subscription.find('img.subscriptionImage').attr('alt')
                        },
                        heading: $subscription.find('p.subscription_description')
                    };
                });
            },
            brandContent: function() {
                return $('.brand-content');
            },
            infoForm: function() {
                return $('.form.catreqdouble');
            },
            birthdayHeader: function() {
                return $('.catlogRequestRelativesBirthDaysContentHeader');
            },
            birthdayContent: function() {
                return $('.catlogRequestRelativesBirthDaysContent');
            }
        }

        /**
         * If you wish to override preProcess/postProcess in this view, have a look at the documentation:
         * http://adaptivejs.mobify.com/v1.0/docs/views
         */
    };
});
