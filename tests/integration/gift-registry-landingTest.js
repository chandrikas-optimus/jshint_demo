define([
    'lib/viewMocker',
    'pages/gift-registry-landing/gift-registry-landing-view',
    'text!fixtures/gift-registry-landing.html',
    'chai'
],
function(test, view, fixture, chai) {
    var expect = chai.expect;

    test('gift-registry-landing view context', view, fixture, {
        'context contains the correct template name': function($, context) {
            var templateName = context.templateName;
            expect(templateName).to.equal('gift-registry-landing', 'gift-registry-landing context has correct template name');
        }
    });

    test('gift-registry-landing view DOM', view, fixture, {
        'adaptation adds the correct template class': function($) {
            var $body = $('body').last();

            expect($body.hasClass('t-gift-registry-landing')).to.be.true;
        }
    });
});
