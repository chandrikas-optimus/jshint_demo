define([
    'lib/viewMocker',
    'pages/checkout-confirmation-details/view',
    'text!fixtures/checkout-confirmation-details.html',
    'chai'
],
function(test, view, fixture, chai) {
    var expect = chai.expect;

    test('checkout-confirmation-details view context', view, fixture, {
        'context contains the correct template name': function($, context) {
            var templateName = context.templateName;
            expect(templateName).to.equal('checkout-confirmation-details', 'checkout-confirmation-details context has correct template name');
        }
    });

    test('checkout-confirmation-details view DOM', view, fixture, {
        'adaptation adds the correct template class': function($) {
            var $body = $('body').last();

            expect($body.hasClass('t-checkout-confirmation-details')).to.be.true;
        }
    });
});
