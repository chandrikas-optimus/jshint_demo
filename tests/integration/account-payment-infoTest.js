define([
    'lib/viewMocker',
    'pages/account-payment-info/account-payment-info-view',
    'text!fixtures/account-payment-info.html',
    'chai'
],
function(test, view, fixture, chai) {
    var expect = chai.expect;

    test('account-payment-info view context', view, fixture, {
        'context contains the correct template name': function($, context) {
            var templateName = context.templateName;
            expect(templateName).to.equal('account-payment-info', 'account-payment-info context has correct template name');
        }
    });

    test('account-payment-info view DOM', view, fixture, {
        'adaptation adds the correct template class': function($) {
            var $body = $('body').last();

            expect($body.hasClass('t-account-payment-info')).to.be.true;
        }
    });
});
