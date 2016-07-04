define([
    '$',
    'global/baseView',
    'components/breadcrumbs/parsers/breadcrumbs-parser',
    'dust!pages/account-payment-info/account-payment-info'
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
            templateName: 'account-payment-info',
            breadcrumbs: function() {
                return breadcrumbsParser.parseAccount();
            },
            pageTitle: function() {
                // NOTE: Header title attribute is wrong on this page
                //return $('#mainContent h1').first().attr('title') || 'Change Payment Info';
                return 'Change Payment Info';
            },
            intro: function() {
                return $('.inst-copy');
            },
            paymentInfo: function() {
                return $('#mainContent .data').map(function(_, data) {
                    var $data = $(data);
                    var $hiddenInputs = $data.find('input[type=hidden]').remove();
                    var $rows = $data.find('.form .spot');
                    var $removeButton = $data.find('.form a.button').first();
                    var $editButton = $data.find('.form a.button').last();

                    return {
                        rows: $rows.map(function(_, row) {
                            var $row = $(row);

                            return {
                                key: $row.find('label').text(),
                                value: $row.find('span').text()
                            };
                        }),
                        removeButton: $removeButton,
                        editButton: $editButton
                    };
                });
            }
        }

        /**
         * If you wish to override preProcess/postProcess in this view, have a look at the documentation:
         * http://adaptivejs.mobify.com/v1.0/docs/views
         */
    };
});
