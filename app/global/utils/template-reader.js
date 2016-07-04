define(['$'], function($) {

    var _parseJSONContainer = function($JSONContainer) {
        var data;

        if ($JSONContainer.length) {
            // $script.attr('x-src', '');
            $JSONContainer = $JSONContainer.text().replace(/\/\* mobify preserve \*\//, '').replace('/*', '').replace('*/', '');
            try {
                data = JSON.parse($JSONContainer);
            } catch (err) {
                console.error('Template reader failed to parse JSON: JSON.parse failed', err);
            } finally {
                return data || {};
            }
        }

        return data;
    };

    var _parseUsingEval = function($JSONContainer) {
        var data;

        if ($JSONContainer.length) {
            var JSONText = $JSONContainer.text().replace(/\/\* mobify preserve \*\//, '').replace('/*', '').replace('*/', '');
            try {
                data = eval('(' + JSONText + ')');
            } catch (err) {
                console.error('Template reader failed to eval Object literal string: eval failed', err);
            } finally {
                return data || {};
            }
        }
    };

    // params: takes templateContainer with a template script inside of it
    // returns: JSON that contains the page's data
    //          undefined if script doesn't exist
    var _parse = function($templateContainer, useEval) {

        var $container = $templateContainer;

        if (!$container.length) {
            console.error('Template Reader: JSON Template failed: template container is undefined');
            return;
        }

        var $JSONContainer = $container.find('script').length ? $container.find('script') : $container;

        return useEval ? _parseUsingEval($JSONContainer) : _parseJSONContainer($JSONContainer);
    };


    // returns the JSON data that desktop scripts use to render their page
    return {
        parse: _parse,
        parseJSONContainer: _parseJSONContainer,
        parseUsingEval: _parseUsingEval
    };
});
