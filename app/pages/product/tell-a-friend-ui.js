define([
    '$',
    'global/utils',
    'components/sheet/sheet-ui',
    'bellows',
    'dust!components/product-summary/product-summary'
], function($, Utils, sheet, bellows, productSummaryTemplate) {
    var $tafPinny = $('.js-taf-pinny');

    var addTAFFieldsAndLabels = function($newContent, $nameLabel, $emailLabel, $nameInput, $emailInput, isRecipient) {
        var $nameContainer = $('<div class="c-field">');
        var $emailContainer = $('<div class="c-field">');

        $emailInput.attr('type', 'email');

        $nameLabel.addClass('c-label');
        if ($nameLabel.attr('id') !== undefined) $nameLabel.html($nameLabel.html() + ' <span class="u-text-warning">*</span>');
        $emailLabel.addClass('c-label');
        if ($emailLabel.text().indexOf('*') === -1) $emailLabel.html($emailLabel.html() + ' <span class="u-text-warning">*</span>');

        $nameContainer.append($nameLabel);
        $emailContainer.append($emailLabel);

        $nameContainer.append($nameInput);
        $emailContainer.append($emailInput);

        if (isRecipient) {
            var $recipientGroup = $('<div class="js-taf__recipients">');
            $recipientGroup.append($('<div class="c-field-row">').append($nameContainer));
            $recipientGroup.append($('<div class="c-field-row">').append($emailContainer));

            if (!$newContent.length) {
                return $recipientGroup;
            }

            $newContent.append($recipientGroup);
        } else {
            $newContent.append($('<div class="c-field-row">').append($nameContainer));
            $newContent.append($('<div class="c-field-row">').append($emailContainer));
        }
    };

    var addSenderFields = function($newContent, $form) {
        var $senderEmailLabel = $form.find('#sender_email');
        var $labelRow = $senderEmailLabel.parent().parent();
        var $senderNameLabel = $labelRow.find('.global-Modal-Label').first();
        var $inputs = $labelRow.next().find('input');

        $senderEmailLabel.html($senderEmailLabel.html().replace(/\*/g, '<span class="u-text-warning">*</span>'));

        addTAFFieldsAndLabels($newContent, $senderNameLabel, $senderEmailLabel, $inputs.first(), $inputs.last());
    };

    var addRecipient = function() {
        var $recipientsGroups = $('.js-taf__recipients');
        var $originalTable = $('.js-original-table');
        var newIndex = $recipientsGroups.length;
        var currentIndex = newIndex - 1;
        var $newEmail = $originalTable.find('[id*="reciepient_email"]');
        var $newName = $originalTable.find('[id*="reciepient_name"]');
        var $inputs = $originalTable.find('input');
        var $newGroup = addTAFFieldsAndLabels($(), $newName, $newEmail, $inputs.first(), $inputs.last(), true);

        // add remove button if necessary
        if (!$newGroup.find('.js-taf__remove').length) {
            var $fieldTop = $newGroup.find('.c-label').first();
            $originalTable.find('.gwt-remove-link')
                .addClass('js-taf__remove u-text-success u-text-weight-bold u-margin-top-md u-margin-bottom-md u-text-size-small')
                .insertBefore($fieldTop);
        }

        $newGroup.insertAfter($recipientsGroups.last());
    };

    // remove inline styles on the 'Add Another Friend' link
    var transformAddRecipientLink = function() {
        var $addRecipientLink = $('.gwt_add_address_link');
        $addRecipientLink.attr('style', '');
    };

    var bindTAFEvents = function() {
        $('.js-taf__add-recipient').on('click', function() {
            addRecipient();

            Utils.checkValidation($('.js-taf-content .gwt-TextBox'), $('.js-taf__send'));

            transformAddRecipientLink();
        });

        $('body').on('click', '.js-taf__remove', function(e) {
            e.preventDefault();
            $(this).parents('.js-taf__recipients').remove();
            Utils.checkValidation($('.js-taf-content .gwt-TextBox'), $('.js-taf__send'));

            transformAddRecipientLink();
        });

        $('.js-taf__cancel').on('click', function(e) {
            if ($tafPinny.parent().hasClass('pinny--is-open')) {
                $tafPinny.pinny('close');
            }
        });

        $('.js-taf__send').on('click', function(e) {
            $('.js-taf-content').find('.errortxt').parent().addClass('c--error');
        });

        $('.js-taf__message').on('focus input keyup', function(e) {
            if (this.scrollHeight > this.offsetHeight) {
                var $textArea = $(this);
                $textArea.height($textArea.height() + 20);
            }
        });

        $('.js-taf-content').on('blur keyup', '.gwt-TextBox', function() {
            Utils.checkValidation($('.js-taf-content .gwt-TextBox'), $('.js-taf__send'));
        });
    };

    var addSendMeACopy = function($newContent, $form) {
        var $copyCheckbox = $form.find('.gwt-CheckBox input');
        var $checkboxContainer = $('<div class="c-field"><div class="c-check-radio"></div></div>');
        var $checkBoxLabel = $('<span class="c-label"></span>');
        var $checkBoxLabelDiv = $copyCheckbox.parent().parent().next().find('.global-Modal-Label');

        $checkBoxLabel.text($checkBoxLabelDiv.text());
        $copyCheckbox.addClass('c-input');

        $checkboxContainer.find('label').addClass('c-label').prepend();
        $checkboxContainer.find('div').append($copyCheckbox);
        $checkboxContainer.append($checkBoxLabel);
        $checkboxContainer.find('div').append($('<svg class="c-icon c-check-radio__icon"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-checkmark"></use></svg>'));
        $newContent.append($('<div class="c-field-row u-margin-top-md">').append($checkboxContainer));

        $checkboxContainer.children().wrap('<label>');
    };

    var _insertBellowsRow = function($bellows, className, headerText) {
        $('<div class="c-accordion__item bellows__item ' + className + '">' +
        '<button class="c-accordion__header bellows__header">' + headerText + '<svg class="c-icon c-accordion__chevron"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-arrow-downward"></use></svg></button>' +
        '<div class="c-accordion__content bellows__content"><div class="u-margin-bottom-md"></div></div>' + '</div>').appendTo($bellows);
    };

    var transformTellAFriend = function($tafContent) {
        var $gridContent = $tafContent.find('.gwt-tell-a-friend-input-grid');
        var $form = $gridContent.find('.gwt-tell-a-friend-form');
        var $recNameLabels = $form.find('[id*="reciepient_name"]');
        var $recEmailLabels = $form.find('[id*="reciepient_email"]');
        var $newContent = $('<div>');
        var $tellAFriend = $form.find('.gwt-tell-a-friend-remaining-lbl');
        var $addFriendMsgLbl = $form.find('.gwt-tell-a-friend-add-message-lbl');
        var $errorPanel = $gridContent.find('.gwt-taf-error-panel').addClass('u-text-warning');

        // // Add Error Container.
        $newContent.append($errorPanel);
        $errorPanel.addClass('u-text-warning u-margin-bottom-md');

        // Add Recipient labels/inputs
        $recNameLabels.each(function(i, nameLabel) {
            var $nameLabel = $(nameLabel);
            var $emailLabel = $recEmailLabels.eq(i);
            var $labelRow = $nameLabel.parent().parent();
            var $inputs = $labelRow.next().find('input');

            addTAFFieldsAndLabels($newContent, $nameLabel, $emailLabel, $inputs.first(), $inputs.last(), true);
        });

        // Add address link
        $newContent.append($form.find('.gwt_add_address_link').addClass('c-field-row c-reveal__trigger js-taf__add-recipient'));
        $newContent.find('.js-taf__add-recipient').text('+ ' + $newContent.find('.js-taf__add-recipient').text());

        // Sender Info
        addSenderFields($newContent, $form);

        // personalized msg
        $tellAFriend.addClass('c-field__caption c-note u-text-align-right');
        $addFriendMsgLbl.addClass('c-label u-margin-top-md u-margin-bottom');

        $newContent.append($addFriendMsgLbl);
        $newContent.append($form.find('textarea').addClass('js-taf__message'));
        $newContent.append($tellAFriend);

        // Send me a copy
        addSendMeACopy($newContent, $form);

        // Product info section
        var $productInfo = $('<div class="c-product-summary c-arrange c--gutters u-margin-bottom-lg"></div>');
        var $productImg = $gridContent.find('.tell-a-friend-image');

        if (!$productImg.attr('src')) {
            $productImg[0].onload = function() {
                Adaptive.$('.c-product-summary__image-container .tell-a-friend-image').attr('src', Adaptive.$(this).attr('src'));
            };
        }

        // TODO: Look into using product summary component instead.
        var productSummaryData = {
            image: $productImg.clone().addClass('c-product-summary__image'),
            heading: $('.x-main h1').text(),
            price: {
                salePrice: $('.js-pricing .c-price__sale').length ? $('.js-pricing .c-price__sale').text() : '',
                retailPrice: $('.js-pricing .c-price__sale').length ? $('.js-pricing .c-price__original').text() : $('.js-pricing .c-price__retail').text()
            },
            imageContainerClass: 'c--medium',
            leftColumnClass: 'c--shrink',
            containerClass: 'u-padding-bottom'
        };

        productSummaryTemplate(productSummaryData, function(_, out) {
            var divider = '<hr class="c-divider c--grey c--bleed c--solid c--no-margin u-margin-top-lg">';
            $(out).insertAfter($newContent.find('.gwt-taf-error-panel')).append(divider);
            $newContent.find('.gwt-taf-error-panel').addClass('t-product__error-panel');
        });

        // CTA buttons
        $newContent.append($tafContent.find('.button.primary').addClass('c-button c--primary c--full-width u-margin-bottom-sm u-margin-top-md js-taf__send').attr('disabled', true));
        $newContent.append($tafContent.find('.button.secondary').addClass('c-button c--outline c--full-width js-taf__cancel u-visually-hidden'));

        // Organize info into bellows
        // var $bellows = $('<div class="c-accordion bellows js-taf-bellows"></div>');
        //
        // _insertBellowsRow($bellows, 'js-taf-friend-info bellows--is-open', 'Friends Information');
        // _insertBellowsRow($bellows, 'js-taf-sender-info', 'Sender Information');
        // _insertBellowsRow($bellows, 'js-taf-personal-msg', 'Personalized Message');

        // $newContent.find('.js-taf__recipients, .js-taf__add-recipient').appendTo($bellows.find('.js-taf-friend-info .bellows__content div'));
        // $newContent.find('> .c-field-row').appendTo($bellows.find('.js-taf-sender-info .bellows__content div'));
        // $newContent.find('.gwt-tell-a-friend-add-message-lbl, .js-taf__message, .gwt-tell-a-friend-remaining-lbl').appendTo($bellows.find('.js-taf-personal-msg .bellows__content div'));

        // $bellows.insertAfter($newContent.find('.gwt-taf-error-panel'));
        // $bellows.bellows();

        $form.addClass('js-original-table');
        $tafContent.children().attr('hidden', 'true');
        $tafContent.prepend($newContent);

        bindTAFEvents();
    };

    var initSheet = function() {
        // Initialize these separately from the other plugins,
        // since we don't have to wait until the product image is loaded for these.
        sheet.init($tafPinny, {
            closed: function() {
                var $tafCancel = $('.js-taf__cancel');
                if ($('#gwt-tell-a-friend-modal').length) {
                    // Force the desktop modal to close if it's not already closed.
                    $tafCancel.click();
                    $tafCancel.find('span').click();
                }
            }
        });
    };

    var init = function() {
        var _oldTellAFriend = window.doTellAFriendClickAction;

        initSheet();

        window.doTellAFriendClickAction = function() {
            _oldTellAFriend.apply(this, arguments);

            var $modal = $('#gwt-tell-a-friend-modal');
            var headerText = 'Tell A Friend';
            var $body = $modal.find('.dialogContent');

            $tafPinny.find('.c-sheet__title').html(headerText);

            // we can't use a partial template here without losing all event listeners
            // So instead we need to transform the content in place
            transformTellAFriend($body);

            $tafPinny.find('.js-taf-content').html($body);

            $modal.prev('.gwt-PopupPanelGlass').hide();
            $modal.hide();

            $tafPinny.pinny('open');

        };
    };

    var _closeModal = function() {
        $tafPinny.pinny('close');
    };

    return {
        init: init,
        closeModal: _closeModal
    };
});
