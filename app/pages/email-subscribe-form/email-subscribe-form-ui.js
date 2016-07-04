define(['$', 'global/utils'], function($, Utils) {
    var validatedEvent = new Event('validated');

    var bindErrorHandling = function() {
        $('.js-email-subscribe').on('click', function() {
            $('.error').not('input').closest('.c-field').addClass('c--error');

            $('.x-main')[0].dispatchEvent(validatedEvent);
        });
    };

    var emailSubscribeFormUI = function() {
        // Add any scripts you would like to run on the emailSubscribeForm page only here
        bindErrorHandling();

        Utils.updateParentIframeHeight();

        // Check if form is updated. (Errors either shown/hidden)
        $('.x-main')[0].addEventListener('validated', function(e) {
            Utils.updateParentIframeHeight();
        }, false);
    };

    return emailSubscribeFormUI;
});
