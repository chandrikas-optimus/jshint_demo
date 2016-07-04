define([
    'lib/viewMocker',
    'pages/customer-service-balance-inquiry/customer-service-balance-inquiry-view',
    'text!fixtures/customer-service-balance-inquiry.html',
    'chai'
],
function(test, view, fixture, chai) {
    var expect = chai.expect;

    test('customer-service-balance-inquiry view context', view, fixture, {
        'context contains the correct template name': function($, context) {
            var templateName = context.templateName;
            expect(templateName).to.equal('customer-service-balance-inquiry', 'customer-service-balance-inquiry context has correct template name');
        }
    });

    test('customer-service-balance-inquiry view DOM', view, fixture, {
        'adaptation adds the correct template class': function($) {
            var $body = $('body').last();

            expect($body.hasClass('t-customer-service-balance-inquiry')).to.be.true;
        }
    });
});
