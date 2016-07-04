define( [
    '$'
], function($) {
    var HIDE_CLASS = 'c--is-hidden';

    var Reveal = function($el) {
        this.$el = $el;

        // Calling first() because a Reveal component can be nested inside another instance
        this.$showTrigger = $el.find('.c-reveal__trigger.c--show').first();
        this.$hideTrigger = $el.find('.c-reveal__trigger.c--hide').first();
        this.$content = $el.find('.c-reveal__content').first();

        this.bindEvents();
    };

    Reveal.prototype.show = function() {
        this.$showTrigger.animate({opacity: 0}, 200, function() {
            this.$showTrigger
                .attr('aria-hidden', 'true')
                .addClass(HIDE_CLASS);

            this.$content
                .removeClass(HIDE_CLASS)
                .attr('aria-hidden', null)
                .animate({opacity: 1}, 200)
                .find('input.js-reveal-disabled').removeAttr('disabled');
        }.bind(this));
    };

    Reveal.prototype.hide = function() {
        this.$content.animate({opacity: 0}, 200, function() {
            this.$content
                .attr('aria-hidden', 'true')
                .addClass(HIDE_CLASS);

            this.$showTrigger
                .removeClass(HIDE_CLASS)
                .attr('aria-hidden', null)
                .animate({opacity: 1}, 200);
        }.bind(this));
    };

    // TODO: Make this more accessible
    //       * Add focus management
    Reveal.prototype.bindEvents = function() {
        this.$showTrigger.on('click', this.show.bind(this));
        this.$hideTrigger.on('click', this.hide.bind(this));
    };

    return {
        init: function($el) {
            console.log('Reveal UI'); // can this be only on debug mode?

            $el = $el || $('.c-reveal');

            $el.find('.c-reveal__trigger, .c-reveal__trigger *')
                .addClass('needsclick');

            return $el.map(function() {
                var $currentEl = $(this);
                return $currentEl.data('component') || $currentEl.data('component', new Reveal($currentEl));
            });
        }
    };
});
