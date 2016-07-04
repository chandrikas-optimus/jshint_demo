define([
    '$',
    'global/utils/dom-operation-override'
], function($, domOverride) {

    var _transformSelect = function($select) {
        $select.wrap('<div class="c-select">');
        $select.after($('<svg class="c-icon ">'
            + '<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-arrow-downward"></use>'
            + '</svg>'));
    };

    var _transformFieldGroup = function($container) {
        $container.find('.spot').each(function(i, fieldContainer) {
            var $fieldContainer = $(fieldContainer);

            $fieldContainer.addClass('c-field__input');
            $fieldContainer.find('label').addClass('c-label');
            $fieldContainer.find('input').addClass('c-input');
            _transformSelect($fieldContainer.find('select'));

            if ($fieldContainer.hasClass('RelativeDobYearSpot')) {
                return;
            }

            if ($fieldContainer.hasClass('RelativeDobDaySpot')) {
                var $yearContainer = $fieldContainer.next();

                $fieldContainer.find('label').remove();
                $yearContainer.find('label').remove();

                $fieldContainer.add($yearContainer)
                    .wrapAll('<div class="c-field-row">')
                    .wrap('<div class="c-field">');
                return;
            }

            $fieldContainer.wrap('<div class="c-field-row"><div class="c-field">');
        });
    };

    var _transformBirthdayReminderElement = function(element) {
        var $element = $(element);

        if ($element.hasClass('button')) {
            $element.addClass('c-button c--plain c--brand c--plus u-padding-none u-text-weight-bold u-text-capitalize');
        } else {
            _transformFieldGroup($element);
        }
    };

    var birthdayReminderUI = function() {
        domOverride.on('domAppend', '', _transformBirthdayReminderElement, '.gwt-relative-dlog');
    };

    return birthdayReminderUI;
});
