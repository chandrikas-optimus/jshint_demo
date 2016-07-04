define([
    'lib/viewMocker',
    'pages/customer-service-faq/customer-service-faq-view',
    'text!fixtures/customer-service-faq.html',
    'chai'
],
function(test, view, fixture, chai) {
    var expect = chai.expect;

    test('customer-service-faq view context', view, fixture, {
        'context contains the correct template name': function($, context) {
            var templateName = context.templateName;
            expect(templateName).to.equal('customer-service-faq', 'customer-service-faq context has correct template name');
        }
    });

    test('customer-service-faq view DOM', view, fixture, {
        'adaptation adds the correct template class': function($) {
            var $body = $('body').last();

            expect($body.hasClass('t-customer-service-faq')).to.be.true;
        }
    });
});
