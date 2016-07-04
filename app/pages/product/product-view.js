define([
    '$',
    'global/baseView',
    'dust!pages/product/product',
    'global/utils',
    'pages/product/parsers/product-data-parser',
    'components/breadcrumbs/parsers/breadcrumbs-parser'
],
function(
    $,
    BaseView,
    template,
    Utils,
    productDataParser,
    breadcrumbsParser
) {

    return {
        template: template,
        extend: BaseView,

        preProcess: function(context) {
            var beforeBasePreProcess = function() {
                // Doing it here before the inner script gets removed by Descript
                Utils.preserveInlineScripts($('[id^="gwt_"] .JSON script'));
            };

            var afterBasePreProcess = function() {
            };

            if (BaseView.preProcess) {
                beforeBasePreProcess();
                context = BaseView.preProcess(context);
                afterBasePreProcess();
            }

            return context;
        },

        postProcess: function(context) {
            if (BaseView.postProcess) {
                context = BaseView.postProcess(context);

                // Make sure that any template inheriting this base PDP gets .t-product
                var $body = $('body');
                $body.last().addClass('t-product');
            }

            return context;
        },

        context: {
            templateName: 'product',
            breadcrumbs: function() {
                var $crumbs = $('#breadcrumbs_ul li');

                // Manually inject breadcrumb into crumbs
                var wishCertificateRegex = /(wish certificate) \$\d+/g;
                var title = productDataParser.getTitle();
                if (wishCertificateRegex.test(title)) {
                    var $wishCertificateCLP = $('<li><a href="/wish-certificates">Wish Certificates</a></li>');
                    $wishCertificateCLP.insertAfter($crumbs.first());
                    return breadcrumbsParser.parse($('#breadcrumbs_ul li'));
                }
                return breadcrumbsParser.parse($crumbs);
            },
            productInfo: function() {
                return {
                    title: productDataParser.getTitle(),
                    description: productDataParser.getShortDescription(),
                    partNumber: productDataParser.getPartNumber()
                };
            },
            mainImage: function() {
                return productDataParser.getMainImage();
            },
            productDescriptions: function() {
                var bellowItems = productDataParser.getDescriptions();

                // bellowItems.push({
                //     bellowsItemClass: 'js-reviews-bellow',
                //     bellowsTitle: $('<div>').append('Product Reviews (<span class="js-reviews-count">0</span>)').contents(),
                //     bellowsContent: ' ',
                //     bellowsContentClass: 'c--alt',
                //     loading: true
                // });

                return {
                    items: bellowItems
                };
            },
            // TODO: do these exist for CF?
            availableOptions: function() {
                return {
                    options: productDataParser.getAvailableOptions()
                };
            },
            tellAFriendContainer: function() {
                return {
                    data: $('<div class="js-taf-content">')
                };
            },
            personalizationContainer: function() {
                return  {
                    data: $('<div class="js-personalization-content">')
                };
            },
            youMayAlsoLike: function() {
                return {
                    slider: {
                        productTiles: productDataParser.getRecommendedProducts(),
                        headingClasses: 'c--product u-text-align-center',
                        tileImageClasses: 'c-featured-image c--remove-top'
                    }
                };
            },
            hasRecommendation: function() {
                return (productDataParser.getRecommendedProducts().length > 0);
            },
            hiddenDesktopElements: function() {
                // CF-463: Certain personalization elements need data coming from
                // hidden desktop elements. Bring these along into mobile DOM.
                return $('#gwt-personalization-instruction-wwcm');
            }

            // TODO: use Ballard's product parser to show the images right away
            // TODO: mimic Ballard's base PDP and its single/bundle directories
        }

        /**
         * If you wish to override preProcess/postProcess in this view, have a look at the documentation:
         * http://adaptivejs.mobify.com/v1.0/docs/views
         */
    };
});
