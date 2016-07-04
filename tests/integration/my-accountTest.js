define([
    'lib/viewMocker',
    'pages/my-account/my-account-view',
    'text!fixtures/my-account.html',
    'chai'
],
function(test, view, fixture, chai) {
    var expect = chai.expect;

    test('my-account view context', view, fixture, {
        'context contains the correct template name': function($, context) {
            var templateName = context.templateName;
            expect(templateName).to.equal('my-account', 'my-account context has correct template name');
        }
    });

    test('my-account view DOM', view, fixture, {
        'adaptation adds the correct template class': function($) {
            var $body = $('body').last();

            expect($body.hasClass('t-my-account')).to.be.true;
        }
    });
});
