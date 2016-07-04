define([
    '$',
    'components/sheet/sheet-ui',
    'swap'
], function($, sheet) {

    var shouldAddHeader = false;


    var bindEvents = function() {
        var $tooltipPinny = $('.js-tooltip-pinny');
        var tooltipSheet;

        sheet.init($tooltipPinny);

        tooltipSheet = $tooltipPinny.data('component');

        $('body').on('click', '.js-tooltip-button', function(e) {
            var $button = $(this);
            var $target = $button.siblings($button.attr('data-target'));
            var $tooltipContent = $target.find('.inst-copy, .js-content').clone();
            var title = $target.attr('data-title');
            e.preventDefault();
            e.stopPropagation();

            if (!$tooltipContent.length) {
                $tooltipContent = $target.children().clone();
            }

            if (title) {
                tooltipSheet.setTitle(title);
            }else if (shouldAddHeader) {
                var $header = $tooltipContent.find('strong').first();
                $header.nextAll('br').remove();
                tooltipSheet.setTitle($header.remove().text());
            }

            if ($tooltipContent.hasClass('js-delivery-notice')) {
                $tooltipContent.find('strong[style]').remove();
            }

            $tooltipContent.removeAttr('style');
            $tooltipContent.removeClass('nodisplay');
            $tooltipContent.find('b').swap('span');
            $tooltipContent.find('img').wrap('<div class="u-text-align-center">');
            $tooltipContent.find('p').addClass('u-margin-bottom-lg');

            tooltipSheet.setBody($tooltipContent);
            tooltipSheet.open();
        });
    };


    var tooltipUI = function(addHeader) {
        if (addHeader) {
            shouldAddHeader = addHeader;
        }
        bindEvents();
    };

    return tooltipUI;
});
