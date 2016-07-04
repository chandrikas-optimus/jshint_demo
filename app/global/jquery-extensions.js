define(['$'], function($) {
    $.extend($.fn, {
        // Add trimmedText() function to jQuery which will
        //  check to see if an element actually has text before
        //  trimming it.
        trimmedText: function() {
            var text = this.text();
            if (text) {
                return text.trim();
            }
            return '';
        },

        // Return text of only parent element
        parentText: function() {
            return $(this).clone()
                .children()
                .remove()
                .end()
                .text();
        },

        /*
         * Removes inline styles for selected element or for all descedants as
         * well if specified
         */
        removeStyle: function(andDescendants) {
            return this.each(function() {
                var $el = $(this);

                $el.removeAttr('style');
                andDescendants && $el.find('[style]').removeAttr('style');

                return $el;
            });
        },

        // NOTE: copied over from the Improvements project
        triggerGWT: function(type) {
            return this.each(function() {
                var $self = $(this);
                var e = new jQuery.Event(type);

                // For some reason, GWT needs this property to be set
                e.currentTarget = this;

                $self.trigger(e);
            });
        }

    });
});
