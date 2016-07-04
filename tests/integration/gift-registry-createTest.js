define([
    'lib/viewMocker',
    'pages/gift-registry-create/gift-registry-create-view',
    'text!fixtures/gift-registry-create.html',
    'chai'
],
function(test, view, fixture, chai) {
    var expect = chai.expect;

    test('gift-registry-create view context', view, fixture, {
        'context contains the correct template name': function($, context) {
            var templateName = context.templateName;
            expect(templateName).to.equal('gift-registry-create', 'gift-registry-create context has correct template name');
        }
    });

    test('gift-registry-create view DOM', view, fixture, {
        'adaptation adds the correct template class': function($) {
            var $body = $('body').last();

            expect($body.hasClass('t-gift-registry-create')).to.be.true;
        }
    });
});
