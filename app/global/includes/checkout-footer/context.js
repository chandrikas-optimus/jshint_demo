define(['$'],
function($) {

    return {
        context: {
            hasReturnButton: function() {
                // NOTE: Checkout pages should flag this to true as needed
                return false;
            },
            returnButtonAction: function() {
                // NOTE: Checkout pages should set this as a JS function string as needed
                return false;
            },
            copyrightText: function() {
                return $('#copyright .cr').text();
            },
            sourceCode: function() {
                return $('#sourceCode');
            },
            sourceCodeHidden: function() {
                return $('#display_source_code');
            }
        }
    };
});
