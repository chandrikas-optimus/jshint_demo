define([
    '$'
], function($) {

    var $socialContainer;

    var _updateSocialLinks = function() {
        var $tellAFriend = $socialContainer.find('.tell-friend-button');

        $socialContainer.addClass('t-wish-gift__social');
        $socialContainer.find('.facebookLike, .twitterShare, .pinterestPinIt, .plusContent').addClass('c-arrange__item c--shrink')
            .wrapAll('<div class="c-arrange c--justify-between" />');

        $tellAFriend.addClass('c-button c--plain c--brand u-text-weight-bold u-padding-none');
        $tellAFriend.text('+ Tell a Friend');

        $tellAFriend.insertBefore($socialContainer.find('.clear'));

        $socialContainer.removeAttr('hidden');
    };


    var _overrideDesktop = function() {
        var _oldBuildSocial = window.buildSocialPlugins;

        window.buildSocialPlugins = function() {
            _oldBuildSocial.apply(this, arguments);

            _updateSocialLinks();
        };
    };

    var _init = function() {
        $socialContainer = $('.js-social');
        if ($socialContainer.children().length) {
            _updateSocialLinks();
        } else {
            _overrideDesktop();
        }
    };

    return {
        init: _init
    };
});
