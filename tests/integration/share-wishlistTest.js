define([
    'lib/viewMocker',
    'pages/share-wishlist/view',
    'text!fixtures/share-wishlist.html',
    'chai'
],
function(test, view, fixture, chai) {
    var expect = chai.expect;

    test('share-wishlist view context', view, fixture, {
        'context contains the correct template name': function($, context) {
            var templateName = context.templateName;
            expect(templateName).to.equal('share-wishlist', 'share-wishlist context has correct template name');
        }
    });

    test('share-wishlist view DOM', view, fixture, {
        'adaptation adds the correct template class': function($) {
            var $body = $('body').last();

            expect($body.hasClass('t-share-wishlist')).to.be.true;
        }
    });
});
