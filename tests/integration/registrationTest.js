define([
    'lib/viewMocker',
    'pages/registration/registration-view',
    'text!fixtures/registration.html',
    'chai'
],
function(test, view, fixture, chai) {
    var expect = chai.expect;

    test('registration view context', view, fixture, {
        'context contains the correct template name': function($, context) {
            var templateName = context.templateName;
            expect(templateName).to.equal('registration', 'registration context has correct template name');
        }
    });

    test('registration view DOM', view, fixture, {
        'adaptation adds the correct template class': function($) {
            var $body = $('body').last();

            expect($body.hasClass('t-registration')).to.be.true;
        }
    });
});
