/* global dust */
(function(dust) {

    // Register the dust helper
    //
    // Example of usage:
    // {@element el=someElement addClass="c-input" type="tel"/}

    dust.helpers.element = function(chunk, context, bodies, params) {
        var $ = (window.Adaptive && Adaptive.$) || jQuery;
        var get = function(paramName) {
            return dust.helpers.tap(params[paramName], chunk, context);
        };

        var $element = $(get('el'));
        var classesToAdd = get('addClass');
        var classesToSet = get('class');

        if ($element.length === 0) {
            return chunk.write('');
        }

        if (classesToAdd && classesToSet) {
            console.error('@element: cannot use both `addClass` and `class`');
            return chunk.write('');
        } else if (classesToAdd) {
            $element.addClass(classesToAdd);
        }

        for (var param in params) {
            if (param !== 'el' && param !== 'addClass') {
                var attributeName = param;
                var attributeValue = get(param);

                $element.attr(attributeName, attributeValue);
            }
        }

        var output = '';
        $element.each(function() {
            output += $(this).get(0).outerHTML;
        });

        return chunk.write(output);
    };

})(typeof exports !== 'undefined' ? require('dustjs-linkedin') : dust);
