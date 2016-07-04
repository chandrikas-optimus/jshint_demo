define(['$', 'pages/product/single-bundle-product-ui'], function($, singleBundleProductUI) {
    var productBundleUI = function() {
        console.log('productBundle UI');
        singleBundleProductUI.init();
    };

    return productBundleUI;
});
