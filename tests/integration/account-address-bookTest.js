define([
    'lib/viewMocker',
    'pages/account-address-book/account-address-book-view',
    'text!fixtures/account-address-book.html',
    'chai'
],
function(test, view, fixture, chai) {
    var expect = chai.expect;

    test('account-address-book view context', view, fixture, {
        'context contains the correct template name': function($, context) {
            var templateName = context.templateName;
            expect(templateName).to.equal('account-address-book', 'account-address-book context has correct template name');
        }
    });

    test('account-address-book view DOM', view, fixture, {
        'adaptation adds the correct template class': function($) {
            var $body = $('body').last();

            expect($body.hasClass('t-account-address-book')).to.be.true;
        }
    });
});
