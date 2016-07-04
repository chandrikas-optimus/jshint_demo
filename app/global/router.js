define([
    '$',
    'adaptivejs/router',
    'pages/home/home-view',
    'pages/sign-in/sign-in-view',
    'pages/registration/registration-view',

    // Account
    'pages/account-info/account-info-view',
    'pages/account-address-book/account-address-book-view',
    'pages/account-change-email/account-change-email-view',
    'pages/account-change-password/account-change-password-view',
    'pages/account-change-payment-info/account-change-payment-info-view',
    'pages/account-order/account-order-view',
    'pages/account-order-history/account-order-history-view',
    'pages/account-payment-info/account-payment-info-view',

    // Gift Registry and Wishlist
    'pages/gift-registry-landing/gift-registry-landing-view',
    'pages/gift-registry-manage/gift-registry-manage-view',
    'pages/gift-registry-find/gift-registry-find-view',
    'pages/gift-registry-create/gift-registry-create-view',
    'pages/gift-registry-view/gift-registry-view-view',
    'pages/wishlist-landing/wishlist-landing-view',
    'pages/view-wishlist/view-wishlist-view',
    'pages/share-wishlist/share-wishlist-view',

    // Customer Service
    'pages/customer-service-about/customer-service-about-view',
    'pages/customer-service-order-status/customer-service-order-status-view',
    'pages/customer-service-shipping-and-handling/customer-service-shipping-and-handling-view',
    'pages/customer-service-return-exchange/customer-service-return-exchange-view',
    'pages/customer-service-privacy-policy/customer-service-privacy-policy-view',
    'pages/customer-service-contact-us/customer-service-contact-us-view',
    'pages/customer-service-terms/customer-service-terms-view',
    'pages/customer-service-popular-searches/customer-service-popular-searches-view',
    'pages/customer-service-faq/customer-service-faq-view',
    'pages/customer-service-size-chart/customer-service-size-chart-view',
    'pages/customer-service-catalog-request/customer-service-catalog-request-view',
    'pages/customer-service-gift-certificate/customer-service-gift-certificate-view',
    'pages/customer-service-balance-inquiry/customer-service-balance-inquiry-view',
    'pages/customer-service-confirmation/customer-service-confirmation-view',
    // 'pages/customer-service-careers/customer-service-careers-view',

    'pages/my-account/my-account-view',
    'pages/email-subscribe/email-subscribe-view',
    'pages/email-subscribe-form/email-subscribe-form-view',
    'pages/desktop/desktop-view',
    'pages/category-list/category-list-view',
    'pages/product-list/product-list-view',
    'pages/bag/bag-view',
    'pages/product/product-view',
    'pages/product-single/product-single-view',
    'pages/product-bundle/product-bundle-view',
    'pages/product-configurator/product-configurator-view',

    // Checkout
    'pages/checkout-sign-in/checkout-sign-in-view',
    'pages/checkout-gift-options/checkout-gift-options-view',
    'pages/checkout-review-and-payment/checkout-review-and-payment-view',
    'pages/checkout-order-confirmation/checkout-order-confirmation-view',
    'pages/checkout-confirmation-details/checkout-confirmation-details-view',
    'pages/checkout-multi-address/checkout-multi-address-view',
    'pages/checkout-billing-shipping/checkout-billing-shipping-view',

    // 404
    'pages/not-found/not-found-view'
],
function(
    $,
    Router,
    Home,
    SignIn,
    Registration,

    // Account
    AccountInfo,
    AccountAddressBook,
    AccountChangeEmail,
    AccountChangePassword,
    AccountChangePaymentInfo,
    AccountOrder,
    AccountOrderHistory,
    AccountPaymentInfo,

    // Gift Registry and Wishlist
    GiftRegistryLanding,
    GiftRegistryManage,
    GiftRegistryFind,
    GiftRegistryCreate,
    GiftRegistryView,
    WishlistLanding,
    ViewWishlist,
    ShareWishlist,

    // Customer Service
    CustomerServiceAbout,
    CustomerServiceOrderStatus,
    CustomerServiceShippingAndHandling,
    CustomerServiceReturnExchange,
    CustomerServicePrivacyPolicy,
    CustomerServiceContactUs,
    CustomerServiceTerms,
    CustomerServicePopularSearches,
    CustomerServiceFAQ,
    CustomerServiceSizeChart,
    CustomerServiceCatalogRequest,
    CustomerServiceGiftCertificate,
    CustomerServiceBalanceInquiry,
    CustomerServiceConfirmation,
    // CustomerServiceCareers,

    MyAccount,
    emailSubscribe,
    emailSubscribeForm,
    desktop,
    categoryList,
    productList,
    bag,
    product,
    productSingle,
    productBundle,
    productConfigurator,

    // Checkout
    CheckoutSignIn,
    CheckoutGiftOptions,
    CheckoutReviewAndPayment,
    CheckoutOrderConfirmation,
    CheckoutConfirmationDetails,
    CheckoutMultiAddress,
    CheckoutBillingShipping,

    // 404
    notFound
) {
    var router = new Router();

    Router.selectorMatchAll = function(selectors, expectedNumberOfMatches) {
        return function() {
            return $(selectors).length === expectedNumberOfMatches;
        };
    };

    router
        .add(Router.selectorMatch('div[id*="content_home"]'), Home)
        .add(Router.urlMatch('/foo'), Home)

        // .add(function() {return true;}, Home)
        .add(Router.selectorMatchAll('#userLogonForm, #userLogonRegistration', 2), SignIn)
        .add(Router.urlMatch('webapp/wcs/stores/servlet/ReLogonFormView'), SignIn)
        .add(Router.selectorMatch('#userRegistrationForm'), Registration)

        // AccountInfo has same selectors as on checkout's shipping & billing page
        // Place checkout's selector at higher hierarchy
        .add(Router.selectorMatch('.view-BillingShippingAddressDisplayView'), CheckoutBillingShipping)

        // This is the 2nd step of the registration process
        .add(Router.selectorMatchAll('#gwt_shipaddr_panel, #gwt_billaddr_panel', 2), AccountInfo)
        .add(Router.selectorMatch('.emailSubscribeIframe'), emailSubscribe)
        .add(Router.selectorMatch('.emailUnsubscribeIframe'), emailSubscribe)

        .add(Router.selectorMatch('form[action*="fireflies-email"]'), emailSubscribeForm)

        // Account subpages
        .add(Router.urlMatch('/AddressBookView'), AccountAddressBook)
        .add(Router.urlMatch('/ChangeEmailView'), AccountChangeEmail)
        .add(Router.urlMatch('/ChangePassword'), AccountChangePassword)
        .add(Router.urlMatch('/CreditCardEditView'), AccountChangePaymentInfo)
        .add(Router.urlMatch('/OrderDetailsView'), AccountOrder)
        .add(Router.urlMatch('/OrderHistoryView'), AccountOrderHistory)
        .add(Router.urlMatch('/CreditCardView'), AccountPaymentInfo)

        // Gift Registry
        .add(Router.selectorMatch('.view-GiftRegistryHomeView'), GiftRegistryLanding)
        .add(Router.selectorMatch('.view-GiftRegistryStaticViewView'), GiftRegistryManage)
        .add(Router.selectorMatch('.view-GiftRegistrySearchView'), GiftRegistryFind)
        .add(Router.selectorMatch('.view-GiftRegistryEditView'), GiftRegistryCreate)
        .add(Router.selectorMatch('.view-GiftRegistryVisitView'), GiftRegistryView)
        .add(Router.selectorMatch('#wishListItemsForm'), ViewWishlist)
        .add(Router.selectorMatch('.view-WishListHomeView'), WishlistLanding)
        .add(Router.selectorMatch('.view-WishListShareView, .view-GiftRegistryShareView'), ShareWishlist)

        // Checkout
        .add(Router.selectorMatch('.view-ShoppingCartView'), bag)
        .add(Router.selectorMatch('.view-CheckoutUserLogonView'), CheckoutSignIn)
        .add(Router.selectorMatch('.view-OrderReviewDisplayView'), CheckoutReviewAndPayment)
        .add(Router.selectorMatch('.view-OrderConfirmationView'), CheckoutOrderConfirmation)
        .add(Router.selectorMatch('.view-OrderConfirmationDisplayView'), CheckoutConfirmationDetails)
        .add(Router.selectorMatch('.view-MultipleShippingAddressDisplayView'), CheckoutMultiAddress)
        .add(Router.selectorMatch('.view-GiftBoxView'), CheckoutGiftOptions)

        // This is the dedicated "My Account" page, different from the above "Account Info" registration step
        .add(Router.selectorMatch('h1[title="Account Overview"]'), MyAccount)

        // Gift certificate
        .add(Router.selectorMatchAll('form[action*=wish-certificates]', 1), CustomerServiceGiftCertificate)

        .add(Router.selectorMatch('.view-ProductCategoryView1'), categoryList)

        // PLP - SLI version (http://stagewcs.chasing-fireflies.com/baby/baby-new-arrivals/#w=*&af=cat2:baby_newarrivals cat1:baby pagetype:products)
        .add(Router.selectorMatch('#sli_resultsSection'), productList)
        // PLP - Websphere version (http://stagewcs.chasing-fireflies.com/baby/baby-new-arrivals/?local=y)
        // NOTE: Both of the above URLs are the same except for the last bits...
        //       once you see the websphere version, it follows you around. So
        //       incognito window helps a lot in this case.
        .add(Router.selectorMatch('#gwt_products_display'), productList)

        // This is the Customer Service page
        .add(Router.urlMatch('/customer-service/content'), CustomerServiceAbout)
        .add(Router.urlMatch('/OrderStatusView'), CustomerServiceOrderStatus)
        .add(Router.selectorMatchAll('h1.shippingInfoHeader', 1), CustomerServiceShippingAndHandling)
        .add(Router.urlMatch('/full-privacy/'), CustomerServicePrivacyPolicy)
        // Using regex to match two urls
        // 1. http://stagewcs.chasing-fireflies.com/full-privacy/content
        // 2. http://stagewcs.chasing-fireflies.com/webapp/wcs/stores/servlet/WCMContentView?catalogId=10059&contentKey=WCM_FULL_PRIVACY&langId=-1&storeId=10059
        .add(Router.urlMatch(/PRIVACY/i), CustomerServicePrivacyPolicy)
        .add(Router.urlMatch('CUSTOMER_SERVICE'), CustomerServiceAbout)
        .add(Router.urlMatch('/CustomerServiceFormView'), CustomerServiceContactUs)
        .add(Router.urlMatch(/CONDITIONS[-_]OF[-_]USE/i), CustomerServiceTerms)
        .add(Router.selectorMatch('.view-SLIPopularSearchesView'), CustomerServicePopularSearches)
        // Using url regex to match between /faqs/ and /WCMContentView?catalogId=10059&contentKey=WCM_FAQS
        // Note: This url match can't just test the url for faqs otherwise it will match the review/payment page
        .add(function() {
            return /FAQS/i.test(window.location.href) && $('.view-WCMContentView').length > 0;
        }, CustomerServiceFAQ)
        .add(Router.urlMatch(/returns[-_]and[-_]exchgs/i), CustomerServiceReturnExchange)
        .add(Router.urlMatch(/SIZING[-_]CHART/i), CustomerServiceSizeChart)
        .add(Router.urlMatch('/RequestACatalogView'), CustomerServiceCatalogRequest)
        .add(Router.urlMatch('/GiftCardBalanceView'), CustomerServiceBalanceInquiry)
        // .add(Router.urlMatch('/career-opps'), CustomerServiceCareers)
        .add(Router.urlMatch('/ConfirmationView'), CustomerServiceConfirmation)

        // Desktop pages with viewport fix
        .add(Router.urlMatch('/popularsearches/'), desktop)
        .add(Router.urlMatch('/conditions-of-use/'), desktop)
        .add(Router.urlMatch('/full-privacy/'), desktop)
        .add(Router.urlMatch('/SiteMapView'), desktop)


        // http://stagewcs.chasing-fireflies.com/mens-cowardly-lion-costume/costumes-dress-up/family-costumes/wizard-of-oz/158077
        .add(Router.selectorMatch('#gwt_productdetail_json'), productSingle)
        // http://stagewcs.chasing-fireflies.com/kids-personalized-low-top-chuck-taylors/194354
        .add(Router.selectorMatch('#gwt_bundledetail_json'), productBundle)
        // http://stagewcs.chasing-fireflies.com/design-a-princess-gown-26-accessory-set/198652
        .add(Router.selectorMatch('#gwt_product_configurator_detail_json'), productConfigurator)

        // 404
        .add(Router.selectorMatch('.error404spot1'), notFound);

    return router;
});
