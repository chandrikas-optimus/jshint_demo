var Home = require('../pageObjects/home');
var PLP = require('../pageObjects/plp');
var PDP = require('../pageObjects/pdp');
var Cart = require('../pageObjects/cart');
var Checkout = require('../pageObjects/checkout');
var Site = require('../site.js');

var home;
var plp;
var pdp;
var cart;
var checkout;

var PDP_POSITION = process.env.PDP_POSITION || 3;
var PRODUCT_COLOR = process.env.PRODUCT_COLOR || 2;
var PRODUCT_SIZE = process.env.PRODUCT_SIZE || 3;
var PRODUCT_OPTION = process.env.PRODUCT_OPTION || 1;

module.exports = {
    '@tags': ['checkout'],

    before: function(browser) {
        home = new Home(browser);
        plp = new PLP(browser);
        pdp = new PDP(browser);
        cart = new Cart(browser);
        checkout = new Checkout(browser);
    },

    after: function(browser) {
        browser.end();
    },

    'Checkout - Guest - Step 1 - Navigate to Home': function(browser) {
        browser.preview();
        browser
            .waitForElementVisible(home.selectors.home)
            .assert.visible(home.selectors.pikabu);
    },

    'Checkout - Guest - Step 2 - Navigate from Home to PLP': function(browser) {
        home.navigateToPLP();
        plp.closeWelcome();
        browser
            .waitForElementVisible(plp.selectors.plpBody)
            .assert.visible(plp.selectors.plpList);
    },

    'Checkout - Guest - Step 3 - Navigate from PLP to PDP': function(browser) {
        plp.navigateToPDP(PDP_POSITION);
        browser
            .waitForElementVisible(pdp.selectors.pdpBody)
            .assert.visible(pdp.selectors.productPrice);
    },

    'Checkout - Guest - Step 4 - Select size and color': function(browser) {
        pdp.selectOption(PRODUCT_OPTION);
        pdp.selectSize(PRODUCT_SIZE);
        pdp.selectColor(PRODUCT_COLOR);
    },

    'Checkout - Guest - Step 5 - Add item to Shopping Cart': function(browser) {
        pdp.addItemToCart();
        browser
            .waitForElementVisible(pdp.selectors.cartAlert)
            .assert.visible(pdp.selectors.checkout);
    },

    'Checkout - Guest - Step 6 - Navigate from PDP to Shopping Cart': function(browser) {
        pdp.navigateToCart();
        browser
            .waitForElementVisible(cart.selectors.cartBody)
            .assert.visible(cart.selectors.productInfo);
    },

    'Checkout - Guest - Step 7 - Navigate from Shopping Cart to Checkout Sign In or Continue as Guest page': function(browser) {
        cart.navigateToCheckout();
        browser
            .waitForElementVisible(checkout.selectors.checkoutBody)
            .assert.visible(checkout.selectors.continueAsGuest);
    },

    'Checkout - Guest - Step 8 - Continue to Guest Checkout': function(browser) {
        checkout.continueAsGuest();
        browser
            .waitForElementVisible(checkout.selectors.shippingInfo)
            .assert.visible(checkout.selectors.continueToCheckout);
    },

    'Checkout - Guest - Step 9 - Fill out Guest Checkout Shipping Info form': function(browser) {
        checkout.fillShippingInfo();
        browser
            .waitForElementVisible(checkout.selectors.reviewAndPayment)
            .assert.visible(checkout.selectors.paymentBlock);
    },

    'Checkout - Guest - Step 10 - Fill out Guest Checkout Payment Details form': function(browser) {
        checkout.fillPaymentDetails();
        if (Site.activeProfile === 'local') {
            checkout.fillPCardIDNum();
        } else {
            checkout.fillCVVNum();
        }
    },

    'Checkout - Guest - Step 11 - Complete Purchase to Navigate to Confirmation page': function(browser) {
        checkout.completeOrder();
        if (Site.activeProfile === 'local') {
            browser
                .waitForElementVisible(checkout.selectors.confirmMessageStage)
                .assert.containsText(checkout.selectors.confirmMessageStage, 'Your order has been placed.');
        } else {
            browser
                .waitForElementVisible(checkout.selectors.confirmationError)
                .assert.visible(checkout.selectors.confirmationError);
        }
    }
};
