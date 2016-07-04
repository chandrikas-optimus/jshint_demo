var selectors = {
    home: '.t-home',
    pikabu: '.pikabu__container',
    plpItem: '.t-home__promos .c-tile a img'
};

var Home = function(browser) {
    this.browser = browser;
    this.selectors = selectors;
};

Home.prototype.navigateToPLP = function(browser) {
    this.browser
        .log('Navigating to PLP')
        .waitForElementVisible(selectors.plpItem)
        .click(selectors.plpItem)
        .waitUntilMobified()
        .waitForAjaxCompleted()
        //waiting for the popup window loading completely
        .waitForAnimation(5000);
    return this;
};

module.exports = Home;
