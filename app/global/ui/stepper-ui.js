define([
    '$'
], function($, sheet) {



    var bindEvents = function() {
        $('body').on('click', '.js-stepper', function(e) {
            var $stepper = $(this);
            var isMinus = $stepper.hasClass('js--minus');
            var $stepperVal = $stepper.siblings('.js-val');
            var newVal = parseInt($stepperVal.text());
            var $selectContainer = $stepper.siblings('.js-qty-select');
            var $select = $selectContainer.is('select') ? $selectContainer : $selectContainer.find('select');
            var maxQty = $selectContainer.data('maxquantity') || 20;
            var minQty = $stepper.parent().attr('data-min') || '1';

            e.preventDefault();

            minQty = parseInt(minQty);

            if (isMinus) {
                newVal--;

                if (newVal === minQty) {
                    $stepper.addClass('c--disabled');
                }

                if (newVal < maxQty) {
                    $stepper.siblings('.js-stepper').removeClass('c--disabled');
                }
            } else {
                newVal++;
                if (newVal === maxQty) {
                    $stepper.addClass('c--disabled');
                }

                if (newVal > minQty) {
                    $stepper.siblings('.js-stepper').removeClass('c--disabled');
                }
            }

            $stepperVal.html(newVal);
            $('.js-page-loading').removeAttr('hidden');
            $select.val(newVal);
            $select[0].dispatchEvent(new CustomEvent('change'));
        });
    };


    var stepperUI = function() {
        bindEvents();
    };

    return stepperUI;
});
