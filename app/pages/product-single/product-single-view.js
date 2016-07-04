define([
    '$',
    'pages/product/product-view',
    'dust!pages/product-single/product-single'
],
function($, ProductView, template) {
    return {
        template: template,
        // NOTE: inheriting from the base Product
        extend: ProductView,

        context: {
            templateName: 'product-single',
        }

        /**
         * If you wish to override preProcess/postProcess in this view, have a look at the documentation:
         * http://adaptivejs.mobify.com/v1.0/docs/views
         */
    };
});
