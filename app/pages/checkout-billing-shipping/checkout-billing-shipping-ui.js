define([
    '$',
    'global/utils/dom-operation-override',
    'translator',
    'global/ui/tooltip-ui',
    'bellows',
    'components/reveal/reveal-ui',
    'dust!components/reveal/reveal',
    'global/utils',
    'components/alert/alert-ui'
], function(
    $,
    domOverride,
    translator,
    tooltipUI,
    Bellows,
    Reveal,
    RevealTmpl,
    Utils,
    Alert
) {
    var $selectArrow = $('<svg class="c-icon" data-fallback="img/png/arrow-downward.png"><title>arrow-downward</title><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-arrow-downward"></use></svg>');
    var _$billingShippingAccordion = $('.js-billing-shipping-bellows');

    var createFieldContainer = function($inputContainer) {
        var $input = $inputContainer.find('input');
        var $select = $inputContainer.find('select');
        var $fieldRow = $('<div class="c-field">');

        $fieldRow.append($inputContainer.find('label').addClass('c-label'));

        if ($input.length) {
            $fieldRow.append($('<div class="c-input">').append($input));
        }

        if ($select.length) {
            $fieldRow.append($('<div class="c-select">').append($select.add($selectArrow.clone())));
        }

        return $fieldRow;
    };

    var transformSplitFieldRow = function($fieldRow, $inputContainer) {
        var $nextContainer = $inputContainer.next();

        // For escaping out and back in to next spot container
        if (!$nextContainer.length) {
            $nextContainer = $inputContainer.parent().next().find('.spot').first();
        }

        var $fieldContainer = createFieldContainer($nextContainer);
        $fieldRow.append($fieldContainer);
    };

    var _transformToReveal = function($field) {
        var $showLabel = $field.find('label').clone();
        // Customize reveal's label
        $showLabel.text('+ ' + $showLabel.text() + ' (optional)');
        $showLabel = $showLabel.swap('span');

        $field.find('input').addClass('js-reveal-disabled');

        var revealData = {
            showLabel: $showLabel,
            content: $field.children()
        };
        new RevealTmpl(revealData, function(err, out) {
            $field.html(out);
            Reveal.init($field.find('.c-reveal'));
        });
    };

    var transformForm = function($form) {
        var $container = $(this);
        var $form = $(arguments[0]);
        var $fields = $();

        if ($container.is('#gwt_shipaddr_panel')) {
            $container.addClass('js-shipping-form');
            $container.children().addClass('u-margin-top-md u-padding-bottom');
        }

        $form.find('.spot').not('.AddrMNameSpot, .addrStreet3Spot, .addrFaxSpot, .addrZipSpot').map(function(i, inputContainer) {
            var $inputContainer = $(inputContainer);
            var $fieldRow = $('<div class="c-field-row">');
            var $fieldContainer = createFieldContainer($inputContainer);

            $fieldRow.append($fieldContainer);

            if ($inputContainer.hasClass('AddrFNameSpot') || $inputContainer.hasClass('addrStateSpot')) {
                transformSplitFieldRow($fieldRow, $inputContainer);
                $fieldRow.addClass('c--3-4');
            }

            $fields = $fields.add($fieldRow);
        });

        // Red required stars
        $fields.find('.required').addClass('u-text-warning');

        // Add reveals via whitelist
        var revealsWhitelist = '[for="bill_cnbox"], [for="bill_sa2box"], [for="bill_phone2box"], [for="ship_cnbox"], [for="ship_sa2box"], [for="ship_phone2box"]';
        $fields.each(function(i, fieldrow) {
            var $fieldRow = $(fieldrow);
            $fieldRow.find('.c-field').each(function(i, field) {
                var $field = $(field);
                if ($field.find(revealsWhitelist).length) {
                    _transformToReveal($field);
                }
            });
        });

        $form.html($fields);

        if ($container.is('#gwt_billaddr_panel')) {
            // Start with Billing section open
            _$billingShippingAccordion.find('.js-loader')
                .attr('hidden', 'true')
                .siblings('.js-form-container')
                .removeAttr('hidden');
        }

        // Decorate inputs for special keyboards
        $form.find('[id$="_zipbox"], [id$="_phone1box"], [id$="_phone2box"]').attr('type', 'tel');
        $form.find('.emailbox').attr('type', 'email');
    };

    var transformShippingOptions = function() {
        var $container = $(arguments[0]);

        $container.find('.gwt-RadioButton').each(function(i, radioButtonContainer) {
            var $radioButtonContainer = $(radioButtonContainer);

            if (i === 0) {
                $radioButtonContainer.find('input').addClass('js-hide-form');
            } else {
                $radioButtonContainer.find('input').addClass('js-show-form');
            }

            // Decorate radio buttons to use check radio component
            $radioButtonContainer.find('input').wrap('<div class="c-check-radio">').wrap('<div class="c-block-option__input">');
            $radioButtonContainer.addClass('c-block-option u-margin-top-0');
            $radioButtonContainer.find('br').remove();
            $radioButtonContainer.find('label').wrap('<div class="c-block-option__label-container">');
            $radioButtonContainer.find('label').addClass('c-label');
            $radioButtonContainer.find('.c-block-option__input').append('<svg class="c-icon c-check-radio__icon"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-checkmark"></use></svg>');
        });
    };

    var transformSendEmails = function() {
        var $sendEmails = $(arguments[0]);

        $(this).addClass('c-field-row');

        // Decorate with check radio component
        $sendEmails.find('label').addClass('c-label');
        $sendEmails.addClass('c-field c--check-radio');
        $sendEmails.find('input').wrap('<div class="c-check-radio">');
        $sendEmails.find('.c-check-radio').append('<svg class="c-icon c-check-radio__icon"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-checkmark"></use></svg>');
        $sendEmails.children().wrapAll('<div class="c-field__input">');
    };

    var _trimCtaContainer = function($ctaContainer) {
        // trim button container text
        $ctaContainer.contents().filter(function() {
            if (this.nodeType === 3 && /^\s$/ig.test($(this).text())) {
                $(this).remove();
            }
        });
    };

    var transformCTA = function() {
        var $cta = $(arguments[0]);
        var $ctaContainer = $(this);

        _trimCtaContainer($ctaContainer);

        $cta.addClass('c-button c--primary c--full-width');
    };

    var transformErrors = function() {
        Utils.decorateErrorsAlert();
    };

    var bindEvents = function() {
        $('body').on('click', '.js-add-field', function(e) {
            var $button = $(this);
            var $target = $($button.attr('data-target'));

            e.preventDefault();

            $button.attr('hidden', 'true');
            $target.removeAttr('hidden');

            $target.find('input').removeAttr('disabled');
        });

        $('body').on('click', '.js-hide-form', function(e) {
            $('.js-shipping-form').attr('hidden', 'true');
        });

        $('body').on('click', '.js-show-form', function(e) {
            $('.js-shipping-form').removeAttr('hidden');
        });
    };

    var overrideGWTDomAppend = function() {
        domOverride.on('domAppend', '', transformForm, '#gwt_billaddr_panel');
        domOverride.on('domAppend', '', transformForm, '#gwt_shipaddr_panel');
        domOverride.on('domAppend', '', transformForm, '#gwt_password_panel');
        domOverride.on('domAppend', '', transformForm, '#gwt_email_textbox');
        domOverride.on('domAppend', '', transformSendEmails, '#gwt_sendMeEmails_cb');
        domOverride.on('domAppend', '', transformShippingOptions, '#gwt_shippingOption_panel');
        domOverride.on('domAppend', '', transformCTA, '#gwt_billshipaddr_btn');
        domOverride.on('domAppend', '', transformErrors, '#gwt-error-placement-div');
    };

    var _initBillingShippingAccordion = function() {
        _$billingShippingAccordion.bellows({
            singleItemOpen: true
        });

        // Bind custom advance button
        // ---
        // CF-499: Commented out due to customer's request to remove
        //
        // $('.js-advance-to-shipping').on('click', function() {
        //     _$billingShippingAccordion.bellows('toggleAll');
        // });
    };

    var checkoutBillingShippingUI = function() {
        console.log('checkoutBillingShipping UI');

        overrideGWTDomAppend();
        tooltipUI();
        Alert.init(); // Alert for errors
        bindEvents();

        _initBillingShippingAccordion();

        // Set up registration reveal, if applicable
        if ($('.js-registration-reveal').length) {
            Reveal.init($('.js-registration-reveal'));
        }
    };

    return checkoutBillingShippingUI;
});
