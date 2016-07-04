define([
    '$',
    'hijax',
    'components/sheet/sheet-ui',
    'global/utils/dummy-element',
    'dust!pages/sign-in/partials/reset-password-main-content',
    'dust!pages/sign-in/partials/reset-password-buttons',
], function(
    $,
    Hijax,
    Sheet,
    DummyElement,
    resetPasswordContentTemplate,
    resetPasswordButtonTemplate
) {

    var sheet;
    var $sheet;

    var _transformMainContent = function($contentContainer) {
        var $emailInput = $contentContainer.find('#emailbox');
        var placeholderText = $contentContainer.find('.note').filter(function() {
            return /example:/i.test($(this).text());
        }).remove().text();

        $emailInput
            .attr('placeholder', placeholderText)
            .attr('type', 'email');

        var $emailLabel = $contentContainer.find('#emailBoxLabel');

        if (!$emailLabel.is('label')) {
            $emailLabel = $('<label>').html($emailLabel);
            $emailLabel.attr('for', $emailInput.attr('id'));
        }

        var data = {
            email: {
                label: DummyElement.getSubstitute($emailLabel),
                input: DummyElement.getSubstitute($emailInput),
            },
            error: DummyElement.getSubstitute($contentContainer.find('#forgotPWErrorPanel')),
            notes: $contentContainer.find('.note').remove('br')
        };

        resetPasswordContentTemplate(data, function(err, html) {
            $contentContainer.html(html);
            DummyElement.replaceAllSubstitutes($contentContainer);
        });
    };

    var _transformButtons = function($buttonsContainer) {
        var $continueButton = $buttonsContainer.find('.button.primary');
        var data = {
            continueButton: DummyElement.getSubstitute($continueButton),
            closeButton: DummyElement.getSubstitute($buttonsContainer.find('.button.secondary'))
        };

        resetPasswordButtonTemplate(data, function(err, html) {
            $buttonsContainer.html(html);
            DummyElement.replaceAllSubstitutes($buttonsContainer);
        });
    };

    var toggleErrors = function() {
        // These was an error. Find and show it.
        var errorsExist = $('#forgotPWErrorPanel .gwt-HTML').length > 0;
        $('.js-forgot-password-sheet').find('.c-error-text').toggle(errorsExist);
    };

    var _initHijax = function() {
        var hijax = new Hijax();

        hijax.set(
            'formHasJustBeenSubmitted',
            function(url) {
                return url.indexOf('ForgotPasswordInitiate') > -1;
            }, {
                complete: function(data, xhr) {
                    if (data.success === 'true') {
                        var $modalData = $('.formboxwidth').find('.gwt-HTML');
                        var $sheetBody = $sheet.find('.c-sheet__body').removeAttr('style');
                        // We'll need these buttons later for cleaning up desktop modal
                        var $sheetButtons = $sheet.find('.gwt-submit-cancel-dialog-button-panel').detach();

                        sheet.setTitle('Reset Password');
                        sheet.setBody('');

                        $sheetButtons.hide().appendTo($sheetBody);
                        $modalData.appendTo($sheetBody);
                    }

                    toggleErrors();
                }
            }
        );
    };

    var overrideShowForgotpasswordModal = function() {
        var desktopShowForgotPasswordModal = window.showForgotPasswordModal;

        if (!desktopShowForgotPasswordModal) {
            setTimeout(overrideShowForgotpasswordModal, 100);
            return;
        }

        window.showForgotPasswordModal = function() {
            desktopShowForgotPasswordModal.apply(this, arguments);

            sheet.setTitle('Reset Password');
            sheet.setBody('');

            var $sheetBody = $sheet.find('.c-sheet__body');
            var $desktopModal = $('#passwordReset');
            var $contentContainer = $desktopModal.find('#emailbox').parent().detach();
            var $buttonsContainer = $desktopModal.find('.gwt-submit-cancel-dialog-button-panel').detach();
            $contentContainer.attr('style', null);
            $contentContainer.appendTo($sheetBody);
            $buttonsContainer.appendTo($sheetBody);

            _transformMainContent($contentContainer);
            _transformButtons($buttonsContainer);

            var $continueButton = $buttonsContainer.find('.button.primary');
            $continueButton.on('click', function() {
                // Add our error class, if necessary
                $contentContainer.find('.errortxt')
                    .closest('.c-field').addClass('c--error');

                // Remove the error class when no longer needed
                var $errors = $contentContainer.find('.c--error');
                var $noLongerErrors = $errors.not($errors.has('.errortxt'));
                $noLongerErrors.removeClass('c--error');

                // SHow or hide errors.
                toggleErrors();
            });

            // CF-225:
            // On Android, for our modal to be clickable/functional, it needs to be inside of desktop's
            $desktopModal
                .removeAttr('style')
                .append($sheet.closest('.pinny'));

            sheet.open();
        };

        $('.js-forgot-password-link').removeAttr('disabled');
    };

    var fixIOSScroll = function() {
        if (!$.os.ios) { return; }

        var scrollPosition = 0;
        var inputSelector = '.js-forgot-password-sheet input';
        $('body')
            .on('touchstart', inputSelector, function() {
                scrollPosition = document.body.scrollTop;
            })
            .on('blur', inputSelector, function() {
                document.body.scrollTop = 0;
            });
    };

    var resetPasswordUI = function() {
        $sheet = $('.js-forgot-password-sheet');
        sheet = Sheet.init($sheet, {
            close: function() {
                var $desktopModal = $('#passwordReset');
                var $desktopCloseButton = $desktopModal.find('.gwt-submit-cancel-dialog-button-panel button.secondary');

                if ($desktopCloseButton.length === 0) {
                    // Desktop, why you change your markup..
                    $desktopCloseButton = $desktopModal.find('.gwt-submit-cancel-dialog-button-panel button.primary').not('[disabled]');
                }

                // Make sure desktop modal is cleaned up properly
                $desktopCloseButton.triggerGWT('click');
            }
        });

        _initHijax();
        overrideShowForgotpasswordModal();

        // CF-141: Opening the iOS keyboard will bump the body up but not restore it,
        // we need to set the scroll position back to it's original on blur.
        fixIOSScroll();
    };

    return resetPasswordUI;
});
