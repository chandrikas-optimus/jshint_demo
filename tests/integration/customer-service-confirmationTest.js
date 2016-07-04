define([
    'lib/viewMocker',
    'pages/customer-service-confirmation/customer-service-confirmation-view',
    'text!fixtures/customer-service-confirmation.html',
    'chai'
],
function(test, view, fixture, chai) {
    var expect = chai.expect;

    test('customer-service-confirmation view context', view, fixture, {
        'context contains the correct template name': function($, context) {
            var templateName = context.templateName;
            expect(templateName).to.equal('customer-service-confirmation', 'customer-service-confirmation context has correct template name');
        }
    });

    test('customer-service-confirmation view DOM', view, fixture, {
        'adaptation adds the correct template class': function($) {
            var $body = $('body').last();

            expect($body.hasClass('t-customer-service-confirmation')).to.be.true;
        }
    });
});
