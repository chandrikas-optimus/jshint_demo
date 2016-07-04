define([
    'lib/viewMocker',
    'pages/customer-service-size-chart-iframe/customer-service-size-chart-iframe-view',
    'text!fixtures/customer-service-size-chart-iframe.html',
    'chai'
],
function(test, view, fixture, chai) {
    var expect = chai.expect;

    test('customer-service-size-chart-iframe view context', view, fixture, {
        'context contains the correct template name': function($, context) {
            var templateName = context.templateName;
            expect(templateName).to.equal('customer-service-size-chart-iframe', 'customer-service-size-chart-iframe context has correct template name');
        }
    });

    test('customer-service-size-chart-iframe view DOM', view, fixture, {
        'adaptation adds the correct template class': function($) {
            var $body = $('body').last();

            expect($body.hasClass('t-customer-service-size-chart-iframe')).to.be.true;
        }
    });
});
