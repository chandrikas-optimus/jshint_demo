define([
    '$',
    'dust!pages/product/partials/thumbnails-and-swatches',
    'pages/product/parsers/swatches-parser',
    'magnifik',
    'global/utils',
    'global/utils/dom-operation-override'
], function(
    $,
    thumbnailsAndSwatchesTemplate,
    swatchesParser,
    magnifik,
    Utils,
    domOverride
) {

    if ($('.t-product').length === 0) {
        return; // exit early
    }

    var thumbnailData;
    var swatchesReady = false;

    var $magnifik = $('.js-magnifik');
    var $zoom = $('.js-zoom');
    var $featuredImage = $('.js-product-image .c-featured-image img');

    var $thumbnailsAndSwatchesContainer = $('.js-thumbnails-and-swatches');
    var $thumbnails;
    var $swatches;
    var originalImageWidth = 85;
    var mainImageSetInitialized = false;

    var removeDuplicates = function(list) {
        var uniques = [];
        $.each(list, function(i, el) {
            if ($.inArray(el, uniques) === -1) {
                uniques.push(el);
            }
        });
        return uniques;
    };

    var parseImageSet = function(imageString) {
        var images = imageString.split(/[,;]/);

        images = removeDuplicates(images).filter(function(img) {
            return $('.js-product-image img[src="' + img.imageSrc + '"]').length === 0;
        });

        var additionalImages = $.map(images, function(image) {
            var $img = $(this);
            image = 'http://chasingfireflies.scene7.com/is/image/' + image + '?wid=' + (originalImageWidth * 2) + '&op_sharpen=1';

            return {
                slideContent: $('<img>').attr('src', image)
            };
        });

        var slides = [{
            slideContent: $('.js-product-image .c-featured-image img').clone()
        }];
        slides = slides.concat(additionalImages);

        return {
            slider: {
                slides: slides,
                slidesLength: slides.length
            }
        };
    };

    var _updateFeaturedImage = function(filename) {
        var newSrc;
        var newZoomSrc;

        if (/render/i.test(filename)) {
            newSrc = filename;
            newZoomSrc = filename.replace('$P_Main$', '$pczoom$');
        } else {
            newSrc = Utils.getImageUrl(false, filename);
            newZoomSrc = Utils.getImageUrl(true, filename);
        }

        $featuredImage.attr('src', newSrc);

        // Also make sure that the magnifik version is in sync
        $magnifik.attr('href', newZoomSrc);
        $magnifik.find('img').attr('src', newSrc);
    };

    var _highlightCurrentSlide = function($currentSlide) {
        var activeClass = 'c--active';

        var $oldActiveSlides = $thumbnailsAndSwatchesContainer.find('.c-slideshow__slide').filter('.' + activeClass);
        $oldActiveSlides.removeClass(activeClass);

        $currentSlide.addClass(activeClass);
    };

    var initMagnifik = function() {
        $magnifik.magnifik({
            stageHTML: function() {
                var closeIcon = '<svg class="c-icon "><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-delete"></use></svg>';
                return '<div class="' + this._getClass('canvas') + '"><div class="m-close c-zoom c--top-right">' + closeIcon + '</div><img class="'
                    + this._getClass('thumb') + '"><img class="'
                    + this._getClass('full') + '"></div>';
            }
        });
        $zoom.on('click', function() {
            $magnifik.find('img').trigger('click');
        });
    };

    var initThumbnailsAndSwatches = function() {
        if ($('.t-product-configurator').length === 0 && !(swatchesReady && thumbnailData)) {
            return;
        }

        var data = {
            thumbnails: thumbnailData,
            swatches: swatchesParser.parse($('.gwt-product-additional-colors-panel'))
        };

        thumbnailsAndSwatchesTemplate(data, function(err, html) {
            $thumbnailsAndSwatchesContainer.html(html);
            if (html && html.trim() < 1) {
                $thumbnailsAndSwatchesContainer.attr('hidden', 'hidden');
            } else {
                $thumbnailsAndSwatchesContainer.removeAttr('hidden');
            }
            $thumbnails = $('.js-thumbnails');
            $swatches = $('.js-swatches');

            $thumbnails.find('img[src*="_VNT_MAIN"]').addClass('js-render-image-0');
            $thumbnails.find('img[src*="_VNT_BACK"]').addClass('js-render-image-1');
        });

        $thumbnails.on('click', 'li img', function() {
            var $this = $(this);
            var imgSrc = $this.attr('src');
            var matched = imgSrc.match(/\/(\d+\_.*)\?/);

            if (/render/i.test(imgSrc)) {
                _updateFeaturedImage(imgSrc);
                _highlightCurrentSlide($this.closest('.c-slideshow__slide'));
            } else if (matched) {
                var filename = matched[1];

                _updateFeaturedImage(filename);
                _highlightCurrentSlide($this.closest('.c-slideshow__slide'));
            }
        });

        $swatches.on('click', '.js-swatches-label', function() {
            var $img = $(this).find('img');
            var matched = $img.attr('src').match(/\/(\d+\_.*)_SW\?/);

            if (matched) {
                var filename = matched[1];
                _updateFeaturedImage(filename);

                _highlightCurrentSlide($(this).closest('.c-slideshow__slide'));
            }
        });
    };

    var gotThumbnailData = function(imgData) {
        if (mainImageSetInitialized) {
            return;
        }

        mainImageSetInitialized = true;

        var images = parseImageSet(imgData[0].IMAGE_SET);

        if (images[0] === '') {
            return;
        }

        thumbnailData = images;
        initThumbnailsAndSwatches();
    };

    var init = function() {

        // Polling is needed here because:
        // - we don't want to override desktop function when it hasn't existed yet
        // - at some point, desktop script checks whether the function exists, so we do not want to be the 1st one setting it
        var pollingForFunctionInitialization = setInterval(function() {
            if (window.s7jsonResponse) {
                var originalFn = window.s7jsonResponse;

                window.s7jsonResponse = function() {
                    originalFn && originalFn.apply(this, arguments);
                    gotThumbnailData(arguments);
                };
                clearInterval(pollingForFunctionInitialization);
            }
        }, 30);

        domOverride.on('domAppend', '.gwt-product-additional-colors-panel', function() {
            swatchesReady = true;

            var $panel = $(arguments[0]);

            var pollingForImageSrc = setInterval(function() {
                if ($panel.attr('aria-hidden') || $panel.find('img').length === 0) {
                    // Actually there is no swatches for this product
                    clearInterval(pollingForImageSrc);
                    return;

                    // Test with the following pages:
                    // http://stagewcs.chasing-fireflies.com/boys-slate-gray-suit/179682
                    // http://stagewcs.chasing-fireflies.com/personalized-swan-hooded-towel/gift-shop/gifts-for-home/meals-bath-time/202412
                }

                var $img = $('.gwt-product-additional-colors-panel .gwt-product-additional-color img').first();
                if ($img.length && $img.attr('src')) {
                    clearInterval(pollingForImageSrc);

                    // Wait a bit before we init them, to make sure that all swatches are assigned their src attributes (CF-704)
                    setTimeout(initThumbnailsAndSwatches, 200);
                }
            }, 300);
        });
    };

    return {
        init: init,
        initMagnifik: initMagnifik
    };
});
