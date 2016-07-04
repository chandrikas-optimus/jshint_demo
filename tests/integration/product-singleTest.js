define([
    'lib/viewMocker',
    'pages/product-single/product-single-view',
    'text!fixtures/product-single.html',
    'chai'
],
function(test, view, fixture, chai) {
    var expect = chai.expect;

    test('product-single view context', view, fixture, {
        'context contains the correct template name': function($, context) {
            var templateName = context.templateName;
            expect(templateName).to.equal('product-single', 'product-single context has correct template name');
        }
    });

    test('product-single view DOM', view, fixture, {
        'adaptation adds the correct template class': function($) {
            var $body = $('body').last();

            expect($body.hasClass('t-product-single')).to.be.true;
        }
    });
});
