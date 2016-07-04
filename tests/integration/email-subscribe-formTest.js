define([
    'lib/viewMocker',
    'pages/email-subscribe-form/email-subscribe-form-view',
    'text!fixtures/email-subscribe-form.html',
    'chai'
],
function(test, view, fixture, chai) {
    var expect = chai.expect;

    test('email-subscribe-form view context', view, fixture, {
        'context contains the correct template name': function($, context) {
            var templateName = context.templateName;
            expect(templateName).to.equal('email-subscribe-form', 'email-subscribe-form context has correct template name');
        }
    });

    test('email-subscribe-form view DOM', view, fixture, {
        'adaptation adds the correct template class': function($) {
            var $body = $('body').last();

            expect($body.hasClass('t-email-subscribe-form')).to.be.true;
        }
    });
});
