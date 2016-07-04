define([
    '$',
    'global/baseView',
    'dust!pages/share-wishlist/share-wishlist'
],
function($, BaseView, template) {
    return {
        template: template,
        extend: BaseView,

        context: {
            templateName: 'share-wishlist',
            pageTitle: function() {
                var $header = $('.text-header');

                if ($header.length) {
                    return $header.text();
                }

                return $('h1').attr('title');
            },
            introText: function() {
                return $('.infoPages p').addClass('u-margin-bottom-lg');
            },
            hiddenForms: function() {
                var $hiddenForms = $('form.hidden');
                return $hiddenForms.add($('#gwt_view_name').parent());
            },
            shareForm: function() {
                var $form = $('#wishListShare');

                return {
                    form: $form,
                    hiddenInputs: $form.find('[type="hidden"]'),
                    formContainer: $form.find('.form').attr('hidden', 'true')
                };
            }
        }
    };
});
