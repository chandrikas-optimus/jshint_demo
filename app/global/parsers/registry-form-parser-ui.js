define([
    '$',
    'global/utils',

    // Partials
    'dust!components/select/select',
    'dust!components/loading/loading',

    'global/utils/selector-extensions'
], function(
    $,
    Utils,
    // Partials
    SelectTmpl,
    LoadingTmpl) {


    var $selectComponent;
    var toggleText = 'Add Another Line';
    var $checkRadio = $('<svg class="c-icon c-check-radio__icon">'
        + '<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-checkmark"></use>'
        + '</svg>');
    var $errorContainer = $('<div class="js-desktop-errors" hidden></div>').appendTo($('body'));
    new SelectTmpl({select: $('<select>')}, function(err, html) {
        $selectComponent = $(html);
    });

    var _transformMultipleSelects = function($formField) {
        if ($formField.find('.c-select').length > 1) {
            var $cArrange = $('<div class="c-arrange c--gutters u-margin-top-lg"></div>');
            var $cArrangeItems = $('<div class="c-arrange__item"></div>');

            $formField.find('.c-select').each(function(i, select) {
                var $select = $(this);

                if ($select.find('.GR_event_month').length) {
                    return;
                }

                $select.wrap($cArrangeItems);
            });

            $formField.find('.c-arrange__item').wrapAll($cArrange);
        }
    };

    // transforms fields that have inputs on the left, labels on the right
    // aka radio buttons and checkboxes
    var _transformLeftInputRightLabelFields = function($field, parentClass) {
        if (!$field.length) {
            return;
        }

        var $cField = $('<div class="c-field__input"></div>');

        $field.parent().addClass(parentClass);

        if (!$field.parents().hasClass('c-field-row')) {
            $field.addClass('c-field-row');
        }

        $field.find('input').wrap('<div class="c-check-radio">').after($checkRadio.clone());

        $field.find('label').addClass('c-label');

        $field.contents().appendTo($cField);
        $field.append($('<div class="c-field c--check-radio">').html($cField));
    };

    var _transformCheckboxField = function($formField) {
        var $field = $formField.find('.gwt-CheckBox').length ?
                        $formField.find('.gwt-CheckBox') :
                        $formField;

        $field.each(function() {
            var $checkboxField = $(this);
            _transformLeftInputRightLabelFields($checkboxField, 'u-margin-bottom-sm');
        });
    };

    var _transformRadioField = function($formField) {
        // filter $formField with only gwt-RadioButton, do our transformations
        // then empty() formField so we're only left with gwt-RadioButtons
        $formField.contents().filter(function() {
            return $(this).is('.gwt-RadioButton');
        }).each(function() {
            var $radioField = $(this);
            _transformLeftInputRightLabelFields($radioField, 'u-display-block');
        }).appendTo($formField.empty());
    };

    var _transformSelect = function($selects) {
        if (!$selects.length) {
            return;
        }

        $selects.each(function() {
            var $selectContainer = $(this).parent();
            var $select = $(this);
            var $newSelect = $selectComponent.clone();

            $newSelect.find('select').replaceWith($select);
            $selectContainer.append($newSelect);
        });
    };

    var _transformTextsAndSelects = function($formField) {
        var $cInput = $('<div class="c-input"></div>');
        var $cField = $('<div class="c-field"></div>');
        var $label = $formField.find('label').addClass('c-label').unwrap();
        var $input = $formField.find('input:not([type="checkbox"]), select');

        $formField.addClass('c-field-row');

        if ($input.hasClass('GR_coRegistrant_email_box')) {
            $input.attr('type', 'email');
        }

        $cField
            .append($label)
            .append($input);

        $cField.find('input[type="text"], input[type="email"]').wrap($cInput);
        _transformSelect($cField.find('select'));
        _transformMultipleSelects($cField);

        // remove unnecessary labels in row and append our fields
        $formField.empty().append($cField);
    };

    var _transformButtons = function($page) {
        if (!$page.length) {
            return;
        }

        var $primaryButton = $page.find('.gwt-Button.primary, .button.primary');

        $primaryButton.addClass('c-button c--primary c--full-width u-margin-top-md u-margin-bottom-md');
        var $secondary = $page.find('.button.secondary').addClass('c-button c--outline c--full-width u-margin-bottom-md');
        $secondary.find('span').text($secondary.text().toLowerCase());
        $primaryButton.find('span').text($primaryButton.text().toLowerCase());

        new LoadingTmpl({}, function(err, html) {
            $primaryButton.append($(html).attr('hidden', 'true'));
        });
    };

    var _transformFormField = function($formField) {
        if (!$formField.length) {
            return;
        }

        // transform based on input types
        if ($formField.find('input[type="checkbox"]').length) {
            _transformCheckboxField($formField);
        } else if ($formField.find('input[type="radio"]').length) {
            _transformRadioField($formField);
        } else {
            _transformTextsAndSelects($formField);
        }
    };

    // unfortunately each step has different form markup
    var _transformSpotFields = function($field) {
        if (!$field.length) {
            return;
        }

        var $cInput = $('<div class="c-input"></div>');
        var $cFieldRow = $('<div class="c-field-row"></div>');
        var $input = $field.find('input');

        $input.wrap($cInput);
        $field.find('label').addClass('c-label');
        $field.addClass('c-field');

        if ($field.find('select').length) {
            _transformSelect($field.find('select'));
        }

        if ($input.hasClass('given-email')) {
            $input.attr('type', 'email');
        } else if ($input.is('.phone1_shipping, .postal-code')) {
            $input.attr('type', 'tel');
        }

        // some fields have .group markup, we can just add class
        // otherwise, wrap lonesome .spot fields with c-field-row
        if ($field.parent('.group').length) {
            $field.unwrap();
        }

        if ($field.hasClass('addrZipSpot')) {
            $field.appendTo($field.prev('.c-field-row').addClass('c--3-4'));
        } else {
            $field.wrap($cFieldRow);
        }

    };

    var _moveMiddleInitial = function($middleInitialContainer, $firstNameContainer) {
        $middleInitialContainer.unwrap().appendTo($firstNameContainer.addClass('c--3-4'));
    };

    var _transformMiddleInitial = function($pageContainer) {
        var $middleInitial = $pageContainer.find('.miLabel');
        var $firstName = $pageContainer.find('.AddrFNameSpot').parent();

        _moveMiddleInitial($middleInitial, $firstName);
    };

    var _transformCoRegistrantShippingOption = function() {
        var $shipToCoRegistrant = $('.GR_shippingChoices_panel [class*="_radioButton"]').not('.c-field-row');
        if ($shipToCoRegistrant.length > 0) {
            _transformLeftInputRightLabelFields($shipToCoRegistrant);
        }
    };

    var _transformCoRegistrantAddInput = function($addContainer) {
        var $addLabel = $addContainer.find('label');
        var $input = $addLabel.siblings('input');
        var addText = '+' + $addLabel.text();
        var removeText = '- Remove Co-Registrant';

        $addLabel.addClass('c-button c--plain c--brand u-text-weight-bold u-padding-none');

        if ($input.is(':checked')) {
            $addLabel.text(removeText);
            $addLabel.attr('data-alt-text', addText);
        } else {
            $addLabel.text(addText);
            $addLabel.attr('data-alt-text', removeText);
        }

        $input.attr('hidden', 'true');

        $addLabel.siblings('input').on('change', function(e) {
            var newAlt = $addLabel.text();

            $addLabel.text($addLabel.attr('data-alt-text'));
            $addLabel.attr('data-alt-text', newAlt);

            _transformCoRegistrantShippingOption();
        });
    };

    var _convertToHeading = function($el, headingMarkup) {
        $el
            .text($el.text().toLowerCase())
            .addClass('u-text-capitalize')
            .swap(headingMarkup || 'h3');
    };

    var _transformStep1 = function($pageContainer) {
        if (!$pageContainer.length) {
            return;
        }

        $pageContainer.find('.GR_create_guestOptions_panel')
            .addClass('u-margin-top-lg')
            .insertBefore($pageContainer.find('.GR_create_event_date_panel'));

        $pageContainer.find('.GR_create_event_date_panel')
            .addClass('u-margin-top-lg u-margin-bottom-lg');

        $pageContainer.find('.GR_create_reg_name_panel').insertBefore($pageContainer.find('.GR_create_reg_type_panel'));

        $pageContainer.find('.error_Mesaage_validation').appendTo($errorContainer);

        // this one has nested panels, which will break our panels iterator
        $pageContainer.find('.GR_giftCardsAndGuestOptions_Panel').children().unwrap();

        // spit out all content, transform as we go
        $pageContainer.find('.GR_Creat_Step1Panel').children('div').filter(function() {
            return /\_panel/i.test($(this).attr('class'));
        }).each(function() {
            // each panel is a form field
            _transformFormField($(this));
        });

        _transformButtons($pageContainer);

        // step 1 specific transforms
        $pageContainer.find('#gift_registry_create_content1').prependTo($pageContainer.find('.GR_creat_step1'));
        $pageContainer.find('#gift_registry_create_content1 .infoPages')
            .find('img').remove().end()
            .find('br').replaceWith(' ').end()
            .find('p').addClass('u-margin-bottom-xlg');
        $pageContainer.find('#reqdlabel, .GR_create_registry_option_label').remove();
        $pageContainer.find('.GR_customMessage_Label').addClass('u-margin-bottom-md');
        $pageContainer.find('.GR_message_remainingCharsLabel').addClass('c-field__caption');
        $pageContainer.find('.GR_message_ForGuest_flag')
            .find('label').addClass('c-label').end()
            .find('input').addClass('u-visually-hidden');

        // pinny-specific transforms: pinny wants modal title and cancel button
        // but template has designs with those things out
        if (!$pageContainer.is('.gwt-DialogBox')) {
            $pageContainer.find('.button.secondary, .GR_create_registry_info_label').remove();
        } else {
            _convertToHeading($pageContainer.find('.GR_create_registry_info_label'));
        }
    };

    // unfortunately each step has different form markup
    var _transformStep2 = function($pageContainer) {
        var $registrantPanel = $pageContainer.find('.GR_create_registrantForm_panel');
        if (!$pageContainer.length) {
            return;
        }

        $pageContainer.find('.error_Mesaage_validation').appendTo($errorContainer);
        $('.gwt_steps_error_div').appendTo($errorContainer);

        $pageContainer.find('#registrant_reqdlabel').remove();

        // spit out all content, transform as we go
        $pageContainer.find('.GR-create-stepe2Panel .spot').each(function() {
            _transformSpotFields($(this));
        });

        $pageContainer.find('.GR_create_co-registrantForm_panel').find('div, span').filter(function() {
            return /(\_panel)|(\_flag)/i.test($(this).attr('class'));
        }).each(function() {
            // each panel is a form field
            _transformFormField($(this));
        });

        $pageContainer.find('.GR_create_registrantForm_panel').children('div, span').filter(function() {
            return /(\_panel)|(\_flag)/i.test($(this).attr('class'));
        }).each(function() {
            // each panel is a form field
            _transformFormField($(this));
        });

        _transformButtons($pageContainer);

        _transformCoRegistrantAddInput($pageContainer.find('.gwt-GR-Co-Registrant-Flag'));

        // step 2 specific transforms
        if (!$registrantPanel.is('[style*="none"]')) {
            _convertToHeading($pageContainer.find('.GR-Reg-form-address'));
        }
        _convertToHeading($pageContainer.find('.GR-Co-Reg-form-address').addClass('u-margin-bottom-md'));
        $pageContainer.find('.GR_coRegistrant_sameContant_flag').addClass('c-field-row');
        // CF-834: Hide email sign up flag (same as desktop)
        $pageContainer.find('.GR_promotional_email_flag').attr('hidden', 'true');
        $pageContainer.find('#reqdlabel, .GR_visit_myAccount_section').remove();
        _transformMiddleInitial($pageContainer.find('.address-widget-wwcm-wrapper').first());
        // The co-registrant form has different markup
        _moveMiddleInitial($pageContainer.find('.GR_coRegistrant_midName_panel').children(), $pageContainer.find('.GR_coRegistrant_firstName_panel'));
    };

    var _transformPostEventShippingAddress = function() {
        var $message = $('.GR_shippingAddressDisplayMessage');
        var $shipToPostEventAddress = $('.GR_shipToPostEventAddress_radioButton');

        // Bring the message closer to the label
        $shipToPostEventAddress.find('label').text(
            $shipToPostEventAddress.find('label').text() + ' ' + $message.text()
        );
        // This is no longer needed
        $message.closest('tr').hide();
    };

    var _transformStep3 = function($pageContainer) {
        if (!$pageContainer.length) {
            return;
        }

        $pageContainer.find('.error_Mesaage_validation').appendTo($errorContainer);

        $pageContainer.find('.spot').each(function() {
            _transformSpotFields($(this));
        });

        _transformButtons($pageContainer);

        // step 3 specific transforms
        $pageContainer.find('[class*="_radioButton"]').each(function() {
            _transformLeftInputRightLabelFields($(this));
        });
        _convertToHeading($pageContainer.find('.GR_shipping_address_label').addClass('u-margin-top-md u-margin-bottom-md'));
        $pageContainer.find('.gwt_GR_cancel, #reqdlabel').remove();
        $pageContainer.find('.GR_shippingAddressDisplayMessage').addClass('c-field__caption');
        $pageContainer.find('.button.primary').after($('.GR_creat_step2 .button.secondary'));
        $pageContainer.find('.GR_shippingChoices_panel').addClass('c-table c--wrap');

        $pageContainer.find('.c-table .c-label').map(function(_, label) {
            var $label = $(label);
            $label.text($label.text().toLowerCase());
        });

        _transformPostEventShippingAddress();
    };

    var _bindErrorsViaClick = function() {
        $('body').on('click', '.c-button.c--primary', function() {
            var $button = $(this);

            $button.find('.c-loading')
                .removeAttr('hidden')
                .siblings('span')
                .attr('hidden', 'true');
            // TODO: this timeout is too long
            setTimeout(function() {
                var $errors = $('.error_Mesaage_validation, .gwt-csb-error-panel .gwt-HTML').filter(function() {
                    return $(this).text() !== '';
                });

                if (!$errors.length) {
                    return;
                }

                $button
                    .find('.c-loading')
                    .attr('hidden', 'true')
                    .siblings('span')
                    .removeAttr('hidden');

                $('.c--error').removeClass('c--error');
                Adaptive.$('.errortxt').closest('.c-field').addClass('c--error');

                Utils.decorateErrorsAlert();

            }, 1000);
        });
    };

    return {
        transformFormField: _transformFormField,
        transformSpotFields: _transformSpotFields,
        transformButtons: _transformButtons,
        transformStep1: _transformStep1,
        transformStep2: _transformStep2,
        transformStep3: _transformStep3,
        bindErrorsViaClick: _bindErrorsViaClick
    };
});
