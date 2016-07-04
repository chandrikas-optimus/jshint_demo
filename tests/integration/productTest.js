define([
    'lib/viewMocker',
    'pages/product/product-view',
    'text!fixtures/product.html',
    'chai'
],
function(test, view, fixture, chai) {
    var expect = chai.expect;

    test('product view context', view, fixture, {
        'context contains the correct template name': function($, context) {
            var templateName = context.templateName;
            expect(templateName).to.equal('product', 'product context has correct template name');
        }
    });

    test('product view DOM', view, fixture, {
        'adaptation adds the correct template class': function($) {
            var $body = $('body').last();

            expect($body.hasClass('t-product')).to.be.true;
        }
    });
});
