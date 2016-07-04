define([
    'lib/viewMocker',
    'pages/checkout-sign-in/view',
    'text!fixtures/checkout-sign-in.html',
    'chai'
],
function(test, view, fixture, chai) {
    var expect = chai.expect;

    test('checkout-sign-in view context', view, fixture, {
        'context contains the correct template name': function($, context) {
            var templateName = context.templateName;
            expect(templateName).to.equal('checkout-sign-in', 'checkout-sign-in context has correct template name');
        }
    });

    test('checkout-sign-in view DOM', view, fixture, {
        'adaptation adds the correct template class': function($) {
            var $body = $('body').last();

            expect($body.hasClass('t-checkout-sign-in')).to.be.true;
        }
    });
});
