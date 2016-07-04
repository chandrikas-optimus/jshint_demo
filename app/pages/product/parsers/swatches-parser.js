define(['$'], function($) {

    var parse = function($container) {
        return {
            slider: {
                swatchSlides: $container.find('.gwt-product-additional-color').map(function() {
                    var url = $(this).find('img').attr('src');

                    if (url) {
                        return {
                            swatchClass: 'c--large',
                            swatchURL: url.replace(/\$.+\$/, ''),  // url to higher-res version
                            swatchName: $(this).find('.gwt-product-additional-color-label').text()
                        };
                    } else {
                        return null;
                    }
                })
            }
        };
    };

    return {
        parse: parse
    };
});
