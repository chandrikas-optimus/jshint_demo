var selectors = {
    cartBody: '.t-bag',
    productInfo: '#ShopCartForm',
    cartCheckout: '#ShopCartForm .u-margin-bottom-xlg button:nth-child(1)'
};

var Cart = function(browser) {
    this.browser = browser;
    this.selectors = selectors;
};

Cart.prototype.navigateToCheckout = function(browser) {
    this.browser
        .log('Navigating to Checkout')
        .waitForElementVisible(selectors.cartCheckout)
        .click(selectors.cartCheckout)
        .waitUntilMobified()
        .waitForAjaxCompleted()
        .waitForAnimation();
    return this;
};

module.exports = Cart;
