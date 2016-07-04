define([
    '$',
    'components/sheet/sheet-ui'
],
function($, Sheet) {

    var $noticePinny;
    var noticeSheet;

    var _triggerModal = function() {
        if (event.animationName === 'modalAdded') {
            var $modal = $('.gwt-gift-registry-delete-confirmation-dialog');

            if ($modal.length) {
                var $button = $modal.find('.okCancelPanel button');

                $button.addClass('c-button c--full-width');

                $modal.prev('.gwt-PopupPanelGlass').remove();
                $modal.remove();

                noticeSheet.setTitle($modal.find('.Caption'));
                noticeSheet.setBody($button.parent());
                noticeSheet.open();

                $button.on('click', function() {
                    noticeSheet.close();
                });
            }
        }
    };

    var _bindEvents = function() {
        $noticePinny = $('.js-notice-pinny');
        noticeSheet = Sheet.init($noticePinny);
        document.addEventListener('animationStart', _triggerModal);
        document.addEventListener('webkitAnimationStart', _triggerModal);
    };

    var homeUI = function() {
        _bindEvents();
    };

    return homeUI;
});
