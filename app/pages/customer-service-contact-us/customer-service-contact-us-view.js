define([
    '$',
    'global/baseView',
    'global/includes/sidenav/sidenav-context',
    'dust!pages/customer-service-contact-us/customer-service-contact-us',
    'removeStyle'
],
function($, BaseView, sideNav, template) {
    return {
        template: template,
        extend: BaseView,
        includes: {
            sidenav: sideNav
        },

        context: {
            templateName: 'customer-service-contact-us',
            pageTitle: function() {
                // Return hard-coded text since desktop markup is a image
                return 'Contact Us';
            },
            pageContent: function() {
                var $textContent = $('#standard');
                return $textContent.map(function(_, content) {
                    var $content = $(content);
                    // Move strong element outside of paragraphs
                    var $boldContent = $content.find('p:has(strong)').last().remove().find('strong');
                    var $paragraphs = $content.find('p');
                    // Remove extra <br>
                    $paragraphs.find('br').remove();
                    return {
                        paragraphs: $paragraphs,
                        boldContent: $boldContent
                    };
                });
                return $textContent;

            },
            formHeader: function() {
                return $('#standard h2');
            },
            contactForm: function() {
                var $orderStatusForm = $('#customerServiceForm');

                return $orderStatusForm.map(function(_, form) {
                    var $form = $(form);
                    var $hiddenInputs = $form.find('input[type=hidden]').remove();
                    var $rows = $form.find('.spot:not(.action)');

                    // Applying input type to fields
                    $form.find('input[name=phoneNumber]').attr('pattern', '[0-9]*').attr('inputmode', 'numeric');
                    $form.find('input[name=emailAddress]').attr('type', 'email');
                    $form.find('textarea.customerServiceTextArea').attr('rows', 8);
                    $form.find('input[name=zipCode]').attr('pattern', '[0-9]*').attr('inputmode', 'numeric').attr('maxlength', 5);

                    var $inputs = $rows.map(function(_, row) {
                        var $row = $(row);
                        var $label = $row.find('label:not(.auxLabel)');
                        var $input = $row.find('input, textarea');
                        var $select = $row.find('select');
                        var $auxLabel = $row.find('label.auxLabel');

                        return {
                            label: $label,
                            select: $select,
                            input: $input,
                            isCheckRadio: $input.attr('type') === 'checkbox',
                            isSelect: $select.length > 0,
                            caption: $auxLabel.text()
                        };
                    });

                    return {
                        form: $form,
                        hiddenInputs: $hiddenInputs,
                        inputs: $inputs,
                        inputRow: $inputs.splice(0, 2),
                        button: $form.find('.button.primary')
                    };
                });
            },
            contactInfo: function() {
                var $contactInfo = $('#standard').next();

                // CF-608: Wrap phone number in a link
                var $phoneLabel = $contactInfo.find('strong').first();
                var phoneNode = $phoneLabel[0].nextSibling;
                var phoneNumber = $phoneLabel[0].nextSibling.textContent;

                var $faxLabel = $contactInfo.find('strong').last();
                var faxNode = $faxLabel[0].nextSibling;

                phoneNumber = phoneNumber.trim();
                phoneNumber = phoneNumber.replace('wish (', '');
                phoneNumber = phoneNumber.replace(')', '');
                phoneNumber = 'tel:' + phoneNumber;

                $(phoneNode).wrap('<a href="' + phoneNumber + '">');

                // CF-608: Some browsers will automatically make strings
                // that look like numbers clickable
                // We don't want people to be able to phone the fax

                $(faxNode).wrap('<span class="u-disable-phone">');

                $contactInfo.removeStyle();

                return $contactInfo;
            }
        }

        /**
         * If you wish to override preProcess/postProcess in this view, have a look at the documentation:
         * http://adaptivejs.mobify.com/v1.0/docs/views
         */
    };
});
