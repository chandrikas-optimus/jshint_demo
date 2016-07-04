define([
    '$',
    'components/sheet/sheet-ui',
    'global/utils/dom-operation-override',
    'external!global/utils'
], function($, sheet, domOverride, Utils) {

    var $addressPinny = $('.js-address-pinny');
    var $chevronIcon = $('<svg class="c-icon "><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-arrow-downward"></use></svg>');
    var $addressShade;
    var $addressButton;

    var _closeCallback = function() { return;};

    var _addCloseCallback = function(cb) {
        _closeCallback = cb;
    };

    var _resetPinny = function() {
        var $lockup = $('.lockup__container');
        $addressPinny.parent().appendTo($lockup);
        $addressShade.appendTo($lockup);

        $addressPinny.pinny('close');
        _closeCallback();
    };

    var desktopCloseCallback = function(removedElement) {
        _resetPinny();
    };

    var _bindEvents = function() {
        domOverride.on('domRemove', '.ok-cancel-dlog', desktopCloseCallback, '');

        $('body').on('click', '.js-address-pinny .pinny__close', function(e) {
            $addressPinny.find('.js-close-modal').click();
            $addressPinny.find('.js-close-modal span').click();
        });

        $('body').on('click', '.js-save', function(e) {
            $addressPinny.find('.errortxt').parent().addClass('c--error');
        });
    };

    var _transformContent = function($content) {
        var $mainTable = $content.find('.form');
        var $newContainer = $('<div>');

        // First name/middle initial needs to be grouped together
        $mainTable.find('.AddrMNameSpot').removeClass('spot').addClass('c-field');
        $mainTable.find('.AddrFNameSpot').after($mainTable.find('.AddrMNameSpot'));

        $newContainer.append($mainTable.find('.gwt-addr-edit-error-panel'));
        $newContainer.append($mainTable.find('#addr_addressTypeSpot .gwt-CheckBox'));
        $newContainer.append($mainTable.find('.group'));
        $newContainer.append($mainTable.find('.okCancelPanel'));

        $mainTable.replaceWith($newContainer);

        // styling transformations
        $content.find('.required').addClass('u-text-warning');
        $content.find('.spot').addClass('c-field').wrap('<div class="c-field-row"></div>');
        // removes unnecessary "group" div
        $content.find('.c-field-row').unwrap();

        // add class to label element
        $content.find('label').addClass('c-label');

        $content.find('.okCancelPanel').addClass('u-margin-top-lg');

        // template select fields: must reconstruct instead of running thru dust to preserve
        // events
        $content.find('select')
            .wrap('<div class="c-select"></div>')
            .parent()
            .append($chevronIcon.clone());

        $content.find('.gwt-CheckBox')
            .addClass('c-field')
            .wrap('<div class="c-field-row"></div>');

        $content.find('.AddrFNameSpot')
            .closest('.c-field-row')
            .addClass('c--3-4')
            // move middle name into same field row as first name
            .append($content.find('.AddrMNameSpot'));

        // Add hidden class if have aria-hidden
        var $hiddenClasses = $content.find('.addrStreet3Spot, .addrFaxSpot');
        var isHiddenClasses = $hiddenClasses.attr('aria-hidden');

        if (isHiddenClasses) {
            $hiddenClasses.parent().attr('hidden', 'true');
        } else {
            $hiddenClasses.parent().attr('hidden', 'false');
        }

        // Decorate inputs for special keyboards
        $content.find('[id$="_zipbox"], [id$="_phone1box"], [id$="_phone2box"]').attr('type', 'tel');
        $content.find('.emailbox').attr('type', 'email');

        // fix spacing
        $content.find('.addrCitySpot').parent().addClass('u-margin-top-0');
        $content.find('.addrStreet2Spot').parent().addClass('u-margin-bottom-lg');

        var $cancelButton = $content.find('.button.secondary').addClass('c-button c--outline');
        $content.find('.button.primary')
            .addClass('c-button c--primary c--full-width  js-save')
            .after($cancelButton);
        $cancelButton.addClass('c--full-width u-margin-top-md js-close-modal');

        Utils.buildToggle(
            $content.find('.AddrCompanySpot').closest('.c-field-row'),
            'Add Company Name (optional)',
            'c--plain c--brand c--plus u-text-weight-bold u-padding-left u--none u-text-size-small'
        );
        Utils.buildToggle(
            $content.find('.addrStreet2Spot').closest('.c-field-row'),
            'Add another line (optional)',
            'c--plain c--brand c--plus u-text-weight-bold u-padding-left u--none u-text-size-small'
        );
        Utils.buildToggle(
            $content.find('.addrPhone2Spot').closest('.c-field-row'),
            'Add Evening Phone (optional)',
            'c--plain c--brand c--plus u-text-weight-bold u-padding-left u--none u-text-size-small'
        );
    };

    var _showModal = function($modal, isSelectAddress) {
        var $content = $modal.find('.dialogContent');
        var title = $modal.find('.Caption').text();

        if (!$content.length || $content.parent().hasClass('pinny__content')) {
            return;
        }

        _transformContent($content);


        $addressPinny.find('.c-sheet__title').html(title);
        $addressPinny.find('.c-sheet__body').html($content);

        $modal.html($addressPinny.parent());
        $modal.append($addressShade);

        // CF-511: Open pinny at the end of exec queue to give DOM operations time to settle
        setTimeout(function() {
            $addressPinny.pinny('open');
        });
    };

    var _initSheet = function() {
        sheet.init($addressPinny, {
            coverage: '100%',
            shade: {
                cssClass: 'js-address-shade',
                zIndex: 100 // Match our standard modal z-index from our CSS ($z3-depth)
            }
        });

        $addressShade = $('.js-address-shade');

        _bindEvents();
    };

    return {
        initSheet: _initSheet,
        showModal: _showModal,
        addCloseCallback: _addCloseCallback
    };
});
