define([
    '$'
], function($) {

    var bindAddLineEvent = function() {
        $('body').on('click', '.js-add-line', function(e) {
            var $container = Adaptive.$('.gwt_personalization_options_panel');

            $container.find('.gwt-personalization-textbox-label.u-visually-hidden').first().removeClass('u-visually-hidden');
            $container.find('.gwt-TextBox.u-visually-hidden').first().removeClass('u-visually-hidden');
            $container.find('.gwt-personalization-textbox-description.u-visually-hidden').first().removeClass('u-visually-hidden');

            if (!$container.find('.u-visually-hidden').length) {
                $(this).remove();
            }
        });
    };


    var decorateOptionContainer = function($giftCardContainer) {
        $giftCardContainer.addClass('options-panel-render js-rendered');

        $giftCardContainer.find('.gwt-personalization-textbox-label').each(function(index) {
            if (index < 2) {
                return;
            }

            $(this).addClass('u-visually-hidden');
            $giftCardContainer.find('.gwt-TextBox').eq(index).addClass('u-visually-hidden');
            $giftCardContainer.find('.gwt-personalization-textbox-description').eq(index).addClass('u-visually-hidden');
        });

        var $addLine = $('<a>', {
            class: 'c-button c--simple c--plus js-add-line',
            text: 'Add Another Line'
        });

        $giftCardContainer.append($addLine);

        $giftCardContainer.find('.js-add-line').wrap('<div>');
    };

    var decorateGiftCardOptions = function($container) {
        var $giftCardContainer = $container.find('.gwt_personalization_options_panel');
        var $link = $giftCardContainer.closest('.js-personalize-link');

        if ($giftCardContainer.hasClass('js-rendered')) {
            return;
        }

        $link.removeClass('c-button c--outline c--fletch c--full-width');
        $link.addClass('u-border u-padding-top-sm u-padding-bottom-sm u-padding-sides-md');
        $link.children('.c-icon-svg').remove();


        decorateOptionContainer($giftCardContainer);
    };

    var decorateChosenOptions = function($container) {
        if ($container.hasClass('js-rendered')) {
            return;
        }

        console.log('decorating chosen options');

        $container.addClass('js-rendered');
    };

    var _personalizationFinished = function() {
        if (event.animationName === 'personalizeChosen') {
            var $personalizedOptions = $('.gwt-product-detail-widget-personalization-panel');

            if ($personalizedOptions.find('.gwt_personalization_options_panel').length) {
                decorateGiftCardOptions($personalizedOptions);
            } else {
                decorateChosenOptions($personalizedOptions);
            }
        }
    };

    var bindEvents = function() {
        document.addEventListener('animationStart', _personalizationFinished);
        document.addEventListener('webkitAnimationStart', _personalizationFinished);

        bindAddLineEvent();
    };

    return {
        bindEvents: bindEvents,
        decorateOptionContainer: decorateOptionContainer,
        bindAddLineEvent: bindAddLineEvent
    };
});
