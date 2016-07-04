define([
    'lib/viewMocker',
    'pages/customer-service-shipping-and-handling/customer-service-shipping-and-handling-view',
    'text!fixtures/customer-service-shipping-and-handling.html',
    'chai'
],
function(test, view, fixture, chai) {
    var expect = chai.expect;

    test('customer-service-shipping-and-handling view context', view, fixture, {
        'context contains the correct template name': function($, context) {
            var templateName = context.templateName;
            expect(templateName).to.equal('customer-service-shipping-and-handling', 'customer-service-shipping-and-handling context has correct template name');
        }
    });

    test('customer-service-shipping-and-handling view DOM', view, fixture, {
        'adaptation adds the correct template class': function($) {
            var $body = $('body').last();

            expect($body.hasClass('t-customer-service-shipping-and-handling')).to.be.true;
        }
    });
});
