define([
    '$',
    'global/checkoutBaseView',
    'dust!pages/checkout-billing-shipping/checkout-billing-shipping'
],
function($, BaseView, template) {
    return {
        template: template,
        extend: BaseView,

        context: {
            templateName: 'checkout-billing-shipping',
            pageTitle: function() {
                return $('.ORDERREVIEW_HEADER h1').attr('title');
            },
            mainContent: function() {
                return $('#mainContent');
            },
            hiddenForms: function() {
                var $hiddenForms = $('form.hidden');
                return $hiddenForms.add($('#gwt_view_name').parent());
            },
            hiddenLabels: function(context) {
                return context.mainContent.children('.nodisplay, [style*="none"]');
            },
            mainCopy: function(context) {
                var $formContainer = context.mainContent.children('.form');
                var $registrationContainer = $formContainer.find('#checkout-registration-holder');
                return !!$registrationContainer.length ? [] : context.mainContent.children('p').text();
            },
            form: function(context) {
                var $formContainer = context.mainContent.children('.form');
                var $billingContainer = $formContainer.find('#billing-address');
                var $shippingContainer = $formContainer.find('#shipping-address');
                var $registrationContainer = $formContainer.find('#checkout-registration-holder');
                var title = $registrationContainer.find('h3').text();

                return {
                    errorContainer: $formContainer.find('#gwt-error-placement-div'),
                    billingTitle: $billingContainer.find('.BillingHdr').text(),
                    billingContainer: $billingContainer.find('#gwt_billaddr_panel'),
                    emailContainer: $billingContainer.find('#gwt_email_textbox'),
                    confirmEmailContainer: $billingContainer.find('#gwt_confirm_email_textbox'),
                    sendEmailsContainer: $billingContainer.find('#gwt_sendMeEmails_cb'),
                    shippingTitle: $shippingContainer.find('.BillingHdr').text(),
                    shippingAddressOptions: $shippingContainer.find('#gwt_shippingOption_panel'),
                    shippingContainer: $shippingContainer.find('#gwt_shipaddr_panel'),
                    registrationContainer: {
                        isPresent: !!$registrationContainer.length,
                        revealTitle: '+ ' + title,
                        title: title,
                        container: $registrationContainer.find('#gwt_password_panel'),
                        copy: $registrationContainer.children('p').filter(function() {
                            var $this = $(this);

                            // Ignore empty <p> tags
                            if ($this.text().trim().length > 0) {
                                // Remove last <br> so 'Your password must be at...' text is one line
                                $this.find('br:last').remove();
                                // Decorate as grey text
                                return $this.addClass('c-note u-text-weight-normal u-margin-bottom-xlg');
                            }
                        })
                    },
                    ctaContainer: $formContainer.find('#gwt_billshipaddr_btn')
                };
            }
        },

        postProcess: function(context) {
            if (BaseView.postProcess) {
                context = BaseView.postProcess(context);
            }

            // This checkout page has the custom return button
            context.footer.hasReturnButton = true;

            // Custom return button should navigate to cart
            context.footer.returnButtonAction = 'window.location.pathname = "/ShoppingCartView";';

            var $breadcrumbs = $('.breadcrumbs li');
            var $giftBreadcrumb = $breadcrumbs.first();
            var orderContainsGifts = /gift/i.test($giftBreadcrumb.text()) && !!$giftBreadcrumb.find('a').length;
            var shippingStep;
            var giftStep;
            var steps;

            if (orderContainsGifts) {
                context.header.progressBar = context.header.progressBarWithGift;
            }
            shippingStep = context.header.progressBar.steps[0];

            shippingStep.status = 'c--active';

            return context;
        }
    };
});
