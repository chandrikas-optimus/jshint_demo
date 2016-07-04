define([
    '$',
    'components/alert/alert-ui',
    'global/parsers/alert-parser',
    'dust!components/loading/loading',
    'global/utils/dom-operation-override'
], function(
    $,
    Alert,
    alertParser,
    LoadingTmpl,
    domOverride
) {
    var uid = 0;

    var _decorateErrorsAlert = function() {
        var $errorsContainer = $('.js-error-messages');
        var $desktopErrors = $('#gwt-error-placement-div, .gwt-addr-edit-error-panel, .gwt-csb-error-panel-popup, .js-desktop-errors');

        // Filter out duplicates
        $desktopErrors.find('.gwt-HTML').each(function() {
            $desktopErrors.find('.gwt-HTML:contains("' + $(this).text() + '"):gt(0)').remove();
        });

        var errorData = alertParser.parse(
            $desktopErrors,
            function($container) {
                return $container.find('.gwt-csb-error-panel .gwt-HTML, .error_Mesaage_validation').not(':empty');
            }
        );
        errorData.class = 'c--fixed';

        // Show error messages if necessary
        if (errorData.messages.length > 0) {
            $errorsContainer.prop('hidden', false);
            Alert.update($('.c-alert'), errorData);
        } else {
            // No errors!
            $errorsContainer.prop('hidden', true);
        }
    };

    var _decorateFieldErrors = function() {
        var $newErrors = $('.errortxt');
        var $oldErrors = $('.c-field.c--error');
        var $noLongerErrors = $oldErrors.not($oldErrors.has('.errortxt'));

        $newErrors.closest('.c-field').addClass('c--error');
        $noLongerErrors.removeClass('c--error');
    };

    var _getImageSize = function(isZoom) {
        return isZoom ? '?$pczoom$' : '?$P_MainM$';
    };

    var _isPlaceholderOptionSelected = function($select) {
        var selectedVal = $.trim($select.val());
        // example: 'Select Color'
        return /^select\b/i.test(selectedVal);
    };

    var _isUnavailableOptionSelected = function($select) {
        var $selectedOption = $select.children('option').eq($select.get(0).selectedIndex);
        // example: 'Pink Combination Unavailable.'
        return /unavailable/i.test($selectedOption.text());
    };



    var Utils = {
        // Define Utility functions here
        decorateErrorsAlert: _decorateErrorsAlert,
        decorateFieldErrors: _decorateFieldErrors,
        updateParentIframeHeight: function() {
            var actualHeight = $('.x-main').height();
            parent.postMessage(actualHeight, '*');
        },

        // Preserve/leave the given desktop scripts as they are in the DOM
        preserveInlineScripts: function($desktopScripts) {
            $desktopScripts.each(function() {
                var $script = $(this);

                if ($script.is('[x-src]')) {
                    console.error('Must be an inline script');
                    // NOTE: To preserve an external script, please tweak `src` of the `preserve` option in baseView.js
                } else {
                    var withCommentAdded =
                        '/* mobify preserve */' +
                        $script.text();

                    $script.text(withCommentAdded);
                }


            });
        },

        /* eslint-disable camelcase */
        overrideFormFunctions: function(nameOfSubmitFunction) {
            var _add_error = window.add_error;
            window.add_error = function(id, errorMessage) {
                var $el = $('#' + id);
                var originalClasses = $el.attr('class');

                _add_error.apply(this, arguments);

                // Preserve our c- classes
                $el.addClass(originalClasses);

                // Decorate errors
                _decorateFieldErrors();
            };

            if (nameOfSubmitFunction) {
                var _submit = window[nameOfSubmitFunction];
                window[nameOfSubmitFunction] = function(form) {
                    var $signInButton = $('.js-sign-in-button');
                    var originalClasses = $signInButton.attr('class');

                    var validationResult = _submit.apply(this, arguments);

                    // Preserve our c- classes
                    // CF-322: Keep our button shown. Desktop hides it
                    $signInButton.show().addClass(originalClasses);

                    $('body').trigger('formSubmit.mobify', [$(form)]);

                    // CF-322: Loading state for submit button on success
                    if (validationResult) {
                        new LoadingTmpl({ class: 'c--small' }, function(err, out) {
                            $signInButton.html(out);

                            // CF-322
                            // Disabled attribute was overriding our primary styles
                            $signInButton.removeAttr('disabled');

                            // CF-322
                            // Hide / Show button to trigger loading CSS animation
                            $signInButton.hide();
                            $signInButton.show();
                        });
                    }

                    return validationResult;
                };
            }

            var _hideErrorSmartPanel = window.hideErrorSmartPanel;
            window.hideErrorSmartPanel = function() {
                var errorSmartPanelesult = _hideErrorSmartPanel.apply(this, arguments);

                // Re-decorate errors (will clean up fixed errors)
                _decorateFieldErrors();

                return errorSmartPanelesult;
            };

            $('body').on('formSubmit.mobify', function(e, $form) {
                // Don't need desktop styles
                $form.find('.c-field label[style]').removeAttr('style');

                // Decorate errors using alert component
                _decorateErrorsAlert();
                _decorateFieldErrors();
            });

            $('body').on('alertClosed.mobify', function(e, $alert) {
                var $errorsContainer = $('.js-error-messages');
                $errorsContainer.prop('hidden', true);
            });
        },
        /* eslint-enable camelcase */

        // Great for transforming/decorating dynamic content inserted by GWT
        afterAppendChild: function(selectorOfParentElement, callback) {
            $('body').on('afterAppendChild', function(e, $parent, $child) {
                if ($parent.is(selectorOfParentElement)) {
                    callback($parent, $child);
                }
            });
        },
        checkValidation: function($inputs, $button) {
            var isFilled = true;

            $inputs.each(function() {
                var $input = $(this);

                if ($input.is('input')) {
                    if ($input.val().length === 0) {
                        isFilled = false;
                    }
                } else if ($input.is('select')) {
                    if (_isPlaceholderOptionSelected($input) || _isUnavailableOptionSelected($input)) {
                        isFilled = false;
                    }
                }

                if (!isFilled) return false;
            });

            isFilled ? $button.attr('disabled', false) : $button.attr('disabled', true);

        },

        getImageSize: _getImageSize,
        getImageUrl: function(isZoom, filename) {
            var size = _getImageSize(isZoom);
            return '//chasingfireflies.scene7.com/is/image/ChasingFireflies/' + filename + size;
        },
        replaceWithPrototypeElements: function(desktopSelector) {
            // thanks to prototype, desktop events are not respected by jQuery
            // so we need to replace the original element to keep desktop events
            $('.js-needs-replace').filter(function() {
                return !$(this).closest(desktopSelector).length;
            }).each(function() {
                var $needsReplace = $(this);
                var selector = $needsReplace.attr('data-replace-id');
                var $original = $(desktopSelector).find('[data-replace-id="' + selector + '"]')
                                    .removeClass('js-needs-replace');

                $needsReplace.replaceWith($original);
            });
        },
        generateUid: function() {
            return uid++;
        },
        disablePredictiveText: function($input) {
            if (!$input.length) {
                return;
            }

            $input.attr('autocomplete', 'off')
            .attr('autocapitalize', 'off')
            .attr('spellcheck', false);
        },
        buildToggle: function($hiddenDiv, text, toggleClasses, stacked) {
            var $toggleContent = $hiddenDiv.wrap($('<div>', {
                class: 'u-visually-hidden js-add-another-toggle'
            })).parent();

            var $toggleTrigger = $('<a>', {
                class: 'c-button ' + toggleClasses,
                text: text
            });

            var $immediateSibling = $toggleContent.prev('.js-add-another-toggle').length ?
                                    $toggleContent.prev() :
                                    $toggleContent.next();

            if (stacked && $immediateSibling.is('.js-add-another-toggle')) {
                $immediateSibling.append($toggleTrigger);
            } else {
                $toggleContent.before($toggleTrigger);
            }

            $toggleTrigger.on('click', function() {
                // one-time trigger
                $hiddenDiv.unwrap();
                $toggleTrigger.remove();
            });
        },
        replaceWithPrototypeElements: function(desktopSelector) {
            // thanks to prototype, desktop events are not respected by jQuery
            // so we need to replace the original element to keep desktop events
            $('.js-needs-replace').filter(function() {
                return !$(this).closest(desktopSelector).length;
            }).each(function() {
                var $needsReplace = $(this);
                var selector = $needsReplace.attr('data-replace-id');
                var $original = $(desktopSelector).find('[data-replace-id="' + selector + '"]')
                                    .removeClass('js-needs-replace');

                $needsReplace.replaceWith($original);
            });
        },
        bindDialogPinny: function(transforms, pinnyContentSelector, utils, openedCB, closedCB) {
            var transformsFunction = transforms;
            var $pinny = $('.js-dialog-box-pinny');
            var $pinnyCloseBtn = $pinny.find('.pinny__close');
            var $pinnyShade = $('.js-dialog-box-shade');
            var $pinnyContent = $pinny.find('.pinny__content');
            var gwtCloseBtnContainerSelector = '.okCancelPanel, .gwt-submit-cancel-dialog-button-panel';

            // do not override except for whitelisted modals
            var _unbind = function($appendingElement) {
                return !$appendingElement.find(pinnyContentSelector).length;
            };

            var _closePinny = function($appendingElement) {
                var $appendingElement = $(arguments[0]);

                if (_unbind($appendingElement)) {
                    return;
                }

                var $lockup = $('.lockup__container');
                $pinny.parent().appendTo($lockup);
                $pinnyShade.appendTo($lockup);

                $pinny.pinny('close');
                if (typeof closedCB === 'function') {
                    closedCB();
                }
            };

            var _bindClose = function($container) {
                $('body').on('click', '.js-dialog-box-pinny .pinny__close', function() {
                    var $desktopCloseBtn = $container.find(gwtCloseBtnContainerSelector).find('button').filter(function() {
                        return $(this).is('.button.secondary');
                    }).find('span');

                    $desktopCloseBtn.click();
                });
            };

            var _globalModalTransforms = function($appendingElement) {
                // move gwt dialog box content into pinny, but move pinny into
                // dialog box wrapper so gwt bindings still work
                $pinnyContent.empty()
                    .append($appendingElement.find(pinnyContentSelector))
                    .append($appendingElement.find('.okCancelPanel'));

                $appendingElement.contents().hide();
                $appendingElement
                    .append($pinny.closest('.pinny'))
                    .append($pinnyShade);

                // transform buttons: CTA should always be before cancel
                $pinny.find('.button.primary').addClass('c-button c--primary c--full-width u-margin-bottom-md')
                    .after($pinny.find('.button.secondary').addClass('c-button c--outline c--full-width u-margin-bottom-md'));
            };

            var _openPinny = function() {
                var $appendingElement = $(arguments[0]);

                if (_unbind($appendingElement)) {
                    return;
                }

                $appendingElement.removeAttr('style');

                // apply our template-based transforms
                transformsFunction($appendingElement);
                _globalModalTransforms($appendingElement);

                _bindClose($pinny.closest('.gwt-DialogBox'));

                $pinny.pinny('open');

                if (typeof openedCB === 'function') {
                    setTimeout(function() { openedCB(); });
                }
            };

            domOverride.on('domAppend', '.gwt-DialogBox', _openPinny);
            domOverride.on('domRemove', '.gwt-DialogBox', _closePinny);
        }

    };

    return Utils;

});
