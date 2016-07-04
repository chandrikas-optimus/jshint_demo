define([
    'lib/viewMocker',
    'pages/customer-service-return-exchange/customer-service-return-exchange-view',
    'text!fixtures/customer-service-return-exchange.html',
    'chai'
],
function(test, view, fixture, chai) {
    var expect = chai.expect;

    test('customer-service-return-exchange view context', view, fixture, {
        'context contains the correct template name': function($, context) {
            var templateName = context.templateName;
            expect(templateName).to.equal('customer-service-return-exchange', 'customer-service-return-exchange context has correct template name');
        }
    });

    test('customer-service-return-exchange view DOM', view, fixture, {
        'adaptation adds the correct template class': function($) {
            var $body = $('body').last();

            expect($body.hasClass('t-customer-service-return-exchange')).to.be.true;
        }
    });
});
