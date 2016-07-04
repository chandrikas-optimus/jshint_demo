define([
    'lib/viewMocker',
    'pages/account-order/account-order-view',
    'text!fixtures/account-order.html',
    'chai'
],
function(test, view, fixture, chai) {
    var expect = chai.expect;

    test('account-order view context', view, fixture, {
        'context contains the correct template name': function($, context) {
            var templateName = context.templateName;
            expect(templateName).to.equal('account-order', 'account-order context has correct template name');
        }
    });

    test('account-order view DOM', view, fixture, {
        'adaptation adds the correct template class': function($) {
            var $body = $('body').last();

            expect($body.hasClass('t-account-order')).to.be.true;
        }
    });
});
