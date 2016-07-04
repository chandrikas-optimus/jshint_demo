define([
    '$',
    'resizeImages',
    'descript',
    'adaptivejs/utils',
    'adaptivejs/defaults',
    'settings',
    'global/includes/header/header-context',
    'global/includes/footer/footer-context',
    'global/includes/nav/nav-context',
    'dust!global/base',
    'text!../../static/img/sprite.svg',

    // No variable includes
    'dust-helpers',
    'dust-icon-helper',
    'global/utils/dust-element-attributes',
    'global/jquery-extensions'
],
function($, ResizeImages, Descript, Utils, Defaults, Settings, header, footer, nav, baseTemplate, iconSprite) {
    var descript;

    /**
     * Grab the default cache breaker variable from the Mobify Config
     */
    if (ResizeImages && Settings) {
        ResizeImages.defaults.cacheBreaker = Settings.cacheBreaker;
    }

    /**
     *  Grabs the images which you would like to run through
     *  imageResizer and sends them away. Can be setup
     *  with more profiles for different types of images
     *  if needed.
     */
    var resizeImages = function() {
        var $imgs = $('img');
        var defaultOpts = {
            projectName: Defaults.projectName
        };

        ResizeImages.resize($imgs, defaultOpts);

        return $imgs;
    };

    var isPreservedScript = function() {
        return /\/\* mobify preserve \*\//.test($(this).text());
    };

    return {
        template: baseTemplate,
        includes: {
            header: header,
            footer: footer,
            nav: nav
        },
        /**
        * preProcess receives a context as a paramater and should return
        * that context with any modifications the user needs. This runs
        * before keys in `context` are executed
        */
        preProcess: function(context) {
            // Transforms should take place here rather then within `context`.

            // An example of a DOM transform:
            $('head').find('meta[name="viewport"]').remove();
            $('style, link[rel="stylesheet"]').remove();

            // Use Descript to manipulate the desktop scripts. Please see
            // https://github.com/mobify/descript for detailed documentation.
            descript = Descript.init({
                // src: ['foo/bar.js'],
                preserve: {
                    // See `preserveInlineScripts()` in utils.js on how to add this special comment
                    contains: '/* mobify preserve */'
                }
            });
            // NOTE: after the above init() is called, the desktop scripts are no longer in DOM, except the ones preserved

            descript.replace({contains: 'display_source_code'}, [
                {
                    pattern: 'document.write(sourceCodeMsg)',
                    replacement: 'document.getElementById("sourceCode").innerHTML = sourceCodeMsg'
                }
            ]);

            // Fixing desktop bug
            descript.replace({contains: 'body.className += "desktop"'}, [
                {
                    pattern: '"desktop"',
                    // Make sure there's a space as the separator
                    replacement: '" desktop"'
                }
            ]);

            descript.remove({contains: 'document.write(populateUserToWWCM);'});

            descript.insertScript({src: /jquery\.(sliNav|sliSearch)\.js/}, function() {
                var _search = jQuery.sliSearch;
                if (_search) {
                    jQuery.sliSearch = function() {
                        var result = _search.apply(this, arguments);
                        Adaptive.$('.js-product-tiles-content').trigger('updateStart.mobify');
                        return result;
                    };
                }
            });

            return context;
        },

        /**
        * postProcess receives a context as a paramater and should return
        * that context with any modifications the user needs. This runs
        * after keys in `context` are executed
        */
        postProcess: function(context) {
            // Transforms should take place here rather then within `context`.

            // Uncomment the following line to use Mobify's image resizer:
            // resizeImages();

            // Add the root class to the HTML root
            var $root = $('html');
            $root.addClass('x-root');

            // Add the current `t-template-name` class to the body
            var $body = $('body');
            $body.last().addClass('t-' + context.templateName);

            // We can now safely take out our special comment from all the preserved scripts
            $('script').not('[x-src]').filter(isPreservedScript).each(function() {
                var $script = $(this);
                var withoutOurComment = $script.text().replace('/* mobify preserve */', '');
                $script.text(withoutOurComment);
            });

            return context;
        },

        context: {
            templateName: 'base',
            iconSprite: iconSprite,
            html: function() {
                return $('html');
            },
            head: function() {
                return $('head');
            },
            body: function() {
                return $('body');
            },
            desktopScripts: function() {
                return descript.get('default');
            },
            hiddenGWTData: function() {
                // A more complete collection (originally copied from Ballard)
                // (Might introduce some duplicate elements?)

                var $envVariables = $('<div/>');
                var $envInputs = $('input[type=hidden]').filter(function() {
                    var $form = $(this).closest('form');
                    if ($form.length) {
                        var action = $form.attr('action');
                        return typeof action === 'undefined' || action === '' || action === '#';
                    }
                    return true;
                });
                var $envJSONs = $('.JSON.nodisplay, .JSON.nodisplay-crawlable').parent();


                // Add original elements required by the desktop. As some are required for scripts to run.
                var $envVariables = $('#environment-watermark');
                $envVariables = $envVariables.add($('[id^="gwt_"]').has('.nodisplay, .JSON'));
                $envVariables = $envVariables.add($('[id^="gwt_"].nodisplay'));
                $envVariables = $envVariables.add($('[id^="gwt_"]').filter('[style]'));
                $envVariables = $envVariables.add($('#container > input[type="hidden"]'));
                $envVariables = $envVariables.add($('#mainContent > input[type="hidden"]'));
                $envVariables = $envVariables.add($('#gwt_view_name').parent());
                $envVariables = $envVariables.add($('#gwt_disable_welcome_window'));

                return $envVariables
                    .add($envInputs)
                    .add($envJSONs).not('.x-skip');
            }
        }
    };

});
