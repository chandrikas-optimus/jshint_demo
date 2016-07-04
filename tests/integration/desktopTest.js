define([
    'lib/viewMocker',
    'pages/desktop/desktop-view',
    'text!fixtures/desktop.html',
    'chai'
],
function(test, view, fixture, chai) {
    var expect = chai.expect;

    test('desktop view context', view, fixture, {
        'context contains the correct template name': function($, context) {
            var templateName = context.templateName;
            expect(templateName).to.equal('desktop', 'desktop context has correct template name');
        }
    });

    test('desktop view DOM', view, fixture, {
        'adaptation adds the correct template class': function($) {
            var $body = $('body').last();

            expect($body.hasClass('t-desktop')).to.be.true;
        }
    });
});
