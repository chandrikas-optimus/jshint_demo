define([
    'lib/viewMocker',
    'pages/customer-service-size-chart/customer-service-size-chart-view',
    'text!fixtures/customer-service-size-chart.html',
    'chai'
],
function(test, view, fixture, chai) {
    var expect = chai.expect;

    test('customer-service-size-chart view context', view, fixture, {
        'context contains the correct template name': function($, context) {
            var templateName = context.templateName;
            expect(templateName).to.equal('customer-service-size-chart', 'customer-service-size-chart context has correct template name');
        }
    });

    test('customer-service-size-chart view DOM', view, fixture, {
        'adaptation adds the correct template class': function($) {
            var $body = $('body').last();

            expect($body.hasClass('t-customer-service-size-chart')).to.be.true;
        }
    });
});
