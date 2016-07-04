define(['$'], function($) {
    return {
        context: {
            search: function() {
                var $form = $('#headerSearchForm');

                return {
                    form: $form,
                    hiddenInputs: $form.find('input[type="hidden"]'),
                    deleteClass: 'js-close-search',
                    input: $form.find('#headerBox').addClass('c-search__text-input js-search__input').attr('placeholder', 'Search or Catalog #')
                };
            }
        }
    };
});
