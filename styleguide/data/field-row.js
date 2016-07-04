define([
    '$',
    'dust-core',
    'data/select',
    'dust!components/select/select'
], function ($, dust, select) {

    var $selectHTML = [];

    dust.render('components/select/select', select[0], function(error, out) {
        $selectHTML.push($(out));
    });
    dust.render('components/select/select', select[1], function(error, out) {
        $selectHTML.push($(out));
    });
    dust.render('components/select/select', select[2], function(error, out) {
        $selectHTML.push($(out));
    });
    dust.render('components/select/select', select[3], function(error, out) {
        $selectHTML.push($(out));
    });

    return [

        {
            'fields': [
                {
                    'label': $('<label class="c-label" for="firstName-1">Text field</label>'),
                    'input': $('<input class="c-input" type="text" id="firstName-1" name="firstName-1" value="" />')
                },{
                    'label': $('<label class="c-label" for="firstName-2">Tel Field</label>'),
                    'input': $('<input class="c-input" type="tel" id="firstName-2" name="firstName-2" value="" />')
                }
            ]
        },

        {
            'class': 'c--3-4',
            'fields': [
                {
                    'label': $('<label class="c-label" for="firstName-3">Email field</label>'),
                    'input': $('<input class="c-input" type="email" autocapitalize="off" autocorrect="off" id="firstName-3" name="firstName-3" value="" />')
                },{
                    'label': $('<label class="c-label" for="firstName-4">Password Field</label>'),
                    'input': $('<input class="c-input" type="password" id="firstName-4" name="firstName-4" value="" />')
                }
            ]
        },

        {
            'fields': [
                {
                    'class': 'u-width-2of3 c--error',
                    'label': $('<label class="c-label" for="firstName-5">Text field with an error</label>'),
                    'input': $('<input class="c-input" type="search" id="firstName-5" name="firstName-5" value="" />'),
                    'error': 'Error message'
                }
            ]
        },

        {
            'fields': [
                {
                    'label': $('<label class="c-label" for="firstName-81">Label (prefilled)</label>'),
                    'input': $('<input class="c-input" type="text" id="firstName-81" name="firstName-81" value="Prefilled value" required="" />'),
                    'hint': $('<a href="#" class="">Forgot your password?</a>')
                }
            ]
        },

        {
            'fields': [
                {
                    'input': $('<input class="c-input" type="text" id="firstName-6" name="firstName-6" value="" placeholder="No label, just placeholder" />')
                }
            ]
        },

        {
            'fields': [
                {
                    'label': $('<label class="c-label" for="firstName-80">Label (disabled)</label>'),
                    'input': $('<input class="c-input" type="text" id="firstName-60" name="firstName-60" placeholder="Placeholder only (disabled)" value="" disabled />')
                }
            ]
        },

        {
            'fields': [
                {
                    'label': $('<label class="c-label" for="select-1">Standard Select</label>'),
                    'input': $selectHTML[0]
                },
                {
                    'label': $('<label class="c-label" for="select-3">Disabled Select</label>'),
                    'input': $selectHTML[2]
                }

            ]
        },
        {
            'fields': [
                {
                    'class': 'c--condensed',
                    'label': $('<label class="c-label" for="select-1">Size</label>'),
                    'input': $selectHTML[0]
                },
            ]
        },

        {
            'fields': [
                {
                    'isCheckRadio': true,
                    'label': $('<label class="c-label" for="firstName-10">Checkbox field</label>'),
                    'input': $('<input type="checkbox" id="firstName-10" name="firstName-10" value="" />')
                },
                {
                    'isCheckRadio': true,
                    'label': $('<label class="c-label" for="firstName-11">Radio field</label>'),
                    'input': $('<input type="radio" id="firstName-11" name="firstName-11" value="" />')
                }
            ]
        }
    ];
});
