define([
    '$',
    'components/sheet/sheet-ui'
], function($, sheet) {


    var $signInPinny = $('.js-sign-in-pinny');

    var _appendRow = function($container, $label, $input, isCheckbox, $additionalLink) {
        var $row = $('<div class="c-field">');
        if (isCheckbox) {
            // Reverse the order
            $row.append($input.addClass('c-input'));
            $row.append($label.addClass('c-label'));

            $input.wrap('<div class="c-check-radio"></div>');
            $('<svg class="c-icon c-check-radio__icon"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-checkmark"></use></svg>').insertAfter($input);
        } else {
            $row.append($label.addClass('c-label'));
            $row.append($input);
        }

        if ($additionalLink && $additionalLink.length) {
            $label.after($additionalLink);
        }

        $container.append($('<div class="c-field-row">').append($row));
    };

    var _bindModalEvents = function() {
        $('.js-sign-in, .js-reset-pw').on('click', function(e) {
            $('.errortxt').parent().addClass('c--error');
        });
    };

    var _transformSignInModal = function($content) {
        var $mainTable = $content.find('table');
        var $leftPanel = $mainTable.find('.leftPnl');
        var $newContent = $('<div>');
        var $password = $leftPanel.find('.forgotPWlink');
        var $errorPanel = $leftPanel.find('.gwt-forgot-password-error-panel');

        // Error Panel
        $newContent.append($errorPanel);
        $errorPanel.addClass('u-text-warning u-margin-bottom-md');

        // Email
        _appendRow($newContent, $leftPanel.find('#logonLabelId'), $leftPanel.find('#logonId'), false);

        // Password
        $password.text('Forgot your password?');
        $password.addClass('c-field__hint');
        _appendRow($newContent, $leftPanel.find('#passwordLabelId'), $leftPanel.find('#logonPasswordId'), false, $password);

        // remember Me
        var $rememberMeContainer = $leftPanel.find('.rememberMe');
        _appendRow($newContent, $rememberMeContainer.find('label'), $rememberMeContainer.find('input'), true);

        // CF-165: Make required stars red
        $newContent.find('.required').addClass('u-text-warning');

        // Add Buttons
        $newContent.append($mainTable.find('.button.primary').addClass('c-button c--primary c--full-width u-margin-top-md js-sign-in'));
        $newContent.append($mainTable.find('.button.secondary').addClass('u-visually-hidden js-sign-in-close'));

        // Create account
        var $createAccount = $leftPanel.find('.gwt-signInModal-register-panel');
        $createAccount.find('.gwt-Label').remove();
        $createAccount.find('.registerLink').addClass('c-button c--outline c--full-width');

        // Or divider
        var $orDivider = $('<p class="c-note u-text-align-center u-margin-top-md u-margin-bottom-md">or</p>');
        $createAccount.prepend($orDivider);

        $newContent.append($createAccount);


        $mainTable.replaceWith($newContent);
    };

    var _transformForgotPWModal = function($content) {
        var $emailRow = $('<div class="c-field">');
        var $emailLabel = $content.find('#emailBoxLabel');
        var $introNote = $emailLabel.prev();
        var newText = '';
        var $errorPanel = $content.find('.gwt-forgot-password-error-panel');

        $emailLabel.addClass('c-label');
        $emailRow.append($emailLabel.add($content.find('#emailbox')));
        $introNote.after($('<div class="c-field__row">').append($emailRow));
        $errorPanel.addClass('u-margin-bottom-md u-text-warning');

        var $example = $content.find('.c-field__row').next();

        $content.find('.c-field__row').addClass('u-margin-top-md');
        $content.find('.emailbox').attr('placeholder', $example.text());
        $content.find('br').remove();
        $example.remove();

        var $instructions = $content.find('.note').not(':empty')
            .addClass('u-text-capitalize');
        var $callNumberInstruction = $instructions.last();
        $callNumberInstruction
            .addClass('u-margin-top-md')
            .insertBefore($content.find('.c-field__row').first());

        // transform Buttons
        $content.find('.button.primary').addClass('c-button c--primary c--full-width u-margin-top-md js-reset-pw');
        $content.find('button.secondary').addClass('u-visually-hidden js-close-modal');
    };

    var _showSignInModal = function($desktopSignInModal) {
        var $popupPanel = $('.gwt-PopupPanelGlass');
        $popupPanel.hide();

        var title = $desktopSignInModal.find('.Caption .gwt-HTML').text();
        var $content = $desktopSignInModal.find('.dialogContent');

        _transformSignInModal($content);
        _bindModalEvents();

        $signInPinny.find('.c-sheet__title').html(title);
        $signInPinny.find('.c-sheet__body').html($content);

        // CF-732: need to have our pinny _inside_ desktop modal
        $desktopSignInModal
            .wrapInner('<div hidden>')
            .append($signInPinny.parent());

        $signInPinny.pinny('open');
    };

    var _showForgotPasswordModal = function($forgotPasswordModal) {
        var $content = $forgotPasswordModal.find('.gwt-submit-cancel-dialog-content-panel');
        $signInPinny.addClass('js--forgot-pw');
        $signInPinny.find('.pinny__title').text('Reset Password');
        $signInPinny.find('.c-sheet__body').html($content);

        _transformForgotPWModal($content);
        _bindModalEvents();

        // The pinny has to be within the outer modal container, so all elements inside it are still clickable.
        // This GWT modal has been set to block all clicks outside of the modal itself.
        // So we need all of the pinny elements within it so it can still function
        // The pinny will be added back to the correct position when it closes.
        $forgotPasswordModal.removeAttr('style');
        $forgotPasswordModal.html($signInPinny.parent());
        $forgotPasswordModal.append($('.js-sign-in-shade'));
    };

    var _onSheetClose = function() {
        var $lockup = $('.lockup__container');

        if ($signInPinny.hasClass('js--forgot-pw')) {
            $signInPinny.removeClass('js--forgot-pw');
            // Click cancel button
            $signInPinny.find('.js-close-modal span').click();
            $signInPinny.find('.js-close-modal span').trigger('click');
            // Reset pinny markup.
            $signInPinny.parent().appendTo($lockup);
            $('.js-sign-in-shade').appendTo($lockup);
        } else {
            // Click login modal cancel
            $signInPinny.find('.js-sign-in-close span').click();
            $signInPinny.find('.js-sign-in-close span').trigger('click');
        }
    };

    var _initSheet = function() {
        sheet.init($signInPinny, {
            shade: {
                cssClass: 'js-sign-in-shade'
            },
            closed: _onSheetClose
        });
    };

    return {
        initSheet: _initSheet,
        showSignInModal: _showSignInModal,
        showForgotPasswordModal: _showForgotPasswordModal
    };
});
