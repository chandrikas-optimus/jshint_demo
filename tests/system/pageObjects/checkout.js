var testData = require('./testData.js');

var selectors = {
    checkoutBody: '.t-checkout-sign-in',
    checkoutAccount: '#userLogonForm',
    continueAsGuest: '.c--outline',

    shippingInfo: '.js-billing-shipping-bellows',
    continueToCheckout: '#gwt_billshipaddr_btn button',

    //registered checkout
    signInEmail: '#logonId',
    signInPassword: '#logonPassword',
    signIn: '#logonButton',

    reviewAndPayment: '.t-checkout-review-and-payment__order-items',
    paymentBlock: '.js-payment-block',
    completeOrder: '.js-place-order #processBottom',

    firstName: '#bill_fnbox',
    lastName: '#bill_lnbox',
    address: '#bill_sa1box',
    city: '#bill_citybox',
    state: '#bill_region',
    zipCode: '#bill_zipbox',
    daytimePhone: '#bill_phone1box',
    email: '#emailbox',
    confirmEmail: '#confirmEmailBox',

    creditCardNumber: '#accountcc',
    cardIDNum: '#card_id_number',
    cvv: '#cvv',
    cardType: '#payMethodCCID',
    cardTypeOption: '#payMethodCCID option:nth-child(2)',
    expireMonth: '#expire_month',
    expireYear: '#expire_year',

    paymentInfo: '.t-payment-and-review__order-items',
    confirmMessageStage: '.u-margin-bottom-xlg p:nth-child(2)',
    confirmationError: '.c-alert__list-item'
};

var Checkout = function(browser) {
    this.browser = browser;
    this.selectors = selectors;
};

Checkout.prototype.continueAsGuest = function(browser) {
    this.browser
        .log('Navigating to Guest Checkout')
        .waitForElementVisible(selectors.continueAsGuest)
        .click(selectors.continueAsGuest)
        .waitUntilMobified()
        .waitForAjaxCompleted()
        .waitForAnimation();
    return this;
};

Checkout.prototype.signIn = function(browser) {
    this.browser
        .log('Navigating to Registered Checkout')
        .waitForElementVisible(selectors.signInEmail)
        .setValue(selectors.signInEmail, testData.signInEmail)
        .setValue(selectors.signInPassword, testData.signInPassword)
        .triggerTouch(selectors.signIn)
        .waitUntilMobified()
        .waitForAjaxCompleted()
        .waitForAnimation();
    return this;
};

Checkout.prototype.fillShippingInfo = function(browser) {
    this.browser
        .log('Fill out Shipping Info form fields')
        .waitForElementVisible(selectors.firstName)
        .setValue(selectors.firstName, testData.firstName)
        .setValue(selectors.lastName, testData.lastName)
        .setValue(selectors.address, testData.address1)
        .setValue(selectors.city, testData.city)
        .setValue(selectors.state, testData.state)
        .setValue(selectors.zipCode, testData.zip)
        .setValue(selectors.daytimePhone, testData.telNumber)
        .setValue(selectors.email, testData.email)
        .setValue(selectors.confirmEmail, testData.email)
        .click(selectors.continueToCheckout)
        .waitUntilMobified()
        .waitForAjaxCompleted()
        .waitForAnimation();
    return this;
};

Checkout.prototype.fillPaymentDetails = function(browser) {
    this.browser
        .log('Fill out Payment Details form fields')
        .setValue(selectors.creditCardNumber, testData.creditCardNumber)
        .setValue(selectors.expireMonth, testData.creditCardExpiryMonth)
        .setValue(selectors.expireYear, testData.creditCardExpiryYear);
    return this;
};

//For Dev env - cvv is iframe
Checkout.prototype.fillCVVNum = function(browser) {
    this.browser
        .log('Fill out CVV# on Prod')
        .waitForElementVisible('#cvv_Tokenizer')
        .waitForAjaxCompleted(5000)
        .frame(0)
        .waitForElementPresent(selectors.cvv)
        .setValue(selectors.cvv, testData.creditCardCcv)
        .frame(null);
    return this;
};

//For stage -  cvv is not iframe
Checkout.prototype.fillPCardIDNum = function(browser) {
    this.browser
        .log('Fill out CardID# on Stage')
        .waitForElementVisible(selectors.cardIDNum)
        .setValue(selectors.cardIDNum, testData.creditCardCcv);
    return this;
};

Checkout.prototype.selectCardType = function(browser) {
    this.browser
        .waitForElementVisible(selectors.cardType)
        .click(selectors.cardType)
        .waitForAnimation()
        .click(selectors.cardTypeOption)
        .waitForAjaxCompleted();
    return this;
};

Checkout.prototype.completeOrder = function(browser) {
    this.browser
        .log('Complete order')
        .waitForElementVisible(selectors.completeOrder)
        .triggerTouch(selectors.completeOrder)
        .waitUntilMobified()
        .waitForAjaxCompleted()
        .waitForAnimation();
    return this;
};

module.exports = Checkout;
