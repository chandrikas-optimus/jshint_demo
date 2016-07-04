define([
    'lib/viewMocker',
    'pages/checkout-gift-options/view',
    'text!fixtures/checkout-gift-options.html',
    'chai'
],
function(test, view, fixture, chai) {
    var expect = chai.expect;

    test('checkout-gift-options view context', view, fixture, {
        'context contains the correct template name': function($, context) {
            var templateName = context.templateName;
            expect(templateName).to.equal('checkout-gift-options', 'checkout-gift-options context has correct template name');
        }
    });

    test('checkout-gift-options view DOM', view, fixture, {
        'adaptation adds the correct template class': function($) {
            var $body = $('body').last();

            expect($body.hasClass('t-checkout-gift-options')).to.be.true;
        }
    });
});
