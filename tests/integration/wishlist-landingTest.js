define([
    'lib/viewMocker',
    'pages/wishlist-landing/wishlist-landing-view',
    'text!fixtures/wishlist-landing.html',
    'chai'
],
function(test, view, fixture, chai) {
    var expect = chai.expect;

    test('wishlist-landing view context', view, fixture, {
        'context contains the correct template name': function($, context) {
            var templateName = context.templateName;
            expect(templateName).to.equal('wishlist-landing', 'wishlist-landing context has correct template name');
        }
    });

    test('wishlist-landing view DOM', view, fixture, {
        'adaptation adds the correct template class': function($) {
            var $body = $('body').last();

            expect($body.hasClass('t-wishlist-landing')).to.be.true;
        }
    });
});
