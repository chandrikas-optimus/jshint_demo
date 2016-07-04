define([
    '$',
    'global/baseView',
    'components/breadcrumbs/parsers/breadcrumbs-parser',
    'dust!pages/account-address-book/account-address-book'
],
function(
    $,
    BaseView,
    breadcrumbsParser,
    template
) {
    return {
        template: template,
        extend: BaseView,

        context: {
            templateName: 'account-address-book',
            breadcrumbs: function() {
                return breadcrumbsParser.parseAccount();
            },
            pageTitle: function() {
                return $('#mainContent h1').first().attr('title') || 'Address Book';
            },
            intro: function() {
                return $('#act > p');
            },
            addressListContainer: function() {
                // Note: address list is dynamic
                return $('#gwt_address_display_panel');
            },
            removeConfirmDialog: function() {
                return $('#gwt-removeConfirmDlog-content');
            }
        }
    };
});
