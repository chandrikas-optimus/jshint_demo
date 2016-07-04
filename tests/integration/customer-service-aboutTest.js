define([
    'lib/viewMocker',
    'pages/customer-service-about/customer-service-about-view',
    'text!fixtures/customer-service-about.html',
    'chai'
],
function(test, view, fixture, chai) {
    var expect = chai.expect;

    test('customer-service-about view context', view, fixture, {
        'context contains the correct template name': function($, context) {
            var templateName = context.templateName;
            expect(templateName).to.equal('customer-service-about', 'customer-service-about context has correct template name');
        }
    });

    test('customer-service-about view DOM', view, fixture, {
        'adaptation adds the correct template class': function($) {
            var $body = $('body').last();

            expect($body.hasClass('t-customer-service-about')).to.be.true;
        }
    });
});
