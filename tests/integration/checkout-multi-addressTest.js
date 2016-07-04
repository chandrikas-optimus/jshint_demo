define([
    'lib/viewMocker',
    'pages/checkout-multi-address/view',
    'text!fixtures/checkout-multi-address.html',
    'chai'
],
function(test, view, fixture, chai) {
    var expect = chai.expect;

    test('checkout-multi-address view context', view, fixture, {
        'context contains the correct template name': function($, context) {
            var templateName = context.templateName;
            expect(templateName).to.equal('checkout-multi-address', 'checkout-multi-address context has correct template name');
        }
    });

    test('checkout-multi-address view DOM', view, fixture, {
        'adaptation adds the correct template class': function($) {
            var $body = $('body').last();

            expect($body.hasClass('t-checkout-multi-address')).to.be.true;
        }
    });
});
