define(['$', 'pages/product/single-bundle-product-ui'], function($, singleBundleProductUI) {
    var productSingleUI = function() {
        console.log('productSingle UI');
        singleBundleProductUI.init();
    };

    return productSingleUI;
});
