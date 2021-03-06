define([
    'lib/viewMocker',
    'pages/gift-registry-find/gift-registry-find-view',
    'text!fixtures/gift-registry-find.html',
    'chai'
],
function(test, view, fixture, chai) {
    var expect = chai.expect;

    test('gift-registry-find view context', view, fixture, {
        'context contains the correct template name': function($, context) {
            var templateName = context.templateName;
            expect(templateName).to.equal('gift-registry-find', 'gift-registry-find context has correct template name');
        }
    });

    test('gift-registry-find view DOM', view, fixture, {
        'adaptation adds the correct template class': function($) {
            var $body = $('body').last();

            expect($body.hasClass('t-gift-registry-find')).to.be.true;
        }
    });
});
