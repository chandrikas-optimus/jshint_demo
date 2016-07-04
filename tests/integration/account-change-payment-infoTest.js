define([
    'lib/viewMocker',
    'pages/account-change-payment-info/account-change-payment-info-view',
    'text!fixtures/account-change-payment-info.html',
    'chai'
],
function(test, view, fixture, chai) {
    var expect = chai.expect;

    test('account-change-payment-info view context', view, fixture, {
        'context contains the correct template name': function($, context) {
            var templateName = context.templateName;
            expect(templateName).to.equal('account-change-payment-info', 'account-change-payment-info context has correct template name');
        }
    });

    test('account-change-payment-info view DOM', view, fixture, {
        'adaptation adds the correct template class': function($) {
            var $body = $('body').last();

            expect($body.hasClass('t-account-change-payment-info')).to.be.true;
        }
    });
});
