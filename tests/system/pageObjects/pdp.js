var selectors = {
    pdpBody: '#cbiBody',
    productPrice: '.js-pricing',
    productOption: '.js-product-options .c-stack',
    selectOption: function(position) {
        return '.js-product-options .c-stack .c-stack__item:nth-child(' + position + ') .c-check-radio';
    },
    size: 'select[name="size"]',
    sizeOption: function(position) {
        return 'select[name="size"] option:nth-child(' + position + ')';
    },
    color: 'select[name="color"]',
    colorOption: function(position) {
        return 'select[name="color"] option:nth-child(' + position + ')';
    },

    addItem: '.js-add-to-cart',
    cartAlert: '.js-cart-alert .c-alert',
    checkout: '.c-alert .u-margin-bottom-sm .c-arrange__item:nth-child(2)'
};

var PDP = function(browser) {
    this.browser = browser;
    this.selectors = selectors;
};

PDP.prototype.selectOption = function(optionPosition) {
    var self = this;
    this.browser
        .waitUntilMobified()
        .waitForAjaxCompleted()
        .waitForAnimation()
        .element('css selector', selectors.productOption, function(result) {
            if (result.value && result.value.ELEMENT) {
                self.browser
                    .log('Selecting the option')
                    .waitForAjaxCompleted()
                    .waitForAnimation()
                    .waitForElementVisible(selectors.selectOption(optionPosition))
                    .triggerTouch(selectors.selectOption(optionPosition))
                    .waitUntilMobified()
                    .waitForAjaxCompleted();
            }
        });
    return this;
};

PDP.prototype.selectSize = function(sizePosition) {
    var self = this;
    this.browser
        .waitUntilMobified()
        .waitForAjaxCompleted()
        .waitForAnimation()
        .element('css selector', selectors.size, function(result) {
            if (result.value && result.value.ELEMENT) {
                self.browser
                    .log('Selecting one size')
                    .waitForElementVisible(selectors.size)
                    .click(selectors.size)
                    .waitForAnimation()
                    .waitForElementVisible(selectors.sizeOption(sizePosition))
                    .click(selectors.sizeOption(sizePosition))
                    .waitForAnimation()
                    .waitForAjaxCompleted();
            }
        });
    return this;
};

PDP.prototype.selectColor = function(colorPosition) {
    var self = this;
    this.browser
        .waitUntilMobified()
        .waitForAjaxCompleted()
        .waitForAnimation()
        .element('css selector', selectors.color, function(result) {
            if (result.value && result.value.ELEMENT) {
                self.browser
                    .log('Selecting one color')
                    .waitForElementVisible(selectors.color)
                    .click(selectors.color)
                    .waitForAnimation()
                    .waitForElementVisible(selectors.colorOption(colorPosition))
                    .click(selectors.colorOption(colorPosition))
                    .waitForAnimation()
                    .waitForAjaxCompleted();
            }
        });
    return this;
};

PDP.prototype.addItemToCart = function(browser) {
    this.browser
        .log('Adding item to cart')
        .waitForElementVisible(selectors.addItem)
        .triggerTouch(selectors.addItem)
        .waitUntilMobified()
        .waitForAjaxCompleted()
        .waitForAnimation();
    return this;
};

PDP.prototype.navigateToCart = function(browser) {
    this.browser
        .log('Navigating to cart')
        .waitForElementVisible(selectors.checkout)
        .click(selectors.checkout)
        .waitUntilMobified()
        .waitForAjaxCompleted()
        .waitForAnimation();
    return this;
};

module.exports = PDP;
