define([
    'lib/viewMocker',
    'pages/sign-in/sign-in-view',
    'text!fixtures/sign-in.html',
    'chai'
],
function(test, view, fixture, chai) {
    var expect = chai.expect;

    test('sign-in view context', view, fixture, {
        'context contains the correct template name': function($, context) {
            var templateName = context.templateName;
            expect(templateName).to.equal('sign-in', 'sign-in context has correct template name');
        }
    });

    test('sign-in view DOM', view, fixture, {
        'adaptation adds the correct template class': function($) {
            var $body = $('body').last();

            expect($body.hasClass('t-sign-in')).to.be.true;
        }
    });
});
