define([
    'lib/viewMocker',
    'pages/gift-registry-manage/view',
    'text!fixtures/gift-registry-manage.html',
    'chai'
],
function(test, view, fixture, chai) {
    var expect = chai.expect;

    test('gift-registry-manage view context', view, fixture, {
        'context contains the correct template name': function($, context) {
            var templateName = context.templateName;
            expect(templateName).to.equal('gift-registry-manage', 'gift-registry-manage context has correct template name');
        }
    });

    test('gift-registry-manage view DOM', view, fixture, {
        'adaptation adds the correct template class': function($) {
            var $body = $('body').last();

            expect($body.hasClass('t-gift-registry-manage')).to.be.true;
        }
    });
});
