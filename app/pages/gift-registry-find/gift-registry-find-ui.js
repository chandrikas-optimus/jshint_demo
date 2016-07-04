define([
    '$',
    'global/utils/dom-operation-override',
    'global/parsers/alert-parser',
    'components/alert/alert-ui',
    'global/utils',
    'hijax',
    'dust!components/loading/loading'
], function($, domOperation, alertParser, Alert, Utils, Hijax, LoaderTemplate) {
    var $searchResultsContainer = $('.js-registry-results');
    var $noResultsMessage = $('.js-no-results-message');
    var $loading = $('.js-loader');
    var $pageContainer = $('.js-page');

    var _transformField = function($field) {
        if (!$field.length) {
            return;
        }

        var $cInput = $('<div class="c-input"></div>');
        var $cFieldRow = $('<div class="c-field-row u-margin-top-md"></div>');
        var $input = $field.find('input');

        if ($input.hasClass('gwt-search-regid')) {
            $input.attr('type', 'tel');
        }

        $input.wrap($cInput);
        $field.find('.gwt-RealLabel').addClass('c-label');
        $field.find('.required').addClass('u-text-warning');
        $field.addClass('c-field');
        $field.wrap($cFieldRow);


        $input.on('focus', function(e) {
            var $container = $(this).closest('.js-registry-by-name');

            $container.find('.c-button').removeClass('c--disabled');
        });
    };

    var _transformSearchResults = function() {
        // swap causes issues with GWT, so wrapping with h2 instead
        var $heading = $('.gwt-registry-search-results-message').wrap('<h2>').parent();
        var $resultsTable = $('.gwt-gr-search-panel table').first();
        // can't run through dust template because GWT will lose event bindings

        $searchResultsContainer.append($heading);

        $searchResultsContainer.find('.js-registry-results-content .c-scroller__content').append($resultsTable.addClass('c-table'));
    };

    var _makeFirstColumnStatic = function() {
        var $table = $('.js-reuslts-table');
        var $staticColumn = $('.js-registry-results-names');
        var $title = $table.find('th:first-child').attr('hidden', 'hidden').clone();
        var $names = $table.find('tbody tr td:first-child').attr('hidden', 'hidden').clone();

        $title.removeAttr('hidden');
        $names.removeAttr('hidden');

        $staticColumn.find('thead').empty().append($title);
        $staticColumn.find('tbody').empty().append($names.wrap('<tr>').parent());
    };

    var _revertButton = function() {
        $('.js-active-button')
            .removeClass('js-active-button')
            .find('.js-loading').attr('hidden', 'true')
            .siblings('span').removeAttr('hidden');
    };

    var _transformFindButton = function($button, rowClass) {
        $button.addClass('c-button c--primary c--full-width ');
        $button.wrap('<div class="c-field-row ' + rowClass + '">');

        new LoaderTemplate({class: 'js-loading'}, function(err, html) {
            $button.append($(html).attr('hidden', 'true'));
        });

        $button.on('click', function(e) {
            $button.find('span').attr('hidden', 'true');
            $button.find('.js-loading').removeAttr('hidden');
            $button.addClass('js-active-button');
        });
    };

    var _transformFindById = function($findByIdContainer) {
        _transformFindButton($findByIdContainer.find('button'), 'u-margin-bottom-xlg');
        $findByIdContainer.find('.spot').each(function() {
            _transformField($(this));
        });
    };

    var _transformFindByName = function($findByNameContainer) {
        _transformFindButton($findByNameContainer.find('button'), 'u-margin-bottom-lg');
        $findByNameContainer.find('.spot').each(function() {
            _transformField($(this));
        });
    };

    var _showErrors = function($errorContainer, errorTransformFunction) {
        var errorData = alertParser.parse(
            $errorContainer,
            errorTransformFunction);

        errorData.class = 'c--fixed';
        _revertButton();

        $('.js-error-messages').prop('hidden', false);
        Alert.update($('.c-alert'), errorData);
    };

    var _transformNoResults = function(notFoundMessage) {
        var $notFoundMessage = $(notFoundMessage);

        if (!$notFoundMessage.length) {
            return;
        }

        _showErrors($notFoundMessage, function($container) { return $container; });
        // gwt appends no results into the table, so dup the msg and hide the table
        $('.js-reuslts-table').attr('hidden', 'hidden');
    };

    var _transforms = function(findByIdContainer) {
        var $findByNameContainer = $('#giftRegSearchFormPanel');
        var $findByIdContainer = $(findByIdContainer);

        _transformFindById($findByIdContainer);
        _transformFindByName($findByNameContainer);

        _transformSearchResults();

        $loading.remove();
        $pageContainer.removeAttr('hidden');
    };

    var _bindEvents = function() {
        var hijax = new Hijax();

        hijax.set('searchRegistry', function(url) {
            return /GiftRegistrySearchJSONCmd/.test(url);
        }, {
            complete: function() {
                if (!$('.errortxt').length && $searchResultsContainer.find('.gwt-Anchor').length) {
                    _makeFirstColumnStatic();
                    $searchResultsContainer.removeAttr('hidden');
                    $('.js-active-button').addClass('c--disabled');
                    _revertButton();
                    $searchResultsContainer.find('.js-reuslts-table').removeAttr('hidden');
                    $noResultsMessage.attr('hidden', 'hidden');
                } else {
                    Utils.decorateErrorsAlert();
                }
            }
        });
    };

    var _handleFormErrors = function(errorContainer) {
        var $errorContainer = $(errorContainer);

        _showErrors($errorContainer, function($container) {return $container.children(); });
    };

    var giftRegistryFindUI = function() {
        domOperation.on('domAppend', '', _transforms, '#giftRegIdPanel');
        domOperation.on('domAppend', '.GR-no-results-found', _transformNoResults, '');
        domOperation.on('domAppend', '.gwt-csb-error-panel', _handleFormErrors);
        Alert.init();
        _bindEvents();
    };

    return giftRegistryFindUI;
});
