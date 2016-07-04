define([
    'lib/viewMocker',
    'pages/product-list/product-list-view',
    'text!fixtures/product-list.html',
    'chai'
],
function(test, view, fixture, chai) {
    var expect = chai.expect;

    test('product-list view context', view, fixture, {
        'context contains the correct template name': function($, context) {
            var templateName = context.templateName;
            expect(templateName).to.equal('product-list', 'product-list context has correct template name');
        }
    });

    test('product-list view DOM', view, fixture, {
        'adaptation adds the correct template class': function($) {
            var $body = $('body').last();

            expect($body.hasClass('t-product-list')).to.be.true;
        }
    });
});
