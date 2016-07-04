define([
    '$',
    'fastclick',
    'deckard',
    'pikabu',
    'drawer-left',
    'drawer-right',
    'navitron',
    'components/flip/flip-ui',
    'components/tabs/tabs-ui',
    'bellows',
    'hijax',
    'pinny',
    'sheet-bottom',
    'scrollTo',
    'modal-center',

    'dust!global/includes/minicart/minicart__product',
    'dust!components/autocomplete/autocomplete',
    'components/autocomplete/parsers/autocomplete-parser',
    'components/sheet/sheet-ui',

    // no args
    'external!global/jquery-extensions'
],
function(
    $,
    fastclick,
    deckard,
    pikabu,
    drawerLeft,
    drawerRight,
    navitron,
    flipUI,
    tabs,
    bellows,
    Hijax,
    pinny,
    sheetBottom,
    scrollTo,
    modalCenter,

    minicartProductListTemplate,
    AutoCompleteTemplate,
    autoCompleteParser,
    Sheet
) {

    // Trigger custom event whenever appendChild is called.
    // Great for parsing/decorating dynamic content inserted by GWT
    // NOTE: to use this custom event, please call the util function afterAppendChild() in utils.js
    var _appendChild = Element.prototype.appendChild;
    Element.prototype.appendChild = function() {
        // console.info('appending to', this, arguments);

        var result = _appendChild.apply(this, arguments);
        var $parent = $(this);
        var $child = $(arguments[0]);

        $('body').trigger('afterAppendChild', [$parent, $child]);

        return result;
    };


    var welcomeInitialized = false;

    var animationListener = function() {
        if (event.animationName === 'triggerAnimation__welcome' && !welcomeInitialized) {

            $('.js-welcome-modal').pinny({
                effect: modalCenter,
                zIndex: 1000,
                coverage: '80%',
                cssClass: 'c-modal c--fixed-size c--center c-welcome-modal',
                shade: {
                    zIndex: 100
                },
                structure: false
            });

            // Transform welcome modal
            var $welcomeModal = $('#gwt_welcome_window');

            // CF-222: Clear error when field is valid
            var isValidEmailAddress = function(value) {
                var pattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i;
                return pattern.test(value);
            };

            $welcomeModal.removeAttr('style');
            $welcomeModal.find('*').not('.gwt_confirmation_div').removeAttr('style');
            $welcomeModal.find('.gwt_welcome_window_close').remove();
            $welcomeModal.find('#email').attr('placeholder', 'Your Email Address');
            $welcomeModal.find('#email').attr('type', 'email');
            $welcomeModal.find('.gwt_welcome_window_submit').text('Sign-Up');
            $welcomeModal.find('.gwt_welcome_window_submit').addClass('c-button c--full-width u-margin-top');
            $welcomeModal.find('.gwt_welcome_window').addClass('u-text-align-center');
            $welcomeModal.find('#joinTheFun').addClass('c-heading c--1 u-margin-bottom-lg');
            $welcomeModal.find('br').remove();
            $welcomeModal.find('#gwt-error-placement-div').addClass('c-error-text');
            $welcomeModal.prependTo('.js-welcome-modal .pinny__content');

            $('.js-welcome-modal').pinny('open');

            $welcomeModal.find('#email').on('blur', function(e) {
                $('html,body').animate( { scrollTop: 0 }, 'slow');
                return false;
            });

            // CF-222: Clear error when field is valid
            $welcomeModal.find('#email').on('keyup', function(e) {
                var value = $(this).val();

                if (isValidEmailAddress(value)) {
                    $welcomeModal.find('.gwt-csb-error-panel').empty();
                }
            });

            welcomeInitialized = true;
        } else if (event.animationName === 'addedToCart') {
            // CF-162: Add to cart popup
            $('body').trigger('mobify:addedToCart');
        }
    };

    var overrideSearch = function() {
        // CF-740: sliAutocomplete doesn't have select on the Design a Princess page
        if (!window.sliAutocomplete.select) {
            return;
        }

        var _oldAddData = window.sliAutocomplete.select.addData;
        var _oldSelectCurrent = window.sliAutocomplete.select.selectCurrent;
        var _oldInputBlur = window.sliAutocomplete.input.onBlur;
        var $searchSuggest = $('#sli_autocomplete');

        $searchSuggest.addClass('js-search__auto-complete c-autocomplete__wrapper');

        $searchSuggest.appendTo($('.js-search'));

        window.sliAutocomplete.select.addData = function() {
            var searchData = {};

            try {
                // Desktop script will throw exception
                _oldAddData.apply(this, arguments);
            } catch (err) {
                console.error(err);
            }

            var urls = this.urls;
            $searchSuggest.removeAttr('style');

            searchData = autoCompleteParser.parse($searchSuggest, urls);

            // Show/Hide the search complete overlay.
            if (searchData.suggestions.length || searchData.products.length) {
                $searchSuggest.css('opacity', 1);
            } else {
                $searchSuggest.css('opacity', 0);
            }

            new AutoCompleteTemplate(searchData, function(err, html) {
                $searchSuggest.html($(html));
            });
        };

        // CF-588: Take autocomplete search suggestion actions from FRGT/GR
        // Mark the "active" suggestion to use
        $('body').on('click', '.js-suggestion', function(e) {
            $(this).addClass('js--active');
        });

        // The desktop scripts sets the active option on hover,
        // so set it ouselves before letting the desktop scripts select the "current" option
        window.sliAutocomplete.select.selectCurrent = function() {
            var $suggestions = $('.js-search__auto-complete .js-suggestion');
            this.currentSelected = $suggestions.index($suggestions.filter('.js--active')[0]);
            _oldSelectCurrent.apply(this, arguments);
        };
    };

    var overrideValidateData = function() {
        var oldFn = window.validateData;

        window.validateData = function() {
            // Set focus on error to false to prevent fix position errors with the notice on iOS.
            window.validator_set_focus_on_failure = false; //eslint-disable-line
            return oldFn.apply(this, arguments);
        };
    };

    var initSearch = function() {
        var hijax = new Hijax();
        var searchOverridden = false;
        var $searchInput = $('.js-search__input');
        var $searchPinny = $('.js-search');
        var $closeSearch = $('.js-close-search');

        var getSearchLength = function() {
            return $.trim($searchInput.val()).length;
        };

        // Init search autosuggestion PInny
        $searchPinny.pinny({
            effect: sheetBottom,
            zIndex: 1000, // Match our standard modal z-index from our CSS ($z4-depth)
            coverage: $('.x-header').height() + 'px',
            cssClass: 'c-sheet c--remove-transform c--black-transparent js-header-pinny',
            shade: {
                zIndex: 100, // Match our standard modal z-index from our CSS ($z3-depth)
                opacity: '0',
                cssClass: 'x-header__shade'
            },
            reFocus: false,
            structure: {
                header: false
            }
        });

        var scrollToTop = function(callback) {
            var options = { duration: 'fast'};
            if (callback) {
                options.complete = callback;
            }
            $.scrollTo($('html'), options);
        };

        $searchInput.on('focus', function(e) {
            if (!searchOverridden) {
                // The desktop function that we need to override won't exist on doc ready
                // It's a script that's added through other JS, so wait until the user first
                // focuses into the input to override the desktop functionality
                overrideSearch();
                searchOverridden = true;
            }

            // Ensure autosuggestions are displayed when returning to the search field
            $('#sli_autocomplete').toggle(getSearchLength() > 0);

            scrollToTop(function() {
                $searchPinny.pinny('open');
            });

            // CF-614: The content height gets set to the full page height in iOS
            // ensure it can't get bigger than the device.
            $('.js-header-pinny').css('max-height', window.innerHeight);
        }).on('blur', function(e) {
            // Remove previous fix.
            $('.js-header-pinny').css('max-height', 'none');
        });

        // CF-588: Get rid of searchInput blur event handler here, since it
        // prevents autocomplete results from being clicked

        // Clear search handler
        $closeSearch.on('click', function(e) {
            $searchInput.val('');

            // CF-740: This object doesn't exist on the Design a Princess Gown page
            if (window.sliAutocomplete.select) {
                window.sliAutocomplete.select.hide();
            }

            $searchPinny.pinny('close');
        });

        // Focus on input when clicking on search icon
        $('.js-show-search').on('click', function() {
            $('.js-search__input').focus();
        });

        // CF-578: Transform dynamic prices
        hijax.set(
            'searchPriceUpdate',
            function(url) {
                return /JSONPricingAPI/.test(url);
            },
            {
                receive: function(data, xhr) {
                    if ($('.c-autocomplete__wrapper').is(':visible')) {
                        var data = JSON.parse(data);

                        data.catentries.each(function(item, index) {
                            var id = item.catentryId;
                            var $container = $('.c-autocomplete__wrapper').find('[id$="' + id + '"]');
                            var $wasPrice = $container.find('.priceWas').addClass('c-price__original');
                            var $nowPrice = $container.find('.priceNow, .price');

                            if ($wasPrice.length) {
                                $nowPrice.addClass('c-price__sale');
                                $wasPrice.insertAfter($nowPrice);
                            } else {
                                $nowPrice.addClass('c-price__retail');
                            }

                            // Show price after transforms
                            $container.removeAttr('hidden');
                        });
                    }
                }
            }
        );
    };

    var initNav = function() {
        var $navToggle = $('.js-show-menu');

        var $pikabu = $('.js-header-nav').pikabu({
            coverage: '85%',
            effect: drawerLeft,
            cssClass: 'c-nav c-drawer c--from-left',
            structure: {
                header: false,
                footer: false
            },
            shade: {
                opacity: '0'
            },
            opened: function() {
                // CF-131 [Android] Header (Nav) - The user can't scroll down to see the links under the My Account link on Android
                $('.pikabu__content').removeClass('pikabu--is-scrollable');
            }
        });

        var $navitron = $('.js-navitron');

        $navToggle.on('click', function() {
            $pikabu.pikabu('open');
        });

        $('.js-header-nav').on('click', '.js-close-nav', function() {
            $pikabu.pikabu('close');
        });

        $navitron.navitron({
            structure: false,
            onShown: function(e, ui) {
                // stop navitron from scrolling down to content after changing panes
                $(ui.pane).find('.navitron__header').focus();
            }
        });

        // Make sure navitron panes are scrollable
        $navitron.find('.navitron__content').addClass('u-padding-top u--tight');
    };

    var buildImageURL = function(data) {
        var src = '';
        var partNumber = data.mfPartNumber;
        // Fallback to main image if selected options breaks
        var colourOption = $.grep(data.itemSelectedOptions, function(option) {
            return /color/i.test(option.optionName);
        });
        var selectedColor = colourOption.length ? colourOption[0].selectValue : '';



        // We only want to grab the color code if its present. (Personalized items)
        if (/(\D)([a-z])/i.test(selectedColor)) {
            src = 'http://chasingfireflies.scene7.com/is/image/ChasingFireflies/' + partNumber + '_' + selectedColor;
        } else {
            src = 'http://chasingfireflies.scene7.com/is/image/ChasingFireflies/' + partNumber + '_main';
        }

        return src;
    };

    var parseCartItems = function($items) {
        var $cartContent = $('.js-cart-contents');
        var minicartItems = $items.map(function(_, item) {
            item = item.pageProduct;
            var $options = $(item.itemSelectedOptions).toArray();

            Array.prototype.reverse.apply($options);

            var $table = $options.map(function(option, index) {

                return {
                    label: option.optionName,
                    value: option.optionValue
                };
            });

            $table.push({
                label: 'Quantity',
                value: item.quantity
            });

            return {
                image: {
                    src: buildImageURL(item)
                },
                heading: item.prodName.replace(/&amp;/g, '&').replace(/&#039;/, '\''),
                table: $table
            };
        });

        return {
            minicart: {
                items: minicartItems,
                topButton: minicartItems.length >= 3 ? true : false
            }
        };
    };

    var initMinicart = function() {
        var $minicartToggle = $('.js-show-minicart');
        var hijax = new Hijax();

        var $pikabu = $('.js-minicart-sidebar').pikabu({
            coverage: '85%',
            effect: drawerRight,
            cssClass: 'c-minicart c-drawer c--pink c--from-right',
            structure: {
                header: false,
                footer: false
            },
            shade: {
                opacity: '0'
            },
            opened: function() {
                $('.pikabu__content').removeClass('pikabu--is-scrollable');
            }
        });

        $minicartToggle.on('click', function() {
            $pikabu.pikabu('open');
        });

        $('.js-minicart-sidebar').on('click', '.js-close-minicart', function() {
            $pikabu.pikabu('close');
        });

        hijax.set(
            'mini-cart-proxy',
            function(url) {
                return /MiniCartView/.test(url);
            },
            {
                receive: function(data, xhr) {

                    // Filter out the customization products
                    var items = $.parseJSON(data).items.filter(function(item) {
                        return (item.pageProduct.isPCA === 'false');
                    });
                    var minicartContent = parseCartItems($(items));
                    var itemsCount = 0;
                    var $cartCount = $('.js-header-cart-count');
                    var $badge = $('.js-notice-badge');

                    if (items.length) {
                        // CF-576: Get total quantity of items. Not by item type
                        items.each(function(item, index) {
                            itemsCount += item.pageProduct.quantity;
                        });

                        $('.js-minicart-product-list').empty();

                        minicartProductListTemplate(minicartContent, function(_, out) {
                            $(out).appendTo($('.js-minicart-product-list'));
                        });

                        $('.js-minicart-checkout').attr('href', $('#gwt_minicart_div .gwt-Anchor').attr('href'));
                    }

                    $cartCount.text(itemsCount);
                    if (itemsCount > 0) {
                        $cartCount.removeClass('u-visually-hidden');
                        $cartCount.add($badge).fadeIn();
                    } else {
                        // Hide the badge and cart count, but still allow the
                        // cart count to be read by screen readers
                        $cartCount.addClass('u-visually-hidden').fadeIn();
                        $badge.fadeOut();
                    }

                    $('.c-minicart img').on('error', function() {
                        var $this = $(this);
                        var src = $this.attr('src');

                        // Fallback to main image if thumbnail fails to load
                        $this.attr('src', src.replace(src.substr(src.lastIndexOf('_')), '_main'));
                    });
                }
            }
        );
    };

    var scrollBreadcrumbs = function() {
        var breadcrumbWidth = $('.c-breadcrumbs').width();

        $('.c-breadcrumbs__scroller').scrollLeft($(this).width());
    };

    var scrollBackToTop = function() {
        $('.c-back-to-top').each(function() {
            $(this).on('click', function(e) {
                $.scrollTo($('html'));
            });
        });
    };

    var initBellows = function() {
        // Auto-init bellows (except for the ones tagged with manual init)
        $('.bellows').not('[data-bellows-manual-init]').bellows();
    };

    var _initCustomCheckoutSheet = function() {
        var $customCheckoutSheet = $('.js-custom-return-modal');
        if ($customCheckoutSheet.length) {
            var customSheet = Sheet.init(
                $customCheckoutSheet,
                {
                    disableScrollTop: true
                });

            // Set content
            var $body = $('<div class="u-margin-top u-margin-bottom" />');
            $body.append('<button type="button" class="c-button c--primary c--full-width pinny__close"> Stay In Checkout </button>');
            $body.append('<button type="button" class="c-button c--outline c--full-width u-margin-top-lg js-custom-return-modal__return"> Return To Shopping Bag </button>');
            customSheet.setTitle('Are You Sure?');
            customSheet.setBody($body);

            // Bind trigger
            $('.js-custom-return-modal__trigger').on('click', function() {
                customSheet.toggle();
            });

            if ($('.js-custom-return-action').text() !== '') {
                $customCheckoutSheet.find('.js-custom-return-modal__return').attr('onclick', $('.js-custom-return-action').text());
            }
        }
    };

    var fixIOSScrollInPinny = function() {
        // We need to know when to do the scroll fix, and this is when options
        // change for a product.
        // FRGT-519: Repaint page on touchstart when repaint is needed.
        if (!$.os.ios) { return; }

        $('body')
            .on(
                'blur',
                '.c-sheet:not(.js-no-scrollfix) select, .c-sheet:not(.js-no-scrollfix) input',
                function() {
                    var $sheets = $('.c-sheet.pinny--is-open');

                    $sheets.data('needsScrollFix', true);
                })
            .on(
                'touchstart',
                '.c-sheet:not(.js-no-scrollfix)',
                function() {
                    var $sheet = $(this);
                    var needsScrollFix = $sheet.data('needsScrollFix');

                    if (needsScrollFix) {
                        $sheet.css('border', 'solid 1px transparent');
                        $sheet.find('.c-scooch').css('transform', '');

                        setTimeout(function() {
                            $sheet.find('.c-scooch').css('transform', 'translateZ(0)');
                            $sheet.css('border', 'solid 0px transparent');
                        }, 500);

                        $sheet.data('needsScrollFix', false);
                    }
                });
    };

    var trimEmailOnSubmit = function() {
        // CF-638: If there are spaces following the email,
        // a + is appended in the email address input on the next page
        // We don't want that, so remove those spaces
        $('#EmailSignUpForm').on('submit', function(e) {
            var $emailInput = $('#emailSignUp');
            $emailInput.val($emailInput.val().trim());
        });
    };

    var globalUI = function() {
        // Remove 300ms tap delay using FastClick
        fastclick.attach(document.body);

        // Enable active states for CSS
        $(document).on('touchstart', function() {});

        // For modals
        document.addEventListener('animationStart', animationListener);
        document.addEventListener('webkitAnimationStart', animationListener);

        // Add any scripts you would like to run on ALL pages here
        // 1 px scroll fix for pikabu. Doesn't work for some odd reason within
        //  the open function, leaving here for now
        $('body').scrollTop($('body').scrollTop() + 1);
        initNav();
        initMinicart();
        initBellows();
        initSearch();
        overrideValidateData();
        scrollBreadcrumbs();
        scrollBackToTop();
        trimEmailOnSubmit();
        flipUI.init($('.js-flippable-header'), { toggle: $('.js-show-search, .js-close-search')});

        // Add repaint for scrolling issue.
        fixIOSScrollInPinny();

        _initCustomCheckoutSheet();
    };

    return globalUI;

});
