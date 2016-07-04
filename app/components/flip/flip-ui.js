define([
    '$'
], function($) {
    var defaults = {};
    var CARD_SELECTOR = '.c-flip__card';
    var TRANSITION_DURATION = 250;  // double check with the css

    /**
     * Flip constructor
     *
     * NOTE:
     * if you pass in options.toggle, then clicking this toggle would automatically flip the component.
     * Otherwise, you'd have to call flip() manually.
     */
    var Flip = function($el, options) {
        options = options || {};

        var self = this;
        var $toggle = $(options.toggle);

        self.$el = $el;

        if ($toggle.length) {
            $toggle.on('click', function() {
                $el.find(CARD_SELECTOR).toggleClass('c--flipped').removeClass('c--half-flip');
            });
        }
    };

    Flip.prototype.flip = function(options) {
        this.$el.find(CARD_SELECTOR).toggleClass('c--flipped').removeClass('c--half-flip');

        if (options && options.flipped) {
            setTimeout(options.flipped, TRANSITION_DURATION);
        }
    };

    // A half flip would end up looking like you can't see the card; neither front or back of card is visible
    Flip.prototype.halfFlip = function(options) {
        this.$el.find(CARD_SELECTOR).toggleClass('c--half-flip');

        if (options && options.halfFlipped) {
            setTimeout(options.halfFlipped, TRANSITION_DURATION);
        }
    };

    return {
        init: function($el, options) {
            $el = $($el); // Recreate jQuery object with correct selector

            // If already initialized, return the instance; otherwise, create it
            // and expose it through `$('.c-flip').data('component')`.
            return $el.data('component') || $el.data('component', new Flip($el, options)).data('component');
        }
    };
});
