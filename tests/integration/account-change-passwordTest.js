define([
    'lib/viewMocker',
    'pages/account-change-password/account-change-password-view',
    'text!fixtures/account-change-password.html',
    'chai'
],
function(test, view, fixture, chai) {
    var expect = chai.expect;

    test('account-change-password view context', view, fixture, {
        'context contains the correct template name': function($, context) {
            var templateName = context.templateName;
            expect(templateName).to.equal('account-change-password', 'account-change-password context has correct template name');
        }
    });

    test('account-change-password view DOM', view, fixture, {
        'adaptation adds the correct template class': function($) {
            var $body = $('body').last();

            expect($body.hasClass('t-account-change-password')).to.be.true;
        }
    });
});
