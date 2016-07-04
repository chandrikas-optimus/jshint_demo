define([
    '$',
    'global/utils/template-reader',
    'global/utils'
],
function($, templateReader, Utils) {

    // NOTE: originally copied from Ballard

    /**
        Ballard have 4 different containers for holding the product detail data.
        Each container have different JSON markup.

        To have consistentcy in dust, we will account for all differences here in this file.
    **/

    var productJSON;
    var dataMappingType = 'productDetail';

    // var IMAGE_HOST = '//chasingfireflies.scene7.com/is/image/';
    // var IMAGE_SIZE = '640$';
    // var IMAGE_ZOOM_SIZE = '1280$';

    var iterateExist = function(mappingType, $container, $alt) {
        if (!$container.length) {
            dataMappingType = mappingType;
            return $alt;
        }
        return $container;
    };

    var decodeHtmlEntitiesText = function(string) {
        return $('<div>').html(string).text();
    };

    var sortByAscending = function($objects, field) {
        return $objects.sort(function(a, b) {
            return parseFloat(a[field]) - parseFloat(b[field]);
        });
    };

    var init = function() {
        if (productJSON) {
            return productJSON;
        }

        var $container = $('#gwt_productdetail_json');

        $container = iterateExist('bundleDetail', $container, $('#gwt_bundledetail_json'));
        $container = iterateExist('configuratorDetail', $container, $('#gwt_product_configurator_detail_json'));
        $container = iterateExist('shopDetail', $container, $('#COMShopProductJSON'));

        if ($container.length) {
            productJSON = templateReader.parse($container, true);
            console.log(dataMappingType, productJSON);
        }

        return productJSON;
    };

    var getDataMappingType = function() {
        return dataMappingType;
    };

    var getTitle = function() {
        var productJSON = init();
        var title;

        if (dataMappingType === 'productDetail' || dataMappingType === 'configuratorDetail') {
            title = productJSON.pageProduct.prodName;
        } else if (dataMappingType === 'bundleDetail') {
            title = productJSON.bundleName;
        }

        return decodeHtmlEntitiesText(title);
    };

    var getPartNumber = function() {
        var productJSON = init();

        if (dataMappingType === 'productDetail' || dataMappingType === 'configuratorDetail') {
            return productJSON.pageProduct.mfPartNumber;
        } else if (dataMappingType === 'bundleDetail') {
            return productJSON.bundle[0].pageProduct.bundleLeadMFPartNumber;
        }
    };

    var getPartId = function() {
        var productJSON = init();

        switch (dataMappingType) {
            case 'productDetail':
                return productJSON.pageProduct.partNumber;
                break;
            case 'bundleDetail':
                return productJSON.bundle[0].pageProduct.partNumber;
                break;
        }
    };

    var getMainImage = function() {
        return {
            imageSrc: Utils.getImageUrl(false, getPartNumber() + '_main'),
            imageZoomSrc: Utils.getImageUrl(true, getPartNumber() + '_main'),
        };
    };

    var formatPrice = function(minPrice, maxPrice, currencyCode) {
        var currency = currencyCode === 'USD' ? '$' : currencyCode + ' ';
        return currency + minPrice.toFixed(2) + ' - ' + currency + maxPrice.toFixed(2);
    };

    var getPrices = function() {
        var productJSON = init();
        var priceInfo;

        if (dataMappingType === 'productDetail') {
            priceInfo = {
                priceOld: formatPrice(productJSON.pageProduct.minimumPrice, productJSON.pageProduct.maximumPrice, productJSON.pageProduct.currencyCode),
                priceNew: formatPrice(productJSON.pageProduct.minPromoPrice, productJSON.pageProduct.maxPromoPrice, productJSON.pageProduct.currencyCode)
            };
        } else if (dataMappingType === 'bundleDetail') {
            priceInfo = {
                priceOld: formatPrice(productJSON.bundleMinimumPrice, productJSON.bundleMaximumPrice, productJSON.currencyCode),
                priceNew: formatPrice(productJSON.bundleMinPromoPrice, productJSON.bundleMaxPromoPrice, productJSON.currencyCode)
            };
        }

        if (priceInfo.priceOld === priceInfo.priceNew) {
            priceInfo.price = priceInfo.priceOld;
        } else {
            priceInfo.priceDiscount = true;
            priceInfo.priceOld = 'Was ' + priceInfo.priceOld;
            priceInfo.priceNew = 'Sale ' + priceInfo.priceNew;
        }

        return priceInfo;
    };

    var wrapTextNode = function($elements) {
        $elements.contents().each(function() {
            if (this.nodeType === 3 && $.trim(this.textContent) !== '') {
                $(this).wrap('<span>');
            }
        });
    };

    var cleanAndDecorateRawText = function($container) {
        // Remove nested divs
        while ($container.contents().length === 1 && $container.children().is('div')) {
            $container = $container.children();
        }

        // Decorate parent container
        $container.addClass('c-text-content');

        $container.find('[style]').removeAttr('style');

        // Wrapping floating text nodes
        wrapTextNode($container.find('*'));
        wrapTextNode($container);

        return $container;
    };

    var decodeHtmlEntities = function(string) {
        return cleanAndDecorateRawText($('<div>').html(decodeHtmlEntitiesText(string)));
    };

    var transformSizeChartContent = function(tabContent) {
        tabContent.find('#pdpSizingChart_Header').addClass('u-text-weight-bold');

        tabContent.find('span span').addClass('u-text-weight-bold');
    };

    var getDescriptions = function() {
        var productJSON = init();
        var bellowItems = [];
        var rootItem;

        if (dataMappingType === 'productDetail' || dataMappingType === 'configuratorDetail') {
            rootItem = productJSON.pageProduct;
        } else if (dataMappingType === 'bundleDetail') {
            rootItem = productJSON.bundle[0].pageProduct;
        }

        bellowItems.push({
            sectionTitle: 'Details',
            content: decodeHtmlEntities(rootItem.longDesc)
        });

        // Only add tab content that has a tab title
        $.each(rootItem.productAdditionalInfoTabs, function(_, item) {
            if (item.tabName) {
                var tabIndex = item.tabIdentifier.match(/\d+/)[0];
                var tabContent;
                $.each(rootItem.productAdditionalInfoTabs, function(_, content) {
                    if (!content.tabName) {
                        var contentTabIndex = content.tabIdentifier.match(/\d+/)[0];
                        if (tabIndex === contentTabIndex) {
                            tabContent = decodeHtmlEntities(content.tabHtmlValue);
                        }
                    }
                });

                if (/size chart/i.test(item.tabName)) {
                    // CF-568: Match desktop behaviour for the size charts tab
                    // If there's a link, hide the image and open it in a pinny
                    var $sizeChartImage = tabContent.find('img');
                    $sizeChartImage.wrap($('<div class="c-size-chart-image js-size-chart-img">'));

                    transformSizeChartContent(tabContent);

                    if (tabContent.find('a').length) {
                        var $sizeChartLink = tabContent.find('a').first().addClass('js-sizing-chart-link');
                        $sizeChartImage.parent().addClass('js-size-chart-hidden-content');
                        tabContent.wrapInner('<div class="js-size-chart-link-container">');
                    }
                }

                bellowItems.push({
                    sectionTitle: item.tabName,
                    content: tabContent
                });
            }
        });

        return bellowItems;
    };



    var getSizeChart = function(bundleItemIndex) {
        // CF-568: Items in the bundle may have different size charts
        // So we'll use the product data to find the correct size chart for each
        var $sizeChartContent;
        var productJSON = init();
        var tabs = productJSON.bundle[bundleItemIndex].pageProduct.productAdditionalInfoTabs;

        // Find the size chart tab
        $.each(tabs, function(_, item) {
            if (/size chart/i.test(item.tabName)) {
                var tabIndex = item.tabIdentifier.match(/\d+/)[0];

                // Find the content for the size chart tab
                $.each(tabs, function(_, content) {
                    if (!content.tabName) {
                        var contentTabIndex = content.tabIdentifier.match(/\d+/)[0];
                        if (tabIndex === contentTabIndex) {
                            $sizeChartContent = $(decodeHtmlEntities(content.tabHtmlValue));

                            transformSizeChartContent($sizeChartContent);

                            var $sizeChartLink = $sizeChartContent.find('a[href="#img1"]');
                            var $sizeChartImage = $sizeChartContent.find('img');

                            if ($sizeChartLink.length) {
                                // If there's a link, replace the link text with the image
                                $sizeChartImage.wrap($('<div class="c-size-chart-image js-size-chart-img">'));
                                $sizeChartContent.html($sizeChartImage.parent());
                            }
                        }
                    }
                });
            }
        });

        return $sizeChartContent;
    };

    var getAvailableOptions = function() {

        var productJSON = init();
        var entitledItems;

        switch (dataMappingType) {
            case 'productDetail':
            case 'configuratorDetail':
                entitledItems = productJSON.pageProduct.entitledItems;
                break;
            case 'bundleDetail':
                entitledItems = productJSON.bundle[0].pageProduct.entitledItems;
                break;
        }

        if (entitledItems.length !== 1 && entitledItems[0].thumbNail) {
            var items = [];
            $.each(entitledItems, function(_, item) {
                var src = Utils.getImageUrl(false, getPartNumber() + '_' + item.thumbNail);
                var title = item.definingAttributes[0].displayName;

                items.push({
                    swatchImage: $('<img>').attr('src', src).attr('alt', title),
                    swatchTitle: title,
                    swatchClass: 'c--large'
                });
            });
            return items;
        }
        return null;
    };

    // "You may also like..."
    var getRecommendedProducts = function() {
        var productJSON = init();
        var recommendations = productJSON.pageProduct
            ? productJSON.pageProduct.crossSells
            : productJSON.crossSells;

        return $.map(recommendations, function(recommendation) {
            // scene7 image suffix
            var imgSuffix = '_main?wid=300';
            var imgPrefix = '//chasingfireflies.scene7.com/is/image/ChasingFireflies/';
            var imgSrc = imgPrefix + recommendation.mfPartNumber + imgSuffix;
            var href = recommendation.productDetailTargetURL + '?isCrossSell=true';

            return {
                tileClasses: 'c--already-visible',
                tileImage: $('<img src="' + imgSrc + '">'),
                tileTitle: $('<a class="u-text-black-link" href="' + href + '">' + decodeHtmlEntities(recommendation.prodName).text() + '</a>'),
                tileHref: href
            };
        });
    };

    var getTooltips = function() {
        var productJSON = init();

        if (dataMappingType === 'configuratorDetail') {
            var categories = productJSON.pageProduct.options;
            var tooltips = [];

            $.each(categories, function(idx, category) {
                tooltips.push({
                    tooltipIndex: (parseInt(category.optionSequence) - 1) + '',
                    tooltip: category.optionAttributes[1].optionAttrStrValue,
                });
            });
            return tooltips;
        }
    };

    var getRenderImageSlugs = function() {
        var productJSON = init();

        if (dataMappingType === 'configuratorDetail') {
            var categories = sortByAscending(productJSON.pageProduct.options, 'optionSequence');
            var optionsData = [];
            var mainSlug = 'chasingfirefliesrender/' + productJSON.pageProduct.mfPartNumber + '_VNT';

            $.each(categories, function(idx, category) {
                var swatchData = {};
                var imgSlug = '';
                var useMainSlug = false;

                // build render part
                $.each(category.optionAttributes, function(idx, attribute) {
                    if (attribute.optionAttrName === 'S7_IMAGE_LAYER') {
                        imgSlug += 'obj=' + attribute.optionAttrStrValue;
                    } else if (attribute.optionAttrName === 'S7_USE_VNT_PREFIX' && attribute.optionAttrStrValue === 'true') {
                        imgSlug += '&res=50&src=' + mainSlug;
                        useMainSlug = true;
                    }
                });

                $.each(category.optionValues, function(idx, swatch) {
                    var swatchIds = swatch.optionValueName.split(' ');
                    var key = swatchIds[1];
                    swatchData[key] = imgSlug + '/' + key + '&show';
                });
                optionsData.push(swatchData);
            });

            return {
                mainSlug: mainSlug,
                renderOptionsData: optionsData
            };
        }
    };

    var getShortDescription = function() {
        var productJSON = init();

        if (productJSON.pageProduct && productJSON.pageProduct.shortDesc) {
            return decodeHtmlEntities(productJSON.pageProduct.shortDesc).text();
        } else {
            return null;
        }
    };

    return {
        init: init,
        getDataMappingType: getDataMappingType,
        getTitle: getTitle,
        getShortDescription: getShortDescription,
        getPartNumber: getPartNumber,
        getPartId: getPartId,
        getMainImage: getMainImage,
        // formatImageUrls: formatImageUrls,
        getPrices: getPrices,
        getDescriptions: getDescriptions,
        getAvailableOptions: getAvailableOptions,
        getSizeChart: getSizeChart,
        getRecommendedProducts: getRecommendedProducts,
        getRenderImageSlugs: getRenderImageSlugs,
        getTooltips: getTooltips
    };
});
