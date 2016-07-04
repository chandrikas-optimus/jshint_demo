/**
 * Scripts required here will be combined into ui.js
 */

require([
    'global/ui',
    'pages/home/home-ui',
    'pages/sign-in/sign-in-ui',
    'pages/registration/registration-ui',

    'pages/account-info/account-info-ui',
    'pages/account-address-book/account-address-book-ui',
    'pages/account-change-email/account-change-email-ui',
    'pages/account-change-password/account-change-password-ui',
    'pages/account-change-payment-info/account-change-payment-info-ui',
    'pages/account-order/account-order-ui',
    'pages/account-order-history/account-order-history-ui',
    'pages/account-payment-info/account-payment-info-ui',

    // Gift Registry and Wishlist
    'pages/gift-registry-landing/gift-registry-landing-ui',
    'pages/gift-registry-manage/gift-registry-manage-ui',
    'pages/gift-registry-find/gift-registry-find-ui',
    'pages/gift-registry-create/gift-registry-create-ui',
    'pages/gift-registry-view/gift-registry-view-ui',
    'pages/wishlist-landing/wishlist-landing-ui',
    'pages/view-wishlist/view-wishlist-ui',
    'pages/share-wishlist/share-wishlist-ui',

    // Customer Service
    'pages/customer-service-about/customer-service-about-ui',
    'pages/customer-service-order-status/customer-service-order-status-ui',
    'pages/customer-service-shipping-and-handling/customer-service-shipping-and-handling-ui',
    'pages/customer-service-return-exchange/customer-service-return-exchange-ui',
    'pages/customer-service-privacy-policy/customer-service-privacy-policy-ui',
    'pages/customer-service-contact-us/customer-service-contact-us-ui',
    'pages/customer-service-terms/customer-service-terms-ui',
    'pages/customer-service-popular-searches/customer-service-popular-searches-ui',
    'pages/customer-service-faq/customer-service-faq-ui',
    'pages/customer-service-size-chart/customer-service-size-chart-ui',
    'pages/customer-service-catalog-request/customer-service-catalog-request-ui',
    'pages/customer-service-gift-certificate/customer-service-gift-certificate-ui',
    'pages/customer-service-careers/customer-service-careers-ui',
    'pages/customer-service-balance-inquiry/customer-service-balance-inquiry-ui',
    'pages/customer-service-confirmation/customer-service-confirmation-ui',

    'pages/my-account/my-account-ui',
    'pages/email-subscribe/email-subscribe-ui',
    'pages/email-subscribe-form/email-subscribe-form-ui',
    'pages/category-list/category-list-ui',
    'pages/product-list/product-list-ui',
    'pages/bag/bag-ui',
    'pages/product/product-ui',
    'pages/product-single/product-single-ui',
    'pages/product-bundle/product-bundle-ui',
    'pages/product-configurator/product-configurator-ui',

    // Checkout
    'pages/checkout-sign-in/checkout-sign-in-ui',
    'pages/checkout-gift-options/checkout-gift-options-ui',
    'pages/checkout-review-and-payment/checkout-review-and-payment-ui',
    'pages/checkout-order-confirmation/checkout-order-confirmation-ui',
    'pages/checkout-confirmation-details/checkout-confirmation-details-ui',
    'pages/checkout-multi-address/checkout-multi-address-ui',
    'pages/checkout-billing-shipping/checkout-billing-shipping-ui',

    // 404
    'pages/not-found/not-found-ui',

    // Add additional UI scripts here
],
function(
    globalUI,
    home,
    signIn,
    registration,

    accountInfo,
    accountAddressBook,
    accountChangeEmail,
    accountChangePassword,
    AccountChangePaymentInfo,
    accountOrder,
    accountOrderHistory,
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
    CustomerServiceCareers,
    CustomerServiceBalanceInquiry,
    CustomerServiceConfirmation,

    myAccount,
    emailSubscribe,
    emailSubscribeForm,
    categoryList,
    productList,
    bag,
    product,
    productSingle,
    productBundle,
    productConfigurator,

    // Checkout
    checkoutSignIn,
    checkoutGiftOptions,
    checkoutReviewAndPayment,
    checkoutOrderConfirmation,
    checkoutConfirmationDetails,
    checkoutMultiAddress,
    checkoutBillingShipping,

    // 404
    notFound
) {

    // This file gets pre-loaded so we dont' want to explicitly execute
    //  anything here. Instead we will wait for a require statement run
    //  in our template

}, null, true); // relPath, forceSync
