define([
    '$',
    'external!pages/product/parsers/product-data-parser',
    'components/sheet/sheet-ui',
    'dust!pages/product-configurator/partials/preview-pinny'
], function(
    $,
    productDataParser,
    Sheet,
    PreviewPinnyTemplate
) {
    var $banner = $('.js-preview-banner');
    var $previewPinny = Sheet.init($('.js-preview-pinny'), {});
    var optionsData = productDataParser.getRenderImageSlugs();

    var getRenderedImages = function() {
        if (optionsData && $('.js-configure__configurator-section').length) {
            var renderImageUrl = 'http://chasingfireflies.scene7.com/is/image/ChasingFireflies/?layer=0&src=ir(' + optionsData.mainSlug + '?';
            var images = {
                main: renderImageUrl,
                back: renderImageUrl
            };

            $('.js-configure__configurator-section').each(function(idx, section) {
                var $section = $(section);
                var $selectedSwatch = $section.find('.js-section__selected-swatch');

                if ($selectedSwatch.length && typeof $selectedSwatch.attr('hidden') === 'undefined') {
                    var key = $selectedSwatch.find('img').attr('src').match(/_([^_]*)_/)[1];
                    var slug = optionsData.renderOptionsData[idx][key] + '&';

                    images.main += slug;
                    images.back += slug;
                }
            });

            images.main = images.main.substr(0, images.main.length - 1) + ')&$P_Main$';
            images.back = images.back.substr(0, images.back.length - 1) + ')&$P_Main$';

            return $('<img>').attr('src', images.main.replace(/_VNT/g, '_VNT_MAIN')).add($('<img>').attr('src', images.back.replace(/_VNT/g, '_VNT_BACK')));
        } else {
            return $('.js-thumbnails-and-swatches img').first();
        }
    };

    var updateBanner = function() {
        setTimeout(function() {
            var $price = $('.price-panel');

            if (!$price.hasClass('nodisplay')) {
                $('.js-preview-banner__price-label').text($price.find('.gwt_price_as_shown_label').text()).removeAttr('hidden');
                $price = $('.gwt-product-detail .gwt-product-detail-top-price');
            } else {
                $price = $('.configure-price-panel').first();
            }

            var $renderImgs = getRenderedImages();

            $banner.find('.js-preview-banner__price').text($price.text());
            $banner.find('.js-preview-banner__image').attr('src', $renderImgs.first().attr('src'));

            $renderImgs.each(function(idx, img) {
                $('.js-render-image-' + idx).attr('src', $(img).attr('src'));
            });
        }, 300);
    };

    var showPreviewPinny = function() {
        var $images = getRenderedImages();
        var slides = $images.map(function(_, image) {
            return {
                slideContent: $(image),
                class: 'js-preview-pinny__thumbnail'
            };
        });

        new PreviewPinnyTemplate({
            image: $images.first().clone().addClass('t-product-configurator__preview-main-image js-preview-pinny__main-image'),
            slider: {
                slides: slides,
                slidesLength: slides.length
            },
            thumbnails: true
        }, function(err, html) {
            $previewPinny.setBody(html);

            $('.js-preview-pinny__thumbnail').on('click', function() {
                $('.js-preview-pinny__main-image').attr('src', $(this).find('img').attr('src'));
            });

            $previewPinny.open();
        });
    };

    var bindBannerEvents = function() {
        $(window).on('scroll', function() {
            var $stickyDiv = $('.js-preview-banner__sticky');
            if (window.scrollY - $stickyDiv.position().top > 56) {
                $('.js-preview-banner').addClass('c--sticky');
                $('.c-configurator').addClass('c--push');
            } else {
                $('.js-preview-banner').removeClass('c--sticky');
                $('.c-configurator').removeClass('c--push');
            }
        });

        $('.js-preview-banner__btn').on('click', showPreviewPinny);
    };

    var init = function() {
        bindBannerEvents();
        updateBanner();
    };

    return {
        init: init,
        updateBanner: updateBanner
    };
});
