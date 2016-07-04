(function(factory) {
    if (typeof define === 'function' && define.amd) {
        define([
            '$',
            'plugin',
            'event-polyfill',
            'velocity',
            'deckard'
        ], factory);
    } else {
        var framework = window.Zepto || window.jQuery;
        factory(framework, window.Plugin, window.EventPolyfill);
    }
})(function($, Plugin, EventPolyfill, Velocity) {
    var EFFECT_REQUIRED = 'Notify requires a declared effect to operate.';
    var FOCUSABLE_ELEMENTS = 'a[href], area[href], input, select, textarea, button, iframe, object, embed, [tabindex], [contenteditable]';

    /**
     * Function.prototype.bind polyfill required for < iOS6
     */
    /*eslint-disable */
    if (!Function.prototype.bind) {
        Function.prototype.bind = function(scope) {
            var fn = this;
            return function() {
                return fn.apply(scope);
            };
        };
    }
    /*eslint-enable */

    var $window = $(window);
    var iOS8 = $.os.ios && $.os.major >= 8;

    var classes = {
        NOTIFY: 'notify',
        WRAPPER: 'notify__wrapper',
        TITLE: 'notify__title',
        CLOSE: 'notify__close',
        CONTENT: 'notify__content',
        OPENED: 'notify--is-open'
    };

    var sheetTopEffect = function() {
        var plugin = this;
        var coverage = this._coverage();

        this.$notify
            .css({
                top: 0,
                left: 0,
                right: 0,
                bottom: coverage ? coverage : 'auto',
                height: coverage ? 'auto' : this.options.coverage,
                width: 'auto'
            });

        return {
            open: function() {
                // Force feed the initial value
                Velocity.animate(
                    plugin.$notify,
                    { translateY: [0, '-100%'] },
                    {
                        easing: plugin.options.easing,
                        duration: plugin.options.duration,
                        display: 'block',
                        complete: plugin.animation.openComplete.bind(plugin)
                    }
                );
            },
            close: function() {
                Velocity.animate(
                    plugin.$notify,
                    'reverse',
                    {
                        easing: plugin.options.easing,
                        duration: plugin.options.duration,
                        display: 'none',
                        complete: plugin.animation.closeComplete.bind(plugin)
                    }
                );
            }
        };
    };

    var events = {
        click: 'click.notify',
        focus: 'focus.notify',
        blur: 'blur.notify',
        resize: 'resize.notify',
        orientationchange: 'orientationchange.notify'
    };


    /*eslint-disable */
    function Notify(element, options) {
        Notify.__super__.call(this, element, options, Notify.DEFAULTS);
    }
    /*eslint-enable */

    Notify.DEFAULTS = {
        effect: sheetTopEffect,
        container: null,
        appendTo: null,
        zIndex: 2,
        cssClass: '',
        coverage: '',
        easing: 'swing',
        duration: '200',
        open: $.noop,
        opened: $.noop,
        close: $.noop,
        closed: $.noop
    };


    Plugin.create('notify', Notify, {
        // in-complete
        animation: {
            openComplete: function() {

                setTimeout(function() {

                    // Skip lockup

                    EventPolyfill.on(events.resize, this._repaint);

                    this.$notify
                        .addClass(classes.OPENED)
                        .attr('aria-hidden', 'false');

                    this._trigger('opened');

                }.bind(this), 0);
            },
            closeComplete: function() {
                setTimeout(function() {
                    // this._resetFocus();
                    this.$notify
                        .removeClass(classes.OPENED)
                        .attr('aria-hidden', 'true');


                    EventPolyfill.off(events.resize);
                    $window.off(events.orientationchange);


                    this._trigger('closed');
                }.bind(this), 0);
            }
        },
        open: function() {
            if (this._isOpen()) {
                return;
            }

            if (iOS8) {
                this._repaint();
            }

            this._trigger('open');


            this.effect.open.call(this);
        },
        close: function() {
            if (!this._isOpen()) {
                return;
            }

            this._trigger('close');

            this.effect.close.call(this);
        },
        toggle: function() {
            this[this.$notify.hasClass(classes.OPENED) ? 'close' : 'open']();
        },
        destroy: function() {
            this.$notify.remove();

            EventPolyfill.off();

            this.$element
                .appendTo(document.body)
                .removeData(this.name);
        },
        _isOpen: function() {
            return this.$notify.hasClass(classes.OPENED);
        },
        _init: function(element) {
            this.id = 'notify-' + $.uniqueId();

            this.$element = $(element);
            this.$doc = $(document);
            this.$body = $('body');

            this._build();

            if (!this.options.effect) {
                throw EFFECT_REQUIRED;
            }

            this.effect = this.options.effect.call(this);

            this.$element.removeAttr('hidden');


        },
        _build: function() {
            var plugin = this;

            this.$notify = $('<section />')
                .addClass(classes.NOTIFY)
                .addClass(this.options.cssClass)
                .css({
                    position: 'fixed',
                    zIndex: this.options.zIndex,
                    width: this.options.coverage,
                    height: this.options.coverage
                })
                .on(events.click, '.' + classes.CLOSE, function(e) {
                    e.preventDefault();
                    plugin.close();
                });

            this.$notify.appendTo(this.$body.find('.lockup__container'));

            // Notify doesn't need a structure
            this.$element.appendTo(this.$notify);

            // No $content needed either (that's just for the spacer)

            this._addAccessibility();

            // No shade needed
        },
        /**
         * Accessibility Considerations
         */
        _addAccessibility: function() {

            this.$notify
                .attr('role', 'alert')
                .attr('aria-hidden', 'true')
                .attr('tabindex', '-1');
        },
        _repaint: function() {
            window.scrollTo(document.body.scrollLeft, document.body.scrollTop + 1);
        },
        _coverage: function(divisor) {
            var coverage;
            var percent = this.options.coverage.match(/(\d*)%$/);

            if (percent) {
                coverage = 100 - parseInt(percent[1]);

                if (divisor) {
                    coverage = coverage / divisor;
                }
            }

            return percent ? coverage + '%' : this.options.coverage;
        },
        _focus: function() {
            this.originalActiveElement = document.activeElement;

            this.$notify.children().find(FOCUSABLE_ELEMENTS).first().focus();
        },
        // Set focus back to input field after pinny is closed
        // to keep context for screen readers experience
        _resetFocus: function() {
            if (this.options.reFocus) {
                this.originalActiveElement && this.originalActiveElement.focus();
            }
        },
    });

    $('[data-notify]').each(function() {
        var $notify = $(this);
        var effect = $(this).data('notify');

        if (!effect.length) {
            throw EFFECT_REQUIRED;
        }

        $notify.notify({
            effect: effect
        });
    });

    return $;

});
