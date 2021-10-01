function ajaxSubmitCommentForm() {
    "use strict";
    var options = {
        success: function() {
            $j("#commentform textarea").val("");
            $j("#commentform .success p").text("Comment has been sent!");
        }
    };
    $j('#commentform').submit(function() {
        $j(this).find('input[type="submit"]').next('.success').remove();
        $j(this).find('input[type="submit"]').after('<div class="success"><p></p></div>');
        $j(this).ajaxSubmit(options);
        return false;
    });
}
var header_height = 100;
var min_header_height_scroll = 57;
var min_header_height_fixed_hidden = 50;
var min_header_height_sticky = 60;
var scroll_amount_for_sticky = 85;
var content_line_height = 60;
var header_bottom_border_weight = 1;
var scroll_amount_for_fixed_hiding = 200;
var paspartu_width_init = 0.02;
var add_for_admin_bar = 0;
header_height = 133;
scroll_amount_for_sticky = 300;
var logo_height = 130;
var logo_width = 280;
logo_height = 246;
logo_width = 125;
header_top_height = 0;
var loading_text;
loading_text = 'Loading new posts...';
var finished_text;
finished_text = 'No more posts';
var piechartcolor;
piechartcolor = "#1abc9c";
piechartcolor = "#3f60ad";
var geocoder;
var map;

function initialize() {
    "use strict";
    var mapStyles = [{
        stylers: [{
            hue: "#324156"
        }, {
            saturation: "-60"
        }, {
            lightness: "-20"
        }, {
            gamma: 1.51
        }]
    }];
    var qodeMapType = new google.maps.StyledMapType(mapStyles, {
        name: "Qode Map"
    });
    geocoder = new google.maps.Geocoder();
    var latlng = new google.maps.LatLng(-34.397, 150.644);
    var myOptions = {
        zoom: 12,
        scrollwheel: false,
        center: latlng,
        zoomControl: true,
        zoomControlOptions: {
            style: google.maps.ZoomControlStyle.SMALL,
            position: google.maps.ControlPosition.RIGHT_CENTER
        },
        scaleControl: false,
        scaleControlOptions: {
            position: google.maps.ControlPosition.LEFT_CENTER
        },
        streetViewControl: false,
        streetViewControlOptions: {
            position: google.maps.ControlPosition.LEFT_CENTER
        },
        panControl: false,
        panControlOptions: {
            position: google.maps.ControlPosition.LEFT_CENTER
        },
        mapTypeControl: false,
        mapTypeControlOptions: {
            mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'qode_style'],
            style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
            position: google.maps.ControlPosition.LEFT_CENTER
        },
        mapTypeId: 'qode_style'
    };
    map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
    map.mapTypes.set('qode_style', qodeMapType);
}

function codeAddress(data) {
    "use strict";
    if (data === '')
        return;
    var contentString = '<div id="content">' + '<div id="siteNotice">' + '</div>' + '<div id="bodyContent">' + '<p>' + data + '</p>' + '</div>' + '</div>';
    var infowindow = new google.maps.InfoWindow({
        content: contentString
    });
    geocoder.geocode({
        'address': data
    }, function(results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
            map.setCenter(results[0].geometry.location);
            var marker = new google.maps.Marker({
                map: map,
                position: results[0].geometry.location,
                icon: 'http://bridge34.qodeinteractive.com/wp-content/themes/bridge/img/pin.png',
                title: data['store_title']
            });
            google.maps.event.addListener(marker, 'click', function() {
                infowindow.open(map, marker);
            });
        }
    });
}
var $j = jQuery.noConflict();
$j(document).ready(function() {
    "use strict";
    showContactMap();
});

function showContactMap() {
    "use strict";
    if ($j("#map_canvas").length > 0) {
        initialize();
        codeAddress("");
        codeAddress("");
        codeAddress("");
        codeAddress("");
        codeAddress("");
    }
}
var no_ajax_pages = [];
var qode_root = 'https://bridge34.qodeinteractive.com/';
var theme_root = 'https://bridge34.qodeinteractive.com/wp-content/themes/bridge/';
var header_style_admin = "";
if (typeof no_ajax_obj !== 'undefined') {
    no_ajax_pages = no_ajax_obj.no_ajax_pages;
};
var $j = jQuery.noConflict();
var $scroll = 0;
var qode_body = $j('body');
var qode_window = $j(window);
var $window_width = $j(window).width();
var $window_height = $j(window).height();
var logo_height;
var menu_dropdown_height_set = false;
var sticky_amount = 0;
var content_menu_position;
var content_menu_top;
var content_menu_top_add = 0;
var src;
var next_image;
var prev_image;
var $top_header_height;
var min_w = 1500;
var video_width_original = 1280;
var video_height_original = 720;
var vid_ratio = 1280 / 720;
var skrollr_slider;
var paspartu_width;
if (typeof paspartu_width_init == 'undefined') {
    var paspartu_width_init = 0.02;
}
$j(document).ready(function() {
    "use strict";
    if ($j('header').hasClass('regular')) {
        content_menu_top = 0;
    }
    if ($j('header').hasClass('fixed_top_header')) {
        content_menu_top = header_height;
    }
    if ($j('header').hasClass('fixed')) {
        content_menu_top = min_header_height_scroll;
    }
    if ($j('header').hasClass('fixed_hiding')) {
        content_menu_top = min_header_height_fixed_hidden + 40;
    }
    if ($j('header').hasClass('stick') || $j('header').hasClass('stick_with_left_right_menu')) {
        content_menu_top = 0;
    }
    if ((!$j('header.page_header').hasClass('scroll_top')) && ($j('header.page_header').hasClass('has_top')) && ($j('header.page_header').hasClass('fixed'))) {
        content_menu_top_add = 34;
    }
    if ($j('body').hasClass('vertical_menu_enabled')) {
        content_menu_top = 0;
        content_menu_top_add = 0;
        var min_header_height_sticky = 0;
    }
    paspartu_width = $window_width < 1024 ? 0.02 : paspartu_width_init;
    contentMinHeight();
    contentMinHeightWithPaspartu();
    setDropDownMenuPosition();
    initDropDownMenu();
    initVerticalMenu();
    initVerticalMobileMenu();
    initQodeSlider();
    initSideMenu();
    initPopupMenu();
    initMessageHeight();
    initToCounter();
    initCounter();
    if (!$j('.vertical_split_slider').length) {
        initCountdown();
    }
    initProgressBars();
    initListAnimation();
    initPieChart();
    initPieChartWithIcon();
    initServiceAnimation();
    initParallaxTitle();
    initSideAreaScroll();
    initVerticalAreaMenuScroll();
    loadMore();
    prettyPhoto();
    alterWPMLSwitcherHeaderBottom();
    initMobileMenu();
    initFlexSlider();
    fitVideo();
    fitAudio();
    initAccordion();
    initAccordionContentLink();
    initMessages();
    initProgressBarsIcon();
    initMoreFacts();
    placeholderReplace();
    backButtonShowHide();
    backToTop();
    initSteps();
    showGoogleMap();
    initProgressBarsVertical();
    initElementsAnimation();
    updateShoppingCart();
    initHashClick();
    initIconWithTextAnimation();
    initVideoBackground();
    initCheckSafariBrowser();
    initSearchButton();
    initCoverBoxes();
    createContentMenu();
    contentMenuScrollTo();
    createSelectContentMenu();
    initButtonHover();
    initEnlargeButton();
    initSocialIconHover();
    initPageTitleAnimation();
    initIconShortcodeHover();
    initIconWithTextHover();
    parallaxLayers();
    initHorizontalMarquee();
    $j('.widget #searchform').mousedown(function() {
        $j(this).addClass('form_focus');
    }).focusout(function() {
        $j(this).removeClass('form_focus');
    });
    $scroll = $j(window).scrollTop();
    checkTitleToShowOrHide();
    checkVerticalMenuTransparency();
    if ($j(window).width() > 1000) {
        headerSize($scroll);
    } else {
        logoSizeOnSmallScreens();
    }
    if ($j(window).width() > 768) {
        contentMenuPosition();
    }
    contentMenuCheckLastSection();
    $j('header:not(.stick_with_left_right_menu) .q_logo a').css('visibility', 'visible');
    initFullScreenTemplate();
    showHideVerticalMenu();
    initMasonryGallery();
    initLoadNextPostOnBottom();
    initBlogMasonryGallery();
    initBlogGallery();
    initContentSlider();
});
$j(window).load(function() {
    "use strict";
    $j('.touch .main_menu li:has(div.second)').doubleTapToGo();
    setLeftPostionedMenuPadding();
    initSmallImageBlogHeight();
    setDropDownMenuPosition();
    initDropDownMenu();
    initPortfolio();
    initPortfolioZIndex();
    initPortfolioSingleInfo();
    initTestimonials();
    initTestimonialsCarousel();
    initVideoBackgroundSize();
    initBlog();
    initBlogMasonryFullWidth();
    initQBlog();
    initPortfolioJustifiedGallery();
    initPortfolioMasonry();
    initPortfolioMasonryFilter();
    initTabs();
    countClientsPerRow();
    animatedTextIconHeight();
    countAnimatedTextIconPerRow();
    initTitleAreaAnimation();
    setContentBottomMargin();
    footerWidth();
    if ($j('nav.content_menu').length > 0) {
        content_menu_position = $j('nav.content_menu').offset().top;
        contentMenuPosition();
    }
    contentMenuCheckLastSection();
    initQodeCarousel();
    initPortfolioSlider();
    initBlogSlider();
    initPreviewSlider();
    initInDeviceSlider();
    initTabsActiveBorder();
    setActiveTabBorder();
    initImageHover();
    $j('header.stick_with_left_right_menu .q_logo a').css('visibility', 'visible');
    setMargingsForLeftAndRightMenu();
    initImageGallerySliderNoSpace();
    initVerticalSplitSlider();
    initParallax();
    initQodeElementAnimationSkrollr();
    qodeBlogCompundMasonryGallery().init();
    qodeInitStickyWidget();
    qodeBlogHeadlines();
    setTimeout(function() {
        checkAnchorOnScroll();
        qodeBlogGalleryAnimation();
        checkAnchorOnLoad();
        checkHeaderStyleOnScroll();
        if ($j('.no-touch .carousel').length) {
            skrollr_slider.refresh();
        }
    }, 700);
});
$j(window).scroll(function() {
    "use strict";
    $scroll = $j(window).scrollTop();
    if ($j(window).width() > 1000) {
        headerSize($scroll);
    }
    if ($j(window).width() > 768) {
        contentMenuPosition();
    }
    contentMenuCheckLastSection();
    checkVerticalMenuTransparency();
    $j('.touch .drop_down > ul > li').mouseleave();
    $j('.touch .drop_down > ul > li').blur();
});
$j(window).resize(function() {
    "use strict";
    $window_width = $j(window).width();
    $window_height = $j(window).height();
    paspartu_width = $window_width < 1024 ? 0.02 : paspartu_width_init;
    if ($j(window).width() > 1000) {
        headerSize($scroll);
    } else {
        logoSizeOnSmallScreens();
    }
    initMessageHeight();
    qodeNumberOfTestimonialsItemsResize();
    fitAudio();
    initSmallImageBlogHeight();
    initBlog();
    initBlogMasonryFullWidth();
    initQBlog();
    animatedTextIconHeight();
    countAnimatedTextIconPerRow();
    initVideoBackgroundSize();
    countClientsPerRow();
    setContentBottomMargin();
    footerWidth();
    calculateHeights();
    $j('.vertical_split_slider').height($window_height);
    initMasonryGallery();
    initPortfolioMasonry();
    contentMinHeight();
    contentMinHeightWithPaspartu();
    qodeInitStickyWidget();
});

function getScrollAmountForStickyHeader() {
    if (typeof page_scroll_amount_for_sticky !== 'undefined') {
        amount = page_scroll_amount_for_sticky;
    } else if ($j('.carousel.full_screen').length) {
        amount = $j('.carousel').height();
    } else {
        amount = scroll_amount_for_sticky;
    }
    return amount;
}
var sticky_animate;

function headerSize($scroll) {
    "use strict";
    if (($j('header.page_header').hasClass('scroll_top')) && ($j('header.page_header').hasClass('has_top')) && ($j('header.page_header').hasClass('fixed') || $j('header.page_header').hasClass('fixed_hiding'))) {
        if ($scroll >= 0 && $scroll <= 34) {
            $j('header.page_header').css('top', -$scroll);
            $j('header.page_header').css('margin-top', 0);
            $j('.header_top').show();
        } else if ($scroll > 34) {
            $j('header.page_header').css('top', '-34px');
            $j('header.page_header').css('margin-top', 34);
            $j('.header_top').hide();
        }
    }
    sticky_amount = getScrollAmountForStickyHeader();
    if ($j('header').hasClass('regular')) {
        if (header_height - logo_height >= 10) {
            $j('.q_logo a').height(logo_height);
        } else {
            $j('.q_logo a').height(header_height - 10);
        }
        $j('.q_logo a img').css('height', '100%');
    }
    if ($j('header.page_header').hasClass('fixed')) {
        if ($j('header.page_header').hasClass('scroll_top')) {
            $top_header_height = 34;
        } else {
            $top_header_height = 0;
        }
        if ((header_height - $scroll + $top_header_height >= min_header_height_scroll) && ($scroll >= $top_header_height)) {
            $j('header.page_header').removeClass('scrolled');
            $j('header:not(.centered_logo.centered_logo_animate) nav.main_menu > ul > li > a').css('line-height', header_height - $scroll + $top_header_height + 'px');
            $j('header:not(.centered_logo.centered_logo_animate) .side_menu_button').css('height', header_height - $scroll + $top_header_height + 'px');
            $j('header:not(.centered_logo.centered_logo_animate) .shopping_cart_inner').css('height', header_height - $scroll + $top_header_height + 'px');
            $j('header:not(.centered_logo.centered_logo_animate) .logo_wrapper').css('height', header_height - $scroll + $top_header_height + 'px');
            if (header_height - logo_height > 0) {
                $j('header:not(.centered_logo.centered_logo_animate) .q_logo a').css('height', logo_height + 'px');
            } else {
                $j('header:not(.centered_logo.centered_logo_animate) .q_logo a').css('height', (header_height - $scroll + $top_header_height - 10) + 'px');
            }
        } else if ($scroll < $top_header_height) {
            $j('header.page_header').removeClass('scrolled');
            $j('header:not(.centered_logo.centered_logo_animate) nav.main_menu > ul > li > a').css('line-height', header_height + 'px');
            $j('header:not(.centered_logo.centered_logo_animate) .side_menu_button').css('height', header_height + 'px');
            $j('header:not(.centered_logo.centered_logo_animate) .shopping_cart_inner').css('height', header_height + 'px');
            $j('header:not(.centered_logo.centered_logo_animate) .logo_wrapper').css('height', header_height + 'px');
            if (header_height - logo_height > 0) {
                $j('header:not(.centered_logo.centered_logo_animate) .q_logo a').css('height', logo_height + 'px');
            } else {
                $j('header:not(.centered_logo.centered_logo_animate) .q_logo a').css('height', (header_height - 10) + 'px');
            }
        } else if ((header_height - $scroll + $top_header_height) < min_header_height_scroll) {
            $j('header.page_header').addClass('scrolled');
            $j('header:not(.centered_logo.centered_logo_animate) nav.main_menu > ul > li > a').css('line-height', min_header_height_scroll + 'px');
            $j('header:not(.centered_logo.centered_logo_animate) .side_menu_button').css('height', min_header_height_scroll + 'px');
            $j('header:not(.centered_logo.centered_logo_animate) .shopping_cart_inner').css('height', min_header_height_scroll + 'px');
            $j('header:not(.centered_logo.centered_logo_animate) .logo_wrapper').css('height', min_header_height_scroll + 'px');
            if (min_header_height_scroll - logo_height > 0) {
                $j('header:not(.centered_logo.centered_logo_animate) .q_logo a').css('height', logo_height + 'px');
            } else {
                $j('header:not(.centered_logo.centered_logo_animate) .q_logo a').css('height', (min_header_height_scroll - 10) + 'px');
            }
        }
        if ($j('header.page_header').hasClass('centered_logo') && $j('header.page_header').hasClass('centered_logo_animate')) {
            if ((header_height - $scroll + $top_header_height < logo_height) && (header_height - $scroll + $top_header_height >= min_header_height_scroll) && (logo_height > min_header_height_scroll - 10) && ($scroll >= $top_header_height)) {
                $j('.q_logo a').height(header_height - $scroll + $top_header_height - 10);
            } else if ((header_height - $scroll + $top_header_height < logo_height) && (header_height - $scroll + $top_header_height >= min_header_height_scroll) && (logo_height > min_header_height_scroll - 10) && ($scroll < $top_header_height)) {
                $j('.q_logo a').height(header_height - 10);
            } else if ((header_height - $scroll + $top_header_height < logo_height) && (header_height - $scroll + $top_header_height < min_header_height_scroll) && (logo_height > min_header_height_scroll - 10)) {
                $j('.q_logo a').height(min_header_height_scroll - 10);
            } else if ((header_height - $scroll + $top_header_height < logo_height) && (header_height - $scroll + $top_header_height < min_header_height_scroll) && (logo_height < min_header_height_scroll - 10)) {
                $j('.q_logo a').height(logo_height);
            } else if (($scroll + $top_header_height === 0) && (logo_height > header_height - 10)) {
                $j('.q_logo a').height(logo_height);
            } else {
                $j('.q_logo a').height(logo_height);
            }
        } else if ($j('header.page_header').hasClass('centered_logo')) {
            $j('.q_logo a').height(logo_height);
            $j('.q_logo img').height('auto');
        } else {
            $j('.q_logo img').height('100%');
        }
        setLeftPostionedMenuPadding();
    }
    if ($j('header.page_header').hasClass('fixed_hiding')) {
        if ($scroll < scroll_amount_for_fixed_hiding) {
            $j('header.page_header').removeClass('scrolled');
        } else {
            $j('header.page_header').addClass('scrolled');
        }
        $j('.q_logo a').height(logo_height / 2);
        $j('.q_logo img').height('100%');
    }
    if ($j('header.page_header').hasClass('stick') || $j('header.page_header').hasClass('stick_with_left_right_menu')) {
        if ($scroll > sticky_amount) {
            if (!$j('header.page_header').hasClass('sticky')) {
                if ($j('header.page_header').hasClass('has_top')) {
                    $top_header_height = 34;
                } else {
                    $top_header_height = 0;
                }
                var padding_top = $j('header.page_header').hasClass('centered_logo') ? $j('header.page_header').height() : header_height + $top_header_height;
                if ($j('header.page_header').hasClass('menu_bottom')) {
                    padding_top = header_height + 60;
                }
                $j('header.page_header').addClass('sticky');
                $j('.content').css('padding-top', padding_top);
                window.clearTimeout(sticky_animate);
                sticky_animate = window.setTimeout(function() {
                    $j('header.page_header').addClass('sticky_animate');
                }, 100);
                if (min_header_height_sticky - logo_height >= 10) {
                    $j('.q_logo a').height(logo_height);
                } else {
                    $j('.q_logo a').height(min_header_height_sticky - 10);
                }
                if ($j('header.page_header').hasClass('menu_bottom')) {
                    initDropDownMenu();
                }
            }
            if (min_header_height_sticky - logo_height >= 10) {
                $j('.q_logo a').height(logo_height);
            } else {
                $j('.q_logo a').height(min_header_height_sticky - 10);
            }
        } else {
            if ($j('header.page_header').hasClass('sticky')) {
                $j('header').removeClass('sticky_animate');
                $j('header').removeClass('sticky');
                $j('.content').css('padding-top', '0px');
                if ($j('header.page_header').hasClass('menu_bottom')) {
                    initDropDownMenu();
                }
            }
            setMargingsForLeftAndRightMenu();
            if (!$j('header.page_header').hasClass('centered_logo')) {
                if (header_height - logo_height >= 10) {
                    $j('.q_logo a').height(logo_height);
                } else {
                    $j('.q_logo a').height(header_height - 10);
                }
            } else {
                $j('.q_logo a').height(logo_height);
                $j('.q_logo img').height('auto');
            }
            $j('.q_logo a img').css('height', '100%');
        }
        setLeftPostionedMenuPadding();
    }
}

function setMargingsForLeftAndRightMenu() {
    "use strict";
    if ($j('header.page_header').hasClass('stick_with_left_right_menu') && !$j('header.page_header').hasClass('left_right_margin_set')) {
        var logo_width = $j('.q_logo a img').width() / 2;
        if ($scroll == 0 && logo_width != 0) {
            $j('header.page_header').addClass('left_right_margin_set');
        }
        $j('.logo_wrapper').width(logo_width * 2);
        $j('nav.main_menu.left_side > ul > li:last-child').css('margin-right', logo_width);
        $j('nav.main_menu.right_side > ul > li:first-child').css('margin-left', logo_width);
        $j('.rtl nav.main_menu.left_side > ul > li:first-child').css('margin-right', logo_width);
        $j('.rtl nav.main_menu.left_side > ul > li:last-child').css('margin-right', 0);
        $j('.rtl nav.main_menu.right_side > ul > li:last-child').css('margin-left', logo_width);
        $j('.rtl nav.main_menu.right_side > ul > li:first-child').css('margin-left', 0);
    }
}

function setLeftPostionedMenuPadding() {
    "use strict";
    var main_menu = $j('header:not(.centered_logo) nav.main_menu');
    if (main_menu.length && main_menu.hasClass('left')) {
        var image = $j('.q_logo a img').filter(function() {
            return $j(this).css('opacity') == '1';
        });
        main_menu.css('left', image.width());
    }
}

function logoSizeOnSmallScreens() {
    "use strict";
    if ((100 - 20 < logo_height)) {
        $j('.q_logo a').height(100 - 20);
    } else {
        $j('.q_logo a').height(logo_height);
    }
    $j('.q_logo a img').css('height', '100%');
    $j('header.page_header').removeClass('sticky_animate sticky');
    $j('.content').css('padding-top', '0px');
}

function contentMinHeight() {
    "use strict";
    if ($j('header .header_bottom').length || $j('header .bottom_header').length) {
        if ($j('header .header_bottom').length) {
            var headerColorString = $j('header .header_bottom').css('background-color');
        }
        if ($j('header .bottom_header').length) {
            var headerColorString = $j('header .bottom_header').css('background-color');
        }
        var headerTransparency = headerColorString.substring(headerColorString.indexOf('(') + 1, headerColorString.lastIndexOf(')')).split(/,\s*/)[3];
        var haeder_add = headerTransparency == undefined && !$j('header.page_header').hasClass('transparent') ? $j('header.page_header').height() : 0;
        $j('body .content').css('min-height', $window_height - haeder_add - $j('footer:not(.uncover)').height());
    }
}

function contentMinHeightWithPaspartu() {
    "use strict";
    if ($j('.paspartu_enabled').length) {
        var content_height;
        var paspartu_final_width_px = 0;
        var paspartu_width_px = $window_width * paspartu_width;
        var footer_height = $j('footer').height();
        if ($j('.disable_footer').length) {
            footer_height = 0;
        }
        if ($j('.vertical_menu_enabled').length) {
            if ($j('.paspartu_top').length && $j('.paspartu_middle_inner').length) {
                paspartu_final_width_px += paspartu_width_px;
            }
        } else {
            if ($j('.paspartu_top').length) {
                paspartu_final_width_px += paspartu_width_px;
            }
        }
        if ($j('.paspartu_bottom').length || !$j('.disable_bottom_paspartu').length) {
            paspartu_final_width_px += paspartu_width_px;
        }
        if ($j('.vertical_menu_enabled').length) {
            content_height = $window_height - paspartu_final_width_px - footer_height;
        } else {
            if ($j('header .header_bottom').length) {
                var headerColorString = $j('header .header_bottom').css('background-color');
            }
            if ($j('header .bottom_header').length) {
                var headerColorString = $j('header .bottom_header').css('background-color');
            }
            var headerTransparency = headerColorString.substring(headerColorString.indexOf('(') + 1, headerColorString.lastIndexOf(')')).split(/,\s*/)[3];
            var header_height = headerTransparency == undefined && !$j('header.page_header').hasClass('transparent') ? $j('header.page_header').height() : 0;
            content_height = $window_height - header_height - paspartu_final_width_px - footer_height;
        }
        if ($j('.content').length) {
            $j('.content').css('min-height', content_height);
        }
    }
}
var default_header_style;

function initQodeSlider() {
    "use strict";
    var image_regex = /url\(["']?([^'")]+)['"]?\)/;
    default_header_style = "";
    if ($j('header.page_header').hasClass('light')) {
        default_header_style = 'light';
    }
    if ($j('header.page_header').hasClass('dark')) {
        default_header_style = 'dark';
    }
    if ($j('.carousel').length) {
        var matrixArray = {
            zoom_center: '1.2, 0, 0, 1.2, 0, 0',
            zoom_top_left: '1.2, 0, 0, 1.2, -150, -150',
            zoom_top_right: '1.2, 0, 0, 1.2, 150, -150',
            zoom_bottom_left: '1.2, 0, 0, 1.2, -150, 150',
            zoom_bottom_right: '1.2, 0, 0, 1.2, 150, 150'
        };
        (function($) {
            var matrixRE = /\([0-9epx\.\, \t\-]+/gi;
            var parseMatrix = function(val) {
                return val.match(matrixRE)[0].substr(1).split(",").map(function(s) {
                    return parseFloat(s);
                });
            };
            var transformPropNames = ["transform", "-webkit-transform"];
            var getTransformMatrix = function(el) {
                var matrix = null;
                transformPropNames.some(function(prop) {
                    matrix = el.css(prop);
                    return (matrix !== null && matrix !== "");
                });
                matrix = (!matrix || matrix === "none") ? "matrix(1,0,0,1,0,0)" : matrix;
                return parseMatrix(matrix);
            };
            var setTransformMatrix = function(el, matrix) {
                var m = "matrix(" + matrix.join(",") + ")";
                for (var i = transformPropNames.length - 1; i >= 0; --i) {
                    el.css(transformPropNames[i], m + ' rotate(0.01deg)');
                }
            };
            var interpolate = function(from, to, percent) {
                return from + ((to - from) * (percent / 100));
            };
            $.fn.transformAnimate = function(opt) {
                var options = {
                    transform: "matrix(1,0,0,1,0,0)"
                };
                $.extend(options, opt);
                this.css("percentAnim", 0);
                var sourceTransform = getTransformMatrix(this);
                var targetTransform = parseMatrix(options.transform);
                options.step = function(percentAnim, fx) {
                    var $this = $(this);
                    var matrix = sourceTransform.map(function(c, i) {
                        return interpolate(c, targetTransform[i], percentAnim);
                    });
                    setTransformMatrix($this, matrix);
                    if (opt.step) {
                        opt.step.apply(this, [matrix, fx]);
                    }
                };
                return this.stop().animate({
                    percentAnim: 100
                }, options);
            };
        })(jQuery);
        $j('.carousel').each(function() {
            var $this = $j(this);
            var mobile_header;
            var mobile_header = $j(window).width() < 1000 ? $j('header.page_header').height() : 0;
            var header_height_add_for_paspartu = $window_width > 1000 && !$j('header.page_header').hasClass('transparent') && $j('body.paspartu_on_top_fixed').length == 0 ? $j('header.page_header').height() : 0;
            var paspartu_amount_with_top = $j('.paspartu_outer:not(.disable_top_paspartu)').length > 0 ? Math.round($window_width * paspartu_width + header_height_add_for_paspartu) : 0;
            var paspartu_amount_with_bottom = $j('.paspartu_outer.paspartu_on_bottom_slider').length > 0 ? Math.round($window_width * paspartu_width) : 0;
            var slider_graphic_coefficient;
            var slider_title_coefficient;
            var slider_subtitle_coefficient;
            var slider_text_coefficient;
            var slider_button_coefficient;
            var responsive_breakpoint_set = [1300, 1000, 768];
            if ($this.hasClass('advanced_responsiveness')) {
                responsive_breakpoint_set = [1600, 1200, 900, 650, 500, 320];
                if ($this.data('q_responsive_breakpoints')) {
                    if ($this.data('q_responsive_breakpoints') == 'set2') {
                        responsive_breakpoint_set = [1600, 1300, 1000, 768, 567, 320];
                    }
                }
                var coefficients_graphic_array = $this.data('q_responsive_graphic_coefficients').split(',');
                var coefficients_title_array = $this.data('q_responsive_title_coefficients').split(',');
                var coefficients_subtitle_array = $this.data('q_responsive_subtitle_coefficients').split(',');
                var coefficients_text_array = $this.data('q_responsive_text_coefficients').split(',');
                var coefficients_button_array = $this.data('q_responsive_button_coefficients').split(',');
            }

            function setSliderHeight($this, $def_height) {
                var slider_height = $def_height;
                if ($this.hasClass('advanced_responsiveness')) {
                    if ($window_width > responsive_breakpoint_set[0]) {
                        slider_height = $def_height;
                    } else if ($window_width > responsive_breakpoint_set[1]) {
                        slider_height = $def_height * 0.75;
                    } else if ($window_width > responsive_breakpoint_set[2]) {
                        slider_height = $def_height * 0.6;
                    } else if ($window_width > responsive_breakpoint_set[3]) {
                        slider_height = $def_height * 0.55;
                    } else if ($window_width <= responsive_breakpoint_set[3]) {
                        slider_height = $def_height * 0.45;
                    }
                } else {
                    if ($window_width > responsive_breakpoint_set[0]) {
                        slider_height = $def_height;
                    } else if ($window_width > responsive_breakpoint_set[1]) {
                        slider_height = $def_height * 0.8;
                    } else if ($window_width > responsive_breakpoint_set[2]) {
                        slider_height = $def_height * 0.7;
                    } else if ($window_width <= responsive_breakpoint_set[2]) {
                        slider_height = $def_height * 1;
                    }
                }
                $this.css({
                    'height': (slider_height) + 'px'
                });
                $this.find('.qode_slider_preloader').css({
                    'height': (slider_height) + 'px'
                });
                $this.find('.qode_slider_preloader .ajax_loader').css({
                    'display': 'block'
                });
                $this.find('.item').css({
                    'height': (slider_height) + 'px'
                });
            }

            function resetSliderHeight($def_height) {
                $this.css({
                    'height': ($def_height) + 'px'
                });
                $this.find('.qode_slider_preloader').css({
                    'height': ($def_height) + 'px'
                });
                $this.find('.qode_slider_preloader .ajax_loader').css({
                    'display': 'block'
                });
                $this.find('.item').css({
                    'height': ($def_height) + 'px'
                });
            }

            function setSliderInitialElementsSize($item, i) {
                window["slider_graphic_width_" + i] = [];
                window["slider_graphic_height_" + i] = [];
                window["slider_svg_width_" + i] = [];
                window["slider_svg_height_" + i] = [];
                window["slider_title_" + i] = [];
                window["slider_subtitle_" + i] = [];
                window["slider_text_" + i] = [];
                window["slider_button1_" + i] = [];
                window["slider_button2_" + i] = [];
                window["slider_separator_" + i] = [];
                window["slider_graphic_width_" + i].push(parseFloat($item.find('.thumb img').data("width")));
                window["slider_graphic_height_" + i].push(parseFloat($item.find('.thumb img').data("height")));
                window["slider_svg_width_" + i].push(parseFloat($item.find('.qode_slide-svg-holder svg').attr("width")));
                window["slider_svg_height_" + i].push(parseFloat($item.find('.qode_slide-svg-holder svg').attr("height")));
                window["slider_title_" + i].push(parseFloat($item.find('.q_slide_title').css("font-size")));
                window["slider_subtitle_" + i].push(parseFloat($item.find('.q_slide_subtitle').css("font-size")));
                window["slider_text_" + i].push(parseFloat($item.find('.q_slide_text').css("font-size")));
                window["slider_button1_" + i].push(parseFloat($item.find('.qbutton:eq(0)').css("font-size")));
                window["slider_button2_" + i].push(parseFloat($item.find('.qbutton:eq(1)').css("font-size")));
                window["slider_title_" + i].push(parseFloat($item.find('.q_slide_title').css("line-height")));
                window["slider_subtitle_" + i].push(parseFloat($item.find('.q_slide_subtitle').css("line-height")));
                window["slider_text_" + i].push(parseFloat($item.find('.q_slide_text').css("line-height")));
                window["slider_button1_" + i].push(parseFloat($item.find('.qbutton:eq(0)').css("line-height")));
                window["slider_button2_" + i].push(parseFloat($item.find('.qbutton:eq(1)').css("line-height")));
                window["slider_title_" + i].push(parseFloat($item.find('.q_slide_title').css("letter-spacing")));
                window["slider_subtitle_" + i].push(parseFloat($item.find('.q_slide_subtitle').css("letter-spacing")));
                window["slider_text_" + i].push(parseFloat($item.find('.q_slide_text').css("letter-spacing")));
                window["slider_button1_" + i].push(parseFloat($item.find('.qbutton:eq(0)').css("letter-spacing")));
                window["slider_button2_" + i].push(parseFloat($item.find('.qbutton:eq(1)').css("letter-spacing")));
                window["slider_title_" + i].push(parseFloat($item.find('.q_slide_title').css("margin-bottom")));
                window["slider_subtitle_" + i].push(parseFloat($item.find('.q_slide_subtitle').css("margin-bottom")));
                window["slider_button1_" + i].push(parseFloat($item.find('.qbutton:eq(0)').css("height")));
                window["slider_button2_" + i].push(parseFloat($item.find('.qbutton:eq(1)').css("height")));
                if (parseFloat($item.find('.qbutton:eq(0)').css("width")) != 0) {
                    window["slider_button1_" + i].push(parseFloat($item.find('.qbutton:eq(0)').css("width")));
                } else {
                    window["slider_button1_" + i].push(0);
                }
                if (parseFloat($item.find('.qbutton:eq(1)').css("width")) != 0) {
                    window["slider_button2_" + i].push(parseFloat($item.find('.qbutton:eq(1)').css("width")));
                } else {
                    window["slider_button2_" + i].push(0);
                }
                window["slider_button1_" + i].push(parseFloat($item.find('.qbutton:eq(0)').css("padding-left")));
                window["slider_button1_" + i].push(parseFloat($item.find('.qbutton:eq(0)').css("padding-right")));
                window["slider_button2_" + i].push(parseFloat($item.find('.qbutton:eq(1)').css("padding-left")));
                window["slider_button2_" + i].push(parseFloat($item.find('.qbutton:eq(1)').css("padding-right")));
                window["slider_separator_" + i].push(parseFloat($item.find('.separator').css("margin-top")));
                window["slider_separator_" + i].push(parseFloat($item.find('.separator').css("margin-bottom")));
            }

            function setSliderElementsSize($item, i) {
                if ($window_width > responsive_breakpoint_set[0]) {
                    slider_graphic_coefficient = coefficients_graphic_array[0];
                    slider_title_coefficient = coefficients_title_array[0];
                    slider_subtitle_coefficient = coefficients_subtitle_array[0];
                    slider_text_coefficient = coefficients_text_array[0];
                    slider_button_coefficient = coefficients_button_array[0];
                } else if ($window_width > responsive_breakpoint_set[1]) {
                    slider_graphic_coefficient = coefficients_graphic_array[1];
                    slider_title_coefficient = coefficients_title_array[1];
                    slider_subtitle_coefficient = coefficients_subtitle_array[1];
                    slider_text_coefficient = coefficients_text_array[1];
                    slider_button_coefficient = coefficients_button_array[1];
                } else if ($window_width > responsive_breakpoint_set[2]) {
                    slider_graphic_coefficient = coefficients_graphic_array[2];
                    slider_title_coefficient = coefficients_title_array[2];
                    slider_subtitle_coefficient = coefficients_subtitle_array[2];
                    slider_text_coefficient = coefficients_text_array[2];
                    slider_button_coefficient = coefficients_button_array[2];
                } else if ($window_width > responsive_breakpoint_set[3]) {
                    slider_graphic_coefficient = coefficients_graphic_array[3];
                    slider_title_coefficient = coefficients_title_array[3];
                    slider_subtitle_coefficient = coefficients_subtitle_array[3];
                    slider_text_coefficient = coefficients_text_array[3];
                    slider_button_coefficient = coefficients_button_array[3];
                } else if ($window_width > responsive_breakpoint_set[4]) {
                    slider_graphic_coefficient = coefficients_graphic_array[4];
                    slider_title_coefficient = coefficients_title_array[4];
                    slider_subtitle_coefficient = coefficients_subtitle_array[4];
                    slider_text_coefficient = coefficients_text_array[4];
                    slider_button_coefficient = coefficients_button_array[4];
                } else if ($window_width > responsive_breakpoint_set[5]) {
                    slider_graphic_coefficient = coefficients_graphic_array[5];
                    slider_title_coefficient = coefficients_title_array[5];
                    slider_subtitle_coefficient = coefficients_subtitle_array[5];
                    slider_text_coefficient = coefficients_text_array[5];
                    slider_button_coefficient = coefficients_button_array[5];
                } else {
                    slider_graphic_coefficient = coefficients_graphic_array[6];
                    slider_title_coefficient = coefficients_title_array[6];
                    slider_subtitle_coefficient = coefficients_subtitle_array[6];
                    slider_text_coefficient = coefficients_text_array[6];
                    slider_button_coefficient = coefficients_button_array[6];
                }
                var slider_title_coefficient_letter_spacing = slider_title_coefficient;
                var slider_subtitle_coefficient_letter_spacing = slider_subtitle_coefficient;
                var slider_text_coefficient_letter_spacing = slider_text_coefficient;
                if ($window_width <= responsive_breakpoint_set[0]) {
                    slider_title_coefficient_letter_spacing = slider_title_coefficient / 2;
                    slider_subtitle_coefficient_letter_spacing = slider_subtitle_coefficient / 2;
                    slider_text_coefficient_letter_spacing = slider_text_coefficient / 2;
                }
                $item.find('.thumb').css({
                    "width": Math.round(window["slider_graphic_width_" + i][0] * slider_graphic_coefficient) + 'px'
                }).css({
                    "height": Math.round(window["slider_graphic_height_" + i][0] * slider_graphic_coefficient) + 'px'
                });
                $item.find('.qode_slide-svg-holder svg').css({
                    "width": Math.round(window["slider_svg_width_" + i][0] * slider_graphic_coefficient) + 'px'
                }).css({
                    "height": Math.round(window["slider_svg_height_" + i][0] * slider_graphic_coefficient) + 'px'
                });
                $item.find('.q_slide_title').css({
                    "font-size": Math.round(window["slider_title_" + i][0] * slider_title_coefficient) + 'px'
                });
                $item.find('.q_slide_title').css({
                    "line-height": Math.round(window["slider_title_" + i][1] * slider_title_coefficient) + 'px'
                });
                $item.find('.q_slide_title').css({
                    "letter-spacing": Math.round(window["slider_title_" + i][2] * slider_title_coefficient_letter_spacing) + 'px'
                });
                $item.find('.q_slide_title').css({
                    "margin-bottom": Math.round(window["slider_title_" + i][3] * slider_title_coefficient) + 'px'
                });
                $item.find('.q_slide_subtitle').css({
                    "font-size": Math.round(window["slider_subtitle_" + i][0] * slider_subtitle_coefficient) + 'px'
                });
                $item.find('.q_slide_subtitle').css({
                    "line-height": Math.round(window["slider_subtitle_" + i][1] * slider_subtitle_coefficient) + 'px'
                });
                $item.find('.q_slide_subtitle').css({
                    "letter-spacing": Math.round(window["slider_subtitle_" + i][2] * slider_subtitle_coefficient_letter_spacing) + 'px'
                });
                $item.find('.q_slide_subtitle').css({
                    "margin-bottom": Math.round(window["slider_subtitle_" + i][3] * slider_subtitle_coefficient) + 'px'
                });
                $item.find('.q_slide_text').css({
                    "font-size": Math.round(window["slider_text_" + i][0] * slider_text_coefficient) + 'px'
                });
                $item.find('.q_slide_text').css({
                    "line-height": Math.round(window["slider_text_" + i][1] * slider_text_coefficient) + 'px'
                });
                $item.find('.q_slide_text').css({
                    "letter-spacing": Math.round(window["slider_text_" + i][2] * slider_text_coefficient_letter_spacing) + 'px'
                });
                $item.find('.qbutton:eq(0)').css({
                    "font-size": Math.round(window["slider_button1_" + i][0] * slider_button_coefficient) + 'px'
                });
                $item.find('.qbutton:eq(1)').css({
                    "font-size": Math.round(window["slider_button2_" + i][0] * slider_button_coefficient) + 'px'
                });
                $item.find('.qbutton:eq(0)').css({
                    "line-height": Math.round(window["slider_button1_" + i][1] * slider_button_coefficient) + 'px'
                });
                $item.find('.qbutton:eq(1)').css({
                    "line-height": Math.round(window["slider_button2_" + i][1] * slider_button_coefficient) + 'px'
                });
                $item.find('.qbutton:eq(0)').css({
                    "letter-spacing": Math.round(window["slider_button1_" + i][2] * slider_button_coefficient) + 'px'
                });
                $item.find('.qbutton:eq(1)').css({
                    "letter-spacing": Math.round(window["slider_button2_" + i][2] * slider_button_coefficient) + 'px'
                });
                $item.find('.qbutton:eq(0)').css({
                    "height": Math.round(window["slider_button1_" + i][3] * slider_button_coefficient) + 'px'
                });
                $item.find('.qbutton:eq(1)').css({
                    "height": Math.round(window["slider_button2_" + i][3] * slider_button_coefficient) + 'px'
                });
                if (window["slider_button1_" + i][4] != 0) {
                    $item.find('.qbutton:eq(0)').css({
                        "width": Math.round(window["slider_button1_" + i][4] * slider_button_coefficient) + 'px'
                    });
                } else {
                    $item.find('.qbutton:eq(0)').css({
                        "width": 'auto'
                    });
                }
                if (window["slider_button2_" + i][4] != 0) {
                    $item.find('.qbutton:eq(1)').css({
                        "width": Math.round(window["slider_button2_" + i][4] * slider_button_coefficient) + 'px'
                    });
                } else {
                    $item.find('.qbutton:eq(1)').css({
                        "width": 'auto'
                    });
                }
                $item.find('.qbutton:eq(0)').css({
                    "padding-left": Math.round(window["slider_button1_" + i][5] * slider_button_coefficient) + 'px'
                });
                $item.find('.qbutton:eq(1)').css({
                    "padding-left": Math.round(window["slider_button2_" + i][5] * slider_button_coefficient) + 'px'
                });
                $item.find('.qbutton:eq(0)').css({
                    "padding-right": Math.round(window["slider_button1_" + i][6] * slider_button_coefficient) + 'px'
                });
                $item.find('.qbutton:eq(1)').css({
                    "padding-right": Math.round(window["slider_button2_" + i][6] * slider_button_coefficient) + 'px'
                });
                $item.find('.separator').css({
                    "margin-top": Math.round(window["slider_separator_" + i][0] * slider_title_coefficient) + 'px'
                });
                $item.find('.separator').css({
                    "margin-bottom": Math.round(window["slider_separator_" + i][1] * slider_title_coefficient) + 'px'
                });
            }

            function resetSliderElementsSize($item, i) {
                $item.find('.thumb').css({
                    "width": Math.round(window["slider_graphic_width_" + i][0]) + 'px'
                }).css({
                    "height": Math.round(window["slider_graphic_height_" + i][0]) + 'px'
                });
                $item.find('.qode_slide-svg-holder svg').css({
                    "width": Math.round(window["slider_svg_width_" + i][0]) + 'px'
                }).css({
                    "height": Math.round(window["slider_svg_height_" + i][0]) + 'px'
                });
                $item.find('.q_slide_title').css({
                    "font-size": Math.round(window["slider_title_" + i][0]) + 'px'
                });
                $item.find('.q_slide_title').css({
                    "line-height": Math.round(window["slider_title_" + i][1]) + 'px'
                });
                $item.find('.q_slide_title').css({
                    "letter-spacing": Math.round(window["slider_title_" + i][2]) + 'px'
                });
                $item.find('.q_slide_title').css({
                    "margin-bottom": Math.round(window["slider_title_" + i][3]) + 'px'
                });
                $item.find('.q_slide_subtitle').css({
                    "font-size": Math.round(window["slider_subtitle_" + i][0]) + 'px'
                });
                $item.find('.q_slide_subtitle').css({
                    "line-height": Math.round(window["slider_subtitle_" + i][1]) + 'px'
                });
                $item.find('.q_slide_subtitle').css({
                    "letter-spacing": Math.round(window["slider_subtitle_" + i][2]) + 'px'
                });
                $item.find('.q_slide_subtitle').css({
                    "margin-bottom": Math.round(window["slider_subtitle_" + i][3]) + 'px'
                });
                $item.find('.q_slide_text').css({
                    "font-size": Math.round(window["slider_text_" + i][0]) + 'px'
                });
                $item.find('.q_slide_text').css({
                    "line-height": Math.round(window["slider_text_" + i][1]) + 'px'
                });
                $item.find('.q_slide_text').css({
                    "letter-spacing": Math.round(window["slider_text_" + i][2]) + 'px'
                });
                $item.find('.qbutton:eq(0)').css({
                    "font-size": Math.round(window["slider_button1_" + i][0]) + 'px'
                });
                $item.find('.qbutton:eq(1)').css({
                    "font-size": Math.round(window["slider_button2_" + i][0]) + 'px'
                });
                $item.find('.qbutton:eq(0)').css({
                    "line-height": Math.round(window["slider_button1_" + i][1]) + 'px'
                });
                $item.find('.qbutton:eq(1)').css({
                    "line-height": Math.round(window["slider_button2_" + i][1]) + 'px'
                });
                $item.find('.qbutton:eq(0)').css({
                    "letter-spacing": Math.round(window["slider_button1_" + i][2]) + 'px'
                });
                $item.find('.qbutton:eq(1)').css({
                    "letter-spacing": Math.round(window["slider_button2_" + i][2]) + 'px'
                });
                $item.find('.qbutton:eq(0)').css({
                    "height": Math.round(window["slider_button1_" + i][3]) + 'px'
                });
                $item.find('.qbutton:eq(1)').css({
                    "height": Math.round(window["slider_button2_" + i][3]) + 'px'
                });
                if (window["slider_button1_" + i][4] != 0) {
                    $item.find('.qbutton:eq(0)').css({
                        "width": Math.round(window["slider_button1_" + i][4]) + 'px'
                    });
                } else {
                    $item.find('.qbutton:eq(0)').css({
                        "width": 'auto'
                    });
                }
                if (window["slider_button2_" + i][4] != 0) {
                    $item.find('.qbutton:eq(1)').css({
                        "width": Math.round(window["slider_button2_" + i][4]) + 'px'
                    });
                } else {
                    $item.find('.qbutton:eq(1)').css({
                        "width": 'auto'
                    });
                }
                $item.find('.qbutton:eq(0)').css({
                    "padding-left": Math.round(window["slider_button1_" + i][5]) + 'px'
                });
                $item.find('.qbutton:eq(1)').css({
                    "padding-left": Math.round(window["slider_button2_" + i][5]) + 'px'
                });
                $item.find('.qbutton:eq(0)').css({
                    "padding-right": Math.round(window["slider_button1_" + i][6]) + 'px'
                });
                $item.find('.qbutton:eq(1)').css({
                    "padding-right": Math.round(window["slider_button2_" + i][6]) + 'px'
                });
                $item.find('.separator').css({
                    "margin-top": Math.round(window["slider_separator_" + i][0]) + 'px'
                });
                $item.find('.separator').css({
                    "margin-bottom": Math.round(window["slider_separator_" + i][1]) + 'px'
                });
            }
            if ($this.hasClass('full_screen')) {
                $this.css({
                    'height': ($j(window).height() - mobile_header - paspartu_amount_with_top - paspartu_amount_with_bottom) + 'px'
                });
                $this.find('.qode_slider_preloader').css({
                    'height': ($j(window).height() - mobile_header - paspartu_amount_with_top - paspartu_amount_with_bottom) + 'px'
                });
                $this.find('.qode_slider_preloader .ajax_loader').css({
                    'display': 'block'
                });
                $this.find('.item').css({
                    'height': ($j(window).height() - mobile_header - paspartu_amount_with_top - paspartu_amount_with_bottom) + 'px'
                });
                if ($j('.paspartu_outer:not(.disable_top_paspartu)').length) {
                    if (!$j('body').hasClass('paspartu_on_top_fixed')) {
                        $this.closest('.q_slider').css('padding-top', Math.round(header_height_add_for_paspartu + $window_width * paspartu_width));
                    }
                }
                if ($j('.paspartu_outer.paspartu_on_bottom_slider').length) {
                    $this.closest('.q_slider').css('padding-bottom', Math.round($window_width * paspartu_width));
                }
                $j(window).resize(function() {
                    mobile_header = $j(window).width() < 1000 ? $j('header.page_header').height() : 0;
                    header_height_add_for_paspartu = $window_width > 1000 && !$j('header.page_header').hasClass('transparent') && $j('body.paspartu_on_top_fixed').length == 0 ? $j('header.page_header').height() : 0;
                    paspartu_amount_with_top = $j('.paspartu_outer:not(.disable_top_paspartu)').length > 0 ? Math.round($window_width * paspartu_width + header_height_add_for_paspartu) : 0;
                    paspartu_amount_with_bottom = $j('.paspartu_outer.paspartu_on_bottom_slider').length > 0 ? Math.round($window_width * paspartu_width) : 0;
                    $this.css({
                        'height': ($j(window).height() - mobile_header - paspartu_amount_with_top - paspartu_amount_with_bottom) + 'px'
                    });
                    $this.find('.qode_slider_preloader .ajax_loader').css({
                        'display': 'block'
                    });
                    $this.find('.item').css({
                        'height': ($j(window).height() - mobile_header - paspartu_amount_with_top - paspartu_amount_with_bottom) + 'px'
                    });
                    if ($j('.paspartu_outer:not(.disable_top_paspartu)').length) {
                        if (!$j('body').hasClass('paspartu_on_top_fixed')) {
                            $this.closest('.q_slider').css('padding-top', Math.round(header_height_add_for_paspartu + $window_width * paspartu_width));
                        }
                    }
                    if ($j('.paspartu_outer.paspartu_on_bottom_slider').length) {
                        $this.closest('.q_slider').css('padding-bottom', Math.round($window_width * paspartu_width));
                    }
                    if ($this.hasClass('advanced_responsiveness')) {
                        $this.find('.item').each(function(i) {
                            setSliderElementsSize($j(this), i);
                        });
                    }
                });
            } else if ($this.hasClass('responsive_height')) {
                var $def_height = $this.data('height');
                $this.find('.qode_slider_preloader').css({
                    'height': ($this.height() - mobile_header - paspartu_amount_with_top - paspartu_amount_with_bottom) + 'px',
                    'display': 'block'
                });
                if ($j('.paspartu_outer:not(.disable_top_paspartu)').length) {
                    if (!$j('body').hasClass('paspartu_on_top_fixed')) {
                        $this.closest('.q_slider').css('padding-top', Math.round(header_height_add_for_paspartu + $window_width * paspartu_width));
                    }
                }
                if ($j('.paspartu_outer.paspartu_on_bottom_slider').length) {
                    $this.closest('.q_slider').css('padding-bottom', Math.round($window_width * paspartu_width));
                }
                setSliderHeight($this, $def_height);
                $j(window).resize(function() {
                    if ($j('.paspartu_outer:not(.disable_top_paspartu)').length) {
                        header_height_add_for_paspartu = $window_width > 1000 && !$j('header.page_header').hasClass('transparent') ? $j('header.page_header').height() : 0;
                        if (!$j('body').hasClass('paspartu_on_top_fixed')) {
                            $this.closest('.q_slider').css('padding-top', Math.round(header_height_add_for_paspartu + $window_width * paspartu_width));
                        }
                    }
                    if ($j('.paspartu_outer.paspartu_on_bottom_slider').length) {
                        $this.closest('.q_slider').css('padding-bottom', Math.round($window_width * paspartu_width));
                    }
                    setSliderHeight($this, $def_height);
                    if ($this.hasClass('advanced_responsiveness')) {
                        $this.find('.item').each(function(i) {
                            setSliderElementsSize($j(this), i);
                        });
                    }
                });
            } else {
                $this.find('.qode_slider_preloader').css({
                    'height': ($this.height() - mobile_header) + 'px',
                    'display': 'block'
                });
                $this.find('.qode_slider_preloader .ajax_loader').css({
                    'display': 'block'
                });
                if ($j('.paspartu_outer:not(.disable_top_paspartu)').length) {
                    if (!$j('body').hasClass('paspartu_on_top_fixed')) {
                        $this.closest('.q_slider').css('padding-top', Math.round(header_height_add_for_paspartu + $window_width * paspartu_width));
                    }
                }
                if ($j('.paspartu_outer.paspartu_on_bottom_slider').length) {
                    $this.closest('.q_slider').css('padding-bottom', Math.round($window_width * paspartu_width));
                }
                if ($this.hasClass('advanced_responsiveness')) {
                    $this.find('.item').each(function(i) {
                        setSliderInitialElementsSize($j(this), i);
                        setSliderElementsSize($j(this), i);
                    });
                }
                $window_width < 1000 ? setSliderHeight($this, $def_height) : resetSliderHeight($def_height);
                $j(window).resize(function() {
                    if ($j('.paspartu_outer:not(.disable_top_paspartu)').length) {
                        header_height_add_for_paspartu = $window_width > 1000 && !$j('header.page_header').hasClass('transparent') ? $j('header.page_header').height() : 0;
                        if (!$j('body').hasClass('paspartu_on_top_fixed')) {
                            $this.closest('.q_slider').css('padding-top', Math.round(header_height_add_for_paspartu + $window_width * paspartu_width));
                        }
                    }
                    if ($j('.paspartu_outer.paspartu_on_bottom_slider').length) {
                        $this.closest('.q_slider').css('padding-bottom', Math.round($window_width * paspartu_width));
                    }
                    if ($window_width < 1000) {
                        setSliderHeight($this, $def_height);
                        if ($this.hasClass('advanced_responsiveness')) {
                            $this.find('.item').each(function(i) {
                                setSliderElementsSize($j(this), i);
                            });
                        }
                    } else {
                        resetSliderHeight($def_height);
                        if ($this.hasClass('advanced_responsiveness')) {
                            $this.find('.item').each(function(i) {
                                resetSliderElementsSize($j(this), i);
                            });
                        }
                    }
                });
            }
            if ($j('body:not(.boxed):not(.vertical_menu_transparency):not(.vertical_menu_hidden):not(.page-template-landing_page-php)').hasClass('vertical_menu_enabled') && $j(window).width() > 1000) {
                var paspartu_add = $j('body').hasClass('paspartu_enabled') ? 2 * Math.round($window_width * paspartu_width) : 0;
                $this.find('.carousel-inner').width($window_width - 260 - paspartu_add);
                $j(window).resize(function() {
                    if ($j(window).width() > 1000) {
                        paspartu_add = $j('body').hasClass('paspartu_enabled') ? 2 * Math.round($window_width * paspartu_width) : 0;
                        $this.find('.carousel-inner').width($window_width - 260 - paspartu_add);
                    } else {
                        $this.find('.carousel-inner').css('width', '100%');
                    }
                });
            }
            if ($j('body:not(.boxed):not(.vertical_menu_transparency):not(.page-template-landing_page-php)').hasClass('vertical_menu_hidden') && $window_width > 1000) {
                var paspartu_add = $j('body').hasClass('paspartu_enabled') ? 2 * Math.round($window_width * paspartu_width) : 0;
                $this.find('.carousel-inner').width($window_width - 40 - paspartu_add);
                $j(window).resize(function() {
                    if ($j(window).width() > 1000) {
                        paspartu_add = $j('body').hasClass('paspartu_enabled') ? 2 * Math.round($window_width * paspartu_width) : 0;
                        $this.find('.carousel-inner').width($window_width - 40 - paspartu_add);
                    } else {
                        $this.find('.carousel-inner').css('width', '100%');
                    }
                });
            }
            $j(window).scroll(function() {
                if ($scroll > ($this.height() + $j('header.page_header').height()) && $j(window).width() > 1000) {
                    $this.find('.carousel-inner, .carousel-indicators, button').hide();
                } else {
                    $this.find('.carousel-inner, .carousel-indicators, button').show();
                }
            });
            var $slide_animation = $this.data('slide_animation');
            if ($slide_animation === "") {
                $slide_animation = 6000;
            }
            var all_items_count = $j('div.item').length;

            function setPrevNextNumbers(curr_item, all_items_count) {
                if (curr_item == 1) {
                    $this.find('.left.carousel-control .prev').html(all_items_count);
                    $this.find('.right.carousel-control .next').html(curr_item + 1);
                } else if (curr_item == all_items_count) {
                    $this.find('.left.carousel-control .prev').html(curr_item - 1);
                    $this.find('.right.carousel-control .next').html(1);
                } else {
                    $this.find('.left.carousel-control .prev').html(curr_item - 1);
                    $this.find('.right.carousel-control .next').html(curr_item + 1);
                }
            }

            function initSlider() {
                $this.find('.carousel-inner .item:first-child').addClass('active');
                checkSliderForHeaderStyle($j('.carousel .active'), $this.hasClass('header_effect'));
                if ($this.hasClass('slider_thumbs')) {
                    setPrevNextNumbers(1, all_items_count);
                    if ($this.find('.active').next('div').find('.image').length) {
                        src = image_regex.exec($this.find('.active').next('div').find('.image').attr('style'));
                        next_image = new Image();
                        next_image.src = src[1];
                    } else {
                        next_image = $this.find('.active').next('div').find('> .video').clone();
                        next_image.find('.video-overlay').remove();
                        next_image.find('.video-wrap').width(170).height(95);
                        next_image.find('.mejs-container').width(170).height(95);
                        next_image.find('video').width(170).height(95);
                    }
                    $this.find('.right.carousel-control .img').html(next_image).find('img, div.video').addClass('old');
                    if ($this.find('.carousel-inner .item:last-child .image').length) {
                        src = image_regex.exec($this.find('.carousel-inner .item:last-child .image').attr('style'));
                        prev_image = new Image();
                        prev_image.src = src[1];
                    } else {
                        prev_image = $this.find('.carousel-inner .item:last-child > .video').clone();
                        prev_image.find('.video-overlay').remove();
                        prev_image.find('.video-wrap').width(170).height(95);
                        prev_image.find('.mejs-container').width(170).height(95);
                        prev_image.find('video').width(170).height(95);
                    }
                    $this.find('.left.carousel-control .img').html(prev_image).find('img, div.video').addClass('old');
                }
                if ($this.hasClass('q_auto_start')) {
                    $this.carousel({
                        interval: $slide_animation,
                        pause: false
                    });
                } else {
                    $this.carousel({
                        interval: 0,
                        pause: false
                    });
                }
                if ($this.find('.item video').length) {
                    initVideoBackgroundSize();
                }
                if ($this.hasClass('advanced_responsiveness') && ($this.hasClass('responsive_height') || $this.hasClass('full_screen'))) {
                    $this.find('.item').each(function(i) {
                        setSliderInitialElementsSize($j(this), i);
                        setSliderElementsSize($j(this), i);
                    });
                }
                if ($j('.carousel-inner .item:first-child').hasClass('animate_image') && $window_width > 1000) {
                    $this.find('.carousel-inner .item.animate_image:first-child .image').transformAnimate({
                        transform: "matrix(" + matrixArray[$j('.carousel-inner .item:first-child').data('animate_image')] + ")",
                        duration: 30000
                    });
                }
            }
            if ($j('html').hasClass('touch')) {
                if ($this.find('.item:first-child .mobile-video-image').length > 0) {
                    src = image_regex.exec($this.find('.item:first-child .mobile-video-image').attr('style'));
                    if (src) {
                        var backImg = new Image();
                        backImg.src = src[1];
                        $j(backImg).load(function() {
                            $j('.qode_slider_preloader').fadeOut(500);
                            initSlider();
                            checkSVG($this);
                        });
                    }
                } else {
                    src = image_regex.exec($this.find('.item:first-child .image').attr('style'));
                    if (src) {
                        var backImg = new Image();
                        backImg.src = src[1];
                        $j(backImg).load(function() {
                            $j('.qode_slider_preloader').fadeOut(500);
                            initSlider();
                            checkSVG($this);
                        });
                    }
                }
            } else {
                if ($this.find('.item:first-child video').length > 0) {
                    $this.find('.item:first-child video').get(0).addEventListener('loadeddata', function() {
                        $j('.qode_slider_preloader').fadeOut(500);
                        initSlider();
                        checkSVG($this);
                    });
                } else {
                    src = image_regex.exec($this.find('.item:first-child .image').attr('style'));
                    if (src) {
                        var backImg = new Image();
                        backImg.src = src[1];
                        $j(backImg).load(function() {
                            $j('.qode_slider_preloader').fadeOut(500);
                            initSlider();
                            checkSVG($this);
                        });
                    }
                }
            }
            $this.on('slide.bs.carousel', function() {
                $this.addClass('in_progress');
                $this.find('.active .slider_content_outer').fadeTo(800, 0);
            });
            $this.on('slid.bs.carousel', function() {
                $this.removeClass('in_progress');
                $this.find('.active .slider_content_outer').fadeTo(0, 1);
                checkSVG($this);
                $j('div.item.animate_image .image').stop().css({
                    'transform': '',
                    '-webkit-transform': ''
                });
                if ($j('div.item.active').hasClass('animate_image') && $window_width > 1000) {
                    $j('div.item.animate_image.active .image').transformAnimate({
                        transform: "matrix(" + matrixArray[$j('div.item.animate_image.active').data('animate_image')] + ")",
                        duration: 30000
                    });
                }
                if ($this.hasClass('slider_thumbs')) {
                    var curr_item = $j('div.item').index($j('div.item.active')[0]) + 1;
                    setPrevNextNumbers(curr_item, all_items_count);
                    if ($this.find('.active').prev('div.item').length) {
                        if ($this.find('.active').prev('div').find('.image').length) {
                            src = image_regex.exec($this.find('.active').prev('div').find('.image').attr('style'));
                            prev_image = new Image();
                            prev_image.src = src[1];
                        } else {
                            prev_image = $this.find('.active').prev('div').find('> .video').clone();
                            prev_image.find('.video-overlay').remove();
                            prev_image.find('.video-wrap').width(170).height(95);
                            prev_image.find('.mejs-container').width(170).height(95);
                            prev_image.find('video').width(170).height(95);
                        }
                        $this.find('.left.carousel-control .img .old').fadeOut(300, function() {
                            $j(this).remove();
                        });
                        $this.find('.left.carousel-control .img').append(prev_image).find('img, div.video').fadeIn(300).addClass('old');
                    } else {
                        if ($this.find('.carousel-inner .item:last-child .image').length) {
                            src = image_regex.exec($this.find('.carousel-inner .item:last-child .image').attr('style'));
                            prev_image = new Image();
                            prev_image.src = src[1];
                        } else {
                            prev_image = $this.find('.carousel-inner .item:last-child > .video').clone();
                            prev_image.find('.video-overlay').remove();
                            prev_image.find('.video-wrap').width(170).height(95);
                            prev_image.find('.mejs-container').width(170).height(95);
                            prev_image.find('video').width(170).height(95);
                        }
                        $this.find('.left.carousel-control .img .old').fadeOut(300, function() {
                            $j(this).remove();
                        });
                        $this.find('.left.carousel-control .img').append(prev_image).find('img, div.video').fadeIn(300).addClass('old');
                    }
                    if ($this.find('.active').next('div.item').length) {
                        if ($this.find('.active').next('div').find('.image').length) {
                            src = image_regex.exec($this.find('.active').next('div').find('.image').attr('style'));
                            next_image = new Image();
                            next_image.src = src[1];
                        } else {
                            next_image = $this.find('.active').next('div').find('> .video').clone();
                            next_image.find('.video-overlay').remove();
                            next_image.find('.video-wrap').width(170).height(95);
                            next_image.find('.mejs-container').width(170).height(95);
                            next_image.find('video').width(170).height(95);
                        }
                        $this.find('.right.carousel-control .img .old').fadeOut(300, function() {
                            $j(this).remove();
                        });
                        $this.find('.right.carousel-control .img').append(next_image).find('img, div.video').fadeIn(300).addClass('old');
                    } else {
                        if ($this.find('.carousel-inner .item:first-child .image').length) {
                            src = image_regex.exec($this.find('.carousel-inner .item:first-child .image').attr('style'));
                            next_image = new Image();
                            next_image.src = src[1];
                        } else {
                            next_image = $this.find('.carousel-inner .item:first-child > .video').clone();
                            next_image.find('.video-overlay').remove();
                            next_image.find('.video-wrap').width(170).height(95);
                            next_image.find('.mejs-container').width(170).height(95);
                            next_image.find('video').width(170).height(95);
                        }
                        $this.find('.right.carousel-control .img .old').fadeOut(300, function() {
                            $j(this).remove();
                        });
                        $this.find('.right.carousel-control .img').append(next_image).find('img, div.video').fadeIn(300).addClass('old');
                    }
                }
            });
            $this.swipe({
                swipeLeft: function(event, direction, distance, duration, fingerCount) {
                    $this.carousel('next');
                },
                swipeRight: function(event, direction, distance, duration, fingerCount) {
                    $this.carousel('prev');
                },
                threshold: 20
            });
        });
        if ($j('.no-touch .carousel').length) {
            skrollr_slider = skrollr.init({
                edgeStrategy: 'set',
                smoothScrolling: true,
                forceHeight: false
            });
            skrollr_slider.refresh();
        }
    }
}

function checkSliderForHeaderStyle($this, header_effect) {
    "use strict";
    var slide_header_style = "";
    var navigation_color = $this.data('navigation-color');
    if ($this.hasClass('light')) {
        slide_header_style = 'light';
    }
    if ($this.hasClass('dark')) {
        slide_header_style = 'dark';
    }
    if (slide_header_style !== "") {
        if (header_effect) {
            $j('header.page_header').removeClass('dark light').addClass(slide_header_style);
            $j('aside.vertical_menu_area').removeClass('dark light').addClass(slide_header_style);
        }
        $j('.carousel .carousel-control, .carousel .carousel-indicators').removeClass('dark light').addClass(slide_header_style);
    } else {
        if (header_effect) {
            $j('header.page_header').removeClass('dark light').addClass(default_header_style);
            $j('aside.vertical_menu_area').removeClass('dark light').addClass(default_header_style);
        }
        $j('.carousel .carousel-control, .carousel .carousel-indicators').removeClass('dark light').addClass(default_header_style);
    }
    if (navigation_color !== undefined) {
        $j('.carousel-control .thumb_holder .thumb_top, .carousel-indicators li').css('background-color', navigation_color);
        $j('.carousel-control .prev_nav, .carousel-control .next_nav').css('border-color', navigation_color);
        $j('.carousel-control .prev_nav i, .carousel-control .next_nav i').css('color', navigation_color);
    } else {
        $j('.carousel-control .thumb_holder .thumb_top, .carousel-indicators li').css('background-color', '');
        $j('.carousel-control .prev_nav, .carousel-control .next_nav').css('border-color', '');
        $j('.carousel-control .prev_nav i, .carousel-control .next_nav i').css('color', '');
    }
}

function calculateHeights() {
    if ($j('.portfolio_slides').length) {
        $j('.portfolio_slides').each(function() {
            $j(this).parents('.caroufredsel_wrapper').css({
                'height': ($j(this).find('li.item').outerHeight() - 3) + 'px'
            });
        });
    }
    if ($j('.qode_carousels .slides').length) {
        $j('.qode_carousels .slides').each(function() {
            $j(this).parents('.caroufredsel_wrapper').css({
                'height': ($j(this).find('li.item').outerHeight()) + 'px'
            });
        });
    }
    if ($j('.blog_slides').length) {
        $j('.blog_slides').each(function() {
            $j(this).parents('.caroufredsel_wrapper').css({
                'height': ($j(this).find('li.item').outerHeight() - 3) + 'px'
            });
        });
    }
}

function initQodeCarousel() {
    "use strict";
    if ($j('.qode_carousels').length) {
        $j('.qode_carousels').each(function() {
            var thisItem = $j(this);
            var numberOfVisibleItems = 6;
            if (typeof thisItem.data('number-of-visible-items') !== 'undefined' && thisItem.data('number-of-visible-items') !== '') {
                if (thisItem.data('number-of-visible-items') === 4) {
                    numberOfVisibleItems = 4;
                } else if (thisItem.data('number-of-visible-items') === 5) {
                    numberOfVisibleItems = 5;
                }
            }
            var itemWidth = (thisItem.parents('.grid_section').length == 1) ? 170 : 315;
            var maxItems = 6;
            if (numberOfVisibleItems === 4) {
                itemWidth = (thisItem.parents('.grid_section').length == 1) ? 255 : 472;
                maxItems = 4;
            } else if (numberOfVisibleItems === 5) {
                itemWidth = (thisItem.parents('.grid_section').length == 1) ? 204 : 378;
                maxItems = 5;
            }
            thisItem.find('.slides').carouFredSel({
                circular: true,
                responsive: true,
                scroll: {
                    items: 1,
                    duration: 1000,
                    pauseOnHover: false
                },
                items: {
                    width: itemWidth,
                    visible: {
                        min: 1,
                        max: maxItems
                    }
                },
                auto: true,
                mousewheel: false,
                swipe: {
                    onMouse: true,
                    onTouch: true
                }
            }).animate({
                'opacity': 1
            }, 1000);
        });
        calculateHeights();
    }
}

function initPortfolioSlider() {
    "use strict";
    if ($j('.portfolio_slider').length) {
        $j('.portfolio_slider').each(function() {
            var number_of_items;
            var item_width_fw;
            if (typeof $j(this).data('number_of_items') !== 'undefined') {
                number_of_items = $j(this).data('number_of_items');
            } else {
                number_of_items = 'auto';
            }
            switch (number_of_items) {
                case 4:
                    item_width_fw = 500;
                    break;
                case 5:
                    item_width_fw = 350;
                    break;
                default:
                    item_width_fw = 500;
                    break;
            }
            var maxItems = ($j(this).parents('.grid_section').length == 1) ? 3 : number_of_items;
            var itemWidth = ($j(this).parents('.grid_section').length == 1) ? 353 : item_width_fw;
            $j(this).find('.portfolio_slides').carouFredSel({
                circular: true,
                responsive: true,
                scroll: 1,
                prev: {
                    button: function() {
                        return $j(this).parent().siblings('.caroufredsel-direction-nav').find('#caroufredsel-prev');
                    }
                },
                next: {
                    button: function() {
                        return $j(this).parent().siblings('.caroufredsel-direction-nav').find('#caroufredsel-next');
                    }
                },
                items: {
                    width: itemWidth,
                    visible: {
                        min: 1,
                        max: maxItems
                    }
                },
                auto: false,
                mousewheel: false,
                swipe: {
                    onMouse: true,
                    onTouch: true
                }
            }).animate({
                'opacity': 1
            }, 1000);
        });
        calculateHeights();
        $j('.portfolio_slider .flex-direction-nav a').click(function(e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            e.stopPropagation();
        });
    }
}

function initBlogSlider() {
    "use strict";
    if ($j('.blog_slider').length) {
        $j('.blog_slider').each(function() {
            var $this = $j(this);
            var blogs_shown;
            var maxItems;
            var itemWidth;
            var autoPlay = false;
            if (typeof $this.data('blogs_shown') !== 'undefined') {
                blogs_shown = $this.data('blogs_shown');
            } else if ($this.hasClass('simple_slider')) {
                blogs_shown = 1;
            } else {
                blogs_shown = 'auto';
            }
            autoPlay = $this.data('auto_start');
            if ($this.hasClass('simple_slider')) {
                maxItems = 1;
                itemWidth = 300;
            } else {
                maxItems = ($this.parents('.grid_section').length == 1) ? 3 : blogs_shown;
                var itemWidthTemp;
                switch (blogs_shown) {
                    case 3:
                        itemWidthTemp = 667;
                        break;
                    case 4:
                        itemWidthTemp = 500;
                        break;
                    case 5:
                        itemWidthTemp = 400;
                        break;
                    case 6:
                        itemWidthTemp = 334;
                        break;
                    default:
                        itemWidthTemp = 500;
                        break;
                }
                itemWidth = ($this.parents('.grid_section').length == 1) ? 353 : itemWidthTemp;
            }
            $this.find('.blog_slides').carouFredSel({
                circular: true,
                responsive: true,
                scroll: 1,
                prev: {
                    button: function() {
                        return $j(this).parent().siblings('.caroufredsel-direction-nav').find('#caroufredsel-prev');
                    }
                },
                next: {
                    button: function() {
                        return $j(this).parent().siblings('.caroufredsel-direction-nav').find('#caroufredsel-next');
                    }
                },
                items: {
                    width: itemWidth,
                    visible: {
                        min: 1,
                        max: maxItems
                    }
                },
                auto: autoPlay,
                mousewheel: false,
                swipe: {
                    onMouse: true,
                    onTouch: true
                }
            }).animate({
                'opacity': 1
            }, 1000);
        });
        calculateHeights();
        $j('.blog_slider .flex-direction-nav a').click(function(e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            e.stopPropagation();
        });
    }
}
var current_scroll;

function initSideMenu() {
    "use strict";
    if ($j('body').hasClass('side_area_uncovered_from_content')) {
        $j('.side_menu_button_wrapper a.side_menu_button_link,  a.close_side_menu').click(function(e) {
            e.preventDefault();
            $j('.side_menu').css({
                'right': '0'
            });
            if (!$j('.side_menu_button_wrapper a.side_menu_button_link').hasClass('opened')) {
                $j('.side_menu').css({
                    'visibility': 'visible'
                });
                $j(this).addClass('opened');
                $j('body').addClass('right_side_menu_opened');
                current_scroll = $j(window).scrollTop();
                $j(window).scroll(function() {
                    if (Math.abs($scroll - current_scroll) > 400) {
                        $j('body').removeClass('right_side_menu_opened');
                        $j('.side_menu_button_wrapper a').removeClass('opened');
                        var hide_side_menu = setTimeout(function() {
                            $j('.side_menu').css({
                                'visibility': 'hidden'
                            });
                            clearTimeout(hide_side_menu);
                        }, 400);
                    }
                });
            } else {
                $j('.side_menu_button_wrapper a.side_menu_button_link').removeClass('opened');
                $j('body').removeClass('right_side_menu_opened');
                var hide_side_menu = setTimeout(function() {
                    $j('.side_menu').css({
                        'visibility': 'hidden'
                    });
                    clearTimeout(hide_side_menu);
                }, 400);
            }
        });
    }
    if ($j('body').hasClass('side_menu_slide_with_content')) {
        $j('.side_menu_button_wrapper a.side_menu_button_link, a.close_side_menu').click(function(e) {
            e.preventDefault();
            if (!$j('.side_menu_button_wrapper a.side_menu_button_link').hasClass('opened')) {
                $j(this).addClass('opened');
                $j('body').addClass('side_menu_open');
                current_scroll = $j(window).scrollTop();
                $j(window).scroll(function() {
                    if (Math.abs($scroll - current_scroll) > 400) {
                        $j('body').removeClass('side_menu_open');
                        $j('.side_menu_button_wrapper a').removeClass('opened');
                    }
                });
            } else {
                $j('body').removeClass('side_menu_open');
                $j('.side_menu_button_wrapper a.side_menu_button_link').removeClass('opened');
                $j('body').removeClass('side_menu_open');
            }
            e.stopPropagation();
            $j('.wrapper').click(function() {
                e.preventDefault();
                $j('body').removeClass('side_menu_open');
                $j('.side_menu_button_wrapper a.side_menu_button_link').removeClass('opened');
                $j('body').removeClass('side_menu_open');
            });
        });
    }
    if ($j('body').hasClass('side_menu_slide_from_right')) {
        $j('.wrapper').prepend('<div class="cover"/>');
        $j('.side_menu_button_wrapper a.side_menu_button_link, a.close_side_menu').click(function(e) {
            e.preventDefault();
            if (!$j('.side_menu_button_wrapper a.side_menu_button_link').hasClass('opened')) {
                $j(this).addClass('opened');
                $j('body').addClass('right_side_menu_opened');
                $j(' .wrapper .cover').click(function() {
                    $j('.side_menu_button_wrapper a.side_menu_button_link').removeClass('opened');
                    $j('body').removeClass('right_side_menu_opened');
                    $j('.side_menu_button_wrapper a').removeClass('opened');
                });
                current_scroll = $j(window).scrollTop();
                $j(window).scroll(function() {
                    if (Math.abs($scroll - current_scroll) > 400) {
                        $j('body').removeClass('right_side_menu_opened');
                        $j('.side_menu_button_wrapper a').removeClass('opened');
                    }
                });
            } else {
                $j('.side_menu_button_wrapper a.side_menu_button_link').removeClass('opened');
                $j('body').removeClass('right_side_menu_opened');
            }
        });
    }
}

function setDropDownMenuPosition() {
    "use strict";
    var menu_items = $j(".drop_down > ul > li.narrow");
    menu_items.each(function(i) {
        var browser_width = $j(window).width() - 16;
        var boxed_layout;
        switch (true) {
            case qode_body.hasClass('qode_grid_1300'):
                boxed_layout = 1350;
                break;
            case qode_body.hasClass('qode_grid_1200'):
                boxed_layout = 1250;
                break;
            default:
                boxed_layout = 1150;
                break;
        }
        var menu_item_position = $j(menu_items[i]).offset().left;
        var sub_menu_width = $j(menu_items[i]).find('.second .inner ul').width();
        var menu_item_from_left = 0;
        if ($j('body').hasClass('boxed')) {
            menu_item_from_left = boxed_layout - (menu_item_position - (browser_width - boxed_layout) / 2) + 17;
        } else {
            menu_item_from_left = browser_width - menu_item_position + 17;
        }
        var sub_menu_from_left;
        if ($j(menu_items[i]).find('li.sub').length > 0) {
            sub_menu_from_left = menu_item_from_left - sub_menu_width;
        }
        if (menu_item_from_left < sub_menu_width || sub_menu_from_left < sub_menu_width) {
            $j(menu_items[i]).find('.second').addClass('right');
            $j(menu_items[i]).find('.second .inner ul').addClass('right');
        }
    });
}

function initDropDownMenu() {
    "use strict";
    var menu_items = $j('.drop_down > ul > li');
    menu_items.each(function(i) {
        if ($j(menu_items[i]).find('.second').length > 0) {
            if ($j(menu_items[i]).hasClass('wide')) {
                var dropdown = $j(this).find('.inner > ul');
                var dropdownPadding = parseInt(dropdown.css('padding-left').slice(0, -2)) + parseInt(dropdown.css('padding-right').slice(0, -2));
                if (!$j(this).hasClass('left_position') && !$j(this).hasClass('right_position')) {
                    $j(this).find('.second').css('left', 0);
                }
                var tallest = 0;
                $j(this).find('.second > .inner > ul > li').each(function() {
                    var thisHeight = $j(this).height();
                    if (thisHeight > tallest) {
                        tallest = thisHeight;
                    }
                });
                $j(this).find('.second > .inner > ul > li').height(tallest);
                var row_number;
                if ($j(this).find('.second > .inner > ul > li').length > 4) {
                    row_number = 4;
                } else {
                    row_number = $j(this).find('.second > .inner > ul > li').length;
                }
                var width = row_number * ($j(this).find('.second > .inner > ul > li').outerWidth());
                $j(this).find('.second > .inner > ul').width(width);
                if (!$j(this).hasClass('wide_background')) {
                    if (!$j(this).hasClass('left_position') && !$j(this).hasClass('right_position')) {
                        var left_position = ($j(window).width() - 2 * ($j(window).width() - $j(this).find('.second').offset().left)) / 2 + (width + dropdownPadding) / 2;
                        $j(this).find('.second').css('left', -left_position);
                    }
                } else {
                    if (!$j(this).hasClass('left_position') && !$j(this).hasClass('right_position')) {
                        var left_position = $j(this).find('.second').offset().left;
                        $j(this).find('.second').css('left', -left_position);
                        $j(this).find('.second').css('width', $j(window).width());
                    }
                }
            }
            if (!menu_dropdown_height_set) {
                $j(menu_items[i]).data('original_height', $j(menu_items[i]).find('.second').height() + 'px');
                $j(menu_items[i]).find('.second').height(0);
            }
            if (navigator.userAgent.match(/(iPod|iPhone|iPad)/)) {
                $j(menu_items[i]).on("touchstart mouseenter", function() {
                    $j(menu_items[i]).find('.second').css({
                        'height': $j(menu_items[i]).data('original_height'),
                        'overflow': 'visible',
                        'visibility': 'visible',
                        'opacity': '1'
                    });
                }).on("mouseleave", function() {
                    $j(menu_items[i]).find('.second').css({
                        'height': '0px',
                        'overflow': 'hidden',
                        'visivility': 'hidden',
                        'opacity': '0'
                    });
                });
            } else {
                var config = {
                    interval: 0,
                    over: function() {
                        setTimeout(function() {
                            $j(menu_items[i]).find('.second').addClass('drop_down_start');
                            $j(menu_items[i]).find('.second').stop().css({
                                'height': $j(menu_items[i]).data('original_height')
                            });
                        }, 150);
                    },
                    timeout: 150,
                    out: function() {
                        $j(menu_items[i]).find('.second').stop().css({
                            'height': '0px'
                        });
                        $j(menu_items[i]).find('.second').removeClass('drop_down_start');
                    }
                };
                $j(menu_items[i]).hoverIntent(config);
            }
        }
    });
    $j('.drop_down ul li.wide ul li a, .drop_down ul li.narrow ul li a').on('click', function() {
        var $this = $j(this);
        if (!$this.next('ul').length && ($this.attr('href') !== "http://#") && ($this.attr('href') !== "#") && !$this.hasClass('no_link')) {
            setTimeout(function() {
                $this.mouseleave();
            }, 500);
        }
    });
    menu_dropdown_height_set = true;
}

function initVerticalMenu() {
    "use strict";
    if ($j('.no-touch .vertical_menu_toggle').length) {
        var menu_items = $j('.no-touch .vertical_menu_toggle > ul > li');
        var menu_items_2 = $j('.no-touch .vertical_menu_toggle ul li ul li');
        menu_items.each(function(i) {
            if ($j(menu_items[i]).hasClass('has_sub')) {
                var subitems_number = $j(menu_items[i]).find('.inner > ul > li').length;
                $j(menu_items[i]).hoverIntent({
                    over: function() {
                        $j(menu_items[i]).addClass('open');
                        $j(menu_items[i]).find('.second').slideDown(subitems_number * 40, 'easeInOutSine', function() {
                            $j('.vertical_menu_area.with_scroll').getNiceScroll().resize();
                        });
                    },
                    out: function() {
                        $j(menu_items[i]).removeClass('open');
                        $j(menu_items[i]).find('.second').slideUp(subitems_number * 40, 'easeInOutSine');
                    },
                    timeout: 1000
                });
            }
        });
        menu_items_2.each(function(i) {
            if ($j(menu_items_2[i]).hasClass('menu-item-has-children')) {
                var subitems_number = $j(menu_items_2[i]).find('ul > li').length;
                $j(menu_items_2[i]).hoverIntent({
                    over: function() {
                        $j(menu_items_2[i]).addClass('open');
                        $j(menu_items_2[i]).find('ul').slideDown(subitems_number * 40, 'easeInOutSine', function() {
                            $j('.vertical_menu_area.with_scroll').getNiceScroll().resize();
                        });
                    },
                    out: function() {
                        $j(menu_items_2[i]).removeClass('open');
                        $j(menu_items_2[i]).find('ul').slideUp(subitems_number * 40, 'easeInOutSine');
                    },
                    timeout: 1000
                });
            }
        });
    } else if ($j('.vertical_menu_on_click').length) {
        var menu_items = $j('.vertical_menu_on_click > ul > li > a');
        var menu_items_2 = $j('.vertical_menu_on_click ul li ul li a');
        menu_items.each(function(i) {
            if ($j(menu_items[i]).parent().hasClass('has_sub')) {
                $j(menu_items[i]).on('tap click', function(e) {
                    e.preventDefault();
                    if (!$j(this).parent().hasClass('open')) {
                        $j('.vertical_menu_on_click > ul > li').removeClass('open');
                        $j('.vertical_menu_on_click > ul > li').find('.second').slideUp('fast');
                        $j(this).parent().addClass('open');
                        $j(this).parent().find('.second').slideDown('slow', function() {
                            $j('.vertical_menu_area.with_scroll').getNiceScroll().resize();
                        });
                    } else {
                        $j(this).parent().removeClass('open');
                        $j(this).parent().find('.second').slideUp('fast', function() {
                            $j('.vertical_menu_area.with_scroll').getNiceScroll().resize();
                        });
                    }
                    return false;
                });
            }
        });
        menu_items_2.each(function(i) {
            if ($j(menu_items_2[i]).parent().hasClass('menu-item-has-children')) {
                $j(menu_items_2[i]).on('tap click', function(e) {
                    e.preventDefault();
                    if (!$j(this).parent().hasClass('open')) {
                        $j('.vertical_menu_on_click ul li ul li').removeClass('open');
                        $j('.vertical_menu_on_click ul li ul li').find('ul').slideUp('fast');
                        $j(this).parent().addClass('open');
                        $j(this).parent().find('ul').slideDown('slow', function() {
                            $j('.vertical_menu_area.with_scroll').getNiceScroll().resize();
                        });
                    } else {
                        $j(this).parent().removeClass('open');
                        $j(this).parent().find('ul').slideUp('fast', function() {
                            $j('.vertical_menu_area.with_scroll').getNiceScroll().resize();
                        });
                    }
                    return false;
                });
            }
        });
    } else if ($j('.no-touch .vertical_menu_float').length) {
        var menu_items = $j('.no-touch .vertical_menu_float > ul > li');
        var menu_items_2 = $j('.no-touch .vertical_menu_float ul li ul li');
        menu_items.each(function(i) {
            if ($j(menu_items[i]).hasClass('has_sub')) {
                $j(menu_items[i]).hoverIntent({
                    over: function() {
                        $j(menu_items[i]).addClass('open');
                        $j(menu_items[i]).find('.second').addClass('vertical_menu_start');
                    },
                    out: function() {
                        $j(menu_items[i]).removeClass('open');
                        $j(menu_items[i]).find('.second').removeClass('vertical_menu_start');
                    },
                    timeout: 300
                });
            }
        });
        menu_items_2.each(function(i) {
            if ($j(menu_items_2[i]).hasClass('menu-item-has-children')) {
                var subitems_number = $j(menu_items_2[i]).find('ul > li').length;
                $j(menu_items_2[i]).hoverIntent({
                    over: function() {
                        $j(menu_items_2[i]).addClass('open');
                        $j(menu_items_2[i]).find('ul').addClass('vertical_submenu_start');
                    },
                    out: function() {
                        $j(menu_items_2[i]).removeClass('open');
                        $j(menu_items_2[i]).find('ul').removeClass('vertical_submenu_start');
                    },
                    timeout: 300
                });
            }
        });
    }
}

function initVerticalMobileMenu() {
    "use strict";
    if ($j('.vertical_menu_toggle').length) {
        $j('.touch .vertical_menu_toggle > ul > li.has_sub > a .plus').on('tap click', function(e) {
            e.stopPropagation();
            e.preventDefault();
            if ($j(this).parent().next('div.second').is(":visible")) {
                $j(this).parents('.touch .vertical_menu_toggle > ul > li.has_sub').removeClass('open');
                $j(this).parent().next('div.second').slideUp(200);
            } else {
                $j(this).parents('.touch .vertical_menu_toggle > ul > li.has_sub').addClass('open');
                $j(this).parent().next('div.second').slideDown(200);
            }
        });
        $j('.touch .vertical_menu_toggle ul li ul li > a .plus').on('tap click', function(e) {
            e.stopPropagation();
            e.preventDefault();
            if ($j(this).parent().next('ul').is(":visible")) {
                $j(this).parents('.touch .vertical_menu_toggle ul li ul li').removeClass('open');
                $j(this).parent().next('ul').slideUp(200);
            } else {
                $j(this).parents('.touch .vertical_menu_toggle ul li ul li').addClass('open');
                $j(this).parent().next('ul').slideDown(200);
            }
        });
    } else if ($j('.vertical_menu_float').length) {
        $j('.touch .vertical_menu_float > ul > li.has_sub > a .plus').on('tap click', function(e) {
            e.stopPropagation();
            e.preventDefault();
            if ($j(this).parent().next('div.second').hasClass('vertical_menu_start')) {
                $j(this).parents('.touch .vertical_menu_float > ul > li.has_sub').removeClass('open');
                $j(this).parents('.touch .vertical_menu_float > ul > li.has_sub').find('.second').removeClass('vertical_menu_start');
            } else {
                $j(this).parents('.touch .vertical_menu_float > ul > li.has_sub').addClass('open');
                $j(this).parents('.touch .vertical_menu_float > ul > li.has_sub').find('.second').addClass('vertical_menu_start');
            }
        });
        $j('.touch .vertical_menu_float ul li ul li > a .plus').on('tap click', function(e) {
            e.stopPropagation();
            e.preventDefault();
            if ($j(this).parent().next('ul').hasClass('vertical_submenu_start')) {
                $j(this).parents('.touch .vertical_menu_float ul li ul li').removeClass('open');
                $j(this).parents('.touch .vertical_menu_float ul li ul li').find('ul').removeClass('vertical_submenu_start');
            } else {
                $j(this).parents('.touch .vertical_menu_float ul li ul li').addClass('open');
                $j(this).parents('.touch .vertical_menu_float ul li ul li').find('ul').addClass('vertical_submenu_start');
            }
        });
    }
}

function checkVerticalMenuTransparency() {
    if ($scroll !== 0) {
        $j('body.vertical_menu_transparency').removeClass('vertical_menu_transparency_on');
    } else {
        $j('body.vertical_menu_transparency').addClass('vertical_menu_transparency_on');
    }
}

function showHideVerticalMenu() {
    if ($j('.vertical_menu_hidden').length) {
        var vertical_menu = $j('aside.vertical_menu_area');
        var vertical_menu_bottom_logo = $j('.vertical_menu_area_bottom_logo');
        var hovered_flag = true;
        $j('.vertical_menu_hidden_button').on('click', function(e) {
            e.preventDefault();
            if (hovered_flag) {
                hovered_flag = false;
                current_scroll = $j(window).scrollTop();
                vertical_menu.addClass('active');
                vertical_menu_bottom_logo.addClass('active');
            } else {
                hovered_flag = true;
                vertical_menu.removeClass('active');
                vertical_menu_bottom_logo.removeClass('active');
            }
        });
        $j(window).scroll(function() {
            if (Math.abs($scroll - current_scroll) > 400) {
                hovered_flag = true;
                vertical_menu.removeClass('active');
                vertical_menu_bottom_logo.removeClass('active');
            }
        });
        (function() {
            var Outclick, outclick, _this = this;
            Outclick = (function() {
                Outclick.name = 'Outclick';

                function Outclick() {
                    this.objects = [];
                }
                Outclick.prototype.check = function(element, event) {
                    return !element.is(event.target) && element.has(event.target).length === 0;
                };
                Outclick.prototype.trigger = function(e) {
                    var execute, _this = this;
                    execute = false;
                    return $j.each(this.objects, function(index, el) {
                        if (_this.check(el.container, e)) {
                            if (el.related.length < 1) {
                                execute = true;
                            } else {
                                $j.each(el.related, function(index, relation) {
                                    if (_this.check(relation, e)) {
                                        return execute = true;
                                    } else {
                                        execute = false;
                                        return false;
                                    }
                                });
                            }
                            if (execute) {
                                return el.callback.call(el.container);
                            }
                        }
                    });
                };
                return Outclick;
            })();
            outclick = new Outclick;
            $j.fn.outclick = function(options) {
                var _this = this;
                if (options == null) {
                    options = {};
                }
                options.related || (options.related = []);
                options.callback || (options.callback = function() {
                    return _this.hide();
                });
                return outclick.objects.push({
                    container: this,
                    related: options.related,
                    callback: options.callback
                });
            };
            $j(document).mouseup(function(e) {
                return outclick.trigger(e);
            });
        }).call(this);
        $j(vertical_menu).outclick({
            callback: function() {
                hovered_flag = true;
                vertical_menu.removeClass('active');
                vertical_menu_bottom_logo.removeClass('active');
            }
        });
    }
}
(function($) {
    "use strict";
    $.fn.countTo = function(options) {
        options = $.extend({}, $.fn.countTo.defaults, options || {});
        var loops = Math.ceil(options.speed / options.refreshInterval),
            increment = (options.to - options.from) / loops;
        return $(this).each(function() {
            var _this = this,
                loopCount = 0,
                value = options.from,
                interval = setInterval(updateTimer, options.refreshInterval);

            function updateTimer() {
                value += increment;
                loopCount++;
                $(_this).html(value.toFixed(options.decimals));
                if (typeof(options.onUpdate) === 'function') {
                    options.onUpdate.call(_this, value);
                }
                if (loopCount >= loops) {
                    clearInterval(interval);
                    value = options.to;
                    if (typeof(options.onComplete) === 'function') {
                        options.onComplete.call(_this, value);
                    }
                }
            }
        });
    };
    $.fn.countTo.defaults = {
        from: 0,
        to: 100,
        speed: 1000,
        refreshInterval: 100,
        decimals: 0,
        onUpdate: null,
        onComplete: null
    };
})(jQuery);

function initToCounter() {
    "use strict";
    if ($j('.counter.zero').length) {
        $j('.counter.zero').each(function() {
            if (!$j(this).hasClass('executed')) {
                $j(this).addClass('executed');
                if ($j(this).parents('.vertical_split_slider').length) {
                    $j(this).parent().css('opacity', '1');
                    var $max = parseFloat($j(this).text());
                    $j(this).countTo({
                        from: 0,
                        to: $max,
                        speed: 1500,
                        refreshInterval: 100
                    });
                } else {
                    $j(this).appear(function() {
                        $j(this).parent().css('opacity', '1');
                        var $max = parseFloat($j(this).text());
                        $j(this).countTo({
                            from: 0,
                            to: $max,
                            speed: 1500,
                            refreshInterval: 100
                        });
                    }, {
                        accX: 0,
                        accY: -200
                    });
                }
            }
        });
    }
}

function initCounter() {
    "use strict";
    if ($j('.counter.random').length) {
        $j('.counter.random').each(function() {
            if (!$j(this).hasClass('executed')) {
                $j(this).addClass('executed');
                if ($j(this).parents('.vertical_split_slider').length) {
                    $j(this).parent().css('opacity', '1');
                    $j(this).absoluteCounter({
                        speed: 2000,
                        fadeInDelay: 1000
                    });
                } else {
                    $j(this).appear(function() {
                        $j(this).parent().css('opacity', '1');
                        $j(this).absoluteCounter({
                            speed: 2000,
                            fadeInDelay: 1000
                        });
                    }, {
                        accX: 0,
                        accY: -200
                    });
                }
            }
        });
    }
}

function initCountdown() {
    "use strict";
    if ($j('.countdown').length) {
        $j('.countdown').each(function() {
            var countdownId = $j(this).attr('id');
            var $this = $j('#' + countdownId);
            var year = 0;
            var month = 0;
            var day = 0;
            var hour = 0;
            var minute = 0;
            var monthsLabel;
            var monthLabel;
            var daysLabel;
            var dayLabel;
            var hoursLabel;
            var hourLabel;
            var minutesLabel;
            var minuteLabel;
            var secondsLabel;
            var secondLabel;
            var tickf;
            var timezone;
            var digitfs;
            var labelfs;
            var color;
            if (typeof $this.data('year') !== 'undefined' && $this.data('year') !== false) {
                year = $this.data('year');
            }
            if (typeof $this.data('month') !== 'undefined' && $this.data('month') !== false) {
                month = $this.data('month');
            }
            if (typeof $this.data('day') !== 'undefined' && $this.data('day') !== false) {
                day = $this.data('day');
            }
            if (typeof $this.data('hour') !== 'undefined' && $this.data('hour') !== false) {
                hour = $this.data('hour');
            }
            if (typeof $this.data('minute') !== 'undefined' && $this.data('minute') !== false) {
                minute = $this.data('minute');
            }
            if (typeof $this.data('monthslabel') !== 'undefined' && $this.data('monthslabel') !== false) {
                monthsLabel = $this.data('monthslabel');
            }
            if (typeof $this.data('monthlabel') !== 'undefined' && $this.data('monthlabel') !== false) {
                monthLabel = $this.data('monthlabel');
            }
            if (typeof $this.data('dayslabel') !== 'undefined' && $this.data('dayslabel') !== false) {
                daysLabel = $this.data('dayslabel');
            }
            if (typeof $this.data('daylabel') !== 'undefined' && $this.data('daylabel') !== false) {
                dayLabel = $this.data('daylabel');
            }
            if (typeof $this.data('hourslabel') !== 'undefined' && $this.data('hourslabel') !== false) {
                hoursLabel = $this.data('hourslabel');
            }
            if (typeof $this.data('hourlabel') !== 'undefined' && $this.data('hourlabel') !== false) {
                hourLabel = $this.data('hourlabel');
            }
            if (typeof $this.data('minuteslabel') !== 'undefined' && $this.data('minuteslabel') !== false) {
                minutesLabel = $this.data('minuteslabel');
            }
            if (typeof $this.data('minutelabel') !== 'undefined' && $this.data('minutelabel') !== false) {
                minuteLabel = $this.data('minuteLabel');
            }
            if (typeof $this.data('secondslabel') !== 'undefined' && $this.data('secondslabel') !== false) {
                secondsLabel = $this.data('secondslabel');
            }
            if (typeof $this.data('secondlabel') !== 'undefined' && $this.data('secondlabel') !== false) {
                secondLabel = $this.data('secondlabel');
            }
            if (typeof $this.data('tickf') !== 'undefined' && $this.data('tickf') !== false) {
                tickf = $this.data('tickf');
            }
            if (typeof $this.data('timezone') !== 'undefined' && $this.data('timezone') !== false) {
                timezone = $this.data('timezone');
            }
            if (typeof $this.data('digitfs') !== 'undefined' && $this.data('digitfs') !== false) {
                digitfs = $this.data('digitfs');
            }
            if (typeof $this.data('labelfs') !== 'undefined' && $this.data('labelfs') !== false) {
                labelfs = $this.data('labelfs');
            }
            if (typeof $this.data('color') !== 'undefined' && $this.data('color') !== false) {
                color = $this.data('color');
            }
            $this.countdown({
                until: new Date(year, month - 1, day, hour, minute, 44),
                labels: ['Years', monthsLabel, 'Weeks', daysLabel, hoursLabel, minutesLabel, secondsLabel],
                labels1: ['Year', monthLabel, 'Week', dayLabel, hourLabel, minuteLabel, secondLabel],
                format: 'ODHMS',
                timezone: timezone,
                padZeroes: true,
                significant: 0,
                onTick: function() {
                    if (digitfs !== 'undefined' && digitfs !== '') {
                        $this.find('.countdown-amount').css('font-size', digitfs + 'px').css('line-height', digitfs + 'px');
                    }
                    if (labelfs !== 'undefined' && labelfs !== '') {
                        $this.find('.countdown-period').css('font-size', labelfs + 'px');
                    }
                    if (color !== 'undefined' && color !== '') {
                        $this.find('.countdown_separator').css('background-color', color);
                    }
                }
            });
        });
    }
}

function initProgressBars() {
    "use strict";
    if ($j('.q_progress_bar').length) {
        $j('.q_progress_bar').each(function() {
            if ($j(this).parents('.vertical_split_slider').length) {
                initToCounterHorizontalProgressBar($j(this));
                var percentage = $j(this).find('.progress_content').data('percentage');
                $j(this).find('.progress_content').css('width', '0%');
                $j(this).find('.progress_content').animate({
                    'width': percentage + '%'
                }, 1500);
                $j(this).find('.progress_number_wrapper').css('width', '0%');
                $j(this).find('.progress_number_wrapper').animate({
                    'width': percentage + '%'
                }, 1500);
            } else {
                $j(this).appear(function() {
                    initToCounterHorizontalProgressBar($j(this));
                    var percentage = $j(this).find('.progress_content').data('percentage');
                    $j(this).find('.progress_content').css('width', '0%');
                    $j(this).find('.progress_content').animate({
                        'width': percentage + '%'
                    }, 1500);
                    $j(this).find('.progress_number_wrapper').css('width', '0%');
                    $j(this).find('.progress_number_wrapper').animate({
                        'width': percentage + '%'
                    }, 1500);
                }, {
                    accX: 0,
                    accY: -200
                });
            }
        });
    }
}

function initToCounterHorizontalProgressBar($this) {
    "use strict";
    var percentage = parseFloat($this.find('.progress_content').data('percentage'));
    if ($this.find('.progress_number span').length) {
        $this.find('.progress_number span').each(function() {
            $j(this).parents('.progress_number_wrapper').css('opacity', '1');
            $j(this).countTo({
                from: 0,
                to: percentage,
                speed: 1500,
                refreshInterval: 50
            });
        });
    }
}

function initListAnimation() {
    "use strict";
    if ($j('.animate_list').length > 0 && $j('.no_animation_on_touch').length === 0) {
        $j('.animate_list').each(function() {
            $j(this).appear(function() {
                $j(this).find("li").each(function(l) {
                    var k = $j(this);
                    setTimeout(function() {
                        k.animate({
                            opacity: 1,
                            top: 0
                        }, 1500);
                    }, 100 * l);
                });
            }, {
                accX: 0,
                accY: -200
            });
        });
    }
}

function initPieChart() {
    "use strict";
    if ($j('.q_percentage').length) {
        $j('.q_percentage').each(function() {
            var $barColor = piechartcolor;
            if ($j(this).data('active') !== "") {
                $barColor = $j(this).data('active');
            }
            var $trackColor = '#eeeeee';
            if ($j(this).data('noactive') !== "") {
                $trackColor = $j(this).data('noactive');
            }
            var $line_width = 10;
            if ($j(this).data('linewidth') !== "") {
                $line_width = $j(this).data('linewidth');
            }
            var $size = 174;
            $j(this).appear(function() {
                initToCounterPieChart($j(this));
                $j(this).parent().css('opacity', '1');
                $j(this).easyPieChart({
                    barColor: $barColor,
                    trackColor: $trackColor,
                    scaleColor: false,
                    lineCap: 'butt',
                    lineWidth: $line_width,
                    animate: 1500,
                    size: $size
                });
            }, {
                accX: 0,
                accY: -200
            });
        });
    }
}

function initPieChartWithIcon() {
    "use strict";
    if ($j('.q_percentage_with_icon').length) {
        $j('.q_percentage_with_icon').each(function() {
            var $barColor = piechartcolor;
            if ($j(this).data('active') !== "") {
                $barColor = $j(this).data('active');
            }
            var $trackColor = '#eeeeee';
            if ($j(this).data('noactive') !== "") {
                $trackColor = $j(this).data('noactive');
            }
            var $line_width = 10;
            if ($j(this).data('linewidth') !== "") {
                $line_width = $j(this).data('linewidth');
            }
            var $size = 174;
            $j(this).appear(function() {
                $j(this).parent().css('opacity', '1');
                $j(this).css('opacity', '1');
                $j(this).easyPieChart({
                    barColor: $barColor,
                    trackColor: $trackColor,
                    scaleColor: false,
                    lineCap: 'butt',
                    lineWidth: $line_width,
                    animate: 1500,
                    size: $size
                });
            }, {
                accX: 0,
                accY: -200
            });
        });
    }
}

function initToCounterPieChart($this) {
    "use strict";
    $j($this).css('opacity', '1');
    var $max = parseFloat($j($this).find('.tocounter').text());
    $j($this).find('.tocounter').countTo({
        from: 0,
        to: $max,
        speed: 1500,
        refreshInterval: 50
    });
}

function initPortfolio() {
    "use strict";
    if ($j('.projects_holder_outer:not(.masonry_with_space, .justified_gallery)').length) {
        $j('.projects_holder_outer').each(function() {
            var currentPortfolio = $j(this).find('.projects_holder');
            if (getIEversion() == 9 || getIEversion() == 10) {
                currentPortfolio.addClass('ie-specific-styles');
            }
            $j('.filter_holder .filter').on('click', function() {
                var $this = $j(this).text();
                var activeFilter = $j(this).data('filter');
                if (currentPortfolio.children('article').length) {
                    currentPortfolio.children('article').each(function() {
                        var thisArtcile = $j(this);
                        if (thisArtcile.hasClass(activeFilter) && activeFilter !== 'all') {
                            thisArtcile.find('a.lightbox').attr('rel', 'prettyPhoto[pretty_photo_gallery_' + $this.toLowerCase() + ']');
                            thisArtcile.find('a.lightbox').attr('data-rel', 'prettyPhoto[pretty_photo_gallery_' + $this.toLowerCase() + ']');
                        } else if (activeFilter === 'all') {
                            thisArtcile.find('a.lightbox').attr('rel', 'prettyPhoto[pretty_photo_gallery]');
                            thisArtcile.find('a.lightbox').attr('data-rel', 'prettyPhoto[pretty_photo_gallery]');
                        }
                    });
                }
                var dropLabels = $j('.filter_holder').find('.label span');
                dropLabels.each(function() {
                    $j(this).text($this);
                });
            });
            if (currentPortfolio.hasClass('v1')) {
                var timeArray = new Array(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25);
            } else if (currentPortfolio.hasClass('v2')) {
                var timeArray = new Array(1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13, 14, 14, 15, 15, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20);
            } else if (currentPortfolio.hasClass('v3')) {
                var timeArray = new Array(1, 2, 3, 2, 3, 4, 3, 4, 5, 4, 5, 6, 5, 6, 7, 6, 7, 8, 7, 8, 9, 8, 9, 10, 9, 10, 11, 10, 11, 12, 11, 12, 13, 12, 13, 14, 13, 14, 15, 14, 15, 16, 15, 16, 17, 16, 17, 18, 17, 18, 19, 18, 19, 20, 19, 20, 21, 20, 21, 22);
            } else if (currentPortfolio.hasClass('v4')) {
                var timeArray = new Array(1, 2, 3, 4, 2, 3, 4, 5, 3, 4, 5, 6, 4, 5, 6, 7, 5, 6, 7, 8, 6, 7, 8, 9, 7, 8, 9, 10, 8, 9, 10, 11, 9, 10, 11, 12, 10, 11, 12, 13, 11, 12, 13, 14, 12, 13, 14, 15, 13, 14, 15, 16, 14, 15, 16, 17, 15, 16, 17, 18, 16, 17, 18, 19, 17, 18, 19, 20, 18, 19, 20, 21);
            } else if (currentPortfolio.hasClass('v5')) {
                var timeArray = new Array(1, 2, 3, 4, 5, 2, 3, 4, 5, 6, 3, 4, 5, 6, 7, 4, 5, 6, 7, 8, 5, 6, 7, 8, 9, 6, 7, 8, 9, 10, 7, 8, 9, 10, 11, 8, 9, 10, 11, 12, 9, 10, 11, 12, 13, 10, 11, 12, 13, 14, 11, 12, 13, 14, 15, 12, 13, 14, 15, 16, 13, 14, 15, 16, 17, 14, 15, 16, 17, 18, 15, 16, 17, 18, 19, 20, 16, 17, 18, 19, 20, 17, 18, 19, 20, 21, 18, 19, 20, 21, 22, 19, 20, 21, 22, 23);
            } else if (currentPortfolio.hasClass('v6')) {
                var timeArray = new Array(1, 2, 3, 4, 5, 6, 2, 3, 4, 5, 6, 7, 3, 4, 5, 6, 7, 8, 4, 5, 6, 7, 8, 9, 5, 6, 7, 8, 9, 10, 6, 7, 8, 9, 10, 11, 7, 8, 9, 10, 11, 12, 8, 9, 10, 11, 12, 13, 9, 10, 11, 12, 13, 14, 10, 11, 12, 13, 14, 15, 11, 12, 13, 14, 15, 16, 12, 13, 14, 15, 16, 17, 13, 14, 15, 16, 17, 18, 14, 15, 16, 17, 18, 19, 15, 16, 17, 18, 19, 20, 16, 17, 18, 19, 20, 21, 17, 18, 19, 20, 21, 22);
            }
            var filterOnLoad;
            if (window.location.hash && (window.location.hash).indexOf("portfolio_category") == 1) {
                filterOnLoad = (window.location.hash).replace('#', '');
            } else {
                filterOnLoad = 'all';
            }
            currentPortfolio.mixitup({
                showOnLoad: filterOnLoad,
                transitionSpeed: 600,
                minHeight: 150,
                onMixLoad: function() {
                    $j('.projects_holder').addClass('hideItems');
                    $j('.projects_holder article').css('visibility', 'visible');
                    if (currentPortfolio.hasClass('portfolio_one_by_one')) {
                        currentPortfolio.find('article').each(function(l) {
                            var currentPortfolioItem = $j(this);
                            if ($j('.vertical_split_slider').length) {
                                var acc = 0;
                            } else {
                                var acc = -150;
                            }
                            setTimeout(function() {
                                currentPortfolioItem.addClass('show');
                            }, 100 * l);
                        });
                    }
                    if (currentPortfolio.hasClass('slide_from_left')) {
                        currentPortfolio.find('article').each(function(i) {
                            var currentPortfolioItem = $j(this);
                            setTimeout(function() {
                                currentPortfolioItem.addClass('show');
                            }, (Math.random() * 200));
                        });
                    }
                    if (currentPortfolio.hasClass('slide_from_top')) {
                        currentPortfolio.find('article').each(function(i) {
                            var currentPortfolioItem = $j(this);
                            setTimeout(function() {
                                currentPortfolioItem.addClass('show');
                            }, timeArray[i] * 50);
                        });
                    }
                    if (currentPortfolio.hasClass('diagonal_fade')) {
                        currentPortfolio.find('article').each(function(i) {
                            var currentPortfolioItem = $j(this);
                            setTimeout(function() {
                                currentPortfolioItem.addClass('show');
                            }, timeArray[i] * 50);
                        });
                    }
                    initParallax();
                },
                onMixEnd: function() {
                    initParallax();
                }
            });
        });
    }
}

function initPortfolioZIndex() {
    "use strict";
    if ($j('.projects_holder_outer.portfolio_no_space').length) {
        $j('.no_space.hover_text article').each(function(i) {
            $j(this).css('z-index', i + 10);
        });
    }
}

function initPortfolioJustifiedGallery() {
    "use strict";
    var project_holder = $j('.projects_holder_outer.justified_gallery');
    project_holder.each(function() {
        var filter_holder = $j(this).find('.filter_holder');
        filter_holder.find('li.filter').first().addClass('current');
        filter_holder.find('.filter').on('click', function() {
            var $this = $j(this).text();
            var dropLabels = filter_holder.find('.label span');
            dropLabels.each(function() {
                $j(this).text($this);
            });
            var selector = $j(this).attr('data-filter');
            var articles = the_gallery.find('article');
            var transition_duration = 500;
            articles.css('transition', 'all ' + transition_duration + 'ms ease');
            articles.not(selector).css({
                'transform': 'scale(0)'
            });
            setTimeout(function() {
                articles.filter(selector).css({
                    'transform': ''
                });
                the_gallery.css('transition', 'height ' + transition_duration + 'ms ease').justifiedGallery({
                    selector: '>article' + (selector != '*' ? selector : '')
                });
            }, 1.1 * transition_duration);
            setTimeout(function() {
                articles.css('transition', '');
                the_gallery.css('transition', '');
            }, 2.2 * transition_duration);
            $j(".filter").removeClass("current active");
            $j(this).addClass("current active");
            return false;
        });
        var the_gallery = $j(this).find('.projects_holder');
        var row_height = typeof the_gallery.data('row-height') !== 'undefined' ? the_gallery.data('row-height') : 200,
            spacing = typeof the_gallery.data('spacing') !== 'undefined' ? the_gallery.data('spacing') : 0,
            last_row = typeof the_gallery.data('last-row') !== 'undefined' ? the_gallery.data('last-row') : 'nojustify',
            justify_threshold = typeof the_gallery.data('justify-threshold') !== 'undefined' ? the_gallery.data('justify-threshold') : 0.75;
        the_gallery.justifiedGallery({
            captions: false,
            rowHeight: row_height,
            margins: spacing,
            border: 0,
            lastRow: last_row,
            justifyThreshold: justify_threshold,
            selector: '> article'
        }).on('jg.complete jg.rowflush', function() {
            $j(this).find('article').addClass('show').each(function() {
                $j(this).height(Math.round($j(this).height()));
            });
        });
    });
}

function initPortfolioMasonryFilter() {
    "use strict";
    var masonry_holder = $j('.projects_masonry_holder, .masonry_with_space .projects_holder');
    if (masonry_holder.length) {
        var portfolioIsotopeAnimation = null;
        $j('.filter:first').addClass('current');
        $j('.filter').click(function() {
            clearTimeout(portfolioIsotopeAnimation);
            $j('.isotope, .isotope .isotope-item').css('transition-duration', '0.8s');
            portfolioIsotopeAnimation = setTimeout(function() {
                $j('.isotope, .isotope .isotope-item').css('transition-duration', '0s');
            }, 700);
            var selector = $j(this).attr('data-filter');
            masonry_holder.isotope({
                filter: selector
            });
            $j(".filter").removeClass("current");
            $j(this).addClass("current");
            var $filterText = $j(this).text();
            if (selector !== '*') {
                selector = selector.substring(1);
            }
            if (masonry_holder.children('article').length) {
                masonry_holder.children('article').each(function() {
                    var thisArtcile = $j(this);
                    if (thisArtcile.hasClass(selector) && selector !== '*') {
                        thisArtcile.find('a.lightbox').attr('rel', 'prettyPhoto[pretty_photo_gallery_' + $filterText.toLowerCase() + ']');
                        thisArtcile.find('a.lightbox').attr('data-rel', 'prettyPhoto[pretty_photo_gallery_' + $filterText.toLowerCase() + ']');
                    } else if (selector === '*') {
                        thisArtcile.find('a.lightbox').attr('rel', 'prettyPhoto[pretty_photo_gallery]');
                        thisArtcile.find('a.lightbox').attr('data-rel', 'prettyPhoto[pretty_photo_gallery]');
                    }
                });
            }
            setTimeout(setPortfolioMasZIndex(), 700);
            return false;
        });
    }
}

function initPortfolioMasonry() {
    "use strict";
    var portList = $j('.projects_masonry_holder, .masonry_with_space .projects_holder');
    if (portList.length) {
        portList.each(function() {
            var thisPortList = $j(this);
            var size = thisPortList.find('.qode-portfolio-masonry-gallery-grid-sizer').width();
            if (portList.hasClass('projects_masonry_holder')) {
                resizeMasonry(size, thisPortList);
            }
            qodeInitMasonry(thisPortList);
            $j(window).resize(function() {
                setPortfolioMasZIndex();
                if (portList.hasClass('projects_masonry_holder')) {
                    resizeMasonry(size, thisPortList);
                }
                qodeInitMasonry(thisPortList);
            });
        });
    }
}

function qodeInitMasonry(container) {
    container.waitForImages(function() {
        container.animate({
            opacity: 1
        });
        container.isotope({
            itemSelector: '.portfolio_masonry_item, .masonry_with_space .mix',
            masonry: {
                columnWidth: '.qode-portfolio-masonry-gallery-grid-sizer'
            }
        });
        if (container.hasClass('portfolio_one_by_one')) {
            container.find('article').each(function(l) {
                var $this = $j(this);
                setTimeout(function() {
                    $this.addClass('show');
                }, 100 * l);
            });
        }
        if (container.hasClass('portfolio_fade_from_bottom')) {
            container.find('article').each(function(l) {
                var $this = $j(this);
                $j(this).css({
                    'opacity': '0',
                    'transform': 'translateY(150px)'
                });
                $j(this).appear(function() {
                    setTimeout(function() {
                        $this.css({
                            'opacity': '1',
                            'transition': 'all .8s ease',
                            'transform': 'translateY(0)'
                        });
                    }, 100);
                }, {
                    accX: 0,
                    accY: -150
                });
            });
        }
    });
}

function resizeMasonry(size, container) {
    var $window = jQuery(window);
    if (container.hasClass('portfolio_masonry_gallery_with_space')) {
        var defaultMasonryItem = container.find('.portfolio_masonry_item.default');
        var largeWidthMasonryItem = container.find('.large_width');
        var largeHeightMasonryItem = container.find('.large_height');
        var largeWidthHeightMasonryItem = container.find('.large_width_height');
        defaultMasonryItem.css('height', size);
        largeHeightMasonryItem.css('height', Math.round(2 * size));
        if ($window.innerWidth() > 480) {
            largeWidthHeightMasonryItem.css('height', Math.round(2 * size));
            largeWidthMasonryItem.css('height', size);
        } else {
            largeWidthHeightMasonryItem.css('height', size);
        }
    } else {
        var largeItemHeight;
        if (container.find('article[class*="default"]:first img').height()) {
            largeItemHeight = container.find('article[class*="default"]:first img').height();
        } else if (container.find('article[class*="large_width"]:not(.large_width_height):first img').height()) {
            largeItemHeight = container.find('article[class*="large_width"]:not(.large_width_height):first img').height();
        } else {
            largeItemHeight = (container.find('article[class*="large_width_height"]:first img').height()) ? (container.find('article[class*="large_width_height"]:first img').height()) / 2 : (container.find('article[class*="large_height"]:first img').height()) / 2;
        }
        var double = ($window.innerWidth() > 480) ? 2 : 1;
        container.find('article[class*="large_width_height"] img, article[class*="large_height"] img').css('height', (largeItemHeight * double));
    }
}

function setPortfolioMasZIndex() {
    var $elemXPos = {};
    var $elemZIndex = {};
    $j('.projects_masonry_holder article').each(function() {
        $elemXPos[$j(this).index()] = getPortfolioXPos($j(this).css('left'));
    });
    var $elemXPosArray = $j.map($elemXPos, function(value) {
        return value;
    });
    $elemXPosArray = cleanPortfolioMasXArray($elemXPosArray);
    $elemXPosArray.sort(function(x, y) {
        return x - y
    });
    for (var i = 0; i < $elemXPosArray.length; i++) {
        $elemZIndex[$elemXPosArray[i]] = i * 10;
    }
    $j.each($elemXPos, function(key, val) {
        var $zi;
        var $bgd = val;
        $j.each($elemZIndex, function(key, val) {
            if ($bgd == key) {
                $zi = val;
            }
        });
        $j('.projects_masonry_holder article:eq(' + key + ')').css('z-index', $zi);
    });
}

function cleanPortfolioMasXArray($elemXPosArray) {
    var i;
    var length = $elemXPosArray.length;
    var $elemXPosOutArray = [];
    var tmp = {};
    for (i = 0; i < length; i++) {
        tmp[$elemXPosArray[i]] = 0;
    }
    for (i in tmp) {
        $elemXPosOutArray.push(i);
    }
    return $elemXPosOutArray;
}

function getPortfolioXPos(css) {
    return css.substr(0, css.length - 2);
}

function initServiceAnimation() {
    "use strict";
    if ($j(".fade_in_circle_holder").length > 0 && $j('.no_animation_on_touch').length === 0) {
        $j('.fade_in_circle_holder').each(function() {
            $j(this).appear(function() {
                $j(this).addClass('animate_circle');
            }, {
                accX: 0,
                accY: -200
            });
        });
    }
}

function checkTitleToShowOrHide() {
    if ($j('.title_outer.animate_title_area').length) {
        var title_area_height = $j('.title_outer').data('height');
        if ($scroll > $j('.title').height()) {
            $j('.title_outer').css({
                'height': title_area_height,
                'opacity': '1',
                'overflow': 'visible'
            });
        }
    }
}

function initTitleAreaAnimation() {
    if ($j('.title_outer.animate_title_area').length) {
        var title_area_height = $j('.title_outer').data('height');
        if ($j('.title_outer').hasClass('with_image')) {
            title_area_height = $j('.image.responsive').height();
        }
        if ($scroll < $j('.title').height()) {
            $j('.title_outer').animate({
                height: title_area_height,
                opacity: 1
            }, 500, function() {
                $j(this).css({
                    'overflow': 'visible'
                });
                initPortfolioSingleInfo();
                if ($j('nav.content_menu').length > 0) {
                    content_menu_position = $j('nav.content_menu').offset().top;
                    contentMenuPosition();
                }
            });
        }
    }
}

function initParallaxTitle() {
    "use strict";
    if (($j('.title').length > 0) && ($j('.touch').length === 0)) {
        if ($j('.title.has_fixed_background').length) {
            var $background_size_width = parseInt($j('.title.has_fixed_background').css('background-size').match(/\d+/));
            var title_holder_height = $j('.title.has_fixed_background').height();
            var title_rate = (title_holder_height / 10000) * 7;
            var title_distance = $scroll - $j('.title.has_fixed_background').offset().top;
            var title_bpos = -(title_distance * title_rate);
            $j('.title.has_fixed_background').css({
                'background-position': 'center ' + (0 + add_for_admin_bar) + 'px'
            });
            if ($j('.title.has_fixed_background').hasClass('zoom_out')) {
                $j('.title.has_fixed_background').css({
                    'background-size': $background_size_width - $scroll + 'px auto'
                });
            }
        }
        $j(window).on('scroll', function() {
            if ($j('.title.has_fixed_background').length) {
                var title_distance = $scroll - $j('.title.has_fixed_background').offset().top;
                var title_bpos = -(title_distance * title_rate);
                $j('.title.has_fixed_background').css({
                    'background-position': 'center ' + (title_bpos + add_for_admin_bar) + 'px'
                });
                if ($j('.title.has_fixed_background').hasClass('zoom_out')) {
                    $j('.title.has_fixed_background').css({
                        'background-size': $background_size_width - $scroll + 'px auto'
                    });
                }
            }
        });
    }
}
(function($) {
    var $window = $(window);
    var windowHeight = $window.height();
    $window.resize(function() {
        windowHeight = $window.height();
    });
    $.fn.parallax = function(xpos, speedFactor, outerHeight) {
        var $this = $(this);
        var getHeight;
        var firstTop;
        var paddingTop = 0;
        $this.each(function() {
            firstTop = $this.offset().top;
        });
        if (outerHeight) {
            getHeight = function(jqo) {
                return jqo.outerHeight(true);
            };
        } else {
            getHeight = function(jqo) {
                return jqo.height();
            };
        }
        if (arguments.length < 1 || xpos === null) xpos = "50%";
        if (arguments.length < 2 || speedFactor === null) speedFactor = 0.1;
        if (arguments.length < 3 || outerHeight === null) outerHeight = true;

        function update() {
            var pos = $window.scrollTop();
            $this.each(function() {
                var $element = $(this);
                var top = $element.offset().top;
                var height = getHeight($element);
                if (top + height < pos || top > pos + windowHeight) {
                    return;
                }
                $this.css('backgroundPosition', xpos + " " + Math.round((firstTop - pos) * speedFactor) + "px");
            });
        }
        $window.bind('scroll', update).resize(update);
        update();
    };
})(jQuery);

function initParallax() {
    "use strict";
    if ($j('.parallax_section_holder').length) {
        $j('.parallax_section_holder').each(function() {
            var parallaxElement = $j(this);
            if (parallaxElement.hasClass('qode_full_screen_height_parallax')) {
                parallaxElement.height($window_height);
            }
            var speed = parallaxElement.data('speed') * 0.4;
            parallaxElement.parallax("50%", speed);
        });
    }
}

function initSideAreaScroll() {
    "use strict";
    if ($j('.side_menu').length) {
        $j(".side_menu").niceScroll({
            scrollspeed: 60,
            mousescrollstep: 40,
            cursorwidth: 0,
            cursorborder: 0,
            cursorborderradius: 0,
            cursorcolor: "transparent",
            autohidemode: false,
            horizrailenabled: false
        });
    }
}

function initVerticalAreaMenuScroll() {
    "use strict";
    if ($j('.vertical_menu_area.with_scroll').length) {
        $j(".vertical_menu_area.with_scroll").niceScroll({
            scrollspeed: 60,
            mousescrollstep: 40,
            cursorwidth: 0,
            cursorborder: 0,
            cursorborderradius: 0,
            cursorcolor: "transparent",
            autohidemode: false,
            horizrailenabled: false
        });
    }
}

function loadMore() {
    "use strict";
    var i = 1;
    $j('.load_more a').on('click', function(e) {
        e.preventDefault();
        var link = $j(this).attr('href');
        var $content = '.projects_holder';
        var $anchor = '.portfolio_paging .load_more a';
        var $next_href = $j($anchor).attr('href');
        var filler_num = $j('.projects_holder .filler').length;
        var load_more_holder = $j('.portfolio_paging');
        var loading_holder = $j('.portfolio_paging_loading');
        load_more_holder.hide();
        loading_holder.show();
        $j.get(link + '', function(data) {
            if (!$j($content).is('.justified-gallery')) {
                $j('.projects_holder .filler').slice(-filler_num).remove();
                var $new_content = $j($content, data).wrapInner('').html();
                $next_href = $j($anchor, data).attr('href');
                $j($content, data).waitForImages(function() {
                    $j('article.mix:last').after($new_content);
                    $j('.projects_holder article').css('visibility', 'visible');
                    $j('article:not(.show)').each(function(l) {
                        $j(this).addClass('show');
                    });
                    if ($j('.masonry_with_space').length) {
                        $j('.masonry_with_space .projects_holder').isotope('reloadItems').isotope();
                    } else {
                        var min_height = $j('article.mix:first').height();
                        $j('article.mix').css('min-height', min_height);
                        $j('.projects_holder').mixitup('remix', 'all');
                    }
                    prettyPhoto();
                    if ($j('.load_more').attr('rel') > i) {
                        $j('.load_more a').attr('href', $next_href);
                    } else {
                        $j('.load_more').remove();
                    }
                    $j('.projects_holder .portfolio_paging:last').remove();
                    $j('article.mix').css('min-height', 0);
                    load_more_holder.show();
                    loading_holder.hide();
                });
            } else {
                var $new_content = $j($content, data).wrapInner('').html();
                $next_href = $j($anchor, data).attr('href');
                $j($content, data).waitForImages(function() {
                    $j($content).find('article:last').after($new_content);
                    $j($content).find('article').css('visibility', 'visible');
                    $j($content).justifiedGallery('norewind');
                    prettyPhoto();
                    if ($j('.load_more').attr('rel') > i) {
                        $j('.load_more a').attr('href', $next_href);
                    } else {
                        $j('.load_more').remove();
                    }
                    $j('.projects_holder .portfolio_paging:last').remove();
                    load_more_holder.show();
                    loading_holder.hide();
                });
            }
        });
        i++;
    });
}

function prettyPhoto() {
    "use strict";
    $j('a[data-rel]').each(function() {
        $j(this).attr('rel', $j(this).data('rel'));
    });
    $j("a[rel^='prettyPhoto']").prettyPhoto({
        animation_speed: 'normal',
        slideshow: false,
        autoplay_slideshow: false,
        opacity: 0.80,
        show_title: true,
        allow_resize: true,
        horizontal_padding: 0,
        default_width: 650,
        default_height: 400,
        counter_separator_label: '/',
        theme: 'pp_default',
        hideflash: false,
        wmode: 'opaque',
        autoplay: true,
        modal: false,
        overlay_gallery: false,
        keyboard_shortcuts: true,
        deeplinking: false,
        social_tools: false
    });
}

function initMobileMenu() {
    "use strict";
    $j(".mobile_menu_button > span").on('tap click', function(e) {
        e.preventDefault();
        if ($j(".mobile_menu > ul").is(":visible")) {
            $j(".mobile_menu > ul").slideUp(200);
        } else {
            $j(".mobile_menu > ul").slideDown(200);
        }
    });
    $j(".mobile_menu > ul > li.has_sub > span.mobile_arrow, .mobile_menu > ul > li.has_sub > h3, .mobile_menu > ul > li.has_sub > a[href*='#']").on('tap click', function(e) {
        e.preventDefault();
        if ($j(this).closest('li.has_sub').find("> ul.sub_menu").is(":visible")) {
            $j(this).closest('li.has_sub').find("> ul.sub_menu").slideUp(200);
            $j(this).closest('li.has_sub').removeClass('open_sub');
        } else {
            $j(this).closest('li.has_sub').addClass('open_sub');
            $j(this).closest('li.has_sub').find("> ul.sub_menu").slideDown(200);
        }
    });
    $j(".mobile_menu > ul > li.has_sub > ul.sub_menu > li.has_sub > span.mobile_arrow, .mobile_menu > ul > li.has_sub > ul.sub_menu > li.has_sub > h3, .mobile_menu > ul > li.has_sub > ul.sub_menu > li.has_sub > a[href*='#']").on('tap click', function(e) {
        e.preventDefault();
        if ($j(this).parent().find("ul.sub_menu").is(":visible")) {
            $j(this).parent().find("ul.sub_menu").slideUp(200);
            $j(this).parent().removeClass('open_sub');
        } else {
            $j(this).parent().addClass('open_sub');
            $j(this).parent().find("ul.sub_menu").slideDown(200);
        }
    });
    $j(".mobile_menu ul li > a, .q_logo a").on('click', function() {
        if (($j(this).attr('href') !== "http://#") && ($j(this).attr('href') !== "#")) {
            $j(".mobile_menu > ul").slideUp();
        }
    });
}

function initFlexSlider() {
    "use strict";
    $j('.flexslider').each(function() {
        var $this = $j(this);
        var interval = 8000;
        if (typeof $this.data('interval') !== 'undefined' && $this.data('interval') !== false) {
            interval = parseFloat($this.data('interval')) * 1000;
        }
        var directionNav = true;
        if (typeof $this.data('direction') !== 'undefined') {
            directionNav = $this.data('direction');
        }
        var controlNav = false;
        if (typeof $this.data('control') !== 'undefined') {
            controlNav = $this.data('control');
        }
        var pauseOnHoverAction = true;
        if (typeof $this.data('pasue-on-hover') !== 'undefined') {
            pauseOnHoverAction = $this.data('pasue-on-hover');
        }
        var enableDrag = false;
        if (typeof $this.data('drag') !== 'undefined') {
            enableDrag = $this.data('drag');
        }
        var slideshow = true;
        if (interval === 0) {
            slideshow = false;
        }
        var animation = 'slide';
        if (typeof $this.data('flex_fx') !== 'undefined' && $this.data('flex_fx') !== false) {
            animation = $this.data('flex_fx');
        }
        $this.flexslider({
            animationLoop: true,
            controlNav: controlNav,
            directionNav: directionNav,
            useCSS: false,
            pauseOnAction: pauseOnHoverAction,
            pauseOnHover: pauseOnHoverAction,
            slideshow: slideshow,
            animation: animation,
            prevText: "<div><i class='fa fa-angle-left'></i></div>",
            nextText: "<div><i class='fa fa-angle-right'></i></div>",
            animationSpeed: 600,
            slideshowSpeed: interval,
            touch: true,
            start: function() {
                setTimeout(function() {
                    $j(".flexslider").fitVids();
                }, 100);
            }
        });
        $this.find('.flex-direction-nav a').click(function(e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            e.stopPropagation();
        });
        if (enableDrag) {
            $this.swipe({
                swipeLeft: function() {
                    $this.flexslider('next');
                },
                swipeRight: function() {
                    $this.flexslider('prev');
                },
                threshold: 20
            });
        }
    });
}

function fitVideo() {
    "use strict";
    $j(".portfolio_images").fitVids();
    $j(".video_holder").fitVids();
    $j(".format-video .post_image").fitVids();
    $j(".format-video .q_masonry_blog_post_image").fitVids();
}
var $scrollHeight;

function initPortfolioSingleInfo() {
    "use strict";
    var $sidebar = $j(".portfolio_single_follow");
    if ($j(".portfolio_single_follow").length > 0) {
        var offset = $sidebar.offset();
        $scrollHeight = $j(".portfolio_container").height();
        var $scrollOffset = $j(".portfolio_container").offset();
        var $window = $j(window);
        var $headerHeight = parseInt($j('header.page_header').css('height'), 10);
        $window.scroll(function() {
            if ($window.width() > 960) {
                if ($window.scrollTop() + $headerHeight + 3 > offset.top) {
                    if ($window.scrollTop() + $headerHeight + $sidebar.height() + 24 < $scrollOffset.top + $scrollHeight) {
                        $sidebar.stop().animate({
                            marginTop: $window.scrollTop() - offset.top + $headerHeight
                        });
                    } else {
                        $sidebar.stop().animate({
                            marginTop: $scrollHeight - $sidebar.height() - 24
                        });
                    }
                } else {
                    $sidebar.stop().animate({
                        marginTop: 0
                    });
                }
            } else {
                $sidebar.css('margin-top', 0);
            }
        });
    }
}

function initTabs() {
    "use strict";
    if ($j('.q_tabs').length) {
        $j('.q_tabs').appear(function() {
            $j('.q_tabs').css('visibility', 'visible');
        }, {
            accX: 0,
            accY: -100
        });
        var $tabsNav = $j('.tabs-nav');
        var $tabsNavLis = $tabsNav.children('li');
        $tabsNav.each(function() {
            var $this = $j(this);
            $this.next().children('.tab-content').stop(true, true).hide().first().show();
            $this.children('li').first().addClass('active').stop(true, true).show();
        });
        $tabsNavLis.on('click', function(e) {
            var $this = $j(this);
            $this.siblings().removeClass('active').end().addClass('active');
            $this.parent().next().children('.tab-content').stop(true, true).hide().siblings($this.find('a').attr('href')).fadeIn();
            e.preventDefault();
        });
    }
}

function initAccordion() {
    "use strict";
    if ($j(".q_accordion_holder").length) {
        $j(".q_accordion_holder").appear(function() {
            $j(".q_accordion_holder").css('visibility', 'visible');
        }, {
            accX: 0,
            accY: -100
        });
        if ($j(".accordion").length) {
            $j(".accordion").accordion({
                animate: "swing",
                collapsible: true,
                active: false,
                icons: "",
                heightStyle: "content",
                activate: function(event, ui) {
                    initParallax();
                }
            });
            $j(".accordion").each(function() {
                var activeTab = parseInt($j(this).data('active-tab'));
                if (activeTab !== "") {
                    activeTab = activeTab - 1;
                    $j(this).accordion('option', 'active', activeTab);
                }
                var borderRadius = parseInt($j(this).data('border-radius'));
                if (borderRadius !== "") {
                    $j(this).find('.accordion_mark').css('border-radius', borderRadius + "px");
                }
                var collapsible = ($j(this).data('collapsible') == 'yes') ? true : false;
                $j(this).accordion('option', 'collapsible', collapsible);
                $j(this).accordion('option', 'collapsible', collapsible);
            });
        }
        $j(".toggle").addClass("accordion ui-accordion ui-accordion-icons ui-widget ui-helper-reset").find(".title-holder").addClass("ui-accordion-header ui-helper-reset ui-state-default ui-corner-top ui-corner-bottom").hover(function() {
            $j(this).toggleClass("ui-state-hover");
        }).click(function() {
            $j(this).toggleClass("ui-accordion-header-active ui-state-active ui-state-default ui-corner-bottom").next().toggleClass("ui-accordion-content-active").slideToggle(400);
            return false;
        }).next().addClass("ui-accordion-content ui-helper-reset ui-widget-content ui-corner-bottom").hide();
        $j(".toggle").each(function() {
            var activeTab = parseInt($j(this).data('active-tab'));
            if (activeTab !== "" && activeTab >= 1) {
                activeTab = activeTab - 1;
                $j(this).find('.ui-accordion-content').eq(activeTab).show();
                $j(this).find('.ui-accordion-header').eq(activeTab).addClass('ui-state-active');
            }
        });
    }
}

function initAccordionContentLink() {
    "use strict";
    if ($j(".accordion").length) {
        $j('.accordion_holder .accordion_inner .accordion_content a').click(function() {
            if ($j(this).attr('target') === '_blank') {
                window.open($j(this).attr('href'), '_blank');
            } else {
                window.open($j(this).attr('href'), '_self');
            }
            return false;
        });
    }
}

function initTestimonials() {
    "use strict";
    if ($j('.testimonials_carousel').length) {
        $j('.testimonials_carousel').each(function() {
            var interval = 5000;
            var $this = $j(this);
            if (typeof $this.data('auto-rotate-slides') !== 'undefined' && $this.data('auto-rotate-slides') !== false) {
                interval = parseFloat($this.data('auto-rotate-slides')) * 1000;
            }
            var slideshow = true;
            if (interval === 0) {
                slideshow = false;
            }
            var animation = 'fade';
            if (typeof $this.data('animation-type') !== 'undefined' && $this.data('animation-type') !== false) {
                animation = $this.data('animation-type');
            }
            var directionNav = true;
            if (typeof $this.data('show-navigation') !== 'undefined') {
                directionNav = $this.data('show-navigation') == 'no' ? false : true;
            }
            var animationSpeed = 600;
            if (typeof $this.data('animation-speed') !== 'undefined' && $this.data('animation-speed') !== false) {
                animationSpeed = $this.data('animation-speed');
            }
            var numberPerPage = qodeNumberOfTestimonialsItems($this);
            var itemWidth = 0;
            var itemMargin = 0;
            if (typeof numberPerPage !== 'undefined' && numberPerPage !== 1) {
                itemWidth = 200;
                itemMargin = 40;
            }
            $this.flexslider({
                animationLoop: true,
                controlNav: false,
                directionNav: directionNav,
                useCSS: false,
                pauseOnAction: true,
                pauseOnHover: false,
                slideshow: slideshow,
                animation: animation,
                itemMargin: itemMargin,
                minItems: numberPerPage,
                maxItems: numberPerPage,
                itemWidth: itemWidth,
                animationSpeed: animationSpeed,
                slideshowSpeed: interval,
                start: function(slider) {
                    initParallax();
                }
            });
        });
    }
}

function qodeNumberOfTestimonialsItems($this) {
    var maxItems = $this.data('number-per-slide');
    if ($window_width < 768 && maxItems > 1) {
        maxItems = 1;
    } else if ($window_width < 1024 && maxItems > 2) {
        maxItems = 2;
    }
    return maxItems;
}

function qodeNumberOfTestimonialsItemsResize() {
    var testimonialsSlider = $j('.testimonials_carousel, .testimonials_c_carousel');
    if (testimonialsSlider.length) {
        testimonialsSlider.each(function() {
            var thisSliderHolder = $j(this);
            var items = qodeNumberOfTestimonialsItems(thisSliderHolder);
            thisSliderHolder.data('flexslider').vars.minItems = items;
            thisSliderHolder.data('flexslider').vars.maxItems = items;
        });
    }
}

function initTestimonialsCarousel() {
    "use strict";
    if ($j('.testimonials_c_carousel').length) {
        $j('.testimonials_c_carousel').each(function() {
            var interval = 5000;
            var $this = $j(this);
            if (typeof $this.data('auto-rotate-slides') !== 'undefined' && $this.data('auto-rotate-slides') !== false) {
                interval = parseFloat($this.data('auto-rotate-slides')) * 1000;
            }
            var slideshow = true;
            if (interval === 0) {
                slideshow = false;
            }
            var controlNav = true;
            if (typeof $this.data('show-navigation') !== 'undefined') {
                controlNav = $this.data('show-navigation') == 'no' ? false : true;
            }
            var animationSpeed = 600;
            if (typeof $this.data('animation-speed') !== 'undefined' && $this.data('animation-speed') !== false) {
                animationSpeed = $this.data('animation-speed');
            }
            var numberPerPage = qodeNumberOfTestimonialsItems($this);
            var itemWidth = 0;
            var itemMargin = 0;
            if (typeof numberPerPage !== 'undefined' && numberPerPage !== 1) {
                itemWidth = 300;
                itemMargin = 30;
            }
            $this.flexslider({
                animationLoop: true,
                controlNav: controlNav,
                directionNav: false,
                useCSS: false,
                pauseOnAction: true,
                pauseOnHover: false,
                slideshow: slideshow,
                animation: 'slide',
                itemMargin: itemMargin,
                minItems: numberPerPage,
                maxItems: numberPerPage,
                itemWidth: itemWidth,
                animationSpeed: animationSpeed,
                slideshowSpeed: interval,
                start: function(slider) {
                    initParallax();
                }
            });
        });
    }
}

function initMessages() {
    "use strict";
    if ($j('.q_message').length) {
        $j('.q_message').each(function() {
            $j(this).find('.close').click(function(e) {
                e.preventDefault();
                $j(this).parent().parent().fadeOut(500);
            });
        });
    }
}

function initElementsAnimation() {
    "use strict";
    if ($j(".element_from_fade").length > 0 && $j('.no_animation_on_touch').length === 0) {
        $j('.element_from_fade').each(function() {
            var $this = $j(this);
            $this.appear(function() {
                $this.addClass('element_from_fade_on');
            }, {
                accX: 0,
                accY: -100
            });
        });
    }
    if ($j(".element_from_left").length > 0 && $j('.no_animation_on_touch').length === 0) {
        $j('.element_from_left').each(function() {
            var $this = $j(this);
            $this.appear(function() {
                $this.addClass('element_from_left_on');
            }, {
                accX: 0,
                accY: -100
            });
        });
    }
    if ($j(".element_from_right").length > 0 && $j('.no_animation_on_touch').length === 0) {
        $j('.element_from_right').each(function() {
            var $this = $j(this);
            $this.appear(function() {
                $this.addClass('element_from_right_on');
            }, {
                accX: 0,
                accY: -100
            });
        });
    }
    if ($j(".element_from_top").length > 0 && $j('.no_animation_on_touch').length === 0) {
        $j('.element_from_top').each(function() {
            var $this = $j(this);
            $this.appear(function() {
                $this.addClass('element_from_top_on');
            }, {
                accX: 0,
                accY: -100
            });
        });
    }
    if ($j(".element_from_bottom").length > 0 && $j('.no_animation_on_touch').length === 0) {
        $j('.element_from_bottom').each(function() {
            var $this = $j(this);
            $this.appear(function() {
                $this.addClass('element_from_bottom_on');
            }, {
                accX: 0,
                accY: -100
            });
        });
    }
    if ($j(".element_transform").length > 0 && $j('.no_animation_on_touch').length === 0) {
        $j('.element_transform').each(function() {
            var $this = $j(this);
            $this.appear(function() {
                $this.addClass('element_transform_on');
            }, {
                accX: 0,
                accY: -100
            });
        });
    }
}

function fitAudio() {
    "use strict";
    $j('audio.blog_audio').mediaelementplayer({
        audioWidth: '100%'
    });
}

function initBlog() {
    "use strict";
    if ($j('.blog_holder.masonry, .blog_holder.blog_pinterest').length) {
        var width_blog = $j(this).closest('.container_inner').width();
        if ($j('.blog_holder').closest(".column_inner").length) {
            width_blog = $j('.blog_holder').closest(".column_inner").width();
        }
        $j('.blog_holder').width(width_blog);
        var $container = $j('.blog_holder');
        $container.waitForImages(function() {
            setTimeout(function() {
                $container.isotope({
                    itemSelector: 'article',
                    resizable: false,
                    masonry: {
                        columnWidth: '.blog_holder_grid_sizer',
                        gutter: '.blog_holder_grid_gutter'
                    }
                });
                $j('.blog_holder.masonry, .blog_holder.blog_pinterest').animate({
                    opacity: "1"
                }, 500);
            }, 400);
        });
        $j('.filter').click(function() {
            var selector = $j(this).attr('data-filter');
            $container.isotope({
                filter: selector
            });
            return false;
        });
        if ($container.hasClass('masonry_infinite_scroll')) {
            $container.infinitescroll({
                navSelector: '.blog_infinite_scroll_button span',
                nextSelector: '.blog_infinite_scroll_button span a',
                itemSelector: 'article',
                loading: {
                    finishedMsg: finished_text,
                    msgText: loading_text
                }
            }, function(newElements) {
                $container.isotope('appended', $j(newElements));
                fitVideo();
                fitAudio();
                initFlexSlider();
                setTimeout(function() {
                    $j('.blog_holder.masonry, .blog_holder.blog_pinterest').isotope('layout');
                }, 400);
            });
        } else if ($container.hasClass('masonry_load_more')) {
            var i = 1;
            $j('.blog_load_more_button a').off('click tap').on('click tap', function(e) {
                e.preventDefault();
                var load_more_holder = $j('.blog_load_more_button');
                var load_more_loading = $j('.blog_load_more_button_loading');
                load_more_holder.hide();
                load_more_loading.show();
                var link = $j(this).attr('href');
                var $content = '.masonry_load_more';
                var $anchor = '.blog_load_more_button a';
                var $next_href = $j($anchor).attr('href');
                $j.get(link + '', function(data) {
                    var $new_content = $j($content, data).wrapInner('').html();
                    $next_href = $j($anchor, data).attr('href');
                    $container.append($j($new_content)).isotope('reloadItems').isotope({
                        sortBy: 'original-order'
                    });
                    fitVideo();
                    fitAudio();
                    initFlexSlider();
                    setTimeout(function() {
                        $j('.blog_holder.masonry, .blog_holder.blog_pinterest').isotope('layout');
                    }, 400);
                    load_more_holder.show();
                    load_more_loading.hide();
                    if ($j('.blog_load_more_button span').attr('rel') > i) {
                        $j('.blog_load_more_button a').attr('href', $next_href);
                    } else {
                        $j('.blog_load_more_button').remove();
                    }
                });
                i++;
            });
        }
    }
}

function initBlogMasonryFullWidth() {
    "use strict";
    if ($j('.masonry_full_width').length) {
        var width_blog = $j('.full_width_inner').width();
        $j('.masonry_full_width').width(width_blog);
        var $container = $j('.masonry_full_width');
        $j('.filter').click(function() {
            var selector = $j(this).attr('data-filter');
            $container.isotope({
                filter: selector
            });
            return false;
        });
        if ($container.hasClass('masonry_infinite_scroll')) {
            $container.infinitescroll({
                navSelector: '.blog_infinite_scroll_button span',
                nextSelector: '.blog_infinite_scroll_button span a',
                itemSelector: 'article',
                loading: {
                    finishedMsg: finished_text,
                    msgText: loading_text
                }
            }, function(newElements) {
                $container.isotope('appended', $j(newElements));
                fitVideo();
                fitAudio();
                initFlexSlider();
                setTimeout(function() {
                    $j('.blog_holder.masonry_full_width').isotope('layout');
                }, 400);
            });
        } else if ($container.hasClass('masonry_load_more')) {
            var i = 1;
            $j('.blog_load_more_button a').off('click tap').on('click tap', function(e) {
                e.preventDefault();
                var link = $j(this).attr('href');
                var $content = '.masonry_load_more';
                var $anchor = '.blog_load_more_button a';
                var $next_href = $j($anchor).attr('href');
                $j.get(link + '', function(data) {
                    var $new_content = $j($content, data).wrapInner('').html();
                    $next_href = $j($anchor, data).attr('href');
                    $container.append($j($new_content)).isotope('reloadItems').isotope({
                        sortBy: 'original-order'
                    });
                    fitVideo();
                    fitAudio();
                    initFlexSlider();
                    setTimeout(function() {
                        $j('.blog_holder.masonry_full_width').isotope('layout');
                    }, 400);
                    if ($j('.blog_load_more_button span').attr('rel') > i) {
                        $j('.blog_load_more_button a').attr('href', $next_href);
                    } else {
                        $j('.blog_load_more_button').remove();
                    }
                });
                i++;
            });
        }
        $container.waitForImages(function() {
            setTimeout(function() {
                $container.isotope({
                    itemSelector: 'article',
                    resizable: false,
                    masonry: {
                        columnWidth: '.blog_holder_grid_sizer',
                        gutter: '.blog_holder_grid_gutter'
                    }
                });
                $j('.masonry_full_width').animate({
                    opacity: "1"
                }, 500);
            }, 400);
        });
    }
}

function initBlogMasonryGallery() {
    "use strict";
    if ($j('.blog_holder.masonry_gallery').length) {
        qodeResizeBlogMasonryGallery($j('.blog_holder_grid_sizer').width());
        var container = $j('.blog_holder.masonry_gallery');
        container.width(Math.round(container.parent().width()));
        container.isotope({
            itemSelector: 'article',
            resizable: false,
            masonry: {
                columnWidth: '.blog_holder_grid_sizer',
                gutter: '.blog_holder_grid_gutter'
            }
        });
        container.waitForImages(function() {
            container.animate({
                opacity: "1"
            }, 300, function() {
                container.isotope().isotope('layout');
            });
        });
        if (container.hasClass('masonry_infinite_scroll')) {
            container.infinitescroll({
                navSelector: '.blog_infinite_scroll_button span',
                nextSelector: '.blog_infinite_scroll_button span a',
                itemSelector: 'article',
                loading: {
                    finishedMsg: finished_text,
                    msgText: loading_text
                }
            }, function(newElements) {
                container.isotope('appended', $j(newElements));
                fitVideo();
                fitAudio();
                initFlexSlider();
                qodeResizeBlogMasonryGallery($j('.blog_holder_grid_sizer').width());
                setTimeout(function() {
                    container.isotope('layout');
                }, 300);
            });
        } else if (container.hasClass('masonry_load_more')) {
            var i = 1;
            $j('.blog_load_more_button a').off('click tap').on('click tap', function(e) {
                e.preventDefault();
                var link = $j(this).attr('href');
                var $content = '.masonry_load_more';
                var $anchor = '.blog_load_more_button a';
                var $next_href = $j($anchor).attr('href');
                $j.get(link + '', function(data) {
                    var $new_content = $j($content, data).wrapInner('').html();
                    $next_href = $j($anchor, data).attr('href');
                    container.append($j($new_content)).isotope('reloadItems').isotope({
                        sortBy: 'original-order'
                    });
                    fitVideo();
                    fitAudio();
                    initFlexSlider();
                    qodeResizeBlogMasonryGallery($j('.blog_holder_grid_sizer').width());
                    setTimeout(function() {
                        container.isotope('layout');
                    }, 300);
                    if ($j('.blog_load_more_button span').attr('rel') > i) {
                        $j('.blog_load_more_button a').attr('href', $next_href);
                    } else {
                        $j('.blog_load_more_button').remove();
                    }
                });
                i++;
            });
        }
        $j(window).resize(function() {
            qodeResizeBlogMasonryGallery($j('.blog_holder_grid_sizer').width());
            container.isotope().isotope('layout');
            container.width(Math.round(container.parent().width()));
        });
    }
}

function initBlogGallery() {
    "use strict";
    if ($j('.blog_holder.blog_gallery, .blog_holder.blog_chequered').length) {
        qodeResizeBlogGallery($j('.blog_holder_grid_sizer').width());
        var container = $j('.blog_holder.blog_gallery, .blog_holder.blog_chequered');
        container.width(Math.round(container.parent().width()));
        container.isotope({
            itemSelector: 'article',
            resizable: false,
            masonry: {
                columnWidth: '.blog_holder_grid_sizer',
                gutter: '.blog_holder_grid_gutter'
            }
        });
        container.waitForImages(function() {
            container.animate({
                opacity: "1"
            }, 300, function() {
                container.isotope().isotope('layout');
            });
        });
        if (container.hasClass('masonry_infinite_scroll')) {
            container.infinitescroll({
                navSelector: '.blog_infinite_scroll_button span',
                nextSelector: '.blog_infinite_scroll_button span a',
                itemSelector: 'article',
                loading: {
                    finishedMsg: finished_text,
                    msgText: loading_text
                }
            }, function(newElements) {
                container.isotope('appended', $j(newElements));
                fitVideo();
                fitAudio();
                initFlexSlider();
                qodeResizeBlogGallery($j('.blog_holder_grid_sizer').width());
                setTimeout(function() {
                    container.isotope('layout');
                }, 300);
            });
        } else if (container.hasClass('masonry_load_more')) {
            var i = 1;
            $j('.blog_load_more_button a').off('click tap').on('click tap', function(e) {
                e.preventDefault();
                var link = $j(this).attr('href');
                var $content = '.masonry_load_more';
                var $anchor = '.blog_load_more_button a';
                var $next_href = $j($anchor).attr('href');
                $j.get(link + '', function(data) {
                    var $new_content = $j($content, data).wrapInner('').html();
                    $next_href = $j($anchor, data).attr('href');
                    container.append($j($new_content)).isotope('reloadItems').isotope({
                        sortBy: 'original-order'
                    });
                    fitVideo();
                    fitAudio();
                    initFlexSlider();
                    qodeResizeBlogGallery($j('.blog_holder_grid_sizer').width());
                    setTimeout(function() {
                        container.isotope('layout');
                    }, 300);
                    if ($j('.blog_load_more_button span').attr('rel') > i) {
                        $j('.blog_load_more_button a').attr('href', $next_href);
                    } else {
                        $j('.blog_load_more_button').remove();
                    }
                });
                i++;
            });
        }
        $j(window).resize(function() {
            qodeResizeBlogGallery($j('.blog_holder_grid_sizer').width());
            container.isotope().isotope('layout');
            container.width(Math.round(container.parent().width()));
        });
    }
}

function qodeResizeBlogMasonryGallery(size) {
    var rectangle_portrait = $j('.blog_holder.masonry_gallery .large-height');
    var rectangle_landscape = $j('.blog_holder.masonry_gallery .large-width');
    var square_big = $j('.blog_holder.masonry_gallery .large-width-height');
    var square_small = $j('.blog_holder.masonry_gallery .default');
    rectangle_portrait.css('height', 2 * size);
    rectangle_landscape.css('height', size);
    square_big.css('height', 2 * size);
    if (square_big.width() < 600) {
        square_big.css('height', square_big.width());
    }
    if ($window_width < 600) {
        rectangle_portrait.css('height', rectangle_portrait.width());
    }
    square_small.css('height', size);
}

function qodeResizeBlogGallery(size) {
    var element = $j('.blog_holder.blog_chequered .default');
    element.css('height', size);
}

function initSmallImageBlogHeight() {
    "use strict";
    if ($j('.blog_small_image').length) {
        $j('article').each(function() {
            $j(this).find('.post_text_inner').css('min-height', $j(this).find('.post_image').height() - 46);
        });
    }
}

function initQBlog() {
    "use strict";
    if ($j('.q_masonry_blog').length) {
        $j('.q_masonry_blog').each(function() {
            var thisItem = $j(this);
            var thisItemWidth = thisItem.width();
            if ($j('.full_width').length && !thisItem.parents('.grid_section').length) {
                thisItemWidth = $j('.full_width').width();
            }
            var $cols = 3;
            var screenSize = $j(window).width();
            if ($j('.full_width').length && !thisItem.parents('.grid_section').length) {
                if (screenSize < 601) {
                    $cols = 1;
                } else if (screenSize < 769) {
                    $cols = 1;
                } else if (screenSize < 783) {
                    $cols = 2;
                } else if (screenSize < 1000) {
                    $cols = 3;
                } else if (screenSize < 1384) {
                    $cols = 4;
                } else {
                    $cols = 5;
                }
            } else if ($j('.full_width').length && thisItem.parents('.grid_section').length) {
                if (thisItemWidth < 601) {
                    $cols = 1;
                    thisItem.children('article').css('width', '100%');
                } else if (thisItemWidth < 769) {
                    $cols = 2;
                    thisItem.children('article').css('width', '46.5%');
                } else {
                    $cols = 3;
                }
            } else if ($j('.content .container .container_inner.page_container_inner').length && thisItem.parents('.grid_section').length) {
                if (thisItemWidth < 421) {
                    $cols = 1;
                    thisItem.children('article').css('width', '100%');
                } else if (thisItemWidth < 769) {
                    $cols = 2;
                    thisItem.children('article').css('width', '46.5%');
                } else {
                    $cols = 3;
                }
            } else {
                if (thisItemWidth < 421) {
                    $cols = 1;
                } else if (thisItemWidth < 769) {
                    $cols = 2;
                } else {
                    $cols = 3;
                }
            }
            thisItem.isotope({
                itemSelector: 'article',
                resizable: false,
                masonry: {
                    columnWidth: thisItemWidth / $cols
                }
            });
            thisItem.animate({
                opacity: "1"
            }, 500);
        });
    }
}

function qodeBlogCompundMasonryGallery() {
    var blogGallery = $j('.qode_blog_masonry_gallery');
    var sizerWidth = blogGallery.find('.qode_blog_gallery_sizer').outerWidth();
    var size = sizerWidth + 8;
    var resizeMasonryImages = function() {
        sizerWidth = blogGallery.find('.qode_blog_gallery_sizer').outerWidth()
        size = sizerWidth + 8;
        var defaultItem = blogGallery.find('.qode_blog_gallery_item.default');
        var largeHeightItem = blogGallery.find('.qode_blog_img_large_height');
        var largeHeightWidthItem = blogGallery.find('.qode_blog_img_large_height_width');
        defaultItem.css('height', size);
        largeHeightItem.css('height', Math.round(2 * size));
        if ($window_width > 600) {
            largeHeightWidthItem.css('height', Math.round(2 * size));
        } else {
            largeHeightWidthItem.css('height', size);
        }
    };
    var initMasonryItems = function() {
        blogGallery.isotope({
            itemSelector: '.qode_blog_gallery_item',
            masonry: {
                columnWidth: '.qode_blog_gallery_sizer',
                gutter: '.qode_blog_gallery_gutter'
            }
        });
    };
    return {
        init: function() {
            if (blogGallery.length) {
                resizeMasonryImages();
                initMasonryItems();
                $j(window).resize(function() {
                    resizeMasonryImages();
                });
            }
        }
    };
}

function qodeBlogHeadlines() {
    "use strict";
    if ($j('.blog_headlines').length) {
        var $this = $j('.blog_headlines');
        var showTitles = function() {
            $this.bigtext({
                childSelector: '> article > h2',
                minfontsize: 20
            });
            $this.find('h2').appear(function() {
                $j(this).addClass('show');
            }, {
                accX: 0,
                accY: -100
            });
        };
        showTitles();
        if ($this.hasClass('blog_infinite_scroll')) {
            $this.infinitescroll({
                navSelector: '.blog_infinite_scroll_button span',
                nextSelector: '.blog_infinite_scroll_button span a',
                itemSelector: 'article',
                loading: {
                    finishedMsg: finished_text,
                    msgText: loading_text
                }
            }, function() {
                showTitles();
            });
        } else if ($this.hasClass('blog_load_more')) {
            var i = 1;
            $j('.blog_load_more_button a').off('click tap').on('click tap', function(e) {
                e.preventDefault();
                var link = $j(this).attr('href');
                var $content = '.blog_load_more';
                var $anchor = '.blog_load_more_button a';
                var $next_href = $j($anchor).attr('href');
                $j.get(link + '', function(data) {
                    var $new_content = $j($content, data).wrapInner('').html();
                    $next_href = $j($anchor, data).attr('href');
                    $this.append($j($new_content));
                    showTitles();
                    if ($j('.blog_load_more_button span').attr('rel') > i) {
                        $j('.blog_load_more_button a').attr('href', $next_href);
                    } else {
                        $j('.blog_load_more_button').remove();
                    }
                });
                i++;
            });
        }
    }
}
var timeOuts = [];

function initProgressBarsIcon() {
    "use strict";
    if ($j('.q_progress_bars_icons_holder').length) {
        $j('.q_progress_bars_icons_holder').each(function() {
            var $this = $j(this);
            $this.appear(function() {
                $this.find('.q_progress_bars_icons').css('opacity', '1');
                $this.find('.q_progress_bars_icons').each(function() {
                    var number = $j(this).find('.q_progress_bars_icons_inner').data('number');
                    var size = $j(this).find('.q_progress_bars_icons_inner').data('size');
                    if (size !== "") {
                        $j(this).find('.q_progress_bars_icons_inner.custom_size .bar').css({
                            'width': size + 'px',
                            'height': size + 'px'
                        });
                        $j(this).find('.q_progress_bars_icons_inner.custom_size .bar .fa-stack').css({
                            'font-size': size / 2 + 'px'
                        });
                    }
                    var bars = $j(this).find('.bar');
                    bars.each(function(i) {
                        if (i < number) {
                            var time = (i + 1) * 150;
                            timeOuts[i] = setTimeout(function() {
                                $j(bars[i]).addClass('active');
                            }, time);
                        }
                    });
                });
            }, {
                accX: 0,
                accY: -200
            });
        });
    }
}
(function($) {
    "use strict";
    var $window = $(window);
    $.fn.masonryParallax = function(speedFactor, outerHeight, startPosition) {
        var $this = $(this);
        var getHeight;
        var firstTop;
        var startPositionAdd = 0;
        firstTop = $this.offset().top;
        if (outerHeight) {
            getHeight = function(jqo) {
                return jqo.outerHeight(true);
            };
        } else {
            getHeight = function(jqo) {
                return jqo.height();
            };
        }
        if (startPosition != 0) {
            startPositionAdd = startPosition;
        }
        if (arguments.length < 1 || speedFactor === null) speedFactor = 0.1;
        if (arguments.length < 2 || outerHeight === null) outerHeight = true;
        var top = $this.offset().top;
        var height = getHeight($this);

        function update() {
            if (top + height < $scroll || top > $scroll + $window_height) {
                return;
            }
            $this.css('transform', 'translate3d(0px, ' + (Math.round((firstTop - height - $scroll) * speedFactor + startPositionAdd)) + 'px, 0px)');
        }
        $window.bind('scroll', update).resize(update);
        update();
    };
})(jQuery);

function initMasonryGallery() {
    "use strict";
    resizeMasonryGallery($j('.grid-sizer').width());
    if ($j('.masonry_gallery_holder').length) {
        $j('.masonry_gallery_holder').each(function() {
            var $this = $j(this);
            $this.waitForImages(function() {
                $this.animate({
                    opacity: 1
                });
                $this.isotope({
                    itemSelector: '.masonry_gallery_item',
                    masonry: {
                        columnWidth: '.grid-sizer'
                    }
                });
                $this.find('.masonry_gallery_item.parallax_item').each(function(i) {
                    $j(this).masonryParallax($this.data('parallax_item_speed'), true, $this.data('parallax_item_offset'));
                });
            });
        });
        $j(window).resize(function() {
            resizeMasonryGallery($j('.grid-sizer').width());
            $j('.masonry_gallery_holder').isotope('reloadItems');
        });
    }
}

function resizeMasonryGallery(size) {
    "use strict";
    var rectangle_portrait = $j('.masonry_gallery_holder .rectangle_portrait');
    var rectangle_landscape = $j('.masonry_gallery_holder .rectangle_landscape');
    var square_big = $j('.masonry_gallery_holder .square_big');
    var square_small = $j('.masonry_gallery_holder .square_small');
    rectangle_portrait.css('height', 2 * size);
    if (window.innerWidth < 600) {
        rectangle_landscape.css('height', size / 2);
    } else {
        rectangle_landscape.css('height', size);
    }
    square_big.css('height', 2 * size);
    if (window.innerWidth < 600) {
        square_big.css('height', square_big.width() + 20);
    }
    square_small.css('height', size);
}

function initMoreFacts() {
    "use strict";
    if ($j('.more_facts_holder').length) {
        $j('.more_facts_holder').each(function() {
            var $this = $j(this);
            var $more_label = 'More Facts';
            if ($j(this).find('.more_facts_button').data('morefacts') !== "") {
                $more_label = $j(this).find('.more_facts_button').data('morefacts');
            }
            var $less_label = 'Less Facts';
            if ($j(this).find('.more_facts_button').data('lessfacts') !== "") {
                $less_label = $j(this).find('.more_facts_button').data('lessfacts');
            }
            $this.find('.more_facts_button').on("mouseenter", function() {
                $j(this).css('color', $j(this).data('hovercolor'));
            }).on("mouseleave", function() {
                if ($this.find('.more_facts_outer').height() == 0) {
                    $j(this).css('color', $j(this).data('color'));
                }
            });
            var expandable_content_top_padding = 70;
            if ($this.find('.more_facts_inner').data('expandable_content_top_padding') !== "") {
                expandable_content_top_padding = $this.find('.more_facts_inner').data('expandable_content_top_padding');
                $this.find('.more_facts_inner').css({
                    'padding-top': expandable_content_top_padding
                });
            }
            var height = 0;
            var speed = 600;
            $this.find('.more_facts_button').click(function() {
                height = $this.find('.more_facts_inner').height() + expandable_content_top_padding;
                if (height > 0 && height < 601) {
                    speed = 800;
                } else if (height > 600 && height < 1201) {
                    speed = 1500;
                } else {
                    speed = 2100;
                }
                if (!$this.hasClass('more_fact_opened')) {
                    $this.addClass('more_fact_opened');
                    $this.find('.more_facts_fake_arrow').fadeIn(speed);
                    $this.find('.more_facts_outer').stop().animate({
                        'height': height
                    }, speed, function() {
                        if ($j('.parallax_section_holder').length) {
                            initParallax();
                        }
                    });
                    $j(this).find('.more_facts_button_text').text($less_label);
                    $j(this).find('.more_facts_button_arrow').addClass('rotate_arrow');
                } else {
                    $this.find('.more_facts_fake_arrow').fadeOut(speed);
                    $this.find('.more_facts_outer').stop().animate({
                        'height': '0px'
                    }, speed, function() {
                        if (!$this.find('.more_facts_button').is(":hover")) {
                            $this.find('.more_facts_button').css('color', $this.find('.more_facts_button').data('color'));
                        }
                        $this.removeClass('more_fact_opened');
                        if ($j('.parallax_section_holder').length) {
                            initParallax();
                        }
                    });
                    $j(this).find('.more_facts_button_text').text($more_label);
                    $j(this).find('.more_facts_button_arrow').removeClass('rotate_arrow');
                }
            });
        });
    }
}

function placeholderReplace() {
    "use strict";
    $j('#contact-form [placeholder]').focus(function() {
        var input = $j(this);
        if (input.val() === input.attr('placeholder')) {
            if (this.originalType) {
                this.type = this.originalType;
                delete this.originalType;
            }
            input.val('');
            input.removeClass('placeholder');
        }
    }).blur(function() {
        var input = $j(this);
        if (input.val() === '') {
            if (this.type === 'password') {
                this.originalType = this.type;
                this.type = 'text';
            }
            input.addClass('placeholder');
            input.val(input.attr('placeholder'));
        }
    }).blur();
    $j('#contact-form [placeholder]').parents('form').submit(function() {
        $j(this).find('[placeholder]').each(function() {
            var input = $j(this);
            if (input.val() === input.attr('placeholder')) {
                input.val('');
            }
        });
    });
}

function totop_button(a) {
    "use strict";
    var b = $j("#back_to_top");
    b.removeClass("off on");
    if (a === "on") {
        b.addClass("on");
    } else {
        b.addClass("off");
    }
}

function backButtonShowHide() {
    "use strict";
    $j(window).scroll(function() {
        var b = $j(this).scrollTop();
        var c = $j(this).height();
        var d;
        if (b > 0) {
            d = b + c / 2;
        } else {
            d = 1;
        }
        if (d < 1e3) {
            totop_button("off");
        } else {
            totop_button("on");
        }
    });
}

function backToTop() {
    "use strict";
    $j(document).on('click', '#back_to_top', function(e) {
        e.preventDefault();
        $j('body,html').animate({
            scrollTop: 0
        }, $j(window).scrollTop() / 3, 'linear');
    });
}

function initSteps() {
    "use strict";
    if ($j('.q_steps_holder').length) {
        $j('.q_steps_holder').each(function() {
            $j(this).appear(function() {
                $j(this).addClass('show');
            }, {
                accX: 0,
                accY: -200
            });
        });
    }
}

function initMessageHeight() {
    "use strict";
    if ($j('.q_message.with_icon').length) {
        $j('.q_message.with_icon').each(function() {
            if ($j(this).find('.message_text_holder').height() > $j(this).find('.q_message_icon_holder').height()) {
                $j(this).find('.q_message_icon_holder').height($j(this).find('.message_text').height());
            } else {
                $j(this).find('.message_text').height($j(this).find('.q_message_icon_holder').height());
            }
        });
    }
}

function initImageHover() {
    "use strict";
    if ($j('.image_hover').length) {
        $j('.image_hover').each(function() {
            $j(this).appear(function() {
                var default_visible_time = 300;
                var transition_delay = $j(this).attr('data-transition-delay');
                var real_transition_delay = default_visible_time + parseFloat(transition_delay);
                var object = $j(this);
                setTimeout(function() {
                    object.addClass('show');
                }, parseFloat(transition_delay));
                setTimeout(function() {
                    object.removeClass('show');
                }, real_transition_delay);
            }, {
                accX: 0,
                accY: -200
            });
        });
    }
}

function initProgressBarsVertical() {
    "use strict";
    if ($j('.q_progress_bars_vertical').length) {
        $j('.q_progress_bars_vertical').each(function() {
            $j(this).appear(function() {
                initToCounterVerticalProgressBar($j(this));
                var percentage = $j(this).find('.progress_content').data('percentage');
                $j(this).find('.progress_content').css('height', '0%');
                $j(this).find('.progress_content').animate({
                    height: percentage + '%'
                }, 1500);
            }, {
                accX: 0,
                accY: -200
            });
        });
    }
}

function initToCounterVerticalProgressBar($this) {
    "use strict";
    if ($this.find('.progress_number span').length) {
        $this.find('.progress_number span').each(function() {
            var $max = parseFloat($j(this).text());
            $j(this).countTo({
                from: 0,
                to: $max,
                speed: 1500,
                refreshInterval: 50
            });
        });
    }
}

function checkAnchorOnLoad() {
    "use strict";
    var hash = window.location.hash;
    var paspartuScrollAdd = $j('body').hasClass('paspartu_on_top_fixed') ? $window_width * paspartu_width : 0;
    var scrollToAmount;
    var top_header_height;
    if (hash !== "" && $j('[data-q_id="' + hash + '"]').length > 0) {
        if ($j('header.page_header').hasClass('fixed') && !$j('body').hasClass('vertical_menu_enabled')) {
            if ($j('header.page_header').hasClass('scroll_top')) {
                top_header_height = header_top_height;
            } else {
                top_header_height = 0;
            }
            if (!$j('header.page_header').hasClass('transparent') || $j('header.page_header').hasClass('scrolled_not_transparent')) {
                if (header_height - ($j('[data-q_id="' + hash + '"]').offset().top + top_header_height) / 4 >= min_header_height_scroll) {
                    var diff_of_header_and_section = $j('[data-q_id="' + hash + '"]').offset().top - header_height - paspartuScrollAdd;
                    scrollToAmount = diff_of_header_and_section + (diff_of_header_and_section / 4) + (diff_of_header_and_section / 16) + (diff_of_header_and_section / 64) + 1;
                } else {
                    if ($j('header.page_header').hasClass('centered_logo')) {
                        scrollToAmount = $j('[data-q_id="' + hash + '"]').offset().top - min_header_height_scroll - logo_height - 30 - paspartuScrollAdd;
                    } else {
                        scrollToAmount = $j('[data-q_id="' + hash + '"]').offset().top - min_header_height_scroll - paspartuScrollAdd;
                    }
                }
            } else {
                scrollToAmount = $j('[data-q_id="' + hash + '"]').offset().top - paspartuScrollAdd;
            }
        } else if ($j('header.page_header').hasClass('fixed_top_header') && !$j('body').hasClass('vertical_menu_enabled')) {
            if (!$j('header.page_header').hasClass('transparent') || $j('header.page_header').hasClass('scrolled_not_transparent')) {
                scrollToAmount = $j('[data-q_id="' + hash + '"]').offset().top - header_top_height - paspartuScrollAdd;
            } else {
                scrollToAmount = $j('[data-q_id="' + hash + '"]').offset().top - paspartuScrollAdd;
            }
        } else if ($j('header.page_header').hasClass('fixed_hiding') && !$j('body').hasClass('vertical_menu_enabled')) {
            if (!$j('header.page_header').hasClass('transparent') || $j('header.page_header').hasClass('scrolled_not_transparent')) {
                if ($j('[data-q_id="' + hash + '"]').offset().top - (header_height + logo_height / 2 + 40) <= scroll_amount_for_fixed_hiding) {
                    scrollToAmount = $j('[data-q_id="' + hash + '"]').offset().top - header_height - logo_height / 2 - 40 - paspartuScrollAdd;
                } else {
                    scrollToAmount = $j('[data-q_id="' + hash + '"]').offset().top - min_header_height_fixed_hidden - 40 - paspartuScrollAdd;
                }
            } else {
                scrollToAmount = $j('[data-q_id="' + hash + '"]').offset().top - paspartuScrollAdd;
            }
        } else if ($j('header.page_header').hasClass('stick') || $j('header.page_header').hasClass('stick_with_left_right_menu') && !$j('body').hasClass('vertical_menu_enabled')) {
            if (!$j('header.page_header').hasClass('transparent') || $j('header.page_header').hasClass('scrolled_not_transparent')) {
                if (sticky_amount >= $j('[data-q_id="' + hash + '"]').offset().top) {
                    scrollToAmount = $j('[data-q_id="' + hash + '"]').offset().top + 1 - paspartuScrollAdd;
                } else {
                    scrollToAmount = $j('[data-q_id="' + hash + '"]').offset().top - min_header_height_sticky - paspartuScrollAdd;
                }
            } else {
                scrollToAmount = $j('[data-q_id="' + hash + '"]').offset().top - paspartuScrollAdd;
            }
        } else {
            scrollToAmount = $j('[data-q_id="' + hash + '"]').offset().top - paspartuScrollAdd;
        }
        $j('html, body').animate({
            scrollTop: Math.round(scrollToAmount)
        }, 1500, function() {});
    }
    $j(".main_menu a, .vertical_menu a, .mobile_menu a").each(function() {
        var i = $j(this).prop("hash");
        if (i !== "" && ($j('[data-q_id="' + i + '"]').length > 0) && ($j('[data-q_id="' + i + '"]').offset().top >= $window_height) && $scroll === 0) {
            $j(this).parent().removeClass('active');
            $j(this).removeClass('current');
        }
    });
}

function changeActiveState(id) {
    "use strict";
    if ($j(".main_menu a[href*='#']").length) {
        $j('.main_menu a').parent().removeClass('active');
    }
    $j(".main_menu a").each(function() {
        var i = $j(this).prop("hash");
        if (i === id) {
            if ($j(this).closest('.second').length === 0) {
                $j(this).parent().addClass('active');
            } else {
                $j(this).closest('.second').parent().addClass('active');
            }
            $j('.main_menu a').removeClass('current');
            $j(this).addClass('current');
        }
    });
    if ($j(".vertical_menu a[href*='#']").length) {
        $j('.vertical_menu a').parent().removeClass('active');
    }
    $j(".vertical_menu a").each(function() {
        var i = $j(this).prop("hash");
        if (i === id) {
            if ($j(this).closest('.second').length === 0) {
                $j(this).parent().addClass('active');
            } else {
                $j(this).closest('.second').parent().addClass('active');
            }
            $j('.vertical_menu a').removeClass('current');
            $j(this).addClass('current');
        }
    });
    if ($j(".mobile_menu a[href*='#']").length) {
        $j('.mobile_menu a').parent().removeClass('active');
    }
    $j(".mobile_menu a").each(function() {
        var i = $j(this).prop("hash");
        if (i === id) {
            if ($j(this).closest('.sub_menu').length === 0) {
                $j(this).parent().addClass('active');
            } else {
                $j(this).closest('.sub_menu').parent().addClass('active');
            }
            $j('.mobile_menu a').removeClass('current');
            $j(this).addClass('current');
        }
    });
}

function checkAnchorOnScroll() {
    "use strict";
    if ($j('[data-q_id]').length && !$j('header.page_header').hasClass('regular')) {
        $j('[data-q_id]').waypoint(function(direction) {
            if (direction === 'down') {
                changeActiveState($j(this).data("q_id"));
            }
        }, {
            offset: '50%'
        });
        $j('[data-q_id]').waypoint(function(direction) {
            if (direction === 'up') {
                changeActiveState($j(this).data("q_id"));
            }
        }, {
            offset: function() {
                return -($j(this).outerHeight() - 150);
            }
        });
    }
}

function initHashClick() {
    "use strict";
    var $doc = $j('html, body');
    var paspartuScrollAdd = $j('body').hasClass('paspartu_on_top_fixed') ? $window_width * paspartu_width : 0;
    var scrollToAmount;
    $j(document).on("click", ".main_menu a, .vertical_menu a, .qbutton:not(.contact_form_button), .anchor, .widget li.anchor a", function() {
        var $this = $j(this);
        var hash = $j(this).prop("hash");
        var top_header_height;
        if ((hash !== "" && $j(this).attr('href').split('#')[0] === "") || (hash !== "" && $j(this).attr('href').split('#')[0] !== "" && hash === window.location.hash) || (hash !== "" && $j(this).attr('href').split('#')[0] === window.location.href.split('#')[0])) {
            if ($j('header.page_header').hasClass('fixed') && !$j('body').hasClass('vertical_menu_enabled')) {
                if ($j('header.page_header').hasClass('scroll_top')) {
                    top_header_height = header_top_height;
                } else {
                    top_header_height = 0;
                }
                if (!$j('header.page_header').hasClass('transparent') || $j('header.page_header').hasClass('scrolled_not_transparent')) {
                    if (header_height - ($j('[data-q_id="' + hash + '"]').offset().top + top_header_height) / 4 >= min_header_height_scroll) {
                        var diff_of_header_and_section = $j('[data-q_id="' + hash + '"]').offset().top - header_height - paspartuScrollAdd;
                        scrollToAmount = diff_of_header_and_section + (diff_of_header_and_section / 4) + (diff_of_header_and_section / 16) + (diff_of_header_and_section / 64) + 1;
                    } else {
                        if ($j('header.page_header').hasClass('centered_logo')) {
                            scrollToAmount = $j('[data-q_id="' + hash + '"]').offset().top - min_header_height_scroll - logo_height - paspartuScrollAdd - 30;
                        } else {
                            scrollToAmount = $j('[data-q_id="' + hash + '"]').offset().top - min_header_height_scroll - paspartuScrollAdd;
                        }
                    }
                } else {
                    scrollToAmount = $j('[data-q_id="' + hash + '"]').offset().top - paspartuScrollAdd;
                }
            } else if ($j('header.page_header').hasClass('fixed_top_header') && !$j('body').hasClass('vertical_menu_enabled')) {
                if (!$j('header.page_header').hasClass('transparent') || $j('header.page_header').hasClass('scrolled_not_transparent')) {
                    scrollToAmount = $j('[data-q_id="' + hash + '"]').offset().top - header_top_height - paspartuScrollAdd;
                } else {
                    scrollToAmount = $j('[data-q_id="' + hash + '"]').offset().top - paspartuScrollAdd;
                }
            } else if ($j('header.page_header').hasClass('fixed_hiding') && !$j('body').hasClass('vertical_menu_enabled')) {
                if (!$j('header.page_header').hasClass('transparent') || $j('header.page_header').hasClass('scrolled_not_transparent')) {
                    if ($j('[data-q_id="' + hash + '"]').offset().top - (header_height + logo_height / 2 + 40) <= scroll_amount_for_fixed_hiding) {
                        scrollToAmount = $j('[data-q_id="' + hash + '"]').offset().top - header_height - logo_height / 2 - 40 - paspartuScrollAdd;
                    } else {
                        scrollToAmount = $j('[data-q_id="' + hash + '"]').offset().top - min_header_height_fixed_hidden - 40 - paspartuScrollAdd;
                    }
                } else {
                    scrollToAmount = $j('[data-q_id="' + hash + '"]').offset().top - paspartuScrollAdd;
                }
            } else if ($j('header.page_header').hasClass('stick') || $j('header.page_header').hasClass('stick_with_left_right_menu') && !$j('body').hasClass('vertical_menu_enabled')) {
                if (!$j('header.page_header').hasClass('transparent') || $j('header.page_header').hasClass('scrolled_not_transparent')) {
                    if (sticky_amount >= $j('[data-q_id="' + hash + '"]').offset().top) {
                        scrollToAmount = $j('[data-q_id="' + hash + '"]').offset().top + 1 - paspartuScrollAdd;
                    } else {
                        scrollToAmount = $j('[data-q_id="' + hash + '"]').offset().top - min_header_height_sticky - paspartuScrollAdd;
                    }
                } else {
                    scrollToAmount = $j('[data-q_id="' + hash + '"]').offset().top - paspartuScrollAdd;
                }
            } else {
                scrollToAmount = $j('[data-q_id="' + hash + '"]').offset().top - paspartuScrollAdd;
            }
            if ($j('[data-q_id="' + hash + '"]').length > 0) {
                $doc.stop().animate({
                    scrollTop: Math.round(scrollToAmount)
                }, 1500, function() {
                    anchorActiveState($this);
                });
            }
            if (history.pushState) {
                history.pushState(null, null, hash);
            }
            return false;
        }
    });
    $j(document).on("click", ".mobile_menu a", function() {
        var $this = $j(this);
        var hash = $j(this).prop("hash");
        if ((hash !== "" && $j(this).attr('href').split('#')[0] === "") || (hash !== "" && $j(this).attr('href').split('#')[0] !== "" && hash === window.location.hash) || (hash !== "" && $j(this).attr('href').split('#')[0] === window.location.href.split('#')[0])) {
            if ($j('[data-q_id="' + hash + '"]').length > 0) {
                $doc.animate({
                    scrollTop: Math.round($j('[data-q_id="' + hash + '"]').offset().top - $j('.mobile_menu').height())
                }, 500, function() {
                    anchorActiveState($this);
                });
            }
            if (history.pushState) {
                history.pushState(null, null, hash);
            }
            return false;
        }
    });
}

function countClientsPerRow() {
    "use strict";
    if ($j('.qode_clients').length) {
        $j('.qode_clients').each(function() {
            var $clients = $j(this);
            var qode_clients_height = $clients.height();
            var qode_clients_width = $clients.width();
            var maxHeightClient;
            var clientWidth = $clients.find('.qode_client_holder').width();
            var countClient = $clients.find('.qode_client_holder').length;
            $clients.find('.qode_client_holder').each(function() {
                maxHeightClient = maxHeightClient > $j(this).height() ? maxHeightClient : $j(this).height();
            });
            maxHeightClient = maxHeightClient + 35;
            var numberOfRows = Math.ceil(qode_clients_height / maxHeightClient);
            var numberOfClientsPerRow = Math.ceil(qode_clients_width / clientWidth);
            var numberOffullRows = Math.floor(countClient / numberOfClientsPerRow);
            var numberOfClientsInLastRow = countClient - (numberOfClientsPerRow * numberOffullRows);
            if (numberOfClientsInLastRow === 0) {
                numberOfClientsInLastRow = numberOfClientsPerRow;
            }
            $clients.find(".qode_client_holder").removeClass('border-bottom-none');
            var item_start_from = countClient - numberOfClientsInLastRow - 1;
            $clients.find(".qode_client_holder:gt(" + item_start_from + ")").addClass('border-bottom-none');
        });
    }
}

function animatedTextIconHeight() {
    "use strict";
    if ($j('.animated_icons_with_text').length) {
        var $icons = $j('.animated_icons_with_text');
        var maxHeight;
        $icons.find('.animated_text p').each(function() {
            maxHeight = maxHeight > $j(this).height() ? maxHeight : $j(this).height();
        });
        if (maxHeight < 155) {
            maxHeight = 155;
        }
        $icons.find('.animated_icon_with_text_inner').height(maxHeight);
    }
}

function countAnimatedTextIconPerRow() {
    "use strict";
    if ($j('.animated_icons_with_text').length) {
        $j('.animated_icons_with_text').each(function() {
            var $icons = $j(this);
            var qode_icons_height = $icons.height();
            var qode_icons_width = $icons.width();
            var maxHeightIcons;
            var iconWidth = $icons.find('.animated_icon_with_text_holder').width() + 1;
            var countIcons = $icons.find('.animated_icon_with_text_holder').length;
            $icons.find('.animated_icon_with_text_holder').each(function() {
                maxHeightIcons = maxHeightIcons > $j(this).height() ? maxHeightIcons : $j(this).height();
            });
            maxHeightIcons = maxHeightIcons + 30;
            var numberOfIconsPerRow = Math.ceil((qode_icons_width / iconWidth));
            var numberOffullRows = Math.floor(countIcons / numberOfIconsPerRow);
            var numberOfIconsInLastRow = countIcons - (numberOfIconsPerRow * numberOffullRows);
            if (numberOfIconsInLastRow === 0) {
                numberOfIconsInLastRow = numberOfIconsPerRow;
            }
            $icons.find(".animated_icon_with_text_holder").removeClass('border-bottom-none');
            var item_start_from = countIcons - numberOfIconsInLastRow - 1;
            $icons.find(".animated_icon_with_text_holder:gt(" + item_start_from + ")").addClass('border-bottom-none');
        });
    }
}

function anchorActiveState(me) {
    if (me.closest('.main_menu').length > 0) {
        $j('.main_menu a').parent().removeClass('active');
    }
    if (me.closest('.vertical_menu').length > 0) {
        $j('.vertical_menu a').parent().removeClass('active');
    }
    if (me.closest('.second').length === 0) {
        me.parent().addClass('active');
    } else {
        me.closest('.second').parent().addClass('active');
    }
    if (me.closest('.mobile_menu').length > 0) {
        $j('.mobile_menu a').parent().removeClass('active');
        me.parent().addClass('active');
    }
    $j('.mobile_menu a, .main_menu a, .vertical_menu a').removeClass('current');
    me.addClass('current');
}

function initVideoBackground() {
    "use strict";
    $j('.video-wrap .video').mediaelementplayer({
        enableKeyboard: false,
        iPadUseNativeControls: false,
        pauseOtherPlayers: false,
        iPhoneUseNativeControls: false,
        AndroidUseNativeControls: false
    });
    if (navigator.userAgent.match(/(Android|iPod|iPhone|iPad|IEMobile|Opera Mini)/)) {
        initVideoBackgroundSize();
        $j('.mobile-video-image').show();
        $j('.video-wrap').remove();
    }
}

function initVideoBackgroundSize() {
    "use strict";
    $j('.section .video-wrap').each(function(i) {
        var $sectionWidth = $j(this).closest('.section').outerWidth();
        $j(this).width($sectionWidth);
        var $sectionHeight = $j(this).closest('.section').outerHeight();
        min_w = vid_ratio * ($sectionHeight + 20);
        $j(this).height($sectionHeight);
        var scale_h = $sectionWidth / video_width_original;
        var scale_v = ($sectionHeight - header_height) / video_height_original;
        var scale = scale_v;
        if (scale_h > scale_v)
            scale = scale_h;
        if (scale * video_width_original < min_w) {
            scale = min_w / video_width_original;
        }
        $j(this).find('video, .mejs-overlay, .mejs-poster').width(Math.ceil(scale * video_width_original + 2));
        $j(this).find('video, .mejs-overlay, .mejs-poster').height(Math.ceil(scale * video_height_original + 2));
        $j(this).scrollLeft(($j(this).find('video').width() - $sectionWidth) / 2);
        $j(this).find('.mejs-overlay, .mejs-poster').scrollTop(($j(this).find('video').height() - ($sectionHeight)) / 2);
        $j(this).scrollTop(($j(this).find('video').height() - ($sectionHeight)) / 2);
    });
    $j('.carousel .item .video .video-wrap').each(function(i) {
        var $slideWidth = $j(window).width();
        $j(this).width($slideWidth);
        var mob_header = $j(window).width() < 1000 ? $j('header.page_header').height() - 6 : 0;
        var $slideHeight = $j(this).closest('.carousel.slide').height() - mob_header;
        min_w = vid_ratio * ($slideHeight + 20);
        $j(this).height($slideHeight);
        var scale_h = $slideWidth / video_width_original;
        var scale_v = ($slideHeight - header_height) / video_height_original;
        var scale = scale_v;
        if (scale_h > scale_v)
            scale = scale_h;
        if (scale * video_width_original < min_w) {
            scale = min_w / video_width_original;
        }
        $j(this).find('video, .mejs-overlay, .mejs-poster').width(Math.ceil(scale * video_width_original + 2));
        $j(this).find('video, .mejs-overlay, .mejs-poster').height(Math.ceil(scale * video_height_original + 2));
        $j(this).scrollLeft(($j(this).find('video').width() - $slideWidth) / 2);
        $j(this).find('.mejs-overlay, .mejs-poster').scrollTop(($j(this).find('video').height() - ($slideHeight)) / 2);
        $j(this).scrollTop(($j(this).find('video').height() - ($slideHeight)) / 2);
    });
    $j('.portfolio_single .video .video-wrap, .blog_holder .video .video-wrap').each(function(i) {
        var $this = $j(this);
        var $videoWidth = $j(this).closest('.video').outerWidth();
        $j(this).width($videoWidth);
        var $videoHeight = ($videoWidth * 9) / 16;
        if (navigator.userAgent.match(/(Android|iPod|iPhone|iPad|IEMobile|Opera Mini)/)) {
            $this.parent().width($videoWidth);
            $this.parent().height($videoHeight);
        }
        min_w = vid_ratio * ($videoHeight + 20);
        $j(this).height($videoHeight);
        var scale_h = $videoWidth / video_width_original;
        var scale_v = ($videoHeight - header_height) / video_height_original;
        var scale = scale_v;
        if (scale_h > scale_v)
            scale = scale_h;
        if (scale * video_width_original < min_w) {
            scale = min_w / video_width_original;
        }
        $j(this).find('video, .mejs-overlay, .mejs-poster').width(Math.ceil(scale * video_width_original + 2));
        $j(this).find('video, .mejs-overlay, .mejs-poster').height(Math.ceil(scale * video_height_original + 2));
        $j(this).scrollLeft(($j(this).find('video').width() - $videoWidth) / 2);
        $j(this).find('.mejs-overlay, .mejs-poster').scrollTop(($j(this).find('video').height() - ($videoHeight)) / 2);
        $j(this).scrollTop(($j(this).find('video').height() - ($videoHeight)) / 2);
    });
}

function initIconWithTextAnimation() {
    "use strict";
    if ($j('.q_icon_animation').length > 0 && $j('.no_animation_on_touch').length === 0) {
        $j('.q_icon_animation').each(function() {
            $j(this).appear(function() {
                $j(this).addClass('q_show_animation');
            }, {
                accX: 0,
                accY: -200
            });
        });
    }
}

function initCheckSafariBrowser() {
    "use strict";
    if (navigator.userAgent.indexOf('Safari') !== -1 && navigator.userAgent.indexOf('Chrome') === -1) {
        $j('body').addClass('safari_browser');
    }
}

function initSearchButton() {
    if ($j('.search_slides_from_window_top').length) {
        $j('.search_slides_from_window_top').click(function(e) {
            e.preventDefault();
            if ($j('html').hasClass('touch')) {
                if ($j('.qode_search_form').height() == "0") {
                    $j('.qode_search_form input[type="text"]').onfocus = function() {
                        window.scrollTo(0, 0);
                        document.body.scrollTop = 0;
                    };
                    $j('.qode_search_form input[type="text"]').onclick = function() {
                        window.scrollTo(0, 0);
                        document.body.scrollTop = 0;
                    };
                    $j('.header_top_bottom_holder').css('top', '50px');
                    $j('.qode_search_form').css('height', '50px');
                    $j('.content_inner').css('margin-top', '50px');
                    if ($scroll < 34) {
                        $j('header.page_header').css('top', '0');
                    }
                } else {
                    $j('.qode_search_form').css('height', '0');
                    $j('.header_top_bottom_holder').css('top', '0');
                    $j('.content_inner').css('margin-top', '0');
                    if ($scroll < 34) {
                        $j('header.page_header').css('top', -$scroll);
                    }
                }
                $j(window).scroll(function() {
                    if ($j('.qode_search_form').height() != "0" && $scroll > 50) {
                        $j('.qode_search_form').css('height', '0');
                        $j('.header_top_bottom_holder').css('top', '0');
                        $j('.content_inner').css('margin-top', '0');
                    }
                });
                $j('.qode_search_close').click(function(e) {
                    e.preventDefault();
                    $j('.qode_search_form').css('height', '0');
                    $j('.header_top_bottom_holder').css('top', '0');
                    $j('.content_inner').css('margin-top', '0');
                    if ($scroll < 34) {
                        $j('header.page_header').css('top', -$scroll);
                    }
                });
            } else {
                if ($j('.title').hasClass('has_fixed_background')) {
                    var yPos = parseInt($j('.title.has_fixed_background').css('backgroundPosition').split(" ")[1]);
                } else {
                    var yPos = 0;
                }
                if ($j('.qode_search_form').height() == "0") {
                    $j('.qode_search_form input[type="text"]').focus();
                    $j('.header_top_bottom_holder').stop().animate({
                        top: "50px"
                    }, 150);
                    $j('.qode_search_form').stop().animate({
                        height: "50px"
                    }, 150);
                    $j('.content_inner').stop().animate({
                        marginTop: "50px"
                    }, 150);
                    if ($scroll < 34) {
                        $j('header.page_header').stop().animate({
                            top: 0
                        }, 150);
                    }
                    $j('.title.has_fixed_background').animate({
                        'background-position-y': (yPos + 50) + 'px'
                    }, 150);
                } else {
                    $j('.qode_search_form').stop().animate({
                        height: "0"
                    }, 150);
                    $j('.header_top_bottom_holder').stop().animate({
                        top: "0px"
                    }, 150);
                    $j('.content_inner').stop().animate({
                        marginTop: "0"
                    }, 150);
                    if ($scroll < 34) {
                        $j('header.page_header').stop().animate({
                            top: -$scroll
                        }, 150);
                    }
                    $j('.title.has_fixed_background').animate({
                        'background-position-y': (yPos - 50) + 'px'
                    }, 150);
                }
                $j(window).scroll(function() {
                    if ($j('.qode_search_form').height() != "0" && $scroll > 50) {
                        $j('.qode_search_form').stop().animate({
                            height: "0"
                        }, 150);
                        $j('.header_top_bottom_holder').stop().animate({
                            top: "0px"
                        }, 150);
                        $j('.content_inner').stop().animate({
                            marginTop: "0"
                        }, 150);
                        $j('.title.has_fixed_background').css('backgroundPosition', 'center ' + (yPos) + 'px');
                    }
                });
                $j('.qode_search_close').click(function(e) {
                    e.preventDefault();
                    $j('.qode_search_form').stop().animate({
                        height: "0"
                    }, 150);
                    $j('.content_inner').stop().animate({
                        marginTop: "0"
                    }, 150);
                    $j('.header_top_bottom_holder').stop().animate({
                        top: "0px"
                    }, 150);
                    if ($scroll < 34) {
                        $j('header.page_header').stop().animate({
                            top: -$scroll
                        }, 150);
                    }
                    $j('.title.has_fixed_background').animate({
                        'background-position-y': (yPos) + 'px'
                    }, 150);
                });
            }
        });
    }
    if ($j('.search_slides_from_header_bottom').length) {
        $j('.search_slides_from_header_bottom').click(function(e) {
            e.preventDefault();
            if ($j('.qode_search_form_2').hasClass('animated')) {
                $j('.qode_search_form_2').removeClass('animated');
                $j('.qode_search_form_2').css('bottom', '0');
            } else {
                $j('.qode_search_form input[type="text"]').focus();
                $j('.qode_search_form_2').addClass('animated');
                var search_form_height = $j('.qode_search_form_2').height();
                $j('.qode_search_form_2').css('bottom', -search_form_height);
            }
            $j('.qode_search_form_2').addClass('disabled');
            $j('.qode_search_form_2 input[type="submit"]').attr('disabled', 'disabled');
            if (($j('.qode_search_form_2 .qode_search_field').val() !== '') && ($j('.qode_search_form_2 .qode_search_field').val() !== ' ')) {
                $j('.qode_search_form_2 input[type="submit"]').removeAttr('disabled');
                $j('.qode_search_form_2').removeClass('disabled');
            } else {
                $j('.qode_search_form_2').addClass('disabled');
                $j('.qode_search_form_2 input[type="submit"]').attr('disabled', 'disabled');
            }
            $j('.qode_search_form_2 .qode_search_field').keyup(function() {
                if (($j(this).val() !== '') && ($j(this).val() != ' ')) {
                    $j('.qode_search_form_2 input[type="submit"]').removeAttr('disabled');
                    $j('.qode_search_form_2').removeClass('disabled');
                } else {
                    $j('.qode_search_form_2 input[type="submit"]').attr('disabled', 'disabled');
                    $j('.qode_search_form_2').addClass('disabled');
                }
            });
            $j('.content, footer').click(function(e) {
                e.preventDefault();
                $j('.qode_search_form_2').removeClass('animated');
                $j('.qode_search_form_2').css('bottom', '0');
            });
        });
    }
    if ($j('.search_covers_header').length) {
        $j('.search_covers_header').click(function(e) {
            e.preventDefault();
            if ($j(".search_covers_only_bottom").length) {
                var headerHeight = $j('.header_bottom').height();
            } else {
                if ($j(".fixed_top_header").length) {
                    var headerHeight = $j('.top_header').height();
                } else {
                    var headerHeight = $j('.header_top_bottom_holder').height();
                }
            }
            $j('.qode_search_form_3 .form_holder_outer').height(headerHeight);
            if ($j(".search_covers_only_bottom").length) {
                $j('.qode_search_form_3').css('bottom', 0);
                $j('.qode_search_form_3').css('top', 'auto');
            }
            $j('.qode_search_form_3').stop(true).fadeIn(600, 'easeOutExpo');
            $j('.qode_search_form_3 input[type="text"]').focus();
            $j(window).scroll(function() {
                if ($j(".search_covers_only_bottom").length) {
                    var headerHeight = $j('.header_bottom').height();
                } else {
                    if ($j(".fixed_top_header").length) {
                        var headerHeight = $j('.top_header').height();
                    } else {
                        var headerHeight = $j('.header_top_bottom_holder').height();
                    }
                }
                $j('.qode_search_form_3 .form_holder_outer').height(headerHeight);
            });
            $j('.qode_search_close, .content, footer').click(function(e) {
                e.preventDefault();
                $j('.qode_search_form_3').stop(true).fadeOut(450, 'easeOutExpo');
            });
            $j('.qode_search_form_3').blur(function(e) {
                $j('.qode_search_form_3').stop(true).fadeOut(450, 'easeOutExpo');
            });
        });
    }
    if ($j('.fullscreen_search').length) {
        if ($j(".fullscreen_search_holder.from_circle").length) {
            $j('.fullscreen_search').on('click', function(e) {
                e.preventDefault();
                if ($j('.fullscreen_search_overlay').hasClass('animate')) {
                    $j('.fullscreen_search_overlay').removeClass('animate');
                    $j('.fullscreen_search_holder').css('opacity', '0');
                    $j('.fullscreen_search_close').css('opacity', '0');
                    $j('.fullscreen_search_close').css('visibility', 'hidden');
                    $j('.fullscreen_search').css('opacity', '1');
                    $j('.fullscreen_search_holder').css('display', 'none');
                } else {
                    $j('.fullscreen_search_overlay').addClass('animate');
                    $j('.fullscreen_search_holder').css('display', 'block');
                    setTimeout(function() {
                        $j('.fullscreen_search_holder').css('opacity', '1');
                        $j('.fullscreen_search_close').css('opacity', '1');
                        $j('.fullscreen_search_close').css('visibility', 'visible');
                        $j('.fullscreen_search').css('opacity', '0');
                    }, 200);
                }
            });
            $j('.fullscreen_search_close').on('click', function(e) {
                e.preventDefault();
                $j('.fullscreen_search_overlay').removeClass('animate');
                $j('.fullscreen_search_holder').css('opacity', '0');
                $j('.fullscreen_search_close').css('opacity', '0');
                $j('.fullscreen_search_close').css('visibility', 'hidden');
                $j('.fullscreen_search').css('opacity', '1');
                $j('.fullscreen_search_holder').css('display', 'none');
            });
        }
        if ($j(".fullscreen_search_holder.fade").length) {
            $j('.fullscreen_search').on('click', function(e) {
                e.preventDefault();
                if ($j('.fullscreen_search_holder').hasClass('animate')) {
                    $j('body').removeClass('fullscreen_search_opened');
                    $j('.fullscreen_search_holder').removeClass('animate');
                    $j('body').removeClass('search_fade_out');
                    $j('body').removeClass('search_fade_in');
                } else {
                    $j('body').addClass('fullscreen_search_opened');
                    $j('body').removeClass('search_fade_out');
                    $j('body').addClass('search_fade_in');
                    $j('.fullscreen_search_holder').addClass('animate');
                }
            });
            $j('.fullscreen_search_close').on('click', function(e) {
                e.preventDefault();
                $j('body').removeClass('fullscreen_search_opened');
                $j('.fullscreen_search_holder').removeClass('animate');
                $j('body').removeClass('search_fade_in');
                $j('body').addClass('search_fade_out');
            });
        }
        $j('.fullscreen_search_holder .search_field').focus(function() {
            $j('.fullscreen_search_holder .field_holder .line').css("width", "100%");
        });
        $j('.fullscreen_search_holder .search_field').blur(function() {
            $j('.fullscreen_search_holder .field_holder .line').css("width", "0");
        });
        $j(window).scroll(function() {
            var bottom_height = $j(".page_header .header_bottom").height();
            if ($j(".page_header").hasClass("sticky")) {
                $j(".fullscreen_search_holder .side_menu_button").css("height", bottom_height);
                $j(".fullscreen_search_holder .close_container").css("top", "0");
            } else if ($j(".page_header").hasClass("fixed")) {
                $j(".fullscreen_search_holder .side_menu_button").css("height", bottom_height);
            } else {
                $j(".fullscreen_search_holder .side_menu_button").css("height", "");
                $j(".fullscreen_search_holder .close_container").css("top", "");
            }
        });
    }
    if ($j('.qode_search_submit').length) {
        $j('.qode_search_submit').click(function(e) {
            e.preventDefault();
            e.stopPropagation();
            var searchForm = $j(this).parents('form').first();
            searchForm.submit();
        });
    }
}

function updateShoppingCart() {
    "use strict";
    $j('body').bind('added_to_cart', add_to_cart);

    function add_to_cart(event, parts, hash) {
        var miniCart = $j('.shopping_cart_header');
        if (parts['div.widget_shopping_cart_content']) {
            var $cartContent = jQuery(parts['div.widget_shopping_cart_content']),
                $itemsList = $cartContent.find('.cart_list'),
                $total = $cartContent.find('.total').contents(':not(strong)').text();
            miniCart.find('.shopping_cart_dropdown_inner').html('').append($itemsList);
            miniCart.find('.total span').html('').append($total);
        }
    }
}

function setContentBottomMargin() {
    if ($j('.uncover').length) {
        $j('.content').css('margin-bottom', $j('footer').height());
    }
}

function footerWidth() {
    "use strict";
    if ($j('.uncover').length && $j('body').hasClass('vertical_menu_enabled') && $window_width > 1000) {
        $j('.uncover').width($window_width - $j('.vertical_menu_area').width());
    } else {
        $j('.uncover').css('width', '100%');
    }
}

function initCoverBoxes() {
    if ($j('.cover_boxes').length) {
        $j('.cover_boxes').each(function() {
            var active_element = 0;
            var data_active_element = 1;
            if (typeof $j(this).data('active-element') !== 'undefined' && $j(this).data('active-element') !== false) {
                data_active_element = parseFloat($j(this).data('active-element'));
                active_element = data_active_element - 1;
            }
            var number_of_columns = 3;
            active_element = data_active_element > number_of_columns ? 0 : active_element;
            $j(this).find('li').eq(active_element).addClass('act');
            var cover_boxed = $j(this);
            $j(this).find('li').each(function() {
                $j(this).hover(function() {
                    $j(cover_boxed).find('li').removeClass('act');
                    $j(this).addClass('act');
                });
            });
        });
    }
}

function createContentMenu() {
    "use strict";
    var content_menu = $j(".content_menu");
    content_menu.each(function() {
        if ($j(this).find('ul').length === 0) {
            if ($j(this).css('background-color') !== "") {
                var background_color = $j(this).css('background-color');
            }
            var content_menu_ul = $j("<ul class='menu'></ul>");
            content_menu_ul.appendTo($j(this));
            var sections = $j(this).siblings('.in_content_menu');
            if (sections.length) {
                sections.each(function() {
                    var section_href = $j(this).data("q_id");
                    var section_title = $j(this).data('q_title');
                    var section_icon = $j(this).data('q_icon');
                    var li = $j("<li />");
                    var icon = $j("<i />", {
                        "class": 'fa ' + section_icon
                    });
                    var link = $j("<a />", {
                        "href": section_href,
                        "html": "<span>" + section_title + "</span>"
                    });
                    var arrow;
                    if (background_color !== "") {
                        arrow = $j("<div />", {
                            "class": 'arrow',
                            "style": 'border-color: ' + background_color + ' transparent transparent transparent'
                        });
                    } else {
                        arrow = $j("<div />", {
                            "class": 'arrow'
                        });
                    }
                    icon.prependTo(link);
                    link.appendTo(li);
                    arrow.appendTo(li);
                    li.appendTo(content_menu_ul);
                });
            }
        }
    });
}

function createSelectContentMenu() {
    "use strict";
    var content_menu = $j(".content_menu");
    content_menu.each(function() {
        var $this = $j(this);
        var $menu_select = $j("<ul></ul>");
        $menu_select.appendTo($j(this).find('.nav_select_menu'));
        $j(this).find("ul.menu li a").each(function() {
            var menu_url = $j(this).attr("href");
            var menu_text = $j(this).text();
            var menu_icon = $j(this).find('i').clone();
            if ($j(this).parents("li").length === 2) {
                menu_text = "&nbsp;&nbsp;&nbsp;" + menu_text;
            }
            if ($j(this).parents("li").length === 3) {
                menu_text = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + menu_text;
            }
            if ($j(this).parents("li").length > 3) {
                menu_text = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + menu_text;
            }
            var li = $j("<li />");
            var link = $j("<a />", {
                "href": menu_url,
                "html": menu_text
            });
            menu_icon.prependTo(link);
            link.appendTo(li);
            li.appendTo($menu_select);
        });
        $this.find(".nav_select_button").on('click', function() {
            if ($this.find('.nav_select_menu ul').is(":visible")) {
                $this.find('.nav_select_menu ul').slideUp();
            } else {
                $this.find('.nav_select_menu ul').slideDown();
            }
            return false;
        });
        $this.find(".nav_select_menu ul li a").on('click', function() {
            $this.find('.nav_select_menu ul').slideUp();
            var $link = $j(this);
            var $target = $link.attr("href");
            var targetOffset = $j("div.wpb_row[data-q_id='" + $target + "'],section.parallax_section_holder[data-q_id='" + $target + "']").offset().top;
            $j('html,body').stop().animate({
                scrollTop: targetOffset
            }, 500, 'swing', function() {
                $j('nav.content_menu ul li').removeClass('active');
                $link.parent().addClass('active');
            });
            return false;
        });
    });
}

function contentMenuPosition() {
    "use strict";
    if ($j('nav.content_menu').length) {
        if (content_menu_position > sticky_amount) {
            var x = min_header_height_sticky;
        } else {
            var x = 0;
        }
        if (content_menu_position - x - content_menu_top_add - $scroll <= 0 && ($j('header').hasClass('stick') || $j('header').hasClass('stick_with_left_right_menu'))) {
            if (content_menu_position < sticky_amount) {
                if ($scroll > sticky_amount) {
                    $j('nav.content_menu').css({
                        'position': 'fixed',
                        'top': min_header_height_sticky + content_menu_top_add
                    }).addClass('fixed');
                } else {
                    $j('nav.content_menu').css({
                        'position': 'fixed',
                        'top': 0,
                        transition: 'none'
                    }).addClass('fixed');
                }
            } else {
                $j('nav.content_menu').css({
                    'position': 'fixed',
                    'top': min_header_height_sticky + content_menu_top_add
                }).addClass('fixed');
            }
            $j('header.sticky').addClass('no_shadow');
            $j('.content > .content_inner > .container > .container_inner').css('margin-top', content_line_height);
            $j('.content > .content_inner > .full_width').css('margin-top', content_line_height);
        } else if (content_menu_position - content_menu_top - content_menu_top_add - $scroll <= 0 && !($j('header').hasClass('stick'))) {
            $j('nav.content_menu').css({
                'position': 'fixed',
                'top': content_menu_top + content_menu_top_add
            }).addClass('fixed');
            $j('.content > .content_inner > .container > .container_inner').css('margin-top', content_line_height);
            $j('.content > .content_inner > .full_width').css('margin-top', content_line_height);
        } else {
            $j('nav.content_menu').css({
                'position': 'relative',
                'top': '0px'
            }).removeClass('fixed');
            $j('header.sticky').removeClass('no_shadow');
            $j('.content > .content_inner > .container > .container_inner').css('margin-top', '0px');
            $j('.content > .content_inner > .full_width').css('margin-top', '0px');
        }
        $j('.content .in_content_menu').waypoint(function(direction) {
            var $active = $j(this);
            var id = $active.data("q_id");
            $j("nav.content_menu.fixed li a").each(function() {
                var i = $j(this).attr("href");
                if (i === id) {
                    $j(this).parent().addClass('active');
                } else {
                    $j(this).parent().removeClass('active');
                }
            });
        }, {
            offset: '150'
        });
    }
}

function contentMenuCheckLastSection() {
    "use strict";
    if ($j('nav.content_menu').length) {
        if ($j('.content .in_content_menu').length) {
            var last_from_top = $j('.content .in_content_menu:last').offset().top + $j('.content .in_content_menu:last').height();
            var first_from_top = $j('.content .in_content_menu:first').offset().top - content_menu_top - content_menu_top_add - 100;
            if (last_from_top < $scroll) {
                $j("nav.content_menu.fixed li").removeClass('active');
            }
            if (first_from_top > $scroll) {
                $j('nav.content_menu li:first, nav.content_menu ul.menu li:first').removeClass('active');
            }
        }
    }
}

function contentMenuScrollTo() {
    "use strict";
    if ($j('nav.content_menu').length) {
        $j("nav.content_menu ul.menu li a").on('click', function(e) {
            e.preventDefault();
            var $this = $j(this);
            if ($j(this).parent().hasClass('active')) {
                return false;
            }
            var $target = $this.attr("href");
            var targetOffset = $j("div.wpb_row[data-q_id='" + $target + "'],section.parallax_section_holder[data-q_id='" + $target + "']").offset().top - content_line_height - content_menu_top - content_menu_top_add;
            $j('html,body').stop().animate({
                scrollTop: targetOffset
            }, 500, 'swing', function() {
                $j('nav.content_menu ul li').removeClass('active');
                $this.parent().addClass('active');
            });
            return false;
        });
    }
}

function initButtonHover() {
    if ($j('.qbutton').length) {
        $j('.qbutton').each(function() {
            if (typeof $j(this).data('hover-background-color') !== 'undefined' && $j(this).data('hover-background-color') !== false) {
                var hover_background_color = $j(this).data('hover-background-color');
                var initial_background_color = $j(this).css('background-color');
                $j(this).hover(function() {
                    $j(this).css('background-color', hover_background_color);
                }, function() {
                    $j(this).css('background-color', initial_background_color);
                });
            }
            if (typeof $j(this).data('hover-border-color') !== 'undefined' && $j(this).data('hover-border-color') !== false) {
                var hover_border_color = $j(this).data('hover-border-color');
                var initial_border_color = $j(this).css('border-top-color');
                $j(this).hover(function() {
                    $j(this).css('border-color', hover_border_color);
                }, function() {
                    $j(this).css('border-color', initial_border_color);
                });
            }
            if (typeof $j(this).data('hover-color') !== 'undefined' && $j(this).data('hover-color') !== false) {
                var hover_color = $j(this).data('hover-color');
                var initial_color = $j(this).css('color');
                $j(this).hover(function() {
                    $j(this).css('color', hover_color);
                }, function() {
                    $j(this).css('color', initial_color);
                });
            }
        });
    }
}

function initEnlargeButton() {
    if ($j('.qbutton.enlarge').length) {
        $j('.qbutton.enlarge').each(function() {
            var thisButton = $j(this),
                horizontalPadding = parseInt(thisButton.css('padding-left')),
                paddingOffset = Math.floor((horizontalPadding / 100) * 20);
            thisButton.mouseenter(function() {
                thisButton.css({
                    'padding-left': horizontalPadding + paddingOffset
                });
                thisButton.css({
                    'padding-right': horizontalPadding + paddingOffset
                });
            });
            thisButton.mouseleave(function() {
                thisButton.css({
                    'padding-left': horizontalPadding
                });
                thisButton.css({
                    'padding-right': horizontalPadding
                });
            });
        });
    }
}

function initSocialIconHover() {
    if ($j('.q_social_icon_holder').length) {
        $j('.q_social_icon_holder').each(function() {
            if (typeof $j(this).data('hover-background-color') !== 'undefined' && $j(this).data('hover-background-color') !== false) {
                var hover_background_color = $j(this).data('hover-background-color');
                var initial_background_color = $j(this).find('.fa-stack').css('background-color');
                $j(this).find('.fa-stack').hover(function() {
                    $j(this).css('background-color', hover_background_color);
                }, function() {
                    $j(this).css('background-color', initial_background_color);
                });
            }
            if (typeof $j(this).data('hover-border-color') !== 'undefined' && $j(this).data('hover-border-color') !== false) {
                var hover_border_color = $j(this).data('hover-border-color');
                var initial_border_color = $j(this).find('.fa-stack').css('border-top-color');
                $j(this).find('.fa-stack').hover(function() {
                    $j(this).css('border-color', hover_border_color);
                }, function() {
                    $j(this).css('border-color', initial_border_color);
                });
            }
            if (typeof $j(this).data('hover-color') !== 'undefined' && $j(this).data('hover-color') !== false) {
                var initial_color;
                var initial_style;
                var hover_color = $j(this).data('hover-color');
                if ($j(this).find('.fa-stack i, .fa-stack span').length) {
                    initial_color = $j(this).find('.fa-stack i, .fa-stack span').css('color');
                    initial_style = $j(this).find('.fa-stack i, .fa-stack span').attr('style');
                } else if ($j(this).find('.simple_social').length) {
                    initial_color = $j(this).find('.simple_social').css('color');
                    initial_style = $j(this).find('.simple_social').attr('style');
                }
                if ($j(this).find('.fa-stack').length) {
                    $j(this).find('.fa-stack').hover(function() {
                        $j(this).find('i, span').attr('style', function(i, s) {
                            return initial_style + 'color: ' + hover_color + '!important;'
                        });
                    }, function() {
                        $j(this).find('i, span').attr('style', function(i, s) {
                            return initial_style + 'color: ' + initial_color + ';'
                        });
                    });
                } else if ($j(this).find('.simple_social').length) {
                    $j(this).find('.simple_social').hover(function() {
                        $j(this).attr('style', function(i, s) {
                            return initial_style + 'color: ' + hover_color + '!important;'
                        });
                    }, function() {
                        $j(this).attr('style', function(i, s) {
                            return initial_style + 'color: ' + initial_color + ';'
                        });
                    });
                }
            }
        });
    }
}

function initTabsActiveBorder() {
    if ($j('.q_tabs.vertical, .q_tabs.boxed').length) {
        $j('.q_tabs.vertical, .q_tabs.boxed').each(function() {
            var parentBgColor = getParentBackgroundColor($j(this));
            var activeElement = $j(this).find('li.active a');
            if ($j(this).hasClass('boxed')) {
                activeElement.css('border-bottom-color', parentBgColor);
            }
            if ($j(this).hasClass('left')) {
                activeElement.css('border-right-color', parentBgColor);
            }
            if ($j(this).hasClass('right')) {
                activeElement.css('border-left-color', parentBgColor);
            }
        });
    }
}

function getParentBackgroundColor(element) {
    return element.parents().filter(function() {
        var color = $j(this).css('background-color');
        return color != 'transparent' && color != 'rgba(0, 0, 0, 0)';
    }).eq(0).css('background-color')
}

function setActiveTabBorder() {
    if ($j('.q_tabs li.active').length) {
        $j(this).click(function() {
            initTabsActiveBorder();
        });
    }
}

function initPopupMenu() {
    "use strict";
    if ($j('a.popup_menu').length) {
        $j(".popup_menu_holder_outer").height($window_height).niceScroll({
            scrollspeed: 30,
            mousescrollstep: 20,
            cursorwidth: 0,
            cursorborder: 0,
            cursorborderradius: 0,
            cursorcolor: "transparent",
            autohidemode: false,
            horizrailenabled: false
        });
        if ($j('body').hasClass('qode_popup_menu_push_text_right') || $j('body').hasClass('qode_popup_menu_push_text_top')) {
            $j('.popup_menu_holder_outer nav > ul > li > a').each(function(i) {
                $j(this).css({
                    '-webkit-animation-delay': i * 70 + 'ms',
                    'animation-delay': i * 70 + 'ms'
                });
            });
            $j('.popup_menu_widget_holder > div').css({
                '-webkit-animation-delay': ($j('.popup_menu_holder_outer nav > ul > li > a').length + 1) * 70 + 'ms',
                'animation-delay': ($j('.popup_menu_holder_outer nav > ul > li > a').length + 1) * 70 + 'ms'
            });
        }
        $j(window).resize(function() {
            $j(".popup_menu_holder_outer").height($window_height)
        });
        $j('a.popup_menu').on('click', function(e) {
            e.preventDefault();
            if (!$j(this).hasClass('opened')) {
                $j(this).addClass('opened');
                $j('body').addClass('popup_menu_opened');
                if ($j(this).hasClass('qode_popup_menu_push_text_right')) {
                    $j('body').addClass('qode_popup_menu_fade_in').removeClass('qode_popup_menu_fade_out');
                    $j('body').removeClass('qode_popup_menu_push_nav_right');
                } else if ($j(this).hasClass('qode_popup_menu_push_text_top')) {
                    $j('body').addClass('qode_popup_menu_fade_in').removeClass('qode_popup_menu_fade_out');
                    $j('body').removeClass('qode_popup_menu_push_nav_top');
                } else if ($j(this).hasClass('qode_popup_menu_text_scaledown')) {
                    $j('body').addClass('qode_popup_menu_fade_in').removeClass('qode_popup_menu_fade_out');
                }
                setTimeout(function() {
                    if (!$j('body').hasClass('page-template-full_screen-php')) {
                        $j('body').css('overflow', 'hidden');
                    }
                }, 400);
            } else {
                $j(this).removeClass('opened');
                $j('body').removeClass('popup_menu_opened');
                if ($j(this).hasClass('qode_popup_menu_push_text_right') || $j(this).hasClass('qode_popup_menu_push_text_top') || $j(this).hasClass('qode_popup_menu_text_scaledown')) {
                    $j('body').removeClass('qode_popup_menu_fade_in').addClass('qode_popup_menu_fade_out');
                }
                if ($j(this).hasClass('qode_popup_menu_push_text_right')) {
                    $j('body').addClass('qode_popup_menu_push_nav_right');
                } else if ($j(this).hasClass('qode_popup_menu_push_text_top')) {
                    $j('body').addClass('qode_popup_menu_push_nav_top');
                }
                setTimeout(function() {
                    if (!$j('body').hasClass('page-template-full_screen-php')) {
                        $j('body').css('overflow', 'visible');
                    }
                    $j("nav.popup_menu ul.sub_menu").slideUp(200, function() {
                        $j('nav.popup_menu').getNiceScroll().resize();
                    });
                }, 400);
            }
        });
        $j(".popup_menu > ul > li.has_sub > a, .popup_menu > ul > li.has_sub > h6").on('tap click', function(e) {
            e.preventDefault();
            if ($j(this).closest('li.has_sub').find("> ul.sub_menu").is(":visible")) {
                $j(this).closest('li.has_sub').find("> ul.sub_menu").slideUp(200, function() {
                    $j('.popup_menu_holder_outer').getNiceScroll().resize();
                });
                $j(this).closest('li.has_sub').removeClass('open_sub');
            } else {
                $j(this).closest('li.has_sub').addClass('open_sub');
                $j(this).closest('li.has_sub').find("> ul.sub_menu").slideDown(200, function() {
                    $j('.popup_menu_holder_outer').getNiceScroll().resize();
                });
            }
            return false;
        });
        $j(".popup_menu ul li:not(.has_sub) a").click(function() {
            if (($j(this).attr('href') !== "http://#") && ($j(this).attr('href') !== "#")) {
                $j('a.popup_menu').removeClass('opened');
                $j('body').removeClass('popup_menu_opened').css('overflow', 'visible');
                $j("nav.popup_menu ul.sub_menu").slideUp(200, function() {
                    $j('nav.popup_menu').getNiceScroll().resize();
                });
            } else {
                return false;
            }
        });
    }
}

function initFullScreenTemplate() {
    "use strict";
    if ($j('.full_screen_holder').length && $window_width > 600) {
        var default_header_style = '';
        if ($j('header.page_header').hasClass('light')) {
            default_header_style = 'light';
        } else if ($j('header.page_header').hasClass('dark')) {
            default_header_style = 'dark';
        } else {
            default_header_style = header_style_admin;
        }
        $j('.full_screen_preloader').css('height', ($window_height));
        $j('#up_fs_button').on('click', function() {
            $j.fn.fullpage.moveSectionUp();
            return false;
        });
        $j('#down_fs_button').on('click', function() {
            $j.fn.fullpage.moveSectionDown();
            return false;
        });
        var section_number = $j('.full_screen_inner > .full_screen_section').length;
        $j('.full_screen_inner').fullpage({
            sectionSelector: '.full_screen_section',
            scrollOverflow: true,
            afterLoad: function(anchorLink, index) {
                checkActiveArrowsOnFullScrrenTemplate(section_number, index);
                checkFullScreenSectionsForHeaderStyle(index, default_header_style);
            },
            afterRender: function() {
                checkActiveArrowsOnFullScrrenTemplate(section_number, 1);
                checkFullScreenSectionsForHeaderStyle(1, default_header_style);
                if (section_number !== 1) {
                    $j('.full_screen_holder').find('.full_screen_navigation_holder').css('visibility', 'visible');
                }
                $j('.full_screen_holder').find('.full_screen_inner').css('visibility', 'visible');
                $j('.full_screen_preloader').hide();
                if ($j('.full_screen_holder video.full_screen_sections_video').length) {
                    $j('.full_screen_holder video.full_screen_sections_video').each(function() {
                        $j(this).get(0).play();
                    });
                }
            }
        });
    }
}

function checkActiveArrowsOnFullScrrenTemplate(section_number, index) {
    "use strict";
    if (index === 1) {
        $j('.full_screen_navigation_holder #up_fs_button').hide();
        if (index != section_number) {
            $j('.full_screen_navigation_holder #down_fs_button').show();
        }
    } else if (index === section_number) {
        if (section_number === 2) {
            $j('.full_screen_navigation_holder #up_fs_button').show();
        }
        $j('.full_screen_navigation_holder #down_fs_button').hide();
    } else {
        $j('.full_screen_navigation_holder #up_fs_button').show();
        $j('.full_screen_navigation_holder #down_fs_button').show();
    }
}

function checkFullScreenSectionsForHeaderStyle(index, default_header_style) {
    "use strict";
    if ($j('[data-q_header_style]').length > 0 && $j('header').hasClass('header_style_on_scroll')) {
        if ($j($j('.full_screen_holder .full_screen_inner .full_screen_section')[index - 1]).data("q_header_style") !== undefined) {
            var header_style = $j($j('.full_screen_holder .full_screen_inner .full_screen_section')[index - 1]).data("q_header_style");
            $j('header').removeClass('dark light').addClass(header_style);
        } else {
            $j('header').removeClass('dark light').addClass(default_header_style);
        }
    }
}

function checkHeaderStyleOnScroll() {
    "use strict";
    if ($j('[data-q_header_style]').length > 0 && $j('header').hasClass('header_style_on_scroll')) {
        var default_header_style = '';
        if ($j('header.page_header').hasClass('light')) {
            default_header_style = 'light';
        } else if ($j('header.page_header').hasClass('dark')) {
            default_header_style = 'dark';
        } else {
            default_header_style = header_style_admin;
        }
        var paspartu_top_add = $j('body').hasClass('paspartu_on_top_fixed') ? Math.round($window_width * paspartu_width) : 0;
        var paspartu_bottom_add = $j('body').hasClass('paspartu_on_bottom_fixed') ? Math.round($window_width * paspartu_width) : 0;
        $j('.full_width_inner > .wpb_row.section, .full_width_inner > .parallax_section_holder, .container_inner > .wpb_row.section, .container_inner > .parallax_section_holder, .portfolio_single > .wpb_row.section').waypoint(function(direction) {
            if (direction === 'down') {
                if ($j(this).data("q_header_style") !== undefined) {
                    var header_style = $j(this).data("q_header_style");
                    $j('header').removeClass('dark light').addClass(header_style);
                } else {
                    $j('header').removeClass('dark light').addClass(default_header_style);
                }
            }
        }, {
            offset: 0 + paspartu_top_add
        });
        $j('.title, .full_width_inner > .wpb_row.section, .full_width_inner > .parallax_section_holder, .container_inner > .wpb_row.section, .container_inner > .parallax_section_holder, .portfolio_single > .wpb_row.section, .q_slider').waypoint(function(direction) {
            if (direction === 'up') {
                if ($j(this).data("q_header_style") !== undefined) {
                    var header_style = $j(this).data("q_header_style");
                    $j('header').removeClass('dark light').addClass(header_style);
                } else {
                    $j('header').removeClass('dark light').addClass(default_header_style);
                }
            }
        }, {
            offset: function() {
                return -$j(this).outerHeight() + paspartu_bottom_add;
            }
        });
    }
}

function initImageGallerySliderNoSpace() {
    if ($j('.qode_image_gallery_no_space').length) {
        $j('.qode_image_gallery_no_space').each(function() {
            $j(this).animate({
                'opacity': 1
            }, 1000);
            $j(this).find('.qode_image_gallery_holder').lemmonSlider({
                infinite: true
            });
        });
        $j('.qode_image_gallery_no_space').on('click', 'li:not(.active) a', function() {
            if (window.innerWidth > 800) {
                return false;
            } else {
                return true;
            }
        });
    }
}

function initVerticalSplitSlider() {
    "use strict";
    if ($j('html').hasClass('vertical_split_screen_initalized')) {
        $j('html').removeClass('vertical_split_screen_initalized');
        $j.fn.multiscroll.destroy();
    }
    if ($j('.vertical_split_slider').length) {
        $j('.vertical_split_slider').height($window_height).animate({
            opacity: 1
        }, 300);
        $j('.vertical_split_slider').multiscroll({
            scrollingSpeed: 500,
            navigation: true,
            afterRender: function() {
                $j('html').addClass('vertical_split_screen_initalized');
                initButtonHover();
                if ($j('div.wpcf7 > form').length) {
                    $j('div.wpcf7 > form').wpcf7InitForm();
                }
                initCountdown();
                if ($j('body').hasClass('vss_responsive_adv')) {
                    var vertical_split_slider_responsive = $j("<div class='vertical_split_slider_responsive' />");
                    $j(".vertical_split_slider").after(vertical_split_slider_responsive);
                    var left_side = $j('.vertical_split_slider .ms-left > div');
                    var right_side = $j('.vertical_split_slider .ms-right > div');
                    for (var i = 0; i < left_side.length; i++) {
                        vertical_split_slider_responsive.append($j(left_side[i]).clone(true));
                        vertical_split_slider_responsive.append($j(right_side[left_side.length - 1 - i]).clone(true));
                    }
                }
            }
        });
        if ($j('body').hasClass('vss_responsive_adv')) {
            if ($window_width < 768) {
                $j.fn.multiscroll.destroy();
                $j('html,body').css('height', 'auto').css('overflow', 'auto');
            } else {
                $j.fn.multiscroll.build();
                $j('html,body').css('height', '100%').css('overflow', 'hidden');
            }
            $j(window).resize(function() {
                if ($window_width < 768) {
                    $j.fn.multiscroll.destroy();
                    $j('html,body').css('height', 'auto').css('overflow', 'auto');
                } else {
                    $j.fn.multiscroll.build();
                    $j('html,body').css('height', '100%').css('overflow', 'hidden');
                }
            });
        }
    } else {
        if (!$j('.full_screen_holder').length) {
            $j('html,body').css('height', 'auto').css('overflow', 'auto');
        }
    }
}

function showGoogleMap() {
    "use strict";
    if ($j('.qode_google_map').length) {
        $j('.qode_google_map').each(function() {
            var custom_map_style;
            if (typeof $j(this).data('custom-map-style') !== 'undefined') {
                custom_map_style = $j(this).data('custom-map-style');
            }
            var color_overlay;
            if (typeof $j(this).data('color-overlay') !== 'undefined' && $j(this).data('color-overlay') !== false) {
                color_overlay = $j(this).data('color-overlay');
            }
            var saturation;
            if (typeof $j(this).data('saturation') !== 'undefined' && $j(this).data('saturation') !== false) {
                saturation = $j(this).data('saturation');
            }
            var lightness;
            if (typeof $j(this).data('lightness') !== 'undefined' && $j(this).data('lightness') !== false) {
                lightness = $j(this).data('lightness');
            }
            var zoom;
            if (typeof $j(this).data('zoom') !== 'undefined' && $j(this).data('zoom') !== false) {
                zoom = $j(this).data('zoom');
            }
            var pin;
            if (typeof $j(this).data('pin') !== 'undefined' && $j(this).data('pin') !== false) {
                pin = $j(this).data('pin');
            }
            var map_height;
            if (typeof $j(this).data('map-height') !== 'undefined' && $j(this).data('map-height') !== false) {
                map_height = $j(this).data('map-height');
            }
            var unique_id;
            if (typeof $j(this).data('unique-id') !== 'undefined' && $j(this).data('unique-id') !== false) {
                unique_id = $j(this).data('unique-id');
            }
            var google_maps_scroll_wheel;
            if (typeof $j(this).data('google-maps-scroll-wheel') !== 'undefined') {
                google_maps_scroll_wheel = $j(this).data('google-maps-scroll-wheel');
            }
            var addresses;
            if (typeof $j(this).data('addresses') !== 'undefined' && $j(this).data('addresses') !== false) {
                addresses = $j(this).data('addresses');
            }
            var map = "map_" + unique_id;
            var geocoder = "geocoder_" + unique_id;
            var holderId = "map_canvas_" + unique_id;
            initializeGoogleMap(custom_map_style, color_overlay, saturation, lightness, google_maps_scroll_wheel, zoom, holderId, map_height, pin, map, geocoder, addresses)
        });
    }
}

function initializeGoogleMap(custom_map_style, color, saturation, lightness, wheel, zoom, holderId, height, pin, map, geocoder, data) {
    "use strict";
    var mapStyles = [{
        stylers: [{
            hue: color
        }, {
            saturation: saturation
        }, {
            lightness: lightness
        }, {
            gamma: 1
        }]
    }];
    var google_map_type_id;
    if (custom_map_style) {
        google_map_type_id = 'qode_style'
    } else {
        google_map_type_id = google.maps.MapTypeId.ROADMAP
    }
    var qodeMapType = new google.maps.StyledMapType(mapStyles, {
        name: "Qode Google Map"
    });
    geocoder = new google.maps.Geocoder();
    var latlng = new google.maps.LatLng(-34.397, 150.644);
    var myOptions = {
        zoom: zoom,
        scrollwheel: wheel,
        center: latlng,
        zoomControl: true,
        zoomControlOptions: {
            style: google.maps.ZoomControlStyle.SMALL,
            position: google.maps.ControlPosition.RIGHT_CENTER
        },
        scaleControl: false,
        scaleControlOptions: {
            position: google.maps.ControlPosition.LEFT_CENTER
        },
        streetViewControl: false,
        streetViewControlOptions: {
            position: google.maps.ControlPosition.LEFT_CENTER
        },
        panControl: false,
        panControlOptions: {
            position: google.maps.ControlPosition.LEFT_CENTER
        },
        mapTypeControl: false,
        mapTypeControlOptions: {
            mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'qode_style'],
            style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
            position: google.maps.ControlPosition.LEFT_CENTER
        },
        mapTypeId: google_map_type_id
    };
    map = new google.maps.Map(document.getElementById(holderId), myOptions);
    map.mapTypes.set('qode_style', qodeMapType);
    var index;
    for (index = 0; index < data.length; ++index) {
        initializeGoogleAddress(data[index], pin, map, geocoder);
    }
    var holder_element = document.getElementById(holderId);
    holder_element.style.height = height + "px";
}

function initializeGoogleAddress(data, pin, map, geocoder) {
    "use strict";
    if (data === '')
        return;
    var contentString = '<div class="content_map">' + '<div class="site_notice_map">' + '</div>' + '<div class="body_content_map">' + '<p>' + data + '</p>' + '</div>' + '</div>';
    var infowindow = new google.maps.InfoWindow({
        content: contentString
    });
    geocoder.geocode({
        'address': data
    }, function(results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
            map.setCenter(results[0].geometry.location);
            var marker = new google.maps.Marker({
                map: map,
                position: results[0].geometry.location,
                icon: pin,
                title: data['store_title']
            });
            google.maps.event.addListener(marker, 'click', function() {
                infowindow.open(map, marker);
            });
            google.maps.event.addDomListener(window, 'resize', function() {
                map.setCenter(results[0].geometry.location);
            });
        }
    });
};

function initHorizontalMarquee() {
    "use strict";
    var marquees = $j('.qode-horizontal-marquee');
    marquees.each(function() {
        var handleResize = function() {
            marqueeW = marquee.width();
            innerW = 0;
            inner.find('> .qode-hm-item').css('margin', 0);
            marquee.height(Math.min($window_height, dataMarqueeH));
            inner.find('> .qode-hm-item').each(function() {
                $j(this).css('max-width', marqueeW);
                innerW += $j(this).outerWidth() + dataSpacing;
            });
            innerW -= dataSpacing;
            inner.width(innerW).css('left', 0);
            inner.find('> .qode-hm-item').css('margin-right', dataSpacing + 'px');
        };
        var dragStart, lastPosition;
        var handleDragStart = function(event) {
            event = typeof event.originalEvent !== 'undefined' ? event.originalEvent : event;
            event = event.type == 'touchstart' ? event.touches[0] : event;
            dragStart = {
                x: event.clientX,
                y: event.clientY
            };
            lastPosition = parseInt(inner.css('left'), 10);
            inner.addClass('qode-dragged');
        };
        var handleDragStop = function(event) {
            inner.removeClass('qode-dragged');
        };
        var handleDrag = function(event) {
            event = typeof event.originalEvent !== 'undefined' ? event.originalEvent : event;
            var type = event.type;
            event = type == 'touchmove' ? event.touches[0] : event;
            var pos = {
                x: event.clientX,
                y: event.clientY
            };
            if (type == 'touchmove' || type == 'mousemove' && inner.is('.qode-dragged')) {
                inner.css({
                    'left': Math.max(-innerW + marqueeW, Math.min(lastPosition + (pos.x - dragStart.x), 0)) + 'px'
                });
            }
        };
        var marquee = $j(this);
        var dataSpacing = typeof marquee.data('spacing') !== 'undefined' ? marquee.data('spacing') : 0;
        var dataMarqueeH = typeof marquee.data('height') !== 'undefined' ? marquee.data('height') : 0;
        var inner = marquee.find('.qode-horizontal-marquee-inner');
        var innerW, marqueeW;
        handleResize();
        $j(window).resize(handleResize);
        inner.find('img').on('dragstart', function(event) {
            event.preventDefault();
        });
        inner.on('mousedown touchstart', handleDragStart);
        inner.on('mousemove touchmove', handleDrag);
        inner.on('mouseup touchend mouseleave', handleDragStop);
    });
}

function initPreviewSlider() {
    "use strict";
    var sliders = $j('.qode-preview-slider');
    sliders.each(function() {
        var slider = $j(this);
        var main_slider = slider.find('.qode-presl-main-slider');
        var small_slider_holder = slider.find('.qode-presl-small-slider-holder');
        var small_slider = small_slider_holder.find('.qode-presl-small-slider');
        var slide_timeout = 5000;
        var slide_transition = 700;
        main_slider.find('.qode-presl-link.small').each(function(i) {
            $j('<li><div class="qode-presl-small-item"><div class="qode-presl-main-item-inner"></div></div></li>').appendTo(small_slider.find('> .slides')).find('.qode-presl-main-item-inner').append($j(this));
        });
        main_slider.flexslider({
            animation: "slide",
            animationSpeed: slide_transition,
            slideshow: true,
            slideshowSpeed: slide_timeout,
            useCSS: true,
            touch: true,
            autostart: false,
            directionNav: true,
            controlNav: true,
            prevText: '<i class="icon-arrows-left"></i>',
            nextText: '<i class="icon-arrows-right"></i>',
            start: function(slider) {
                slider.find('.qode-presl-main-item').css({
                    'opacity': '1',
                    'filter': 'alpha(opacity=100)'
                }).find('img').addClass('visible');
            },
            before: function(slider) {
                var target = slider.animatingTo;
                var current = slider.currentSlide;
                if (target == 0) {
                    slider.find('.slides li:first-child').next().next().clone().appendTo(slider.find('.slides')).removeClass('clone').addClass('clone_end');
                } else if (target == slider.count - 1) {
                    slider.find('.slides li:last-child').prev().prev().clone().appendTo(slider.find('.slides')).removeClass('clone').addClass('clone_start');
                }
                if (target == 0 && current == slider.count - 1 && slider.direction == 'next') {
                    small_slider.flexslider('next');
                } else if (target == slider.count - 1 && current == 0 && slider.direction == 'prev') {
                    small_slider.flexslider('prev');
                } else {
                    small_slider.find('.flex-control-nav a').eq(target).click();
                }
                slider.find('.flex-direction-nav').addClass('moving');
            },
            after: function(slider) {
                slider.removeClass('control-initiated direction-initiated');
                slider.find('.clone_start, .clone_end').remove();
                slider.find('.flex-direction-nav').removeClass('moving');
            }
        });
        small_slider.flexslider({
            animation: "slide",
            animationSpeed: slide_transition,
            animationLoop: true,
            useCSS: true,
            touch: false,
            slideshow: false,
            directionNav: false,
            controlNav: true,
            start: function(slider) {
                slider.find('img').addClass('visible');
                slider.closest('.qode-presl-small-slider-holder').find('.qode-presl-phone').addClass('visible');
            }
        });
    });
}
var getIEversion = function() {
    var rv = -1;
    if (navigator.appName == 'Microsoft Internet Explorer') {
        var ua = navigator.userAgent;
        var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
        if (re.exec(ua) != null)
            rv = parseFloat(RegExp.$1);
    } else if (navigator.appName == 'Netscape') {
        var ua = navigator.userAgent;
        var re = new RegExp("Trident/.*rv:([0-9]{1,}[\.0-9]{0,})");
        if (re.exec(ua) != null)
            rv = parseFloat(RegExp.$1);
    }
    return rv;
};

function initInDeviceSlider() {
    "use strict";
    var sliders = $j('.qode-in-device-slider');
    sliders.each(function() {
        var slider = $j(this).find('.qode-ids-slider');
        var navigation = slider.data('navigation') == 'yes' ? true : false;
        var auto_start = slider.data('auto-start') == 'yes' ? true : false;
        var slide_timeout = auto_start ? slider.data('timeout') : 0;
        var is_in_marquee = slider.closest('.qode-horizontal-marquee').length ? true : false;
        var IEver = getIEversion();
        if (IEver > 0) {
            slider.addClass('qode-ids-ie-specific');
        }
        slider.flexslider({
            animation: "slide",
            animationSpeed: 700,
            animationLoop: true,
            useCSS: true,
            touch: !is_in_marquee,
            slideshow: auto_start,
            slideshowSpeed: slide_timeout,
            directionNav: navigation,
            controlNav: false,
            prevText: '<i class="icon-arrows-left"></i>',
            nextText: '<i class="icon-arrows-right"></i>',
            start: function(slider) {
                slider.find('img').addClass('visible');
                slider.closest('.qode-ids-slider-holder').find('.qode-ids-frame').addClass('visible');
                if (slider.is('.qode-ids-titles-on-hover')) {
                    slider.hover(function() {
                        $j(this).find('.qode-ids-link').addClass('hovered');
                    }, function() {
                        $j(this).find('.qode-ids-link').removeClass('hovered');
                    });
                }
            }
        });
        if (is_in_marquee) {
            var dragStart, clickable = false;
            var handleDragStart = function(event) {
                event = typeof event.originalEvent !== 'undefined' ? event.originalEvent : event;
                event = event.type == 'touchstart' ? event.touches[0] : event;
                dragStart = {
                    x: event.clientX,
                    y: event.clientY
                };
            };
            var handleDragStop = function(event) {
                event = typeof event.originalEvent !== 'undefined' ? event.originalEvent : event;
                event = event.type == 'touchend' ? event.changedTouches[0] : event;
                var dragEnd = {
                    x: event.clientX,
                    y: event.clientY
                };
                if (Math.abs(dragEnd.x - dragStart.x) < 10) {
                    clickable = true;
                }
            };
            var handleClick = function(event) {
                if (clickable) {
                    clickable = false;
                } else {
                    event.preventDefault();
                }
            };
            slider.find('.qode-ids-link').on('dragstart', function(event) {
                event.preventDefault();
            }).on('click', handleClick).on('mousedown touchstart', handleDragStart).on('mouseup touchend', handleDragStop);
        }
    });
}

function checkSVG(element) {
    "use strict";
    var el = element.find('.active .qode_slide-svg-holder');
    var drawing_enabled = el.data('svg-drawing');
    if (drawing_enabled === 'yes') {
        drawSVG(el);
    }
}

function drawSVG(svg) {
    "use strict";
    var svgs = Array.prototype.slice.call(svg.find('svg')),
        svgArr = [],
        resizeTimeout;
    svgs.forEach(function(el, i) {
        var svg = new SVGEl(el);
        svgArr[i] = svg;
        setTimeout(function(el) {
            return function() {
                svg.render();
            };
        }(el), 0);
    });
}
var docElem = window.document.documentElement;
window.requestAnimFrame = function() {
    return (window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) {
        window.setTimeout(callback, 1000 / 60);
    });
}();
window.cancelAnimFrame = function() {
    return (window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.oCancelAnimationFrame || window.msCancelAnimationFrame || function(id) {
        window.clearTimeout(id);
    });
}();

function SVGEl(el) {
    this.el = el;
    var frameRate = $j(this.el).closest('.qode_slide-svg-holder').data('svg-frames');
    this.image = this.el.previousElementSibling;
    this.current_frame = 0;
    this.total_frames = frameRate;
    this.path = [];
    this.length = [];
    this.handle = 0;
    this.init();
}
SVGEl.prototype.init = function() {
    var self = this;
    [].slice.call(this.el.querySelectorAll('path')).forEach(function(path, i) {
        self.path[i] = path;
        var l = self.path[i].getTotalLength();
        self.length[i] = l;
        self.path[i].style.strokeDasharray = l + ' ' + l;
        self.path[i].style.strokeDashoffset = l;
    });
};
SVGEl.prototype.render = function() {
    if (this.rendered) return;
    this.rendered = true;
    this.draw();
};
SVGEl.prototype.draw = function() {
    var self = this,
        progress = this.current_frame / this.total_frames;
    if (progress > 1) {
        window.cancelAnimFrame(this.handle);
    } else {
        this.current_frame++;
        for (var j = 0, len = this.path.length; j < len; j++) {
            this.path[j].style.strokeDashoffset = Math.floor(this.length[j] * (1 - progress));
        }
        this.handle = window.requestAnimFrame(function() {
            self.draw();
        });
    }
};

function initPageTitleAnimation() {
    "use strict";
    if ($j('.title_outer').data('animation') === 'yes' && $j('.no-touch .title_outer').length > 0) {
        var skrollr_title = skrollr.init({
            edgeStrategy: 'set',
            smoothScrolling: false,
            forceHeight: false
        });
        skrollr_title.refresh();
    }
};

function initQodeElementAnimationSkrollr() {
    "use strict";
    if ($j('.no-touch .carousel').length === 0) {
        var elementItemAnimation = $j('.no-touch .q_elements_holder > .q_elements_item');
        elementItemAnimation.each(function() {
            if ((typeof($j(this).data('animation')) !== 'undefined' || typeof($j('.title_outer').data('animation')) !== 'undefined') && $j(this).data('animation') === 'yes') {
                var skr = skrollr.init();
                skr.refresh();
                return false;
            }
        });
    }
};

function initIconShortcodeHover() {
    "use strict";
    if ($j('.qode_icon_shortcode').length) {
        $j('.qode_icon_shortcode').each(function() {
            if (typeof $j(this).data('type') !== 'undefined' && ['circle', 'square'].indexOf($j(this).data('type')) != -1) {
                if (typeof $j(this).data('hover-bg-color') !== 'undefined') {
                    if ($j(this).data('type') == 'circle') {
                        var elementToHover = $j(this).find('i').first();
                        var hoverBgColor = $j(this).data('hover-bg-color');
                        var initialStyle = elementToHover.attr('style');
                        $j(this).hover(function() {
                            elementToHover.attr('style', initialStyle + 'color: ' + hoverBgColor + '!important');
                        }, function() {
                            elementToHover.attr('style', initialStyle);
                        });
                    } else {
                        var hoverBgColor = $j(this).data('hover-bg-color');
                        var initialBgColor = $j(this).css('background-color');
                        $j(this).hover(function() {
                            $j(this).css('background-color', hoverBgColor);
                        }, function() {
                            $j(this).css('background-color', initialBgColor);
                        });
                    }
                }
            }
            if (typeof $j(this).data('hover-icon-color') !== 'undefined') {
                var hoverColor = $j(this).data('hover-icon-color');
                var initialColor = $j(this).find('.qode_icon_element ').css('color');
                $j(this).hover(function() {
                    $j(this).find('.qode_icon_element ').css('color', hoverColor);
                }, function() {
                    $j(this).find('.qode_icon_element ').css('color', initialColor);
                });
            }
        });
    }
}

function initIconWithTextHover() {
    "use strict";
    if ($j('.qode_iwt_icon_holder').length) {
        $j('.qode_iwt_icon_holder').each(function() {
            if (typeof $j(this).data('icon-hover-bg-color') !== 'undefined') {
                var hoverBgColor = $j(this).data('icon-hover-bg-color');
                var initialBgColor = $j(this).css('background-color');
                $j(this).hover(function() {
                    $j(this).css('background-color', hoverBgColor);
                }, function() {
                    $j(this).css('background-color', initialBgColor);
                });
            }
            if (typeof $j(this).data('icon-hover-color') !== 'undefined') {
                var elementToChange = $j(this).find('.qode_iwt_icon_element');
                var hoverColor = $j(this).data('icon-hover-color');
                var initialColor = elementToChange.css('color');
                $j(this).hover(function() {
                    elementToChange.css('color', hoverColor);
                }, function() {
                    elementToChange.css('color', initialColor);
                });
            }
        });
    }
}

function initLoadNextPostOnBottom() {
    "use strict";
    if ($j('.blog_vertical_loop').length) {
        var header_addition;
        var normal_header_addition;
        var paspartu_add = $j('body').hasClass('paspartu_enabled') ? Math.round($window_width * paspartu_width) : 0;
        if ($j('header.page_header').hasClass('transparent')) {
            normal_header_addition = 0;
        } else {
            normal_header_addition = header_height;
        }
        var click = true;
        var $container = $j('.blog_vertical_loop .blog_holder');
        $j(document).on('click', '.blog_vertical_loop_button a', function(e) {
            e.preventDefault();
            if (click) {
                click = false;
                var $this = $j(this);
                var link = $this.attr('href');
                var $content = '.blog_vertical_loop .blog_holder';
                var $anchor = '.blog_vertical_loop_button_holder a';
                var $next_href = $j($anchor).attr('href');
                if ($window_width < 1000) {
                    header_addition = $j('header.page_header').height();
                } else {
                    header_addition = normal_header_addition;
                }
                var scrollTop = $j(window).scrollTop(),
                    elementOffset = $this.closest('article').offset().top,
                    distance = (elementOffset - scrollTop) - header_addition - paspartu_add;
                $container.find('article:eq(1)').addClass('fade_out');
                $this.closest('article').addClass('move_up').removeClass('next_post').css('transform', 'translateY(-' + distance + 'px)');
                setTimeout(function() {
                    $j(window).scrollTop(0);
                    $container.find('article:eq(0)').remove();
                    $container.find('article:eq(0)').addClass('previous_post');
                    $this.closest('article').removeAttr('style').removeClass('move_up');
                }, 450);
                $j.get(link + '', function(data) {
                    var $new_content = $j(data).find('article').addClass('next_post');
                    $next_href = $j($anchor, data).attr('href');
                    $container.append($j($new_content));
                    click = true;
                });
            } else {
                return false;
            }
        });
        $j(document).on('click', '.blog_vertical_loop_back_button a', function(e) {
            e.preventDefault();
            if (click) {
                click = false;
                var $this = $j(this);
                var link = $this.attr('href');
                var $content = '.blog_vertical_loop .blog_holder';
                var $anchor = '.blog_vertical_loop_button_holder.prev_post a';
                var $prev_href = $j($anchor).attr('href');
                $container.find('article:eq(0)').removeClass('fade_out').addClass('fade_in');
                $this.closest('article').addClass('move_up').css('transform', 'translateY(' + $window_height + 'px)');
                setTimeout(function() {
                    $container.find('article:last-child').remove();
                    $container.find('article:eq(0)').removeClass('previous_post fade_in');
                    $this.closest('article').addClass('next_post').removeAttr('style').removeClass('move_up');
                    $j.get(link + '', function(data) {
                        var $new_content = $j(data).find('article').removeClass('next_post').addClass('previous_post');
                        $prev_href = $j($anchor, data).attr('href');
                        $container.prepend($j($new_content));
                        click = true;
                    });
                }, 450);
            } else {
                return false;
            }
        });
        $j.get($j('.blog_vertical_loop_button_holder .last_page a').attr('href') + '', function(data) {
            var $new_content = $j(data).find('article').removeClass('next_post').addClass('previous_post');
            $container.prepend($j($new_content));
        });
        $j.get($j('.blog_vertical_loop_button a').attr('href') + '', function(data) {
            var $new_content = $j(data).find('article').addClass('next_post');
            $container.append($j($new_content));
        });
    }
}
(function($) {
    "use strict";
    $.fn.extend({
        mouseParallax: function(options) {
            var defaults = {
                moveFactor: 1.5,
                targetContainer: this
            };
            var options = $.extend(defaults, options);
            return this.each(function() {
                var o = options;
                var layer_elements = $(o.targetContainer).find('.image, .paralax_layers_content_holder');
                layer_elements.each(function(i) {
                    $(this).css('z-index', i);
                });
                var mouseXStart;
                var mouseYStart;
                mouseXStart = $(o.targetContainer).offset().left;
                mouseYStart = $(o.targetContainer).offset().top;
                $(o.targetContainer).on('mouseenter', function(e) {
                    mouseXStart = e.pageX - $(this).offset().left;
                    mouseYStart = e.pageY - $(this).offset().top;
                });
                $(o.targetContainer).on('mousemove', function(e) {
                    var mouseX0 = $(this).offset().left + mouseXStart;
                    var mouseY0 = $(this).offset().top + mouseYStart;
                    var mouseX = e.pageX - mouseX0;
                    var mouseY = e.pageY - mouseY0;
                    layer_elements.each(function(i) {
                        $(this).css({
                            marginLeft: -mouseX / 100 * o.moveFactor * (i + 1),
                            marginTop: -mouseY / 100 * o.moveFactor * (i + 1)
                        }, 100);
                    });
                });
                var config = {
                    interval: 0,
                    over: function() {},
                    timeout: 500,
                    out: function() {
                        layer_elements.each(function(i) {
                            $(this).stop().animate({
                                marginLeft: 0,
                                marginTop: 0
                            }, 300);
                        });
                    }
                };
                $(o.targetContainer).hoverIntent(config);
            });
        }
    });
}(jQuery));

function setParallaxLayersHeight($this, $def_height) {
    "use strict";
    var parallax_layers_height = $def_height;
    var responsive_breakpoint_set = [1600, 1300, 1000, 768, 567, 320];
    if ($window_width > responsive_breakpoint_set[0]) {
        parallax_layers_height = $def_height;
    } else if ($window_width > responsive_breakpoint_set[1]) {
        parallax_layers_height = $def_height * 0.75;
    } else if ($window_width > responsive_breakpoint_set[2]) {
        parallax_layers_height = $def_height * 0.6;
    } else if ($window_width > responsive_breakpoint_set[3]) {
        parallax_layers_height = $def_height * 0.55;
    } else if ($window_width <= responsive_breakpoint_set[3]) {
        parallax_layers_height = $def_height * 0.45;
    }
    $this.css({
        'height': (parallax_layers_height) + 'px'
    });
}

function parallaxLayers() {
    "use strict";
    if ($j('.qode_parallax_layers').length) {
        $j(".qode_parallax_layers").each(function() {
            var $this = $j(this);
            if ($j(this).hasClass('full_screen_height')) {
                $this.height($window_height);
                $j(window).resize(function() {
                    $this.height($window_height);
                });
            } else {
                var $def_height = $j(this).data('height');
                setParallaxLayersHeight($this, $def_height);
                $j(window).resize(function() {
                    setParallaxLayersHeight($this, $def_height);
                });
            }
            var $parallax_layers_holder = $this.find('.qode_parallax_layers_holder');
            var counter = 0;
            var limit = $this.find(".image").length;
            $this.find(".image").each(function() {
                var $this = $j(this);
                if ($this.css("background-image") != "" && $this.css("background-image") != "none") {
                    var bg_url = $this.attr('style');
                    bg_url = bg_url.match(/url\(["']?([^'")]+)['"]?\)/);
                    bg_url = bg_url ? bg_url[1] : "";
                    if (bg_url) {
                        var backImg = new Image();
                        backImg.src = bg_url;
                        $j(backImg).load(function() {
                            counter++;
                            if (counter == limit) {
                                $parallax_layers_holder.removeClass('preload_parallax_layers');
                                if ($j('html').hasClass('no-touch')) {
                                    $parallax_layers_holder.mouseParallax()
                                };
                            }
                        });
                    }
                }
            });
        });
    }
}

function alterWPMLSwitcherHeaderBottom() {
    "use strict";
    if ($j('.header_bottom .main_menu li.menu-item-language').length) {
        var langDropdown = $j('.header_bottom .main_menu .menu-item-language').find('.submenu-languages');
        if (typeof langDropdown !== 'undefined') {
            langDropdown.parent('li').addClass('narrow');
            langDropdown.wrap('<div class="second"><div class="inner"></div></div>');
            langDropdown.show();
        }
    }
    if ($j('.header_bottom .mobile_menu li.menu-item-language').length) {
        var langDropdown = $j('.header_bottom .mobile_menu .menu-item-language').find('.submenu-languages');
        if (typeof langDropdown !== 'undefined') {
            langDropdown.parent('li').addClass('has_sub');
            langDropdown.prev('a').after('<span class="mobile_arrow"><i class="fa fa-angle-right"></i><i class="fa fa-angle-down"></i></span>');
            langDropdown.addClass('sub_menu');
        }
    }
}

function initContentSlider() {
    "use strict";
    $j('.qode_content_slider').each(function() {
        var $this = $j(this);
        var interval = 8000;
        if (typeof $this.data('interval') !== 'undefined' && $this.data('interval') !== false) {
            interval = parseFloat($this.data('interval')) * 1000;
        }
        var directionNav = false;
        if (typeof $this.data('direction') !== 'undefined') {
            directionNav = $this.data('direction');
        }
        var controlNav = false;
        if (typeof $this.data('control') !== 'undefined') {
            controlNav = $this.data('control');
        }
        var pauseOnHoverAction = false;
        if (typeof $this.data('pasue-on-hover') !== 'undefined') {
            pauseOnHoverAction = $this.data('pasue-on-hover');
        }
        var enableDrag = false;
        if (typeof $this.data('drag') !== 'undefined') {
            enableDrag = $this.data('drag');
        }
        var slideshow = true;
        if (interval === 0) {
            slideshow = false;
        }
        var animation = 'slide';
        if (typeof $this.data('flex_fx') !== 'undefined' && $this.data('flex_fx') !== false) {
            animation = $this.data('flex_fx');
        }
        $this.flexslider({
            selector: '.qode_content_slider_inner > .qode_content_slider_item',
            animationLoop: true,
            controlNav: controlNav,
            directionNav: directionNav,
            useCSS: false,
            pauseOnAction: pauseOnHoverAction,
            pauseOnHover: pauseOnHoverAction,
            slideshow: slideshow,
            animation: animation,
            prevText: "<div><i class='fa fa-angle-left'></i></div>",
            nextText: "<div><i class='fa fa-angle-right'></i></div>",
            animationSpeed: 600,
            slideshowSpeed: interval,
            touch: true
        });
        $this.find('.flex-direction-nav a').click(function(e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            e.stopPropagation();
        });
        if (enableDrag) {
            $this.swipe({
                swipeLeft: function() {
                    $this.flexslider('next');
                },
                swipeRight: function() {
                    $this.flexslider('prev');
                },
                threshold: 20
            });
        }
    });
}

function qodeInitStickyWidget() {
    var stickyWidgets = $j('.qode-widget-sticky-sidebar');
    if (stickyWidgets.length && $window_width > 1000) {
        var header = $j('header.page_header');
        sticky_amount = getScrollAmountForStickyHeader();
        stickyWidgets.each(function() {
            var widget = $j(this),
                parent = '.full_section_inner, .section_inner, .two_columns_75_25, .two_columns_25_75, .two_columns_66_33, .two_columns_33_66',
                stickyHeight = 0,
                widgetOffset = widget.offset().top;
            if (widget.parent('aside.sidebar').length) {
                var sidebar = widget.parents('aside.sidebar');
            } else if (widget.parents('.wpb_widgetised_column').length) {
                var sidebar = widget.parents('.wpb_widgetised_column');
                widget.closest('.wpb_column').css('position', 'static');
            }
            var sidebarOffset = sidebar.offset().top;
            if (sticky_amount < sidebarOffset && (header.hasClass('stick') || header.hasClass('stick_with_left_right_menu'))) {
                stickyHeight = min_header_height_sticky;
            } else if (header.hasClass('fixed')) {
                stickyHeight = min_header_height_scroll;
            } else if (header.hasClass('fixed_top_header')) {
                stickyHeight = header_top_height;
            } else if (header.hasClass('fixed_hiding')) {
                stickyHeight = min_header_height_fixed_hidden + 40;
            } else if (qode_window < 1000 || $j('.vertical_menu_enabled').length > 0) {
                stickyHeight = 0;
            } else {
                stickyHeight = 0;
            }
            var offset = -(widgetOffset - sidebarOffset - stickyHeight - 10);
            sidebar.stick_in_parent({
                parent: parent,
                sticky_class: 'qode-sticky-sidebar',
                inner_scrolling: false,
                offset_top: offset
            }).on("sticky_kit:bottom", function() {
                sidebar.addClass('qode-sticky-sidebar-on-bottom');
            }).on("sticky_kit:unbottom", function() {
                sidebar.removeClass('qode-sticky-sidebar-on-bottom');
            });
            $j(window).scroll(function() {
                if ($window_width >= 1000) {
                    if (sticky_amount > sidebarOffset && header.hasClass('sticky') && sidebar.hasClass('qode-sticky-sidebar') && !sidebar.hasClass('qode-sticky-sidebar-on-bottom')) {
                        sidebar.css('-webkit-transform', 'translateY(' + min_header_height_sticky + 'px)');
                        sidebar.css('transform', 'translateY(' + min_header_height_sticky + 'px)');
                    } else {
                        sidebar.css('-webkit-transform', 'translateY(0px)');
                        sidebar.css('transform', 'translateY(0px)');
                    }
                }
            });
        });
    }
}

function qodeBlogGalleryAnimation() {
    var blogGalleries = $j('.blog_holder.blog_gallery');
    if (blogGalleries.length) {
        blogGalleries.each(function() {
            var blogGallery = $j(this),
                articles = blogGallery.find('article');
            articles.each(function() {
                var article = $j(this),
                    excerpt = article.find('.post_excerpt'),
                    excerptHeight = parseInt(excerpt.outerHeight(true)),
                    category = article.find('.post_category'),
                    title = article.find('.entry_title');
                category.css({
                    'transform': 'translateY(' + excerptHeight + 'px)'
                });
                title.css({
                    'transform': 'translateY(' + excerptHeight + 'px)'
                });
                article.mouseenter(function() {
                    category.css({
                        'transform': 'translateY(0px)'
                    });
                    title.css({
                        'transform': 'translateY(0px)'
                    });
                    excerpt.css({
                        'visibility': 'visible',
                        'opacity': '1'
                    });
                });
                article.mouseleave(function() {
                    category.css({
                        'transform': 'translateY(' + excerptHeight + 'px)'
                    });
                    title.css({
                        'transform': 'translateY(' + excerptHeight + 'px)'
                    });
                    excerpt.css({
                        'visibility': 'hidden',
                        'opacity': '0'
                    });
                });
            });
        });
    }
};
var $j = jQuery.noConflict();
$j(document).ready(function() {
    "use strict";
});;
window.addComment = function(s) {
    var u, f, v, y = s.document,
        p = {
            commentReplyClass: "comment-reply-link",
            cancelReplyId: "cancel-comment-reply-link",
            commentFormId: "commentform",
            temporaryFormId: "wp-temp-form-div",
            parentIdFieldId: "comment_parent",
            postIdFieldId: "comment_post_ID"
        },
        e = s.MutationObserver || s.WebKitMutationObserver || s.MozMutationObserver,
        i = "querySelector" in y && "addEventListener" in s,
        n = !!y.documentElement.dataset;

    function t() {
        r(),
            function() {
                if (!e) return;
                new e(d).observe(y.body, {
                    childList: !0,
                    subtree: !0
                })
            }()
    }

    function r(e) {
        if (i && (u = I(p.cancelReplyId), f = I(p.commentFormId), u)) {
            u.addEventListener("touchstart", a), u.addEventListener("click", a);
            var t = function(e) {
                if ((e.metaKey || e.ctrlKey) && 13 === e.keyCode) return f.removeEventListener("keydown", t), e.preventDefault(), f.submit.click(), !1
            };
            f && f.addEventListener("keydown", t);
            for (var n, r = function(e) {
                    var t, n = p.commentReplyClass;
                    e && e.childNodes || (e = y);
                    t = y.getElementsByClassName ? e.getElementsByClassName(n) : e.querySelectorAll("." + n);
                    return t
                }(e), d = 0, o = r.length; d < o; d++)(n = r[d]).addEventListener("touchstart", l), n.addEventListener("click", l)
        }
    }

    function a(e) {
        var t = I(p.temporaryFormId);
        t && v && (I(p.parentIdFieldId).value = "0", t.parentNode.replaceChild(v, t), this.style.display = "none", e.preventDefault())
    }

    function l(e) {
        var t = this,
            n = m(t, "belowelement"),
            r = m(t, "commentid"),
            d = m(t, "respondelement"),
            o = m(t, "postid");
        n && r && d && o && !1 === s.addComment.moveForm(n, r, d, o) && e.preventDefault()
    }

    function d(e) {
        for (var t = e.length; t--;)
            if (e[t].addedNodes.length) return void r()
    }

    function m(e, t) {
        return n ? e.dataset[t] : e.getAttribute("data-" + t)
    }

    function I(e) {
        return y.getElementById(e)
    }
    return i && "loading" !== y.readyState ? t() : i && s.addEventListener("DOMContentLoaded", t, !1), {
        init: r,
        moveForm: function(e, t, n, r) {
            var d = I(e);
            v = I(n);
            var o, i, a, l = I(p.parentIdFieldId),
                m = I(p.postIdFieldId);
            if (d && v && l) {
                ! function(e) {
                    var t = p.temporaryFormId,
                        n = I(t);
                    if (n) return;
                    (n = y.createElement("div")).id = t, n.style.display = "none", e.parentNode.insertBefore(n, e)
                }(v), r && m && (m.value = r), l.value = t, u.style.display = "", d.parentNode.insertBefore(v, d.nextSibling), u.onclick = function() {
                    return !1
                };
                try {
                    for (var c = 0; c < f.elements.length; c++)
                        if (o = f.elements[c], i = !1, "getComputedStyle" in s ? a = s.getComputedStyle(o) : y.documentElement.currentStyle && (a = o.currentStyle), (o.offsetWidth <= 0 && o.offsetHeight <= 0 || "hidden" === a.visibility) && (i = !0), "hidden" !== o.type && !o.disabled && !i) {
                            o.focus();
                            break
                        }
                } catch (e) {}
                return !1
            }
        }
    }
}(window);;

function perPageBindings() {
    "use strict";
    $j(".qode_slider_preloader .ajax_loader_slider").hide(), content = $j(".content_inner"), contentMinHeight(), contentMinHeightWithPaspartu(), initQodeSlider(), initQodeCarousel(), initMessageHeight(), initListAnimation(), initPieChart(), initPieChartWithIcon(), initServiceAnimation(), initParallaxTitle(), loadMore(), prettyPhoto(), initFlexSlider(), fitVideo(), initAccordion(), initAccordionContentLink(), initMessages(), fitAudio(), initProgressBarsIcon(), initMoreFacts(), placeholderReplace(), initPortfolio(), initPortfolioZIndex(), initPortfolioJustifiedGallery(), initPortfolioMasonry(), initPortfolioMasonryFilter(), initTabs(), initTestimonials(), initTestimonialsCarousel(), initBlog(), initBlogMasonryFullWidth(), initQBlog(), initLoadNextPostOnBottom(), showContactMap(), backButtonShowHide(), backToTop(), initSteps(), showGoogleMap(), updateShoppingCart(), initProgressBarsVertical(), initImageHover(), countClientsPerRow(), animatedTextIconHeight(), checkAnchorOnScroll(), checkHeaderStyleOnScroll(), initVideoBackground(), initVideoBackgroundSize(), initIconWithTextAnimation(), initPortfolioSlider(), initBlogSlider(), initCoverBoxes(), countAnimatedTextIconPerRow(), ajaxSubmitCommentForm(), createContentMenu(), contentMenuScrollTo(), contentMenuCheckLastSection(), createSelectContentMenu(), initButtonHover(), initEnlargeButton(), initSocialIconHover(), initTabsActiveBorder(), setActiveTabBorder(), initImageGallerySliderNoSpace(), initVerticalSplitSlider(), initToCounter(), initCounter(), initCountdown(), initProgressBars(), initPageTitleAnimation(), initQodeElementAnimationSkrollr(), initIconShortcodeHover(), initIconWithTextHover(), initMasonryGallery(), parallaxLayers(), initHorizontalMarquee(), initBlogMasonryGallery(), initBlogGallery(), initPreviewSlider(), initInDeviceSlider(), initContentSlider(), qodeBlogCompundMasonryGallery().init(), qodeBlogHeadlines(), qodeBlogGalleryAnimation(), qodeInitStickyWidget(), qode_body.hasClass("woocommerce") && qodeInitProductListMasonryShortcode(), $j(".landing_holder").length && initExamplesFilter(), $j(".landing_tour").length && (initExamplesFilter(), initFullScreenWrap(), initSickyMenu())
}

function ajaxSetActiveState(a) {
    "use strict";
    $j(".main_menu a, .mobile_menu a, .vertical_menu a, .popup_menu a").parent().removeClass("active"), 0 === a.closest(".second").length ? a.parent().addClass("active") : a.closest(".second").parent().addClass("active"), a.closest(".mobile_menu").length > 0 && a.closest(".mobile_menu").find(".menu-item").addClass("active"), a.closest(".widget_nav_menu").length > 0 && ($j(".widget_nav_menu ul.menu > li").removeClass("current-menu-item"), a.closest(".widget_nav_menu").find(".menu-item").addClass("current-menu-item")), $j(".main_menu a, .mobile_menu a, .vertical_menu a, .popup_menu a").removeClass("current"), a.addClass("current")
}

function setPageMeta(a) {
    "use strict";
    var b = a.find(".meta .seo_title").text();
    document.title = b;
    var c = a.find(".meta .seo_description").text(),
        d = a.find(".meta .seo_keywords").text();
    "" != c && "" !== d && ($j('head meta[name="description"]').attr("content", c), $j('head meta[name="keywords"]').attr("content", d));
    var e = a.find(".meta .body_classes").text(),
        f = e.split(",");
    $j("body").removeClass();
    for (var g = 0; g < f.length; g++) "page_not_loaded" !== f[g] && $j("body").addClass(f[g])
}

function setToolBarEditLink(a) {
    "use strict";
    if ($j("#wp-admin-bar-edit").length > 0) {
        var b = a.find("#qode_page_id").text(),
            c = $j("#wp-admin-bar-edit a").attr("href"),
            d = c.replace(/(post=).*?(&)/, "$1" + b + "$2");
        $j("#wp-admin-bar-edit a").attr("href", d)
    }
}

function balanceNavArrows() {
    "use strict";
    var a;
    a = $j($j(".vertical_menu a").length ? ".vertical_menu a" : ".main_menu a");
    var b = !1;
    a.each(function(a) {
        var c = $j(a);
        return c.hasClass("current") ? void(b = !0) : void(b ? (c.removeClass("up"), c.removeClass("left"), c.addClass("down"), c.addClass("right")) : (c.removeClass("down"), c.removeClass("right"), c.addClass("up"), c.addClass("left")))
    })
}

function callCallback(a, b, c, d) {
    "use strict";
    a[b] && a[b].apply(c, d), $j(".paspartu_outer").removeAttr("style")
}

function slideOutOldPage(a, b, c, d, e) {
    "use strict";
    var f;
    $j(".content_inner").hasClass("updown") ? f = "ajax_updown" : $j(".content_inner").hasClass("fade") ? f = "ajax_fade" : $j(".content_inner").hasClass("updown_fade") ? f = "ajax_updown_fade" : $j(".content_inner").hasClass("leftright") ? f = "ajax_leftright" : $j("body").hasClass("ajax_updown") ? f = "ajax_updown" : $j("body").hasClass("ajax_fade") ? f = "ajax_fade" : $j("body").hasClass("ajax_updown_fade") ? f = "ajax_updown_fade" : $j("body").hasClass("ajax_leftright") && (f = "ajax_leftright");
    var g = a.height(),
        h = Math.max(g, $j(window).height());
    viewport.css("min-height", h), a.css({
        position: "relative",
        height: g
    });
    var i = $j(window).width();
    $j("html, body").animate({
        scrollTop: 0
    }, 400, function() {
        if ($j(".carousel").length && $j(".carousel").carousel("pause"), "ajax_updown" === f) {
            var j;
            j = "down" === b ? 0 - g : h, a.stop().animate({
                top: j
            }, d, function() {
                $j(this).hide().remove(), callCallback(e, "oncomplete", null, []), $j(".ajax_loader").fadeIn()
            })
        } else if ("ajax_fade" === f || "ajax_updown_fade" === f) $j("header.page_header.ajax_header_animation .drop_down > ul > li").mouseout(), $j("header.page_header.ajax_header_animation").delay(300).stop().fadeTo(d, 0), a.delay(300).stop().fadeTo(d, 0, function() {
            $j(this).hide().remove(), callCallback(e, "oncomplete", null, []), $j(".ajax_loader").fadeIn()
        });
        else if ("ajax_leftright" === f) {
            var k;
            k = "left" === c ? 0 - i : i, a.stop().animate({
                left: k
            }, d, function() {
                $j(this).hide().remove(), callCallback(e, "oncomplete", null, []), $j(".ajax_loader").fadeIn()
            })
        }
    }), $j("#multiscroll-nav").length && $j("#multiscroll-nav").remove()
}

function slideInNewPage(a, b, c, d, e, f) {
    "use strict";
    viewport.html("");
    var g, h, i = $j(a);
    i.find(".content_inner").hasClass("updown") ? g = "ajax_updown" : i.find(".content_inner").hasClass("fade") ? g = "ajax_fade" : i.find(".content_inner").hasClass("updown_fade") ? g = "ajax_updown_fade" : i.find(".content_inner").hasClass("leftright") ? g = "ajax_leftright" : i.find(".content_inner").hasClass("no_animation") ? g = "ajax_no_animation" : $j("body").hasClass("ajax_updown") ? g = "ajax_updown" : $j("body").hasClass("ajax_fade") ? g = "ajax_fade" : $j("body").hasClass("ajax_updown_fade") ? g = "ajax_updown_fade" : $j("body").hasClass("ajax_leftright") && (g = "ajax_leftright"), h = i.find("header.page_header").hasClass("light") ? "light" : i.find("header.page_header").hasClass("dark") ? "dark" : header_style_admin;
    var j;
    j = i.find(".header_bottom").attr("style") ? i.find(".header_bottom").attr("style") : "";
    var k;
    k = i.find(".header_top").attr("style") ? i.find(".header_top").attr("style") : "";
    var l;
    l = i.find(".content").hasClass("content_top_margin") ? "content_top_margin" : "";
    var m;
    m = i.find(".content").hasClass("content_top_margin_none") ? " content_top_margin_none" : "";
    var n;
    n = i.find(".content").hasClass("has_slider") ? " has_slider" : "";
    var o, p = i.find("header").hasClass("transparent") ? " transparent" : "",
        q = i.find("header").hasClass("header_style_on_scroll") ? " header_style_on_scroll" : "";
    o = i.find("aside.vertical_menu_area").attr("style") ? i.find("aside.vertical_menu_area").attr("style") : "";
    var r;
    r = i.find("aside.vertical_menu_area .vertical_area_background").attr("style") ? i.find("aside.vertical_menu_area .vertical_area_background").attr("style") : "";
    var s = i.find(".content_inner").hide().css({
        position: "relative",
        visibility: "hidden"
    }).show();
    s.find(".animate_title_text .title h1").css({
        visibility: "hidden"
    }), viewport.append(s), $j(".side_menu_button a").removeClass("opened"), i.filter("script").each(function() {
        $j.globalEval(this.text || this.textContent || this.innerHTML || "")
    }), s.waitForImages(function() {
        $j(".flexslider, .slider_small, .portfolio_outer").css("visibility", "visible"), setPageMeta(i), perPageBindings();
        var a = s.height();
        $j(window).height() > a ? viewport.css("min-height", a) : viewport.css("min-height", $j(window).height()), $j(".paspartu_outer").css("min-height", a), s.find(".animate_title_text .title h1").css({
            visibility: "visible"
        });
        var t = $j(window).width();
        if ($j("header.page_header").hasClass("light") ? "dark" !== h && "" !== h || ($j("header").removeClass("light").addClass(h), $j("aside.vertical_menu_area").removeClass("light").addClass(h)) : $j("header.page_header").hasClass("dark") ? "light" !== h && "" !== h || ($j("header").removeClass("dark").addClass(h), $j("aside.vertical_menu_area").removeClass("dark").addClass(h)) : "light" === h || "dark" === h || "" === h ? ($j("header.page_header").addClass(h), $j("aside.vertical_menu_area").addClass(h)) : ($j("header.page_header").removeClass("left right").addClass(h), $j("aside.vertical_menu_area").removeClass("left right").addClass(h)), $j(".carousel").length && checkSliderForHeaderStyle($j(".carousel .active")), "" !== j ? $j(".header_bottom").attr("style", j) : $j(".header_bottom").removeAttr("style"), "" !== k ? $j(".header_top").attr("style", k) : $j(".header_top").removeAttr("style"), "" !== l ? $j(".content").addClass(l) : $j(".content").removeClass("content_top_margin"), "" !== m ? $j(".content").addClass(m) : $j(".content").removeClass("content_top_margin_none"), "" !== n ? $j(".content").addClass(n) : $j(".content").removeClass("has_slider"), "" !== p ? $j("header").addClass(p) : $j("header").removeClass("transparent"), "" !== q ? $j("header").addClass(q) : $j("header").removeClass("header_style_on_scroll"), "" !== o ? $j("aside.vertical_menu_area").attr("style", o) : $j("aside.vertical_menu_area").removeAttr("style"), "" !== r) {
            $j("aside.vertical_menu_area .vertical_area_background").css("opacity", 0);
            var u = image_src_regex.exec(r),
                v = new Image;
            v.src = u[1], $j(v).load(function() {
                setTimeout(function() {
                    $j("aside.vertical_menu_area .vertical_area_background").attr("style", r).css("opacity", 1)
                }, 600)
            })
        } else $j("aside.vertical_menu_area .vertical_area_background").removeAttr("style");
        var w = "#" + f.split("#")[1];
        $j(".ajax_loader").length ? $j(".ajax_loader").fadeOut(400, function() {
            anchorAjaxScroll(w)
        }) : anchorAjaxScroll(w), "ajax_updown" === g || "ajax_updown_fade" === g ? ("down" === b ? s.css({
            top: viewport.height()
        }) : s.css({
            top: -a
        }), "ajax_updown_fade" === g && ($j("header.page_header.ajax_header_animation .drop_down > ul > li").mouseout(), $j("header.page_header.ajax_header_animation").stop().fadeTo(d, 1)), s.css({
            visibility: "visible"
        }).stop().animate({
            top: 0
        }, d, function() {
            initElementsAnimation(), initFullScreenTemplate(), initPortfolioSingleInfo(), initTitleAreaAnimation(), initSmallImageBlogHeight(), $j(".blog_holder.masonry").isotope("layout"), $j(".blog_holder.masonry_full_width").isotope("layout"), $j(".q_masonry_blog").isotope("layout"), $j(".content").css("min-height", $j(window).height() - $j("header.page_header").height() - $j("footer:not(.uncover)").height() + 100), $j("nav.content_menu").length > 0 && (content_menu_position = $j("nav.content_menu").offset().top, contentMenuPosition()), initParallax(), callCallback(e, "oncomplete", null, []), $j(document).trigger("qodeAjaxPageLoad")
        })) : "ajax_fade" === g ? ($j("header.page_header.ajax_header_animation .drop_down > ul > li").mouseout(), $j("header.page_header.ajax_header_animation").stop().fadeTo(d, 1), s.css({
            visibility: "visible",
            display: "none"
        }).stop().fadeTo(d, 1, function() {
            initElementsAnimation(), initFullScreenTemplate(), initPortfolioSingleInfo(), initTitleAreaAnimation(), initSmallImageBlogHeight(), $j(".blog_holder.masonry").isotope("layout"), $j(".blog_holder.masonry_full_width").isotope("layout"), $j(".q_masonry_blog").isotope("layout"), $j(".content").css("min-height", $j(window).height() - $j("header.page_header").height() - $j("footer:not(.uncover)").height()), $j("nav.content_menu").length > 0 && (content_menu_position = $j("nav.content_menu").offset().top, contentMenuPosition()), initParallax(), callCallback(e, "oncomplete", null, []), $j(document).trigger("qodeAjaxPageLoad")
        })) : "ajax_no_animation" === g ? s.css({
            visibility: "visible",
            display: "none"
        }).stop().fadeIn(0, function() {
            initElementsAnimation(), initFullScreenTemplate(), initPortfolioSingleInfo(), initTitleAreaAnimation(), initSmallImageBlogHeight(), $j(".blog_holder.masonry").isotope("layout"), $j(".blog_holder.masonry_full_width").isotope("layout"), $j(".q_masonry_blog").isotope("layout"), $j(".content").css("min-height", $j(window).height() - $j("header.page_header").height() - $j("footer:not(.uncover)").height() + 100), $j("nav.content_menu").length > 0 && (content_menu_position = $j("nav.content_menu").offset().top, contentMenuPosition()), initParallax(), callCallback(e, "oncomplete", null, []), $j(document).trigger("qodeAjaxPageLoad")
        }) : "ajax_leftright" === g && ("left" === c ? s.css({
            left: t
        }) : s.css({
            left: -t
        }), s.css({
            visibility: "visible"
        }).stop().animate({
            left: 0
        }, d, function() {
            initElementsAnimation(), initFullScreenTemplate(), initPortfolioSingleInfo(), initTitleAreaAnimation(), initSmallImageBlogHeight(), $j(".blog_holder.masonry").isotope("layout"), $j(".blog_holder.masonry_full_width").isotope("layout"), $j(".q_masonry_blog").isotope("layout"), $j(".content").css("min-height", $j(window).height() - $j("header.page_header").height() - $j("footer:not(.uncover)").height() + 100), $j("nav.content_menu").length > 0 && (content_menu_position = $j("nav.content_menu").offset().top, contentMenuPosition()), initParallax(), callCallback(e, "oncomplete", null, []), $j(document).trigger("qodeAjaxPageLoad")
        }))
    }), setToolBarEditLink(i)
}

function anchorAjaxScroll(a) {
    var b, c = $j("body").hasClass("paspartu_on_top_fixed") ? $window_width * paspartu_width : 0;
    if (void 0 !== a && $j('[data-q_id="' + a + '"]').length > 0) {
        if ($window_width > 1e3)
            if ($j("header.page_header").hasClass("fixed") && !$j("body").hasClass("vertical_menu_enabled")) {
                var d;
                if (d = $j("header.page_header").hasClass("scroll_top") ? header_top_height : 0, !$j("header.page_header").hasClass("transparent") || $j("header.page_header").hasClass("scrolled_not_transparent"))
                    if (header_height - ($j('[data-q_id="' + a + '"]').offset().top + d) / 4 >= min_header_height_scroll) {
                        var e = $j('[data-q_id="' + a + '"]').offset().top - header_height - c;
                        b = e + e / 4 + e / 16 + e / 64 + 1
                    } else b = $j("header.page_header").hasClass("centered_logo") ? $j('[data-q_id="' + a + '"]').offset().top - min_header_height_scroll - logo_height - 30 - c : $j('[data-q_id="' + a + '"]').offset().top - min_header_height_scroll - c;
                else b = $j('[data-q_id="' + a + '"]').offset().top - c
            } else b = $j("header.page_header").hasClass("fixed_top_header") && !$j("body").hasClass("vertical_menu_enabled") ? !$j("header.page_header").hasClass("transparent") || $j("header.page_header").hasClass("scrolled_not_transparent") ? $j('[data-q_id="' + a + '"]').offset().top - header_top_height - c : $j('[data-q_id="' + a + '"]').offset().top - c : $j("header.page_header").hasClass("fixed_hiding") && !$j("body").hasClass("vertical_menu_enabled") ? !$j("header.page_header").hasClass("transparent") || $j("header.page_header").hasClass("scrolled_not_transparent") ? $j('[data-q_id="' + a + '"]').offset().top - (header_height + logo_height / 2 + 40) <= scroll_amount_for_fixed_hiding ? $j('[data-q_id="' + a + '"]').offset().top - header_height - logo_height / 2 - 40 - c : $j('[data-q_id="' + a + '"]').offset().top - min_header_height_fixed_hidden - 40 - c : $j('[data-q_id="' + a + '"]').offset().top - c : ($j("header.page_header").hasClass("stick") || $j("header.page_header").hasClass("stick_with_left_right_menu") && !$j("body").hasClass("vertical_menu_enabled")) && (!$j("header.page_header").hasClass("transparent") || $j("header.page_header").hasClass("scrolled_not_transparent")) ? sticky_amount >= $j('[data-q_id="' + a + '"]').offset().top ? $j('[data-q_id="' + a + '"]').offset().top + 1 - c : $j('[data-q_id="' + a + '"]').offset().top - min_header_height_sticky - c : $j('[data-q_id="' + a + '"]').offset().top - c;
        else b = $j('[data-q_id="' + a + '"]').offset().top - c;
        $j("html, body").animate({
            scrollTop: Math.round(b)
        }, 1500, function() {})
    }
}

function onLinkClicked(a) {
    "use strict";
    var b;
    return b = void 0 === a.attr("href") ? a.attr("value").split(qode_root)[1] : a.attr("href").split(qode_root)[1], a.hasClass("current") ? void 0 : loadResource(b)
}

function loadResource(a) {
    "use strict";
    var b = $j("nav a[href='" + qode_root + a + "']"),
        c = $j("body").hasClass("page_not_loaded") ? 0 : PAGE_TRANSITION_SPEED,
        d = b.hasClass("up") ? "up" : "down",
        e = b.hasClass("left") ? "left" : "right",
        f = !1;
    $j.ajax({
        url: qode_root + a,
        dataType: "html",
        async: !0,
        success: function(g, h, i) {
            function j() {
                return f ? (slideInNewPage(g, d, e, c, {
                    oncomplete: function() {
                        ajaxSetActiveState(b)
                    }
                }, a), void balanceNavArrows()) : window.setTimeout(j, 100)
            }
            if (j(), firstLoad = !1, window.history.pushState) {
                var k = qode_root + a;
                k !== window.location && window.history.pushState({
                    path: k
                }, "", k), "undefined" != typeof _gaq && _gaq.push(["_trackPageview", qode_root + a])
            } else document.location.href = qode_root + "#/" + a
        },
        error: function() {},
        statusCode: {
            404: function() {
                alert("Page not found!")
            }
        }
    }), slideOutOldPage(content, d, e, c, {
        oncomplete: function() {
            f = !0
        }
    }), $j("body").hasClass("page_not_loaded") && $j("body").removeClass("page_not_loaded")
}
var $j = jQuery.noConflict(),
    firstLoad = !0,
    image_src_regex = /url\(["']?([^'")]+)['"]?\)/;
window.history.pushState && $j(window).bind("popstate", function() {
    "use strict";
    var a = location.href;
    a = a.split(qode_root)[1], firstLoad || loadResource(a)
});
var content, viewport, PAGE_TRANSITION_SPEED, disableHashChange = !0;
$j(document).ready(function() {
    "use strict";
    return PAGE_TRANSITION_SPEED = 1e3, viewport = $j(".content"), content = $j(".content_inner"), $j("body").hasClass("woocommerce") || $j("body").hasClass("woocommerce-page") ? !1 : void $j(document).on("click", 'a[target!="_blank"]:not(.no_ajax):not(.no_link)', function(a) {
        if (1 == a.ctrlKey) return window.open($j(this).attr("href"), "_blank"), !1;
        if ($j(this).hasClass("bx-prev")) return !1;
        if ($j(this).hasClass("bx-next")) return !1;
        if ($j(this).parent().hasClass("load_more")) return !1;
        if ($j(this).parent().parent().hasClass("blog_load_more_button")) return !1;
        if ($j(this).parent().parent().hasClass("blog_vertical_loop_button")) return !1;
        if ($j(this).parent().parent().hasClass("blog_vertical_loop_back_button")) return !1;
        if ($j(this).parent().hasClass("comments_number")) {
            var b = $j(this).attr("href").split("#")[1];
            return $j("html, body").scrollTop($j("#" + b).offset().top), !1
        }
        if (window.location.href.split("#")[0] == $j(this).attr("href").split("#")[0]) return !1;
        if (0 === $j(this).closest(".no_animation").length) {
            if (document.location.href.indexOf("?s=") >= 0) return !0;
            if ($j(this).attr("href").indexOf("wp-admin") >= 0) return !0;
            if ($j(this).attr("href").indexOf("wp-content") >= 0) return !0;
            if (-1 !== jQuery.inArray($j(this).attr("href"), no_ajax_pages)) return document.location.href = $j(this).attr("href"), !1;
            if ("http://#" === $j(this).attr("href") || "#" === $j(this).attr("href")) return !1;
            disableHashChange = !0;
            var c = $j(this).attr("href"),
                d = c.indexOf(qode_root);
            0 === d && (a.preventDefault(), a.stopImmediatePropagation(), a.stopPropagation(), onLinkClicked($j(this)))
        }
    })
});;
/*!
 * WPBakery Page Builder v6.0.0 (https://wpbakery.com)
 * Copyright 2011-2019 Michael M, WPBakery
 * License: Commercial. More details: http://go.wpbakery.com/licensing
 */
document.documentElement.className += " js_active ", document.documentElement.className += "ontouchstart" in document.documentElement ? " vc_mobile " : " vc_desktop ",
    function() {
        for (var prefix = ["-webkit-", "-moz-", "-ms-", "-o-", ""], i = 0; i < prefix.length; i++) prefix[i] + "transform" in document.documentElement.style && (document.documentElement.className += " vc_transform ")
    }(),
    function($) {
        "function" != typeof window.vc_js && (window.vc_js = function() {
            "use strict";
            vc_toggleBehaviour(), vc_tabsBehaviour(), vc_accordionBehaviour(), vc_teaserGrid(), vc_carouselBehaviour(), vc_slidersBehaviour(), vc_prettyPhoto(), vc_pinterest(), vc_progress_bar(), vc_plugin_flexslider(), vc_gridBehaviour(), vc_rowBehaviour(), vc_prepareHoverBox(), vc_googleMapsPointer(), vc_ttaActivation(), jQuery(document).trigger("vc_js"), window.setTimeout(vc_waypoints, 500)
        }), "function" != typeof window.vc_plugin_flexslider && (window.vc_plugin_flexslider = function($parent) {
            ($parent ? $parent.find(".wpb_flexslider") : jQuery(".wpb_flexslider")).each(function() {
                var this_element = jQuery(this),
                    sliderTimeout = 1e3 * parseInt(this_element.attr("data-interval"), 10),
                    sliderFx = this_element.attr("data-flex_fx"),
                    slideshow = !0;
                0 === sliderTimeout && (slideshow = !1), this_element.is(":visible") && this_element.flexslider({
                    animation: sliderFx,
                    slideshow: slideshow,
                    slideshowSpeed: sliderTimeout,
                    sliderSpeed: 800,
                    smoothHeight: !0
                })
            })
        }), "function" != typeof window.vc_googleplus && (window.vc_googleplus = function() {
            0 < jQuery(".wpb_googleplus").length && function() {
                var po = document.createElement("script");
                po.type = "text/javascript", po.async = !0, po.src = "https://apis.google.com/js/plusone.js";
                var s = document.getElementsByTagName("script")[0];
                s.parentNode.insertBefore(po, s)
            }()
        }), "function" != typeof window.vc_pinterest && (window.vc_pinterest = function() {
            0 < jQuery(".wpb_pinterest").length && function() {
                var po = document.createElement("script");
                po.type = "text/javascript", po.async = !0, po.src = "https://assets.pinterest.com/js/pinit.js";
                var s = document.getElementsByTagName("script")[0];
                s.parentNode.insertBefore(po, s)
            }()
        }), "function" != typeof window.vc_progress_bar && (window.vc_progress_bar = function() {
            void 0 !== jQuery.fn.vcwaypoint && jQuery(".vc_progress_bar").each(function() {
                var $el = jQuery(this);
                $el.vcwaypoint(function() {
                    $el.find(".vc_single_bar").each(function(index) {
                        var bar = jQuery(this).find(".vc_bar"),
                            val = bar.data("percentage-value");
                        setTimeout(function() {
                            bar.css({
                                width: val + "%"
                            })
                        }, 200 * index)
                    })
                }, {
                    offset: "85%"
                })
            })
        }), "function" != typeof window.vc_waypoints && (window.vc_waypoints = function() {
            void 0 !== jQuery.fn.vcwaypoint && jQuery(".wpb_animate_when_almost_visible:not(.wpb_start_animation)").each(function() {
                var $el = jQuery(this);
                $el.vcwaypoint(function() {
                    $el.addClass("wpb_start_animation animated")
                }, {
                    offset: "85%"
                })
            })
        }), "function" != typeof window.vc_toggleBehaviour && (window.vc_toggleBehaviour = function($el) {
            function event(e) {
                e && e.preventDefault && e.preventDefault();
                var element = jQuery(this).closest(".vc_toggle"),
                    content = element.find(".vc_toggle_content");
                element.hasClass("vc_toggle_active") ? content.slideUp({
                    duration: 300,
                    complete: function() {
                        element.removeClass("vc_toggle_active")
                    }
                }) : content.slideDown({
                    duration: 300,
                    complete: function() {
                        element.addClass("vc_toggle_active")
                    }
                })
            }
            $el ? $el.hasClass("vc_toggle_title") ? $el.unbind("click").on("click", event) : $el.find(".vc_toggle_title").off("click").on("click", event) : jQuery(".vc_toggle_title").off("click").on("click", event)
        }), "function" != typeof window.vc_tabsBehaviour && (window.vc_tabsBehaviour = function($tab) {
            if (jQuery.ui) {
                var $call = $tab || jQuery(".wpb_tabs, .wpb_tour"),
                    ver = jQuery.ui && jQuery.ui.version ? jQuery.ui.version.split(".") : "1.10",
                    old_version = 1 === parseInt(ver[0], 10) && parseInt(ver[1], 10) < 9;
                $call.each(function(index) {
                    var $tabs, interval = jQuery(this).attr("data-interval"),
                        tabs_array = [];
                    if ($tabs = jQuery(this).find(".wpb_tour_tabs_wrapper").tabs({
                            show: function(event, ui) {
                                wpb_prepare_tab_content(event, ui)
                            },
                            activate: function(event, ui) {
                                wpb_prepare_tab_content(event, ui)
                            }
                        }), interval && 0 < interval) try {
                        $tabs.tabs("rotate", 1e3 * interval)
                    } catch (err) {
                        window.console && window.console.warn && console.warn("tabs behaviours error", err)
                    }
                    jQuery(this).find(".wpb_tab").each(function() {
                        tabs_array.push(this.id)
                    }), jQuery(this).find(".wpb_tabs_nav li").on("click", function(e) {
                        return e && e.preventDefault && e.preventDefault(), old_version ? $tabs.tabs("select", jQuery("a", this).attr("href")) : $tabs.tabs("option", "active", jQuery(this).index()), !1
                    }), jQuery(this).find(".wpb_prev_slide a, .wpb_next_slide a").on("click", function(e) {
                        var index, length;
                        e && e.preventDefault && e.preventDefault(), old_version ? (index = $tabs.tabs("option", "selected"), jQuery(this).parent().hasClass("wpb_next_slide") ? index++ : index--, index < 0 ? index = $tabs.tabs("length") - 1 : index >= $tabs.tabs("length") && (index = 0), $tabs.tabs("select", index)) : (index = $tabs.tabs("option", "active"), length = $tabs.find(".wpb_tab").length, index = jQuery(this).parent().hasClass("wpb_next_slide") ? length <= index + 1 ? 0 : index + 1 : index - 1 < 0 ? length - 1 : index - 1, $tabs.tabs("option", "active", index))
                    })
                })
            }
        }), "function" != typeof window.vc_accordionBehaviour && (window.vc_accordionBehaviour = function() {
            jQuery(".wpb_accordion").each(function(index) {
                var $tabs, active_tab, collapsible, $this = jQuery(this);
                $this.attr("data-interval"), collapsible = !1 === (active_tab = !isNaN(jQuery(this).data("active-tab")) && 0 < parseInt($this.data("active-tab"), 10) && parseInt($this.data("active-tab"), 10) - 1) || "yes" === $this.data("collapsible"), $tabs = $this.find(".wpb_accordion_wrapper").accordion({
                    header: "> div > h3",
                    autoHeight: !1,
                    heightStyle: "content",
                    active: active_tab,
                    collapsible: collapsible,
                    navigation: !0,
                    activate: vc_accordionActivate,
                    change: function(event, ui) {
                        void 0 !== jQuery.fn.isotope && ui.newContent.find(".isotope").isotope("layout"), vc_carouselBehaviour(ui.newPanel)
                    }
                }), !0 === $this.data("vcDisableKeydown") && ($tabs.data("uiAccordion")._keydown = function() {})
            })
        }), "function" != typeof window.vc_teaserGrid && (window.vc_teaserGrid = function() {
            var layout_modes = {
                fitrows: "fitRows",
                masonry: "masonry"
            };
            jQuery(".wpb_grid .teaser_grid_container:not(.wpb_carousel), .wpb_filtered_grid .teaser_grid_container:not(.wpb_carousel)").each(function() {
                var $container = jQuery(this),
                    $thumbs = $container.find(".wpb_thumbnails"),
                    layout_mode = $thumbs.attr("data-layout-mode");
                $thumbs.isotope({
                    itemSelector: ".isotope-item",
                    layoutMode: void 0 === layout_modes[layout_mode] ? "fitRows" : layout_modes[layout_mode]
                }), $container.find(".categories_filter a").data("isotope", $thumbs).on("click", function(e) {
                    e && e.preventDefault && e.preventDefault();
                    var $thumbs = jQuery(this).data("isotope");
                    jQuery(this).parent().parent().find(".active").removeClass("active"), jQuery(this).parent().addClass("active"), $thumbs.isotope({
                        filter: jQuery(this).attr("data-filter")
                    })
                }), jQuery(window).bind("load resize", function() {
                    $thumbs.isotope("layout")
                })
            })
        }), "function" != typeof window.vc_carouselBehaviour && (window.vc_carouselBehaviour = function($parent) {
            ($parent ? $parent.find(".wpb_carousel") : jQuery(".wpb_carousel")).each(function() {
                var $this = jQuery(this);
                if (!0 !== $this.data("carousel_enabled") && $this.is(":visible")) {
                    $this.data("carousel_enabled", !0);
                    getColumnsCount(jQuery(this));
                    jQuery(this).hasClass("columns_count_1") && 900;
                    var carousel_li = jQuery(this).find(".wpb_thumbnails-fluid li");
                    carousel_li.css({
                        "margin-right": carousel_li.css("margin-left"),
                        "margin-left": 0
                    });
                    var fluid_ul = jQuery(this).find("ul.wpb_thumbnails-fluid");
                    fluid_ul.width(fluid_ul.width() + 300), jQuery(window).on("resize", function() {
                        screen_size != (screen_size = getSizeName()) && window.setTimeout(function() {
                            location.reload()
                        }, 20)
                    })
                }
            })
        }), "function" != typeof window.vc_slidersBehaviour && (window.vc_slidersBehaviour = function() {
            jQuery(".wpb_gallery_slides").each(function(index) {
                var $imagesGrid, this_element = jQuery(this);
                if (this_element.hasClass("wpb_slider_nivo")) {
                    var sliderTimeout = 1e3 * this_element.attr("data-interval");
                    0 === sliderTimeout && (sliderTimeout = 9999999999), this_element.find(".nivoSlider").nivoSlider({
                        effect: "boxRainGrow,boxRain,boxRainReverse,boxRainGrowReverse",
                        slices: 15,
                        boxCols: 8,
                        boxRows: 4,
                        animSpeed: 800,
                        pauseTime: sliderTimeout,
                        startSlide: 0,
                        directionNav: !0,
                        directionNavHide: !0,
                        controlNav: !0,
                        keyboardNav: !1,
                        pauseOnHover: !0,
                        manualAdvance: !1,
                        prevText: "Prev",
                        nextText: "Next"
                    })
                } else this_element.hasClass("wpb_image_grid") && (jQuery.fn.imagesLoaded ? $imagesGrid = this_element.find(".wpb_image_grid_ul").imagesLoaded(function() {
                    $imagesGrid.isotope({
                        itemSelector: ".isotope-item",
                        layoutMode: "fitRows"
                    })
                }) : this_element.find(".wpb_image_grid_ul").isotope({
                    itemSelector: ".isotope-item",
                    layoutMode: "fitRows"
                }))
            })
        }), "function" != typeof window.vc_prettyPhoto && (window.vc_prettyPhoto = function() {
            try {
                jQuery && jQuery.fn && jQuery.fn.prettyPhoto && jQuery('a.prettyphoto, .gallery-icon a[href*=".jpg"]').prettyPhoto({
                    animationSpeed: "normal",
                    hook: "data-rel",
                    padding: 15,
                    opacity: .7,
                    showTitle: !0,
                    allowresize: !0,
                    counter_separator_label: "/",
                    hideflash: !1,
                    deeplinking: !1,
                    modal: !1,
                    callback: function() {
                        -1 < location.href.indexOf("#!prettyPhoto") && (location.hash = "")
                    },
                    social_tools: ""
                })
            } catch (err) {
                window.console && window.console.warn && window.console.warn("vc_prettyPhoto initialize error", err)
            }
        }), "function" != typeof window.vc_google_fonts && (window.vc_google_fonts = function() {
            return window.console && window.console.warn && window.console.warn("function vc_google_fonts is deprecated, no need to use it"), !1
        }), window.vcParallaxSkroll = !1, "function" != typeof window.vc_rowBehaviour && (window.vc_rowBehaviour = function() {
            var vcSkrollrOptions, callSkrollInit, $ = window.jQuery;

            function fullWidthRow() {
                var $elements = $('[data-vc-full-width="true"]');
                $.each($elements, function(key, item) {
                    var $el = $(this);
                    $el.addClass("vc_hidden");
                    var $el_full = $el.next(".vc_row-full-width");
                    if ($el_full.length || ($el_full = $el.parent().next(".vc_row-full-width")), $el_full.length) {
                        var padding, paddingRight, el_margin_left = parseInt($el.css("margin-left"), 10),
                            el_margin_right = parseInt($el.css("margin-right"), 10),
                            offset = 0 - $el_full.offset().left - el_margin_left,
                            width = $(window).width();
                        if ("rtl" === $el.css("direction") && (offset -= $el_full.width(), offset += width, offset += el_margin_left, offset += el_margin_right), $el.css({
                                position: "relative",
                                left: offset,
                                "box-sizing": "border-box",
                                width: width
                            }), !$el.data("vcStretchContent")) "rtl" === $el.css("direction") ? ((padding = offset) < 0 && (padding = 0), (paddingRight = offset) < 0 && (paddingRight = 0)) : ((padding = -1 * offset) < 0 && (padding = 0), (paddingRight = width - padding - $el_full.width() + el_margin_left + el_margin_right) < 0 && (paddingRight = 0)), $el.css({
                            "padding-left": padding + "px",
                            "padding-right": paddingRight + "px"
                        });
                        $el.attr("data-vc-full-width-init", "true"), $el.removeClass("vc_hidden"), $(document).trigger("vc-full-width-row-single", {
                            el: $el,
                            offset: offset,
                            marginLeft: el_margin_left,
                            marginRight: el_margin_right,
                            elFull: $el_full,
                            width: width
                        })
                    }
                }), $(document).trigger("vc-full-width-row", $elements)
            }

            function fullHeightRow() {
                var windowHeight, offsetTop, fullHeight, $element = $(".vc_row-o-full-height:first");
                $element.length && (windowHeight = $(window).height(), (offsetTop = $element.offset().top) < windowHeight && (fullHeight = 100 - offsetTop / (windowHeight / 100), $element.css("min-height", fullHeight + "vh")));
                $(document).trigger("vc-full-height-row", $element)
            }
            $(window).off("resize.vcRowBehaviour").on("resize.vcRowBehaviour", fullWidthRow).on("resize.vcRowBehaviour", fullHeightRow), fullWidthRow(), fullHeightRow(), (0 < window.navigator.userAgent.indexOf("MSIE ") || navigator.userAgent.match(/Trident.*rv\:11\./)) && $(".vc_row-o-full-height").each(function() {
                "flex" === $(this).css("display") && $(this).wrap('<div class="vc_ie-flexbox-fixer"></div>')
            }), vc_initVideoBackgrounds(), callSkrollInit = !1, window.vcParallaxSkroll && window.vcParallaxSkroll.destroy(), $(".vc_parallax-inner").remove(), $("[data-5p-top-bottom]").removeAttr("data-5p-top-bottom data-30p-top-bottom"), $("[data-vc-parallax]").each(function() {
                var skrollrSize, skrollrStart, $parallaxElement, parallaxImage, youtubeId;
                callSkrollInit = !0, "on" === $(this).data("vcParallaxOFade") && $(this).children().attr("data-5p-top-bottom", "opacity:0;").attr("data-30p-top-bottom", "opacity:1;"), skrollrSize = 100 * $(this).data("vcParallax"), ($parallaxElement = $("<div />").addClass("vc_parallax-inner").appendTo($(this))).height(skrollrSize + "%"), parallaxImage = $(this).data("vcParallaxImage"), (youtubeId = vcExtractYoutubeId(parallaxImage)) ? insertYoutubeVideoAsBackground($parallaxElement, youtubeId) : void 0 !== parallaxImage && $parallaxElement.css("background-image", "url(" + parallaxImage + ")"), skrollrStart = -(skrollrSize - 100), $parallaxElement.attr("data-bottom-top", "top: " + skrollrStart + "%;").attr("data-top-bottom", "top: 0%;")
            }), callSkrollInit && window.skrollr && (vcSkrollrOptions = {
                forceHeight: !1,
                smoothScrolling: !1,
                mobileCheck: function() {
                    return !1
                }
            }, window.vcParallaxSkroll = skrollr.init(vcSkrollrOptions), window.vcParallaxSkroll)
        }), "function" != typeof window.vc_gridBehaviour && (window.vc_gridBehaviour = function() {
            jQuery.fn.vcGrid && jQuery("[data-vc-grid]").vcGrid()
        }), "function" != typeof window.getColumnsCount && (window.getColumnsCount = function(el) {
            for (var find = !1, i = 1; !1 === find;) {
                if (el.hasClass("columns_count_" + i)) return find = !0, i;
                i++
            }
        });
        var screen_size = getSizeName();

        function getSizeName() {
            var screen_w = jQuery(window).width();
            return 1170 < screen_w ? "desktop_wide" : 960 < screen_w && screen_w < 1169 ? "desktop" : 768 < screen_w && screen_w < 959 ? "tablet" : 300 < screen_w && screen_w < 767 ? "mobile" : screen_w < 300 ? "mobile_portrait" : ""
        }
        "function" != typeof window.wpb_prepare_tab_content && (window.wpb_prepare_tab_content = function(event, ui) {
            var $ui_panel, $google_maps, panel = ui.panel || ui.newPanel,
                $pie_charts = panel.find(".vc_pie_chart:not(.vc_ready)"),
                $round_charts = panel.find(".vc_round-chart"),
                $line_charts = panel.find(".vc_line-chart"),
                $carousel = panel.find('[data-ride="vc_carousel"]');
            if (vc_carouselBehaviour(), vc_plugin_flexslider(panel), ui.newPanel.find(".vc_masonry_media_grid, .vc_masonry_grid").length && ui.newPanel.find(".vc_masonry_media_grid, .vc_masonry_grid").each(function() {
                    var grid = jQuery(this).data("vcGrid");
                    grid && grid.gridBuilder && grid.gridBuilder.setMasonry && grid.gridBuilder.setMasonry()
                }), panel.find(".vc_masonry_media_grid, .vc_masonry_grid").length && panel.find(".vc_masonry_media_grid, .vc_masonry_grid").each(function() {
                    var grid = jQuery(this).data("vcGrid");
                    grid && grid.gridBuilder && grid.gridBuilder.setMasonry && grid.gridBuilder.setMasonry()
                }), $pie_charts.length && jQuery.fn.vcChat && $pie_charts.vcChat(), $round_charts.length && jQuery.fn.vcRoundChart && $round_charts.vcRoundChart({
                    reload: !1
                }), $line_charts.length && jQuery.fn.vcLineChart && $line_charts.vcLineChart({
                    reload: !1
                }), $carousel.length && jQuery.fn.carousel && $carousel.carousel("resizeAction"), $ui_panel = panel.find(".isotope, .wpb_image_grid_ul"), $google_maps = panel.find(".wpb_gmaps_widget"), 0 < $ui_panel.length && $ui_panel.isotope("layout"), $google_maps.length && !$google_maps.is(".map_ready")) {
                var $frame = $google_maps.find("iframe");
                $frame.attr("src", $frame.attr("src")), $google_maps.addClass("map_ready")
            }
            panel.parents(".isotope").length && panel.parents(".isotope").each(function() {
                jQuery(this).isotope("layout")
            })
        }), "function" != typeof window.vc_ttaActivation && (window.vc_ttaActivation = function() {
            jQuery("[data-vc-accordion]").on("show.vc.accordion", function(e) {
                var $ = window.jQuery,
                    ui = {};
                ui.newPanel = $(this).data("vc.accordion").getTarget(), window.wpb_prepare_tab_content(e, ui)
            })
        }), "function" != typeof window.vc_accordionActivate && (window.vc_accordionActivate = function(event, ui) {
            if (ui.newPanel.length && ui.newHeader.length) {
                var $pie_charts = ui.newPanel.find(".vc_pie_chart:not(.vc_ready)"),
                    $round_charts = ui.newPanel.find(".vc_round-chart"),
                    $line_charts = ui.newPanel.find(".vc_line-chart"),
                    $carousel = ui.newPanel.find('[data-ride="vc_carousel"]');
                void 0 !== jQuery.fn.isotope && ui.newPanel.find(".isotope, .wpb_image_grid_ul").isotope("layout"), ui.newPanel.find(".vc_masonry_media_grid, .vc_masonry_grid").length && ui.newPanel.find(".vc_masonry_media_grid, .vc_masonry_grid").each(function() {
                    var grid = jQuery(this).data("vcGrid");
                    grid && grid.gridBuilder && grid.gridBuilder.setMasonry && grid.gridBuilder.setMasonry()
                }), vc_carouselBehaviour(ui.newPanel), vc_plugin_flexslider(ui.newPanel), $pie_charts.length && jQuery.fn.vcChat && $pie_charts.vcChat(), $round_charts.length && jQuery.fn.vcRoundChart && $round_charts.vcRoundChart({
                    reload: !1
                }), $line_charts.length && jQuery.fn.vcLineChart && $line_charts.vcLineChart({
                    reload: !1
                }), $carousel.length && jQuery.fn.carousel && $carousel.carousel("resizeAction"), ui.newPanel.parents(".isotope").length && ui.newPanel.parents(".isotope").each(function() {
                    jQuery(this).isotope("layout")
                })
            }
        }), "function" != typeof window.initVideoBackgrounds && (window.initVideoBackgrounds = function() {
            return window.console && window.console.warn && window.console.warn("this function is deprecated use vc_initVideoBackgrounds"), vc_initVideoBackgrounds()
        }), "function" != typeof window.vc_initVideoBackgrounds && (window.vc_initVideoBackgrounds = function() {
            jQuery("[data-vc-video-bg]").each(function() {
                var youtubeUrl, youtubeId, $element = jQuery(this);
                $element.data("vcVideoBg") ? (youtubeUrl = $element.data("vcVideoBg"), (youtubeId = vcExtractYoutubeId(youtubeUrl)) && ($element.find(".vc_video-bg").remove(), insertYoutubeVideoAsBackground($element, youtubeId)), jQuery(window).on("grid:items:added", function(event, $grid) {
                    $element.has($grid).length && vcResizeVideoBackground($element)
                })) : $element.find(".vc_video-bg").remove()
            })
        }), "function" != typeof window.insertYoutubeVideoAsBackground && (window.insertYoutubeVideoAsBackground = function($element, youtubeId, counter) {
            if ("undefined" == typeof YT || void 0 === YT.Player) return 100 < (counter = void 0 === counter ? 0 : counter) ? void console.warn("Too many attempts to load YouTube api") : void setTimeout(function() {
                insertYoutubeVideoAsBackground($element, youtubeId, counter++)
            }, 100);
            var $container = $element.prepend('<div class="vc_video-bg vc_hidden-xs"><div class="inner"></div></div>').find(".inner");
            new YT.Player($container[0], {
                width: "100%",
                height: "100%",
                videoId: youtubeId,
                playerVars: {
                    playlist: youtubeId,
                    iv_load_policy: 3,
                    enablejsapi: 1,
                    disablekb: 1,
                    autoplay: 1,
                    controls: 0,
                    showinfo: 0,
                    rel: 0,
                    loop: 1,
                    wmode: "transparent"
                },
                events: {
                    onReady: function(event) {
                        event.target.mute().setLoop(!0)
                    }
                }
            }), vcResizeVideoBackground($element), jQuery(window).bind("resize", function() {
                vcResizeVideoBackground($element)
            })
        }), "function" != typeof window.vcResizeVideoBackground && (window.vcResizeVideoBackground = function($element) {
            var iframeW, iframeH, marginLeft, marginTop, containerW = $element.innerWidth(),
                containerH = $element.innerHeight();
            containerW / containerH < 16 / 9 ? (iframeW = containerH * (16 / 9), iframeH = containerH, marginLeft = -Math.round((iframeW - containerW) / 2) + "px", marginTop = -Math.round((iframeH - containerH) / 2) + "px") : (iframeH = (iframeW = containerW) * (9 / 16), marginTop = -Math.round((iframeH - containerH) / 2) + "px", marginLeft = -Math.round((iframeW - containerW) / 2) + "px"), iframeW += "px", iframeH += "px", $element.find(".vc_video-bg iframe").css({
                maxWidth: "1000%",
                marginLeft: marginLeft,
                marginTop: marginTop,
                width: iframeW,
                height: iframeH
            })
        }), "function" != typeof window.vcExtractYoutubeId && (window.vcExtractYoutubeId = function(url) {
            if (void 0 === url) return !1;
            var id = url.match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/);
            return null !== id && id[1]
        }), "function" != typeof window.vc_googleMapsPointer && (window.vc_googleMapsPointer = function() {
            var $ = window.jQuery,
                $wpbGmapsWidget = $(".wpb_gmaps_widget");
            $wpbGmapsWidget.on("click", function() {
                $("iframe", this).css("pointer-events", "auto")
            }), $wpbGmapsWidget.on("mouseleave", function() {
                $("iframe", this).css("pointer-events", "none")
            }), $(".wpb_gmaps_widget iframe").css("pointer-events", "none")
        }), "function" != typeof window.vc_setHoverBoxPerspective && (window.vc_setHoverBoxPerspective = function(hoverBox) {
            hoverBox.each(function() {
                var $this = jQuery(this),
                    perspective = 4 * $this.width() + "px";
                $this.css("perspective", perspective)
            })
        }), "function" != typeof window.vc_setHoverBoxHeight && (window.vc_setHoverBoxHeight = function(hoverBox) {
            hoverBox.each(function() {
                var $this = jQuery(this),
                    hoverBoxInner = $this.find(".vc-hoverbox-inner");
                hoverBoxInner.css("min-height", 0);
                var frontHeight = $this.find(".vc-hoverbox-front-inner").outerHeight(),
                    backHeight = $this.find(".vc-hoverbox-back-inner").outerHeight(),
                    hoverBoxHeight = backHeight < frontHeight ? frontHeight : backHeight;
                hoverBoxHeight < 250 && (hoverBoxHeight = 250), hoverBoxInner.css("min-height", hoverBoxHeight + "px")
            })
        }), "function" != typeof window.vc_prepareHoverBox && (window.vc_prepareHoverBox = function() {
            var hoverBox = jQuery(".vc-hoverbox");
            vc_setHoverBoxHeight(hoverBox), vc_setHoverBoxPerspective(hoverBox)
        }), jQuery(document).ready(window.vc_prepareHoverBox), jQuery(window).resize(window.vc_prepareHoverBox), jQuery(document).ready(function($) {
            window.vc_js()
        })
    }(window.jQuery);;
! function(d, l) {
    "use strict";
    var e = !1,
        o = !1;
    if (l.querySelector)
        if (d.addEventListener) e = !0;
    if (d.wp = d.wp || {}, !d.wp.receiveEmbedMessage)
        if (d.wp.receiveEmbedMessage = function(e) {
                var t = e.data;
                if (t)
                    if (t.secret || t.message || t.value)
                        if (!/[^a-zA-Z0-9]/.test(t.secret)) {
                            var r, a, i, s, n, o = l.querySelectorAll('iframe[data-secret="' + t.secret + '"]'),
                                c = l.querySelectorAll('blockquote[data-secret="' + t.secret + '"]');
                            for (r = 0; r < c.length; r++) c[r].style.display = "none";
                            for (r = 0; r < o.length; r++)
                                if (a = o[r], e.source === a.contentWindow) {
                                    if (a.removeAttribute("style"), "height" === t.message) {
                                        if (1e3 < (i = parseInt(t.value, 10))) i = 1e3;
                                        else if (~~i < 200) i = 200;
                                        a.height = i
                                    }
                                    if ("link" === t.message)
                                        if (s = l.createElement("a"), n = l.createElement("a"), s.href = a.getAttribute("src"), n.href = t.value, n.host === s.host)
                                            if (l.activeElement === a) d.top.location.href = t.value
                                }
                        }
            }, e) d.addEventListener("message", d.wp.receiveEmbedMessage, !1), l.addEventListener("DOMContentLoaded", t, !1), d.addEventListener("load", t, !1);

    function t() {
        if (!o) {
            o = !0;
            var e, t, r, a, i = -1 !== navigator.appVersion.indexOf("MSIE 10"),
                s = !!navigator.userAgent.match(/Trident.*rv:11\./),
                n = l.querySelectorAll("iframe.wp-embedded-content");
            for (t = 0; t < n.length; t++) {
                if (!(r = n[t]).getAttribute("data-secret")) a = Math.random().toString(36).substr(2, 10), r.src += "#?secret=" + a, r.setAttribute("data-secret", a);
                if (i || s)(e = r.cloneNode(!0)).removeAttribute("security"), r.parentNode.replaceChild(e, r)
            }
        }
    }
}(window, document);