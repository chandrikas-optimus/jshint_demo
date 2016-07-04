define([
    '$',
    'dust!components/alert/alert',
    'components/reveal/reveal-ui'
], function(
    $,
    alertTemplate,
    Reveal
) {

    var _onDismissClicked = function() {
        var $alert = $(this).closest('.c-alert');

        $alert.velocity('slideUp', {
            easing: 'easeOutSine',
            complete: function() {
                $('body').trigger('alertClosed.mobify', [$alert]);
            }
        });
    };

    var init = function() {
        $('body').off('click', '.c-alert__dismiss', _onDismissClicked);
        $('body').on('click', '.c-alert__dismiss', _onDismissClicked);
    };

    var show = function($alert) {
        $alert.velocity('slideDown');
    };

    // NOTE: `data` follows what's defined in 'alert' component
    var update = function($alert, data) {
        var $wrapper = $alert.closest('.js-alert-wrapper');
        var alertData = $.extend({}, data, {contentOnly: true});

        alertTemplate(alertData, function(err, contentHTML) {
            $wrapper.html(contentHTML);
            Reveal.init($wrapper.find('.c-reveal').first());

            show($wrapper.find('.c-alert'));
        });
    };

    var hide = function($alert) {
        $alert.find('.c-alert__dismiss').trigger('click');
    };

    return {
        init: init,
        update: update,
        show: show,
        hide: hide
    };
});
