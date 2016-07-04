define([
    'lib/viewMocker',
    'pages/customer-service-gift-certificate/customer-service-gift-certificate-view',
    'text!fixtures/customer-service-gift-certificate.html',
    'chai'
],
function(test, view, fixture, chai) {
    var expect = chai.expect;

    test('customer-service-gift-certificate view context', view, fixture, {
        'context contains the correct template name': function($, context) {
            var templateName = context.templateName;
            expect(templateName).to.equal('customer-service-gift-certificate', 'customer-service-gift-certificate context has correct template name');
        }
    });

    test('customer-service-gift-certificate view DOM', view, fixture, {
        'adaptation adds the correct template class': function($) {
            var $body = $('body').last();

            expect($body.hasClass('t-customer-service-gift-certificate')).to.be.true;
        }
    });
});
