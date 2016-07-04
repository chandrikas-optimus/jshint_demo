define([
    'lib/viewMocker',
    'pages/account-order-history/account-order-history-view',
    'text!fixtures/account-order-history.html',
    'chai'
],
function(test, view, fixture, chai) {
    var expect = chai.expect;

    test('account-order-history view context', view, fixture, {
        'context contains the correct template name': function($, context) {
            var templateName = context.templateName;
            expect(templateName).to.equal('account-order-history', 'account-order-history context has correct template name');
        }
    });

    test('account-order-history view DOM', view, fixture, {
        'adaptation adds the correct template class': function($) {
            var $body = $('body').last();

            expect($body.hasClass('t-account-order-history')).to.be.true;
        }
    });
});
