define([
    '$',
    'global/utils/dom-operation-override',
    'components/sheet/sheet-ui',
    'dust!pages/checkout-sign-in/partials/forgot-password-modal'
], function(
    $,
    DomOverride,
    Sheet,
    ForgotPasswordModalTemplate
) {
    var $accountPinny;
    var $accountShade;
    var accountSheet;

    var _resetPinny = function() {
        var $lockup = $('.lockup__container');
        $accountPinny.parent().appendTo($lockup);
        $accountShade.appendTo($lockup);

    };

    var bindModalEvent = function(callback) {
        $('.js-forgot-password__continue').on('click', function() {
            var $desktopModal = $('#passwordReset .js-original');

            $desktopModal.find('.emailbox').val($('.js-forgot-password-pinny-content .emailbox').val()).triggerGWT('keyup');
            $desktopModal.find('.button.primary').triggerGWT('click');
            setTimeout(callback, 1000);
        });

        $('.js-forgot-password__close').on('click', function() {
            accountSheet.close();
        });
    };

    /*
        The forgot password form and the success is of the same modal without refresh.
        We are handling both cases here
    */
    var parseForgotPasswordModal = function() {
        var $modal = $('#passwordReset');
        var $modalContent = $modal.find('.formboxwidth > div:not([style*="display: none"])');

        var $message = $modalContent.find('.note').filter(function() {
            return $.trim($(this).text()) !== '';
        });
        var $assistanceMessage;

        if (!$message.length) {
            $message = $modalContent.find('p');
        } else {
            $assistanceMessage = $message.slice(-1);
            $message = $message.slice(0, 1);
        }

        $modal.removeAttr('style');
        $modal.children(':not(.c-sheet, .shade)').addClass('js-original').attr('hidden', 'true');

        new ForgotPasswordModalTemplate({
            message: $message.first().text(),
            isError: $modalContent.find('.errortxt').length ? true : null,
            errorMsg: $modalContent.find('.gwt-csb-error-panel').children(),
            textInput: $modalContent.find('.emailbox').attr('placeholder', 'name@domain.com'),
            assistanceMessage: $assistanceMessage,
        }, function(err, html) {
            accountSheet.setBody(html);
            accountSheet.setTitle('Forgot Password');

            if (!accountSheet.isOpen) {
                $modal.append($accountPinny.parent());
                $modal.append($accountShade);
            }
            accountSheet.open();

            bindModalEvent(parseForgotPasswordModal);
        });
    };

    var init = function() {
        $accountPinny = $('.js-account-pinny');
        accountSheet = Sheet.init($accountPinny, {
            shade: {
                cssClass: 'js-account-shade'
            },
            closed: function() {
                var $originalModal = $('#passwordReset');
                var $cancelButton;

                _resetPinny();
                $cancelButton = $originalModal.find('.button.secondary');

                if (!$cancelButton.length) {
                    $cancelButton = $originalModal.find('.button.primary').first();
                }

                $cancelButton.triggerGWT('click');
            }
        });
        $accountShade = $('.js-account-shade');
        DomOverride.on('domAppend', '#passwordReset', parseForgotPasswordModal);
        DomOverride.on('domRemove', '#passwordReset', _resetPinny);
    };

    return {
        init: init
    };
});
