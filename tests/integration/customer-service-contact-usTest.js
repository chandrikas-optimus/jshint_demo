define([
    'lib/viewMocker',
    'pages/customer-service-contact-us/customer-service-contact-us-view',
    'text!fixtures/customer-service-contact-us.html',
    'chai'
],
function(test, view, fixture, chai) {
    var expect = chai.expect;

    test('customer-service-contact-us view context', view, fixture, {
        'context contains the correct template name': function($, context) {
            var templateName = context.templateName;
            expect(templateName).to.equal('customer-service-contact-us', 'customer-service-contact-us context has correct template name');
        }
    });

    test('customer-service-contact-us view DOM', view, fixture, {
        'adaptation adds the correct template class': function($) {
            var $body = $('body').last();

            expect($body.hasClass('t-customer-service-contact-us')).to.be.true;
        }
    });
});
