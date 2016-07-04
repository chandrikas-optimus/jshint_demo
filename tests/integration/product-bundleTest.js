define([
    'lib/viewMocker',
    'pages/product-bundle/product-bundle-view',
    'text!fixtures/product-bundle.html',
    'chai'
],
function(test, view, fixture, chai) {
    var expect = chai.expect;

    test('product-bundle view context', view, fixture, {
        'context contains the correct template name': function($, context) {
            var templateName = context.templateName;
            expect(templateName).to.equal('product-bundle', 'product-bundle context has correct template name');
        }
    });

    test('product-bundle view DOM', view, fixture, {
        'adaptation adds the correct template class': function($) {
            var $body = $('body').last();

            expect($body.hasClass('t-product-bundle')).to.be.true;
        }
    });
});
