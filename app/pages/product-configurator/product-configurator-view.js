define([
    '$',
    'pages/product/product-view',
    'dust!pages/product-configurator/product-configurator',
    'pages/product/parsers/product-data-parser'
],
function($, ProductView, template, productDataParser) {
    return {
        template: template,
        // NOTE: inheriting from the base Product
        extend: ProductView,

        context: {
            templateName: 'product-configurator',
            tooltipData: function() {
                return productDataParser.getTooltips();
            },
            // CF-739: This element needs to be included
            // or the choking hazard message won't display
            chokingHazard: function() {
                return $('#choking_hazard_0');
            }
        }
    };
});
