define([
    '$',
    'global/utils',
    'global/utils/dom-operation-override',
    'global/parsers/registry-form-parser-ui',
    'components/tabs/tabs-ui',
    'global/ui/stepper-ui',
    'global/ui/wishlist-item-ui',
    'global/ui/chosen-personalization-ui',
    'global/ui/social-links-ui',
    'components/sheet/sheet-ui',
    'global/parsers/product-details-tab-parser',
    'dust!components/accordion/accordion',
    'bellows'
],
function(
    $,
    utils,
    domOperationOverride,
    formParser,
    tabsUI,
    stepperUI,
    wishlistItemUI,
    chosenPersonalizationUI,
    socialLinksUI,
    sheetUI,
    productDetailsTabParser,
    BellowsTemplate) {

    var productDetailsSheet, confirmationSheet;

    var _transformPersonalization = function() {
        var $content = $(arguments[0]);
        var $container = $('.js-personalize-options').removeAttr('hidden');

        $container.addClass('u-border u-padding-top-sm u-padding-bottom-sm u-padding-sides-md');
        chosenPersonalizationUI.decorateOptionContainer($content);
        chosenPersonalizationUI.bindAddLineEvent();
    };

    var _transformDeleteModal = function($deleteModal) {
        $deleteModal.find('.button.primary').addClass('c-button c--primary c--full-width u-margin-bottom-md');
        $deleteModal.find('.button.secondary').addClass('c-button c--outline c--full-width u-margin-bottom-md');
    };

    var _transformProductDetailsModal = function(productDetails) {
        var $modalContent = $(productDetails);
        var templateContent = productDetailsTabParser.parse($modalContent);
        var $content, title;

        $modalContent.find('ul').addClass('c-list-bullets');

        if (templateContent.items.length > 1) {
            templateContent.items[0].isOpen = true;
            title = $modalContent.find('.Caption').text();

            new BellowsTemplate(templateContent, function(err, html) {
                $content = $(html);
                $content.bellows();
            });
        } else {
            title = $modalContent.find('.gwt-TabBarItem').text();
            $content = $modalContent.find('.gwt-TabPanelBottom .gwt-HTML');
        }

        $modalContent.find('.secondary').triggerGWT('click');

        productDetailsSheet.setTitle(title);
        productDetailsSheet.setBody($content);

        productDetailsSheet.open();
    };

    var _transformDialogBoxes = function() {
        var $appendingElement = $(arguments[0]);

        if ($appendingElement.find('.GR_creat_step1').length) {
            formParser.transformStep1($appendingElement);
        } else if ($appendingElement.find('.GR_creat_step2').length) {
            formParser.transformStep2($appendingElement);
        } else if ($appendingElement.find('.GR_creat_step3').length) {
            formParser.transformStep3($appendingElement);
        } else if ($appendingElement.is('.gwt-gr-delete-dialog')) {
            _transformDeleteModal($appendingElement);
        }
    };

    var _transformConfirmationDialog = function(desktopDialog) {
        var $desktopDialog = $(desktopDialog).wrapInner('<div hidden>');  // will use our own sheet later

        var $sheet = $('.js-registry-confirmation-pinny');
        confirmationSheet = sheetUI.init($sheet);
        var $sheetContainer = $sheet.parent();
        var $shade = $sheetContainer.next('.shade');

        // First, transform content
        var $content = $desktopDialog.find('.okCancelPanel');
        $content.find('.button.primary').addClass('c-button c--primary c--full-width u-margin-bottom-md')
            .after($content.find('.button.secondary').addClass('c-button c--outline c--full-width u-margin-bottom-md'));

        confirmationSheet.setBody($content);
        confirmationSheet.setTitle($desktopDialog.find('.Caption .gwt-HTML').html());

        // Make sure our sheet is inside the desktop dialog
        // so the sheet content is clickable
        $sheetContainer.appendTo($desktopDialog);
        $shade.appendTo($desktopDialog);

        $sheet.on('click', '.pinny__close', function() {
            var $desktopCloseBtn = $sheet.find('.button.secondary').find('span');
            $desktopCloseBtn.click();
        });

        confirmationSheet.open();
    };

    var _closeConfirmationDialog = function() {
        if (confirmationSheet.isOpen) {
            confirmationSheet.close();
        }
    };



    var _afterOpenPinnyTransforms = function() {
        var $pinny = $('.js-dialog-box-pinny');
        var $pinnyHeader = $pinny.find('.pinny__title').addClass('u-text-capitalize');
        var $desktopModal = $pinny.closest('.gwt-DialogBox');

        $pinnyHeader.text($pinny.find('h1, h3').first().remove().text());

        if ($desktopModal.find('#gwt-product-addition-info-panel, .gwt-gr-delete-panel').length) {
            $pinnyHeader.text($desktopModal.find('.Caption').text());
        }

        // init plugins within pinny
        $pinny.find('.bellows').bellows();
    };


    var initPlugins = function() {
        sheetUI.init($('.js-dialog-box-pinny'), {
            shade: {
                cssClass: 'js-dialog-box-shade'
            }
        });

        productDetailsSheet = sheetUI.init($('.js-product-details-pinny'), {disableScrollTop: true});
    };

    var bindEvents = function() {
        var $confirmationDialog = $('.gwt-gift-registry-create-confirmation-dialog');
        $('.js-dialog-box-pinny').on('click', '.pinny__header .pinny__close', function() {
            // CF-696: The desktop script adds an overlay that blocks some interactions
            // Clicking on the cancel button removes this
            $(this).parents('.pinny').find('.button.secondary').click();
        });

        // Not using bindDialogPinny() here,
        // since we need a different pinny effect (modal center)
        // and desktop don't provide us a unique class for `dialogBoxContentSelector` parameter
        domOperationOverride.on('domAppend', '.gwt-gift-registry-create-confirmation-dialog', _transformConfirmationDialog);

        domOperationOverride.on('domRemove', '.gwt-gift-registry-create-confirmation-dialog', _closeConfirmationDialog);
    };

    var giftRegistryManageUI = function() {
        wishlistItemUI();
        stepperUI();
        formParser.bindErrorsViaClick();
        socialLinksUI.init();

        initPlugins();
        bindEvents();

        domOperationOverride.on('domAppend', '.gwt_personalization_options_panel', _transformPersonalization);
        domOperationOverride.on('domAppend', '#gwt-product-detail-info-modal', _transformProductDetailsModal);

        // takes the following content, appends them to the end of the pinny
        // and hide the original modal
        var dialogBoxContentSelector = '.GR_creat_step1, .GR_creat_step2, .GR_creat_step3, .gwt-gr-delete-panel';
        utils.bindDialogPinny(_transformDialogBoxes, dialogBoxContentSelector, utils, _afterOpenPinnyTransforms);

    };

    return giftRegistryManageUI;
});
