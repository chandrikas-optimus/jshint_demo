// NOTE: parser intended for the customer service side navigation
define(['$'], function($) {
    return {
        context: {
            sidenav: function() {
                var $sideBox = $('.customerServiceSideBox');
                return $sideBox.map(function(_, box) {
                    var $box = $(box);
                    var $content = $box.find('ul a');

                    // First, exclude certain links (CF-626)
                    $content = $content.filter(function() {
                        var excludedList = [
                            'GiftRegistryHomeView',  // TODO: this one will be included back after phase 2 is done
                            'CatalogQuickShopView',
                            'cf-cares/content'
                        ];
                        var regex = new RegExp(excludedList.join('|'));

                        var isExcluded = regex.test($(this).attr('href'));
                        return !isExcluded;
                    });

                    $content.each(function(_, item) {
                        var $item = $(item);
                        $item.wrap('<div class="c-stack__item"/>');
                    });
                    $box.find('.c-stack__item').wrapAll('<div class="c-stack u-margin-top-sm"/>');
                    $box.find('a').addClass('u-text-black-link');

                    return {
                        headerContent: $box.find('h1').first().text() || 'customer service',
                        content: {data: $box.find('.c-stack')}
                    };
                });
            }
        }
    };
});
