define([
    '$'
], function($) {

    var _updatePromoContainer = function() {
        var $promoContainer = $('.js-promo-container');
        var $inputContainer = $promoContainer.find('.js-promo-inputs');
        var $appliedContainer = $inputContainer.next('.js-applied-promo');
        var $appliedPromo = $inputContainer.find('.label-promo-code');
        var $promoEditButton = $inputContainer.find('.edit-promo-link');


        if ($appliedPromo.length) {
            $inputContainer.attr('hidden', 'true');
            $promoEditButton.addClass('c-button c--simple');
            $('.js-promo-button').attr('hidden', 'true');
            $promoContainer.removeAttr('hidden');

            $appliedContainer.append($appliedPromo);
            $appliedContainer.append($promoEditButton);
        }
    };


    var _overrideDesktop = function() {
        var _editOnClick = window.editOnClick;

        window.editOnClick = function() {
            _editOnClick.apply(this, arguments);
            $('.js-promo-inputs').removeAttr('hidden');
            $('.js-applied-promo').attr('hidden', 'true');
        };
    };

    var _bindEvents = function() {
        $('.js-apply-input').on('focus input keyup', function() {
            var $input = $(this);
            var $button = $input.next('button');

            if ($input.val() !== '') {
                $button.removeAttr('disabled');
            } else {
                $button.attr('disabled', 'true');
            }
        });
    };

    var _init = function() {
        _updatePromoContainer();
        _overrideDesktop();
        _bindEvents();
    };

    return {
        init: _init
    };
});
