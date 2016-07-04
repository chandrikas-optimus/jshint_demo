define([
    '$',
    'global/utils/dummy-element',
    'dust!pages/customer-service-catalog-request/partials/reveal-row'
], function($, DummyElement) {

    var transformRow = function(row, HTMLSelector) {
        var $row = $(row);
        var $label = $row.find('label:not(.auxLabel)');
        var $input = $row.find('input, textarea');
        var $select = $row.find('select');
        var $auxLabel = $row.find('label.auxLabel');

        // Setting up reveal
        var revealContent = {};
        var isReveal = false;

        // Check if this is the company field
        if ($row.attr('class').match('AddrCompanySpot')) {
            revealContent = {
                showLabel: '+ Add ' + $label.text() + ' (optional)',
                content: {
                    contentTemplate: 'components/field/field',
                    data: {
                        label: $label,
                        input: $input,
                        caption: $auxLabel.text()
                    }
                }
            };
            isReveal = true;
        }

        return {
            label: $label,
            select: DummyElement.getSubstitute($select),
            input: DummyElement.getSubstitute($input),
            isHTML: $row.is('.gwt_RelativeGroup_Header'),
            HTMLContent: $row,
            isCheckRadio: $input.attr('type') === 'checkbox',
            isSelect: $select.length > 0,
            isReveal: isReveal,
            revealContent: revealContent,
            caption: $auxLabel.text()
        };
    };

    var parseAddressInput = function(selector) {
        var $context = $(selector);
        return $context.map(function(_, form) {
            var $form = $(form);
            // Manipulate form before transform
            var $hiddenInputs = $form.find('input[type=hidden]').remove();

            // Removing them according to design
            $form.find('.reqdlabel').remove();
            // Removing them since client's css is making them display:none
            $form.find('.miLabel').remove();
            $form.find('.addrFaxGroup').remove();
            $form.find('.addrStreet2Spot').remove();
            $form.find('.addrStreet3Spot').remove();


            // Ignore these fields for now, we are going to process them after
            var $rows = $form.find('.spot:not(.action, .addrStateSpot, .addrZipSpot, .addrPhone1Spot, .addrPhone2Spot)');

            // Applying input type to fields
            // $form.find('input[name=phoneNumber]').attr('pattern', '[0-9]*').attr('inputmode', 'numeric');
            $form.find('input[class*=postal-code]').attr('pattern', '[0-9]*').attr('inputmode', 'numeric').attr('maxlength', 5);
            $form.find('input[class*=phone]').attr('pattern', '[0-9]*').attr('inputmode', 'numeric');
            var $inputs = $rows.map(function(_, row) {
                return transformRow(row);
            });

            // Start main form processing

            // Process the zipcode row
            var $stateSelect = $form.find('.addrStateSpot');
            var stateSelectRow = transformRow($stateSelect);
            var $zipCodeInput = $form.find('.addrZipSpot');
            var zipCodeRow = transformRow($zipCodeInput);
            var rowInput = {
                isRow: true,
                rows: [
                    stateSelectRow,
                    zipCodeRow
                ]
            };
            // Insert this row before the last item
            $inputs.splice($inputs.length - 1, 0, rowInput);

            // Process the phone number row
            var $phoneInput = $form.find('.addrPhone1Spot');
            var phoneRow = transformRow($phoneInput);
            var $eveningPhoneInput = $form.find('.addrPhone2Spot');
            var eveningPhoneRow = transformRow($eveningPhoneInput);

            var revealInput = {
                isReveal: true,
                revealContent: {
                    showLabel: '+ Add Phone Number (optional)',
                    content: {
                        contentTemplate: 'pages/customer-service-catalog-request/partials/reveal-row',
                        data: [
                            phoneRow,
                            eveningPhoneRow
                        ]
                    }
                }
            };

            $inputs.push(revealInput);

            // Ending main form processing


            return {
                form: $form,
                hiddenInputs: $hiddenInputs,
                inputs: $inputs,
                button: $form.find('.button.primary')
            };
        })[0];
    };

    var parseEmailInput = function(selector) {
        var $context = $(selector);
        return $context.map(function(_, _) {
            var $form = $context;

            var $rows = $form.find('.spot:not(.action), .gwt-CheckBox');
            // Manipulate form before transform
            var $hiddenInputs = $form.find('input[type=hidden]').remove();

            $form.find('#emailBox').attr('type', 'email');

            var $inputs = $rows.map(function(_, row) {
                return transformRow(row);
            });

            return {
                form: $form,
                hiddenInputs: $hiddenInputs,
                inputs: $inputs
            };
        })[0];
    };

    var parseBirthdayInput = function(selector) {
        var $context = $(selector).find('.group.relativeInfoContainerGroup');
        var processedInputs =  $context.map(function(_, form) {
            var $form = $(form);
            // Manipulate form before transform
            var $hiddenInputs = $form.find('input[type=hidden]').remove();

            // Ignore these fields for now, we are going to process them after
            var $rows = $form.find('.spot:not(.action), .gwt_RelativeGroup_Header');

            var $inputs = $rows.map(function(_, row) {
                return transformRow(row, '.gwt_RelativeGroup_Header');
            });

            var birthdayYear = $inputs.last()[0];
            $inputs = $inputs.slice(0, -1);
            var birthdayDay = $inputs.last()[0];
            $inputs = $inputs.slice(0, -1);
            var birthdayMonth = $inputs.last()[0];
            $inputs = $inputs.slice(0, -1);
            $inputs.push({
                isRow: true,
                rows: [
                    birthdayMonth,
                    birthdayDay,
                    birthdayYear
                ],
                class: 'c--5-3-3'
            });
            return $inputs;
        });

        return {
            form: $context,
            inputs: {
                isReveal: true,
                revealContent: {
                    showLabel: '+ Add Birthday Information (optional)',
                    content: {
                        contentTemplate: 'pages/customer-service-catalog-request/partials/reveal-row',
                        data: processedInputs
                    },
                    hideLabel: 'Hide Birthday Information'
                }
            }
        };
    };

    var parseSubmitButton = function(selector) {
        var $context = $(selector);
        return $context.map(function(_, _) {
            var $form = $context;
            return {
                form: $form,
                button: DummyElement.getSubstitute($form.find('.button.primary'))
            };
        })[0];
    };

    var parse = function(selector) {
        if (selector === '#gwt_addr_panel') {
            return parseAddressInput(selector);
        } else if (selector === '#gwt_email_textbox, #gwt_sendEmail_cb') {
            return parseEmailInput(selector);
        } else if (selector === '.gwt-relative-dlog') {
            return parseBirthdayInput(selector);
        } else if (selector === '#gwt_catreqaddr_btn') {
            return parseSubmitButton(selector);
        }
    };

    return {
        parse: parse
    };
});
