define([
    'lib/viewMocker',
    'pages/gift-registry-view/gift-registry-view-view',
    'text!fixtures/gift-registry-view.html',
    'chai'
],
function(test, view, fixture, chai) {
    var expect = chai.expect;

    test('gift-registry-view view context', view, fixture, {
        'context contains the correct template name': function($, context) {
            var templateName = context.templateName;
            expect(templateName).to.equal('gift-registry-view', 'gift-registry-view context has correct template name');
        }
    });

    test('gift-registry-view view DOM', view, fixture, {
        'adaptation adds the correct template class': function($) {
            var $body = $('body').last();

            expect($body.hasClass('t-gift-registry-view')).to.be.true;
        }
    });
});
