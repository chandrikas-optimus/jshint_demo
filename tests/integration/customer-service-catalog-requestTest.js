define([
    'lib/viewMocker',
    'pages/customer-service-catalog-request/customer-service-catalog-request-view',
    'text!fixtures/customer-service-catalog-request.html',
    'chai'
],
function(test, view, fixture, chai) {
    var expect = chai.expect;

    test('customer-service-catalog-request view context', view, fixture, {
        'context contains the correct template name': function($, context) {
            var templateName = context.templateName;
            expect(templateName).to.equal('customer-service-catalog-request', 'customer-service-catalog-request context has correct template name');
        }
    });

    test('customer-service-catalog-request view DOM', view, fixture, {
        'adaptation adds the correct template class': function($) {
            var $body = $('body').last();

            expect($body.hasClass('t-customer-service-catalog-request')).to.be.true;
        }
    });
});
