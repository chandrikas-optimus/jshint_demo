define([
    '$',
    'global/baseView',
    'dust!pages/customer-service-balance-inquiry/customer-service-balance-inquiry'
],
function($, BaseView, template) {
    return {
        template: template,
        extend: BaseView,

        context: {
            templateName: 'customer-service-balance-inquiry',
            pageTitle: function() {
                // Client title image is not found and no alt available
                // Grabbing the current breadcrumb text as page title.
                // Note: On desktop, the text you see in the breadcrumb is CSS text!! Not actual parsable data
                return 'Wish Certificate Balance';
            },
            formInfo: function() {
                return $('#mainContent p.inst-copy').nextUntil('#gwt-error-placement-div').filter('p:not(:empty)');
            },
            desktopErrorContainer: function() {
                return $('#gwt-error-placement-div').remove();
            },
            findNumberModal: function() {
                var $container =  $('#gwt_wwcm_gc_findnumber');
                return {
                    headerContent: 'Gift Card Number',
                    content: {data: $container.find('p')}
                };
            },
            balanceInfo: function() {
                var $container =  $('#gwt_wwcm_gc_balance_desc');
                return {
                    headerContent: 'Balance',
                    content: {data: $('<h3 class="c-heading c--3">Your current balance is: <span id="js-card-balance"></span></h3><p class="c-note">' + $container.text() + '</p>')}
                };
            },
            mainContent: function() {
                return $('#gwt_gift_card_balance').attr('hidden', 'hidden');
            }
        }

        /**
         * If you wish to override preProcess/postProcess in this view, have a look at the documentation:
         * http://adaptivejs.mobify.com/v1.0/docs/views
         */
    };
});
