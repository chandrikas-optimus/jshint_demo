define([
    '$',
    'global/baseView',
    'dust!pages/customer-service-order-status/customer-service-order-status'
],
function($, BaseView, template) {
    return {
        template: template,
        extend: BaseView,

        context: {
            templateName: 'customer-service-order-status',
            pageTitle: function() {
                return $('#mainContent h1').first().attr('title') || 'Order Status';
            },
            mainImage: function() {
                return $('.infoPages > img').removeAttr('style');
            },
            pageContent: function() {
                var $textContent = $('.infoPages > p');

                return $textContent.map(function(_, content) {
                    var $content = $(content);

                    //  Remove inline styles
                    $content.find('br').replaceWith(' ');

                    return $content;
                });
            },
            errorText: function() {
                var $error = $('.data .error');
                return $error.map(function(_, error) {
                    var $error = $(error);
                    if ($error.text().trim().length > 0) {
                        return {
                            error: $error.text()
                        };
                    }
                });
            },
            orderStatusForm: function() {
                var $orderStatusForm = $('#orderStatusForm');

                return $orderStatusForm.map(function(_, form) {
                    var $form = $(form);
                    var $hiddenInputs = $form.find('input[type=hidden]').remove();
                    var $rows = $form.find('.spot:not(.action)');

                    $form.find('input[name=billZip]').attr('pattern', '[0-9]*').attr('inputmode', 'numeric').attr('maxlength', 5);

                    var $inputs = $rows.map(function(_, row) {
                        var $row = $(row);
                        var $label = $row.find('label');
                        var $input = $row.find('input');

                        return {
                            label: $label,
                            input: $input
                        };
                    });
                    // Adding hint from the desktop botton
                    $inputs = $inputs.map(function(_, input) {
                        var $input = $(input.input);
                        if ($input.attr('id') === 'orderId') {
                            input.hint = $form.find('p > a');
                        }
                        return input;
                    });

                    return {
                        form: $form,
                        hiddenInputs: $hiddenInputs,
                        inputs: $inputs,

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
