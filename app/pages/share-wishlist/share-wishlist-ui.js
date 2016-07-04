define([
    '$',
    'global/utils/dom-operation-override',
    'global/parsers/alert-parser',
    'dust!pages/share-wishlist/partials/share-form',
    'dust!pages/share-wishlist/partials/input-row',
    'components/alert/alert-ui',
    'global/parsers/registry-form-parser-ui'
],
function($, domOverride, alertParser, ShareFormTemplate, InputRowTemplate, Alert, formParserUI) {

    var _replaceInputs = function($container, $inputs) {
        $container.find('.js-input').each(function(i, inputContainer) {
            var $inputContainer = $(inputContainer);
            var $input = $inputs.eq(i);
            var $fieldContainer = $inputContainer.closest('.c-field');
            var labelId = $fieldContainer.find('.c-field__label').attr('id');

            if (labelId) {
                if (/email/i.test(labelId)) {
                    $input.attr('type', 'email');
                }
            }

            $inputContainer.prepend($input.removeAttr('style').addClass('c-input'));
        });
    };

    var _bindEvents = function() {
        $('body').on('click', '.js-add-field', function(e) {
            var $addButton = $(this);
            var $originalForm = $('.js-original-form');
            var $inputs = $originalForm.find('input');
            var fieldCount = $('.js-field-set').length;
            var templateContent = {
                inputRow: $originalForm.find('.gwt-Label').remove().map(function(i, label) {
                    var $label = $(label);
                    var $required = $label.find('.required').remove();

                    // Sometimes their labels have an asterisk character that's not
                    // wrapped in '.required'
                    if ($required.length) {
                        // Some labels have an additional asterisk outside of '.required' container
                        // we'll clean up the label by removing that extra asterisk first
                        $label.html($label.html().replace(/\*/g, ''));
                        $('<span class="u-margin-start-sm u-text-warning">*</span>').appendTo($label);
                    } else {
                        $label.html($label.html().replace(/\*/g, '<span class="u-text-warning">*</span>'));
                    }

                    return {
                        label: $label.addClass('c-field__label'),
                        includeAddButton: false,
                        includeRemoveButton: i === 0
                    };
                }),
                includeDivider: !fieldCount,
                isAdditionalField: true
            };

            e.preventDefault();
            $addButton.children().removeAttr('style');

            new InputRowTemplate(templateContent, function(err, html) {
                var $rows = $(html);
                _replaceInputs($rows, $inputs);
                $rows.find('.js-remove-field').append($originalForm.find('.gwt-GR-share-remove-link'));
                $addButton.before($rows);
                if (fieldCount === 8) {
                    // we've added the 9th additional row
                    // desktop limits these to only 10 fields total so hide the add button
                    $addButton.attr('hidden', 'true');
                }
            });
        });

        $('body').on('click', '.js-remove-field', function(e) {
            var $addButton = $('.js-add-field');
            $(this).closest('.js-field-set').remove();
            // Make sure the add field button is visible
            $addButton.removeAttr('hidden');
            $addButton.children().removeAttr('style');

            if (!$addButton.children().length) {
                $addButton.append($('.gwt_add_address_link:not(.gwt-GR-share-remove-link)'));
            }
        });

        $('body').on('focus input keyup', '.js-taf__message', function(e) {
            if (this.scrollHeight > this.offsetHeight) {
                var $textArea = $(this);
                $textArea.height($textArea.height() + 20);
            }
        });
    };

    var _getTemplateContent = function($form) {
        var $modalLabels = $form.find('.global-Modal-Label');
        return {
            inputRow: $form.find('.gwt-Label').remove().map(function(i, label) {
                var $label = $(label);
                var $required = $label.find('.required').remove();

                // Sometimes their labels have an asterisk character that's not
                // wrapped in '.required'
                if ($required.length) {
                    // Some labels have an additional asterisk outside of '.required' container
                    // we'll clean up the label by removing that extra asterisk first
                    $label.html($label.html().replace(/\*/g, ''));
                    $('<span class="u-margin-start-sm u-text-warning">*</span>').appendTo($label);
                } else {
                    $label.html($label.html().replace(/\*/g, '<span class="u-text-warning">*</span>'));
                }

                return {
                    label: $label.addClass('c-field__label'),
                    includeAddButton: $label.is('#reciepient_email_0')
                };
            }),
            sendCopyText: $modalLabels.first().text(),
            personalizationLabel: $modalLabels.last().text()
        };
    };

    var _replaceContent = function($shareForm, $form) {
        var $saveButton = $form.find('.primary');
        var $cancelButton = $form.find('.secondary');
        var $inputs = $form.find('input, textarea');
        var $addField = $form.find('.gwt_add_address_link');

        _replaceInputs($shareForm, $inputs);

        $addField.addClass('c-button c--plain c--brand c--plus u-bleed-start c--small u-text-weight-bold');
        $saveButton.addClass('c-button c--primary c--full-width u-margin-bottom-md u-margin-top-md');
        $cancelButton.addClass('c-button c--outline c--full-width');

        $shareForm.find('.js-message-count').append($form.find('.character-count-label'));
        $shareForm.find('.js-add-field').append($addField);
        $shareForm.find('.js-buttons').append($saveButton);
        $shareForm.find('.js-buttons').append($cancelButton);
    };

    var _transformForm = function() {
        var $form = $(arguments[0]);
        var templateContent = _getTemplateContent($form);

        $form.attr('hidden', 'true');
        $form.addClass('js-original-form');

        new ShareFormTemplate(templateContent, function(err, html) {
            var $shareForm = $(html);
            _replaceContent($shareForm, $form);

            $('.js-share-form').html($shareForm);
        });
    };

    var shareWishlistUI = function() {
        _bindEvents();
        Alert.init();
        formParserUI.bindErrorsViaClick();
        domOverride.on('domAppend', '', _transformForm, '#gwt_gift_registry_share');
    };

    return shareWishlistUI;
});
