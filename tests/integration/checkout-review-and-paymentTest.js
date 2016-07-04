define([
    'lib/viewMocker',
    'pages/checkout-review-and-payment/view',
    'text!fixtures/checkout-review-and-payment.html',
    'chai'
],
function(test, view, fixture, chai) {
    var expect = chai.expect;

    test('checkout-review-and-payment view context', view, fixture, {
        'context contains the correct template name': function($, context) {
            var templateName = context.templateName;
            expect(templateName).to.equal('checkout-review-and-payment', 'checkout-review-and-payment context has correct template name');
        }
    });

    test('checkout-review-and-payment view DOM', view, fixture, {
        'adaptation adds the correct template class': function($) {
            var $body = $('body').last();

            expect($body.hasClass('t-checkout-review-and-payment')).to.be.true;
        }
    });
});
