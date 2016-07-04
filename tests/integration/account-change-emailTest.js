define([
    'lib/viewMocker',
    'pages/account-change-email/account-change-email-view',
    'text!fixtures/account-change-email.html',
    'chai'
],
function(test, view, fixture, chai) {
    var expect = chai.expect;

    test('account-change-email view context', view, fixture, {
        'context contains the correct template name': function($, context) {
            var templateName = context.templateName;
            expect(templateName).to.equal('account-change-email', 'account-change-email context has correct template name');
        }
    });

    test('account-change-email view DOM', view, fixture, {
        'adaptation adds the correct template class': function($) {
            var $body = $('body').last();

            expect($body.hasClass('t-account-change-email')).to.be.true;
        }
    });
});
