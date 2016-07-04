var selectors = {
    welcome: '#gwt_welcome_window',
    close: '.c-modal__header-close',
    plpBody: '.GUEST',
    plpList: '.js-product-tiles',
    pdpItem: function(index) {
        return '.js-product-tiles .thumbItem:nth-child(' + index + ') a img';
    }
};

var PLP = function(browser) {
    this.browser = browser;
    this.selectors = selectors;
};

PLP.prototype.closeWelcome = function(browser) {
    var self = this;
    this.browser
        .waitUntilMobified()
        .waitForAjaxCompleted()
        .waitForAnimation()
        .element('css selector', selectors.welcome, function(result) {
            if (result.value && result.value.ELEMENT) {
                self.browser
                    .log('Closing welcome window')
                    .waitForElementVisible(selectors.close)
                    .click(selectors.close)
                    .waitUntilMobified()
                    .waitForAnimation();
            }
        });
    return this;
};

PLP.prototype.navigateToPDP = function(productNum) {
    this.browser
        .log('Navigating to PDP')
        .waitForElementVisible(selectors.pdpItem(productNum))
        .triggerTouch(selectors.pdpItem(productNum))
        .waitUntilMobified()
        .waitForAjaxCompleted()
        //waiting for the pdp loading completely
        .waitForAnimation(3000);
    return this;
};

module.exports = PLP;
