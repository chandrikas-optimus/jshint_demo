define(['$'], function($) {

    // GOAL: to preserve desktop's event handlers,
    // while still having the flexibility to use our partial templates.
    // (We need a dummy element to pass into our partials, and we'll swap it later with the real one)

    var CLASSNAME = 'js-dummy-element';
    var elements = {};

    var _syncClasses = function($origElement, $dummyElement) {
        $origElement
            .addClass($dummyElement.attr('class'))
            .removeClass(CLASSNAME);
    };

    var _switchDummyElement = function($dummyElement) {
        var $origElement = elements[$dummyElement.attr('data-id')];
        _syncClasses($origElement, $dummyElement);

        $dummyElement.replaceWith($origElement);
    };

    var _randomId = function() {
        return 'id' + (+new Date()) + Math.round(Math.random() * 100000);
    };

    // NOTE: $element will be taken out of DOM
    var getSubstitute = function($element) {
        if ($element.length === 0) return null;

        // Important to preserve the event handlers
        $element.detach();  // secret sauce!

        var id = _randomId();
        // Save it
        elements[id] = $element;

        return $('<div>')
            .addClass(CLASSNAME)
            .attr('data-id', id);
    };

    var replaceAllSubstitutes = function($container) {
        $container.find('.' + CLASSNAME).each(function() {
            _switchDummyElement($(this));
        });
    };

    return {
        getSubstitute: getSubstitute,
        replaceAllSubstitutes: replaceAllSubstitutes,
        randomId: _randomId
    };
});
