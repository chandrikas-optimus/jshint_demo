define([
    'lib/viewMocker',
    'pages/view-wishlist/view',
    'text!fixtures/view-wishlist.html',
    'chai'
],
function(test, view, fixture, chai) {
    var expect = chai.expect;

    test('view-wishlist view context', view, fixture, {
        'context contains the correct template name': function($, context) {
            var templateName = context.templateName;
            expect(templateName).to.equal('view-wishlist', 'view-wishlist context has correct template name');
        }
    });

    test('view-wishlist view DOM', view, fixture, {
        'adaptation adds the correct template class': function($) {
            var $body = $('body').last();

            expect($body.hasClass('t-view-wishlist')).to.be.true;
        }
    });
});
