define([
    'lib/viewMocker',
    'pages/email-subscribe/email-subscribe-view',
    'text!fixtures/email-subscribe.html',
    'chai'
],
function(test, view, fixture, chai) {
    var expect = chai.expect;

    test('email-subscribe view context', view, fixture, {
        'context contains the correct template name': function($, context) {
            var templateName = context.templateName;
            expect(templateName).to.equal('email-subscribe', 'email-subscribe context has correct template name');
        }
    });

    test('email-subscribe view DOM', view, fixture, {
        'adaptation adds the correct template class': function($) {
            var $body = $('body').last();

            expect($body.hasClass('t-email-subscribe')).to.be.true;
        }
    });
});
