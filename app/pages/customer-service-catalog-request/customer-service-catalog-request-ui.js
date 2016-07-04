define([
    '$',
    'pages/customer-service-catalog-request/catalog-form-ui'
], function(
    $,
    catalogFormUI
) {
    var customerServiceCatalogRequestUI = function() {
        var document = $('document');
        if (window.CSBEntryPoint) {
            var installRunAsyncCode = window.CSBEntryPoint.__installRunAsyncCode;
            window.CSBEntryPoint.__installRunAsyncCode = function() {
                var results = installRunAsyncCode.apply(this, arguments);
                window.setTimeout(function() {
                    if ($('#gwt_addr_panel div').length) {
                        // Manually trigger the add child
                        var desktopClick = $('.gwt-relative-dlog button')[0].click();
                        catalogFormUI([
                            '#gwt_addr_panel',
                            '#gwt_email_textbox, #gwt_sendEmail_cb',
                            '.gwt-relative-dlog',
                            '#gwt_catreqaddr_btn'
                        ]);
                    }
                });
                return results;
            };
        }
        // Add any scripts you would like to run on the customerServiceCatalogRequest page only here
    };

    return customerServiceCatalogRequestUI;
});
