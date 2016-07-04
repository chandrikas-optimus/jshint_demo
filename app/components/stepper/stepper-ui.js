define(['$'], function($) {

    // NOTE: you only need to initialize it once (due to event delegation)
    var init = function() {
        $('body').on('click', '.js-stepper-decrease, .js-stepper-increase', function() {

            var $button = $(this);
            var $container = $button.closest('.c-stepper');
            var $count = $container.find('.c-stepper__count');

            var maxValue = parseInt($container.attr('data-max')) || 99999;
            var minValue = parseInt($container.attr('data-min')) || 0;

            var oldCount = parseInt($count.text());
            var newCount = $button.is('.js-stepper-decrease') ? oldCount - 1 : oldCount + 1;

            $container.find('.js-stepper-decrease')
                .toggleClass('c--disabled', newCount <= minValue);
            $container.find('.js-stepper-increase')
                .toggleClass('c--disabled', newCount >= maxValue);

            if (newCount <= maxValue && newCount >= minValue) {
                $count.text(newCount);
                $container.trigger('change.mobify', [newCount]);
            }
        });
    };

    return {
        init: init
    };
});
