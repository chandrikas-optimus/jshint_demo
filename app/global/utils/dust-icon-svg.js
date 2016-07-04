/* global dust */
(function(dust) {
    // SVG Icon implementation.
    var svgIcon = function(name, title, className) {
        if (name === undefined) {
            throw 'Argument `name` is required';
        }

        var titleAttr = '';
        var titleEl = '';
        var output;

        if (title !== undefined) {
            titleAttr = ' title="' + title + 's"';
            titleEl = '<title>' + title + '</title>';
        }

        if (className === undefined) {
            className = '';
        }

        output = '<svg class="c-icon ' + className + '"' + titleAttr + '>';
        output += titleEl;
        output += '<use xlink:href="#icon-' + name + '"></use>';
        output += '</svg>';

        return output;
    };

    // Register the dust helper
    //
    // {@icon name="chevron-down" title="Next" /}

    dust.helpers.icon = function(chunk, context, bodies, params) {
        var name = dust.helpers.tap(params.name, chunk, context);
        var title = dust.helpers.tap(params.title, chunk, context);
        var className = dust.helpers.tap(params.class, chunk, context);

        return chunk.write(svgIcon(name, title, className));
    };

    // Return the normal function only
    return svgIcon;
})(typeof exports !== 'undefined' ? require('dustjs-linkedin') : dust);
