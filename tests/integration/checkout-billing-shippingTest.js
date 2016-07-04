define([
    'lib/viewMocker',
    'pages/checkout-billing-shipping/checkout-billing-shipping-view',
    'text!fixtures/checkout-billing-shipping.html',
    'chai'
],
function(test, view, fixture, chai) {
    var expect = chai.expect;

    test('checkout-billing-shipping view context', view, fixture, {
        'context contains the correct template name': function($, context) {
            var templateName = context.templateName;
            expect(templateName).to.equal('checkout-billing-shipping', 'checkout-billing-shipping context has correct template name');
        }
    });

    test('checkout-billing-shipping view DOM', view, fixture, {
        'adaptation adds the correct template class': function($) {
            var $body = $('body').last();

            expect($body.hasClass('t-checkout-billing-shipping')).to.be.true;
        }
    });
});
