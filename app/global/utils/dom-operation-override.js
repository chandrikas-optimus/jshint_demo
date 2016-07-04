define(['$'], function($) {

    var isInitialized = false;
    var callbackQueue = {
        'domInsertBefore': [],
        'domAppend': [],
        'domRemove': []
    };

    var DomOperationOverride = function() {

        if (DomOperationOverride.prototype._instance) {
            return DomOperationOverride.prototype._instance;
        }

        DomOperationOverride.prototype._instance = this;
    };

    var init = function() {

        if (isInitialized) {
            return;
        }

        isInitialized = true;

        // Override native functions
        var _insertBefore = Element.prototype.insertBefore;
        Element.prototype.insertBefore = function() {
            _insertBefore.apply(this, arguments);
            $(document).trigger('domInsertBefore', [this, arguments]);
        };

        var _appendChild = Element.prototype.appendChild;
        Element.prototype.appendChild = function() {
            var result = _appendChild.apply(this, arguments);
            // console.log('append', this, arguments);
            $(document).trigger('domAppend', [this, arguments]);
            return result;
        };

        var _removeChild = Element.prototype.removeChild;
        Element.prototype.removeChild = function() {
            var result = _removeChild.apply(this, arguments);
            $(document).trigger('domRemove', [this, arguments]);
            return result;
        };

        $(document).on('domInsertBefore domAppend domRemove', function(event, parentSelector, childSelector) {
            if (callbackQueue[event.type]) {
                if (window.logDom) {
                    console.log(event.type, childSelector, parentSelector);
                }
                $.each(callbackQueue[event.type], function(idx, callbackObj) {
                    if ($(childSelector[0]).is(callbackObj.childSelector) || $(parentSelector).is(callbackObj.parentSelector)) {
                        setTimeout(function() {
                            callbackObj.callback.call(parentSelector, childSelector);
                        }, 0);
                    }
                });
            }
        });
    };

    DomOperationOverride.prototype.on = function(eventName, childSelector, callback, parentSelector) {
        init();

        if (!callbackQueue[eventName]) {
            return;
        }

        callbackQueue[eventName].push({
            childSelector: childSelector,
            callback: callback,
            parentSelector: parentSelector
        });
    };

    DomOperationOverride.prototype.off = function(eventName, childSelector, parentSelector) {
        if (!callbackQueue[eventName]) {
            return;
        }

        var newQueue = [];
        $.each(callbackQueue[eventName], function(idx, callbackObj) {
            if (callbackObj.childSelector === childSelector || (parentSelector && parentSelector === callbackObj.parentSelector)) {
                callbackObj.callback.call(parentSelector, childSelector);
            }
        });
        callbackQueue[eventName] = newQueue;
    };

    return new DomOperationOverride();
});
