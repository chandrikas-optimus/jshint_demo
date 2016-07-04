define([
    'lib/viewMocker',
    'pages/customer-service-order-status/customer-service-order-status-view',
    'text!fixtures/customer-service-order-status.html',
    'chai'
],
function(test, view, fixture, chai) {
    var expect = chai.expect;

    test('customer-service-order-status view context', view, fixture, {
        'context contains the correct template name': function($, context) {
            var templateName = context.templateName;
            expect(templateName).to.equal('customer-service-order-status', 'customer-service-order-status context has correct template name');
        }
    });

    test('customer-service-order-status view DOM', view, fixture, {
        'adaptation adds the correct template class': function($) {
            var $body = $('body').last();

            expect($body.hasClass('t-customer-service-order-status')).to.be.true;
        }
    });
});
