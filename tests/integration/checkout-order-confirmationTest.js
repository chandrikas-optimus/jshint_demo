define([
    'lib/viewMocker',
    'pages/checkout-order-confirmation/view',
    'text!fixtures/checkout-order-confirmation.html',
    'chai'
],
function(test, view, fixture, chai) {
    var expect = chai.expect;

    test('checkout-order-confirmation view context', view, fixture, {
        'context contains the correct template name': function($, context) {
            var templateName = context.templateName;
            expect(templateName).to.equal('checkout-order-confirmation', 'checkout-order-confirmation context has correct template name');
        }
    });

    test('checkout-order-confirmation view DOM', view, fixture, {
        'adaptation adds the correct template class': function($) {
            var $body = $('body').last();

            expect($body.hasClass('t-checkout-order-confirmation')).to.be.true;
        }
    });
});
