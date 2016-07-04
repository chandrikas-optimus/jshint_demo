define([
    'lib/viewMocker',
    'pages/customer-service-privacy-policy/customer-service-privacy-policy-view',
    'text!fixtures/customer-service-privacy-policy.html',
    'chai'
],
function(test, view, fixture, chai) {
    var expect = chai.expect;

    test('customer-service-privacy-policy view context', view, fixture, {
        'context contains the correct template name': function($, context) {
            var templateName = context.templateName;
            expect(templateName).to.equal('customer-service-privacy-policy', 'customer-service-privacy-policy context has correct template name');
        }
    });

    test('customer-service-privacy-policy view DOM', view, fixture, {
        'adaptation adds the correct template class': function($) {
            var $body = $('body').last();

            expect($body.hasClass('t-customer-service-privacy-policy')).to.be.true;
        }
    });
});
