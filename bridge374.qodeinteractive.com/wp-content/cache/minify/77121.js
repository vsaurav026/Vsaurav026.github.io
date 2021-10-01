! function(e, n) {
    e.wp = e.wp || {}, e.wp.mediaelement = new function() {
        var e = {};
        return {
            initialize: function() {
                (e = "undefined" != typeof _wpmejsSettings ? n.extend(!0, {}, _wpmejsSettings) : e).classPrefix = "mejs-", e.success = e.success || function(e) {
                    var n, t;
                    e.rendererName && -1 !== e.rendererName.indexOf("flash") && (n = e.attributes.autoplay && "false" !== e.attributes.autoplay, t = e.attributes.loop && "false" !== e.attributes.loop, n && e.addEventListener("canplay", function() {
                        e.play()
                    }, !1), t && e.addEventListener("ended", function() {
                        e.play()
                    }, !1))
                }, e.customError = function(e, n) {
                    if (-1 !== e.rendererName.indexOf("flash") || -1 !== e.rendererName.indexOf("flv")) return '<a href="' + n.src + '">' + mejsL10n.strings["mejs.download-file"] + "</a>"
                }, n(".wp-audio-shortcode, .wp-video-shortcode").not(".mejs-container").filter(function() {
                    return !n(this).parent().hasClass("mejs-mediaelement")
                }).mediaelementplayer(e)
            }
        }
    }, n(e.wp.mediaelement.initialize)
}(window, jQuery);;
/*
 --------------------------------
 Infinite Scroll
 --------------------------------
 + https://github.com/paulirish/infinitescroll
 + version 2.0b2.110713
 + Copyright 2011 Paul Irish & Luke Shumard
 + Licensed under the MIT license

 + Documentation: http://infinite-scroll.com/

 */

(function(window, $, undefined) {
    $.infinitescroll = function infscr(options, callback, element) {
        this.element = $(element);
        this._create(options, callback);
    };
    $.infinitescroll.defaults = {
        loading: {
            finished: undefined,
            finishedMsg: "<em>Congratulations, you've reached the end of the internet.</em>",
            img: "http://www.infinite-scroll.com/loading.gif",
            msg: null,
            msgText: "<em>Loading the next set of posts...</em>",
            selector: null,
            speed: 'fast',
            start: undefined
        },
        state: {
            isDuringAjax: false,
            isInvalidPage: false,
            isDestroyed: false,
            isDone: false,
            isPaused: false,
            currPage: 1
        },
        callback: undefined,
        debug: false,
        behavior: undefined,
        binder: $(window),
        nextSelector: "div.navigation a:first",
        navSelector: "div.navigation",
        contentSelector: null,
        extraScrollPx: 150,
        itemSelector: "div.post",
        animate: false,
        pathParse: undefined,
        dataType: 'html',
        appendCallback: true,
        bufferPx: 40,
        errorCallback: function() {},
        infid: 0,
        pixelsFromNavToBottom: undefined,
        path: undefined
    };
    $.infinitescroll.prototype = {
        _binding: function infscr_binding(binding) {
            var instance = this,
                opts = instance.options;
            if (!!opts.behavior && this['_binding_' + opts.behavior] !== undefined) {
                this['_binding_' + opts.behavior].call(this);
                return;
            }
            if (binding !== 'bind' && binding !== 'unbind') {
                this._debug('Binding value  ' + binding + ' not valid')
                return false;
            }
            if (binding == 'unbind') {
                (this.options.binder).unbind('smartscroll.infscr.' + instance.options.infid);
            } else {
                (this.options.binder)[binding]('smartscroll.infscr.' + instance.options.infid, function() {
                    instance.scroll();
                });
            };
            this._debug('Binding', binding);
        },
        _create: function infscr_create(options, callback) {
            if (!this._validate(options)) {
                return false;
            }
            var opts = this.options = $.extend(true, {}, $.infinitescroll.defaults, options),
                relurl = /(.*?\/\/).*?(\/.*)/,
                path = $(opts.nextSelector).attr('href');
            opts.contentSelector = opts.contentSelector || this.element;
            opts.loading.selector = opts.loading.selector || opts.contentSelector;
            if (!path) {
                this._debug('Navigation selector not found');
                return;
            }
            opts.path = this._determinepath(path);
            opts.loading.msg = $('<div id="infscr-loading"><span class="image_holder"></span><div>' + opts.loading.msgText + '</div></div>');
            opts.pixelsFromNavToBottom = $(document).height() - $(opts.navSelector).offset().top;
            opts.loading.start = opts.loading.start || function() {
                $(opts.navSelector).hide();
                opts.loading.msg.appendTo(opts.loading.selector).show(opts.loading.speed, function() {
                    beginAjax(opts);
                });
            };
            opts.loading.finished = opts.loading.finished || function() {
                opts.loading.msg.fadeOut('normal');
            };
            opts.callback = function(instance, data) {
                if (!!opts.behavior && instance['_callback_' + opts.behavior] !== undefined) {
                    instance['_callback_' + opts.behavior].call($(opts.contentSelector)[0], data);
                }
                if (callback) {
                    callback.call($(opts.contentSelector)[0], data);
                }
            };
            this._setup();
        },
        _debug: function infscr_debug() {
            if (this.options.debug) {
                return window.console && console.log.call(console, arguments);
            }
        },
        _determinepath: function infscr_determinepath(path) {
            var opts = this.options;
            if (!!opts.behavior && this['_determinepath_' + opts.behavior] !== undefined) {
                this['_determinepath_' + opts.behavior].call(this, path);
                return;
            }
            if (!!opts.pathParse) {
                this._debug('pathParse manual');
                return opts.pathParse;
            } else if (path.match(/^(.*?)\b2\b(.*?$)/)) {
                path = path.match(/^(.*?)\b2\b(.*?$)/).slice(1);
            } else if (path.match(/^(.*?)2(.*?$)/)) {
                if (path.match(/^(.*?page=)2(\/.*|$)/)) {
                    path = path.match(/^(.*?page=)2(\/.*|$)/).slice(1);
                    return path;
                }
                path = path.match(/^(.*?)2(.*?$)/).slice(1);
            } else {
                if (path.match(/^(.*?page=)1(\/.*|$)/)) {
                    path = path.match(/^(.*?page=)1(\/.*|$)/).slice(1);
                    return path;
                } else {
                    this._debug('Sorry, we couldn\'t parse your Next (Previous Posts) URL. Verify your the css selector points to the correct A tag. If you still get this error: yell, scream, and kindly ask for help at infinite-scroll.com.');
                    opts.state.isInvalidPage = true;
                }
            }
            this._debug('determinePath', path);
            return path;
        },
        _error: function infscr_error(xhr) {
            var opts = this.options;
            if (!!opts.behavior && this['_error_' + opts.behavior] !== undefined) {
                this['_error_' + opts.behavior].call(this, xhr);
                return;
            }
            if (xhr !== 'destroy' && xhr !== 'end') {
                xhr = 'unknown';
            }
            this._debug('Error', xhr);
            if (xhr == 'end') {
                this._showdonemsg();
            }
            opts.state.isDone = true;
            opts.state.currPage = 1;
            opts.state.isPaused = false;
            this._binding('unbind');
        },
        _loadcallback: function infscr_loadcallback(box, data) {
            var opts = this.options,
                callback = this.options.callback,
                result = (opts.state.isDone) ? 'done' : (!opts.appendCallback) ? 'no-append' : 'append',
                frag;
            if (!!opts.behavior && this['_loadcallback_' + opts.behavior] !== undefined) {
                this['_loadcallback_' + opts.behavior].call(this, box, data);
                return;
            }
            switch (result) {
                case 'done':
                    this._showdonemsg();
                    return false;
                    break;
                case 'no-append':
                    if (opts.dataType == 'html') {
                        data = '<div>' + data + '</div>';
                        data = $(data).find(opts.itemSelector);
                    };
                    break;
                case 'append':
                    var children = box.children();
                    if (children.length == 0) {
                        return this._error('end');
                    }
                    frag = document.createDocumentFragment();
                    while (box[0].firstChild) {
                        frag.appendChild(box[0].firstChild);
                    }
                    this._debug('contentSelector', $(opts.contentSelector)[0])
                    $(opts.contentSelector)[0].appendChild(frag);
                    data = children.get();
                    break;
            }
            opts.loading.finished.call($(opts.contentSelector)[0], opts)
            if (opts.animate) {
                var scrollTo = $(window).scrollTop() + $('#infscr-loading').height() + opts.extraScrollPx + 'px';
                $('html,body').animate({
                    scrollTop: scrollTo
                }, 800, function() {
                    opts.state.isDuringAjax = false;
                });
            }
            if (!opts.animate) opts.state.isDuringAjax = false;
            callback(this, data);
        },
        _nearbottom: function infscr_nearbottom() {
            var opts = this.options,
                pixelsFromWindowBottomToBottom = 0 + $(document).height() - (opts.binder.scrollTop()) - $(window).height();
            if (!!opts.behavior && this['_nearbottom_' + opts.behavior] !== undefined) {
                this['_nearbottom_' + opts.behavior].call(this);
                return;
            }
            this._debug('math:', pixelsFromWindowBottomToBottom, opts.pixelsFromNavToBottom);
            return (pixelsFromWindowBottomToBottom - opts.bufferPx < opts.pixelsFromNavToBottom);
        },
        _pausing: function infscr_pausing(pause) {
            var opts = this.options;
            if (!!opts.behavior && this['_pausing_' + opts.behavior] !== undefined) {
                this['_pausing_' + opts.behavior].call(this, pause);
                return;
            }
            if (pause !== 'pause' && pause !== 'resume' && pause !== null) {
                this._debug('Invalid argument. Toggling pause value instead');
            };
            pause = (pause && (pause == 'pause' || pause == 'resume')) ? pause : 'toggle';
            switch (pause) {
                case 'pause':
                    opts.state.isPaused = true;
                    break;
                case 'resume':
                    opts.state.isPaused = false;
                    break;
                case 'toggle':
                    opts.state.isPaused = !opts.state.isPaused;
                    break;
            }
            this._debug('Paused', opts.state.isPaused);
            return false;
        },
        _setup: function infscr_setup() {
            var opts = this.options;
            if (!!opts.behavior && this['_setup_' + opts.behavior] !== undefined) {
                this['_setup_' + opts.behavior].call(this);
                return;
            }
            this._binding('bind');
            return false;
        },
        _showdonemsg: function infscr_showdonemsg() {
            var opts = this.options;
            if (!!opts.behavior && this['_showdonemsg_' + opts.behavior] !== undefined) {
                this['_showdonemsg_' + opts.behavior].call(this);
                return;
            }
            opts.loading.msg.find('.image_holder').hide().parent().find('div').html(opts.loading.finishedMsg).animate({
                opacity: 1
            }, 2000, function() {
                $(this).parent().fadeOut('normal');
            });
            opts.errorCallback.call($(opts.contentSelector)[0], 'done');
        },
        _validate: function infscr_validate(opts) {
            for (var key in opts) {
                if (key.indexOf && key.indexOf('Selector') > -1 && $(opts[key]).length === 0) {
                    this._debug('Your ' + key + ' found no elements.');
                    return false;
                }
                return true;
            }
        },
        bind: function infscr_bind() {
            this._binding('bind');
        },
        destroy: function infscr_destroy() {
            this.options.state.isDestroyed = true;
            return this._error('destroy');
        },
        pause: function infscr_pause() {
            this._pausing('pause');
        },
        resume: function infscr_resume() {
            this._pausing('resume');
        },
        retrieve: function infscr_retrieve(pageNum) {
            var instance = this,
                opts = instance.options,
                path = opts.path,
                box, frag, desturl, method, condition, pageNum = pageNum || null,
                getPage = (!!pageNum) ? pageNum : opts.state.currPage;
            beginAjax = function infscr_ajax(opts) {
                opts.state.currPage++;
                instance._debug('heading into ajax', path);
                box = $(opts.contentSelector).is('table') ? $('<tbody/>') : $('<div/>');
                desturl = path.join(opts.state.currPage);
                method = (opts.dataType == 'html' || opts.dataType == 'json') ? opts.dataType : 'html+callback';
                if (opts.appendCallback && opts.dataType == 'html') method += '+callback'
                switch (method) {
                    case 'html+callback':
                        instance._debug('Using HTML via .load() method');
                        box.load(desturl + ' ' + opts.itemSelector, null, function infscr_ajax_callback(responseText) {
                            instance._loadcallback(box, responseText);
                        });
                        break;
                    case 'html':
                    case 'json':
                        instance._debug('Using ' + (method.toUpperCase()) + ' via $.ajax() method');
                        $.ajax({
                            url: desturl,
                            dataType: opts.dataType,
                            complete: function infscr_ajax_callback(jqXHR, textStatus) {
                                condition = (typeof(jqXHR.isResolved) !== 'undefined') ? (jqXHR.isResolved()) : (textStatus === "success" || textStatus === "notmodified");
                                (condition) ? instance._loadcallback(box, jqXHR.responseText): instance._error('end');
                            }
                        });
                        break;
                }
            };
            if (!!opts.behavior && this['retrieve_' + opts.behavior] !== undefined) {
                this['retrieve_' + opts.behavior].call(this, pageNum);
                return;
            }
            if (opts.state.isDestroyed) {
                this._debug('Instance is destroyed');
                return false;
            };
            opts.state.isDuringAjax = true;
            opts.loading.start.call($(opts.contentSelector)[0], opts);
        },
        scroll: function infscr_scroll() {
            var opts = this.options,
                state = opts.state;
            if (!!opts.behavior && this['scroll_' + opts.behavior] !== undefined) {
                this['scroll_' + opts.behavior].call(this);
                return;
            }
            if (state.isDuringAjax || state.isInvalidPage || state.isDone || state.isDestroyed || state.isPaused) return;
            if (!this._nearbottom()) return;
            this.retrieve();
        },
        toggle: function infscr_toggle() {
            this._pausing();
        },
        unbind: function infscr_unbind() {
            this._binding('unbind');
        },
        update: function infscr_options(key) {
            if ($.isPlainObject(key)) {
                this.options = $.extend(true, this.options, key);
            }
        }
    }
    $.fn.infinitescroll = function infscr_init(options, callback) {
        var thisCall = typeof options;
        switch (thisCall) {
            case 'string':
                var args = Array.prototype.slice.call(arguments, 1);
                this.each(function() {
                    var instance = $.data(this, 'infinitescroll');
                    if (!instance) {
                        return false;
                    }
                    if (!$.isFunction(instance[options]) || options.charAt(0) === "_") {
                        return false;
                    }
                    instance[options].apply(instance, args);
                });
                break;
            case 'object':
                this.each(function() {
                    var instance = $.data(this, 'infinitescroll');
                    if (instance) {
                        instance.update(options);
                    } else {
                        $.data(this, 'infinitescroll', new $.infinitescroll(options, callback, this));
                    }
                });
                break;
        }
        return this;
    };
    var event = $.event,
        scrollTimeout;
    event.special.smartscroll = {
        setup: function() {
            $(this).bind("scroll", event.special.smartscroll.handler);
        },
        teardown: function() {
            $(this).unbind("scroll", event.special.smartscroll.handler);
        },
        handler: function(event, execAsap) {
            var context = this,
                args = arguments;
            event.type = "smartscroll";
            if (scrollTimeout) {
                clearTimeout(scrollTimeout);
            }
            scrollTimeout = setTimeout(function() {
                $.event.handle.apply(context, args);
            }, execAsap === "execAsap" ? 0 : 100);
        }
    };
    $.fn.smartscroll = function(fn) {
        return fn ? this.bind("smartscroll", fn) : this.trigger("smartscroll", ["execAsap"]);
    };
})(window, jQuery);;
(function($) {
    var eventNamespace = 'waitForImages';
    $.waitForImages = {
        hasImageProperties: ['backgroundImage', 'listStyleImage', 'borderImage', 'borderCornerImage']
    };
    $.expr[':'].uncached = function(obj) {
        if (!$(obj).is('img[src!=""]')) {
            return false
        }
        var img = new Image();
        img.src = obj.src;
        return !img.complete
    };
    $.fn.waitForImages = function(finishedCallback, eachCallback, waitForAll) {
        var allImgsLength = 0;
        var allImgsLoaded = 0;
        if ($.isPlainObject(arguments[0])) {
            waitForAll = arguments[0].waitForAll;
            eachCallback = arguments[0].each;
            finishedCallback = arguments[0].finished
        }
        finishedCallback = finishedCallback || $.noop;
        eachCallback = eachCallback || $.noop;
        waitForAll = !!waitForAll;
        if (!$.isFunction(finishedCallback) || !$.isFunction(eachCallback)) {
            throw new TypeError('An invalid callback was supplied.');
        }
        return this.each(function() {
            var obj = $(this);
            var allImgs = [];
            var hasImgProperties = $.waitForImages.hasImageProperties || [];
            var matchUrl = /url\(\s*(['"]?)(.*?)\1\s*\)/g;
            if (waitForAll) {
                obj.find('*').andSelf().each(function() {
                    var element = $(this);
                    if (element.is('img:uncached')) {
                        allImgs.push({
                            src: element.attr('src'),
                            element: element[0]
                        })
                    }
                    $.each(hasImgProperties, function(i, property) {
                        var propertyValue = element.css(property);
                        var match;
                        if (!propertyValue) {
                            return true
                        }
                        while (match = matchUrl.exec(propertyValue)) {
                            allImgs.push({
                                src: match[2],
                                element: element[0]
                            })
                        }
                    })
                })
            } else {
                obj.find('img:uncached').each(function() {
                    allImgs.push({
                        src: this.src,
                        element: this
                    })
                })
            }
            allImgsLength = allImgs.length;
            allImgsLoaded = 0;
            if (allImgsLength === 0) {
                finishedCallback.call(obj[0])
            }
            $.each(allImgs, function(i, img) {
                var image = new Image();
                $(image).bind('load.' + eventNamespace + ' error.' + eventNamespace, function(event) {
                    allImgsLoaded++;
                    eachCallback.call(img.element, allImgsLoaded, allImgsLength, event.type == 'load');
                    if (allImgsLoaded == allImgsLength) {
                        finishedCallback.call(obj[0]);
                        return false
                    }
                });
                image.src = img.src
            })
        })
    }
}(jQuery));;
! function(r) {
    "function" == typeof define && define.amd ? define(["jquery"], r) : "object" == typeof module && module.exports ? module.exports = function(e, t) {
        return void 0 === t && (t = "undefined" != typeof window ? require("jquery") : require("jquery")(e)), r(t), t
    } : r(jQuery)
}(function(O) {
    "use strict";
    var d = /\r?\n/g,
        v = {};
    v.fileapi = void 0 !== O('<input type="file">').get(0).files, v.formdata = void 0 !== window.FormData;
    var X = !!O.fn.prop;

    function o(e) {
        var t = e.data;
        e.isDefaultPrevented() || (e.preventDefault(), O(e.target).closest("form").ajaxSubmit(t))
    }

    function i(e) {
        var t = e.target,
            r = O(t);
        if (!r.is("[type=submit],[type=image]")) {
            var a = r.closest("[type=submit]");
            if (0 === a.length) return;
            t = a[0]
        }
        var n = t.form;
        "image" === (n.clk = t).type && (void 0 !== e.offsetX ? (n.clk_x = e.offsetX, n.clk_y = e.offsetY) : "function" == typeof O.fn.offset ? (r = r.offset(), n.clk_x = e.pageX - r.left, n.clk_y = e.pageY - r.top) : (n.clk_x = e.pageX - t.offsetLeft, n.clk_y = e.pageY - t.offsetTop)), setTimeout(function() {
            n.clk = n.clk_x = n.clk_y = null
        }, 100)
    }

    function C() {
        var e;
        O.fn.ajaxSubmit.debug && (e = "[jquery.form] " + Array.prototype.join.call(arguments, ""), window.console && window.console.log ? window.console.log(e) : window.opera && window.opera.postError && window.opera.postError(e))
    }
    O.fn.attr2 = function() {
        if (!X) return this.attr.apply(this, arguments);
        var e = this.prop.apply(this, arguments);
        return e && e.jquery || "string" == typeof e ? e : this.attr.apply(this, arguments)
    }, O.fn.ajaxSubmit = function(F, e, t, r) {
        if (!this.length) return C("ajaxSubmit: skipping submit process - no element selected"), this;
        var L, E = this;
        "function" == typeof F ? F = {
            success: F
        } : "string" == typeof F || !1 === F && 0 < arguments.length ? (F = {
            url: F,
            data: e,
            dataType: t
        }, "function" == typeof r && (F.success = r)) : void 0 === F && (F = {}), L = F.method || F.type || this.attr2("method"), r = (r = (r = "string" == typeof(t = F.url || this.attr2("action")) ? O.trim(t) : "") || window.location.href || "") && (r.match(/^([^#]+)/) || [])[1], F = O.extend(!0, {
            url: r,
            success: O.ajaxSettings.success,
            type: L || O.ajaxSettings.type,
            iframeSrc: /^https/i.test(window.location.href || "") ? "javascript:false" : "about:blank"
        }, F);
        t = {};
        if (this.trigger("form-pre-serialize", [this, F, t]), t.veto) return C("ajaxSubmit: submit vetoed via form-pre-serialize trigger"), this;
        if (F.beforeSerialize && !1 === F.beforeSerialize(this, F)) return C("ajaxSubmit: submit aborted via beforeSerialize callback"), this;
        r = F.traditional;
        void 0 === r && (r = O.ajaxSettings.traditional);
        var M = [],
            a = this.formToArray(F.semantic, M, F.filtering);
        if (F.data && (c = O.isFunction(F.data) ? F.data(a) : F.data, F.extraData = c, c = O.param(c, r)), F.beforeSubmit && !1 === F.beforeSubmit(a, this, F)) return C("ajaxSubmit: submit aborted via beforeSubmit callback"), this;
        if (this.trigger("form-submit-validate", [a, this, F, t]), t.veto) return C("ajaxSubmit: submit vetoed via form-submit-validate trigger"), this;
        t = O.param(a, r);
        c && (t = t ? t + "&" + c : c), "GET" === F.type.toUpperCase() ? (F.url += (0 <= F.url.indexOf("?") ? "&" : "?") + t, F.data = null) : F.data = t;
        var o, n, i, s = [];
        F.resetForm && s.push(function() {
            E.resetForm()
        }), F.clearForm && s.push(function() {
            E.clearForm(F.includeHidden)
        }), !F.dataType && F.target ? (o = F.success || function() {}, s.push(function(e, t, r) {
            var a = arguments,
                n = F.replaceTarget ? "replaceWith" : "html";
            O(F.target)[n](e).each(function() {
                o.apply(this, a)
            })
        })) : F.success && (O.isArray(F.success) ? O.merge(s, F.success) : s.push(F.success)), F.success = function(e, t, r) {
            for (var a = F.context || this, n = 0, o = s.length; n < o; n++) s[n].apply(a, [e, t, r || E, E])
        }, F.error && (n = F.error, F.error = function(e, t, r) {
            var a = F.context || this;
            n.apply(a, [e, t, r, E])
        }), F.complete && (i = F.complete, F.complete = function(e, t) {
            var r = F.context || this;
            i.apply(r, [e, t, E])
        });
        var u, r = 0 < O("input[type=file]:enabled", this).filter(function() {
                return "" !== O(this).val()
            }).length,
            c = "multipart/form-data",
            t = E.attr("enctype") === c || E.attr("encoding") === c,
            c = v.fileapi && v.formdata;
        C("fileAPI :" + c), !1 !== F.iframe && (F.iframe || (r || t) && !c) ? F.closeKeepAlive ? O.get(F.closeKeepAlive, function() {
            u = f(a)
        }) : u = f(a) : u = (r || t) && c ? function(e) {
            for (var r = new FormData, t = 0; t < e.length; t++) r.append(e[t].name, e[t].value);
            if (F.extraData) {
                var a = function(e) {
                    var t, r, a = O.param(e, F.traditional).split("&"),
                        n = a.length,
                        o = [];
                    for (t = 0; t < n; t++) a[t] = a[t].replace(/\+/g, " "), r = a[t].split("="), o.push([decodeURIComponent(r[0]), decodeURIComponent(r[1])]);
                    return o
                }(F.extraData);
                for (t = 0; t < a.length; t++) a[t] && r.append(a[t][0], a[t][1])
            }
            F.data = null;
            var n = O.extend(!0, {}, O.ajaxSettings, F, {
                contentType: !1,
                processData: !1,
                cache: !1,
                type: L || "POST"
            });
            F.uploadProgress && (n.xhr = function() {
                var e = O.ajaxSettings.xhr();
                return e.upload && e.upload.addEventListener("progress", function(e) {
                    var t = 0,
                        r = e.loaded || e.position,
                        a = e.total;
                    e.lengthComputable && (t = Math.ceil(r / a * 100)), F.uploadProgress(e, r, a, t)
                }, !1), e
            });
            n.data = null;
            var o = n.beforeSend;
            return n.beforeSend = function(e, t) {
                F.formData ? t.data = F.formData : t.data = r, o && o.call(this, e, t)
            }, O.ajax(n)
        }(a) : O.ajax(F), E.removeData("jqxhr").data("jqxhr", u);
        for (var l = 0; l < M.length; l++) M[l] = null;
        return this.trigger("form-submit-notify", [this, F]), this;

        function f(e) {
            var t, r, c, l, f, d, p, m, h, o = E[0],
                v = O.Deferred();
            if (v.abort = function(e) {
                    p.abort(e)
                }, e)
                for (r = 0; r < M.length; r++) t = O(M[r]), X ? t.prop("disabled", !1) : t.removeAttr("disabled");
            (c = O.extend(!0, {}, O.ajaxSettings, F)).context = c.context || c;
            var i = "jqFormIO" + (new Date).getTime(),
                s = o.ownerDocument,
                u = E.closest("body");
            if (c.iframeTarget ? (a = (f = O(c.iframeTarget, s)).attr2("name")) ? i = a : f.attr2("name", i) : (f = O('<iframe name="' + i + '" src="' + c.iframeSrc + '" />', s)).css({
                    position: "absolute",
                    top: "-1000px",
                    left: "-1000px"
                }), d = f[0], p = {
                    aborted: 0,
                    responseText: null,
                    responseXML: null,
                    status: 0,
                    statusText: "n/a",
                    getAllResponseHeaders: function() {},
                    getResponseHeader: function() {},
                    setRequestHeader: function() {},
                    abort: function(e) {
                        var t = "timeout" === e ? "timeout" : "aborted";
                        C("aborting upload... " + t), this.aborted = 1;
                        try {
                            d.contentWindow.document.execCommand && d.contentWindow.document.execCommand("Stop")
                        } catch (e) {}
                        f.attr("src", c.iframeSrc), p.error = t, c.error && c.error.call(c.context, p, t, e), l && O.event.trigger("ajaxError", [p, c, t]), c.complete && c.complete.call(c.context, p, t)
                    }
                }, (l = c.global) && 0 == O.active++ && O.event.trigger("ajaxStart"), l && O.event.trigger("ajaxSend", [p, c]), c.beforeSend && !1 === c.beforeSend.call(c.context, p, c)) return c.global && O.active--, v.reject(), v;
            if (p.aborted) return v.reject(), v;
            (e = o.clk) && (a = e.name) && !e.disabled && (c.extraData = c.extraData || {}, c.extraData[a] = e.value, "image" === e.type && (c.extraData[a + ".x"] = o.clk_x, c.extraData[a + ".y"] = o.clk_y));
            var g = 1,
                x = 2;

            function y(t) {
                var r = null;
                try {
                    t.contentWindow && (r = t.contentWindow.document)
                } catch (e) {
                    C("cannot get iframe.contentWindow document: " + e)
                }
                if (r) return r;
                try {
                    r = t.contentDocument || t.document
                } catch (e) {
                    C("cannot get iframe.contentDocument: " + e), r = t.document
                }
                return r
            }
            var e = O("meta[name=csrf-token]").attr("content"),
                a = O("meta[name=csrf-param]").attr("content");

            function n() {
                var e = E.attr2("target"),
                    t = E.attr2("action"),
                    r = E.attr("enctype") || E.attr("encoding") || "multipart/form-data";
                o.setAttribute("target", i), L && !/post/i.test(L) || o.setAttribute("method", "POST"), t !== c.url && o.setAttribute("action", c.url), c.skipEncodingOverride || L && !/post/i.test(L) || E.attr({
                    encoding: "multipart/form-data",
                    enctype: "multipart/form-data"
                }), c.timeout && (h = setTimeout(function() {
                    m = !0, S(g)
                }, c.timeout));
                var a = [];
                try {
                    if (c.extraData)
                        for (var n in c.extraData) c.extraData.hasOwnProperty(n) && (O.isPlainObject(c.extraData[n]) && c.extraData[n].hasOwnProperty("name") && c.extraData[n].hasOwnProperty("value") ? a.push(O('<input type="hidden" name="' + c.extraData[n].name + '">', s).val(c.extraData[n].value).appendTo(o)[0]) : a.push(O('<input type="hidden" name="' + n + '">', s).val(c.extraData[n]).appendTo(o)[0]));
                    c.iframeTarget || f.appendTo(u), d.attachEvent ? d.attachEvent("onload", S) : d.addEventListener("load", S, !1), setTimeout(function e() {
                        try {
                            var t = y(d).readyState;
                            C("state = " + t), t && "uninitialized" === t.toLowerCase() && setTimeout(e, 50)
                        } catch (e) {
                            C("Server abort: ", e, " (", e.name, ")"), S(x), h && clearTimeout(h), h = void 0
                        }
                    }, 15);
                    try {
                        o.submit()
                    } catch (e) {
                        document.createElement("form").submit.apply(o)
                    }
                } finally {
                    o.setAttribute("action", t), o.setAttribute("enctype", r), e ? o.setAttribute("target", e) : E.removeAttr("target"), O(a).remove()
                }
            }
            a && e && (c.extraData = c.extraData || {}, c.extraData[a] = e), c.forceSync ? n() : setTimeout(n, 10);
            var b, T, j, w = 50;

            function S(t) {
                if (!p.aborted && !j) {
                    if ((T = y(d)) || (C("cannot access response document"), t = x), t === g && p) return p.abort("timeout"), void v.reject(p, "timeout");
                    if (t === x && p) return p.abort("server abort"), void v.reject(p, "error", "server abort");
                    if (T && T.location.href !== c.iframeSrc || m) {
                        d.detachEvent ? d.detachEvent("onload", S) : d.removeEventListener("load", S, !1);
                        var r, t = "success";
                        try {
                            if (m) throw "timeout";
                            var e = "xml" === c.dataType || T.XMLDocument || O.isXMLDoc(T);
                            if (C("isXml=" + e), !e && window.opera && (null === T.body || !T.body.innerHTML) && --w) return C("requeing onLoad callback, DOM not available"), void setTimeout(S, 250);
                            var a = T.body || T.documentElement;
                            p.responseText = a ? a.innerHTML : null, p.responseXML = T.XMLDocument || T, e && (c.dataType = "xml"), p.getResponseHeader = function(e) {
                                return {
                                    "content-type": c.dataType
                                }[e.toLowerCase()]
                            }, a && (p.status = Number(a.getAttribute("status")) || p.status, p.statusText = a.getAttribute("statusText") || p.statusText);
                            var n, o, i, s = (c.dataType || "").toLowerCase(),
                                u = /(json|script|text)/.test(s);
                            u || c.textarea ? (n = T.getElementsByTagName("textarea")[0]) ? (p.responseText = n.value, p.status = Number(n.getAttribute("status")) || p.status, p.statusText = n.getAttribute("statusText") || p.statusText) : u && (o = T.getElementsByTagName("pre")[0], i = T.getElementsByTagName("body")[0], o ? p.responseText = o.textContent || o.innerText : i && (p.responseText = i.textContent || i.innerText)) : "xml" === s && !p.responseXML && p.responseText && (p.responseXML = k(p.responseText));
                            try {
                                b = A(p, s, c)
                            } catch (e) {
                                t = "parsererror", p.error = r = e || t
                            }
                        } catch (e) {
                            C("error caught: ", e), t = "error", p.error = r = e || t
                        }
                        p.aborted && (C("upload aborted"), t = null), "success" === (t = p.status ? 200 <= p.status && p.status < 300 || 304 === p.status ? "success" : "error" : t) ? (c.success && c.success.call(c.context, b, "success", p), v.resolve(p.responseText, "success", p), l && O.event.trigger("ajaxSuccess", [p, c])) : t && (void 0 === r && (r = p.statusText), c.error && c.error.call(c.context, p, t, r), v.reject(p, "error", r), l && O.event.trigger("ajaxError", [p, c, r])), l && O.event.trigger("ajaxComplete", [p, c]), l && !--O.active && O.event.trigger("ajaxStop"), c.complete && c.complete.call(c.context, p, t), j = !0, c.timeout && clearTimeout(h), setTimeout(function() {
                            c.iframeTarget ? f.attr("src", c.iframeSrc) : f.remove(), p.responseXML = null
                        }, 100)
                    }
                }
            }
            var k = O.parseXML || function(e, t) {
                    return window.ActiveXObject ? ((t = new ActiveXObject("Microsoft.XMLDOM")).async = "false", t.loadXML(e)) : t = (new DOMParser).parseFromString(e, "text/xml"), t && t.documentElement && "parsererror" !== t.documentElement.nodeName ? t : null
                },
                D = O.parseJSON || function(e) {
                    return window.eval("(" + e + ")")
                },
                A = function(e, t, r) {
                    var a = e.getResponseHeader("content-type") || "",
                        n = ("xml" === t || !t) && 0 <= a.indexOf("xml"),
                        e = n ? e.responseXML : e.responseText;
                    return n && "parsererror" === e.documentElement.nodeName && O.error && O.error("parsererror"), "string" == typeof(e = r && r.dataFilter ? r.dataFilter(e, t) : e) && (("json" === t || !t) && 0 <= a.indexOf("json") ? e = D(e) : ("script" === t || !t) && 0 <= a.indexOf("javascript") && O.globalEval(e)), e
                };
            return v
        }
    }, O.fn.ajaxForm = function(e, t, r, a) {
        if (("string" == typeof e || !1 === e && 0 < arguments.length) && (e = {
                url: e,
                data: t,
                dataType: r
            }, "function" == typeof a && (e.success = a)), (e = e || {}).delegation = e.delegation && O.isFunction(O.fn.on), e.delegation || 0 !== this.length) return e.delegation ? (O(document).off("submit.form-plugin", this.selector, o).off("click.form-plugin", this.selector, i).on("submit.form-plugin", this.selector, e, o).on("click.form-plugin", this.selector, e, i), this) : this.ajaxFormUnbind().on("submit.form-plugin", e, o).on("click.form-plugin", e, i);
        var n = {
            s: this.selector,
            c: this.context
        };
        return !O.isReady && n.s ? (C("DOM not ready, queuing ajaxForm"), O(function() {
            O(n.s, n.c).ajaxForm(e)
        })) : C("terminating; zero elements found by selector" + (O.isReady ? "" : " (DOM not ready)")), this
    }, O.fn.ajaxFormUnbind = function() {
        return this.off("submit.form-plugin click.form-plugin")
    }, O.fn.formToArray = function(e, t, r) {
        var a = [];
        if (0 === this.length) return a;
        var n, o, i, s, u, c, l, f, d = this[0],
            p = this.attr("id"),
            m = (m = e || void 0 === d.elements ? d.getElementsByTagName("*") : d.elements) && O.makeArray(m);
        if (!(m = p && (e || /(Edge|Trident)\//.test(navigator.userAgent)) && (l = O(':input[form="' + p + '"]').get()).length ? (m || []).concat(l) : m) || !m.length) return a;
        for (n = 0, u = (m = O.isFunction(r) ? O.map(m, r) : m).length; n < u; n++)
            if ((f = (s = m[n]).name) && !s.disabled)
                if (e && d.clk && "image" === s.type) d.clk === s && (a.push({
                    name: f,
                    value: O(s).val(),
                    type: s.type
                }), a.push({
                    name: f + ".x",
                    value: d.clk_x
                }, {
                    name: f + ".y",
                    value: d.clk_y
                }));
                else if ((i = O.fieldValue(s, !0)) && i.constructor === Array)
            for (t && t.push(s), o = 0, c = i.length; o < c; o++) a.push({
                name: f,
                value: i[o]
            });
        else if (v.fileapi && "file" === s.type) {
            t && t.push(s);
            var h = s.files;
            if (h.length)
                for (o = 0; o < h.length; o++) a.push({
                    name: f,
                    value: h[o],
                    type: s.type
                });
            else a.push({
                name: f,
                value: "",
                type: s.type
            })
        } else null != i && (t && t.push(s), a.push({
            name: f,
            value: i,
            type: s.type,
            required: s.required
        }));
        return e || !d.clk || (f = (r = (l = O(d.clk))[0]).name) && !r.disabled && "image" === r.type && (a.push({
            name: f,
            value: l.val()
        }), a.push({
            name: f + ".x",
            value: d.clk_x
        }, {
            name: f + ".y",
            value: d.clk_y
        })), a
    }, O.fn.formSerialize = function(e) {
        return O.param(this.formToArray(e))
    }, O.fn.fieldSerialize = function(n) {
        var o = [];
        return this.each(function() {
            var e = this.name;
            if (e) {
                var t = O.fieldValue(this, n);
                if (t && t.constructor === Array)
                    for (var r = 0, a = t.length; r < a; r++) o.push({
                        name: e,
                        value: t[r]
                    });
                else null != t && o.push({
                    name: this.name,
                    value: t
                })
            }
        }), O.param(o)
    }, O.fn.fieldValue = function(e) {
        for (var t = [], r = 0, a = this.length; r < a; r++) {
            var n = this[r],
                n = O.fieldValue(n, e);
            null == n || n.constructor === Array && !n.length || (n.constructor === Array ? O.merge(t, n) : t.push(n))
        }
        return t
    }, O.fieldValue = function(e, t) {
        var r = e.name,
            a = e.type,
            n = e.tagName.toLowerCase();
        if ((t = void 0 === t ? !0 : t) && (!r || e.disabled || "reset" === a || "button" === a || ("checkbox" === a || "radio" === a) && !e.checked || ("submit" === a || "image" === a) && e.form && e.form.clk !== e || "select" === n && -1 === e.selectedIndex)) return null;
        if ("select" !== n) return O(e).val().replace(d, "\r\n");
        n = e.selectedIndex;
        if (n < 0) return null;
        for (var o = [], i = e.options, s = "select-one" === a, u = s ? n + 1 : i.length, c = s ? n : 0; c < u; c++) {
            var l = i[c];
            if (l.selected && !l.disabled) {
                var f = (f = l.value) || (l.attributes && l.attributes.value && !l.attributes.value.specified ? l.text : l.value);
                if (s) return f;
                o.push(f)
            }
        }
        return o
    }, O.fn.clearForm = function(e) {
        return this.each(function() {
            O("input,select,textarea", this).clearFields(e)
        })
    }, O.fn.clearFields = O.fn.clearInputs = function(r) {
        var a = /^(?:color|date|datetime|email|month|number|password|range|search|tel|text|time|url|week)$/i;
        return this.each(function() {
            var e = this.type,
                t = this.tagName.toLowerCase();
            a.test(e) || "textarea" === t ? this.value = "" : "checkbox" === e || "radio" === e ? this.checked = !1 : "select" === t ? this.selectedIndex = -1 : "file" === e ? /MSIE/.test(navigator.userAgent) ? O(this).replaceWith(O(this).clone(!0)) : O(this).val("") : r && (!0 === r && /hidden/.test(e) || "string" == typeof r && O(this).is(r)) && (this.value = "")
        })
    }, O.fn.resetForm = function() {
        return this.each(function() {
            var t = O(this),
                e = this.tagName.toLowerCase();
            switch (e) {
                case "input":
                    this.checked = this.defaultChecked;
                case "textarea":
                    return this.value = this.defaultValue, !0;
                case "option":
                case "optgroup":
                    var r = t.parents("select");
                    return r.length && r[0].multiple ? "option" === e ? this.selected = this.defaultSelected : t.find("option").resetForm() : r.resetForm(), !0;
                case "select":
                    return t.find("option").each(function(e) {
                        if (this.selected = this.defaultSelected, this.defaultSelected && !t[0].multiple) return t[0].selectedIndex = e, !1
                    }), !0;
                case "label":
                    var a = O(t.attr("for")),
                        r = t.find("input,select,textarea");
                    return a[0] && r.unshift(a[0]), r.resetForm(), !0;
                case "form":
                    return "function" != typeof this.reset && ("object" != typeof this.reset || this.reset.nodeType) || this.reset(), !0;
                default:
                    return t.find("form,input,label,select,textarea").resetForm(), !0
            }
        })
    }, O.fn.enable = function(e) {
        return void 0 === e && (e = !0), this.each(function() {
            this.disabled = !e
        })
    }, O.fn.selected = function(t) {
        return void 0 === t && (t = !0), this.each(function() {
            var e = this.type;
            "checkbox" === e || "radio" === e ? this.checked = t : "option" === this.tagName.toLowerCase() && (e = O(this).parent("select"), t && e[0] && "select-one" === e[0].type && e.find("option").selected(!1), this.selected = t)
        })
    }, O.fn.ajaxSubmit.debug = !1
});; // Generated by CoffeeScript 1.6.2
/*
 jQuery Waypoints - v2.0.4
 Copyright (c) 2011-2014 Caleb Troughton
 Dual licensed under the MIT license and GPL license.
 https://github.com/imakewebthings/jquery-waypoints/blob/master/licenses.txt
 */
(function() {
    var t = [].indexOf || function(t) {
            for (var e = 0, n = this.length; e < n; e++) {
                if (e in this && this[e] === t) return e
            }
            return -1
        },
        e = [].slice;
    (function(t, e) {
        if (typeof define === "function" && define.amd) {
            return define("waypoints", ["jquery"], function(n) {
                return e(n, t)
            })
        } else {
            return e(t.jQuery, t)
        }
    })(this, function(n, r) {
        var i, o, l, s, f, u, c, a, h, d, p, y, v, w, g, m;
        i = n(r);
        a = t.call(r, "ontouchstart") >= 0;
        s = {
            horizontal: {},
            vertical: {}
        };
        f = 1;
        c = {};
        u = "waypoints-context-id";
        p = "resize.waypoints";
        y = "scroll.waypoints";
        v = 1;
        w = "waypoints-waypoint-ids";
        g = "waypoint";
        m = "waypoints";
        o = function() {
            function t(t) {
                var e = this;
                this.$element = t;
                this.element = t[0];
                this.didResize = false;
                this.didScroll = false;
                this.id = "context" + f++;
                this.oldScroll = {
                    x: t.scrollLeft(),
                    y: t.scrollTop()
                };
                this.waypoints = {
                    horizontal: {},
                    vertical: {}
                };
                this.element[u] = this.id;
                c[this.id] = this;
                t.bind(y, function() {
                    var t;
                    if (!(e.didScroll || a)) {
                        e.didScroll = true;
                        t = function() {
                            e.doScroll();
                            return e.didScroll = false
                        };
                        return r.setTimeout(t, n[m].settings.scrollThrottle)
                    }
                });
                t.bind(p, function() {
                    var t;
                    if (!e.didResize) {
                        e.didResize = true;
                        t = function() {
                            n[m]("refresh");
                            return e.didResize = false
                        };
                        return r.setTimeout(t, n[m].settings.resizeThrottle)
                    }
                })
            }
            t.prototype.doScroll = function() {
                var t, e = this;
                t = {
                    horizontal: {
                        newScroll: this.$element.scrollLeft(),
                        oldScroll: this.oldScroll.x,
                        forward: "right",
                        backward: "left"
                    },
                    vertical: {
                        newScroll: this.$element.scrollTop(),
                        oldScroll: this.oldScroll.y,
                        forward: "down",
                        backward: "up"
                    }
                };
                if (a && (!t.vertical.oldScroll || !t.vertical.newScroll)) {
                    n[m]("refresh")
                }
                n.each(t, function(t, r) {
                    var i, o, l;
                    l = [];
                    o = r.newScroll > r.oldScroll;
                    i = o ? r.forward : r.backward;
                    n.each(e.waypoints[t], function(t, e) {
                        var n, i;
                        if (r.oldScroll < (n = e.offset) && n <= r.newScroll) {
                            return l.push(e)
                        } else if (r.newScroll < (i = e.offset) && i <= r.oldScroll) {
                            return l.push(e)
                        }
                    });
                    l.sort(function(t, e) {
                        return t.offset - e.offset
                    });
                    if (!o) {
                        l.reverse()
                    }
                    return n.each(l, function(t, e) {
                        if (e.options.continuous || t === l.length - 1) {
                            return e.trigger([i])
                        }
                    })
                });
                return this.oldScroll = {
                    x: t.horizontal.newScroll,
                    y: t.vertical.newScroll
                }
            };
            t.prototype.refresh = function() {
                var t, e, r, i = this;
                r = n.isWindow(this.element);
                e = this.$element.offset();
                this.doScroll();
                t = {
                    horizontal: {
                        contextOffset: r ? 0 : e.left,
                        contextScroll: r ? 0 : this.oldScroll.x,
                        contextDimension: this.$element.width(),
                        oldScroll: this.oldScroll.x,
                        forward: "right",
                        backward: "left",
                        offsetProp: "left"
                    },
                    vertical: {
                        contextOffset: r ? 0 : e.top,
                        contextScroll: r ? 0 : this.oldScroll.y,
                        contextDimension: r ? n[m]("viewportHeight") : this.$element.height(),
                        oldScroll: this.oldScroll.y,
                        forward: "down",
                        backward: "up",
                        offsetProp: "top"
                    }
                };
                return n.each(t, function(t, e) {
                    return n.each(i.waypoints[t], function(t, r) {
                        var i, o, l, s, f;
                        i = r.options.offset;
                        l = r.offset;
                        o = n.isWindow(r.element) ? 0 : r.$element.offset()[e.offsetProp];
                        if (n.isFunction(i)) {
                            i = i.apply(r.element)
                        } else if (typeof i === "string") {
                            i = parseFloat(i);
                            if (r.options.offset.indexOf("%") > -1) {
                                i = Math.ceil(e.contextDimension * i / 100)
                            }
                        }
                        r.offset = o - e.contextOffset + e.contextScroll - i;
                        if (r.options.onlyOnScroll && l != null || !r.enabled) {
                            return
                        }
                        if (l !== null && l < (s = e.oldScroll) && s <= r.offset) {
                            return r.trigger([e.backward])
                        } else if (l !== null && l > (f = e.oldScroll) && f >= r.offset) {
                            return r.trigger([e.forward])
                        } else if (l === null && e.oldScroll >= r.offset) {
                            return r.trigger([e.forward])
                        }
                    })
                })
            };
            t.prototype.checkEmpty = function() {
                if (n.isEmptyObject(this.waypoints.horizontal) && n.isEmptyObject(this.waypoints.vertical)) {
                    this.$element.unbind([p, y].join(" "));
                    return delete c[this.id]
                }
            };
            return t
        }();
        l = function() {
            function t(t, e, r) {
                var i, o;
                r = n.extend({}, n.fn[g].defaults, r);
                if (r.offset === "bottom-in-view") {
                    r.offset = function() {
                        var t;
                        t = n[m]("viewportHeight");
                        if (!n.isWindow(e.element)) {
                            t = e.$element.height()
                        }
                        return t - n(this).outerHeight()
                    }
                }
                this.$element = t;
                this.element = t[0];
                this.axis = r.horizontal ? "horizontal" : "vertical";
                this.callback = r.handler;
                this.context = e;
                this.enabled = r.enabled;
                this.id = "waypoints" + v++;
                this.offset = null;
                this.options = r;
                e.waypoints[this.axis][this.id] = this;
                s[this.axis][this.id] = this;
                i = (o = this.element[w]) != null ? o : [];
                i.push(this.id);
                this.element[w] = i
            }
            t.prototype.trigger = function(t) {
                if (!this.enabled) {
                    return
                }
                if (this.callback != null) {
                    this.callback.apply(this.element, t)
                }
                if (this.options.triggerOnce) {
                    return this.destroy()
                }
            };
            t.prototype.disable = function() {
                return this.enabled = false
            };
            t.prototype.enable = function() {
                this.context.refresh();
                return this.enabled = true
            };
            t.prototype.destroy = function() {
                delete s[this.axis][this.id];
                delete this.context.waypoints[this.axis][this.id];
                return this.context.checkEmpty()
            };
            t.getWaypointsByElement = function(t) {
                var e, r;
                r = t[w];
                if (!r) {
                    return []
                }
                e = n.extend({}, s.horizontal, s.vertical);
                return n.map(r, function(t) {
                    return e[t]
                })
            };
            return t
        }();
        d = {
            init: function(t, e) {
                var r;
                if (e == null) {
                    e = {}
                }
                if ((r = e.handler) == null) {
                    e.handler = t
                }
                this.each(function() {
                    var t, r, i, s;
                    t = n(this);
                    i = (s = e.context) != null ? s : n.fn[g].defaults.context;
                    if (!n.isWindow(i)) {
                        i = t.closest(i)
                    }
                    i = n(i);
                    r = c[i[0][u]];
                    if (!r) {
                        r = new o(i)
                    }
                    return new l(t, r, e)
                });
                n[m]("refresh");
                return this
            },
            disable: function() {
                return d._invoke.call(this, "disable")
            },
            enable: function() {
                return d._invoke.call(this, "enable")
            },
            destroy: function() {
                return d._invoke.call(this, "destroy")
            },
            prev: function(t, e) {
                return d._traverse.call(this, t, e, function(t, e, n) {
                    if (e > 0) {
                        return t.push(n[e - 1])
                    }
                })
            },
            next: function(t, e) {
                return d._traverse.call(this, t, e, function(t, e, n) {
                    if (e < n.length - 1) {
                        return t.push(n[e + 1])
                    }
                })
            },
            _traverse: function(t, e, i) {
                var o, l;
                if (t == null) {
                    t = "vertical"
                }
                if (e == null) {
                    e = r
                }
                l = h.aggregate(e);
                o = [];
                this.each(function() {
                    var e;
                    e = n.inArray(this, l[t]);
                    return i(o, e, l[t])
                });
                return this.pushStack(o)
            },
            _invoke: function(t) {
                this.each(function() {
                    var e;
                    e = l.getWaypointsByElement(this);
                    return n.each(e, function(e, n) {
                        n[t]();
                        return true
                    })
                });
                return this
            }
        };
        n.fn[g] = function() {
            var t, r;
            r = arguments[0], t = 2 <= arguments.length ? e.call(arguments, 1) : [];
            if (d[r]) {
                return d[r].apply(this, t)
            } else if (n.isFunction(r)) {
                return d.init.apply(this, arguments)
            } else if (n.isPlainObject(r)) {
                return d.init.apply(this, [null, r])
            } else if (!r) {
                return n.error("jQuery Waypoints needs a callback function or handler option.")
            } else {
                return n.error("The " + r + " method does not exist in jQuery Waypoints.")
            }
        };
        n.fn[g].defaults = {
            context: r,
            continuous: true,
            enabled: true,
            horizontal: false,
            offset: 0,
            triggerOnce: false
        };
        h = {
            refresh: function() {
                return n.each(c, function(t, e) {
                    return e.refresh()
                })
            },
            viewportHeight: function() {
                var t;
                return (t = r.innerHeight) != null ? t : i.height()
            },
            aggregate: function(t) {
                var e, r, i;
                e = s;
                if (t) {
                    e = (i = c[n(t)[0][u]]) != null ? i.waypoints : void 0
                }
                if (!e) {
                    return []
                }
                r = {
                    horizontal: [],
                    vertical: []
                };
                n.each(r, function(t, i) {
                    n.each(e[t], function(t, e) {
                        return i.push(e)
                    });
                    i.sort(function(t, e) {
                        return t.offset - e.offset
                    });
                    r[t] = n.map(i, function(t) {
                        return t.element
                    });
                    return r[t] = n.unique(r[t])
                });
                return r
            },
            above: function(t) {
                if (t == null) {
                    t = r
                }
                return h._filter(t, "vertical", function(t, e) {
                    return e.offset <= t.oldScroll.y
                })
            },
            below: function(t) {
                if (t == null) {
                    t = r
                }
                return h._filter(t, "vertical", function(t, e) {
                    return e.offset > t.oldScroll.y
                })
            },
            left: function(t) {
                if (t == null) {
                    t = r
                }
                return h._filter(t, "horizontal", function(t, e) {
                    return e.offset <= t.oldScroll.x
                })
            },
            right: function(t) {
                if (t == null) {
                    t = r
                }
                return h._filter(t, "horizontal", function(t, e) {
                    return e.offset > t.oldScroll.x
                })
            },
            enable: function() {
                return h._invoke("enable")
            },
            disable: function() {
                return h._invoke("disable")
            },
            destroy: function() {
                return h._invoke("destroy")
            },
            extendFn: function(t, e) {
                return d[t] = e
            },
            _invoke: function(t) {
                var e;
                e = n.extend({}, s.vertical, s.horizontal);
                return n.each(e, function(e, n) {
                    n[t]();
                    return true
                })
            },
            _filter: function(t, e, r) {
                var i, o;
                i = c[n(t)[0][u]];
                if (!i) {
                    return []
                }
                o = [];
                n.each(i.waypoints[e], function(t, e) {
                    if (r(i, e)) {
                        return o.push(e)
                    }
                });
                o.sort(function(t, e) {
                    return t.offset - e.offset
                });
                return n.map(o, function(t) {
                    return t.element
                })
            }
        };
        n[m] = function() {
            var t, n;
            n = arguments[0], t = 2 <= arguments.length ? e.call(arguments, 1) : [];
            if (h[n]) {
                return h[n].apply(null, t)
            } else {
                return h.aggregate.call(null, n)
            }
        };
        n[m].settings = {
            resizeThrottle: 100,
            scrollThrottle: 30
        };
        return i.load(function() {
            return n[m]("refresh")
        })
    })
}).call(this);

;
/*
 * jPlayer Plugin for jQuery JavaScript Library
 * http://www.jplayer.org
 *
 * Copyright (c) 2009 - 2011 Happyworm Ltd
 * Dual licensed under the MIT and GPL licenses.
 *  - http://www.opensource.org/licenses/mit-license.php
 *  - http://www.gnu.org/copyleft/gpl.html
 *
 * Author: Mark J Panaghiston
 * Version: 2.1.0
 * Date: 1st September 2011
 */

(function(b, f) {
    b.fn.jPlayer = function(a) {
        var c = typeof a === "string",
            d = Array.prototype.slice.call(arguments, 1),
            e = this,
            a = !c && d.length ? b.extend.apply(null, [!0, a].concat(d)) : a;
        if (c && a.charAt(0) === "_") return e;
        c ? this.each(function() {
            var c = b.data(this, "jPlayer"),
                h = c && b.isFunction(c[a]) ? c[a].apply(c, d) : c;
            if (h !== c && h !== f) return e = h, !1
        }) : this.each(function() {
            var c = b.data(this, "jPlayer");
            c ? c.option(a || {}) : b.data(this, "jPlayer", new b.jPlayer(a, this))
        });
        return e
    };
    b.jPlayer = function(a, c) {
        if (arguments.length) {
            this.element =
                b(c);
            this.options = b.extend(!0, {}, this.options, a);
            var d = this;
            this.element.bind("remove.jPlayer", function() {
                d.destroy()
            });
            this._init()
        }
    };
    b.jPlayer.emulateMethods = "load play pause";
    b.jPlayer.emulateStatus = "src readyState networkState currentTime duration paused ended playbackRate";
    b.jPlayer.emulateOptions = "muted volume";
    b.jPlayer.reservedEvent = "ready flashreset resize repeat error warning";
    b.jPlayer.event = {
        ready: "jPlayer_ready",
        flashreset: "jPlayer_flashreset",
        resize: "jPlayer_resize",
        repeat: "jPlayer_repeat",
        click: "jPlayer_click",
        error: "jPlayer_error",
        warning: "jPlayer_warning",
        loadstart: "jPlayer_loadstart",
        progress: "jPlayer_progress",
        suspend: "jPlayer_suspend",
        abort: "jPlayer_abort",
        emptied: "jPlayer_emptied",
        stalled: "jPlayer_stalled",
        play: "jPlayer_play",
        pause: "jPlayer_pause",
        loadedmetadata: "jPlayer_loadedmetadata",
        loadeddata: "jPlayer_loadeddata",
        waiting: "jPlayer_waiting",
        playing: "jPlayer_playing",
        canplay: "jPlayer_canplay",
        canplaythrough: "jPlayer_canplaythrough",
        seeking: "jPlayer_seeking",
        seeked: "jPlayer_seeked",
        timeupdate: "jPlayer_timeupdate",
        ended: "jPlayer_ended",
        ratechange: "jPlayer_ratechange",
        durationchange: "jPlayer_durationchange",
        volumechange: "jPlayer_volumechange"
    };
    b.jPlayer.htmlEvent = "loadstart,abort,emptied,stalled,loadedmetadata,loadeddata,canplay,canplaythrough,ratechange".split(",");
    b.jPlayer.pause = function() {
        b.each(b.jPlayer.prototype.instances, function(a, b) {
            b.data("jPlayer").status.srcSet && b.jPlayer("pause")
        })
    };
    b.jPlayer.timeFormat = {
        showHour: !1,
        showMin: !0,
        showSec: !0,
        padHour: !1,
        padMin: !0,
        padSec: !0,
        sepHour: ":",
        sepMin: ":",
        sepSec: ""
    };
    b.jPlayer.convertTime = function(a) {
        var c = new Date(a * 1E3),
            d = c.getUTCHours(),
            a = c.getUTCMinutes(),
            c = c.getUTCSeconds(),
            d = b.jPlayer.timeFormat.padHour && d < 10 ? "0" + d : d,
            a = b.jPlayer.timeFormat.padMin && a < 10 ? "0" + a : a,
            c = b.jPlayer.timeFormat.padSec && c < 10 ? "0" + c : c;
        return (b.jPlayer.timeFormat.showHour ? d + b.jPlayer.timeFormat.sepHour : "") + (b.jPlayer.timeFormat.showMin ? a + b.jPlayer.timeFormat.sepMin : "") + (b.jPlayer.timeFormat.showSec ? c + b.jPlayer.timeFormat.sepSec : "")
    };
    b.jPlayer.uaBrowser =
        function(a) {
            var a = a.toLowerCase(),
                b = /(opera)(?:.*version)?[ \/]([\w.]+)/,
                d = /(msie) ([\w.]+)/,
                e = /(mozilla)(?:.*? rv:([\w.]+))?/,
                a = /(webkit)[ \/]([\w.]+)/.exec(a) || b.exec(a) || d.exec(a) || a.indexOf("compatible") < 0 && e.exec(a) || [];
            return {
                browser: a[1] || "",
                version: a[2] || "0"
            }
        };
    b.jPlayer.uaPlatform = function(a) {
        var b = a.toLowerCase(),
            d = /(android)/,
            e = /(mobile)/,
            a = /(ipad|iphone|ipod|android|blackberry|playbook|windows ce|webos)/.exec(b) || [],
            b = /(ipad|playbook)/.exec(b) || !e.exec(b) && d.exec(b) || [];
        a[1] && (a[1] = a[1].replace(/\s/g,
            "_"));
        return {
            platform: a[1] || "",
            tablet: b[1] || ""
        }
    };
    b.jPlayer.browser = {};
    b.jPlayer.platform = {};
    var i = b.jPlayer.uaBrowser(navigator.userAgent);
    if (i.browser) b.jPlayer.browser[i.browser] = !0, b.jPlayer.browser.version = i.version;
    i = b.jPlayer.uaPlatform(navigator.userAgent);
    if (i.platform) b.jPlayer.platform[i.platform] = !0, b.jPlayer.platform.mobile = !i.tablet, b.jPlayer.platform.tablet = !!i.tablet;
    b.jPlayer.prototype = {
        count: 0,
        version: {
            script: "2.1.0",
            needFlash: "2.1.0",
            flash: "unknown"
        },
        options: {
            swfPath: "js",
            solution: "html, flash",
            supplied: "mp3",
            preload: "metadata",
            volume: 0.8,
            muted: !1,
            wmode: "opaque",
            backgroundColor: "#000000",
            cssSelectorAncestor: "#jp_container_1",
            cssSelector: {
                videoPlay: ".jp-video-play",
                play: ".jp-play",
                pause: ".jp-pause",
                stop: ".jp-stop",
                seekBar: ".jp-seek-bar",
                playBar: ".jp-play-bar",
                mute: ".jp-mute",
                unmute: ".jp-unmute",
                volumeBar: ".jp-volume-bar",
                volumeBarValue: ".jp-volume-bar-value",
                volumeMax: ".jp-volume-max",
                currentTime: ".jp-current-time",
                duration: ".jp-duration",
                fullScreen: ".jp-full-screen",
                restoreScreen: ".jp-restore-screen",
                repeat: ".jp-repeat",
                repeatOff: ".jp-repeat-off",
                gui: ".jp-gui",
                noSolution: ".jp-no-solution"
            },
            fullScreen: !1,
            autohide: {
                restored: !1,
                full: !0,
                fadeIn: 200,
                fadeOut: 600,
                hold: 1E3
            },
            loop: !1,
            repeat: function(a) {
                a.jPlayer.options.loop ? b(this).unbind(".jPlayerRepeat").bind(b.jPlayer.event.ended + ".jPlayer.jPlayerRepeat", function() {
                    b(this).jPlayer("play")
                }) : b(this).unbind(".jPlayerRepeat")
            },
            nativeVideoControls: {},
            noFullScreen: {
                msie: /msie [0-6]/,
                ipad: /ipad.*?os [0-4]/,
                iphone: /iphone/,
                ipod: /ipod/,
                android_pad: /android [0-3](?!.*?mobile)/,
                android_phone: /android.*?mobile/,
                blackberry: /blackberry/,
                windows_ce: /windows ce/,
                webos: /webos/
            },
            noVolume: {
                ipad: /ipad/,
                iphone: /iphone/,
                ipod: /ipod/,
                android_pad: /android(?!.*?mobile)/,
                android_phone: /android.*?mobile/,
                blackberry: /blackberry/,
                windows_ce: /windows ce/,
                webos: /webos/,
                playbook: /playbook/
            },
            verticalVolume: !1,
            idPrefix: "jp",
            noConflict: "jQuery",
            emulateHtml: !1,
            errorAlerts: !1,
            warningAlerts: !1
        },
        optionsAudio: {
            size: {
                width: "0px",
                height: "0px",
                cssClass: ""
            },
            sizeFull: {
                width: "0px",
                height: "0px",
                cssClass: ""
            }
        },
        optionsVideo: {
            size: {
                width: "480px",
                height: "270px",
                cssClass: "jp-video-270p"
            },
            sizeFull: {
                width: "100%",
                height: "100%",
                cssClass: "jp-video-full"
            }
        },
        instances: {},
        status: {
            src: "",
            media: {},
            paused: !0,
            format: {},
            formatType: "",
            waitForPlay: !0,
            waitForLoad: !0,
            srcSet: !1,
            video: !1,
            seekPercent: 0,
            currentPercentRelative: 0,
            currentPercentAbsolute: 0,
            currentTime: 0,
            duration: 0,
            readyState: 0,
            networkState: 0,
            playbackRate: 1,
            ended: 0
        },
        internal: {
            ready: !1
        },
        solution: {
            html: !0,
            flash: !0
        },
        format: {
            mp3: {
                codec: 'audio/mpeg; codecs="mp3"',
                flashCanPlay: !0,
                media: "audio"
            },
            m4a: {
                codec: 'audio/mp4; codecs="mp4a.40.2"',
                flashCanPlay: !0,
                media: "audio"
            },
            oga: {
                codec: 'audio/ogg; codecs="vorbis"',
                flashCanPlay: !1,
                media: "audio"
            },
            wav: {
                codec: 'audio/wav; codecs="1"',
                flashCanPlay: !1,
                media: "audio"
            },
            webma: {
                codec: 'audio/webm; codecs="vorbis"',
                flashCanPlay: !1,
                media: "audio"
            },
            fla: {
                codec: "audio/x-flv",
                flashCanPlay: !0,
                media: "audio"
            },
            m4v: {
                codec: 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"',
                flashCanPlay: !0,
                media: "video"
            },
            ogv: {
                codec: 'video/ogg; codecs="theora, vorbis"',
                flashCanPlay: !1,
                media: "video"
            },
            webmv: {
                codec: 'video/webm; codecs="vorbis, vp8"',
                flashCanPlay: !1,
                media: "video"
            },
            flv: {
                codec: "video/x-flv",
                flashCanPlay: !0,
                media: "video"
            }
        },
        _init: function() {
            var a = this;
            this.element.empty();
            this.status = b.extend({}, this.status);
            this.internal = b.extend({}, this.internal);
            this.internal.domNode = this.element.get(0);
            this.formats = [];
            this.solutions = [];
            this.require = {};
            this.htmlElement = {};
            this.html = {};
            this.html.audio = {};
            this.html.video = {};
            this.flash = {};
            this.css = {};
            this.css.cs = {};
            this.css.jq = {};
            this.ancestorJq = [];
            this.options.volume = this._limitValue(this.options.volume, 0, 1);
            b.each(this.options.supplied.toLowerCase().split(","), function(c, d) {
                var e = d.replace(/^\s+|\s+$/g, "");
                if (a.format[e]) {
                    var f = !1;
                    b.each(a.formats, function(a, b) {
                        if (e === b) return f = !0, !1
                    });
                    f || a.formats.push(e)
                }
            });
            b.each(this.options.solution.toLowerCase().split(","), function(c, d) {
                var e = d.replace(/^\s+|\s+$/g, "");
                if (a.solution[e]) {
                    var f = !1;
                    b.each(a.solutions, function(a, b) {
                        if (e === b) return f = !0, !1
                    });
                    f || a.solutions.push(e)
                }
            });
            this.internal.instance =
                "jp_" + this.count;
            this.instances[this.internal.instance] = this.element;
            this.element.attr("id") || this.element.attr("id", this.options.idPrefix + "_jplayer_" + this.count);
            this.internal.self = b.extend({}, {
                id: this.element.attr("id"),
                jq: this.element
            });
            this.internal.audio = b.extend({}, {
                id: this.options.idPrefix + "_audio_" + this.count,
                jq: f
            });
            this.internal.video = b.extend({}, {
                id: this.options.idPrefix + "_video_" + this.count,
                jq: f
            });
            this.internal.flash = b.extend({}, {
                id: this.options.idPrefix + "_flash_" + this.count,
                jq: f,
                swf: this.options.swfPath +
                    (this.options.swfPath.toLowerCase().slice(-4) !== ".swf" ? (this.options.swfPath && this.options.swfPath.slice(-1) !== "/" ? "/" : "") + "Jplayer.swf" : "")
            });
            this.internal.poster = b.extend({}, {
                id: this.options.idPrefix + "_poster_" + this.count,
                jq: f
            });
            b.each(b.jPlayer.event, function(b, c) {
                a.options[b] !== f && (a.element.bind(c + ".jPlayer", a.options[b]), a.options[b] = f)
            });
            this.require.audio = !1;
            this.require.video = !1;
            b.each(this.formats, function(b, c) {
                a.require[a.format[c].media] = !0
            });
            this.options = this.require.video ? b.extend(!0, {}, this.optionsVideo, this.options) : b.extend(!0, {}, this.optionsAudio, this.options);
            this._setSize();
            this.status.nativeVideoControls = this._uaBlocklist(this.options.nativeVideoControls);
            this.status.noFullScreen = this._uaBlocklist(this.options.noFullScreen);
            this.status.noVolume = this._uaBlocklist(this.options.noVolume);
            this._restrictNativeVideoControls();
            this.htmlElement.poster = document.createElement("img");
            this.htmlElement.poster.id = this.internal.poster.id;
            this.htmlElement.poster.onload = function() {
                (!a.status.video ||
                    a.status.waitForPlay) && a.internal.poster.jq.show()
            };
            this.element.append(this.htmlElement.poster);
            this.internal.poster.jq = b("#" + this.internal.poster.id);
            this.internal.poster.jq.css({
                width: this.status.width,
                height: this.status.height
            });
            this.internal.poster.jq.hide();
            this.internal.poster.jq.bind("click.jPlayer", function() {
                a._trigger(b.jPlayer.event.click)
            });
            this.html.audio.available = !1;
            if (this.require.audio) this.htmlElement.audio = document.createElement("audio"), this.htmlElement.audio.id = this.internal.audio.id,
                this.html.audio.available = !!this.htmlElement.audio.canPlayType && this._testCanPlayType(this.htmlElement.audio);
            this.html.video.available = !1;
            if (this.require.video) this.htmlElement.video = document.createElement("video"), this.htmlElement.video.id = this.internal.video.id, this.html.video.available = !!this.htmlElement.video.canPlayType && this._testCanPlayType(this.htmlElement.video);
            this.flash.available = this._checkForFlash(10);
            this.html.canPlay = {};
            this.flash.canPlay = {};
            b.each(this.formats, function(b, c) {
                a.html.canPlay[c] =
                    a.html[a.format[c].media].available && "" !== a.htmlElement[a.format[c].media].canPlayType(a.format[c].codec);
                a.flash.canPlay[c] = a.format[c].flashCanPlay && a.flash.available
            });
            this.html.desired = !1;
            this.flash.desired = !1;
            b.each(this.solutions, function(c, d) {
                if (c === 0) a[d].desired = !0;
                else {
                    var e = !1,
                        f = !1;
                    b.each(a.formats, function(b, c) {
                        a[a.solutions[0]].canPlay[c] && (a.format[c].media === "video" ? f = !0 : e = !0)
                    });
                    a[d].desired = a.require.audio && !e || a.require.video && !f
                }
            });
            this.html.support = {};
            this.flash.support = {};
            b.each(this.formats,
                function(b, c) {
                    a.html.support[c] = a.html.canPlay[c] && a.html.desired;
                    a.flash.support[c] = a.flash.canPlay[c] && a.flash.desired
                });
            this.html.used = !1;
            this.flash.used = !1;
            b.each(this.solutions, function(c, d) {
                b.each(a.formats, function(b, c) {
                    if (a[d].support[c]) return a[d].used = !0, !1
                })
            });
            this._resetActive();
            this._resetGate();
            this._cssSelectorAncestor(this.options.cssSelectorAncestor);
            !this.html.used && !this.flash.used ? (this._error({
                type: b.jPlayer.error.NO_SOLUTION,
                context: "{solution:'" + this.options.solution + "', supplied:'" +
                    this.options.supplied + "'}",
                message: b.jPlayer.errorMsg.NO_SOLUTION,
                hint: b.jPlayer.errorHint.NO_SOLUTION
            }), this.css.jq.noSolution.length && this.css.jq.noSolution.show()) : this.css.jq.noSolution.length && this.css.jq.noSolution.hide();
            if (this.flash.used) {
                var c, d = "jQuery=" + encodeURI(this.options.noConflict) + "&id=" + encodeURI(this.internal.self.id) + "&vol=" + this.options.volume + "&muted=" + this.options.muted;
                if (b.browser.msie && Number(b.browser.version) <= 8) {
                    d = ['<param name="movie" value="' + this.internal.flash.swf +
                        '" />', '<param name="FlashVars" value="' + d + '" />', '<param name="allowScriptAccess" value="always" />', '<param name="bgcolor" value="' + this.options.backgroundColor + '" />', '<param name="wmode" value="' + this.options.wmode + '" />'
                    ];
                    c = document.createElement('<object id="' + this.internal.flash.id + '" classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" width="0" height="0"></object>');
                    for (var e = 0; e < d.length; e++) c.appendChild(document.createElement(d[e]))
                } else e = function(a, b, c) {
                    var d = document.createElement("param");
                    d.setAttribute("name", b);
                    d.setAttribute("value", c);
                    a.appendChild(d)
                }, c = document.createElement("object"), c.setAttribute("id", this.internal.flash.id), c.setAttribute("data", this.internal.flash.swf), c.setAttribute("type", "application/x-shockwave-flash"), c.setAttribute("width", "1"), c.setAttribute("height", "1"), e(c, "flashvars", d), e(c, "allowscriptaccess", "always"), e(c, "bgcolor", this.options.backgroundColor), e(c, "wmode", this.options.wmode);
                this.element.append(c);
                this.internal.flash.jq = b(c)
            }
            if (this.html.used) {
                if (this.html.audio.available) this._addHtmlEventListeners(this.htmlElement.audio,
                    this.html.audio), this.element.append(this.htmlElement.audio), this.internal.audio.jq = b("#" + this.internal.audio.id);
                if (this.html.video.available) this._addHtmlEventListeners(this.htmlElement.video, this.html.video), this.element.append(this.htmlElement.video), this.internal.video.jq = b("#" + this.internal.video.id), this.status.nativeVideoControls ? this.internal.video.jq.css({
                    width: this.status.width,
                    height: this.status.height
                }) : this.internal.video.jq.css({
                    width: "0px",
                    height: "0px"
                }), this.internal.video.jq.bind("click.jPlayer",
                    function() {
                        a._trigger(b.jPlayer.event.click)
                    })
            }
            this.options.emulateHtml && this._emulateHtmlBridge();
            this.html.used && !this.flash.used && setTimeout(function() {
                a.internal.ready = !0;
                a.version.flash = "n/a";
                a._trigger(b.jPlayer.event.repeat);
                a._trigger(b.jPlayer.event.ready)
            }, 100);
            this._updateNativeVideoControls();
            this._updateInterface();
            this._updateButtons(!1);
            this._updateAutohide();
            this._updateVolume(this.options.volume);
            this._updateMute(this.options.muted);
            this.css.jq.videoPlay.length && this.css.jq.videoPlay.hide();
            b.jPlayer.prototype.count++
        },
        destroy: function() {
            this.clearMedia();
            this._removeUiClass();
            this.css.jq.currentTime.length && this.css.jq.currentTime.text("");
            this.css.jq.duration.length && this.css.jq.duration.text("");
            b.each(this.css.jq, function(a, b) {
                b.length && b.unbind(".jPlayer")
            });
            this.internal.poster.jq.unbind(".jPlayer");
            this.internal.video.jq && this.internal.video.jq.unbind(".jPlayer");
            this.options.emulateHtml && this._destroyHtmlBridge();
            this.element.removeData("jPlayer");
            this.element.unbind(".jPlayer");
            this.element.empty();
            delete this.instances[this.internal.instance]
        },
        enable: function() {},
        disable: function() {},
        _testCanPlayType: function(a) {
            try {
                return a.canPlayType(this.format.mp3.codec), !0
            } catch (b) {
                return !1
            }
        },
        _uaBlocklist: function(a) {
            var c = navigator.userAgent.toLowerCase(),
                d = !1;
            b.each(a, function(a, b) {
                if (b && b.test(c)) return d = !0, !1
            });
            return d
        },
        _restrictNativeVideoControls: function() {
            if (this.require.audio && this.status.nativeVideoControls) this.status.nativeVideoControls = !1, this.status.noFullScreen = !0
        },
        _updateNativeVideoControls: function() {
            if (this.html.video.available && this.html.used) this.htmlElement.video.controls = this.status.nativeVideoControls, this._updateAutohide(), this.status.nativeVideoControls && this.require.video ? (this.internal.poster.jq.hide(), this.internal.video.jq.css({
                width: this.status.width,
                height: this.status.height
            })) : this.status.waitForPlay && this.status.video && (this.internal.poster.jq.show(), this.internal.video.jq.css({
                width: "0px",
                height: "0px"
            }))
        },
        _addHtmlEventListeners: function(a,
            c) {
            var d = this;
            a.preload = this.options.preload;
            a.muted = this.options.muted;
            a.volume = this.options.volume;
            a.addEventListener("progress", function() {
                c.gate && (d._getHtmlStatus(a), d._updateInterface(), d._trigger(b.jPlayer.event.progress))
            }, !1);
            a.addEventListener("timeupdate", function() {
                c.gate && (d._getHtmlStatus(a), d._updateInterface(), d._trigger(b.jPlayer.event.timeupdate))
            }, !1);
            a.addEventListener("durationchange", function() {
                if (c.gate) d.status.duration = this.duration, d._getHtmlStatus(a), d._updateInterface(),
                    d._trigger(b.jPlayer.event.durationchange)
            }, !1);
            a.addEventListener("play", function() {
                c.gate && (d._updateButtons(!0), d._html_checkWaitForPlay(), d._trigger(b.jPlayer.event.play))
            }, !1);
            a.addEventListener("playing", function() {
                c.gate && (d._updateButtons(!0), d._seeked(), d._trigger(b.jPlayer.event.playing))
            }, !1);
            a.addEventListener("pause", function() {
                c.gate && (d._updateButtons(!1), d._trigger(b.jPlayer.event.pause))
            }, !1);
            a.addEventListener("waiting", function() {
                c.gate && (d._seeking(), d._trigger(b.jPlayer.event.waiting))
            }, !1);
            a.addEventListener("seeking", function() {
                c.gate && (d._seeking(), d._trigger(b.jPlayer.event.seeking))
            }, !1);
            a.addEventListener("seeked", function() {
                c.gate && (d._seeked(), d._trigger(b.jPlayer.event.seeked))
            }, !1);
            a.addEventListener("volumechange", function() {
                if (c.gate) d.options.volume = a.volume, d.options.muted = a.muted, d._updateMute(), d._updateVolume(), d._trigger(b.jPlayer.event.volumechange)
            }, !1);
            a.addEventListener("suspend", function() {
                c.gate && (d._seeked(), d._trigger(b.jPlayer.event.suspend))
            }, !1);
            a.addEventListener("ended",
                function() {
                    if (c.gate) {
                        if (!b.jPlayer.browser.webkit) d.htmlElement.media.currentTime = 0;
                        d.htmlElement.media.pause();
                        d._updateButtons(!1);
                        d._getHtmlStatus(a, !0);
                        d._updateInterface();
                        d._trigger(b.jPlayer.event.ended)
                    }
                }, !1);
            a.addEventListener("error", function() {
                if (c.gate && (d._updateButtons(!1), d._seeked(), d.status.srcSet)) clearTimeout(d.internal.htmlDlyCmdId), d.status.waitForLoad = !0, d.status.waitForPlay = !0, d.status.video && !d.status.nativeVideoControls && d.internal.video.jq.css({
                        width: "0px",
                        height: "0px"
                    }),
                    d._validString(d.status.media.poster) && !d.status.nativeVideoControls && d.internal.poster.jq.show(), d.css.jq.videoPlay.length && d.css.jq.videoPlay.show(), d._error({
                        type: b.jPlayer.error.URL,
                        context: d.status.src,
                        message: b.jPlayer.errorMsg.URL,
                        hint: b.jPlayer.errorHint.URL
                    })
            }, !1);
            b.each(b.jPlayer.htmlEvent, function(e, g) {
                a.addEventListener(this, function() {
                    c.gate && d._trigger(b.jPlayer.event[g])
                }, !1)
            })
        },
        _getHtmlStatus: function(a, b) {
            var d = 0,
                e = 0,
                g = 0,
                f = 0;
            if (a.duration) this.status.duration = a.duration;
            d = a.currentTime;
            e = this.status.duration > 0 ? 100 * d / this.status.duration : 0;
            typeof a.seekable === "object" && a.seekable.length > 0 ? (g = this.status.duration > 0 ? 100 * a.seekable.end(a.seekable.length - 1) / this.status.duration : 100, f = 100 * a.currentTime / a.seekable.end(a.seekable.length - 1)) : (g = 100, f = e);
            b && (e = f = d = 0);
            this.status.seekPercent = g;
            this.status.currentPercentRelative = f;
            this.status.currentPercentAbsolute = e;
            this.status.currentTime = d;
            this.status.readyState = a.readyState;
            this.status.networkState = a.networkState;
            this.status.playbackRate =
                a.playbackRate;
            this.status.ended = a.ended
        },
        _resetStatus: function() {
            this.status = b.extend({}, this.status, b.jPlayer.prototype.status)
        },
        _trigger: function(a, c, d) {
            a = b.Event(a);
            a.jPlayer = {};
            a.jPlayer.version = b.extend({}, this.version);
            a.jPlayer.options = b.extend(!0, {}, this.options);
            a.jPlayer.status = b.extend(!0, {}, this.status);
            a.jPlayer.html = b.extend(!0, {}, this.html);
            a.jPlayer.flash = b.extend(!0, {}, this.flash);
            if (c) a.jPlayer.error = b.extend({}, c);
            if (d) a.jPlayer.warning = b.extend({}, d);
            this.element.trigger(a)
        },
        jPlayerFlashEvent: function(a, c) {
            if (a === b.jPlayer.event.ready)
                if (this.internal.ready) {
                    if (this.flash.gate) {
                        if (this.status.srcSet) {
                            var d = this.status.currentTime,
                                e = this.status.paused;
                            this.setMedia(this.status.media);
                            d > 0 && (e ? this.pause(d) : this.play(d))
                        }
                        this._trigger(b.jPlayer.event.flashreset)
                    }
                } else this.internal.ready = !0, this.internal.flash.jq.css({
                    width: "0px",
                    height: "0px"
                }), this.version.flash = c.version, this.version.needFlash !== this.version.flash && this._error({
                    type: b.jPlayer.error.VERSION,
                    context: this.version.flash,
                    message: b.jPlayer.errorMsg.VERSION + this.version.flash,
                    hint: b.jPlayer.errorHint.VERSION
                }), this._trigger(b.jPlayer.event.repeat), this._trigger(a);
            if (this.flash.gate) switch (a) {
                case b.jPlayer.event.progress:
                    this._getFlashStatus(c);
                    this._updateInterface();
                    this._trigger(a);
                    break;
                case b.jPlayer.event.timeupdate:
                    this._getFlashStatus(c);
                    this._updateInterface();
                    this._trigger(a);
                    break;
                case b.jPlayer.event.play:
                    this._seeked();
                    this._updateButtons(!0);
                    this._trigger(a);
                    break;
                case b.jPlayer.event.pause:
                    this._updateButtons(!1);
                    this._trigger(a);
                    break;
                case b.jPlayer.event.ended:
                    this._updateButtons(!1);
                    this._trigger(a);
                    break;
                case b.jPlayer.event.click:
                    this._trigger(a);
                    break;
                case b.jPlayer.event.error:
                    this.status.waitForLoad = !0;
                    this.status.waitForPlay = !0;
                    this.status.video && this.internal.flash.jq.css({
                        width: "0px",
                        height: "0px"
                    });
                    this._validString(this.status.media.poster) && this.internal.poster.jq.show();
                    this.css.jq.videoPlay.length && this.status.video && this.css.jq.videoPlay.show();
                    this.status.video ? this._flash_setVideo(this.status.media) :
                        this._flash_setAudio(this.status.media);
                    this._updateButtons(!1);
                    this._error({
                        type: b.jPlayer.error.URL,
                        context: c.src,
                        message: b.jPlayer.errorMsg.URL,
                        hint: b.jPlayer.errorHint.URL
                    });
                    break;
                case b.jPlayer.event.seeking:
                    this._seeking();
                    this._trigger(a);
                    break;
                case b.jPlayer.event.seeked:
                    this._seeked();
                    this._trigger(a);
                    break;
                case b.jPlayer.event.ready:
                    break;
                default:
                    this._trigger(a)
            }
            return !1
        },
        _getFlashStatus: function(a) {
            this.status.seekPercent = a.seekPercent;
            this.status.currentPercentRelative = a.currentPercentRelative;
            this.status.currentPercentAbsolute = a.currentPercentAbsolute;
            this.status.currentTime = a.currentTime;
            this.status.duration = a.duration;
            this.status.readyState = 4;
            this.status.networkState = 0;
            this.status.playbackRate = 1;
            this.status.ended = !1
        },
        _updateButtons: function(a) {
            if (a !== f) this.status.paused = !a, this.css.jq.play.length && this.css.jq.pause.length && (a ? (this.css.jq.play.hide(), this.css.jq.pause.show()) : (this.css.jq.play.show(), this.css.jq.pause.hide()));
            this.css.jq.restoreScreen.length && this.css.jq.fullScreen.length &&
                (this.status.noFullScreen ? (this.css.jq.fullScreen.hide(), this.css.jq.restoreScreen.hide()) : this.options.fullScreen ? (this.css.jq.fullScreen.hide(), this.css.jq.restoreScreen.show()) : (this.css.jq.fullScreen.show(), this.css.jq.restoreScreen.hide()));
            this.css.jq.repeat.length && this.css.jq.repeatOff.length && (this.options.loop ? (this.css.jq.repeat.hide(), this.css.jq.repeatOff.show()) : (this.css.jq.repeat.show(), this.css.jq.repeatOff.hide()))
        },
        _updateInterface: function() {
            this.css.jq.seekBar.length && this.css.jq.seekBar.width(this.status.seekPercent +
                "%");
            this.css.jq.playBar.length && this.css.jq.playBar.width(this.status.currentPercentRelative + "%");
            this.css.jq.currentTime.length && this.css.jq.currentTime.text(b.jPlayer.convertTime(this.status.currentTime));
            this.css.jq.duration.length && this.css.jq.duration.text(b.jPlayer.convertTime(this.status.duration))
        },
        _seeking: function() {
            this.css.jq.seekBar.length && this.css.jq.seekBar.addClass("jp-seeking-bg")
        },
        _seeked: function() {
            this.css.jq.seekBar.length && this.css.jq.seekBar.removeClass("jp-seeking-bg")
        },
        _resetGate: function() {
            this.html.audio.gate = !1;
            this.html.video.gate = !1;
            this.flash.gate = !1
        },
        _resetActive: function() {
            this.html.active = !1;
            this.flash.active = !1
        },
        setMedia: function(a) {
            var c = this,
                d = !1,
                e = this.status.media.poster !== a.poster;
            this._resetMedia();
            this._resetGate();
            this._resetActive();
            b.each(this.formats, function(e, f) {
                var i = c.format[f].media === "video";
                b.each(c.solutions, function(b, e) {
                    if (c[e].support[f] && c._validString(a[f])) {
                        var g = e === "html";
                        i ? (g ? (c.html.video.gate = !0, c._html_setVideo(a), c.html.active = !0) : (c.flash.gate = !0, c._flash_setVideo(a), c.flash.active = !0), c.css.jq.videoPlay.length && c.css.jq.videoPlay.show(), c.status.video = !0) : (g ? (c.html.audio.gate = !0, c._html_setAudio(a), c.html.active = !0) : (c.flash.gate = !0, c._flash_setAudio(a), c.flash.active = !0), c.css.jq.videoPlay.length && c.css.jq.videoPlay.hide(), c.status.video = !1);
                        d = !0;
                        return !1
                    }
                });
                if (d) return !1
            });
            if (d) {
                if ((!this.status.nativeVideoControls || !this.html.video.gate) && this._validString(a.poster)) e ? this.htmlElement.poster.src = a.poster : this.internal.poster.jq.show();
                this.status.srcSet = !0;
                this.status.media = b.extend({}, a);
                this._updateButtons(!1);
                this._updateInterface()
            } else this._error({
                type: b.jPlayer.error.NO_SUPPORT,
                context: "{supplied:'" + this.options.supplied + "'}",
                message: b.jPlayer.errorMsg.NO_SUPPORT,
                hint: b.jPlayer.errorHint.NO_SUPPORT
            })
        },
        _resetMedia: function() {
            this._resetStatus();
            this._updateButtons(!1);
            this._updateInterface();
            this._seeked();
            this.internal.poster.jq.hide();
            clearTimeout(this.internal.htmlDlyCmdId);
            this.html.active ? this._html_resetMedia() : this.flash.active &&
                this._flash_resetMedia()
        },
        clearMedia: function() {
            this._resetMedia();
            this.html.active ? this._html_clearMedia() : this.flash.active && this._flash_clearMedia();
            this._resetGate();
            this._resetActive()
        },
        load: function() {
            this.status.srcSet ? this.html.active ? this._html_load() : this.flash.active && this._flash_load() : this._urlNotSetError("load")
        },
        play: function(a) {
            a = typeof a === "number" ? a : NaN;
            this.status.srcSet ? this.html.active ? this._html_play(a) : this.flash.active && this._flash_play(a) : this._urlNotSetError("play")
        },
        videoPlay: function() {
            this.play()
        },
        pause: function(a) {
            a = typeof a === "number" ? a : NaN;
            this.status.srcSet ? this.html.active ? this._html_pause(a) : this.flash.active && this._flash_pause(a) : this._urlNotSetError("pause")
        },
        pauseOthers: function() {
            var a = this;
            b.each(this.instances, function(b, d) {
                a.element !== d && d.data("jPlayer").status.srcSet && d.jPlayer("pause")
            })
        },
        stop: function() {
            this.status.srcSet ? this.html.active ? this._html_pause(0) : this.flash.active && this._flash_pause(0) : this._urlNotSetError("stop")
        },
        playHead: function(a) {
            a = this._limitValue(a, 0, 100);
            this.status.srcSet ? this.html.active ? this._html_playHead(a) : this.flash.active && this._flash_playHead(a) : this._urlNotSetError("playHead")
        },
        _muted: function(a) {
            this.options.muted = a;
            this.html.used && this._html_mute(a);
            this.flash.used && this._flash_mute(a);
            !this.html.video.gate && !this.html.audio.gate && (this._updateMute(a), this._updateVolume(this.options.volume), this._trigger(b.jPlayer.event.volumechange))
        },
        mute: function(a) {
            a = a === f ? !0 : !!a;
            this._muted(a)
        },
        unmute: function(a) {
            a = a === f ? !0 : !!a;
            this._muted(!a)
        },
        _updateMute: function(a) {
            if (a ===
                f) a = this.options.muted;
            this.css.jq.mute.length && this.css.jq.unmute.length && (this.status.noVolume ? (this.css.jq.mute.hide(), this.css.jq.unmute.hide()) : a ? (this.css.jq.mute.hide(), this.css.jq.unmute.show()) : (this.css.jq.mute.show(), this.css.jq.unmute.hide()))
        },
        volume: function(a) {
            a = this._limitValue(a, 0, 1);
            this.options.volume = a;
            this.html.used && this._html_volume(a);
            this.flash.used && this._flash_volume(a);
            !this.html.video.gate && !this.html.audio.gate && (this._updateVolume(a), this._trigger(b.jPlayer.event.volumechange))
        },
        volumeBar: function(a) {
            if (this.css.jq.volumeBar.length) {
                var b = this.css.jq.volumeBar.offset(),
                    d = a.pageX - b.left,
                    e = this.css.jq.volumeBar.width(),
                    a = this.css.jq.volumeBar.height() - a.pageY + b.top,
                    b = this.css.jq.volumeBar.height();
                this.options.verticalVolume ? this.volume(a / b) : this.volume(d / e)
            }
            this.options.muted && this._muted(!1)
        },
        volumeBarValue: function(a) {
            this.volumeBar(a)
        },
        _updateVolume: function(a) {
            if (a === f) a = this.options.volume;
            a = this.options.muted ? 0 : a;
            this.status.noVolume ? (this.css.jq.volumeBar.length && this.css.jq.volumeBar.hide(),
                this.css.jq.volumeBarValue.length && this.css.jq.volumeBarValue.hide(), this.css.jq.volumeMax.length && this.css.jq.volumeMax.hide()) : (this.css.jq.volumeBar.length && this.css.jq.volumeBar.show(), this.css.jq.volumeBarValue.length && (this.css.jq.volumeBarValue.show(), this.css.jq.volumeBarValue[this.options.verticalVolume ? "height" : "width"](a * 100 + "%")), this.css.jq.volumeMax.length && this.css.jq.volumeMax.show())
        },
        volumeMax: function() {
            this.volume(1);
            this.options.muted && this._muted(!1)
        },
        _cssSelectorAncestor: function(a) {
            var c =
                this;
            this.options.cssSelectorAncestor = a;
            this._removeUiClass();
            this.ancestorJq = a ? b(a) : [];
            a && this.ancestorJq.length !== 1 && this._warning({
                type: b.jPlayer.warning.CSS_SELECTOR_COUNT,
                context: a,
                message: b.jPlayer.warningMsg.CSS_SELECTOR_COUNT + this.ancestorJq.length + " found for cssSelectorAncestor.",
                hint: b.jPlayer.warningHint.CSS_SELECTOR_COUNT
            });
            this._addUiClass();
            b.each(this.options.cssSelector, function(a, b) {
                c._cssSelector(a, b)
            })
        },
        _cssSelector: function(a, c) {
            var d = this;
            typeof c === "string" ? b.jPlayer.prototype.options.cssSelector[a] ?
                (this.css.jq[a] && this.css.jq[a].length && this.css.jq[a].unbind(".jPlayer"), this.options.cssSelector[a] = c, this.css.cs[a] = this.options.cssSelectorAncestor + " " + c, this.css.jq[a] = c ? b(this.css.cs[a]) : [], this.css.jq[a].length && this.css.jq[a].bind("click.jPlayer", function(c) {
                    d[a](c);
                    b(this).blur();
                    return !1
                }), c && this.css.jq[a].length !== 1 && this._warning({
                    type: b.jPlayer.warning.CSS_SELECTOR_COUNT,
                    context: this.css.cs[a],
                    message: b.jPlayer.warningMsg.CSS_SELECTOR_COUNT + this.css.jq[a].length + " found for " + a + " method.",
                    hint: b.jPlayer.warningHint.CSS_SELECTOR_COUNT
                })) : this._warning({
                    type: b.jPlayer.warning.CSS_SELECTOR_METHOD,
                    context: a,
                    message: b.jPlayer.warningMsg.CSS_SELECTOR_METHOD,
                    hint: b.jPlayer.warningHint.CSS_SELECTOR_METHOD
                }) : this._warning({
                    type: b.jPlayer.warning.CSS_SELECTOR_STRING,
                    context: c,
                    message: b.jPlayer.warningMsg.CSS_SELECTOR_STRING,
                    hint: b.jPlayer.warningHint.CSS_SELECTOR_STRING
                })
        },
        seekBar: function(a) {
            if (this.css.jq.seekBar) {
                var b = this.css.jq.seekBar.offset(),
                    a = a.pageX - b.left,
                    b = this.css.jq.seekBar.width();
                this.playHead(100 * a / b)
            }
        },
        playBar: function(a) {
            this.seekBar(a)
        },
        repeat: function() {
            this._loop(!0)
        },
        repeatOff: function() {
            this._loop(!1)
        },
        _loop: function(a) {
            if (this.options.loop !== a) this.options.loop = a, this._updateButtons(), this._trigger(b.jPlayer.event.repeat)
        },
        currentTime: function() {},
        duration: function() {},
        gui: function() {},
        noSolution: function() {},
        option: function(a, c) {
            var d = a;
            if (arguments.length === 0) return b.extend(!0, {}, this.options);
            if (typeof a === "string") {
                var e = a.split(".");
                if (c === f) {
                    for (var d = b.extend(!0, {}, this.options), g = 0; g < e.length; g++)
                        if (d[e[g]] !== f) d = d[e[g]];
                        else return this._warning({
                            type: b.jPlayer.warning.OPTION_KEY,
                            context: a,
                            message: b.jPlayer.warningMsg.OPTION_KEY,
                            hint: b.jPlayer.warningHint.OPTION_KEY
                        }), f;
                    return d
                }
                for (var g = d = {}, h = 0; h < e.length; h++) h < e.length - 1 ? (g[e[h]] = {}, g = g[e[h]]) : g[e[h]] = c
            }
            this._setOptions(d);
            return this
        },
        _setOptions: function(a) {
            var c = this;
            b.each(a, function(a, b) {
                c._setOption(a, b)
            });
            return this
        },
        _setOption: function(a, c) {
            var d = this;
            switch (a) {
                case "volume":
                    this.volume(c);
                    break;
                case "muted":
                    this._muted(c);
                    break;
                case "cssSelectorAncestor":
                    this._cssSelectorAncestor(c);
                    break;
                case "cssSelector":
                    b.each(c, function(a, b) {
                        d._cssSelector(a, b)
                    });
                    break;
                case "fullScreen":
                    this.options[a] !== c && (this._removeUiClass(), this.options[a] = c, this._refreshSize());
                    break;
                case "size":
                    !this.options.fullScreen && this.options[a].cssClass !== c.cssClass && this._removeUiClass();
                    this.options[a] = b.extend({}, this.options[a], c);
                    this._refreshSize();
                    break;
                case "sizeFull":
                    this.options.fullScreen && this.options[a].cssClass !==
                        c.cssClass && this._removeUiClass();
                    this.options[a] = b.extend({}, this.options[a], c);
                    this._refreshSize();
                    break;
                case "autohide":
                    this.options[a] = b.extend({}, this.options[a], c);
                    this._updateAutohide();
                    break;
                case "loop":
                    this._loop(c);
                    break;
                case "nativeVideoControls":
                    this.options[a] = b.extend({}, this.options[a], c);
                    this.status.nativeVideoControls = this._uaBlocklist(this.options.nativeVideoControls);
                    this._restrictNativeVideoControls();
                    this._updateNativeVideoControls();
                    break;
                case "noFullScreen":
                    this.options[a] =
                        b.extend({}, this.options[a], c);
                    this.status.nativeVideoControls = this._uaBlocklist(this.options.nativeVideoControls);
                    this.status.noFullScreen = this._uaBlocklist(this.options.noFullScreen);
                    this._restrictNativeVideoControls();
                    this._updateButtons();
                    break;
                case "noVolume":
                    this.options[a] = b.extend({}, this.options[a], c);
                    this.status.noVolume = this._uaBlocklist(this.options.noVolume);
                    this._updateVolume();
                    this._updateMute();
                    break;
                case "emulateHtml":
                    this.options[a] !== c && ((this.options[a] = c) ? this._emulateHtmlBridge() :
                        this._destroyHtmlBridge())
            }
            return this
        },
        _refreshSize: function() {
            this._setSize();
            this._addUiClass();
            this._updateSize();
            this._updateButtons();
            this._updateAutohide();
            this._trigger(b.jPlayer.event.resize)
        },
        _setSize: function() {
            this.options.fullScreen ? (this.status.width = this.options.sizeFull.width, this.status.height = this.options.sizeFull.height, this.status.cssClass = this.options.sizeFull.cssClass) : (this.status.width = this.options.size.width, this.status.height = this.options.size.height, this.status.cssClass =
                this.options.size.cssClass);
            this.element.css({
                width: this.status.width,
                height: this.status.height
            })
        },
        _addUiClass: function() {
            this.ancestorJq.length && this.ancestorJq.addClass(this.status.cssClass)
        },
        _removeUiClass: function() {
            this.ancestorJq.length && this.ancestorJq.removeClass(this.status.cssClass)
        },
        _updateSize: function() {
            this.internal.poster.jq.css({
                width: this.status.width,
                height: this.status.height
            });
            !this.status.waitForPlay && this.html.active && this.status.video || this.html.video.available && this.html.used &&
                this.status.nativeVideoControls ? this.internal.video.jq.css({
                    width: this.status.width,
                    height: this.status.height
                }) : !this.status.waitForPlay && this.flash.active && this.status.video && this.internal.flash.jq.css({
                    width: this.status.width,
                    height: this.status.height
                })
        },
        _updateAutohide: function() {
            var a = this,
                b = function() {
                    a.css.jq.gui.fadeIn(a.options.autohide.fadeIn, function() {
                        clearTimeout(a.internal.autohideId);
                        a.internal.autohideId = setTimeout(function() {
                            a.css.jq.gui.fadeOut(a.options.autohide.fadeOut)
                        }, a.options.autohide.hold)
                    })
                };
            this.css.jq.gui.length && (this.css.jq.gui.stop(!0, !0), clearTimeout(this.internal.autohideId), this.element.unbind(".jPlayerAutohide"), this.css.jq.gui.unbind(".jPlayerAutohide"), this.status.nativeVideoControls ? this.css.jq.gui.hide() : this.options.fullScreen && this.options.autohide.full || !this.options.fullScreen && this.options.autohide.restored ? (this.element.bind("mousemove.jPlayer.jPlayerAutohide", b), this.css.jq.gui.bind("mousemove.jPlayer.jPlayerAutohide", b), this.css.jq.gui.hide()) : this.css.jq.gui.show())
        },
        fullScreen: function() {
            this._setOption("fullScreen", !0)
        },
        restoreScreen: function() {
            this._setOption("fullScreen", !1)
        },
        _html_initMedia: function() {
            this.htmlElement.media.src = this.status.src;
            this.options.preload !== "none" && this._html_load();
            this._trigger(b.jPlayer.event.timeupdate)
        },
        _html_setAudio: function(a) {
            var c = this;
            b.each(this.formats, function(b, e) {
                if (c.html.support[e] && a[e]) return c.status.src = a[e], c.status.format[e] = !0, c.status.formatType = e, !1
            });
            this.htmlElement.media = this.htmlElement.audio;
            this._html_initMedia()
        },
        _html_setVideo: function(a) {
            var c = this;
            b.each(this.formats, function(b, e) {
                if (c.html.support[e] && a[e]) return c.status.src = a[e], c.status.format[e] = !0, c.status.formatType = e, !1
            });
            if (this.status.nativeVideoControls) this.htmlElement.video.poster = this._validString(a.poster) ? a.poster : "";
            this.htmlElement.media = this.htmlElement.video;
            this._html_initMedia()
        },
        _html_resetMedia: function() {
            this.htmlElement.media && (this.htmlElement.media.id === this.internal.video.id && !this.status.nativeVideoControls && this.internal.video.jq.css({
                width: "0px",
                height: "0px"
            }), this.htmlElement.media.pause())
        },
        _html_clearMedia: function() {
            if (this.htmlElement.media) this.htmlElement.media.src = "", this.htmlElement.media.load()
        },
        _html_load: function() {
            if (this.status.waitForLoad) this.status.waitForLoad = !1, this.htmlElement.media.load();
            clearTimeout(this.internal.htmlDlyCmdId)
        },
        _html_play: function(a) {
            var b = this;
            this._html_load();
            this.htmlElement.media.play();
            if (!isNaN(a)) try {
                this.htmlElement.media.currentTime = a
            } catch (d) {
                this.internal.htmlDlyCmdId = setTimeout(function() {
                        b.play(a)
                    },
                    100);
                return
            }
            this._html_checkWaitForPlay()
        },
        _html_pause: function(a) {
            var b = this;
            a > 0 ? this._html_load() : clearTimeout(this.internal.htmlDlyCmdId);
            this.htmlElement.media.pause();
            if (!isNaN(a)) try {
                this.htmlElement.media.currentTime = a
            } catch (d) {
                this.internal.htmlDlyCmdId = setTimeout(function() {
                    b.pause(a)
                }, 100);
                return
            }
            a > 0 && this._html_checkWaitForPlay()
        },
        _html_playHead: function(a) {
            var b = this;
            this._html_load();
            try {
                if (typeof this.htmlElement.media.seekable === "object" && this.htmlElement.media.seekable.length > 0) this.htmlElement.media.currentTime =
                    a * this.htmlElement.media.seekable.end(this.htmlElement.media.seekable.length - 1) / 100;
                else if (this.htmlElement.media.duration > 0 && !isNaN(this.htmlElement.media.duration)) this.htmlElement.media.currentTime = a * this.htmlElement.media.duration / 100;
                else throw "e";
            } catch (d) {
                this.internal.htmlDlyCmdId = setTimeout(function() {
                    b.playHead(a)
                }, 100);
                return
            }
            this.status.waitForLoad || this._html_checkWaitForPlay()
        },
        _html_checkWaitForPlay: function() {
            if (this.status.waitForPlay) this.status.waitForPlay = !1, this.css.jq.videoPlay.length &&
                this.css.jq.videoPlay.hide(), this.status.video && (this.internal.poster.jq.hide(), this.internal.video.jq.css({
                    width: this.status.width,
                    height: this.status.height
                }))
        },
        _html_volume: function(a) {
            if (this.html.audio.available) this.htmlElement.audio.volume = a;
            if (this.html.video.available) this.htmlElement.video.volume = a
        },
        _html_mute: function(a) {
            if (this.html.audio.available) this.htmlElement.audio.muted = a;
            if (this.html.video.available) this.htmlElement.video.muted = a
        },
        _flash_setAudio: function(a) {
            var c = this;
            try {
                if (b.each(this.formats,
                        function(b, d) {
                            if (c.flash.support[d] && a[d]) {
                                switch (d) {
                                    case "m4a":
                                    case "fla":
                                        c._getMovie().fl_setAudio_m4a(a[d]);
                                        break;
                                    case "mp3":
                                        c._getMovie().fl_setAudio_mp3(a[d])
                                }
                                c.status.src = a[d];
                                c.status.format[d] = !0;
                                c.status.formatType = d;
                                return !1
                            }
                        }), this.options.preload === "auto") this._flash_load(), this.status.waitForLoad = !1
            } catch (d) {
                this._flashError(d)
            }
        },
        _flash_setVideo: function(a) {
            var c = this;
            try {
                if (b.each(this.formats, function(b, d) {
                        if (c.flash.support[d] && a[d]) {
                            switch (d) {
                                case "m4v":
                                case "flv":
                                    c._getMovie().fl_setVideo_m4v(a[d])
                            }
                            c.status.src =
                                a[d];
                            c.status.format[d] = !0;
                            c.status.formatType = d;
                            return !1
                        }
                    }), this.options.preload === "auto") this._flash_load(), this.status.waitForLoad = !1
            } catch (d) {
                this._flashError(d)
            }
        },
        _flash_resetMedia: function() {
            this.internal.flash.jq.css({
                width: "0px",
                height: "0px"
            });
            this._flash_pause(NaN)
        },
        _flash_clearMedia: function() {
            try {
                this._getMovie().fl_clearMedia()
            } catch (a) {
                this._flashError(a)
            }
        },
        _flash_load: function() {
            try {
                this._getMovie().fl_load()
            } catch (a) {
                this._flashError(a)
            }
            this.status.waitForLoad = !1
        },
        _flash_play: function(a) {
            try {
                this._getMovie().fl_play(a)
            } catch (b) {
                this._flashError(b)
            }
            this.status.waitForLoad = !1;
            this._flash_checkWaitForPlay()
        },
        _flash_pause: function(a) {
            try {
                this._getMovie().fl_pause(a)
            } catch (b) {
                this._flashError(b)
            }
            if (a > 0) this.status.waitForLoad = !1, this._flash_checkWaitForPlay()
        },
        _flash_playHead: function(a) {
            try {
                this._getMovie().fl_play_head(a)
            } catch (b) {
                this._flashError(b)
            }
            this.status.waitForLoad || this._flash_checkWaitForPlay()
        },
        _flash_checkWaitForPlay: function() {
            if (this.status.waitForPlay) this.status.waitForPlay = !1, this.css.jq.videoPlay.length && this.css.jq.videoPlay.hide(), this.status.video &&
                (this.internal.poster.jq.hide(), this.internal.flash.jq.css({
                    width: this.status.width,
                    height: this.status.height
                }))
        },
        _flash_volume: function(a) {
            try {
                this._getMovie().fl_volume(a)
            } catch (b) {
                this._flashError(b)
            }
        },
        _flash_mute: function(a) {
            try {
                this._getMovie().fl_mute(a)
            } catch (b) {
                this._flashError(b)
            }
        },
        _getMovie: function() {
            return document[this.internal.flash.id]
        },
        _checkForFlash: function(a) {
            var b = !1,
                d;
            if (window.ActiveXObject) try {
                new ActiveXObject("ShockwaveFlash.ShockwaveFlash." + a), b = !0
            } catch (e) {} else navigator.plugins &&
                navigator.mimeTypes.length > 0 && (d = navigator.plugins["Shockwave Flash"]) && navigator.plugins["Shockwave Flash"].description.replace(/.*\s(\d+\.\d+).*/, "$1") >= a && (b = !0);
            return b
        },
        _validString: function(a) {
            return a && typeof a === "string"
        },
        _limitValue: function(a, b, d) {
            return a < b ? b : a > d ? d : a
        },
        _urlNotSetError: function(a) {
            this._error({
                type: b.jPlayer.error.URL_NOT_SET,
                context: a,
                message: b.jPlayer.errorMsg.URL_NOT_SET,
                hint: b.jPlayer.errorHint.URL_NOT_SET
            })
        },
        _flashError: function(a) {
            var c;
            c = this.internal.ready ? "FLASH_DISABLED" :
                "FLASH";
            this._error({
                type: b.jPlayer.error[c],
                context: this.internal.flash.swf,
                message: b.jPlayer.errorMsg[c] + a.message,
                hint: b.jPlayer.errorHint[c]
            });
            this.internal.flash.jq.css({
                width: "1px",
                height: "1px"
            })
        },
        _error: function(a) {
            this._trigger(b.jPlayer.event.error, a);
            this.options.errorAlerts && this._alert("Error!" + (a.message ? "\n\n" + a.message : "") + (a.hint ? "\n\n" + a.hint : "") + "\n\nContext: " + a.context)
        },
        _warning: function(a) {
            this._trigger(b.jPlayer.event.warning, f, a);
            this.options.warningAlerts && this._alert("Warning!" +
                (a.message ? "\n\n" + a.message : "") + (a.hint ? "\n\n" + a.hint : "") + "\n\nContext: " + a.context)
        },
        _alert: function(a) {
            alert("jPlayer " + this.version.script + " : id='" + this.internal.self.id + "' : " + a)
        },
        _emulateHtmlBridge: function() {
            var a = this;
            b.each(b.jPlayer.emulateMethods.split(/\s+/g), function(b, d) {
                a.internal.domNode[d] = function(b) {
                    a[d](b)
                }
            });
            b.each(b.jPlayer.event, function(c, d) {
                var e = !0;
                b.each(b.jPlayer.reservedEvent.split(/\s+/g), function(a, b) {
                    if (b === c) return e = !1
                });
                e && a.element.bind(d + ".jPlayer.jPlayerHtml",
                    function() {
                        a._emulateHtmlUpdate();
                        var b = document.createEvent("Event");
                        b.initEvent(c, !1, !0);
                        a.internal.domNode.dispatchEvent(b)
                    })
            })
        },
        _emulateHtmlUpdate: function() {
            var a = this;
            b.each(b.jPlayer.emulateStatus.split(/\s+/g), function(b, d) {
                a.internal.domNode[d] = a.status[d]
            });
            b.each(b.jPlayer.emulateOptions.split(/\s+/g), function(b, d) {
                a.internal.domNode[d] = a.options[d]
            })
        },
        _destroyHtmlBridge: function() {
            var a = this;
            this.element.unbind(".jPlayerHtml");
            b.each((b.jPlayer.emulateMethods + " " + b.jPlayer.emulateStatus +
                " " + b.jPlayer.emulateOptions).split(/\s+/g), function(b, d) {
                delete a.internal.domNode[d]
            })
        }
    };
    b.jPlayer.error = {
        FLASH: "e_flash",
        FLASH_DISABLED: "e_flash_disabled",
        NO_SOLUTION: "e_no_solution",
        NO_SUPPORT: "e_no_support",
        URL: "e_url",
        URL_NOT_SET: "e_url_not_set",
        VERSION: "e_version"
    };
    b.jPlayer.errorMsg = {
        FLASH: "jPlayer's Flash fallback is not configured correctly, or a command was issued before the jPlayer Ready event. Details: ",
        FLASH_DISABLED: "jPlayer's Flash fallback has been disabled by the browser due to the CSS rules you have used. Details: ",
        NO_SOLUTION: "No solution can be found by jPlayer in this browser. Neither HTML nor Flash can be used.",
        NO_SUPPORT: "It is not possible to play any media format provided in setMedia() on this browser using your current options.",
        URL: "Media URL could not be loaded.",
        URL_NOT_SET: "Attempt to issue media playback commands, while no media url is set.",
        VERSION: "jPlayer " + b.jPlayer.prototype.version.script + " needs Jplayer.swf version " + b.jPlayer.prototype.version.needFlash + " but found "
    };
    b.jPlayer.errorHint = {
        FLASH: "Check your swfPath option and that Jplayer.swf is there.",
        FLASH_DISABLED: "Check that you have not display:none; the jPlayer entity or any ancestor.",
        NO_SOLUTION: "Review the jPlayer options: support and supplied.",
        NO_SUPPORT: "Video or audio formats defined in the supplied option are missing.",
        URL: "Check media URL is valid.",
        URL_NOT_SET: "Use setMedia() to set the media URL.",
        VERSION: "Update jPlayer files."
    };
    b.jPlayer.warning = {
        CSS_SELECTOR_COUNT: "e_css_selector_count",
        CSS_SELECTOR_METHOD: "e_css_selector_method",
        CSS_SELECTOR_STRING: "e_css_selector_string",
        OPTION_KEY: "e_option_key"
    };
    b.jPlayer.warningMsg = {
        CSS_SELECTOR_COUNT: "The number of css selectors found did not equal one: ",
        CSS_SELECTOR_METHOD: "The methodName given in jPlayer('cssSelector') is not a valid jPlayer method.",
        CSS_SELECTOR_STRING: "The methodCssSelector given in jPlayer('cssSelector') is not a String or is empty.",
        OPTION_KEY: "The option requested in jPlayer('option') is undefined."
    };
    b.jPlayer.warningHint = {
        CSS_SELECTOR_COUNT: "Check your css selector and the ancestor.",
        CSS_SELECTOR_METHOD: "Check your method name.",
        CSS_SELECTOR_STRING: "Check your css selector is a string.",
        OPTION_KEY: "Check your option name."
    }
})(jQuery);

+
function($) {
    "use strict";

    // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
    // ============================================================

    function transitionEnd() {
        var el = document.createElement('bootstrap')

        var transEndEventNames = {
            'WebkitTransition': 'webkitTransitionEnd',
            'MozTransition': 'transitionend',
            'OTransition': 'oTransitionEnd otransitionend',
            'transition': 'transitionend'
        }

        for (var name in transEndEventNames) {
            if (el.style[name] !== undefined) {
                return {
                    end: transEndEventNames[name]
                }
            }
        }
    }

    // http://blog.alexmaccaw.com/css-transitions
    $.fn.emulateTransitionEnd = function(duration) {
        var called = false,
            $el = this
        $(this).one($.support.transition.end, function() {
            called = true
        })
        var callback = function() {
            if (!called) $($el).trigger($.support.transition.end)
        }
        setTimeout(callback, duration)
        return this
    }

    $(function() {
        $.support.transition = transitionEnd()
    })

}(window.jQuery);; + function($) {
    "use strict";
    var Carousel = function(element, options) {
        this.$element = $(element)
        this.$indicators = this.$element.find('.carousel-indicators')
        this.options = options
        this.paused = this.sliding = this.interval = this.$active = this.$items = null
        this.options.pause == 'hover' && this.$element.on('mouseenter', $.proxy(this.pause, this)).on('mouseleave', $.proxy(this.cycle, this))
    }
    Carousel.DEFAULTS = {
        interval: 5000,
        pause: 'hover',
        wrap: true
    }
    Carousel.prototype.cycle = function(e) {
        e || (this.paused = false)
        this.interval && clearInterval(this.interval)
        this.options.interval && !this.paused && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))
        return this
    }
    Carousel.prototype.getActiveIndex = function() {
        this.$active = this.$element.find('.item.active')
        this.$items = this.$active.parent().children()
        return this.$items.index(this.$active)
    }
    Carousel.prototype.to = function(pos) {
        var that = this
        var activeIndex = this.getActiveIndex()
        if (pos > (this.$items.length - 1) || pos < 0) return
        if (this.sliding) return this.$element.one('slid', function() {
            that.to(pos)
        })
        if (activeIndex == pos) return this.pause().cycle()
        return this.slide(pos > activeIndex ? 'next' : 'prev', $(this.$items[pos]))
    }
    Carousel.prototype.pause = function(e) {
        e || (this.paused = true)
        this.cycle(true)
        this.interval = clearInterval(this.interval)
        return this
    }
    Carousel.prototype.next = function() {
        if (this.sliding) return
        return this.slide('next')
    }
    Carousel.prototype.prev = function() {
        if (this.sliding) return
        return this.slide('prev')
    }
    Carousel.prototype.slide = function(type, next) {
        var $active = this.$element.find('.item.active')
        var $next = next || $active[type]()
        var isCycling = this.interval
        var direction = type == 'next' ? 'left' : 'right'
        var fallback = type == 'next' ? 'first' : 'last'
        var that = this
        if (!$next.length) {
            if (!this.options.wrap) return
            $next = this.$element.find('.item')[fallback]()
        }
        this.sliding = true
        isCycling && this.pause()
        var e = $.Event('slide.bs.carousel', {
            relatedTarget: $next[0],
            direction: direction
        })
        if ($next.hasClass('active')) return
        if (this.$indicators.length) {
            this.$indicators.find('.active').removeClass('active')
            this.$element.one('slid', function() {
                var $nextIndicator = $(that.$indicators.children()[that.getActiveIndex()])
                $nextIndicator && $nextIndicator.addClass('active')
            })
        }
        var $this = this.$element.hasClass('header_effect');
        if ($.support.transition && this.$element.hasClass('slide')) {
            this.$element.trigger(e)
            if (e.isDefaultPrevented()) return
            var timer;
            timer = setTimeout(function() {
                checkSliderForHeaderStyle($next, $this);
                $next.addClass(type)
                $next[0].offsetWidth
                $active.addClass(direction)
                $next.addClass(direction)
                $active.one($.support.transition.end, function() {
                    $next.removeClass([type, direction].join(' ')).removeClass('inactive').addClass('active')
                    $active.removeClass(['active', direction].join(' ')).addClass('inactive')
                    that.sliding = false
                    setTimeout(function() {
                        that.$element.trigger('slid')
                    }, 0)
                }).emulateTransitionEnd(600)
                clearTimeout(timer);
            }, 1000);
        } else {
            this.$element.trigger(e)
            if (e.isDefaultPrevented()) return
            $active.removeClass('active')
            $next.addClass('active')
            this.sliding = false
            this.$element.trigger('slid')
        }
        isCycling && this.cycle()
        return this
    }
    var old = $.fn.carousel
    $.fn.carousel = function(option) {
        return this.each(function() {
            var $this = $(this)
            var data = $this.data('bs.carousel')
            var options = $.extend({}, Carousel.DEFAULTS, $this.data(), typeof option == 'object' && option)
            var action = typeof option == 'string' ? option : options.slide
            if (!data) $this.data('bs.carousel', (data = new Carousel(this, options)))
            if (typeof option == 'number') data.to(option)
            else if (action) data[action]()
            else if (options.interval) data.pause().cycle()
        })
    }
    $.fn.carousel.Constructor = Carousel
    $.fn.carousel.noConflict = function() {
        $.fn.carousel = old
        return this
    }
    $(document).on('click.bs.carousel.data-api', '[data-slide], [data-slide-to]', function(e) {
        var $this = $(this),
            href
        var $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, ''))
        var options = $.extend({}, $target.data(), $this.data())
        var slideIndex = $this.attr('data-slide-to')
        if (slideIndex) options.interval = false
        $target.carousel(options)
        if (slideIndex = $this.attr('data-slide-to')) {
            $target.data('bs.carousel').to(slideIndex)
        }
        e.preventDefault()
    })
    $(window).on('load', function() {
        $('[data-ride="carousel"]').each(function() {
            var $carousel = $(this)
            $carousel.carousel($carousel.data())
        })
    })
}(window.jQuery);;
/*!
 * skrollr core
 *
 * Alexander Prinzhorn - https://github.com/Prinzhorn/skrollr
 *
 * Free to use under terms of MIT license
 */
(function(window, document, undefined) {
    'use strict';
    var skrollr = window.skrollr = {
        get: function() {
            return _instance
        },
        init: function(options) {
            return _instance || new Skrollr(options)
        },
        VERSION: '0.6.10'
    };
    var hasProp = Object.prototype.hasOwnProperty;
    var Math = window.Math;
    var getStyle = window.getComputedStyle;
    var documentElement;
    var body;
    var EVENT_TOUCHSTART = 'touchstart';
    var EVENT_TOUCHMOVE = 'touchmove';
    var EVENT_TOUCHCANCEL = 'touchcancel';
    var EVENT_TOUCHEND = 'touchend';
    var SKROLLABLE_CLASS = 'skrollable';
    var SKROLLABLE_BEFORE_CLASS = SKROLLABLE_CLASS + '-before';
    var SKROLLABLE_BETWEEN_CLASS = SKROLLABLE_CLASS + '-between';
    var SKROLLABLE_AFTER_CLASS = SKROLLABLE_CLASS + '-after';
    var SKROLLR_CLASS = 'skrollr';
    var NO_SKROLLR_CLASS = 'no-' + SKROLLR_CLASS;
    var SKROLLR_DESKTOP_CLASS = SKROLLR_CLASS + '-desktop';
    var SKROLLR_MOBILE_CLASS = SKROLLR_CLASS + '-mobile';
    var DEFAULT_EASING = 'linear';
    var DEFAULT_DURATION = 1000;
    var MOBILE_DECELERATION = 0.0006;
    var DEFAULT_SMOOTH_SCROLLING_DURATION = 200;
    var ANCHOR_START = 'start';
    var ANCHOR_END = 'end';
    var ANCHOR_CENTER = 'center';
    var ANCHOR_BOTTOM = 'bottom';
    var SKROLLABLE_ID_DOM_PROPERTY = '___skrollable_id';
    var rxTrim = /^\s+|\s+$/g;
    var rxKeyframeAttribute = /^data(?:-(_\w+))?(?:-?(-?\d+))?(?:-?(start|end|top|center|bottom))?(?:-?(top|center|bottom))?$/;
    var rxPropValue = /\s*([\w\-\[\]]+)\s*:\s*(.+?)\s*(?:;|$)/gi;
    var rxPropEasing = /^([a-z\-]+)\[(\w+)\]$/;
    var rxCamelCase = /-([a-z])/g;
    var rxCamelCaseFn = function(str, letter) {
        return letter.toUpperCase()
    };
    var rxNumericValue = /[\-+]?[\d]*\.?[\d]+/g;
    var rxInterpolateString = /\{\?\}/g;
    var rxRGBAIntegerColor = /rgba?\(\s*-?\d+\s*,\s*-?\d+\s*,\s*-?\d+/g;
    var rxGradient = /[a-z\-]+-gradient/g;
    var theCSSPrefix = '';
    var theDashedCSSPrefix = '';
    var detectCSSPrefix = function() {
        var rxPrefixes = /^(?:O|Moz|webkit|ms)|(?:-(?:o|moz|webkit|ms)-)/;
        if (!getStyle) {
            return
        }
        var style = getStyle(body, null);
        for (var k in style) {
            theCSSPrefix = (k.match(rxPrefixes) || (+k == k && style[k].match(rxPrefixes)));
            if (theCSSPrefix) {
                break
            }
        }
        if (!theCSSPrefix) {
            theCSSPrefix = theDashedCSSPrefix = '';
            return
        }
        theCSSPrefix = theCSSPrefix[0];
        if (theCSSPrefix.slice(0, 1) === '-') {
            theDashedCSSPrefix = theCSSPrefix;
            theCSSPrefix = ({
                '-webkit-': 'webkit',
                '-moz-': 'Moz',
                '-ms-': 'ms',
                '-o-': 'O'
            })[theCSSPrefix]
        } else {
            theDashedCSSPrefix = '-' + theCSSPrefix.toLowerCase() + '-'
        }
    };
    var polyfillRAF = function() {
        var requestAnimFrame = window.requestAnimationFrame || window[theCSSPrefix.toLowerCase() + 'RequestAnimationFrame'];
        var lastTime = _now();
        if (_isMobile || !requestAnimFrame) {
            requestAnimFrame = function(callback) {
                var deltaTime = _now() - lastTime;
                var delay = Math.max(0, 1000 / 60 - deltaTime);
                window.setTimeout(function() {
                    lastTime = _now();
                    callback()
                }, delay)
            }
        }
        return requestAnimFrame
    };
    var easings = {
        begin: function() {
            return 0
        },
        end: function() {
            return 1
        },
        linear: function(p) {
            return p
        },
        quadratic: function(p) {
            return p * p
        },
        cubic: function(p) {
            return p * p * p
        },
        swing: function(p) {
            return (-Math.cos(p * Math.PI) / 2) + 0.5
        },
        sqrt: function(p) {
            return Math.sqrt(p)
        },
        outCubic: function(p) {
            return (Math.pow((p - 1), 3) + 1)
        },
        bounce: function(p) {
            var a;
            if (p <= 0.5083) {
                a = 3
            } else if (p <= 0.8489) {
                a = 9
            } else if (p <= 0.96208) {
                a = 27
            } else if (p <= 0.99981) {
                a = 91
            } else {
                return 1
            }
            return 1 - Math.abs(3 * Math.cos(p * a * 1.028) / a)
        }
    };

    function Skrollr(options) {
        documentElement = document.documentElement;
        body = document.body;
        detectCSSPrefix();
        _instance = this;
        options = options || {};
        _constants = options.constants || {};
        if (options.easing) {
            for (var e in options.easing) {
                easings[e] = options.easing[e]
            }
        }
        _edgeStrategy = options.edgeStrategy || 'set';
        _listeners = {
            beforerender: options.beforerender,
            render: options.render
        };
        _forceHeight = options.forceHeight !== false;
        if (_forceHeight) {
            _scale = options.scale || 1
        }
        _smoothScrollingEnabled = options.smoothScrolling !== false;
        _smoothScrollingDuration = options.smoothScrollingDuration || DEFAULT_SMOOTH_SCROLLING_DURATION;
        _smoothScrolling = {
            targetTop: _instance.getScrollTop()
        };
        _isMobile = ((options.mobileCheck || function() {
            return (/Android|iPhone|iPad|iPod|BlackBerry|Windows Phone/i).test(navigator.userAgent || navigator.vendor || window.opera)
        })());
        if (_isMobile) {
            _skrollrBody = document.getElementById('skrollr-body');
            if (_skrollrBody) {
                _detect3DTransforms()
            }
            _initMobile();
            _updateClass(documentElement, [SKROLLR_CLASS, SKROLLR_MOBILE_CLASS], [NO_SKROLLR_CLASS])
        } else {
            _updateClass(documentElement, [SKROLLR_CLASS, SKROLLR_DESKTOP_CLASS], [NO_SKROLLR_CLASS])
        }
        _instance.refresh();
        _addEvent(window, 'resize orientationchange', function() {
            var width = documentElement.clientWidth;
            var height = documentElement.clientHeight;
            if (height !== _lastViewportHeight || width !== _lastViewportWidth) {
                _lastViewportHeight = height;
                _lastViewportWidth = width;
                _requestReflow = true
            }
        });
        var requestAnimFrame = polyfillRAF();
        (function animloop() {
            _render();
            requestAnimFrame(animloop)
        }());
        return _instance
    }
    Skrollr.prototype.refresh = function(elements) {
        var elementIndex;
        var elementsLength;
        var ignoreID = false;
        if (elements === undefined) {
            ignoreID = true;
            _skrollables = [];
            _skrollableIdCounter = 0;
            elements = document.getElementsByTagName('*')
        } else {
            elements = [].concat(elements)
        }
        elementIndex = 0;
        elementsLength = elements.length;
        for (; elementIndex < elementsLength; elementIndex++) {
            var el = elements[elementIndex];
            var anchorTarget = el;
            var keyFrames = [];
            var smoothScrollThis = _smoothScrollingEnabled;
            var edgeStrategy = _edgeStrategy;
            if (!el.attributes) {
                continue
            }
            var attributeIndex = 0;
            var attributesLength = el.attributes.length;
            for (; attributeIndex < attributesLength; attributeIndex++) {
                var attr = el.attributes[attributeIndex];
                if (attr.name === 'data-anchor-target') {
                    anchorTarget = document.querySelector(attr.value);
                    if (anchorTarget === null) {
                        throw 'Unable to find anchor target "' + attr.value + '"';
                    }
                    continue
                }
                if (attr.name === 'data-smooth-scrolling') {
                    smoothScrollThis = attr.value !== 'off';
                    continue
                }
                if (attr.name === 'data-edge-strategy') {
                    edgeStrategy = attr.value;
                    continue
                }
                var match = attr.name.match(rxKeyframeAttribute);
                if (match === null) {
                    continue
                }
                var constant = match[1];
                constant = constant && _constants[constant.substr(1)] || 0;
                var offset = (match[2] | 0) + constant;
                var anchor1 = match[3];
                var anchor2 = match[4] || anchor1;
                var kf = {
                    offset: offset,
                    props: attr.value,
                    element: el
                };
                keyFrames.push(kf);
                if (!anchor1 || anchor1 === ANCHOR_START || anchor1 === ANCHOR_END) {
                    kf.mode = 'absolute';
                    if (anchor1 === ANCHOR_END) {
                        kf.isEnd = true
                    } else {
                        kf.frame = offset * _scale;
                        delete kf.offset
                    }
                } else {
                    kf.mode = 'relative';
                    kf.anchors = [anchor1, anchor2]
                }
            }
            if (!keyFrames.length) {
                continue
            }
            var styleAttr, classAttr;
            var id;
            if (!ignoreID && SKROLLABLE_ID_DOM_PROPERTY in el) {
                id = el[SKROLLABLE_ID_DOM_PROPERTY];
                styleAttr = _skrollables[id].styleAttr;
                classAttr = _skrollables[id].classAttr
            } else {
                id = (el[SKROLLABLE_ID_DOM_PROPERTY] = _skrollableIdCounter++);
                styleAttr = el.style.cssText;
                classAttr = _getClass(el)
            }
            _skrollables[id] = {
                element: el,
                styleAttr: styleAttr,
                classAttr: classAttr,
                anchorTarget: anchorTarget,
                keyFrames: keyFrames,
                smoothScrolling: smoothScrollThis,
                edgeStrategy: edgeStrategy
            };
            _updateClass(el, [SKROLLABLE_CLASS], [])
        }
        _reflow();
        elementIndex = 0;
        elementsLength = elements.length;
        for (; elementIndex < elementsLength; elementIndex++) {
            var sk = _skrollables[elements[elementIndex][SKROLLABLE_ID_DOM_PROPERTY]];
            if (sk === undefined) {
                continue
            }
            _parseProps(sk);
            _fillProps(sk)
        }
        return _instance
    };
    Skrollr.prototype.relativeToAbsolute = function(element, viewportAnchor, elementAnchor) {
        var viewportHeight = documentElement.clientHeight;
        var box = element.getBoundingClientRect();
        var absolute = box.top;
        var boxHeight = box.bottom - box.top;
        if (viewportAnchor === ANCHOR_BOTTOM) {
            absolute -= viewportHeight
        } else if (viewportAnchor === ANCHOR_CENTER) {
            absolute -= viewportHeight / 2
        }
        if (elementAnchor === ANCHOR_BOTTOM) {
            absolute += boxHeight
        } else if (elementAnchor === ANCHOR_CENTER) {
            absolute += boxHeight / 2
        }
        absolute += _instance.getScrollTop();
        return (absolute + 0.5) | 0
    };
    Skrollr.prototype.animateTo = function(top, options) {
        options = options || {};
        var now = _now();
        var scrollTop = _instance.getScrollTop();
        _scrollAnimation = {
            startTop: scrollTop,
            topDiff: top - scrollTop,
            targetTop: top,
            duration: options.duration || DEFAULT_DURATION,
            startTime: now,
            endTime: now + (options.duration || DEFAULT_DURATION),
            easing: easings[options.easing || DEFAULT_EASING],
            done: options.done
        };
        if (!_scrollAnimation.topDiff) {
            if (_scrollAnimation.done) {
                _scrollAnimation.done.call(_instance, false)
            }
            _scrollAnimation = undefined
        }
        return _instance
    };
    Skrollr.prototype.stopAnimateTo = function() {
        if (_scrollAnimation && _scrollAnimation.done) {
            _scrollAnimation.done.call(_instance, true)
        }
        _scrollAnimation = undefined
    };
    Skrollr.prototype.isAnimatingTo = function() {
        return !!_scrollAnimation
    };
    Skrollr.prototype.setScrollTop = function(top, force) {
        if (force === true) {
            _lastTop = top;
            _forceRender = true
        }
        if (_isMobile) {
            _mobileOffset = Math.min(Math.max(top, 0), _maxKeyFrame)
        } else {
            window.scrollTo(0, top)
        }
        return _instance
    };
    Skrollr.prototype.getScrollTop = function() {
        if (_isMobile) {
            return _mobileOffset
        } else {
            return window.pageYOffset || documentElement.scrollTop || body.scrollTop || 0
        }
    };
    Skrollr.prototype.on = function(name, fn) {
        _listeners[name] = fn;
        return _instance
    };
    Skrollr.prototype.off = function(name) {
        delete _listeners[name];
        return _instance
    };
    var _initMobile = function() {
        var initialElement;
        var initialTouchY;
        var initialTouchX;
        var currentTouchY;
        var currentTouchX;
        var lastTouchY;
        var deltaY;
        var initialTouchTime;
        var currentTouchTime;
        var lastTouchTime;
        var deltaTime;
        _addEvent(documentElement, [EVENT_TOUCHSTART, EVENT_TOUCHMOVE, EVENT_TOUCHCANCEL, EVENT_TOUCHEND].join(' '), function(e) {
            e.preventDefault();
            var touch = e.changedTouches[0];
            currentTouchY = touch.clientY;
            currentTouchX = touch.clientX;
            currentTouchTime = e.timeStamp;
            switch (e.type) {
                case EVENT_TOUCHSTART:
                    if (initialElement) {
                        initialElement.blur()
                    }
                    _instance.stopAnimateTo();
                    initialElement = e.target;
                    initialTouchY = lastTouchY = currentTouchY;
                    initialTouchX = currentTouchX;
                    initialTouchTime = currentTouchTime;
                    break;
                case EVENT_TOUCHMOVE:
                    deltaY = currentTouchY - lastTouchY;
                    deltaTime = currentTouchTime - lastTouchTime;
                    _instance.setScrollTop(_mobileOffset - deltaY, true);
                    lastTouchY = currentTouchY;
                    lastTouchTime = currentTouchTime;
                    break;
                default:
                case EVENT_TOUCHCANCEL:
                case EVENT_TOUCHEND:
                    var distanceY = initialTouchY - currentTouchY;
                    var distanceX = initialTouchX - currentTouchX;
                    var distance2 = distanceX * distanceX + distanceY * distanceY;
                    if (distance2 < 49) {
                        initialElement.focus();
                        initialElement.click();
                        return
                    }
                    initialElement = undefined;
                    var speed = deltaY / deltaTime;
                    speed = Math.max(Math.min(speed, 3), -3);
                    var duration = Math.abs(speed / MOBILE_DECELERATION);
                    var targetOffset = speed * duration + 0.5 * MOBILE_DECELERATION * duration * duration;
                    var targetTop = _instance.getScrollTop() - targetOffset;
                    var targetRatio = 0;
                    if (targetTop > _maxKeyFrame) {
                        targetRatio = (_maxKeyFrame - targetTop) / targetOffset;
                        targetTop = _maxKeyFrame
                    } else if (targetTop < 0) {
                        targetRatio = -targetTop / targetOffset;
                        targetTop = 0
                    }
                    duration = duration * (1 - targetRatio);
                    _instance.animateTo(targetTop, {
                        easing: 'outCubic',
                        duration: duration
                    });
                    break
            }
        });
        window.scrollTo(0, 0);
        documentElement.style.overflow = body.style.overflow = 'hidden'
    };
    var _updateDependentKeyFrames = function() {
        var skrollable;
        var element;
        var anchorTarget;
        var keyFrames;
        var keyFrameIndex;
        var keyFramesLength;
        var kf;
        var skrollableIndex;
        var skrollablesLength;
        skrollableIndex = 0;
        skrollablesLength = _skrollables.length;
        for (; skrollableIndex < skrollablesLength; skrollableIndex++) {
            skrollable = _skrollables[skrollableIndex];
            element = skrollable.element;
            anchorTarget = skrollable.anchorTarget;
            keyFrames = skrollable.keyFrames;
            keyFrameIndex = 0;
            keyFramesLength = keyFrames.length;
            for (; keyFrameIndex < keyFramesLength; keyFrameIndex++) {
                kf = keyFrames[keyFrameIndex];
                if (kf.mode === 'relative') {
                    _reset(element);
                    kf.frame = _instance.relativeToAbsolute(anchorTarget, kf.anchors[0], kf.anchors[1]) - kf.offset;
                    _reset(element, true)
                }
                if (_forceHeight) {
                    if (!kf.isEnd && kf.frame > _maxKeyFrame) {
                        _maxKeyFrame = kf.frame
                    }
                }
            }
        }
        _maxKeyFrame = Math.max(_maxKeyFrame, _getDocumentHeight());
        skrollableIndex = 0;
        skrollablesLength = _skrollables.length;
        for (; skrollableIndex < skrollablesLength; skrollableIndex++) {
            skrollable = _skrollables[skrollableIndex];
            keyFrames = skrollable.keyFrames;
            keyFrameIndex = 0;
            keyFramesLength = keyFrames.length;
            for (; keyFrameIndex < keyFramesLength; keyFrameIndex++) {
                kf = keyFrames[keyFrameIndex];
                if (kf.isEnd) {
                    kf.frame = _maxKeyFrame - kf.offset
                }
            }
            skrollable.keyFrames.sort(_keyFrameComparator)
        }
    };
    var _calcSteps = function(fakeFrame, actualFrame) {
        var skrollableIndex = 0;
        var skrollablesLength = _skrollables.length;
        for (; skrollableIndex < skrollablesLength; skrollableIndex++) {
            var skrollable = _skrollables[skrollableIndex];
            var element = skrollable.element;
            var frame = skrollable.smoothScrolling ? fakeFrame : actualFrame;
            var frames = skrollable.keyFrames;
            var firstFrame = frames[0].frame;
            var lastFrame = frames[frames.length - 1].frame;
            var beforeFirst = frame < firstFrame;
            var afterLast = frame > lastFrame;
            var firstOrLastFrame = frames[beforeFirst ? 0 : frames.length - 1];
            var key;
            var value;
            if (beforeFirst || afterLast) {
                if (beforeFirst && skrollable.edge === -1 || afterLast && skrollable.edge === 1) {
                    continue
                }
                _updateClass(element, [beforeFirst ? SKROLLABLE_BEFORE_CLASS : SKROLLABLE_AFTER_CLASS], [SKROLLABLE_BEFORE_CLASS, SKROLLABLE_BETWEEN_CLASS, SKROLLABLE_AFTER_CLASS]);
                skrollable.edge = beforeFirst ? -1 : 1;
                switch (skrollable.edgeStrategy) {
                    case 'reset':
                        _reset(element);
                        continue;
                    case 'ease':
                        frame = firstOrLastFrame.frame;
                        break;
                    default:
                    case 'set':
                        var props = firstOrLastFrame.props;
                        for (key in props) {
                            if (hasProp.call(props, key)) {
                                value = _interpolateString(props[key].value);
                                skrollr.setStyle(element, key, value)
                            }
                        }
                        continue
                }
            } else {
                if (skrollable.edge !== 0) {
                    _updateClass(element, [SKROLLABLE_CLASS, SKROLLABLE_BETWEEN_CLASS], [SKROLLABLE_BEFORE_CLASS, SKROLLABLE_AFTER_CLASS]);
                    skrollable.edge = 0
                }
            }
            var keyFrameIndex = 0;
            var framesLength = frames.length - 1;
            for (; keyFrameIndex < framesLength; keyFrameIndex++) {
                if (frame >= frames[keyFrameIndex].frame && frame <= frames[keyFrameIndex + 1].frame) {
                    var left = frames[keyFrameIndex];
                    var right = frames[keyFrameIndex + 1];
                    for (key in left.props) {
                        if (hasProp.call(left.props, key)) {
                            var progress = (frame - left.frame) / (right.frame - left.frame);
                            progress = left.props[key].easing(progress);
                            value = _calcInterpolation(left.props[key].value, right.props[key].value, progress);
                            value = _interpolateString(value);
                            skrollr.setStyle(element, key, value)
                        }
                    }
                    break
                }
            }
        }
    };
    var _render = function() {
        if (_requestReflow) {
            _requestReflow = false;
            _reflow()
        }
        var renderTop = _instance.getScrollTop();
        var afterAnimationCallback;
        var now = _now();
        var progress;
        if (_scrollAnimation) {
            if (now >= _scrollAnimation.endTime) {
                renderTop = _scrollAnimation.targetTop;
                afterAnimationCallback = _scrollAnimation.done;
                _scrollAnimation = undefined
            } else {
                progress = _scrollAnimation.easing((now - _scrollAnimation.startTime) / _scrollAnimation.duration);
                renderTop = (_scrollAnimation.startTop + progress * _scrollAnimation.topDiff) | 0
            }
            _instance.setScrollTop(renderTop, true)
        } else if (!_isMobile) {
            var smoothScrollingDiff = _smoothScrolling.targetTop - renderTop;
            if (smoothScrollingDiff) {
                _smoothScrolling = {
                    startTop: _lastTop,
                    topDiff: renderTop - _lastTop,
                    targetTop: renderTop,
                    startTime: _lastRenderCall,
                    endTime: _lastRenderCall + _smoothScrollingDuration
                }
            }
            if (now <= _smoothScrolling.endTime) {
                progress = easings.sqrt((now - _smoothScrolling.startTime) / _smoothScrollingDuration);
                renderTop = (_smoothScrolling.startTop + progress * _smoothScrolling.topDiff) | 0
            }
        }
        if (_isMobile && _skrollrBody) {
            skrollr.setStyle(_skrollrBody, 'transform', 'translate(0, ' + -(_mobileOffset) + 'px) ' + _translateZ)
        }
        if (_forceRender || _lastTop !== renderTop) {
            _direction = (renderTop >= _lastTop) ? 'down' : 'up';
            _forceRender = false;
            var listenerParams = {
                curTop: renderTop,
                lastTop: _lastTop,
                maxTop: _maxKeyFrame,
                direction: _direction
            };
            var continueRendering = _listeners.beforerender && _listeners.beforerender.call(_instance, listenerParams);
            if (continueRendering !== false) {
                _calcSteps(renderTop, _instance.getScrollTop());
                _lastTop = renderTop;
                if (_listeners.render) {
                    _listeners.render.call(_instance, listenerParams)
                }
            }
            if (afterAnimationCallback) {
                afterAnimationCallback.call(_instance, false)
            }
        }
        _lastRenderCall = now
    };
    var _parseProps = function(skrollable) {
        var keyFrameIndex = 0;
        var keyFramesLength = skrollable.keyFrames.length;
        for (; keyFrameIndex < keyFramesLength; keyFrameIndex++) {
            var frame = skrollable.keyFrames[keyFrameIndex];
            var easing;
            var value;
            var prop;
            var props = {};
            var match;
            while ((match = rxPropValue.exec(frame.props)) !== null) {
                prop = match[1];
                value = match[2];
                easing = prop.match(rxPropEasing);
                if (easing !== null) {
                    prop = easing[1];
                    easing = easing[2]
                } else {
                    easing = DEFAULT_EASING
                }
                value = value.indexOf('!') ? _parseProp(value) : [value.slice(1)];
                props[prop] = {
                    value: value,
                    easing: easings[easing]
                }
            }
            frame.props = props
        }
    };
    var _parseProp = function(val) {
        var numbers = [];
        rxRGBAIntegerColor.lastIndex = 0;
        val = val.replace(rxRGBAIntegerColor, function(rgba) {
            return rgba.replace(rxNumericValue, function(n) {
                return n / 255 * 100 + '%'
            })
        });
        if (theDashedCSSPrefix) {
            rxGradient.lastIndex = 0;
            val = val.replace(rxGradient, function(s) {
                return theDashedCSSPrefix + s
            })
        }
        val = val.replace(rxNumericValue, function(n) {
            numbers.push(+n);
            return '{?}'
        });
        numbers.unshift(val);
        return numbers
    };
    var _fillProps = function(sk) {
        var propList = {};
        var keyFrameIndex;
        var keyFramesLength;
        keyFrameIndex = 0;
        keyFramesLength = sk.keyFrames.length;
        for (; keyFrameIndex < keyFramesLength; keyFrameIndex++) {
            _fillPropForFrame(sk.keyFrames[keyFrameIndex], propList)
        }
        propList = {};
        keyFrameIndex = sk.keyFrames.length - 1;
        for (; keyFrameIndex >= 0; keyFrameIndex--) {
            _fillPropForFrame(sk.keyFrames[keyFrameIndex], propList)
        }
    };
    var _fillPropForFrame = function(frame, propList) {
        var key;
        for (key in propList) {
            if (!hasProp.call(frame.props, key)) {
                frame.props[key] = propList[key]
            }
        }
        for (key in frame.props) {
            propList[key] = frame.props[key]
        }
    };
    var _calcInterpolation = function(val1, val2, progress) {
        var valueIndex;
        var val1Length = val1.length;
        if (val1Length !== val2.length) {
            throw 'Can\'t interpolate between "' + val1[0] + '" and "' + val2[0] + '"';
        }
        var interpolated = [val1[0]];
        valueIndex = 1;
        for (; valueIndex < val1Length; valueIndex++) {
            interpolated[valueIndex] = val1[valueIndex] + ((val2[valueIndex] - val1[valueIndex]) * progress)
        }
        return interpolated
    };
    var _interpolateString = function(val) {
        var valueIndex = 1;
        rxInterpolateString.lastIndex = 0;
        return val[0].replace(rxInterpolateString, function() {
            return val[valueIndex++]
        })
    };
    var _reset = function(elements, undo) {
        elements = [].concat(elements);
        var skrollable;
        var element;
        var elementsIndex = 0;
        var elementsLength = elements.length;
        for (; elementsIndex < elementsLength; elementsIndex++) {
            element = elements[elementsIndex];
            skrollable = _skrollables[element[SKROLLABLE_ID_DOM_PROPERTY]];
            if (!skrollable) {
                continue
            }
            if (undo) {
                element.style.cssText = skrollable.dirtyStyleAttr;
                _updateClass(element, skrollable.dirtyClassAttr)
            } else {
                skrollable.dirtyStyleAttr = element.style.cssText;
                skrollable.dirtyClassAttr = _getClass(element);
                element.style.cssText = skrollable.styleAttr;
                _updateClass(element, skrollable.classAttr)
            }
        }
    };
    var _detect3DTransforms = function() {
        _translateZ = 'translateZ(0)';
        skrollr.setStyle(_skrollrBody, 'transform', _translateZ);
        var computedStyle = getStyle(_skrollrBody);
        var computedTransform = computedStyle.getPropertyValue('transform');
        var computedTransformWithPrefix = computedStyle.getPropertyValue(theDashedCSSPrefix + 'transform');
        var has3D = (computedTransform && computedTransform !== 'none') || (computedTransformWithPrefix && computedTransformWithPrefix !== 'none');
        if (!has3D) {
            _translateZ = ''
        }
    };
    skrollr.setStyle = function(el, prop, val) {
        var style = el.style;
        prop = prop.replace(rxCamelCase, rxCamelCaseFn).replace('-', '');
        if (prop === 'zIndex') {
            style[prop] = '' + (val | 0)
        } else if (prop === 'float') {
            style.styleFloat = style.cssFloat = val
        } else {
            try {
                if (theCSSPrefix) {
                    style[theCSSPrefix + prop.slice(0, 1).toUpperCase() + prop.slice(1)] = val
                }
                style[prop] = val
            } catch (ignore) {}
        }
    };
    var _addEvent = skrollr.addEvent = function(element, names, callback) {
        var intermediate = function(e) {
            e = e || window.event;
            if (!e.target) {
                e.target = e.srcElement
            }
            if (!e.preventDefault) {
                e.preventDefault = function() {
                    e.returnValue = false
                }
            }
            return callback.call(this, e)
        };
        names = names.split(' ');
        var nameCounter = 0;
        var namesLength = names.length;
        for (; nameCounter < namesLength; nameCounter++) {
            if (element.addEventListener) {
                element.addEventListener(names[nameCounter], callback, false)
            } else {
                element.attachEvent('on' + names[nameCounter], intermediate)
            }
        }
    };
    var _reflow = function() {
        var pos = _instance.getScrollTop();
        _maxKeyFrame = 0;
        if (_forceHeight && !_isMobile) {
            body.style.height = 'auto'
        }
        _updateDependentKeyFrames();
        if (_forceHeight && !_isMobile) {
            body.style.height = (_maxKeyFrame + documentElement.clientHeight) + 'px'
        }
        if (_isMobile) {
            _instance.setScrollTop(Math.min(_instance.getScrollTop(), _maxKeyFrame))
        } else {
            _instance.setScrollTop(pos, true)
        }
        _forceRender = true
    };
    var _getDocumentHeight = function() {
        var skrollrBodyHeight = (_skrollrBody && _skrollrBody.offsetHeight || 0);
        var bodyHeight = Math.max(skrollrBodyHeight, body.scrollHeight, body.offsetHeight, documentElement.scrollHeight, documentElement.offsetHeight, documentElement.clientHeight);
        return bodyHeight - documentElement.clientHeight
    };
    var _getClass = function(element) {
        var prop = 'className';
        if (window.SVGElement && element instanceof window.SVGElement) {
            element = element[prop];
            prop = 'baseVal'
        }
        return element[prop]
    };
    var _updateClass = function(element, add, remove) {
        var prop = 'className';
        if (window.SVGElement && element instanceof window.SVGElement) {
            element = element[prop];
            prop = 'baseVal'
        }
        if (remove === undefined) {
            element[prop] = add;
            return
        }
        var val = element[prop];
        var classRemoveIndex = 0;
        var removeLength = remove.length;
        for (; classRemoveIndex < removeLength; classRemoveIndex++) {
            val = _untrim(val).replace(_untrim(remove[classRemoveIndex]), ' ')
        }
        val = _trim(val);
        var classAddIndex = 0;
        var addLength = add.length;
        for (; classAddIndex < addLength; classAddIndex++) {
            if (_untrim(val).indexOf(_untrim(add[classAddIndex])) === -1) {
                val += ' ' + add[classAddIndex]
            }
        }
        element[prop] = _trim(val)
    };
    var _trim = function(a) {
        return a.replace(rxTrim, '')
    };
    var _untrim = function(a) {
        return ' ' + a + ' '
    };
    var _now = Date.now || function() {
        return +new Date()
    };
    var _keyFrameComparator = function(a, b) {
        return a.frame - b.frame
    };
    var _instance;
    var _skrollables;
    var _skrollrBody;
    var _listeners;
    var _forceHeight;
    var _maxKeyFrame = 0;
    var _scale = 1;
    var _constants;
    var _direction = 'down';
    var _lastTop = -1;
    var _lastRenderCall = _now();
    var _lastViewportWidth = 0;
    var _lastViewportHeight = 0;
    var _requestReflow = false;
    var _scrollAnimation;
    var _smoothScrollingEnabled;
    var _smoothScrollingDuration;
    var _smoothScrolling;
    var _forceRender;
    var _skrollableIdCounter = 0;
    var _edgeStrategy;
    var _isMobile = false;
    var _mobileOffset = 0;
    var _translateZ
}(window, document));;
/*!
 * Chart.js
 * http://chartjs.org/
 *
 * Copyright 2013 Nick Downie
 * Released under the MIT license
 * https://github.com/nnnick/Chart.js/blob/master/LICENSE.md
 */
window.Chart = function(context) {
    var chart = this;
    var animationOptions = {
        linear: function(t) {
            return t
        },
        easeInQuad: function(t) {
            return t * t
        },
        easeOutQuad: function(t) {
            return -1 * t * (t - 2)
        },
        easeInOutQuad: function(t) {
            if ((t /= 1 / 2) < 1) return 1 / 2 * t * t;
            return -1 / 2 * ((--t) * (t - 2) - 1)
        },
        easeInCubic: function(t) {
            return t * t * t
        },
        easeOutCubic: function(t) {
            return 1 * ((t = t / 1 - 1) * t * t + 1)
        },
        easeInOutCubic: function(t) {
            if ((t /= 1 / 2) < 1) return 1 / 2 * t * t * t;
            return 1 / 2 * ((t -= 2) * t * t + 2)
        },
        easeInQuart: function(t) {
            return t * t * t * t
        },
        easeOutQuart: function(t) {
            return -1 * ((t = t / 1 - 1) * t * t * t - 1)
        },
        easeInOutQuart: function(t) {
            if ((t /= 1 / 2) < 1) return 1 / 2 * t * t * t * t;
            return -1 / 2 * ((t -= 2) * t * t * t - 2)
        },
        easeInQuint: function(t) {
            return 1 * (t /= 1) * t * t * t * t
        },
        easeOutQuint: function(t) {
            return 1 * ((t = t / 1 - 1) * t * t * t * t + 1)
        },
        easeInOutQuint: function(t) {
            if ((t /= 1 / 2) < 1) return 1 / 2 * t * t * t * t * t;
            return 1 / 2 * ((t -= 2) * t * t * t * t + 2)
        },
        easeInSine: function(t) {
            return -1 * Math.cos(t / 1 * (Math.PI / 2)) + 1
        },
        easeOutSine: function(t) {
            return 1 * Math.sin(t / 1 * (Math.PI / 2))
        },
        easeInOutSine: function(t) {
            return -1 / 2 * (Math.cos(Math.PI * t / 1) - 1)
        },
        easeInExpo: function(t) {
            return (t == 0) ? 1 : 1 * Math.pow(2, 10 * (t / 1 - 1))
        },
        easeOutExpo: function(t) {
            return (t == 1) ? 1 : 1 * (-Math.pow(2, -10 * t / 1) + 1)
        },
        easeInOutExpo: function(t) {
            if (t == 0) return 0;
            if (t == 1) return 1;
            if ((t /= 1 / 2) < 1) return 1 / 2 * Math.pow(2, 10 * (t - 1));
            return 1 / 2 * (-Math.pow(2, -10 * --t) + 2)
        },
        easeInCirc: function(t) {
            if (t >= 1) return t;
            return -1 * (Math.sqrt(1 - (t /= 1) * t) - 1)
        },
        easeOutCirc: function(t) {
            return 1 * Math.sqrt(1 - (t = t / 1 - 1) * t)
        },
        easeInOutCirc: function(t) {
            if ((t /= 1 / 2) < 1) return -1 / 2 * (Math.sqrt(1 - t * t) - 1);
            return 1 / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1)
        },
        easeInElastic: function(t) {
            var s = 1.70158;
            var p = 0;
            var a = 1;
            if (t == 0) return 0;
            if ((t /= 1) == 1) return 1;
            if (!p) p = 1 * .3;
            if (a < Math.abs(1)) {
                a = 1;
                var s = p / 4
            } else var s = p / (2 * Math.PI) * Math.asin(1 / a);
            return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * 1 - s) * (2 * Math.PI) / p))
        },
        easeOutElastic: function(t) {
            var s = 1.70158;
            var p = 0;
            var a = 1;
            if (t == 0) return 0;
            if ((t /= 1) == 1) return 1;
            if (!p) p = 1 * .3;
            if (a < Math.abs(1)) {
                a = 1;
                var s = p / 4
            } else var s = p / (2 * Math.PI) * Math.asin(1 / a);
            return a * Math.pow(2, -10 * t) * Math.sin((t * 1 - s) * (2 * Math.PI) / p) + 1
        },
        easeInOutElastic: function(t) {
            var s = 1.70158;
            var p = 0;
            var a = 1;
            if (t == 0) return 0;
            if ((t /= 1 / 2) == 2) return 1;
            if (!p) p = 1 * (.3 * 1.5);
            if (a < Math.abs(1)) {
                a = 1;
                var s = p / 4
            } else var s = p / (2 * Math.PI) * Math.asin(1 / a);
            if (t < 1) return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * 1 - s) * (2 * Math.PI) / p));
            return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * 1 - s) * (2 * Math.PI) / p) * .5 + 1
        },
        easeInBack: function(t) {
            var s = 1.70158;
            return 1 * (t /= 1) * t * ((s + 1) * t - s)
        },
        easeOutBack: function(t) {
            var s = 1.70158;
            return 1 * ((t = t / 1 - 1) * t * ((s + 1) * t + s) + 1)
        },
        easeInOutBack: function(t) {
            var s = 1.70158;
            if ((t /= 1 / 2) < 1) return 1 / 2 * (t * t * (((s *= (1.525)) + 1) * t - s));
            return 1 / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2)
        },
        easeInBounce: function(t) {
            return 1 - animationOptions.easeOutBounce(1 - t)
        },
        easeOutBounce: function(t) {
            if ((t /= 1) < (1 / 2.75)) {
                return 1 * (7.5625 * t * t)
            } else if (t < (2 / 2.75)) {
                return 1 * (7.5625 * (t -= (1.5 / 2.75)) * t + .75)
            } else if (t < (2.5 / 2.75)) {
                return 1 * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375)
            } else {
                return 1 * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375)
            }
        },
        easeInOutBounce: function(t) {
            if (t < 1 / 2) return animationOptions.easeInBounce(t * 2) * .5;
            return animationOptions.easeOutBounce(t * 2 - 1) * .5 + 1 * .5
        }
    };
    var width = context.canvas.width;
    var height = context.canvas.height;
    if (window.devicePixelRatio) {
        context.canvas.style.width = width + "px";
        context.canvas.style.height = height + "px";
        context.canvas.height = height * window.devicePixelRatio;
        context.canvas.width = width * window.devicePixelRatio;
        context.scale(window.devicePixelRatio, window.devicePixelRatio)
    }
    this.PolarArea = function(data, options) {
        chart.PolarArea.defaults = {
            scaleOverlay: true,
            scaleOverride: false,
            scaleSteps: null,
            scaleStepWidth: null,
            scaleStartValue: null,
            scaleShowLine: true,
            scaleLineColor: "rgba(0,0,0,.1)",
            scaleLineWidth: 1,
            scaleShowLabels: true,
            scaleLabel: "<%=value%>",
            scaleFontFamily: "'Arial'",
            scaleFontSize: 12,
            scaleFontStyle: "normal",
            scaleFontColor: "#666",
            scaleShowLabelBackdrop: true,
            scaleBackdropColor: "rgba(255,255,255,0.75)",
            scaleBackdropPaddingY: 2,
            scaleBackdropPaddingX: 2,
            segmentShowStroke: true,
            segmentStrokeColor: "#fff",
            segmentStrokeWidth: 2,
            animation: true,
            animationSteps: 100,
            animationEasing: "easeOutBounce",
            animateRotate: true,
            animateScale: false,
            onAnimationComplete: null
        };
        var config = (options) ? mergeChartConfig(chart.PolarArea.defaults, options) : chart.PolarArea.defaults;
        return new PolarArea(data, config, context)
    };
    this.Radar = function(data, options) {
        chart.Radar.defaults = {
            scaleOverlay: false,
            scaleOverride: false,
            scaleSteps: null,
            scaleStepWidth: null,
            scaleStartValue: null,
            scaleShowLine: true,
            scaleLineColor: "rgba(0,0,0,.1)",
            scaleLineWidth: 1,
            scaleShowLabels: false,
            scaleLabel: "<%=value%>",
            scaleFontFamily: "'Arial'",
            scaleFontSize: 12,
            scaleFontStyle: "normal",
            scaleFontColor: "#666",
            scaleShowLabelBackdrop: true,
            scaleBackdropColor: "rgba(255,255,255,0.75)",
            scaleBackdropPaddingY: 2,
            scaleBackdropPaddingX: 2,
            angleShowLineOut: true,
            angleLineColor: "rgba(0,0,0,.1)",
            angleLineWidth: 1,
            pointLabelFontFamily: "'Arial'",
            pointLabelFontStyle: "normal",
            pointLabelFontSize: 12,
            pointLabelFontColor: "#666",
            pointDot: true,
            pointDotRadius: 3,
            pointDotStrokeWidth: 1,
            datasetStroke: true,
            datasetStrokeWidth: 2,
            datasetFill: true,
            animation: true,
            animationSteps: 60,
            animationEasing: "easeOutQuart",
            onAnimationComplete: null
        };
        var config = (options) ? mergeChartConfig(chart.Radar.defaults, options) : chart.Radar.defaults;
        return new Radar(data, config, context)
    };
    this.Pie = function(data, options) {
        chart.Pie.defaults = {
            segmentShowStroke: true,
            segmentStrokeColor: "#fff",
            segmentStrokeWidth: 2,
            animation: true,
            animationSteps: 100,
            animationEasing: "easeOutBounce",
            animateRotate: true,
            animateScale: false,
            onAnimationComplete: null
        };
        var config = (options) ? mergeChartConfig(chart.Pie.defaults, options) : chart.Pie.defaults;
        return new Pie(data, config, context)
    };
    this.Doughnut = function(data, options) {
        chart.Doughnut.defaults = {
            segmentShowStroke: true,
            segmentStrokeColor: "#fff",
            segmentStrokeWidth: 2,
            percentageInnerCutout: 50,
            animation: true,
            animationSteps: 100,
            animationEasing: "easeOutBounce",
            animateRotate: true,
            animateScale: false,
            onAnimationComplete: null
        };
        var config = (options) ? mergeChartConfig(chart.Doughnut.defaults, options) : chart.Doughnut.defaults;
        return new Doughnut(data, config, context)
    };
    this.Line = function(data, options) {
        chart.Line.defaults = {
            scaleOverlay: false,
            scaleOverride: false,
            scaleSteps: null,
            scaleStepWidth: null,
            scaleStartValue: null,
            scaleLineColor: "rgba(0,0,0,.1)",
            scaleLineWidth: 1,
            scaleShowLabels: true,
            scaleLabel: "<%=value%>",
            scaleFontFamily: "'Arial'",
            scaleFontSize: 12,
            scaleFontStyle: "normal",
            scaleFontColor: "#666",
            scaleShowGridLines: true,
            scaleGridLineColor: "rgba(0,0,0,.05)",
            scaleGridLineWidth: 1,
            bezierCurve: true,
            pointDot: true,
            pointDotRadius: 4,
            pointDotStrokeWidth: 2,
            datasetStroke: true,
            datasetStrokeWidth: 2,
            datasetFill: true,
            animation: true,
            animationSteps: 60,
            animationEasing: "easeOutQuart",
            onAnimationComplete: null
        };
        var config = (options) ? mergeChartConfig(chart.Line.defaults, options) : chart.Line.defaults;
        return new Line(data, config, context)
    };
    this.Bar = function(data, options) {
        chart.Bar.defaults = {
            scaleOverlay: false,
            scaleOverride: false,
            scaleSteps: null,
            scaleStepWidth: null,
            scaleStartValue: null,
            scaleLineColor: "rgba(0,0,0,.1)",
            scaleLineWidth: 1,
            scaleShowLabels: true,
            scaleLabel: "<%=value%>",
            scaleFontFamily: "'Arial'",
            scaleFontSize: 12,
            scaleFontStyle: "normal",
            scaleFontColor: "#666",
            scaleShowGridLines: true,
            scaleGridLineColor: "rgba(0,0,0,.05)",
            scaleGridLineWidth: 1,
            barShowStroke: true,
            barStrokeWidth: 2,
            barValueSpacing: 5,
            barDatasetSpacing: 1,
            animation: true,
            animationSteps: 60,
            animationEasing: "easeOutQuart",
            onAnimationComplete: null
        };
        var config = (options) ? mergeChartConfig(chart.Bar.defaults, options) : chart.Bar.defaults;
        return new Bar(data, config, context)
    };
    var clear = function(c) {
        c.clearRect(0, 0, width, height)
    };
    var PolarArea = function(data, config, ctx) {
        var maxSize, scaleHop, calculatedScale, labelHeight, scaleHeight, valueBounds, labelTemplateString;
        calculateDrawingSizes();
        valueBounds = getValueBounds();
        labelTemplateString = (config.scaleShowLabels) ? config.scaleLabel : null;
        if (!config.scaleOverride) {
            calculatedScale = calculateScale(scaleHeight, valueBounds.maxSteps, valueBounds.minSteps, valueBounds.maxValue, valueBounds.minValue, labelTemplateString)
        } else {
            calculatedScale = {
                steps: config.scaleSteps,
                stepValue: config.scaleStepWidth,
                graphMin: config.scaleStartValue,
                labels: []
            };
            populateLabels(labelTemplateString, calculatedScale.labels, calculatedScale.steps, config.scaleStartValue, config.scaleStepWidth)
        };
        scaleHop = maxSize / (calculatedScale.steps);
        animationLoop(config, drawScale, drawAllSegments, ctx);

        function calculateDrawingSizes() {
            maxSize = (Min([width, height]) / 2);
            maxSize -= Max([config.scaleFontSize * 0.5, config.scaleLineWidth * 0.5]);
            labelHeight = config.scaleFontSize * 2;
            if (config.scaleShowLabelBackdrop) {
                labelHeight += (2 * config.scaleBackdropPaddingY);
                maxSize -= config.scaleBackdropPaddingY * 1.5
            }
            scaleHeight = maxSize;
            labelHeight = Default(labelHeight, 5)
        }

        function drawScale() {
            for (var i = 0; i < calculatedScale.steps; i++) {
                if (config.scaleShowLine) {
                    ctx.beginPath();
                    ctx.arc(width / 2, height / 2, scaleHop * (i + 1), 0, (Math.PI * 2), true);
                    ctx.strokeStyle = config.scaleLineColor;
                    ctx.lineWidth = config.scaleLineWidth;
                    ctx.stroke()
                }
                if (config.scaleShowLabels) {
                    ctx.textAlign = "center";
                    ctx.font = config.scaleFontStyle + " " + config.scaleFontSize + "px " + config.scaleFontFamily;
                    var label = calculatedScale.labels[i];
                    if (config.scaleShowLabelBackdrop) {
                        var textWidth = ctx.measureText(label).width;
                        ctx.fillStyle = config.scaleBackdropColor;
                        ctx.beginPath();
                        ctx.rect(Math.round(width / 2 - textWidth / 2 - config.scaleBackdropPaddingX), Math.round(height / 2 - (scaleHop * (i + 1)) - config.scaleFontSize * 0.5 - config.scaleBackdropPaddingY), Math.round(textWidth + (config.scaleBackdropPaddingX * 2)), Math.round(config.scaleFontSize + (config.scaleBackdropPaddingY * 2)));
                        ctx.fill()
                    }
                    ctx.textBaseline = "middle";
                    ctx.fillStyle = config.scaleFontColor;
                    ctx.fillText(label, width / 2, height / 2 - (scaleHop * (i + 1)))
                }
            }
        }

        function drawAllSegments(animationDecimal) {
            var startAngle = -Math.PI / 2,
                angleStep = (Math.PI * 2) / data.length,
                scaleAnimation = 1,
                rotateAnimation = 1;
            if (config.animation) {
                if (config.animateScale) {
                    scaleAnimation = animationDecimal
                }
                if (config.animateRotate) {
                    rotateAnimation = animationDecimal
                }
            }
            for (var i = 0; i < data.length; i++) {
                ctx.beginPath();
                ctx.arc(width / 2, height / 2, scaleAnimation * calculateOffset(data[i].value, calculatedScale, scaleHop), startAngle, startAngle + rotateAnimation * angleStep, false);
                ctx.lineTo(width / 2, height / 2);
                ctx.closePath();
                ctx.fillStyle = data[i].color;
                ctx.fill();
                if (config.segmentShowStroke) {
                    ctx.strokeStyle = config.segmentStrokeColor;
                    ctx.lineWidth = config.segmentStrokeWidth;
                    ctx.stroke()
                }
                startAngle += rotateAnimation * angleStep
            }
        }

        function getValueBounds() {
            var upperValue = Number.MIN_VALUE;
            var lowerValue = Number.MAX_VALUE;
            for (var i = 0; i < data.length; i++) {
                if (data[i].value > upperValue) {
                    upperValue = data[i].value
                }
                if (data[i].value < lowerValue) {
                    lowerValue = data[i].value
                }
            };
            var maxSteps = Math.floor((scaleHeight / (labelHeight * 0.66)));
            var minSteps = Math.floor((scaleHeight / labelHeight * 0.5));
            return {
                maxValue: upperValue,
                minValue: lowerValue,
                maxSteps: maxSteps,
                minSteps: minSteps
            }
        }
    };
    var Radar = function(data, config, ctx) {
        var maxSize, scaleHop, calculatedScale, labelHeight, scaleHeight, valueBounds, labelTemplateString;
        if (!data.labels) data.labels = [];
        calculateDrawingSizes();
        var valueBounds = getValueBounds();
        labelTemplateString = (config.scaleShowLabels) ? config.scaleLabel : null;
        if (!config.scaleOverride) {
            calculatedScale = calculateScale(scaleHeight, valueBounds.maxSteps, valueBounds.minSteps, valueBounds.maxValue, valueBounds.minValue, labelTemplateString)
        } else {
            calculatedScale = {
                steps: config.scaleSteps,
                stepValue: config.scaleStepWidth,
                graphMin: config.scaleStartValue,
                labels: []
            };
            populateLabels(labelTemplateString, calculatedScale.labels, calculatedScale.steps, config.scaleStartValue, config.scaleStepWidth)
        }
        scaleHop = maxSize / (calculatedScale.steps);
        animationLoop(config, drawScale, drawAllDataPoints, ctx);

        function drawAllDataPoints(animationDecimal) {
            var rotationDegree = (2 * Math.PI) / data.datasets[0].data.length;
            ctx.save();
            ctx.translate(width / 2, height / 2);
            for (var i = 0; i < data.datasets.length; i++) {
                ctx.beginPath();
                ctx.moveTo(0, animationDecimal * (-1 * calculateOffset(data.datasets[i].data[0], calculatedScale, scaleHop)));
                for (var j = 1; j < data.datasets[i].data.length; j++) {
                    ctx.rotate(rotationDegree);
                    ctx.lineTo(0, animationDecimal * (-1 * calculateOffset(data.datasets[i].data[j], calculatedScale, scaleHop)))
                }
                ctx.closePath();
                ctx.fillStyle = data.datasets[i].fillColor;
                ctx.strokeStyle = data.datasets[i].strokeColor;
                ctx.lineWidth = config.datasetStrokeWidth;
                ctx.fill();
                ctx.stroke();
                if (config.pointDot) {
                    ctx.fillStyle = data.datasets[i].pointColor;
                    ctx.strokeStyle = data.datasets[i].pointStrokeColor;
                    ctx.lineWidth = config.pointDotStrokeWidth;
                    for (var k = 0; k < data.datasets[i].data.length; k++) {
                        ctx.rotate(rotationDegree);
                        ctx.beginPath();
                        ctx.arc(0, animationDecimal * (-1 * calculateOffset(data.datasets[i].data[k], calculatedScale, scaleHop)), config.pointDotRadius, 2 * Math.PI, false);
                        ctx.fill();
                        ctx.stroke()
                    }
                }
                ctx.rotate(rotationDegree)
            }
            ctx.restore()
        }

        function drawScale() {
            var rotationDegree = (2 * Math.PI) / data.datasets[0].data.length;
            ctx.save();
            ctx.translate(width / 2, height / 2);
            if (config.angleShowLineOut) {
                ctx.strokeStyle = config.angleLineColor;
                ctx.lineWidth = config.angleLineWidth;
                for (var h = 0; h < data.datasets[0].data.length; h++) {
                    ctx.rotate(rotationDegree);
                    ctx.beginPath();
                    ctx.moveTo(0, 0);
                    ctx.lineTo(0, -maxSize);
                    ctx.stroke()
                }
            }
            for (var i = 0; i < calculatedScale.steps; i++) {
                ctx.beginPath();
                if (config.scaleShowLine) {
                    ctx.strokeStyle = config.scaleLineColor;
                    ctx.lineWidth = config.scaleLineWidth;
                    ctx.moveTo(0, -scaleHop * (i + 1));
                    for (var j = 0; j < data.datasets[0].data.length; j++) {
                        ctx.rotate(rotationDegree);
                        ctx.lineTo(0, -scaleHop * (i + 1))
                    }
                    ctx.closePath();
                    ctx.stroke()
                }
                if (config.scaleShowLabels) {
                    ctx.textAlign = 'center';
                    ctx.font = config.scaleFontStyle + " " + config.scaleFontSize + "px " + config.scaleFontFamily;
                    ctx.textBaseline = "middle";
                    if (config.scaleShowLabelBackdrop) {
                        var textWidth = ctx.measureText(calculatedScale.labels[i]).width;
                        ctx.fillStyle = config.scaleBackdropColor;
                        ctx.beginPath();
                        ctx.rect(Math.round(-textWidth / 2 - config.scaleBackdropPaddingX), Math.round((-scaleHop * (i + 1)) - config.scaleFontSize * 0.5 - config.scaleBackdropPaddingY), Math.round(textWidth + (config.scaleBackdropPaddingX * 2)), Math.round(config.scaleFontSize + (config.scaleBackdropPaddingY * 2)));
                        ctx.fill()
                    }
                    ctx.fillStyle = config.scaleFontColor;
                    ctx.fillText(calculatedScale.labels[i], 0, -scaleHop * (i + 1))
                }
            }
            for (var k = 0; k < data.labels.length; k++) {
                ctx.font = config.pointLabelFontStyle + " " + config.pointLabelFontSize + "px " + config.pointLabelFontFamily;
                ctx.fillStyle = config.pointLabelFontColor;
                var opposite = Math.sin(rotationDegree * k) * (maxSize + config.pointLabelFontSize);
                var adjacent = Math.cos(rotationDegree * k) * (maxSize + config.pointLabelFontSize);
                if (rotationDegree * k == Math.PI || rotationDegree * k == 0) {
                    ctx.textAlign = "center"
                } else if (rotationDegree * k > Math.PI) {
                    ctx.textAlign = "right"
                } else {
                    ctx.textAlign = "left"
                }
                ctx.textBaseline = "middle";
                ctx.fillText(data.labels[k], opposite, -adjacent)
            }
            ctx.restore()
        };

        function calculateDrawingSizes() {
            maxSize = (Min([width, height]) / 2);
            labelHeight = config.scaleFontSize * 2;
            var labelLength = 0;
            for (var i = 0; i < data.labels.length; i++) {
                ctx.font = config.pointLabelFontStyle + " " + config.pointLabelFontSize + "px " + config.pointLabelFontFamily;
                var textMeasurement = ctx.measureText(data.labels[i]).width;
                if (textMeasurement > labelLength) labelLength = textMeasurement
            }
            maxSize -= Max([labelLength, ((config.pointLabelFontSize / 2) * 1.5)]);
            maxSize -= config.pointLabelFontSize;
            maxSize = CapValue(maxSize, null, 0);
            scaleHeight = maxSize;
            labelHeight = Default(labelHeight, 5)
        };

        function getValueBounds() {
            var upperValue = Number.MIN_VALUE;
            var lowerValue = Number.MAX_VALUE;
            for (var i = 0; i < data.datasets.length; i++) {
                for (var j = 0; j < data.datasets[i].data.length; j++) {
                    if (data.datasets[i].data[j] > upperValue) {
                        upperValue = data.datasets[i].data[j]
                    }
                    if (data.datasets[i].data[j] < lowerValue) {
                        lowerValue = data.datasets[i].data[j]
                    }
                }
            }
            var maxSteps = Math.floor((scaleHeight / (labelHeight * 0.66)));
            var minSteps = Math.floor((scaleHeight / labelHeight * 0.5));
            return {
                maxValue: upperValue,
                minValue: lowerValue,
                maxSteps: maxSteps,
                minSteps: minSteps
            }
        }
    };
    var Pie = function(data, config, ctx) {
        var segmentTotal = 0;
        var pieRadius = Min([height / 2, width / 2]) - 5;
        for (var i = 0; i < data.length; i++) {
            segmentTotal += data[i].value
        }
        animationLoop(config, null, drawPieSegments, ctx);

        function drawPieSegments(animationDecimal) {
            var cumulativeAngle = -Math.PI / 2,
                scaleAnimation = 1,
                rotateAnimation = 1;
            if (config.animation) {
                if (config.animateScale) {
                    scaleAnimation = animationDecimal
                }
                if (config.animateRotate) {
                    rotateAnimation = animationDecimal
                }
            }
            for (var i = 0; i < data.length; i++) {
                var segmentAngle = rotateAnimation * ((data[i].value / segmentTotal) * (Math.PI * 2));
                ctx.beginPath();
                ctx.arc(width / 2, height / 2, scaleAnimation * pieRadius, cumulativeAngle, cumulativeAngle + segmentAngle);
                ctx.lineTo(width / 2, height / 2);
                ctx.closePath();
                ctx.fillStyle = data[i].color;
                ctx.fill();
                if (config.segmentShowStroke) {
                    ctx.lineWidth = config.segmentStrokeWidth;
                    ctx.strokeStyle = config.segmentStrokeColor;
                    ctx.stroke()
                }
                cumulativeAngle += segmentAngle
            }
        }
    };
    var Doughnut = function(data, config, ctx) {
        var segmentTotal = 0;
        var doughnutRadius = Min([height / 2, width / 2]) - 5;
        var cutoutRadius = doughnutRadius * (config.percentageInnerCutout / 100);
        for (var i = 0; i < data.length; i++) {
            segmentTotal += data[i].value
        }
        animationLoop(config, null, drawPieSegments, ctx);

        function drawPieSegments(animationDecimal) {
            var cumulativeAngle = -Math.PI / 2,
                scaleAnimation = 1,
                rotateAnimation = 1;
            if (config.animation) {
                if (config.animateScale) {
                    scaleAnimation = animationDecimal
                }
                if (config.animateRotate) {
                    rotateAnimation = animationDecimal
                }
            }
            for (var i = 0; i < data.length; i++) {
                var segmentAngle = rotateAnimation * ((data[i].value / segmentTotal) * (Math.PI * 2));
                ctx.beginPath();
                ctx.arc(width / 2, height / 2, scaleAnimation * doughnutRadius, cumulativeAngle, cumulativeAngle + segmentAngle, false);
                ctx.arc(width / 2, height / 2, scaleAnimation * cutoutRadius, cumulativeAngle + segmentAngle, cumulativeAngle, true);
                ctx.closePath();
                ctx.fillStyle = data[i].color;
                ctx.fill();
                if (config.segmentShowStroke) {
                    ctx.lineWidth = config.segmentStrokeWidth;
                    ctx.strokeStyle = config.segmentStrokeColor;
                    ctx.stroke()
                }
                cumulativeAngle += segmentAngle
            }
        }
    };
    var Line = function(data, config, ctx) {
        var maxSize, scaleHop, calculatedScale, labelHeight, scaleHeight, valueBounds, labelTemplateString, valueHop, widestXLabel, xAxisLength, yAxisPosX, xAxisPosY, rotateLabels = 0;
        calculateDrawingSizes();
        valueBounds = getValueBounds();
        labelTemplateString = (config.scaleShowLabels) ? config.scaleLabel : "";
        if (!config.scaleOverride) {
            calculatedScale = calculateScale(scaleHeight, valueBounds.maxSteps, valueBounds.minSteps, valueBounds.maxValue, valueBounds.minValue, labelTemplateString)
        } else {
            calculatedScale = {
                steps: config.scaleSteps,
                stepValue: config.scaleStepWidth,
                graphMin: config.scaleStartValue,
                labels: []
            };
            populateLabels(labelTemplateString, calculatedScale.labels, calculatedScale.steps, config.scaleStartValue, config.scaleStepWidth)
        }
        scaleHop = Math.floor(scaleHeight / calculatedScale.steps);
        calculateXAxisSize();
        animationLoop(config, drawScale, drawLines, ctx);

        function drawLines(animPc) {
            for (var i = 0; i < data.datasets.length; i++) {
                ctx.strokeStyle = data.datasets[i].strokeColor;
                ctx.lineWidth = config.datasetStrokeWidth;
                ctx.beginPath();
                ctx.moveTo(yAxisPosX, xAxisPosY - animPc * (calculateOffset(data.datasets[i].data[0], calculatedScale, scaleHop)));
                for (var j = 1; j < data.datasets[i].data.length; j++) {
                    if (config.bezierCurve) {
                        ctx.bezierCurveTo(xPos(j - 0.5), yPos(i, j - 1), xPos(j - 0.5), yPos(i, j), xPos(j), yPos(i, j))
                    } else {
                        ctx.lineTo(xPos(j), yPos(i, j))
                    }
                }
                ctx.stroke();
                if (config.datasetFill) {
                    ctx.lineTo(yAxisPosX + (valueHop * (data.datasets[i].data.length - 1)), xAxisPosY);
                    ctx.lineTo(yAxisPosX, xAxisPosY);
                    ctx.closePath();
                    ctx.fillStyle = data.datasets[i].fillColor;
                    ctx.fill()
                } else {
                    ctx.closePath()
                }
                if (config.pointDot) {
                    ctx.fillStyle = data.datasets[i].pointColor;
                    ctx.strokeStyle = data.datasets[i].pointStrokeColor;
                    ctx.lineWidth = config.pointDotStrokeWidth;
                    for (var k = 0; k < data.datasets[i].data.length; k++) {
                        ctx.beginPath();
                        ctx.arc(yAxisPosX + (valueHop * k), xAxisPosY - animPc * (calculateOffset(data.datasets[i].data[k], calculatedScale, scaleHop)), config.pointDotRadius, 0, Math.PI * 2, true);
                        ctx.fill();
                        ctx.stroke()
                    }
                }
            }

            function yPos(dataSet, iteration) {
                return xAxisPosY - animPc * (calculateOffset(data.datasets[dataSet].data[iteration], calculatedScale, scaleHop))
            }

            function xPos(iteration) {
                return yAxisPosX + (valueHop * iteration)
            }
        }

        function drawScale() {
            ctx.lineWidth = config.scaleLineWidth;
            ctx.strokeStyle = config.scaleLineColor;
            ctx.beginPath();
            ctx.moveTo(width - widestXLabel / 2, xAxisPosY);
            ctx.lineTo(width - (widestXLabel / 2) - xAxisLength, xAxisPosY);
            ctx.stroke();
            if (rotateLabels > 0) {
                ctx.save();
                ctx.textAlign = "right"
            } else {
                ctx.textAlign = "center"
            }
            ctx.fillStyle = config.scaleFontColor;
            for (var i = 0; i < data.labels.length; i++) {
                ctx.save();
                if (rotateLabels > 0) {
                    ctx.translate(yAxisPosX + i * valueHop, xAxisPosY + config.scaleFontSize);
                    ctx.rotate(-(rotateLabels * (Math.PI / 180)));
                    ctx.fillText(data.labels[i], 0, 0);
                    ctx.restore()
                } else {
                    ctx.fillText(data.labels[i], yAxisPosX + i * valueHop, xAxisPosY + config.scaleFontSize + 3)
                }
                ctx.beginPath();
                ctx.moveTo(yAxisPosX + i * valueHop, xAxisPosY + 3);
                if (config.scaleShowGridLines && i > 0) {
                    ctx.lineWidth = config.scaleGridLineWidth;
                    ctx.strokeStyle = config.scaleGridLineColor
                } else {
                    ctx.lineTo(yAxisPosX + i * valueHop, xAxisPosY + 3)
                }
                ctx.stroke()
            }
            ctx.lineWidth = config.scaleLineWidth;
            ctx.strokeStyle = config.scaleLineColor;
            ctx.beginPath();
            ctx.moveTo(yAxisPosX, xAxisPosY);
            ctx.lineTo(yAxisPosX, 0);
            ctx.stroke();
            ctx.textAlign = "right";
            ctx.textBaseline = "middle";
            for (var j = 0; j < calculatedScale.steps; j++) {
                ctx.beginPath();
                ctx.moveTo(yAxisPosX, xAxisPosY - ((j + 1) * scaleHop));
                if (config.scaleShowGridLines) {
                    ctx.lineWidth = config.scaleGridLineWidth;
                    ctx.strokeStyle = config.scaleGridLineColor;
                    ctx.lineTo(yAxisPosX + xAxisLength, xAxisPosY - ((j + 1) * scaleHop))
                } else {
                    ctx.lineTo(yAxisPosX - 0.5, xAxisPosY - ((j + 1) * scaleHop))
                }
                ctx.stroke();
                if (config.scaleShowLabels) {
                    ctx.fillText(calculatedScale.labels[j], yAxisPosX - 8, xAxisPosY - ((j + 1) * scaleHop))
                }
            }
        }

        function calculateXAxisSize() {
            var longestText = 1;
            if (config.scaleShowLabels) {
                ctx.font = config.scaleFontStyle + " " + config.scaleFontSize + "px " + config.scaleFontFamily;
                for (var i = 0; i < calculatedScale.labels.length; i++) {
                    var measuredText = ctx.measureText(calculatedScale.labels[i]).width;
                    longestText = (measuredText > longestText) ? measuredText : longestText
                }
                longestText += 10
            }
            xAxisLength = width - longestText - widestXLabel;
            valueHop = Math.floor(xAxisLength / (data.labels.length - 1));
            yAxisPosX = width - widestXLabel / 2 - xAxisLength;
            xAxisPosY = scaleHeight + config.scaleFontSize / 2
        }

        function calculateDrawingSizes() {
            maxSize = height;
            ctx.font = config.scaleFontStyle + " " + config.scaleFontSize + "px " + config.scaleFontFamily;
            widestXLabel = 1;
            for (var i = 0; i < data.labels.length; i++) {
                var textLength = ctx.measureText(data.labels[i]).width;
                widestXLabel = (textLength > widestXLabel) ? textLength : widestXLabel
            }
            if (width / data.labels.length < widestXLabel) {
                rotateLabels = 45;
                if (width / data.labels.length < Math.cos(rotateLabels) * widestXLabel) {
                    rotateLabels = 90;
                    maxSize -= widestXLabel
                } else {
                    maxSize -= Math.sin(rotateLabels) * widestXLabel
                }
            } else {
                maxSize -= config.scaleFontSize
            }
            maxSize -= 5;
            labelHeight = config.scaleFontSize;
            maxSize -= labelHeight;
            scaleHeight = maxSize
        }

        function getValueBounds() {
            var upperValue = Number.MIN_VALUE;
            var lowerValue = Number.MAX_VALUE;
            for (var i = 0; i < data.datasets.length; i++) {
                for (var j = 0; j < data.datasets[i].data.length; j++) {
                    if (data.datasets[i].data[j] > upperValue) {
                        upperValue = data.datasets[i].data[j]
                    };
                    if (data.datasets[i].data[j] < lowerValue) {
                        lowerValue = data.datasets[i].data[j]
                    }
                }
            };
            var maxSteps = Math.floor((scaleHeight / (labelHeight * 0.66)));
            var minSteps = Math.floor((scaleHeight / labelHeight * 0.5));
            return {
                maxValue: upperValue,
                minValue: lowerValue,
                maxSteps: maxSteps,
                minSteps: minSteps
            }
        }
    };
    var Bar = function(data, config, ctx) {
        var maxSize, scaleHop, calculatedScale, labelHeight, scaleHeight, valueBounds, labelTemplateString, valueHop, widestXLabel, xAxisLength, yAxisPosX, xAxisPosY, barWidth, rotateLabels = 0;
        calculateDrawingSizes();
        valueBounds = getValueBounds();
        labelTemplateString = (config.scaleShowLabels) ? config.scaleLabel : "";
        if (!config.scaleOverride) {
            calculatedScale = calculateScale(scaleHeight, valueBounds.maxSteps, valueBounds.minSteps, valueBounds.maxValue, valueBounds.minValue, labelTemplateString)
        } else {
            calculatedScale = {
                steps: config.scaleSteps,
                stepValue: config.scaleStepWidth,
                graphMin: config.scaleStartValue,
                labels: []
            };
            populateLabels(labelTemplateString, calculatedScale.labels, calculatedScale.steps, config.scaleStartValue, config.scaleStepWidth)
        }
        scaleHop = Math.floor(scaleHeight / calculatedScale.steps);
        calculateXAxisSize();
        animationLoop(config, drawBars, drawScale, ctx);

        function drawBars(animPc) {
            ctx.lineWidth = config.barStrokeWidth;
            for (var i = 0; i < data.datasets.length; i++) {
                ctx.fillStyle = data.datasets[i].fillColor;
                ctx.strokeStyle = data.datasets[i].strokeColor;
                for (var j = 0; j < data.datasets[i].data.length; j++) {
                    var barOffset = yAxisPosX + config.barValueSpacing + valueHop * j + barWidth * i + config.barDatasetSpacing * i + config.barStrokeWidth * i;
                    ctx.beginPath();
                    ctx.moveTo(barOffset, xAxisPosY);
                    ctx.lineTo(barOffset, xAxisPosY - animPc * calculateOffset(data.datasets[i].data[j], calculatedScale, scaleHop) + (config.barStrokeWidth / 2));
                    ctx.lineTo(barOffset + barWidth, xAxisPosY - animPc * calculateOffset(data.datasets[i].data[j], calculatedScale, scaleHop) + (config.barStrokeWidth / 2));
                    ctx.lineTo(barOffset + barWidth, xAxisPosY);
                    if (config.barShowStroke) {
                        ctx.stroke()
                    }
                    ctx.closePath();
                    ctx.fill()
                }
            }
        }

        function drawScale() {
            ctx.lineWidth = config.scaleLineWidth;
            ctx.strokeStyle = config.scaleLineColor;
            ctx.beginPath();
            ctx.moveTo(width - widestXLabel / 2 + 5, xAxisPosY);
            ctx.lineTo(width - (widestXLabel / 2) - xAxisLength - 5, xAxisPosY);
            ctx.stroke();
            if (rotateLabels > 0) {
                ctx.save();
                ctx.textAlign = "right"
            } else {
                ctx.textAlign = "center"
            }
            ctx.fillStyle = config.scaleFontColor;
            for (var i = 0; i < data.labels.length; i++) {
                ctx.save();
                if (rotateLabels > 0) {
                    ctx.translate(yAxisPosX + i * valueHop, xAxisPosY + config.scaleFontSize);
                    ctx.rotate(-(rotateLabels * (Math.PI / 180)));
                    ctx.fillText(data.labels[i], 0, 0);
                    ctx.restore()
                } else {
                    ctx.fillText(data.labels[i], yAxisPosX + i * valueHop + valueHop / 2, xAxisPosY + config.scaleFontSize + 3)
                }
                ctx.beginPath();
                ctx.moveTo(yAxisPosX + (i + 1) * valueHop, xAxisPosY + 3);
                ctx.lineWidth = config.scaleGridLineWidth;
                ctx.strokeStyle = config.scaleGridLineColor;
                ctx.lineTo(yAxisPosX + (i + 1) * valueHop, 5);
                ctx.stroke()
            }
            ctx.lineWidth = config.scaleLineWidth;
            ctx.strokeStyle = config.scaleLineColor;
            ctx.beginPath();
            ctx.moveTo(yAxisPosX, xAxisPosY + 5);
            ctx.lineTo(yAxisPosX, 5);
            ctx.stroke();
            ctx.textAlign = "right";
            ctx.textBaseline = "middle";
            for (var j = 0; j < calculatedScale.steps; j++) {
                ctx.beginPath();
                ctx.moveTo(yAxisPosX - 3, xAxisPosY - ((j + 1) * scaleHop));
                if (config.scaleShowGridLines) {
                    ctx.lineWidth = config.scaleGridLineWidth;
                    ctx.strokeStyle = config.scaleGridLineColor;
                    ctx.lineTo(yAxisPosX + xAxisLength + 5, xAxisPosY - ((j + 1) * scaleHop))
                } else {
                    ctx.lineTo(yAxisPosX - 0.5, xAxisPosY - ((j + 1) * scaleHop))
                }
                ctx.stroke();
                if (config.scaleShowLabels) {
                    ctx.fillText(calculatedScale.labels[j], yAxisPosX - 8, xAxisPosY - ((j + 1) * scaleHop))
                }
            }
        }

        function calculateXAxisSize() {
            var longestText = 1;
            if (config.scaleShowLabels) {
                ctx.font = config.scaleFontStyle + " " + config.scaleFontSize + "px " + config.scaleFontFamily;
                for (var i = 0; i < calculatedScale.labels.length; i++) {
                    var measuredText = ctx.measureText(calculatedScale.labels[i]).width;
                    longestText = (measuredText > longestText) ? measuredText : longestText
                }
                longestText += 10
            }
            xAxisLength = width - longestText - widestXLabel;
            valueHop = Math.floor(xAxisLength / (data.labels.length));
            barWidth = (valueHop - config.scaleGridLineWidth * 2 - (config.barValueSpacing * 2) - (config.barDatasetSpacing * data.datasets.length - 1) - ((config.barStrokeWidth / 2) * data.datasets.length - 1)) / data.datasets.length;
            yAxisPosX = width - widestXLabel / 2 - xAxisLength;
            xAxisPosY = scaleHeight + config.scaleFontSize / 2
        }

        function calculateDrawingSizes() {
            maxSize = height;
            ctx.font = config.scaleFontStyle + " " + config.scaleFontSize + "px " + config.scaleFontFamily;
            widestXLabel = 1;
            for (var i = 0; i < data.labels.length; i++) {
                var textLength = ctx.measureText(data.labels[i]).width;
                widestXLabel = (textLength > widestXLabel) ? textLength : widestXLabel
            }
            if (width / data.labels.length < widestXLabel) {
                rotateLabels = 45;
                if (width / data.labels.length < Math.cos(rotateLabels) * widestXLabel) {
                    rotateLabels = 90;
                    maxSize -= widestXLabel
                } else {
                    maxSize -= Math.sin(rotateLabels) * widestXLabel
                }
            } else {
                maxSize -= config.scaleFontSize
            }
            maxSize -= 5;
            labelHeight = config.scaleFontSize;
            maxSize -= labelHeight;
            scaleHeight = maxSize
        }

        function getValueBounds() {
            var upperValue = Number.MIN_VALUE;
            var lowerValue = Number.MAX_VALUE;
            for (var i = 0; i < data.datasets.length; i++) {
                for (var j = 0; j < data.datasets[i].data.length; j++) {
                    if (data.datasets[i].data[j] > upperValue) {
                        upperValue = data.datasets[i].data[j]
                    };
                    if (data.datasets[i].data[j] < lowerValue) {
                        lowerValue = data.datasets[i].data[j]
                    }
                }
            };
            var maxSteps = Math.floor((scaleHeight / (labelHeight * 0.66)));
            var minSteps = Math.floor((scaleHeight / labelHeight * 0.5));
            return {
                maxValue: upperValue,
                minValue: lowerValue,
                maxSteps: maxSteps,
                minSteps: minSteps
            }
        }
    };

    function calculateOffset(val, calculatedScale, scaleHop) {
        var outerValue = calculatedScale.steps * calculatedScale.stepValue;
        var adjustedValue = val - calculatedScale.graphMin;
        var scalingFactor = CapValue(adjustedValue / outerValue, 1, 0);
        return (scaleHop * calculatedScale.steps) * scalingFactor
    }

    function animationLoop(config, drawScale, drawData, ctx) {
        var animFrameAmount = (config.animation) ? 1 / CapValue(config.animationSteps, Number.MAX_VALUE, 1) : 1,
            easingFunction = animationOptions[config.animationEasing],
            percentAnimComplete = (config.animation) ? 0 : 1;
        if (typeof drawScale !== "function") drawScale = function() {};
        requestAnimFrame(animLoop);

        function animateFrame() {
            var easeAdjustedAnimationPercent = (config.animation) ? CapValue(easingFunction(percentAnimComplete), null, 0) : 1;
            clear(ctx);
            if (config.scaleOverlay) {
                drawScale();
                drawData(easeAdjustedAnimationPercent)
            } else {
                drawData(easeAdjustedAnimationPercent);
                drawScale()
            }
        }

        function animLoop() {
            percentAnimComplete += animFrameAmount;
            animateFrame();
            if (percentAnimComplete <= 1) {
                requestAnimFrame(animLoop)
            } else {
                if (typeof config.onAnimationComplete == "function") config.onAnimationComplete()
            }
        }
    }
    var requestAnimFrame = (function() {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) {
            window.setTimeout(callback, 1000 / 60)
        }
    })();

    function calculateScale(drawingHeight, maxSteps, minSteps, maxValue, minValue, labelTemplateString) {
        var graphMin, graphMax, graphRange, stepValue, numberOfSteps, valueRange, rangeOrderOfMagnitude, decimalNum;
        valueRange = maxValue - minValue;
        rangeOrderOfMagnitude = calculateOrderOfMagnitude(valueRange);
        graphMin = Math.floor(minValue / (1 * Math.pow(10, rangeOrderOfMagnitude))) * Math.pow(10, rangeOrderOfMagnitude);
        graphMax = Math.ceil(maxValue / (1 * Math.pow(10, rangeOrderOfMagnitude))) * Math.pow(10, rangeOrderOfMagnitude);
        graphRange = graphMax - graphMin;
        stepValue = Math.pow(10, rangeOrderOfMagnitude);
        numberOfSteps = Math.round(graphRange / stepValue);
        while (numberOfSteps < minSteps || numberOfSteps > maxSteps) {
            if (numberOfSteps < minSteps) {
                stepValue /= 2;
                numberOfSteps = Math.round(graphRange / stepValue)
            } else {
                stepValue *= 2;
                numberOfSteps = Math.round(graphRange / stepValue)
            }
        };
        var labels = [];
        populateLabels(labelTemplateString, labels, numberOfSteps, graphMin, stepValue);
        return {
            steps: numberOfSteps,
            stepValue: stepValue,
            graphMin: graphMin,
            labels: labels
        };

        function calculateOrderOfMagnitude(val) {
            return Math.floor(Math.log(val) / Math.LN10)
        }
    }

    function populateLabels(labelTemplateString, labels, numberOfSteps, graphMin, stepValue) {
        if (labelTemplateString) {
            for (var i = 1; i < numberOfSteps + 1; i++) {
                labels.push(tmpl(labelTemplateString, {
                    value: (graphMin + (stepValue * i)).toFixed(getDecimalPlaces(stepValue))
                }))
            }
        }
    }

    function Max(array) {
        return Math.max.apply(Math, array)
    };

    function Min(array) {
        return Math.min.apply(Math, array)
    };

    function Default(userDeclared, valueIfFalse) {
        if (!userDeclared) {
            return valueIfFalse
        } else {
            return userDeclared
        }
    };

    function isNumber(n) {
        return !isNaN(parseFloat(n)) && isFinite(n)
    }

    function CapValue(valueToCap, maxValue, minValue) {
        if (isNumber(maxValue)) {
            if (valueToCap > maxValue) {
                return maxValue
            }
        }
        if (isNumber(minValue)) {
            if (valueToCap < minValue) {
                return minValue
            }
        }
        return valueToCap
    }

    function getDecimalPlaces(num) {
        var numberOfDecimalPlaces;
        if (num % 1 != 0) {
            return num.toString().split(".")[1].length
        } else {
            return 0
        }
    }

    function mergeChartConfig(defaults, userDefined) {
        var returnObj = {};
        for (var attrname in defaults) {
            returnObj[attrname] = defaults[attrname]
        }
        for (var attrname in userDefined) {
            returnObj[attrname] = userDefined[attrname]
        }
        return returnObj
    }
    var cache = {};

    function tmpl(str, data) {
        var fn = !/\W/.test(str) ? cache[str] = cache[str] || tmpl(document.getElementById(str).innerHTML) : new Function("obj", "var p=[],print=function(){p.push.apply(p,arguments);};" + "with(obj){p.push('" + str.replace(/[\r\t\n]/g, " ").split("<%").join("\t").replace(/((^|%>)[^\t]*)'/g, "$1\r").replace(/\t=(.*?)%>/g, "',$1,'").split("\t").join("');").split("%>").join("p.push('").split("\r").join("\\'") + "');}return p.join('');");
        return data ? fn(data) : fn
    }
};
jQuery.easing['jswing'] = jQuery.easing['swing'];
jQuery.extend(jQuery.easing, {
    def: 'easeOutQuad',
    swing: function(x, t, b, c, d) {
        return jQuery.easing[jQuery.easing.def](x, t, b, c, d)
    },
    easeInQuad: function(x, t, b, c, d) {
        return c * (t /= d) * t + b
    },
    easeOutQuad: function(x, t, b, c, d) {
        return -c * (t /= d) * (t - 2) + b
    },
    easeInOutQuad: function(x, t, b, c, d) {
        if ((t /= d / 2) < 1) return c / 2 * t * t + b;
        return -c / 2 * ((--t) * (t - 2) - 1) + b
    },
    easeInCubic: function(x, t, b, c, d) {
        return c * (t /= d) * t * t + b
    },
    easeOutCubic: function(x, t, b, c, d) {
        return c * ((t = t / d - 1) * t * t + 1) + b
    },
    easeInOutCubic: function(x, t, b, c, d) {
        if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
        return c / 2 * ((t -= 2) * t * t + 2) + b
    },
    easeInQuart: function(x, t, b, c, d) {
        return c * (t /= d) * t * t * t + b
    },
    easeOutQuart: function(x, t, b, c, d) {
        return -c * ((t = t / d - 1) * t * t * t - 1) + b
    },
    easeInOutQuart: function(x, t, b, c, d) {
        if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
        return -c / 2 * ((t -= 2) * t * t * t - 2) + b
    },
    easeInQuint: function(x, t, b, c, d) {
        return c * (t /= d) * t * t * t * t + b
    },
    easeOutQuint: function(x, t, b, c, d) {
        return c * ((t = t / d - 1) * t * t * t * t + 1) + b
    },
    easeInOutQuint: function(x, t, b, c, d) {
        if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
        return c / 2 * ((t -= 2) * t * t * t * t + 2) + b
    },
    easeInSine: function(x, t, b, c, d) {
        return -c * Math.cos(t / d * (Math.PI / 2)) + c + b
    },
    easeOutSine: function(x, t, b, c, d) {
        return c * Math.sin(t / d * (Math.PI / 2)) + b
    },
    easeInOutSine: function(x, t, b, c, d) {
        return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b
    },
    easeInExpo: function(x, t, b, c, d) {
        return (t == 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b
    },
    easeOutExpo: function(x, t, b, c, d) {
        return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b
    },
    easeInOutExpo: function(x, t, b, c, d) {
        if (t == 0) return b;
        if (t == d) return b + c;
        if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
        return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b
    },
    easeInCirc: function(x, t, b, c, d) {
        return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b
    },
    easeOutCirc: function(x, t, b, c, d) {
        return c * Math.sqrt(1 - (t = t / d - 1) * t) + b
    },
    easeInOutCirc: function(x, t, b, c, d) {
        if ((t /= d / 2) < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
        return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b
    },
    easeInElastic: function(x, t, b, c, d) {
        var s = 1.70158;
        var p = 0;
        var a = c;
        if (t == 0) return b;
        if ((t /= d) == 1) return b + c;
        if (!p) p = d * .3;
        if (a < Math.abs(c)) {
            a = c;
            var s = p / 4
        } else var s = p / (2 * Math.PI) * Math.asin(c / a);
        return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b
    },
    easeOutElastic: function(x, t, b, c, d) {
        var s = 1.70158;
        var p = 0;
        var a = c;
        if (t == 0) return b;
        if ((t /= d) == 1) return b + c;
        if (!p) p = d * .3;
        if (a < Math.abs(c)) {
            a = c;
            var s = p / 4
        } else var s = p / (2 * Math.PI) * Math.asin(c / a);
        return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b
    },
    easeInOutElastic: function(x, t, b, c, d) {
        var s = 1.70158;
        var p = 0;
        var a = c;
        if (t == 0) return b;
        if ((t /= d / 2) == 2) return b + c;
        if (!p) p = d * (.3 * 1.5);
        if (a < Math.abs(c)) {
            a = c;
            var s = p / 4
        } else var s = p / (2 * Math.PI) * Math.asin(c / a);
        if (t < 1) return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
        return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b
    },
    easeInBack: function(x, t, b, c, d, s) {
        if (s == undefined) s = 1.70158;
        return c * (t /= d) * t * ((s + 1) * t - s) + b
    },
    easeOutBack: function(x, t, b, c, d, s) {
        if (s == undefined) s = 1.70158;
        return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b
    },
    easeInOutBack: function(x, t, b, c, d, s) {
        if (s == undefined) s = 1.70158;
        if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
        return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b
    },
    easeInBounce: function(x, t, b, c, d) {
        return c - jQuery.easing.easeOutBounce(x, d - t, 0, c, d) + b
    },
    easeOutBounce: function(x, t, b, c, d) {
        if ((t /= d) < (1 / 2.75)) {
            return c * (7.5625 * t * t) + b
        } else if (t < (2 / 2.75)) {
            return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b
        } else if (t < (2.5 / 2.75)) {
            return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b
        } else {
            return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b
        }
    },
    easeInOutBounce: function(x, t, b, c, d) {
        if (t < d / 2) return jQuery.easing.easeInBounce(x, t * 2, 0, c, d) * .5 + b;
        return jQuery.easing.easeOutBounce(x, t * 2 - d, 0, c, d) * .5 + c * .5 + b
    }
});;
(function() {
    var j = false;
    window.JQClass = function() {};
    JQClass.classes = {};
    JQClass.extend = function extender(f) {
        var g = this.prototype;
        j = true;
        var h = new this();
        j = false;
        for (var i in f) {
            h[i] = typeof f[i] == 'function' && typeof g[i] == 'function' ? (function(d, e) {
                return function() {
                    var b = this._super;
                    this._super = function(a) {
                        return g[d].apply(this, a || [])
                    };
                    var c = e.apply(this, arguments);
                    this._super = b;
                    return c
                }
            })(i, f[i]) : f[i]
        }

        function JQClass() {
            if (!j && this._init) {
                this._init.apply(this, arguments)
            }
        }
        JQClass.prototype = h;
        JQClass.prototype.constructor = JQClass;
        JQClass.extend = extender;
        return JQClass
    }
})();
(function($) {
    JQClass.classes.JQPlugin = JQClass.extend({
        name: 'plugin',
        defaultOptions: {},
        regionalOptions: {},
        _getters: [],
        _getMarker: function() {
            return 'is-' + this.name
        },
        _init: function() {
            $.extend(this.defaultOptions, (this.regionalOptions && this.regionalOptions['']) || {});
            var c = camelCase(this.name);
            $[c] = this;
            $.fn[c] = function(a) {
                var b = Array.prototype.slice.call(arguments, 1);
                if ($[c]._isNotChained(a, b)) {
                    return $[c][a].apply($[c], [this[0]].concat(b))
                }
                return this.each(function() {
                    if (typeof a === 'string') {
                        if (a[0] === '_' || !$[c][a]) {
                            throw 'Unknown method: ' + a;
                        }
                        $[c][a].apply($[c], [this].concat(b))
                    } else {
                        $[c]._attach(this, a)
                    }
                })
            }
        },
        setDefaults: function(a) {
            $.extend(this.defaultOptions, a || {})
        },
        _isNotChained: function(a, b) {
            if (a === 'option' && (b.length === 0 || (b.length === 1 && typeof b[0] === 'string'))) {
                return true
            }
            return $.inArray(a, this._getters) > -1
        },
        _attach: function(a, b) {
            a = $(a);
            if (a.hasClass(this._getMarker())) {
                return
            }
            a.addClass(this._getMarker());
            b = $.extend({}, this.defaultOptions, this._getMetadata(a), b || {});
            var c = $.extend({
                name: this.name,
                elem: a,
                options: b
            }, this._instSettings(a, b));
            a.data(this.name, c);
            this._postAttach(a, c);
            this.option(a, b)
        },
        _instSettings: function(a, b) {
            return {}
        },
        _postAttach: function(a, b) {},
        _getMetadata: function(d) {
            try {
                var f = d.data(this.name.toLowerCase()) || '';
                f = f.replace(/'/g, '"');
                f = f.replace(/([a-zA-Z0-9]+):/g, function(a, b, i) {
                    var c = f.substring(0, i).match(/"/g);
                    return (!c || c.length % 2 === 0 ? '"' + b + '":' : b + ':')
                });
                f = $.parseJSON('{' + f + '}');
                for (var g in f) {
                    var h = f[g];
                    if (typeof h === 'string' && h.match(/^new Date\((.*)\)$/)) {
                        f[g] = eval(h)
                    }
                }
                return f
            } catch (e) {
                return {}
            }
        },
        _getInst: function(a) {
            return $(a).data(this.name) || {}
        },
        option: function(a, b, c) {
            a = $(a);
            var d = a.data(this.name);
            if (!b || (typeof b === 'string' && c == null)) {
                var e = (d || {}).options;
                return (e && b ? e[b] : e)
            }
            if (!a.hasClass(this._getMarker())) {
                return
            }
            var e = b || {};
            if (typeof b === 'string') {
                e = {};
                e[b] = c
            }
            this._optionsChanged(a, d, e);
            $.extend(d.options, e)
        },
        _optionsChanged: function(a, b, c) {},
        destroy: function(a) {
            a = $(a);
            if (!a.hasClass(this._getMarker())) {
                return
            }
            this._preDestroy(a, this._getInst(a));
            a.removeData(this.name).removeClass(this._getMarker())
        },
        _preDestroy: function(a, b) {}
    });

    function camelCase(c) {
        return c.replace(/-([a-z])/g, function(a, b) {
            return b.toUpperCase()
        })
    }
    $.JQPlugin = {
        createPlugin: function(a, b) {
            if (typeof a === 'object') {
                b = a;
                a = 'JQPlugin'
            }
            a = camelCase(a);
            var c = camelCase(b.name);
            JQClass.classes[c] = JQClass.classes[a].extend(b);
            new JQClass.classes[c]()
        }
    }
})(jQuery);;
(function($) {
    var pluginName = 'countdown';
    var Y = 0;
    var O = 1;
    var W = 2;
    var D = 3;
    var H = 4;
    var M = 5;
    var S = 6;
    $.JQPlugin.createPlugin({
        name: pluginName,
        defaultOptions: {
            until: null,
            since: null,
            timezone: null,
            serverSync: null,
            format: 'dHMS',
            layout: '',
            compact: false,
            padZeroes: false,
            significant: 0,
            description: '',
            expiryUrl: '',
            expiryText: '',
            alwaysExpire: false,
            onExpiry: null,
            onTick: null,
            tickInterval: 1
        },
        regionalOptions: {
            '': {
                labels: ['Years', 'Months', 'Weeks', 'Days', 'Hours', 'Minutes', 'Seconds'],
                labels1: ['Year', 'Month', 'Week', 'Day', 'Hour', 'Minute', 'Second'],
                compactLabels: ['y', 'm', 'w', 'd'],
                whichLabels: null,
                digits: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
                timeSeparator: ':',
                isRTL: false
            }
        },
        _getters: ['getTimes'],
        _rtlClass: pluginName + '-rtl',
        _sectionClass: pluginName + '-section',
        _amountClass: pluginName + '-amount',
        _periodClass: pluginName + '-period',
        _rowClass: pluginName + '-row',
        _holdingClass: pluginName + '-holding',
        _showClass: pluginName + '-show',
        _descrClass: pluginName + '-descr',
        _timerElems: [],
        _init: function() {
            var self = this;
            this._super();
            this._serverSyncs = [];
            var now = (typeof Date.now == 'function' ? Date.now : function() {
                return new Date().getTime()
            });
            var perfAvail = (window.performance && typeof window.performance.now == 'function');

            function timerCallBack(timestamp) {
                var drawStart = (timestamp < 1e12 ? (perfAvail ? (performance.now() + performance.timing.navigationStart) : now()) : timestamp || now());
                if (drawStart - animationStartTime >= 1000) {
                    self._updateElems();
                    animationStartTime = drawStart
                }
                requestAnimationFrame(timerCallBack)
            }
            var requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || null;
            var animationStartTime = 0;
            if (!requestAnimationFrame || $.noRequestAnimationFrame) {
                $.noRequestAnimationFrame = null;
                setInterval(function() {
                    self._updateElems()
                }, 980)
            } else {
                animationStartTime = window.animationStartTime || window.webkitAnimationStartTime || window.mozAnimationStartTime || window.oAnimationStartTime || window.msAnimationStartTime || now();
                requestAnimationFrame(timerCallBack)
            }
        },
        UTCDate: function(tz, year, month, day, hours, mins, secs, ms) {
            if (typeof year == 'object' && year.constructor == Date) {
                ms = year.getMilliseconds();
                secs = year.getSeconds();
                mins = year.getMinutes();
                hours = year.getHours();
                day = year.getDate();
                month = year.getMonth();
                year = year.getFullYear()
            }
            var d = new Date();
            d.setUTCFullYear(year);
            d.setUTCDate(1);
            d.setUTCMonth(month || 0);
            d.setUTCDate(day || 1);
            d.setUTCHours(hours || 0);
            d.setUTCMinutes((mins || 0) - (Math.abs(tz) < 30 ? tz * 60 : tz));
            d.setUTCSeconds(secs || 0);
            d.setUTCMilliseconds(ms || 0);
            return d
        },
        periodsToSeconds: function(periods) {
            return periods[0] * 31557600 + periods[1] * 2629800 + periods[2] * 604800 + periods[3] * 86400 + periods[4] * 3600 + periods[5] * 60 + periods[6]
        },
        resync: function() {
            var self = this;
            $('.' + this._getMarker()).each(function() {
                var inst = $.data(this, self.name);
                if (inst.options.serverSync) {
                    var serverSync = null;
                    for (var i = 0; i < self._serverSyncs.length; i++) {
                        if (self._serverSyncs[i][0] == inst.options.serverSync) {
                            serverSync = self._serverSyncs[i];
                            break
                        }
                    }
                    if (serverSync[2] == null) {
                        var serverResult = ($.isFunction(inst.options.serverSync) ? inst.options.serverSync.apply(this, []) : null);
                        serverSync[2] = (serverResult ? new Date().getTime() - serverResult.getTime() : 0) - serverSync[1]
                    }
                    if (inst._since) {
                        inst._since.setMilliseconds(inst._since.getMilliseconds() + serverSync[2])
                    }
                    inst._until.setMilliseconds(inst._until.getMilliseconds() + serverSync[2])
                }
            });
            for (var i = 0; i < self._serverSyncs.length; i++) {
                if (self._serverSyncs[i][2] != null) {
                    self._serverSyncs[i][1] += self._serverSyncs[i][2];
                    delete self._serverSyncs[i][2]
                }
            }
        },
        _instSettings: function(elem, options) {
            return {
                _periods: [0, 0, 0, 0, 0, 0, 0]
            }
        },
        _addElem: function(elem) {
            if (!this._hasElem(elem)) {
                this._timerElems.push(elem)
            }
        },
        _hasElem: function(elem) {
            return ($.inArray(elem, this._timerElems) > -1)
        },
        _removeElem: function(elem) {
            this._timerElems = $.map(this._timerElems, function(value) {
                return (value == elem ? null : value)
            })
        },
        _updateElems: function() {
            for (var i = this._timerElems.length - 1; i >= 0; i--) {
                this._updateCountdown(this._timerElems[i])
            }
        },
        _optionsChanged: function(elem, inst, options) {
            if (options.layout) {
                options.layout = options.layout.replace(/&lt;/g, '<').replace(/&gt;/g, '>')
            }
            this._resetExtraLabels(inst.options, options);
            var timezoneChanged = (inst.options.timezone != options.timezone);
            $.extend(inst.options, options);
            this._adjustSettings(elem, inst, options.until != null || options.since != null || timezoneChanged);
            var now = new Date();
            if ((inst._since && inst._since < now) || (inst._until && inst._until > now)) {
                this._addElem(elem[0])
            }
            this._updateCountdown(elem, inst)
        },
        _updateCountdown: function(elem, inst) {
            elem = elem.jquery ? elem : $(elem);
            inst = inst || this._getInst(elem);
            if (!inst || !inst.options) {
                return
            }
            elem.html(this._generateHTML(inst)).toggleClass(this._rtlClass, inst.options.isRTL);
            if ($.isFunction(inst.options.onTick)) {
                var periods = inst._hold != 'lap' ? inst._periods : this._calculatePeriods(inst, inst._show, inst.options.significant, new Date());
                if (inst.options.tickInterval == 1 || this.periodsToSeconds(periods) % inst.options.tickInterval == 0) {
                    inst.options.onTick.apply(elem[0], [periods])
                }
            }
            var expired = inst._hold != 'pause' && (inst._since ? inst._now.getTime() < inst._since.getTime() : inst._now.getTime() >= inst._until.getTime());
            if (expired && !inst._expiring) {
                inst._expiring = true;
                if (this._hasElem(elem[0]) || inst.options.alwaysExpire) {
                    this._removeElem(elem[0]);
                    if ($.isFunction(inst.options.onExpiry)) {
                        inst.options.onExpiry.apply(elem[0], [])
                    }
                    if (inst.options.expiryText) {
                        var layout = inst.options.layout;
                        inst.options.layout = inst.options.expiryText;
                        this._updateCountdown(elem[0], inst);
                        inst.options.layout = layout
                    }
                    if (inst.options.expiryUrl) {
                        window.location = inst.options.expiryUrl
                    }
                }
                inst._expiring = false
            } else if (inst._hold == 'pause') {
                this._removeElem(elem[0])
            }
        },
        _resetExtraLabels: function(base, options) {
            for (var n in options) {
                if (n.match(/[Ll]abels[02-9]|compactLabels1/)) {
                    base[n] = options[n]
                }
            }
            for (var n in base) {
                if (n.match(/[Ll]abels[02-9]|compactLabels1/) && typeof options[n] === 'undefined') {
                    base[n] = null
                }
            }
        },
        _adjustSettings: function(elem, inst, recalc) {
            var serverEntry = null;
            for (var i = 0; i < this._serverSyncs.length; i++) {
                if (this._serverSyncs[i][0] == inst.options.serverSync) {
                    serverEntry = this._serverSyncs[i][1];
                    break
                }
            }
            if (serverEntry != null) {
                var serverOffset = (inst.options.serverSync ? serverEntry : 0);
                var now = new Date()
            } else {
                var serverResult = ($.isFunction(inst.options.serverSync) ? inst.options.serverSync.apply(elem[0], []) : null);
                var now = new Date();
                var serverOffset = (serverResult ? now.getTime() - serverResult.getTime() : 0);
                this._serverSyncs.push([inst.options.serverSync, serverOffset])
            }
            var timezone = inst.options.timezone;
            timezone = (timezone == null ? -now.getTimezoneOffset() : timezone);
            if (recalc || (!recalc && inst._until == null && inst._since == null)) {
                inst._since = inst.options.since;
                if (inst._since != null) {
                    inst._since = this.UTCDate(timezone, this._determineTime(inst._since, null));
                    if (inst._since && serverOffset) {
                        inst._since.setMilliseconds(inst._since.getMilliseconds() + serverOffset)
                    }
                }
                inst._until = this.UTCDate(timezone, this._determineTime(inst.options.until, now));
                if (serverOffset) {
                    inst._until.setMilliseconds(inst._until.getMilliseconds() + serverOffset)
                }
            }
            inst._show = this._determineShow(inst)
        },
        _preDestroy: function(elem, inst) {
            this._removeElem(elem[0]);
            elem.empty()
        },
        pause: function(elem) {
            this._hold(elem, 'pause')
        },
        lap: function(elem) {
            this._hold(elem, 'lap')
        },
        resume: function(elem) {
            this._hold(elem, null)
        },
        toggle: function(elem) {
            var inst = $.data(elem, this.name) || {};
            this[!inst._hold ? 'pause' : 'resume'](elem)
        },
        toggleLap: function(elem) {
            var inst = $.data(elem, this.name) || {};
            this[!inst._hold ? 'lap' : 'resume'](elem)
        },
        _hold: function(elem, hold) {
            var inst = $.data(elem, this.name);
            if (inst) {
                if (inst._hold == 'pause' && !hold) {
                    inst._periods = inst._savePeriods;
                    var sign = (inst._since ? '-' : '+');
                    inst[inst._since ? '_since' : '_until'] = this._determineTime(sign + inst._periods[0] + 'y' + sign + inst._periods[1] + 'o' + sign + inst._periods[2] + 'w' + sign + inst._periods[3] + 'd' + sign + inst._periods[4] + 'h' + sign + inst._periods[5] + 'm' + sign + inst._periods[6] + 's');
                    this._addElem(elem)
                }
                inst._hold = hold;
                inst._savePeriods = (hold == 'pause' ? inst._periods : null);
                $.data(elem, this.name, inst);
                this._updateCountdown(elem, inst)
            }
        },
        getTimes: function(elem) {
            var inst = $.data(elem, this.name);
            return (!inst ? null : (inst._hold == 'pause' ? inst._savePeriods : (!inst._hold ? inst._periods : this._calculatePeriods(inst, inst._show, inst.options.significant, new Date()))))
        },
        _determineTime: function(setting, defaultTime) {
            var self = this;
            var offsetNumeric = function(offset) {
                var time = new Date();
                time.setTime(time.getTime() + offset * 1000);
                return time
            };
            var offsetString = function(offset) {
                offset = offset.toLowerCase();
                var time = new Date();
                var year = time.getFullYear();
                var month = time.getMonth();
                var day = time.getDate();
                var hour = time.getHours();
                var minute = time.getMinutes();
                var second = time.getSeconds();
                var pattern = /([+-]?[0-9]+)\s*(s|m|h|d|w|o|y)?/g;
                var matches = pattern.exec(offset);
                while (matches) {
                    switch (matches[2] || 's') {
                        case 's':
                            second += parseInt(matches[1], 10);
                            break;
                        case 'm':
                            minute += parseInt(matches[1], 10);
                            break;
                        case 'h':
                            hour += parseInt(matches[1], 10);
                            break;
                        case 'd':
                            day += parseInt(matches[1], 10);
                            break;
                        case 'w':
                            day += parseInt(matches[1], 10) * 7;
                            break;
                        case 'o':
                            month += parseInt(matches[1], 10);
                            day = Math.min(day, self._getDaysInMonth(year, month));
                            break;
                        case 'y':
                            year += parseInt(matches[1], 10);
                            day = Math.min(day, self._getDaysInMonth(year, month));
                            break
                    }
                    matches = pattern.exec(offset)
                }
                return new Date(year, month, day, hour, minute, second, 0)
            };
            var time = (setting == null ? defaultTime : (typeof setting == 'string' ? offsetString(setting) : (typeof setting == 'number' ? offsetNumeric(setting) : setting)));
            if (time) time.setMilliseconds(0);
            return time
        },
        _getDaysInMonth: function(year, month) {
            return 32 - new Date(year, month, 32).getDate()
        },
        _normalLabels: function(num) {
            return num
        },
        _generateHTML: function(inst) {
            var self = this;
            inst._periods = (inst._hold ? inst._periods : this._calculatePeriods(inst, inst._show, inst.options.significant, new Date()));
            var shownNonZero = false;
            var showCount = 0;
            var sigCount = inst.options.significant;
            var show = $.extend({}, inst._show);
            for (var period = Y; period <= S; period++) {
                shownNonZero |= (inst._show[period] == '?' && inst._periods[period] > 0);
                show[period] = (inst._show[period] == '?' && !shownNonZero ? null : inst._show[period]);
                showCount += (show[period] ? 1 : 0);
                sigCount -= (inst._periods[period] > 0 ? 1 : 0)
            }
            var showSignificant = [false, false, false, false, false, false, false];
            for (var period = S; period >= Y; period--) {
                if (inst._show[period]) {
                    if (inst._periods[period]) {
                        showSignificant[period] = true
                    } else {
                        showSignificant[period] = sigCount > 0;
                        sigCount--
                    }
                }
            }
            var labels = (inst.options.compact ? inst.options.compactLabels : inst.options.labels);
            var whichLabels = inst.options.whichLabels || this._normalLabels;
            var showCompact = function(period) {
                var labelsNum = inst.options['compactLabels' + whichLabels(inst._periods[period])];
                return (show[period] ? self._translateDigits(inst, inst._periods[period]) + (labelsNum ? labelsNum[period] : labels[period]) + ' ' : '')
            };
            var minDigits = (inst.options.padZeroes ? 2 : 1);
            var showFull = function(period) {
                var labelsNum = inst.options['labels' + whichLabels(inst._periods[period])];
                return ((!inst.options.significant && show[period]) || (inst.options.significant && showSignificant[period]) ? '<span class="' + self._sectionClass + '">' + '<span class="' + self._amountClass + '">' + self._minDigits(inst, inst._periods[period], minDigits) + '</span>' + '<span class="countdown_separator"></span>' + '<span class="' + self._periodClass + '">' + (labelsNum ? labelsNum[period] : labels[period]) + '</span></span>' : '')
            };
            return (inst.options.layout ? this._buildLayout(inst, show, inst.options.layout, inst.options.compact, inst.options.significant, showSignificant) : ((inst.options.compact ? '<span class="' + this._rowClass + ' ' + this._amountClass + (inst._hold ? ' ' + this._holdingClass : '') + '">' + showCompact(Y) + showCompact(O) + showCompact(W) + showCompact(D) + (show[H] ? this._minDigits(inst, inst._periods[H], 2) : '') + (show[M] ? (show[H] ? inst.options.timeSeparator : '') + this._minDigits(inst, inst._periods[M], 2) : '') + (show[S] ? (show[H] || show[M] ? inst.options.timeSeparator : '') + this._minDigits(inst, inst._periods[S], 2) : '') : '<span class="' + this._rowClass + ' ' + this._showClass + (inst.options.significant || showCount) + (inst._hold ? ' ' + this._holdingClass : '') + '">' + showFull(Y) + showFull(O) + showFull(W) + showFull(D) + showFull(H) + showFull(M) + showFull(S)) + '</span>' + (inst.options.description ? '<span class="' + this._rowClass + ' ' + this._descrClass + '">' + inst.options.description + '</span>' : '')))
        },
        _buildLayout: function(inst, show, layout, compact, significant, showSignificant) {
            var labels = inst.options[compact ? 'compactLabels' : 'labels'];
            var whichLabels = inst.options.whichLabels || this._normalLabels;
            var labelFor = function(index) {
                return (inst.options[(compact ? 'compactLabels' : 'labels') + whichLabels(inst._periods[index])] || labels)[index]
            };
            var digit = function(value, position) {
                return inst.options.digits[Math.floor(value / position) % 10]
            };
            var subs = {
                desc: inst.options.description,
                sep: inst.options.timeSeparator,
                yl: labelFor(Y),
                yn: this._minDigits(inst, inst._periods[Y], 1),
                ynn: this._minDigits(inst, inst._periods[Y], 2),
                ynnn: this._minDigits(inst, inst._periods[Y], 3),
                y1: digit(inst._periods[Y], 1),
                y10: digit(inst._periods[Y], 10),
                y100: digit(inst._periods[Y], 100),
                y1000: digit(inst._periods[Y], 1000),
                ol: labelFor(O),
                on: this._minDigits(inst, inst._periods[O], 1),
                onn: this._minDigits(inst, inst._periods[O], 2),
                onnn: this._minDigits(inst, inst._periods[O], 3),
                o1: digit(inst._periods[O], 1),
                o10: digit(inst._periods[O], 10),
                o100: digit(inst._periods[O], 100),
                o1000: digit(inst._periods[O], 1000),
                wl: labelFor(W),
                wn: this._minDigits(inst, inst._periods[W], 1),
                wnn: this._minDigits(inst, inst._periods[W], 2),
                wnnn: this._minDigits(inst, inst._periods[W], 3),
                w1: digit(inst._periods[W], 1),
                w10: digit(inst._periods[W], 10),
                w100: digit(inst._periods[W], 100),
                w1000: digit(inst._periods[W], 1000),
                dl: labelFor(D),
                dn: this._minDigits(inst, inst._periods[D], 1),
                dnn: this._minDigits(inst, inst._periods[D], 2),
                dnnn: this._minDigits(inst, inst._periods[D], 3),
                d1: digit(inst._periods[D], 1),
                d10: digit(inst._periods[D], 10),
                d100: digit(inst._periods[D], 100),
                d1000: digit(inst._periods[D], 1000),
                hl: labelFor(H),
                hn: this._minDigits(inst, inst._periods[H], 1),
                hnn: this._minDigits(inst, inst._periods[H], 2),
                hnnn: this._minDigits(inst, inst._periods[H], 3),
                h1: digit(inst._periods[H], 1),
                h10: digit(inst._periods[H], 10),
                h100: digit(inst._periods[H], 100),
                h1000: digit(inst._periods[H], 1000),
                ml: labelFor(M),
                mn: this._minDigits(inst, inst._periods[M], 1),
                mnn: this._minDigits(inst, inst._periods[M], 2),
                mnnn: this._minDigits(inst, inst._periods[M], 3),
                m1: digit(inst._periods[M], 1),
                m10: digit(inst._periods[M], 10),
                m100: digit(inst._periods[M], 100),
                m1000: digit(inst._periods[M], 1000),
                sl: labelFor(S),
                sn: this._minDigits(inst, inst._periods[S], 1),
                snn: this._minDigits(inst, inst._periods[S], 2),
                snnn: this._minDigits(inst, inst._periods[S], 3),
                s1: digit(inst._periods[S], 1),
                s10: digit(inst._periods[S], 10),
                s100: digit(inst._periods[S], 100),
                s1000: digit(inst._periods[S], 1000)
            };
            var html = layout;
            for (var i = Y; i <= S; i++) {
                var period = 'yowdhms'.charAt(i);
                var re = new RegExp('\\{' + period + '<\\}([\\s\\S]*)\\{' + period + '>\\}', 'g');
                html = html.replace(re, ((!significant && show[i]) || (significant && showSignificant[i]) ? '$1' : ''))
            }
            $.each(subs, function(n, v) {
                var re = new RegExp('\\{' + n + '\\}', 'g');
                html = html.replace(re, v)
            });
            return html
        },
        _minDigits: function(inst, value, len) {
            value = '' + value;
            if (value.length >= len) {
                return this._translateDigits(inst, value)
            }
            value = '0000000000' + value;
            return this._translateDigits(inst, value.substr(value.length - len))
        },
        _translateDigits: function(inst, value) {
            return ('' + value).replace(/[0-9]/g, function(digit) {
                return inst.options.digits[digit]
            })
        },
        _determineShow: function(inst) {
            var format = inst.options.format;
            var show = [];
            show[Y] = (format.match('y') ? '?' : (format.match('Y') ? '!' : null));
            show[O] = (format.match('o') ? '?' : (format.match('O') ? '!' : null));
            show[W] = (format.match('w') ? '?' : (format.match('W') ? '!' : null));
            show[D] = (format.match('d') ? '?' : (format.match('D') ? '!' : null));
            show[H] = (format.match('h') ? '?' : (format.match('H') ? '!' : null));
            show[M] = (format.match('m') ? '?' : (format.match('M') ? '!' : null));
            show[S] = (format.match('s') ? '?' : (format.match('S') ? '!' : null));
            return show
        },
        _calculatePeriods: function(inst, show, significant, now) {
            inst._now = now;
            inst._now.setMilliseconds(0);
            var until = new Date(inst._now.getTime());
            if (inst._since) {
                if (now.getTime() < inst._since.getTime()) {
                    inst._now = now = until
                } else {
                    now = inst._since
                }
            } else {
                until.setTime(inst._until.getTime());
                if (now.getTime() > inst._until.getTime()) {
                    inst._now = now = until
                }
            }
            var periods = [0, 0, 0, 0, 0, 0, 0];
            if (show[Y] || show[O]) {
                var lastNow = this._getDaysInMonth(now.getFullYear(), now.getMonth());
                var lastUntil = this._getDaysInMonth(until.getFullYear(), until.getMonth());
                var sameDay = (until.getDate() == now.getDate() || (until.getDate() >= Math.min(lastNow, lastUntil) && now.getDate() >= Math.min(lastNow, lastUntil)));
                var getSecs = function(date) {
                    return (date.getHours() * 60 + date.getMinutes()) * 60 + date.getSeconds()
                };
                var months = Math.max(0, (until.getFullYear() - now.getFullYear()) * 12 + until.getMonth() - now.getMonth() + ((until.getDate() < now.getDate() && !sameDay) || (sameDay && getSecs(until) < getSecs(now)) ? -1 : 0));
                periods[Y] = (show[Y] ? Math.floor(months / 12) : 0);
                periods[O] = (show[O] ? months - periods[Y] * 12 : 0);
                now = new Date(now.getTime());
                var wasLastDay = (now.getDate() == lastNow);
                var lastDay = this._getDaysInMonth(now.getFullYear() + periods[Y], now.getMonth() + periods[O]);
                if (now.getDate() > lastDay) {
                    now.setDate(lastDay)
                }
                now.setFullYear(now.getFullYear() + periods[Y]);
                now.setMonth(now.getMonth() + periods[O]);
                if (wasLastDay) {
                    now.setDate(lastDay)
                }
            }
            var diff = Math.floor((until.getTime() - now.getTime()) / 1000);
            var extractPeriod = function(period, numSecs) {
                periods[period] = (show[period] ? Math.floor(diff / numSecs) : 0);
                diff -= periods[period] * numSecs
            };
            extractPeriod(W, 604800);
            extractPeriod(D, 86400);
            extractPeriod(H, 3600);
            extractPeriod(M, 60);
            extractPeriod(S, 1);
            if (diff > 0 && !inst._since) {
                var multiplier = [1, 12, 4.3482, 7, 24, 60, 60];
                var lastShown = S;
                var max = 1;
                for (var period = S; period >= Y; period--) {
                    if (show[period]) {
                        if (periods[lastShown] >= max) {
                            periods[lastShown] = 0;
                            diff = 1
                        }
                        if (diff > 0) {
                            periods[period]++;
                            diff = 0;
                            lastShown = period;
                            max = 1
                        }
                    }
                    max *= multiplier[period]
                }
            }
            if (significant) {
                for (var period = Y; period <= S; period++) {
                    if (significant && periods[period]) {
                        significant--
                    } else if (!significant) {
                        periods[period] = 0
                    }
                }
            }
            return periods
        }
    })
})(jQuery);;
/**
 * multiscroll.js 0.1.5 Beta
 * https://github.com/alvarotrigo/multiscroll.js
 * MIT licensed
 *
 * Copyright (C) 2013 alvarotrigo.com - A project by Alvaro Trigo
 *
 * ADDED: added destroy plugin's events function
 */
(function($) {
    $.fn.multiscroll = function(options) {
        options = $.extend({
            'verticalCentered': true,
            'scrollingSpeed': 700,
            'easing': 'easeInQuart',
            'menu': false,
            'sectionsColor': [],
            'anchors': [],
            'navigation': false,
            'navigationPosition': 'right',
            'navigationColor': '#000',
            'navigationTooltips': [],
            'loopBottom': false,
            'loopTop': false,
            'css3': false,
            'paddingTop': 0,
            'paddingBottom': 0,
            'fixedElements': null,
            'normalScrollElements': null,
            'keyboardScrolling': true,
            'touchSensitivity': 5,
            'sectionSelector': '.ms-section',
            'leftSelector': '.ms-left',
            'rightSelector': '.ms-right',
            'afterLoad': null,
            'onLeave': null,
            'afterRender': null,
            'afterResize': null
        }, options);
        var scrollDelay = 600;
        var isTouch = (('ontouchstart' in window) || (navigator.msMaxTouchPoints > 0));
        if (options.rightSelector !== '.ms-right') {
            $(options.rightSelector).addClass('ms-right')
        }
        if (options.leftSelector !== '.ms-left') {
            $(options.leftSelector).addClass('ms-left')
        }
        var numberSections = $('.ms-left').find('.ms-section').length;
        var isMoving = false;
        var nav;
        var windowHeight = $(window).height();
        addMouseWheelHandler();
        addTouchHandler();
        if (options.css3) {
            options.css3 = support3d()
        }
        $('html, body').css({
            'overflow': 'hidden',
            'height': '100%'
        });
        if (options.sectionSelector !== '.ms-section') {
            $(options.sectionSelector).each(function() {
                $(this).addClass('ms-section')
            })
        }
        if (options.navigation) {
            $('body').append('<div id="multiscroll-nav"><ul></ul></div>');
            nav = $('#multiscroll-nav');
            nav.css('color', options.navigationColor);
            nav.addClass(options.navigationPosition)
        }
        $('.ms-right, .ms-left').css({
            'width': '50%',
            'position': 'absolute',
            'height': '100%',
            '-ms-touch-action': 'none'
        });
        $('.ms-right').css({
            'right': '1px',
            'top': '0',
            '-ms-touch-action': 'none',
            'touch-action': 'none'
        });
        $('.ms-left').css({
            'left': '0',
            'top': '0',
            '-ms-touch-action': 'none',
            'touch-action': 'none'
        });
        $('.ms-left .ms-section, .ms-right .ms-section').each(function() {
            var sectionIndex = $(this).index();
            if (options.paddingTop || options.paddingBottom) {
                $(this).css('padding', options.paddingTop + ' 0 ' + options.paddingBottom + ' 0')
            }
            if (typeof options.sectionsColor[sectionIndex] !== 'undefined') {
                $(this).css('background-color', options.sectionsColor[sectionIndex])
            }
            if (typeof options.anchors[sectionIndex] !== 'undefined') {
                $(this).attr('data-anchor', options.anchors[sectionIndex])
            }
            if (options.verticalCentered) {
                addTableClass($(this))
            }
            if ($(this).closest('.ms-left').length && options.navigation) {
                var link = '';
                if (options.anchors.length) {
                    link = options.anchors[sectionIndex]
                }
                var tooltip = options.navigationTooltips[sectionIndex];
                if (typeof tooltip === 'undefined') {
                    tooltip = ''
                }
                if (options.navigation) {
                    nav.find('ul').append('<li data-tooltip="' + tooltip + '"><a href="#' + link + '"><span></span></a></li>')
                }
            }
        });
        $('.ms-right').html($('.ms-right').find('.ms-section').get().reverse());
        $('.ms-left .ms-section, .ms-right .ms-section').each(function() {
            var sectionIndex = $(this).index();
            $(this).css({
                'height': '100%'
            });
            if (!sectionIndex && options.navigation) {
                nav.find('li').eq(sectionIndex).find('a').addClass('active')
            }
        }).promise().done(function() {
            if (!$('.ms-left .ms-section.active').length) {
                $('.ms-right').find('.ms-section').last().addClass('active');
                $('.ms-left').find('.ms-section').first().addClass('active')
            }
            $.isFunction(options.afterRender) && options.afterRender.call(this);
            silentScroll();
            $(window).on('load', function() {
                scrollToAnchor()
            })
        });
        $(window).on('hashchange', hashChangeHandler);

        function hashChangeHandler() {
            var value = window.location.hash.replace('#', '');
            var sectionAnchor = value;
            if (sectionAnchor.length) {
                var section = $('.ms-left').find('[data-anchor="' + sectionAnchor + '"]');
                var isFirstScrollMove = (typeof lastScrolledDestiny === 'undefined');
                if (isFirstScrollMove || sectionAnchor !== lastScrolledDestiny) {
                    scrollPage(section)
                }
            }
        };
        $(document).keydown(function(e) {
            if (e.which == 40 || e.which == 38) {
                e.preventDefault()
            }
            if (options.keyboardScrolling && !isMoving) {
                switch (e.which) {
                    case 38:
                    case 33:
                        $.fn.multiscroll.moveSectionUp();
                        break;
                    case 40:
                    case 34:
                        $.fn.multiscroll.moveSectionDown();
                        break;
                    case 36:
                        $.fn.multiscroll.moveTo(1);
                        break;
                    case 35:
                        $.fn.multiscroll.moveTo($('.ms-left .ms-section').length);
                        break;
                    default:
                        return
                }
            }
        });
        $(document).mousedown(function(e) {
            if (e.button == 1) {
                e.preventDefault();
                return false
            }
        });
        $(document).on('click', '#multiscroll-nav a', function(e) {
            e.preventDefault();
            var index = $(this).parent().index();
            scrollPage($('.ms-left .ms-section').eq(index))
        });
        $(document).on({
            mouseenter: function() {
                var tooltip = $(this).data('tooltip');
                $('<div class="multiscroll-tooltip ' + options.navigationPosition + '">' + tooltip + '</div>').hide().appendTo($(this)).fadeIn(200)
            },
            mouseleave: function() {
                $(this).find('.multiscroll-tooltip').fadeOut(200, function() {
                    $(this).remove()
                })
            }
        }, '#multiscroll-nav li');
        if (options.normalScrollElements) {
            $(document).on('mouseenter', options.normalScrollElements, function() {
                $.fn.multiscroll.setMouseWheelScrolling(false)
            });
            $(document).on('mouseleave', options.normalScrollElements, function() {
                $.fn.multiscroll.setMouseWheelScrolling(true)
            })
        }
        $(window).on('resize', doneResizing);

        function doneResizing() {
            windowHeight = $(window).height();
            $('.ms-tableCell').each(function() {
                $(this).css({
                    height: getTableHeight($(this).parent())
                })
            });
            silentScroll();
            $.isFunction(options.afterResize) && options.afterResize.call(this)
        }

        function silentScroll() {
            if (options.css3) {
                transformContainer($('.ms-left'), 'translate3d(0px, -' + $('.ms-left').find('.ms-section.active').position().top + 'px, 0px)', false);
                transformContainer($('.ms-right'), 'translate3d(0px, -' + $('.ms-right').find('.ms-section.active').position().top + 'px, 0px)', false)
            } else {
                $('.ms-left').css('top', -$('.ms-left').find('.ms-section.active').position().top);
                $('.ms-right').css('top', -$('.ms-right').find('.ms-section.active').position().top)
            }
        }
        $.fn.multiscroll.moveSectionUp = function() {
            var prev = $('.ms-left .ms-section.active').prev('.ms-section');
            if (!prev.length && options.loopTop) {
                prev = $('.ms-left .ms-section').last()
            }
            if (prev.length) {
                scrollPage(prev)
            }
        };
        $.fn.multiscroll.moveSectionDown = function() {
            var next = $('.ms-left .ms-section.active').next('.ms-section');
            if (!next.length && options.loopBottom) {
                next = $('.ms-left .ms-section').first()
            }
            if (next.length) {
                scrollPage(next)
            }
        };
        $.fn.multiscroll.moveTo = function(section) {
            var destiny = '';
            if (isNaN(section)) {
                destiny = $('.ms-left [data-anchor="' + section + '"]')
            } else {
                destiny = $('.ms-left .ms-section').eq((section - 1))
            }
            scrollPage(destiny)
        };

        function scrollPage(leftDestination) {
            var leftDestinationIndex = leftDestination.index();
            var rightDestination = $('.ms-right').find('.ms-section').eq(numberSections - 1 - leftDestinationIndex);
            var rightDestinationIndex = numberSections - 1 - leftDestinationIndex;
            var anchorLink = leftDestination.data('anchor');
            var activeSection = $('.ms-left .ms-section.active');
            var leavingSection = activeSection.index() + 1;
            var yMovement = getYmovement(leftDestination);
            isMoving = true;
            setURLHash(anchorLink);
            var topPos = {
                'left': leftDestination.position().top,
                'right': rightDestination.position().top
            };
            rightDestination.addClass('active').siblings().removeClass('active');
            leftDestination.addClass('active').siblings().removeClass('active');
            if (options.css3) {
                $.isFunction(options.onLeave) && options.onLeave.call(this, leavingSection, (leftDestinationIndex + 1), yMovement);
                var translate3dLeft = 'translate3d(0px, -' + topPos['left'] + 'px, 0px)';
                var translate3dRight = 'translate3d(0px, -' + topPos['right'] + 'px, 0px)';
                transformContainer($('.ms-left'), translate3dLeft, true);
                transformContainer($('.ms-right'), translate3dRight, true);
                setTimeout(function() {
                    $.isFunction(options.afterLoad) && options.afterLoad.call(this, anchorLink, (leftDestinationIndex + 1));
                    setTimeout(function() {
                        isMoving = false
                    }, scrollDelay)
                }, options.scrollingSpeed)
            } else {
                $.isFunction(options.onLeave) && options.onLeave.call(this, leavingSection, (leftDestinationIndex + 1), yMovement);
                $('.ms-left').animate({
                    'top': -topPos['left']
                }, options.scrollingSpeed, options.easing, function() {
                    $.isFunction(options.afterLoad) && options.afterLoad.call(this, anchorLink, (leftDestinationIndex + 1));
                    setTimeout(function() {
                        isMoving = false
                    }, scrollDelay)
                });
                $('.ms-right').animate({
                    'top': -topPos['right']
                }, options.scrollingSpeed, options.easing)
            }
            lastScrolledDestiny = anchorLink;
            activateMenuElement(anchorLink);
            activateNavDots(anchorLink, leftDestinationIndex)
        }

        function removeMouseWheelHandler() {
            if (document.addEventListener) {
                document.removeEventListener('mousewheel', MouseWheelHandler, false);
                document.removeEventListener('wheel', MouseWheelHandler, false)
            } else {
                document.detachEvent("onmousewheel", MouseWheelHandler)
            }
        }

        function addMouseWheelHandler() {
            if (document.addEventListener) {
                document.addEventListener("mousewheel", MouseWheelHandler, false);
                document.addEventListener("wheel", MouseWheelHandler, false)
            } else {
                document.attachEvent("onmousewheel", MouseWheelHandler)
            }
        }

        function MouseWheelHandler(e) {
            e = window.event || e;
            var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.deltaY || -e.detail)));
            if (!isMoving) {
                if (delta < 0) {
                    $.fn.multiscroll.moveSectionDown()
                } else {
                    $.fn.multiscroll.moveSectionUp()
                }
            }
            return false
        }

        function transformContainer(container, translate3d, animated) {
            container.toggleClass('ms-easing', animated);
            container.css(getTransforms(translate3d))
        }

        function getTransforms(translate3d) {
            return {
                '-webkit-transform': translate3d,
                '-moz-transform': translate3d,
                '-ms-transform': translate3d,
                'transform': translate3d
            }
        }

        function activateNavDots(name, sectionIndex) {
            if (options.navigation) {
                $('#multiscroll-nav').find('.active').removeClass('active');
                if (name) {
                    $('#multiscroll-nav').find('a[href="#' + name + '"]').addClass('active')
                } else {
                    $('#multiscroll-nav').find('li').eq(sectionIndex).find('a').addClass('active')
                }
            }
        }

        function activateMenuElement(name) {
            if (options.menu) {
                $(options.menu).find('.active').removeClass('active');
                $(options.menu).find('[data-menuanchor="' + name + '"]').addClass('active')
            }
        }

        function getYmovement(destiny) {
            var fromIndex = $('.ms-left .ms-section.active').index();
            var toIndex = destiny.index();
            if (fromIndex > toIndex) {
                return 'up'
            }
            return 'down'
        }

        function setURLHash(anchorLink) {
            if (options.anchors.length) {
                location.hash = anchorLink
            }
        }

        function support3d() {
            var el = document.createElement('p'),
                has3d, transforms = {
                    'webkitTransform': '-webkit-transform',
                    'OTransform': '-o-transform',
                    'msTransform': '-ms-transform',
                    'MozTransform': '-moz-transform',
                    'transform': 'transform'
                };
            document.body.insertBefore(el, null);
            for (var t in transforms) {
                if (el.style[t] !== undefined) {
                    el.style[t] = "translate3d(1px,1px,1px)";
                    has3d = window.getComputedStyle(el).getPropertyValue(transforms[t])
                }
            }
            document.body.removeChild(el);
            return (has3d !== undefined && has3d.length > 0 && has3d !== "none")
        }

        function addTableClass(element) {
            element.addClass('ms-table').wrapInner('<div class="ms-tableCell" style="height: ' + getTableHeight(element) + 'px" />')
        }

        function getTableHeight(section) {
            var sectionHeight = windowHeight;
            if (options.paddingTop || options.paddingBottom) {
                var paddings = parseInt(section.css('padding-top')) + parseInt(section.css('padding-bottom'));
                sectionHeight = (windowHeight - paddings)
            }
            return sectionHeight
        }

        function scrollToAnchor() {
            var sectionAnchor = window.location.hash.replace('#', '');
            var section = $('.ms-left .ms-section[data-anchor="' + sectionAnchor + '"]');
            if (sectionAnchor.length) {
                scrollPage(section)
            }
        }
        $.fn.multiscroll.setKeyboardScrolling = function(value) {
            options.keyboardScrolling = value
        };
        $.fn.multiscroll.setMouseWheelScrolling = function(value) {
            if (value) {
                addMouseWheelHandler()
            } else {
                removeMouseWheelHandler()
            }
        };
        $.fn.multiscroll.setScrollingSpeed = function(value) {
            options.scrollingSpeed = value
        };
        var touchStartY = 0;
        var touchStartX = 0;
        var touchEndY = 0;
        var touchEndX = 0;

        function touchMoveHandler(event) {
            var e = event.originalEvent;
            event.preventDefault();
            var activeSection = $('.ms-left .ms-section.active');
            if (!isMoving) {
                var touchEvents = getEventsPage(e);
                touchEndY = touchEvents['y'];
                touchEndX = touchEvents['x'];
                if (Math.abs(touchStartY - touchEndY) > ($(window).height() / 100 * options.touchSensitivity)) {
                    if (touchStartY > touchEndY) {
                        $.fn.multiscroll.moveSectionDown()
                    } else if (touchEndY > touchStartY) {
                        $.fn.multiscroll.moveSectionUp()
                    }
                }
            }
        }

        function touchStartHandler(event) {
            var e = event.originalEvent;
            var touchEvents = getEventsPage(e);
            touchStartY = touchEvents['y'];
            touchStartX = touchEvents['x']
        }

        function addTouchHandler() {
            if (isTouch) {
                MSPointer = getMSPointer();
                $(document).off('touchstart ' + MSPointer.down).on('touchstart ' + MSPointer.down, touchStartHandler);
                $(document).off('touchmove ' + MSPointer.move).on('touchmove ' + MSPointer.move, touchMoveHandler)
            }
        }

        function removeTouchHandler() {
            if (isTouch) {
                MSPointer = getMSPointer();
                $(document).off('touchstart ' + MSPointer.down);
                $(document).off('touchmove ' + MSPointer.move)
            }
        }

        function getMSPointer() {
            var pointer;
            if (window.PointerEvent) {
                pointer = {
                    down: "pointerdown",
                    move: "pointermove"
                }
            } else {
                pointer = {
                    down: "MSPointerDown",
                    move: "MSPointerMove"
                }
            }
            return pointer
        }

        function getEventsPage(e) {
            var events = new Array();
            if (window.navigator.msPointerEnabled) {
                events['y'] = e.pageY;
                events['x'] = e.pageX
            } else {
                events['y'] = e.touches[0].pageY;
                events['x'] = e.touches[0].pageX
            }
            return events
        }
        $.fn.multiscroll.destroy = function() {
            $.fn.multiscroll.setKeyboardScrolling(false);
            $.fn.multiscroll.setMouseWheelScrolling(false);
            $(window).off('hashchange', hashChangeHandler).off('resize', doneResizing);
            $(document).off('touchstart').off('touchmove')
        };
        $.fn.multiscroll.build = function() {
            $.fn.multiscroll.setKeyboardScrolling(true);
            $.fn.multiscroll.setMouseWheelScrolling(true);
            $(window).on('hashchange', hashChangeHandler).on('resize', doneResizing);
            $(document).on('touchstart', touchStartHandler).on('touchmove', touchMoveHandler)
        }
    }
})(jQuery);;
/*!
 * Justified Gallery - v3.6.1
 * http://miromannino.github.io/Justified-Gallery/
 * Copyright (c) 2015 Miro Mannino
 * Licensed under the MIT license.
 */
! function(a) {
    var b = function(b, c) {
        this.settings = c, this.checkSettings(), this.imgAnalyzerTimeout = null, this.entries = null, this.buildingRow = {
            entriesBuff: [],
            width: 0,
            height: 0,
            aspectRatio: 0
        }, this.lastAnalyzedIndex = -1, this.yield = {
            every: 2,
            flushed: 0
        }, this.border = c.border >= 0 ? c.border : c.margins, this.maxRowHeight = this.retrieveMaxRowHeight(), this.suffixRanges = this.retrieveSuffixRanges(), this.offY = this.border, this.spinner = {
            phase: 0,
            timeSlot: 150,
            $el: a('<div class="spinner"><span></span><span></span><span></span></div>'),
            intervalId: null
        }, this.checkWidthIntervalId = null, this.galleryWidth = b.width(), this.$gallery = b
    };
    b.prototype.getSuffix = function(a, b) {
        var c, d;
        for (c = a > b ? a : b, d = 0; d < this.suffixRanges.length; d++)
            if (c <= this.suffixRanges[d]) return this.settings.sizeRangeSuffixes[this.suffixRanges[d]];
        return this.settings.sizeRangeSuffixes[this.suffixRanges[d - 1]]
    }, b.prototype.removeSuffix = function(a, b) {
        return a.substring(0, a.length - b.length)
    }, b.prototype.endsWith = function(a, b) {
        return -1 !== a.indexOf(b, a.length - b.length)
    }, b.prototype.getUsedSuffix = function(a) {
        for (var b in this.settings.sizeRangeSuffixes)
            if (this.settings.sizeRangeSuffixes.hasOwnProperty(b)) {
                if (0 === this.settings.sizeRangeSuffixes[b].length) continue;
                if (this.endsWith(a, this.settings.sizeRangeSuffixes[b])) return this.settings.sizeRangeSuffixes[b]
            }
        return ""
    }, b.prototype.newSrc = function(a, b, c) {
        var d;
        if (this.settings.thumbnailPath) d = this.settings.thumbnailPath(a, b, c);
        else {
            var e = a.match(this.settings.extension),
                f = null !== e ? e[0] : "";
            d = a.replace(this.settings.extension, ""), d = this.removeSuffix(d, this.getUsedSuffix(d)), d += this.getSuffix(b, c) + f
        }
        return d
    }, b.prototype.showImg = function(a, b) {
        this.settings.cssAnimation ? (a.addClass("entry-visible"), b && b()) : a.stop().fadeTo(this.settings.imagesAnimationDuration, 1, b)
    }, b.prototype.extractImgSrcFromImage = function(a) {
        var b = "undefined" != typeof a.data("safe-src") ? a.data("safe-src") : a.attr("src");
        return a.data("jg.originalSrc", b), b
    }, b.prototype.imgFromEntry = function(a) {
        var b = a.find("> img");
        return 0 === b.length && (b = a.find("> a > img")), 0 === b.length ? null : b
    }, b.prototype.captionFromEntry = function(a) {
        var b = a.find("> .caption");
        return 0 === b.length ? null : b
    }, b.prototype.displayEntry = function(b, c, d, e, f, g) {
        b.width(e), b.height(g), b.css("top", d), b.css("left", c);
        var h = this.imgFromEntry(b);
        if (null !== h) {
            h.css("width", e), h.css("height", f), h.css("margin-left", -e / 2), h.css("margin-top", -f / 2);
            var i = h.attr("src"),
                j = this.newSrc(i, e, f);
            h.one("error", function() {
                h.attr("src", h.data("jg.originalSrc"))
            });
            var k = function() {
                i !== j && h.attr("src", j)
            };
            "skipped" === b.data("jg.loaded") ? this.onImageEvent(i, a.proxy(function() {
                this.showImg(b, k), b.data("jg.loaded", !0)
            }, this)) : this.showImg(b, k)
        } else this.showImg(b);
        this.displayEntryCaption(b)
    }, b.prototype.displayEntryCaption = function(b) {
        var c = this.imgFromEntry(b);
        if (null !== c && this.settings.captions) {
            var d = this.captionFromEntry(b);
            if (null === d) {
                var e = c.attr("alt");
                this.isValidCaption(e) || (e = b.attr("title")), this.isValidCaption(e) && (d = a('<div class="caption">' + e + "</div>"), b.append(d), b.data("jg.createdCaption", !0))
            }
            null !== d && (this.settings.cssAnimation || d.stop().fadeTo(0, this.settings.captionSettings.nonVisibleOpacity), this.addCaptionEventsHandlers(b))
        } else this.removeCaptionEventsHandlers(b)
    }, b.prototype.isValidCaption = function(a) {
        return "undefined" != typeof a && a.length > 0
    }, b.prototype.onEntryMouseEnterForCaption = function(b) {
        var c = this.captionFromEntry(a(b.currentTarget));
        this.settings.cssAnimation ? c.addClass("caption-visible").removeClass("caption-hidden") : c.stop().fadeTo(this.settings.captionSettings.animationDuration, this.settings.captionSettings.visibleOpacity)
    }, b.prototype.onEntryMouseLeaveForCaption = function(b) {
        var c = this.captionFromEntry(a(b.currentTarget));
        this.settings.cssAnimation ? c.removeClass("caption-visible").removeClass("caption-hidden") : c.stop().fadeTo(this.settings.captionSettings.animationDuration, this.settings.captionSettings.nonVisibleOpacity)
    }, b.prototype.addCaptionEventsHandlers = function(b) {
        var c = b.data("jg.captionMouseEvents");
        "undefined" == typeof c && (c = {
            mouseenter: a.proxy(this.onEntryMouseEnterForCaption, this),
            mouseleave: a.proxy(this.onEntryMouseLeaveForCaption, this)
        }, b.on("mouseenter", void 0, void 0, c.mouseenter), b.on("mouseleave", void 0, void 0, c.mouseleave), b.data("jg.captionMouseEvents", c))
    }, b.prototype.removeCaptionEventsHandlers = function(a) {
        var b = a.data("jg.captionMouseEvents");
        "undefined" != typeof b && (a.off("mouseenter", void 0, b.mouseenter), a.off("mouseleave", void 0, b.mouseleave), a.removeData("jg.captionMouseEvents"))
    }, b.prototype.prepareBuildingRow = function(a) {
        var b, c, d, e, f, g = !0,
            h = 0,
            i = this.galleryWidth - 2 * this.border - (this.buildingRow.entriesBuff.length - 1) * this.settings.margins,
            j = i / this.buildingRow.aspectRatio,
            k = this.buildingRow.width / i > this.settings.justifyThreshold;
        if (a && "hide" === this.settings.lastRow && !k) {
            for (b = 0; b < this.buildingRow.entriesBuff.length; b++) c = this.buildingRow.entriesBuff[b], this.settings.cssAnimation ? c.removeClass("entry-visible") : c.stop().fadeTo(0, 0);
            return -1
        }
        for (a && !k && "justify" !== this.settings.lastRow && "hide" !== this.settings.lastRow && (g = !1), b = 0; b < this.buildingRow.entriesBuff.length; b++) c = this.buildingRow.entriesBuff[b], d = c.data("jg.width") / c.data("jg.height"), g ? (e = b === this.buildingRow.entriesBuff.length - 1 ? i : j * d, f = j) : (e = this.settings.rowHeight * d, f = this.settings.rowHeight), i -= Math.round(e), c.data("jg.jwidth", Math.round(e)), c.data("jg.jheight", Math.ceil(f)), (0 === b || h > f) && (h = f);
        return this.settings.fixedHeight && h > this.settings.rowHeight && (h = this.settings.rowHeight), this.buildingRow.height = h, g
    }, b.prototype.clearBuildingRow = function() {
        this.buildingRow.entriesBuff = [], this.buildingRow.aspectRatio = 0, this.buildingRow.width = 0
    }, b.prototype.flushRow = function(a) {
        var b, c, d, e = this.settings,
            f = this.border;
        if (c = this.prepareBuildingRow(a), a && "hide" === e.lastRow && -1 === this.buildingRow.height) return void this.clearBuildingRow();
        if (this.maxRowHeight.isPercentage ? this.maxRowHeight.value * e.rowHeight < this.buildingRow.height && (this.buildingRow.height = this.maxRowHeight.value * e.rowHeight) : this.maxRowHeight.value > 0 && this.maxRowHeight.value < this.buildingRow.height && (this.buildingRow.height = this.maxRowHeight.value), "center" === e.lastRow || "right" === e.lastRow) {
            var g = this.galleryWidth - 2 * this.border - (this.buildingRow.entriesBuff.length - 1) * e.margins;
            for (d = 0; d < this.buildingRow.entriesBuff.length; d++) b = this.buildingRow.entriesBuff[d], g -= b.data("jg.jwidth");
            "center" === e.lastRow ? f += g / 2 : "right" === e.lastRow && (f += g)
        }
        for (d = 0; d < this.buildingRow.entriesBuff.length; d++) b = this.buildingRow.entriesBuff[d], this.displayEntry(b, f, this.offY, b.data("jg.jwidth"), b.data("jg.jheight"), this.buildingRow.height), f += b.data("jg.jwidth") + e.margins;
        this.$gallery.height(this.offY + this.buildingRow.height + this.border + (this.isSpinnerActive() ? this.getSpinnerHeight() : 0)), (!a || this.buildingRow.height <= e.rowHeight && c) && (this.offY += this.buildingRow.height + e.margins, this.clearBuildingRow(), this.$gallery.trigger("jg.rowflush"))
    }, b.prototype.checkWidth = function() {
        this.checkWidthIntervalId = setInterval(a.proxy(function() {
            var a = parseFloat(this.$gallery.width());
            Math.abs(a - this.galleryWidth) > this.settings.refreshSensitivity && (this.galleryWidth = a, this.rewind(), this.startImgAnalyzer(!0))
        }, this), this.settings.refreshTime)
    }, b.prototype.isSpinnerActive = function() {
        return null !== this.spinner.intervalId
    }, b.prototype.getSpinnerHeight = function() {
        return this.spinner.$el.innerHeight()
    }, b.prototype.stopLoadingSpinnerAnimation = function() {
        clearInterval(this.spinner.intervalId), this.spinner.intervalId = null, this.$gallery.height(this.$gallery.height() - this.getSpinnerHeight()), this.spinner.$el.detach()
    }, b.prototype.startLoadingSpinnerAnimation = function() {
        var a = this.spinner,
            b = a.$el.find("span");
        clearInterval(a.intervalId), this.$gallery.append(a.$el), this.$gallery.height(this.offY + this.buildingRow.height + this.getSpinnerHeight()), a.intervalId = setInterval(function() {
            a.phase < b.length ? b.eq(a.phase).fadeTo(a.timeSlot, 1) : b.eq(a.phase - b.length).fadeTo(a.timeSlot, 0), a.phase = (a.phase + 1) % (2 * b.length)
        }, a.timeSlot)
    }, b.prototype.rewind = function() {
        this.lastAnalyzedIndex = -1, this.offY = this.border, this.clearBuildingRow()
    }, b.prototype.updateEntries = function(b) {
        return this.entries = this.$gallery.find(this.settings.selector).toArray(), 0 === this.entries.length ? !1 : (this.settings.filter ? this.modifyEntries(this.filterArray, b) : this.modifyEntries(this.resetFilters, b), a.isFunction(this.settings.sort) ? this.modifyEntries(this.sortArray, b) : this.settings.randomize && this.modifyEntries(this.shuffleArray, b), !0)
    }, b.prototype.insertToGallery = function(b) {
        var c = this;
        a.each(b, function() {
            a(this).appendTo(c.$gallery)
        })
    }, b.prototype.shuffleArray = function(a) {
        var b, c, d;
        for (b = a.length - 1; b > 0; b--) c = Math.floor(Math.random() * (b + 1)), d = a[b], a[b] = a[c], a[c] = d;
        return this.insertToGallery(a), a
    }, b.prototype.sortArray = function(a) {
        return a.sort(this.settings.sort), this.insertToGallery(a), a
    }, b.prototype.resetFilters = function(b) {
        for (var c = 0; c < b.length; c++) a(b[c]).removeClass("jg-filtered");
        return b
    }, b.prototype.filterArray = function(b) {
        var c = this.settings;
        return "string" === a.type(c.filter) ? b.filter(function(b) {
            var d = a(b);
            return d.is(c.filter) ? (d.removeClass("jg-filtered"), !0) : (d.addClass("jg-filtered"), !1)
        }) : a.isFunction(c.filter) ? b.filter(c.filter) : void 0
    }, b.prototype.modifyEntries = function(a, b) {
        var c = b ? this.entries.splice(this.lastAnalyzedIndex + 1, this.entries.length - this.lastAnalyzedIndex - 1) : this.entries;
        c = a.call(this, c), this.entries = b ? this.entries.concat(c) : c
    }, b.prototype.destroy = function() {
        clearInterval(this.checkWidthIntervalId), a.each(this.entries, a.proxy(function(b, c) {
            var d = a(c);
            d.css("width", ""), d.css("height", ""), d.css("top", ""), d.css("left", ""), d.data("jg.loaded", void 0), d.removeClass("jg-entry");
            var e = this.imgFromEntry(d);
            e.css("width", ""), e.css("height", ""), e.css("margin-left", ""), e.css("margin-top", ""), e.attr("src", e.data("jg.originalSrc")), e.data("jg.originalSrc", void 0), this.removeCaptionEventsHandlers(d);
            var f = this.captionFromEntry(d);
            d.data("jg.createdCaption") ? (d.data("jg.createdCaption", void 0), null !== f && f.remove()) : null !== f && f.fadeTo(0, 1)
        }, this)), this.$gallery.css("height", ""), this.$gallery.removeClass("justified-gallery"), this.$gallery.data("jg.controller", void 0)
    }, b.prototype.analyzeImages = function(b) {
        for (var c = this.lastAnalyzedIndex + 1; c < this.entries.length; c++) {
            var d = a(this.entries[c]);
            if (d.data("jg.loaded") === !0 || "skipped" === d.data("jg.loaded")) {
                var e = this.galleryWidth - 2 * this.border - (this.buildingRow.entriesBuff.length - 1) * this.settings.margins,
                    f = d.data("jg.width") / d.data("jg.height");
                if (e / (this.buildingRow.aspectRatio + f) < this.settings.rowHeight && (this.flushRow(!1), ++this.yield.flushed >= this.yield.every)) return void this.startImgAnalyzer(b);
                this.buildingRow.entriesBuff.push(d), this.buildingRow.aspectRatio += f, this.buildingRow.width += f * this.settings.rowHeight, this.lastAnalyzedIndex = c
            } else if ("error" !== d.data("jg.loaded")) return
        }
        this.buildingRow.entriesBuff.length > 0 && this.flushRow(!0), this.isSpinnerActive() && this.stopLoadingSpinnerAnimation(), this.stopImgAnalyzerStarter(), this.$gallery.trigger(b ? "jg.resize" : "jg.complete")
    }, b.prototype.stopImgAnalyzerStarter = function() {
        this.yield.flushed = 0, null !== this.imgAnalyzerTimeout && clearTimeout(this.imgAnalyzerTimeout)
    }, b.prototype.startImgAnalyzer = function(a) {
        var b = this;
        this.stopImgAnalyzerStarter(), this.imgAnalyzerTimeout = setTimeout(function() {
            b.analyzeImages(a)
        }, .001)
    }, b.prototype.onImageEvent = function(b, c, d) {
        if (c || d) {
            var e = new Image,
                f = a(e);
            c && f.one("load", function() {
                f.off("load error"), c(e)
            }), d && f.one("error", function() {
                f.off("load error"), d(e)
            }), e.src = b
        }
    }, b.prototype.init = function() {
        var b = !1,
            c = !1,
            d = this;
        a.each(this.entries, function(e, f) {
            var g = a(f),
                h = d.imgFromEntry(g);
            if (g.addClass("jg-entry"), g.data("jg.loaded") !== !0 && "skipped" !== g.data("jg.loaded"))
                if (null !== d.settings.rel && g.attr("rel", d.settings.rel), null !== d.settings.target && g.attr("target", d.settings.target), null !== h) {
                    var i = d.extractImgSrcFromImage(h);
                    if (h.attr("src", i), d.settings.waitThumbnailsLoad === !1) {
                        var j = parseFloat(h.attr("width")),
                            k = parseFloat(h.attr("height"));
                        if (!isNaN(j) && !isNaN(k)) return g.data("jg.width", j), g.data("jg.height", k), g.data("jg.loaded", "skipped"), c = !0, d.startImgAnalyzer(!1), !0
                    }
                    g.data("jg.loaded", !1), b = !0, d.isSpinnerActive() || d.startLoadingSpinnerAnimation(), d.onImageEvent(i, function(a) {
                        g.data("jg.width", a.width), g.data("jg.height", a.height), g.data("jg.loaded", !0), d.startImgAnalyzer(!1)
                    }, function() {
                        g.data("jg.loaded", "error"), d.startImgAnalyzer(!1)
                    })
                } else g.data("jg.loaded", !0), g.data("jg.width", g.width() | parseFloat(g.css("width")) | 1), g.data("jg.height", g.height() | parseFloat(g.css("height")) | 1)
        }), b || c || this.startImgAnalyzer(!1), this.checkWidth()
    }, b.prototype.checkOrConvertNumber = function(b, c) {
        if ("string" === a.type(b[c]) && (b[c] = parseFloat(b[c])), "number" !== a.type(b[c])) throw c + " must be a number";
        if (isNaN(b[c])) throw "invalid number for " + c
    }, b.prototype.checkSizeRangesSuffixes = function() {
        if ("object" !== a.type(this.settings.sizeRangeSuffixes)) throw "sizeRangeSuffixes must be defined and must be an object";
        var b = [];
        for (var c in this.settings.sizeRangeSuffixes) this.settings.sizeRangeSuffixes.hasOwnProperty(c) && b.push(c);
        for (var d = {
                0: ""
            }, e = 0; e < b.length; e++)
            if ("string" === a.type(b[e])) try {
                var f = parseInt(b[e].replace(/^[a-z]+/, ""), 10);
                d[f] = this.settings.sizeRangeSuffixes[b[e]]
            } catch (g) {
                throw "sizeRangeSuffixes keys must contains correct numbers (" + g + ")"
            } else d[b[e]] = this.settings.sizeRangeSuffixes[b[e]];
        this.settings.sizeRangeSuffixes = d
    }, b.prototype.retrieveMaxRowHeight = function() {
        var b = {};
        if ("string" === a.type(this.settings.maxRowHeight)) this.settings.maxRowHeight.match(/^[0-9]+%$/) ? (b.value = parseFloat(this.settings.maxRowHeight.match(/^([0-9]+)%$/)[1]) / 100, b.isPercentage = !1) : (b.value = parseFloat(this.settings.maxRowHeight), b.isPercentage = !0);
        else {
            if ("number" !== a.type(this.settings.maxRowHeight)) throw "maxRowHeight must be a number or a percentage";
            b.value = this.settings.maxRowHeight, b.isPercentage = !1
        }
        if (isNaN(b.value)) throw "invalid number for maxRowHeight";
        return b.isPercentage ? b.value < 100 && (b.value = 100) : b.value > 0 && b.value < this.settings.rowHeight && (b.value = this.settings.rowHeight), b
    }, b.prototype.checkSettings = function() {
        if (this.checkSizeRangesSuffixes(), this.checkOrConvertNumber(this.settings, "rowHeight"), this.checkOrConvertNumber(this.settings, "margins"), this.checkOrConvertNumber(this.settings, "border"), "justify" !== this.settings.lastRow && "nojustify" !== this.settings.lastRow && "left" !== this.settings.lastRow && "center" !== this.settings.lastRow && "right" !== this.settings.lastRow && "hide" !== this.settings.lastRow) throw 'lastRow must be "justify", "nojustify", "left", "center", "right" or "hide"';
        if (this.checkOrConvertNumber(this.settings, "justifyThreshold"), this.settings.justifyThreshold < 0 || this.settings.justifyThreshold > 1) throw "justifyThreshold must be in the interval [0,1]";
        if ("boolean" !== a.type(this.settings.cssAnimation)) throw "cssAnimation must be a boolean";
        if ("boolean" !== a.type(this.settings.captions)) throw "captions must be a boolean";
        if (this.checkOrConvertNumber(this.settings.captionSettings, "animationDuration"), this.checkOrConvertNumber(this.settings.captionSettings, "visibleOpacity"), this.settings.captionSettings.visibleOpacity < 0 || this.settings.captionSettings.visibleOpacity > 1) throw "captionSettings.visibleOpacity must be in the interval [0, 1]";
        if (this.checkOrConvertNumber(this.settings.captionSettings, "nonVisibleOpacity"), this.settings.captionSettings.nonVisibleOpacity < 0 || this.settings.captionSettings.nonVisibleOpacity > 1) throw "captionSettings.nonVisibleOpacity must be in the interval [0, 1]";
        if ("boolean" !== a.type(this.settings.fixedHeight)) throw "fixedHeight must be a boolean";
        if (this.checkOrConvertNumber(this.settings, "imagesAnimationDuration"), this.checkOrConvertNumber(this.settings, "refreshTime"), this.checkOrConvertNumber(this.settings, "refreshSensitivity"), "boolean" !== a.type(this.settings.randomize)) throw "randomize must be a boolean";
        if ("string" !== a.type(this.settings.selector)) throw "selector must be a string";
        if (this.settings.sort !== !1 && !a.isFunction(this.settings.sort)) throw "sort must be false or a comparison function";
        if (this.settings.filter !== !1 && !a.isFunction(this.settings.filter) && "string" !== a.type(this.settings.filter)) throw "filter must be false, a string or a filter function"
    }, b.prototype.retrieveSuffixRanges = function() {
        var a = [];
        for (var b in this.settings.sizeRangeSuffixes) this.settings.sizeRangeSuffixes.hasOwnProperty(b) && a.push(parseInt(b, 10));
        return a.sort(function(a, b) {
            return a > b ? 1 : b > a ? -1 : 0
        }), a
    }, b.prototype.updateSettings = function(b) {
        this.settings = a.extend({}, this.settings, b), this.checkSettings(), this.border = this.settings.border >= 0 ? this.settings.border : this.settings.margins, this.maxRowHeight = this.retrieveMaxRowHeight(), this.suffixRanges = this.retrieveSuffixRanges()
    }, a.fn.justifiedGallery = function(c) {
        return this.each(function(d, e) {
            var f = a(e);
            f.addClass("justified-gallery");
            var g = f.data("jg.controller");
            if ("undefined" == typeof g) {
                if ("undefined" != typeof c && null !== c && "object" !== a.type(c)) {
                    if ("destroy" === c) return;
                    throw "The argument must be an object"
                }
                g = new b(f, a.extend({}, a.fn.justifiedGallery.defaults, c)), f.data("jg.controller", g)
            } else if ("norewind" === c);
            else {
                if ("destroy" === c) return void g.destroy();
                g.updateSettings(c), g.rewind()
            }
            g.updateEntries("norewind" === c) && g.init()
        })
    }, a.fn.justifiedGallery.defaults = {
        sizeRangeSuffixes: {},
        thumbnailPath: void 0,
        rowHeight: 120,
        maxRowHeight: -1,
        margins: 1,
        border: -1,
        lastRow: "nojustify",
        justifyThreshold: .75,
        fixedHeight: !1,
        waitThumbnailsLoad: !0,
        captions: !0,
        cssAnimation: !1,
        imagesAnimationDuration: 500,
        captionSettings: {
            animationDuration: 500,
            visibleOpacity: .7,
            nonVisibleOpacity: 0
        },
        rel: null,
        target: null,
        extension: /\.[^.\\/]+$/,
        refreshTime: 200,
        refreshSensitivity: 0,
        randomize: !1,
        sort: !1,
        filter: !1,
        selector: "> a, > div:not(.spinner)"
    }
}(jQuery);;
/*! BigText - v0.1.8 - 2015-04-01
 * https://github.com/zachleat/bigtext
 * Copyright (c) 2015 Zach Leatherman (@zachleat)
 * MIT License */
(function(window, $) {
    "use strict";
    var counter = 0,
        $headCache = $('head'),
        oldBigText = window.BigText,
        oldjQueryMethod = $.fn.bigtext,
        BigText = {
            DEBUG_MODE: false,
            DEFAULT_MIN_FONT_SIZE_PX: null,
            DEFAULT_MAX_FONT_SIZE_PX: 528,
            GLOBAL_STYLE_ID: 'bigtext-style',
            STYLE_ID: 'bigtext-id',
            LINE_CLASS_PREFIX: 'bigtext-line',
            EXEMPT_CLASS: 'bigtext-exempt',
            noConflict: function(restore) {
                if (restore) {
                    $.fn.bigtext = oldjQueryMethod;
                    window.BigText = oldBigText
                }
                return BigText
            },
            supports: {
                wholeNumberFontSizeOnly: (function() {
                    if (!('getComputedStyle' in window)) {
                        return true
                    }
                    var test = $('<div/>').css({
                            position: 'absolute',
                            'font-size': '14.1px'
                        }).insertBefore($('script').eq(0)),
                        computedStyle = window.getComputedStyle(test[0], null);
                    var ret = computedStyle && computedStyle.getPropertyValue('font-size') === '14px';
                    test.remove();
                    return ret
                })()
            },
            init: function() {
                if (!$('#' + BigText.GLOBAL_STYLE_ID).length) {
                    $headCache.append(BigText.generateStyleTag(BigText.GLOBAL_STYLE_ID, ['.bigtext * { white-space: nowrap; } .bigtext > * { display: block; }', '.bigtext .' + BigText.EXEMPT_CLASS + ', .bigtext .' + BigText.EXEMPT_CLASS + ' * { white-space: normal; }']))
                }
            },
            bindResize: function(eventName, resizeFunction) {
                var timeoutId;
                $(window).unbind(eventName).bind(eventName, function() {
                    if (timeoutId) {
                        clearTimeout(timeoutId)
                    }
                    timeoutId = setTimeout(resizeFunction, 100)
                })
            },
            getStyleId: function(id) {
                return BigText.STYLE_ID + '-' + id
            },
            generateStyleTag: function(id, css) {
                return $('<style>' + css.join('\n') + '</style>').attr('id', id)
            },
            clearCss: function(id) {
                var styleId = BigText.getStyleId(id);
                $('#' + styleId).remove()
            },
            generateCss: function(id, linesFontSizes, lineWordSpacings, minFontSizes) {
                var css = [];
                BigText.clearCss(id);
                for (var j = 0, k = linesFontSizes.length; j < k; j++) {
                    css.push('#' + id + ' .' + BigText.LINE_CLASS_PREFIX + j + ' {' + (minFontSizes[j] ? ' white-space: normal;' : '') + (linesFontSizes[j] ? ' font-size: ' + linesFontSizes[j] + 'px;' : '') + (lineWordSpacings[j] ? ' word-spacing: ' + lineWordSpacings[j] + 'px;' : '') + '}')
                }
                return BigText.generateStyleTag(BigText.getStyleId(id), css)
            },
            jQueryMethod: function(options) {
                BigText.init();
                options = $.extend({
                    minfontsize: BigText.DEFAULT_MIN_FONT_SIZE_PX,
                    maxfontsize: BigText.DEFAULT_MAX_FONT_SIZE_PX,
                    childSelector: '',
                    resize: true
                }, options || {});
                this.each(function() {
                    var $t = $(this).addClass('bigtext'),
                        maxWidth = $t.width(),
                        id = $t.attr('id'),
                        $children = options.childSelector ? $t.find(options.childSelector) : $t.children();
                    if (!id) {
                        id = 'bigtext-id' + (counter++);
                        $t.attr('id', id)
                    }
                    if (options.resize) {
                        BigText.bindResize('resize.bigtext-event-' + id, function() {
                            BigText.jQueryMethod.call($('#' + id), options)
                        })
                    }
                    BigText.clearCss(id);
                    $children.addClass(function(lineNumber, className) {
                        return [className.replace(new RegExp('\\b' + BigText.LINE_CLASS_PREFIX + '\\d+\\b'), ''), BigText.LINE_CLASS_PREFIX + lineNumber].join(' ')
                    });
                    var sizes = calculateSizes($t, $children, maxWidth, options.maxfontsize, options.minfontsize);
                    $headCache.append(BigText.generateCss(id, sizes.fontSizes, sizes.wordSpacings, sizes.minFontSizes))
                });
                return this.trigger('bigtext:complete')
            }
        };

    function testLineDimensions($line, maxWidth, property, size, interval, units, previousWidth) {
        var width;
        previousWidth = typeof previousWidth === 'number' ? previousWidth : 0;
        $line.css(property, size + units);
        width = $line.width();
        if (width >= maxWidth) {
            $line.css(property, '');
            if (width === maxWidth) {
                return {
                    match: 'exact',
                    size: parseFloat((parseFloat(size) - 0.1).toFixed(3))
                }
            }
            var under = maxWidth - previousWidth,
                over = width - maxWidth;
            return {
                match: 'estimate',
                size: parseFloat((parseFloat(size) - (property === 'word-spacing' && previousWidth && (over < under) ? 0 : interval)).toFixed(3))
            }
        }
        return width
    }

    function calculateSizes($t, $children, maxWidth, maxFontSize, minFontSize) {
        var $c = $t.clone(true).addClass('bigtext-cloned').css({
            fontFamily: $t.css('font-family'),
            textTransform: $t.css('text-transform'),
            wordSpacing: $t.css('word-spacing'),
            letterSpacing: $t.css('letter-spacing'),
            position: 'absolute',
            left: BigText.DEBUG_MODE ? 0 : -9999,
            top: BigText.DEBUG_MODE ? 0 : -9999
        }).appendTo(document.body);
        var fontSizes = [],
            wordSpacings = [],
            minFontSizes = [],
            ratios = [];
        $children.css('float', 'left').each(function() {
            var $line = $(this),
                intervals = BigText.supports.wholeNumberFontSizeOnly ? [8, 4, 1] : [8, 4, 1, 0.1],
                lineMax, newFontSize;
            if ($line.hasClass(BigText.EXEMPT_CLASS)) {
                fontSizes.push(null);
                ratios.push(null);
                minFontSizes.push(false);
                return
            }
            var autoGuessSubtraction = 32,
                currentFontSize = parseFloat($line.css('font-size')),
                ratio = ($line.width() / currentFontSize).toFixed(6);
            newFontSize = parseInt(maxWidth / ratio, 10) - autoGuessSubtraction;
            outer: for (var m = 0, n = intervals.length; m < n; m++) {
                inner: for (var j = 1, k = 10; j <= k; j++) {
                    if (newFontSize + j * intervals[m] > maxFontSize) {
                        newFontSize = maxFontSize;
                        break outer
                    }
                    lineMax = testLineDimensions($line, maxWidth, 'font-size', newFontSize + j * intervals[m], intervals[m], 'px', lineMax);
                    if (typeof lineMax !== 'number') {
                        newFontSize = lineMax.size;
                        if (lineMax.match === 'exact') {
                            break outer
                        }
                        break inner
                    }
                }
            }
            ratios.push(maxWidth / newFontSize);
            if (newFontSize > maxFontSize) {
                fontSizes.push(maxFontSize);
                minFontSizes.push(false)
            } else if (!!minFontSize && newFontSize < minFontSize) {
                fontSizes.push(minFontSize);
                minFontSizes.push(true)
            } else {
                fontSizes.push(newFontSize);
                minFontSizes.push(false)
            }
        }).each(function(lineNumber) {
            var $line = $(this),
                wordSpacing = 0,
                interval = 1,
                maxWordSpacing;
            if ($line.hasClass(BigText.EXEMPT_CLASS)) {
                wordSpacings.push(null);
                return
            }
            $line.css('font-size', fontSizes[lineNumber] + 'px');
            for (var m = 1, n = 3; m < n; m += interval) {
                maxWordSpacing = testLineDimensions($line, maxWidth, 'word-spacing', m, interval, 'px', maxWordSpacing);
                if (typeof maxWordSpacing !== 'number') {
                    wordSpacing = maxWordSpacing.size;
                    break
                }
            }
            $line.css('font-size', '');
            wordSpacings.push(wordSpacing)
        }).removeAttr('style');
        if (!BigText.DEBUG_MODE) {
            $c.remove()
        } else {
            $c.css({
                'background-color': 'rgba(255,255,255,.4)'
            })
        }
        return {
            fontSizes: fontSizes,
            wordSpacings: wordSpacings,
            ratios: ratios,
            minFontSizes: minFontSizes
        }
    }
    $.fn.bigtext = BigText.jQueryMethod;
    window.BigText = BigText
})(this, jQuery);;
/*
 Sticky-kit v1.1.2 | WTFPL | Leaf Corcoran 2015 | http://leafo.net
 */
(function() {
    var b, f;
    b = this.jQuery || window.jQuery;
    f = b(window);
    b.fn.stick_in_parent = function(d) {
        var A, w, J, n, B, K, p, q, k, E, t;
        null == d && (d = {});
        t = d.sticky_class;
        B = d.inner_scrolling;
        E = d.recalc_every;
        k = d.parent;
        q = d.offset_top;
        p = d.spacer;
        w = d.bottoming;
        null == q && (q = 0);
        null == k && (k = void 0);
        null == B && (B = !0);
        null == t && (t = "is_stuck");
        A = b(document);
        null == w && (w = !0);
        J = function(a, d, n, C, F, u, r, G) {
            var v, H, m, D, I, c, g, x, y, z, h, l;
            if (!a.data("sticky_kit")) {
                a.data("sticky_kit", !0);
                I = A.height();
                g = a.parent();
                null != k && (g = g.closest(k));
                if (!g.length) throw "failed to find stick parent";
                v = m = !1;
                (h = null != p ? p && a.closest(p) : b("<div />")) && h.css("position", a.css("position"));
                x = function() {
                    var c, f, e;
                    if (!G && (I = A.height(), c = parseInt(g.css("border-top-width"), 10), f = parseInt(g.css("padding-top"), 10), d = parseInt(g.css("padding-bottom"), 10), n = g.offset().top + c + f, C = g.height(), m && (v = m = !1, null == p && (a.insertAfter(h), h.detach()), a.css({
                                position: "",
                                top: "",
                                width: "",
                                bottom: ""
                            }).removeClass(t), e = !0), F = a.offset().top - (parseInt(a.css("margin-top"), 10) || 0) - q,
                            u = a.outerHeight(!0), r = a.css("float"), h && h.css({
                                width: a.outerWidth(!0),
                                height: u,
                                display: a.css("display"),
                                "vertical-align": a.css("vertical-align"),
                                "float": r
                            }), e)) return l()
                };
                x();
                if (u !== C) return D = void 0, c = q, z = E, l = function() {
                    var b, l, e, k;
                    if (!G && (e = !1, null != z && (--z, 0 >= z && (z = E, x(), e = !0)), e || A.height() === I || x(), e = f.scrollTop(), null != D && (l = e - D), D = e, m ? (w && (k = e + u + c > C + n, v && !k && (v = !1, a.css({
                            position: "fixed",
                            bottom: "",
                            top: c
                        }).trigger("sticky_kit:unbottom"))), e < F && (m = !1, c = q, null == p && ("left" !== r && "right" !== r || a.insertAfter(h),
                            h.detach()), b = {
                            position: "",
                            width: "",
                            top: ""
                        }, a.css(b).removeClass(t).trigger("sticky_kit:unstick")), B && (b = f.height(), u + q > b && !v && (c -= l, c = Math.max(b - u, c), c = Math.min(q, c), m && a.css({
                            top: c + "px"
                        })))) : e > F && (m = !0, b = {
                            position: "fixed",
                            top: c
                        }, b.width = "border-box" === a.css("box-sizing") ? a.outerWidth() + "px" : a.width() + "px", a.css(b).addClass(t), null == p && (a.after(h), "left" !== r && "right" !== r || h.append(a)), a.trigger("sticky_kit:stick")), m && w && (null == k && (k = e + u + c > C + n), !v && k))) return v = !0, "static" === g.css("position") && g.css({
                            position: "relative"
                        }),
                        a.css({
                            position: "absolute",
                            bottom: d,
                            top: "auto"
                        }).trigger("sticky_kit:bottom")
                }, y = function() {
                    x();
                    return l()
                }, H = function() {
                    G = !0;
                    f.off("touchmove", l);
                    f.off("scroll", l);
                    f.off("resize", y);
                    b(document.body).off("sticky_kit:recalc", y);
                    a.off("sticky_kit:detach", H);
                    a.removeData("sticky_kit");
                    a.css({
                        position: "",
                        bottom: "",
                        top: "",
                        width: ""
                    });
                    g.position("position", "");
                    if (m) return null == p && ("left" !== r && "right" !== r || a.insertAfter(h), h.remove()), a.removeClass(t)
                }, f.on("touchmove", l), f.on("scroll", l), f.on("resize",
                    y), b(document.body).on("sticky_kit:recalc", y), a.on("sticky_kit:detach", H), setTimeout(l, 0)
            }
        };
        n = 0;
        for (K = this.length; n < K; n++) d = this[n], J(b(d));
        return this
    }
}).call(this);

;
/**
 * Owl Carousel v2.2.1
 * Copyright 2013-2017 David Deutsch
 * Licensed under MIT (https://github.com/OwlCarousel2/OwlCarousel2/blob/master/LICENSE)
 */
! function(a, b, c, d) {
    function e(b, c) {
        this.settings = null, this.options = a.extend({}, e.Defaults, c), this.$element = a(b), this._handlers = {}, this._plugins = {}, this._supress = {}, this._current = null, this._speed = null, this._coordinates = [], this._breakpoint = null, this._width = null, this._items = [], this._clones = [], this._mergers = [], this._widths = [], this._invalidated = {}, this._pipe = [], this._drag = {
            time: null,
            target: null,
            pointer: null,
            stage: {
                start: null,
                current: null
            },
            direction: null
        }, this._states = {
            current: {},
            tags: {
                initializing: ["busy"],
                animating: ["busy"],
                dragging: ["interacting"]
            }
        }, a.each(["onResize", "onThrottledResize"], a.proxy(function(b, c) {
            this._handlers[c] = a.proxy(this[c], this)
        }, this)), a.each(e.Plugins, a.proxy(function(a, b) {
            this._plugins[a.charAt(0).toLowerCase() + a.slice(1)] = new b(this)
        }, this)), a.each(e.Workers, a.proxy(function(b, c) {
            this._pipe.push({
                filter: c.filter,
                run: a.proxy(c.run, this)
            })
        }, this)), this.setup(), this.initialize()
    }
    e.Defaults = {
        items: 3,
        loop: !1,
        center: !1,
        rewind: !1,
        mouseDrag: !0,
        touchDrag: !0,
        pullDrag: !0,
        freeDrag: !1,
        margin: 0,
        stagePadding: 0,
        merge: !1,
        mergeFit: !0,
        autoWidth: !1,
        startPosition: 0,
        rtl: !1,
        smartSpeed: 250,
        fluidSpeed: !1,
        dragEndSpeed: !1,
        responsive: {},
        responsiveRefreshRate: 200,
        responsiveBaseElement: b,
        fallbackEasing: "swing",
        info: !1,
        nestedItemSelector: !1,
        itemElement: "div",
        stageElement: "div",
        refreshClass: "owl-refresh",
        loadedClass: "owl-loaded",
        loadingClass: "owl-loading",
        rtlClass: "owl-rtl",
        responsiveClass: "owl-responsive",
        dragClass: "owl-drag",
        itemClass: "owl-item",
        stageClass: "owl-stage",
        stageOuterClass: "owl-stage-outer",
        grabClass: "owl-grab"
    }, e.Width = {
        Default: "default",
        Inner: "inner",
        Outer: "outer"
    }, e.Type = {
        Event: "event",
        State: "state"
    }, e.Plugins = {}, e.Workers = [{
        filter: ["width", "settings"],
        run: function() {
            this._width = this.$element.width()
        }
    }, {
        filter: ["width", "items", "settings"],
        run: function(a) {
            a.current = this._items && this._items[this.relative(this._current)]
        }
    }, {
        filter: ["items", "settings"],
        run: function() {
            this.$stage.children(".cloned").remove()
        }
    }, {
        filter: ["width", "items", "settings"],
        run: function(a) {
            var b = this.settings.margin || "",
                c = !this.settings.autoWidth,
                d = this.settings.rtl,
                e = {
                    width: "auto",
                    "margin-left": d ? b : "",
                    "margin-right": d ? "" : b
                };
            !c && this.$stage.children().css(e), a.css = e
        }
    }, {
        filter: ["width", "items", "settings"],
        run: function(a) {
            var b = (this.width() / this.settings.items).toFixed(3) - this.settings.margin,
                c = null,
                d = this._items.length,
                e = !this.settings.autoWidth,
                f = [];
            for (a.items = {
                    merge: !1,
                    width: b
                }; d--;) c = this._mergers[d], c = this.settings.mergeFit && Math.min(c, this.settings.items) || c, a.items.merge = c > 1 || a.items.merge, f[d] = e ? b * c : this._items[d].width();
            this._widths = f
        }
    }, {
        filter: ["items", "settings"],
        run: function() {
            var b = [],
                c = this._items,
                d = this.settings,
                e = Math.max(2 * d.items, 4),
                f = 2 * Math.ceil(c.length / 2),
                g = d.loop && c.length ? d.rewind ? e : Math.max(e, f) : 0,
                h = "",
                i = "";
            for (g /= 2; g--;) b.push(this.normalize(b.length / 2, !0)), h += c[b[b.length - 1]][0].outerHTML, b.push(this.normalize(c.length - 1 - (b.length - 1) / 2, !0)), i = c[b[b.length - 1]][0].outerHTML + i;
            this._clones = b, a(h).addClass("cloned").appendTo(this.$stage), a(i).addClass("cloned").prependTo(this.$stage)
        }
    }, {
        filter: ["width", "items", "settings"],
        run: function() {
            for (var a = this.settings.rtl ? 1 : -1, b = this._clones.length + this._items.length, c = -1, d = 0, e = 0, f = []; ++c < b;) d = f[c - 1] || 0, e = this._widths[this.relative(c)] + this.settings.margin, f.push(d + e * a);
            this._coordinates = f
        }
    }, {
        filter: ["width", "items", "settings"],
        run: function() {
            var a = this.settings.stagePadding,
                b = this._coordinates,
                c = {
                    width: Math.ceil(Math.abs(b[b.length - 1])) + 2 * a,
                    "padding-left": a || "",
                    "padding-right": a || ""
                };
            this.$stage.css(c)
        }
    }, {
        filter: ["width", "items", "settings"],
        run: function(a) {
            var b = this._coordinates.length,
                c = !this.settings.autoWidth,
                d = this.$stage.children();
            if (c && a.items.merge)
                for (; b--;) a.css.width = this._widths[this.relative(b)], d.eq(b).css(a.css);
            else c && (a.css.width = a.items.width, d.css(a.css))
        }
    }, {
        filter: ["items"],
        run: function() {
            this._coordinates.length < 1 && this.$stage.removeAttr("style")
        }
    }, {
        filter: ["width", "items", "settings"],
        run: function(a) {
            a.current = a.current ? this.$stage.children().index(a.current) : 0, a.current = Math.max(this.minimum(), Math.min(this.maximum(), a.current)), this.reset(a.current)
        }
    }, {
        filter: ["position"],
        run: function() {
            this.animate(this.coordinates(this._current))
        }
    }, {
        filter: ["width", "position", "items", "settings"],
        run: function() {
            var a, b, c, d, e = this.settings.rtl ? 1 : -1,
                f = 2 * this.settings.stagePadding,
                g = this.coordinates(this.current()) + f,
                h = g + this.width() * e,
                i = [];
            for (c = 0, d = this._coordinates.length; c < d; c++) a = this._coordinates[c - 1] || 0, b = Math.abs(this._coordinates[c]) + f * e, (this.op(a, "<=", g) && this.op(a, ">", h) || this.op(b, "<", g) && this.op(b, ">", h)) && i.push(c);
            this.$stage.children(".active").removeClass("active"), this.$stage.children(":eq(" + i.join("), :eq(") + ")").addClass("active"), this.settings.center && (this.$stage.children(".center").removeClass("center"), this.$stage.children().eq(this.current()).addClass("center"))
        }
    }], e.prototype.initialize = function() {
        if (this.enter("initializing"), this.trigger("initialize"), this.$element.toggleClass(this.settings.rtlClass, this.settings.rtl), this.settings.autoWidth && !this.is("pre-loading")) {
            var b, c, e;
            b = this.$element.find("img"), c = this.settings.nestedItemSelector ? "." + this.settings.nestedItemSelector : d, e = this.$element.children(c).width(), b.length && e <= 0 && this.preloadAutoWidthImages(b)
        }
        this.$element.addClass(this.options.loadingClass), this.$stage = a("<" + this.settings.stageElement + ' class="' + this.settings.stageClass + '"/>').wrap('<div class="' + this.settings.stageOuterClass + '"/>'), this.$element.append(this.$stage.parent()), this.replace(this.$element.children().not(this.$stage.parent())), this.$element.is(":visible") ? this.refresh() : this.invalidate("width"), this.$element.removeClass(this.options.loadingClass).addClass(this.options.loadedClass), this.registerEventHandlers(), this.leave("initializing"), this.trigger("initialized")
    }, e.prototype.setup = function() {
        var b = this.viewport(),
            c = this.options.responsive,
            d = -1,
            e = null;
        c ? (a.each(c, function(a) {
            a <= b && a > d && (d = Number(a))
        }), e = a.extend({}, this.options, c[d]), "function" == typeof e.stagePadding && (e.stagePadding = e.stagePadding()), delete e.responsive, e.responsiveClass && this.$element.attr("class", this.$element.attr("class").replace(new RegExp("(" + this.options.responsiveClass + "-)\\S+\\s", "g"), "$1" + d))) : e = a.extend({}, this.options), this.trigger("change", {
            property: {
                name: "settings",
                value: e
            }
        }), this._breakpoint = d, this.settings = e, this.invalidate("settings"), this.trigger("changed", {
            property: {
                name: "settings",
                value: this.settings
            }
        })
    }, e.prototype.optionsLogic = function() {
        this.settings.autoWidth && (this.settings.stagePadding = !1, this.settings.merge = !1)
    }, e.prototype.prepare = function(b) {
        var c = this.trigger("prepare", {
            content: b
        });
        return c.data || (c.data = a("<" + this.settings.itemElement + "/>").addClass(this.options.itemClass).append(b)), this.trigger("prepared", {
            content: c.data
        }), c.data
    }, e.prototype.update = function() {
        for (var b = 0, c = this._pipe.length, d = a.proxy(function(a) {
                return this[a]
            }, this._invalidated), e = {}; b < c;)(this._invalidated.all || a.grep(this._pipe[b].filter, d).length > 0) && this._pipe[b].run(e), b++;
        this._invalidated = {}, !this.is("valid") && this.enter("valid")
    }, e.prototype.width = function(a) {
        switch (a = a || e.Width.Default) {
            case e.Width.Inner:
            case e.Width.Outer:
                return this._width;
            default:
                return this._width - 2 * this.settings.stagePadding + this.settings.margin
        }
    }, e.prototype.refresh = function() {
        this.enter("refreshing"), this.trigger("refresh"), this.setup(), this.optionsLogic(), this.$element.addClass(this.options.refreshClass), this.update(), this.$element.removeClass(this.options.refreshClass), this.leave("refreshing"), this.trigger("refreshed")
    }, e.prototype.onThrottledResize = function() {
        b.clearTimeout(this.resizeTimer), this.resizeTimer = b.setTimeout(this._handlers.onResize, this.settings.responsiveRefreshRate)
    }, e.prototype.onResize = function() {
        return !!this._items.length && (this._width !== this.$element.width() && (!!this.$element.is(":visible") && (this.enter("resizing"), this.trigger("resize").isDefaultPrevented() ? (this.leave("resizing"), !1) : (this.invalidate("width"), this.refresh(), this.leave("resizing"), void this.trigger("resized")))))
    }, e.prototype.registerEventHandlers = function() {
        a.support.transition && this.$stage.on(a.support.transition.end + ".owl.core", a.proxy(this.onTransitionEnd, this)), this.settings.responsive !== !1 && this.on(b, "resize", this._handlers.onThrottledResize), this.settings.mouseDrag && (this.$element.addClass(this.options.dragClass), this.$stage.on("mousedown.owl.core", a.proxy(this.onDragStart, this)), this.$stage.on("dragstart.owl.core selectstart.owl.core", function() {
            return !1
        })), this.settings.touchDrag && (this.$stage.on("touchstart.owl.core", a.proxy(this.onDragStart, this)), this.$stage.on("touchcancel.owl.core", a.proxy(this.onDragEnd, this)))
    }, e.prototype.onDragStart = function(b) {
        var d = null;
        3 !== b.which && (a.support.transform ? (d = this.$stage.css("transform").replace(/.*\(|\)| /g, "").split(","), d = {
            x: d[16 === d.length ? 12 : 4],
            y: d[16 === d.length ? 13 : 5]
        }) : (d = this.$stage.position(), d = {
            x: this.settings.rtl ? d.left + this.$stage.width() - this.width() + this.settings.margin : d.left,
            y: d.top
        }), this.is("animating") && (a.support.transform ? this.animate(d.x) : this.$stage.stop(), this.invalidate("position")), this.$element.toggleClass(this.options.grabClass, "mousedown" === b.type), this.speed(0), this._drag.time = (new Date).getTime(), this._drag.target = a(b.target), this._drag.stage.start = d, this._drag.stage.current = d, this._drag.pointer = this.pointer(b), a(c).on("mouseup.owl.core touchend.owl.core", a.proxy(this.onDragEnd, this)), a(c).one("mousemove.owl.core touchmove.owl.core", a.proxy(function(b) {
            var d = this.difference(this._drag.pointer, this.pointer(b));
            a(c).on("mousemove.owl.core touchmove.owl.core", a.proxy(this.onDragMove, this)), Math.abs(d.x) < Math.abs(d.y) && this.is("valid") || (b.preventDefault(), this.enter("dragging"), this.trigger("drag"))
        }, this)))
    }, e.prototype.onDragMove = function(a) {
        var b = null,
            c = null,
            d = null,
            e = this.difference(this._drag.pointer, this.pointer(a)),
            f = this.difference(this._drag.stage.start, e);
        this.is("dragging") && (a.preventDefault(), this.settings.loop ? (b = this.coordinates(this.minimum()), c = this.coordinates(this.maximum() + 1) - b, f.x = ((f.x - b) % c + c) % c + b) : (b = this.settings.rtl ? this.coordinates(this.maximum()) : this.coordinates(this.minimum()), c = this.settings.rtl ? this.coordinates(this.minimum()) : this.coordinates(this.maximum()), d = this.settings.pullDrag ? -1 * e.x / 5 : 0, f.x = Math.max(Math.min(f.x, b + d), c + d)), this._drag.stage.current = f, this.animate(f.x))
    }, e.prototype.onDragEnd = function(b) {
        var d = this.difference(this._drag.pointer, this.pointer(b)),
            e = this._drag.stage.current,
            f = d.x > 0 ^ this.settings.rtl ? "left" : "right";
        a(c).off(".owl.core"), this.$element.removeClass(this.options.grabClass), (0 !== d.x && this.is("dragging") || !this.is("valid")) && (this.speed(this.settings.dragEndSpeed || this.settings.smartSpeed), this.current(this.closest(e.x, 0 !== d.x ? f : this._drag.direction)), this.invalidate("position"), this.update(), this._drag.direction = f, (Math.abs(d.x) > 3 || (new Date).getTime() - this._drag.time > 300) && this._drag.target.one("click.owl.core", function() {
            return !1
        })), this.is("dragging") && (this.leave("dragging"), this.trigger("dragged"))
    }, e.prototype.closest = function(b, c) {
        var d = -1,
            e = 30,
            f = this.width(),
            g = this.coordinates();
        return this.settings.freeDrag || a.each(g, a.proxy(function(a, h) {
            return "left" === c && b > h - e && b < h + e ? d = a : "right" === c && b > h - f - e && b < h - f + e ? d = a + 1 : this.op(b, "<", h) && this.op(b, ">", g[a + 1] || h - f) && (d = "left" === c ? a + 1 : a), d === -1
        }, this)), this.settings.loop || (this.op(b, ">", g[this.minimum()]) ? d = b = this.minimum() : this.op(b, "<", g[this.maximum()]) && (d = b = this.maximum())), d
    }, e.prototype.animate = function(b) {
        var c = this.speed() > 0;
        this.is("animating") && this.onTransitionEnd(), c && (this.enter("animating"), this.trigger("translate")), a.support.transform3d && a.support.transition ? this.$stage.css({
            transform: "translate3d(" + b + "px,0px,0px)",
            transition: this.speed() / 1e3 + "s"
        }) : c ? this.$stage.animate({
            left: b + "px"
        }, this.speed(), this.settings.fallbackEasing, a.proxy(this.onTransitionEnd, this)) : this.$stage.css({
            left: b + "px"
        })
    }, e.prototype.is = function(a) {
        return this._states.current[a] && this._states.current[a] > 0
    }, e.prototype.current = function(a) {
        if (a === d) return this._current;
        if (0 === this._items.length) return d;
        if (a = this.normalize(a), this._current !== a) {
            var b = this.trigger("change", {
                property: {
                    name: "position",
                    value: a
                }
            });
            b.data !== d && (a = this.normalize(b.data)), this._current = a, this.invalidate("position"), this.trigger("changed", {
                property: {
                    name: "position",
                    value: this._current
                }
            })
        }
        return this._current
    }, e.prototype.invalidate = function(b) {
        return "string" === a.type(b) && (this._invalidated[b] = !0, this.is("valid") && this.leave("valid")), a.map(this._invalidated, function(a, b) {
            return b
        })
    }, e.prototype.reset = function(a) {
        a = this.normalize(a), a !== d && (this._speed = 0, this._current = a, this.suppress(["translate", "translated"]), this.animate(this.coordinates(a)), this.release(["translate", "translated"]))
    }, e.prototype.normalize = function(a, b) {
        var c = this._items.length,
            e = b ? 0 : this._clones.length;
        return !this.isNumeric(a) || c < 1 ? a = d : (a < 0 || a >= c + e) && (a = ((a - e / 2) % c + c) % c + e / 2), a
    }, e.prototype.relative = function(a) {
        return a -= this._clones.length / 2, this.normalize(a, !0)
    }, e.prototype.maximum = function(a) {
        var b, c, d, e = this.settings,
            f = this._coordinates.length;
        if (e.loop) f = this._clones.length / 2 + this._items.length - 1;
        else if (e.autoWidth || e.merge) {
            for (b = this._items.length, c = this._items[--b].width(), d = this.$element.width(); b-- && (c += this._items[b].width() + this.settings.margin, !(c > d)););
            f = b + 1
        } else f = e.center ? this._items.length - 1 : this._items.length - e.items;
        return a && (f -= this._clones.length / 2), Math.max(f, 0)
    }, e.prototype.minimum = function(a) {
        return a ? 0 : this._clones.length / 2
    }, e.prototype.items = function(a) {
        return a === d ? this._items.slice() : (a = this.normalize(a, !0), this._items[a])
    }, e.prototype.mergers = function(a) {
        return a === d ? this._mergers.slice() : (a = this.normalize(a, !0), this._mergers[a])
    }, e.prototype.clones = function(b) {
        var c = this._clones.length / 2,
            e = c + this._items.length,
            f = function(a) {
                return a % 2 === 0 ? e + a / 2 : c - (a + 1) / 2
            };
        return b === d ? a.map(this._clones, function(a, b) {
            return f(b)
        }) : a.map(this._clones, function(a, c) {
            return a === b ? f(c) : null
        })
    }, e.prototype.speed = function(a) {
        return a !== d && (this._speed = a), this._speed
    }, e.prototype.coordinates = function(b) {
        var c, e = 1,
            f = b - 1;
        return b === d ? a.map(this._coordinates, a.proxy(function(a, b) {
            return this.coordinates(b)
        }, this)) : (this.settings.center ? (this.settings.rtl && (e = -1, f = b + 1), c = this._coordinates[b], c += (this.width() - c + (this._coordinates[f] || 0)) / 2 * e) : c = this._coordinates[f] || 0, c = Math.ceil(c))
    }, e.prototype.duration = function(a, b, c) {
        return 0 === c ? 0 : Math.min(Math.max(Math.abs(b - a), 1), 6) * Math.abs(c || this.settings.smartSpeed)
    }, e.prototype.to = function(a, b) {
        var c = this.current(),
            d = null,
            e = a - this.relative(c),
            f = (e > 0) - (e < 0),
            g = this._items.length,
            h = this.minimum(),
            i = this.maximum();
        this.settings.loop ? (!this.settings.rewind && Math.abs(e) > g / 2 && (e += f * -1 * g), a = c + e, d = ((a - h) % g + g) % g + h, d !== a && d - e <= i && d - e > 0 && (c = d - e, a = d, this.reset(c))) : this.settings.rewind ? (i += 1, a = (a % i + i) % i) : a = Math.max(h, Math.min(i, a)), this.speed(this.duration(c, a, b)), this.current(a), this.$element.is(":visible") && this.update()
    }, e.prototype.next = function(a) {
        a = a || !1, this.to(this.relative(this.current()) + 1, a)
    }, e.prototype.prev = function(a) {
        a = a || !1, this.to(this.relative(this.current()) - 1, a)
    }, e.prototype.onTransitionEnd = function(a) {
        if (a !== d && (a.stopPropagation(), (a.target || a.srcElement || a.originalTarget) !== this.$stage.get(0))) return !1;
        this.leave("animating"), this.trigger("translated")
    }, e.prototype.viewport = function() {
        var d;
        return this.options.responsiveBaseElement !== b ? d = a(this.options.responsiveBaseElement).width() : b.innerWidth ? d = b.innerWidth : c.documentElement && c.documentElement.clientWidth ? d = c.documentElement.clientWidth : console.warn("Can not detect viewport width."), d
    }, e.prototype.replace = function(b) {
        this.$stage.empty(), this._items = [], b && (b = b instanceof jQuery ? b : a(b)), this.settings.nestedItemSelector && (b = b.find("." + this.settings.nestedItemSelector)), b.filter(function() {
            return 1 === this.nodeType
        }).each(a.proxy(function(a, b) {
            b = this.prepare(b), this.$stage.append(b), this._items.push(b), this._mergers.push(1 * b.find("[data-merge]").addBack("[data-merge]").attr("data-merge") || 1)
        }, this)), this.reset(this.isNumeric(this.settings.startPosition) ? this.settings.startPosition : 0), this.invalidate("items")
    }, e.prototype.add = function(b, c) {
        var e = this.relative(this._current);
        c = c === d ? this._items.length : this.normalize(c, !0), b = b instanceof jQuery ? b : a(b), this.trigger("add", {
            content: b,
            position: c
        }), b = this.prepare(b), 0 === this._items.length || c === this._items.length ? (0 === this._items.length && this.$stage.append(b), 0 !== this._items.length && this._items[c - 1].after(b), this._items.push(b), this._mergers.push(1 * b.find("[data-merge]").addBack("[data-merge]").attr("data-merge") || 1)) : (this._items[c].before(b), this._items.splice(c, 0, b), this._mergers.splice(c, 0, 1 * b.find("[data-merge]").addBack("[data-merge]").attr("data-merge") || 1)), this._items[e] && this.reset(this._items[e].index()), this.invalidate("items"), this.trigger("added", {
            content: b,
            position: c
        })
    }, e.prototype.remove = function(a) {
        a = this.normalize(a, !0), a !== d && (this.trigger("remove", {
            content: this._items[a],
            position: a
        }), this._items[a].remove(), this._items.splice(a, 1), this._mergers.splice(a, 1), this.invalidate("items"), this.trigger("removed", {
            content: null,
            position: a
        }))
    }, e.prototype.preloadAutoWidthImages = function(b) {
        b.each(a.proxy(function(b, c) {
            this.enter("pre-loading"), c = a(c), a(new Image).one("load", a.proxy(function(a) {
                c.attr("src", a.target.src), c.css("opacity", 1), this.leave("pre-loading"), !this.is("pre-loading") && !this.is("initializing") && this.refresh()
            }, this)).attr("src", c.attr("src") || c.attr("data-src") || c.attr("data-src-retina"))
        }, this))
    }, e.prototype.destroy = function() {
        this.$element.off(".owl.core"), this.$stage.off(".owl.core"), a(c).off(".owl.core"), this.settings.responsive !== !1 && (b.clearTimeout(this.resizeTimer), this.off(b, "resize", this._handlers.onThrottledResize));
        for (var d in this._plugins) this._plugins[d].destroy();
        this.$stage.children(".cloned").remove(), this.$stage.unwrap(), this.$stage.children().contents().unwrap(), this.$stage.children().unwrap(), this.$element.removeClass(this.options.refreshClass).removeClass(this.options.loadingClass).removeClass(this.options.loadedClass).removeClass(this.options.rtlClass).removeClass(this.options.dragClass).removeClass(this.options.grabClass).attr("class", this.$element.attr("class").replace(new RegExp(this.options.responsiveClass + "-\\S+\\s", "g"), "")).removeData("owl.carousel")
    }, e.prototype.op = function(a, b, c) {
        var d = this.settings.rtl;
        switch (b) {
            case "<":
                return d ? a > c : a < c;
            case ">":
                return d ? a < c : a > c;
            case ">=":
                return d ? a <= c : a >= c;
            case "<=":
                return d ? a >= c : a <= c
        }
    }, e.prototype.on = function(a, b, c, d) {
        a.addEventListener ? a.addEventListener(b, c, d) : a.attachEvent && a.attachEvent("on" + b, c)
    }, e.prototype.off = function(a, b, c, d) {
        a.removeEventListener ? a.removeEventListener(b, c, d) : a.detachEvent && a.detachEvent("on" + b, c)
    }, e.prototype.trigger = function(b, c, d, f, g) {
        var h = {
                item: {
                    count: this._items.length,
                    index: this.current()
                }
            },
            i = a.camelCase(a.grep(["on", b, d], function(a) {
                return a
            }).join("-").toLowerCase()),
            j = a.Event([b, "owl", d || "carousel"].join(".").toLowerCase(), a.extend({
                relatedTarget: this
            }, h, c));
        return this._supress[b] || (a.each(this._plugins, function(a, b) {
            b.onTrigger && b.onTrigger(j)
        }), this.register({
            type: e.Type.Event,
            name: b
        }), this.$element.trigger(j), this.settings && "function" == typeof this.settings[i] && this.settings[i].call(this, j)), j
    }, e.prototype.enter = function(b) {
        a.each([b].concat(this._states.tags[b] || []), a.proxy(function(a, b) {
            this._states.current[b] === d && (this._states.current[b] = 0), this._states.current[b]++
        }, this))
    }, e.prototype.leave = function(b) {
        a.each([b].concat(this._states.tags[b] || []), a.proxy(function(a, b) {
            this._states.current[b]--
        }, this))
    }, e.prototype.register = function(b) {
        if (b.type === e.Type.Event) {
            if (a.event.special[b.name] || (a.event.special[b.name] = {}), !a.event.special[b.name].owl) {
                var c = a.event.special[b.name]._default;
                a.event.special[b.name]._default = function(a) {
                    return !c || !c.apply || a.namespace && a.namespace.indexOf("owl") !== -1 ? a.namespace && a.namespace.indexOf("owl") > -1 : c.apply(this, arguments)
                }, a.event.special[b.name].owl = !0
            }
        } else b.type === e.Type.State && (this._states.tags[b.name] ? this._states.tags[b.name] = this._states.tags[b.name].concat(b.tags) : this._states.tags[b.name] = b.tags, this._states.tags[b.name] = a.grep(this._states.tags[b.name], a.proxy(function(c, d) {
            return a.inArray(c, this._states.tags[b.name]) === d
        }, this)))
    }, e.prototype.suppress = function(b) {
        a.each(b, a.proxy(function(a, b) {
            this._supress[b] = !0
        }, this))
    }, e.prototype.release = function(b) {
        a.each(b, a.proxy(function(a, b) {
            delete this._supress[b]
        }, this))
    }, e.prototype.pointer = function(a) {
        var c = {
            x: null,
            y: null
        };
        return a = a.originalEvent || a || b.event, a = a.touches && a.touches.length ? a.touches[0] : a.changedTouches && a.changedTouches.length ? a.changedTouches[0] : a, a.pageX ? (c.x = a.pageX, c.y = a.pageY) : (c.x = a.clientX, c.y = a.clientY), c
    }, e.prototype.isNumeric = function(a) {
        return !isNaN(parseFloat(a))
    }, e.prototype.difference = function(a, b) {
        return {
            x: a.x - b.x,
            y: a.y - b.y
        }
    }, a.fn.owlCarousel = function(b) {
        var c = Array.prototype.slice.call(arguments, 1);
        return this.each(function() {
            var d = a(this),
                f = d.data("owl.carousel");
            f || (f = new e(this, "object" == typeof b && b), d.data("owl.carousel", f), a.each(["next", "prev", "to", "destroy", "refresh", "replace", "add", "remove"], function(b, c) {
                f.register({
                    type: e.Type.Event,
                    name: c
                }), f.$element.on(c + ".owl.carousel.core", a.proxy(function(a) {
                    a.namespace && a.relatedTarget !== this && (this.suppress([c]), f[c].apply(this, [].slice.call(arguments, 1)), this.release([c]))
                }, f))
            })), "string" == typeof b && "_" !== b.charAt(0) && f[b].apply(f, c)
        })
    }, a.fn.owlCarousel.Constructor = e
}(window.Zepto || window.jQuery, window, document),
function(a, b, c, d) {
    var e = function(b) {
        this._core = b, this._interval = null, this._visible = null, this._handlers = {
            "initialized.owl.carousel": a.proxy(function(a) {
                a.namespace && this._core.settings.autoRefresh && this.watch()
            }, this)
        }, this._core.options = a.extend({}, e.Defaults, this._core.options), this._core.$element.on(this._handlers)
    };
    e.Defaults = {
        autoRefresh: !0,
        autoRefreshInterval: 500
    }, e.prototype.watch = function() {
        this._interval || (this._visible = this._core.$element.is(":visible"), this._interval = b.setInterval(a.proxy(this.refresh, this), this._core.settings.autoRefreshInterval))
    }, e.prototype.refresh = function() {
        this._core.$element.is(":visible") !== this._visible && (this._visible = !this._visible, this._core.$element.toggleClass("owl-hidden", !this._visible), this._visible && this._core.invalidate("width") && this._core.refresh())
    }, e.prototype.destroy = function() {
        var a, c;
        b.clearInterval(this._interval);
        for (a in this._handlers) this._core.$element.off(a, this._handlers[a]);
        for (c in Object.getOwnPropertyNames(this)) "function" != typeof this[c] && (this[c] = null)
    }, a.fn.owlCarousel.Constructor.Plugins.AutoRefresh = e
}(window.Zepto || window.jQuery, window, document),
function(a, b, c, d) {
    var e = function(b) {
        this._core = b, this._loaded = [], this._handlers = {
            "initialized.owl.carousel change.owl.carousel resized.owl.carousel": a.proxy(function(b) {
                if (b.namespace && this._core.settings && this._core.settings.lazyLoad && (b.property && "position" == b.property.name || "initialized" == b.type))
                    for (var c = this._core.settings, e = c.center && Math.ceil(c.items / 2) || c.items, f = c.center && e * -1 || 0, g = (b.property && b.property.value !== d ? b.property.value : this._core.current()) + f, h = this._core.clones().length, i = a.proxy(function(a, b) {
                            this.load(b)
                        }, this); f++ < e;) this.load(h / 2 + this._core.relative(g)), h && a.each(this._core.clones(this._core.relative(g)), i), g++
            }, this)
        }, this._core.options = a.extend({}, e.Defaults, this._core.options), this._core.$element.on(this._handlers)
    };
    e.Defaults = {
        lazyLoad: !1
    }, e.prototype.load = function(c) {
        var d = this._core.$stage.children().eq(c),
            e = d && d.find(".owl-lazy");
        !e || a.inArray(d.get(0), this._loaded) > -1 || (e.each(a.proxy(function(c, d) {
            var e, f = a(d),
                g = b.devicePixelRatio > 1 && f.attr("data-src-retina") || f.attr("data-src");
            this._core.trigger("load", {
                element: f,
                url: g
            }, "lazy"), f.is("img") ? f.one("load.owl.lazy", a.proxy(function() {
                f.css("opacity", 1), this._core.trigger("loaded", {
                    element: f,
                    url: g
                }, "lazy")
            }, this)).attr("src", g) : (e = new Image, e.onload = a.proxy(function() {
                f.css({
                    "background-image": 'url("' + g + '")',
                    opacity: "1"
                }), this._core.trigger("loaded", {
                    element: f,
                    url: g
                }, "lazy")
            }, this), e.src = g)
        }, this)), this._loaded.push(d.get(0)))
    }, e.prototype.destroy = function() {
        var a, b;
        for (a in this.handlers) this._core.$element.off(a, this.handlers[a]);
        for (b in Object.getOwnPropertyNames(this)) "function" != typeof this[b] && (this[b] = null)
    }, a.fn.owlCarousel.Constructor.Plugins.Lazy = e
}(window.Zepto || window.jQuery, window, document),
function(a, b, c, d) {
    var e = function(b) {
        this._core = b, this._handlers = {
            "initialized.owl.carousel refreshed.owl.carousel": a.proxy(function(a) {
                a.namespace && this._core.settings.autoHeight && this.update()
            }, this),
            "changed.owl.carousel": a.proxy(function(a) {
                a.namespace && this._core.settings.autoHeight && "position" == a.property.name && this.update()
            }, this),
            "loaded.owl.lazy": a.proxy(function(a) {
                a.namespace && this._core.settings.autoHeight && a.element.closest("." + this._core.settings.itemClass).index() === this._core.current() && this.update()
            }, this)
        }, this._core.options = a.extend({}, e.Defaults, this._core.options), this._core.$element.on(this._handlers)
    };
    e.Defaults = {
        autoHeight: !1,
        autoHeightClass: "owl-height"
    }, e.prototype.update = function() {
        var b = this._core._current,
            c = b + this._core.settings.items,
            d = this._core.$stage.children().toArray().slice(b, c),
            e = [],
            f = 0;
        a.each(d, function(b, c) {
            e.push(a(c).height())
        }), f = Math.max.apply(null, e), this._core.$stage.parent().height(f).addClass(this._core.settings.autoHeightClass)
    }, e.prototype.destroy = function() {
        var a, b;
        for (a in this._handlers) this._core.$element.off(a, this._handlers[a]);
        for (b in Object.getOwnPropertyNames(this)) "function" != typeof this[b] && (this[b] = null)
    }, a.fn.owlCarousel.Constructor.Plugins.AutoHeight = e
}(window.Zepto || window.jQuery, window, document),
function(a, b, c, d) {
    var e = function(b) {
        this._core = b, this._videos = {}, this._playing = null, this._handlers = {
            "initialized.owl.carousel": a.proxy(function(a) {
                a.namespace && this._core.register({
                    type: "state",
                    name: "playing",
                    tags: ["interacting"]
                })
            }, this),
            "resize.owl.carousel": a.proxy(function(a) {
                a.namespace && this._core.settings.video && this.isInFullScreen() && a.preventDefault()
            }, this),
            "refreshed.owl.carousel": a.proxy(function(a) {
                a.namespace && this._core.is("resizing") && this._core.$stage.find(".cloned .owl-video-frame").remove()
            }, this),
            "changed.owl.carousel": a.proxy(function(a) {
                a.namespace && "position" === a.property.name && this._playing && this.stop()
            }, this),
            "prepared.owl.carousel": a.proxy(function(b) {
                if (b.namespace) {
                    var c = a(b.content).find(".owl-video");
                    c.length && (c.css("display", "none"), this.fetch(c, a(b.content)))
                }
            }, this)
        }, this._core.options = a.extend({}, e.Defaults, this._core.options), this._core.$element.on(this._handlers), this._core.$element.on("click.owl.video", ".owl-video-play-icon", a.proxy(function(a) {
            this.play(a)
        }, this))
    };
    e.Defaults = {
        video: !1,
        videoHeight: !1,
        videoWidth: !1
    }, e.prototype.fetch = function(a, b) {
        var c = function() {
                return a.attr("data-vimeo-id") ? "vimeo" : a.attr("data-vzaar-id") ? "vzaar" : "youtube"
            }(),
            d = a.attr("data-vimeo-id") || a.attr("data-youtube-id") || a.attr("data-vzaar-id"),
            e = a.attr("data-width") || this._core.settings.videoWidth,
            f = a.attr("data-height") || this._core.settings.videoHeight,
            g = a.attr("href");
        if (!g) throw new Error("Missing video URL.");
        if (d = g.match(/(http:|https:|)\/\/(player.|www.|app.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com)|vzaar\.com)\/(video\/|videos\/|embed\/|channels\/.+\/|groups\/.+\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(\&\S+)?/), d[3].indexOf("youtu") > -1) c = "youtube";
        else if (d[3].indexOf("vimeo") > -1) c = "vimeo";
        else {
            if (!(d[3].indexOf("vzaar") > -1)) throw new Error("Video URL not supported.");
            c = "vzaar"
        }
        d = d[6], this._videos[g] = {
            type: c,
            id: d,
            width: e,
            height: f
        }, b.attr("data-video", g), this.thumbnail(a, this._videos[g])
    }, e.prototype.thumbnail = function(b, c) {
        var d, e, f, g = c.width && c.height ? 'style="width:' + c.width + "px;height:" + c.height + 'px;"' : "",
            h = b.find("img"),
            i = "src",
            j = "",
            k = this._core.settings,
            l = function(a) {
                e = '<div class="owl-video-play-icon"></div>', d = k.lazyLoad ? '<div class="owl-video-tn ' + j + '" ' + i + '="' + a + '"></div>' : '<div class="owl-video-tn" style="opacity:1;background-image:url(' + a + ')"></div>', b.after(d), b.after(e)
            };
        if (b.wrap('<div class="owl-video-wrapper"' + g + "></div>"), this._core.settings.lazyLoad && (i = "data-src", j = "owl-lazy"), h.length) return l(h.attr(i)), h.remove(), !1;
        "youtube" === c.type ? (f = "//img.youtube.com/vi/" + c.id + "/hqdefault.jpg", l(f)) : "vimeo" === c.type ? a.ajax({
            type: "GET",
            url: "//vimeo.com/api/v2/video/" + c.id + ".json",
            jsonp: "callback",
            dataType: "jsonp",
            success: function(a) {
                f = a[0].thumbnail_large, l(f)
            }
        }) : "vzaar" === c.type && a.ajax({
            type: "GET",
            url: "//vzaar.com/api/videos/" + c.id + ".json",
            jsonp: "callback",
            dataType: "jsonp",
            success: function(a) {
                f = a.framegrab_url, l(f)
            }
        })
    }, e.prototype.stop = function() {
        this._core.trigger("stop", null, "video"), this._playing.find(".owl-video-frame").remove(), this._playing.removeClass("owl-video-playing"), this._playing = null, this._core.leave("playing"), this._core.trigger("stopped", null, "video")
    }, e.prototype.play = function(b) {
        var c, d = a(b.target),
            e = d.closest("." + this._core.settings.itemClass),
            f = this._videos[e.attr("data-video")],
            g = f.width || "100%",
            h = f.height || this._core.$stage.height();
        this._playing || (this._core.enter("playing"), this._core.trigger("play", null, "video"), e = this._core.items(this._core.relative(e.index())), this._core.reset(e.index()), "youtube" === f.type ? c = '<iframe width="' + g + '" height="' + h + '" src="//www.youtube.com/embed/' + f.id + "?autoplay=1&rel=0&v=" + f.id + '" frameborder="0" allowfullscreen></iframe>' : "vimeo" === f.type ? c = '<iframe src="//player.vimeo.com/video/' + f.id + '?autoplay=1" width="' + g + '" height="' + h + '" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>' : "vzaar" === f.type && (c = '<iframe frameborder="0"height="' + h + '"width="' + g + '" allowfullscreen mozallowfullscreen webkitAllowFullScreen src="//view.vzaar.com/' + f.id + '/player?autoplay=true"></iframe>'), a('<div class="owl-video-frame">' + c + "</div>").insertAfter(e.find(".owl-video")), this._playing = e.addClass("owl-video-playing"))
    }, e.prototype.isInFullScreen = function() {
        var b = c.fullscreenElement || c.mozFullScreenElement || c.webkitFullscreenElement;
        return b && a(b).parent().hasClass("owl-video-frame")
    }, e.prototype.destroy = function() {
        var a, b;
        this._core.$element.off("click.owl.video");
        for (a in this._handlers) this._core.$element.off(a, this._handlers[a]);
        for (b in Object.getOwnPropertyNames(this)) "function" != typeof this[b] && (this[b] = null)
    }, a.fn.owlCarousel.Constructor.Plugins.Video = e
}(window.Zepto || window.jQuery, window, document),
function(a, b, c, d) {
    var e = function(b) {
        this.core = b, this.core.options = a.extend({}, e.Defaults, this.core.options), this.swapping = !0, this.previous = d, this.next = d, this.handlers = {
            "change.owl.carousel": a.proxy(function(a) {
                a.namespace && "position" == a.property.name && (this.previous = this.core.current(), this.next = a.property.value)
            }, this),
            "drag.owl.carousel dragged.owl.carousel translated.owl.carousel": a.proxy(function(a) {
                a.namespace && (this.swapping = "translated" == a.type)
            }, this),
            "translate.owl.carousel": a.proxy(function(a) {
                a.namespace && this.swapping && (this.core.options.animateOut || this.core.options.animateIn) && this.swap()
            }, this)
        }, this.core.$element.on(this.handlers)
    };
    e.Defaults = {
            animateOut: !1,
            animateIn: !1
        }, e.prototype.swap = function() {
            if (1 === this.core.settings.items && a.support.animation && a.support.transition) {
                this.core.speed(0);
                var b, c = a.proxy(this.clear, this),
                    d = this.core.$stage.children().eq(this.previous),
                    e = this.core.$stage.children().eq(this.next),
                    f = this.core.settings.animateIn,
                    g = this.core.settings.animateOut;
                this.core.current() !== this.previous && (g && (b = this.core.coordinates(this.previous) - this.core.coordinates(this.next), d.one(a.support.animation.end, c).css({
                    left: b + "px"
                }).addClass("animated owl-animated-out").addClass(g)), f && e.one(a.support.animation.end, c).addClass("animated owl-animated-in").addClass(f))
            }
        }, e.prototype.clear = function(b) {
            a(b.target).css({
                left: ""
            }).removeClass("animated owl-animated-out owl-animated-in").removeClass(this.core.settings.animateIn).removeClass(this.core.settings.animateOut), this.core.onTransitionEnd()
        }, e.prototype.destroy = function() {
            var a, b;
            for (a in this.handlers) this.core.$element.off(a, this.handlers[a]);
            for (b in Object.getOwnPropertyNames(this)) "function" != typeof this[b] && (this[b] = null)
        },
        a.fn.owlCarousel.Constructor.Plugins.Animate = e
}(window.Zepto || window.jQuery, window, document),
function(a, b, c, d) {
    var e = function(b) {
        this._core = b, this._timeout = null, this._paused = !1, this._handlers = {
            "changed.owl.carousel": a.proxy(function(a) {
                a.namespace && "settings" === a.property.name ? this._core.settings.autoplay ? this.play() : this.stop() : a.namespace && "position" === a.property.name && this._core.settings.autoplay && this._setAutoPlayInterval()
            }, this),
            "initialized.owl.carousel": a.proxy(function(a) {
                a.namespace && this._core.settings.autoplay && this.play()
            }, this),
            "play.owl.autoplay": a.proxy(function(a, b, c) {
                a.namespace && this.play(b, c)
            }, this),
            "stop.owl.autoplay": a.proxy(function(a) {
                a.namespace && this.stop()
            }, this),
            "mouseover.owl.autoplay": a.proxy(function() {
                this._core.settings.autoplayHoverPause && this._core.is("rotating") && this.pause()
            }, this),
            "mouseleave.owl.autoplay": a.proxy(function() {
                this._core.settings.autoplayHoverPause && this._core.is("rotating") && this.play()
            }, this),
            "touchstart.owl.core": a.proxy(function() {
                this._core.settings.autoplayHoverPause && this._core.is("rotating") && this.pause()
            }, this),
            "touchend.owl.core": a.proxy(function() {
                this._core.settings.autoplayHoverPause && this.play()
            }, this)
        }, this._core.$element.on(this._handlers), this._core.options = a.extend({}, e.Defaults, this._core.options)
    };
    e.Defaults = {
        autoplay: !1,
        autoplayTimeout: 5e3,
        autoplayHoverPause: !1,
        autoplaySpeed: !1
    }, e.prototype.play = function(a, b) {
        this._paused = !1, this._core.is("rotating") || (this._core.enter("rotating"), this._setAutoPlayInterval())
    }, e.prototype._getNextTimeout = function(d, e) {
        return this._timeout && b.clearTimeout(this._timeout), b.setTimeout(a.proxy(function() {
            this._paused || this._core.is("busy") || this._core.is("interacting") || c.hidden || this._core.next(e || this._core.settings.autoplaySpeed)
        }, this), d || this._core.settings.autoplayTimeout)
    }, e.prototype._setAutoPlayInterval = function() {
        this._timeout = this._getNextTimeout()
    }, e.prototype.stop = function() {
        this._core.is("rotating") && (b.clearTimeout(this._timeout), this._core.leave("rotating"))
    }, e.prototype.pause = function() {
        this._core.is("rotating") && (this._paused = !0)
    }, e.prototype.destroy = function() {
        var a, b;
        this.stop();
        for (a in this._handlers) this._core.$element.off(a, this._handlers[a]);
        for (b in Object.getOwnPropertyNames(this)) "function" != typeof this[b] && (this[b] = null)
    }, a.fn.owlCarousel.Constructor.Plugins.autoplay = e
}(window.Zepto || window.jQuery, window, document),
function(a, b, c, d) {
    "use strict";
    var e = function(b) {
        this._core = b, this._initialized = !1, this._pages = [], this._controls = {}, this._templates = [], this.$element = this._core.$element, this._overrides = {
            next: this._core.next,
            prev: this._core.prev,
            to: this._core.to
        }, this._handlers = {
            "prepared.owl.carousel": a.proxy(function(b) {
                b.namespace && this._core.settings.dotsData && this._templates.push('<div class="' + this._core.settings.dotClass + '">' + a(b.content).find("[data-dot]").addBack("[data-dot]").attr("data-dot") + "</div>")
            }, this),
            "added.owl.carousel": a.proxy(function(a) {
                a.namespace && this._core.settings.dotsData && this._templates.splice(a.position, 0, this._templates.pop())
            }, this),
            "remove.owl.carousel": a.proxy(function(a) {
                a.namespace && this._core.settings.dotsData && this._templates.splice(a.position, 1)
            }, this),
            "changed.owl.carousel": a.proxy(function(a) {
                a.namespace && "position" == a.property.name && this.draw()
            }, this),
            "initialized.owl.carousel": a.proxy(function(a) {
                a.namespace && !this._initialized && (this._core.trigger("initialize", null, "navigation"), this.initialize(), this.update(), this.draw(), this._initialized = !0, this._core.trigger("initialized", null, "navigation"))
            }, this),
            "refreshed.owl.carousel": a.proxy(function(a) {
                a.namespace && this._initialized && (this._core.trigger("refresh", null, "navigation"), this.update(), this.draw(), this._core.trigger("refreshed", null, "navigation"))
            }, this)
        }, this._core.options = a.extend({}, e.Defaults, this._core.options), this.$element.on(this._handlers)
    };
    e.Defaults = {
        nav: !1,
        navText: ["prev", "next"],
        navSpeed: !1,
        navElement: "div",
        navContainer: !1,
        navContainerClass: "owl-nav",
        navClass: ["owl-prev", "owl-next"],
        slideBy: 1,
        dotClass: "owl-dot",
        dotsClass: "owl-dots",
        dots: !0,
        dotsEach: !1,
        dotsData: !1,
        dotsSpeed: !1,
        dotsContainer: !1
    }, e.prototype.initialize = function() {
        var b, c = this._core.settings;
        this._controls.$relative = (c.navContainer ? a(c.navContainer) : a("<div>").addClass(c.navContainerClass).appendTo(this.$element)).addClass("disabled"), this._controls.$previous = a("<" + c.navElement + ">").addClass(c.navClass[0]).html(c.navText[0]).prependTo(this._controls.$relative).on("click", a.proxy(function(a) {
            this.prev(c.navSpeed)
        }, this)), this._controls.$next = a("<" + c.navElement + ">").addClass(c.navClass[1]).html(c.navText[1]).appendTo(this._controls.$relative).on("click", a.proxy(function(a) {
            this.next(c.navSpeed)
        }, this)), c.dotsData || (this._templates = [a("<div>").addClass(c.dotClass).append(a("<span>")).prop("outerHTML")]), this._controls.$absolute = (c.dotsContainer ? a(c.dotsContainer) : a("<div>").addClass(c.dotsClass).appendTo(this.$element)).addClass("disabled"), this._controls.$absolute.on("click", "div", a.proxy(function(b) {
            var d = a(b.target).parent().is(this._controls.$absolute) ? a(b.target).index() : a(b.target).parent().index();
            b.preventDefault(), this.to(d, c.dotsSpeed)
        }, this));
        for (b in this._overrides) this._core[b] = a.proxy(this[b], this)
    }, e.prototype.destroy = function() {
        var a, b, c, d;
        for (a in this._handlers) this.$element.off(a, this._handlers[a]);
        for (b in this._controls) this._controls[b].remove();
        for (d in this.overides) this._core[d] = this._overrides[d];
        for (c in Object.getOwnPropertyNames(this)) "function" != typeof this[c] && (this[c] = null)
    }, e.prototype.update = function() {
        var a, b, c, d = this._core.clones().length / 2,
            e = d + this._core.items().length,
            f = this._core.maximum(!0),
            g = this._core.settings,
            h = g.center || g.autoWidth || g.dotsData ? 1 : g.dotsEach || g.items;
        if ("page" !== g.slideBy && (g.slideBy = Math.min(g.slideBy, g.items)), g.dots || "page" == g.slideBy)
            for (this._pages = [], a = d, b = 0, c = 0; a < e; a++) {
                if (b >= h || 0 === b) {
                    if (this._pages.push({
                            start: Math.min(f, a - d),
                            end: a - d + h - 1
                        }), Math.min(f, a - d) === f) break;
                    b = 0, ++c
                }
                b += this._core.mergers(this._core.relative(a))
            }
    }, e.prototype.draw = function() {
        var b, c = this._core.settings,
            d = this._core.items().length <= c.items,
            e = this._core.relative(this._core.current()),
            f = c.loop || c.rewind;
        this._controls.$relative.toggleClass("disabled", !c.nav || d), c.nav && (this._controls.$previous.toggleClass("disabled", !f && e <= this._core.minimum(!0)), this._controls.$next.toggleClass("disabled", !f && e >= this._core.maximum(!0))), this._controls.$absolute.toggleClass("disabled", !c.dots || d), c.dots && (b = this._pages.length - this._controls.$absolute.children().length, c.dotsData && 0 !== b ? this._controls.$absolute.html(this._templates.join("")) : b > 0 ? this._controls.$absolute.append(new Array(b + 1).join(this._templates[0])) : b < 0 && this._controls.$absolute.children().slice(b).remove(), this._controls.$absolute.find(".active").removeClass("active"), this._controls.$absolute.children().eq(a.inArray(this.current(), this._pages)).addClass("active"))
    }, e.prototype.onTrigger = function(b) {
        var c = this._core.settings;
        b.page = {
            index: a.inArray(this.current(), this._pages),
            count: this._pages.length,
            size: c && (c.center || c.autoWidth || c.dotsData ? 1 : c.dotsEach || c.items)
        }
    }, e.prototype.current = function() {
        var b = this._core.relative(this._core.current());
        return a.grep(this._pages, a.proxy(function(a, c) {
            return a.start <= b && a.end >= b
        }, this)).pop()
    }, e.prototype.getPosition = function(b) {
        var c, d, e = this._core.settings;
        return "page" == e.slideBy ? (c = a.inArray(this.current(), this._pages), d = this._pages.length, b ? ++c : --c, c = this._pages[(c % d + d) % d].start) : (c = this._core.relative(this._core.current()), d = this._core.items().length, b ? c += e.slideBy : c -= e.slideBy), c
    }, e.prototype.next = function(b) {
        a.proxy(this._overrides.to, this._core)(this.getPosition(!0), b)
    }, e.prototype.prev = function(b) {
        a.proxy(this._overrides.to, this._core)(this.getPosition(!1), b)
    }, e.prototype.to = function(b, c, d) {
        var e;
        !d && this._pages.length ? (e = this._pages.length, a.proxy(this._overrides.to, this._core)(this._pages[(b % e + e) % e].start, c)) : a.proxy(this._overrides.to, this._core)(b, c)
    }, a.fn.owlCarousel.Constructor.Plugins.Navigation = e
}(window.Zepto || window.jQuery, window, document),
function(a, b, c, d) {
    "use strict";
    var e = function(c) {
        this._core = c, this._hashes = {}, this.$element = this._core.$element, this._handlers = {
            "initialized.owl.carousel": a.proxy(function(c) {
                c.namespace && "URLHash" === this._core.settings.startPosition && a(b).trigger("hashchange.owl.navigation")
            }, this),
            "prepared.owl.carousel": a.proxy(function(b) {
                if (b.namespace) {
                    var c = a(b.content).find("[data-hash]").addBack("[data-hash]").attr("data-hash");
                    if (!c) return;
                    this._hashes[c] = b.content
                }
            }, this),
            "changed.owl.carousel": a.proxy(function(c) {
                if (c.namespace && "position" === c.property.name) {
                    var d = this._core.items(this._core.relative(this._core.current())),
                        e = a.map(this._hashes, function(a, b) {
                            return a === d ? b : null
                        }).join();
                    if (!e || b.location.hash.slice(1) === e) return;
                    b.location.hash = e
                }
            }, this)
        }, this._core.options = a.extend({}, e.Defaults, this._core.options), this.$element.on(this._handlers), a(b).on("hashchange.owl.navigation", a.proxy(function(a) {
            var c = b.location.hash.substring(1),
                e = this._core.$stage.children(),
                f = this._hashes[c] && e.index(this._hashes[c]);
            f !== d && f !== this._core.current() && this._core.to(this._core.relative(f), !1, !0)
        }, this))
    };
    e.Defaults = {
        URLhashListener: !1
    }, e.prototype.destroy = function() {
        var c, d;
        a(b).off("hashchange.owl.navigation");
        for (c in this._handlers) this._core.$element.off(c, this._handlers[c]);
        for (d in Object.getOwnPropertyNames(this)) "function" != typeof this[d] && (this[d] = null)
    }, a.fn.owlCarousel.Constructor.Plugins.Hash = e
}(window.Zepto || window.jQuery, window, document),
function(a, b, c, d) {
    function e(b, c) {
        var e = !1,
            f = b.charAt(0).toUpperCase() + b.slice(1);
        return a.each((b + " " + h.join(f + " ") + f).split(" "), function(a, b) {
            if (g[b] !== d) return e = !c || b, !1
        }), e
    }

    function f(a) {
        return e(a, !0)
    }
    var g = a("<support>").get(0).style,
        h = "Webkit Moz O ms".split(" "),
        i = {
            transition: {
                end: {
                    WebkitTransition: "webkitTransitionEnd",
                    MozTransition: "transitionend",
                    OTransition: "oTransitionEnd",
                    transition: "transitionend"
                }
            },
            animation: {
                end: {
                    WebkitAnimation: "webkitAnimationEnd",
                    MozAnimation: "animationend",
                    OAnimation: "oAnimationEnd",
                    animation: "animationend"
                }
            }
        },
        j = {
            csstransforms: function() {
                return !!e("transform")
            },
            csstransforms3d: function() {
                return !!e("perspective")
            },
            csstransitions: function() {
                return !!e("transition")
            },
            cssanimations: function() {
                return !!e("animation")
            }
        };
    j.csstransitions() && (a.support.transition = new String(f("transition")), a.support.transition.end = i.transition.end[a.support.transition]), j.cssanimations() && (a.support.animation = new String(f("animation")), a.support.animation.end = i.animation.end[a.support.animation]), j.csstransforms() && (a.support.transform = new String(f("transform")), a.support.transform3d = j.csstransforms3d())
}(window.Zepto || window.jQuery, window, document);;
! function(t, s, e) {
    "use strict";
    var i = function(t, s) {
        var i = this;
        this.el = t, this.options = {}, Object.keys(r).forEach(function(t) {
            i.options[t] = r[t]
        }), Object.keys(s).forEach(function(t) {
            i.options[t] = s[t]
        }), this.isInput = "input" === this.el.tagName.toLowerCase(), this.attr = this.options.attr, this.showCursor = !this.isInput && this.options.showCursor, this.elContent = this.attr ? this.el.getAttribute(this.attr) : this.el.textContent, this.contentType = this.options.contentType, this.typeSpeed = this.options.typeSpeed, this.startDelay = this.options.startDelay, this.backSpeed = this.options.backSpeed, this.backDelay = this.options.backDelay, this.fadeOut = this.options.fadeOut, this.fadeOutClass = this.options.fadeOutClass, this.fadeOutDelay = this.options.fadeOutDelay, e && this.options.stringsElement instanceof e ? this.stringsElement = this.options.stringsElement[0] : this.stringsElement = this.options.stringsElement, this.strings = this.options.strings, this.strPos = 0, this.arrayPos = 0, this.stopNum = 0, this.loop = this.options.loop, this.loopCount = this.options.loopCount, this.curLoop = 0, this.stop = !1, this.cursorChar = this.options.cursorChar, this.shuffle = this.options.shuffle, this.sequence = [], this.build()
    };
    i.prototype = {
        constructor: i,
        init: function() {
            var t = this;
            t.timeout = setTimeout(function() {
                for (var s = 0; s < t.strings.length; ++s) t.sequence[s] = s;
                t.shuffle && (t.sequence = t.shuffleArray(t.sequence)), t.typewrite(t.strings[t.sequence[t.arrayPos]], t.strPos)
            }, t.startDelay)
        },
        build: function() {
            var t = this;
            if (this.showCursor === !0 && (this.cursor = s.createElement("span"), this.cursor.className = "typed-cursor", this.cursor.innerHTML = this.cursorChar, this.el.parentNode && this.el.parentNode.insertBefore(this.cursor, this.el.nextSibling)), this.stringsElement) {
                this.strings = [], this.stringsElement.style.display = "none";
                var e = Array.prototype.slice.apply(this.stringsElement.children);
                e.forEach(function(s) {
                    t.strings.push(s.innerHTML)
                })
            }
            this.init()
        },
        typewrite: function(t, s) {
            if (this.stop !== !0) {
                this.fadeOut && this.el.classList.contains(this.fadeOutClass) && (this.el.classList.remove(this.fadeOutClass), this.cursor.classList.remove(this.fadeOutClass));
                var e = Math.round(70 * Math.random()) + this.typeSpeed,
                    i = this;
                i.timeout = setTimeout(function() {
                    var e = 0,
                        r = t.substr(s);
                    if ("^" === r.charAt(0)) {
                        var o = 1;
                        /^\^\d+/.test(r) && (r = /\d+/.exec(r)[0], o += r.length, e = parseInt(r)), t = t.substring(0, s) + t.substring(s + o)
                    }
                    if ("html" === i.contentType) {
                        var n = t.substr(s).charAt(0);
                        if ("<" === n || "&" === n) {
                            var a = "",
                                h = "";
                            for (h = "<" === n ? ">" : ";"; t.substr(s + 1).charAt(0) !== h && (a += t.substr(s).charAt(0), s++, !(s + 1 > t.length)););
                            s++, a += h
                        }
                    }
                    i.timeout = setTimeout(function() {
                        if (s === t.length) {
                            if (i.options.onStringTyped(i.arrayPos), i.arrayPos === i.strings.length - 1 && (i.options.callback(), i.curLoop++, i.loop === !1 || i.curLoop === i.loopCount)) return;
                            i.timeout = setTimeout(function() {
                                i.backspace(t, s)
                            }, i.backDelay)
                        } else {
                            0 === s && i.options.preStringTyped(i.arrayPos);
                            var e = t.substr(0, s + 1);
                            i.attr ? i.el.setAttribute(i.attr, e) : i.isInput ? i.el.value = e : "html" === i.contentType ? i.el.innerHTML = e : i.el.textContent = e, s++, i.typewrite(t, s)
                        }
                    }, e)
                }, e)
            }
        },
        backspace: function(t, s) {
            var e = this;
            if (this.stop !== !0) {
                if (this.fadeOut) return void this.initFadeOut();
                var i = Math.round(70 * Math.random()) + this.backSpeed;
                e.timeout = setTimeout(function() {
                    if ("html" === e.contentType && ">" === t.substr(s).charAt(0)) {
                        for (var i = "";
                            "<" !== t.substr(s - 1).charAt(0) && (i -= t.substr(s).charAt(0), s--, !(s < 0)););
                        s--, i += "<"
                    }
                    var r = t.substr(0, s);
                    e.replaceText(r), s > e.stopNum ? (s--, e.backspace(t, s)) : s <= e.stopNum && (e.arrayPos++, e.arrayPos === e.strings.length ? (e.arrayPos = 0, e.shuffle && (e.sequence = e.shuffleArray(e.sequence)), e.init()) : e.typewrite(e.strings[e.sequence[e.arrayPos]], s))
                }, i)
            }
        },
        initFadeOut: function() {
            return self = this, this.el.className += " " + this.fadeOutClass, this.cursor.className += " " + this.fadeOutClass, setTimeout(function() {
                self.arrayPos++, self.replaceText(""), self.strings.length > self.arrayPos ? self.typewrite(self.strings[self.sequence[self.arrayPos]], 0) : (self.typewrite(self.strings[0], 0), self.arrayPos = 0)
            }, self.fadeOutDelay)
        },
        replaceText: function(t) {
            this.attr ? this.el.setAttribute(this.attr, t) : this.isInput ? this.el.value = t : "html" === this.contentType ? this.el.innerHTML = t : this.el.textContent = t
        },
        shuffleArray: function(t) {
            var s, e, i = t.length;
            if (i)
                for (; --i;) e = Math.floor(Math.random() * (i + 1)), s = t[e], t[e] = t[i], t[i] = s;
            return t
        },
        reset: function() {
            var t = this;
            clearInterval(t.timeout);
            this.el.getAttribute("id");
            this.el.textContent = "", "undefined" != typeof this.cursor && "undefined" != typeof this.cursor.parentNode && this.cursor.parentNode.removeChild(this.cursor), this.strPos = 0, this.arrayPos = 0, this.curLoop = 0, this.options.resetCallback()
        }
    }, i["new"] = function(t, e) {
        var r = Array.prototype.slice.apply(s.querySelectorAll(t));
        r.forEach(function(t) {
            var s = t._typed,
                r = "object" == typeof e && e;
            s && s.reset(), t._typed = s = new i(t, r), "string" == typeof e && s[e]()
        })
    }, e && (e.fn.typed = function(t) {
        return this.each(function() {
            var s = e(this),
                r = s.data("typed"),
                o = "object" == typeof t && t;
            r && r.reset(), s.data("typed", r = new i(this, o)), "string" == typeof t && r[t]()
        })
    }), t.Typed = i;
    var r = {
        strings: ["These are the default values...", "You know what you should do?", "Use your own!", "Have a great day!"],
        stringsElement: null,
        typeSpeed: 0,
        startDelay: 0,
        backSpeed: 0,
        shuffle: !1,
        backDelay: 500,
        fadeOut: !1,
        fadeOutClass: "typed-fade-out",
        fadeOutDelay: 500,
        loop: !1,
        loopCount: !1,
        showCursor: !0,
        cursorChar: "|",
        attr: null,
        contentType: "html",
        callback: function() {},
        preStringTyped: function() {},
        onStringTyped: function() {},
        resetCallback: function() {}
    }
}(window, document, window.jQuery);
/*! fluidvids.js v2.4.1 | (c) 2014 @toddmotto | https://github.com/toddmotto/fluidvids */
! function(e, t) {
    "function" == typeof define && define.amd ? define(t) : "object" == typeof exports ? module.exports = t : e.fluidvids = t()
}(this, function() {
    "use strict";

    function e(e) {
        return new RegExp("^(https?:)?//(?:" + d.players.join("|") + ").*$", "i").test(e)
    }

    function t(e, t) {
        return parseInt(e, 10) / parseInt(t, 10) * 100 + "%"
    }

    function i(i) {
        if ((e(i.src) || e(i.data)) && !i.getAttribute("data-fluidvids")) {
            var n = document.createElement("div");
            i.parentNode.insertBefore(n, i), i.className += (i.className ? " " : "") + "fluidvids-item", i.setAttribute("data-fluidvids", "loaded"), n.className += "fluidvids", n.style.paddingTop = t(i.height, i.width), n.appendChild(i)
        }
    }

    function n() {
        var e = document.createElement("div");
        e.innerHTML = "<p>x</p><style>" + o + "</style>", r.appendChild(e.childNodes[1])
    }
    var d = {
            selector: ["iframe", "object"],
            players: ["www.youtube.com", "player.vimeo.com"]
        },
        o = [".fluidvids {", "width: 100%; max-width: 100%; position: relative;", "}", ".fluidvids-item {", "position: absolute; top: 0px; left: 0px; width: 100%; height: 100%;", "}"].join(""),
        r = document.head || document.getElementsByTagName("head")[0];
    return d.render = function() {
        for (var e = document.querySelectorAll(d.selector.join()), t = e.length; t--;) i(e[t])
    }, d.init = function(e) {
        for (var t in e) d[t] = e[t];
        d.render(), n()
    }, d
});;
(function($) {
    if ($.fn.carouFredSel) {
        return
    }
    $.fn.caroufredsel = $.fn.carouFredSel = function(options, configs) {
        if (this.length == 0) {
            debug(true, 'No element found for "' + this.selector + '".');
            return this
        }
        if (this.length > 1) {
            return this.each(function() {
                $(this).carouFredSel(options, configs)
            })
        }
        var $cfs = this,
            $tt0 = this[0],
            starting_position = false;
        if ($cfs.data('_cfs_isCarousel')) {
            starting_position = $cfs.triggerHandler('_cfs_triggerEvent', 'currentPosition');
            $cfs.trigger('_cfs_triggerEvent', ['destroy', true])
        }
        var FN = {};
        FN._init = function(o, setOrig, start) {
            o = go_getObject($tt0, o);
            o.items = go_getItemsObject($tt0, o.items);
            o.scroll = go_getScrollObject($tt0, o.scroll);
            o.auto = go_getAutoObject($tt0, o.auto);
            o.prev = go_getPrevNextObject($tt0, o.prev);
            o.next = go_getPrevNextObject($tt0, o.next);
            o.pagination = go_getPaginationObject($tt0, o.pagination);
            o.swipe = go_getSwipeObject($tt0, o.swipe);
            o.mousewheel = go_getMousewheelObject($tt0, o.mousewheel);
            if (setOrig) {
                opts_orig = $.extend(true, {}, $.fn.carouFredSel.defaults, o)
            }
            opts = $.extend(true, {}, $.fn.carouFredSel.defaults, o);
            opts.d = cf_getDimensions(opts);
            crsl.direction = (opts.direction == 'up' || opts.direction == 'left') ? 'next' : 'prev';
            var a_itm = $cfs.children(),
                avail_primary = ms_getParentSize($wrp, opts, 'width');
            if (is_true(opts.cookie)) {
                opts.cookie = 'caroufredsel_cookie_' + conf.serialNumber
            }
            opts.maxDimension = ms_getMaxDimension(opts, avail_primary);
            opts.items = in_complementItems(opts.items, opts, a_itm, start);
            opts[opts.d['width']] = in_complementPrimarySize(opts[opts.d['width']], opts, a_itm);
            opts[opts.d['height']] = in_complementSecondarySize(opts[opts.d['height']], opts, a_itm);
            if (opts.responsive) {
                if (!is_percentage(opts[opts.d['width']])) {
                    opts[opts.d['width']] = '100%'
                }
            }
            if (is_percentage(opts[opts.d['width']])) {
                crsl.upDateOnWindowResize = true;
                crsl.primarySizePercentage = opts[opts.d['width']];
                opts[opts.d['width']] = ms_getPercentage(avail_primary, crsl.primarySizePercentage);
                if (!opts.items.visible) {
                    opts.items.visibleConf.variable = true
                }
            }
            if (opts.responsive) {
                opts.usePadding = false;
                opts.padding = [0, 0, 0, 0];
                opts.align = false;
                opts.items.visibleConf.variable = false
            } else {
                if (!opts.items.visible) {
                    opts = in_complementVisibleItems(opts, avail_primary)
                }
                if (!opts[opts.d['width']]) {
                    if (!opts.items.visibleConf.variable && is_number(opts.items[opts.d['width']]) && opts.items.filter == '*') {
                        opts[opts.d['width']] = opts.items.visible * opts.items[opts.d['width']];
                        opts.align = false
                    } else {
                        opts[opts.d['width']] = 'variable'
                    }
                }
                if (is_undefined(opts.align)) {
                    opts.align = (is_number(opts[opts.d['width']])) ? 'center' : false
                }
                if (opts.items.visibleConf.variable) {
                    opts.items.visible = gn_getVisibleItemsNext(a_itm, opts, 0)
                }
            }
            if (opts.items.filter != '*' && !opts.items.visibleConf.variable) {
                opts.items.visibleConf.org = opts.items.visible;
                opts.items.visible = gn_getVisibleItemsNextFilter(a_itm, opts, 0)
            }
            opts.items.visible = cf_getItemsAdjust(opts.items.visible, opts, opts.items.visibleConf.adjust, $tt0);
            opts.items.visibleConf.old = opts.items.visible;
            if (opts.responsive) {
                if (!opts.items.visibleConf.min) {
                    opts.items.visibleConf.min = opts.items.visible
                }
                if (!opts.items.visibleConf.max) {
                    opts.items.visibleConf.max = opts.items.visible
                }
                opts = in_getResponsiveValues(opts, a_itm, avail_primary)
            } else {
                opts.padding = cf_getPadding(opts.padding);
                if (opts.align == 'top') {
                    opts.align = 'left'
                } else if (opts.align == 'bottom') {
                    opts.align = 'right'
                }
                switch (opts.align) {
                    case 'center':
                    case 'left':
                    case 'right':
                        if (opts[opts.d['width']] != 'variable') {
                            opts = in_getAlignPadding(opts, a_itm);
                            opts.usePadding = true
                        }
                        break;
                    default:
                        opts.align = false;
                        opts.usePadding = (opts.padding[0] == 0 && opts.padding[1] == 0 && opts.padding[2] == 0 && opts.padding[3] == 0) ? false : true;
                        break
                }
            }
            if (!is_number(opts.scroll.duration)) {
                opts.scroll.duration = 500
            }
            if (is_undefined(opts.scroll.items)) {
                opts.scroll.items = (opts.responsive || opts.items.visibleConf.variable || opts.items.filter != '*') ? 'visible' : opts.items.visible
            }
            opts.auto = $.extend(true, {}, opts.scroll, opts.auto);
            opts.prev = $.extend(true, {}, opts.scroll, opts.prev);
            opts.next = $.extend(true, {}, opts.scroll, opts.next);
            opts.pagination = $.extend(true, {}, opts.scroll, opts.pagination);
            opts.auto = go_complementAutoObject($tt0, opts.auto);
            opts.prev = go_complementPrevNextObject($tt0, opts.prev);
            opts.next = go_complementPrevNextObject($tt0, opts.next);
            opts.pagination = go_complementPaginationObject($tt0, opts.pagination);
            opts.swipe = go_complementSwipeObject($tt0, opts.swipe);
            opts.mousewheel = go_complementMousewheelObject($tt0, opts.mousewheel);
            if (opts.synchronise) {
                opts.synchronise = cf_getSynchArr(opts.synchronise)
            }
            if (opts.auto.onPauseStart) {
                opts.auto.onTimeoutStart = opts.auto.onPauseStart;
                deprecated('auto.onPauseStart', 'auto.onTimeoutStart')
            }
            if (opts.auto.onPausePause) {
                opts.auto.onTimeoutPause = opts.auto.onPausePause;
                deprecated('auto.onPausePause', 'auto.onTimeoutPause')
            }
            if (opts.auto.onPauseEnd) {
                opts.auto.onTimeoutEnd = opts.auto.onPauseEnd;
                deprecated('auto.onPauseEnd', 'auto.onTimeoutEnd')
            }
            if (opts.auto.pauseDuration) {
                opts.auto.timeoutDuration = opts.auto.pauseDuration;
                deprecated('auto.pauseDuration', 'auto.timeoutDuration')
            }
        };
        FN._build = function() {
            $cfs.data('_cfs_isCarousel', true);
            var a_itm = $cfs.children(),
                orgCSS = in_mapCss($cfs, ['textAlign', 'float', 'position', 'top', 'right', 'bottom', 'left', 'zIndex', 'width', 'marginTop', 'marginRight', 'marginBottom', 'marginLeft']),
                newPosition = 'relative';
            switch (orgCSS.position) {
                case 'absolute':
                case 'fixed':
                    newPosition = orgCSS.position;
                    break
            }
            if (conf.wrapper == 'parent') {
                sz_storeOrigCss($wrp)
            } else {
                $wrp.css(orgCSS)
            }
            $wrp.css({
                'overflow': 'hidden',
                'position': newPosition
            });
            sz_storeOrigCss($cfs);
            $cfs.data('_cfs_origCssZindex', orgCSS.zIndex);
            $cfs.css({
                'textAlign': 'left',
                'float': 'none',
                'position': 'absolute',
                'top': 0,
                'right': 'auto',
                'bottom': 'auto',
                'left': 0,
                'marginTop': 0,
                'marginRight': 0,
                'marginBottom': 0,
                'marginLeft': 0
            });
            sz_storeMargin(a_itm, opts);
            sz_storeOrigCss(a_itm);
            if (opts.responsive) {
                sz_setResponsiveSizes(opts, a_itm)
            }
        };
        FN._bind_events = function() {
            FN._unbind_events();
            $cfs.bind(cf_e('stop', conf), function(e, imm) {
                e.stopPropagation();
                if (!crsl.isStopped) {
                    if (opts.auto.button) {
                        opts.auto.button.addClass(cf_c('stopped', conf))
                    }
                }
                crsl.isStopped = true;
                if (opts.auto.play) {
                    opts.auto.play = false;
                    $cfs.trigger(cf_e('pause', conf), imm)
                }
                return true
            });
            $cfs.bind(cf_e('finish', conf), function(e) {
                e.stopPropagation();
                if (crsl.isScrolling) {
                    sc_stopScroll(scrl)
                }
                return true
            });
            $cfs.bind(cf_e('pause', conf), function(e, imm, res) {
                e.stopPropagation();
                tmrs = sc_clearTimers(tmrs);
                if (imm && crsl.isScrolling) {
                    scrl.isStopped = true;
                    var nst = getTime() - scrl.startTime;
                    scrl.duration -= nst;
                    if (scrl.pre) {
                        scrl.pre.duration -= nst
                    }
                    if (scrl.post) {
                        scrl.post.duration -= nst
                    }
                    sc_stopScroll(scrl, false)
                }
                if (!crsl.isPaused && !crsl.isScrolling) {
                    if (res) {
                        tmrs.timePassed += getTime() - tmrs.startTime
                    }
                }
                if (!crsl.isPaused) {
                    if (opts.auto.button) {
                        opts.auto.button.addClass(cf_c('paused', conf))
                    }
                }
                crsl.isPaused = true;
                if (opts.auto.onTimeoutPause) {
                    var dur1 = opts.auto.timeoutDuration - tmrs.timePassed,
                        perc = 100 - Math.ceil(dur1 * 100 / opts.auto.timeoutDuration);
                    opts.auto.onTimeoutPause.call($tt0, perc, dur1)
                }
                return true
            });
            $cfs.bind(cf_e('play', conf), function(e, dir, del, res) {
                e.stopPropagation();
                tmrs = sc_clearTimers(tmrs);
                var v = [dir, del, res],
                    t = ['string', 'number', 'boolean'],
                    a = cf_sortParams(v, t);
                dir = a[0];
                del = a[1];
                res = a[2];
                if (dir != 'prev' && dir != 'next') {
                    dir = crsl.direction
                }
                if (!is_number(del)) {
                    del = 0
                }
                if (!is_boolean(res)) {
                    res = false
                }
                if (res) {
                    crsl.isStopped = false;
                    opts.auto.play = true
                }
                if (!opts.auto.play) {
                    e.stopImmediatePropagation();
                    return debug(conf, 'Carousel stopped: Not scrolling.')
                }
                if (crsl.isPaused) {
                    if (opts.auto.button) {
                        opts.auto.button.removeClass(cf_c('stopped', conf));
                        opts.auto.button.removeClass(cf_c('paused', conf))
                    }
                }
                crsl.isPaused = false;
                tmrs.startTime = getTime();
                var dur1 = opts.auto.timeoutDuration + del;
                dur2 = dur1 - tmrs.timePassed;
                perc = 100 - Math.ceil(dur2 * 100 / dur1);
                if (opts.auto.progress) {
                    tmrs.progress = setInterval(function() {
                        var pasd = getTime() - tmrs.startTime + tmrs.timePassed,
                            perc = Math.ceil(pasd * 100 / dur1);
                        opts.auto.progress.updater.call(opts.auto.progress.bar[0], perc)
                    }, opts.auto.progress.interval)
                }
                tmrs.auto = setTimeout(function() {
                    if (opts.auto.progress) {
                        opts.auto.progress.updater.call(opts.auto.progress.bar[0], 100)
                    }
                    if (opts.auto.onTimeoutEnd) {
                        opts.auto.onTimeoutEnd.call($tt0, perc, dur2)
                    }
                    if (crsl.isScrolling) {
                        $cfs.trigger(cf_e('play', conf), dir)
                    } else {
                        $cfs.trigger(cf_e(dir, conf), opts.auto)
                    }
                }, dur2);
                if (opts.auto.onTimeoutStart) {
                    opts.auto.onTimeoutStart.call($tt0, perc, dur2)
                }
                return true
            });
            $cfs.bind(cf_e('resume', conf), function(e) {
                e.stopPropagation();
                if (scrl.isStopped) {
                    scrl.isStopped = false;
                    crsl.isPaused = false;
                    crsl.isScrolling = true;
                    scrl.startTime = getTime();
                    sc_startScroll(scrl, conf)
                } else {
                    $cfs.trigger(cf_e('play', conf))
                }
                return true
            });
            $cfs.bind(cf_e('prev', conf) + ' ' + cf_e('next', conf), function(e, obj, num, clb, que) {
                e.stopPropagation();
                if (crsl.isStopped || $cfs.is(':hidden')) {
                    e.stopImmediatePropagation();
                    return debug(conf, 'Carousel stopped or hidden: Not scrolling.')
                }
                var minimum = (is_number(opts.items.minimum)) ? opts.items.minimum : opts.items.visible + 1;
                if (minimum > itms.total) {
                    e.stopImmediatePropagation();
                    return debug(conf, 'Not enough items (' + itms.total + ' total, ' + minimum + ' needed): Not scrolling.')
                }
                var v = [obj, num, clb, que],
                    t = ['object', 'number/string', 'function', 'boolean'],
                    a = cf_sortParams(v, t);
                obj = a[0];
                num = a[1];
                clb = a[2];
                que = a[3];
                var eType = e.type.slice(conf.events.prefix.length);
                if (!is_object(obj)) {
                    obj = {}
                }
                if (is_function(clb)) {
                    obj.onAfter = clb
                }
                if (is_boolean(que)) {
                    obj.queue = que
                }
                obj = $.extend(true, {}, opts[eType], obj);
                if (obj.conditions && !obj.conditions.call($tt0, eType)) {
                    e.stopImmediatePropagation();
                    return debug(conf, 'Callback "conditions" returned false.')
                }
                if (!is_number(num)) {
                    if (opts.items.filter != '*') {
                        num = 'visible'
                    } else {
                        var arr = [num, obj.items, opts[eType].items];
                        for (var a = 0, l = arr.length; a < l; a++) {
                            if (is_number(arr[a]) || arr[a] == 'page' || arr[a] == 'visible') {
                                num = arr[a];
                                break
                            }
                        }
                    }
                    switch (num) {
                        case 'page':
                            e.stopImmediatePropagation();
                            return $cfs.triggerHandler(cf_e(eType + 'Page', conf), [obj, clb]);
                            break;
                        case 'visible':
                            if (!opts.items.visibleConf.variable && opts.items.filter == '*') {
                                num = opts.items.visible
                            }
                            break
                    }
                }
                if (scrl.isStopped) {
                    $cfs.trigger(cf_e('resume', conf));
                    $cfs.trigger(cf_e('queue', conf), [eType, [obj, num, clb]]);
                    e.stopImmediatePropagation();
                    return debug(conf, 'Carousel resumed scrolling.')
                }
                if (obj.duration > 0) {
                    if (crsl.isScrolling) {
                        if (obj.queue) {
                            if (obj.queue == 'last') {
                                queu = []
                            }
                            if (obj.queue != 'first' || queu.length == 0) {
                                $cfs.trigger(cf_e('queue', conf), [eType, [obj, num, clb]])
                            }
                        }
                        e.stopImmediatePropagation();
                        return debug(conf, 'Carousel currently scrolling.')
                    }
                }
                tmrs.timePassed = 0;
                $cfs.trigger(cf_e('slide_' + eType, conf), [obj, num]);
                if (opts.synchronise) {
                    var s = opts.synchronise,
                        c = [obj, num];
                    for (var j = 0, l = s.length; j < l; j++) {
                        var d = eType;
                        if (!s[j][2]) {
                            d = (d == 'prev') ? 'next' : 'prev'
                        }
                        if (!s[j][1]) {
                            c[0] = s[j][0].triggerHandler('_cfs_triggerEvent', ['configuration', d])
                        }
                        c[1] = num + s[j][3];
                        s[j][0].trigger('_cfs_triggerEvent', ['slide_' + d, c])
                    }
                }
                return true
            });
            $cfs.bind(cf_e('slide_prev', conf), function(e, sO, nI) {
                e.stopPropagation();
                var a_itm = $cfs.children();
                if (!opts.circular) {
                    if (itms.first == 0) {
                        if (opts.infinite) {
                            $cfs.trigger(cf_e('next', conf), itms.total - 1)
                        }
                        return e.stopImmediatePropagation()
                    }
                }
                sz_resetMargin(a_itm, opts);
                if (!is_number(nI)) {
                    if (opts.items.visibleConf.variable) {
                        nI = gn_getVisibleItemsPrev(a_itm, opts, itms.total - 1)
                    } else if (opts.items.filter != '*') {
                        var xI = (is_number(sO.items)) ? sO.items : gn_getVisibleOrg($cfs, opts);
                        nI = gn_getScrollItemsPrevFilter(a_itm, opts, itms.total - 1, xI)
                    } else {
                        nI = opts.items.visible
                    }
                    nI = cf_getAdjust(nI, opts, sO.items, $tt0)
                }
                if (!opts.circular) {
                    if (itms.total - nI < itms.first) {
                        nI = itms.total - itms.first
                    }
                }
                opts.items.visibleConf.old = opts.items.visible;
                if (opts.items.visibleConf.variable) {
                    var vI = cf_getItemsAdjust(gn_getVisibleItemsNext(a_itm, opts, itms.total - nI), opts, opts.items.visibleConf.adjust, $tt0);
                    if (opts.items.visible + nI <= vI && nI < itms.total) {
                        nI++;
                        vI = cf_getItemsAdjust(gn_getVisibleItemsNext(a_itm, opts, itms.total - nI), opts, opts.items.visibleConf.adjust, $tt0)
                    }
                    opts.items.visible = vI
                } else if (opts.items.filter != '*') {
                    var vI = gn_getVisibleItemsNextFilter(a_itm, opts, itms.total - nI);
                    opts.items.visible = cf_getItemsAdjust(vI, opts, opts.items.visibleConf.adjust, $tt0)
                }
                sz_resetMargin(a_itm, opts, true);
                if (nI == 0) {
                    e.stopImmediatePropagation();
                    return debug(conf, '0 items to scroll: Not scrolling.')
                }
                debug(conf, 'Scrolling ' + nI + ' items backward.');
                itms.first += nI;
                while (itms.first >= itms.total) {
                    itms.first -= itms.total
                }
                if (!opts.circular) {
                    if (itms.first == 0 && sO.onEnd) {
                        sO.onEnd.call($tt0, 'prev')
                    }
                    if (!opts.infinite) {
                        nv_enableNavi(opts, itms.first, conf)
                    }
                }
                $cfs.children().slice(itms.total - nI, itms.total).prependTo($cfs);
                if (itms.total < opts.items.visible + nI) {
                    $cfs.children().slice(0, (opts.items.visible + nI) - itms.total).clone(true).appendTo($cfs)
                }
                var a_itm = $cfs.children(),
                    i_old = gi_getOldItemsPrev(a_itm, opts, nI),
                    i_new = gi_getNewItemsPrev(a_itm, opts),
                    i_cur_l = a_itm.eq(nI - 1),
                    i_old_l = i_old.last(),
                    i_new_l = i_new.last();
                sz_resetMargin(a_itm, opts);
                var pL = 0,
                    pR = 0;
                if (opts.align) {
                    var p = cf_getAlignPadding(i_new, opts);
                    pL = p[0];
                    pR = p[1]
                }
                var oL = (pL < 0) ? opts.padding[opts.d[3]] : 0;
                var hiddenitems = false,
                    i_skp = $();
                if (opts.items.visible < nI) {
                    i_skp = a_itm.slice(opts.items.visibleConf.old, nI);
                    if (sO.fx == 'directscroll') {
                        var orgW = opts.items[opts.d['width']];
                        hiddenitems = i_skp;
                        i_cur_l = i_new_l;
                        sc_hideHiddenItems(hiddenitems);
                        opts.items[opts.d['width']] = 'variable'
                    }
                }
                var $cf2 = false,
                    i_siz = ms_getTotalSize(a_itm.slice(0, nI), opts, 'width'),
                    w_siz = cf_mapWrapperSizes(ms_getSizes(i_new, opts, true), opts, !opts.usePadding),
                    i_siz_vis = 0,
                    a_cfs = {},
                    a_wsz = {},
                    a_cur = {},
                    a_old = {},
                    a_new = {},
                    a_lef = {},
                    a_lef_vis = {},
                    a_dur = sc_getDuration(sO, opts, nI, i_siz);
                switch (sO.fx) {
                    case 'cover':
                    case 'cover-fade':
                        i_siz_vis = ms_getTotalSize(a_itm.slice(0, opts.items.visible), opts, 'width');
                        break
                }
                if (hiddenitems) {
                    opts.items[opts.d['width']] = orgW
                }
                sz_resetMargin(a_itm, opts, true);
                if (pR >= 0) {
                    sz_resetMargin(i_old_l, opts, opts.padding[opts.d[1]])
                }
                if (pL >= 0) {
                    sz_resetMargin(i_cur_l, opts, opts.padding[opts.d[3]])
                }
                if (opts.align) {
                    opts.padding[opts.d[1]] = pR;
                    opts.padding[opts.d[3]] = pL
                }
                a_lef[opts.d['left']] = -(i_siz - oL);
                a_lef_vis[opts.d['left']] = -(i_siz_vis - oL);
                a_wsz[opts.d['left']] = w_siz[opts.d['width']];
                var _s_wrapper = function() {},
                    _a_wrapper = function() {},
                    _s_paddingold = function() {},
                    _a_paddingold = function() {},
                    _s_paddingnew = function() {},
                    _a_paddingnew = function() {},
                    _s_paddingcur = function() {},
                    _a_paddingcur = function() {},
                    _onafter = function() {},
                    _moveitems = function() {},
                    _position = function() {};
                switch (sO.fx) {
                    case 'crossfade':
                    case 'cover':
                    case 'cover-fade':
                    case 'uncover':
                    case 'uncover-fade':
                        $cf2 = $cfs.clone(true).appendTo($wrp);
                        break
                }
                switch (sO.fx) {
                    case 'crossfade':
                    case 'uncover':
                    case 'uncover-fade':
                        $cf2.children().slice(0, nI).remove();
                        $cf2.children().slice(opts.items.visibleConf.old).remove();
                        break;
                    case 'cover':
                    case 'cover-fade':
                        $cf2.children().slice(opts.items.visible).remove();
                        $cf2.css(a_lef_vis);
                        break
                }
                $cfs.css(a_lef);
                scrl = sc_setScroll(a_dur, sO.easing, conf);
                a_cfs[opts.d['left']] = (opts.usePadding) ? opts.padding[opts.d[3]] : 0;
                if (opts[opts.d['width']] == 'variable' || opts[opts.d['height']] == 'variable') {
                    _s_wrapper = function() {
                        $wrp.css(w_siz)
                    };
                    _a_wrapper = function() {
                        scrl.anims.push([$wrp, w_siz])
                    }
                }
                if (opts.usePadding) {
                    if (i_new_l.not(i_cur_l).length) {
                        a_cur[opts.d['marginRight']] = i_cur_l.data('_cfs_origCssMargin');
                        if (pL < 0) {
                            i_cur_l.css(a_cur)
                        } else {
                            _s_paddingcur = function() {
                                i_cur_l.css(a_cur)
                            };
                            _a_paddingcur = function() {
                                scrl.anims.push([i_cur_l, a_cur])
                            }
                        }
                    }
                    switch (sO.fx) {
                        case 'cover':
                        case 'cover-fade':
                            $cf2.children().eq(nI - 1).css(a_cur);
                            break
                    }
                    if (i_new_l.not(i_old_l).length) {
                        a_old[opts.d['marginRight']] = i_old_l.data('_cfs_origCssMargin');
                        _s_paddingold = function() {
                            i_old_l.css(a_old)
                        };
                        _a_paddingold = function() {
                            scrl.anims.push([i_old_l, a_old])
                        }
                    }
                    if (pR >= 0) {
                        a_new[opts.d['marginRight']] = i_new_l.data('_cfs_origCssMargin') + opts.padding[opts.d[1]];
                        _s_paddingnew = function() {
                            i_new_l.css(a_new)
                        };
                        _a_paddingnew = function() {
                            scrl.anims.push([i_new_l, a_new])
                        }
                    }
                }
                _position = function() {
                    $cfs.css(a_cfs)
                };
                var overFill = opts.items.visible + nI - itms.total;
                _moveitems = function() {
                    if (overFill > 0) {
                        $cfs.children().slice(itms.total).remove();
                        i_old = $($cfs.children().slice(itms.total - (opts.items.visible - overFill)).get().concat($cfs.children().slice(0, overFill).get()))
                    }
                    sc_showHiddenItems(hiddenitems);
                    if (opts.usePadding) {
                        var l_itm = $cfs.children().eq(opts.items.visible + nI - 1);
                        l_itm.css(opts.d['marginRight'], l_itm.data('_cfs_origCssMargin'))
                    }
                };
                var cb_arguments = sc_mapCallbackArguments(i_old, i_skp, i_new, nI, 'prev', a_dur, w_siz);
                _onafter = function() {
                    sc_afterScroll($cfs, $cf2, sO);
                    crsl.isScrolling = false;
                    clbk.onAfter = sc_fireCallbacks($tt0, sO, 'onAfter', cb_arguments, clbk);
                    queu = sc_fireQueue($cfs, queu, conf);
                    if (!crsl.isPaused) {
                        $cfs.trigger(cf_e('play', conf))
                    }
                };
                crsl.isScrolling = true;
                tmrs = sc_clearTimers(tmrs);
                clbk.onBefore = sc_fireCallbacks($tt0, sO, 'onBefore', cb_arguments, clbk);
                switch (sO.fx) {
                    case 'none':
                        $cfs.css(a_cfs);
                        _s_wrapper();
                        _s_paddingold();
                        _s_paddingnew();
                        _s_paddingcur();
                        _position();
                        _moveitems();
                        _onafter();
                        break;
                    case 'fade':
                        scrl.anims.push([$cfs, {
                            'opacity': 0
                        }, function() {
                            _s_wrapper();
                            _s_paddingold();
                            _s_paddingnew();
                            _s_paddingcur();
                            _position();
                            _moveitems();
                            scrl = sc_setScroll(a_dur, sO.easing, conf);
                            scrl.anims.push([$cfs, {
                                'opacity': 1
                            }, _onafter]);
                            sc_startScroll(scrl, conf)
                        }]);
                        break;
                    case 'crossfade':
                        $cfs.css({
                            'opacity': 0
                        });
                        scrl.anims.push([$cf2, {
                            'opacity': 0
                        }]);
                        scrl.anims.push([$cfs, {
                            'opacity': 1
                        }, _onafter]);
                        _a_wrapper();
                        _s_paddingold();
                        _s_paddingnew();
                        _s_paddingcur();
                        _position();
                        _moveitems();
                        break;
                    case 'cover':
                        scrl.anims.push([$cf2, a_cfs, function() {
                            _s_paddingold();
                            _s_paddingnew();
                            _s_paddingcur();
                            _position();
                            _moveitems();
                            _onafter()
                        }]);
                        _a_wrapper();
                        break;
                    case 'cover-fade':
                        scrl.anims.push([$cfs, {
                            'opacity': 0
                        }]);
                        scrl.anims.push([$cf2, a_cfs, function() {
                            _s_paddingold();
                            _s_paddingnew();
                            _s_paddingcur();
                            _position();
                            _moveitems();
                            _onafter()
                        }]);
                        _a_wrapper();
                        break;
                    case 'uncover':
                        scrl.anims.push([$cf2, a_wsz, _onafter]);
                        _a_wrapper();
                        _s_paddingold();
                        _s_paddingnew();
                        _s_paddingcur();
                        _position();
                        _moveitems();
                        break;
                    case 'uncover-fade':
                        $cfs.css({
                            'opacity': 0
                        });
                        scrl.anims.push([$cfs, {
                            'opacity': 1
                        }]);
                        scrl.anims.push([$cf2, a_wsz, _onafter]);
                        _a_wrapper();
                        _s_paddingold();
                        _s_paddingnew();
                        _s_paddingcur();
                        _position();
                        _moveitems();
                        break;
                    default:
                        scrl.anims.push([$cfs, a_cfs, function() {
                            _moveitems();
                            _onafter()
                        }]);
                        _a_wrapper();
                        _a_paddingold();
                        _a_paddingnew();
                        _a_paddingcur();
                        break
                }
                sc_startScroll(scrl, conf);
                cf_setCookie(opts.cookie, $cfs, conf);
                $cfs.trigger(cf_e('updatePageStatus', conf), [false, w_siz]);
                return true
            });
            $cfs.bind(cf_e('slide_next', conf), function(e, sO, nI) {
                e.stopPropagation();
                var a_itm = $cfs.children();
                if (!opts.circular) {
                    if (itms.first == opts.items.visible) {
                        if (opts.infinite) {
                            $cfs.trigger(cf_e('prev', conf), itms.total - 1)
                        }
                        return e.stopImmediatePropagation()
                    }
                }
                sz_resetMargin(a_itm, opts);
                if (!is_number(nI)) {
                    if (opts.items.filter != '*') {
                        var xI = (is_number(sO.items)) ? sO.items : gn_getVisibleOrg($cfs, opts);
                        nI = gn_getScrollItemsNextFilter(a_itm, opts, 0, xI)
                    } else {
                        nI = opts.items.visible
                    }
                    nI = cf_getAdjust(nI, opts, sO.items, $tt0)
                }
                var lastItemNr = (itms.first == 0) ? itms.total : itms.first;
                if (!opts.circular) {
                    if (opts.items.visibleConf.variable) {
                        var vI = gn_getVisibleItemsNext(a_itm, opts, nI),
                            xI = gn_getVisibleItemsPrev(a_itm, opts, lastItemNr - 1)
                    } else {
                        var vI = opts.items.visible,
                            xI = opts.items.visible
                    }
                    if (nI + vI > lastItemNr) {
                        nI = lastItemNr - xI
                    }
                }
                opts.items.visibleConf.old = opts.items.visible;
                if (opts.items.visibleConf.variable) {
                    var vI = cf_getItemsAdjust(gn_getVisibleItemsNextTestCircular(a_itm, opts, nI, lastItemNr), opts, opts.items.visibleConf.adjust, $tt0);
                    while (opts.items.visible - nI >= vI && nI < itms.total) {
                        nI++;
                        vI = cf_getItemsAdjust(gn_getVisibleItemsNextTestCircular(a_itm, opts, nI, lastItemNr), opts, opts.items.visibleConf.adjust, $tt0)
                    }
                    opts.items.visible = vI
                } else if (opts.items.filter != '*') {
                    var vI = gn_getVisibleItemsNextFilter(a_itm, opts, nI);
                    opts.items.visible = cf_getItemsAdjust(vI, opts, opts.items.visibleConf.adjust, $tt0)
                }
                sz_resetMargin(a_itm, opts, true);
                if (nI == 0) {
                    e.stopImmediatePropagation();
                    return debug(conf, '0 items to scroll: Not scrolling.')
                }
                debug(conf, 'Scrolling ' + nI + ' items forward.');
                itms.first -= nI;
                while (itms.first < 0) {
                    itms.first += itms.total
                }
                if (!opts.circular) {
                    if (itms.first == opts.items.visible && sO.onEnd) {
                        sO.onEnd.call($tt0, 'next')
                    }
                    if (!opts.infinite) {
                        nv_enableNavi(opts, itms.first, conf)
                    }
                }
                if (itms.total < opts.items.visible + nI) {
                    $cfs.children().slice(0, (opts.items.visible + nI) - itms.total).clone(true).appendTo($cfs)
                }
                var a_itm = $cfs.children(),
                    i_old = gi_getOldItemsNext(a_itm, opts),
                    i_new = gi_getNewItemsNext(a_itm, opts, nI),
                    i_cur_l = a_itm.eq(nI - 1),
                    i_old_l = i_old.last(),
                    i_new_l = i_new.last();
                sz_resetMargin(a_itm, opts);
                var pL = 0,
                    pR = 0;
                if (opts.align) {
                    var p = cf_getAlignPadding(i_new, opts);
                    pL = p[0];
                    pR = p[1]
                }
                var hiddenitems = false,
                    i_skp = $();
                if (opts.items.visibleConf.old < nI) {
                    i_skp = a_itm.slice(opts.items.visibleConf.old, nI);
                    if (sO.fx == 'directscroll') {
                        var orgW = opts.items[opts.d['width']];
                        hiddenitems = i_skp;
                        i_cur_l = i_old_l;
                        sc_hideHiddenItems(hiddenitems);
                        opts.items[opts.d['width']] = 'variable'
                    }
                }
                var $cf2 = false,
                    i_siz = ms_getTotalSize(a_itm.slice(0, nI), opts, 'width'),
                    w_siz = cf_mapWrapperSizes(ms_getSizes(i_new, opts, true), opts, !opts.usePadding),
                    i_siz_vis = 0,
                    a_cfs = {},
                    a_cfs_vis = {},
                    a_cur = {},
                    a_old = {},
                    a_lef = {},
                    a_dur = sc_getDuration(sO, opts, nI, i_siz);
                switch (sO.fx) {
                    case 'uncover':
                    case 'uncover-fade':
                        i_siz_vis = ms_getTotalSize(a_itm.slice(0, opts.items.visibleConf.old), opts, 'width');
                        break
                }
                if (hiddenitems) {
                    opts.items[opts.d['width']] = orgW
                }
                if (opts.align) {
                    if (opts.padding[opts.d[1]] < 0) {
                        opts.padding[opts.d[1]] = 0
                    }
                }
                sz_resetMargin(a_itm, opts, true);
                sz_resetMargin(i_old_l, opts, opts.padding[opts.d[1]]);
                if (opts.align) {
                    opts.padding[opts.d[1]] = pR;
                    opts.padding[opts.d[3]] = pL
                }
                a_lef[opts.d['left']] = (opts.usePadding) ? opts.padding[opts.d[3]] : 0;
                var _s_wrapper = function() {},
                    _a_wrapper = function() {},
                    _s_paddingold = function() {},
                    _a_paddingold = function() {},
                    _s_paddingcur = function() {},
                    _a_paddingcur = function() {},
                    _onafter = function() {},
                    _moveitems = function() {},
                    _position = function() {};
                switch (sO.fx) {
                    case 'crossfade':
                    case 'cover':
                    case 'cover-fade':
                    case 'uncover':
                    case 'uncover-fade':
                        $cf2 = $cfs.clone(true).appendTo($wrp);
                        $cf2.children().slice(opts.items.visibleConf.old).remove();
                        break
                }
                switch (sO.fx) {
                    case 'crossfade':
                    case 'cover':
                    case 'cover-fade':
                        $cfs.css('zIndex', 1);
                        $cf2.css('zIndex', 0);
                        break
                }
                scrl = sc_setScroll(a_dur, sO.easing, conf);
                a_cfs[opts.d['left']] = -i_siz;
                a_cfs_vis[opts.d['left']] = -i_siz_vis;
                if (pL < 0) {
                    a_cfs[opts.d['left']] += pL
                }
                if (opts[opts.d['width']] == 'variable' || opts[opts.d['height']] == 'variable') {
                    _s_wrapper = function() {
                        $wrp.css(w_siz)
                    };
                    _a_wrapper = function() {
                        scrl.anims.push([$wrp, w_siz])
                    }
                }
                if (opts.usePadding) {
                    var i_new_l_m = i_new_l.data('_cfs_origCssMargin');
                    if (pR >= 0) {
                        i_new_l_m += opts.padding[opts.d[1]]
                    }
                    i_new_l.css(opts.d['marginRight'], i_new_l_m);
                    if (i_cur_l.not(i_old_l).length) {
                        a_old[opts.d['marginRight']] = i_old_l.data('_cfs_origCssMargin')
                    }
                    _s_paddingold = function() {
                        i_old_l.css(a_old)
                    };
                    _a_paddingold = function() {
                        scrl.anims.push([i_old_l, a_old])
                    };
                    var i_cur_l_m = i_cur_l.data('_cfs_origCssMargin');
                    if (pL > 0) {
                        i_cur_l_m += opts.padding[opts.d[3]]
                    }
                    a_cur[opts.d['marginRight']] = i_cur_l_m;
                    _s_paddingcur = function() {
                        i_cur_l.css(a_cur)
                    };
                    _a_paddingcur = function() {
                        scrl.anims.push([i_cur_l, a_cur])
                    }
                }
                _position = function() {
                    $cfs.css(a_lef)
                };
                var overFill = opts.items.visible + nI - itms.total;
                _moveitems = function() {
                    if (overFill > 0) {
                        $cfs.children().slice(itms.total).remove()
                    }
                    var l_itm = $cfs.children().slice(0, nI).appendTo($cfs).last();
                    if (overFill > 0) {
                        i_new = gi_getCurrentItems(a_itm, opts)
                    }
                    sc_showHiddenItems(hiddenitems);
                    if (opts.usePadding) {
                        if (itms.total < opts.items.visible + nI) {
                            var i_cur_l = $cfs.children().eq(opts.items.visible - 1);
                            i_cur_l.css(opts.d['marginRight'], i_cur_l.data('_cfs_origCssMargin') + opts.padding[opts.d[1]])
                        }
                        l_itm.css(opts.d['marginRight'], l_itm.data('_cfs_origCssMargin'))
                    }
                };
                var cb_arguments = sc_mapCallbackArguments(i_old, i_skp, i_new, nI, 'next', a_dur, w_siz);
                _onafter = function() {
                    $cfs.css('zIndex', $cfs.data('_cfs_origCssZindex'));
                    sc_afterScroll($cfs, $cf2, sO);
                    crsl.isScrolling = false;
                    clbk.onAfter = sc_fireCallbacks($tt0, sO, 'onAfter', cb_arguments, clbk);
                    queu = sc_fireQueue($cfs, queu, conf);
                    if (!crsl.isPaused) {
                        $cfs.trigger(cf_e('play', conf))
                    }
                };
                crsl.isScrolling = true;
                tmrs = sc_clearTimers(tmrs);
                clbk.onBefore = sc_fireCallbacks($tt0, sO, 'onBefore', cb_arguments, clbk);
                switch (sO.fx) {
                    case 'none':
                        $cfs.css(a_cfs);
                        _s_wrapper();
                        _s_paddingold();
                        _s_paddingcur();
                        _position();
                        _moveitems();
                        _onafter();
                        break;
                    case 'fade':
                        scrl.anims.push([$cfs, {
                            'opacity': 0
                        }, function() {
                            _s_wrapper();
                            _s_paddingold();
                            _s_paddingcur();
                            _position();
                            _moveitems();
                            scrl = sc_setScroll(a_dur, sO.easing, conf);
                            scrl.anims.push([$cfs, {
                                'opacity': 1
                            }, _onafter]);
                            sc_startScroll(scrl, conf)
                        }]);
                        break;
                    case 'crossfade':
                        $cfs.css({
                            'opacity': 0
                        });
                        scrl.anims.push([$cf2, {
                            'opacity': 0
                        }]);
                        scrl.anims.push([$cfs, {
                            'opacity': 1
                        }, _onafter]);
                        _a_wrapper();
                        _s_paddingold();
                        _s_paddingcur();
                        _position();
                        _moveitems();
                        break;
                    case 'cover':
                        $cfs.css(opts.d['left'], $wrp[opts.d['width']]());
                        scrl.anims.push([$cfs, a_lef, _onafter]);
                        _a_wrapper();
                        _s_paddingold();
                        _s_paddingcur();
                        _moveitems();
                        break;
                    case 'cover-fade':
                        $cfs.css(opts.d['left'], $wrp[opts.d['width']]());
                        scrl.anims.push([$cf2, {
                            'opacity': 0
                        }]);
                        scrl.anims.push([$cfs, a_lef, _onafter]);
                        _a_wrapper();
                        _s_paddingold();
                        _s_paddingcur();
                        _moveitems();
                        break;
                    case 'uncover':
                        scrl.anims.push([$cf2, a_cfs_vis, _onafter]);
                        _a_wrapper();
                        _s_paddingold();
                        _s_paddingcur();
                        _position();
                        _moveitems();
                        break;
                    case 'uncover-fade':
                        $cfs.css({
                            'opacity': 0
                        });
                        scrl.anims.push([$cfs, {
                            'opacity': 1
                        }]);
                        scrl.anims.push([$cf2, a_cfs_vis, _onafter]);
                        _a_wrapper();
                        _s_paddingold();
                        _s_paddingcur();
                        _position();
                        _moveitems();
                        break;
                    default:
                        scrl.anims.push([$cfs, a_cfs, function() {
                            _position();
                            _moveitems();
                            _onafter()
                        }]);
                        _a_wrapper();
                        _a_paddingold();
                        _a_paddingcur();
                        break
                }
                sc_startScroll(scrl, conf);
                cf_setCookie(opts.cookie, $cfs, conf);
                $cfs.trigger(cf_e('updatePageStatus', conf), [false, w_siz]);
                return true
            });
            $cfs.bind(cf_e('slideTo', conf), function(e, num, dev, org, obj, dir, clb) {
                e.stopPropagation();
                var v = [num, dev, org, obj, dir, clb],
                    t = ['string/number/object', 'number', 'boolean', 'object', 'string', 'function'],
                    a = cf_sortParams(v, t);
                obj = a[3];
                dir = a[4];
                clb = a[5];
                num = gn_getItemIndex(a[0], a[1], a[2], itms, $cfs);
                if (num == 0) {
                    return false
                }
                if (!is_object(obj)) {
                    obj = false
                }
                if (dir != 'prev' && dir != 'next') {
                    if (opts.circular) {
                        dir = (num <= itms.total / 2) ? 'next' : 'prev'
                    } else {
                        dir = (itms.first == 0 || itms.first > num) ? 'next' : 'prev'
                    }
                }
                if (dir == 'prev') {
                    num = itms.total - num
                }
                $cfs.trigger(cf_e(dir, conf), [obj, num, clb]);
                return true
            });
            $cfs.bind(cf_e('prevPage', conf), function(e, obj, clb) {
                e.stopPropagation();
                var cur = $cfs.triggerHandler(cf_e('currentPage', conf));
                return $cfs.triggerHandler(cf_e('slideToPage', conf), [cur - 1, obj, 'prev', clb])
            });
            $cfs.bind(cf_e('nextPage', conf), function(e, obj, clb) {
                e.stopPropagation();
                var cur = $cfs.triggerHandler(cf_e('currentPage', conf));
                return $cfs.triggerHandler(cf_e('slideToPage', conf), [cur + 1, obj, 'next', clb])
            });
            $cfs.bind(cf_e('slideToPage', conf), function(e, pag, obj, dir, clb) {
                e.stopPropagation();
                if (!is_number(pag)) {
                    pag = $cfs.triggerHandler(cf_e('currentPage', conf))
                }
                var ipp = opts.pagination.items || opts.items.visible,
                    max = Math.ceil(itms.total / ipp) - 1;
                if (pag < 0) {
                    pag = max
                }
                if (pag > max) {
                    pag = 0
                }
                return $cfs.triggerHandler(cf_e('slideTo', conf), [pag * ipp, 0, true, obj, dir, clb])
            });
            $cfs.bind(cf_e('jumpToStart', conf), function(e, s) {
                e.stopPropagation();
                if (s) {
                    s = gn_getItemIndex(s, 0, true, itms, $cfs)
                } else {
                    s = 0
                }
                s += itms.first;
                if (s != 0) {
                    if (itms.total > 0) {
                        while (s > itms.total) {
                            s -= itms.total
                        }
                    }
                    $cfs.prepend($cfs.children().slice(s, itms.total))
                }
                return true
            });
            $cfs.bind(cf_e('synchronise', conf), function(e, s) {
                e.stopPropagation();
                if (s) {
                    s = cf_getSynchArr(s)
                } else if (opts.synchronise) {
                    s = opts.synchronise
                } else {
                    return debug(conf, 'No carousel to synchronise.')
                }
                var n = $cfs.triggerHandler(cf_e('currentPosition', conf)),
                    x = true;
                for (var j = 0, l = s.length; j < l; j++) {
                    if (!s[j][0].triggerHandler(cf_e('slideTo', conf), [n, s[j][3], true])) {
                        x = false
                    }
                }
                return x
            });
            $cfs.bind(cf_e('queue', conf), function(e, dir, opt) {
                e.stopPropagation();
                if (is_function(dir)) {
                    dir.call($tt0, queu)
                } else if (is_array(dir)) {
                    queu = dir
                } else if (!is_undefined(dir)) {
                    queu.push([dir, opt])
                }
                return queu
            });
            $cfs.bind(cf_e('insertItem', conf), function(e, itm, num, org, dev) {
                e.stopPropagation();
                var v = [itm, num, org, dev],
                    t = ['string/object', 'string/number/object', 'boolean', 'number'],
                    a = cf_sortParams(v, t);
                itm = a[0];
                num = a[1];
                org = a[2];
                dev = a[3];
                if (is_object(itm) && !is_jquery(itm)) {
                    itm = $(itm)
                } else if (is_string(itm)) {
                    itm = $(itm)
                }
                if (!is_jquery(itm) || itm.length == 0) {
                    return debug(conf, 'Not a valid object.')
                }
                if (is_undefined(num)) {
                    num = 'end'
                }
                sz_storeMargin(itm, opts);
                sz_storeOrigCss(itm);
                var orgNum = num,
                    before = 'before';
                if (num == 'end') {
                    if (org) {
                        if (itms.first == 0) {
                            num = itms.total - 1;
                            before = 'after'
                        } else {
                            num = itms.first;
                            itms.first += itm.length
                        }
                        if (num < 0) {
                            num = 0
                        }
                    } else {
                        num = itms.total - 1;
                        before = 'after'
                    }
                } else {
                    num = gn_getItemIndex(num, dev, org, itms, $cfs)
                }
                var $cit = $cfs.children().eq(num);
                if ($cit.length) {
                    $cit[before](itm)
                } else {
                    debug(conf, 'Correct insert-position not found! Appending item to the end.');
                    $cfs.append(itm)
                }
                if (orgNum != 'end' && !org) {
                    if (num < itms.first) {
                        itms.first += itm.length
                    }
                }
                itms.total = $cfs.children().length;
                if (itms.first >= itms.total) {
                    itms.first -= itms.total
                }
                $cfs.trigger(cf_e('updateSizes', conf));
                $cfs.trigger(cf_e('linkAnchors', conf));
                return true
            });
            $cfs.bind(cf_e('removeItem', conf), function(e, num, org, dev) {
                e.stopPropagation();
                var v = [num, org, dev],
                    t = ['string/number/object', 'boolean', 'number'],
                    a = cf_sortParams(v, t);
                num = a[0];
                org = a[1];
                dev = a[2];
                var removed = false;
                if (num instanceof $ && num.length > 1) {
                    $removed = $();
                    num.each(function(i, el) {
                        var $rem = $cfs.trigger(cf_e('removeItem', conf), [$(this), org, dev]);
                        if ($rem) {
                            $removed = $removed.add($rem)
                        }
                    });
                    return $removed
                }
                if (is_undefined(num) || num == 'end') {
                    $removed = $cfs.children().last()
                } else {
                    num = gn_getItemIndex(num, dev, org, itms, $cfs);
                    var $removed = $cfs.children().eq(num);
                    if ($removed.length) {
                        if (num < itms.first) {
                            itms.first -= $removed.length
                        }
                    }
                }
                if ($removed && $removed.length) {
                    $removed.detach();
                    itms.total = $cfs.children().length;
                    $cfs.trigger(cf_e('updateSizes', conf))
                }
                return $removed
            });
            $cfs.bind(cf_e('onBefore', conf) + ' ' + cf_e('onAfter', conf), function(e, fn) {
                e.stopPropagation();
                var eType = e.type.slice(conf.events.prefix.length);
                if (is_array(fn)) {
                    clbk[eType] = fn
                }
                if (is_function(fn)) {
                    clbk[eType].push(fn)
                }
                return clbk[eType]
            });
            $cfs.bind(cf_e('currentPosition', conf), function(e, fn) {
                e.stopPropagation();
                if (itms.first == 0) {
                    var val = 0
                } else {
                    var val = itms.total - itms.first
                }
                if (is_function(fn)) {
                    fn.call($tt0, val)
                }
                return val
            });
            $cfs.bind(cf_e('currentPage', conf), function(e, fn) {
                e.stopPropagation();
                var ipp = opts.pagination.items || opts.items.visible,
                    max = Math.ceil(itms.total / ipp - 1),
                    nr;
                if (itms.first == 0) {
                    nr = 0
                } else if (itms.first < itms.total % ipp) {
                    nr = 0
                } else if (itms.first == ipp && !opts.circular) {
                    nr = max
                } else {
                    nr = Math.round((itms.total - itms.first) / ipp)
                }
                if (nr < 0) {
                    nr = 0
                }
                if (nr > max) {
                    nr = max
                }
                if (is_function(fn)) {
                    fn.call($tt0, nr)
                }
                return nr
            });
            $cfs.bind(cf_e('currentVisible', conf), function(e, fn) {
                e.stopPropagation();
                var $i = gi_getCurrentItems($cfs.children(), opts);
                if (is_function(fn)) {
                    fn.call($tt0, $i)
                }
                return $i
            });
            $cfs.bind(cf_e('slice', conf), function(e, f, l, fn) {
                e.stopPropagation();
                if (itms.total == 0) {
                    return false
                }
                var v = [f, l, fn],
                    t = ['number', 'number', 'function'],
                    a = cf_sortParams(v, t);
                f = (is_number(a[0])) ? a[0] : 0;
                l = (is_number(a[1])) ? a[1] : itms.total;
                fn = a[2];
                f += itms.first;
                l += itms.first;
                if (items.total > 0) {
                    while (f > itms.total) {
                        f -= itms.total
                    }
                    while (l > itms.total) {
                        l -= itms.total
                    }
                    while (f < 0) {
                        f += itms.total
                    }
                    while (l < 0) {
                        l += itms.total
                    }
                }
                var $iA = $cfs.children(),
                    $i;
                if (l > f) {
                    $i = $iA.slice(f, l)
                } else {
                    $i = $($iA.slice(f, itms.total).get().concat($iA.slice(0, l).get()))
                }
                if (is_function(fn)) {
                    fn.call($tt0, $i)
                }
                return $i
            });
            $cfs.bind(cf_e('isPaused', conf) + ' ' + cf_e('isStopped', conf) + ' ' + cf_e('isScrolling', conf), function(e, fn) {
                e.stopPropagation();
                var eType = e.type.slice(conf.events.prefix.length),
                    value = crsl[eType];
                if (is_function(fn)) {
                    fn.call($tt0, value)
                }
                return value
            });
            $cfs.bind(cf_e('configuration', conf), function(e, a, b, c) {
                e.stopPropagation();
                var reInit = false;
                if (is_function(a)) {
                    a.call($tt0, opts)
                } else if (is_object(a)) {
                    opts_orig = $.extend(true, {}, opts_orig, a);
                    if (b !== false) reInit = true;
                    else opts = $.extend(true, {}, opts, a)
                } else if (!is_undefined(a)) {
                    if (is_function(b)) {
                        var val = eval('opts.' + a);
                        if (is_undefined(val)) {
                            val = ''
                        }
                        b.call($tt0, val)
                    } else if (!is_undefined(b)) {
                        if (typeof c !== 'boolean') c = true;
                        eval('opts_orig.' + a + ' = b');
                        if (c !== false) reInit = true;
                        else eval('opts.' + a + ' = b')
                    } else {
                        return eval('opts.' + a)
                    }
                }
                if (reInit) {
                    sz_resetMargin($cfs.children(), opts);
                    FN._init(opts_orig);
                    FN._bind_buttons();
                    var sz = sz_setSizes($cfs, opts);
                    $cfs.trigger(cf_e('updatePageStatus', conf), [true, sz])
                }
                return opts
            });
            $cfs.bind(cf_e('linkAnchors', conf), function(e, $con, sel) {
                e.stopPropagation();
                if (is_undefined($con)) {
                    $con = $('body')
                } else if (is_string($con)) {
                    $con = $($con)
                }
                if (!is_jquery($con) || $con.length == 0) {
                    return debug(conf, 'Not a valid object.')
                }
                if (!is_string(sel)) {
                    sel = 'a.caroufredsel'
                }
                $con.find(sel).each(function() {
                    var h = this.hash || '';
                    if (h.length > 0 && $cfs.children().index($(h)) != -1) {
                        $(this).unbind('click').click(function(e) {
                            e.preventDefault();
                            $cfs.trigger(cf_e('slideTo', conf), h)
                        })
                    }
                });
                return true
            });
            $cfs.bind(cf_e('updatePageStatus', conf), function(e, build, sizes) {
                e.stopPropagation();
                if (!opts.pagination.container) {
                    return
                }
                var ipp = opts.pagination.items || opts.items.visible,
                    pgs = Math.ceil(itms.total / ipp);
                if (build) {
                    if (opts.pagination.anchorBuilder) {
                        opts.pagination.container.children().remove();
                        opts.pagination.container.each(function() {
                            for (var a = 0; a < pgs; a++) {
                                var i = $cfs.children().eq(gn_getItemIndex(a * ipp, 0, true, itms, $cfs));
                                $(this).append(opts.pagination.anchorBuilder.call(i[0], a + 1))
                            }
                        })
                    }
                    opts.pagination.container.each(function() {
                        $(this).children().unbind(opts.pagination.event).each(function(a) {
                            $(this).bind(opts.pagination.event, function(e) {
                                e.preventDefault();
                                $cfs.trigger(cf_e('slideTo', conf), [a * ipp, -opts.pagination.deviation, true, opts.pagination])
                            })
                        })
                    })
                }
                var selected = $cfs.triggerHandler(cf_e('currentPage', conf)) + opts.pagination.deviation;
                if (selected >= pgs) {
                    selected = 0
                }
                if (selected < 0) {
                    selected = pgs - 1
                }
                opts.pagination.container.each(function() {
                    $(this).children().removeClass(cf_c('selected', conf)).eq(selected).addClass(cf_c('selected', conf))
                });
                return true
            });
            $cfs.bind(cf_e('updateSizes', conf), function(e) {
                var vI = opts.items.visible,
                    a_itm = $cfs.children(),
                    avail_primary = ms_getParentSize($wrp, opts, 'width');
                itms.total = a_itm.length;
                if (crsl.primarySizePercentage) {
                    opts.maxDimension = avail_primary;
                    opts[opts.d['width']] = ms_getPercentage(avail_primary, crsl.primarySizePercentage)
                } else {
                    opts.maxDimension = ms_getMaxDimension(opts, avail_primary)
                }
                if (opts.responsive) {
                    opts.items.width = opts.items.sizesConf.width;
                    opts.items.height = opts.items.sizesConf.height;
                    opts = in_getResponsiveValues(opts, a_itm, avail_primary);
                    vI = opts.items.visible;
                    sz_setResponsiveSizes(opts, a_itm)
                } else if (opts.items.visibleConf.variable) {
                    vI = gn_getVisibleItemsNext(a_itm, opts, 0)
                } else if (opts.items.filter != '*') {
                    vI = gn_getVisibleItemsNextFilter(a_itm, opts, 0)
                }
                if (!opts.circular && itms.first != 0 && vI > itms.first) {
                    if (opts.items.visibleConf.variable) {
                        var nI = gn_getVisibleItemsPrev(a_itm, opts, itms.first) - itms.first
                    } else if (opts.items.filter != '*') {
                        var nI = gn_getVisibleItemsPrevFilter(a_itm, opts, itms.first) - itms.first
                    } else {
                        var nI = opts.items.visible - itms.first
                    }
                    debug(conf, 'Preventing non-circular: sliding ' + nI + ' items backward.');
                    $cfs.trigger(cf_e('prev', conf), nI)
                }
                opts.items.visible = cf_getItemsAdjust(vI, opts, opts.items.visibleConf.adjust, $tt0);
                opts.items.visibleConf.old = opts.items.visible;
                opts = in_getAlignPadding(opts, a_itm);
                var sz = sz_setSizes($cfs, opts);
                $cfs.trigger(cf_e('updatePageStatus', conf), [true, sz]);
                nv_showNavi(opts, itms.total, conf);
                nv_enableNavi(opts, itms.first, conf);
                return sz
            });
            $cfs.bind(cf_e('destroy', conf), function(e, orgOrder) {
                e.stopPropagation();
                tmrs = sc_clearTimers(tmrs);
                $cfs.data('_cfs_isCarousel', false);
                $cfs.trigger(cf_e('finish', conf));
                if (orgOrder) {
                    $cfs.trigger(cf_e('jumpToStart', conf))
                }
                sz_restoreOrigCss($cfs.children());
                sz_restoreOrigCss($cfs);
                FN._unbind_events();
                FN._unbind_buttons();
                if (conf.wrapper == 'parent') {
                    sz_restoreOrigCss($wrp)
                } else {
                    $wrp.replaceWith($cfs)
                }
                return true
            });
            $cfs.bind(cf_e('debug', conf), function(e) {
                debug(conf, 'Carousel width: ' + opts.width);
                debug(conf, 'Carousel height: ' + opts.height);
                debug(conf, 'Item widths: ' + opts.items.width);
                debug(conf, 'Item heights: ' + opts.items.height);
                debug(conf, 'Number of items visible: ' + opts.items.visible);
                if (opts.auto.play) {
                    debug(conf, 'Number of items scrolled automatically: ' + opts.auto.items)
                }
                if (opts.prev.button) {
                    debug(conf, 'Number of items scrolled backward: ' + opts.prev.items)
                }
                if (opts.next.button) {
                    debug(conf, 'Number of items scrolled forward: ' + opts.next.items)
                }
                return conf.debug
            });
            $cfs.bind('_cfs_triggerEvent', function(e, n, o) {
                e.stopPropagation();
                return $cfs.triggerHandler(cf_e(n, conf), o)
            })
        };
        FN._unbind_events = function() {
            $cfs.unbind(cf_e('', conf));
            $cfs.unbind(cf_e('', conf, false));
            $cfs.unbind('_cfs_triggerEvent')
        };
        FN._bind_buttons = function() {
            FN._unbind_buttons();
            nv_showNavi(opts, itms.total, conf);
            nv_enableNavi(opts, itms.first, conf);
            if (opts.auto.pauseOnHover) {
                var pC = bt_pauseOnHoverConfig(opts.auto.pauseOnHover);
                $wrp.bind(cf_e('mouseenter', conf, false), function() {
                    $cfs.trigger(cf_e('pause', conf), pC)
                }).bind(cf_e('mouseleave', conf, false), function() {
                    $cfs.trigger(cf_e('resume', conf))
                })
            }
            if (opts.auto.button) {
                opts.auto.button.bind(cf_e(opts.auto.event, conf, false), function(e) {
                    e.preventDefault();
                    var ev = false,
                        pC = null;
                    if (crsl.isPaused) {
                        ev = 'play'
                    } else if (opts.auto.pauseOnEvent) {
                        ev = 'pause';
                        pC = bt_pauseOnHoverConfig(opts.auto.pauseOnEvent)
                    }
                    if (ev) {
                        $cfs.trigger(cf_e(ev, conf), pC)
                    }
                })
            }
            if (opts.prev.button) {
                opts.prev.button.bind(cf_e(opts.prev.event, conf, false), function(e) {
                    e.preventDefault();
                    $cfs.trigger(cf_e('prev', conf))
                });
                if (opts.prev.pauseOnHover) {
                    var pC = bt_pauseOnHoverConfig(opts.prev.pauseOnHover);
                    opts.prev.button.bind(cf_e('mouseenter', conf, false), function() {
                        $cfs.trigger(cf_e('pause', conf), pC)
                    }).bind(cf_e('mouseleave', conf, false), function() {
                        $cfs.trigger(cf_e('resume', conf))
                    })
                }
            }
            if (opts.next.button) {
                opts.next.button.bind(cf_e(opts.next.event, conf, false), function(e) {
                    e.preventDefault();
                    $cfs.trigger(cf_e('next', conf))
                });
                if (opts.next.pauseOnHover) {
                    var pC = bt_pauseOnHoverConfig(opts.next.pauseOnHover);
                    opts.next.button.bind(cf_e('mouseenter', conf, false), function() {
                        $cfs.trigger(cf_e('pause', conf), pC)
                    }).bind(cf_e('mouseleave', conf, false), function() {
                        $cfs.trigger(cf_e('resume', conf))
                    })
                }
            }
            if (opts.pagination.container) {
                if (opts.pagination.pauseOnHover) {
                    var pC = bt_pauseOnHoverConfig(opts.pagination.pauseOnHover);
                    opts.pagination.container.bind(cf_e('mouseenter', conf, false), function() {
                        $cfs.trigger(cf_e('pause', conf), pC)
                    }).bind(cf_e('mouseleave', conf, false), function() {
                        $cfs.trigger(cf_e('resume', conf))
                    })
                }
            }
            if (opts.prev.key || opts.next.key) {
                $(document).bind(cf_e('keyup', conf, false, true, true), function(e) {
                    var k = e.keyCode;
                    if (k == opts.next.key) {
                        e.preventDefault();
                        $cfs.trigger(cf_e('next', conf))
                    }
                    if (k == opts.prev.key) {
                        e.preventDefault();
                        $cfs.trigger(cf_e('prev', conf))
                    }
                })
            }
            if (opts.pagination.keys) {
                $(document).bind(cf_e('keyup', conf, false, true, true), function(e) {
                    var k = e.keyCode;
                    if (k >= 49 && k < 58) {
                        k = (k - 49) * opts.items.visible;
                        if (k <= itms.total) {
                            e.preventDefault();
                            $cfs.trigger(cf_e('slideTo', conf), [k, 0, true, opts.pagination])
                        }
                    }
                })
            }
            if ($.fn.swipe) {
                var isTouch = 'ontouchstart' in window;
                if ((isTouch && opts.swipe.onTouch) || (!isTouch && opts.swipe.onMouse)) {
                    var scP = $.extend(true, {}, opts.prev, opts.swipe),
                        scN = $.extend(true, {}, opts.next, opts.swipe),
                        swP = function() {
                            $cfs.trigger(cf_e('prev', conf), [scP])
                        },
                        swN = function() {
                            $cfs.trigger(cf_e('next', conf), [scN])
                        };
                    switch (opts.direction) {
                        case 'up':
                        case 'down':
                            opts.swipe.options.swipeUp = swN;
                            opts.swipe.options.swipeDown = swP;
                            break;
                        default:
                            opts.swipe.options.swipeLeft = swN;
                            opts.swipe.options.swipeRight = swP
                    }
                    if (crsl.swipe) {
                        $cfs.swipe('destroy')
                    }
                    $wrp.swipe(opts.swipe.options);
                    $wrp.css('cursor', 'move');
                    crsl.swipe = true
                }
            }
            if ($.fn.mousewheel) {
                if (opts.mousewheel) {
                    var mcP = $.extend(true, {}, opts.prev, opts.mousewheel),
                        mcN = $.extend(true, {}, opts.next, opts.mousewheel);
                    if (crsl.mousewheel) {
                        $wrp.unbind(cf_e('mousewheel', conf, false))
                    }
                    $wrp.bind(cf_e('mousewheel', conf, false), function(e, delta) {
                        e.preventDefault();
                        if (delta > 0) {
                            $cfs.trigger(cf_e('prev', conf), [mcP])
                        } else {
                            $cfs.trigger(cf_e('next', conf), [mcN])
                        }
                    });
                    crsl.mousewheel = true
                }
            }
            if (opts.auto.play) {
                $cfs.trigger(cf_e('play', conf), opts.auto.delay)
            }
            if (crsl.upDateOnWindowResize) {
                var resizeFn = function(e) {
                    $cfs.trigger(cf_e('finish', conf));
                    if (opts.auto.pauseOnResize && !crsl.isPaused) {
                        $cfs.trigger(cf_e('play', conf))
                    }
                    sz_resetMargin($cfs.children(), opts);
                    $cfs.trigger(cf_e('updateSizes', conf))
                };
                var $w = $(window),
                    onResize = null;
                if ($.debounce && conf.onWindowResize == 'debounce') {
                    onResize = $.debounce(200, resizeFn)
                } else if ($.throttle && conf.onWindowResize == 'throttle') {
                    onResize = $.throttle(300, resizeFn)
                } else {
                    var _windowWidth = 0,
                        _windowHeight = 0;
                    onResize = function() {
                        var nw = $w.width(),
                            nh = $w.height();
                        if (nw != _windowWidth || nh != _windowHeight) {
                            resizeFn();
                            _windowWidth = nw;
                            _windowHeight = nh
                        }
                    }
                }
                $w.bind(cf_e('resize', conf, false, true, true), onResize)
            }
        };
        FN._unbind_buttons = function() {
            var ns1 = cf_e('', conf),
                ns2 = cf_e('', conf, false);
            ns3 = cf_e('', conf, false, true, true);
            $(document).unbind(ns3);
            $(window).unbind(ns3);
            $wrp.unbind(ns2);
            if (opts.auto.button) {
                opts.auto.button.unbind(ns2)
            }
            if (opts.prev.button) {
                opts.prev.button.unbind(ns2)
            }
            if (opts.next.button) {
                opts.next.button.unbind(ns2)
            }
            if (opts.pagination.container) {
                opts.pagination.container.unbind(ns2);
                if (opts.pagination.anchorBuilder) {
                    opts.pagination.container.children().remove()
                }
            }
            if (crsl.swipe) {
                $cfs.swipe('destroy');
                $wrp.css('cursor', 'default');
                crsl.swipe = false
            }
            if (crsl.mousewheel) {
                crsl.mousewheel = false
            }
            nv_showNavi(opts, 'hide', conf);
            nv_enableNavi(opts, 'removeClass', conf)
        };
        if (is_boolean(configs)) {
            configs = {
                'debug': configs
            }
        }
        var crsl = {
                'direction': 'next',
                'isPaused': true,
                'isScrolling': false,
                'isStopped': false,
                'mousewheel': false,
                'swipe': false
            },
            itms = {
                'total': $cfs.children().length,
                'first': 0
            },
            tmrs = {
                'auto': null,
                'progress': null,
                'startTime': getTime(),
                'timePassed': 0
            },
            scrl = {
                'isStopped': false,
                'duration': 0,
                'startTime': 0,
                'easing': '',
                'anims': []
            },
            clbk = {
                'onBefore': [],
                'onAfter': []
            },
            queu = [],
            conf = $.extend(true, {}, $.fn.carouFredSel.configs, configs),
            opts = {},
            opts_orig = $.extend(true, {}, options),
            $wrp = (conf.wrapper == 'parent') ? $cfs.parent() : $cfs.wrap('<' + conf.wrapper.element + ' class="' + conf.wrapper.classname + '" />').parent();
        conf.selector = $cfs.selector;
        conf.serialNumber = $.fn.carouFredSel.serialNumber++;
        conf.transition = (conf.transition && $.fn.transition) ? 'transition' : 'animate';
        FN._init(opts_orig, true, starting_position);
        FN._build();
        FN._bind_events();
        FN._bind_buttons();
        if (is_array(opts.items.start)) {
            var start_arr = opts.items.start
        } else {
            var start_arr = [];
            if (opts.items.start != 0) {
                start_arr.push(opts.items.start)
            }
        }
        if (opts.cookie) {
            start_arr.unshift(parseInt(cf_getCookie(opts.cookie), 10))
        }
        if (start_arr.length > 0) {
            for (var a = 0, l = start_arr.length; a < l; a++) {
                var s = start_arr[a];
                if (s == 0) {
                    continue
                }
                if (s === true) {
                    s = window.location.hash;
                    if (s.length < 1) {
                        continue
                    }
                } else if (s === 'random') {
                    s = Math.floor(Math.random() * itms.total)
                }
                if ($cfs.triggerHandler(cf_e('slideTo', conf), [s, 0, true, {
                        fx: 'none'
                    }])) {
                    break
                }
            }
        }
        var siz = sz_setSizes($cfs, opts),
            itm = gi_getCurrentItems($cfs.children(), opts);
        if (opts.onCreate) {
            opts.onCreate.call($tt0, {
                'width': siz.width,
                'height': siz.height,
                'items': itm
            })
        }
        $cfs.trigger(cf_e('updatePageStatus', conf), [true, siz]);
        $cfs.trigger(cf_e('linkAnchors', conf));
        if (conf.debug) {
            $cfs.trigger(cf_e('debug', conf))
        }
        return $cfs
    };
    $.fn.carouFredSel.serialNumber = 1;
    $.fn.carouFredSel.defaults = {
        'synchronise': false,
        'infinite': true,
        'circular': true,
        'responsive': false,
        'direction': 'left',
        'items': {
            'start': 0
        },
        'scroll': {
            'easing': 'swing',
            'duration': 500,
            'pauseOnHover': false,
            'event': 'click',
            'queue': false
        }
    };
    $.fn.carouFredSel.configs = {
        'debug': false,
        'transition': false,
        'onWindowResize': 'throttle',
        'events': {
            'prefix': '',
            'namespace': 'cfs'
        },
        'wrapper': {
            'element': 'div',
            'classname': 'caroufredsel_wrapper'
        },
        'classnames': {}
    };
    $.fn.carouFredSel.pageAnchorBuilder = function(nr) {
        return '<a href="#"><span>' + nr + '</span></a>'
    };
    $.fn.carouFredSel.progressbarUpdater = function(perc) {
        $(this).css('width', perc + '%')
    };
    $.fn.carouFredSel.cookie = {
        get: function(n) {
            n += '=';
            var ca = document.cookie.split(';');
            for (var a = 0, l = ca.length; a < l; a++) {
                var c = ca[a];
                while (c.charAt(0) == ' ') {
                    c = c.slice(1)
                }
                if (c.indexOf(n) == 0) {
                    return c.slice(n.length)
                }
            }
            return 0
        },
        set: function(n, v, d) {
            var e = "";
            if (d) {
                var date = new Date();
                date.setTime(date.getTime() + (d * 24 * 60 * 60 * 1000));
                e = "; expires=" + date.toGMTString()
            }
            document.cookie = n + '=' + v + e + '; path=/'
        },
        remove: function(n) {
            $.fn.carouFredSel.cookie.set(n, "", -1)
        }
    };

    function sc_setScroll(d, e, c) {
        if (c.transition == 'transition') {
            if (e == 'swing') {
                e = 'ease'
            }
        }
        return {
            anims: [],
            duration: d,
            orgDuration: d,
            easing: e,
            startTime: getTime()
        }
    }

    function sc_startScroll(s, c) {
        for (var a = 0, l = s.anims.length; a < l; a++) {
            var b = s.anims[a];
            if (!b) {
                continue
            }
            b[0][c.transition](b[1], s.duration, s.easing, b[2])
        }
    }

    function sc_stopScroll(s, finish) {
        if (!is_boolean(finish)) {
            finish = true
        }
        if (is_object(s.pre)) {
            sc_stopScroll(s.pre, finish)
        }
        for (var a = 0, l = s.anims.length; a < l; a++) {
            var b = s.anims[a];
            b[0].stop(true);
            if (finish) {
                b[0].css(b[1]);
                if (is_function(b[2])) {
                    b[2]()
                }
            }
        }
        if (is_object(s.post)) {
            sc_stopScroll(s.post, finish)
        }
    }

    function sc_afterScroll($c, $c2, o) {
        if ($c2) {
            $c2.remove()
        }
        switch (o.fx) {
            case 'fade':
            case 'crossfade':
            case 'cover-fade':
            case 'uncover-fade':
                $c.css('opacity', 1);
                $c.css('filter', '');
                break
        }
    }

    function sc_fireCallbacks($t, o, b, a, c) {
        if (o[b]) {
            o[b].call($t, a)
        }
        if (c[b].length) {
            for (var i = 0, l = c[b].length; i < l; i++) {
                c[b][i].call($t, a)
            }
        }
        return []
    }

    function sc_fireQueue($c, q, c) {
        if (q.length) {
            $c.trigger(cf_e(q[0][0], c), q[0][1]);
            q.shift()
        }
        return q
    }

    function sc_hideHiddenItems(hiddenitems) {
        hiddenitems.each(function() {
            var hi = $(this);
            hi.data('_cfs_isHidden', hi.is(':hidden')).hide()
        })
    }

    function sc_showHiddenItems(hiddenitems) {
        if (hiddenitems) {
            hiddenitems.each(function() {
                var hi = $(this);
                if (!hi.data('_cfs_isHidden')) {
                    hi.show()
                }
            })
        }
    }

    function sc_clearTimers(t) {
        if (t.auto) {
            clearTimeout(t.auto)
        }
        if (t.progress) {
            clearInterval(t.progress)
        }
        return t
    }

    function sc_mapCallbackArguments(i_old, i_skp, i_new, s_itm, s_dir, s_dur, w_siz) {
        return {
            'width': w_siz.width,
            'height': w_siz.height,
            'items': {
                'old': i_old,
                'skipped': i_skp,
                'visible': i_new
            },
            'scroll': {
                'items': s_itm,
                'direction': s_dir,
                'duration': s_dur
            }
        }
    }

    function sc_getDuration(sO, o, nI, siz) {
        var dur = sO.duration;
        if (sO.fx == 'none') {
            return 0
        }
        if (dur == 'auto') {
            dur = o.scroll.duration / o.scroll.items * nI
        } else if (dur < 10) {
            dur = siz / dur
        }
        if (dur < 1) {
            return 0
        }
        if (sO.fx == 'fade') {
            dur = dur / 2
        }
        return Math.round(dur)
    }

    function nv_showNavi(o, t, c) {
        var minimum = (is_number(o.items.minimum)) ? o.items.minimum : o.items.visible + 1;
        if (t == 'show' || t == 'hide') {
            var f = t
        } else if (minimum > t) {
            debug(c, 'Not enough items (' + t + ' total, ' + minimum + ' needed): Hiding navigation.');
            var f = 'hide'
        } else {
            var f = 'show'
        }
        var s = (f == 'show') ? 'removeClass' : 'addClass',
            h = cf_c('hidden', c);
        if (o.auto.button) {
            o.auto.button[f]()[s](h)
        }
        if (o.prev.button) {
            o.prev.button[f]()[s](h)
        }
        if (o.next.button) {
            o.next.button[f]()[s](h)
        }
        if (o.pagination.container) {
            o.pagination.container[f]()[s](h)
        }
    }

    function nv_enableNavi(o, f, c) {
        if (o.circular || o.infinite) return;
        var fx = (f == 'removeClass' || f == 'addClass') ? f : false,
            di = cf_c('disabled', c);
        if (o.auto.button && fx) {
            o.auto.button[fx](di)
        }
        if (o.prev.button) {
            var fn = fx || (f == 0) ? 'addClass' : 'removeClass';
            o.prev.button[fn](di)
        }
        if (o.next.button) {
            var fn = fx || (f == o.items.visible) ? 'addClass' : 'removeClass';
            o.next.button[fn](di)
        }
    }

    function go_getObject($tt, obj) {
        if (is_function(obj)) {
            obj = obj.call($tt)
        } else if (is_undefined(obj)) {
            obj = {}
        }
        return obj
    }

    function go_getItemsObject($tt, obj) {
        obj = go_getObject($tt, obj);
        if (is_number(obj)) {
            obj = {
                'visible': obj
            }
        } else if (obj == 'variable') {
            obj = {
                'visible': obj,
                'width': obj,
                'height': obj
            }
        } else if (!is_object(obj)) {
            obj = {}
        }
        return obj
    }

    function go_getScrollObject($tt, obj) {
        obj = go_getObject($tt, obj);
        if (is_number(obj)) {
            if (obj <= 50) {
                obj = {
                    'items': obj
                }
            } else {
                obj = {
                    'duration': obj
                }
            }
        } else if (is_string(obj)) {
            obj = {
                'easing': obj
            }
        } else if (!is_object(obj)) {
            obj = {}
        }
        return obj
    }

    function go_getNaviObject($tt, obj) {
        obj = go_getObject($tt, obj);
        if (is_string(obj)) {
            var temp = cf_getKeyCode(obj);
            if (temp == -1) {
                obj = $(obj)
            } else {
                obj = temp
            }
        }
        return obj
    }

    function go_getAutoObject($tt, obj) {
        obj = go_getNaviObject($tt, obj);
        if (is_jquery(obj)) {
            obj = {
                'button': obj
            }
        } else if (is_boolean(obj)) {
            obj = {
                'play': obj
            }
        } else if (is_number(obj)) {
            obj = {
                'timeoutDuration': obj
            }
        }
        if (obj.progress) {
            if (is_string(obj.progress) || is_jquery(obj.progress)) {
                obj.progress = {
                    'bar': obj.progress
                }
            }
        }
        return obj
    }

    function go_complementAutoObject($tt, obj) {
        if (is_function(obj.button)) {
            obj.button = obj.button.call($tt)
        }
        if (is_string(obj.button)) {
            obj.button = $(obj.button)
        }
        if (!is_boolean(obj.play)) {
            obj.play = true
        }
        if (!is_number(obj.delay)) {
            obj.delay = 0
        }
        if (is_undefined(obj.pauseOnEvent)) {
            obj.pauseOnEvent = true
        }
        if (!is_boolean(obj.pauseOnResize)) {
            obj.pauseOnResize = true
        }
        if (!is_number(obj.timeoutDuration)) {
            obj.timeoutDuration = (obj.duration < 10) ? 2500 : obj.duration * 5
        }
        if (obj.progress) {
            if (is_function(obj.progress.bar)) {
                obj.progress.bar = obj.progress.bar.call($tt)
            }
            if (is_string(obj.progress.bar)) {
                obj.progress.bar = $(obj.progress.bar)
            }
            if (obj.progress.bar) {
                if (!is_function(obj.progress.updater)) {
                    obj.progress.updater = $.fn.carouFredSel.progressbarUpdater
                }
                if (!is_number(obj.progress.interval)) {
                    obj.progress.interval = 50
                }
            } else {
                obj.progress = false
            }
        }
        return obj
    }

    function go_getPrevNextObject($tt, obj) {
        obj = go_getNaviObject($tt, obj);
        if (is_jquery(obj)) {
            obj = {
                'button': obj
            }
        } else if (is_number(obj)) {
            obj = {
                'key': obj
            }
        }
        return obj
    }

    function go_complementPrevNextObject($tt, obj) {
        if (is_function(obj.button)) {
            obj.button = obj.button.call($tt)
        }
        if (is_string(obj.button)) {
            obj.button = $(obj.button)
        }
        if (is_string(obj.key)) {
            obj.key = cf_getKeyCode(obj.key)
        }
        return obj
    }

    function go_getPaginationObject($tt, obj) {
        obj = go_getNaviObject($tt, obj);
        if (is_jquery(obj)) {
            obj = {
                'container': obj
            }
        } else if (is_boolean(obj)) {
            obj = {
                'keys': obj
            }
        }
        return obj
    }

    function go_complementPaginationObject($tt, obj) {
        if (is_function(obj.container)) {
            obj.container = obj.container.call($tt)
        }
        if (is_string(obj.container)) {
            obj.container = $(obj.container)
        }
        if (!is_number(obj.items)) {
            obj.items = false
        }
        if (!is_boolean(obj.keys)) {
            obj.keys = false
        }
        if (!is_function(obj.anchorBuilder) && !is_false(obj.anchorBuilder)) {
            obj.anchorBuilder = $.fn.carouFredSel.pageAnchorBuilder
        }
        if (!is_number(obj.deviation)) {
            obj.deviation = 0
        }
        return obj
    }

    function go_getSwipeObject($tt, obj) {
        if (is_function(obj)) {
            obj = obj.call($tt)
        }
        if (is_undefined(obj)) {
            obj = {
                'onTouch': false
            }
        }
        if (is_true(obj)) {
            obj = {
                'onTouch': obj
            }
        } else if (is_number(obj)) {
            obj = {
                'items': obj
            }
        }
        return obj
    }

    function go_complementSwipeObject($tt, obj) {
        if (!is_boolean(obj.onTouch)) {
            obj.onTouch = true
        }
        if (!is_boolean(obj.onMouse)) {
            obj.onMouse = false
        }
        if (!is_object(obj.options)) {
            obj.options = {}
        }
        if (!is_boolean(obj.options.triggerOnTouchEnd)) {
            obj.options.triggerOnTouchEnd = false
        }
        return obj
    }

    function go_getMousewheelObject($tt, obj) {
        if (is_function(obj)) {
            obj = obj.call($tt)
        }
        if (is_true(obj)) {
            obj = {}
        } else if (is_number(obj)) {
            obj = {
                'items': obj
            }
        } else if (is_undefined(obj)) {
            obj = false
        }
        return obj
    }

    function go_complementMousewheelObject($tt, obj) {
        return obj
    }

    function gn_getItemIndex(num, dev, org, items, $cfs) {
        if (is_string(num)) {
            num = $(num, $cfs)
        }
        if (is_object(num)) {
            num = $(num, $cfs)
        }
        if (is_jquery(num)) {
            num = $cfs.children().index(num);
            if (!is_boolean(org)) {
                org = false
            }
        } else {
            if (!is_boolean(org)) {
                org = true
            }
        }
        if (!is_number(num)) {
            num = 0
        }
        if (!is_number(dev)) {
            dev = 0
        }
        if (org) {
            num += items.first
        }
        num += dev;
        if (items.total > 0) {
            while (num >= items.total) {
                num -= items.total
            }
            while (num < 0) {
                num += items.total
            }
        }
        return num
    }

    function gn_getVisibleItemsPrev(i, o, s) {
        var t = 0,
            x = 0;
        for (var a = s; a >= 0; a--) {
            var j = i.eq(a);
            t += (j.is(':visible')) ? j[o.d['outerWidth']](true) : 0;
            if (t > o.maxDimension) {
                return x
            }
            if (a == 0) {
                a = i.length
            }
            x++
        }
    }

    function gn_getVisibleItemsPrevFilter(i, o, s) {
        return gn_getItemsPrevFilter(i, o.items.filter, o.items.visibleConf.org, s)
    }

    function gn_getScrollItemsPrevFilter(i, o, s, m) {
        return gn_getItemsPrevFilter(i, o.items.filter, m, s)
    }

    function gn_getItemsPrevFilter(i, f, m, s) {
        var t = 0,
            x = 0;
        for (var a = s, l = i.length; a >= 0; a--) {
            x++;
            if (x == l) {
                return x
            }
            var j = i.eq(a);
            if (j.is(f)) {
                t++;
                if (t == m) {
                    return x
                }
            }
            if (a == 0) {
                a = l
            }
        }
    }

    function gn_getVisibleOrg($c, o) {
        return o.items.visibleConf.org || $c.children().slice(0, o.items.visible).filter(o.items.filter).length
    }

    function gn_getVisibleItemsNext(i, o, s) {
        var t = 0,
            x = 0;
        for (var a = s, l = i.length - 1; a <= l; a++) {
            var j = i.eq(a);
            t += (j.is(':visible')) ? j[o.d['outerWidth']](true) : 0;
            if (t > o.maxDimension) {
                return x
            }
            x++;
            if (x == l + 1) {
                return x
            }
            if (a == l) {
                a = -1
            }
        }
    }

    function gn_getVisibleItemsNextTestCircular(i, o, s, l) {
        var v = gn_getVisibleItemsNext(i, o, s);
        if (!o.circular) {
            if (s + v > l) {
                v = l - s
            }
        }
        return v
    }

    function gn_getVisibleItemsNextFilter(i, o, s) {
        return gn_getItemsNextFilter(i, o.items.filter, o.items.visibleConf.org, s, o.circular)
    }

    function gn_getScrollItemsNextFilter(i, o, s, m) {
        return gn_getItemsNextFilter(i, o.items.filter, m + 1, s, o.circular) - 1
    }

    function gn_getItemsNextFilter(i, f, m, s, c) {
        var t = 0,
            x = 0;
        for (var a = s, l = i.length - 1; a <= l; a++) {
            x++;
            if (x >= l) {
                return x
            }
            var j = i.eq(a);
            if (j.is(f)) {
                t++;
                if (t == m) {
                    return x
                }
            }
            if (a == l) {
                a = -1
            }
        }
    }

    function gi_getCurrentItems(i, o) {
        return i.slice(0, o.items.visible)
    }

    function gi_getOldItemsPrev(i, o, n) {
        return i.slice(n, o.items.visibleConf.old + n)
    }

    function gi_getNewItemsPrev(i, o) {
        return i.slice(0, o.items.visible)
    }

    function gi_getOldItemsNext(i, o) {
        return i.slice(0, o.items.visibleConf.old)
    }

    function gi_getNewItemsNext(i, o, n) {
        return i.slice(n, o.items.visible + n)
    }

    function sz_storeMargin(i, o, d) {
        if (o.usePadding) {
            if (!is_string(d)) {
                d = '_cfs_origCssMargin'
            }
            i.each(function() {
                var j = $(this),
                    m = parseInt(j.css(o.d['marginRight']), 10);
                if (!is_number(m)) {
                    m = 0
                }
                j.data(d, m)
            })
        }
    }

    function sz_resetMargin(i, o, m) {
        if (o.usePadding) {
            var x = (is_boolean(m)) ? m : false;
            if (!is_number(m)) {
                m = 0
            }
            sz_storeMargin(i, o, '_cfs_tempCssMargin');
            i.each(function() {
                var j = $(this);
                j.css(o.d['marginRight'], ((x) ? j.data('_cfs_tempCssMargin') : m + j.data('_cfs_origCssMargin')))
            })
        }
    }

    function sz_storeOrigCss(i) {
        i.each(function() {
            var j = $(this);
            j.data('_cfs_origCss', j.attr('style') || '')
        })
    }

    function sz_restoreOrigCss(i) {
        i.each(function() {
            var j = $(this);
            j.attr('style', j.data('_cfs_origCss') || '')
        })
    }

    function sz_setResponsiveSizes(o, all) {
        var visb = o.items.visible,
            newS = o.items[o.d['width']],
            seco = o[o.d['height']],
            secp = is_percentage(seco);
        all.each(function() {
            var $t = $(this),
                nw = newS - ms_getPaddingBorderMargin($t, o, 'Width');
            $t[o.d['width']](nw);
            if (secp) {
                $t[o.d['height']](ms_getPercentage(nw, seco))
            }
        })
    }

    function sz_setSizes($c, o) {
        var $w = $c.parent(),
            $i = $c.children(),
            $v = gi_getCurrentItems($i, o),
            sz = cf_mapWrapperSizes(ms_getSizes($v, o, true), o, false);
        $w.css(sz);
        if (o.usePadding) {
            var p = o.padding,
                r = p[o.d[1]];
            if (o.align && r < 0) {
                r = 0
            }
            var $l = $v.last();
            $l.css(o.d['marginRight'], $l.data('_cfs_origCssMargin') + r);
            $c.css(o.d['top'], p[o.d[0]]);
            $c.css(o.d['left'], p[o.d[3]])
        }
        $c.css(o.d['width'], sz[o.d['width']] + (ms_getTotalSize($i, o, 'width') * 2));
        return sz
    }

    function ms_getSizes(i, o, wrapper) {
        return [ms_getTotalSize(i, o, 'width', wrapper), ms_getLargestSize(i, o, 'height', wrapper)]
    }

    function ms_getLargestSize(i, o, dim, wrapper) {
        if (!is_boolean(wrapper)) {
            wrapper = false
        }
        if (is_number(o[o.d[dim]]) && wrapper) {
            return o[o.d[dim]]
        }
        if (is_number(o.items[o.d[dim]])) {
            return o.items[o.d[dim]]
        }
        dim = (dim.toLowerCase().indexOf('width') > -1) ? 'outerWidth' : 'outerHeight';
        return ms_getTrueLargestSize(i, o, dim)
    }

    function ms_getTrueLargestSize(i, o, dim) {
        var s = 0;
        for (var a = 0, l = i.length; a < l; a++) {
            var j = i.eq(a);
            var m = (j.is(':visible')) ? j[o.d[dim]](true) : 0;
            if (s < m) {
                s = m
            }
        }
        return s
    }

    function ms_getTotalSize(i, o, dim, wrapper) {
        if (!is_boolean(wrapper)) {
            wrapper = false
        }
        if (is_number(o[o.d[dim]]) && wrapper) {
            return o[o.d[dim]]
        }
        if (is_number(o.items[o.d[dim]])) {
            return o.items[o.d[dim]] * i.length
        }
        var d = (dim.toLowerCase().indexOf('width') > -1) ? 'outerWidth' : 'outerHeight',
            s = 0;
        for (var a = 0, l = i.length; a < l; a++) {
            var j = i.eq(a);
            s += (j.is(':visible')) ? j[o.d[d]](true) : 0
        }
        return s
    }

    function ms_getParentSize($w, o, d) {
        var isVisible = $w.is(':visible');
        if (isVisible) {
            $w.hide()
        }
        var s = $w.parent()[o.d[d]]();
        if (isVisible) {
            $w.show()
        }
        return s
    }

    function ms_getMaxDimension(o, a) {
        return (is_number(o[o.d['width']])) ? o[o.d['width']] : a
    }

    function ms_hasVariableSizes(i, o, dim) {
        var s = false,
            v = false;
        for (var a = 0, l = i.length; a < l; a++) {
            var j = i.eq(a);
            var c = (j.is(':visible')) ? j[o.d[dim]](true) : 0;
            if (s === false) {
                s = c
            } else if (s != c) {
                v = true
            }
            if (s == 0) {
                v = true
            }
        }
        return v
    }

    function ms_getPaddingBorderMargin(i, o, d) {
        return i[o.d['outer' + d]](true) - i[o.d[d.toLowerCase()]]()
    }

    function ms_getPercentage(s, o) {
        if (is_percentage(o)) {
            o = parseInt(o.slice(0, -1), 10);
            if (!is_number(o)) {
                return s
            }
            s *= o / 100
        }
        return s
    }

    function cf_e(n, c, pf, ns, rd) {
        if (!is_boolean(pf)) {
            pf = true
        }
        if (!is_boolean(ns)) {
            ns = true
        }
        if (!is_boolean(rd)) {
            rd = false
        }
        if (pf) {
            n = c.events.prefix + n
        }
        if (ns) {
            n = n + '.' + c.events.namespace
        }
        if (ns && rd) {
            n += c.serialNumber
        }
        return n
    }

    function cf_c(n, c) {
        return (is_string(c.classnames[n])) ? c.classnames[n] : n
    }

    function cf_mapWrapperSizes(ws, o, p) {
        if (!is_boolean(p)) {
            p = true
        }
        var pad = (o.usePadding && p) ? o.padding : [0, 0, 0, 0];
        var wra = {};
        wra[o.d['width']] = ws[0] + pad[1] + pad[3];
        return wra
    }

    function cf_sortParams(vals, typs) {
        var arr = [];
        for (var a = 0, l1 = vals.length; a < l1; a++) {
            for (var b = 0, l2 = typs.length; b < l2; b++) {
                if (typs[b].indexOf(typeof vals[a]) > -1 && is_undefined(arr[b])) {
                    arr[b] = vals[a];
                    break
                }
            }
        }
        return arr
    }

    function cf_getPadding(p) {
        if (is_undefined(p)) {
            return [0, 0, 0, 0]
        }
        if (is_number(p)) {
            return [p, p, p, p]
        }
        if (is_string(p)) {
            p = p.split('px').join('').split('em').join('').split(' ')
        }
        if (!is_array(p)) {
            return [0, 0, 0, 0]
        }
        for (var i = 0; i < 4; i++) {
            p[i] = parseInt(p[i], 10)
        }
        switch (p.length) {
            case 0:
                return [0, 0, 0, 0];
            case 1:
                return [p[0], p[0], p[0], p[0]];
            case 2:
                return [p[0], p[1], p[0], p[1]];
            case 3:
                return [p[0], p[1], p[2], p[1]];
            default:
                return [p[0], p[1], p[2], p[3]]
        }
    }

    function cf_getAlignPadding(itm, o) {
        var x = (is_number(o[o.d['width']])) ? Math.ceil(o[o.d['width']] - ms_getTotalSize(itm, o, 'width')) : 0;
        switch (o.align) {
            case 'left':
                return [0, x];
            case 'right':
                return [x, 0];
            case 'center':
            default:
                return [Math.ceil(x / 2), Math.floor(x / 2)]
        }
    }

    function cf_getDimensions(o) {
        var dm = [
            ['width', 'innerWidth', 'outerWidth', 'height', 'innerHeight', 'outerHeight', 'left', 'top', 'marginRight', 0, 1, 2, 3],
            ['height', 'innerHeight', 'outerHeight', 'width', 'innerWidth', 'outerWidth', 'top', 'left', 'marginBottom', 3, 2, 1, 0]
        ];
        var dl = dm[0].length,
            dx = (o.direction == 'right' || o.direction == 'left') ? 0 : 1;
        var dimensions = {};
        for (var d = 0; d < dl; d++) {
            dimensions[dm[0][d]] = dm[dx][d]
        }
        return dimensions
    }

    function cf_getAdjust(x, o, a, $t) {
        var v = x;
        if (is_function(a)) {
            v = a.call($t, v)
        } else if (is_string(a)) {
            var p = a.split('+'),
                m = a.split('-');
            if (m.length > p.length) {
                var neg = true,
                    sta = m[0],
                    adj = m[1]
            } else {
                var neg = false,
                    sta = p[0],
                    adj = p[1]
            }
            switch (sta) {
                case 'even':
                    v = (x % 2 == 1) ? x - 1 : x;
                    break;
                case 'odd':
                    v = (x % 2 == 0) ? x - 1 : x;
                    break;
                default:
                    v = x;
                    break
            }
            adj = parseInt(adj, 10);
            if (is_number(adj)) {
                if (neg) {
                    adj = -adj
                }
                v += adj
            }
        }
        if (!is_number(v) || v < 1) {
            v = 1
        }
        return v
    }

    function cf_getItemsAdjust(x, o, a, $t) {
        return cf_getItemAdjustMinMax(cf_getAdjust(x, o, a, $t), o.items.visibleConf)
    }

    function cf_getItemAdjustMinMax(v, i) {
        if (is_number(i.min) && v < i.min) {
            v = i.min
        }
        if (is_number(i.max) && v > i.max) {
            v = i.max
        }
        if (v < 1) {
            v = 1
        }
        return v
    }

    function cf_getSynchArr(s) {
        if (!is_array(s)) {
            s = [
                [s]
            ]
        }
        if (!is_array(s[0])) {
            s = [s]
        }
        for (var j = 0, l = s.length; j < l; j++) {
            if (is_string(s[j][0])) {
                s[j][0] = $(s[j][0])
            }
            if (!is_boolean(s[j][1])) {
                s[j][1] = true
            }
            if (!is_boolean(s[j][2])) {
                s[j][2] = true
            }
            if (!is_number(s[j][3])) {
                s[j][3] = 0
            }
        }
        return s
    }

    function cf_getKeyCode(k) {
        if (k == 'right') {
            return 39
        }
        if (k == 'left') {
            return 37
        }
        if (k == 'up') {
            return 38
        }
        if (k == 'down') {
            return 40
        }
        return -1
    }

    function cf_setCookie(n, $c, c) {
        if (n) {
            var v = $c.triggerHandler(cf_e('currentPosition', c));
            $.fn.carouFredSel.cookie.set(n, v)
        }
    }

    function cf_getCookie(n) {
        var c = $.fn.carouFredSel.cookie.get(n);
        return (c == '') ? 0 : c
    }

    function in_mapCss($elem, props) {
        var css = {};
        for (var p = 0, l = props.length; p < l; p++) {
            css[props[p]] = $elem.css(props[p])
        }
        return css
    }

    function in_complementItems(obj, opt, itm, sta) {
        if (!is_object(obj.visibleConf)) {
            obj.visibleConf = {}
        }
        if (!is_object(obj.sizesConf)) {
            obj.sizesConf = {}
        }
        if (obj.start == 0 && is_number(sta)) {
            obj.start = sta
        }
        if (is_object(obj.visible)) {
            obj.visibleConf.min = obj.visible.min;
            obj.visibleConf.max = obj.visible.max;
            obj.visible = false
        } else if (is_string(obj.visible)) {
            if (obj.visible == 'variable') {
                obj.visibleConf.variable = true
            } else {
                obj.visibleConf.adjust = obj.visible
            }
            obj.visible = false
        } else if (is_function(obj.visible)) {
            obj.visibleConf.adjust = obj.visible;
            obj.visible = false
        }
        if (!is_string(obj.filter)) {
            obj.filter = (itm.filter(':hidden').length > 0) ? ':visible' : '*'
        }
        if (!obj[opt.d['width']]) {
            if (opt.responsive) {
                debug(true, 'Set a ' + opt.d['width'] + ' for the items!');
                obj[opt.d['width']] = ms_getTrueLargestSize(itm, opt, 'outerWidth')
            } else {
                obj[opt.d['width']] = (ms_hasVariableSizes(itm, opt, 'outerWidth')) ? 'variable' : itm[opt.d['outerWidth']](true)
            }
        }
        if (!obj[opt.d['height']]) {
            obj[opt.d['height']] = (ms_hasVariableSizes(itm, opt, 'outerHeight')) ? 'variable' : itm[opt.d['outerHeight']](true)
        }
        obj.sizesConf.width = obj.width;
        obj.sizesConf.height = obj.height;
        return obj
    }

    function in_complementVisibleItems(opt, avl) {
        if (opt.items[opt.d['width']] == 'variable') {
            opt.items.visibleConf.variable = true
        }
        if (!opt.items.visibleConf.variable) {
            if (is_number(opt[opt.d['width']])) {
                opt.items.visible = Math.floor(opt[opt.d['width']] / opt.items[opt.d['width']])
            } else {
                opt.items.visible = Math.floor(avl / opt.items[opt.d['width']]);
                opt[opt.d['width']] = opt.items.visible * opt.items[opt.d['width']];
                if (!opt.items.visibleConf.adjust) {
                    opt.align = false
                }
            }
            if (opt.items.visible == 'Infinity' || opt.items.visible < 1) {
                debug(true, 'Not a valid number of visible items: Set to "variable".');
                opt.items.visibleConf.variable = true
            }
        }
        return opt
    }

    function in_complementPrimarySize(obj, opt, all) {
        if (obj == 'auto') {
            obj = ms_getTrueLargestSize(all, opt, 'outerWidth')
        }
        return obj
    }

    function in_complementSecondarySize(obj, opt, all) {
        if (obj == 'auto') {
            obj = ms_getTrueLargestSize(all, opt, 'outerHeight')
        }
        if (!obj) {
            obj = opt.items[opt.d['height']]
        }
        return obj
    }

    function in_getAlignPadding(o, all) {
        var p = cf_getAlignPadding(gi_getCurrentItems(all, o), o);
        o.padding[o.d[1]] = p[1];
        o.padding[o.d[3]] = p[0];
        return o
    }

    function in_getResponsiveValues(o, all, avl) {
        var visb = cf_getItemAdjustMinMax(Math.ceil(o[o.d['width']] / o.items[o.d['width']]), o.items.visibleConf);
        if (visb > all.length) {
            visb = all.length
        }
        var newS = Math.floor(o[o.d['width']] / visb);
        o.items.visible = visb;
        o.items[o.d['width']] = newS;
        o[o.d['width']] = visb * newS;
        return o
    }

    function bt_pauseOnHoverConfig(p) {
        if (is_string(p)) {
            var i = (p.indexOf('immediate') > -1) ? true : false,
                r = (p.indexOf('resume') > -1) ? true : false
        } else {
            var i = r = false
        }
        return [i, r]
    }

    function bt_mousesheelNumber(mw) {
        return (is_number(mw)) ? mw : null
    }

    function is_null(a) {
        return (a === null)
    }

    function is_undefined(a) {
        return (is_null(a) || typeof a == 'undefined' || a === '' || a === 'undefined')
    }

    function is_array(a) {
        return (a instanceof Array)
    }

    function is_jquery(a) {
        return (a instanceof jQuery)
    }

    function is_object(a) {
        return ((a instanceof Object || typeof a == 'object') && !is_null(a) && !is_jquery(a) && !is_array(a) && !is_function(a))
    }

    function is_number(a) {
        return ((a instanceof Number || typeof a == 'number') && !isNaN(a))
    }

    function is_string(a) {
        return ((a instanceof String || typeof a == 'string') && !is_undefined(a) && !is_true(a) && !is_false(a))
    }

    function is_function(a) {
        return (a instanceof Function || typeof a == 'function')
    }

    function is_boolean(a) {
        return (a instanceof Boolean || typeof a == 'boolean' || is_true(a) || is_false(a))
    }

    function is_true(a) {
        return (a === true || a === 'true')
    }

    function is_false(a) {
        return (a === false || a === 'false')
    }

    function is_percentage(x) {
        return (is_string(x) && x.slice(-1) == '%')
    }

    function getTime() {
        return new Date().getTime()
    }

    function deprecated(o, n) {
        debug(true, o + ' is DEPRECATED, support for it will be removed. Use ' + n + ' instead.')
    }

    function debug(d, m) {
        if (!is_undefined(window.console) && !is_undefined(window.console.log)) {
            if (is_object(d)) {
                var s = ' (' + d.selector + ')';
                d = d.debug
            } else {
                var s = ''
            }
            if (!d) {
                return false
            }
            if (is_string(m)) {
                m = 'carouFredSel' + s + ': ' + m
            } else {
                m = ['carouFredSel' + s + ':', m]
            }
            window.console.log(m)
        }
        return false
    }
    $.extend($.easing, {
        'quadratic': function(t) {
            var t2 = t * t;
            return t * (-t2 * t + 4 * t2 - 6 * t + 4)
        },
        'cubic': function(t) {
            return t * (4 * t * t - 9 * t + 6)
        },
        'elastic': function(t) {
            var t2 = t * t;
            return t * (33 * t2 * t2 - 106 * t2 * t + 126 * t2 - 67 * t + 15)
        }
    })
})(jQuery);;
(function($) {
    var _css = {};
    var methods = {
        init: function(options) {
            options = $.extend({}, $.fn.lemmonSlider.defaults, options);
            return this.each(function() {
                var $slider = $(this),
                    data = $slider.data('slider');
                if (!data) {
                    var $sliderContainer = $slider.find(options.slider),
                        $sliderControls = $slider.next().filter('.controls'),
                        $items = $sliderContainer.find(options.items),
                        originalWidth = 1;
                    $items.each(function() {
                        originalWidth += $(this).outerWidth(true)
                    });
                    $sliderContainer.width(originalWidth);
                    if (options.slideToLast) $sliderContainer.css('padding-right', $slider.width());
                    if (options.infinite) {
                        $slider.data('slider-infinite', true);
                        originalWidth = originalWidth * 3;
                        $sliderContainer.width(originalWidth);
                        $items.clone(true, true).addClass('-after').insertAfter($items.filter(':last'));
                        $items.filter(':first').before($items.clone(true, true).addClass('-before'));
                        $items = $sliderContainer.find(options.items)
                    }
                    $slider.items = $items;
                    $slider.options = options;
                    slideTo({}, $slider, 0, 0, 0);
                    $slider.bind('nextSlide', function(e, t) {
                        var scroll = $slider.scrollLeft();
                        var x = 0;
                        var slide = 0;
                        $items.each(function(i) {
                            if (x == 0 && $(this).position().left > options.offset) {
                                x = $(this).position().left;
                                slide = i
                            }
                        });
                        if (x > 0 && $sliderContainer.outerWidth() - scroll - $slider.width() - 1 > 0) {
                            slideTo(e, $slider, scroll + x, slide, 'slow')
                        } else if (options.loop) {
                            slideTo(e, $slider, 0, 0, 'slow')
                        }
                    });
                    $slider.bind('prevSlide', function(e, t) {
                        var scroll = $slider.scrollLeft();
                        var x = 0;
                        var slide = 0;
                        $items.each(function(i) {
                            if ($(this).position().left < options.offset) {
                                x = $(this).position().left;
                                slide = i
                            }
                        });
                        if (x) {
                            slideTo(e, $slider, scroll + x, slide, 'slow')
                        } else if (options.loop) {
                            var a = $sliderContainer.outerWidth() - $slider.width();
                            var b = $items.filter(':last').position().left;
                            slide = $items.size() - 1;
                            if (a > b) {
                                slideTo(e, $slider, b, slide, 'slow')
                            } else {
                                slideTo(e, $slider, a, slide, 'slow')
                            }
                        }
                    });
                    $slider.bind('nextPage', function(e, t) {
                        var scroll = $slider.scrollLeft();
                        var w = $slider.width();
                        var x = 0;
                        var slide = 0;
                        $items.each(function(i) {
                            if ($(this).position().left < w) {
                                x = $(this).position().left;
                                slide = i
                            }
                        });
                        if (x > 0 && scroll + w + 1 < originalWidth) {
                            slideTo(e, $slider, scroll + x, slide, 'slow')
                        } else if (options.loop) {
                            slideTo(e, $slider, 0, 0, 'slow')
                        }
                    });
                    $slider.bind('prevPage', function(e, t) {
                        var scroll = $slider.scrollLeft();
                        var w = $slider.width();
                        var x = 0;
                        $items.each(function(i) {
                            if ($(this).position().left < 1 - w) {
                                x = $(this).next().position().left;
                                slide = i
                            }
                        });
                        if (scroll) {
                            if (x == 0) {
                                slideTo(e, $slider, 0, 0, 'slow')
                            } else {
                                slideTo(e, $slider, scroll + x, slide, 'slow')
                            }
                        } else if (options.loop) {
                            var a = $sliderContainer.outerWidth() - $slider.width();
                            var b = $items.filter(':last').position().left;
                            if (a > b) {
                                $slider.animate({
                                    'scrollLeft': b
                                }, 'slow')
                            } else {
                                $slider.animate({
                                    'scrollLeft': a
                                }, 'slow')
                            }
                        }
                    });
                    $slider.bind('slideTo', function(e, i, t) {
                        slideTo(e, $slider, $slider.scrollLeft() + $items.filter(':eq(' + i + ')').position().left, i, t)
                    });
                    $sliderControls.find('.next-slide').click(function() {
                        $slider.trigger('nextSlide');
                        return false
                    });
                    $sliderControls.find('.prev-slide').click(function() {
                        $slider.trigger('prevSlide');
                        return false
                    });
                    $sliderControls.find('.next-page').click(function() {
                        $slider.trigger('nextPage');
                        return false
                    });
                    $sliderControls.find('.prev-page').click(function() {
                        $slider.trigger('prevPage');
                        return false
                    });
                    $slider.data('slider', {
                        'target': $slider,
                        'options': options
                    })
                }
            })
        },
        addItem: function(options) {
            var options = $.extend({}, $.fn.lemmonSlider.defaults, options);
            var $slider = $(this),
                $sliderContainer = $slider.find(options.slider),
                $sliderControls = $slider.next().filter('.controls'),
                $items = $sliderContainer.find(options.items);
            options.infinite = $slider.data('slider-infinite');
            if (!options.item) {
                return false
            }
            methods.destroy.apply(this);
            if (options.prepend) {
                $sliderContainer.prepend(options.item)
            } else {
                $sliderContainer.append(options.item)
            }
            methods.init.apply(this, [options])
        },
        destroy: function() {
            return this.each(function() {
                var $slider = $(this),
                    $sliderControls = $slider.next().filter('.controls'),
                    $items = $slider.find('> *:first > *'),
                    data = $slider.data('slider');
                $slider.unbind('nextSlide');
                $slider.unbind('prevSlide');
                $slider.unbind('nextPage');
                $slider.unbind('prevPage');
                $slider.unbind('slideTo');
                $sliderControls.find('.next-slide').unbind('click');
                $sliderControls.find('.prev-slide').unbind('click');
                $sliderControls.find('.next-page').unbind('click');
                $sliderControls.find('.next-page').unbind('click');
                $slider.removeData('slider');
                if ($slider.data('slider-infinite')) {
                    $.merge($items.filter('.-before'), $items.filter('.-after')).each(function(index, item) {
                        $(item).remove()
                    })
                }
            })
        }
    };

    function slideTo(e, $slider, x, i, t) {
        $slider.items.filter('li:eq(' + i + ')').addClass('active').siblings('.active').removeClass('active');
        if ($slider.options.center) {
            var currentElement = $($slider.items[i]);
            $slider.options.offset = Math.floor(($('.qode_image_gallery_holder').width() - currentElement.width()) / 2);
            console.log('set offset to ', $slider.options.offset)
        }
        if (typeof t == 'undefined') {
            t = 'slow'
        }
        if (t) {
            $slider.animate({
                'scrollLeft': x - $slider.options.offset
            }, t, function() {
                checkInfinite($slider)
            })
        } else {
            var time = 0;
            $slider.scrollLeft(x - $slider.options.offset);
            checkInfinite($slider)
        }
    }

    function checkInfinite($slider) {
        var $active = $slider.items.filter('.active');
        if ($active.hasClass('-before')) {
            var i = $active.prevAll().size();
            $active.removeClass('active');
            $active = $slider.items.filter(':not(.-before):eq(' + i + ')').addClass('active');
            $slider.scrollLeft($slider.scrollLeft() + $active.position().left - $slider.options.offset)
        } else if ($active.hasClass('-after')) {
            var i = $active.prevAll('.-after').size();
            $active.removeClass('active');
            $active = $slider.items.filter(':not(.-before):eq(' + i + ')').addClass('active');
            $slider.scrollLeft($slider.scrollLeft() + $active.position().left - $slider.options.offset)
        }
    }

    function debug(text) {
        $('#debug span').text(text)
    }
    $.fn.lemmonSlider = function(method, options) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1))
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments)
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.lemmonSlider')
        }
    };
    $.fn.lemmonSlider.defaults = {
        'items': '> *',
        'loop': true,
        'slideToLast': false,
        'slider': '> *:first',
        'infinite': true,
        'center': true,
        'offset': 0
    }
})(jQuery);;
/*! Copyright (c) 2011 Piotr Rochala (http://rocha.la)
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 *
 * Version: 1.3.8
 *
 */
(function(e) {
    e.fn.extend({
        slimScroll: function(f) {
            var a = e.extend({
                width: "auto",
                height: "250px",
                size: "7px",
                color: "#000",
                position: "right",
                distance: "1px",
                start: "top",
                opacity: .4,
                alwaysVisible: !1,
                disableFadeOut: !1,
                railVisible: !1,
                railColor: "#333",
                railOpacity: .2,
                railDraggable: !0,
                railClass: "slimScrollRail",
                barClass: "slimScrollBar",
                wrapperClass: "slimScrollDiv",
                allowPageScroll: !1,
                wheelStep: 20,
                touchScrollStep: 200,
                borderRadius: "7px",
                railBorderRadius: "7px"
            }, f);
            this.each(function() {
                function v(d) {
                    if (r) {
                        d = d || window.event;
                        var c = 0;
                        d.wheelDelta && (c = -d.wheelDelta / 120);
                        d.detail && (c = d.detail / 3);
                        e(d.target || d.srcTarget || d.srcElement).closest("." + a.wrapperClass).is(b.parent()) && n(c, !0);
                        d.preventDefault && !k && d.preventDefault();
                        k || (d.returnValue = !1)
                    }
                }

                function n(d, g, e) {
                    k = !1;
                    var f = b.outerHeight() - c.outerHeight();
                    g && (g = parseInt(c.css("top")) + d * parseInt(a.wheelStep) / 100 * c.outerHeight(), g = Math.min(Math.max(g, 0), f), g = 0 < d ? Math.ceil(g) : Math.floor(g), c.css({
                        top: g + "px"
                    }));
                    l = parseInt(c.css("top")) / (b.outerHeight() - c.outerHeight());
                    g =
                        l * (b[0].scrollHeight - b.outerHeight());
                    e && (g = d, d = g / b[0].scrollHeight * b.outerHeight(), d = Math.min(Math.max(d, 0), f), c.css({
                        top: d + "px"
                    }));
                    b.scrollTop(g);
                    b.trigger("slimscrolling", ~~g);
                    w();
                    p()
                }

                function x() {
                    u = Math.max(b.outerHeight() / b[0].scrollHeight * b.outerHeight(), 30);
                    c.css({
                        height: u + "px"
                    });
                    var a = u == b.outerHeight() ? "none" : "block";
                    c.css({
                        display: a
                    })
                }

                function w() {
                    x();
                    clearTimeout(B);
                    l == ~~l ? (k = a.allowPageScroll, C != l && b.trigger("slimscroll", 0 == ~~l ? "top" : "bottom")) : k = !1;
                    C = l;
                    u >= b.outerHeight() ? k = !0 : (c.stop(!0, !0).fadeIn("fast"), a.railVisible && m.stop(!0, !0).fadeIn("fast"))
                }

                function p() {
                    a.alwaysVisible || (B = setTimeout(function() {
                        a.disableFadeOut && r || y || z || (c.fadeOut("slow"), m.fadeOut("slow"))
                    }, 1E3))
                }
                var r, y, z, B, A, u, l, C, k = !1,
                    b = e(this);
                if (b.parent().hasClass(a.wrapperClass)) {
                    var q = b.scrollTop(),
                        c = b.siblings("." + a.barClass),
                        m = b.siblings("." + a.railClass);
                    x();
                    if (e.isPlainObject(f)) {
                        if ("height" in f && "auto" == f.height) {
                            b.parent().css("height", "auto");
                            b.css("height", "auto");
                            var h = b.parent().parent().height();
                            b.parent().css("height",
                                h);
                            b.css("height", h)
                        } else "height" in f && (h = f.height, b.parent().css("height", h), b.css("height", h));
                        if ("scrollTo" in f) q = parseInt(a.scrollTo);
                        else if ("scrollBy" in f) q += parseInt(a.scrollBy);
                        else if ("destroy" in f) {
                            c.remove();
                            m.remove();
                            b.unwrap();
                            return
                        }
                        n(q, !1, !0)
                    }
                } else if (!(e.isPlainObject(f) && "destroy" in f)) {
                    a.height = "auto" == a.height ? b.parent().height() : a.height;
                    q = e("<div></div>").addClass(a.wrapperClass).css({
                        position: "relative",
                        overflow: "hidden",
                        width: a.width,
                        height: a.height
                    });
                    b.css({
                        overflow: "hidden",
                        width: a.width,
                        height: a.height
                    });
                    var m = e("<div></div>").addClass(a.railClass).css({
                            width: a.size,
                            height: "100%",
                            position: "absolute",
                            top: 0,
                            display: a.alwaysVisible && a.railVisible ? "block" : "none",
                            "border-radius": a.railBorderRadius,
                            background: a.railColor,
                            opacity: a.railOpacity,
                            zIndex: 90
                        }),
                        c = e("<div></div>").addClass(a.barClass).css({
                            background: a.color,
                            width: a.size,
                            position: "absolute",
                            top: 0,
                            opacity: a.opacity,
                            display: a.alwaysVisible ? "block" : "none",
                            "border-radius": a.borderRadius,
                            BorderRadius: a.borderRadius,
                            MozBorderRadius: a.borderRadius,
                            WebkitBorderRadius: a.borderRadius,
                            zIndex: 99
                        }),
                        h = "right" == a.position ? {
                            right: a.distance
                        } : {
                            left: a.distance
                        };
                    m.css(h);
                    c.css(h);
                    b.wrap(q);
                    b.parent().append(c);
                    b.parent().append(m);
                    a.railDraggable && c.bind("mousedown", function(a) {
                        var b = e(document);
                        z = !0;
                        t = parseFloat(c.css("top"));
                        pageY = a.pageY;
                        b.bind("mousemove.slimscroll", function(a) {
                            currTop = t + a.pageY - pageY;
                            c.css("top", currTop);
                            n(0, c.position().top, !1)
                        });
                        b.bind("mouseup.slimscroll", function(a) {
                            z = !1;
                            p();
                            b.unbind(".slimscroll")
                        });
                        return !1
                    }).bind("selectstart.slimscroll",
                        function(a) {
                            a.stopPropagation();
                            a.preventDefault();
                            return !1
                        });
                    m.hover(function() {
                        w()
                    }, function() {
                        p()
                    });
                    c.hover(function() {
                        y = !0
                    }, function() {
                        y = !1
                    });
                    b.hover(function() {
                        r = !0;
                        w();
                        p()
                    }, function() {
                        r = !1;
                        p()
                    });
                    b.bind("touchstart", function(a, b) {
                        a.originalEvent.touches.length && (A = a.originalEvent.touches[0].pageY)
                    });
                    b.bind("touchmove", function(b) {
                        k || b.originalEvent.preventDefault();
                        b.originalEvent.touches.length && (n((A - b.originalEvent.touches[0].pageY) / a.touchScrollStep, !0), A = b.originalEvent.touches[0].pageY)
                    });
                    x();
                    "bottom" === a.start ? (c.css({
                        top: b.outerHeight() - c.outerHeight()
                    }), n(0, !0)) : "top" !== a.start && (n(e(a.start).position().top, null, !0), a.alwaysVisible || c.hide());
                    window.addEventListener ? (this.addEventListener("DOMMouseScroll", v, !1), this.addEventListener("mousewheel", v, !1)) : document.attachEvent("onmousewheel", v)
                }
            });
            return this
        }
    });
    e.fn.extend({
        slimscroll: e.fn.slimScroll
    })
})(jQuery);
/**
 * fullPage 2.2.1
 * https://github.com/alvarotrigo/fullPage.js
 * MIT licensed
 *
 * Copyright (C) 2013 alvarotrigo.com - A project by Alvaro Trigo
 */
(function(a) {
    a.fn.fullpage = function(c) {
        function N() {
            a(".fp-section").each(function() {
                var b = a(this).find(".fp-slide");
                b.length ? b.each(function() {
                    A(a(this))
                }) : A(a(this))
            });
            a.isFunction(c.afterRender) && c.afterRender.call(this)
        }

        function O() {
            if (!c.autoScrolling) {
                var b = a(window).scrollTop(),
                    d = a(".fp-section").map(function() {
                        if (a(this).offset().top < b + 100) return a(this)
                    }),
                    d = d[d.length - 1];
                if (!d.hasClass("active")) {
                    var e = a(".fp-section.active").index(".fp-section") + 1;
                    G = !0;
                    var f = H(d);
                    d.addClass("active").siblings().removeClass("active");
                    var g = d.data("anchor");
                    a.isFunction(c.onLeave) && c.onLeave.call(this, e, d.index(".fp-section") + 1, f);
                    a.isFunction(c.afterLoad) && c.afterLoad.call(this, g, d.index(".fp-section") + 1);
                    I(g);
                    J(g, 0);
                    c.anchors.length && !t && (w = g, location.hash = g);
                    clearTimeout(P);
                    P = setTimeout(function() {
                        G = !1
                    }, 100)
                }
            }
        }

        function ga(b) {
            var d = b.originalEvent;
            c.autoScrolling && b.preventDefault();
            if (!Q(b.target) && (b = a(".fp-section.active"), !t && !q))
                if (d = R(d), y = d.y, B = d.x, b.find(".fp-slides").length && Math.abs(C - B) > Math.abs(z - y)) Math.abs(C - B) >
                    a(window).width() / 100 * c.touchSensitivity && (C > B ? a.fn.fullpage.moveSlideRight() : a.fn.fullpage.moveSlideLeft());
                else if (c.autoScrolling && (d = b.find(".fp-slides").length ? b.find(".fp-slide.active").find(".fp-scrollable") : b.find(".fp-scrollable"), Math.abs(z - y) > a(window).height() / 100 * c.touchSensitivity))
                if (z > y)
                    if (0 < d.length)
                        if (D("bottom", d)) a.fn.fullpage.moveSectionDown();
                        else return !0;
            else a.fn.fullpage.moveSectionDown();
            else if (y > z)
                if (0 < d.length)
                    if (D("top", d)) a.fn.fullpage.moveSectionUp();
                    else return !0;
            else a.fn.fullpage.moveSectionUp()
        }

        function Q(b, d) {
            d = d || 0;
            var e = a(b).parent();
            return d < c.normalScrollElementTouchThreshold && e.is(c.normalScrollElements) ? !0 : d == c.normalScrollElementTouchThreshold ? !1 : Q(e, ++d)
        }

        function ha(b) {
            b = R(b.originalEvent);
            z = b.y;
            C = b.x
        }

        function p(b) {
            if (c.autoScrolling) {
                b = window.event || b;
                b = Math.max(-1, Math.min(1, b.wheelDelta || -b.deltaY || -b.detail));
                var d;
                d = a(".fp-section.active");
                if (!t)
                    if (d = d.find(".fp-slides").length ? d.find(".fp-slide.active").find(".fp-scrollable") : d.find(".fp-scrollable"),
                        0 > b)
                        if (0 < d.length)
                            if (D("bottom", d)) a.fn.fullpage.moveSectionDown();
                            else return !0;
                else a.fn.fullpage.moveSectionDown();
                else if (0 < d.length)
                    if (D("top", d)) a.fn.fullpage.moveSectionUp();
                    else return !0;
                else a.fn.fullpage.moveSectionUp();
                return !1
            }
        }

        function S(b) {
            var d = a(".fp-section.active").find(".fp-slides");
            if (d.length && !q) {
                var e = d.find(".fp-slide.active"),
                    f = null,
                    f = "prev" === b ? e.prev(".fp-slide") : e.next(".fp-slide");
                if (!f.length) {
                    if (!c.loopHorizontal) return;
                    f = "prev" === b ? e.siblings(":last") : e.siblings(":first")
                }
                q = !0;
                k(d, f)
            }
        }

        function l(b, d, e) {
            var f = {},
                g = b.position();
            if ("undefined" !== typeof g) {
                var g = g.top,
                    m = H(b),
                    u = b.data("anchor"),
                    r = b.index(".fp-section"),
                    h = b.find(".fp-slide.active"),
                    s = a(".fp-section.active"),
                    q = s.index(".fp-section") + 1,
                    F = E;
                if (h.length) var n = h.data("anchor"),
                    p = h.index();
                if (c.autoScrolling && c.continuousVertical && "undefined" !== typeof e && (!e && "up" == m || e && "down" == m)) {
                    e ? a(".fp-section.active").before(s.nextAll(".fp-section")) : a(".fp-section.active").after(s.prevAll(".fp-section").get().reverse());
                    v(a(".fp-section.active").position().top);
                    var k = s,
                        g = b.position(),
                        g = g.top,
                        m = H(b)
                }
                b.addClass("active").siblings().removeClass("active");
                t = !0;
                "undefined" !== typeof u && T(p, n, u);
                c.autoScrolling ? (f.top = -g, b = "." + U) : (f.scrollTop = g, b = "html, body");
                var l = function() {
                    k && k.length && (e ? a(".fp-section:first").before(k) : a(".fp-section:last").after(k), v(a(".fp-section.active").position().top))
                };
                c.css3 && c.autoScrolling ? (a.isFunction(c.onLeave) && !F && c.onLeave.call(this, q, r + 1, m), V("translate3d(0px, -" + g + "px, 0px)", !0),
                    setTimeout(function() {
                        l();
                        a.isFunction(c.afterLoad) && !F && c.afterLoad.call(this, u, r + 1);
                        setTimeout(function() {
                            t = !1;
                            a.isFunction(d) && d.call(this)
                        }, W)
                    }, c.scrollingSpeed)) : (a.isFunction(c.onLeave) && !F && c.onLeave.call(this, q, r + 1, m), a(b).animate(f, c.scrollingSpeed, c.easing, function() {
                    l();
                    a.isFunction(c.afterLoad) && !F && c.afterLoad.call(this, u, r + 1);
                    setTimeout(function() {
                        t = !1;
                        a.isFunction(d) && d.call(this)
                    }, W)
                }));
                w = u;
                c.autoScrolling && (I(u), J(u, r))
            }
        }

        function X() {
            if (!G) {
                var b = window.location.hash.replace("#",
                        "").split("/"),
                    a = b[0],
                    b = b[1];
                if (a.length) {
                    var c = "undefined" === typeof w,
                        f = "undefined" === typeof w && "undefined" === typeof b && !q;
                    (a && a !== w && !c || f || !q && K != b) && L(a, b)
                }
            }
        }

        function k(b, d) {
            var e = d.position(),
                f = b.find(".fp-slidesContainer").parent(),
                g = d.index(),
                m = b.closest(".fp-section"),
                h = m.index(".fp-section"),
                r = m.data("anchor"),
                k = m.find(".fp-slidesNav"),
                s = d.data("anchor"),
                l = E;
            if (c.onSlideLeave) {
                var n = m.find(".fp-slide.active").index(),
                    p;
                p = n == g ? "none" : n > g ? "left" : "right";
                l || a.isFunction(c.onSlideLeave) && c.onSlideLeave.call(this,
                    r, h + 1, n, p)
            }
            d.addClass("active").siblings().removeClass("active");
            "undefined" === typeof s && (s = g);
            c.loopHorizontal || (m.find(".fp-controlArrow.fp-prev").toggle(0 != g), m.find(".fp-controlArrow.fp-next").toggle(!d.is(":last-child")));
            m.hasClass("active") && T(g, s, r);
            c.css3 ? (e = "translate3d(-" + e.left + "px, 0px, 0px)", b.find(".fp-slidesContainer").toggleClass("fp-easing", 0 < c.scrollingSpeed).css(Y(e)), setTimeout(function() {
                    l || a.isFunction(c.afterSlideLoad) && c.afterSlideLoad.call(this, r, h + 1, s, g);
                    q = !1
                }, c.scrollingSpeed,
                c.easing)) : f.animate({
                scrollLeft: e.left
            }, c.scrollingSpeed, c.easing, function() {
                l || a.isFunction(c.afterSlideLoad) && c.afterSlideLoad.call(this, r, h + 1, s, g);
                q = !1
            });
            k.find(".active").removeClass("active");
            k.find("li").eq(g).find("a").addClass("active")
        }

        function ia(b, d) {
            var c = 825,
                f = b;
            825 > b || 900 > d ? (900 > d && (f = d, c = 900), c = (100 * f / c).toFixed(2), a("body").css("font-size", c + "%")) : a("body").css("font-size", "100%")
        }

        function J(b, d) {
            c.navigation && (a("#fp-nav").find(".active").removeClass("active"), b ? a("#fp-nav").find('a[href="#' +
                b + '"]').addClass("active") : a("#fp-nav").find("li").eq(d).find("a").addClass("active"))
        }

        function I(b) {
            c.menu && (a(c.menu).find(".active").removeClass("active"), a(c.menu).find('[data-menuanchor="' + b + '"]').addClass("active"))
        }

        function D(b, a) {
            if ("top" === b) return !a.scrollTop();
            if ("bottom" === b) return a.scrollTop() + 1 + a.innerHeight() >= a[0].scrollHeight
        }

        function H(b) {
            var c = a(".fp-section.active").index(".fp-section");
            b = b.index(".fp-section");
            return c > b ? "up" : "down"
        }

        function A(b) {
            b.css("overflow", "hidden");
            var a =
                b.closest(".fp-section"),
                e = b.find(".fp-scrollable");
            if (e.length) var f = e.get(0).scrollHeight;
            else f = b.get(0).scrollHeight, c.verticalCentered && (f = b.find(".fp-tableCell").get(0).scrollHeight);
            a = n - parseInt(a.css("padding-bottom")) - parseInt(a.css("padding-top"));
            f > a ? e.length ? e.css("height", a + "px").parent().css("height", a + "px") : (c.verticalCentered ? b.find(".fp-tableCell").wrapInner('<div class="fp-scrollable" />') : b.wrapInner('<div class="fp-scrollable" />'), b.find(".fp-scrollable").slimScroll({
                allowPageScroll: !0,
                height: a + "px",
                size: "10px",
                alwaysVisible: !0
            })) : Z(b);
            b.css("overflow", "")
        }

        function Z(a) {
            a.find(".fp-scrollable").children().first().unwrap().unwrap();
            a.find(".slimScrollBar").remove();
            a.find(".slimScrollRail").remove()
        }

        function $(a) {
            a.addClass("fp-table").wrapInner('<div class="fp-tableCell" style="height:' + aa(a) + 'px;" />')
        }

        function aa(a) {
            var d = n;
            if (c.paddingTop || c.paddingBottom) d = a, d.hasClass("fp-section") || (d = a.closest(".fp-section")), a = parseInt(d.css("padding-top")) + parseInt(d.css("padding-bottom")),
                d = n - a;
            return d
        }

        function V(a, c) {
            h.toggleClass("fp-easing", c);
            h.css(Y(a))
        }

        function L(b, c) {
            "undefined" === typeof c && (c = 0);
            var e = isNaN(b) ? a('[data-anchor="' + b + '"]') : a(".fp-section").eq(b - 1);
            b === w || e.hasClass("active") ? ba(e, c) : l(e, function() {
                ba(e, c)
            })
        }

        function ba(a, c) {
            if ("undefined" != typeof c) {
                var e = a.find(".fp-slides"),
                    f = e.find('[data-anchor="' + c + '"]');
                f.length || (f = e.find(".fp-slide").eq(c));
                f.length && k(e, f)
            }
        }

        function ja(a, d) {
            a.append('<div class="fp-slidesNav"><ul></ul></div>');
            var e = a.find(".fp-slidesNav");
            e.addClass(c.slidesNavPosition);
            for (var f = 0; f < d; f++) e.find("ul").append('<li><a href="#"><span></span></a></li>');
            e.css("margin-left", "-" + e.width() / 2 + "px");
            e.find("li").first().find("a").addClass("active")
        }

        function T(a, d, e) {
            var f = "";
            c.anchors.length && (a ? ("undefined" !== typeof e && (f = e), "undefined" === typeof d && (d = a), K = d, location.hash = f + "/" + d) : ("undefined" !== typeof a && (K = d), location.hash = e))
        }

        function ka() {
            var a = document.createElement("p"),
                c, e = {
                    webkitTransform: "-webkit-transform",
                    OTransform: "-o-transform",
                    msTransform: "-ms-transform",
                    MozTransform: "-moz-transform",
                    transform: "transform"
                };
            document.body.insertBefore(a, null);
            for (var f in e) void 0 !== a.style[f] && (a.style[f] = "translate3d(1px,1px,1px)", c = window.getComputedStyle(a).getPropertyValue(e[f]));
            document.body.removeChild(a);
            return void 0 !== c && 0 < c.length && "none" !== c
        }

        function ca() {
            return window.PointerEvent ? {
                down: "pointerdown",
                move: "pointermove"
            } : {
                down: "MSPointerDown",
                move: "MSPointerMove"
            }
        }

        function R(a) {
            var c = [];
            window.navigator.msPointerEnabled ? (c.y =
                a.pageY, c.x = a.pageX) : (c.y = a.touches[0].pageY, c.x = a.touches[0].pageX);
            return c
        }

        function da(b) {
            var d = c.scrollingSpeed;
            a.fn.fullpage.setScrollingSpeed(0);
            k(b.closest(".fp-slides"), b);
            a.fn.fullpage.setScrollingSpeed(d)
        }

        function v(a) {
            c.css3 ? V("translate3d(0px, -" + a + "px, 0px)", !1) : h.css("top", -a)
        }

        function Y(a) {
            return {
                "-webkit-transform": a,
                "-moz-transform": a,
                "-ms-transform": a,
                transform: a
            }
        }

        function la() {
            v(0);
            a("#fp-nav, .fp-slidesNav, .fp-controlArrow").remove();
            a(".fp-section").css({
                height: "",
                "background-color": "",
                padding: ""
            });
            a(".fp-slide").css({
                width: ""
            });
            h.css({
                height: "",
                position: "",
                "-ms-touch-action": ""
            });
            a(".fp-section, .fp-slide").each(function() {
                Z(a(this));
                a(this).removeClass("fp-table active")
            });
            h.find(".fp-easing").removeClass("fp-easing");
            h.find(".fp-tableCell, .fp-slidesContainer, .fp-slides").each(function() {
                a(this).replaceWith(this.childNodes)
            });
            a("html, body").scrollTop(0);
            h.addClass("fullpage-used")
        }
        c = a.extend({
            verticalCentered: !0,
            resize: !0,
            sectionsColor: [],
            anchors: [],
            scrollingSpeed: 700,
            easing: "easeInQuart",
            menu: !1,
            navigation: !1,
            navigationPosition: "right",
            navigationColor: "#000",
            navigationTooltips: [],
            slidesNavigation: !1,
            slidesNavPosition: "bottom",
            controlArrowColor: "#fff",
            loopBottom: !1,
            loopTop: !1,
            loopHorizontal: !0,
            autoScrolling: !0,
            scrollOverflow: !1,
            css3: !1,
            paddingTop: 0,
            paddingBottom: 0,
            fixedElements: null,
            normalScrollElements: null,
            keyboardScrolling: !0,
            touchSensitivity: 5,
            continuousVertical: !1,
            animateAnchor: !0,
            normalScrollElementTouchThreshold: 5,
            sectionSelector: ".section",
            slideSelector: ".slide",
            afterLoad: null,
            onLeave: null,
            afterRender: null,
            afterResize: null,
            afterSlideLoad: null,
            onSlideLeave: null
        }, c);
        c.continuousVertical && (c.loopTop || c.loopBottom) && (c.continuousVertical = !1, console && console.log && console.log("Option loopTop/loopBottom is mutually exclusive with continuousVertical; continuousVertical disabled"));
        var W = 600;
        a.fn.fullpage.setAutoScrolling = function(b) {
            c.autoScrolling = b;
            b = a(".fp-section.active");
            c.autoScrolling ? (a("html, body").css({
                    overflow: "hidden",
                    height: "100%"
                }), b.length && v(b.position().top)) :
                (a("html, body").css({
                    overflow: "auto",
                    height: "auto"
                }), v(0), a("html, body").scrollTop(b.position().top))
        };
        a.fn.fullpage.setScrollingSpeed = function(a) {
            c.scrollingSpeed = a
        };
        a.fn.fullpage.setMouseWheelScrolling = function(a) {
            a ? document.addEventListener ? (document.addEventListener("mousewheel", p, {
                passive: false
            }), document.addEventListener("wheel", p, {
                passive: false
            })) : document.attachEvent("onmousewheel", p) : document.addEventListener ? (document.removeEventListener("mousewheel", p, {
                passive: false
            }), document.removeEventListener("wheel", p, !1)) : document.detachEvent("onmousewheel",
                p)
        };
        a.fn.fullpage.setAllowScrolling = function(b) {
            if (b) {
                if (a.fn.fullpage.setMouseWheelScrolling(!0), M || ea) MSPointer = ca(), a(document).off("touchstart " + MSPointer.down).on("touchstart " + MSPointer.down, ha), a(document).off("touchmove " + MSPointer.move).on("touchmove " + MSPointer.move, ga)
            } else if (a.fn.fullpage.setMouseWheelScrolling(!1), M || ea) MSPointer = ca(), a(document).off("touchstart " + MSPointer.down), a(document).off("touchmove " + MSPointer.move)
        };
        a.fn.fullpage.setKeyboardScrolling = function(a) {
            c.keyboardScrolling =
                a
        };
        var q = !1,
            M = navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|BB10|Windows Phone|Tizen|Bada)/),
            ea = "ontouchstart" in window || 0 < navigator.msMaxTouchPoints,
            h = a(this),
            n = a(window).height(),
            t = !1,
            E = !1,
            w, K, U = "fullpage-wrapper";
        a.fn.fullpage.setAllowScrolling(!0);
        c.css3 && (c.css3 = ka());
        a(this).length ? (h.css({
            height: "100%",
            position: "relative",
            "-ms-touch-action": "none"
        }), h.addClass(U)) : console.error("Error! Fullpage.js needs to be initialized with a selector. For example: $('#myContainer').fullpage();");
        a(c.sectionSelector).each(function() {
            a(this).addClass("fp-section")
        });
        a(c.slideSelector).each(function() {
            a(this).addClass("fp-slide")
        });
        if (c.navigation) {
            a("body").append('<div id="fp-nav"><ul></ul></div>');
            var x = a("#fp-nav");
            x.css("color", c.navigationColor);
            x.addClass(c.navigationPosition)
        }
        a(".fp-section").each(function(b) {
            var d = a(this),
                e = a(this).find(".fp-slide"),
                f = e.length;
            b || 0 !== a(".fp-section.active").length || a(this).addClass("active");
            a(this).css("height", n + "px");
            (c.paddingTop || c.paddingBottom) &&
            a(this).css("padding", c.paddingTop + " 0 " + c.paddingBottom + " 0");
            "undefined" !== typeof c.sectionsColor[b] && a(this).css("background-color", c.sectionsColor[b]);
            "undefined" !== typeof c.anchors[b] && a(this).attr("data-anchor", c.anchors[b]);
            if (c.navigation) {
                var g = "";
                c.anchors.length && (g = c.anchors[b]);
                b = c.navigationTooltips[b];
                "undefined" === typeof b && (b = "");
                x.find("ul").append('<li data-tooltip="' + b + '"><a href="#' + g + '"><span></span></a></li>')
            }
            if (1 < f) {
                var g = 100 * f,
                    h = 100 / f;
                e.wrapAll('<div class="fp-slidesContainer" />');
                e.parent().wrap('<div class="fp-slides" />');
                a(this).find(".fp-slidesContainer").css("width", g + "%");
                a(this).find(".fp-slides").after('<div class="fp-controlArrow fp-prev"></div><div class="fp-controlArrow fp-next"></div>');
                "#fff" != c.controlArrowColor && (a(this).find(".fp-controlArrow.fp-next").css("border-color", "transparent transparent transparent " + c.controlArrowColor), a(this).find(".fp-controlArrow.fp-prev").css("border-color", "transparent " + c.controlArrowColor + " transparent transparent"));
                c.loopHorizontal ||
                    a(this).find(".fp-controlArrow.fp-prev").hide();
                c.slidesNavigation && ja(a(this), f);
                e.each(function(b) {
                    var e = d.find(".fp-slide.active");
                    b || 0 != e.length ? da(e) : a(this).addClass("active");
                    a(this).css("width", h + "%");
                    c.verticalCentered && $(a(this))
                })
            } else c.verticalCentered && $(a(this))
        }).promise().done(function() {
            a.fn.fullpage.setAutoScrolling(c.autoScrolling);
            var b = a(".fp-section.active").find(".fp-slide.active");
            b.length && (0 != a(".fp-section.active").index(".fp-section") || 0 == a(".fp-section.active").index(".fp-section") &&
                0 != b.index()) && da(b);
            c.fixedElements && c.css3 && a(c.fixedElements).appendTo("body");
            c.navigation && (x.css("margin-top", "-" + x.height() / 2 + "px"), x.find("li").eq(a(".fp-section.active").index(".fp-section")).find("a").addClass("active"));
            c.menu && c.css3 && a(c.menu).closest(".fullpage-wrapper").length && a(c.menu).appendTo("body");
            c.scrollOverflow ? (h.hasClass("fullpage-used") && N(), a(window).on("load", N)) : a.isFunction(c.afterRender) && c.afterRender.call(this);
            b = window.location.hash.replace("#", "").split("/")[0];
            if (b.length) {
                var d = a('[data-anchor="' + b + '"]');
                !c.animateAnchor && d.length && (c.autoScrolling ? v(d.position().top) : (v(0), a("html, body").scrollTop(d.position().top)), I(b), J(b, null), a.isFunction(c.afterLoad) && c.afterLoad.call(this, b, d.index(".fp-section") + 1), d.addClass("active").siblings().removeClass("active"))
            }
            a(window).on("load", function() {
                var a = window.location.hash.replace("#", "").split("/"),
                    b = a[0],
                    a = a[1];
                b && L(b, a)
            })
        });
        var P, G = !1;
        a(window).on("scroll", O);
        var z = 0,
            C = 0,
            y = 0,
            B = 0;
        a.fn.fullpage.moveSectionUp =
            function() {
                var b = a(".fp-section.active").prev(".fp-section");
                b.length || !c.loopTop && !c.continuousVertical || (b = a(".fp-section").last());
                b.length && l(b, null, !0)
            };
        a.fn.fullpage.moveSectionDown = function() {
            var b = a(".fp-section.active").next(".fp-section");
            b.length || !c.loopBottom && !c.continuousVertical || (b = a(".fp-section").first());
            (0 < b.length || !b.length && (c.loopBottom || c.continuousVertical)) && l(b, null, !1)
        };
        a.fn.fullpage.moveTo = function(b, c) {
            var e = "",
                e = isNaN(b) ? a('[data-anchor="' + b + '"]') : a(".fp-section").eq(b -
                    1);
            "undefined" !== typeof c ? L(b, c) : 0 < e.length && l(e)
        };
        a.fn.fullpage.moveSlideRight = function() {
            S("next")
        };
        a.fn.fullpage.moveSlideLeft = function() {
            S("prev")
        };
        a(window).on("hashchange", X);
        a(document).keydown(function(b) {
            if (c.keyboardScrolling && !t) switch (b.which) {
                case 38:
                case 33:
                    a.fn.fullpage.moveSectionUp();
                    break;
                case 40:
                case 34:
                    a.fn.fullpage.moveSectionDown();
                    break;
                case 36:
                    a.fn.fullpage.moveTo(1);
                    break;
                case 35:
                    a.fn.fullpage.moveTo(a(".fp-section").length);
                    break;
                case 37:
                    a.fn.fullpage.moveSlideLeft();
                    break;
                case 39:
                    a.fn.fullpage.moveSlideRight()
            }
        });
        a(document).on("click", "#fp-nav a", function(b) {
            b.preventDefault();
            b = a(this).parent().index();
            l(a(".fp-section").eq(b))
        });
        a(document).on({
            mouseenter: function() {
                var b = a(this).data("tooltip");
                a('<div class="fp-tooltip ' + c.navigationPosition + '">' + b + "</div>").hide().appendTo(a(this)).fadeIn(200)
            },
            mouseleave: function() {
                a(this).find(".fp-tooltip").fadeOut().remove()
            }
        }, "#fp-nav li");
        c.normalScrollElements && (a(document).on("mouseenter", c.normalScrollElements, function() {
                a.fn.fullpage.setMouseWheelScrolling(!1)
            }),
            a(document).on("mouseleave", c.normalScrollElements, function() {
                a.fn.fullpage.setMouseWheelScrolling(!0)
            }));
        a(".fp-section").on("click", ".fp-controlArrow", function() {
            a(this).hasClass("fp-prev") ? a.fn.fullpage.moveSlideLeft() : a.fn.fullpage.moveSlideRight()
        });
        a(".fp-section").on("click", ".toSlide", function(b) {
            b.preventDefault();
            b = a(this).closest(".fp-section").find(".fp-slides");
            b.find(".fp-slide.active");
            var c = null,
                c = b.find(".fp-slide").eq(a(this).data("index") - 1);
            0 < c.length && k(b, c)
        });
        var fa;
        a(window).resize(function() {
            M ?
                a.fn.fullpage.reBuild() : (clearTimeout(fa), fa = setTimeout(a.fn.fullpage.reBuild, 500))
        });
        a.fn.fullpage.reBuild = function() {
            E = !0;
            var b = a(window).width();
            n = a(window).height();
            c.resize && ia(n, b);
            a(".fp-section").each(function() {
                parseInt(a(this).css("padding-bottom"));
                parseInt(a(this).css("padding-top"));
                c.verticalCentered && a(this).find(".fp-tableCell").css("height", aa(a(this)) + "px");
                a(this).css("height", n + "px");
                if (c.scrollOverflow) {
                    var b = a(this).find(".fp-slide");
                    b.length ? b.each(function() {
                        A(a(this))
                    }) : A(a(this))
                }
                b =
                    a(this).find(".fp-slides");
                b.length && k(b, b.find(".fp-slide.active"))
            });
            a(".fp-section.active").position();
            b = a(".fp-section.active");
            b.index(".fp-section") && l(b);
            E = !1;
            a.isFunction(c.afterResize) && c.afterResize.call(this)
        };
        a(document).on("click", ".fp-slidesNav a", function(b) {
            b.preventDefault();
            b = a(this).closest(".fp-section").find(".fp-slides");
            var c = b.find(".fp-slide").eq(a(this).closest("li").index());
            k(b, c)
        });
        a.fn.fullpage.destroy = function(b) {
            a.fn.fullpage.setAutoScrolling(!1);
            a.fn.fullpage.setAllowScrolling(!1);
            a.fn.fullpage.setKeyboardScrolling(!1);
            a(window).off("scroll", O).off("hashchange", X);
            a(document).off("click", "#fp-nav a").off("mouseenter", "#fp-nav li").off("mouseleave", "#fp-nav li").off("click", ".fp-slidesNav a").off("mouseover", c.normalScrollElements).off("mouseout", c.normalScrollElements);
            a(".fp-section").off("click", ".fp-controlArrow").off("click", ".toSlide");
            b && la()
        }
    }
})(jQuery);;
/*! Copyright (c) 2011 Brandon Aaron (http://brandonaaron.net)
 * Licensed under the MIT License (LICENSE.txt).
 *
 * Thanks to: http://adomas.org/javascript-mouse-wheel/ for some pointers.
 * Thanks to: Mathias Bank(http://www.mathias-bank.de) for a scope bug fix.
 * Thanks to: Seamus Leahy for adding deltaX and deltaY
 *
 * Version: 3.0.6
 * 
 * Requires: 1.2.2+
 */
(function(a) {
    function d(b) {
        var c = b || window.event,
            d = [].slice.call(arguments, 1),
            e = 0,
            f = !0,
            g = 0,
            h = 0;
        return b = a.event.fix(c), b.type = "mousewheel", c.wheelDelta && (e = c.wheelDelta / 120), c.detail && (e = -c.detail / 3), h = e, c.axis !== undefined && c.axis === c.HORIZONTAL_AXIS && (h = 0, g = -1 * e), c.wheelDeltaY !== undefined && (h = c.wheelDeltaY / 120), c.wheelDeltaX !== undefined && (g = -1 * c.wheelDeltaX / 120), d.unshift(b, e, g, h), (a.event.dispatch || a.event.handle).apply(this, d)
    }
    var b = ["DOMMouseScroll", "mousewheel"];
    if (a.event.fixHooks)
        for (var c = b.length; c;) a.event.fixHooks[b[--c]] = a.event.mouseHooks;
    a.event.special.mousewheel = {
        setup: function() {
            if (this.addEventListener)
                for (var a = b.length; a;) this.addEventListener(b[--a], d, !1);
            else this.onmousewheel = d
        },
        teardown: function() {
            if (this.removeEventListener)
                for (var a = b.length; a;) this.removeEventListener(b[--a], d, !1);
            else this.onmousewheel = null
        }
    }, a.fn.extend({
        mousewheel: function(a) {
            return a ? this.bind("mousewheel", a) : this.trigger("mousewheel")
        },
        unmousewheel: function(a) {
            return this.unbind("mousewheel", a)
        }
    })
})(jQuery)

;
/*
 * @fileOverview TouchSwipe - jQuery Plugin
 * @version 1.6.6
 *
 * @author Matt Bryson http://www.github.com/mattbryson
 * @see https://github.com/mattbryson/TouchSwipe-Jquery-Plugin
 * @see http://labs.skinkers.com/touchSwipe/
 * @see http://plugins.jquery.com/project/touchSwipe
 *
 * Copyright (c) 2010 Matt Bryson
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 */

(function(a) {
    if (typeof define === "function" && define.amd && define.amd.jQuery) {
        define(["jquery"], a)
    } else {
        a(jQuery)
    }
}(function(f) {
    var p = "left",
        o = "right",
        e = "up",
        x = "down",
        c = "in",
        z = "out",
        m = "none",
        s = "auto",
        l = "swipe",
        t = "pinch",
        A = "tap",
        j = "doubletap",
        b = "longtap",
        y = "hold",
        D = "horizontal",
        u = "vertical",
        i = "all",
        r = 10,
        g = "start",
        k = "move",
        h = "end",
        q = "cancel",
        a = "ontouchstart" in window,
        v = window.navigator.msPointerEnabled && !window.navigator.pointerEnabled,
        d = window.navigator.pointerEnabled || window.navigator.msPointerEnabled,
        B = "TouchSwipe";
    var n = {
        fingers: 1,
        threshold: 75,
        cancelThreshold: null,
        pinchThreshold: 20,
        maxTimeThreshold: null,
        fingerReleaseThreshold: 250,
        longTapThreshold: 500,
        doubleTapThreshold: 200,
        swipe: null,
        swipeLeft: null,
        swipeRight: null,
        swipeUp: null,
        swipeDown: null,
        swipeStatus: null,
        pinchIn: null,
        pinchOut: null,
        pinchStatus: null,
        click: null,
        tap: null,
        doubleTap: null,
        longTap: null,
        hold: null,
        triggerOnTouchEnd: true,
        triggerOnTouchLeave: false,
        allowPageScroll: "auto",
        fallbackToMouseEvents: true,
        excludedElements: "label, button, input, select, textarea, a, .noSwipe"
    };
    f.fn.swipe = function(G) {
        var F = f(this),
            E = F.data(B);
        if (E && typeof G === "string") {
            if (E[G]) {
                return E[G].apply(this, Array.prototype.slice.call(arguments, 1))
            } else {
                f.error("Method " + G + " does not exist on jQuery.swipe")
            }
        } else {
            if (!E && (typeof G === "object" || !G)) {
                return w.apply(this, arguments)
            }
        }
        return F
    };
    f.fn.swipe.defaults = n;
    f.fn.swipe.phases = {
        PHASE_START: g,
        PHASE_MOVE: k,
        PHASE_END: h,
        PHASE_CANCEL: q
    };
    f.fn.swipe.directions = {
        LEFT: p,
        RIGHT: o,
        UP: e,
        DOWN: x,
        IN: c,
        OUT: z
    };
    f.fn.swipe.pageScroll = {
        NONE: m,
        HORIZONTAL: D,
        VERTICAL: u,
        AUTO: s
    };
    f.fn.swipe.fingers = {
        ONE: 1,
        TWO: 2,
        THREE: 3,
        ALL: i
    };

    function w(E) {
        if (E && (E.allowPageScroll === undefined && (E.swipe !== undefined || E.swipeStatus !== undefined))) {
            E.allowPageScroll = m
        }
        if (E.click !== undefined && E.tap === undefined) {
            E.tap = E.click
        }
        if (!E) {
            E = {}
        }
        E = f.extend({}, f.fn.swipe.defaults, E);
        return this.each(function() {
            var G = f(this);
            var F = G.data(B);
            if (!F) {
                F = new C(this, E);
                G.data(B, F)
            }
        })
    }

    function C(a4, av) {
        var az = (a || d || !av.fallbackToMouseEvents),
            J = az ? (d ? (v ? "MSPointerDown" : "pointerdown") : "touchstart") : "mousedown",
            ay = az ? (d ? (v ? "MSPointerMove" : "pointermove") : "touchmove") : "mousemove",
            U = az ? (d ? (v ? "MSPointerUp" : "pointerup") : "touchend") : "mouseup",
            S = az ? null : "mouseleave",
            aD = (d ? (v ? "MSPointerCancel" : "pointercancel") : "touchcancel");
        var ag = 0,
            aP = null,
            ab = 0,
            a1 = 0,
            aZ = 0,
            G = 1,
            aq = 0,
            aJ = 0,
            M = null;
        var aR = f(a4);
        var Z = "start";
        var W = 0;
        var aQ = null;
        var T = 0,
            a2 = 0,
            a5 = 0,
            ad = 0,
            N = 0;
        var aW = null,
            af = null;
        try {
            aR.bind(J, aN);
            aR.bind(aD, a9)
        } catch (ak) {
            f.error("events not supported " + J + "," + aD + " on jQuery.swipe")
        }
        this.enable = function() {
            aR.bind(J, aN);
            aR.bind(aD, a9);
            return aR
        };
        this.disable = function() {
            aK();
            return aR
        };
        this.destroy = function() {
            aK();
            aR.data(B, null);
            return aR
        };
        this.option = function(bc, bb) {
            if (av[bc] !== undefined) {
                if (bb === undefined) {
                    return av[bc]
                } else {
                    av[bc] = bb
                }
            } else {
                f.error("Option " + bc + " does not exist on jQuery.swipe.options")
            }
            return null
        };

        function aN(bd) {
            if (aB()) {
                return
            }
            if (f(bd.target).closest(av.excludedElements, aR).length > 0) {
                return
            }
            var be = bd.originalEvent ? bd.originalEvent : bd;
            var bc, bb = a ? be.touches[0] : be;
            Z = g;
            if (a) {
                W = be.touches.length
            } else {
                bd.preventDefault()
            }
            ag = 0;
            aP = null;
            aJ = null;
            ab = 0;
            a1 = 0;
            aZ = 0;
            G = 1;
            aq = 0;
            aQ = aj();
            M = aa();
            R();
            if (!a || (W === av.fingers || av.fingers === i) || aX()) {
                ai(0, bb);
                T = at();
                if (W == 2) {
                    ai(1, be.touches[1]);
                    a1 = aZ = au(aQ[0].start, aQ[1].start)
                }
                if (av.swipeStatus || av.pinchStatus) {
                    bc = O(be, Z)
                }
            } else {
                bc = false
            }
            if (bc === false) {
                Z = q;
                O(be, Z);
                return bc
            } else {
                if (av.hold) {
                    af = setTimeout(f.proxy(function() {
                        aR.trigger("hold", [be.target]);
                        if (av.hold) {
                            bc = av.hold.call(aR, be, be.target)
                        }
                    }, this), av.longTapThreshold)
                }
                ao(true)
            }
            return null
        }

        function a3(be) {
            var bh = be.originalEvent ? be.originalEvent : be;
            if (Z === h || Z === q || am()) {
                return
            }
            var bd, bc = a ? bh.touches[0] : bh;
            var bf = aH(bc);
            a2 = at();
            if (a) {
                W = bh.touches.length
            }
            if (av.hold) {
                clearTimeout(af)
            }
            Z = k;
            if (W == 2) {
                if (a1 == 0) {
                    ai(1, bh.touches[1]);
                    a1 = aZ = au(aQ[0].start, aQ[1].start)
                } else {
                    aH(bh.touches[1]);
                    aZ = au(aQ[0].end, aQ[1].end);
                    aJ = ar(aQ[0].end, aQ[1].end)
                }
                G = a7(a1, aZ);
                aq = Math.abs(a1 - aZ)
            }
            if ((W === av.fingers || av.fingers === i) || !a || aX()) {
                aP = aL(bf.start, bf.end);
                al(be, aP);
                ag = aS(bf.start, bf.end);
                ab = aM();
                aI(aP, ag);
                if (av.swipeStatus || av.pinchStatus) {
                    bd = O(bh, Z)
                }
                if (!av.triggerOnTouchEnd || av.triggerOnTouchLeave) {
                    var bb = true;
                    if (av.triggerOnTouchLeave) {
                        var bg = aY(this);
                        bb = E(bf.end, bg)
                    }
                    if (!av.triggerOnTouchEnd && bb) {
                        Z = aC(k)
                    } else {
                        if (av.triggerOnTouchLeave && !bb) {
                            Z = aC(h)
                        }
                    }
                    if (Z == q || Z == h) {
                        O(bh, Z)
                    }
                }
            } else {
                Z = q;
                O(bh, Z)
            }
            if (bd === false) {
                Z = q;
                O(bh, Z)
            }
        }

        function L(bb) {
            var bc = bb.originalEvent;
            if (a) {
                if (bc.touches.length > 0) {
                    F();
                    return true
                }
            }
            if (am()) {
                W = ad
            }
            a2 = at();
            ab = aM();
            if (ba() || !an()) {
                Z = q;
                O(bc, Z)
            } else {
                if (av.triggerOnTouchEnd || (av.triggerOnTouchEnd == false && Z === k)) {
                    bb.preventDefault();
                    Z = h;
                    O(bc, Z)
                } else {
                    if (!av.triggerOnTouchEnd && a6()) {
                        Z = h;
                        aF(bc, Z, A)
                    } else {
                        if (Z === k) {
                            Z = q;
                            O(bc, Z)
                        }
                    }
                }
            }
            ao(false);
            return null
        }

        function a9() {
            W = 0;
            a2 = 0;
            T = 0;
            a1 = 0;
            aZ = 0;
            G = 1;
            R();
            ao(false)
        }

        function K(bb) {
            var bc = bb.originalEvent;
            if (av.triggerOnTouchLeave) {
                Z = aC(h);
                O(bc, Z)
            }
        }

        function aK() {
            aR.unbind(J, aN);
            aR.unbind(aD, a9);
            aR.unbind(ay, a3);
            aR.unbind(U, L);
            if (S) {
                aR.unbind(S, K)
            }
            ao(false)
        }

        function aC(bf) {
            var be = bf;
            var bd = aA();
            var bc = an();
            var bb = ba();
            if (!bd || bb) {
                be = q
            } else {
                if (bc && bf == k && (!av.triggerOnTouchEnd || av.triggerOnTouchLeave)) {
                    be = h
                } else {
                    if (!bc && bf == h && av.triggerOnTouchLeave) {
                        be = q
                    }
                }
            }
            return be
        }

        function O(bd, bb) {
            var bc = undefined;
            if (I() || V()) {
                bc = aF(bd, bb, l)
            } else {
                if ((P() || aX()) && bc !== false) {
                    bc = aF(bd, bb, t)
                }
            }
            if (aG() && bc !== false) {
                bc = aF(bd, bb, j)
            } else {
                if (ap() && bc !== false) {
                    bc = aF(bd, bb, b)
                } else {
                    if (ah() && bc !== false) {
                        bc = aF(bd, bb, A)
                    }
                }
            }
            if (bb === q) {
                a9(bd)
            }
            if (bb === h) {
                if (a) {
                    if (bd.touches.length == 0) {
                        a9(bd)
                    }
                } else {
                    a9(bd)
                }
            }
            return bc
        }

        function aF(be, bb, bd) {
            var bc = undefined;
            if (bd == l) {
                aR.trigger("swipeStatus", [bb, aP || null, ag || 0, ab || 0, W, aQ]);
                if (av.swipeStatus) {
                    bc = av.swipeStatus.call(aR, be, bb, aP || null, ag || 0, ab || 0, W, aQ);
                    if (bc === false) {
                        return false
                    }
                }
                if (bb == h && aV()) {
                    aR.trigger("swipe", [aP, ag, ab, W, aQ]);
                    if (av.swipe) {
                        bc = av.swipe.call(aR, be, aP, ag, ab, W, aQ);
                        if (bc === false) {
                            return false
                        }
                    }
                    switch (aP) {
                        case p:
                            aR.trigger("swipeLeft", [aP, ag, ab, W, aQ]);
                            if (av.swipeLeft) {
                                bc = av.swipeLeft.call(aR, be, aP, ag, ab, W, aQ)
                            }
                            break;
                        case o:
                            aR.trigger("swipeRight", [aP, ag, ab, W, aQ]);
                            if (av.swipeRight) {
                                bc = av.swipeRight.call(aR, be, aP, ag, ab, W, aQ)
                            }
                            break;
                        case e:
                            aR.trigger("swipeUp", [aP, ag, ab, W, aQ]);
                            if (av.swipeUp) {
                                bc = av.swipeUp.call(aR, be, aP, ag, ab, W, aQ)
                            }
                            break;
                        case x:
                            aR.trigger("swipeDown", [aP, ag, ab, W, aQ]);
                            if (av.swipeDown) {
                                bc = av.swipeDown.call(aR, be, aP, ag, ab, W, aQ)
                            }
                            break
                    }
                }
            }
            if (bd == t) {
                aR.trigger("pinchStatus", [bb, aJ || null, aq || 0, ab || 0, W, G, aQ]);
                if (av.pinchStatus) {
                    bc = av.pinchStatus.call(aR, be, bb, aJ || null, aq || 0, ab || 0, W, G, aQ);
                    if (bc === false) {
                        return false
                    }
                }
                if (bb == h && a8()) {
                    switch (aJ) {
                        case c:
                            aR.trigger("pinchIn", [aJ || null, aq || 0, ab || 0, W, G, aQ]);
                            if (av.pinchIn) {
                                bc = av.pinchIn.call(aR, be, aJ || null, aq || 0, ab || 0, W, G, aQ)
                            }
                            break;
                        case z:
                            aR.trigger("pinchOut", [aJ || null, aq || 0, ab || 0, W, G, aQ]);
                            if (av.pinchOut) {
                                bc = av.pinchOut.call(aR, be, aJ || null, aq || 0, ab || 0, W, G, aQ)
                            }
                            break
                    }
                }
            }
            if (bd == A) {
                if (bb === q || bb === h) {
                    clearTimeout(aW);
                    clearTimeout(af);
                    if (Y() && !H()) {
                        N = at();
                        aW = setTimeout(f.proxy(function() {
                            N = null;
                            aR.trigger("tap", [be.target]);
                            if (av.tap) {
                                bc = av.tap.call(aR, be, be.target)
                            }
                        }, this), av.doubleTapThreshold)
                    } else {
                        N = null;
                        aR.trigger("tap", [be.target]);
                        if (av.tap) {
                            bc = av.tap.call(aR, be, be.target)
                        }
                    }
                }
            } else {
                if (bd == j) {
                    if (bb === q || bb === h) {
                        clearTimeout(aW);
                        N = null;
                        aR.trigger("doubletap", [be.target]);
                        if (av.doubleTap) {
                            bc = av.doubleTap.call(aR, be, be.target)
                        }
                    }
                } else {
                    if (bd == b) {
                        if (bb === q || bb === h) {
                            clearTimeout(aW);
                            N = null;
                            aR.trigger("longtap", [be.target]);
                            if (av.longTap) {
                                bc = av.longTap.call(aR, be, be.target)
                            }
                        }
                    }
                }
            }
            return bc
        }

        function an() {
            var bb = true;
            if (av.threshold !== null) {
                bb = ag >= av.threshold
            }
            return bb
        }

        function ba() {
            var bb = false;
            if (av.cancelThreshold !== null && aP !== null) {
                bb = (aT(aP) - ag) >= av.cancelThreshold
            }
            return bb
        }

        function ae() {
            if (av.pinchThreshold !== null) {
                return aq >= av.pinchThreshold
            }
            return true
        }

        function aA() {
            var bb;
            if (av.maxTimeThreshold) {
                if (ab >= av.maxTimeThreshold) {
                    bb = false
                } else {
                    bb = true
                }
            } else {
                bb = true
            }
            return bb
        }

        function al(bb, bc) {
            if (av.allowPageScroll === m || aX()) {
                bb.preventDefault()
            } else {
                var bd = av.allowPageScroll === s;
                switch (bc) {
                    case p:
                        if ((av.swipeLeft && bd) || (!bd && av.allowPageScroll != D)) {
                            bb.preventDefault()
                        }
                        break;
                    case o:
                        if ((av.swipeRight && bd) || (!bd && av.allowPageScroll != D)) {
                            bb.preventDefault()
                        }
                        break;
                    case e:
                        if ((av.swipeUp && bd) || (!bd && av.allowPageScroll != u)) {
                            bb.preventDefault()
                        }
                        break;
                    case x:
                        if ((av.swipeDown && bd) || (!bd && av.allowPageScroll != u)) {
                            bb.preventDefault()
                        }
                        break
                }
            }
        }

        function a8() {
            var bc = aO();
            var bb = X();
            var bd = ae();
            return bc && bb && bd
        }

        function aX() {
            return !!(av.pinchStatus || av.pinchIn || av.pinchOut)
        }

        function P() {
            return !!(a8() && aX())
        }

        function aV() {
            var be = aA();
            var bg = an();
            var bd = aO();
            var bb = X();
            var bc = ba();
            var bf = !bc && bb && bd && bg && be;
            return bf
        }

        function V() {
            return !!(av.swipe || av.swipeStatus || av.swipeLeft || av.swipeRight || av.swipeUp || av.swipeDown)
        }

        function I() {
            return !!(aV() && V())
        }

        function aO() {
            return ((W === av.fingers || av.fingers === i) || !a)
        }

        function X() {
            return aQ[0].end.x !== 0
        }

        function a6() {
            return !!(av.tap)
        }

        function Y() {
            return !!(av.doubleTap)
        }

        function aU() {
            return !!(av.longTap)
        }

        function Q() {
            if (N == null) {
                return false
            }
            var bb = at();
            return (Y() && ((bb - N) <= av.doubleTapThreshold))
        }

        function H() {
            return Q()
        }

        function ax() {
            return ((W === 1 || !a) && (isNaN(ag) || ag < av.threshold))
        }

        function a0() {
            return ((ab > av.longTapThreshold) && (ag < r))
        }

        function ah() {
            return !!(ax() && a6())
        }

        function aG() {
            return !!(Q() && Y())
        }

        function ap() {
            return !!(a0() && aU())
        }

        function F() {
            a5 = at();
            ad = event.touches.length + 1
        }

        function R() {
            a5 = 0;
            ad = 0
        }

        function am() {
            var bb = false;
            if (a5) {
                var bc = at() - a5;
                if (bc <= av.fingerReleaseThreshold) {
                    bb = true
                }
            }
            return bb
        }

        function aB() {
            return !!(aR.data(B + "_intouch") === true)
        }

        function ao(bb) {
            if (bb === true) {
                aR.bind(ay, a3);
                aR.bind(U, L);
                if (S) {
                    aR.bind(S, K)
                }
            } else {
                aR.unbind(ay, a3, false);
                aR.unbind(U, L, false);
                if (S) {
                    aR.unbind(S, K, false)
                }
            }
            aR.data(B + "_intouch", bb === true)
        }

        function ai(bc, bb) {
            var bd = bb.identifier !== undefined ? bb.identifier : 0;
            aQ[bc].identifier = bd;
            aQ[bc].start.x = aQ[bc].end.x = bb.pageX || bb.clientX;
            aQ[bc].start.y = aQ[bc].end.y = bb.pageY || bb.clientY;
            return aQ[bc]
        }

        function aH(bb) {
            var bd = bb.identifier !== undefined ? bb.identifier : 0;
            var bc = ac(bd);
            bc.end.x = bb.pageX || bb.clientX;
            bc.end.y = bb.pageY || bb.clientY;
            return bc
        }

        function ac(bc) {
            for (var bb = 0; bb < aQ.length; bb++) {
                if (aQ[bb].identifier == bc) {
                    return aQ[bb]
                }
            }
        }

        function aj() {
            var bb = [];
            for (var bc = 0; bc <= 5; bc++) {
                bb.push({
                    start: {
                        x: 0,
                        y: 0
                    },
                    end: {
                        x: 0,
                        y: 0
                    },
                    identifier: 0
                })
            }
            return bb
        }

        function aI(bb, bc) {
            bc = Math.max(bc, aT(bb));
            M[bb].distance = bc
        }

        function aT(bb) {
            if (M[bb]) {
                return M[bb].distance
            }
            return undefined
        }

        function aa() {
            var bb = {};
            bb[p] = aw(p);
            bb[o] = aw(o);
            bb[e] = aw(e);
            bb[x] = aw(x);
            return bb
        }

        function aw(bb) {
            return {
                direction: bb,
                distance: 0
            }
        }

        function aM() {
            return a2 - T
        }

        function au(be, bd) {
            var bc = Math.abs(be.x - bd.x);
            var bb = Math.abs(be.y - bd.y);
            return Math.round(Math.sqrt(bc * bc + bb * bb))
        }

        function a7(bb, bc) {
            var bd = (bc / bb) * 1;
            return bd.toFixed(2)
        }

        function ar() {
            if (G < 1) {
                return z
            } else {
                return c
            }
        }

        function aS(bc, bb) {
            return Math.round(Math.sqrt(Math.pow(bb.x - bc.x, 2) + Math.pow(bb.y - bc.y, 2)))
        }

        function aE(be, bc) {
            var bb = be.x - bc.x;
            var bg = bc.y - be.y;
            var bd = Math.atan2(bg, bb);
            var bf = Math.round(bd * 180 / Math.PI);
            if (bf < 0) {
                bf = 360 - Math.abs(bf)
            }
            return bf
        }

        function aL(bc, bb) {
            var bd = aE(bc, bb);
            if ((bd <= 45) && (bd >= 0)) {
                return p
            } else {
                if ((bd <= 360) && (bd >= 315)) {
                    return p
                } else {
                    if ((bd >= 135) && (bd <= 225)) {
                        return o
                    } else {
                        if ((bd > 45) && (bd < 135)) {
                            return x
                        } else {
                            return e
                        }
                    }
                }
            }
        }

        function at() {
            var bb = new Date();
            return bb.getTime()
        }

        function aY(bb) {
            bb = f(bb);
            var bd = bb.offset();
            var bc = {
                left: bd.left,
                right: bd.left + bb.outerWidth(),
                top: bd.top,
                bottom: bd.top + bb.outerHeight()
            };
            return bc
        }

        function E(bb, bc) {
            return (bb.x > bc.left && bb.x < bc.right && bb.y > bc.top && bb.y < bc.bottom)
        }
    }
}));;
/*!
 * Isotope PACKAGED v2.0.0
 * Filter & sort magical layouts
 * http://isotope.metafizzy.co
 */

(function(t) {
    function e() {}

    function i(t) {
        function i(e) {
            e.prototype.option || (e.prototype.option = function(e) {
                t.isPlainObject(e) && (this.options = t.extend(!0, this.options, e))
            })
        }

        function n(e, i) {
            t.fn[e] = function(n) {
                if ("string" == typeof n) {
                    for (var s = o.call(arguments, 1), a = 0, u = this.length; u > a; a++) {
                        var p = this[a],
                            h = t.data(p, e);
                        if (h)
                            if (t.isFunction(h[n]) && "_" !== n.charAt(0)) {
                                var f = h[n].apply(h, s);
                                if (void 0 !== f) return f
                            } else r("no such method '" + n + "' for " + e + " instance");
                        else r("cannot call methods on " + e + " prior to initialization; " + "attempted to call '" + n + "'")
                    }
                    return this
                }
                return this.each(function() {
                    var o = t.data(this, e);
                    o ? (o.option(n), o._init()) : (o = new i(this, n), t.data(this, e, o))
                })
            }
        }
        if (t) {
            var r = "undefined" == typeof console ? e : function(t) {
                console.error(t)
            };
            return t.bridget = function(t, e) {
                i(e), n(t, e)
            }, t.bridget
        }
    }
    var o = Array.prototype.slice;
    "function" == typeof define && define.amd ? define("jquery-bridget/jquery.bridget", ["jquery"], i) : i(t.jQuery)
})(window),
function(t) {
    function e(e) {
        var i = t.event;
        return i.target = i.target || i.srcElement || e, i
    }
    var i = document.documentElement,
        o = function() {};
    i.addEventListener ? o = function(t, e, i) {
        t.addEventListener(e, i, !1)
    } : i.attachEvent && (o = function(t, i, o) {
        t[i + o] = o.handleEvent ? function() {
            var i = e(t);
            o.handleEvent.call(o, i)
        } : function() {
            var i = e(t);
            o.call(t, i)
        }, t.attachEvent("on" + i, t[i + o])
    });
    var n = function() {};
    i.removeEventListener ? n = function(t, e, i) {
        t.removeEventListener(e, i, !1)
    } : i.detachEvent && (n = function(t, e, i) {
        t.detachEvent("on" + e, t[e + i]);
        try {
            delete t[e + i]
        } catch (o) {
            t[e + i] = void 0
        }
    });
    var r = {
        bind: o,
        unbind: n
    };
    "function" == typeof define && define.amd ? define("eventie/eventie", r) : "object" == typeof exports ? module.exports = r : t.eventie = r
}(this),
function(t) {
    function e(t) {
        "function" == typeof t && (e.isReady ? t() : r.push(t))
    }

    function i(t) {
        var i = "readystatechange" === t.type && "complete" !== n.readyState;
        if (!e.isReady && !i) {
            e.isReady = !0;
            for (var o = 0, s = r.length; s > o; o++) {
                var a = r[o];
                a()
            }
        }
    }

    function o(o) {
        return o.bind(n, "DOMContentLoaded", i), o.bind(n, "readystatechange", i), o.bind(t, "load", i), e
    }
    var n = t.document,
        r = [];
    e.isReady = !1, "function" == typeof define && define.amd ? (e.isReady = "function" == typeof requirejs, define("doc-ready/doc-ready", ["eventie/eventie"], o)) : t.docReady = o(t.eventie)
}(this),
function() {
    function t() {}

    function e(t, e) {
        for (var i = t.length; i--;)
            if (t[i].listener === e) return i;
        return -1
    }

    function i(t) {
        return function() {
            return this[t].apply(this, arguments)
        }
    }
    var o = t.prototype,
        n = this,
        r = n.EventEmitter;
    o.getListeners = function(t) {
        var e, i, o = this._getEvents();
        if (t instanceof RegExp) {
            e = {};
            for (i in o) o.hasOwnProperty(i) && t.test(i) && (e[i] = o[i])
        } else e = o[t] || (o[t] = []);
        return e
    }, o.flattenListeners = function(t) {
        var e, i = [];
        for (e = 0; t.length > e; e += 1) i.push(t[e].listener);
        return i
    }, o.getListenersAsObject = function(t) {
        var e, i = this.getListeners(t);
        return i instanceof Array && (e = {}, e[t] = i), e || i
    }, o.addListener = function(t, i) {
        var o, n = this.getListenersAsObject(t),
            r = "object" == typeof i;
        for (o in n) n.hasOwnProperty(o) && -1 === e(n[o], i) && n[o].push(r ? i : {
            listener: i,
            once: !1
        });
        return this
    }, o.on = i("addListener"), o.addOnceListener = function(t, e) {
        return this.addListener(t, {
            listener: e,
            once: !0
        })
    }, o.once = i("addOnceListener"), o.defineEvent = function(t) {
        return this.getListeners(t), this
    }, o.defineEvents = function(t) {
        for (var e = 0; t.length > e; e += 1) this.defineEvent(t[e]);
        return this
    }, o.removeListener = function(t, i) {
        var o, n, r = this.getListenersAsObject(t);
        for (n in r) r.hasOwnProperty(n) && (o = e(r[n], i), -1 !== o && r[n].splice(o, 1));
        return this
    }, o.off = i("removeListener"), o.addListeners = function(t, e) {
        return this.manipulateListeners(!1, t, e)
    }, o.removeListeners = function(t, e) {
        return this.manipulateListeners(!0, t, e)
    }, o.manipulateListeners = function(t, e, i) {
        var o, n, r = t ? this.removeListener : this.addListener,
            s = t ? this.removeListeners : this.addListeners;
        if ("object" != typeof e || e instanceof RegExp)
            for (o = i.length; o--;) r.call(this, e, i[o]);
        else
            for (o in e) e.hasOwnProperty(o) && (n = e[o]) && ("function" == typeof n ? r.call(this, o, n) : s.call(this, o, n));
        return this
    }, o.removeEvent = function(t) {
        var e, i = typeof t,
            o = this._getEvents();
        if ("string" === i) delete o[t];
        else if (t instanceof RegExp)
            for (e in o) o.hasOwnProperty(e) && t.test(e) && delete o[e];
        else delete this._events;
        return this
    }, o.removeAllListeners = i("removeEvent"), o.emitEvent = function(t, e) {
        var i, o, n, r, s = this.getListenersAsObject(t);
        for (n in s)
            if (s.hasOwnProperty(n))
                for (o = s[n].length; o--;) i = s[n][o], i.once === !0 && this.removeListener(t, i.listener), r = i.listener.apply(this, e || []), r === this._getOnceReturnValue() && this.removeListener(t, i.listener);
        return this
    }, o.trigger = i("emitEvent"), o.emit = function(t) {
        var e = Array.prototype.slice.call(arguments, 1);
        return this.emitEvent(t, e)
    }, o.setOnceReturnValue = function(t) {
        return this._onceReturnValue = t, this
    }, o._getOnceReturnValue = function() {
        return this.hasOwnProperty("_onceReturnValue") ? this._onceReturnValue : !0
    }, o._getEvents = function() {
        return this._events || (this._events = {})
    }, t.noConflict = function() {
        return n.EventEmitter = r, t
    }, "function" == typeof define && define.amd ? define("eventEmitter/EventEmitter", [], function() {
        return t
    }) : "object" == typeof module && module.exports ? module.exports = t : this.EventEmitter = t
}.call(this),
    function(t) {
        function e(t) {
            if (t) {
                if ("string" == typeof o[t]) return t;
                t = t.charAt(0).toUpperCase() + t.slice(1);
                for (var e, n = 0, r = i.length; r > n; n++)
                    if (e = i[n] + t, "string" == typeof o[e]) return e
            }
        }
        var i = "Webkit Moz ms Ms O".split(" "),
            o = document.documentElement.style;
        "function" == typeof define && define.amd ? define("get-style-property/get-style-property", [], function() {
            return e
        }) : "object" == typeof exports ? module.exports = e : t.getStyleProperty = e
    }(window),
    function(t) {
        function e(t) {
            var e = parseFloat(t),
                i = -1 === t.indexOf("%") && !isNaN(e);
            return i && e
        }

        function i() {
            for (var t = {
                    width: 0,
                    height: 0,
                    innerWidth: 0,
                    innerHeight: 0,
                    outerWidth: 0,
                    outerHeight: 0
                }, e = 0, i = s.length; i > e; e++) {
                var o = s[e];
                t[o] = 0
            }
            return t
        }

        function o(t) {
            function o(t) {
                if ("string" == typeof t && (t = document.querySelector(t)), t && "object" == typeof t && t.nodeType) {
                    var o = r(t);
                    if ("none" === o.display) return i();
                    var n = {};
                    n.width = t.offsetWidth, n.height = t.offsetHeight;
                    for (var h = n.isBorderBox = !(!p || !o[p] || "border-box" !== o[p]), f = 0, c = s.length; c > f; f++) {
                        var d = s[f],
                            l = o[d];
                        l = a(t, l);
                        var y = parseFloat(l);
                        n[d] = isNaN(y) ? 0 : y
                    }
                    var m = n.paddingLeft + n.paddingRight,
                        g = n.paddingTop + n.paddingBottom,
                        v = n.marginLeft + n.marginRight,
                        _ = n.marginTop + n.marginBottom,
                        I = n.borderLeftWidth + n.borderRightWidth,
                        L = n.borderTopWidth + n.borderBottomWidth,
                        z = h && u,
                        S = e(o.width);
                    S !== !1 && (n.width = S + (z ? 0 : m + I));
                    var b = e(o.height);
                    return b !== !1 && (n.height = b + (z ? 0 : g + L)), n.innerWidth = n.width - (m + I), n.innerHeight = n.height - (g + L), n.outerWidth = n.width + v, n.outerHeight = n.height + _, n
                }
            }

            function a(t, e) {
                if (n || -1 === e.indexOf("%")) return e;
                var i = t.style,
                    o = i.left,
                    r = t.runtimeStyle,
                    s = r && r.left;
                return s && (r.left = t.currentStyle.left), i.left = e, e = i.pixelLeft, i.left = o, s && (r.left = s), e
            }
            var u, p = t("boxSizing");
            return function() {
                if (p) {
                    var t = document.createElement("div");
                    t.style.width = "200px", t.style.padding = "1px 2px 3px 4px", t.style.borderStyle = "solid", t.style.borderWidth = "1px 2px 3px 4px", t.style[p] = "border-box";
                    var i = document.body || document.documentElement;
                    i.appendChild(t);
                    var o = r(t);
                    u = 200 === e(o.width), i.removeChild(t)
                }
            }(), o
        }
        var n = t.getComputedStyle,
            r = n ? function(t) {
                return n(t, null)
            } : function(t) {
                return t.currentStyle
            },
            s = ["paddingLeft", "paddingRight", "paddingTop", "paddingBottom", "marginLeft", "marginRight", "marginTop", "marginBottom", "borderLeftWidth", "borderRightWidth", "borderTopWidth", "borderBottomWidth"];
        "function" == typeof define && define.amd ? define("get-size/get-size", ["get-style-property/get-style-property"], o) : "object" == typeof exports ? module.exports = o(require("get-style-property")) : t.getSize = o(t.getStyleProperty)
    }(window),
    function(t, e) {
        function i(t, e) {
            return t[a](e)
        }

        function o(t) {
            if (!t.parentNode) {
                var e = document.createDocumentFragment();
                e.appendChild(t)
            }
        }

        function n(t, e) {
            o(t);
            for (var i = t.parentNode.querySelectorAll(e), n = 0, r = i.length; r > n; n++)
                if (i[n] === t) return !0;
            return !1
        }

        function r(t, e) {
            return o(t), i(t, e)
        }
        var s, a = function() {
            if (e.matchesSelector) return "matchesSelector";
            for (var t = ["webkit", "moz", "ms", "o"], i = 0, o = t.length; o > i; i++) {
                var n = t[i],
                    r = n + "MatchesSelector";
                if (e[r]) return r
            }
        }();
        if (a) {
            var u = document.createElement("div"),
                p = i(u, "div");
            s = p ? i : r
        } else s = n;
        "function" == typeof define && define.amd ? define("matches-selector/matches-selector", [], function() {
            return s
        }) : window.matchesSelector = s
    }(this, Element.prototype),
    function(t) {
        function e(t, e) {
            for (var i in e) t[i] = e[i];
            return t
        }

        function i(t) {
            for (var e in t) return !1;
            return e = null, !0
        }

        function o(t) {
            return t.replace(/([A-Z])/g, function(t) {
                return "-" + t.toLowerCase()
            })
        }

        function n(t, n, r) {
            function a(t, e) {
                t && (this.element = t, this.layout = e, this.position = {
                    x: 0,
                    y: 0
                }, this._create())
            }
            var u = r("transition"),
                p = r("transform"),
                h = u && p,
                f = !!r("perspective"),
                c = {
                    WebkitTransition: "webkitTransitionEnd",
                    MozTransition: "transitionend",
                    OTransition: "otransitionend",
                    transition: "transitionend"
                }[u],
                d = ["transform", "transition", "transitionDuration", "transitionProperty"],
                l = function() {
                    for (var t = {}, e = 0, i = d.length; i > e; e++) {
                        var o = d[e],
                            n = r(o);
                        n && n !== o && (t[o] = n)
                    }
                    return t
                }();
            e(a.prototype, t.prototype), a.prototype._create = function() {
                this._transn = {
                    ingProperties: {},
                    clean: {},
                    onEnd: {}
                }, this.css({
                    position: "absolute"
                })
            }, a.prototype.handleEvent = function(t) {
                var e = "on" + t.type;
                this[e] && this[e](t)
            }, a.prototype.getSize = function() {
                this.size = n(this.element)
            }, a.prototype.css = function(t) {
                var e = this.element.style;
                for (var i in t) {
                    var o = l[i] || i;
                    e[o] = t[i]
                }
            }, a.prototype.getPosition = function() {
                var t = s(this.element),
                    e = this.layout.options,
                    i = e.isOriginLeft,
                    o = e.isOriginTop,
                    n = parseInt(t[i ? "left" : "right"], 10),
                    r = parseInt(t[o ? "top" : "bottom"], 10);
                n = isNaN(n) ? 0 : n, r = isNaN(r) ? 0 : r;
                var a = this.layout.size;
                n -= i ? a.paddingLeft : a.paddingRight, r -= o ? a.paddingTop : a.paddingBottom, this.position.x = n, this.position.y = r
            }, a.prototype.layoutPosition = function() {
                var t = this.layout.size,
                    e = this.layout.options,
                    i = {};
                e.isOriginLeft ? (i.left = this.position.x + t.paddingLeft + "px", i.right = "") : (i.right = this.position.x + t.paddingRight + "px", i.left = ""), e.isOriginTop ? (i.top = this.position.y + t.paddingTop + "px", i.bottom = "") : (i.bottom = this.position.y + t.paddingBottom + "px", i.top = ""), this.css(i), this.emitEvent("layout", [this])
            };
            var y = f ? function(t, e) {
                return "translate3d(" + t + "px, " + e + "px, 0)"
            } : function(t, e) {
                return "translate(" + t + "px, " + e + "px)"
            };
            a.prototype._transitionTo = function(t, e) {
                this.getPosition();
                var i = this.position.x,
                    o = this.position.y,
                    n = parseInt(t, 10),
                    r = parseInt(e, 10),
                    s = n === this.position.x && r === this.position.y;
                if (this.setPosition(t, e), s && !this.isTransitioning) return this.layoutPosition(), void 0;
                var a = t - i,
                    u = e - o,
                    p = {},
                    h = this.layout.options;
                a = h.isOriginLeft ? a : -a, u = h.isOriginTop ? u : -u, p.transform = y(a, u), this.transition({
                    to: p,
                    onTransitionEnd: {
                        transform: this.layoutPosition
                    },
                    isCleaning: !0
                })
            }, a.prototype.goTo = function(t, e) {
                this.setPosition(t, e), this.layoutPosition()
            }, a.prototype.moveTo = h ? a.prototype._transitionTo : a.prototype.goTo, a.prototype.setPosition = function(t, e) {
                this.position.x = parseInt(t, 10), this.position.y = parseInt(e, 10)
            }, a.prototype._nonTransition = function(t) {
                this.css(t.to), t.isCleaning && this._removeStyles(t.to);
                for (var e in t.onTransitionEnd) t.onTransitionEnd[e].call(this)
            }, a.prototype._transition = function(t) {
                if (!parseFloat(this.layout.options.transitionDuration)) return this._nonTransition(t), void 0;
                var e = this._transn;
                for (var i in t.onTransitionEnd) e.onEnd[i] = t.onTransitionEnd[i];
                for (i in t.to) e.ingProperties[i] = !0, t.isCleaning && (e.clean[i] = !0);
                if (t.from) {
                    this.css(t.from);
                    var o = this.element.offsetHeight;
                    o = null
                }
                this.enableTransition(t.to), this.css(t.to), this.isTransitioning = !0
            };
            var m = p && o(p) + ",opacity";
            a.prototype.enableTransition = function() {
                this.isTransitioning || (this.css({
                    transitionProperty: m,
                    transitionDuration: this.layout.options.transitionDuration
                }), this.element.addEventListener(c, this, !1))
            }, a.prototype.transition = a.prototype[u ? "_transition" : "_nonTransition"], a.prototype.onwebkitTransitionEnd = function(t) {
                this.ontransitionend(t)
            }, a.prototype.onotransitionend = function(t) {
                this.ontransitionend(t)
            };
            var g = {
                "-webkit-transform": "transform",
                "-moz-transform": "transform",
                "-o-transform": "transform"
            };
            a.prototype.ontransitionend = function(t) {
                if (t.target === this.element) {
                    var e = this._transn,
                        o = g[t.propertyName] || t.propertyName;
                    if (delete e.ingProperties[o], i(e.ingProperties) && this.disableTransition(), o in e.clean && (this.element.style[t.propertyName] = "", delete e.clean[o]), o in e.onEnd) {
                        var n = e.onEnd[o];
                        n.call(this), delete e.onEnd[o]
                    }
                    this.emitEvent("transitionEnd", [this])
                }
            }, a.prototype.disableTransition = function() {
                this.removeTransitionStyles(), this.element.removeEventListener(c, this, !1), this.isTransitioning = !1
            }, a.prototype._removeStyles = function(t) {
                var e = {};
                for (var i in t) e[i] = "";
                this.css(e)
            };
            var v = {
                transitionProperty: "",
                transitionDuration: ""
            };
            return a.prototype.removeTransitionStyles = function() {
                this.css(v)
            }, a.prototype.removeElem = function() {
                this.element.parentNode.removeChild(this.element), this.emitEvent("remove", [this])
            }, a.prototype.remove = function() {
                if (!u || !parseFloat(this.layout.options.transitionDuration)) return this.removeElem(), void 0;
                var t = this;
                this.on("transitionEnd", function() {
                    return t.removeElem(), !0
                }), this.hide()
            }, a.prototype.reveal = function() {
                delete this.isHidden, this.css({
                    display: ""
                });
                var t = this.layout.options;
                this.transition({
                    from: t.hiddenStyle,
                    to: t.visibleStyle,
                    isCleaning: !0
                })
            }, a.prototype.hide = function() {
                this.isHidden = !0, this.css({
                    display: ""
                });
                var t = this.layout.options;
                this.transition({
                    from: t.visibleStyle,
                    to: t.hiddenStyle,
                    isCleaning: !0,
                    onTransitionEnd: {
                        opacity: function() {
                            this.isHidden && this.css({
                                display: "none"
                            })
                        }
                    }
                })
            }, a.prototype.destroy = function() {
                this.css({
                    position: "",
                    left: "",
                    right: "",
                    top: "",
                    bottom: "",
                    transition: "",
                    transform: ""
                })
            }, a
        }
        var r = t.getComputedStyle,
            s = r ? function(t) {
                return r(t, null)
            } : function(t) {
                return t.currentStyle
            };
        "function" == typeof define && define.amd ? define("outlayer/item", ["eventEmitter/EventEmitter", "get-size/get-size", "get-style-property/get-style-property"], n) : (t.Outlayer = {}, t.Outlayer.Item = n(t.EventEmitter, t.getSize, t.getStyleProperty))
    }(window),
    function(t) {
        function e(t, e) {
            for (var i in e) t[i] = e[i];
            return t
        }

        function i(t) {
            return "[object Array]" === f.call(t)
        }

        function o(t) {
            var e = [];
            if (i(t)) e = t;
            else if (t && "number" == typeof t.length)
                for (var o = 0, n = t.length; n > o; o++) e.push(t[o]);
            else e.push(t);
            return e
        }

        function n(t, e) {
            var i = d(e, t); - 1 !== i && e.splice(i, 1)
        }

        function r(t) {
            return t.replace(/(.)([A-Z])/g, function(t, e, i) {
                return e + "-" + i
            }).toLowerCase()
        }

        function s(i, s, f, d, l, y) {
            function m(t, i) {
                if ("string" == typeof t && (t = a.querySelector(t)), !t || !c(t)) return u && u.error("Bad " + this.constructor.namespace + " element: " + t), void 0;
                this.element = t, this.options = e({}, this.constructor.defaults), this.option(i);
                var o = ++g;
                this.element.outlayerGUID = o, v[o] = this, this._create(), this.options.isInitLayout && this.layout()
            }
            var g = 0,
                v = {};
            return m.namespace = "outlayer", m.Item = y, m.defaults = {
                containerStyle: {
                    position: "relative"
                },
                isInitLayout: !0,
                isOriginLeft: !0,
                isOriginTop: !0,
                isResizeBound: !0,
                isResizingContainer: !0,
                transitionDuration: "0.4s",
                hiddenStyle: {
                    opacity: 0,
                    transform: "scale(0.001)"
                },
                visibleStyle: {
                    opacity: 1,
                    transform: "scale(1)"
                }
            }, e(m.prototype, f.prototype), m.prototype.option = function(t) {
                e(this.options, t)
            }, m.prototype._create = function() {
                this.reloadItems(), this.stamps = [], this.stamp(this.options.stamp), e(this.element.style, this.options.containerStyle), this.options.isResizeBound && this.bindResize()
            }, m.prototype.reloadItems = function() {
                this.items = this._itemize(this.element.children)
            }, m.prototype._itemize = function(t) {
                for (var e = this._filterFindItemElements(t), i = this.constructor.Item, o = [], n = 0, r = e.length; r > n; n++) {
                    var s = e[n],
                        a = new i(s, this);
                    o.push(a)
                }
                return o
            }, m.prototype._filterFindItemElements = function(t) {
                t = o(t);
                for (var e = this.options.itemSelector, i = [], n = 0, r = t.length; r > n; n++) {
                    var s = t[n];
                    if (c(s))
                        if (e) {
                            l(s, e) && i.push(s);
                            for (var a = s.querySelectorAll(e), u = 0, p = a.length; p > u; u++) i.push(a[u])
                        } else i.push(s)
                }
                return i
            }, m.prototype.getItemElements = function() {
                for (var t = [], e = 0, i = this.items.length; i > e; e++) t.push(this.items[e].element);
                return t
            }, m.prototype.layout = function() {
                this._resetLayout(), this._manageStamps();
                var t = void 0 !== this.options.isLayoutInstant ? this.options.isLayoutInstant : !this._isLayoutInited;
                this.layoutItems(this.items, t), this._isLayoutInited = !0
            }, m.prototype._init = m.prototype.layout, m.prototype._resetLayout = function() {
                this.getSize()
            }, m.prototype.getSize = function() {
                this.size = d(this.element)
            }, m.prototype._getMeasurement = function(t, e) {
                var i, o = this.options[t];
                o ? ("string" == typeof o ? i = this.element.querySelector(o) : c(o) && (i = o), this[t] = i ? d(i)[e] : o) : this[t] = 0
            }, m.prototype.layoutItems = function(t, e) {
                t = this._getItemsForLayout(t), this._layoutItems(t, e), this._postLayout()
            }, m.prototype._getItemsForLayout = function(t) {
                for (var e = [], i = 0, o = t.length; o > i; i++) {
                    var n = t[i];
                    n.isIgnored || e.push(n)
                }
                return e
            }, m.prototype._layoutItems = function(t, e) {
                function i() {
                    o.emitEvent("layoutComplete", [o, t])
                }
                var o = this;
                if (!t || !t.length) return i(), void 0;
                this._itemsOn(t, "layout", i);
                for (var n = [], r = 0, s = t.length; s > r; r++) {
                    var a = t[r],
                        u = this._getItemLayoutPosition(a);
                    u.item = a, u.isInstant = e || a.isLayoutInstant, n.push(u)
                }
                this._processLayoutQueue(n)
            }, m.prototype._getItemLayoutPosition = function() {
                return {
                    x: 0,
                    y: 0
                }
            }, m.prototype._processLayoutQueue = function(t) {
                for (var e = 0, i = t.length; i > e; e++) {
                    var o = t[e];
                    this._positionItem(o.item, o.x, o.y, o.isInstant)
                }
            }, m.prototype._positionItem = function(t, e, i, o) {
                o ? t.goTo(e, i) : t.moveTo(e, i)
            }, m.prototype._postLayout = function() {
                this.resizeContainer()
            }, m.prototype.resizeContainer = function() {
                if (this.options.isResizingContainer) {
                    var t = this._getContainerSize();
                    t && (this._setContainerMeasure(t.width, !0), this._setContainerMeasure(t.height, !1))
                }
            }, m.prototype._getContainerSize = h, m.prototype._setContainerMeasure = function(t, e) {
                if (void 0 !== t) {
                    var i = this.size;
                    i.isBorderBox && (t += e ? i.paddingLeft + i.paddingRight + i.borderLeftWidth + i.borderRightWidth : i.paddingBottom + i.paddingTop + i.borderTopWidth + i.borderBottomWidth), t = Math.max(t, 0), this.element.style[e ? "width" : "height"] = t + "px"
                }
            }, m.prototype._itemsOn = function(t, e, i) {
                function o() {
                    return n++, n === r && i.call(s), !0
                }
                for (var n = 0, r = t.length, s = this, a = 0, u = t.length; u > a; a++) {
                    var p = t[a];
                    p.on(e, o)
                }
            }, m.prototype.ignore = function(t) {
                var e = this.getItem(t);
                e && (e.isIgnored = !0)
            }, m.prototype.unignore = function(t) {
                var e = this.getItem(t);
                e && delete e.isIgnored
            }, m.prototype.stamp = function(t) {
                if (t = this._find(t)) {
                    this.stamps = this.stamps.concat(t);
                    for (var e = 0, i = t.length; i > e; e++) {
                        var o = t[e];
                        this.ignore(o)
                    }
                }
            }, m.prototype.unstamp = function(t) {
                if (t = this._find(t))
                    for (var e = 0, i = t.length; i > e; e++) {
                        var o = t[e];
                        n(o, this.stamps), this.unignore(o)
                    }
            }, m.prototype._find = function(t) {
                return t ? ("string" == typeof t && (t = this.element.querySelectorAll(t)), t = o(t)) : void 0
            }, m.prototype._manageStamps = function() {
                if (this.stamps && this.stamps.length) {
                    this._getBoundingRect();
                    for (var t = 0, e = this.stamps.length; e > t; t++) {
                        var i = this.stamps[t];
                        this._manageStamp(i)
                    }
                }
            }, m.prototype._getBoundingRect = function() {
                var t = this.element.getBoundingClientRect(),
                    e = this.size;
                this._boundingRect = {
                    left: t.left + e.paddingLeft + e.borderLeftWidth,
                    top: t.top + e.paddingTop + e.borderTopWidth,
                    right: t.right - (e.paddingRight + e.borderRightWidth),
                    bottom: t.bottom - (e.paddingBottom + e.borderBottomWidth)
                }
            }, m.prototype._manageStamp = h, m.prototype._getElementOffset = function(t) {
                var e = t.getBoundingClientRect(),
                    i = this._boundingRect,
                    o = d(t),
                    n = {
                        left: e.left - i.left - o.marginLeft,
                        top: e.top - i.top - o.marginTop,
                        right: i.right - e.right - o.marginRight,
                        bottom: i.bottom - e.bottom - o.marginBottom
                    };
                return n
            }, m.prototype.handleEvent = function(t) {
                var e = "on" + t.type;
                this[e] && this[e](t)
            }, m.prototype.bindResize = function() {
                this.isResizeBound || (i.bind(t, "resize", this), this.isResizeBound = !0)
            }, m.prototype.unbindResize = function() {
                this.isResizeBound && i.unbind(t, "resize", this), this.isResizeBound = !1
            }, m.prototype.onresize = function() {
                function t() {
                    e.resize(), delete e.resizeTimeout
                }
                this.resizeTimeout && clearTimeout(this.resizeTimeout);
                var e = this;
                this.resizeTimeout = setTimeout(t, 100)
            }, m.prototype.resize = function() {
                this.isResizeBound && this.needsResizeLayout() && this.layout()
            }, m.prototype.needsResizeLayout = function() {
                var t = d(this.element),
                    e = this.size && t;
                return e && t.innerWidth !== this.size.innerWidth
            }, m.prototype.addItems = function(t) {
                var e = this._itemize(t);
                return e.length && (this.items = this.items.concat(e)), e
            }, m.prototype.appended = function(t) {
                var e = this.addItems(t);
                e.length && (this.layoutItems(e, !0), this.reveal(e))
            }, m.prototype.prepended = function(t) {
                var e = this._itemize(t);
                if (e.length) {
                    var i = this.items.slice(0);
                    this.items = e.concat(i), this._resetLayout(), this._manageStamps(), this.layoutItems(e, !0), this.reveal(e), this.layoutItems(i)
                }
            }, m.prototype.reveal = function(t) {
                var e = t && t.length;
                if (e)
                    for (var i = 0; e > i; i++) {
                        var o = t[i];
                        o.reveal()
                    }
            }, m.prototype.hide = function(t) {
                var e = t && t.length;
                if (e)
                    for (var i = 0; e > i; i++) {
                        var o = t[i];
                        o.hide()
                    }
            }, m.prototype.getItem = function(t) {
                for (var e = 0, i = this.items.length; i > e; e++) {
                    var o = this.items[e];
                    if (o.element === t) return o
                }
            }, m.prototype.getItems = function(t) {
                if (t && t.length) {
                    for (var e = [], i = 0, o = t.length; o > i; i++) {
                        var n = t[i],
                            r = this.getItem(n);
                        r && e.push(r)
                    }
                    return e
                }
            }, m.prototype.remove = function(t) {
                t = o(t);
                var e = this.getItems(t);
                if (e && e.length) {
                    this._itemsOn(e, "remove", function() {
                        this.emitEvent("removeComplete", [this, e])
                    });
                    for (var i = 0, r = e.length; r > i; i++) {
                        var s = e[i];
                        s.remove(), n(s, this.items)
                    }
                }
            }, m.prototype.destroy = function() {
                var t = this.element.style;
                t.height = "", t.position = "", t.width = "";
                for (var e = 0, i = this.items.length; i > e; e++) {
                    var o = this.items[e];
                    o.destroy()
                }
                this.unbindResize(), delete this.element.outlayerGUID, p && p.removeData(this.element, this.constructor.namespace)
            }, m.data = function(t) {
                var e = t && t.outlayerGUID;
                return e && v[e]
            }, m.create = function(t, i) {
                function o() {
                    m.apply(this, arguments)
                }
                return Object.create ? o.prototype = Object.create(m.prototype) : e(o.prototype, m.prototype), o.prototype.constructor = o, o.defaults = e({}, m.defaults), e(o.defaults, i), o.prototype.settings = {}, o.namespace = t, o.data = m.data, o.Item = function() {
                    y.apply(this, arguments)
                }, o.Item.prototype = new y, s(function() {
                    for (var e = r(t), i = a.querySelectorAll(".js-" + e), n = "data-" + e + "-options", s = 0, h = i.length; h > s; s++) {
                        var f, c = i[s],
                            d = c.getAttribute(n);
                        try {
                            f = d && JSON.parse(d)
                        } catch (l) {
                            u && u.error("Error parsing " + n + " on " + c.nodeName.toLowerCase() + (c.id ? "#" + c.id : "") + ": " + l);
                            continue
                        }
                        var y = new o(c, f);
                        p && p.data(c, t, y)
                    }
                }), p && p.bridget && p.bridget(t, o), o
            }, m.Item = y, m
        }
        var a = t.document,
            u = t.console,
            p = t.jQuery,
            h = function() {},
            f = Object.prototype.toString,
            c = "object" == typeof HTMLElement ? function(t) {
                return t instanceof HTMLElement
            } : function(t) {
                return t && "object" == typeof t && 1 === t.nodeType && "string" == typeof t.nodeName
            },
            d = Array.prototype.indexOf ? function(t, e) {
                return t.indexOf(e)
            } : function(t, e) {
                for (var i = 0, o = t.length; o > i; i++)
                    if (t[i] === e) return i;
                return -1
            };
        "function" == typeof define && define.amd ? define("outlayer/outlayer", ["eventie/eventie", "doc-ready/doc-ready", "eventEmitter/EventEmitter", "get-size/get-size", "matches-selector/matches-selector", "./item"], s) : t.Outlayer = s(t.eventie, t.docReady, t.EventEmitter, t.getSize, t.matchesSelector, t.Outlayer.Item)
    }(window),
    function(t) {
        function e(t) {
            function e() {
                t.Item.apply(this, arguments)
            }
            return e.prototype = new t.Item, e.prototype._create = function() {
                this.id = this.layout.itemGUID++, t.Item.prototype._create.call(this), this.sortData = {}
            }, e.prototype.updateSortData = function() {
                if (!this.isIgnored) {
                    this.sortData.id = this.id, this.sortData["original-order"] = this.id, this.sortData.random = Math.random();
                    var t = this.layout.options.getSortData,
                        e = this.layout._sorters;
                    for (var i in t) {
                        var o = e[i];
                        this.sortData[i] = o(this.element, this)
                    }
                }
            }, e
        }
        "function" == typeof define && define.amd ? define("isotope/js/item", ["outlayer/outlayer"], e) : (t.Isotope = t.Isotope || {}, t.Isotope.Item = e(t.Outlayer))
    }(window),
    function(t) {
        function e(t, e) {
            function i(t) {
                this.isotope = t, t && (this.options = t.options[this.namespace], this.element = t.element, this.items = t.filteredItems, this.size = t.size)
            }
            return function() {
                function t(t) {
                    return function() {
                        return e.prototype[t].apply(this.isotope, arguments)
                    }
                }
                for (var o = ["_resetLayout", "_getItemLayoutPosition", "_manageStamp", "_getContainerSize", "_getElementOffset", "needsResizeLayout"], n = 0, r = o.length; r > n; n++) {
                    var s = o[n];
                    i.prototype[s] = t(s)
                }
            }(), i.prototype.needsVerticalResizeLayout = function() {
                var e = t(this.isotope.element),
                    i = this.isotope.size && e;
                return i && e.innerHeight !== this.isotope.size.innerHeight
            }, i.prototype._getMeasurement = function() {
                this.isotope._getMeasurement.apply(this, arguments)
            }, i.prototype.getColumnWidth = function() {
                this.getSegmentSize("column", "Width")
            }, i.prototype.getRowHeight = function() {
                this.getSegmentSize("row", "Height")
            }, i.prototype.getSegmentSize = function(t, e) {
                var i = t + e,
                    o = "outer" + e;
                if (this._getMeasurement(i, o), !this[i]) {
                    var n = this.getFirstItemSize();
                    this[i] = n && n[o] || this.isotope.size["inner" + e]
                }
            }, i.prototype.getFirstItemSize = function() {
                var e = this.isotope.filteredItems[0];
                return e && e.element && t(e.element)
            }, i.prototype.layout = function() {
                this.isotope.layout.apply(this.isotope, arguments)
            }, i.prototype.getSize = function() {
                this.isotope.getSize(), this.size = this.isotope.size
            }, i.modes = {}, i.create = function(t, e) {
                function o() {
                    i.apply(this, arguments)
                }
                return o.prototype = new i, e && (o.options = e), o.prototype.namespace = t, i.modes[t] = o, o
            }, i
        }
        "function" == typeof define && define.amd ? define("isotope/js/layout-mode", ["get-size/get-size", "outlayer/outlayer"], e) : (t.Isotope = t.Isotope || {}, t.Isotope.LayoutMode = e(t.getSize, t.Outlayer))
    }(window),
    function(t) {
        function e(t, e) {
            var o = t.create("masonry");
            return o.prototype._resetLayout = function() {
                this.getSize(), this._getMeasurement("columnWidth", "outerWidth"), this._getMeasurement("gutter", "outerWidth"), this.measureColumns();
                var t = this.cols;
                for (this.colYs = []; t--;) this.colYs.push(0);
                this.maxY = 0
            }, o.prototype.measureColumns = function() {
                if (this.getContainerWidth(), !this.columnWidth) {
                    var t = this.items[0],
                        i = t && t.element;
                    this.columnWidth = i && e(i).outerWidth || this.containerWidth
                }
                this.columnWidth += this.gutter, this.cols = Math.floor((this.containerWidth + this.gutter) / this.columnWidth), this.cols = Math.max(this.cols, 1)
            }, o.prototype.getContainerWidth = function() {
                var t = this.options.isFitWidth ? this.element.parentNode : this.element,
                    i = e(t);
                this.containerWidth = i && i.innerWidth
            }, o.prototype._getItemLayoutPosition = function(t) {
                t.getSize();
                var e = t.size.outerWidth % this.columnWidth,
                    o = e && 1 > e ? "round" : "ceil",
                    n = Math[o](t.size.outerWidth / this.columnWidth);
                n = Math.min(n, this.cols);
                for (var r = this._getColGroup(n), s = Math.min.apply(Math, r), a = i(r, s), u = {
                        x: this.columnWidth * a,
                        y: s
                    }, p = s + t.size.outerHeight, h = this.cols + 1 - r.length, f = 0; h > f; f++) this.colYs[a + f] = p;
                return u
            }, o.prototype._getColGroup = function(t) {
                if (2 > t) return this.colYs;
                for (var e = [], i = this.cols + 1 - t, o = 0; i > o; o++) {
                    var n = this.colYs.slice(o, o + t);
                    e[o] = Math.max.apply(Math, n)
                }
                return e
            }, o.prototype._manageStamp = function(t) {
                var i = e(t),
                    o = this._getElementOffset(t),
                    n = this.options.isOriginLeft ? o.left : o.right,
                    r = n + i.outerWidth,
                    s = Math.floor(n / this.columnWidth);
                s = Math.max(0, s);
                var a = Math.floor(r / this.columnWidth);
                a -= r % this.columnWidth ? 0 : 1, a = Math.min(this.cols - 1, a);
                for (var u = (this.options.isOriginTop ? o.top : o.bottom) + i.outerHeight, p = s; a >= p; p++) this.colYs[p] = Math.max(u, this.colYs[p])
            }, o.prototype._getContainerSize = function() {
                this.maxY = Math.max.apply(Math, this.colYs);
                var t = {
                    height: this.maxY
                };
                return this.options.isFitWidth && (t.width = this._getContainerFitWidth()), t
            }, o.prototype._getContainerFitWidth = function() {
                for (var t = 0, e = this.cols; --e && 0 === this.colYs[e];) t++;
                return (this.cols - t) * this.columnWidth - this.gutter
            }, o.prototype.needsResizeLayout = function() {
                var t = this.containerWidth;
                return this.getContainerWidth(), t !== this.containerWidth
            }, o
        }
        var i = Array.prototype.indexOf ? function(t, e) {
            return t.indexOf(e)
        } : function(t, e) {
            for (var i = 0, o = t.length; o > i; i++) {
                var n = t[i];
                if (n === e) return i
            }
            return -1
        };
        "function" == typeof define && define.amd ? define("masonry/masonry", ["outlayer/outlayer", "get-size/get-size"], e) : t.Masonry = e(t.Outlayer, t.getSize)
    }(window),
    function(t) {
        function e(t, e) {
            for (var i in e) t[i] = e[i];
            return t
        }

        function i(t, i) {
            var o = t.create("masonry"),
                n = o.prototype._getElementOffset,
                r = o.prototype.layout,
                s = o.prototype._getMeasurement;
            e(o.prototype, i.prototype), o.prototype._getElementOffset = n, o.prototype.layout = r, o.prototype._getMeasurement = s;
            var a = o.prototype.measureColumns;
            o.prototype.measureColumns = function() {
                this.items = this.isotope.filteredItems, a.call(this)
            };
            var u = o.prototype._manageStamp;
            return o.prototype._manageStamp = function() {
                this.options.isOriginLeft = this.isotope.options.isOriginLeft, this.options.isOriginTop = this.isotope.options.isOriginTop, u.apply(this, arguments)
            }, o
        }
        "function" == typeof define && define.amd ? define("isotope/js/layout-modes/masonry", ["../layout-mode", "masonry/masonry"], i) : i(t.Isotope.LayoutMode, t.Masonry)
    }(window),
    function(t) {
        function e(t) {
            var e = t.create("fitRows");
            return e.prototype._resetLayout = function() {
                this.x = 0, this.y = 0, this.maxY = 0
            }, e.prototype._getItemLayoutPosition = function(t) {
                t.getSize(), 0 !== this.x && t.size.outerWidth + this.x > this.isotope.size.innerWidth && (this.x = 0, this.y = this.maxY);
                var e = {
                    x: this.x,
                    y: this.y
                };
                return this.maxY = Math.max(this.maxY, this.y + t.size.outerHeight), this.x += t.size.outerWidth, e
            }, e.prototype._getContainerSize = function() {
                return {
                    height: this.maxY
                }
            }, e
        }
        "function" == typeof define && define.amd ? define("isotope/js/layout-modes/fit-rows", ["../layout-mode"], e) : e(t.Isotope.LayoutMode)
    }(window),
    function(t) {
        function e(t) {
            var e = t.create("vertical", {
                horizontalAlignment: 0
            });
            return e.prototype._resetLayout = function() {
                this.y = 0
            }, e.prototype._getItemLayoutPosition = function(t) {
                t.getSize();
                var e = (this.isotope.size.innerWidth - t.size.outerWidth) * this.options.horizontalAlignment,
                    i = this.y;
                return this.y += t.size.outerHeight, {
                    x: e,
                    y: i
                }
            }, e.prototype._getContainerSize = function() {
                return {
                    height: this.y
                }
            }, e
        }
        "function" == typeof define && define.amd ? define("isotope/js/layout-modes/vertical", ["../layout-mode"], e) : e(t.Isotope.LayoutMode)
    }(window),
    function(t) {
        function e(t, e) {
            for (var i in e) t[i] = e[i];
            return t
        }

        function i(t) {
            return "[object Array]" === h.call(t)
        }

        function o(t) {
            var e = [];
            if (i(t)) e = t;
            else if (t && "number" == typeof t.length)
                for (var o = 0, n = t.length; n > o; o++) e.push(t[o]);
            else e.push(t);
            return e
        }

        function n(t, e) {
            var i = f(e, t); - 1 !== i && e.splice(i, 1)
        }

        function r(t, i, r, u, h) {
            function f(t, e) {
                return function(i, o) {
                    for (var n = 0, r = t.length; r > n; n++) {
                        var s = t[n],
                            a = i.sortData[s],
                            u = o.sortData[s];
                        if (a > u || u > a) {
                            var p = void 0 !== e[s] ? e[s] : e,
                                h = p ? 1 : -1;
                            return (a > u ? 1 : -1) * h
                        }
                    }
                    return 0
                }
            }
            var c = t.create("isotope", {
                layoutMode: "masonry",
                isJQueryFiltering: !0,
                sortAscending: !0
            });
            c.Item = u, c.LayoutMode = h, c.prototype._create = function() {
                this.itemGUID = 0, this._sorters = {}, this._getSorters(), t.prototype._create.call(this), this.modes = {}, this.filteredItems = this.items, this.sortHistory = ["original-order"];
                for (var e in h.modes) this._initLayoutMode(e)
            }, c.prototype.reloadItems = function() {
                this.itemGUID = 0, t.prototype.reloadItems.call(this)
            }, c.prototype._itemize = function() {
                for (var e = t.prototype._itemize.apply(this, arguments), i = 0, o = e.length; o > i; i++) {
                    var n = e[i];
                    n.id = this.itemGUID++
                }
                return this._updateItemsSortData(e), e
            }, c.prototype._initLayoutMode = function(t) {
                var i = h.modes[t],
                    o = this.options[t] || {};
                this.options[t] = i.options ? e(i.options, o) : o, this.modes[t] = new i(this)
            }, c.prototype.layout = function() {
                return !this._isLayoutInited && this.options.isInitLayout ? (this.arrange(), void 0) : (this._layout(), void 0)
            }, c.prototype._layout = function() {
                var t = this._getIsInstant();
                this._resetLayout(), this._manageStamps(), this.layoutItems(this.filteredItems, t), this._isLayoutInited = !0
            }, c.prototype.arrange = function(t) {
                this.option(t), this._getIsInstant(), this.filteredItems = this._filter(this.items), this._sort(), this._layout()
            }, c.prototype._init = c.prototype.arrange, c.prototype._getIsInstant = function() {
                var t = void 0 !== this.options.isLayoutInstant ? this.options.isLayoutInstant : !this._isLayoutInited;
                return this._isInstant = t, t
            }, c.prototype._filter = function(t) {
                function e() {
                    f.reveal(n), f.hide(r)
                }
                var i = this.options.filter;
                i = i || "*";
                for (var o = [], n = [], r = [], s = this._getFilterTest(i), a = 0, u = t.length; u > a; a++) {
                    var p = t[a];
                    if (!p.isIgnored) {
                        var h = s(p);
                        h && o.push(p), h && p.isHidden ? n.push(p) : h || p.isHidden || r.push(p)
                    }
                }
                var f = this;
                return this._isInstant ? this._noTransition(e) : e(), o
            }, c.prototype._getFilterTest = function(t) {
                return s && this.options.isJQueryFiltering ? function(e) {
                    return s(e.element).is(t)
                } : "function" == typeof t ? function(e) {
                    return t(e.element)
                } : function(e) {
                    return r(e.element, t)
                }
            }, c.prototype.updateSortData = function(t) {
                this._getSorters(), t = o(t);
                var e = this.getItems(t);
                e = e.length ? e : this.items, this._updateItemsSortData(e)
            }, c.prototype._getSorters = function() {
                var t = this.options.getSortData;
                for (var e in t) {
                    var i = t[e];
                    this._sorters[e] = d(i)
                }
            }, c.prototype._updateItemsSortData = function(t) {
                for (var e = 0, i = t.length; i > e; e++) {
                    var o = t[e];
                    o.updateSortData()
                }
            };
            var d = function() {
                function t(t) {
                    if ("string" != typeof t) return t;
                    var i = a(t).split(" "),
                        o = i[0],
                        n = o.match(/^\[(.+)\]$/),
                        r = n && n[1],
                        s = e(r, o),
                        u = c.sortDataParsers[i[1]];
                    return t = u ? function(t) {
                        return t && u(s(t))
                    } : function(t) {
                        return t && s(t)
                    }
                }

                function e(t, e) {
                    var i;
                    return i = t ? function(e) {
                        return e.getAttribute(t)
                    } : function(t) {
                        var i = t.querySelector(e);
                        return i && p(i)
                    }
                }
                return t
            }();
            c.sortDataParsers = {
                parseInt: function(t) {
                    return parseInt(t, 10)
                },
                parseFloat: function(t) {
                    return parseFloat(t)
                }
            }, c.prototype._sort = function() {
                var t = this.options.sortBy;
                if (t) {
                    var e = [].concat.apply(t, this.sortHistory),
                        i = f(e, this.options.sortAscending);
                    this.filteredItems.sort(i), t !== this.sortHistory[0] && this.sortHistory.unshift(t)
                }
            }, c.prototype._mode = function() {
                var t = this.options.layoutMode,
                    e = this.modes[t];
                if (!e) throw Error("No layout mode: " + t);
                return e.options = this.options[t], e
            }, c.prototype._resetLayout = function() {
                t.prototype._resetLayout.call(this), this._mode()._resetLayout()
            }, c.prototype._getItemLayoutPosition = function(t) {
                return this._mode()._getItemLayoutPosition(t)
            }, c.prototype._manageStamp = function(t) {
                this._mode()._manageStamp(t)
            }, c.prototype._getContainerSize = function() {
                return this._mode()._getContainerSize()
            }, c.prototype.needsResizeLayout = function() {
                return this._mode().needsResizeLayout()
            }, c.prototype.appended = function(t) {
                var e = this.addItems(t);
                if (e.length) {
                    var i = this._filterRevealAdded(e);
                    this.filteredItems = this.filteredItems.concat(i)
                }
            }, c.prototype.prepended = function(t) {
                var e = this._itemize(t);
                if (e.length) {
                    var i = this.items.slice(0);
                    this.items = e.concat(i), this._resetLayout(), this._manageStamps();
                    var o = this._filterRevealAdded(e);
                    this.layoutItems(i), this.filteredItems = o.concat(this.filteredItems)
                }
            }, c.prototype._filterRevealAdded = function(t) {
                var e = this._noTransition(function() {
                    return this._filter(t)
                });
                return this.layoutItems(e, !0), this.reveal(e), t
            }, c.prototype.insert = function(t) {
                var e = this.addItems(t);
                if (e.length) {
                    var i, o, n = e.length;
                    for (i = 0; n > i; i++) o = e[i], this.element.appendChild(o.element);
                    var r = this._filter(e);
                    for (this._noTransition(function() {
                            this.hide(r)
                        }), i = 0; n > i; i++) e[i].isLayoutInstant = !0;
                    for (this.arrange(), i = 0; n > i; i++) delete e[i].isLayoutInstant;
                    this.reveal(r)
                }
            };
            var l = c.prototype.remove;
            return c.prototype.remove = function(t) {
                t = o(t);
                var e = this.getItems(t);
                if (l.call(this, t), e && e.length)
                    for (var i = 0, r = e.length; r > i; i++) {
                        var s = e[i];
                        n(s, this.filteredItems)
                    }
            }, c.prototype._noTransition = function(t) {
                var e = this.options.transitionDuration;
                this.options.transitionDuration = 0;
                var i = t.call(this);
                return this.options.transitionDuration = e, i
            }, c
        }
        var s = t.jQuery,
            a = String.prototype.trim ? function(t) {
                return t.trim()
            } : function(t) {
                return t.replace(/^\s+|\s+$/g, "")
            },
            u = document.documentElement,
            p = u.textContent ? function(t) {
                return t.textContent
            } : function(t) {
                return t.innerText
            },
            h = Object.prototype.toString,
            f = Array.prototype.indexOf ? function(t, e) {
                return t.indexOf(e)
            } : function(t, e) {
                for (var i = 0, o = t.length; o > i; i++)
                    if (t[i] === e) return i;
                return -1
            };
        "function" == typeof define && define.amd ? define(["outlayer/outlayer", "get-size/get-size", "matches-selector/matches-selector", "isotope/js/item", "isotope/js/layout-mode", "isotope/js/layout-modes/masonry", "isotope/js/layout-modes/fit-rows", "isotope/js/layout-modes/vertical"], r) : t.Isotope = r(t.Outlayer, t.getSize, t.matchesSelector, t.Isotope.Item, t.Isotope.LayoutMode)
    }(window);;
/*!
 * Packery layout mode PACKAGED v2.0.0
 * sub-classes Packery
 */

! function(a, b) {
    "function" == typeof define && define.amd ? define("packery/js/rect", b) : "object" == typeof module && module.exports ? module.exports = b() : (a.Packery = a.Packery || {}, a.Packery.Rect = b())
}(window, function() {
    function a(b) {
        for (var c in a.defaults) this[c] = a.defaults[c];
        for (c in b) this[c] = b[c]
    }
    a.defaults = {
        x: 0,
        y: 0,
        width: 0,
        height: 0
    };
    var b = a.prototype;
    return b.contains = function(a) {
        var b = a.width || 0,
            c = a.height || 0;
        return this.x <= a.x && this.y <= a.y && this.x + this.width >= a.x + b && this.y + this.height >= a.y + c
    }, b.overlaps = function(a) {
        var b = this.x + this.width,
            c = this.y + this.height,
            d = a.x + a.width,
            e = a.y + a.height;
        return this.x < d && b > a.x && this.y < e && c > a.y
    }, b.getMaximalFreeRects = function(b) {
        if (!this.overlaps(b)) return !1;
        var c, d = [],
            e = this.x + this.width,
            f = this.y + this.height,
            g = b.x + b.width,
            h = b.y + b.height;
        return this.y < b.y && (c = new a({
            x: this.x,
            y: this.y,
            width: this.width,
            height: b.y - this.y
        }), d.push(c)), e > g && (c = new a({
            x: g,
            y: this.y,
            width: e - g,
            height: this.height
        }), d.push(c)), f > h && (c = new a({
            x: this.x,
            y: h,
            width: this.width,
            height: f - h
        }), d.push(c)), this.x < b.x && (c = new a({
            x: this.x,
            y: this.y,
            width: b.x - this.x,
            height: this.height
        }), d.push(c)), d
    }, b.canFit = function(a) {
        return this.width >= a.width && this.height >= a.height
    }, a
}),
function(a, b) {
    if ("function" == typeof define && define.amd) define("packery/js/packer", ["./rect"], b);
    else if ("object" == typeof module && module.exports) module.exports = b(require("./rect"));
    else {
        var c = a.Packery = a.Packery || {};
        c.Packer = b(c.Rect)
    }
}(window, function(a) {
    function b(a, b, c) {
        this.width = a || 0, this.height = b || 0, this.sortDirection = c || "downwardLeftToRight", this.reset()
    }
    var c = b.prototype;
    c.reset = function() {
        this.spaces = [];
        var b = new a({
            x: 0,
            y: 0,
            width: this.width,
            height: this.height
        });
        this.spaces.push(b), this.sorter = d[this.sortDirection] || d.downwardLeftToRight
    }, c.pack = function(a) {
        for (var b = 0; b < this.spaces.length; b++) {
            var c = this.spaces[b];
            if (c.canFit(a)) {
                this.placeInSpace(a, c);
                break
            }
        }
    }, c.columnPack = function(a) {
        for (var b = 0; b < this.spaces.length; b++) {
            var c = this.spaces[b],
                d = c.x <= a.x && c.x + c.width >= a.x + a.width && c.height >= a.height - .01;
            if (d) {
                a.y = c.y, this.placed(a);
                break
            }
        }
    }, c.rowPack = function(a) {
        for (var b = 0; b < this.spaces.length; b++) {
            var c = this.spaces[b],
                d = c.y <= a.y && c.y + c.height >= a.y + a.height && c.width >= a.width - .01;
            if (d) {
                a.x = c.x, this.placed(a);
                break
            }
        }
    }, c.placeInSpace = function(a, b) {
        a.x = b.x, a.y = b.y, this.placed(a)
    }, c.placed = function(a) {
        for (var b = [], c = 0; c < this.spaces.length; c++) {
            var d = this.spaces[c],
                e = d.getMaximalFreeRects(a);
            e ? b.push.apply(b, e) : b.push(d)
        }
        this.spaces = b, this.mergeSortSpaces()
    }, c.mergeSortSpaces = function() {
        b.mergeRects(this.spaces), this.spaces.sort(this.sorter)
    }, c.addSpace = function(a) {
        this.spaces.push(a), this.mergeSortSpaces()
    }, b.mergeRects = function(a) {
        var b = 0,
            c = a[b];
        a: for (; c;) {
            for (var d = 0, e = a[b + d]; e;) {
                if (e == c) d++;
                else {
                    if (e.contains(c)) {
                        a.splice(b, 1), c = a[b];
                        continue a
                    }
                    c.contains(e) ? a.splice(b + d, 1) : d++
                }
                e = a[b + d]
            }
            b++, c = a[b]
        }
        return a
    };
    var d = {
        downwardLeftToRight: function(a, b) {
            return a.y - b.y || a.x - b.x
        },
        rightwardTopToBottom: function(a, b) {
            return a.x - b.x || a.y - b.y
        }
    };
    return b
}),
function(a, b) {
    "function" == typeof define && define.amd ? define("packery/js/item", ["outlayer/outlayer", "./rect"], b) : "object" == typeof module && module.exports ? module.exports = b(require("outlayer"), require("./rect")) : a.Packery.Item = b(a.Outlayer, a.Packery.Rect)
}(window, function(a, b) {
    var c = document.documentElement.style,
        d = "string" == typeof c.transform ? "transform" : "WebkitTransform",
        e = function() {
            a.Item.apply(this, arguments)
        },
        f = e.prototype = Object.create(a.Item.prototype),
        g = f._create;
    f._create = function() {
        g.call(this), this.rect = new b
    };
    var h = f.moveTo;
    return f.moveTo = function(a, b) {
        var c = Math.abs(this.position.x - a),
            d = Math.abs(this.position.y - b),
            e = this.layout.dragItemCount && !this.isPlacing && !this.isTransitioning && 1 > c && 1 > d;
        return e ? void this.goTo(a, b) : void h.apply(this, arguments)
    }, f.enablePlacing = function() {
        this.removeTransitionStyles(), this.isTransitioning && d && (this.element.style[d] = "none"), this.isTransitioning = !1, this.getSize(), this.layout._setRectSize(this.element, this.rect), this.isPlacing = !0
    }, f.disablePlacing = function() {
        this.isPlacing = !1
    }, f.removeElem = function() {
        this.element.parentNode.removeChild(this.element), this.layout.packer.addSpace(this.rect), this.emitEvent("remove", [this])
    }, f.showDropPlaceholder = function() {
        var a = this.dropPlaceholder;
        a || (a = this.dropPlaceholder = document.createElement("div"), a.className = "packery-drop-placeholder", a.style.position = "absolute"), a.style.width = this.size.width + "px", a.style.height = this.size.height + "px", this.positionDropPlaceholder(), this.layout.element.appendChild(a)
    }, f.positionDropPlaceholder = function() {
        this.dropPlaceholder.style[d] = "translate(" + this.rect.x + "px, " + this.rect.y + "px)"
    }, f.hideDropPlaceholder = function() {
        this.layout.element.removeChild(this.dropPlaceholder)
    }, e
}),
function(a, b) {
    "function" == typeof define && define.amd ? define("packery/js/packery", ["get-size/get-size", "outlayer/outlayer", "./rect", "./packer", "./item"], b) : "object" == typeof module && module.exports ? module.exports = b(require("get-size"), require("outlayer"), require("./rect"), require("./packer"), require("./item")) : a.Packery = b(a.getSize, a.Outlayer, a.Packery.Rect, a.Packery.Packer, a.Packery.Item)
}(window, function(a, b, c, d, e) {
    function f(a, b) {
        return a.position.y - b.position.y || a.position.x - b.position.x
    }

    function g(a, b) {
        return a.position.x - b.position.x || a.position.y - b.position.y
    }

    function h(a, b) {
        var c = b.x - a.x,
            d = b.y - a.y;
        return Math.sqrt(c * c + d * d)
    }
    c.prototype.canFit = function(a) {
        return this.width >= a.width - 1 && this.height >= a.height - 1
    };
    var i = b.create("packery");
    i.Item = e;
    var j = i.prototype;
    j._create = function() {
        b.prototype._create.call(this), this.packer = new d, this.shiftPacker = new d, this.isEnabled = !0, this.dragItemCount = 0;
        var a = this;
        this.handleDraggabilly = {
            dragStart: function() {
                a.itemDragStart(this.element)
            },
            dragMove: function() {
                a.itemDragMove(this.element, this.position.x, this.position.y)
            },
            dragEnd: function() {
                a.itemDragEnd(this.element)
            }
        }, this.handleUIDraggable = {
            start: function(b, c) {
                c && a.itemDragStart(b.currentTarget)
            },
            drag: function(b, c) {
                c && a.itemDragMove(b.currentTarget, c.position.left, c.position.top)
            },
            stop: function(b, c) {
                c && a.itemDragEnd(b.currentTarget)
            }
        }
    }, j._resetLayout = function() {
        this.getSize(), this._getMeasurements();
        var a, b, c;
        this._getOption("horizontal") ? (a = 1 / 0, b = this.size.innerHeight + this.gutter, c = "rightwardTopToBottom") : (a = this.size.innerWidth + this.gutter, b = 1 / 0, c = "downwardLeftToRight"), this.packer.width = this.shiftPacker.width = a, this.packer.height = this.shiftPacker.height = b, this.packer.sortDirection = this.shiftPacker.sortDirection = c, this.packer.reset(), this.maxY = 0, this.maxX = 0
    }, j._getMeasurements = function() {
        this._getMeasurement("columnWidth", "width"), this._getMeasurement("rowHeight", "height"), this._getMeasurement("gutter", "width")
    }, j._getItemLayoutPosition = function(a) {
        if (this._setRectSize(a.element, a.rect), this.isShifting || this.dragItemCount > 0) {
            var b = this._getPackMethod();
            this.packer[b](a.rect)
        } else this.packer.pack(a.rect);
        return this._setMaxXY(a.rect), a.rect
    }, j.shiftLayout = function() {
        this.isShifting = !0, this.layout(), delete this.isShifting
    }, j._getPackMethod = function() {
        return this._getOption("horizontal") ? "rowPack" : "columnPack"
    }, j._setMaxXY = function(a) {
        this.maxX = Math.max(a.x + a.width, this.maxX), this.maxY = Math.max(a.y + a.height, this.maxY)
    }, j._setRectSize = function(b, c) {
        var d = a(b),
            e = d.outerWidth,
            f = d.outerHeight;
        (e || f) && (e = this._applyGridGutter(e, this.columnWidth), f = this._applyGridGutter(f, this.rowHeight)), c.width = Math.min(e, this.packer.width), c.height = Math.min(f, this.packer.height)
    }, j._applyGridGutter = function(a, b) {
        if (!b) return a + this.gutter;
        b += this.gutter;
        var c = a % b,
            d = c && 1 > c ? "round" : "ceil";
        return a = Math[d](a / b) * b
    }, j._getContainerSize = function() {
        return this._getOption("horizontal") ? {
            width: this.maxX - this.gutter
        } : {
            height: this.maxY - this.gutter
        }
    }, j._manageStamp = function(a) {
        var b, d = this.getItem(a);
        if (d && d.isPlacing) b = d.rect;
        else {
            var e = this._getElementOffset(a);
            b = new c({
                x: this._getOption("originLeft") ? e.left : e.right,
                y: this._getOption("originTop") ? e.top : e.bottom
            })
        }
        this._setRectSize(a, b), this.packer.placed(b), this._setMaxXY(b)
    }, j.sortItemsByPosition = function() {
        var a = this._getOption("horizontal") ? g : f;
        this.items.sort(a)
    }, j.fit = function(a, b, c) {
        var d = this.getItem(a);
        d && (this.stamp(d.element), d.enablePlacing(), this.updateShiftTargets(d), b = void 0 === b ? d.rect.x : b, c = void 0 === c ? d.rect.y : c, this.shift(d, b, c), this._bindFitEvents(d), d.moveTo(d.rect.x, d.rect.y), this.shiftLayout(), this.unstamp(d.element), this.sortItemsByPosition(), d.disablePlacing())
    }, j._bindFitEvents = function(a) {
        function b() {
            d++, 2 == d && c.dispatchEvent("fitComplete", null, [a])
        }
        var c = this,
            d = 0;
        a.once("layout", b), this.once("layoutComplete", b)
    }, j.resize = function() {
        this.isResizeBound && this.needsResizeLayout() && (this.options.shiftPercentResize ? this.resizeShiftPercentLayout() : this.layout())
    }, j.needsResizeLayout = function() {
        var b = a(this.element),
            c = this._getOption("horizontal") ? "innerHeight" : "innerWidth";
        return b[c] != this.size[c]
    }, j.resizeShiftPercentLayout = function() {
        var b = this._getItemsForLayout(this.items),
            c = this._getOption("horizontal"),
            d = c ? "y" : "x",
            e = c ? "height" : "width",
            f = c ? "rowHeight" : "columnWidth",
            g = c ? "innerHeight" : "innerWidth",
            h = this[f];
        if (h = h && h + this.gutter) {
            this._getMeasurements();
            var i = this[f] + this.gutter;
            b.forEach(function(a) {
                var b = Math.round(a.rect[d] / h);
                a.rect[d] = b * i
            })
        } else {
            var j = a(this.element)[g] + this.gutter,
                k = this.packer[e];
            b.forEach(function(a) {
                a.rect[d] = a.rect[d] / k * j
            })
        }
        this.shiftLayout()
    }, j.itemDragStart = function(a) {
        if (this.isEnabled) {
            this.stamp(a);
            var b = this.getItem(a);
            b && (b.enablePlacing(), b.showDropPlaceholder(), this.dragItemCount++, this.updateShiftTargets(b))
        }
    }, j.updateShiftTargets = function(a) {
        this.shiftPacker.reset(), this._getBoundingRect();
        var b = this._getOption("originLeft"),
            d = this._getOption("originTop");
        this.stamps.forEach(function(a) {
            var e = this.getItem(a);
            if (!e || !e.isPlacing) {
                var f = this._getElementOffset(a),
                    g = new c({
                        x: b ? f.left : f.right,
                        y: d ? f.top : f.bottom
                    });
                this._setRectSize(a, g), this.shiftPacker.placed(g)
            }
        }, this);
        var e = this._getOption("horizontal"),
            f = e ? "rowHeight" : "columnWidth",
            g = e ? "height" : "width";
        this.shiftTargetKeys = [], this.shiftTargets = [];
        var h, i = this[f];
        if (i = i && i + this.gutter) {
            var j = Math.ceil(a.rect[g] / i),
                k = Math.floor((this.shiftPacker[g] + this.gutter) / i);
            h = (k - j) * i;
            for (var l = 0; k > l; l++) this._addShiftTarget(l * i, 0, h)
        } else h = this.shiftPacker[g] + this.gutter - a.rect[g], this._addShiftTarget(0, 0, h);
        var m = this._getItemsForLayout(this.items),
            n = this._getPackMethod();
        m.forEach(function(a) {
            var b = a.rect;
            this._setRectSize(a.element, b), this.shiftPacker[n](b), this._addShiftTarget(b.x, b.y, h);
            var c = e ? b.x + b.width : b.x,
                d = e ? b.y : b.y + b.height;
            if (this._addShiftTarget(c, d, h), i)
                for (var f = Math.round(b[g] / i), j = 1; f > j; j++) {
                    var k = e ? c : b.x + i * j,
                        l = e ? b.y + i * j : d;
                    this._addShiftTarget(k, l, h)
                }
        }, this)
    }, j._addShiftTarget = function(a, b, c) {
        var d = this._getOption("horizontal") ? b : a;
        if (!(0 !== d && d > c)) {
            var e = a + "," + b,
                f = -1 != this.shiftTargetKeys.indexOf(e);
            f || (this.shiftTargetKeys.push(e), this.shiftTargets.push({
                x: a,
                y: b
            }))
        }
    }, j.shift = function(a, b, c) {
        var d, e = 1 / 0,
            f = {
                x: b,
                y: c
            };
        this.shiftTargets.forEach(function(a) {
            var b = h(a, f);
            e > b && (d = a, e = b)
        }), a.rect.x = d.x, a.rect.y = d.y
    };
    var k = 120;
    j.itemDragMove = function(a, b, c) {
        function d() {
            f.shift(e, b, c), e.positionDropPlaceholder(), f.layout()
        }
        var e = this.isEnabled && this.getItem(a);
        if (e) {
            b -= this.size.paddingLeft, c -= this.size.paddingTop;
            var f = this,
                g = new Date;
            this._itemDragTime && g - this._itemDragTime < k ? (clearTimeout(this.dragTimeout), this.dragTimeout = setTimeout(d, k)) : (d(), this._itemDragTime = g)
        }
    }, j.itemDragEnd = function(a) {
        function b() {
            d++, 2 == d && (c.element.classList.remove("is-positioning-post-drag"), c.hideDropPlaceholder(), e.dispatchEvent("dragItemPositioned", null, [c]))
        }
        var c = this.isEnabled && this.getItem(a);
        if (c) {
            clearTimeout(this.dragTimeout), c.element.classList.add("is-positioning-post-drag");
            var d = 0,
                e = this;
            c.once("layout", b), this.once("layoutComplete", b), c.moveTo(c.rect.x, c.rect.y), this.layout(), this.dragItemCount = Math.max(0, this.dragItemCount - 1), this.sortItemsByPosition(), c.disablePlacing(), this.unstamp(c.element)
        }
    }, j.bindDraggabillyEvents = function(a) {
        this._bindDraggabillyEvents(a, "on")
    }, j.unbindDraggabillyEvents = function(a) {
        this._bindDraggabillyEvents(a, "off")
    }, j._bindDraggabillyEvents = function(a, b) {
        var c = this.handleDraggabilly;
        a[b]("dragStart", c.dragStart), a[b]("dragMove", c.dragMove), a[b]("dragEnd", c.dragEnd)
    }, j.bindUIDraggableEvents = function(a) {
        this._bindUIDraggableEvents(a, "on")
    }, j.unbindUIDraggableEvents = function(a) {
        this._bindUIDraggableEvents(a, "off")
    }, j._bindUIDraggableEvents = function(a, b) {
        var c = this.handleUIDraggable;
        a[b]("dragstart", c.start)[b]("drag", c.drag)[b]("dragstop", c.stop)
    };
    var l = j.destroy;
    return j.destroy = function() {
        l.apply(this, arguments), this.isEnabled = !1
    }, i.Rect = c, i.Packer = d, i
}),
function(a, b) {
    "function" == typeof define && define.amd ? define(["isotope/js/layout-mode", "packery/js/packery"], b) : "object" == typeof module && module.exports ? module.exports = b(require("isotope-layout/js/layout-mode"), require("packery")) : b(a.Isotope.LayoutMode, a.Packery)
}(window, function(a, b) {
    var c = a.create("packery"),
        d = c.prototype,
        e = {
            _getElementOffset: !0,
            _getMeasurement: !0
        };
    for (var f in b.prototype) e[f] || (d[f] = b.prototype[f]);
    var g = d._resetLayout;
    d._resetLayout = function() {
        this.packer = this.packer || new b.Packer, this.shiftPacker = this.shiftPacker || new b.Packer, g.apply(this, arguments)
    };
    var h = d._getItemLayoutPosition;
    d._getItemLayoutPosition = function(a) {
        return a.rect = a.rect || new b.Rect, h.call(this, a)
    };
    var i = d.needsResizeLayout;
    d.needsResizeLayout = function() {
        return this._getOption("horizontal") ? this.needsVerticalResizeLayout() : i.call(this)
    };
    var j = d._getOption;
    return d._getOption = function(a) {
        return "horizontal" == a ? void 0 !== this.options.isHorizontal ? this.options.isHorizontal : this.options.horizontal : j.apply(this.isotope, arguments)
    }, c
});;
(function($) {
    $.fn.stretch = function(opts) {
        opts = $.extend({}, $.fn.stretch.defaults, opts);
        if (!(opts.max >= 0) || !(opts.min >= 0))
            opts.min = opts.max = 0;
        this.each(function() {
            var container = $(this),
                contents = container.find("> .stretch--handle");
            if (!container.hasClass("stretch--resizer") || !contents) {
                contents = $(this).wrap("<span class='stretch--handle' />").parent();
                container = contents.wrap("<div class='stretch--resizer' />").parent();
                contents.css("margin", "0").css("padding", "0");
                container.css("margin", "0").css("padding", "0");
                container.css("white-space", "nowrap").css("overflow", "hidden");
            }
            var idealWidth = container.width(),
                width, min = opts.min || 1,
                max = min;
            if (!opts.max) {
                do {
                    min = max;
                    max *= 2;
                    container.css("font-size", max + "px");
                    var realWidth = contents.width();
                    width = realWidth <= width ? idealWidth : realWidth;
                } while (width < idealWidth);
            } else {
                max = opts.max;
                if (min == max)
                    container.css("font-size", max + "px");
            }
            if (width == idealWidth)
                return;
            while (min < max) {
                var c = Math.floor((min + max) / 2);
                container.css("font-size", c + "px");
                width = contents.width();
                if (width == idealWidth)
                    break;
                if (width < idealWidth)
                    min = c + 1;
                else
                    max = c;
            }
            if (width > idealWidth)
                container.css("font-size", (max - 1) + "px");
            var spacing = 0,
                origWidth = contents.width(),
                maxSpacing = opts.maxSpacing;
            do {
                spacing += 1;
                container.css("word-spacing", spacing + "px");
                width = contents.width();
            } while (spacing <= maxSpacing && width <= idealWidth && width > origWidth);
            container.css("word-spacing", (spacing - 1) + "px");
        });
        return this;
    };
    $.fn.stretch.defaults = {
        min: 0,
        max: 0,
        maxSpacing: 0
    };
})(jQuery);;
/*!
 * imagesLoaded PACKAGED v4.1.3
 * JavaScript is all like "You images are done yet or what?"
 * MIT License
 */
! function(e, t) {
    "function" == typeof define && define.amd ? define("ev-emitter/ev-emitter", t) : "object" == typeof module && module.exports ? module.exports = t() : e.EvEmitter = t()
}("undefined" != typeof window ? window : this, function() {
    function e() {}
    var t = e.prototype;
    return t.on = function(e, t) {
        if (e && t) {
            var i = this._events = this._events || {},
                n = i[e] = i[e] || [];
            return -1 == n.indexOf(t) && n.push(t), this
        }
    }, t.once = function(e, t) {
        if (e && t) {
            this.on(e, t);
            var i = this._onceEvents = this._onceEvents || {},
                n = i[e] = i[e] || {};
            return n[t] = !0, this
        }
    }, t.off = function(e, t) {
        var i = this._events && this._events[e];
        if (i && i.length) {
            var n = i.indexOf(t);
            return -1 != n && i.splice(n, 1), this
        }
    }, t.emitEvent = function(e, t) {
        var i = this._events && this._events[e];
        if (i && i.length) {
            var n = 0,
                o = i[n];
            t = t || [];
            for (var r = this._onceEvents && this._onceEvents[e]; o;) {
                var s = r && r[o];
                s && (this.off(e, o), delete r[o]), o.apply(this, t), n += s ? 0 : 1, o = i[n]
            }
            return this
        }
    }, t.allOff = t.removeAllListeners = function() {
        delete this._events, delete this._onceEvents
    }, e
}),
function(e, t) {
    "use strict";
    "function" == typeof define && define.amd ? define(["ev-emitter/ev-emitter"], function(i) {
        return t(e, i)
    }) : "object" == typeof module && module.exports ? module.exports = t(e, require("ev-emitter")) : e.imagesLoaded = t(e, e.EvEmitter)
}("undefined" != typeof window ? window : this, function(e, t) {
    function i(e, t) {
        for (var i in t) e[i] = t[i];
        return e
    }

    function n(e) {
        var t = [];
        if (Array.isArray(e)) t = e;
        else if ("number" == typeof e.length)
            for (var i = 0; i < e.length; i++) t.push(e[i]);
        else t.push(e);
        return t
    }

    function o(e, t, r) {
        return this instanceof o ? ("string" == typeof e && (e = document.querySelectorAll(e)), this.elements = n(e), this.options = i({}, this.options), "function" == typeof t ? r = t : i(this.options, t), r && this.on("always", r), this.getImages(), h && (this.jqDeferred = new h.Deferred), void setTimeout(function() {
            this.check()
        }.bind(this))) : new o(e, t, r)
    }

    function r(e) {
        this.img = e
    }

    function s(e, t) {
        this.url = e, this.element = t, this.img = new Image
    }
    var h = e.jQuery,
        a = e.console;
    o.prototype = Object.create(t.prototype), o.prototype.options = {}, o.prototype.getImages = function() {
        this.images = [], this.elements.forEach(this.addElementImages, this)
    }, o.prototype.addElementImages = function(e) {
        "IMG" == e.nodeName && this.addImage(e), this.options.background === !0 && this.addElementBackgroundImages(e);
        var t = e.nodeType;
        if (t && d[t]) {
            for (var i = e.querySelectorAll("img"), n = 0; n < i.length; n++) {
                var o = i[n];
                this.addImage(o)
            }
            if ("string" == typeof this.options.background) {
                var r = e.querySelectorAll(this.options.background);
                for (n = 0; n < r.length; n++) {
                    var s = r[n];
                    this.addElementBackgroundImages(s)
                }
            }
        }
    };
    var d = {
        1: !0,
        9: !0,
        11: !0
    };
    return o.prototype.addElementBackgroundImages = function(e) {
        var t = getComputedStyle(e);
        if (t)
            for (var i = /url\((['"])?(.*?)\1\)/gi, n = i.exec(t.backgroundImage); null !== n;) {
                var o = n && n[2];
                o && this.addBackground(o, e), n = i.exec(t.backgroundImage)
            }
    }, o.prototype.addImage = function(e) {
        var t = new r(e);
        this.images.push(t)
    }, o.prototype.addBackground = function(e, t) {
        var i = new s(e, t);
        this.images.push(i)
    }, o.prototype.check = function() {
        function e(e, i, n) {
            setTimeout(function() {
                t.progress(e, i, n)
            })
        }
        var t = this;
        return this.progressedCount = 0, this.hasAnyBroken = !1, this.images.length ? void this.images.forEach(function(t) {
            t.once("progress", e), t.check()
        }) : void this.complete()
    }, o.prototype.progress = function(e, t, i) {
        this.progressedCount++, this.hasAnyBroken = this.hasAnyBroken || !e.isLoaded, this.emitEvent("progress", [this, e, t]), this.jqDeferred && this.jqDeferred.notify && this.jqDeferred.notify(this, e), this.progressedCount == this.images.length && this.complete(), this.options.debug && a && a.log("progress: " + i, e, t)
    }, o.prototype.complete = function() {
        var e = this.hasAnyBroken ? "fail" : "done";
        if (this.isComplete = !0, this.emitEvent(e, [this]), this.emitEvent("always", [this]), this.jqDeferred) {
            var t = this.hasAnyBroken ? "reject" : "resolve";
            this.jqDeferred[t](this)
        }
    }, r.prototype = Object.create(t.prototype), r.prototype.check = function() {
        var e = this.getIsImageComplete();
        return e ? void this.confirm(0 !== this.img.naturalWidth, "naturalWidth") : (this.proxyImage = new Image, this.proxyImage.addEventListener("load", this), this.proxyImage.addEventListener("error", this), this.img.addEventListener("load", this), this.img.addEventListener("error", this), void(this.proxyImage.src = this.img.src))
    }, r.prototype.getIsImageComplete = function() {
        return this.img.complete && void 0 !== this.img.naturalWidth
    }, r.prototype.confirm = function(e, t) {
        this.isLoaded = e, this.emitEvent("progress", [this, this.img, t])
    }, r.prototype.handleEvent = function(e) {
        var t = "on" + e.type;
        this[t] && this[t](e)
    }, r.prototype.onload = function() {
        this.confirm(!0, "onload"), this.unbindEvents()
    }, r.prototype.onerror = function() {
        this.confirm(!1, "onerror"), this.unbindEvents()
    }, r.prototype.unbindEvents = function() {
        this.proxyImage.removeEventListener("load", this), this.proxyImage.removeEventListener("error", this), this.img.removeEventListener("load", this), this.img.removeEventListener("error", this)
    }, s.prototype = Object.create(r.prototype), s.prototype.check = function() {
        this.img.addEventListener("load", this), this.img.addEventListener("error", this), this.img.src = this.url;
        var e = this.getIsImageComplete();
        e && (this.confirm(0 !== this.img.naturalWidth, "naturalWidth"), this.unbindEvents())
    }, s.prototype.unbindEvents = function() {
        this.img.removeEventListener("load", this), this.img.removeEventListener("error", this)
    }, s.prototype.confirm = function(e, t) {
        this.isLoaded = e, this.emitEvent("progress", [this, this.element, t])
    }, o.makeJQueryPlugin = function(t) {
        t = t || e.jQuery, t && (h = t, h.fn.imagesLoaded = function(e, t) {
            var i = new o(this, e, t);
            return i.jqDeferred.promise(h(this))
        })
    }, o.makeJQueryPlugin(), o
});; /*! rangeslider.js - v2.3.0 | (c) 2016 @andreruffert | MIT license | https://github.com/andreruffert/rangeslider.js */
! function(a) {
    "use strict";
    "function" == typeof define && define.amd ? define(["jquery"], a) : "object" == typeof exports ? module.exports = a(require("jquery")) : a(jQuery)
}(function(a) {
    "use strict";

    function b() {
        var a = document.createElement("input");
        return a.setAttribute("type", "range"), "text" !== a.type
    }

    function c(a, b) {
        var c = Array.prototype.slice.call(arguments, 2);
        return setTimeout(function() {
            return a.apply(null, c)
        }, b)
    }

    function d(a, b) {
        return b = b || 100,
            function() {
                if (!a.debouncing) {
                    var c = Array.prototype.slice.apply(arguments);
                    a.lastReturnVal = a.apply(window, c), a.debouncing = !0
                }
                return clearTimeout(a.debounceTimeout), a.debounceTimeout = setTimeout(function() {
                    a.debouncing = !1
                }, b), a.lastReturnVal
            }
    }

    function e(a) {
        return a && (0 === a.offsetWidth || 0 === a.offsetHeight || a.open === !1)
    }

    function f(a) {
        for (var b = [], c = a.parentNode; e(c);) b.push(c), c = c.parentNode;
        return b
    }

    function g(a, b) {
        function c(a) {
            "undefined" != typeof a.open && (a.open = !a.open)
        }
        var d = f(a),
            e = d.length,
            g = [],
            h = a[b];
        if (e) {
            for (var i = 0; i < e; i++) g[i] = d[i].style.cssText, d[i].style.setProperty ? d[i].style.setProperty("display", "block", "important") : d[i].style.cssText += ";display: block !important", d[i].style.height = "0", d[i].style.overflow = "hidden", d[i].style.visibility = "hidden", c(d[i]);
            h = a[b];
            for (var j = 0; j < e; j++) d[j].style.cssText = g[j], c(d[j])
        }
        return h
    }

    function h(a, b) {
        var c = parseFloat(a);
        return Number.isNaN(c) ? b : c
    }

    function i(a) {
        return a.charAt(0).toUpperCase() + a.substr(1)
    }

    function j(b, e) {
        if (this.$window = a(window), this.$document = a(document), this.$element = a(b), this.options = a.extend({}, n, e), this.polyfill = this.options.polyfill, this.orientation = this.$element[0].getAttribute("data-orientation") || this.options.orientation, this.onInit = this.options.onInit, this.onSlide = this.options.onSlide, this.onSlideEnd = this.options.onSlideEnd, this.DIMENSION = o.orientation[this.orientation].dimension, this.DIRECTION = o.orientation[this.orientation].direction, this.DIRECTION_STYLE = o.orientation[this.orientation].directionStyle, this.COORDINATE = o.orientation[this.orientation].coordinate, this.polyfill && m) return !1;
        this.identifier = "js-" + k + "-" + l++, this.startEvent = this.options.startEvent.join("." + this.identifier + " ") + "." + this.identifier, this.moveEvent = this.options.moveEvent.join("." + this.identifier + " ") + "." + this.identifier, this.endEvent = this.options.endEvent.join("." + this.identifier + " ") + "." + this.identifier, this.toFixed = (this.step + "").replace(".", "").length - 1, this.$fill = a('<div class="' + this.options.fillClass + '" />'), this.$handle = a('<div class="' + this.options.handleClass + '" />'), this.$range = a('<div class="' + this.options.rangeClass + " " + this.options[this.orientation + "Class"] + '" id="' + this.identifier + '" />').insertAfter(this.$element).prepend(this.$fill, this.$handle), this.$element.css({
            position: "absolute",
            width: "1px",
            height: "1px",
            overflow: "hidden",
            opacity: "0"
        }), this.handleDown = a.proxy(this.handleDown, this), this.handleMove = a.proxy(this.handleMove, this), this.handleEnd = a.proxy(this.handleEnd, this), this.init();
        var f = this;
        this.$window.on("resize." + this.identifier, d(function() {
            c(function() {
                f.update(!1, !1)
            }, 300)
        }, 20)), this.$document.on(this.startEvent, "#" + this.identifier + ":not(." + this.options.disabledClass + ")", this.handleDown), this.$element.on("change." + this.identifier, function(a, b) {
            if (!b || b.origin !== f.identifier) {
                var c = a.target.value,
                    d = f.getPositionFromValue(c);
                f.setPosition(d)
            }
        })
    }
    Number.isNaN = Number.isNaN || function(a) {
        return "number" == typeof a && a !== a
    };
    var k = "rangeslider",
        l = 0,
        m = b(),
        n = {
            polyfill: !0,
            orientation: "horizontal",
            rangeClass: "rangeslider",
            disabledClass: "rangeslider--disabled",
            activeClass: "rangeslider--active",
            horizontalClass: "rangeslider--horizontal",
            verticalClass: "rangeslider--vertical",
            fillClass: "rangeslider__fill",
            handleClass: "rangeslider__handle",
            startEvent: ["mousedown", "touchstart", "pointerdown"],
            moveEvent: ["mousemove", "touchmove", "pointermove"],
            endEvent: ["mouseup", "touchend", "pointerup"]
        },
        o = {
            orientation: {
                horizontal: {
                    dimension: "width",
                    direction: "left",
                    directionStyle: "left",
                    coordinate: "x"
                },
                vertical: {
                    dimension: "height",
                    direction: "top",
                    directionStyle: "bottom",
                    coordinate: "y"
                }
            }
        };
    return j.prototype.init = function() {
        this.update(!0, !1), this.onInit && "function" == typeof this.onInit && this.onInit()
    }, j.prototype.update = function(a, b) {
        a = a || !1, a && (this.min = h(this.$element[0].getAttribute("min"), 0), this.max = h(this.$element[0].getAttribute("max"), 100), this.value = h(this.$element[0].value, Math.round(this.min + (this.max - this.min) / 2)), this.step = h(this.$element[0].getAttribute("step"), 1)), this.handleDimension = g(this.$handle[0], "offset" + i(this.DIMENSION)), this.rangeDimension = g(this.$range[0], "offset" + i(this.DIMENSION)), this.maxHandlePos = this.rangeDimension - this.handleDimension, this.grabPos = this.handleDimension / 2, this.position = this.getPositionFromValue(this.value), this.$element[0].disabled ? this.$range.addClass(this.options.disabledClass) : this.$range.removeClass(this.options.disabledClass), this.setPosition(this.position, b)
    }, j.prototype.handleDown = function(a) {
        if (a.preventDefault(), this.$document.on(this.moveEvent, this.handleMove), this.$document.on(this.endEvent, this.handleEnd), this.$range.addClass(this.options.activeClass), !((" " + a.target.className + " ").replace(/[\n\t]/g, " ").indexOf(this.options.handleClass) > -1)) {
            var b = this.getRelativePosition(a),
                c = this.$range[0].getBoundingClientRect()[this.DIRECTION],
                d = this.getPositionFromNode(this.$handle[0]) - c,
                e = "vertical" === this.orientation ? this.maxHandlePos - (b - this.grabPos) : b - this.grabPos;
            this.setPosition(e), b >= d && b < d + this.handleDimension && (this.grabPos = b - d)
        }
    }, j.prototype.handleMove = function(a) {
        a.preventDefault();
        var b = this.getRelativePosition(a),
            c = "vertical" === this.orientation ? this.maxHandlePos - (b - this.grabPos) : b - this.grabPos;
        this.setPosition(c)
    }, j.prototype.handleEnd = function(a) {
        a.preventDefault(), this.$document.off(this.moveEvent, this.handleMove), this.$document.off(this.endEvent, this.handleEnd), this.$range.removeClass(this.options.activeClass), this.$element.trigger("change", {
            origin: this.identifier
        }), this.onSlideEnd && "function" == typeof this.onSlideEnd && this.onSlideEnd(this.position, this.value)
    }, j.prototype.cap = function(a, b, c) {
        return a < b ? b : a > c ? c : a
    }, j.prototype.setPosition = function(a, b) {
        var c, d;
        void 0 === b && (b = !0), c = this.getValueFromPosition(this.cap(a, 0, this.maxHandlePos)), d = this.getPositionFromValue(c), this.$fill[0].style[this.DIMENSION] = d + this.grabPos + "px", this.$handle[0].style[this.DIRECTION_STYLE] = d + "px", this.setValue(c), this.position = d, this.value = c, b && this.onSlide && "function" == typeof this.onSlide && this.onSlide(d, c)
    }, j.prototype.getPositionFromNode = function(a) {
        for (var b = 0; null !== a;) b += a.offsetLeft, a = a.offsetParent;
        return b
    }, j.prototype.getRelativePosition = function(a) {
        var b = i(this.COORDINATE),
            c = this.$range[0].getBoundingClientRect()[this.DIRECTION],
            d = 0;
        return "undefined" != typeof a.originalEvent["client" + b] ? d = a.originalEvent["client" + b] : a.originalEvent.touches && a.originalEvent.touches[0] && "undefined" != typeof a.originalEvent.touches[0]["client" + b] ? d = a.originalEvent.touches[0]["client" + b] : a.currentPoint && "undefined" != typeof a.currentPoint[this.COORDINATE] && (d = a.currentPoint[this.COORDINATE]), d - c
    }, j.prototype.getPositionFromValue = function(a) {
        var b, c;
        return b = (a - this.min) / (this.max - this.min), c = Number.isNaN(b) ? 0 : b * this.maxHandlePos
    }, j.prototype.getValueFromPosition = function(a) {
        var b, c;
        return b = a / (this.maxHandlePos || 1), c = this.step * Math.round(b * (this.max - this.min) / this.step) + this.min, Number(c.toFixed(this.toFixed))
    }, j.prototype.setValue = function(a) {
        a === this.value && "" !== this.$element[0].value || this.$element.val(a).trigger("input", {
            origin: this.identifier
        })
    }, j.prototype.destroy = function() {
        this.$document.off("." + this.identifier), this.$window.off("." + this.identifier), this.$element.off("." + this.identifier).removeAttr("style").removeData("plugin_" + k), this.$range && this.$range.length && this.$range[0].parentNode.removeChild(this.$range[0])
    }, a.fn[k] = function(b) {
        var c = Array.prototype.slice.call(arguments, 1);
        return this.each(function() {
            var d = a(this),
                e = d.data("plugin_" + k);
            e || d.data("plugin_" + k, e = new j(this, b)), "string" == typeof b && e[b].apply(e, c)
        })
    }, "rangeslider.js is available in jQuery context e.g $(selector).rangeslider(options);"
});;
(function(module) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], module);
    } else {
        module(jQuery);
    }
})(function(jQuery, undefined) {
    var
        threshold = 6,
        add = jQuery.event.add,
        remove = jQuery.event.remove,
        trigger = function(node, type, data) {
            jQuery.event.trigger(type, data, node);
        },
        requestFrame = (function() {
            return (window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(fn, element) {
                return window.setTimeout(function() {
                    fn();
                }, 25);
            });
        })(),
        ignoreTags = {
            textarea: true,
            input: true,
            select: true,
            button: true
        },
        mouseevents = {
            move: 'mousemove',
            cancel: 'mouseup dragstart',
            end: 'mouseup'
        },
        touchevents = {
            move: 'touchmove',
            cancel: 'touchend',
            end: 'touchend'
        };

    function Timer(fn) {
        var callback = fn,
            active = false,
            running = false;

        function trigger(time) {
            if (active) {
                callback();
                requestFrame(trigger);
                running = true;
                active = false;
            } else {
                running = false;
            }
        }
        this.kick = function(fn) {
            active = true;
            if (!running) {
                trigger();
            }
        };
        this.end = function(fn) {
            var cb = callback;
            if (!fn) {
                return;
            }
            if (!running) {
                fn();
            } else {
                callback = active ? function() {
                    cb();
                    fn();
                } : fn;
                active = true;
            }
        };
    }

    function returnTrue() {
        return true;
    }

    function returnFalse() {
        return false;
    }

    function preventDefault(e) {
        e.preventDefault();
    }

    function preventIgnoreTags(e) {
        if (ignoreTags[e.target.tagName.toLowerCase()]) {
            return;
        }
        e.preventDefault();
    }

    function isLeftButton(e) {
        return (e.which === 1 && !e.ctrlKey && !e.altKey);
    }

    function identifiedTouch(touchList, id) {
        var i, l;
        if (touchList.identifiedTouch) {
            return touchList.identifiedTouch(id);
        }
        i = -1;
        l = touchList.length;
        while (++i < l) {
            if (touchList[i].identifier === id) {
                return touchList[i];
            }
        }
    }

    function changedTouch(e, event) {
        var touch = identifiedTouch(e.changedTouches, event.identifier);
        if (!touch) {
            return;
        }
        if (touch.pageX === event.pageX && touch.pageY === event.pageY) {
            return;
        }
        return touch;
    }

    function mousedown(e) {
        var data;
        if (!isLeftButton(e)) {
            return;
        }
        data = {
            target: e.target,
            startX: e.pageX,
            startY: e.pageY,
            timeStamp: e.timeStamp
        };
        add(document, mouseevents.move, mousemove, data);
        add(document, mouseevents.cancel, mouseend, data);
    }

    function mousemove(e) {
        var data = e.data;
        checkThreshold(e, data, e, removeMouse);
    }

    function mouseend(e) {
        removeMouse();
    }

    function removeMouse() {
        remove(document, mouseevents.move, mousemove);
        remove(document, mouseevents.cancel, mouseend);
    }

    function touchstart(e) {
        var touch, template;
        if (ignoreTags[e.target.tagName.toLowerCase()]) {
            return;
        }
        touch = e.changedTouches[0];
        template = {
            target: touch.target,
            startX: touch.pageX,
            startY: touch.pageY,
            timeStamp: e.timeStamp,
            identifier: touch.identifier
        };
        add(document, touchevents.move + '.' + touch.identifier, touchmove, template);
        add(document, touchevents.cancel + '.' + touch.identifier, touchend, template);
    }

    function touchmove(e) {
        var data = e.data,
            touch = changedTouch(e, data);
        if (!touch) {
            return;
        }
        checkThreshold(e, data, touch, removeTouch);
    }

    function touchend(e) {
        var template = e.data,
            touch = identifiedTouch(e.changedTouches, template.identifier);
        if (!touch) {
            return;
        }
        removeTouch(template.identifier);
    }

    function removeTouch(identifier) {
        remove(document, '.' + identifier, touchmove);
        remove(document, '.' + identifier, touchend);
    }

    function checkThreshold(e, template, touch, fn) {
        var distX = touch.pageX - template.startX,
            distY = touch.pageY - template.startY;
        if ((distX * distX) + (distY * distY) < (threshold * threshold)) {
            return;
        }
        triggerStart(e, template, touch, distX, distY, fn);
    }

    function handled() {
        this._handled = returnTrue;
        return false;
    }

    function flagAsHandled(e) {
        e._handled();
    }

    function triggerStart(e, template, touch, distX, distY, fn) {
        var node = template.target,
            touches, time;
        touches = e.targetTouches;
        time = e.timeStamp - template.timeStamp;
        template.type = 'movestart';
        template.distX = distX;
        template.distY = distY;
        template.deltaX = distX;
        template.deltaY = distY;
        template.pageX = touch.pageX;
        template.pageY = touch.pageY;
        template.velocityX = distX / time;
        template.velocityY = distY / time;
        template.targetTouches = touches;
        template.finger = touches ? touches.length : 1;
        template._handled = handled;
        template._preventTouchmoveDefault = function() {
            e.preventDefault();
        };
        trigger(template.target, template);
        fn(template.identifier);
    }

    function activeMousemove(e) {
        var timer = e.data.timer;
        e.data.touch = e;
        e.data.timeStamp = e.timeStamp;
        timer.kick();
    }

    function activeMouseend(e) {
        var event = e.data.event,
            timer = e.data.timer;
        removeActiveMouse();
        endEvent(event, timer, function() {
            setTimeout(function() {
                remove(event.target, 'click', returnFalse);
            }, 0);
        });
    }

    function removeActiveMouse(event) {
        remove(document, mouseevents.move, activeMousemove);
        remove(document, mouseevents.end, activeMouseend);
    }

    function activeTouchmove(e) {
        var event = e.data.event,
            timer = e.data.timer,
            touch = changedTouch(e, event);
        if (!touch) {
            return;
        }
        e.preventDefault();
        event.targetTouches = e.targetTouches;
        e.data.touch = touch;
        e.data.timeStamp = e.timeStamp;
        timer.kick();
    }

    function activeTouchend(e) {
        var event = e.data.event,
            timer = e.data.timer,
            touch = identifiedTouch(e.changedTouches, event.identifier);
        if (!touch) {
            return;
        }
        removeActiveTouch(event);
        endEvent(event, timer);
    }

    function removeActiveTouch(event) {
        remove(document, '.' + event.identifier, activeTouchmove);
        remove(document, '.' + event.identifier, activeTouchend);
    }

    function updateEvent(event, touch, timeStamp, timer) {
        var time = timeStamp - event.timeStamp;
        event.type = 'move';
        event.distX = touch.pageX - event.startX;
        event.distY = touch.pageY - event.startY;
        event.deltaX = touch.pageX - event.pageX;
        event.deltaY = touch.pageY - event.pageY;
        event.velocityX = 0.3 * event.velocityX + 0.7 * event.deltaX / time;
        event.velocityY = 0.3 * event.velocityY + 0.7 * event.deltaY / time;
        event.pageX = touch.pageX;
        event.pageY = touch.pageY;
    }

    function endEvent(event, timer, fn) {
        timer.end(function() {
            event.type = 'moveend';
            trigger(event.target, event);
            return fn && fn();
        });
    }

    function setup(data, namespaces, eventHandle) {
        add(this, 'movestart.move', flagAsHandled);
        return true;
    }

    function teardown(namespaces) {
        remove(this, 'dragstart drag', preventDefault);
        remove(this, 'mousedown touchstart', preventIgnoreTags);
        remove(this, 'movestart', flagAsHandled);
        return true;
    }

    function addMethod(handleObj) {
        if (handleObj.namespace === "move" || handleObj.namespace === "moveend") {
            return;
        }
        add(this, 'dragstart.' + handleObj.guid + ' drag.' + handleObj.guid, preventDefault, undefined, handleObj.selector);
        add(this, 'mousedown.' + handleObj.guid, preventIgnoreTags, undefined, handleObj.selector);
    }

    function removeMethod(handleObj) {
        if (handleObj.namespace === "move" || handleObj.namespace === "moveend") {
            return;
        }
        remove(this, 'dragstart.' + handleObj.guid + ' drag.' + handleObj.guid);
        remove(this, 'mousedown.' + handleObj.guid);
    }
    jQuery.event.special.movestart = {
        setup: setup,
        teardown: teardown,
        add: addMethod,
        remove: removeMethod,
        _default: function(e) {
            var event, data;
            if (!e._handled()) {
                return;
            }

            function update(time) {
                updateEvent(event, data.touch, data.timeStamp);
                trigger(e.target, event);
            }
            event = {
                target: e.target,
                startX: e.startX,
                startY: e.startY,
                pageX: e.pageX,
                pageY: e.pageY,
                distX: e.distX,
                distY: e.distY,
                deltaX: e.deltaX,
                deltaY: e.deltaY,
                velocityX: e.velocityX,
                velocityY: e.velocityY,
                timeStamp: e.timeStamp,
                identifier: e.identifier,
                targetTouches: e.targetTouches,
                finger: e.finger
            };
            data = {
                event: event,
                timer: new Timer(update),
                touch: undefined,
                timeStamp: undefined
            };
            if (e.identifier === undefined) {
                add(e.target, 'click', returnFalse);
                add(document, mouseevents.move, activeMousemove, data);
                add(document, mouseevents.end, activeMouseend, data);
            } else {
                e._preventTouchmoveDefault();
                add(document, touchevents.move + '.' + e.identifier, activeTouchmove, data);
                add(document, touchevents.end + '.' + e.identifier, activeTouchend, data);
            }
        }
    };
    jQuery.event.special.move = {
        setup: function() {
            add(this, 'movestart.move', jQuery.noop);
        },
        teardown: function() {
            remove(this, 'movestart.move', jQuery.noop);
        }
    };
    jQuery.event.special.moveend = {
        setup: function() {
            add(this, 'movestart.moveend', jQuery.noop);
        },
        teardown: function() {
            remove(this, 'movestart.moveend', jQuery.noop);
        }
    };
    add(document, 'mousedown.move', mousedown);
    add(document, 'touchstart.move', touchstart);
    if (typeof Array.prototype.indexOf === 'function') {
        (function(jQuery, undefined) {
            var props = ["changedTouches", "targetTouches"],
                l = props.length;
            while (l--) {
                if (jQuery.event.props.indexOf(props[l]) === -1) {
                    jQuery.event.props.push(props[l]);
                }
            }
        })(jQuery);
    };
});;
(function($) {
    $.fn.twentytwenty = function(options) {
        var options = $.extend({
            default_offset_pct: 0.5,
            orientation: 'horizontal'
        }, options);
        return this.each(function() {
            var sliderPct = options.default_offset_pct;
            var container = $(this);
            var sliderOrientation = options.orientation;
            var beforeDirection = (sliderOrientation === 'vertical') ? 'down' : 'left';
            var afterDirection = (sliderOrientation === 'vertical') ? 'up' : 'right';
            container.wrap("<div class='twentytwenty-wrapper twentytwenty-" + sliderOrientation + "'></div>");
            container.append("<div class='twentytwenty-overlay'></div>");
            var beforeImg = container.find("img:first");
            var afterImg = container.find("img:last");
            container.append("<div class='twentytwenty-handle'></div>");
            var slider = container.find(".twentytwenty-handle");
            slider.append("<span class='twentytwenty-" + beforeDirection + "-arrow'></span>");
            slider.append("<span class='twentytwenty-" + afterDirection + "-arrow'></span>");
            container.addClass("twentytwenty-container");
            beforeImg.addClass("twentytwenty-before");
            afterImg.addClass("twentytwenty-after");
            var overlay = container.find(".twentytwenty-overlay");
            overlay.append("<div class='twentytwenty-before-label'></div>");
            overlay.append("<div class='twentytwenty-after-label'></div>");
            var calcOffset = function(dimensionPct) {
                var w = beforeImg.width();
                var h = beforeImg.height();
                return {
                    w: w + "px",
                    h: h + "px",
                    cw: (dimensionPct * w) + "px",
                    ch: (dimensionPct * h) + "px"
                };
            };
            var adjustContainer = function(offset) {
                if (sliderOrientation === 'vertical') {
                    beforeImg.css("clip", "rect(0," + offset.w + "," + offset.ch + ",0)");
                } else {
                    beforeImg.css("clip", "rect(0," + offset.cw + "," + offset.h + ",0)");
                }
                container.css("height", offset.h);
            };
            var adjustSlider = function(pct) {
                var offset = calcOffset(pct);
                slider.css((sliderOrientation === "vertical") ? "top" : "left", (sliderOrientation === "vertical") ? offset.ch : offset.cw);
                adjustContainer(offset);
            }
            $(window).on("resize.twentytwenty", function(e) {
                adjustSlider(sliderPct);
            });
            var offsetX = 0;
            var offsetY = 0;
            var imgWidth = 0;
            var imgHeight = 0;
            slider.on("movestart", function(e) {
                if (((e.distX > e.distY && e.distX < -e.distY) || (e.distX < e.distY && e.distX > -e.distY)) && sliderOrientation !== 'vertical') {
                    e.preventDefault();
                } else if (((e.distX < e.distY && e.distX < -e.distY) || (e.distX > e.distY && e.distX > -e.distY)) && sliderOrientation === 'vertical') {
                    e.preventDefault();
                }
                container.addClass("active");
                offsetX = container.offset().left;
                offsetY = container.offset().top;
                imgWidth = beforeImg.width();
                imgHeight = beforeImg.height();
            });
            slider.on("moveend", function(e) {
                container.removeClass("active");
            });
            slider.on("move", function(e) {
                if (container.hasClass("active")) {
                    sliderPct = (sliderOrientation === 'vertical') ? (e.pageY - offsetY) / imgHeight : (e.pageX - offsetX) / imgWidth;
                    if (sliderPct < 0) {
                        sliderPct = 0;
                    }
                    if (sliderPct > 1) {
                        sliderPct = 1;
                    }
                    adjustSlider(sliderPct);
                }
            });
            container.find("img").on("mousedown", function(event) {
                event.preventDefault();
            });
            $(window).trigger("resize.twentytwenty");
        });
    };
})(jQuery);;
/**
 * Swiper 5.3.6
 * Most modern mobile touch slider and framework with hardware accelerated transitions
 * http://swiperjs.com
 *
 * Copyright 2014-2020 Vladimir Kharlampidi
 *
 * Released under the MIT License
 *
 * Released on: February 29, 2020
 */

! function(e, t) {
    "object" == typeof exports && "undefined" != typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define(t) : (e = e || self).Swiper = t()
}(this, (function() {
    "use strict";
    var e = "undefined" == typeof document ? {
            body: {},
            addEventListener: function() {},
            removeEventListener: function() {},
            activeElement: {
                blur: function() {},
                nodeName: ""
            },
            querySelector: function() {
                return null
            },
            querySelectorAll: function() {
                return []
            },
            getElementById: function() {
                return null
            },
            createEvent: function() {
                return {
                    initEvent: function() {}
                }
            },
            createElement: function() {
                return {
                    children: [],
                    childNodes: [],
                    style: {},
                    setAttribute: function() {},
                    getElementsByTagName: function() {
                        return []
                    }
                }
            },
            location: {
                hash: ""
            }
        } : document,
        t = "undefined" == typeof window ? {
            document: e,
            navigator: {
                userAgent: ""
            },
            location: {},
            history: {},
            CustomEvent: function() {
                return this
            },
            addEventListener: function() {},
            removeEventListener: function() {},
            getComputedStyle: function() {
                return {
                    getPropertyValue: function() {
                        return ""
                    }
                }
            },
            Image: function() {},
            Date: function() {},
            screen: {},
            setTimeout: function() {},
            clearTimeout: function() {}
        } : window,
        i = function(e) {
            for (var t = 0; t < e.length; t += 1) this[t] = e[t];
            return this.length = e.length, this
        };

    function s(s, a) {
        var r = [],
            n = 0;
        if (s && !a && s instanceof i) return s;
        if (s)
            if ("string" == typeof s) {
                var o, l, d = s.trim();
                if (d.indexOf("<") >= 0 && d.indexOf(">") >= 0) {
                    var h = "div";
                    for (0 === d.indexOf("<li") && (h = "ul"), 0 === d.indexOf("<tr") && (h = "tbody"), 0 !== d.indexOf("<td") && 0 !== d.indexOf("<th") || (h = "tr"), 0 === d.indexOf("<tbody") && (h = "table"), 0 === d.indexOf("<option") && (h = "select"), (l = e.createElement(h)).innerHTML = d, n = 0; n < l.childNodes.length; n += 1) r.push(l.childNodes[n])
                } else
                    for (o = a || "#" !== s[0] || s.match(/[ .<>:~]/) ? (a || e).querySelectorAll(s.trim()) : [e.getElementById(s.trim().split("#")[1])], n = 0; n < o.length; n += 1) o[n] && r.push(o[n])
            } else if (s.nodeType || s === t || s === e) r.push(s);
        else if (s.length > 0 && s[0].nodeType)
            for (n = 0; n < s.length; n += 1) r.push(s[n]);
        return new i(r)
    }

    function a(e) {
        for (var t = [], i = 0; i < e.length; i += 1) - 1 === t.indexOf(e[i]) && t.push(e[i]);
        return t
    }
    s.fn = i.prototype, s.Class = i, s.Dom7 = i;
    var r = {
        addClass: function(e) {
            if (void 0 === e) return this;
            for (var t = e.split(" "), i = 0; i < t.length; i += 1)
                for (var s = 0; s < this.length; s += 1) void 0 !== this[s] && void 0 !== this[s].classList && this[s].classList.add(t[i]);
            return this
        },
        removeClass: function(e) {
            for (var t = e.split(" "), i = 0; i < t.length; i += 1)
                for (var s = 0; s < this.length; s += 1) void 0 !== this[s] && void 0 !== this[s].classList && this[s].classList.remove(t[i]);
            return this
        },
        hasClass: function(e) {
            return !!this[0] && this[0].classList.contains(e)
        },
        toggleClass: function(e) {
            for (var t = e.split(" "), i = 0; i < t.length; i += 1)
                for (var s = 0; s < this.length; s += 1) void 0 !== this[s] && void 0 !== this[s].classList && this[s].classList.toggle(t[i]);
            return this
        },
        attr: function(e, t) {
            var i = arguments;
            if (1 === arguments.length && "string" == typeof e) return this[0] ? this[0].getAttribute(e) : void 0;
            for (var s = 0; s < this.length; s += 1)
                if (2 === i.length) this[s].setAttribute(e, t);
                else
                    for (var a in e) this[s][a] = e[a], this[s].setAttribute(a, e[a]);
            return this
        },
        removeAttr: function(e) {
            for (var t = 0; t < this.length; t += 1) this[t].removeAttribute(e);
            return this
        },
        data: function(e, t) {
            var i;
            if (void 0 !== t) {
                for (var s = 0; s < this.length; s += 1)(i = this[s]).dom7ElementDataStorage || (i.dom7ElementDataStorage = {}), i.dom7ElementDataStorage[e] = t;
                return this
            }
            if (i = this[0]) {
                if (i.dom7ElementDataStorage && e in i.dom7ElementDataStorage) return i.dom7ElementDataStorage[e];
                var a = i.getAttribute("data-" + e);
                return a || void 0
            }
        },
        transform: function(e) {
            for (var t = 0; t < this.length; t += 1) {
                var i = this[t].style;
                i.webkitTransform = e, i.transform = e
            }
            return this
        },
        transition: function(e) {
            "string" != typeof e && (e += "ms");
            for (var t = 0; t < this.length; t += 1) {
                var i = this[t].style;
                i.webkitTransitionDuration = e, i.transitionDuration = e
            }
            return this
        },
        on: function() {
            for (var e, t = [], i = arguments.length; i--;) t[i] = arguments[i];
            var a = t[0],
                r = t[1],
                n = t[2],
                o = t[3];

            function l(e) {
                var t = e.target;
                if (t) {
                    var i = e.target.dom7EventData || [];
                    if (i.indexOf(e) < 0 && i.unshift(e), s(t).is(r)) n.apply(t, i);
                    else
                        for (var a = s(t).parents(), o = 0; o < a.length; o += 1) s(a[o]).is(r) && n.apply(a[o], i)
                }
            }

            function d(e) {
                var t = e && e.target && e.target.dom7EventData || [];
                t.indexOf(e) < 0 && t.unshift(e), n.apply(this, t)
            }
            "function" == typeof t[1] && (a = (e = t)[0], n = e[1], o = e[2], r = void 0), o || (o = !1);
            for (var h, p = a.split(" "), c = 0; c < this.length; c += 1) {
                var u = this[c];
                if (r)
                    for (h = 0; h < p.length; h += 1) {
                        var v = p[h];
                        u.dom7LiveListeners || (u.dom7LiveListeners = {}), u.dom7LiveListeners[v] || (u.dom7LiveListeners[v] = []), u.dom7LiveListeners[v].push({
                            listener: n,
                            proxyListener: l
                        }), u.addEventListener(v, l, o)
                    } else
                        for (h = 0; h < p.length; h += 1) {
                            var f = p[h];
                            u.dom7Listeners || (u.dom7Listeners = {}), u.dom7Listeners[f] || (u.dom7Listeners[f] = []), u.dom7Listeners[f].push({
                                listener: n,
                                proxyListener: d
                            }), u.addEventListener(f, d, o)
                        }
            }
            return this
        },
        off: function() {
            for (var e, t = [], i = arguments.length; i--;) t[i] = arguments[i];
            var s = t[0],
                a = t[1],
                r = t[2],
                n = t[3];
            "function" == typeof t[1] && (s = (e = t)[0], r = e[1], n = e[2], a = void 0), n || (n = !1);
            for (var o = s.split(" "), l = 0; l < o.length; l += 1)
                for (var d = o[l], h = 0; h < this.length; h += 1) {
                    var p = this[h],
                        c = void 0;
                    if (!a && p.dom7Listeners ? c = p.dom7Listeners[d] : a && p.dom7LiveListeners && (c = p.dom7LiveListeners[d]), c && c.length)
                        for (var u = c.length - 1; u >= 0; u -= 1) {
                            var v = c[u];
                            r && v.listener === r ? (p.removeEventListener(d, v.proxyListener, n), c.splice(u, 1)) : r && v.listener && v.listener.dom7proxy && v.listener.dom7proxy === r ? (p.removeEventListener(d, v.proxyListener, n), c.splice(u, 1)) : r || (p.removeEventListener(d, v.proxyListener, n), c.splice(u, 1))
                        }
                }
            return this
        },
        trigger: function() {
            for (var i = [], s = arguments.length; s--;) i[s] = arguments[s];
            for (var a = i[0].split(" "), r = i[1], n = 0; n < a.length; n += 1)
                for (var o = a[n], l = 0; l < this.length; l += 1) {
                    var d = this[l],
                        h = void 0;
                    try {
                        h = new t.CustomEvent(o, {
                            detail: r,
                            bubbles: !0,
                            cancelable: !0
                        })
                    } catch (t) {
                        (h = e.createEvent("Event")).initEvent(o, !0, !0), h.detail = r
                    }
                    d.dom7EventData = i.filter((function(e, t) {
                        return t > 0
                    })), d.dispatchEvent(h), d.dom7EventData = [], delete d.dom7EventData
                }
            return this
        },
        transitionEnd: function(e) {
            var t, i = ["webkitTransitionEnd", "transitionend"],
                s = this;

            function a(r) {
                if (r.target === this)
                    for (e.call(this, r), t = 0; t < i.length; t += 1) s.off(i[t], a)
            }
            if (e)
                for (t = 0; t < i.length; t += 1) s.on(i[t], a);
            return this
        },
        outerWidth: function(e) {
            if (this.length > 0) {
                if (e) {
                    var t = this.styles();
                    return this[0].offsetWidth + parseFloat(t.getPropertyValue("margin-right")) + parseFloat(t.getPropertyValue("margin-left"))
                }
                return this[0].offsetWidth
            }
            return null
        },
        outerHeight: function(e) {
            if (this.length > 0) {
                if (e) {
                    var t = this.styles();
                    return this[0].offsetHeight + parseFloat(t.getPropertyValue("margin-top")) + parseFloat(t.getPropertyValue("margin-bottom"))
                }
                return this[0].offsetHeight
            }
            return null
        },
        offset: function() {
            if (this.length > 0) {
                var i = this[0],
                    s = i.getBoundingClientRect(),
                    a = e.body,
                    r = i.clientTop || a.clientTop || 0,
                    n = i.clientLeft || a.clientLeft || 0,
                    o = i === t ? t.scrollY : i.scrollTop,
                    l = i === t ? t.scrollX : i.scrollLeft;
                return {
                    top: s.top + o - r,
                    left: s.left + l - n
                }
            }
            return null
        },
        css: function(e, i) {
            var s;
            if (1 === arguments.length) {
                if ("string" != typeof e) {
                    for (s = 0; s < this.length; s += 1)
                        for (var a in e) this[s].style[a] = e[a];
                    return this
                }
                if (this[0]) return t.getComputedStyle(this[0], null).getPropertyValue(e)
            }
            if (2 === arguments.length && "string" == typeof e) {
                for (s = 0; s < this.length; s += 1) this[s].style[e] = i;
                return this
            }
            return this
        },
        each: function(e) {
            if (!e) return this;
            for (var t = 0; t < this.length; t += 1)
                if (!1 === e.call(this[t], t, this[t])) return this;
            return this
        },
        html: function(e) {
            if (void 0 === e) return this[0] ? this[0].innerHTML : void 0;
            for (var t = 0; t < this.length; t += 1) this[t].innerHTML = e;
            return this
        },
        text: function(e) {
            if (void 0 === e) return this[0] ? this[0].textContent.trim() : null;
            for (var t = 0; t < this.length; t += 1) this[t].textContent = e;
            return this
        },
        is: function(a) {
            var r, n, o = this[0];
            if (!o || void 0 === a) return !1;
            if ("string" == typeof a) {
                if (o.matches) return o.matches(a);
                if (o.webkitMatchesSelector) return o.webkitMatchesSelector(a);
                if (o.msMatchesSelector) return o.msMatchesSelector(a);
                for (r = s(a), n = 0; n < r.length; n += 1)
                    if (r[n] === o) return !0;
                return !1
            }
            if (a === e) return o === e;
            if (a === t) return o === t;
            if (a.nodeType || a instanceof i) {
                for (r = a.nodeType ? [a] : a, n = 0; n < r.length; n += 1)
                    if (r[n] === o) return !0;
                return !1
            }
            return !1
        },
        index: function() {
            var e, t = this[0];
            if (t) {
                for (e = 0; null !== (t = t.previousSibling);) 1 === t.nodeType && (e += 1);
                return e
            }
        },
        eq: function(e) {
            if (void 0 === e) return this;
            var t, s = this.length;
            return new i(e > s - 1 ? [] : e < 0 ? (t = s + e) < 0 ? [] : [this[t]] : [this[e]])
        },
        append: function() {
            for (var t, s = [], a = arguments.length; a--;) s[a] = arguments[a];
            for (var r = 0; r < s.length; r += 1) {
                t = s[r];
                for (var n = 0; n < this.length; n += 1)
                    if ("string" == typeof t) {
                        var o = e.createElement("div");
                        for (o.innerHTML = t; o.firstChild;) this[n].appendChild(o.firstChild)
                    } else if (t instanceof i)
                    for (var l = 0; l < t.length; l += 1) this[n].appendChild(t[l]);
                else this[n].appendChild(t)
            }
            return this
        },
        prepend: function(t) {
            var s, a;
            for (s = 0; s < this.length; s += 1)
                if ("string" == typeof t) {
                    var r = e.createElement("div");
                    for (r.innerHTML = t, a = r.childNodes.length - 1; a >= 0; a -= 1) this[s].insertBefore(r.childNodes[a], this[s].childNodes[0])
                } else if (t instanceof i)
                for (a = 0; a < t.length; a += 1) this[s].insertBefore(t[a], this[s].childNodes[0]);
            else this[s].insertBefore(t, this[s].childNodes[0]);
            return this
        },
        next: function(e) {
            return this.length > 0 ? e ? this[0].nextElementSibling && s(this[0].nextElementSibling).is(e) ? new i([this[0].nextElementSibling]) : new i([]) : this[0].nextElementSibling ? new i([this[0].nextElementSibling]) : new i([]) : new i([])
        },
        nextAll: function(e) {
            var t = [],
                a = this[0];
            if (!a) return new i([]);
            for (; a.nextElementSibling;) {
                var r = a.nextElementSibling;
                e ? s(r).is(e) && t.push(r) : t.push(r), a = r
            }
            return new i(t)
        },
        prev: function(e) {
            if (this.length > 0) {
                var t = this[0];
                return e ? t.previousElementSibling && s(t.previousElementSibling).is(e) ? new i([t.previousElementSibling]) : new i([]) : t.previousElementSibling ? new i([t.previousElementSibling]) : new i([])
            }
            return new i([])
        },
        prevAll: function(e) {
            var t = [],
                a = this[0];
            if (!a) return new i([]);
            for (; a.previousElementSibling;) {
                var r = a.previousElementSibling;
                e ? s(r).is(e) && t.push(r) : t.push(r), a = r
            }
            return new i(t)
        },
        parent: function(e) {
            for (var t = [], i = 0; i < this.length; i += 1) null !== this[i].parentNode && (e ? s(this[i].parentNode).is(e) && t.push(this[i].parentNode) : t.push(this[i].parentNode));
            return s(a(t))
        },
        parents: function(e) {
            for (var t = [], i = 0; i < this.length; i += 1)
                for (var r = this[i].parentNode; r;) e ? s(r).is(e) && t.push(r) : t.push(r), r = r.parentNode;
            return s(a(t))
        },
        closest: function(e) {
            var t = this;
            return void 0 === e ? new i([]) : (t.is(e) || (t = t.parents(e).eq(0)), t)
        },
        find: function(e) {
            for (var t = [], s = 0; s < this.length; s += 1)
                for (var a = this[s].querySelectorAll(e), r = 0; r < a.length; r += 1) t.push(a[r]);
            return new i(t)
        },
        children: function(e) {
            for (var t = [], r = 0; r < this.length; r += 1)
                for (var n = this[r].childNodes, o = 0; o < n.length; o += 1) e ? 1 === n[o].nodeType && s(n[o]).is(e) && t.push(n[o]) : 1 === n[o].nodeType && t.push(n[o]);
            return new i(a(t))
        },
        filter: function(e) {
            for (var t = [], s = 0; s < this.length; s += 1) e.call(this[s], s, this[s]) && t.push(this[s]);
            return new i(t)
        },
        remove: function() {
            for (var e = 0; e < this.length; e += 1) this[e].parentNode && this[e].parentNode.removeChild(this[e]);
            return this
        },
        add: function() {
            for (var e = [], t = arguments.length; t--;) e[t] = arguments[t];
            var i, a;
            for (i = 0; i < e.length; i += 1) {
                var r = s(e[i]);
                for (a = 0; a < r.length; a += 1) this[this.length] = r[a], this.length += 1
            }
            return this
        },
        styles: function() {
            return this[0] ? t.getComputedStyle(this[0], null) : {}
        }
    };
    Object.keys(r).forEach((function(e) {
        s.fn[e] = s.fn[e] || r[e]
    }));
    var n = {
            deleteProps: function(e) {
                var t = e;
                Object.keys(t).forEach((function(e) {
                    try {
                        t[e] = null
                    } catch (e) {}
                    try {
                        delete t[e]
                    } catch (e) {}
                }))
            },
            nextTick: function(e, t) {
                return void 0 === t && (t = 0), setTimeout(e, t)
            },
            now: function() {
                return Date.now()
            },
            getTranslate: function(e, i) {
                var s, a, r;
                void 0 === i && (i = "x");
                var n = t.getComputedStyle(e, null);
                return t.WebKitCSSMatrix ? ((a = n.transform || n.webkitTransform).split(",").length > 6 && (a = a.split(", ").map((function(e) {
                    return e.replace(",", ".")
                })).join(", ")), r = new t.WebKitCSSMatrix("none" === a ? "" : a)) : s = (r = n.MozTransform || n.OTransform || n.MsTransform || n.msTransform || n.transform || n.getPropertyValue("transform").replace("translate(", "matrix(1, 0, 0, 1,")).toString().split(","), "x" === i && (a = t.WebKitCSSMatrix ? r.m41 : 16 === s.length ? parseFloat(s[12]) : parseFloat(s[4])), "y" === i && (a = t.WebKitCSSMatrix ? r.m42 : 16 === s.length ? parseFloat(s[13]) : parseFloat(s[5])), a || 0
            },
            parseUrlQuery: function(e) {
                var i, s, a, r, n = {},
                    o = e || t.location.href;
                if ("string" == typeof o && o.length)
                    for (r = (s = (o = o.indexOf("?") > -1 ? o.replace(/\S*\?/, "") : "").split("&").filter((function(e) {
                            return "" !== e
                        }))).length, i = 0; i < r; i += 1) a = s[i].replace(/#\S+/g, "").split("="), n[decodeURIComponent(a[0])] = void 0 === a[1] ? void 0 : decodeURIComponent(a[1]) || "";
                return n
            },
            isObject: function(e) {
                return "object" == typeof e && null !== e && e.constructor && e.constructor === Object
            },
            extend: function() {
                for (var e = [], t = arguments.length; t--;) e[t] = arguments[t];
                for (var i = Object(e[0]), s = 1; s < e.length; s += 1) {
                    var a = e[s];
                    if (null != a)
                        for (var r = Object.keys(Object(a)), o = 0, l = r.length; o < l; o += 1) {
                            var d = r[o],
                                h = Object.getOwnPropertyDescriptor(a, d);
                            void 0 !== h && h.enumerable && (n.isObject(i[d]) && n.isObject(a[d]) ? n.extend(i[d], a[d]) : !n.isObject(i[d]) && n.isObject(a[d]) ? (i[d] = {}, n.extend(i[d], a[d])) : i[d] = a[d])
                        }
                }
                return i
            }
        },
        o = {
            touch: t.Modernizr && !0 === t.Modernizr.touch || !!(t.navigator.maxTouchPoints > 0 || "ontouchstart" in t || t.DocumentTouch && e instanceof t.DocumentTouch),
            pointerEvents: !!t.PointerEvent && "maxTouchPoints" in t.navigator && t.navigator.maxTouchPoints > 0,
            observer: "MutationObserver" in t || "WebkitMutationObserver" in t,
            passiveListener: function() {
                var e = !1;
                try {
                    var i = Object.defineProperty({}, "passive", {
                        get: function() {
                            e = !0
                        }
                    });
                    t.addEventListener("testPassiveListener", null, i)
                } catch (e) {}
                return e
            }(),
            gestures: "ongesturestart" in t
        },
        l = function(e) {
            void 0 === e && (e = {});
            var t = this;
            t.params = e, t.eventsListeners = {}, t.params && t.params.on && Object.keys(t.params.on).forEach((function(e) {
                t.on(e, t.params.on[e])
            }))
        },
        d = {
            components: {
                configurable: !0
            }
        };
    l.prototype.on = function(e, t, i) {
        var s = this;
        if ("function" != typeof t) return s;
        var a = i ? "unshift" : "push";
        return e.split(" ").forEach((function(e) {
            s.eventsListeners[e] || (s.eventsListeners[e] = []), s.eventsListeners[e][a](t)
        })), s
    }, l.prototype.once = function(e, t, i) {
        var s = this;
        if ("function" != typeof t) return s;

        function a() {
            for (var i = [], r = arguments.length; r--;) i[r] = arguments[r];
            s.off(e, a), a.f7proxy && delete a.f7proxy, t.apply(s, i)
        }
        return a.f7proxy = t, s.on(e, a, i)
    }, l.prototype.off = function(e, t) {
        var i = this;
        return i.eventsListeners ? (e.split(" ").forEach((function(e) {
            void 0 === t ? i.eventsListeners[e] = [] : i.eventsListeners[e] && i.eventsListeners[e].length && i.eventsListeners[e].forEach((function(s, a) {
                (s === t || s.f7proxy && s.f7proxy === t) && i.eventsListeners[e].splice(a, 1)
            }))
        })), i) : i
    }, l.prototype.emit = function() {
        for (var e = [], t = arguments.length; t--;) e[t] = arguments[t];
        var i, s, a, r = this;
        if (!r.eventsListeners) return r;
        "string" == typeof e[0] || Array.isArray(e[0]) ? (i = e[0], s = e.slice(1, e.length), a = r) : (i = e[0].events, s = e[0].data, a = e[0].context || r);
        var n = Array.isArray(i) ? i : i.split(" ");
        return n.forEach((function(e) {
            if (r.eventsListeners && r.eventsListeners[e]) {
                var t = [];
                r.eventsListeners[e].forEach((function(e) {
                    t.push(e)
                })), t.forEach((function(e) {
                    e.apply(a, s)
                }))
            }
        })), r
    }, l.prototype.useModulesParams = function(e) {
        var t = this;
        t.modules && Object.keys(t.modules).forEach((function(i) {
            var s = t.modules[i];
            s.params && n.extend(e, s.params)
        }))
    }, l.prototype.useModules = function(e) {
        void 0 === e && (e = {});
        var t = this;
        t.modules && Object.keys(t.modules).forEach((function(i) {
            var s = t.modules[i],
                a = e[i] || {};
            s.instance && Object.keys(s.instance).forEach((function(e) {
                var i = s.instance[e];
                t[e] = "function" == typeof i ? i.bind(t) : i
            })), s.on && t.on && Object.keys(s.on).forEach((function(e) {
                t.on(e, s.on[e])
            })), s.create && s.create.bind(t)(a)
        }))
    }, d.components.set = function(e) {
        this.use && this.use(e)
    }, l.installModule = function(e) {
        for (var t = [], i = arguments.length - 1; i-- > 0;) t[i] = arguments[i + 1];
        var s = this;
        s.prototype.modules || (s.prototype.modules = {});
        var a = e.name || Object.keys(s.prototype.modules).length + "_" + n.now();
        return s.prototype.modules[a] = e, e.proto && Object.keys(e.proto).forEach((function(t) {
            s.prototype[t] = e.proto[t]
        })), e.static && Object.keys(e.static).forEach((function(t) {
            s[t] = e.static[t]
        })), e.install && e.install.apply(s, t), s
    }, l.use = function(e) {
        for (var t = [], i = arguments.length - 1; i-- > 0;) t[i] = arguments[i + 1];
        var s = this;
        return Array.isArray(e) ? (e.forEach((function(e) {
            return s.installModule(e)
        })), s) : s.installModule.apply(s, [e].concat(t))
    }, Object.defineProperties(l, d);
    var h = {
        updateSize: function() {
            var e, t, i = this.$el;
            e = void 0 !== this.params.width ? this.params.width : i[0].clientWidth, t = void 0 !== this.params.height ? this.params.height : i[0].clientHeight, 0 === e && this.isHorizontal() || 0 === t && this.isVertical() || (e = e - parseInt(i.css("padding-left"), 10) - parseInt(i.css("padding-right"), 10), t = t - parseInt(i.css("padding-top"), 10) - parseInt(i.css("padding-bottom"), 10), n.extend(this, {
                width: e,
                height: t,
                size: this.isHorizontal() ? e : t
            }))
        },
        updateSlides: function() {
            var e = this.params,
                i = this.$wrapperEl,
                s = this.size,
                a = this.rtlTranslate,
                r = this.wrongRTL,
                o = this.virtual && e.virtual.enabled,
                l = o ? this.virtual.slides.length : this.slides.length,
                d = i.children("." + this.params.slideClass),
                h = o ? this.virtual.slides.length : d.length,
                p = [],
                c = [],
                u = [];

            function v(t) {
                return !e.cssMode || t !== d.length - 1
            }
            var f = e.slidesOffsetBefore;
            "function" == typeof f && (f = e.slidesOffsetBefore.call(this));
            var m = e.slidesOffsetAfter;
            "function" == typeof m && (m = e.slidesOffsetAfter.call(this));
            var g = this.snapGrid.length,
                b = this.snapGrid.length,
                w = e.spaceBetween,
                y = -f,
                x = 0,
                T = 0;
            if (void 0 !== s) {
                var E, S;
                "string" == typeof w && w.indexOf("%") >= 0 && (w = parseFloat(w.replace("%", "")) / 100 * s), this.virtualSize = -w, a ? d.css({
                    marginLeft: "",
                    marginTop: ""
                }) : d.css({
                    marginRight: "",
                    marginBottom: ""
                }), e.slidesPerColumn > 1 && (E = Math.floor(h / e.slidesPerColumn) === h / this.params.slidesPerColumn ? h : Math.ceil(h / e.slidesPerColumn) * e.slidesPerColumn, "auto" !== e.slidesPerView && "row" === e.slidesPerColumnFill && (E = Math.max(E, e.slidesPerView * e.slidesPerColumn)));
                for (var C, M = e.slidesPerColumn, P = E / M, z = Math.floor(h / e.slidesPerColumn), k = 0; k < h; k += 1) {
                    S = 0;
                    var $ = d.eq(k);
                    if (e.slidesPerColumn > 1) {
                        var L = void 0,
                            I = void 0,
                            D = void 0;
                        if ("row" === e.slidesPerColumnFill && e.slidesPerGroup > 1) {
                            var O = Math.floor(k / (e.slidesPerGroup * e.slidesPerColumn)),
                                A = k - e.slidesPerColumn * e.slidesPerGroup * O,
                                G = 0 === O ? e.slidesPerGroup : Math.min(Math.ceil((h - O * M * e.slidesPerGroup) / M), e.slidesPerGroup);
                            L = (I = A - (D = Math.floor(A / G)) * G + O * e.slidesPerGroup) + D * E / M, $.css({
                                "-webkit-box-ordinal-group": L,
                                "-moz-box-ordinal-group": L,
                                "-ms-flex-order": L,
                                "-webkit-order": L,
                                order: L
                            })
                        } else "column" === e.slidesPerColumnFill ? (D = k - (I = Math.floor(k / M)) * M, (I > z || I === z && D === M - 1) && (D += 1) >= M && (D = 0, I += 1)) : I = k - (D = Math.floor(k / P)) * P;
                        $.css("margin-" + (this.isHorizontal() ? "top" : "left"), 0 !== D && e.spaceBetween && e.spaceBetween + "px")
                    }
                    if ("none" !== $.css("display")) {
                        if ("auto" === e.slidesPerView) {
                            var H = t.getComputedStyle($[0], null),
                                B = $[0].style.transform,
                                N = $[0].style.webkitTransform;
                            if (B && ($[0].style.transform = "none"), N && ($[0].style.webkitTransform = "none"), e.roundLengths) S = this.isHorizontal() ? $.outerWidth(!0) : $.outerHeight(!0);
                            else if (this.isHorizontal()) {
                                var X = parseFloat(H.getPropertyValue("width")),
                                    V = parseFloat(H.getPropertyValue("padding-left")),
                                    Y = parseFloat(H.getPropertyValue("padding-right")),
                                    F = parseFloat(H.getPropertyValue("margin-left")),
                                    W = parseFloat(H.getPropertyValue("margin-right")),
                                    R = H.getPropertyValue("box-sizing");
                                S = R && "border-box" === R ? X + F + W : X + V + Y + F + W
                            } else {
                                var q = parseFloat(H.getPropertyValue("height")),
                                    j = parseFloat(H.getPropertyValue("padding-top")),
                                    K = parseFloat(H.getPropertyValue("padding-bottom")),
                                    U = parseFloat(H.getPropertyValue("margin-top")),
                                    _ = parseFloat(H.getPropertyValue("margin-bottom")),
                                    Z = H.getPropertyValue("box-sizing");
                                S = Z && "border-box" === Z ? q + U + _ : q + j + K + U + _
                            }
                            B && ($[0].style.transform = B), N && ($[0].style.webkitTransform = N), e.roundLengths && (S = Math.floor(S))
                        } else S = (s - (e.slidesPerView - 1) * w) / e.slidesPerView, e.roundLengths && (S = Math.floor(S)), d[k] && (this.isHorizontal() ? d[k].style.width = S + "px" : d[k].style.height = S + "px");
                        d[k] && (d[k].swiperSlideSize = S), u.push(S), e.centeredSlides ? (y = y + S / 2 + x / 2 + w, 0 === x && 0 !== k && (y = y - s / 2 - w), 0 === k && (y = y - s / 2 - w), Math.abs(y) < .001 && (y = 0), e.roundLengths && (y = Math.floor(y)), T % e.slidesPerGroup == 0 && p.push(y), c.push(y)) : (e.roundLengths && (y = Math.floor(y)), (T - Math.min(this.params.slidesPerGroupSkip, T)) % this.params.slidesPerGroup == 0 && p.push(y), c.push(y), y = y + S + w), this.virtualSize += S + w, x = S, T += 1
                    }
                }
                if (this.virtualSize = Math.max(this.virtualSize, s) + m, a && r && ("slide" === e.effect || "coverflow" === e.effect) && i.css({
                        width: this.virtualSize + e.spaceBetween + "px"
                    }), e.setWrapperSize && (this.isHorizontal() ? i.css({
                        width: this.virtualSize + e.spaceBetween + "px"
                    }) : i.css({
                        height: this.virtualSize + e.spaceBetween + "px"
                    })), e.slidesPerColumn > 1 && (this.virtualSize = (S + e.spaceBetween) * E, this.virtualSize = Math.ceil(this.virtualSize / e.slidesPerColumn) - e.spaceBetween, this.isHorizontal() ? i.css({
                        width: this.virtualSize + e.spaceBetween + "px"
                    }) : i.css({
                        height: this.virtualSize + e.spaceBetween + "px"
                    }), e.centeredSlides)) {
                    C = [];
                    for (var Q = 0; Q < p.length; Q += 1) {
                        var J = p[Q];
                        e.roundLengths && (J = Math.floor(J)), p[Q] < this.virtualSize + p[0] && C.push(J)
                    }
                    p = C
                }
                if (!e.centeredSlides) {
                    C = [];
                    for (var ee = 0; ee < p.length; ee += 1) {
                        var te = p[ee];
                        e.roundLengths && (te = Math.floor(te)), p[ee] <= this.virtualSize - s && C.push(te)
                    }
                    p = C, Math.floor(this.virtualSize - s) - Math.floor(p[p.length - 1]) > 1 && p.push(this.virtualSize - s)
                }
                if (0 === p.length && (p = [0]), 0 !== e.spaceBetween && (this.isHorizontal() ? a ? d.filter(v).css({
                        marginLeft: w + "px"
                    }) : d.filter(v).css({
                        marginRight: w + "px"
                    }) : d.filter(v).css({
                        marginBottom: w + "px"
                    })), e.centeredSlides && e.centeredSlidesBounds) {
                    var ie = 0;
                    u.forEach((function(t) {
                        ie += t + (e.spaceBetween ? e.spaceBetween : 0)
                    }));
                    var se = (ie -= e.spaceBetween) - s;
                    p = p.map((function(e) {
                        return e < 0 ? -f : e > se ? se + m : e
                    }))
                }
                if (e.centerInsufficientSlides) {
                    var ae = 0;
                    if (u.forEach((function(t) {
                            ae += t + (e.spaceBetween ? e.spaceBetween : 0)
                        })), (ae -= e.spaceBetween) < s) {
                        var re = (s - ae) / 2;
                        p.forEach((function(e, t) {
                            p[t] = e - re
                        })), c.forEach((function(e, t) {
                            c[t] = e + re
                        }))
                    }
                }
                n.extend(this, {
                    slides: d,
                    snapGrid: p,
                    slidesGrid: c,
                    slidesSizesGrid: u
                }), h !== l && this.emit("slidesLengthChange"), p.length !== g && (this.params.watchOverflow && this.checkOverflow(), this.emit("snapGridLengthChange")), c.length !== b && this.emit("slidesGridLengthChange"), (e.watchSlidesProgress || e.watchSlidesVisibility) && this.updateSlidesOffset()
            }
        },
        updateAutoHeight: function(e) {
            var t, i = [],
                s = 0;
            if ("number" == typeof e ? this.setTransition(e) : !0 === e && this.setTransition(this.params.speed), "auto" !== this.params.slidesPerView && this.params.slidesPerView > 1)
                if (this.params.centeredSlides) i.push.apply(i, this.visibleSlides);
                else
                    for (t = 0; t < Math.ceil(this.params.slidesPerView); t += 1) {
                        var a = this.activeIndex + t;
                        if (a > this.slides.length) break;
                        i.push(this.slides.eq(a)[0])
                    } else i.push(this.slides.eq(this.activeIndex)[0]);
            for (t = 0; t < i.length; t += 1)
                if (void 0 !== i[t]) {
                    var r = i[t].offsetHeight;
                    s = r > s ? r : s
                }
            s && this.$wrapperEl.css("height", s + "px")
        },
        updateSlidesOffset: function() {
            for (var e = this.slides, t = 0; t < e.length; t += 1) e[t].swiperSlideOffset = this.isHorizontal() ? e[t].offsetLeft : e[t].offsetTop
        },
        updateSlidesProgress: function(e) {
            void 0 === e && (e = this && this.translate || 0);
            var t = this.params,
                i = this.slides,
                a = this.rtlTranslate;
            if (0 !== i.length) {
                void 0 === i[0].swiperSlideOffset && this.updateSlidesOffset();
                var r = -e;
                a && (r = e), i.removeClass(t.slideVisibleClass), this.visibleSlidesIndexes = [], this.visibleSlides = [];
                for (var n = 0; n < i.length; n += 1) {
                    var o = i[n],
                        l = (r + (t.centeredSlides ? this.minTranslate() : 0) - o.swiperSlideOffset) / (o.swiperSlideSize + t.spaceBetween);
                    if (t.watchSlidesVisibility || t.centeredSlides && t.autoHeight) {
                        var d = -(r - o.swiperSlideOffset),
                            h = d + this.slidesSizesGrid[n];
                        (d >= 0 && d < this.size - 1 || h > 1 && h <= this.size || d <= 0 && h >= this.size) && (this.visibleSlides.push(o), this.visibleSlidesIndexes.push(n), i.eq(n).addClass(t.slideVisibleClass))
                    }
                    o.progress = a ? -l : l
                }
                this.visibleSlides = s(this.visibleSlides)
            }
        },
        updateProgress: function(e) {
            if (void 0 === e) {
                var t = this.rtlTranslate ? -1 : 1;
                e = this && this.translate && this.translate * t || 0
            }
            var i = this.params,
                s = this.maxTranslate() - this.minTranslate(),
                a = this.progress,
                r = this.isBeginning,
                o = this.isEnd,
                l = r,
                d = o;
            0 === s ? (a = 0, r = !0, o = !0) : (r = (a = (e - this.minTranslate()) / s) <= 0, o = a >= 1), n.extend(this, {
                progress: a,
                isBeginning: r,
                isEnd: o
            }), (i.watchSlidesProgress || i.watchSlidesVisibility || i.centeredSlides && i.autoHeight) && this.updateSlidesProgress(e), r && !l && this.emit("reachBeginning toEdge"), o && !d && this.emit("reachEnd toEdge"), (l && !r || d && !o) && this.emit("fromEdge"), this.emit("progress", a)
        },
        updateSlidesClasses: function() {
            var e, t = this.slides,
                i = this.params,
                s = this.$wrapperEl,
                a = this.activeIndex,
                r = this.realIndex,
                n = this.virtual && i.virtual.enabled;
            t.removeClass(i.slideActiveClass + " " + i.slideNextClass + " " + i.slidePrevClass + " " + i.slideDuplicateActiveClass + " " + i.slideDuplicateNextClass + " " + i.slideDuplicatePrevClass), (e = n ? this.$wrapperEl.find("." + i.slideClass + '[data-swiper-slide-index="' + a + '"]') : t.eq(a)).addClass(i.slideActiveClass), i.loop && (e.hasClass(i.slideDuplicateClass) ? s.children("." + i.slideClass + ":not(." + i.slideDuplicateClass + ')[data-swiper-slide-index="' + r + '"]').addClass(i.slideDuplicateActiveClass) : s.children("." + i.slideClass + "." + i.slideDuplicateClass + '[data-swiper-slide-index="' + r + '"]').addClass(i.slideDuplicateActiveClass));
            var o = e.nextAll("." + i.slideClass).eq(0).addClass(i.slideNextClass);
            i.loop && 0 === o.length && (o = t.eq(0)).addClass(i.slideNextClass);
            var l = e.prevAll("." + i.slideClass).eq(0).addClass(i.slidePrevClass);
            i.loop && 0 === l.length && (l = t.eq(-1)).addClass(i.slidePrevClass), i.loop && (o.hasClass(i.slideDuplicateClass) ? s.children("." + i.slideClass + ":not(." + i.slideDuplicateClass + ')[data-swiper-slide-index="' + o.attr("data-swiper-slide-index") + '"]').addClass(i.slideDuplicateNextClass) : s.children("." + i.slideClass + "." + i.slideDuplicateClass + '[data-swiper-slide-index="' + o.attr("data-swiper-slide-index") + '"]').addClass(i.slideDuplicateNextClass), l.hasClass(i.slideDuplicateClass) ? s.children("." + i.slideClass + ":not(." + i.slideDuplicateClass + ')[data-swiper-slide-index="' + l.attr("data-swiper-slide-index") + '"]').addClass(i.slideDuplicatePrevClass) : s.children("." + i.slideClass + "." + i.slideDuplicateClass + '[data-swiper-slide-index="' + l.attr("data-swiper-slide-index") + '"]').addClass(i.slideDuplicatePrevClass))
        },
        updateActiveIndex: function(e) {
            var t, i = this.rtlTranslate ? this.translate : -this.translate,
                s = this.slidesGrid,
                a = this.snapGrid,
                r = this.params,
                o = this.activeIndex,
                l = this.realIndex,
                d = this.snapIndex,
                h = e;
            if (void 0 === h) {
                for (var p = 0; p < s.length; p += 1) void 0 !== s[p + 1] ? i >= s[p] && i < s[p + 1] - (s[p + 1] - s[p]) / 2 ? h = p : i >= s[p] && i < s[p + 1] && (h = p + 1) : i >= s[p] && (h = p);
                r.normalizeSlideIndex && (h < 0 || void 0 === h) && (h = 0)
            }
            if (a.indexOf(i) >= 0) t = a.indexOf(i);
            else {
                var c = Math.min(r.slidesPerGroupSkip, h);
                t = c + Math.floor((h - c) / r.slidesPerGroup)
            }
            if (t >= a.length && (t = a.length - 1), h !== o) {
                var u = parseInt(this.slides.eq(h).attr("data-swiper-slide-index") || h, 10);
                n.extend(this, {
                    snapIndex: t,
                    realIndex: u,
                    previousIndex: o,
                    activeIndex: h
                }), this.emit("activeIndexChange"), this.emit("snapIndexChange"), l !== u && this.emit("realIndexChange"), (this.initialized || this.runCallbacksOnInit) && this.emit("slideChange")
            } else t !== d && (this.snapIndex = t, this.emit("snapIndexChange"))
        },
        updateClickedSlide: function(e) {
            var t = this.params,
                i = s(e.target).closest("." + t.slideClass)[0],
                a = !1;
            if (i)
                for (var r = 0; r < this.slides.length; r += 1) this.slides[r] === i && (a = !0);
            if (!i || !a) return this.clickedSlide = void 0, void(this.clickedIndex = void 0);
            this.clickedSlide = i, this.virtual && this.params.virtual.enabled ? this.clickedIndex = parseInt(s(i).attr("data-swiper-slide-index"), 10) : this.clickedIndex = s(i).index(), t.slideToClickedSlide && void 0 !== this.clickedIndex && this.clickedIndex !== this.activeIndex && this.slideToClickedSlide()
        }
    };
    var p = {
        getTranslate: function(e) {
            void 0 === e && (e = this.isHorizontal() ? "x" : "y");
            var t = this.params,
                i = this.rtlTranslate,
                s = this.translate,
                a = this.$wrapperEl;
            if (t.virtualTranslate) return i ? -s : s;
            if (t.cssMode) return s;
            var r = n.getTranslate(a[0], e);
            return i && (r = -r), r || 0
        },
        setTranslate: function(e, t) {
            var i = this.rtlTranslate,
                s = this.params,
                a = this.$wrapperEl,
                r = this.wrapperEl,
                n = this.progress,
                o = 0,
                l = 0;
            this.isHorizontal() ? o = i ? -e : e : l = e, s.roundLengths && (o = Math.floor(o), l = Math.floor(l)), s.cssMode ? r[this.isHorizontal() ? "scrollLeft" : "scrollTop"] = this.isHorizontal() ? -o : -l : s.virtualTranslate || a.transform("translate3d(" + o + "px, " + l + "px, 0px)"), this.previousTranslate = this.translate, this.translate = this.isHorizontal() ? o : l;
            var d = this.maxTranslate() - this.minTranslate();
            (0 === d ? 0 : (e - this.minTranslate()) / d) !== n && this.updateProgress(e), this.emit("setTranslate", this.translate, t)
        },
        minTranslate: function() {
            return -this.snapGrid[0]
        },
        maxTranslate: function() {
            return -this.snapGrid[this.snapGrid.length - 1]
        },
        translateTo: function(e, t, i, s, a) {
            var r;
            void 0 === e && (e = 0), void 0 === t && (t = this.params.speed), void 0 === i && (i = !0), void 0 === s && (s = !0);
            var n = this,
                o = n.params,
                l = n.wrapperEl;
            if (n.animating && o.preventInteractionOnTransition) return !1;
            var d, h = n.minTranslate(),
                p = n.maxTranslate();
            if (d = s && e > h ? h : s && e < p ? p : e, n.updateProgress(d), o.cssMode) {
                var c = n.isHorizontal();
                return 0 === t ? l[c ? "scrollLeft" : "scrollTop"] = -d : l.scrollTo ? l.scrollTo(((r = {})[c ? "left" : "top"] = -d, r.behavior = "smooth", r)) : l[c ? "scrollLeft" : "scrollTop"] = -d, !0
            }
            return 0 === t ? (n.setTransition(0), n.setTranslate(d), i && (n.emit("beforeTransitionStart", t, a), n.emit("transitionEnd"))) : (n.setTransition(t), n.setTranslate(d), i && (n.emit("beforeTransitionStart", t, a), n.emit("transitionStart")), n.animating || (n.animating = !0, n.onTranslateToWrapperTransitionEnd || (n.onTranslateToWrapperTransitionEnd = function(e) {
                n && !n.destroyed && e.target === this && (n.$wrapperEl[0].removeEventListener("transitionend", n.onTranslateToWrapperTransitionEnd), n.$wrapperEl[0].removeEventListener("webkitTransitionEnd", n.onTranslateToWrapperTransitionEnd), n.onTranslateToWrapperTransitionEnd = null, delete n.onTranslateToWrapperTransitionEnd, i && n.emit("transitionEnd"))
            }), n.$wrapperEl[0].addEventListener("transitionend", n.onTranslateToWrapperTransitionEnd), n.$wrapperEl[0].addEventListener("webkitTransitionEnd", n.onTranslateToWrapperTransitionEnd))), !0
        }
    };
    var c = {
        setTransition: function(e, t) {
            this.params.cssMode || this.$wrapperEl.transition(e), this.emit("setTransition", e, t)
        },
        transitionStart: function(e, t) {
            void 0 === e && (e = !0);
            var i = this.activeIndex,
                s = this.params,
                a = this.previousIndex;
            if (!s.cssMode) {
                s.autoHeight && this.updateAutoHeight();
                var r = t;
                if (r || (r = i > a ? "next" : i < a ? "prev" : "reset"), this.emit("transitionStart"), e && i !== a) {
                    if ("reset" === r) return void this.emit("slideResetTransitionStart");
                    this.emit("slideChangeTransitionStart"), "next" === r ? this.emit("slideNextTransitionStart") : this.emit("slidePrevTransitionStart")
                }
            }
        },
        transitionEnd: function(e, t) {
            void 0 === e && (e = !0);
            var i = this.activeIndex,
                s = this.previousIndex,
                a = this.params;
            if (this.animating = !1, !a.cssMode) {
                this.setTransition(0);
                var r = t;
                if (r || (r = i > s ? "next" : i < s ? "prev" : "reset"), this.emit("transitionEnd"), e && i !== s) {
                    if ("reset" === r) return void this.emit("slideResetTransitionEnd");
                    this.emit("slideChangeTransitionEnd"), "next" === r ? this.emit("slideNextTransitionEnd") : this.emit("slidePrevTransitionEnd")
                }
            }
        }
    };
    var u = {
        slideTo: function(e, t, i, s) {
            var a;
            void 0 === e && (e = 0), void 0 === t && (t = this.params.speed), void 0 === i && (i = !0);
            var r = this,
                n = e;
            n < 0 && (n = 0);
            var o = r.params,
                l = r.snapGrid,
                d = r.slidesGrid,
                h = r.previousIndex,
                p = r.activeIndex,
                c = r.rtlTranslate,
                u = r.wrapperEl;
            if (r.animating && o.preventInteractionOnTransition) return !1;
            var v = Math.min(r.params.slidesPerGroupSkip, n),
                f = v + Math.floor((n - v) / r.params.slidesPerGroup);
            f >= l.length && (f = l.length - 1), (p || o.initialSlide || 0) === (h || 0) && i && r.emit("beforeSlideChangeStart");
            var m, g = -l[f];
            if (r.updateProgress(g), o.normalizeSlideIndex)
                for (var b = 0; b < d.length; b += 1) - Math.floor(100 * g) >= Math.floor(100 * d[b]) && (n = b);
            if (r.initialized && n !== p) {
                if (!r.allowSlideNext && g < r.translate && g < r.minTranslate()) return !1;
                if (!r.allowSlidePrev && g > r.translate && g > r.maxTranslate() && (p || 0) !== n) return !1
            }
            if (m = n > p ? "next" : n < p ? "prev" : "reset", c && -g === r.translate || !c && g === r.translate) return r.updateActiveIndex(n), o.autoHeight && r.updateAutoHeight(), r.updateSlidesClasses(), "slide" !== o.effect && r.setTranslate(g), "reset" !== m && (r.transitionStart(i, m), r.transitionEnd(i, m)), !1;
            if (o.cssMode) {
                var w = r.isHorizontal();
                return 0 === t ? u[w ? "scrollLeft" : "scrollTop"] = -g : u.scrollTo ? u.scrollTo(((a = {})[w ? "left" : "top"] = -g, a.behavior = "smooth", a)) : u[w ? "scrollLeft" : "scrollTop"] = -g, !0
            }
            return 0 === t ? (r.setTransition(0), r.setTranslate(g), r.updateActiveIndex(n), r.updateSlidesClasses(), r.emit("beforeTransitionStart", t, s), r.transitionStart(i, m), r.transitionEnd(i, m)) : (r.setTransition(t), r.setTranslate(g), r.updateActiveIndex(n), r.updateSlidesClasses(), r.emit("beforeTransitionStart", t, s), r.transitionStart(i, m), r.animating || (r.animating = !0, r.onSlideToWrapperTransitionEnd || (r.onSlideToWrapperTransitionEnd = function(e) {
                r && !r.destroyed && e.target === this && (r.$wrapperEl[0].removeEventListener("transitionend", r.onSlideToWrapperTransitionEnd), r.$wrapperEl[0].removeEventListener("webkitTransitionEnd", r.onSlideToWrapperTransitionEnd), r.onSlideToWrapperTransitionEnd = null, delete r.onSlideToWrapperTransitionEnd, r.transitionEnd(i, m))
            }), r.$wrapperEl[0].addEventListener("transitionend", r.onSlideToWrapperTransitionEnd), r.$wrapperEl[0].addEventListener("webkitTransitionEnd", r.onSlideToWrapperTransitionEnd))), !0
        },
        slideToLoop: function(e, t, i, s) {
            void 0 === e && (e = 0), void 0 === t && (t = this.params.speed), void 0 === i && (i = !0);
            var a = e;
            return this.params.loop && (a += this.loopedSlides), this.slideTo(a, t, i, s)
        },
        slideNext: function(e, t, i) {
            void 0 === e && (e = this.params.speed), void 0 === t && (t = !0);
            var s = this.params,
                a = this.animating,
                r = this.activeIndex < s.slidesPerGroupSkip ? 1 : s.slidesPerGroup;
            if (s.loop) {
                if (a) return !1;
                this.loopFix(), this._clientLeft = this.$wrapperEl[0].clientLeft
            }
            return this.slideTo(this.activeIndex + r, e, t, i)
        },
        slidePrev: function(e, t, i) {
            void 0 === e && (e = this.params.speed), void 0 === t && (t = !0);
            var s = this.params,
                a = this.animating,
                r = this.snapGrid,
                n = this.slidesGrid,
                o = this.rtlTranslate;
            if (s.loop) {
                if (a) return !1;
                this.loopFix(), this._clientLeft = this.$wrapperEl[0].clientLeft
            }

            function l(e) {
                return e < 0 ? -Math.floor(Math.abs(e)) : Math.floor(e)
            }
            var d, h = l(o ? this.translate : -this.translate),
                p = r.map((function(e) {
                    return l(e)
                })),
                c = (n.map((function(e) {
                    return l(e)
                })), r[p.indexOf(h)], r[p.indexOf(h) - 1]);
            return void 0 === c && s.cssMode && r.forEach((function(e) {
                !c && h >= e && (c = e)
            })), void 0 !== c && (d = n.indexOf(c)) < 0 && (d = this.activeIndex - 1), this.slideTo(d, e, t, i)
        },
        slideReset: function(e, t, i) {
            return void 0 === e && (e = this.params.speed), void 0 === t && (t = !0), this.slideTo(this.activeIndex, e, t, i)
        },
        slideToClosest: function(e, t, i, s) {
            void 0 === e && (e = this.params.speed), void 0 === t && (t = !0), void 0 === s && (s = .5);
            var a = this.activeIndex,
                r = Math.min(this.params.slidesPerGroupSkip, a),
                n = r + Math.floor((a - r) / this.params.slidesPerGroup),
                o = this.rtlTranslate ? this.translate : -this.translate;
            if (o >= this.snapGrid[n]) {
                var l = this.snapGrid[n];
                o - l > (this.snapGrid[n + 1] - l) * s && (a += this.params.slidesPerGroup)
            } else {
                var d = this.snapGrid[n - 1];
                o - d <= (this.snapGrid[n] - d) * s && (a -= this.params.slidesPerGroup)
            }
            return a = Math.max(a, 0), a = Math.min(a, this.slidesGrid.length - 1), this.slideTo(a, e, t, i)
        },
        slideToClickedSlide: function() {
            var e, t = this,
                i = t.params,
                a = t.$wrapperEl,
                r = "auto" === i.slidesPerView ? t.slidesPerViewDynamic() : i.slidesPerView,
                o = t.clickedIndex;
            if (i.loop) {
                if (t.animating) return;
                e = parseInt(s(t.clickedSlide).attr("data-swiper-slide-index"), 10), i.centeredSlides ? o < t.loopedSlides - r / 2 || o > t.slides.length - t.loopedSlides + r / 2 ? (t.loopFix(), o = a.children("." + i.slideClass + '[data-swiper-slide-index="' + e + '"]:not(.' + i.slideDuplicateClass + ")").eq(0).index(), n.nextTick((function() {
                    t.slideTo(o)
                }))) : t.slideTo(o) : o > t.slides.length - r ? (t.loopFix(), o = a.children("." + i.slideClass + '[data-swiper-slide-index="' + e + '"]:not(.' + i.slideDuplicateClass + ")").eq(0).index(), n.nextTick((function() {
                    t.slideTo(o)
                }))) : t.slideTo(o)
            } else t.slideTo(o)
        }
    };
    var v = {
        loopCreate: function() {
            var t = this,
                i = t.params,
                a = t.$wrapperEl;
            a.children("." + i.slideClass + "." + i.slideDuplicateClass).remove();
            var r = a.children("." + i.slideClass);
            if (i.loopFillGroupWithBlank) {
                var n = i.slidesPerGroup - r.length % i.slidesPerGroup;
                if (n !== i.slidesPerGroup) {
                    for (var o = 0; o < n; o += 1) {
                        var l = s(e.createElement("div")).addClass(i.slideClass + " " + i.slideBlankClass);
                        a.append(l)
                    }
                    r = a.children("." + i.slideClass)
                }
            }
            "auto" !== i.slidesPerView || i.loopedSlides || (i.loopedSlides = r.length), t.loopedSlides = Math.ceil(parseFloat(i.loopedSlides || i.slidesPerView, 10)), t.loopedSlides += i.loopAdditionalSlides, t.loopedSlides > r.length && (t.loopedSlides = r.length);
            var d = [],
                h = [];
            r.each((function(e, i) {
                var a = s(i);
                e < t.loopedSlides && h.push(i), e < r.length && e >= r.length - t.loopedSlides && d.push(i), a.attr("data-swiper-slide-index", e)
            }));
            for (var p = 0; p < h.length; p += 1) a.append(s(h[p].cloneNode(!0)).addClass(i.slideDuplicateClass));
            for (var c = d.length - 1; c >= 0; c -= 1) a.prepend(s(d[c].cloneNode(!0)).addClass(i.slideDuplicateClass))
        },
        loopFix: function() {
            this.emit("beforeLoopFix");
            var e, t = this.activeIndex,
                i = this.slides,
                s = this.loopedSlides,
                a = this.allowSlidePrev,
                r = this.allowSlideNext,
                n = this.snapGrid,
                o = this.rtlTranslate;
            this.allowSlidePrev = !0, this.allowSlideNext = !0;
            var l = -n[t] - this.getTranslate();
            if (t < s) e = i.length - 3 * s + t, e += s, this.slideTo(e, 0, !1, !0) && 0 !== l && this.setTranslate((o ? -this.translate : this.translate) - l);
            else if (t >= i.length - s) {
                e = -i.length + t + s, e += s, this.slideTo(e, 0, !1, !0) && 0 !== l && this.setTranslate((o ? -this.translate : this.translate) - l)
            }
            this.allowSlidePrev = a, this.allowSlideNext = r, this.emit("loopFix")
        },
        loopDestroy: function() {
            var e = this.$wrapperEl,
                t = this.params,
                i = this.slides;
            e.children("." + t.slideClass + "." + t.slideDuplicateClass + ",." + t.slideClass + "." + t.slideBlankClass).remove(), i.removeAttr("data-swiper-slide-index")
        }
    };
    var f = {
        setGrabCursor: function(e) {
            if (!(o.touch || !this.params.simulateTouch || this.params.watchOverflow && this.isLocked || this.params.cssMode)) {
                var t = this.el;
                t.style.cursor = "move", t.style.cursor = e ? "-webkit-grabbing" : "-webkit-grab", t.style.cursor = e ? "-moz-grabbin" : "-moz-grab", t.style.cursor = e ? "grabbing" : "grab"
            }
        },
        unsetGrabCursor: function() {
            o.touch || this.params.watchOverflow && this.isLocked || this.params.cssMode || (this.el.style.cursor = "")
        }
    };
    var m, g, b, w, y, x, T, E, S, C, M, P, z, k, $, L = {
            appendSlide: function(e) {
                var t = this.$wrapperEl,
                    i = this.params;
                if (i.loop && this.loopDestroy(), "object" == typeof e && "length" in e)
                    for (var s = 0; s < e.length; s += 1) e[s] && t.append(e[s]);
                else t.append(e);
                i.loop && this.loopCreate(), i.observer && o.observer || this.update()
            },
            prependSlide: function(e) {
                var t = this.params,
                    i = this.$wrapperEl,
                    s = this.activeIndex;
                t.loop && this.loopDestroy();
                var a = s + 1;
                if ("object" == typeof e && "length" in e) {
                    for (var r = 0; r < e.length; r += 1) e[r] && i.prepend(e[r]);
                    a = s + e.length
                } else i.prepend(e);
                t.loop && this.loopCreate(), t.observer && o.observer || this.update(), this.slideTo(a, 0, !1)
            },
            addSlide: function(e, t) {
                var i = this.$wrapperEl,
                    s = this.params,
                    a = this.activeIndex;
                s.loop && (a -= this.loopedSlides, this.loopDestroy(), this.slides = i.children("." + s.slideClass));
                var r = this.slides.length;
                if (e <= 0) this.prependSlide(t);
                else if (e >= r) this.appendSlide(t);
                else {
                    for (var n = a > e ? a + 1 : a, l = [], d = r - 1; d >= e; d -= 1) {
                        var h = this.slides.eq(d);
                        h.remove(), l.unshift(h)
                    }
                    if ("object" == typeof t && "length" in t) {
                        for (var p = 0; p < t.length; p += 1) t[p] && i.append(t[p]);
                        n = a > e ? a + t.length : a
                    } else i.append(t);
                    for (var c = 0; c < l.length; c += 1) i.append(l[c]);
                    s.loop && this.loopCreate(), s.observer && o.observer || this.update(), s.loop ? this.slideTo(n + this.loopedSlides, 0, !1) : this.slideTo(n, 0, !1)
                }
            },
            removeSlide: function(e) {
                var t = this.params,
                    i = this.$wrapperEl,
                    s = this.activeIndex;
                t.loop && (s -= this.loopedSlides, this.loopDestroy(), this.slides = i.children("." + t.slideClass));
                var a, r = s;
                if ("object" == typeof e && "length" in e) {
                    for (var n = 0; n < e.length; n += 1) a = e[n], this.slides[a] && this.slides.eq(a).remove(), a < r && (r -= 1);
                    r = Math.max(r, 0)
                } else a = e, this.slides[a] && this.slides.eq(a).remove(), a < r && (r -= 1), r = Math.max(r, 0);
                t.loop && this.loopCreate(), t.observer && o.observer || this.update(), t.loop ? this.slideTo(r + this.loopedSlides, 0, !1) : this.slideTo(r, 0, !1)
            },
            removeAllSlides: function() {
                for (var e = [], t = 0; t < this.slides.length; t += 1) e.push(t);
                this.removeSlide(e)
            }
        },
        I = (m = t.navigator.platform, g = t.navigator.userAgent, b = {
            ios: !1,
            android: !1,
            androidChrome: !1,
            desktop: !1,
            iphone: !1,
            ipod: !1,
            ipad: !1,
            edge: !1,
            ie: !1,
            firefox: !1,
            macos: !1,
            windows: !1,
            cordova: !(!t.cordova && !t.phonegap),
            phonegap: !(!t.cordova && !t.phonegap),
            electron: !1
        }, w = t.screen.width, y = t.screen.height, x = g.match(/(Android);?[\s\/]+([\d.]+)?/), T = g.match(/(iPad).*OS\s([\d_]+)/), E = g.match(/(iPod)(.*OS\s([\d_]+))?/), S = !T && g.match(/(iPhone\sOS|iOS)\s([\d_]+)/), C = g.indexOf("MSIE ") >= 0 || g.indexOf("Trident/") >= 0, M = g.indexOf("Edge/") >= 0, P = g.indexOf("Gecko/") >= 0 && g.indexOf("Firefox/") >= 0, z = "Win32" === m, k = g.toLowerCase().indexOf("electron") >= 0, $ = "MacIntel" === m, !T && $ && o.touch && (1024 === w && 1366 === y || 834 === w && 1194 === y || 834 === w && 1112 === y || 768 === w && 1024 === y) && (T = g.match(/(Version)\/([\d.]+)/), $ = !1), b.ie = C, b.edge = M, b.firefox = P, x && !z && (b.os = "android", b.osVersion = x[2], b.android = !0, b.androidChrome = g.toLowerCase().indexOf("chrome") >= 0), (T || S || E) && (b.os = "ios", b.ios = !0), S && !E && (b.osVersion = S[2].replace(/_/g, "."), b.iphone = !0), T && (b.osVersion = T[2].replace(/_/g, "."), b.ipad = !0), E && (b.osVersion = E[3] ? E[3].replace(/_/g, ".") : null, b.ipod = !0), b.ios && b.osVersion && g.indexOf("Version/") >= 0 && "10" === b.osVersion.split(".")[0] && (b.osVersion = g.toLowerCase().split("version/")[1].split(" ")[0]), b.webView = !(!(S || T || E) || !g.match(/.*AppleWebKit(?!.*Safari)/i) && !t.navigator.standalone) || t.matchMedia && t.matchMedia("(display-mode: standalone)").matches, b.webview = b.webView, b.standalone = b.webView, b.desktop = !(b.ios || b.android) || k, b.desktop && (b.electron = k, b.macos = $, b.windows = z, b.macos && (b.os = "macos"), b.windows && (b.os = "windows")), b.pixelRatio = t.devicePixelRatio || 1, b);

    function D(i) {
        var a = this.touchEventsData,
            r = this.params,
            o = this.touches;
        if (!this.animating || !r.preventInteractionOnTransition) {
            var l = i;
            l.originalEvent && (l = l.originalEvent);
            var d = s(l.target);
            if (("wrapper" !== r.touchEventsTarget || d.closest(this.wrapperEl).length) && (a.isTouchEvent = "touchstart" === l.type, (a.isTouchEvent || !("which" in l) || 3 !== l.which) && !(!a.isTouchEvent && "button" in l && l.button > 0 || a.isTouched && a.isMoved)))
                if (r.noSwiping && d.closest(r.noSwipingSelector ? r.noSwipingSelector : "." + r.noSwipingClass)[0]) this.allowClick = !0;
                else if (!r.swipeHandler || d.closest(r.swipeHandler)[0]) {
                o.currentX = "touchstart" === l.type ? l.targetTouches[0].pageX : l.pageX, o.currentY = "touchstart" === l.type ? l.targetTouches[0].pageY : l.pageY;
                var h = o.currentX,
                    p = o.currentY,
                    c = r.edgeSwipeDetection || r.iOSEdgeSwipeDetection,
                    u = r.edgeSwipeThreshold || r.iOSEdgeSwipeThreshold;
                if (!c || !(h <= u || h >= t.screen.width - u)) {
                    if (n.extend(a, {
                            isTouched: !0,
                            isMoved: !1,
                            allowTouchCallbacks: !0,
                            isScrolling: void 0,
                            startMoving: void 0
                        }), o.startX = h, o.startY = p, a.touchStartTime = n.now(), this.allowClick = !0, this.updateSize(), this.swipeDirection = void 0, r.threshold > 0 && (a.allowThresholdMove = !1), "touchstart" !== l.type) {
                        var v = !0;
                        d.is(a.formElements) && (v = !1), e.activeElement && s(e.activeElement).is(a.formElements) && e.activeElement !== d[0] && e.activeElement.blur();
                        var f = v && this.allowTouchMove && r.touchStartPreventDefault;
                        (r.touchStartForcePreventDefault || f) && l.preventDefault()
                    }
                    this.emit("touchStart", l)
                }
            }
        }
    }

    function O(t) {
        var i = this.touchEventsData,
            a = this.params,
            r = this.touches,
            o = this.rtlTranslate,
            l = t;
        if (l.originalEvent && (l = l.originalEvent), i.isTouched) {
            if (!i.isTouchEvent || "mousemove" !== l.type) {
                var d = "touchmove" === l.type && l.targetTouches && (l.targetTouches[0] || l.changedTouches[0]),
                    h = "touchmove" === l.type ? d.pageX : l.pageX,
                    p = "touchmove" === l.type ? d.pageY : l.pageY;
                if (l.preventedByNestedSwiper) return r.startX = h, void(r.startY = p);
                if (!this.allowTouchMove) return this.allowClick = !1, void(i.isTouched && (n.extend(r, {
                    startX: h,
                    startY: p,
                    currentX: h,
                    currentY: p
                }), i.touchStartTime = n.now()));
                if (i.isTouchEvent && a.touchReleaseOnEdges && !a.loop)
                    if (this.isVertical()) {
                        if (p < r.startY && this.translate <= this.maxTranslate() || p > r.startY && this.translate >= this.minTranslate()) return i.isTouched = !1, void(i.isMoved = !1)
                    } else if (h < r.startX && this.translate <= this.maxTranslate() || h > r.startX && this.translate >= this.minTranslate()) return;
                if (i.isTouchEvent && e.activeElement && l.target === e.activeElement && s(l.target).is(i.formElements)) return i.isMoved = !0, void(this.allowClick = !1);
                if (i.allowTouchCallbacks && this.emit("touchMove", l), !(l.targetTouches && l.targetTouches.length > 1)) {
                    r.currentX = h, r.currentY = p;
                    var c = r.currentX - r.startX,
                        u = r.currentY - r.startY;
                    if (!(this.params.threshold && Math.sqrt(Math.pow(c, 2) + Math.pow(u, 2)) < this.params.threshold)) {
                        var v;
                        if (void 0 === i.isScrolling) this.isHorizontal() && r.currentY === r.startY || this.isVertical() && r.currentX === r.startX ? i.isScrolling = !1 : c * c + u * u >= 25 && (v = 180 * Math.atan2(Math.abs(u), Math.abs(c)) / Math.PI, i.isScrolling = this.isHorizontal() ? v > a.touchAngle : 90 - v > a.touchAngle);
                        if (i.isScrolling && this.emit("touchMoveOpposite", l), void 0 === i.startMoving && (r.currentX === r.startX && r.currentY === r.startY || (i.startMoving = !0)), i.isScrolling) i.isTouched = !1;
                        else if (i.startMoving) {
                            this.allowClick = !1, a.cssMode || l.preventDefault(), a.touchMoveStopPropagation && !a.nested && l.stopPropagation(), i.isMoved || (a.loop && this.loopFix(), i.startTranslate = this.getTranslate(), this.setTransition(0), this.animating && this.$wrapperEl.trigger("webkitTransitionEnd transitionend"), i.allowMomentumBounce = !1, !a.grabCursor || !0 !== this.allowSlideNext && !0 !== this.allowSlidePrev || this.setGrabCursor(!0), this.emit("sliderFirstMove", l)), this.emit("sliderMove", l), i.isMoved = !0;
                            var f = this.isHorizontal() ? c : u;
                            r.diff = f, f *= a.touchRatio, o && (f = -f), this.swipeDirection = f > 0 ? "prev" : "next", i.currentTranslate = f + i.startTranslate;
                            var m = !0,
                                g = a.resistanceRatio;
                            if (a.touchReleaseOnEdges && (g = 0), f > 0 && i.currentTranslate > this.minTranslate() ? (m = !1, a.resistance && (i.currentTranslate = this.minTranslate() - 1 + Math.pow(-this.minTranslate() + i.startTranslate + f, g))) : f < 0 && i.currentTranslate < this.maxTranslate() && (m = !1, a.resistance && (i.currentTranslate = this.maxTranslate() + 1 - Math.pow(this.maxTranslate() - i.startTranslate - f, g))), m && (l.preventedByNestedSwiper = !0), !this.allowSlideNext && "next" === this.swipeDirection && i.currentTranslate < i.startTranslate && (i.currentTranslate = i.startTranslate), !this.allowSlidePrev && "prev" === this.swipeDirection && i.currentTranslate > i.startTranslate && (i.currentTranslate = i.startTranslate), a.threshold > 0) {
                                if (!(Math.abs(f) > a.threshold || i.allowThresholdMove)) return void(i.currentTranslate = i.startTranslate);
                                if (!i.allowThresholdMove) return i.allowThresholdMove = !0, r.startX = r.currentX, r.startY = r.currentY, i.currentTranslate = i.startTranslate, void(r.diff = this.isHorizontal() ? r.currentX - r.startX : r.currentY - r.startY)
                            }
                            a.followFinger && !a.cssMode && ((a.freeMode || a.watchSlidesProgress || a.watchSlidesVisibility) && (this.updateActiveIndex(), this.updateSlidesClasses()), a.freeMode && (0 === i.velocities.length && i.velocities.push({
                                position: r[this.isHorizontal() ? "startX" : "startY"],
                                time: i.touchStartTime
                            }), i.velocities.push({
                                position: r[this.isHorizontal() ? "currentX" : "currentY"],
                                time: n.now()
                            })), this.updateProgress(i.currentTranslate), this.setTranslate(i.currentTranslate))
                        }
                    }
                }
            }
        } else i.startMoving && i.isScrolling && this.emit("touchMoveOpposite", l)
    }

    function A(e) {
        var t = this,
            i = t.touchEventsData,
            s = t.params,
            a = t.touches,
            r = t.rtlTranslate,
            o = t.$wrapperEl,
            l = t.slidesGrid,
            d = t.snapGrid,
            h = e;
        if (h.originalEvent && (h = h.originalEvent), i.allowTouchCallbacks && t.emit("touchEnd", h), i.allowTouchCallbacks = !1, !i.isTouched) return i.isMoved && s.grabCursor && t.setGrabCursor(!1), i.isMoved = !1, void(i.startMoving = !1);
        s.grabCursor && i.isMoved && i.isTouched && (!0 === t.allowSlideNext || !0 === t.allowSlidePrev) && t.setGrabCursor(!1);
        var p, c = n.now(),
            u = c - i.touchStartTime;
        if (t.allowClick && (t.updateClickedSlide(h), t.emit("tap click", h), u < 300 && c - i.lastClickTime < 300 && t.emit("doubleTap doubleClick", h)), i.lastClickTime = n.now(), n.nextTick((function() {
                t.destroyed || (t.allowClick = !0)
            })), !i.isTouched || !i.isMoved || !t.swipeDirection || 0 === a.diff || i.currentTranslate === i.startTranslate) return i.isTouched = !1, i.isMoved = !1, void(i.startMoving = !1);
        if (i.isTouched = !1, i.isMoved = !1, i.startMoving = !1, p = s.followFinger ? r ? t.translate : -t.translate : -i.currentTranslate, !s.cssMode)
            if (s.freeMode) {
                if (p < -t.minTranslate()) return void t.slideTo(t.activeIndex);
                if (p > -t.maxTranslate()) return void(t.slides.length < d.length ? t.slideTo(d.length - 1) : t.slideTo(t.slides.length - 1));
                if (s.freeModeMomentum) {
                    if (i.velocities.length > 1) {
                        var v = i.velocities.pop(),
                            f = i.velocities.pop(),
                            m = v.position - f.position,
                            g = v.time - f.time;
                        t.velocity = m / g, t.velocity /= 2, Math.abs(t.velocity) < s.freeModeMinimumVelocity && (t.velocity = 0), (g > 150 || n.now() - v.time > 300) && (t.velocity = 0)
                    } else t.velocity = 0;
                    t.velocity *= s.freeModeMomentumVelocityRatio, i.velocities.length = 0;
                    var b = 1e3 * s.freeModeMomentumRatio,
                        w = t.velocity * b,
                        y = t.translate + w;
                    r && (y = -y);
                    var x, T, E = !1,
                        S = 20 * Math.abs(t.velocity) * s.freeModeMomentumBounceRatio;
                    if (y < t.maxTranslate()) s.freeModeMomentumBounce ? (y + t.maxTranslate() < -S && (y = t.maxTranslate() - S), x = t.maxTranslate(), E = !0, i.allowMomentumBounce = !0) : y = t.maxTranslate(), s.loop && s.centeredSlides && (T = !0);
                    else if (y > t.minTranslate()) s.freeModeMomentumBounce ? (y - t.minTranslate() > S && (y = t.minTranslate() + S), x = t.minTranslate(), E = !0, i.allowMomentumBounce = !0) : y = t.minTranslate(), s.loop && s.centeredSlides && (T = !0);
                    else if (s.freeModeSticky) {
                        for (var C, M = 0; M < d.length; M += 1)
                            if (d[M] > -y) {
                                C = M;
                                break
                            }
                        y = -(y = Math.abs(d[C] - y) < Math.abs(d[C - 1] - y) || "next" === t.swipeDirection ? d[C] : d[C - 1])
                    }
                    if (T && t.once("transitionEnd", (function() {
                            t.loopFix()
                        })), 0 !== t.velocity) {
                        if (b = r ? Math.abs((-y - t.translate) / t.velocity) : Math.abs((y - t.translate) / t.velocity), s.freeModeSticky) {
                            var P = Math.abs((r ? -y : y) - t.translate),
                                z = t.slidesSizesGrid[t.activeIndex];
                            b = P < z ? s.speed : P < 2 * z ? 1.5 * s.speed : 2.5 * s.speed
                        }
                    } else if (s.freeModeSticky) return void t.slideToClosest();
                    s.freeModeMomentumBounce && E ? (t.updateProgress(x), t.setTransition(b), t.setTranslate(y), t.transitionStart(!0, t.swipeDirection), t.animating = !0, o.transitionEnd((function() {
                        t && !t.destroyed && i.allowMomentumBounce && (t.emit("momentumBounce"), t.setTransition(s.speed), t.setTranslate(x), o.transitionEnd((function() {
                            t && !t.destroyed && t.transitionEnd()
                        })))
                    }))) : t.velocity ? (t.updateProgress(y), t.setTransition(b), t.setTranslate(y), t.transitionStart(!0, t.swipeDirection), t.animating || (t.animating = !0, o.transitionEnd((function() {
                        t && !t.destroyed && t.transitionEnd()
                    })))) : t.updateProgress(y), t.updateActiveIndex(), t.updateSlidesClasses()
                } else if (s.freeModeSticky) return void t.slideToClosest();
                (!s.freeModeMomentum || u >= s.longSwipesMs) && (t.updateProgress(), t.updateActiveIndex(), t.updateSlidesClasses())
            } else {
                for (var k = 0, $ = t.slidesSizesGrid[0], L = 0; L < l.length; L += L < s.slidesPerGroupSkip ? 1 : s.slidesPerGroup) {
                    var I = L < s.slidesPerGroupSkip - 1 ? 1 : s.slidesPerGroup;
                    void 0 !== l[L + I] ? p >= l[L] && p < l[L + I] && (k = L, $ = l[L + I] - l[L]) : p >= l[L] && (k = L, $ = l[l.length - 1] - l[l.length - 2])
                }
                var D = (p - l[k]) / $,
                    O = k < s.slidesPerGroupSkip - 1 ? 1 : s.slidesPerGroup;
                if (u > s.longSwipesMs) {
                    if (!s.longSwipes) return void t.slideTo(t.activeIndex);
                    "next" === t.swipeDirection && (D >= s.longSwipesRatio ? t.slideTo(k + O) : t.slideTo(k)), "prev" === t.swipeDirection && (D > 1 - s.longSwipesRatio ? t.slideTo(k + O) : t.slideTo(k))
                } else {
                    if (!s.shortSwipes) return void t.slideTo(t.activeIndex);
                    t.navigation && (h.target === t.navigation.nextEl || h.target === t.navigation.prevEl) ? h.target === t.navigation.nextEl ? t.slideTo(k + O) : t.slideTo(k) : ("next" === t.swipeDirection && t.slideTo(k + O), "prev" === t.swipeDirection && t.slideTo(k))
                }
            }
    }

    function G() {
        var e = this.params,
            t = this.el;
        if (!t || 0 !== t.offsetWidth) {
            e.breakpoints && this.setBreakpoint();
            var i = this.allowSlideNext,
                s = this.allowSlidePrev,
                a = this.snapGrid;
            this.allowSlideNext = !0, this.allowSlidePrev = !0, this.updateSize(), this.updateSlides(), this.updateSlidesClasses(), ("auto" === e.slidesPerView || e.slidesPerView > 1) && this.isEnd && !this.params.centeredSlides ? this.slideTo(this.slides.length - 1, 0, !1, !0) : this.slideTo(this.activeIndex, 0, !1, !0), this.autoplay && this.autoplay.running && this.autoplay.paused && this.autoplay.run(), this.allowSlidePrev = s, this.allowSlideNext = i, this.params.watchOverflow && a !== this.snapGrid && this.checkOverflow()
        }
    }

    function H(e) {
        this.allowClick || (this.params.preventClicks && e.preventDefault(), this.params.preventClicksPropagation && this.animating && (e.stopPropagation(), e.stopImmediatePropagation()))
    }

    function B() {
        var e = this.wrapperEl;
        this.previousTranslate = this.translate, this.translate = this.isHorizontal() ? -e.scrollLeft : -e.scrollTop, -0 === this.translate && (this.translate = 0), this.updateActiveIndex(), this.updateSlidesClasses();
        var t = this.maxTranslate() - this.minTranslate();
        (0 === t ? 0 : (this.translate - this.minTranslate()) / t) !== this.progress && this.updateProgress(this.translate), this.emit("setTranslate", this.translate, !1)
    }
    var N = !1;

    function X() {}
    var V = {
            init: !0,
            direction: "horizontal",
            touchEventsTarget: "container",
            initialSlide: 0,
            speed: 300,
            cssMode: !1,
            updateOnWindowResize: !0,
            preventInteractionOnTransition: !1,
            edgeSwipeDetection: !1,
            edgeSwipeThreshold: 20,
            freeMode: !1,
            freeModeMomentum: !0,
            freeModeMomentumRatio: 1,
            freeModeMomentumBounce: !0,
            freeModeMomentumBounceRatio: 1,
            freeModeMomentumVelocityRatio: 1,
            freeModeSticky: !1,
            freeModeMinimumVelocity: .02,
            autoHeight: !1,
            setWrapperSize: !1,
            virtualTranslate: !1,
            effect: "slide",
            breakpoints: void 0,
            spaceBetween: 0,
            slidesPerView: 1,
            slidesPerColumn: 1,
            slidesPerColumnFill: "column",
            slidesPerGroup: 1,
            slidesPerGroupSkip: 0,
            centeredSlides: !1,
            centeredSlidesBounds: !1,
            slidesOffsetBefore: 0,
            slidesOffsetAfter: 0,
            normalizeSlideIndex: !0,
            centerInsufficientSlides: !1,
            watchOverflow: !1,
            roundLengths: !1,
            touchRatio: 1,
            touchAngle: 45,
            simulateTouch: !0,
            shortSwipes: !0,
            longSwipes: !0,
            longSwipesRatio: .5,
            longSwipesMs: 300,
            followFinger: !0,
            allowTouchMove: !0,
            threshold: 0,
            touchMoveStopPropagation: !1,
            touchStartPreventDefault: !0,
            touchStartForcePreventDefault: !1,
            touchReleaseOnEdges: !1,
            uniqueNavElements: !0,
            resistance: !0,
            resistanceRatio: .85,
            watchSlidesProgress: !1,
            watchSlidesVisibility: !1,
            grabCursor: !1,
            preventClicks: !0,
            preventClicksPropagation: !0,
            slideToClickedSlide: !1,
            preloadImages: !0,
            updateOnImagesReady: !0,
            loop: !1,
            loopAdditionalSlides: 0,
            loopedSlides: null,
            loopFillGroupWithBlank: !1,
            allowSlidePrev: !0,
            allowSlideNext: !0,
            swipeHandler: null,
            noSwiping: !0,
            noSwipingClass: "swiper-no-swiping",
            noSwipingSelector: null,
            passiveListeners: !0,
            containerModifierClass: "swiper-container-",
            slideClass: "swiper-slide",
            slideBlankClass: "swiper-slide-invisible-blank",
            slideActiveClass: "swiper-slide-active",
            slideDuplicateActiveClass: "swiper-slide-duplicate-active",
            slideVisibleClass: "swiper-slide-visible",
            slideDuplicateClass: "swiper-slide-duplicate",
            slideNextClass: "swiper-slide-next",
            slideDuplicateNextClass: "swiper-slide-duplicate-next",
            slidePrevClass: "swiper-slide-prev",
            slideDuplicatePrevClass: "swiper-slide-duplicate-prev",
            wrapperClass: "swiper-wrapper",
            runCallbacksOnInit: !0
        },
        Y = {
            update: h,
            translate: p,
            transition: c,
            slide: u,
            loop: v,
            grabCursor: f,
            manipulation: L,
            events: {
                attachEvents: function() {
                    var t = this.params,
                        i = this.touchEvents,
                        s = this.el,
                        a = this.wrapperEl;
                    this.onTouchStart = D.bind(this), this.onTouchMove = O.bind(this), this.onTouchEnd = A.bind(this), t.cssMode && (this.onScroll = B.bind(this)), this.onClick = H.bind(this);
                    var r = !!t.nested;
                    if (!o.touch && o.pointerEvents) s.addEventListener(i.start, this.onTouchStart, !1), e.addEventListener(i.move, this.onTouchMove, r), e.addEventListener(i.end, this.onTouchEnd, !1);
                    else {
                        if (o.touch) {
                            var n = !("touchstart" !== i.start || !o.passiveListener || !t.passiveListeners) && {
                                passive: !0,
                                capture: !1
                            };
                            s.addEventListener(i.start, this.onTouchStart, n), s.addEventListener(i.move, this.onTouchMove, o.passiveListener ? {
                                passive: !1,
                                capture: r
                            } : r), s.addEventListener(i.end, this.onTouchEnd, n), i.cancel && s.addEventListener(i.cancel, this.onTouchEnd, n), N || (e.addEventListener("touchstart", X), N = !0)
                        }(t.simulateTouch && !I.ios && !I.android || t.simulateTouch && !o.touch && I.ios) && (s.addEventListener("mousedown", this.onTouchStart, !1), e.addEventListener("mousemove", this.onTouchMove, r), e.addEventListener("mouseup", this.onTouchEnd, !1))
                    }(t.preventClicks || t.preventClicksPropagation) && s.addEventListener("click", this.onClick, !0), t.cssMode && a.addEventListener("scroll", this.onScroll), t.updateOnWindowResize ? this.on(I.ios || I.android ? "resize orientationchange observerUpdate" : "resize observerUpdate", G, !0) : this.on("observerUpdate", G, !0)
                },
                detachEvents: function() {
                    var t = this.params,
                        i = this.touchEvents,
                        s = this.el,
                        a = this.wrapperEl,
                        r = !!t.nested;
                    if (!o.touch && o.pointerEvents) s.removeEventListener(i.start, this.onTouchStart, !1), e.removeEventListener(i.move, this.onTouchMove, r), e.removeEventListener(i.end, this.onTouchEnd, !1);
                    else {
                        if (o.touch) {
                            var n = !("onTouchStart" !== i.start || !o.passiveListener || !t.passiveListeners) && {
                                passive: !0,
                                capture: !1
                            };
                            s.removeEventListener(i.start, this.onTouchStart, n), s.removeEventListener(i.move, this.onTouchMove, r), s.removeEventListener(i.end, this.onTouchEnd, n), i.cancel && s.removeEventListener(i.cancel, this.onTouchEnd, n)
                        }(t.simulateTouch && !I.ios && !I.android || t.simulateTouch && !o.touch && I.ios) && (s.removeEventListener("mousedown", this.onTouchStart, !1), e.removeEventListener("mousemove", this.onTouchMove, r), e.removeEventListener("mouseup", this.onTouchEnd, !1))
                    }(t.preventClicks || t.preventClicksPropagation) && s.removeEventListener("click", this.onClick, !0), t.cssMode && a.removeEventListener("scroll", this.onScroll), this.off(I.ios || I.android ? "resize orientationchange observerUpdate" : "resize observerUpdate", G)
                }
            },
            breakpoints: {
                setBreakpoint: function() {
                    var e = this.activeIndex,
                        t = this.initialized,
                        i = this.loopedSlides;
                    void 0 === i && (i = 0);
                    var s = this.params,
                        a = this.$el,
                        r = s.breakpoints;
                    if (r && (!r || 0 !== Object.keys(r).length)) {
                        var o = this.getBreakpoint(r);
                        if (o && this.currentBreakpoint !== o) {
                            var l = o in r ? r[o] : void 0;
                            l && ["slidesPerView", "spaceBetween", "slidesPerGroup", "slidesPerGroupSkip", "slidesPerColumn"].forEach((function(e) {
                                var t = l[e];
                                void 0 !== t && (l[e] = "slidesPerView" !== e || "AUTO" !== t && "auto" !== t ? "slidesPerView" === e ? parseFloat(t) : parseInt(t, 10) : "auto")
                            }));
                            var d = l || this.originalParams,
                                h = s.slidesPerColumn > 1,
                                p = d.slidesPerColumn > 1;
                            h && !p ? a.removeClass(s.containerModifierClass + "multirow " + s.containerModifierClass + "multirow-column") : !h && p && (a.addClass(s.containerModifierClass + "multirow"), "column" === d.slidesPerColumnFill && a.addClass(s.containerModifierClass + "multirow-column"));
                            var c = d.direction && d.direction !== s.direction,
                                u = s.loop && (d.slidesPerView !== s.slidesPerView || c);
                            c && t && this.changeDirection(), n.extend(this.params, d), n.extend(this, {
                                allowTouchMove: this.params.allowTouchMove,
                                allowSlideNext: this.params.allowSlideNext,
                                allowSlidePrev: this.params.allowSlidePrev
                            }), this.currentBreakpoint = o, u && t && (this.loopDestroy(), this.loopCreate(), this.updateSlides(), this.slideTo(e - i + this.loopedSlides, 0, !1)), this.emit("breakpoint", d)
                        }
                    }
                },
                getBreakpoint: function(e) {
                    if (e) {
                        var i = !1,
                            s = Object.keys(e).map((function(e) {
                                if ("string" == typeof e && 0 === e.indexOf("@")) {
                                    var i = parseFloat(e.substr(1));
                                    return {
                                        value: t.innerHeight * i,
                                        point: e
                                    }
                                }
                                return {
                                    value: e,
                                    point: e
                                }
                            }));
                        s.sort((function(e, t) {
                            return parseInt(e.value, 10) - parseInt(t.value, 10)
                        }));
                        for (var a = 0; a < s.length; a += 1) {
                            var r = s[a],
                                n = r.point;
                            r.value <= t.innerWidth && (i = n)
                        }
                        return i || "max"
                    }
                }
            },
            checkOverflow: {
                checkOverflow: function() {
                    var e = this.params,
                        t = this.isLocked,
                        i = this.slides.length > 0 && e.slidesOffsetBefore + e.spaceBetween * (this.slides.length - 1) + this.slides[0].offsetWidth * this.slides.length;
                    e.slidesOffsetBefore && e.slidesOffsetAfter && i ? this.isLocked = i <= this.size : this.isLocked = 1 === this.snapGrid.length, this.allowSlideNext = !this.isLocked, this.allowSlidePrev = !this.isLocked, t !== this.isLocked && this.emit(this.isLocked ? "lock" : "unlock"), t && t !== this.isLocked && (this.isEnd = !1, this.navigation.update())
                }
            },
            classes: {
                addClasses: function() {
                    var e = this.classNames,
                        t = this.params,
                        i = this.rtl,
                        s = this.$el,
                        a = [];
                    a.push("initialized"), a.push(t.direction), t.freeMode && a.push("free-mode"), t.autoHeight && a.push("autoheight"), i && a.push("rtl"), t.slidesPerColumn > 1 && (a.push("multirow"), "column" === t.slidesPerColumnFill && a.push("multirow-column")), I.android && a.push("android"), I.ios && a.push("ios"), t.cssMode && a.push("css-mode"), a.forEach((function(i) {
                        e.push(t.containerModifierClass + i)
                    })), s.addClass(e.join(" "))
                },
                removeClasses: function() {
                    var e = this.$el,
                        t = this.classNames;
                    e.removeClass(t.join(" "))
                }
            },
            images: {
                loadImage: function(e, i, s, a, r, n) {
                    var o;

                    function l() {
                        n && n()
                    }
                    e.complete && r ? l() : i ? ((o = new t.Image).onload = l, o.onerror = l, a && (o.sizes = a), s && (o.srcset = s), i && (o.src = i)) : l()
                },
                preloadImages: function() {
                    var e = this;

                    function t() {
                        null != e && e && !e.destroyed && (void 0 !== e.imagesLoaded && (e.imagesLoaded += 1), e.imagesLoaded === e.imagesToLoad.length && (e.params.updateOnImagesReady && e.update(), e.emit("imagesReady")))
                    }
                    e.imagesToLoad = e.$el.find("img");
                    for (var i = 0; i < e.imagesToLoad.length; i += 1) {
                        var s = e.imagesToLoad[i];
                        e.loadImage(s, s.currentSrc || s.getAttribute("src"), s.srcset || s.getAttribute("srcset"), s.sizes || s.getAttribute("sizes"), !0, t)
                    }
                }
            }
        },
        F = {},
        W = function(e) {
            function t() {
                for (var i, a, r, l = [], d = arguments.length; d--;) l[d] = arguments[d];
                1 === l.length && l[0].constructor && l[0].constructor === Object ? r = l[0] : (a = (i = l)[0], r = i[1]), r || (r = {}), r = n.extend({}, r), a && !r.el && (r.el = a), e.call(this, r), Object.keys(Y).forEach((function(e) {
                    Object.keys(Y[e]).forEach((function(i) {
                        t.prototype[i] || (t.prototype[i] = Y[e][i])
                    }))
                }));
                var h = this;
                void 0 === h.modules && (h.modules = {}), Object.keys(h.modules).forEach((function(e) {
                    var t = h.modules[e];
                    if (t.params) {
                        var i = Object.keys(t.params)[0],
                            s = t.params[i];
                        if ("object" != typeof s || null === s) return;
                        if (!(i in r && "enabled" in s)) return;
                        !0 === r[i] && (r[i] = {
                            enabled: !0
                        }), "object" != typeof r[i] || "enabled" in r[i] || (r[i].enabled = !0), r[i] || (r[i] = {
                            enabled: !1
                        })
                    }
                }));
                var p = n.extend({}, V);
                h.useModulesParams(p), h.params = n.extend({}, p, F, r), h.originalParams = n.extend({}, h.params), h.passedParams = n.extend({}, r), h.$ = s;
                var c = s(h.params.el);
                if (a = c[0]) {
                    if (c.length > 1) {
                        var u = [];
                        return c.each((function(e, i) {
                            var s = n.extend({}, r, {
                                el: i
                            });
                            u.push(new t(s))
                        })), u
                    }
                    var v, f, m;
                    return a.swiper = h, c.data("swiper", h), a && a.shadowRoot && a.shadowRoot.querySelector ? (v = s(a.shadowRoot.querySelector("." + h.params.wrapperClass))).children = function(e) {
                        return c.children(e)
                    } : v = c.children("." + h.params.wrapperClass), n.extend(h, {
                        $el: c,
                        el: a,
                        $wrapperEl: v,
                        wrapperEl: v[0],
                        classNames: [],
                        slides: s(),
                        slidesGrid: [],
                        snapGrid: [],
                        slidesSizesGrid: [],
                        isHorizontal: function() {
                            return "horizontal" === h.params.direction
                        },
                        isVertical: function() {
                            return "vertical" === h.params.direction
                        },
                        rtl: "rtl" === a.dir.toLowerCase() || "rtl" === c.css("direction"),
                        rtlTranslate: "horizontal" === h.params.direction && ("rtl" === a.dir.toLowerCase() || "rtl" === c.css("direction")),
                        wrongRTL: "-webkit-box" === v.css("display"),
                        activeIndex: 0,
                        realIndex: 0,
                        isBeginning: !0,
                        isEnd: !1,
                        translate: 0,
                        previousTranslate: 0,
                        progress: 0,
                        velocity: 0,
                        animating: !1,
                        allowSlideNext: h.params.allowSlideNext,
                        allowSlidePrev: h.params.allowSlidePrev,
                        touchEvents: (f = ["touchstart", "touchmove", "touchend", "touchcancel"], m = ["mousedown", "mousemove", "mouseup"], o.pointerEvents && (m = ["pointerdown", "pointermove", "pointerup"]), h.touchEventsTouch = {
                            start: f[0],
                            move: f[1],
                            end: f[2],
                            cancel: f[3]
                        }, h.touchEventsDesktop = {
                            start: m[0],
                            move: m[1],
                            end: m[2]
                        }, o.touch || !h.params.simulateTouch ? h.touchEventsTouch : h.touchEventsDesktop),
                        touchEventsData: {
                            isTouched: void 0,
                            isMoved: void 0,
                            allowTouchCallbacks: void 0,
                            touchStartTime: void 0,
                            isScrolling: void 0,
                            currentTranslate: void 0,
                            startTranslate: void 0,
                            allowThresholdMove: void 0,
                            formElements: "input, select, option, textarea, button, video, label",
                            lastClickTime: n.now(),
                            clickTimeout: void 0,
                            velocities: [],
                            allowMomentumBounce: void 0,
                            isTouchEvent: void 0,
                            startMoving: void 0
                        },
                        allowClick: !0,
                        allowTouchMove: h.params.allowTouchMove,
                        touches: {
                            startX: 0,
                            startY: 0,
                            currentX: 0,
                            currentY: 0,
                            diff: 0
                        },
                        imagesToLoad: [],
                        imagesLoaded: 0
                    }), h.useModules(), h.params.init && h.init(), h
                }
            }
            e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t;
            var i = {
                extendedDefaults: {
                    configurable: !0
                },
                defaults: {
                    configurable: !0
                },
                Class: {
                    configurable: !0
                },
                $: {
                    configurable: !0
                }
            };
            return t.prototype.slidesPerViewDynamic = function() {
                var e = this.params,
                    t = this.slides,
                    i = this.slidesGrid,
                    s = this.size,
                    a = this.activeIndex,
                    r = 1;
                if (e.centeredSlides) {
                    for (var n, o = t[a].swiperSlideSize, l = a + 1; l < t.length; l += 1) t[l] && !n && (r += 1, (o += t[l].swiperSlideSize) > s && (n = !0));
                    for (var d = a - 1; d >= 0; d -= 1) t[d] && !n && (r += 1, (o += t[d].swiperSlideSize) > s && (n = !0))
                } else
                    for (var h = a + 1; h < t.length; h += 1) i[h] - i[a] < s && (r += 1);
                return r
            }, t.prototype.update = function() {
                var e = this;
                if (e && !e.destroyed) {
                    var t = e.snapGrid,
                        i = e.params;
                    i.breakpoints && e.setBreakpoint(), e.updateSize(), e.updateSlides(), e.updateProgress(), e.updateSlidesClasses(), e.params.freeMode ? (s(), e.params.autoHeight && e.updateAutoHeight()) : (("auto" === e.params.slidesPerView || e.params.slidesPerView > 1) && e.isEnd && !e.params.centeredSlides ? e.slideTo(e.slides.length - 1, 0, !1, !0) : e.slideTo(e.activeIndex, 0, !1, !0)) || s(), i.watchOverflow && t !== e.snapGrid && e.checkOverflow(), e.emit("update")
                }

                function s() {
                    var t = e.rtlTranslate ? -1 * e.translate : e.translate,
                        i = Math.min(Math.max(t, e.maxTranslate()), e.minTranslate());
                    e.setTranslate(i), e.updateActiveIndex(), e.updateSlidesClasses()
                }
            }, t.prototype.changeDirection = function(e, t) {
                void 0 === t && (t = !0);
                var i = this.params.direction;
                return e || (e = "horizontal" === i ? "vertical" : "horizontal"), e === i || "horizontal" !== e && "vertical" !== e ? this : (this.$el.removeClass("" + this.params.containerModifierClass + i).addClass("" + this.params.containerModifierClass + e), this.params.direction = e, this.slides.each((function(t, i) {
                    "vertical" === e ? i.style.width = "" : i.style.height = ""
                })), this.emit("changeDirection"), t && this.update(), this)
            }, t.prototype.init = function() {
                this.initialized || (this.emit("beforeInit"), this.params.breakpoints && this.setBreakpoint(), this.addClasses(), this.params.loop && this.loopCreate(), this.updateSize(), this.updateSlides(), this.params.watchOverflow && this.checkOverflow(), this.params.grabCursor && this.setGrabCursor(), this.params.preloadImages && this.preloadImages(), this.params.loop ? this.slideTo(this.params.initialSlide + this.loopedSlides, 0, this.params.runCallbacksOnInit) : this.slideTo(this.params.initialSlide, 0, this.params.runCallbacksOnInit), this.attachEvents(), this.initialized = !0, this.emit("init"))
            }, t.prototype.destroy = function(e, t) {
                void 0 === e && (e = !0), void 0 === t && (t = !0);
                var i = this,
                    s = i.params,
                    a = i.$el,
                    r = i.$wrapperEl,
                    o = i.slides;
                return void 0 === i.params || i.destroyed ? null : (i.emit("beforeDestroy"), i.initialized = !1, i.detachEvents(), s.loop && i.loopDestroy(), t && (i.removeClasses(), a.removeAttr("style"), r.removeAttr("style"), o && o.length && o.removeClass([s.slideVisibleClass, s.slideActiveClass, s.slideNextClass, s.slidePrevClass].join(" ")).removeAttr("style").removeAttr("data-swiper-slide-index")), i.emit("destroy"), Object.keys(i.eventsListeners).forEach((function(e) {
                    i.off(e)
                })), !1 !== e && (i.$el[0].swiper = null, i.$el.data("swiper", null), n.deleteProps(i)), i.destroyed = !0, null)
            }, t.extendDefaults = function(e) {
                n.extend(F, e)
            }, i.extendedDefaults.get = function() {
                return F
            }, i.defaults.get = function() {
                return V
            }, i.Class.get = function() {
                return e
            }, i.$.get = function() {
                return s
            }, Object.defineProperties(t, i), t
        }(l),
        R = {
            name: "device",
            proto: {
                device: I
            },
            static: {
                device: I
            }
        },
        q = {
            name: "support",
            proto: {
                support: o
            },
            static: {
                support: o
            }
        },
        j = {
            isEdge: !!t.navigator.userAgent.match(/Edge/g),
            isSafari: function() {
                var e = t.navigator.userAgent.toLowerCase();
                return e.indexOf("safari") >= 0 && e.indexOf("chrome") < 0 && e.indexOf("android") < 0
            }(),
            isUiWebView: /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(t.navigator.userAgent)
        },
        K = {
            name: "browser",
            proto: {
                browser: j
            },
            static: {
                browser: j
            }
        },
        U = {
            name: "resize",
            create: function() {
                var e = this;
                n.extend(e, {
                    resize: {
                        resizeHandler: function() {
                            e && !e.destroyed && e.initialized && (e.emit("beforeResize"), e.emit("resize"))
                        },
                        orientationChangeHandler: function() {
                            e && !e.destroyed && e.initialized && e.emit("orientationchange")
                        }
                    }
                })
            },
            on: {
                init: function() {
                    t.addEventListener("resize", this.resize.resizeHandler), t.addEventListener("orientationchange", this.resize.orientationChangeHandler)
                },
                destroy: function() {
                    t.removeEventListener("resize", this.resize.resizeHandler), t.removeEventListener("orientationchange", this.resize.orientationChangeHandler)
                }
            }
        },
        _ = {
            func: t.MutationObserver || t.WebkitMutationObserver,
            attach: function(e, i) {
                void 0 === i && (i = {});
                var s = this,
                    a = new(0, _.func)((function(e) {
                        if (1 !== e.length) {
                            var i = function() {
                                s.emit("observerUpdate", e[0])
                            };
                            t.requestAnimationFrame ? t.requestAnimationFrame(i) : t.setTimeout(i, 0)
                        } else s.emit("observerUpdate", e[0])
                    }));
                a.observe(e, {
                    attributes: void 0 === i.attributes || i.attributes,
                    childList: void 0 === i.childList || i.childList,
                    characterData: void 0 === i.characterData || i.characterData
                }), s.observer.observers.push(a)
            },
            init: function() {
                if (o.observer && this.params.observer) {
                    if (this.params.observeParents)
                        for (var e = this.$el.parents(), t = 0; t < e.length; t += 1) this.observer.attach(e[t]);
                    this.observer.attach(this.$el[0], {
                        childList: this.params.observeSlideChildren
                    }), this.observer.attach(this.$wrapperEl[0], {
                        attributes: !1
                    })
                }
            },
            destroy: function() {
                this.observer.observers.forEach((function(e) {
                    e.disconnect()
                })), this.observer.observers = []
            }
        },
        Z = {
            name: "observer",
            params: {
                observer: !1,
                observeParents: !1,
                observeSlideChildren: !1
            },
            create: function() {
                n.extend(this, {
                    observer: {
                        init: _.init.bind(this),
                        attach: _.attach.bind(this),
                        destroy: _.destroy.bind(this),
                        observers: []
                    }
                })
            },
            on: {
                init: function() {
                    this.observer.init()
                },
                destroy: function() {
                    this.observer.destroy()
                }
            }
        },
        Q = {
            update: function(e) {
                var t = this,
                    i = t.params,
                    s = i.slidesPerView,
                    a = i.slidesPerGroup,
                    r = i.centeredSlides,
                    o = t.params.virtual,
                    l = o.addSlidesBefore,
                    d = o.addSlidesAfter,
                    h = t.virtual,
                    p = h.from,
                    c = h.to,
                    u = h.slides,
                    v = h.slidesGrid,
                    f = h.renderSlide,
                    m = h.offset;
                t.updateActiveIndex();
                var g, b, w, y = t.activeIndex || 0;
                g = t.rtlTranslate ? "right" : t.isHorizontal() ? "left" : "top", r ? (b = Math.floor(s / 2) + a + l, w = Math.floor(s / 2) + a + d) : (b = s + (a - 1) + l, w = a + d);
                var x = Math.max((y || 0) - w, 0),
                    T = Math.min((y || 0) + b, u.length - 1),
                    E = (t.slidesGrid[x] || 0) - (t.slidesGrid[0] || 0);

                function S() {
                    t.updateSlides(), t.updateProgress(), t.updateSlidesClasses(), t.lazy && t.params.lazy.enabled && t.lazy.load()
                }
                if (n.extend(t.virtual, {
                        from: x,
                        to: T,
                        offset: E,
                        slidesGrid: t.slidesGrid
                    }), p === x && c === T && !e) return t.slidesGrid !== v && E !== m && t.slides.css(g, E + "px"), void t.updateProgress();
                if (t.params.virtual.renderExternal) return t.params.virtual.renderExternal.call(t, {
                    offset: E,
                    from: x,
                    to: T,
                    slides: function() {
                        for (var e = [], t = x; t <= T; t += 1) e.push(u[t]);
                        return e
                    }()
                }), void S();
                var C = [],
                    M = [];
                if (e) t.$wrapperEl.find("." + t.params.slideClass).remove();
                else
                    for (var P = p; P <= c; P += 1)(P < x || P > T) && t.$wrapperEl.find("." + t.params.slideClass + '[data-swiper-slide-index="' + P + '"]').remove();
                for (var z = 0; z < u.length; z += 1) z >= x && z <= T && (void 0 === c || e ? M.push(z) : (z > c && M.push(z), z < p && C.push(z)));
                M.forEach((function(e) {
                    t.$wrapperEl.append(f(u[e], e))
                })), C.sort((function(e, t) {
                    return t - e
                })).forEach((function(e) {
                    t.$wrapperEl.prepend(f(u[e], e))
                })), t.$wrapperEl.children(".swiper-slide").css(g, E + "px"), S()
            },
            renderSlide: function(e, t) {
                var i = this.params.virtual;
                if (i.cache && this.virtual.cache[t]) return this.virtual.cache[t];
                var a = i.renderSlide ? s(i.renderSlide.call(this, e, t)) : s('<div class="' + this.params.slideClass + '" data-swiper-slide-index="' + t + '">' + e + "</div>");
                return a.attr("data-swiper-slide-index") || a.attr("data-swiper-slide-index", t), i.cache && (this.virtual.cache[t] = a), a
            },
            appendSlide: function(e) {
                if ("object" == typeof e && "length" in e)
                    for (var t = 0; t < e.length; t += 1) e[t] && this.virtual.slides.push(e[t]);
                else this.virtual.slides.push(e);
                this.virtual.update(!0)
            },
            prependSlide: function(e) {
                var t = this.activeIndex,
                    i = t + 1,
                    s = 1;
                if (Array.isArray(e)) {
                    for (var a = 0; a < e.length; a += 1) e[a] && this.virtual.slides.unshift(e[a]);
                    i = t + e.length, s = e.length
                } else this.virtual.slides.unshift(e);
                if (this.params.virtual.cache) {
                    var r = this.virtual.cache,
                        n = {};
                    Object.keys(r).forEach((function(e) {
                        var t = r[e],
                            i = t.attr("data-swiper-slide-index");
                        i && t.attr("data-swiper-slide-index", parseInt(i, 10) + 1), n[parseInt(e, 10) + s] = t
                    })), this.virtual.cache = n
                }
                this.virtual.update(!0), this.slideTo(i, 0)
            },
            removeSlide: function(e) {
                if (null != e) {
                    var t = this.activeIndex;
                    if (Array.isArray(e))
                        for (var i = e.length - 1; i >= 0; i -= 1) this.virtual.slides.splice(e[i], 1), this.params.virtual.cache && delete this.virtual.cache[e[i]], e[i] < t && (t -= 1), t = Math.max(t, 0);
                    else this.virtual.slides.splice(e, 1), this.params.virtual.cache && delete this.virtual.cache[e], e < t && (t -= 1), t = Math.max(t, 0);
                    this.virtual.update(!0), this.slideTo(t, 0)
                }
            },
            removeAllSlides: function() {
                this.virtual.slides = [], this.params.virtual.cache && (this.virtual.cache = {}), this.virtual.update(!0), this.slideTo(0, 0)
            }
        },
        J = {
            name: "virtual",
            params: {
                virtual: {
                    enabled: !1,
                    slides: [],
                    cache: !0,
                    renderSlide: null,
                    renderExternal: null,
                    addSlidesBefore: 0,
                    addSlidesAfter: 0
                }
            },
            create: function() {
                n.extend(this, {
                    virtual: {
                        update: Q.update.bind(this),
                        appendSlide: Q.appendSlide.bind(this),
                        prependSlide: Q.prependSlide.bind(this),
                        removeSlide: Q.removeSlide.bind(this),
                        removeAllSlides: Q.removeAllSlides.bind(this),
                        renderSlide: Q.renderSlide.bind(this),
                        slides: this.params.virtual.slides,
                        cache: {}
                    }
                })
            },
            on: {
                beforeInit: function() {
                    if (this.params.virtual.enabled) {
                        this.classNames.push(this.params.containerModifierClass + "virtual");
                        var e = {
                            watchSlidesProgress: !0
                        };
                        n.extend(this.params, e), n.extend(this.originalParams, e), this.params.initialSlide || this.virtual.update()
                    }
                },
                setTranslate: function() {
                    this.params.virtual.enabled && this.virtual.update()
                }
            }
        },
        ee = {
            handle: function(i) {
                var s = this.rtlTranslate,
                    a = i;
                a.originalEvent && (a = a.originalEvent);
                var r = a.keyCode || a.charCode;
                if (!this.allowSlideNext && (this.isHorizontal() && 39 === r || this.isVertical() && 40 === r || 34 === r)) return !1;
                if (!this.allowSlidePrev && (this.isHorizontal() && 37 === r || this.isVertical() && 38 === r || 33 === r)) return !1;
                if (!(a.shiftKey || a.altKey || a.ctrlKey || a.metaKey || e.activeElement && e.activeElement.nodeName && ("input" === e.activeElement.nodeName.toLowerCase() || "textarea" === e.activeElement.nodeName.toLowerCase()))) {
                    if (this.params.keyboard.onlyInViewport && (33 === r || 34 === r || 37 === r || 39 === r || 38 === r || 40 === r)) {
                        var n = !1;
                        if (this.$el.parents("." + this.params.slideClass).length > 0 && 0 === this.$el.parents("." + this.params.slideActiveClass).length) return;
                        var o = t.innerWidth,
                            l = t.innerHeight,
                            d = this.$el.offset();
                        s && (d.left -= this.$el[0].scrollLeft);
                        for (var h = [
                                [d.left, d.top],
                                [d.left + this.width, d.top],
                                [d.left, d.top + this.height],
                                [d.left + this.width, d.top + this.height]
                            ], p = 0; p < h.length; p += 1) {
                            var c = h[p];
                            c[0] >= 0 && c[0] <= o && c[1] >= 0 && c[1] <= l && (n = !0)
                        }
                        if (!n) return
                    }
                    this.isHorizontal() ? (33 !== r && 34 !== r && 37 !== r && 39 !== r || (a.preventDefault ? a.preventDefault() : a.returnValue = !1), (34 !== r && 39 !== r || s) && (33 !== r && 37 !== r || !s) || this.slideNext(), (33 !== r && 37 !== r || s) && (34 !== r && 39 !== r || !s) || this.slidePrev()) : (33 !== r && 34 !== r && 38 !== r && 40 !== r || (a.preventDefault ? a.preventDefault() : a.returnValue = !1), 34 !== r && 40 !== r || this.slideNext(), 33 !== r && 38 !== r || this.slidePrev()), this.emit("keyPress", r)
                }
            },
            enable: function() {
                this.keyboard.enabled || (s(e).on("keydown", this.keyboard.handle), this.keyboard.enabled = !0)
            },
            disable: function() {
                this.keyboard.enabled && (s(e).off("keydown", this.keyboard.handle), this.keyboard.enabled = !1)
            }
        },
        te = {
            name: "keyboard",
            params: {
                keyboard: {
                    enabled: !1,
                    onlyInViewport: !0
                }
            },
            create: function() {
                n.extend(this, {
                    keyboard: {
                        enabled: !1,
                        enable: ee.enable.bind(this),
                        disable: ee.disable.bind(this),
                        handle: ee.handle.bind(this)
                    }
                })
            },
            on: {
                init: function() {
                    this.params.keyboard.enabled && this.keyboard.enable()
                },
                destroy: function() {
                    this.keyboard.enabled && this.keyboard.disable()
                }
            }
        };
    var ie = {
            lastScrollTime: n.now(),
            lastEventBeforeSnap: void 0,
            recentWheelEvents: [],
            event: function() {
                return t.navigator.userAgent.indexOf("firefox") > -1 ? "DOMMouseScroll" : function() {
                    var t = "onwheel" in e;
                    if (!t) {
                        var i = e.createElement("div");
                        i.setAttribute("onwheel", "return;"), t = "function" == typeof i.onwheel
                    }
                    return !t && e.implementation && e.implementation.hasFeature && !0 !== e.implementation.hasFeature("", "") && (t = e.implementation.hasFeature("Events.wheel", "3.0")), t
                }() ? "wheel" : "mousewheel"
            },
            normalize: function(e) {
                var t = 0,
                    i = 0,
                    s = 0,
                    a = 0;
                return "detail" in e && (i = e.detail), "wheelDelta" in e && (i = -e.wheelDelta / 120), "wheelDeltaY" in e && (i = -e.wheelDeltaY / 120), "wheelDeltaX" in e && (t = -e.wheelDeltaX / 120), "axis" in e && e.axis === e.HORIZONTAL_AXIS && (t = i, i = 0), s = 10 * t, a = 10 * i, "deltaY" in e && (a = e.deltaY), "deltaX" in e && (s = e.deltaX), e.shiftKey && !s && (s = a, a = 0), (s || a) && e.deltaMode && (1 === e.deltaMode ? (s *= 40, a *= 40) : (s *= 800, a *= 800)), s && !t && (t = s < 1 ? -1 : 1), a && !i && (i = a < 1 ? -1 : 1), {
                    spinX: t,
                    spinY: i,
                    pixelX: s,
                    pixelY: a
                }
            },
            handleMouseEnter: function() {
                this.mouseEntered = !0
            },
            handleMouseLeave: function() {
                this.mouseEntered = !1
            },
            handle: function(e) {
                var t = e,
                    i = this,
                    a = i.params.mousewheel;
                i.params.cssMode && t.preventDefault();
                var r = i.$el;
                if ("container" !== i.params.mousewheel.eventsTarged && (r = s(i.params.mousewheel.eventsTarged)), !i.mouseEntered && !r[0].contains(t.target) && !a.releaseOnEdges) return !0;
                t.originalEvent && (t = t.originalEvent);
                var o = 0,
                    l = i.rtlTranslate ? -1 : 1,
                    d = ie.normalize(t);
                if (a.forceToAxis)
                    if (i.isHorizontal()) {
                        if (!(Math.abs(d.pixelX) > Math.abs(d.pixelY))) return !0;
                        o = d.pixelX * l
                    } else {
                        if (!(Math.abs(d.pixelY) > Math.abs(d.pixelX))) return !0;
                        o = d.pixelY
                    }
                else o = Math.abs(d.pixelX) > Math.abs(d.pixelY) ? -d.pixelX * l : -d.pixelY;
                if (0 === o) return !0;
                if (a.invert && (o = -o), i.params.freeMode) {
                    var h = {
                            time: n.now(),
                            delta: Math.abs(o),
                            direction: Math.sign(o)
                        },
                        p = i.mousewheel.lastEventBeforeSnap,
                        c = p && h.time < p.time + 500 && h.delta <= p.delta && h.direction === p.direction;
                    if (!c) {
                        i.mousewheel.lastEventBeforeSnap = void 0, i.params.loop && i.loopFix();
                        var u = i.getTranslate() + o * a.sensitivity,
                            v = i.isBeginning,
                            f = i.isEnd;
                        if (u >= i.minTranslate() && (u = i.minTranslate()), u <= i.maxTranslate() && (u = i.maxTranslate()), i.setTransition(0), i.setTranslate(u), i.updateProgress(), i.updateActiveIndex(), i.updateSlidesClasses(), (!v && i.isBeginning || !f && i.isEnd) && i.updateSlidesClasses(), i.params.freeModeSticky) {
                            clearTimeout(i.mousewheel.timeout), i.mousewheel.timeout = void 0;
                            var m = i.mousewheel.recentWheelEvents;
                            m.length >= 15 && m.shift();
                            var g = m.length ? m[m.length - 1] : void 0,
                                b = m[0];
                            if (m.push(h), g && (h.delta > g.delta || h.direction !== g.direction)) m.splice(0);
                            else if (m.length >= 15 && h.time - b.time < 500 && b.delta - h.delta >= 1 && h.delta <= 6) {
                                var w = o > 0 ? .8 : .2;
                                i.mousewheel.lastEventBeforeSnap = h, m.splice(0), i.mousewheel.timeout = n.nextTick((function() {
                                    i.slideToClosest(i.params.speed, !0, void 0, w)
                                }), 0)
                            }
                            i.mousewheel.timeout || (i.mousewheel.timeout = n.nextTick((function() {
                                i.mousewheel.lastEventBeforeSnap = h, m.splice(0), i.slideToClosest(i.params.speed, !0, void 0, .5)
                            }), 500))
                        }
                        if (c || i.emit("scroll", t), i.params.autoplay && i.params.autoplayDisableOnInteraction && i.autoplay.stop(), u === i.minTranslate() || u === i.maxTranslate()) return !0
                    }
                } else {
                    var y = {
                            time: n.now(),
                            delta: Math.abs(o),
                            direction: Math.sign(o),
                            raw: e
                        },
                        x = i.mousewheel.recentWheelEvents;
                    x.length >= 2 && x.shift();
                    var T = x.length ? x[x.length - 1] : void 0;
                    if (x.push(y), T ? (y.direction !== T.direction || y.delta > T.delta) && i.mousewheel.animateSlider(y) : i.mousewheel.animateSlider(y), i.mousewheel.releaseScroll(y)) return !0
                }
                return t.preventDefault ? t.preventDefault() : t.returnValue = !1, !1
            },
            animateSlider: function(e) {
                return e.delta >= 6 && n.now() - this.mousewheel.lastScrollTime < 60 || (e.direction < 0 ? this.isEnd && !this.params.loop || this.animating || (this.slideNext(), this.emit("scroll", e.raw)) : this.isBeginning && !this.params.loop || this.animating || (this.slidePrev(), this.emit("scroll", e.raw)), this.mousewheel.lastScrollTime = (new t.Date).getTime(), !1)
            },
            releaseScroll: function(e) {
                var t = this.params.mousewheel;
                if (e.direction < 0) {
                    if (this.isEnd && !this.params.loop && t.releaseOnEdges) return !0
                } else if (this.isBeginning && !this.params.loop && t.releaseOnEdges) return !0;
                return !1
            },
            enable: function() {
                var e = ie.event();
                if (this.params.cssMode) return this.wrapperEl.removeEventListener(e, this.mousewheel.handle), !0;
                if (!e) return !1;
                if (this.mousewheel.enabled) return !1;
                var t = this.$el;
                return "container" !== this.params.mousewheel.eventsTarged && (t = s(this.params.mousewheel.eventsTarged)), t.on("mouseenter", this.mousewheel.handleMouseEnter), t.on("mouseleave", this.mousewheel.handleMouseLeave), t.on(e, this.mousewheel.handle), this.mousewheel.enabled = !0, !0
            },
            disable: function() {
                var e = ie.event();
                if (this.params.cssMode) return this.wrapperEl.addEventListener(e, this.mousewheel.handle), !0;
                if (!e) return !1;
                if (!this.mousewheel.enabled) return !1;
                var t = this.$el;
                return "container" !== this.params.mousewheel.eventsTarged && (t = s(this.params.mousewheel.eventsTarged)), t.off(e, this.mousewheel.handle), this.mousewheel.enabled = !1, !0
            }
        },
        se = {
            update: function() {
                var e = this.params.navigation;
                if (!this.params.loop) {
                    var t = this.navigation,
                        i = t.$nextEl,
                        s = t.$prevEl;
                    s && s.length > 0 && (this.isBeginning ? s.addClass(e.disabledClass) : s.removeClass(e.disabledClass), s[this.params.watchOverflow && this.isLocked ? "addClass" : "removeClass"](e.lockClass)), i && i.length > 0 && (this.isEnd ? i.addClass(e.disabledClass) : i.removeClass(e.disabledClass), i[this.params.watchOverflow && this.isLocked ? "addClass" : "removeClass"](e.lockClass))
                }
            },
            onPrevClick: function(e) {
                e.preventDefault(), this.isBeginning && !this.params.loop || this.slidePrev()
            },
            onNextClick: function(e) {
                e.preventDefault(), this.isEnd && !this.params.loop || this.slideNext()
            },
            init: function() {
                var e, t, i = this.params.navigation;
                (i.nextEl || i.prevEl) && (i.nextEl && (e = s(i.nextEl), this.params.uniqueNavElements && "string" == typeof i.nextEl && e.length > 1 && 1 === this.$el.find(i.nextEl).length && (e = this.$el.find(i.nextEl))), i.prevEl && (t = s(i.prevEl), this.params.uniqueNavElements && "string" == typeof i.prevEl && t.length > 1 && 1 === this.$el.find(i.prevEl).length && (t = this.$el.find(i.prevEl))), e && e.length > 0 && e.on("click", this.navigation.onNextClick), t && t.length > 0 && t.on("click", this.navigation.onPrevClick), n.extend(this.navigation, {
                    $nextEl: e,
                    nextEl: e && e[0],
                    $prevEl: t,
                    prevEl: t && t[0]
                }))
            },
            destroy: function() {
                var e = this.navigation,
                    t = e.$nextEl,
                    i = e.$prevEl;
                t && t.length && (t.off("click", this.navigation.onNextClick), t.removeClass(this.params.navigation.disabledClass)), i && i.length && (i.off("click", this.navigation.onPrevClick), i.removeClass(this.params.navigation.disabledClass))
            }
        },
        ae = {
            update: function() {
                var e = this.rtl,
                    t = this.params.pagination;
                if (t.el && this.pagination.el && this.pagination.$el && 0 !== this.pagination.$el.length) {
                    var i, a = this.virtual && this.params.virtual.enabled ? this.virtual.slides.length : this.slides.length,
                        r = this.pagination.$el,
                        n = this.params.loop ? Math.ceil((a - 2 * this.loopedSlides) / this.params.slidesPerGroup) : this.snapGrid.length;
                    if (this.params.loop ? ((i = Math.ceil((this.activeIndex - this.loopedSlides) / this.params.slidesPerGroup)) > a - 1 - 2 * this.loopedSlides && (i -= a - 2 * this.loopedSlides), i > n - 1 && (i -= n), i < 0 && "bullets" !== this.params.paginationType && (i = n + i)) : i = void 0 !== this.snapIndex ? this.snapIndex : this.activeIndex || 0, "bullets" === t.type && this.pagination.bullets && this.pagination.bullets.length > 0) {
                        var o, l, d, h = this.pagination.bullets;
                        if (t.dynamicBullets && (this.pagination.bulletSize = h.eq(0)[this.isHorizontal() ? "outerWidth" : "outerHeight"](!0), r.css(this.isHorizontal() ? "width" : "height", this.pagination.bulletSize * (t.dynamicMainBullets + 4) + "px"), t.dynamicMainBullets > 1 && void 0 !== this.previousIndex && (this.pagination.dynamicBulletIndex += i - this.previousIndex, this.pagination.dynamicBulletIndex > t.dynamicMainBullets - 1 ? this.pagination.dynamicBulletIndex = t.dynamicMainBullets - 1 : this.pagination.dynamicBulletIndex < 0 && (this.pagination.dynamicBulletIndex = 0)), o = i - this.pagination.dynamicBulletIndex, d = ((l = o + (Math.min(h.length, t.dynamicMainBullets) - 1)) + o) / 2), h.removeClass(t.bulletActiveClass + " " + t.bulletActiveClass + "-next " + t.bulletActiveClass + "-next-next " + t.bulletActiveClass + "-prev " + t.bulletActiveClass + "-prev-prev " + t.bulletActiveClass + "-main"), r.length > 1) h.each((function(e, a) {
                            var r = s(a),
                                n = r.index();
                            n === i && r.addClass(t.bulletActiveClass), t.dynamicBullets && (n >= o && n <= l && r.addClass(t.bulletActiveClass + "-main"), n === o && r.prev().addClass(t.bulletActiveClass + "-prev").prev().addClass(t.bulletActiveClass + "-prev-prev"), n === l && r.next().addClass(t.bulletActiveClass + "-next").next().addClass(t.bulletActiveClass + "-next-next"))
                        }));
                        else {
                            var p = h.eq(i),
                                c = p.index();
                            if (p.addClass(t.bulletActiveClass), t.dynamicBullets) {
                                for (var u = h.eq(o), v = h.eq(l), f = o; f <= l; f += 1) h.eq(f).addClass(t.bulletActiveClass + "-main");
                                if (this.params.loop)
                                    if (c >= h.length - t.dynamicMainBullets) {
                                        for (var m = t.dynamicMainBullets; m >= 0; m -= 1) h.eq(h.length - m).addClass(t.bulletActiveClass + "-main");
                                        h.eq(h.length - t.dynamicMainBullets - 1).addClass(t.bulletActiveClass + "-prev")
                                    } else u.prev().addClass(t.bulletActiveClass + "-prev").prev().addClass(t.bulletActiveClass + "-prev-prev"), v.next().addClass(t.bulletActiveClass + "-next").next().addClass(t.bulletActiveClass + "-next-next");
                                else u.prev().addClass(t.bulletActiveClass + "-prev").prev().addClass(t.bulletActiveClass + "-prev-prev"), v.next().addClass(t.bulletActiveClass + "-next").next().addClass(t.bulletActiveClass + "-next-next")
                            }
                        }
                        if (t.dynamicBullets) {
                            var g = Math.min(h.length, t.dynamicMainBullets + 4),
                                b = (this.pagination.bulletSize * g - this.pagination.bulletSize) / 2 - d * this.pagination.bulletSize,
                                w = e ? "right" : "left";
                            h.css(this.isHorizontal() ? w : "top", b + "px")
                        }
                    }
                    if ("fraction" === t.type && (r.find("." + t.currentClass).text(t.formatFractionCurrent(i + 1)), r.find("." + t.totalClass).text(t.formatFractionTotal(n))), "progressbar" === t.type) {
                        var y;
                        y = t.progressbarOpposite ? this.isHorizontal() ? "vertical" : "horizontal" : this.isHorizontal() ? "horizontal" : "vertical";
                        var x = (i + 1) / n,
                            T = 1,
                            E = 1;
                        "horizontal" === y ? T = x : E = x, r.find("." + t.progressbarFillClass).transform("translate3d(0,0,0) scaleX(" + T + ") scaleY(" + E + ")").transition(this.params.speed)
                    }
                    "custom" === t.type && t.renderCustom ? (r.html(t.renderCustom(this, i + 1, n)), this.emit("paginationRender", this, r[0])) : this.emit("paginationUpdate", this, r[0]), r[this.params.watchOverflow && this.isLocked ? "addClass" : "removeClass"](t.lockClass)
                }
            },
            render: function() {
                var e = this.params.pagination;
                if (e.el && this.pagination.el && this.pagination.$el && 0 !== this.pagination.$el.length) {
                    var t = this.virtual && this.params.virtual.enabled ? this.virtual.slides.length : this.slides.length,
                        i = this.pagination.$el,
                        s = "";
                    if ("bullets" === e.type) {
                        for (var a = this.params.loop ? Math.ceil((t - 2 * this.loopedSlides) / this.params.slidesPerGroup) : this.snapGrid.length, r = 0; r < a; r += 1) e.renderBullet ? s += e.renderBullet.call(this, r, e.bulletClass) : s += "<" + e.bulletElement + ' class="' + e.bulletClass + '"></' + e.bulletElement + ">";
                        i.html(s), this.pagination.bullets = i.find("." + e.bulletClass)
                    }
                    "fraction" === e.type && (s = e.renderFraction ? e.renderFraction.call(this, e.currentClass, e.totalClass) : '<span class="' + e.currentClass + '"></span> / <span class="' + e.totalClass + '"></span>', i.html(s)), "progressbar" === e.type && (s = e.renderProgressbar ? e.renderProgressbar.call(this, e.progressbarFillClass) : '<span class="' + e.progressbarFillClass + '"></span>', i.html(s)), "custom" !== e.type && this.emit("paginationRender", this.pagination.$el[0])
                }
            },
            init: function() {
                var e = this,
                    t = e.params.pagination;
                if (t.el) {
                    var i = s(t.el);
                    0 !== i.length && (e.params.uniqueNavElements && "string" == typeof t.el && i.length > 1 && 1 === e.$el.find(t.el).length && (i = e.$el.find(t.el)), "bullets" === t.type && t.clickable && i.addClass(t.clickableClass), i.addClass(t.modifierClass + t.type), "bullets" === t.type && t.dynamicBullets && (i.addClass("" + t.modifierClass + t.type + "-dynamic"), e.pagination.dynamicBulletIndex = 0, t.dynamicMainBullets < 1 && (t.dynamicMainBullets = 1)), "progressbar" === t.type && t.progressbarOpposite && i.addClass(t.progressbarOppositeClass), t.clickable && i.on("click", "." + t.bulletClass, (function(t) {
                        t.preventDefault();
                        var i = s(this).index() * e.params.slidesPerGroup;
                        e.params.loop && (i += e.loopedSlides), e.slideTo(i)
                    })), n.extend(e.pagination, {
                        $el: i,
                        el: i[0]
                    }))
                }
            },
            destroy: function() {
                var e = this.params.pagination;
                if (e.el && this.pagination.el && this.pagination.$el && 0 !== this.pagination.$el.length) {
                    var t = this.pagination.$el;
                    t.removeClass(e.hiddenClass), t.removeClass(e.modifierClass + e.type), this.pagination.bullets && this.pagination.bullets.removeClass(e.bulletActiveClass), e.clickable && t.off("click", "." + e.bulletClass)
                }
            }
        },
        re = {
            setTranslate: function() {
                if (this.params.scrollbar.el && this.scrollbar.el) {
                    var e = this.scrollbar,
                        t = this.rtlTranslate,
                        i = this.progress,
                        s = e.dragSize,
                        a = e.trackSize,
                        r = e.$dragEl,
                        n = e.$el,
                        o = this.params.scrollbar,
                        l = s,
                        d = (a - s) * i;
                    t ? (d = -d) > 0 ? (l = s - d, d = 0) : -d + s > a && (l = a + d) : d < 0 ? (l = s + d, d = 0) : d + s > a && (l = a - d), this.isHorizontal() ? (r.transform("translate3d(" + d + "px, 0, 0)"), r[0].style.width = l + "px") : (r.transform("translate3d(0px, " + d + "px, 0)"), r[0].style.height = l + "px"), o.hide && (clearTimeout(this.scrollbar.timeout), n[0].style.opacity = 1, this.scrollbar.timeout = setTimeout((function() {
                        n[0].style.opacity = 0, n.transition(400)
                    }), 1e3))
                }
            },
            setTransition: function(e) {
                this.params.scrollbar.el && this.scrollbar.el && this.scrollbar.$dragEl.transition(e)
            },
            updateSize: function() {
                if (this.params.scrollbar.el && this.scrollbar.el) {
                    var e = this.scrollbar,
                        t = e.$dragEl,
                        i = e.$el;
                    t[0].style.width = "", t[0].style.height = "";
                    var s, a = this.isHorizontal() ? i[0].offsetWidth : i[0].offsetHeight,
                        r = this.size / this.virtualSize,
                        o = r * (a / this.size);
                    s = "auto" === this.params.scrollbar.dragSize ? a * r : parseInt(this.params.scrollbar.dragSize, 10), this.isHorizontal() ? t[0].style.width = s + "px" : t[0].style.height = s + "px", i[0].style.display = r >= 1 ? "none" : "", this.params.scrollbar.hide && (i[0].style.opacity = 0), n.extend(e, {
                        trackSize: a,
                        divider: r,
                        moveDivider: o,
                        dragSize: s
                    }), e.$el[this.params.watchOverflow && this.isLocked ? "addClass" : "removeClass"](this.params.scrollbar.lockClass)
                }
            },
            getPointerPosition: function(e) {
                return this.isHorizontal() ? "touchstart" === e.type || "touchmove" === e.type ? e.targetTouches[0].clientX : e.clientX : "touchstart" === e.type || "touchmove" === e.type ? e.targetTouches[0].clientY : e.clientY
            },
            setDragPosition: function(e) {
                var t, i = this.scrollbar,
                    s = this.rtlTranslate,
                    a = i.$el,
                    r = i.dragSize,
                    n = i.trackSize,
                    o = i.dragStartPos;
                t = (i.getPointerPosition(e) - a.offset()[this.isHorizontal() ? "left" : "top"] - (null !== o ? o : r / 2)) / (n - r), t = Math.max(Math.min(t, 1), 0), s && (t = 1 - t);
                var l = this.minTranslate() + (this.maxTranslate() - this.minTranslate()) * t;
                this.updateProgress(l), this.setTranslate(l), this.updateActiveIndex(), this.updateSlidesClasses()
            },
            onDragStart: function(e) {
                var t = this.params.scrollbar,
                    i = this.scrollbar,
                    s = this.$wrapperEl,
                    a = i.$el,
                    r = i.$dragEl;
                this.scrollbar.isTouched = !0, this.scrollbar.dragStartPos = e.target === r[0] || e.target === r ? i.getPointerPosition(e) - e.target.getBoundingClientRect()[this.isHorizontal() ? "left" : "top"] : null, e.preventDefault(), e.stopPropagation(), s.transition(100), r.transition(100), i.setDragPosition(e), clearTimeout(this.scrollbar.dragTimeout), a.transition(0), t.hide && a.css("opacity", 1), this.params.cssMode && this.$wrapperEl.css("scroll-snap-type", "none"), this.emit("scrollbarDragStart", e)
            },
            onDragMove: function(e) {
                var t = this.scrollbar,
                    i = this.$wrapperEl,
                    s = t.$el,
                    a = t.$dragEl;
                this.scrollbar.isTouched && (e.preventDefault ? e.preventDefault() : e.returnValue = !1, t.setDragPosition(e), i.transition(0), s.transition(0), a.transition(0), this.emit("scrollbarDragMove", e))
            },
            onDragEnd: function(e) {
                var t = this.params.scrollbar,
                    i = this.scrollbar,
                    s = this.$wrapperEl,
                    a = i.$el;
                this.scrollbar.isTouched && (this.scrollbar.isTouched = !1, this.params.cssMode && (this.$wrapperEl.css("scroll-snap-type", ""), s.transition("")), t.hide && (clearTimeout(this.scrollbar.dragTimeout), this.scrollbar.dragTimeout = n.nextTick((function() {
                    a.css("opacity", 0), a.transition(400)
                }), 1e3)), this.emit("scrollbarDragEnd", e), t.snapOnRelease && this.slideToClosest())
            },
            enableDraggable: function() {
                if (this.params.scrollbar.el) {
                    var t = this.scrollbar,
                        i = this.touchEventsTouch,
                        s = this.touchEventsDesktop,
                        a = this.params,
                        r = t.$el[0],
                        n = !(!o.passiveListener || !a.passiveListeners) && {
                            passive: !1,
                            capture: !1
                        },
                        l = !(!o.passiveListener || !a.passiveListeners) && {
                            passive: !0,
                            capture: !1
                        };
                    o.touch ? (r.addEventListener(i.start, this.scrollbar.onDragStart, n), r.addEventListener(i.move, this.scrollbar.onDragMove, n), r.addEventListener(i.end, this.scrollbar.onDragEnd, l)) : (r.addEventListener(s.start, this.scrollbar.onDragStart, n), e.addEventListener(s.move, this.scrollbar.onDragMove, n), e.addEventListener(s.end, this.scrollbar.onDragEnd, l))
                }
            },
            disableDraggable: function() {
                if (this.params.scrollbar.el) {
                    var t = this.scrollbar,
                        i = this.touchEventsTouch,
                        s = this.touchEventsDesktop,
                        a = this.params,
                        r = t.$el[0],
                        n = !(!o.passiveListener || !a.passiveListeners) && {
                            passive: !1,
                            capture: !1
                        },
                        l = !(!o.passiveListener || !a.passiveListeners) && {
                            passive: !0,
                            capture: !1
                        };
                    o.touch ? (r.removeEventListener(i.start, this.scrollbar.onDragStart, n), r.removeEventListener(i.move, this.scrollbar.onDragMove, n), r.removeEventListener(i.end, this.scrollbar.onDragEnd, l)) : (r.removeEventListener(s.start, this.scrollbar.onDragStart, n), e.removeEventListener(s.move, this.scrollbar.onDragMove, n), e.removeEventListener(s.end, this.scrollbar.onDragEnd, l))
                }
            },
            init: function() {
                if (this.params.scrollbar.el) {
                    var e = this.scrollbar,
                        t = this.$el,
                        i = this.params.scrollbar,
                        a = s(i.el);
                    this.params.uniqueNavElements && "string" == typeof i.el && a.length > 1 && 1 === t.find(i.el).length && (a = t.find(i.el));
                    var r = a.find("." + this.params.scrollbar.dragClass);
                    0 === r.length && (r = s('<div class="' + this.params.scrollbar.dragClass + '"></div>'), a.append(r)), n.extend(e, {
                        $el: a,
                        el: a[0],
                        $dragEl: r,
                        dragEl: r[0]
                    }), i.draggable && e.enableDraggable()
                }
            },
            destroy: function() {
                this.scrollbar.disableDraggable()
            }
        },
        ne = {
            setTransform: function(e, t) {
                var i = this.rtl,
                    a = s(e),
                    r = i ? -1 : 1,
                    n = a.attr("data-swiper-parallax") || "0",
                    o = a.attr("data-swiper-parallax-x"),
                    l = a.attr("data-swiper-parallax-y"),
                    d = a.attr("data-swiper-parallax-scale"),
                    h = a.attr("data-swiper-parallax-opacity");
                if (o || l ? (o = o || "0", l = l || "0") : this.isHorizontal() ? (o = n, l = "0") : (l = n, o = "0"), o = o.indexOf("%") >= 0 ? parseInt(o, 10) * t * r + "%" : o * t * r + "px", l = l.indexOf("%") >= 0 ? parseInt(l, 10) * t + "%" : l * t + "px", null != h) {
                    var p = h - (h - 1) * (1 - Math.abs(t));
                    a[0].style.opacity = p
                }
                if (null == d) a.transform("translate3d(" + o + ", " + l + ", 0px)");
                else {
                    var c = d - (d - 1) * (1 - Math.abs(t));
                    a.transform("translate3d(" + o + ", " + l + ", 0px) scale(" + c + ")")
                }
            },
            setTranslate: function() {
                var e = this,
                    t = e.$el,
                    i = e.slides,
                    a = e.progress,
                    r = e.snapGrid;
                t.children("[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y], [data-swiper-parallax-opacity], [data-swiper-parallax-scale]").each((function(t, i) {
                    e.parallax.setTransform(i, a)
                })), i.each((function(t, i) {
                    var n = i.progress;
                    e.params.slidesPerGroup > 1 && "auto" !== e.params.slidesPerView && (n += Math.ceil(t / 2) - a * (r.length - 1)), n = Math.min(Math.max(n, -1), 1), s(i).find("[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y], [data-swiper-parallax-opacity], [data-swiper-parallax-scale]").each((function(t, i) {
                        e.parallax.setTransform(i, n)
                    }))
                }))
            },
            setTransition: function(e) {
                void 0 === e && (e = this.params.speed);
                this.$el.find("[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y], [data-swiper-parallax-opacity], [data-swiper-parallax-scale]").each((function(t, i) {
                    var a = s(i),
                        r = parseInt(a.attr("data-swiper-parallax-duration"), 10) || e;
                    0 === e && (r = 0), a.transition(r)
                }))
            }
        },
        oe = {
            getDistanceBetweenTouches: function(e) {
                if (e.targetTouches.length < 2) return 1;
                var t = e.targetTouches[0].pageX,
                    i = e.targetTouches[0].pageY,
                    s = e.targetTouches[1].pageX,
                    a = e.targetTouches[1].pageY;
                return Math.sqrt(Math.pow(s - t, 2) + Math.pow(a - i, 2))
            },
            onGestureStart: function(e) {
                var t = this.params.zoom,
                    i = this.zoom,
                    a = i.gesture;
                if (i.fakeGestureTouched = !1, i.fakeGestureMoved = !1, !o.gestures) {
                    if ("touchstart" !== e.type || "touchstart" === e.type && e.targetTouches.length < 2) return;
                    i.fakeGestureTouched = !0, a.scaleStart = oe.getDistanceBetweenTouches(e)
                }
                a.$slideEl && a.$slideEl.length || (a.$slideEl = s(e.target).closest("." + this.params.slideClass), 0 === a.$slideEl.length && (a.$slideEl = this.slides.eq(this.activeIndex)), a.$imageEl = a.$slideEl.find("img, svg, canvas, picture, .swiper-zoom-target"), a.$imageWrapEl = a.$imageEl.parent("." + t.containerClass), a.maxRatio = a.$imageWrapEl.attr("data-swiper-zoom") || t.maxRatio, 0 !== a.$imageWrapEl.length) ? (a.$imageEl.transition(0), this.zoom.isScaling = !0) : a.$imageEl = void 0
            },
            onGestureChange: function(e) {
                var t = this.params.zoom,
                    i = this.zoom,
                    s = i.gesture;
                if (!o.gestures) {
                    if ("touchmove" !== e.type || "touchmove" === e.type && e.targetTouches.length < 2) return;
                    i.fakeGestureMoved = !0, s.scaleMove = oe.getDistanceBetweenTouches(e)
                }
                s.$imageEl && 0 !== s.$imageEl.length && (o.gestures ? i.scale = e.scale * i.currentScale : i.scale = s.scaleMove / s.scaleStart * i.currentScale, i.scale > s.maxRatio && (i.scale = s.maxRatio - 1 + Math.pow(i.scale - s.maxRatio + 1, .5)), i.scale < t.minRatio && (i.scale = t.minRatio + 1 - Math.pow(t.minRatio - i.scale + 1, .5)), s.$imageEl.transform("translate3d(0,0,0) scale(" + i.scale + ")"))
            },
            onGestureEnd: function(e) {
                var t = this.params.zoom,
                    i = this.zoom,
                    s = i.gesture;
                if (!o.gestures) {
                    if (!i.fakeGestureTouched || !i.fakeGestureMoved) return;
                    if ("touchend" !== e.type || "touchend" === e.type && e.changedTouches.length < 2 && !I.android) return;
                    i.fakeGestureTouched = !1, i.fakeGestureMoved = !1
                }
                s.$imageEl && 0 !== s.$imageEl.length && (i.scale = Math.max(Math.min(i.scale, s.maxRatio), t.minRatio), s.$imageEl.transition(this.params.speed).transform("translate3d(0,0,0) scale(" + i.scale + ")"), i.currentScale = i.scale, i.isScaling = !1, 1 === i.scale && (s.$slideEl = void 0))
            },
            onTouchStart: function(e) {
                var t = this.zoom,
                    i = t.gesture,
                    s = t.image;
                i.$imageEl && 0 !== i.$imageEl.length && (s.isTouched || (I.android && e.preventDefault(), s.isTouched = !0, s.touchesStart.x = "touchstart" === e.type ? e.targetTouches[0].pageX : e.pageX, s.touchesStart.y = "touchstart" === e.type ? e.targetTouches[0].pageY : e.pageY))
            },
            onTouchMove: function(e) {
                var t = this.zoom,
                    i = t.gesture,
                    s = t.image,
                    a = t.velocity;
                if (i.$imageEl && 0 !== i.$imageEl.length && (this.allowClick = !1, s.isTouched && i.$slideEl)) {
                    s.isMoved || (s.width = i.$imageEl[0].offsetWidth, s.height = i.$imageEl[0].offsetHeight, s.startX = n.getTranslate(i.$imageWrapEl[0], "x") || 0, s.startY = n.getTranslate(i.$imageWrapEl[0], "y") || 0, i.slideWidth = i.$slideEl[0].offsetWidth, i.slideHeight = i.$slideEl[0].offsetHeight, i.$imageWrapEl.transition(0), this.rtl && (s.startX = -s.startX, s.startY = -s.startY));
                    var r = s.width * t.scale,
                        o = s.height * t.scale;
                    if (!(r < i.slideWidth && o < i.slideHeight)) {
                        if (s.minX = Math.min(i.slideWidth / 2 - r / 2, 0), s.maxX = -s.minX, s.minY = Math.min(i.slideHeight / 2 - o / 2, 0), s.maxY = -s.minY, s.touchesCurrent.x = "touchmove" === e.type ? e.targetTouches[0].pageX : e.pageX, s.touchesCurrent.y = "touchmove" === e.type ? e.targetTouches[0].pageY : e.pageY, !s.isMoved && !t.isScaling) {
                            if (this.isHorizontal() && (Math.floor(s.minX) === Math.floor(s.startX) && s.touchesCurrent.x < s.touchesStart.x || Math.floor(s.maxX) === Math.floor(s.startX) && s.touchesCurrent.x > s.touchesStart.x)) return void(s.isTouched = !1);
                            if (!this.isHorizontal() && (Math.floor(s.minY) === Math.floor(s.startY) && s.touchesCurrent.y < s.touchesStart.y || Math.floor(s.maxY) === Math.floor(s.startY) && s.touchesCurrent.y > s.touchesStart.y)) return void(s.isTouched = !1)
                        }
                        e.preventDefault(), e.stopPropagation(), s.isMoved = !0, s.currentX = s.touchesCurrent.x - s.touchesStart.x + s.startX, s.currentY = s.touchesCurrent.y - s.touchesStart.y + s.startY, s.currentX < s.minX && (s.currentX = s.minX + 1 - Math.pow(s.minX - s.currentX + 1, .8)), s.currentX > s.maxX && (s.currentX = s.maxX - 1 + Math.pow(s.currentX - s.maxX + 1, .8)), s.currentY < s.minY && (s.currentY = s.minY + 1 - Math.pow(s.minY - s.currentY + 1, .8)), s.currentY > s.maxY && (s.currentY = s.maxY - 1 + Math.pow(s.currentY - s.maxY + 1, .8)), a.prevPositionX || (a.prevPositionX = s.touchesCurrent.x), a.prevPositionY || (a.prevPositionY = s.touchesCurrent.y), a.prevTime || (a.prevTime = Date.now()), a.x = (s.touchesCurrent.x - a.prevPositionX) / (Date.now() - a.prevTime) / 2, a.y = (s.touchesCurrent.y - a.prevPositionY) / (Date.now() - a.prevTime) / 2, Math.abs(s.touchesCurrent.x - a.prevPositionX) < 2 && (a.x = 0), Math.abs(s.touchesCurrent.y - a.prevPositionY) < 2 && (a.y = 0), a.prevPositionX = s.touchesCurrent.x, a.prevPositionY = s.touchesCurrent.y, a.prevTime = Date.now(), i.$imageWrapEl.transform("translate3d(" + s.currentX + "px, " + s.currentY + "px,0)")
                    }
                }
            },
            onTouchEnd: function() {
                var e = this.zoom,
                    t = e.gesture,
                    i = e.image,
                    s = e.velocity;
                if (t.$imageEl && 0 !== t.$imageEl.length) {
                    if (!i.isTouched || !i.isMoved) return i.isTouched = !1, void(i.isMoved = !1);
                    i.isTouched = !1, i.isMoved = !1;
                    var a = 300,
                        r = 300,
                        n = s.x * a,
                        o = i.currentX + n,
                        l = s.y * r,
                        d = i.currentY + l;
                    0 !== s.x && (a = Math.abs((o - i.currentX) / s.x)), 0 !== s.y && (r = Math.abs((d - i.currentY) / s.y));
                    var h = Math.max(a, r);
                    i.currentX = o, i.currentY = d;
                    var p = i.width * e.scale,
                        c = i.height * e.scale;
                    i.minX = Math.min(t.slideWidth / 2 - p / 2, 0), i.maxX = -i.minX, i.minY = Math.min(t.slideHeight / 2 - c / 2, 0), i.maxY = -i.minY, i.currentX = Math.max(Math.min(i.currentX, i.maxX), i.minX), i.currentY = Math.max(Math.min(i.currentY, i.maxY), i.minY), t.$imageWrapEl.transition(h).transform("translate3d(" + i.currentX + "px, " + i.currentY + "px,0)")
                }
            },
            onTransitionEnd: function() {
                var e = this.zoom,
                    t = e.gesture;
                t.$slideEl && this.previousIndex !== this.activeIndex && (t.$imageEl.transform("translate3d(0,0,0) scale(1)"), t.$imageWrapEl.transform("translate3d(0,0,0)"), e.scale = 1, e.currentScale = 1, t.$slideEl = void 0, t.$imageEl = void 0, t.$imageWrapEl = void 0)
            },
            toggle: function(e) {
                var t = this.zoom;
                t.scale && 1 !== t.scale ? t.out() : t.in(e)
            },
            in: function(e) {
                var t, i, s, a, r, n, o, l, d, h, p, c, u, v, f, m, g = this.zoom,
                    b = this.params.zoom,
                    w = g.gesture,
                    y = g.image;
                (w.$slideEl || (w.$slideEl = this.slides.eq(this.activeIndex), w.$imageEl = w.$slideEl.find("img, svg, canvas, picture, .swiper-zoom-target"), w.$imageWrapEl = w.$imageEl.parent("." + b.containerClass)), w.$imageEl && 0 !== w.$imageEl.length) && (w.$slideEl.addClass("" + b.zoomedSlideClass), void 0 === y.touchesStart.x && e ? (t = "touchend" === e.type ? e.changedTouches[0].pageX : e.pageX, i = "touchend" === e.type ? e.changedTouches[0].pageY : e.pageY) : (t = y.touchesStart.x, i = y.touchesStart.y), g.scale = w.$imageWrapEl.attr("data-swiper-zoom") || b.maxRatio, g.currentScale = w.$imageWrapEl.attr("data-swiper-zoom") || b.maxRatio, e ? (f = w.$slideEl[0].offsetWidth, m = w.$slideEl[0].offsetHeight, s = w.$slideEl.offset().left + f / 2 - t, a = w.$slideEl.offset().top + m / 2 - i, o = w.$imageEl[0].offsetWidth, l = w.$imageEl[0].offsetHeight, d = o * g.scale, h = l * g.scale, u = -(p = Math.min(f / 2 - d / 2, 0)), v = -(c = Math.min(m / 2 - h / 2, 0)), (r = s * g.scale) < p && (r = p), r > u && (r = u), (n = a * g.scale) < c && (n = c), n > v && (n = v)) : (r = 0, n = 0), w.$imageWrapEl.transition(300).transform("translate3d(" + r + "px, " + n + "px,0)"), w.$imageEl.transition(300).transform("translate3d(0,0,0) scale(" + g.scale + ")"))
            },
            out: function() {
                var e = this.zoom,
                    t = this.params.zoom,
                    i = e.gesture;
                i.$slideEl || (i.$slideEl = this.slides.eq(this.activeIndex), i.$imageEl = i.$slideEl.find("img, svg, canvas, picture, .swiper-zoom-target"), i.$imageWrapEl = i.$imageEl.parent("." + t.containerClass)), i.$imageEl && 0 !== i.$imageEl.length && (e.scale = 1, e.currentScale = 1, i.$imageWrapEl.transition(300).transform("translate3d(0,0,0)"), i.$imageEl.transition(300).transform("translate3d(0,0,0) scale(1)"), i.$slideEl.removeClass("" + t.zoomedSlideClass), i.$slideEl = void 0)
            },
            enable: function() {
                var e = this.zoom;
                if (!e.enabled) {
                    e.enabled = !0;
                    var t = !("touchstart" !== this.touchEvents.start || !o.passiveListener || !this.params.passiveListeners) && {
                            passive: !0,
                            capture: !1
                        },
                        i = !o.passiveListener || {
                            passive: !1,
                            capture: !0
                        },
                        s = "." + this.params.slideClass;
                    o.gestures ? (this.$wrapperEl.on("gesturestart", s, e.onGestureStart, t), this.$wrapperEl.on("gesturechange", s, e.onGestureChange, t), this.$wrapperEl.on("gestureend", s, e.onGestureEnd, t)) : "touchstart" === this.touchEvents.start && (this.$wrapperEl.on(this.touchEvents.start, s, e.onGestureStart, t), this.$wrapperEl.on(this.touchEvents.move, s, e.onGestureChange, i), this.$wrapperEl.on(this.touchEvents.end, s, e.onGestureEnd, t), this.touchEvents.cancel && this.$wrapperEl.on(this.touchEvents.cancel, s, e.onGestureEnd, t)), this.$wrapperEl.on(this.touchEvents.move, "." + this.params.zoom.containerClass, e.onTouchMove, i)
                }
            },
            disable: function() {
                var e = this.zoom;
                if (e.enabled) {
                    this.zoom.enabled = !1;
                    var t = !("touchstart" !== this.touchEvents.start || !o.passiveListener || !this.params.passiveListeners) && {
                            passive: !0,
                            capture: !1
                        },
                        i = !o.passiveListener || {
                            passive: !1,
                            capture: !0
                        },
                        s = "." + this.params.slideClass;
                    o.gestures ? (this.$wrapperEl.off("gesturestart", s, e.onGestureStart, t), this.$wrapperEl.off("gesturechange", s, e.onGestureChange, t), this.$wrapperEl.off("gestureend", s, e.onGestureEnd, t)) : "touchstart" === this.touchEvents.start && (this.$wrapperEl.off(this.touchEvents.start, s, e.onGestureStart, t), this.$wrapperEl.off(this.touchEvents.move, s, e.onGestureChange, i), this.$wrapperEl.off(this.touchEvents.end, s, e.onGestureEnd, t), this.touchEvents.cancel && this.$wrapperEl.off(this.touchEvents.cancel, s, e.onGestureEnd, t)), this.$wrapperEl.off(this.touchEvents.move, "." + this.params.zoom.containerClass, e.onTouchMove, i)
                }
            }
        },
        le = {
            loadInSlide: function(e, t) {
                void 0 === t && (t = !0);
                var i = this,
                    a = i.params.lazy;
                if (void 0 !== e && 0 !== i.slides.length) {
                    var r = i.virtual && i.params.virtual.enabled ? i.$wrapperEl.children("." + i.params.slideClass + '[data-swiper-slide-index="' + e + '"]') : i.slides.eq(e),
                        n = r.find("." + a.elementClass + ":not(." + a.loadedClass + "):not(." + a.loadingClass + ")");
                    !r.hasClass(a.elementClass) || r.hasClass(a.loadedClass) || r.hasClass(a.loadingClass) || (n = n.add(r[0])), 0 !== n.length && n.each((function(e, n) {
                        var o = s(n);
                        o.addClass(a.loadingClass);
                        var l = o.attr("data-background"),
                            d = o.attr("data-src"),
                            h = o.attr("data-srcset"),
                            p = o.attr("data-sizes");
                        i.loadImage(o[0], d || l, h, p, !1, (function() {
                            if (null != i && i && (!i || i.params) && !i.destroyed) {
                                if (l ? (o.css("background-image", 'url("' + l + '")'), o.removeAttr("data-background")) : (h && (o.attr("srcset", h), o.removeAttr("data-srcset")), p && (o.attr("sizes", p), o.removeAttr("data-sizes")), d && (o.attr("src", d), o.removeAttr("data-src"))), o.addClass(a.loadedClass).removeClass(a.loadingClass), r.find("." + a.preloaderClass).remove(), i.params.loop && t) {
                                    var e = r.attr("data-swiper-slide-index");
                                    if (r.hasClass(i.params.slideDuplicateClass)) {
                                        var s = i.$wrapperEl.children('[data-swiper-slide-index="' + e + '"]:not(.' + i.params.slideDuplicateClass + ")");
                                        i.lazy.loadInSlide(s.index(), !1)
                                    } else {
                                        var n = i.$wrapperEl.children("." + i.params.slideDuplicateClass + '[data-swiper-slide-index="' + e + '"]');
                                        i.lazy.loadInSlide(n.index(), !1)
                                    }
                                }
                                i.emit("lazyImageReady", r[0], o[0]), i.params.autoHeight && i.updateAutoHeight()
                            }
                        })), i.emit("lazyImageLoad", r[0], o[0])
                    }))
                }
            },
            load: function() {
                var e = this,
                    t = e.$wrapperEl,
                    i = e.params,
                    a = e.slides,
                    r = e.activeIndex,
                    n = e.virtual && i.virtual.enabled,
                    o = i.lazy,
                    l = i.slidesPerView;

                function d(e) {
                    if (n) {
                        if (t.children("." + i.slideClass + '[data-swiper-slide-index="' + e + '"]').length) return !0
                    } else if (a[e]) return !0;
                    return !1
                }

                function h(e) {
                    return n ? s(e).attr("data-swiper-slide-index") : s(e).index()
                }
                if ("auto" === l && (l = 0), e.lazy.initialImageLoaded || (e.lazy.initialImageLoaded = !0), e.params.watchSlidesVisibility) t.children("." + i.slideVisibleClass).each((function(t, i) {
                    var a = n ? s(i).attr("data-swiper-slide-index") : s(i).index();
                    e.lazy.loadInSlide(a)
                }));
                else if (l > 1)
                    for (var p = r; p < r + l; p += 1) d(p) && e.lazy.loadInSlide(p);
                else e.lazy.loadInSlide(r);
                if (o.loadPrevNext)
                    if (l > 1 || o.loadPrevNextAmount && o.loadPrevNextAmount > 1) {
                        for (var c = o.loadPrevNextAmount, u = l, v = Math.min(r + u + Math.max(c, u), a.length), f = Math.max(r - Math.max(u, c), 0), m = r + l; m < v; m += 1) d(m) && e.lazy.loadInSlide(m);
                        for (var g = f; g < r; g += 1) d(g) && e.lazy.loadInSlide(g)
                    } else {
                        var b = t.children("." + i.slideNextClass);
                        b.length > 0 && e.lazy.loadInSlide(h(b));
                        var w = t.children("." + i.slidePrevClass);
                        w.length > 0 && e.lazy.loadInSlide(h(w))
                    }
            }
        },
        de = {
            LinearSpline: function(e, t) {
                var i, s, a, r, n, o = function(e, t) {
                    for (s = -1, i = e.length; i - s > 1;) e[a = i + s >> 1] <= t ? s = a : i = a;
                    return i
                };
                return this.x = e, this.y = t, this.lastIndex = e.length - 1, this.interpolate = function(e) {
                    return e ? (n = o(this.x, e), r = n - 1, (e - this.x[r]) * (this.y[n] - this.y[r]) / (this.x[n] - this.x[r]) + this.y[r]) : 0
                }, this
            },
            getInterpolateFunction: function(e) {
                this.controller.spline || (this.controller.spline = this.params.loop ? new de.LinearSpline(this.slidesGrid, e.slidesGrid) : new de.LinearSpline(this.snapGrid, e.snapGrid))
            },
            setTranslate: function(e, t) {
                var i, s, a = this,
                    r = a.controller.control;

                function n(e) {
                    var t = a.rtlTranslate ? -a.translate : a.translate;
                    "slide" === a.params.controller.by && (a.controller.getInterpolateFunction(e), s = -a.controller.spline.interpolate(-t)), s && "container" !== a.params.controller.by || (i = (e.maxTranslate() - e.minTranslate()) / (a.maxTranslate() - a.minTranslate()), s = (t - a.minTranslate()) * i + e.minTranslate()), a.params.controller.inverse && (s = e.maxTranslate() - s), e.updateProgress(s), e.setTranslate(s, a), e.updateActiveIndex(), e.updateSlidesClasses()
                }
                if (Array.isArray(r))
                    for (var o = 0; o < r.length; o += 1) r[o] !== t && r[o] instanceof W && n(r[o]);
                else r instanceof W && t !== r && n(r)
            },
            setTransition: function(e, t) {
                var i, s = this,
                    a = s.controller.control;

                function r(t) {
                    t.setTransition(e, s), 0 !== e && (t.transitionStart(), t.params.autoHeight && n.nextTick((function() {
                        t.updateAutoHeight()
                    })), t.$wrapperEl.transitionEnd((function() {
                        a && (t.params.loop && "slide" === s.params.controller.by && t.loopFix(), t.transitionEnd())
                    })))
                }
                if (Array.isArray(a))
                    for (i = 0; i < a.length; i += 1) a[i] !== t && a[i] instanceof W && r(a[i]);
                else a instanceof W && t !== a && r(a)
            }
        },
        he = {
            makeElFocusable: function(e) {
                return e.attr("tabIndex", "0"), e
            },
            addElRole: function(e, t) {
                return e.attr("role", t), e
            },
            addElLabel: function(e, t) {
                return e.attr("aria-label", t), e
            },
            disableEl: function(e) {
                return e.attr("aria-disabled", !0), e
            },
            enableEl: function(e) {
                return e.attr("aria-disabled", !1), e
            },
            onEnterKey: function(e) {
                var t = this.params.a11y;
                if (13 === e.keyCode) {
                    var i = s(e.target);
                    this.navigation && this.navigation.$nextEl && i.is(this.navigation.$nextEl) && (this.isEnd && !this.params.loop || this.slideNext(), this.isEnd ? this.a11y.notify(t.lastSlideMessage) : this.a11y.notify(t.nextSlideMessage)), this.navigation && this.navigation.$prevEl && i.is(this.navigation.$prevEl) && (this.isBeginning && !this.params.loop || this.slidePrev(), this.isBeginning ? this.a11y.notify(t.firstSlideMessage) : this.a11y.notify(t.prevSlideMessage)), this.pagination && i.is("." + this.params.pagination.bulletClass) && i[0].click()
                }
            },
            notify: function(e) {
                var t = this.a11y.liveRegion;
                0 !== t.length && (t.html(""), t.html(e))
            },
            updateNavigation: function() {
                if (!this.params.loop && this.navigation) {
                    var e = this.navigation,
                        t = e.$nextEl,
                        i = e.$prevEl;
                    i && i.length > 0 && (this.isBeginning ? this.a11y.disableEl(i) : this.a11y.enableEl(i)), t && t.length > 0 && (this.isEnd ? this.a11y.disableEl(t) : this.a11y.enableEl(t))
                }
            },
            updatePagination: function() {
                var e = this,
                    t = e.params.a11y;
                e.pagination && e.params.pagination.clickable && e.pagination.bullets && e.pagination.bullets.length && e.pagination.bullets.each((function(i, a) {
                    var r = s(a);
                    e.a11y.makeElFocusable(r), e.a11y.addElRole(r, "button"), e.a11y.addElLabel(r, t.paginationBulletMessage.replace(/{{index}}/, r.index() + 1))
                }))
            },
            init: function() {
                this.$el.append(this.a11y.liveRegion);
                var e, t, i = this.params.a11y;
                this.navigation && this.navigation.$nextEl && (e = this.navigation.$nextEl), this.navigation && this.navigation.$prevEl && (t = this.navigation.$prevEl), e && (this.a11y.makeElFocusable(e), this.a11y.addElRole(e, "button"), this.a11y.addElLabel(e, i.nextSlideMessage), e.on("keydown", this.a11y.onEnterKey)), t && (this.a11y.makeElFocusable(t), this.a11y.addElRole(t, "button"), this.a11y.addElLabel(t, i.prevSlideMessage), t.on("keydown", this.a11y.onEnterKey)), this.pagination && this.params.pagination.clickable && this.pagination.bullets && this.pagination.bullets.length && this.pagination.$el.on("keydown", "." + this.params.pagination.bulletClass, this.a11y.onEnterKey)
            },
            destroy: function() {
                var e, t;
                this.a11y.liveRegion && this.a11y.liveRegion.length > 0 && this.a11y.liveRegion.remove(), this.navigation && this.navigation.$nextEl && (e = this.navigation.$nextEl), this.navigation && this.navigation.$prevEl && (t = this.navigation.$prevEl), e && e.off("keydown", this.a11y.onEnterKey), t && t.off("keydown", this.a11y.onEnterKey), this.pagination && this.params.pagination.clickable && this.pagination.bullets && this.pagination.bullets.length && this.pagination.$el.off("keydown", "." + this.params.pagination.bulletClass, this.a11y.onEnterKey)
            }
        },
        pe = {
            init: function() {
                if (this.params.history) {
                    if (!t.history || !t.history.pushState) return this.params.history.enabled = !1, void(this.params.hashNavigation.enabled = !0);
                    var e = this.history;
                    e.initialized = !0, e.paths = pe.getPathValues(), (e.paths.key || e.paths.value) && (e.scrollToSlide(0, e.paths.value, this.params.runCallbacksOnInit), this.params.history.replaceState || t.addEventListener("popstate", this.history.setHistoryPopState))
                }
            },
            destroy: function() {
                this.params.history.replaceState || t.removeEventListener("popstate", this.history.setHistoryPopState)
            },
            setHistoryPopState: function() {
                this.history.paths = pe.getPathValues(), this.history.scrollToSlide(this.params.speed, this.history.paths.value, !1)
            },
            getPathValues: function() {
                var e = t.location.pathname.slice(1).split("/").filter((function(e) {
                        return "" !== e
                    })),
                    i = e.length;
                return {
                    key: e[i - 2],
                    value: e[i - 1]
                }
            },
            setHistory: function(e, i) {
                if (this.history.initialized && this.params.history.enabled) {
                    var s = this.slides.eq(i),
                        a = pe.slugify(s.attr("data-history"));
                    t.location.pathname.includes(e) || (a = e + "/" + a);
                    var r = t.history.state;
                    r && r.value === a || (this.params.history.replaceState ? t.history.replaceState({
                        value: a
                    }, null, a) : t.history.pushState({
                        value: a
                    }, null, a))
                }
            },
            slugify: function(e) {
                return e.toString().replace(/\s+/g, "-").replace(/[^\w-]+/g, "").replace(/--+/g, "-").replace(/^-+/, "").replace(/-+$/, "")
            },
            scrollToSlide: function(e, t, i) {
                if (t)
                    for (var s = 0, a = this.slides.length; s < a; s += 1) {
                        var r = this.slides.eq(s);
                        if (pe.slugify(r.attr("data-history")) === t && !r.hasClass(this.params.slideDuplicateClass)) {
                            var n = r.index();
                            this.slideTo(n, e, i)
                        }
                    } else this.slideTo(0, e, i)
            }
        },
        ce = {
            onHashCange: function() {
                var t = e.location.hash.replace("#", "");
                if (t !== this.slides.eq(this.activeIndex).attr("data-hash")) {
                    var i = this.$wrapperEl.children("." + this.params.slideClass + '[data-hash="' + t + '"]').index();
                    if (void 0 === i) return;
                    this.slideTo(i)
                }
            },
            setHash: function() {
                if (this.hashNavigation.initialized && this.params.hashNavigation.enabled)
                    if (this.params.hashNavigation.replaceState && t.history && t.history.replaceState) t.history.replaceState(null, null, "#" + this.slides.eq(this.activeIndex).attr("data-hash") || "");
                    else {
                        var i = this.slides.eq(this.activeIndex),
                            s = i.attr("data-hash") || i.attr("data-history");
                        e.location.hash = s || ""
                    }
            },
            init: function() {
                if (!(!this.params.hashNavigation.enabled || this.params.history && this.params.history.enabled)) {
                    this.hashNavigation.initialized = !0;
                    var i = e.location.hash.replace("#", "");
                    if (i)
                        for (var a = 0, r = this.slides.length; a < r; a += 1) {
                            var n = this.slides.eq(a);
                            if ((n.attr("data-hash") || n.attr("data-history")) === i && !n.hasClass(this.params.slideDuplicateClass)) {
                                var o = n.index();
                                this.slideTo(o, 0, this.params.runCallbacksOnInit, !0)
                            }
                        }
                    this.params.hashNavigation.watchState && s(t).on("hashchange", this.hashNavigation.onHashCange)
                }
            },
            destroy: function() {
                this.params.hashNavigation.watchState && s(t).off("hashchange", this.hashNavigation.onHashCange)
            }
        },
        ue = {
            run: function() {
                var e = this,
                    t = e.slides.eq(e.activeIndex),
                    i = e.params.autoplay.delay;
                t.attr("data-swiper-autoplay") && (i = t.attr("data-swiper-autoplay") || e.params.autoplay.delay), clearTimeout(e.autoplay.timeout), e.autoplay.timeout = n.nextTick((function() {
                    e.params.autoplay.reverseDirection ? e.params.loop ? (e.loopFix(), e.slidePrev(e.params.speed, !0, !0), e.emit("autoplay")) : e.isBeginning ? e.params.autoplay.stopOnLastSlide ? e.autoplay.stop() : (e.slideTo(e.slides.length - 1, e.params.speed, !0, !0), e.emit("autoplay")) : (e.slidePrev(e.params.speed, !0, !0), e.emit("autoplay")) : e.params.loop ? (e.loopFix(), e.slideNext(e.params.speed, !0, !0), e.emit("autoplay")) : e.isEnd ? e.params.autoplay.stopOnLastSlide ? e.autoplay.stop() : (e.slideTo(0, e.params.speed, !0, !0), e.emit("autoplay")) : (e.slideNext(e.params.speed, !0, !0), e.emit("autoplay")), e.params.cssMode && e.autoplay.running && e.autoplay.run()
                }), i)
            },
            start: function() {
                return void 0 === this.autoplay.timeout && (!this.autoplay.running && (this.autoplay.running = !0, this.emit("autoplayStart"), this.autoplay.run(), !0))
            },
            stop: function() {
                return !!this.autoplay.running && (void 0 !== this.autoplay.timeout && (this.autoplay.timeout && (clearTimeout(this.autoplay.timeout), this.autoplay.timeout = void 0), this.autoplay.running = !1, this.emit("autoplayStop"), !0))
            },
            pause: function(e) {
                this.autoplay.running && (this.autoplay.paused || (this.autoplay.timeout && clearTimeout(this.autoplay.timeout), this.autoplay.paused = !0, 0 !== e && this.params.autoplay.waitForTransition ? (this.$wrapperEl[0].addEventListener("transitionend", this.autoplay.onTransitionEnd), this.$wrapperEl[0].addEventListener("webkitTransitionEnd", this.autoplay.onTransitionEnd)) : (this.autoplay.paused = !1, this.autoplay.run())))
            }
        },
        ve = {
            setTranslate: function() {
                for (var e = this.slides, t = 0; t < e.length; t += 1) {
                    var i = this.slides.eq(t),
                        s = -i[0].swiperSlideOffset;
                    this.params.virtualTranslate || (s -= this.translate);
                    var a = 0;
                    this.isHorizontal() || (a = s, s = 0);
                    var r = this.params.fadeEffect.crossFade ? Math.max(1 - Math.abs(i[0].progress), 0) : 1 + Math.min(Math.max(i[0].progress, -1), 0);
                    i.css({
                        opacity: r
                    }).transform("translate3d(" + s + "px, " + a + "px, 0px)")
                }
            },
            setTransition: function(e) {
                var t = this,
                    i = t.slides,
                    s = t.$wrapperEl;
                if (i.transition(e), t.params.virtualTranslate && 0 !== e) {
                    var a = !1;
                    i.transitionEnd((function() {
                        if (!a && t && !t.destroyed) {
                            a = !0, t.animating = !1;
                            for (var e = ["webkitTransitionEnd", "transitionend"], i = 0; i < e.length; i += 1) s.trigger(e[i])
                        }
                    }))
                }
            }
        },
        fe = {
            setTranslate: function() {
                var e, t = this.$el,
                    i = this.$wrapperEl,
                    a = this.slides,
                    r = this.width,
                    n = this.height,
                    o = this.rtlTranslate,
                    l = this.size,
                    d = this.params.cubeEffect,
                    h = this.isHorizontal(),
                    p = this.virtual && this.params.virtual.enabled,
                    c = 0;
                d.shadow && (h ? (0 === (e = i.find(".swiper-cube-shadow")).length && (e = s('<div class="swiper-cube-shadow"></div>'), i.append(e)), e.css({
                    height: r + "px"
                })) : 0 === (e = t.find(".swiper-cube-shadow")).length && (e = s('<div class="swiper-cube-shadow"></div>'), t.append(e)));
                for (var u = 0; u < a.length; u += 1) {
                    var v = a.eq(u),
                        f = u;
                    p && (f = parseInt(v.attr("data-swiper-slide-index"), 10));
                    var m = 90 * f,
                        g = Math.floor(m / 360);
                    o && (m = -m, g = Math.floor(-m / 360));
                    var b = Math.max(Math.min(v[0].progress, 1), -1),
                        w = 0,
                        y = 0,
                        x = 0;
                    f % 4 == 0 ? (w = 4 * -g * l, x = 0) : (f - 1) % 4 == 0 ? (w = 0, x = 4 * -g * l) : (f - 2) % 4 == 0 ? (w = l + 4 * g * l, x = l) : (f - 3) % 4 == 0 && (w = -l, x = 3 * l + 4 * l * g), o && (w = -w), h || (y = w, w = 0);
                    var T = "rotateX(" + (h ? 0 : -m) + "deg) rotateY(" + (h ? m : 0) + "deg) translate3d(" + w + "px, " + y + "px, " + x + "px)";
                    if (b <= 1 && b > -1 && (c = 90 * f + 90 * b, o && (c = 90 * -f - 90 * b)), v.transform(T), d.slideShadows) {
                        var E = h ? v.find(".swiper-slide-shadow-left") : v.find(".swiper-slide-shadow-top"),
                            S = h ? v.find(".swiper-slide-shadow-right") : v.find(".swiper-slide-shadow-bottom");
                        0 === E.length && (E = s('<div class="swiper-slide-shadow-' + (h ? "left" : "top") + '"></div>'), v.append(E)), 0 === S.length && (S = s('<div class="swiper-slide-shadow-' + (h ? "right" : "bottom") + '"></div>'), v.append(S)), E.length && (E[0].style.opacity = Math.max(-b, 0)), S.length && (S[0].style.opacity = Math.max(b, 0))
                    }
                }
                if (i.css({
                        "-webkit-transform-origin": "50% 50% -" + l / 2 + "px",
                        "-moz-transform-origin": "50% 50% -" + l / 2 + "px",
                        "-ms-transform-origin": "50% 50% -" + l / 2 + "px",
                        "transform-origin": "50% 50% -" + l / 2 + "px"
                    }), d.shadow)
                    if (h) e.transform("translate3d(0px, " + (r / 2 + d.shadowOffset) + "px, " + -r / 2 + "px) rotateX(90deg) rotateZ(0deg) scale(" + d.shadowScale + ")");
                    else {
                        var C = Math.abs(c) - 90 * Math.floor(Math.abs(c) / 90),
                            M = 1.5 - (Math.sin(2 * C * Math.PI / 360) / 2 + Math.cos(2 * C * Math.PI / 360) / 2),
                            P = d.shadowScale,
                            z = d.shadowScale / M,
                            k = d.shadowOffset;
                        e.transform("scale3d(" + P + ", 1, " + z + ") translate3d(0px, " + (n / 2 + k) + "px, " + -n / 2 / z + "px) rotateX(-90deg)")
                    }
                var $ = j.isSafari || j.isUiWebView ? -l / 2 : 0;
                i.transform("translate3d(0px,0," + $ + "px) rotateX(" + (this.isHorizontal() ? 0 : c) + "deg) rotateY(" + (this.isHorizontal() ? -c : 0) + "deg)")
            },
            setTransition: function(e) {
                var t = this.$el;
                this.slides.transition(e).find(".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left").transition(e), this.params.cubeEffect.shadow && !this.isHorizontal() && t.find(".swiper-cube-shadow").transition(e)
            }
        },
        me = {
            setTranslate: function() {
                for (var e = this.slides, t = this.rtlTranslate, i = 0; i < e.length; i += 1) {
                    var a = e.eq(i),
                        r = a[0].progress;
                    this.params.flipEffect.limitRotation && (r = Math.max(Math.min(a[0].progress, 1), -1));
                    var n = -180 * r,
                        o = 0,
                        l = -a[0].swiperSlideOffset,
                        d = 0;
                    if (this.isHorizontal() ? t && (n = -n) : (d = l, l = 0, o = -n, n = 0), a[0].style.zIndex = -Math.abs(Math.round(r)) + e.length, this.params.flipEffect.slideShadows) {
                        var h = this.isHorizontal() ? a.find(".swiper-slide-shadow-left") : a.find(".swiper-slide-shadow-top"),
                            p = this.isHorizontal() ? a.find(".swiper-slide-shadow-right") : a.find(".swiper-slide-shadow-bottom");
                        0 === h.length && (h = s('<div class="swiper-slide-shadow-' + (this.isHorizontal() ? "left" : "top") + '"></div>'), a.append(h)), 0 === p.length && (p = s('<div class="swiper-slide-shadow-' + (this.isHorizontal() ? "right" : "bottom") + '"></div>'), a.append(p)), h.length && (h[0].style.opacity = Math.max(-r, 0)), p.length && (p[0].style.opacity = Math.max(r, 0))
                    }
                    a.transform("translate3d(" + l + "px, " + d + "px, 0px) rotateX(" + o + "deg) rotateY(" + n + "deg)")
                }
            },
            setTransition: function(e) {
                var t = this,
                    i = t.slides,
                    s = t.activeIndex,
                    a = t.$wrapperEl;
                if (i.transition(e).find(".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left").transition(e), t.params.virtualTranslate && 0 !== e) {
                    var r = !1;
                    i.eq(s).transitionEnd((function() {
                        if (!r && t && !t.destroyed) {
                            r = !0, t.animating = !1;
                            for (var e = ["webkitTransitionEnd", "transitionend"], i = 0; i < e.length; i += 1) a.trigger(e[i])
                        }
                    }))
                }
            }
        },
        ge = {
            setTranslate: function() {
                for (var e = this.width, t = this.height, i = this.slides, a = this.$wrapperEl, r = this.slidesSizesGrid, n = this.params.coverflowEffect, l = this.isHorizontal(), d = this.translate, h = l ? e / 2 - d : t / 2 - d, p = l ? n.rotate : -n.rotate, c = n.depth, u = 0, v = i.length; u < v; u += 1) {
                    var f = i.eq(u),
                        m = r[u],
                        g = (h - f[0].swiperSlideOffset - m / 2) / m * n.modifier,
                        b = l ? p * g : 0,
                        w = l ? 0 : p * g,
                        y = -c * Math.abs(g),
                        x = n.stretch;
                    "string" == typeof x && -1 !== x.indexOf("%") && (x = parseFloat(n.stretch) / 100 * m);
                    var T = l ? 0 : x * g,
                        E = l ? x * g : 0;
                    Math.abs(E) < .001 && (E = 0), Math.abs(T) < .001 && (T = 0), Math.abs(y) < .001 && (y = 0), Math.abs(b) < .001 && (b = 0), Math.abs(w) < .001 && (w = 0);
                    var S = "translate3d(" + E + "px," + T + "px," + y + "px)  rotateX(" + w + "deg) rotateY(" + b + "deg)";
                    if (f.transform(S), f[0].style.zIndex = 1 - Math.abs(Math.round(g)), n.slideShadows) {
                        var C = l ? f.find(".swiper-slide-shadow-left") : f.find(".swiper-slide-shadow-top"),
                            M = l ? f.find(".swiper-slide-shadow-right") : f.find(".swiper-slide-shadow-bottom");
                        0 === C.length && (C = s('<div class="swiper-slide-shadow-' + (l ? "left" : "top") + '"></div>'), f.append(C)), 0 === M.length && (M = s('<div class="swiper-slide-shadow-' + (l ? "right" : "bottom") + '"></div>'), f.append(M)), C.length && (C[0].style.opacity = g > 0 ? g : 0), M.length && (M[0].style.opacity = -g > 0 ? -g : 0)
                    }
                }(o.pointerEvents || o.prefixedPointerEvents) && (a[0].style.perspectiveOrigin = h + "px 50%")
            },
            setTransition: function(e) {
                this.slides.transition(e).find(".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left").transition(e)
            }
        },
        be = {
            init: function() {
                var e = this.params.thumbs,
                    t = this.constructor;
                e.swiper instanceof t ? (this.thumbs.swiper = e.swiper, n.extend(this.thumbs.swiper.originalParams, {
                    watchSlidesProgress: !0,
                    slideToClickedSlide: !1
                }), n.extend(this.thumbs.swiper.params, {
                    watchSlidesProgress: !0,
                    slideToClickedSlide: !1
                })) : n.isObject(e.swiper) && (this.thumbs.swiper = new t(n.extend({}, e.swiper, {
                    watchSlidesVisibility: !0,
                    watchSlidesProgress: !0,
                    slideToClickedSlide: !1
                })), this.thumbs.swiperCreated = !0), this.thumbs.swiper.$el.addClass(this.params.thumbs.thumbsContainerClass), this.thumbs.swiper.on("tap", this.thumbs.onThumbClick)
            },
            onThumbClick: function() {
                var e = this.thumbs.swiper;
                if (e) {
                    var t = e.clickedIndex,
                        i = e.clickedSlide;
                    if (!(i && s(i).hasClass(this.params.thumbs.slideThumbActiveClass) || null == t)) {
                        var a;
                        if (a = e.params.loop ? parseInt(s(e.clickedSlide).attr("data-swiper-slide-index"), 10) : t, this.params.loop) {
                            var r = this.activeIndex;
                            this.slides.eq(r).hasClass(this.params.slideDuplicateClass) && (this.loopFix(), this._clientLeft = this.$wrapperEl[0].clientLeft, r = this.activeIndex);
                            var n = this.slides.eq(r).prevAll('[data-swiper-slide-index="' + a + '"]').eq(0).index(),
                                o = this.slides.eq(r).nextAll('[data-swiper-slide-index="' + a + '"]').eq(0).index();
                            a = void 0 === n ? o : void 0 === o ? n : o - r < r - n ? o : n
                        }
                        this.slideTo(a)
                    }
                }
            },
            update: function(e) {
                var t = this.thumbs.swiper;
                if (t) {
                    var i = "auto" === t.params.slidesPerView ? t.slidesPerViewDynamic() : t.params.slidesPerView;
                    if (this.realIndex !== t.realIndex) {
                        var s, a = t.activeIndex;
                        if (t.params.loop) {
                            t.slides.eq(a).hasClass(t.params.slideDuplicateClass) && (t.loopFix(), t._clientLeft = t.$wrapperEl[0].clientLeft, a = t.activeIndex);
                            var r = t.slides.eq(a).prevAll('[data-swiper-slide-index="' + this.realIndex + '"]').eq(0).index(),
                                n = t.slides.eq(a).nextAll('[data-swiper-slide-index="' + this.realIndex + '"]').eq(0).index();
                            s = void 0 === r ? n : void 0 === n ? r : n - a == a - r ? a : n - a < a - r ? n : r
                        } else s = this.realIndex;
                        t.visibleSlidesIndexes && t.visibleSlidesIndexes.indexOf(s) < 0 && (t.params.centeredSlides ? s = s > a ? s - Math.floor(i / 2) + 1 : s + Math.floor(i / 2) - 1 : s > a && (s = s - i + 1), t.slideTo(s, e ? 0 : void 0))
                    }
                    var o = 1,
                        l = this.params.thumbs.slideThumbActiveClass;
                    if (this.params.slidesPerView > 1 && !this.params.centeredSlides && (o = this.params.slidesPerView), this.params.thumbs.multipleActiveThumbs || (o = 1), o = Math.floor(o), t.slides.removeClass(l), t.params.loop || t.params.virtual && t.params.virtual.enabled)
                        for (var d = 0; d < o; d += 1) t.$wrapperEl.children('[data-swiper-slide-index="' + (this.realIndex + d) + '"]').addClass(l);
                    else
                        for (var h = 0; h < o; h += 1) t.slides.eq(this.realIndex + h).addClass(l)
                }
            }
        },
        we = [R, q, K, U, Z, J, te, {
            name: "mousewheel",
            params: {
                mousewheel: {
                    enabled: !1,
                    releaseOnEdges: !1,
                    invert: !1,
                    forceToAxis: !1,
                    sensitivity: 1,
                    eventsTarged: "container"
                }
            },
            create: function() {
                n.extend(this, {
                    mousewheel: {
                        enabled: !1,
                        enable: ie.enable.bind(this),
                        disable: ie.disable.bind(this),
                        handle: ie.handle.bind(this),
                        handleMouseEnter: ie.handleMouseEnter.bind(this),
                        handleMouseLeave: ie.handleMouseLeave.bind(this),
                        animateSlider: ie.animateSlider.bind(this),
                        releaseScroll: ie.releaseScroll.bind(this),
                        lastScrollTime: n.now(),
                        lastEventBeforeSnap: void 0,
                        recentWheelEvents: []
                    }
                })
            },
            on: {
                init: function() {
                    !this.params.mousewheel.enabled && this.params.cssMode && this.mousewheel.disable(), this.params.mousewheel.enabled && this.mousewheel.enable()
                },
                destroy: function() {
                    this.params.cssMode && this.mousewheel.enable(), this.mousewheel.enabled && this.mousewheel.disable()
                }
            }
        }, {
            name: "navigation",
            params: {
                navigation: {
                    nextEl: null,
                    prevEl: null,
                    hideOnClick: !1,
                    disabledClass: "swiper-button-disabled",
                    hiddenClass: "swiper-button-hidden",
                    lockClass: "swiper-button-lock"
                }
            },
            create: function() {
                n.extend(this, {
                    navigation: {
                        init: se.init.bind(this),
                        update: se.update.bind(this),
                        destroy: se.destroy.bind(this),
                        onNextClick: se.onNextClick.bind(this),
                        onPrevClick: se.onPrevClick.bind(this)
                    }
                })
            },
            on: {
                init: function() {
                    this.navigation.init(), this.navigation.update()
                },
                toEdge: function() {
                    this.navigation.update()
                },
                fromEdge: function() {
                    this.navigation.update()
                },
                destroy: function() {
                    this.navigation.destroy()
                },
                click: function(e) {
                    var t, i = this.navigation,
                        a = i.$nextEl,
                        r = i.$prevEl;
                    !this.params.navigation.hideOnClick || s(e.target).is(r) || s(e.target).is(a) || (a ? t = a.hasClass(this.params.navigation.hiddenClass) : r && (t = r.hasClass(this.params.navigation.hiddenClass)), !0 === t ? this.emit("navigationShow", this) : this.emit("navigationHide", this), a && a.toggleClass(this.params.navigation.hiddenClass), r && r.toggleClass(this.params.navigation.hiddenClass))
                }
            }
        }, {
            name: "pagination",
            params: {
                pagination: {
                    el: null,
                    bulletElement: "span",
                    clickable: !1,
                    hideOnClick: !1,
                    renderBullet: null,
                    renderProgressbar: null,
                    renderFraction: null,
                    renderCustom: null,
                    progressbarOpposite: !1,
                    type: "bullets",
                    dynamicBullets: !1,
                    dynamicMainBullets: 1,
                    formatFractionCurrent: function(e) {
                        return e
                    },
                    formatFractionTotal: function(e) {
                        return e
                    },
                    bulletClass: "swiper-pagination-bullet",
                    bulletActiveClass: "swiper-pagination-bullet-active",
                    modifierClass: "swiper-pagination-",
                    currentClass: "swiper-pagination-current",
                    totalClass: "swiper-pagination-total",
                    hiddenClass: "swiper-pagination-hidden",
                    progressbarFillClass: "swiper-pagination-progressbar-fill",
                    progressbarOppositeClass: "swiper-pagination-progressbar-opposite",
                    clickableClass: "swiper-pagination-clickable",
                    lockClass: "swiper-pagination-lock"
                }
            },
            create: function() {
                n.extend(this, {
                    pagination: {
                        init: ae.init.bind(this),
                        render: ae.render.bind(this),
                        update: ae.update.bind(this),
                        destroy: ae.destroy.bind(this),
                        dynamicBulletIndex: 0
                    }
                })
            },
            on: {
                init: function() {
                    this.pagination.init(), this.pagination.render(), this.pagination.update()
                },
                activeIndexChange: function() {
                    this.params.loop ? this.pagination.update() : void 0 === this.snapIndex && this.pagination.update()
                },
                snapIndexChange: function() {
                    this.params.loop || this.pagination.update()
                },
                slidesLengthChange: function() {
                    this.params.loop && (this.pagination.render(), this.pagination.update())
                },
                snapGridLengthChange: function() {
                    this.params.loop || (this.pagination.render(), this.pagination.update())
                },
                destroy: function() {
                    this.pagination.destroy()
                },
                click: function(e) {
                    this.params.pagination.el && this.params.pagination.hideOnClick && this.pagination.$el.length > 0 && !s(e.target).hasClass(this.params.pagination.bulletClass) && (!0 === this.pagination.$el.hasClass(this.params.pagination.hiddenClass) ? this.emit("paginationShow", this) : this.emit("paginationHide", this), this.pagination.$el.toggleClass(this.params.pagination.hiddenClass))
                }
            }
        }, {
            name: "scrollbar",
            params: {
                scrollbar: {
                    el: null,
                    dragSize: "auto",
                    hide: !1,
                    draggable: !1,
                    snapOnRelease: !0,
                    lockClass: "swiper-scrollbar-lock",
                    dragClass: "swiper-scrollbar-drag"
                }
            },
            create: function() {
                n.extend(this, {
                    scrollbar: {
                        init: re.init.bind(this),
                        destroy: re.destroy.bind(this),
                        updateSize: re.updateSize.bind(this),
                        setTranslate: re.setTranslate.bind(this),
                        setTransition: re.setTransition.bind(this),
                        enableDraggable: re.enableDraggable.bind(this),
                        disableDraggable: re.disableDraggable.bind(this),
                        setDragPosition: re.setDragPosition.bind(this),
                        getPointerPosition: re.getPointerPosition.bind(this),
                        onDragStart: re.onDragStart.bind(this),
                        onDragMove: re.onDragMove.bind(this),
                        onDragEnd: re.onDragEnd.bind(this),
                        isTouched: !1,
                        timeout: null,
                        dragTimeout: null
                    }
                })
            },
            on: {
                init: function() {
                    this.scrollbar.init(), this.scrollbar.updateSize(), this.scrollbar.setTranslate()
                },
                update: function() {
                    this.scrollbar.updateSize()
                },
                resize: function() {
                    this.scrollbar.updateSize()
                },
                observerUpdate: function() {
                    this.scrollbar.updateSize()
                },
                setTranslate: function() {
                    this.scrollbar.setTranslate()
                },
                setTransition: function(e) {
                    this.scrollbar.setTransition(e)
                },
                destroy: function() {
                    this.scrollbar.destroy()
                }
            }
        }, {
            name: "parallax",
            params: {
                parallax: {
                    enabled: !1
                }
            },
            create: function() {
                n.extend(this, {
                    parallax: {
                        setTransform: ne.setTransform.bind(this),
                        setTranslate: ne.setTranslate.bind(this),
                        setTransition: ne.setTransition.bind(this)
                    }
                })
            },
            on: {
                beforeInit: function() {
                    this.params.parallax.enabled && (this.params.watchSlidesProgress = !0, this.originalParams.watchSlidesProgress = !0)
                },
                init: function() {
                    this.params.parallax.enabled && this.parallax.setTranslate()
                },
                setTranslate: function() {
                    this.params.parallax.enabled && this.parallax.setTranslate()
                },
                setTransition: function(e) {
                    this.params.parallax.enabled && this.parallax.setTransition(e)
                }
            }
        }, {
            name: "zoom",
            params: {
                zoom: {
                    enabled: !1,
                    maxRatio: 3,
                    minRatio: 1,
                    toggle: !0,
                    containerClass: "swiper-zoom-container",
                    zoomedSlideClass: "swiper-slide-zoomed"
                }
            },
            create: function() {
                var e = this,
                    t = {
                        enabled: !1,
                        scale: 1,
                        currentScale: 1,
                        isScaling: !1,
                        gesture: {
                            $slideEl: void 0,
                            slideWidth: void 0,
                            slideHeight: void 0,
                            $imageEl: void 0,
                            $imageWrapEl: void 0,
                            maxRatio: 3
                        },
                        image: {
                            isTouched: void 0,
                            isMoved: void 0,
                            currentX: void 0,
                            currentY: void 0,
                            minX: void 0,
                            minY: void 0,
                            maxX: void 0,
                            maxY: void 0,
                            width: void 0,
                            height: void 0,
                            startX: void 0,
                            startY: void 0,
                            touchesStart: {},
                            touchesCurrent: {}
                        },
                        velocity: {
                            x: void 0,
                            y: void 0,
                            prevPositionX: void 0,
                            prevPositionY: void 0,
                            prevTime: void 0
                        }
                    };
                "onGestureStart onGestureChange onGestureEnd onTouchStart onTouchMove onTouchEnd onTransitionEnd toggle enable disable in out".split(" ").forEach((function(i) {
                    t[i] = oe[i].bind(e)
                })), n.extend(e, {
                    zoom: t
                });
                var i = 1;
                Object.defineProperty(e.zoom, "scale", {
                    get: function() {
                        return i
                    },
                    set: function(t) {
                        if (i !== t) {
                            var s = e.zoom.gesture.$imageEl ? e.zoom.gesture.$imageEl[0] : void 0,
                                a = e.zoom.gesture.$slideEl ? e.zoom.gesture.$slideEl[0] : void 0;
                            e.emit("zoomChange", t, s, a)
                        }
                        i = t
                    }
                })
            },
            on: {
                init: function() {
                    this.params.zoom.enabled && this.zoom.enable()
                },
                destroy: function() {
                    this.zoom.disable()
                },
                touchStart: function(e) {
                    this.zoom.enabled && this.zoom.onTouchStart(e)
                },
                touchEnd: function(e) {
                    this.zoom.enabled && this.zoom.onTouchEnd(e)
                },
                doubleTap: function(e) {
                    this.params.zoom.enabled && this.zoom.enabled && this.params.zoom.toggle && this.zoom.toggle(e)
                },
                transitionEnd: function() {
                    this.zoom.enabled && this.params.zoom.enabled && this.zoom.onTransitionEnd()
                },
                slideChange: function() {
                    this.zoom.enabled && this.params.zoom.enabled && this.params.cssMode && this.zoom.onTransitionEnd()
                }
            }
        }, {
            name: "lazy",
            params: {
                lazy: {
                    enabled: !1,
                    loadPrevNext: !1,
                    loadPrevNextAmount: 1,
                    loadOnTransitionStart: !1,
                    elementClass: "swiper-lazy",
                    loadingClass: "swiper-lazy-loading",
                    loadedClass: "swiper-lazy-loaded",
                    preloaderClass: "swiper-lazy-preloader"
                }
            },
            create: function() {
                n.extend(this, {
                    lazy: {
                        initialImageLoaded: !1,
                        load: le.load.bind(this),
                        loadInSlide: le.loadInSlide.bind(this)
                    }
                })
            },
            on: {
                beforeInit: function() {
                    this.params.lazy.enabled && this.params.preloadImages && (this.params.preloadImages = !1)
                },
                init: function() {
                    this.params.lazy.enabled && !this.params.loop && 0 === this.params.initialSlide && this.lazy.load()
                },
                scroll: function() {
                    this.params.freeMode && !this.params.freeModeSticky && this.lazy.load()
                },
                resize: function() {
                    this.params.lazy.enabled && this.lazy.load()
                },
                scrollbarDragMove: function() {
                    this.params.lazy.enabled && this.lazy.load()
                },
                transitionStart: function() {
                    this.params.lazy.enabled && (this.params.lazy.loadOnTransitionStart || !this.params.lazy.loadOnTransitionStart && !this.lazy.initialImageLoaded) && this.lazy.load()
                },
                transitionEnd: function() {
                    this.params.lazy.enabled && !this.params.lazy.loadOnTransitionStart && this.lazy.load()
                },
                slideChange: function() {
                    this.params.lazy.enabled && this.params.cssMode && this.lazy.load()
                }
            }
        }, {
            name: "controller",
            params: {
                controller: {
                    control: void 0,
                    inverse: !1,
                    by: "slide"
                }
            },
            create: function() {
                n.extend(this, {
                    controller: {
                        control: this.params.controller.control,
                        getInterpolateFunction: de.getInterpolateFunction.bind(this),
                        setTranslate: de.setTranslate.bind(this),
                        setTransition: de.setTransition.bind(this)
                    }
                })
            },
            on: {
                update: function() {
                    this.controller.control && this.controller.spline && (this.controller.spline = void 0, delete this.controller.spline)
                },
                resize: function() {
                    this.controller.control && this.controller.spline && (this.controller.spline = void 0, delete this.controller.spline)
                },
                observerUpdate: function() {
                    this.controller.control && this.controller.spline && (this.controller.spline = void 0, delete this.controller.spline)
                },
                setTranslate: function(e, t) {
                    this.controller.control && this.controller.setTranslate(e, t)
                },
                setTransition: function(e, t) {
                    this.controller.control && this.controller.setTransition(e, t)
                }
            }
        }, {
            name: "a11y",
            params: {
                a11y: {
                    enabled: !0,
                    notificationClass: "swiper-notification",
                    prevSlideMessage: "Previous slide",
                    nextSlideMessage: "Next slide",
                    firstSlideMessage: "This is the first slide",
                    lastSlideMessage: "This is the last slide",
                    paginationBulletMessage: "Go to slide {{index}}"
                }
            },
            create: function() {
                var e = this;
                n.extend(e, {
                    a11y: {
                        liveRegion: s('<span class="' + e.params.a11y.notificationClass + '" aria-live="assertive" aria-atomic="true"></span>')
                    }
                }), Object.keys(he).forEach((function(t) {
                    e.a11y[t] = he[t].bind(e)
                }))
            },
            on: {
                init: function() {
                    this.params.a11y.enabled && (this.a11y.init(), this.a11y.updateNavigation())
                },
                toEdge: function() {
                    this.params.a11y.enabled && this.a11y.updateNavigation()
                },
                fromEdge: function() {
                    this.params.a11y.enabled && this.a11y.updateNavigation()
                },
                paginationUpdate: function() {
                    this.params.a11y.enabled && this.a11y.updatePagination()
                },
                destroy: function() {
                    this.params.a11y.enabled && this.a11y.destroy()
                }
            }
        }, {
            name: "history",
            params: {
                history: {
                    enabled: !1,
                    replaceState: !1,
                    key: "slides"
                }
            },
            create: function() {
                n.extend(this, {
                    history: {
                        init: pe.init.bind(this),
                        setHistory: pe.setHistory.bind(this),
                        setHistoryPopState: pe.setHistoryPopState.bind(this),
                        scrollToSlide: pe.scrollToSlide.bind(this),
                        destroy: pe.destroy.bind(this)
                    }
                })
            },
            on: {
                init: function() {
                    this.params.history.enabled && this.history.init()
                },
                destroy: function() {
                    this.params.history.enabled && this.history.destroy()
                },
                transitionEnd: function() {
                    this.history.initialized && this.history.setHistory(this.params.history.key, this.activeIndex)
                },
                slideChange: function() {
                    this.history.initialized && this.params.cssMode && this.history.setHistory(this.params.history.key, this.activeIndex)
                }
            }
        }, {
            name: "hash-navigation",
            params: {
                hashNavigation: {
                    enabled: !1,
                    replaceState: !1,
                    watchState: !1
                }
            },
            create: function() {
                n.extend(this, {
                    hashNavigation: {
                        initialized: !1,
                        init: ce.init.bind(this),
                        destroy: ce.destroy.bind(this),
                        setHash: ce.setHash.bind(this),
                        onHashCange: ce.onHashCange.bind(this)
                    }
                })
            },
            on: {
                init: function() {
                    this.params.hashNavigation.enabled && this.hashNavigation.init()
                },
                destroy: function() {
                    this.params.hashNavigation.enabled && this.hashNavigation.destroy()
                },
                transitionEnd: function() {
                    this.hashNavigation.initialized && this.hashNavigation.setHash()
                },
                slideChange: function() {
                    this.hashNavigation.initialized && this.params.cssMode && this.hashNavigation.setHash()
                }
            }
        }, {
            name: "autoplay",
            params: {
                autoplay: {
                    enabled: !1,
                    delay: 3e3,
                    waitForTransition: !0,
                    disableOnInteraction: !0,
                    stopOnLastSlide: !1,
                    reverseDirection: !1
                }
            },
            create: function() {
                var e = this;
                n.extend(e, {
                    autoplay: {
                        running: !1,
                        paused: !1,
                        run: ue.run.bind(e),
                        start: ue.start.bind(e),
                        stop: ue.stop.bind(e),
                        pause: ue.pause.bind(e),
                        onVisibilityChange: function() {
                            "hidden" === document.visibilityState && e.autoplay.running && e.autoplay.pause(), "visible" === document.visibilityState && e.autoplay.paused && (e.autoplay.run(), e.autoplay.paused = !1)
                        },
                        onTransitionEnd: function(t) {
                            e && !e.destroyed && e.$wrapperEl && t.target === this && (e.$wrapperEl[0].removeEventListener("transitionend", e.autoplay.onTransitionEnd), e.$wrapperEl[0].removeEventListener("webkitTransitionEnd", e.autoplay.onTransitionEnd), e.autoplay.paused = !1, e.autoplay.running ? e.autoplay.run() : e.autoplay.stop())
                        }
                    }
                })
            },
            on: {
                init: function() {
                    this.params.autoplay.enabled && (this.autoplay.start(), document.addEventListener("visibilitychange", this.autoplay.onVisibilityChange))
                },
                beforeTransitionStart: function(e, t) {
                    this.autoplay.running && (t || !this.params.autoplay.disableOnInteraction ? this.autoplay.pause(e) : this.autoplay.stop())
                },
                sliderFirstMove: function() {
                    this.autoplay.running && (this.params.autoplay.disableOnInteraction ? this.autoplay.stop() : this.autoplay.pause())
                },
                touchEnd: function() {
                    this.params.cssMode && this.autoplay.paused && !this.params.autoplay.disableOnInteraction && this.autoplay.run()
                },
                destroy: function() {
                    this.autoplay.running && this.autoplay.stop(), document.removeEventListener("visibilitychange", this.autoplay.onVisibilityChange)
                }
            }
        }, {
            name: "effect-fade",
            params: {
                fadeEffect: {
                    crossFade: !1
                }
            },
            create: function() {
                n.extend(this, {
                    fadeEffect: {
                        setTranslate: ve.setTranslate.bind(this),
                        setTransition: ve.setTransition.bind(this)
                    }
                })
            },
            on: {
                beforeInit: function() {
                    if ("fade" === this.params.effect) {
                        this.classNames.push(this.params.containerModifierClass + "fade");
                        var e = {
                            slidesPerView: 1,
                            slidesPerColumn: 1,
                            slidesPerGroup: 1,
                            watchSlidesProgress: !0,
                            spaceBetween: 0,
                            virtualTranslate: !0
                        };
                        n.extend(this.params, e), n.extend(this.originalParams, e)
                    }
                },
                setTranslate: function() {
                    "fade" === this.params.effect && this.fadeEffect.setTranslate()
                },
                setTransition: function(e) {
                    "fade" === this.params.effect && this.fadeEffect.setTransition(e)
                }
            }
        }, {
            name: "effect-cube",
            params: {
                cubeEffect: {
                    slideShadows: !0,
                    shadow: !0,
                    shadowOffset: 20,
                    shadowScale: .94
                }
            },
            create: function() {
                n.extend(this, {
                    cubeEffect: {
                        setTranslate: fe.setTranslate.bind(this),
                        setTransition: fe.setTransition.bind(this)
                    }
                })
            },
            on: {
                beforeInit: function() {
                    if ("cube" === this.params.effect) {
                        this.classNames.push(this.params.containerModifierClass + "cube"), this.classNames.push(this.params.containerModifierClass + "3d");
                        var e = {
                            slidesPerView: 1,
                            slidesPerColumn: 1,
                            slidesPerGroup: 1,
                            watchSlidesProgress: !0,
                            resistanceRatio: 0,
                            spaceBetween: 0,
                            centeredSlides: !1,
                            virtualTranslate: !0
                        };
                        n.extend(this.params, e), n.extend(this.originalParams, e)
                    }
                },
                setTranslate: function() {
                    "cube" === this.params.effect && this.cubeEffect.setTranslate()
                },
                setTransition: function(e) {
                    "cube" === this.params.effect && this.cubeEffect.setTransition(e)
                }
            }
        }, {
            name: "effect-flip",
            params: {
                flipEffect: {
                    slideShadows: !0,
                    limitRotation: !0
                }
            },
            create: function() {
                n.extend(this, {
                    flipEffect: {
                        setTranslate: me.setTranslate.bind(this),
                        setTransition: me.setTransition.bind(this)
                    }
                })
            },
            on: {
                beforeInit: function() {
                    if ("flip" === this.params.effect) {
                        this.classNames.push(this.params.containerModifierClass + "flip"), this.classNames.push(this.params.containerModifierClass + "3d");
                        var e = {
                            slidesPerView: 1,
                            slidesPerColumn: 1,
                            slidesPerGroup: 1,
                            watchSlidesProgress: !0,
                            spaceBetween: 0,
                            virtualTranslate: !0
                        };
                        n.extend(this.params, e), n.extend(this.originalParams, e)
                    }
                },
                setTranslate: function() {
                    "flip" === this.params.effect && this.flipEffect.setTranslate()
                },
                setTransition: function(e) {
                    "flip" === this.params.effect && this.flipEffect.setTransition(e)
                }
            }
        }, {
            name: "effect-coverflow",
            params: {
                coverflowEffect: {
                    rotate: 50,
                    stretch: 0,
                    depth: 100,
                    modifier: 1,
                    slideShadows: !0
                }
            },
            create: function() {
                n.extend(this, {
                    coverflowEffect: {
                        setTranslate: ge.setTranslate.bind(this),
                        setTransition: ge.setTransition.bind(this)
                    }
                })
            },
            on: {
                beforeInit: function() {
                    "coverflow" === this.params.effect && (this.classNames.push(this.params.containerModifierClass + "coverflow"), this.classNames.push(this.params.containerModifierClass + "3d"), this.params.watchSlidesProgress = !0, this.originalParams.watchSlidesProgress = !0)
                },
                setTranslate: function() {
                    "coverflow" === this.params.effect && this.coverflowEffect.setTranslate()
                },
                setTransition: function(e) {
                    "coverflow" === this.params.effect && this.coverflowEffect.setTransition(e)
                }
            }
        }, {
            name: "thumbs",
            params: {
                thumbs: {
                    multipleActiveThumbs: !0,
                    swiper: null,
                    slideThumbActiveClass: "swiper-slide-thumb-active",
                    thumbsContainerClass: "swiper-container-thumbs"
                }
            },
            create: function() {
                n.extend(this, {
                    thumbs: {
                        swiper: null,
                        init: be.init.bind(this),
                        update: be.update.bind(this),
                        onThumbClick: be.onThumbClick.bind(this)
                    }
                })
            },
            on: {
                beforeInit: function() {
                    var e = this.params.thumbs;
                    e && e.swiper && (this.thumbs.init(), this.thumbs.update(!0))
                },
                slideChange: function() {
                    this.thumbs.swiper && this.thumbs.update()
                },
                update: function() {
                    this.thumbs.swiper && this.thumbs.update()
                },
                resize: function() {
                    this.thumbs.swiper && this.thumbs.update()
                },
                observerUpdate: function() {
                    this.thumbs.swiper && this.thumbs.update()
                },
                setTransition: function(e) {
                    var t = this.thumbs.swiper;
                    t && t.setTransition(e)
                },
                beforeDestroy: function() {
                    var e = this.thumbs.swiper;
                    e && this.thumbs.swiperCreated && e && e.destroy()
                }
            }
        }];
    return void 0 === W.use && (W.use = W.Class.use, W.installModule = W.Class.installModule), W.use(we), W
}));

;
/*!
 * VERSION: 1.13.2
 * DATE: 2014-08-23
 * UPDATES AND DOCS AT: http://www.greensock.com
 *
 * @license Copyright (c) 2008-2014, GreenSock. All rights reserved.
 * This work is subject to the terms at http://www.greensock.com/terms_of_use.html or for
 * Club GreenSock members, the software agreement that was issued with your membership.
 *
 * @author: Jack Doyle, jack@greensock.com
 */
(function(t, e) {
    "use strict";
    var i = t.GreenSockGlobals = t.GreenSockGlobals || t;
    if (!i.TweenLite) {
        var s, n, r, a, o, l = function(t) {
                var e, s = t.split("."),
                    n = i;
                for (e = 0; s.length > e; e++) n[s[e]] = n = n[s[e]] || {};
                return n
            },
            h = l("com.greensock"),
            _ = 1e-10,
            u = function(t) {
                var e, i = [],
                    s = t.length;
                for (e = 0; e !== s; i.push(t[e++]));
                return i
            },
            m = function() {},
            f = function() {
                var t = Object.prototype.toString,
                    e = t.call([]);
                return function(i) {
                    return null != i && (i instanceof Array || "object" == typeof i && !!i.push && t.call(i) === e)
                }
            }(),
            p = {},
            c = function(s, n, r, a) {
                this.sc = p[s] ? p[s].sc : [], p[s] = this, this.gsClass = null, this.func = r;
                var o = [];
                this.check = function(h) {
                    for (var _, u, m, f, d = n.length, v = d; --d > -1;)(_ = p[n[d]] || new c(n[d], [])).gsClass ? (o[d] = _.gsClass, v--) : h && _.sc.push(this);
                    if (0 === v && r)
                        for (u = ("com.greensock." + s).split("."), m = u.pop(), f = l(u.join("."))[m] = this.gsClass = r.apply(r, o), a && (i[m] = f, "function" == typeof define && define.amd ? define((t.GreenSockAMDPath ? t.GreenSockAMDPath + "/" : "") + s.split(".").pop(), [], function() {
                                return f
                            }) : s === e && "undefined" != typeof module && module.exports && (module.exports = f)), d = 0; this.sc.length > d; d++) this.sc[d].check()
                }, this.check(!0)
            },
            d = t._gsDefine = function(t, e, i, s) {
                return new c(t, e, i, s)
            },
            v = h._class = function(t, e, i) {
                return e = e || function() {}, d(t, [], function() {
                    return e
                }, i), e
            };
        d.globals = i;
        var g = [0, 0, 1, 1],
            T = [],
            y = v("easing.Ease", function(t, e, i, s) {
                this._func = t, this._type = i || 0, this._power = s || 0, this._params = e ? g.concat(e) : g
            }, !0),
            w = y.map = {},
            P = y.register = function(t, e, i, s) {
                for (var n, r, a, o, l = e.split(","), _ = l.length, u = (i || "easeIn,easeOut,easeInOut").split(","); --_ > -1;)
                    for (r = l[_], n = s ? v("easing." + r, null, !0) : h.easing[r] || {}, a = u.length; --a > -1;) o = u[a], w[r + "." + o] = w[o + r] = n[o] = t.getRatio ? t : t[o] || new t
            };
        for (r = y.prototype, r._calcEnd = !1, r.getRatio = function(t) {
                if (this._func) return this._params[0] = t, this._func.apply(null, this._params);
                var e = this._type,
                    i = this._power,
                    s = 1 === e ? 1 - t : 2 === e ? t : .5 > t ? 2 * t : 2 * (1 - t);
                return 1 === i ? s *= s : 2 === i ? s *= s * s : 3 === i ? s *= s * s * s : 4 === i && (s *= s * s * s * s), 1 === e ? 1 - s : 2 === e ? s : .5 > t ? s / 2 : 1 - s / 2
            }, s = ["Linear", "Quad", "Cubic", "Quart", "Quint,Strong"], n = s.length; --n > -1;) r = s[n] + ",Power" + n, P(new y(null, null, 1, n), r, "easeOut", !0), P(new y(null, null, 2, n), r, "easeIn" + (0 === n ? ",easeNone" : "")), P(new y(null, null, 3, n), r, "easeInOut");
        w.linear = h.easing.Linear.easeIn, w.swing = h.easing.Quad.easeInOut;
        var b = v("events.EventDispatcher", function(t) {
            this._listeners = {}, this._eventTarget = t || this
        });
        r = b.prototype, r.addEventListener = function(t, e, i, s, n) {
            n = n || 0;
            var r, l, h = this._listeners[t],
                _ = 0;
            for (null == h && (this._listeners[t] = h = []), l = h.length; --l > -1;) r = h[l], r.c === e && r.s === i ? h.splice(l, 1) : 0 === _ && n > r.pr && (_ = l + 1);
            h.splice(_, 0, {
                c: e,
                s: i,
                up: s,
                pr: n
            }), this !== a || o || a.wake()
        }, r.removeEventListener = function(t, e) {
            var i, s = this._listeners[t];
            if (s)
                for (i = s.length; --i > -1;)
                    if (s[i].c === e) return s.splice(i, 1), void 0
        }, r.dispatchEvent = function(t) {
            var e, i, s, n = this._listeners[t];
            if (n)
                for (e = n.length, i = this._eventTarget; --e > -1;) s = n[e], s.up ? s.c.call(s.s || i, {
                    type: t,
                    target: i
                }) : s.c.call(s.s || i)
        };
        var k = t.requestAnimationFrame,
            A = t.cancelAnimationFrame,
            S = Date.now || function() {
                return (new Date).getTime()
            },
            x = S();
        for (s = ["ms", "moz", "webkit", "o"], n = s.length; --n > -1 && !k;) k = t[s[n] + "RequestAnimationFrame"], A = t[s[n] + "CancelAnimationFrame"] || t[s[n] + "CancelRequestAnimationFrame"];
        v("Ticker", function(t, e) {
            var i, s, n, r, l, h = this,
                u = S(),
                f = e !== !1 && k,
                p = 500,
                c = 33,
                d = function(t) {
                    var e, a, o = S() - x;
                    o > p && (u += o - c), x += o, h.time = (x - u) / 1e3, e = h.time - l, (!i || e > 0 || t === !0) && (h.frame++, l += e + (e >= r ? .004 : r - e), a = !0), t !== !0 && (n = s(d)), a && h.dispatchEvent("tick")
                };
            b.call(h), h.time = h.frame = 0, h.tick = function() {
                d(!0)
            }, h.lagSmoothing = function(t, e) {
                p = t || 1 / _, c = Math.min(e, p, 0)
            }, h.sleep = function() {
                null != n && (f && A ? A(n) : clearTimeout(n), s = m, n = null, h === a && (o = !1))
            }, h.wake = function() {
                null !== n ? h.sleep() : h.frame > 10 && (x = S() - p + 5), s = 0 === i ? m : f && k ? k : function(t) {
                    return setTimeout(t, 0 | 1e3 * (l - h.time) + 1)
                }, h === a && (o = !0), d(2)
            }, h.fps = function(t) {
                return arguments.length ? (i = t, r = 1 / (i || 60), l = this.time + r, h.wake(), void 0) : i
            }, h.useRAF = function(t) {
                return arguments.length ? (h.sleep(), f = t, h.fps(i), void 0) : f
            }, h.fps(t), setTimeout(function() {
                f && (!n || 5 > h.frame) && h.useRAF(!1)
            }, 1500)
        }), r = h.Ticker.prototype = new h.events.EventDispatcher, r.constructor = h.Ticker;
        var R = v("core.Animation", function(t, e) {
            if (this.vars = e = e || {}, this._duration = this._totalDuration = t || 0, this._delay = Number(e.delay) || 0, this._timeScale = 1, this._active = e.immediateRender === !0, this.data = e.data, this._reversed = e.reversed === !0, B) {
                o || a.wake();
                var i = this.vars.useFrames ? q : B;
                i.add(this, i._time), this.vars.paused && this.paused(!0)
            }
        });
        a = R.ticker = new h.Ticker, r = R.prototype, r._dirty = r._gc = r._initted = r._paused = !1, r._totalTime = r._time = 0, r._rawPrevTime = -1, r._next = r._last = r._onUpdate = r._timeline = r.timeline = null, r._paused = !1;
        var C = function() {
            o && S() - x > 2e3 && a.wake(), setTimeout(C, 2e3)
        };
        C(), r.play = function(t, e) {
            return null != t && this.seek(t, e), this.reversed(!1).paused(!1)
        }, r.pause = function(t, e) {
            return null != t && this.seek(t, e), this.paused(!0)
        }, r.resume = function(t, e) {
            return null != t && this.seek(t, e), this.paused(!1)
        }, r.seek = function(t, e) {
            return this.totalTime(Number(t), e !== !1)
        }, r.restart = function(t, e) {
            return this.reversed(!1).paused(!1).totalTime(t ? -this._delay : 0, e !== !1, !0)
        }, r.reverse = function(t, e) {
            return null != t && this.seek(t || this.totalDuration(), e), this.reversed(!0).paused(!1)
        }, r.render = function() {}, r.invalidate = function() {
            return this._time = this._totalTime = 0, this._initted = this._gc = !1, this._rawPrevTime = -1, (this._gc || !this.timeline) && this._enabled(!0), this
        }, r.isActive = function() {
            var t, e = this._timeline,
                i = this._startTime;
            return !e || !this._gc && !this._paused && e.isActive() && (t = e.rawTime()) >= i && i + this.totalDuration() / this._timeScale > t
        }, r._enabled = function(t, e) {
            return o || a.wake(), this._gc = !t, this._active = this.isActive(), e !== !0 && (t && !this.timeline ? this._timeline.add(this, this._startTime - this._delay) : !t && this.timeline && this._timeline._remove(this, !0)), !1
        }, r._kill = function() {
            return this._enabled(!1, !1)
        }, r.kill = function(t, e) {
            return this._kill(t, e), this
        }, r._uncache = function(t) {
            for (var e = t ? this : this.timeline; e;) e._dirty = !0, e = e.timeline;
            return this
        }, r._swapSelfInParams = function(t) {
            for (var e = t.length, i = t.concat(); --e > -1;) "{self}" === t[e] && (i[e] = this);
            return i
        }, r.eventCallback = function(t, e, i, s) {
            if ("on" === (t || "").substr(0, 2)) {
                var n = this.vars;
                if (1 === arguments.length) return n[t];
                null == e ? delete n[t] : (n[t] = e, n[t + "Params"] = f(i) && -1 !== i.join("").indexOf("{self}") ? this._swapSelfInParams(i) : i, n[t + "Scope"] = s), "onUpdate" === t && (this._onUpdate = e)
            }
            return this
        }, r.delay = function(t) {
            return arguments.length ? (this._timeline.smoothChildTiming && this.startTime(this._startTime + t - this._delay), this._delay = t, this) : this._delay
        }, r.duration = function(t) {
            return arguments.length ? (this._duration = this._totalDuration = t, this._uncache(!0), this._timeline.smoothChildTiming && this._time > 0 && this._time < this._duration && 0 !== t && this.totalTime(this._totalTime * (t / this._duration), !0), this) : (this._dirty = !1, this._duration)
        }, r.totalDuration = function(t) {
            return this._dirty = !1, arguments.length ? this.duration(t) : this._totalDuration
        }, r.time = function(t, e) {
            return arguments.length ? (this._dirty && this.totalDuration(), this.totalTime(t > this._duration ? this._duration : t, e)) : this._time
        }, r.totalTime = function(t, e, i) {
            if (o || a.wake(), !arguments.length) return this._totalTime;
            if (this._timeline) {
                if (0 > t && !i && (t += this.totalDuration()), this._timeline.smoothChildTiming) {
                    this._dirty && this.totalDuration();
                    var s = this._totalDuration,
                        n = this._timeline;
                    if (t > s && !i && (t = s), this._startTime = (this._paused ? this._pauseTime : n._time) - (this._reversed ? s - t : t) / this._timeScale, n._dirty || this._uncache(!1), n._timeline)
                        for (; n._timeline;) n._timeline._time !== (n._startTime + n._totalTime) / n._timeScale && n.totalTime(n._totalTime, !0), n = n._timeline
                }
                this._gc && this._enabled(!0, !1), (this._totalTime !== t || 0 === this._duration) && (this.render(t, e, !1), O.length && M())
            }
            return this
        }, r.progress = r.totalProgress = function(t, e) {
            return arguments.length ? this.totalTime(this.duration() * t, e) : this._time / this.duration()
        }, r.startTime = function(t) {
            return arguments.length ? (t !== this._startTime && (this._startTime = t, this.timeline && this.timeline._sortChildren && this.timeline.add(this, t - this._delay)), this) : this._startTime
        }, r.timeScale = function(t) {
            if (!arguments.length) return this._timeScale;
            if (t = t || _, this._timeline && this._timeline.smoothChildTiming) {
                var e = this._pauseTime,
                    i = e || 0 === e ? e : this._timeline.totalTime();
                this._startTime = i - (i - this._startTime) * this._timeScale / t
            }
            return this._timeScale = t, this._uncache(!1)
        }, r.reversed = function(t) {
            return arguments.length ? (t != this._reversed && (this._reversed = t, this.totalTime(this._timeline && !this._timeline.smoothChildTiming ? this.totalDuration() - this._totalTime : this._totalTime, !0)), this) : this._reversed
        }, r.paused = function(t) {
            if (!arguments.length) return this._paused;
            if (t != this._paused && this._timeline) {
                o || t || a.wake();
                var e = this._timeline,
                    i = e.rawTime(),
                    s = i - this._pauseTime;
                !t && e.smoothChildTiming && (this._startTime += s, this._uncache(!1)), this._pauseTime = t ? i : null, this._paused = t, this._active = this.isActive(), !t && 0 !== s && this._initted && this.duration() && this.render(e.smoothChildTiming ? this._totalTime : (i - this._startTime) / this._timeScale, !0, !0)
            }
            return this._gc && !t && this._enabled(!0, !1), this
        };
        var D = v("core.SimpleTimeline", function(t) {
            R.call(this, 0, t), this.autoRemoveChildren = this.smoothChildTiming = !0
        });
        r = D.prototype = new R, r.constructor = D, r.kill()._gc = !1, r._first = r._last = null, r._sortChildren = !1, r.add = r.insert = function(t, e) {
            var i, s;
            if (t._startTime = Number(e || 0) + t._delay, t._paused && this !== t._timeline && (t._pauseTime = t._startTime + (this.rawTime() - t._startTime) / t._timeScale), t.timeline && t.timeline._remove(t, !0), t.timeline = t._timeline = this, t._gc && t._enabled(!0, !0), i = this._last, this._sortChildren)
                for (s = t._startTime; i && i._startTime > s;) i = i._prev;
            return i ? (t._next = i._next, i._next = t) : (t._next = this._first, this._first = t), t._next ? t._next._prev = t : this._last = t, t._prev = i, this._timeline && this._uncache(!0), this
        }, r._remove = function(t, e) {
            return t.timeline === this && (e || t._enabled(!1, !0), t._prev ? t._prev._next = t._next : this._first === t && (this._first = t._next), t._next ? t._next._prev = t._prev : this._last === t && (this._last = t._prev), t._next = t._prev = t.timeline = null, this._timeline && this._uncache(!0)), this
        }, r.render = function(t, e, i) {
            var s, n = this._first;
            for (this._totalTime = this._time = this._rawPrevTime = t; n;) s = n._next, (n._active || t >= n._startTime && !n._paused) && (n._reversed ? n.render((n._dirty ? n.totalDuration() : n._totalDuration) - (t - n._startTime) * n._timeScale, e, i) : n.render((t - n._startTime) * n._timeScale, e, i)), n = s
        }, r.rawTime = function() {
            return o || a.wake(), this._totalTime
        };
        var I = v("TweenLite", function(e, i, s) {
                if (R.call(this, i, s), this.render = I.prototype.render, null == e) throw "Cannot tween a null target.";
                this.target = e = "string" != typeof e ? e : I.selector(e) || e;
                var n, r, a, o = e.jquery || e.length && e !== t && e[0] && (e[0] === t || e[0].nodeType && e[0].style && !e.nodeType),
                    l = this.vars.overwrite;
                if (this._overwrite = l = null == l ? Q[I.defaultOverwrite] : "number" == typeof l ? l >> 0 : Q[l], (o || e instanceof Array || e.push && f(e)) && "number" != typeof e[0])
                    for (this._targets = a = u(e), this._propLookup = [], this._siblings = [], n = 0; a.length > n; n++) r = a[n], r ? "string" != typeof r ? r.length && r !== t && r[0] && (r[0] === t || r[0].nodeType && r[0].style && !r.nodeType) ? (a.splice(n--, 1), this._targets = a = a.concat(u(r))) : (this._siblings[n] = $(r, this, !1), 1 === l && this._siblings[n].length > 1 && K(r, this, null, 1, this._siblings[n])) : (r = a[n--] = I.selector(r), "string" == typeof r && a.splice(n + 1, 1)) : a.splice(n--, 1);
                else this._propLookup = {}, this._siblings = $(e, this, !1), 1 === l && this._siblings.length > 1 && K(e, this, null, 1, this._siblings);
                (this.vars.immediateRender || 0 === i && 0 === this._delay && this.vars.immediateRender !== !1) && (this._time = -_, this.render(-this._delay))
            }, !0),
            E = function(e) {
                return e.length && e !== t && e[0] && (e[0] === t || e[0].nodeType && e[0].style && !e.nodeType)
            },
            z = function(t, e) {
                var i, s = {};
                for (i in t) G[i] || i in e && "transform" !== i && "x" !== i && "y" !== i && "width" !== i && "height" !== i && "className" !== i && "border" !== i || !(!U[i] || U[i] && U[i]._autoCSS) || (s[i] = t[i], delete t[i]);
                t.css = s
            };
        r = I.prototype = new R, r.constructor = I, r.kill()._gc = !1, r.ratio = 0, r._firstPT = r._targets = r._overwrittenProps = r._startAt = null, r._notifyPluginsOfEnabled = r._lazy = !1, I.version = "1.13.2", I.defaultEase = r._ease = new y(null, null, 1, 1), I.defaultOverwrite = "auto", I.ticker = a, I.autoSleep = !0, I.lagSmoothing = function(t, e) {
            a.lagSmoothing(t, e)
        }, I.selector = t.$ || t.jQuery || function(e) {
            var i = t.$ || t.jQuery;
            return i ? (I.selector = i, i(e)) : "undefined" == typeof document ? e : document.querySelectorAll ? document.querySelectorAll(e) : document.getElementById("#" === e.charAt(0) ? e.substr(1) : e)
        };
        var O = [],
            L = {},
            N = I._internals = {
                isArray: f,
                isSelector: E,
                lazyTweens: O
            },
            U = I._plugins = {},
            F = N.tweenLookup = {},
            j = 0,
            G = N.reservedProps = {
                ease: 1,
                delay: 1,
                overwrite: 1,
                onComplete: 1,
                onCompleteParams: 1,
                onCompleteScope: 1,
                useFrames: 1,
                runBackwards: 1,
                startAt: 1,
                onUpdate: 1,
                onUpdateParams: 1,
                onUpdateScope: 1,
                onStart: 1,
                onStartParams: 1,
                onStartScope: 1,
                onReverseComplete: 1,
                onReverseCompleteParams: 1,
                onReverseCompleteScope: 1,
                onRepeat: 1,
                onRepeatParams: 1,
                onRepeatScope: 1,
                easeParams: 1,
                yoyo: 1,
                immediateRender: 1,
                repeat: 1,
                repeatDelay: 1,
                data: 1,
                paused: 1,
                reversed: 1,
                autoCSS: 1,
                lazy: 1
            },
            Q = {
                none: 0,
                all: 1,
                auto: 2,
                concurrent: 3,
                allOnStart: 4,
                preexisting: 5,
                "true": 1,
                "false": 0
            },
            q = R._rootFramesTimeline = new D,
            B = R._rootTimeline = new D,
            M = N.lazyRender = function() {
                var t = O.length;
                for (L = {}; --t > -1;) s = O[t], s && s._lazy !== !1 && (s.render(s._lazy[0], s._lazy[1], !0), s._lazy = !1);
                O.length = 0
            };
        B._startTime = a.time, q._startTime = a.frame, B._active = q._active = !0, setTimeout(M, 1), R._updateRoot = I.render = function() {
            var t, e, i;
            if (O.length && M(), B.render((a.time - B._startTime) * B._timeScale, !1, !1), q.render((a.frame - q._startTime) * q._timeScale, !1, !1), O.length && M(), !(a.frame % 120)) {
                for (i in F) {
                    for (e = F[i].tweens, t = e.length; --t > -1;) e[t]._gc && e.splice(t, 1);
                    0 === e.length && delete F[i]
                }
                if (i = B._first, (!i || i._paused) && I.autoSleep && !q._first && 1 === a._listeners.tick.length) {
                    for (; i && i._paused;) i = i._next;
                    i || a.sleep()
                }
            }
        }, a.addEventListener("tick", R._updateRoot);
        var $ = function(t, e, i) {
                var s, n, r = t._gsTweenID;
                if (F[r || (t._gsTweenID = r = "t" + j++)] || (F[r] = {
                        target: t,
                        tweens: []
                    }), e && (s = F[r].tweens, s[n = s.length] = e, i))
                    for (; --n > -1;) s[n] === e && s.splice(n, 1);
                return F[r].tweens
            },
            K = function(t, e, i, s, n) {
                var r, a, o, l;
                if (1 === s || s >= 4) {
                    for (l = n.length, r = 0; l > r; r++)
                        if ((o = n[r]) !== e) o._gc || o._enabled(!1, !1) && (a = !0);
                        else if (5 === s) break;
                    return a
                }
                var h, u = e._startTime + _,
                    m = [],
                    f = 0,
                    p = 0 === e._duration;
                for (r = n.length; --r > -1;)(o = n[r]) === e || o._gc || o._paused || (o._timeline !== e._timeline ? (h = h || H(e, 0, p), 0 === H(o, h, p) && (m[f++] = o)) : u >= o._startTime && o._startTime + o.totalDuration() / o._timeScale > u && ((p || !o._initted) && 2e-10 >= u - o._startTime || (m[f++] = o)));
                for (r = f; --r > -1;) o = m[r], 2 === s && o._kill(i, t) && (a = !0), (2 !== s || !o._firstPT && o._initted) && o._enabled(!1, !1) && (a = !0);
                return a
            },
            H = function(t, e, i) {
                for (var s = t._timeline, n = s._timeScale, r = t._startTime; s._timeline;) {
                    if (r += s._startTime, n *= s._timeScale, s._paused) return -100;
                    s = s._timeline
                }
                return r /= n, r > e ? r - e : i && r === e || !t._initted && 2 * _ > r - e ? _ : (r += t.totalDuration() / t._timeScale / n) > e + _ ? 0 : r - e - _
            };
        r._init = function() {
            var t, e, i, s, n, r = this.vars,
                a = this._overwrittenProps,
                o = this._duration,
                l = !!r.immediateRender,
                h = r.ease;
            if (r.startAt) {
                this._startAt && (this._startAt.render(-1, !0), this._startAt.kill()), n = {};
                for (s in r.startAt) n[s] = r.startAt[s];
                if (n.overwrite = !1, n.immediateRender = !0, n.lazy = l && r.lazy !== !1, n.startAt = n.delay = null, this._startAt = I.to(this.target, 0, n), l)
                    if (this._time > 0) this._startAt = null;
                    else if (0 !== o) return
            } else if (r.runBackwards && 0 !== o)
                if (this._startAt) this._startAt.render(-1, !0), this._startAt.kill(), this._startAt = null;
                else {
                    0 !== this._time && (l = !1), i = {};
                    for (s in r) G[s] && "autoCSS" !== s || (i[s] = r[s]);
                    if (i.overwrite = 0, i.data = "isFromStart", i.lazy = l && r.lazy !== !1, i.immediateRender = l, this._startAt = I.to(this.target, 0, i), l) {
                        if (0 === this._time) return
                    } else this._startAt._init(), this._startAt._enabled(!1), this.vars.immediateRender && (this._startAt = null)
                }
            if (this._ease = h = h ? h instanceof y ? h : "function" == typeof h ? new y(h, r.easeParams) : w[h] || I.defaultEase : I.defaultEase, r.easeParams instanceof Array && h.config && (this._ease = h.config.apply(h, r.easeParams)), this._easeType = this._ease._type, this._easePower = this._ease._power, this._firstPT = null, this._targets)
                for (t = this._targets.length; --t > -1;) this._initProps(this._targets[t], this._propLookup[t] = {}, this._siblings[t], a ? a[t] : null) && (e = !0);
            else e = this._initProps(this.target, this._propLookup, this._siblings, a);
            if (e && I._onPluginEvent("_onInitAllProps", this), a && (this._firstPT || "function" != typeof this.target && this._enabled(!1, !1)), r.runBackwards)
                for (i = this._firstPT; i;) i.s += i.c, i.c = -i.c, i = i._next;
            this._onUpdate = r.onUpdate, this._initted = !0
        }, r._initProps = function(e, i, s, n) {
            var r, a, o, l, h, _;
            if (null == e) return !1;
            L[e._gsTweenID] && M(), this.vars.css || e.style && e !== t && e.nodeType && U.css && this.vars.autoCSS !== !1 && z(this.vars, e);
            for (r in this.vars) {
                if (_ = this.vars[r], G[r]) _ && (_ instanceof Array || _.push && f(_)) && -1 !== _.join("").indexOf("{self}") && (this.vars[r] = _ = this._swapSelfInParams(_, this));
                else if (U[r] && (l = new U[r])._onInitTween(e, this.vars[r], this)) {
                    for (this._firstPT = h = {
                            _next: this._firstPT,
                            t: l,
                            p: "setRatio",
                            s: 0,
                            c: 1,
                            f: !0,
                            n: r,
                            pg: !0,
                            pr: l._priority
                        }, a = l._overwriteProps.length; --a > -1;) i[l._overwriteProps[a]] = this._firstPT;
                    (l._priority || l._onInitAllProps) && (o = !0), (l._onDisable || l._onEnable) && (this._notifyPluginsOfEnabled = !0)
                } else this._firstPT = i[r] = h = {
                    _next: this._firstPT,
                    t: e,
                    p: r,
                    f: "function" == typeof e[r],
                    n: r,
                    pg: !1,
                    pr: 0
                }, h.s = h.f ? e[r.indexOf("set") || "function" != typeof e["get" + r.substr(3)] ? r : "get" + r.substr(3)]() : parseFloat(e[r]), h.c = "string" == typeof _ && "=" === _.charAt(1) ? parseInt(_.charAt(0) + "1", 10) * Number(_.substr(2)) : Number(_) - h.s || 0;
                h && h._next && (h._next._prev = h)
            }
            return n && this._kill(n, e) ? this._initProps(e, i, s, n) : this._overwrite > 1 && this._firstPT && s.length > 1 && K(e, this, i, this._overwrite, s) ? (this._kill(i, e), this._initProps(e, i, s, n)) : (this._firstPT && (this.vars.lazy !== !1 && this._duration || this.vars.lazy && !this._duration) && (L[e._gsTweenID] = !0), o)
        }, r.render = function(t, e, i) {
            var s, n, r, a, o = this._time,
                l = this._duration,
                h = this._rawPrevTime;
            if (t >= l) this._totalTime = this._time = l, this.ratio = this._ease._calcEnd ? this._ease.getRatio(1) : 1, this._reversed || (s = !0, n = "onComplete"), 0 === l && (this._initted || !this.vars.lazy || i) && (this._startTime === this._timeline._duration && (t = 0), (0 === t || 0 > h || h === _) && h !== t && (i = !0, h > _ && (n = "onReverseComplete")), this._rawPrevTime = a = !e || t || h === t ? t : _);
            else if (1e-7 > t) this._totalTime = this._time = 0, this.ratio = this._ease._calcEnd ? this._ease.getRatio(0) : 0, (0 !== o || 0 === l && h > 0 && h !== _) && (n = "onReverseComplete", s = this._reversed), 0 > t && (this._active = !1, 0 === l && (this._initted || !this.vars.lazy || i) && (h >= 0 && (i = !0), this._rawPrevTime = a = !e || t || h === t ? t : _)), this._initted || (i = !0);
            else if (this._totalTime = this._time = t, this._easeType) {
                var u = t / l,
                    m = this._easeType,
                    f = this._easePower;
                (1 === m || 3 === m && u >= .5) && (u = 1 - u), 3 === m && (u *= 2), 1 === f ? u *= u : 2 === f ? u *= u * u : 3 === f ? u *= u * u * u : 4 === f && (u *= u * u * u * u), this.ratio = 1 === m ? 1 - u : 2 === m ? u : .5 > t / l ? u / 2 : 1 - u / 2
            } else this.ratio = this._ease.getRatio(t / l);
            if (this._time !== o || i) {
                if (!this._initted) {
                    if (this._init(), !this._initted || this._gc) return;
                    if (!i && this._firstPT && (this.vars.lazy !== !1 && this._duration || this.vars.lazy && !this._duration)) return this._time = this._totalTime = o, this._rawPrevTime = h, O.push(this), this._lazy = [t, e], void 0;
                    this._time && !s ? this.ratio = this._ease.getRatio(this._time / l) : s && this._ease._calcEnd && (this.ratio = this._ease.getRatio(0 === this._time ? 0 : 1))
                }
                for (this._lazy !== !1 && (this._lazy = !1), this._active || !this._paused && this._time !== o && t >= 0 && (this._active = !0), 0 === o && (this._startAt && (t >= 0 ? this._startAt.render(t, e, i) : n || (n = "_dummyGS")), this.vars.onStart && (0 !== this._time || 0 === l) && (e || this.vars.onStart.apply(this.vars.onStartScope || this, this.vars.onStartParams || T))), r = this._firstPT; r;) r.f ? r.t[r.p](r.c * this.ratio + r.s) : r.t[r.p] = r.c * this.ratio + r.s, r = r._next;
                this._onUpdate && (0 > t && this._startAt && this._startTime && this._startAt.render(t, e, i), e || (this._time !== o || s) && this._onUpdate.apply(this.vars.onUpdateScope || this, this.vars.onUpdateParams || T)), n && (!this._gc || i) && (0 > t && this._startAt && !this._onUpdate && this._startTime && this._startAt.render(t, e, i), s && (this._timeline.autoRemoveChildren && this._enabled(!1, !1), this._active = !1), !e && this.vars[n] && this.vars[n].apply(this.vars[n + "Scope"] || this, this.vars[n + "Params"] || T), 0 === l && this._rawPrevTime === _ && a !== _ && (this._rawPrevTime = 0))
            }
        }, r._kill = function(t, e) {
            if ("all" === t && (t = null), null == t && (null == e || e === this.target)) return this._lazy = !1, this._enabled(!1, !1);
            e = "string" != typeof e ? e || this._targets || this.target : I.selector(e) || e;
            var i, s, n, r, a, o, l, h;
            if ((f(e) || E(e)) && "number" != typeof e[0])
                for (i = e.length; --i > -1;) this._kill(t, e[i]) && (o = !0);
            else {
                if (this._targets) {
                    for (i = this._targets.length; --i > -1;)
                        if (e === this._targets[i]) {
                            a = this._propLookup[i] || {}, this._overwrittenProps = this._overwrittenProps || [], s = this._overwrittenProps[i] = t ? this._overwrittenProps[i] || {} : "all";
                            break
                        }
                } else {
                    if (e !== this.target) return !1;
                    a = this._propLookup, s = this._overwrittenProps = t ? this._overwrittenProps || {} : "all"
                }
                if (a) {
                    l = t || a, h = t !== s && "all" !== s && t !== a && ("object" != typeof t || !t._tempKill);
                    for (n in l)(r = a[n]) && (r.pg && r.t._kill(l) && (o = !0), r.pg && 0 !== r.t._overwriteProps.length || (r._prev ? r._prev._next = r._next : r === this._firstPT && (this._firstPT = r._next), r._next && (r._next._prev = r._prev), r._next = r._prev = null), delete a[n]), h && (s[n] = 1);
                    !this._firstPT && this._initted && this._enabled(!1, !1)
                }
            }
            return o
        }, r.invalidate = function() {
            return this._notifyPluginsOfEnabled && I._onPluginEvent("_onDisable", this), this._firstPT = this._overwrittenProps = this._startAt = this._onUpdate = null, this._notifyPluginsOfEnabled = this._active = this._lazy = !1, this._propLookup = this._targets ? {} : [], R.prototype.invalidate.call(this), this.vars.immediateRender && (this._time = -_, this.render(-this._delay)), this
        }, r._enabled = function(t, e) {
            if (o || a.wake(), t && this._gc) {
                var i, s = this._targets;
                if (s)
                    for (i = s.length; --i > -1;) this._siblings[i] = $(s[i], this, !0);
                else this._siblings = $(this.target, this, !0)
            }
            return R.prototype._enabled.call(this, t, e), this._notifyPluginsOfEnabled && this._firstPT ? I._onPluginEvent(t ? "_onEnable" : "_onDisable", this) : !1
        }, I.to = function(t, e, i) {
            return new I(t, e, i)
        }, I.from = function(t, e, i) {
            return i.runBackwards = !0, i.immediateRender = 0 != i.immediateRender, new I(t, e, i)
        }, I.fromTo = function(t, e, i, s) {
            return s.startAt = i, s.immediateRender = 0 != s.immediateRender && 0 != i.immediateRender, new I(t, e, s)
        }, I.delayedCall = function(t, e, i, s, n) {
            return new I(e, 0, {
                delay: t,
                onComplete: e,
                onCompleteParams: i,
                onCompleteScope: s,
                onReverseComplete: e,
                onReverseCompleteParams: i,
                onReverseCompleteScope: s,
                immediateRender: !1,
                useFrames: n,
                overwrite: 0
            })
        }, I.set = function(t, e) {
            return new I(t, 0, e)
        }, I.getTweensOf = function(t, e) {
            if (null == t) return [];
            t = "string" != typeof t ? t : I.selector(t) || t;
            var i, s, n, r;
            if ((f(t) || E(t)) && "number" != typeof t[0]) {
                for (i = t.length, s = []; --i > -1;) s = s.concat(I.getTweensOf(t[i], e));
                for (i = s.length; --i > -1;)
                    for (r = s[i], n = i; --n > -1;) r === s[n] && s.splice(i, 1)
            } else
                for (s = $(t).concat(), i = s.length; --i > -1;)(s[i]._gc || e && !s[i].isActive()) && s.splice(i, 1);
            return s
        }, I.killTweensOf = I.killDelayedCallsTo = function(t, e, i) {
            "object" == typeof e && (i = e, e = !1);
            for (var s = I.getTweensOf(t, e), n = s.length; --n > -1;) s[n]._kill(i, t)
        };
        var J = v("plugins.TweenPlugin", function(t, e) {
            this._overwriteProps = (t || "").split(","), this._propName = this._overwriteProps[0], this._priority = e || 0, this._super = J.prototype
        }, !0);
        if (r = J.prototype, J.version = "1.10.1", J.API = 2, r._firstPT = null, r._addTween = function(t, e, i, s, n, r) {
                var a, o;
                return null != s && (a = "number" == typeof s || "=" !== s.charAt(1) ? Number(s) - i : parseInt(s.charAt(0) + "1", 10) * Number(s.substr(2))) ? (this._firstPT = o = {
                    _next: this._firstPT,
                    t: t,
                    p: e,
                    s: i,
                    c: a,
                    f: "function" == typeof t[e],
                    n: n || e,
                    r: r
                }, o._next && (o._next._prev = o), o) : void 0
            }, r.setRatio = function(t) {
                for (var e, i = this._firstPT, s = 1e-6; i;) e = i.c * t + i.s, i.r ? e = Math.round(e) : s > e && e > -s && (e = 0), i.f ? i.t[i.p](e) : i.t[i.p] = e, i = i._next
            }, r._kill = function(t) {
                var e, i = this._overwriteProps,
                    s = this._firstPT;
                if (null != t[this._propName]) this._overwriteProps = [];
                else
                    for (e = i.length; --e > -1;) null != t[i[e]] && i.splice(e, 1);
                for (; s;) null != t[s.n] && (s._next && (s._next._prev = s._prev), s._prev ? (s._prev._next = s._next, s._prev = null) : this._firstPT === s && (this._firstPT = s._next)), s = s._next;
                return !1
            }, r._roundProps = function(t, e) {
                for (var i = this._firstPT; i;)(t[this._propName] || null != i.n && t[i.n.split(this._propName + "_").join("")]) && (i.r = e), i = i._next
            }, I._onPluginEvent = function(t, e) {
                var i, s, n, r, a, o = e._firstPT;
                if ("_onInitAllProps" === t) {
                    for (; o;) {
                        for (a = o._next, s = n; s && s.pr > o.pr;) s = s._next;
                        (o._prev = s ? s._prev : r) ? o._prev._next = o: n = o, (o._next = s) ? s._prev = o : r = o, o = a
                    }
                    o = e._firstPT = n
                }
                for (; o;) o.pg && "function" == typeof o.t[t] && o.t[t]() && (i = !0), o = o._next;
                return i
            }, J.activate = function(t) {
                for (var e = t.length; --e > -1;) t[e].API === J.API && (U[(new t[e])._propName] = t[e]);
                return !0
            }, d.plugin = function(t) {
                if (!(t && t.propName && t.init && t.API)) throw "illegal plugin definition.";
                var e, i = t.propName,
                    s = t.priority || 0,
                    n = t.overwriteProps,
                    r = {
                        init: "_onInitTween",
                        set: "setRatio",
                        kill: "_kill",
                        round: "_roundProps",
                        initAll: "_onInitAllProps"
                    },
                    a = v("plugins." + i.charAt(0).toUpperCase() + i.substr(1) + "Plugin", function() {
                        J.call(this, i, s), this._overwriteProps = n || []
                    }, t.global === !0),
                    o = a.prototype = new J(i);
                o.constructor = a, a.API = t.API;
                for (e in r) "function" == typeof t[e] && (o[r[e]] = t[e]);
                return a.version = t.version, J.activate([a]), a
            }, s = t._gsQueue) {
            for (n = 0; s.length > n; n++) s[n]();
            for (r in p) p[r].func || t.console.log("GSAP encountered missing dependency: com.greensock." + r)
        }
        o = !1
    }
})("undefined" != typeof module && module.exports && "undefined" != typeof global ? global : this || window, "TweenLite");


;
/*!
 * VERSION: 1.7.4
 * DATE: 2014-07-17
 * UPDATES AND DOCS AT: http://www.greensock.com
 *
 * @license Copyright (c) 2008-2014, GreenSock. All rights reserved.
 * This work is subject to the terms at http://www.greensock.com/terms_of_use.html or for
 * Club GreenSock members, the software agreement that was issued with your membership.
 *
 * @author: Jack Doyle, jack@greensock.com
 **/
var _gsScope = "undefined" != typeof module && module.exports && "undefined" != typeof global ? global : this || window;
(_gsScope._gsQueue || (_gsScope._gsQueue = [])).push(function() {
    "use strict";
    var t = document.documentElement,
        e = window,
        i = function(i, s) {
            var r = "x" === s ? "Width" : "Height",
                n = "scroll" + r,
                a = "client" + r,
                o = document.body;
            return i === e || i === t || i === o ? Math.max(t[n], o[n]) - (e["inner" + r] || Math.max(t[a], o[a])) : i[n] - i["offset" + r]
        },
        s = _gsScope._gsDefine.plugin({
            propName: "scrollTo",
            API: 2,
            version: "1.7.4",
            init: function(t, s, r) {
                return this._wdw = t === e, this._target = t, this._tween = r, "object" != typeof s && (s = {
                    y: s
                }), this.vars = s, this._autoKill = s.autoKill !== !1, this.x = this.xPrev = this.getX(), this.y = this.yPrev = this.getY(), null != s.x ? (this._addTween(this, "x", this.x, "max" === s.x ? i(t, "x") : s.x, "scrollTo_x", !0), this._overwriteProps.push("scrollTo_x")) : this.skipX = !0, null != s.y ? (this._addTween(this, "y", this.y, "max" === s.y ? i(t, "y") : s.y, "scrollTo_y", !0), this._overwriteProps.push("scrollTo_y")) : this.skipY = !0, !0
            },
            set: function(t) {
                this._super.setRatio.call(this, t);
                var s = this._wdw || !this.skipX ? this.getX() : this.xPrev,
                    r = this._wdw || !this.skipY ? this.getY() : this.yPrev,
                    n = r - this.yPrev,
                    a = s - this.xPrev;
                this._autoKill && (!this.skipX && (a > 7 || -7 > a) && i(this._target, "x") > s && (this.skipX = !0), !this.skipY && (n > 7 || -7 > n) && i(this._target, "y") > r && (this.skipY = !0), this.skipX && this.skipY && (this._tween.kill(), this.vars.onAutoKill && this.vars.onAutoKill.apply(this.vars.onAutoKillScope || this._tween, this.vars.onAutoKillParams || []))), this._wdw ? e.scrollTo(this.skipX ? s : this.x, this.skipY ? r : this.y) : (this.skipY || (this._target.scrollTop = this.y), this.skipX || (this._target.scrollLeft = this.x)), this.xPrev = this.x, this.yPrev = this.y
            }
        }),
        r = s.prototype;
    s.max = i, r.getX = function() {
        return this._wdw ? null != e.pageXOffset ? e.pageXOffset : null != t.scrollLeft ? t.scrollLeft : document.body.scrollLeft : this._target.scrollLeft
    }, r.getY = function() {
        return this._wdw ? null != e.pageYOffset ? e.pageYOffset : null != t.scrollTop ? t.scrollTop : document.body.scrollTop : this._target.scrollTop
    }, r._kill = function(t) {
        return t.scrollTo_x && (this.skipX = !0), t.scrollTo_y && (this.skipY = !0), this._super._kill.call(this, t)
    }
}), _gsScope._gsDefine && _gsScope._gsQueue.pop()();;
$j = jQuery.noConflict();
var $window = $j(window);
var scrollTime = 0.6;
var scrollDistance = 400;
mobile_ie = -1 !== navigator.userAgent.indexOf("IEMobile");

function smoothScrollListener(event) {
    event.preventDefault();
    var delta = event.wheelDelta / 120 || -event.detail / 3;
    var scrollTop = $window.scrollTop();
    var finalScroll = scrollTop - parseInt(delta * scrollDistance);
    TweenLite.to($window, scrollTime, {
        scrollTo: {
            y: finalScroll,
            autoKill: !0
        },
        ease: Power1.easeOut,
        autoKill: !0,
        overwrite: 5
    })
}
if (!$j('html').hasClass('touch') && !mobile_ie) {
    if (window.addEventListener) {
        window.addEventListener('mousewheel', smoothScrollListener, {
            passive: false
        });
        window.addEventListener('DOMMouseScroll', smoothScrollListener, {
            passive: false
        })
    }
};

function bridgeQodeAjaxSubmitCommentForm() {
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
var add_for_admin_bar = jQuery('body').hasClass('admin-bar') ? 32 : 0;
header_height = 160;
var logo_height = 130;
var logo_width = 280;
logo_height = 65;
logo_width = 65;
header_top_height = 33;
var loading_text;
loading_text = 'Loading new posts...';
var finished_text;
finished_text = 'No more posts';
var piechartcolor;
piechartcolor = "#1abc9c";
piechartcolor = "#ffffff";
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
                icon: 'https://bridge374.qodeinteractive.com/wp-content/themes/bridge/img/pin.png',
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
var qode_root = 'https://bridge374.qodeinteractive.com/';
var theme_root = 'https://bridge374.qodeinteractive.com/wp-content/themes/bridge/';
var header_style_admin = "light";
if (typeof no_ajax_obj !== 'undefined') {
    no_ajax_pages = no_ajax_obj.no_ajax_pages;
}