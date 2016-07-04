define([
    '$',
    'global/baseView',
    'dust!pages/customer-service-confirmation/customer-service-confirmation'
],
function($, BaseView, template) {
    return {
        template: template,
        extend: BaseView,

        context: {
            templateName: 'customer-service-confirmation',
            pageTitle: function() {
                return $('#mainContent h1.inner').first().text() || 'Confirmation';
            },
            form: function() {
                var $orderStatusForm = $('#confirmation');

                return $orderStatusForm.map(function(_, form) {
                    var $form = $(form);
                    var $hiddenInputs = $form.find('input[type=hidden]').remove();
                    var $rows = $form.find('.spot:not(.action)');

                    return {
                        form: $form,
                        notes: $form.find('p.note'),
                        hiddenInputs: $hiddenInputs,
                        button: $form.find('.button.primary')
                    };
                });
            }
        }

        /**
         * If you wish to override preProcess/postProcess in this view, have a look at the documentation:
         * http://adaptivejs.mobify.com/v1.0/docs/views
         */
    };
});
