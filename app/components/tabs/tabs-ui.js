define(['$'], function($) {
    // show the tab at index within $parent
    var showTab = function($parent, index) {
        var $tabs = $parent.find('.c-tabs__content');
        var $currentTab = $tabs.eq(index);

        var $tabControls = $parent.find('.c-tabs__controls-item');
        var $currentTabControl =  $tabControls.eq(index);

        var $tabButtons = $parent.find('.c-tabs__button');
        var $currentTabButton = $tabButtons.eq(index);

        // SUPT-148: Don't scroll the page when the tab is focused
        var x = window.scrollX;
        var y = window.scrollY;

        // Change state
        $tabs.removeClass('c--current');
        $currentTab.addClass('c--current');

        $tabs.attr('aria-hidden', true);
        $currentTab.attr('aria-hidden', false);

        $tabControls.removeClass('c--current');
        $currentTabControl.addClass('c--current');

        $tabButtons.attr('aria-selected', false);
        $currentTabButton.attr('aria-selected', true);

        $tabButtons.attr('tabindex', -1);
        $currentTabButton.attr('tabindex', 0);

        // If the user is navigating between the tabs with the arrow keys
        // We need to focus on the current tab so they can continue to move between them
        $currentTabButton.focus();

        window.scrollTo(x, y);
    };

    var bindEvents = function() {
        // If the user clicks on a tab button, show the appropriate tab
        $('.c-tabs__controls').on('click', '.c-tabs__button', function() {
            var $tabButton = $(this);
            var $parent = $tabButton.parents('.c-tabs');
            var tabIndex = $parent.find('.c-tabs__controls-item').index($tabButton.parent());

            showTab($parent, tabIndex);
        });
    };

    var init = function() {
        // If there is a tab that already had .c--current select it
        // Otherwise, just select the first tab
        $('.c-tabs').each(function() {
            var $tabsContainer = $(this);

            var $currentlySelectedTab = $tabsContainer.find('.c-tabs__content.c--current');

            if ($currentlySelectedTab.length) {
                showTab($tabsContainer, $currentlySelectedTab.index());
            } else {
                showTab($tabsContainer, 0);
            }
        });

        bindEvents();
    };

    return {
        init: init
    };
});
