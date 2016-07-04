define(['$'], function($) {
    $.extend($.fn, {

        // GWT doesn't recognize events without a currentTarget set
        triggerGWT: function(type) {
            return this.each(function() {
                var $self = $(this);
                var e = new jQuery.Event(type);
                e.currentTarget = this;

                $self.trigger(e);
            });
        }
    });
});
