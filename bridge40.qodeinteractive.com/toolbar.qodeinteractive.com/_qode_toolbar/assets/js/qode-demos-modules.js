(function($) {
    $(window).load(function() {
        qodeDemosAjax();
    });

    function qodeDemosAjax() {
        var qodeTopOffest = $('.qode-demos-toolbar').data("position");
        var rbtAso = getUrlParameter('aso');
        var rbtAca = getUrlParameter('aca');
        var rbtUtmCampaign = getUrlParameter('utm_campaign');
        var rbtReferrer = document.referrer;
        $.ajax({
            url: 'https://toolbar.qodeinteractive.com/templates/qode-toolbar-profile.php',
            type: "GET",
            data: {
                qodeTopOffest: qodeTopOffest,
                aso: rbtAso,
                aca: rbtAca,
                utmCampaign: rbtUtmCampaign,
                referrer: rbtReferrer,
            },
            success: function(data) {
                $('.qode-demos-toolbar').html(data);
                qodeDemosLazyLoad();
                qodeDemosToolbarToggle();
                qodeDemosToolbarSmoothScrollCompatibility();
                showList();
            }
        });
    }

    function qodeDemosLazyLoad() {
        var imagePlaceholder = new Image();
        $(imagePlaceholder).on('load', function() {
            var load = function() {
                $('.qode-demos-toolbar-list-holder .qode-demos-toolbar-content-list-item  .qode-dt-lazy-load img:not(.qode-dt-lazy-loading)').each(function(i, object) {
                    object = $(object);
                    var rect = object[0].getBoundingClientRect(),
                        vh = ($(window).height() || document.documentElement.clientHeight),
                        vw = ($(window).width() || document.documentElement.clientWidth),
                        oh = object.outerHeight(),
                        ow = object.outerWidth();
                    if (((rect.top != 0 || rect.right != 0 || rect.bottom != 0 || rect.left != 0) && (rect.top >= 0 || rect.top + oh >= 0) && (rect.bottom >= 0 && rect.bottom - oh - vh <= 300) && (rect.left >= 0 || rect.left + ow >= 0) && (rect.right >= 0 && rect.right - ow - vw <= 0)) || object.parent().hasClass('qode-dt-load-immediately')) {
                        object.addClass('qode-dt-lazy-loading');
                        var imageObj = new Image();
                        $(imageObj).on('load', function() {
                            var $this = $(this);
                            object.attr('src', $this.attr('src'));
                            object.removeAttr('data-image').removeData('image').removeClass('qode-dt-lazy-loading');
                            object.parent().removeClass('qode-dt-lazy-load');
                            object.parent().removeClass('qode-dt-load-immediately');
                        }).attr('src', object.data('image'));
                    }
                });
            }
            load();
            $('.qode-demos-toolbar-demos-dropdown').on('click', function() {
                setTimeout(function() {
                    load();
                }, 500);
            });
            $(".qode-demos-toolbar-section").scroll(function() {
                load();
            });
        }).attr('src', 'https://toolbar.qodeinteractive.com/_qode_toolbar/assets/img/qode-dt-placeholder.jpg');
    }

    function qodeDemosToolbarToggle() {
        var opener = $('.qode-demos-toolbar-demos-dropdown'),
            list = $('.qode-demos-toolbar'),
            splitScreenPresent = typeof $.fn.multiscroll !== 'undefined' && typeof $.fn.multiscroll.setMouseWheelScrolling !== 'undefined',
            fullPagePresent = typeof $.fn.fullpage !== 'undefined' && typeof $.fn.fullpage.setMouseWheelScrolling !== 'undefined',
            qodeBody = $('body');
        var toggleList = function() {
            opener.on('click', function() {
                if (list.hasClass('qode-demos-toolbar-active')) {
                    qodeBody.removeClass('qode-body-demos-toolbar-opened');
                    list.removeClass('qode-demos-toolbar-active');
                    splitScreenPresent && $.fn.multiscroll.setMouseWheelScrolling(true);
                    fullPagePresent && $.fn.fullpage.setMouseWheelScrolling(true);
                } else {
                    list.addClass('qode-demos-toolbar-active');
                    qodeBody.addClass('qode-body-demos-toolbar-opened');
                    splitScreenPresent && $.fn.multiscroll.setMouseWheelScrolling(false);
                    fullPagePresent && $.fn.fullpage.setMouseWheelScrolling(false);
                }
            });
        };
        var currentScroll = $(window).scrollTop();
        $(window).scroll(function() {
            var newScroll = $(window).scrollTop();
            if (Math.abs(newScroll - currentScroll) > 1000) {
                if (list.hasClass('qode-demos-toolbar-active')) {
                    list.removeClass('qode-demos-toolbar-active');
                    splitScreenPresent && $.fn.multiscroll.setMouseWheelScrolling(true);
                    fullPagePresent && $.fn.fullpage.setMouseWheelScrolling(true);
                }
            }
        });
        var clickAwayClose = function() {
            $(document).on('click', function(e) {
                if (!list.is(e.target) && list.has(e.target).length === 0 && list.hasClass('qode-demos-toolbar-active')) {
                    list.removeClass('qode-demos-toolbar-active');
                    splitScreenPresent && $.fn.multiscroll.setMouseWheelScrolling(true);
                    fullPagePresent && $.fn.fullpage.setMouseWheelScrolling(true);
                }
            });
        };
        if (opener.length) {
            toggleList();
            clickAwayClose();
        }
    }

    function qodeDemosToolbarSmoothScrollCompatibility() {
        if (!$('html').hasClass('touch')) {
            var opener = $('.qode-demos-toolbar-demos-dropdown'),
                list = $('.qode-demos-toolbar');
            var disableScroll = function() {
                if (typeof smoothScrollListener !== 'undefined') {
                    window.removeEventListener('mousewheel', smoothScrollListener, {
                        passive: false
                    });
                    window.removeEventListener('DOMMouseScroll', smoothScrollListener, {
                        passive: false
                    });
                }
            };
            var enableScroll = function() {
                if (typeof smoothScrollListener !== 'undefined') {
                    window.addEventListener('mousewheel', smoothScrollListener, {
                        passive: false
                    });
                    window.addEventListener('DOMMouseScroll', smoothScrollListener, {
                        passive: false
                    });
                }
            };
            opener.on('click', function() {
                setTimeout(function() {
                    list.hasClass('qode-demos-toolbar-active') ? disableScroll() : enableScroll();
                }, 100);
            });
            list.on('mouseenter', function() {
                list.hasClass('qode-demos-toolbar-active') && disableScroll();
            }).on('mouseleave', function() {
                enableScroll();
            });
        }
    }

    function showList() {
        var list = $('.rbt-sidearea');
        list.length && list.addClass('qode-dt-loaded');
    }
    var getUrlParameter = function getUrlParameter(sParam) {
        var sPageURL = window.location.search.substring(1),
            sURLVariables = sPageURL.split('&'),
            sParameterName, i;
        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');
            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
            }
        }
    };
})(jQuery);