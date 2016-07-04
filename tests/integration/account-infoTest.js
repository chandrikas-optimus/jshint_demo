define([
    'lib/viewMocker',
    'pages/account-info/account-info-view',
    'text!fixtures/account-info.html',
    'chai'
],
function(test, view, fixture, chai) {
    var expect = chai.expect;

    test('account-info view context', view, fixture, {
        'context contains the correct template name': function($, context) {
            var templateName = context.templateName;
            expect(templateName).to.equal('account-info', 'account-info context has correct template name');
        }
    });

    test('account-info view DOM', view, fixture, {
        'adaptation adds the correct template class': function($) {
            var $body = $('body').last();

            expect($body.hasClass('t-account-info')).to.be.true;
        }
    });
});
