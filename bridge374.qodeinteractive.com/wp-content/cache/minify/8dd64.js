/*!
 * jQuery UI Core 1.11.4
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/category/ui-core/
 */
! function(e) {
    "function" == typeof define && define.amd ? define(["jquery"], e) : e(jQuery)
}(function(a) {
    var e, t, n, i;

    function r(e, t) {
        var n, i, r = e.nodeName.toLowerCase();
        return "area" === r ? (i = (n = e.parentNode).name, !(!e.href || !i || "map" !== n.nodeName.toLowerCase()) && (!!(i = a("img[usemap='#" + i + "']")[0]) && o(i))) : (/^(input|select|textarea|button|object)$/.test(r) ? !e.disabled : "a" === r && e.href || t) && o(e)
    }

    function o(e) {
        return a.expr.filters.visible(e) && !a(e).parents().addBack().filter(function() {
            return "hidden" === a.css(this, "visibility")
        }).length
    }
    a.ui = a.ui || {}, a.extend(a.ui, {
        version: "1.11.4",
        keyCode: {
            BACKSPACE: 8,
            COMMA: 188,
            DELETE: 46,
            DOWN: 40,
            END: 35,
            ENTER: 13,
            ESCAPE: 27,
            HOME: 36,
            LEFT: 37,
            PAGE_DOWN: 34,
            PAGE_UP: 33,
            PERIOD: 190,
            RIGHT: 39,
            SPACE: 32,
            TAB: 9,
            UP: 38
        }
    }), a.fn.extend({
        scrollParent: function(e) {
            var t = this.css("position"),
                n = "absolute" === t,
                i = e ? /(auto|scroll|hidden)/ : /(auto|scroll)/,
                e = this.parents().filter(function() {
                    var e = a(this);
                    return (!n || "static" !== e.css("position")) && i.test(e.css("overflow") + e.css("overflow-y") + e.css("overflow-x"))
                }).eq(0);
            return "fixed" !== t && e.length ? e : a(this[0].ownerDocument || document)
        },
        uniqueId: (e = 0, function() {
            return this.each(function() {
                this.id || (this.id = "ui-id-" + ++e)
            })
        }),
        removeUniqueId: function() {
            return this.each(function() {
                /^ui-id-\d+$/.test(this.id) && a(this).removeAttr("id")
            })
        }
    }), a.extend(a.expr[":"], {
        data: a.expr.createPseudo ? a.expr.createPseudo(function(t) {
            return function(e) {
                return !!a.data(e, t)
            }
        }) : function(e, t, n) {
            return !!a.data(e, n[3])
        },
        focusable: function(e) {
            return r(e, !isNaN(a.attr(e, "tabindex")))
        },
        tabbable: function(e) {
            var t = a.attr(e, "tabindex"),
                n = isNaN(t);
            return (n || 0 <= t) && r(e, !n)
        }
    }), a("<a>").outerWidth(1).jquery || a.each(["Width", "Height"], function(e, n) {
        var r = "Width" === n ? ["Left", "Right"] : ["Top", "Bottom"],
            i = n.toLowerCase(),
            o = {
                innerWidth: a.fn.innerWidth,
                innerHeight: a.fn.innerHeight,
                outerWidth: a.fn.outerWidth,
                outerHeight: a.fn.outerHeight
            };

        function s(e, t, n, i) {
            return a.each(r, function() {
                t -= parseFloat(a.css(e, "padding" + this)) || 0, n && (t -= parseFloat(a.css(e, "border" + this + "Width")) || 0), i && (t -= parseFloat(a.css(e, "margin" + this)) || 0)
            }), t
        }
        a.fn["inner" + n] = function(e) {
            return void 0 === e ? o["inner" + n].call(this) : this.each(function() {
                a(this).css(i, s(this, e) + "px")
            })
        }, a.fn["outer" + n] = function(e, t) {
            return "number" != typeof e ? o["outer" + n].call(this, e) : this.each(function() {
                a(this).css(i, s(this, e, !0, t) + "px")
            })
        }
    }), a.fn.addBack || (a.fn.addBack = function(e) {
        return this.add(null == e ? this.prevObject : this.prevObject.filter(e))
    }), a("<a>").data("a-b", "a").removeData("a-b").data("a-b") && (a.fn.removeData = (t = a.fn.removeData, function(e) {
        return arguments.length ? t.call(this, a.camelCase(e)) : t.call(this)
    })), a.ui.ie = !!/msie [\w.]+/.exec(navigator.userAgent.toLowerCase()), a.fn.extend({
        focus: (i = a.fn.focus, function(t, n) {
            return "number" == typeof t ? this.each(function() {
                var e = this;
                setTimeout(function() {
                    a(e).focus(), n && n.call(e)
                }, t)
            }) : i.apply(this, arguments)
        }),
        disableSelection: (n = "onselectstart" in document.createElement("div") ? "selectstart" : "mousedown", function() {
            return this.bind(n + ".ui-disableSelection", function(e) {
                e.preventDefault()
            })
        }),
        enableSelection: function() {
            return this.unbind(".ui-disableSelection")
        },
        zIndex: function(e) {
            if (void 0 !== e) return this.css("zIndex", e);
            if (this.length)
                for (var t, n, i = a(this[0]); i.length && i[0] !== document;) {
                    if (t = i.css("position"), ("absolute" === t || "relative" === t || "fixed" === t) && (n = parseInt(i.css("zIndex"), 10), !isNaN(n) && 0 !== n)) return n;
                    i = i.parent()
                }
            return 0
        }
    }), a.ui.plugin = {
        add: function(e, t, n) {
            var i, r = a.ui[e].prototype;
            for (i in n) r.plugins[i] = r.plugins[i] || [], r.plugins[i].push([t, n[i]])
        },
        call: function(e, t, n, i) {
            var r, o = e.plugins[t];
            if (o && (i || e.element[0].parentNode && 11 !== e.element[0].parentNode.nodeType))
                for (r = 0; r < o.length; r++) e.options[o[r][0]] && o[r][1].apply(e.element, n)
        }
    }
});;
/*!
 * jQuery UI Widget 1.11.4
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/jQuery.widget/
 */
! function(t) {
    "function" == typeof define && define.amd ? define(["jquery"], t) : t(jQuery)
}(function(d) {
    var s, i = 0,
        a = Array.prototype.slice;
    return d.cleanData = (s = d.cleanData, function(t) {
        for (var e, i, n = 0; null != (i = t[n]); n++) try {
            (e = d._data(i, "events")) && e.remove && d(i).triggerHandler("remove")
        } catch (t) {}
        s(t)
    }), d.widget = function(t, i, e) {
        var n, s, o, r, a = {},
            u = t.split(".")[0];
        return t = t.split(".")[1], e || (e = i, i = d.Widget), d.expr[":"][(n = u + "-" + t).toLowerCase()] = function(t) {
            return !!d.data(t, n)
        }, d[u] = d[u] || {}, s = d[u][t], o = d[u][t] = function(t, e) {
            if (!this._createWidget) return new o(t, e);
            arguments.length && this._createWidget(t, e)
        }, d.extend(o, s, {
            version: e.version,
            _proto: d.extend({}, e),
            _childConstructors: []
        }), (r = new i).options = d.widget.extend({}, r.options), d.each(e, function(e, n) {
            function s() {
                return i.prototype[e].apply(this, arguments)
            }

            function o(t) {
                return i.prototype[e].apply(this, t)
            }
            d.isFunction(n) ? a[e] = function() {
                var t, e = this._super,
                    i = this._superApply;
                return this._super = s, this._superApply = o, t = n.apply(this, arguments), this._super = e, this._superApply = i, t
            } : a[e] = n
        }), o.prototype = d.widget.extend(r, {
            widgetEventPrefix: s && r.widgetEventPrefix || t
        }, a, {
            constructor: o,
            namespace: u,
            widgetName: t,
            widgetFullName: n
        }), s ? (d.each(s._childConstructors, function(t, e) {
            var i = e.prototype;
            d.widget(i.namespace + "." + i.widgetName, o, e._proto)
        }), delete s._childConstructors) : i._childConstructors.push(o), d.widget.bridge(t, o), o
    }, d.widget.extend = function(t) {
        for (var e, i, n = a.call(arguments, 1), s = 0, o = n.length; s < o; s++)
            for (e in n[s]) i = n[s][e], n[s].hasOwnProperty(e) && void 0 !== i && (d.isPlainObject(i) ? t[e] = d.isPlainObject(t[e]) ? d.widget.extend({}, t[e], i) : d.widget.extend({}, i) : t[e] = i);
        return t
    }, d.widget.bridge = function(o, e) {
        var r = e.prototype.widgetFullName || o;
        d.fn[o] = function(i) {
            var t = "string" == typeof i,
                n = a.call(arguments, 1),
                s = this;
            return t ? this.each(function() {
                var t, e = d.data(this, r);
                return "instance" === i ? (s = e, !1) : e ? d.isFunction(e[i]) && "_" !== i.charAt(0) ? (t = e[i].apply(e, n)) !== e && void 0 !== t ? (s = t && t.jquery ? s.pushStack(t.get()) : t, !1) : void 0 : d.error("no such method '" + i + "' for " + o + " widget instance") : d.error("cannot call methods on " + o + " prior to initialization; attempted to call method '" + i + "'")
            }) : (n.length && (i = d.widget.extend.apply(null, [i].concat(n))), this.each(function() {
                var t = d.data(this, r);
                t ? (t.option(i || {}), t._init && t._init()) : d.data(this, r, new e(i, this))
            })), s
        }
    }, d.Widget = function() {}, d.Widget._childConstructors = [], d.Widget.prototype = {
        widgetName: "widget",
        widgetEventPrefix: "",
        defaultElement: "<div>",
        options: {
            disabled: !1,
            create: null
        },
        _createWidget: function(t, e) {
            e = d(e || this.defaultElement || this)[0], this.element = d(e), this.uuid = i++, this.eventNamespace = "." + this.widgetName + this.uuid, this.bindings = d(), this.hoverable = d(), this.focusable = d(), e !== this && (d.data(e, this.widgetFullName, this), this._on(!0, this.element, {
                remove: function(t) {
                    t.target === e && this.destroy()
                }
            }), this.document = d(e.style ? e.ownerDocument : e.document || e), this.window = d(this.document[0].defaultView || this.document[0].parentWindow)), this.options = d.widget.extend({}, this.options, this._getCreateOptions(), t), this._create(), this._trigger("create", null, this._getCreateEventData()), this._init()
        },
        _getCreateOptions: d.noop,
        _getCreateEventData: d.noop,
        _create: d.noop,
        _init: d.noop,
        destroy: function() {
            this._destroy(), this.element.unbind(this.eventNamespace).removeData(this.widgetFullName).removeData(d.camelCase(this.widgetFullName)), this.widget().unbind(this.eventNamespace).removeAttr("aria-disabled").removeClass(this.widgetFullName + "-disabled ui-state-disabled"), this.bindings.unbind(this.eventNamespace), this.hoverable.removeClass("ui-state-hover"), this.focusable.removeClass("ui-state-focus")
        },
        _destroy: d.noop,
        widget: function() {
            return this.element
        },
        option: function(t, e) {
            var i, n, s, o = t;
            if (0 === arguments.length) return d.widget.extend({}, this.options);
            if ("string" == typeof t)
                if (o = {}, t = (i = t.split(".")).shift(), i.length) {
                    for (n = o[t] = d.widget.extend({}, this.options[t]), s = 0; s < i.length - 1; s++) n[i[s]] = n[i[s]] || {}, n = n[i[s]];
                    if (t = i.pop(), 1 === arguments.length) return void 0 === n[t] ? null : n[t];
                    n[t] = e
                } else {
                    if (1 === arguments.length) return void 0 === this.options[t] ? null : this.options[t];
                    o[t] = e
                }
            return this._setOptions(o), this
        },
        _setOptions: function(t) {
            for (var e in t) this._setOption(e, t[e]);
            return this
        },
        _setOption: function(t, e) {
            return this.options[t] = e, "disabled" === t && (this.widget().toggleClass(this.widgetFullName + "-disabled", !!e), e && (this.hoverable.removeClass("ui-state-hover"), this.focusable.removeClass("ui-state-focus"))), this
        },
        enable: function() {
            return this._setOptions({
                disabled: !1
            })
        },
        disable: function() {
            return this._setOptions({
                disabled: !0
            })
        },
        _on: function(s, o, t) {
            var r, a = this;
            "boolean" != typeof s && (t = o, o = s, s = !1), t ? (o = r = d(o), this.bindings = this.bindings.add(o)) : (t = o, o = this.element, r = this.widget()), d.each(t, function(t, e) {
                function i() {
                    if (s || !0 !== a.options.disabled && !d(this).hasClass("ui-state-disabled")) return ("string" == typeof e ? a[e] : e).apply(a, arguments)
                }
                "string" != typeof e && (i.guid = e.guid = e.guid || i.guid || d.guid++);
                var n = t.match(/^([\w:-]*)\s*(.*)$/),
                    t = n[1] + a.eventNamespace,
                    n = n[2];
                n ? r.delegate(n, t, i) : o.bind(t, i)
            })
        },
        _off: function(t, e) {
            e = (e || "").split(" ").join(this.eventNamespace + " ") + this.eventNamespace, t.unbind(e).undelegate(e), this.bindings = d(this.bindings.not(t).get()), this.focusable = d(this.focusable.not(t).get()), this.hoverable = d(this.hoverable.not(t).get())
        },
        _delay: function(t, e) {
            var i = this;
            return setTimeout(function() {
                return ("string" == typeof t ? i[t] : t).apply(i, arguments)
            }, e || 0)
        },
        _hoverable: function(t) {
            this.hoverable = this.hoverable.add(t), this._on(t, {
                mouseenter: function(t) {
                    d(t.currentTarget).addClass("ui-state-hover")
                },
                mouseleave: function(t) {
                    d(t.currentTarget).removeClass("ui-state-hover")
                }
            })
        },
        _focusable: function(t) {
            this.focusable = this.focusable.add(t), this._on(t, {
                focusin: function(t) {
                    d(t.currentTarget).addClass("ui-state-focus")
                },
                focusout: function(t) {
                    d(t.currentTarget).removeClass("ui-state-focus")
                }
            })
        },
        _trigger: function(t, e, i) {
            var n, s, o = this.options[t];
            if (i = i || {}, (e = d.Event(e)).type = (t === this.widgetEventPrefix ? t : this.widgetEventPrefix + t).toLowerCase(), e.target = this.element[0], s = e.originalEvent)
                for (n in s) n in e || (e[n] = s[n]);
            return this.element.trigger(e, i), !(d.isFunction(o) && !1 === o.apply(this.element[0], [e].concat(i)) || e.isDefaultPrevented())
        }
    }, d.each({
        show: "fadeIn",
        hide: "fadeOut"
    }, function(o, r) {
        d.Widget.prototype["_" + o] = function(e, t, i) {
            var n = (t = "string" == typeof t ? {
                    effect: t
                } : t) ? !0 !== t && "number" != typeof t && t.effect || r : o,
                s = !d.isEmptyObject(t = "number" == typeof(t = t || {}) ? {
                    duration: t
                } : t);
            t.complete = i, t.delay && e.delay(t.delay), s && d.effects && d.effects.effect[n] ? e[o](t) : n !== o && e[n] ? e[n](t.duration, t.easing, i) : e.queue(function(t) {
                d(this)[o](), i && i.call(e[0]), t()
            })
        }
    }), d.widget
});;
/*!
 * jQuery UI Accordion 1.11.4
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/accordion/
 */
! function(e) {
    "function" == typeof define && define.amd ? define(["jquery", "./core", "./widget"], e) : e(jQuery)
}(function(h) {
    return h.widget("ui.accordion", {
        version: "1.11.4",
        options: {
            active: 0,
            animate: {},
            collapsible: !1,
            event: "click",
            header: "> li > :first-child,> :not(li):even",
            heightStyle: "auto",
            icons: {
                activeHeader: "ui-icon-triangle-1-s",
                header: "ui-icon-triangle-1-e"
            },
            activate: null,
            beforeActivate: null
        },
        hideProps: {
            borderTopWidth: "hide",
            borderBottomWidth: "hide",
            paddingTop: "hide",
            paddingBottom: "hide",
            height: "hide"
        },
        showProps: {
            borderTopWidth: "show",
            borderBottomWidth: "show",
            paddingTop: "show",
            paddingBottom: "show",
            height: "show"
        },
        _create: function() {
            var e = this.options;
            this.prevShow = this.prevHide = h(), this.element.addClass("ui-accordion ui-widget ui-helper-reset").attr("role", "tablist"), e.collapsible || !1 !== e.active && null != e.active || (e.active = 0), this._processPanels(), e.active < 0 && (e.active += this.headers.length), this._refresh()
        },
        _getCreateEventData: function() {
            return {
                header: this.active,
                panel: this.active.length ? this.active.next() : h()
            }
        },
        _createIcons: function() {
            var e = this.options.icons;
            e && (h("<span>").addClass("ui-accordion-header-icon ui-icon " + e.header).prependTo(this.headers), this.active.children(".ui-accordion-header-icon").removeClass(e.header).addClass(e.activeHeader), this.headers.addClass("ui-accordion-icons"))
        },
        _destroyIcons: function() {
            this.headers.removeClass("ui-accordion-icons").children(".ui-accordion-header-icon").remove()
        },
        _destroy: function() {
            var e;
            this.element.removeClass("ui-accordion ui-widget ui-helper-reset").removeAttr("role"), this.headers.removeClass("ui-accordion-header ui-accordion-header-active ui-state-default ui-corner-all ui-state-active ui-state-disabled ui-corner-top").removeAttr("role").removeAttr("aria-expanded").removeAttr("aria-selected").removeAttr("aria-controls").removeAttr("tabIndex").removeUniqueId(), this._destroyIcons(), e = this.headers.next().removeClass("ui-helper-reset ui-widget-content ui-corner-bottom ui-accordion-content ui-accordion-content-active ui-state-disabled").css("display", "").removeAttr("role").removeAttr("aria-hidden").removeAttr("aria-labelledby").removeUniqueId(), "content" !== this.options.heightStyle && e.css("height", "")
        },
        _setOption: function(e, t) {
            "active" !== e ? ("event" === e && (this.options.event && this._off(this.headers, this.options.event), this._setupEvents(t)), this._super(e, t), "collapsible" !== e || t || !1 !== this.options.active || this._activate(0), "icons" === e && (this._destroyIcons(), t && this._createIcons()), "disabled" === e && (this.element.toggleClass("ui-state-disabled", !!t).attr("aria-disabled", t), this.headers.add(this.headers.next()).toggleClass("ui-state-disabled", !!t))) : this._activate(t)
        },
        _keydown: function(e) {
            if (!e.altKey && !e.ctrlKey) {
                var t = h.ui.keyCode,
                    i = this.headers.length,
                    a = this.headers.index(e.target),
                    s = !1;
                switch (e.keyCode) {
                    case t.RIGHT:
                    case t.DOWN:
                        s = this.headers[(a + 1) % i];
                        break;
                    case t.LEFT:
                    case t.UP:
                        s = this.headers[(a - 1 + i) % i];
                        break;
                    case t.SPACE:
                    case t.ENTER:
                        this._eventHandler(e);
                        break;
                    case t.HOME:
                        s = this.headers[0];
                        break;
                    case t.END:
                        s = this.headers[i - 1]
                }
                s && (h(e.target).attr("tabIndex", -1), h(s).attr("tabIndex", 0), s.focus(), e.preventDefault())
            }
        },
        _panelKeyDown: function(e) {
            e.keyCode === h.ui.keyCode.UP && e.ctrlKey && h(e.currentTarget).prev().focus()
        },
        refresh: function() {
            var e = this.options;
            this._processPanels(), !1 === e.active && !0 === e.collapsible || !this.headers.length ? (e.active = !1, this.active = h()) : !1 === e.active ? this._activate(0) : this.active.length && !h.contains(this.element[0], this.active[0]) ? this.headers.length === this.headers.find(".ui-state-disabled").length ? (e.active = !1, this.active = h()) : this._activate(Math.max(0, e.active - 1)) : e.active = this.headers.index(this.active), this._destroyIcons(), this._refresh()
        },
        _processPanels: function() {
            var e = this.headers,
                t = this.panels;
            this.headers = this.element.find(this.options.header).addClass("ui-accordion-header ui-state-default ui-corner-all"), this.panels = this.headers.next().addClass("ui-accordion-content ui-helper-reset ui-widget-content ui-corner-bottom").filter(":not(.ui-accordion-content-active)").hide(), t && (this._off(e.not(this.headers)), this._off(t.not(this.panels)))
        },
        _refresh: function() {
            var i, e = this.options,
                t = e.heightStyle,
                a = this.element.parent();
            this.active = this._findActive(e.active).addClass("ui-accordion-header-active ui-state-active ui-corner-top").removeClass("ui-corner-all"), this.active.next().addClass("ui-accordion-content-active").show(), this.headers.attr("role", "tab").each(function() {
                var e = h(this),
                    t = e.uniqueId().attr("id"),
                    i = e.next(),
                    a = i.uniqueId().attr("id");
                e.attr("aria-controls", a), i.attr("aria-labelledby", t)
            }).next().attr("role", "tabpanel"), this.headers.not(this.active).attr({
                "aria-selected": "false",
                "aria-expanded": "false",
                tabIndex: -1
            }).next().attr({
                "aria-hidden": "true"
            }).hide(), this.active.length ? this.active.attr({
                "aria-selected": "true",
                "aria-expanded": "true",
                tabIndex: 0
            }).next().attr({
                "aria-hidden": "false"
            }) : this.headers.eq(0).attr("tabIndex", 0), this._createIcons(), this._setupEvents(e.event), "fill" === t ? (i = a.height(), this.element.siblings(":visible").each(function() {
                var e = h(this),
                    t = e.css("position");
                "absolute" !== t && "fixed" !== t && (i -= e.outerHeight(!0))
            }), this.headers.each(function() {
                i -= h(this).outerHeight(!0)
            }), this.headers.next().each(function() {
                h(this).height(Math.max(0, i - h(this).innerHeight() + h(this).height()))
            }).css("overflow", "auto")) : "auto" === t && (i = 0, this.headers.next().each(function() {
                i = Math.max(i, h(this).css("height", "").height())
            }).height(i))
        },
        _activate: function(e) {
            e = this._findActive(e)[0];
            e !== this.active[0] && (e = e || this.active[0], this._eventHandler({
                target: e,
                currentTarget: e,
                preventDefault: h.noop
            }))
        },
        _findActive: function(e) {
            return "number" == typeof e ? this.headers.eq(e) : h()
        },
        _setupEvents: function(e) {
            var i = {
                keydown: "_keydown"
            };
            e && h.each(e.split(" "), function(e, t) {
                i[t] = "_eventHandler"
            }), this._off(this.headers.add(this.headers.next())), this._on(this.headers, i), this._on(this.headers.next(), {
                keydown: "_panelKeyDown"
            }), this._hoverable(this.headers), this._focusable(this.headers)
        },
        _eventHandler: function(e) {
            var t = this.options,
                i = this.active,
                a = h(e.currentTarget),
                s = a[0] === i[0],
                n = s && t.collapsible,
                r = n ? h() : a.next(),
                o = i.next(),
                r = {
                    oldHeader: i,
                    oldPanel: o,
                    newHeader: n ? h() : a,
                    newPanel: r
                };
            e.preventDefault(), s && !t.collapsible || !1 === this._trigger("beforeActivate", e, r) || (t.active = !n && this.headers.index(a), this.active = s ? h() : a, this._toggle(r), i.removeClass("ui-accordion-header-active ui-state-active"), t.icons && i.children(".ui-accordion-header-icon").removeClass(t.icons.activeHeader).addClass(t.icons.header), s || (a.removeClass("ui-corner-all").addClass("ui-accordion-header-active ui-state-active ui-corner-top"), t.icons && a.children(".ui-accordion-header-icon").removeClass(t.icons.header).addClass(t.icons.activeHeader), a.next().addClass("ui-accordion-content-active")))
        },
        _toggle: function(e) {
            var t = e.newPanel,
                i = this.prevShow.length ? this.prevShow : e.oldPanel;
            this.prevShow.add(this.prevHide).stop(!0, !0), this.prevShow = t, this.prevHide = i, this.options.animate ? this._animate(t, i, e) : (i.hide(), t.show(), this._toggleComplete(e)), i.attr({
                "aria-hidden": "true"
            }), i.prev().attr({
                "aria-selected": "false",
                "aria-expanded": "false"
            }), t.length && i.length ? i.prev().attr({
                tabIndex: -1,
                "aria-expanded": "false"
            }) : t.length && this.headers.filter(function() {
                return 0 === parseInt(h(this).attr("tabIndex"), 10)
            }).attr("tabIndex", -1), t.attr("aria-hidden", "false").prev().attr({
                "aria-selected": "true",
                "aria-expanded": "true",
                tabIndex: 0
            })
        },
        _animate: function(e, i, t) {
            var a, s, n, r = this,
                o = 0,
                h = e.css("box-sizing"),
                d = e.length && (!i.length || e.index() < i.index()),
                c = this.options.animate || {},
                l = d && c.down || c,
                d = function() {
                    r._toggleComplete(t)
                };
            return s = (s = "string" == typeof l ? l : s) || l.easing || c.easing, n = (n = "number" == typeof l ? l : n) || l.duration || c.duration, i.length ? e.length ? (a = e.show().outerHeight(), i.animate(this.hideProps, {
                duration: n,
                easing: s,
                step: function(e, t) {
                    t.now = Math.round(e)
                }
            }), void e.hide().animate(this.showProps, {
                duration: n,
                easing: s,
                complete: d,
                step: function(e, t) {
                    t.now = Math.round(e), "height" !== t.prop ? "content-box" === h && (o += t.now) : "content" !== r.options.heightStyle && (t.now = Math.round(a - i.outerHeight() - o), o = 0)
                }
            })) : i.animate(this.hideProps, n, s, d) : e.animate(this.showProps, n, s, d)
        },
        _toggleComplete: function(e) {
            var t = e.oldPanel;
            t.removeClass("ui-accordion-content-active").prev().removeClass("ui-corner-top").addClass("ui-corner-all"), t.length && (t.parent()[0].className = t.parent()[0].className), this._trigger("activate", null, e)
        }
    })
});;
/*!
 * jQuery UI Tabs 1.11.4
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/tabs/
 */
! function(t) {
    "function" == typeof define && define.amd ? define(["jquery", "./core", "./widget"], t) : t(jQuery)
}(function(l) {
    return l.widget("ui.tabs", {
        version: "1.11.4",
        delay: 300,
        options: {
            active: null,
            collapsible: !1,
            event: "click",
            heightStyle: "content",
            hide: null,
            show: null,
            activate: null,
            beforeActivate: null,
            beforeLoad: null,
            load: null
        },
        _isLocal: (a = /#.*$/, function(t) {
            var e = (t = t.cloneNode(!1)).href.replace(a, ""),
                i = location.href.replace(a, "");
            try {
                e = decodeURIComponent(e)
            } catch (t) {}
            try {
                i = decodeURIComponent(i)
            } catch (t) {}
            return 1 < t.hash.length && e === i
        }),
        _create: function() {
            var e = this,
                t = this.options;
            this.running = !1, this.element.addClass("ui-tabs ui-widget ui-widget-content ui-corner-all").toggleClass("ui-tabs-collapsible", t.collapsible), this._processTabs(), t.active = this._initialActive(), l.isArray(t.disabled) && (t.disabled = l.unique(t.disabled.concat(l.map(this.tabs.filter(".ui-state-disabled"), function(t) {
                return e.tabs.index(t)
            }))).sort()), !1 !== this.options.active && this.anchors.length ? this.active = this._findActive(t.active) : this.active = l(), this._refresh(), this.active.length && this.load(t.active)
        },
        _initialActive: function() {
            var i = this.options.active,
                t = this.options.collapsible,
                a = location.hash.substring(1);
            return null === i && (a && this.tabs.each(function(t, e) {
                if (l(e).attr("aria-controls") === a) return i = t, !1
            }), null !== (i = null === i ? this.tabs.index(this.tabs.filter(".ui-tabs-active")) : i) && -1 !== i || (i = !!this.tabs.length && 0)), !1 !== i && -1 === (i = this.tabs.index(this.tabs.eq(i))) && (i = !t && 0), i = !t && !1 === i && this.anchors.length ? 0 : i
        },
        _getCreateEventData: function() {
            return {
                tab: this.active,
                panel: this.active.length ? this._getPanelForTab(this.active) : l()
            }
        },
        _tabKeydown: function(t) {
            var e = l(this.document[0].activeElement).closest("li"),
                i = this.tabs.index(e),
                a = !0;
            if (!this._handlePageNav(t)) {
                switch (t.keyCode) {
                    case l.ui.keyCode.RIGHT:
                    case l.ui.keyCode.DOWN:
                        i++;
                        break;
                    case l.ui.keyCode.UP:
                    case l.ui.keyCode.LEFT:
                        a = !1, i--;
                        break;
                    case l.ui.keyCode.END:
                        i = this.anchors.length - 1;
                        break;
                    case l.ui.keyCode.HOME:
                        i = 0;
                        break;
                    case l.ui.keyCode.SPACE:
                        return t.preventDefault(), clearTimeout(this.activating), void this._activate(i);
                    case l.ui.keyCode.ENTER:
                        return t.preventDefault(), clearTimeout(this.activating), void this._activate(i !== this.options.active && i);
                    default:
                        return
                }
                t.preventDefault(), clearTimeout(this.activating), i = this._focusNextTab(i, a), t.ctrlKey || t.metaKey || (e.attr("aria-selected", "false"), this.tabs.eq(i).attr("aria-selected", "true"), this.activating = this._delay(function() {
                    this.option("active", i)
                }, this.delay))
            }
        },
        _panelKeydown: function(t) {
            this._handlePageNav(t) || t.ctrlKey && t.keyCode === l.ui.keyCode.UP && (t.preventDefault(), this.active.focus())
        },
        _handlePageNav: function(t) {
            return t.altKey && t.keyCode === l.ui.keyCode.PAGE_UP ? (this._activate(this._focusNextTab(this.options.active - 1, !1)), !0) : t.altKey && t.keyCode === l.ui.keyCode.PAGE_DOWN ? (this._activate(this._focusNextTab(this.options.active + 1, !0)), !0) : void 0
        },
        _findNextTab: function(t, e) {
            var i = this.tabs.length - 1;
            for (; - 1 !== l.inArray(t = (t = i < t ? 0 : t) < 0 ? i : t, this.options.disabled);) t = e ? t + 1 : t - 1;
            return t
        },
        _focusNextTab: function(t, e) {
            return t = this._findNextTab(t, e), this.tabs.eq(t).focus(), t
        },
        _setOption: function(t, e) {
            "active" !== t ? "disabled" !== t ? (this._super(t, e), "collapsible" === t && (this.element.toggleClass("ui-tabs-collapsible", e), e || !1 !== this.options.active || this._activate(0)), "event" === t && this._setupEvents(e), "heightStyle" === t && this._setupHeightStyle(e)) : this._setupDisabled(e) : this._activate(e)
        },
        _sanitizeSelector: function(t) {
            return t ? t.replace(/[!"$%&'()*+,.\/:;<=>?@\[\]\^`{|}~]/g, "\\$&") : ""
        },
        refresh: function() {
            var t = this.options,
                e = this.tablist.children(":has(a[href])");
            t.disabled = l.map(e.filter(".ui-state-disabled"), function(t) {
                return e.index(t)
            }), this._processTabs(), !1 !== t.active && this.anchors.length ? this.active.length && !l.contains(this.tablist[0], this.active[0]) ? this.tabs.length === t.disabled.length ? (t.active = !1, this.active = l()) : this._activate(this._findNextTab(Math.max(0, t.active - 1), !1)) : t.active = this.tabs.index(this.active) : (t.active = !1, this.active = l()), this._refresh()
        },
        _refresh: function() {
            this._setupDisabled(this.options.disabled), this._setupEvents(this.options.event), this._setupHeightStyle(this.options.heightStyle), this.tabs.not(this.active).attr({
                "aria-selected": "false",
                "aria-expanded": "false",
                tabIndex: -1
            }), this.panels.not(this._getPanelForTab(this.active)).hide().attr({
                "aria-hidden": "true"
            }), this.active.length ? (this.active.addClass("ui-tabs-active ui-state-active").attr({
                "aria-selected": "true",
                "aria-expanded": "true",
                tabIndex: 0
            }), this._getPanelForTab(this.active).show().attr({
                "aria-hidden": "false"
            })) : this.tabs.eq(0).attr("tabIndex", 0)
        },
        _processTabs: function() {
            var o = this,
                t = this.tabs,
                e = this.anchors,
                i = this.panels;
            this.tablist = this._getList().addClass("ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all").attr("role", "tablist").delegate("> li", "mousedown" + this.eventNamespace, function(t) {
                l(this).is(".ui-state-disabled") && t.preventDefault()
            }).delegate(".ui-tabs-anchor", "focus" + this.eventNamespace, function() {
                l(this).closest("li").is(".ui-state-disabled") && this.blur()
            }), this.tabs = this.tablist.find("> li:has(a[href])").addClass("ui-state-default ui-corner-top").attr({
                role: "tab",
                tabIndex: -1
            }), this.anchors = this.tabs.map(function() {
                return l("a", this)[0]
            }).addClass("ui-tabs-anchor").attr({
                role: "presentation",
                tabIndex: -1
            }), this.panels = l(), this.anchors.each(function(t, e) {
                var i, a, s, n = l(e).uniqueId().attr("id"),
                    r = l(e).closest("li"),
                    h = r.attr("aria-controls");
                o._isLocal(e) ? (s = (i = e.hash).substring(1), a = o.element.find(o._sanitizeSelector(i))) : (s = r.attr("aria-controls") || l({}).uniqueId()[0].id, (a = o.element.find(i = "#" + s)).length || (a = o._createPanel(s)).insertAfter(o.panels[t - 1] || o.tablist), a.attr("aria-live", "polite")), a.length && (o.panels = o.panels.add(a)), h && r.data("ui-tabs-aria-controls", h), r.attr({
                    "aria-controls": s,
                    "aria-labelledby": n
                }), a.attr("aria-labelledby", n)
            }), this.panels.addClass("ui-tabs-panel ui-widget-content ui-corner-bottom").attr("role", "tabpanel"), t && (this._off(t.not(this.tabs)), this._off(e.not(this.anchors)), this._off(i.not(this.panels)))
        },
        _getList: function() {
            return this.tablist || this.element.find("ol,ul").eq(0)
        },
        _createPanel: function(t) {
            return l("<div>").attr("id", t).addClass("ui-tabs-panel ui-widget-content ui-corner-bottom").data("ui-tabs-destroy", !0)
        },
        _setupDisabled: function(t) {
            l.isArray(t) && (t.length ? t.length === this.anchors.length && (t = !0) : t = !1);
            for (var e, i = 0; e = this.tabs[i]; i++) !0 === t || -1 !== l.inArray(i, t) ? l(e).addClass("ui-state-disabled").attr("aria-disabled", "true") : l(e).removeClass("ui-state-disabled").removeAttr("aria-disabled");
            this.options.disabled = t
        },
        _setupEvents: function(t) {
            var i = {};
            t && l.each(t.split(" "), function(t, e) {
                i[e] = "_eventHandler"
            }), this._off(this.anchors.add(this.tabs).add(this.panels)), this._on(!0, this.anchors, {
                click: function(t) {
                    t.preventDefault()
                }
            }), this._on(this.anchors, i), this._on(this.tabs, {
                keydown: "_tabKeydown"
            }), this._on(this.panels, {
                keydown: "_panelKeydown"
            }), this._focusable(this.tabs), this._hoverable(this.tabs)
        },
        _setupHeightStyle: function(t) {
            var i, e = this.element.parent();
            "fill" === t ? (i = e.height(), i -= this.element.outerHeight() - this.element.height(), this.element.siblings(":visible").each(function() {
                var t = l(this),
                    e = t.css("position");
                "absolute" !== e && "fixed" !== e && (i -= t.outerHeight(!0))
            }), this.element.children().not(this.panels).each(function() {
                i -= l(this).outerHeight(!0)
            }), this.panels.each(function() {
                l(this).height(Math.max(0, i - l(this).innerHeight() + l(this).height()))
            }).css("overflow", "auto")) : "auto" === t && (i = 0, this.panels.each(function() {
                i = Math.max(i, l(this).height("").height())
            }).height(i))
        },
        _eventHandler: function(t) {
            var e = this.options,
                i = this.active,
                a = l(t.currentTarget).closest("li"),
                s = a[0] === i[0],
                n = s && e.collapsible,
                r = n ? l() : this._getPanelForTab(a),
                h = i.length ? this._getPanelForTab(i) : l(),
                i = {
                    oldTab: i,
                    oldPanel: h,
                    newTab: n ? l() : a,
                    newPanel: r
                };
            t.preventDefault(), a.hasClass("ui-state-disabled") || a.hasClass("ui-tabs-loading") || this.running || s && !e.collapsible || !1 === this._trigger("beforeActivate", t, i) || (e.active = !n && this.tabs.index(a), this.active = s ? l() : a, this.xhr && this.xhr.abort(), h.length || r.length || l.error("jQuery UI Tabs: Mismatching fragment identifier."), r.length && this.load(this.tabs.index(a), t), this._toggle(t, i))
        },
        _toggle: function(t, e) {
            var i = this,
                a = e.newPanel,
                s = e.oldPanel;

            function n() {
                i.running = !1, i._trigger("activate", t, e)
            }

            function r() {
                e.newTab.closest("li").addClass("ui-tabs-active ui-state-active"), a.length && i.options.show ? i._show(a, i.options.show, n) : (a.show(), n())
            }
            this.running = !0, s.length && this.options.hide ? this._hide(s, this.options.hide, function() {
                e.oldTab.closest("li").removeClass("ui-tabs-active ui-state-active"), r()
            }) : (e.oldTab.closest("li").removeClass("ui-tabs-active ui-state-active"), s.hide(), r()), s.attr("aria-hidden", "true"), e.oldTab.attr({
                "aria-selected": "false",
                "aria-expanded": "false"
            }), a.length && s.length ? e.oldTab.attr("tabIndex", -1) : a.length && this.tabs.filter(function() {
                return 0 === l(this).attr("tabIndex")
            }).attr("tabIndex", -1), a.attr("aria-hidden", "false"), e.newTab.attr({
                "aria-selected": "true",
                "aria-expanded": "true",
                tabIndex: 0
            })
        },
        _activate: function(t) {
            var t = this._findActive(t);
            t[0] !== this.active[0] && (t = (t = !t.length ? this.active : t).find(".ui-tabs-anchor")[0], this._eventHandler({
                target: t,
                currentTarget: t,
                preventDefault: l.noop
            }))
        },
        _findActive: function(t) {
            return !1 === t ? l() : this.tabs.eq(t)
        },
        _getIndex: function(t) {
            return t = "string" == typeof t ? this.anchors.index(this.anchors.filter("[href$='" + t + "']")) : t
        },
        _destroy: function() {
            this.xhr && this.xhr.abort(), this.element.removeClass("ui-tabs ui-widget ui-widget-content ui-corner-all ui-tabs-collapsible"), this.tablist.removeClass("ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all").removeAttr("role"), this.anchors.removeClass("ui-tabs-anchor").removeAttr("role").removeAttr("tabIndex").removeUniqueId(), this.tablist.unbind(this.eventNamespace), this.tabs.add(this.panels).each(function() {
                l.data(this, "ui-tabs-destroy") ? l(this).remove() : l(this).removeClass("ui-state-default ui-state-active ui-state-disabled ui-corner-top ui-corner-bottom ui-widget-content ui-tabs-active ui-tabs-panel").removeAttr("tabIndex").removeAttr("aria-live").removeAttr("aria-busy").removeAttr("aria-selected").removeAttr("aria-labelledby").removeAttr("aria-hidden").removeAttr("aria-expanded").removeAttr("role")
            }), this.tabs.each(function() {
                var t = l(this),
                    e = t.data("ui-tabs-aria-controls");
                e ? t.attr("aria-controls", e).removeData("ui-tabs-aria-controls") : t.removeAttr("aria-controls")
            }), this.panels.show(), "content" !== this.options.heightStyle && this.panels.css("height", "")
        },
        enable: function(i) {
            var t = this.options.disabled;
            !1 !== t && (t = void 0 !== i && (i = this._getIndex(i), l.isArray(t) ? l.map(t, function(t) {
                return t !== i ? t : null
            }) : l.map(this.tabs, function(t, e) {
                return e !== i ? e : null
            })), this._setupDisabled(t))
        },
        disable: function(t) {
            var e = this.options.disabled;
            if (!0 !== e) {
                if (void 0 === t) e = !0;
                else {
                    if (t = this._getIndex(t), -1 !== l.inArray(t, e)) return;
                    e = l.isArray(e) ? l.merge([t], e).sort() : [t]
                }
                this._setupDisabled(e)
            }
        },
        load: function(t, a) {
            t = this._getIndex(t);

            function s(t, e) {
                "abort" === e && n.panels.stop(!1, !0), i.removeClass("ui-tabs-loading"), r.removeAttr("aria-busy"), t === n.xhr && delete n.xhr
            }
            var n = this,
                i = this.tabs.eq(t),
                t = i.find(".ui-tabs-anchor"),
                r = this._getPanelForTab(i),
                h = {
                    tab: i,
                    panel: r
                };
            this._isLocal(t[0]) || (this.xhr = l.ajax(this._ajaxSettings(t, a, h)), this.xhr && "canceled" !== this.xhr.statusText && (i.addClass("ui-tabs-loading"), r.attr("aria-busy", "true"), this.xhr.done(function(t, e, i) {
                setTimeout(function() {
                    r.html(t), n._trigger("load", a, h), s(i, e)
                }, 1)
            }).fail(function(t, e) {
                setTimeout(function() {
                    s(t, e)
                }, 1)
            })))
        },
        _ajaxSettings: function(t, i, a) {
            var s = this;
            return {
                url: t.attr("href"),
                beforeSend: function(t, e) {
                    return s._trigger("beforeLoad", i, l.extend({
                        jqXHR: t,
                        ajaxSettings: e
                    }, a))
                }
            }
        },
        _getPanelForTab: function(t) {
            t = l(t).attr("aria-controls");
            return this.element.find(this._sanitizeSelector("#" + t))
        }
    });
    var a
});;
(function($, window, document, undefined) {
    'use strict';
    var pluginName = 'doubleTapToGo',
        defaults = {
            automatic: true,
            selectorClass: 'doubletap',
            selectorChain: 'li:has(ul)'
        };

    function DoubleTapToGo(element, options) {
        this.element = element;
        this.settings = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.init()
    }
    $.extend(DoubleTapToGo.prototype, {
        preventClick: false,
        currentTap: $(),
        init: function() {
            $(this.element).on('touchstart', '.' + this.settings.selectorClass, this._tap.bind(this)).on('click', '.' + this.settings.selectorClass, this._click.bind(this)).on('remove', this._destroy.bind(this));
            this._addSelectors()
        },
        _addSelectors: function() {
            if (this.settings.automatic !== true) {
                return
            }
            $(this.element).find(this.settings.selectorChain).addClass(this.settings.selectorClass)
        },
        _click: function(event) {
            if (this.preventClick) {
                event.preventDefault()
            } else {
                this.currentTap = $()
            }
        },
        _tap: function(event) {
            var $target = $(event.target).closest('li');
            if (!$target.hasClass(this.settings.selectorClass)) {
                this.preventClick = false;
                return
            }
            if ($target.get(0) === this.currentTap.get(0)) {
                this.preventClick = false;
                return
            }
            this.preventClick = true;
            this.currentTap = $target;
            event.stopPropagation()
        },
        _destroy: function() {
            $(this.element).off()
        },
        reset: function() {
            this.currentTap = $()
        }
    });
    $.fn[pluginName] = function(options) {
        var args = arguments,
            returns;
        if (options === undefined || typeof options === 'object') {
            return this.each(function() {
                if (!$.data(this, pluginName)) {
                    $.data(this, pluginName, new DoubleTapToGo(this, options))
                }
            })
        } else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {
            this.each(function() {
                var instance = $.data(this, pluginName),
                    methodName = (options === 'destroy' ? '_destroy' : options);
                if (instance instanceof DoubleTapToGo && typeof instance[methodName] === 'function') {
                    returns = instance[methodName].apply(instance, Array.prototype.slice.call(args, 1))
                }
                if (options === 'destroy') {
                    $.data(this, pluginName, null)
                }
            });
            return returns !== undefined ? returns : this
        }
    }
})(jQuery, window, document);;
/* Modernizr 2.6.2 (Custom Build) | MIT & BSD
 * Build: http://modernizr.com/download/#-fontface-backgroundsize-borderimage-borderradius-boxshadow-flexbox-hsla-multiplebgs-opacity-rgba-textshadow-cssanimations-csscolumns-generatedcontent-cssgradients-cssreflections-csstransforms-csstransforms3d-csstransitions-applicationcache-canvas-canvastext-draganddrop-hashchange-history-audio-video-indexeddb-input-inputtypes-localstorage-postmessage-sessionstorage-websockets-websqldatabase-webworkers-geolocation-inlinesvg-smil-svg-svgclippaths-touch-webgl-shiv-mq-cssclasses-addtest-prefixed-teststyles-testprop-testallprops-hasevent-prefixes-domprefixes-load
 */
;
window.Modernizr = function(a, b, c) {
        function D(a) {
            j.cssText = a
        }

        function E(a, b) {
            return D(n.join(a + ";") + (b || ""))
        }

        function F(a, b) {
            return typeof a === b
        }

        function G(a, b) {
            return !!~("" + a).indexOf(b)
        }

        function H(a, b) {
            for (var d in a) {
                var e = a[d];
                if (!G(e, "-") && j[e] !== c) return b == "pfx" ? e : !0
            }
            return !1
        }

        function I(a, b, d) {
            for (var e in a) {
                var f = b[a[e]];
                if (f !== c) return d === !1 ? a[e] : F(f, "function") ? f.bind(d || b) : f
            }
            return !1
        }

        function J(a, b, c) {
            var d = a.charAt(0).toUpperCase() + a.slice(1),
                e = (a + " " + p.join(d + " ") + d).split(" ");
            return F(b, "string") || F(b, "undefined") ? H(e, b) : (e = (a + " " + q.join(d + " ") + d).split(" "), I(e, b, c))
        }

        function K() {
            e.input = function(c) {
                for (var d = 0, e = c.length; d < e; d++) u[c[d]] = c[d] in k;
                return u.list && (u.list = !!b.createElement("datalist") && !!a.HTMLDataListElement), u
            }("autocomplete autofocus list placeholder max min multiple pattern required step".split(" ")), e.inputtypes = function(a) {
                for (var d = 0, e, f, h, i = a.length; d < i; d++) k.setAttribute("type", f = a[d]), e = k.type !== "text", e && (k.value = l, k.style.cssText = "position:absolute;visibility:hidden;", /^range$/.test(f) && k.style.WebkitAppearance !== c ? (g.appendChild(k), h = b.defaultView, e = h.getComputedStyle && h.getComputedStyle(k, null).WebkitAppearance !== "textfield" && k.offsetHeight !== 0, g.removeChild(k)) : /^(search|tel)$/.test(f) || (/^(url|email)$/.test(f) ? e = k.checkValidity && k.checkValidity() === !1 : e = k.value != l)), t[a[d]] = !!e;
                return t
            }("search tel url email datetime date month week time datetime-local number range color".split(" "))
        }
        var d = "2.6.2",
            e = {},
            f = !0,
            g = b.documentElement,
            h = "modernizr",
            i = b.createElement(h),
            j = i.style,
            k = b.createElement("input"),
            l = ":)",
            m = {}.toString,
            n = " -webkit- -moz- -o- -ms- ".split(" "),
            o = "Webkit Moz O ms",
            p = o.split(" "),
            q = o.toLowerCase().split(" "),
            r = {
                svg: "http://www.w3.org/2000/svg"
            },
            s = {},
            t = {},
            u = {},
            v = [],
            w = v.slice,
            x, y = function(a, c, d, e) {
                var f, i, j, k, l = b.createElement("div"),
                    m = b.body,
                    n = m || b.createElement("body");
                if (parseInt(d, 10))
                    while (d--) j = b.createElement("div"), j.id = e ? e[d] : h + (d + 1), l.appendChild(j);
                return f = ["&#173;", '<style id="s', h, '">', a, "</style>"].join(""), l.id = h, (m ? l : n).innerHTML += f, n.appendChild(l), m || (n.style.background = "", n.style.overflow = "hidden", k = g.style.overflow, g.style.overflow = "hidden", g.appendChild(n)), i = c(l, a), m ? l.parentNode.removeChild(l) : (n.parentNode.removeChild(n), g.style.overflow = k), !!i
            },
            z = function(b) {
                var c = a.matchMedia || a.msMatchMedia;
                if (c) return c(b).matches;
                var d;
                return y("@media " + b + " { #" + h + " { position: absolute; } }", function(b) {
                    d = (a.getComputedStyle ? getComputedStyle(b, null) : b.currentStyle)["position"] == "absolute"
                }), d
            },
            A = function() {
                function d(d, e) {
                    e = e || b.createElement(a[d] || "div"), d = "on" + d;
                    var f = d in e;
                    return f || (e.setAttribute || (e = b.createElement("div")), e.setAttribute && e.removeAttribute && (e.setAttribute(d, ""), f = F(e[d], "function"), F(e[d], "undefined") || (e[d] = c), e.removeAttribute(d))), e = null, f
                }
                var a = {
                    select: "input",
                    change: "input",
                    submit: "form",
                    reset: "form",
                    error: "img",
                    load: "img",
                    abort: "img"
                };
                return d
            }(),
            B = {}.hasOwnProperty,
            C;
        !F(B, "undefined") && !F(B.call, "undefined") ? C = function(a, b) {
            return B.call(a, b)
        } : C = function(a, b) {
            return b in a && F(a.constructor.prototype[b], "undefined")
        }, Function.prototype.bind || (Function.prototype.bind = function(b) {
            var c = this;
            if (typeof c != "function") throw new TypeError;
            var d = w.call(arguments, 1),
                e = function() {
                    if (this instanceof e) {
                        var a = function() {};
                        a.prototype = c.prototype;
                        var f = new a,
                            g = c.apply(f, d.concat(w.call(arguments)));
                        return Object(g) === g ? g : f
                    }
                    return c.apply(b, d.concat(w.call(arguments)))
                };
            return e
        }), s.flexbox = function() {
            return J("flexWrap")
        }, s.canvas = function() {
            var a = b.createElement("canvas");
            return !!a.getContext && !!a.getContext("2d")
        }, s.canvastext = function() {
            return !!e.canvas && !!F(b.createElement("canvas").getContext("2d").fillText, "function")
        }, s.webgl = function() {
            return !!a.WebGLRenderingContext
        }, s.touch = function() {
            var c;
            return "ontouchstart" in a || a.DocumentTouch && b instanceof DocumentTouch ? c = !0 : y(["@media (", n.join("touch-enabled),("), h, ")", "{#modernizr{top:9px;position:absolute}}"].join(""), function(a) {
                c = a.offsetTop === 9
            }), c
        }, s.geolocation = function() {
            return "geolocation" in navigator
        }, s.postmessage = function() {
            return !!a.postMessage
        }, s.websqldatabase = function() {
            return !!a.openDatabase
        }, s.indexedDB = function() {
            return !!J("indexedDB", a)
        }, s.hashchange = function() {
            return A("hashchange", a) && (b.documentMode === c || b.documentMode > 7)
        }, s.history = function() {
            return !!a.history && !!history.pushState
        }, s.draganddrop = function() {
            var a = b.createElement("div");
            return "draggable" in a || "ondragstart" in a && "ondrop" in a
        }, s.websockets = function() {
            return "WebSocket" in a || "MozWebSocket" in a
        }, s.rgba = function() {
            return D("background-color:rgba(150,255,150,.5)"), G(j.backgroundColor, "rgba")
        }, s.hsla = function() {
            return D("background-color:hsla(120,40%,100%,.5)"), G(j.backgroundColor, "rgba") || G(j.backgroundColor, "hsla")
        }, s.multiplebgs = function() {
            return D("background:url(https://),url(https://),red url(https://)"), /(url\s*\(.*?){3}/.test(j.background)
        }, s.backgroundsize = function() {
            return J("backgroundSize")
        }, s.borderimage = function() {
            return J("borderImage")
        }, s.borderradius = function() {
            return J("borderRadius")
        }, s.boxshadow = function() {
            return J("boxShadow")
        }, s.textshadow = function() {
            return b.createElement("div").style.textShadow === ""
        }, s.opacity = function() {
            return E("opacity:.55"), /^0.55$/.test(j.opacity)
        }, s.cssanimations = function() {
            return J("animationName")
        }, s.csscolumns = function() {
            return J("columnCount")
        }, s.cssgradients = function() {
            var a = "background-image:",
                b = "gradient(linear,left top,right bottom,from(#9f9),to(white));",
                c = "linear-gradient(left top,#9f9, white);";
            return D((a + "-webkit- ".split(" ").join(b + a) + n.join(c + a)).slice(0, -a.length)), G(j.backgroundImage, "gradient")
        }, s.cssreflections = function() {
            return J("boxReflect")
        }, s.csstransforms = function() {
            return !!J("transform")
        }, s.csstransforms3d = function() {
            var a = !!J("perspective");
            return a && "webkitPerspective" in g.style && y("@media (transform-3d),(-webkit-transform-3d){#modernizr{left:9px;position:absolute;height:3px;}}", function(b, c) {
                a = b.offsetLeft === 9 && b.offsetHeight === 3
            }), a
        }, s.csstransitions = function() {
            return J("transition")
        }, s.fontface = function() {
            var a;
            return y('@font-face {font-family:"font";src:url("https://")}', function(c, d) {
                var e = b.getElementById("smodernizr"),
                    f = e.sheet || e.styleSheet,
                    g = f ? f.cssRules && f.cssRules[0] ? f.cssRules[0].cssText : f.cssText || "" : "";
                a = /src/i.test(g) && g.indexOf(d.split(" ")[0]) === 0
            }), a
        }, s.generatedcontent = function() {
            var a;
            return y(["#", h, "{font:0/0 a}#", h, ':after{content:"', l, '";visibility:hidden;font:3px/1 a}'].join(""), function(b) {
                a = b.offsetHeight >= 3
            }), a
        }, s.video = function() {
            var a = b.createElement("video"),
                c = !1;
            try {
                if (c = !!a.canPlayType) c = new Boolean(c), c.ogg = a.canPlayType('video/ogg; codecs="theora"').replace(/^no$/, ""), c.h264 = a.canPlayType('video/mp4; codecs="avc1.42E01E"').replace(/^no$/, ""), c.webm = a.canPlayType('video/webm; codecs="vp8, vorbis"').replace(/^no$/, "")
            } catch (d) {}
            return c
        }, s.audio = function() {
            var a = b.createElement("audio"),
                c = !1;
            try {
                if (c = !!a.canPlayType) c = new Boolean(c), c.ogg = a.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, ""), c.mp3 = a.canPlayType("audio/mpeg;").replace(/^no$/, ""), c.wav = a.canPlayType('audio/wav; codecs="1"').replace(/^no$/, ""), c.m4a = (a.canPlayType("audio/x-m4a;") || a.canPlayType("audio/aac;")).replace(/^no$/, "")
            } catch (d) {}
            return c
        }, s.localstorage = function() {
            try {
                return localStorage.setItem(h, h), localStorage.removeItem(h), !0
            } catch (a) {
                return !1
            }
        }, s.sessionstorage = function() {
            try {
                return sessionStorage.setItem(h, h), sessionStorage.removeItem(h), !0
            } catch (a) {
                return !1
            }
        }, s.webworkers = function() {
            return !!a.Worker
        }, s.applicationcache = function() {
            return !!a.applicationCache
        }, s.svg = function() {
            return !!b.createElementNS && !!b.createElementNS(r.svg, "svg").createSVGRect
        }, s.inlinesvg = function() {
            var a = b.createElement("div");
            return a.innerHTML = "<svg/>", (a.firstChild && a.firstChild.namespaceURI) == r.svg
        }, s.smil = function() {
            return !!b.createElementNS && /SVGAnimate/.test(m.call(b.createElementNS(r.svg, "animate")))
        }, s.svgclippaths = function() {
            return !!b.createElementNS && /SVGClipPath/.test(m.call(b.createElementNS(r.svg, "clipPath")))
        };
        for (var L in s) C(s, L) && (x = L.toLowerCase(), e[x] = s[L](), v.push((e[x] ? "" : "no-") + x));
        return e.input || K(), e.addTest = function(a, b) {
                if (typeof a == "object")
                    for (var d in a) C(a, d) && e.addTest(d, a[d]);
                else {
                    a = a.toLowerCase();
                    if (e[a] !== c) return e;
                    b = typeof b == "function" ? b() : b, typeof f != "undefined" && f && (g.className += " " + (b ? "" : "no-") + a), e[a] = b
                }
                return e
            }, D(""), i = k = null,
            function(a, b) {
                function k(a, b) {
                    var c = a.createElement("p"),
                        d = a.getElementsByTagName("head")[0] || a.documentElement;
                    return c.innerHTML = "x<style>" + b + "</style>", d.insertBefore(c.lastChild, d.firstChild)
                }

                function l() {
                    var a = r.elements;
                    return typeof a == "string" ? a.split(" ") : a
                }

                function m(a) {
                    var b = i[a[g]];
                    return b || (b = {}, h++, a[g] = h, i[h] = b), b
                }

                function n(a, c, f) {
                    c || (c = b);
                    if (j) return c.createElement(a);
                    f || (f = m(c));
                    var g;
                    return f.cache[a] ? g = f.cache[a].cloneNode() : e.test(a) ? g = (f.cache[a] = f.createElem(a)).cloneNode() : g = f.createElem(a), g.canHaveChildren && !d.test(a) ? f.frag.appendChild(g) : g
                }

                function o(a, c) {
                    a || (a = b);
                    if (j) return a.createDocumentFragment();
                    c = c || m(a);
                    var d = c.frag.cloneNode(),
                        e = 0,
                        f = l(),
                        g = f.length;
                    for (; e < g; e++) d.createElement(f[e]);
                    return d
                }

                function p(a, b) {
                    b.cache || (b.cache = {}, b.createElem = a.createElement, b.createFrag = a.createDocumentFragment, b.frag = b.createFrag()), a.createElement = function(c) {
                        return r.shivMethods ? n(c, a, b) : b.createElem(c)
                    }, a.createDocumentFragment = Function("h,f", "return function(){var n=f.cloneNode(),c=n.createElement;h.shivMethods&&(" + l().join().replace(/\w+/g, function(a) {
                        return b.createElem(a), b.frag.createElement(a), 'c("' + a + '")'
                    }) + ");return n}")(r, b.frag)
                }

                function q(a) {
                    a || (a = b);
                    var c = m(a);
                    return r.shivCSS && !f && !c.hasCSS && (c.hasCSS = !!k(a, "article,aside,figcaption,figure,footer,header,hgroup,nav,section{display:block}mark{background:#FF0;color:#000}")), j || p(a, c), a
                }
                var c = a.html5 || {},
                    d = /^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i,
                    e = /^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i,
                    f, g = "_html5shiv",
                    h = 0,
                    i = {},
                    j;
                (function() {
                    try {
                        var a = b.createElement("a");
                        a.innerHTML = "<xyz></xyz>", f = "hidden" in a, j = a.childNodes.length == 1 || function() {
                            b.createElement("a");
                            var a = b.createDocumentFragment();
                            return typeof a.cloneNode == "undefined" || typeof a.createDocumentFragment == "undefined" || typeof a.createElement == "undefined"
                        }()
                    } catch (c) {
                        f = !0, j = !0
                    }
                })();
                var r = {
                    elements: c.elements || "abbr article aside audio bdi canvas data datalist details figcaption figure footer header hgroup mark meter nav output progress section summary time video",
                    shivCSS: c.shivCSS !== !1,
                    supportsUnknownElements: j,
                    shivMethods: c.shivMethods !== !1,
                    type: "default",
                    shivDocument: q,
                    createElement: n,
                    createDocumentFragment: o
                };
                a.html5 = r, q(b)
            }(this, b), e._version = d, e._prefixes = n, e._domPrefixes = q, e._cssomPrefixes = p, e.mq = z, e.hasEvent = A, e.testProp = function(a) {
                return H([a])
            }, e.testAllProps = J, e.testStyles = y, e.prefixed = function(a, b, c) {
                return b ? J(a, b, c) : J(a, "pfx")
            }, g.className = g.className.replace(/(^|\s)no-js(\s|$)/, "$1$2") + (f ? " js " + v.join(" ") : ""), e
    }(this, this.document),
    function(a, b, c) {
        function d(a) {
            return "[object Function]" == o.call(a)
        }

        function e(a) {
            return "string" == typeof a
        }

        function f() {}

        function g(a) {
            return !a || "loaded" == a || "complete" == a || "uninitialized" == a
        }

        function h() {
            var a = p.shift();
            q = 1, a ? a.t ? m(function() {
                ("c" == a.t ? B.injectCss : B.injectJs)(a.s, 0, a.a, a.x, a.e, 1)
            }, 0) : (a(), h()) : q = 0
        }

        function i(a, c, d, e, f, i, j) {
            function k(b) {
                if (!o && g(l.readyState) && (u.r = o = 1, !q && h(), l.onload = l.onreadystatechange = null, b)) {
                    "img" != a && m(function() {
                        t.removeChild(l)
                    }, 50);
                    for (var d in y[c]) y[c].hasOwnProperty(d) && y[c][d].onload()
                }
            }
            var j = j || B.errorTimeout,
                l = b.createElement(a),
                o = 0,
                r = 0,
                u = {
                    t: d,
                    s: c,
                    e: f,
                    a: i,
                    x: j
                };
            1 === y[c] && (r = 1, y[c] = []), "object" == a ? l.data = c : (l.src = c, l.type = a), l.width = l.height = "0", l.onerror = l.onload = l.onreadystatechange = function() {
                k.call(this, r)
            }, p.splice(e, 0, u), "img" != a && (r || 2 === y[c] ? (t.insertBefore(l, s ? null : n), m(k, j)) : y[c].push(l))
        }

        function j(a, b, c, d, f) {
            return q = 0, b = b || "j", e(a) ? i("c" == b ? v : u, a, b, this.i++, c, d, f) : (p.splice(this.i++, 0, a), 1 == p.length && h()), this
        }

        function k() {
            var a = B;
            return a.loader = {
                load: j,
                i: 0
            }, a
        }
        var l = b.documentElement,
            m = a.setTimeout,
            n = b.getElementsByTagName("script")[0],
            o = {}.toString,
            p = [],
            q = 0,
            r = "MozAppearance" in l.style,
            s = r && !!b.createRange().compareNode,
            t = s ? l : n.parentNode,
            l = a.opera && "[object Opera]" == o.call(a.opera),
            l = !!b.attachEvent && !l,
            u = r ? "object" : l ? "script" : "img",
            v = l ? "script" : u,
            w = Array.isArray || function(a) {
                return "[object Array]" == o.call(a)
            },
            x = [],
            y = {},
            z = {
                timeout: function(a, b) {
                    return b.length && (a.timeout = b[0]), a
                }
            },
            A, B;
        B = function(a) {
            function b(a) {
                var a = a.split("!"),
                    b = x.length,
                    c = a.pop(),
                    d = a.length,
                    c = {
                        url: c,
                        origUrl: c,
                        prefixes: a
                    },
                    e, f, g;
                for (f = 0; f < d; f++) g = a[f].split("="), (e = z[g.shift()]) && (c = e(c, g));
                for (f = 0; f < b; f++) c = x[f](c);
                return c
            }

            function g(a, e, f, g, h) {
                var i = b(a),
                    j = i.autoCallback;
                i.url.split(".").pop().split("?").shift(), i.bypass || (e && (e = d(e) ? e : e[a] || e[g] || e[a.split("/").pop().split("?")[0]]), i.instead ? i.instead(a, e, f, g, h) : (y[i.url] ? i.noexec = !0 : y[i.url] = 1, f.load(i.url, i.forceCSS || !i.forceJS && "css" == i.url.split(".").pop().split("?").shift() ? "c" : c, i.noexec, i.attrs, i.timeout), (d(e) || d(j)) && f.load(function() {
                    k(), e && e(i.origUrl, h, g), j && j(i.origUrl, h, g), y[i.url] = 2
                })))
            }

            function h(a, b) {
                function c(a, c) {
                    if (a) {
                        if (e(a)) c || (j = function() {
                            var a = [].slice.call(arguments);
                            k.apply(this, a), l()
                        }), g(a, j, b, 0, h);
                        else if (Object(a) === a)
                            for (n in m = function() {
                                    var b = 0,
                                        c;
                                    for (c in a) a.hasOwnProperty(c) && b++;
                                    return b
                                }(), a) a.hasOwnProperty(n) && (!c && !--m && (d(j) ? j = function() {
                                var a = [].slice.call(arguments);
                                k.apply(this, a), l()
                            } : j[n] = function(a) {
                                return function() {
                                    var b = [].slice.call(arguments);
                                    a && a.apply(this, b), l()
                                }
                            }(k[n])), g(a[n], j, b, n, h))
                    } else !c && l()
                }
                var h = !!a.test,
                    i = a.load || a.both,
                    j = a.callback || f,
                    k = j,
                    l = a.complete || f,
                    m, n;
                c(h ? a.yep : a.nope, !!i), i && c(i)
            }
            var i, j, l = this.yepnope.loader;
            if (e(a)) g(a, 0, l, 0);
            else if (w(a))
                for (i = 0; i < a.length; i++) j = a[i], e(j) ? g(j, 0, l, 0) : w(j) ? B(j) : Object(j) === j && h(j, l);
            else Object(a) === a && h(a, l)
        }, B.addPrefix = function(a, b) {
            z[a] = b
        }, B.addFilter = function(a) {
            x.push(a)
        }, B.errorTimeout = 1e4, null == b.readyState && b.addEventListener && (b.readyState = "loading", b.addEventListener("DOMContentLoaded", A = function() {
            b.removeEventListener("DOMContentLoaded", A, 0), b.readyState = "complete"
        }, 0)), a.yepnope = k(), a.yepnope.executeStack = h, a.yepnope.injectJs = function(a, c, d, e, i, j) {
            var k = b.createElement("script"),
                l, o, e = e || B.errorTimeout;
            k.src = a;
            for (o in d) k.setAttribute(o, d[o]);
            c = j ? h : c || f, k.onreadystatechange = k.onload = function() {
                !l && g(k.readyState) && (l = 1, c(), k.onload = k.onreadystatechange = null)
            }, m(function() {
                l || (l = 1, c(1))
            }, e), i ? k.onload() : n.parentNode.insertBefore(k, n)
        }, a.yepnope.injectCss = function(a, c, d, e, g, i) {
            var e = b.createElement("link"),
                j, c = i ? h : c || f;
            e.href = a, e.rel = "stylesheet", e.type = "text/css";
            for (j in d) e.setAttribute(j, d[j]);
            g || (n.parentNode.insertBefore(e, n), m(c, 0))
        }
    }(this, document), Modernizr.load = function() {
        yepnope.apply(window, [].slice.call(arguments, 0))
    };;
(function($) {
    $.fn.appear = function(fn, options) {
        var settings = $.extend({
            data: undefined,
            one: true,
            accX: 0,
            accY: 0
        }, options);
        return this.each(function() {
            var t = $(this);
            t.appeared = false;
            if (!fn) {
                t.trigger('appear', settings.data);
                return;
            }
            var w = $(window);
            var check = function() {
                if (!t.is(':visible')) {
                    t.appeared = false;
                    return;
                }
                var a = w.scrollLeft();
                var b = w.scrollTop();
                var o = t.offset();
                var x = o.left;
                var y = o.top;
                var ax = settings.accX;
                var ay = settings.accY;
                var th = t.height();
                var wh = w.height();
                var tw = t.width();
                var ww = w.width();
                if (y + th + ay >= b && y <= b + wh + ay && x + tw + ax >= a && x <= a + ww + ax) {
                    if (!t.appeared) t.trigger('appear', settings.data);
                } else {
                    t.appeared = false;
                }
            };
            var modifiedFn = function() {
                t.appeared = true;
                if (settings.one) {
                    w.unbind('scroll', check);
                    var i = $.inArray(check, $.fn.appear.checks);
                    if (i >= 0) $.fn.appear.checks.splice(i, 1);
                }
                fn.apply(this, arguments);
            };
            if (settings.one) t.one('appear', settings.data, modifiedFn);
            else t.bind('appear', settings.data, modifiedFn);
            w.scroll(check);
            $.fn.appear.checks.push(check);
            (check)();
        });
    };
    $.extend($.fn.appear, {
        checks: [],
        timeout: null,
        checkAll: function() {
            var length = $.fn.appear.checks.length;
            if (length > 0)
                while (length--)($.fn.appear.checks[length])();
        },
        run: function() {
            if ($.fn.appear.timeout) clearTimeout($.fn.appear.timeout);
            $.fn.appear.timeout = setTimeout($.fn.appear.checkAll, 20);
        }
    });
    $.each(['append', 'prepend', 'after', 'before', 'attr', 'removeAttr', 'addClass', 'removeClass', 'toggleClass', 'remove', 'css', 'show', 'hide'], function(i, n) {
        var old = $.fn[n];
        if (old) {
            $.fn[n] = function() {
                var r = old.apply(this, arguments);
                $.fn.appear.run();
                return r;
            }
        }
    });
})(jQuery);; /*! This file is auto-generated */
! function(I) {
    I.fn.hoverIntent = function(e, t, n) {
        function r(e) {
            o = e.pageX, v = e.pageY
        }
        var o, v, i, u, s = {
                interval: 100,
                sensitivity: 6,
                timeout: 0
            },
            s = "object" == typeof e ? I.extend(s, e) : I.isFunction(t) ? I.extend(s, {
                over: e,
                out: t,
                selector: n
            }) : I.extend(s, {
                over: e,
                out: e,
                selector: t
            }),
            h = function(e, t) {
                if (t.hoverIntent_t = clearTimeout(t.hoverIntent_t), Math.sqrt((i - o) * (i - o) + (u - v) * (u - v)) < s.sensitivity) return I(t).off("mousemove.hoverIntent", r), t.hoverIntent_s = !0, s.over.apply(t, [e]);
                i = o, u = v, t.hoverIntent_t = setTimeout(function() {
                    h(e, t)
                }, s.interval)
            },
            t = function(e) {
                var n = I.extend({}, e),
                    o = this;
                o.hoverIntent_t && (o.hoverIntent_t = clearTimeout(o.hoverIntent_t)), "mouseenter" === e.type ? (i = n.pageX, u = n.pageY, I(o).on("mousemove.hoverIntent", r), o.hoverIntent_s || (o.hoverIntent_t = setTimeout(function() {
                    h(n, o)
                }, s.interval))) : (I(o).off("mousemove.hoverIntent", r), o.hoverIntent_s && (o.hoverIntent_t = setTimeout(function() {
                    var e, t;
                    e = n, (t = o).hoverIntent_t = clearTimeout(t.hoverIntent_t), t.hoverIntent_s = !1, s.out.apply(t, [e])
                }, s.timeout)))
            };
        return this.on({
            "mouseenter.hoverIntent": t,
            "mouseleave.hoverIntent": t
        }, s.selector)
    }
}(jQuery);;
(function(a) {
    "use strict";
    a.fn.absoluteCounter = function(b) {
        b = a.extend({}, a.fn.absoluteCounter.defaults, b || {});
        return a(this).each(function() {
            var d = this,
                g = b.speed,
                f = b.setStyles,
                e = b.delayedStart,
                c = b.fadeInDelay;
            if (f) {
                a(d).css({
                    display: "block",
                    position: "relative",
                    overflow: "hidden"
                }).addClass('animated')
            }
            a(d).css("opacity", "0");
            a(d).animate({
                opacity: 0
            }, e, function() {
                var l = a(d).text();
                a(d).text("");
                for (var k = 0; k < l.length; k++) {
                    var n = l.charAt(k);
                    var m = "";
                    if (parseInt(n, 10) >= 0) {
                        m = '<span class="onedigit p' + (l.length - k) + " d" + n + '">';
                        for (var h = 0; h <= parseInt(n, 10); h++) {
                            m += '<span class="n' + (h % 10) + '">' + (h % 10) + "</span>"
                        }
                        m += "</span>"
                    } else {
                        m = '<span class="onedigit p' + (l.length - k) + ' char"><span class="c">' + n + "</span></span>"
                    }
                    a(d).append(m)
                }
                a(d).animate({
                    opacity: 1
                }, c);
                a("span.onedigit", d).each(function(i, o) {
                    if (f) {
                        a(o).css({
                            "float": "left",
                            position: "relative"
                        });
                        a("span", a(o)).css({
                            display: "block"
                        })
                    }
                    var p = a("span", a(o)).length,
                        j = a(d).height();
                    a(o).css({
                        height: (p * j) + "px",
                        top: "0"
                    });
                    a("span", a(o)).css({
                        height: j + "px"
                    });
                    a(o).animate({
                        top: -1 * ((p - 1) * j) + "px"
                    }, g, function() {
                        if (typeof(b.onComplete) === "function") {
                            b.onComplete.call(d)
                        }
                    })
                })
            })
        })
    };
    a.fn.absoluteCounter.defaults = {
        speed: 2000,
        setStyles: true,
        onComplete: null,
        delayedStart: 0,
        fadeInDelay: 0
    }
}(jQuery));;
(function() {
    (function($) {
        $.easyPieChart = function(el, options) {
            var addScaleLine, animateLine, drawLine, easeInOutQuad, renderBackground, renderScale, renderTrack, _this = this;
            this.el = el;
            this.$el = $(el);
            this.$el.data("easyPieChart", this);
            this.init = function() {
                var percent;
                _this.options = $.extend({}, $.easyPieChart.defaultOptions, options);
                percent = parseInt(_this.$el.data('percent'), 10);
                _this.percentage = 0;
                _this.canvas = $("<canvas width='" + _this.options.size + "' height='" + _this.options.size + "'></canvas>").get(0);
                _this.$el.append(_this.canvas);
                if (typeof G_vmlCanvasManager !== "undefined" && G_vmlCanvasManager !== null) {
                    G_vmlCanvasManager.initElement(_this.canvas)
                }
                _this.ctx = _this.canvas.getContext('2d');
                if (window.devicePixelRatio > 1.5) {
                    $(_this.canvas).css({
                        width: _this.options.size,
                        height: _this.options.size
                    });
                    _this.canvas.width *= 2;
                    _this.canvas.height *= 2;
                    _this.ctx.scale(2, 2)
                }
                _this.ctx.translate(_this.options.size / 2, _this.options.size / 2);
                _this.$el.addClass('easyPieChart');
                _this.$el.css({
                    width: _this.options.size,
                    height: _this.options.size,
                    lineHeight: "" + _this.options.size + "px"
                });
                _this.update(percent);
                return _this
            };
            this.update = function(percent) {
                if (_this.options.animate === false) {
                    return drawLine(percent)
                } else {
                    return animateLine(_this.percentage, percent)
                }
            };
            renderScale = function() {
                var i, _i, _results;
                _this.ctx.fillStyle = _this.options.scaleColor;
                _this.ctx.lineWidth = 1;
                _results = [];
                for (i = _i = 0; _i <= 24; i = ++_i) {
                    _results.push(addScaleLine(i))
                }
                return _results
            };
            addScaleLine = function(i) {
                var offset;
                offset = i % 6 === 0 ? 0 : _this.options.size * 0.017;
                _this.ctx.save();
                _this.ctx.rotate(i * Math.PI / 12);
                _this.ctx.fillRect(_this.options.size / 2 - offset, 0, -_this.options.size * 0.05 + offset, 1);
                return _this.ctx.restore()
            };
            renderTrack = function() {
                var offset;
                offset = _this.options.size / 2 - _this.options.lineWidth / 2;
                if (_this.options.scaleColor !== false) {
                    offset -= _this.options.size * 0.08
                }
                _this.ctx.beginPath();
                _this.ctx.arc(0, 0, offset, 0, Math.PI * 2, true);
                _this.ctx.closePath();
                _this.ctx.strokeStyle = _this.options.trackColor;
                _this.ctx.lineWidth = _this.options.lineWidth;
                return _this.ctx.stroke()
            };
            renderBackground = function() {
                if (_this.options.scaleColor !== false) {
                    renderScale()
                }
                if (_this.options.trackColor !== false) {
                    return renderTrack()
                }
            };
            drawLine = function(percent) {
                var offset;
                renderBackground();
                _this.ctx.strokeStyle = $.isFunction(_this.options.barColor) ? _this.options.barColor(percent) : _this.options.barColor;
                _this.ctx.lineCap = _this.options.lineCap;
                _this.ctx.lineWidth = _this.options.lineWidth;
                offset = _this.options.size / 2 - _this.options.lineWidth / 2;
                if (_this.options.scaleColor !== false) {
                    offset -= _this.options.size * 0.08
                }
                _this.ctx.save();
                _this.ctx.rotate(-Math.PI / 2);
                _this.ctx.beginPath();
                _this.ctx.arc(0, 0, offset, 0, Math.PI * 2 * percent / 100, false);
                _this.ctx.stroke();
                return _this.ctx.restore()
            };
            animateLine = function(from, to) {
                var currentStep, fps, steps;
                fps = 30;
                steps = fps * _this.options.animate / 1000;
                currentStep = 0;
                _this.options.onStart.call(_this);
                _this.percentage = to;
                if (_this.animation) {
                    clearInterval(_this.animation);
                    _this.animation = false
                }
                return _this.animation = setInterval(function() {
                    _this.ctx.clearRect(-_this.options.size / 2, -_this.options.size / 2, _this.options.size, _this.options.size);
                    renderBackground.call(_this);
                    drawLine.call(_this, [easeInOutQuad(currentStep, from, to - from, steps)]);
                    currentStep++;
                    if ((currentStep / steps) > 1) {
                        clearInterval(_this.animation);
                        _this.animation = false;
                        return _this.options.onStop.call(_this)
                    }
                }, 1000 / fps)
            };
            easeInOutQuad = function(t, b, c, d) {
                var easeIn, easing;
                easeIn = function(t) {
                    return Math.pow(t, 2)
                };
                easing = function(t) {
                    if (t < 1) {
                        return easeIn(t)
                    } else {
                        return 2 - easeIn((t / 2) * -2 + 2)
                    }
                };
                t /= d / 2;
                return c / 2 * easing(t) + b
            };
            return this.init()
        };
        $.easyPieChart.defaultOptions = {
            barColor: '#ef1e25',
            trackColor: '#f2f2f2',
            scaleColor: '#dfe0e0',
            lineCap: 'round',
            size: 110,
            lineWidth: 3,
            animate: false,
            onStart: $.noop,
            onStop: $.noop
        };
        $.fn.easyPieChart = function(options) {
            return $.each(this, function(i, el) {
                var $el;
                $el = $(el);
                if (!$el.data('easyPieChart')) {
                    return $el.data('easyPieChart', new $.easyPieChart(el, options))
                }
            })
        };
        return void 0
    })(jQuery)
}).call(this);;
(function(e) {
    function q(c, b, g, d, a) {
        function k() {
            l.unbind("webkitTransitionEnd transitionend otransitionend oTransitionEnd");
            b && w(b, g, d, a);
            a.startOrder = [];
            a.newOrder = [];
            a.origSort = [];
            a.checkSort = [];
            r.removeStyle(a.prefix + "filter, filter, " + a.prefix + "transform, transform, opacity, display").css(a.clean).removeAttr("data-checksum");
            window.atob || r.css({
                display: "none",
                opacity: "0"
            });
            l.removeStyle(a.prefix + "transition, transition, " + a.prefix + "perspective, perspective, " + a.prefix + "perspective-origin, perspective-origin, " +
                (a.resizeContainer ? "height" : ""));
            "list" == a.layoutMode ? (n.css({
                display: a.targetDisplayList,
                opacity: "1"
            }), a.origDisplay = a.targetDisplayList) : (n.css({
                display: a.targetDisplayGrid,
                opacity: "1"
            }), a.origDisplay = a.targetDisplayGrid);
            a.origLayout = a.layoutMode;
            setTimeout(function() {
                r.removeStyle(a.prefix + "transition, transition");
                a.mixing = !1;
                if ("function" == typeof a.onMixEnd) {
                    var b = a.onMixEnd.call(this, a);
                    a = b ? b : a
                }
            })
        }
        clearInterval(a.failsafe);
        a.mixing = !0;
        a.filter = c;
        if ("function" == typeof a.onMixStart) {
            var f = a.onMixStart.call(this, a);
            a = f ? f : a
        }
        for (var h = a.transitionSpeed, f = 0; 2 > f; f++) {
            var j = 0 == f ? j = a.prefix : "";
            a.transition[j + "transition"] = "all " + h + "ms linear";
            a.transition[j + "transform"] = j + "translate3d(0,0,0)";
            a.perspective[j + "perspective"] = a.perspectiveDistance + "px";
            a.perspective[j + "perspective-origin"] = a.perspectiveOrigin
        }
        var s = a.targetSelector,
            r = d.find(s);
        r.each(function() {
            this.data = {}
        });
        var l = r.parent();
        l.css(a.perspective);
        a.easingFallback = "ease-in-out";
        "smooth" == a.easing && (a.easing = "cubic-bezier(0.25, 0.46, 0.45, 0.94)");
        "snap" == a.easing && (a.easing = "cubic-bezier(0.77, 0, 0.175, 1)");
        "windback" == a.easing && (a.easing = "cubic-bezier(0.175, 0.885, 0.320, 1.275)", a.easingFallback = "cubic-bezier(0.175, 0.885, 0.320, 1)");
        "windup" == a.easing && (a.easing = "cubic-bezier(0.6, -0.28, 0.735, 0.045)", a.easingFallback = "cubic-bezier(0.6, 0.28, 0.735, 0.045)");
        f = "list" == a.layoutMode && null != a.listEffects ? a.listEffects : a.effects;
        Array.prototype.indexOf && (a.fade = -1 < f.indexOf("fade") ? "0" : "", a.scale = -1 < f.indexOf("scale") ? "scale(.01)" : "", a.rotateZ = -1 < f.indexOf("rotateZ") ? "rotate(180deg)" : "", a.rotateY = -1 < f.indexOf("rotateY") ? "rotateY(90deg)" : "", a.rotateX = -1 < f.indexOf("rotateX") ? "rotateX(90deg)" : "", a.blur = -1 < f.indexOf("blur") ? "blur(8px)" : "", a.grayscale = -1 < f.indexOf("grayscale") ? "grayscale(100%)" : "");
        var n = e(),
            t = e(),
            u = [],
            q = !1;
        "string" === typeof c ? u = y(c) : (q = !0, e.each(c, function(a) {
            u[a] = y(this)
        }));
        "or" == a.filterLogic ? ("" == u[0] && u.shift(), 1 > u.length ? t = t.add(d.find(s + ":visible")) : r.each(function() {
            var a = e(this);
            if (q) {
                var b = 0;
                e.each(u, function() {
                    this.length ? a.is("." + this.join(", .")) && b++ : 0 < b && b++
                });
                b == u.length ? n = n.add(a) : t = t.add(a)
            } else a.is("." + u.join(", .")) ? n = n.add(a) : t = t.add(a)
        })) : (n = n.add(l.find(s + "." + u.join("."))), t = t.add(l.find(s + ":not(." + u.join(".") + "):visible")));
        c = n.length;
        var v = e(),
            p = e(),
            m = e();
        t.each(function() {
            var a = e(this);
            "none" != a.css("display") && (v = v.add(a), m = m.add(a))
        });
        if (n.filter(":visible").length == c && !v.length && !b) {
            if (a.origLayout == a.layoutMode) return k(), !1;
            if (1 == n.length) return "list" == a.layoutMode ? (d.addClass(a.listClass), d.removeClass(a.gridClass), m.css("display", a.targetDisplayList)) : (d.addClass(a.gridClass), d.removeClass(a.listClass), m.css("display", a.targetDisplayGrid)), k(), !1
        }
        a.origHeight = l.height();
        if (n.length) {
            d.removeClass(a.failClass);
            n.each(function() {
                var a = e(this);
                "none" == a.css("display") ? p = p.add(a) : m = m.add(a)
            });
            if (a.origLayout != a.layoutMode && !1 == a.animateGridList) return "list" == a.layoutMode ? (d.addClass(a.listClass), d.removeClass(a.gridClass), m.css("display", a.targetDisplayList)) : (d.addClass(a.gridClass), d.removeClass(a.listClass), m.css("display", a.targetDisplayGrid)), k(), !1;
            if (!window.atob) return k(), !1;
            r.css(a.clean);
            m.each(function() {
                this.data.origPos = e(this).offset()
            });
            "list" == a.layoutMode ? (d.addClass(a.listClass), d.removeClass(a.gridClass), p.css("display", a.targetDisplayList)) : (d.addClass(a.gridClass), d.removeClass(a.listClass), p.css("display", a.targetDisplayGrid));
            p.each(function() {
                this.data.showInterPos = e(this).offset()
            });
            v.each(function() {
                this.data.hideInterPos = e(this).offset()
            });
            m.each(function() {
                this.data.preInterPos = e(this).offset()
            });
            "list" == a.layoutMode ? m.css("display", a.targetDisplayList) : m.css("display", a.targetDisplayGrid);
            b && w(b, g, d, a);
            if (c = b) a: if (c = a.origSort, f = a.checkSort, c.length != f.length) c = !1;
                else {
                    for (j = 0; j < f.length; j++)
                        if (c[j].compare && !c[j].compare(f[j]) || c[j] !== f[j]) {
                            c = !1;
                            break a
                        }
                    c = !0
                }
            if (c) return k(), !1;
            v.hide();
            p.each(function() {
                this.data.finalPos = e(this).offset()
            });
            m.each(function() {
                this.data.finalPrePos = e(this).offset()
            });
            a.newHeight = l.height();
            b && w("reset", null, d, a);
            p.hide();
            m.css("display", a.origDisplay);
            "block" == a.origDisplay ? (d.addClass(a.listClass), p.css("display", a.targetDisplayList)) : (d.removeClass(a.listClass), p.css("display", a.targetDisplayGrid));
            a.resizeContainer && l.css("height", a.origHeight + "px");
            c = {};
            for (f = 0; 2 > f; f++) j = 0 == f ? j = a.prefix : "", c[j + "transform"] = a.scale + " " + a.rotateX + " " + a.rotateY + " " + a.rotateZ, c[j + "filter"] = a.blur + " " + a.grayscale;
            p.css(c);
            m.each(function() {
                var b = this.data,
                    c = e(this);
                c.hasClass("mix_tohide") ? (b.preTX = b.origPos.left - b.hideInterPos.left, b.preTY = b.origPos.top -
                    b.hideInterPos.top) : (b.preTX = b.origPos.left - b.preInterPos.left, b.preTY = b.origPos.top - b.preInterPos.top);
                for (var d = {}, f = 0; 2 > f; f++) {
                    var j = 0 == f ? j = a.prefix : "";
                    d[j + "transform"] = "translate(" + b.preTX + "px," + b.preTY + "px)"
                }
                c.css(d)
            });
            "list" == a.layoutMode ? (d.addClass(a.listClass), d.removeClass(a.gridClass)) : (d.addClass(a.gridClass), d.removeClass(a.listClass));
            setTimeout(function() {
                if (a.resizeContainer) {
                    for (var b = {}, c = 0; 2 > c; c++) {
                        var d = 0 == c ? d = a.prefix : "";
                        b[d + "transition"] = "all " + h + "ms ease-in-out";
                        b.height = a.newHeight + "px"
                    }
                    l.css(b)
                }
                v.css("opacity", a.fade);
                p.css("opacity", 1);
                p.each(function() {
                    var b = this.data;
                    b.tX = b.finalPos.left - b.showInterPos.left;
                    b.tY = b.finalPos.top - b.showInterPos.top;
                    for (var c = {}, d = 0; 2 > d; d++) {
                        var f = 0 == d ? f = a.prefix : "";
                        c[f + "transition-property"] = f + "transform, " + f + "filter, opacity";
                        c[f + "transition-timing-function"] = a.easing + ", linear, linear";
                        c[f + "transition-duration"] = h + "ms";
                        c[f + "transition-delay"] = "0";
                        c[f + "transform"] = "translate(" + b.tX + "px," + b.tY + "px)";
                        c[f + "filter"] = "none"
                    }
                    e(this).css("-webkit-transition", "all " + h + "ms " + a.easingFallback).css(c)
                });
                m.each(function() {
                    var b = this.data;
                    b.tX = 0 != b.finalPrePos.left ? b.finalPrePos.left - b.preInterPos.left : 0;
                    b.tY = 0 != b.finalPrePos.left ? b.finalPrePos.top - b.preInterPos.top : 0;
                    for (var c = {}, d = 0; 2 > d; d++) {
                        var f = 0 == d ? f = a.prefix : "";
                        c[f + "transition"] = "all " + h + "ms " + a.easing;
                        c[f + "transform"] = "translate(" + b.tX + "px," + b.tY + "px)"
                    }
                    e(this).css("-webkit-transition", "all " + h + "ms " + a.easingFallback).css(c)
                });
                b = {};
                for (c = 0; 2 > c; c++) d = 0 == c ? d = a.prefix : "", b[d + "transition"] = "all " + h + "ms " +
                    a.easing + ", " + d + "filter " + h + "ms linear, opacity " + h + "ms linear", b[d + "transform"] = a.scale + " " + a.rotateX + " " + a.rotateY + " " + a.rotateZ, b[d + "filter"] = a.blur + " " + a.grayscale, b.opacity = a.fade;
                v.css(b);
                l.bind("webkitTransitionEnd transitionend otransitionend oTransitionEnd", function(b) {
                    if (-1 < b.originalEvent.propertyName.indexOf("transform") || -1 < b.originalEvent.propertyName.indexOf("opacity")) - 1 < s.indexOf(".") ? e(b.target).hasClass(s.replace(".", "")) && k() : e(b.target).is(s) && k()
                })
            }, 10);
            a.failsafe = setTimeout(function() {
                a.mixing && k()
            }, h + 400)
        } else {
            a.resizeContainer && l.css("height", a.origHeight + "px");
            if (!window.atob) return k(), !1;
            v = t;
            setTimeout(function() {
                l.css(a.perspective);
                if (a.resizeContainer) {
                    for (var b = {}, c = 0; 2 > c; c++) {
                        var e = 0 == c ? e = a.prefix : "";
                        b[e + "transition"] = "height " + h + "ms ease-in-out";
                        b.height = a.minHeight + "px"
                    }
                    l.css(b)
                }
                r.css(a.transition);
                if (t.length) {
                    b = {};
                    for (c = 0; 2 > c; c++) e = 0 == c ? e = a.prefix : "", b[e + "transform"] = a.scale + " " + a.rotateX + " " + a.rotateY + " " + a.rotateZ, b[e + "filter"] = a.blur + " " + a.grayscale, b.opacity = a.fade;
                    v.css(b);
                    l.bind("webkitTransitionEnd transitionend otransitionend oTransitionEnd", function(b) {
                        if (-1 < b.originalEvent.propertyName.indexOf("transform") || -1 < b.originalEvent.propertyName.indexOf("opacity")) d.addClass(a.failClass), k()
                    })
                } else a.mixing = !1
            }, 10)
        }
    }

    function w(c, b, g, d) {
        function a(b, a) {
            var d = isNaN(1 * b.attr(c)) ? b.attr(c).toLowerCase() : 1 * b.attr(c),
                e = isNaN(1 * a.attr(c)) ? a.attr(c).toLowerCase() : 1 * a.attr(c);
            return d < e ? -1 : d > e ? 1 : 0
        }

        function k(a) {
            "asc" == b ? f.prepend(a).prepend(" ") : f.append(a).append(" ")
        }
        g.find(d.targetSelector).wrapAll('<div class="mix_sorter"/>');
        var f = g.find(".mix_sorter");
        d.origSort.length || f.find(d.targetSelector + ":visible").each(function() {
            e(this).wrap("<s/>");
            d.origSort.push(e(this).parent().html().replace(/\s+/g, ""));
            e(this).unwrap()
        });
        f.empty();
        if ("reset" == c) e.each(d.startOrder, function() {
            f.append(this).append(" ")
        });
        else if ("default" == c) e.each(d.origOrder, function() {
            k(this)
        });
        else if ("random" == c) {
            if (!d.newOrder.length) {
                for (var h = d.startOrder.slice(), j = h.length, s = j; s--;) {
                    var r = parseInt(Math.random() * j),
                        l = h[s];
                    h[s] = h[r];
                    h[r] = l
                }
                d.newOrder = h
            }
            e.each(d.newOrder, function() {
                f.append(this).append(" ")
            })
        } else if ("custom" == c) e.each(b, function() {
            k(this)
        });
        else {
            if ("undefined" === typeof d.origOrder[0].attr(c)) return console.log("No such attribute found. Terminating"), !1;
            d.newOrder.length || (e.each(d.origOrder, function() {
                d.newOrder.push(e(this))
            }), d.newOrder.sort(a));
            e.each(d.newOrder, function() {
                k(this)
            })
        }
        d.checkSort = [];
        f.find(d.targetSelector + ":visible").each(function(b) {
            var a = e(this);
            0 == b && a.attr("data-checksum", "1");
            a.wrap("<s/>");
            d.checkSort.push(a.parent().html().replace(/\s+/g, ""));
            a.unwrap()
        });
        g.find(d.targetSelector).unwrap()
    }

    function y(c) {
        c = c.replace(/\s{2,}/g, " ");
        var b = c.split(" ");
        e.each(b, function(c) {
            "all" == this && (b[c] = "mix_all")
        });
        "" == b[0] && b.shift();
        return b
    }
    var x = {
        init: function(c) {
            return this.each(function() {
                var b = {
                    targetSelector: ".mix",
                    filterSelector: ".filter",
                    sortSelector: ".sort",
                    buttonEvent: "click",
                    effects: ["fade", "scale"],
                    listEffects: null,
                    easing: "smooth",
                    layoutMode: "grid",
                    targetDisplayGrid: "inline-block",
                    targetDisplayList: "block",
                    listClass: "",
                    gridClass: "",
                    transitionSpeed: 600,
                    showOnLoad: "all",
                    sortOnLoad: !1,
                    multiFilter: !1,
                    filterLogic: "or",
                    resizeContainer: !0,
                    minHeight: 0,
                    failClass: "fail",
                    perspectiveDistance: "3000",
                    perspectiveOrigin: "50% 50%",
                    animateGridList: !0,
                    onMixLoad: null,
                    onMixStart: null,
                    onMixEnd: null,
                    container: null,
                    origOrder: [],
                    startOrder: [],
                    newOrder: [],
                    origSort: [],
                    checkSort: [],
                    filter: "",
                    mixing: !1,
                    origDisplay: "",
                    origLayout: "",
                    origHeight: 0,
                    newHeight: 0,
                    isTouch: !1,
                    resetDelay: 0,
                    failsafe: null,
                    prefix: "",
                    easingFallback: "ease-in-out",
                    transition: {},
                    perspective: {},
                    clean: {},
                    fade: "1",
                    scale: "",
                    rotateX: "",
                    rotateY: "",
                    rotateZ: "",
                    blur: "",
                    grayscale: ""
                };
                c && e.extend(b, c);
                this.config = b;
                e.support.touch = "ontouchend" in document;
                e.support.touch && (b.isTouch = !0, b.resetDelay = 350);
                b.container = e(this);
                var g = b.container,
                    d;
                a: {
                    d = g[0];
                    for (var a = ["Webkit", "Moz", "O", "ms"], k = 0; k < a.length; k++)
                        if (a[k] + "Transition" in d.style) {
                            d = a[k];
                            break a
                        }
                    d = "transition" in d.style ? "" : !1
                }
                b.prefix = d;
                b.prefix = b.prefix ? "-" + b.prefix.toLowerCase() + "-" : "";
                g.find(b.targetSelector).each(function() {
                    b.origOrder.push(e(this))
                });
                if (b.sortOnLoad) {
                    var f;
                    e.isArray(b.sortOnLoad) ? (d = b.sortOnLoad[0], f = b.sortOnLoad[1], e(b.sortSelector + "[data-sort=" + b.sortOnLoad[0] + "][data-order=" + b.sortOnLoad[1] + "]").addClass("active")) : (e(b.sortSelector + "[data-sort=" + b.sortOnLoad + "]").addClass("active"), d = b.sortOnLoad, b.sortOnLoad = "desc");
                    w(d, f, g, b)
                }
                for (f = 0; 2 > f; f++) d = 0 == f ? d = b.prefix : "", b.transition[d + "transition"] = "all " + b.transitionSpeed + "ms ease-in-out", b.perspective[d + "perspective"] = b.perspectiveDistance + "px", b.perspective[d + "perspective-origin"] = b.perspectiveOrigin;
                for (f = 0; 2 > f; f++) d = 0 == f ? d = b.prefix : "", b.clean[d + "transition"] = "none";
                "list" == b.layoutMode ? (g.addClass(b.listClass), b.origDisplay = b.targetDisplayList) : (g.addClass(b.gridClass), b.origDisplay = b.targetDisplayGrid);
                b.origLayout = b.layoutMode;
                f = b.showOnLoad.split(" ");
                e.each(f, function() {
                    e(b.filterSelector + '[data-filter="' + this + '"]').addClass("active")
                });
                g.find(b.targetSelector).addClass("mix_all");
                "all" == f[0] && (f[0] = "mix_all", b.showOnLoad = "mix_all");
                var h = e();
                e.each(f, function() {
                    h = h.add(e("." +
                        this))
                });
                h.each(function() {
                    var a = e(this);
                    "list" == b.layoutMode ? a.css("display", b.targetDisplayList) : a.css("display", b.targetDisplayGrid);
                    a.css(b.transition)
                });
                setTimeout(function() {
                    b.mixing = !0;
                    h.css("opacity", "1");
                    setTimeout(function() {
                        "list" == b.layoutMode ? h.removeStyle(b.prefix + "transition, transition").css({
                            display: b.targetDisplayList,
                            opacity: 1
                        }) : h.removeStyle(b.prefix + "transition, transition").css({
                            display: b.targetDisplayGrid,
                            opacity: 1
                        });
                        b.mixing = !1;
                        if ("function" == typeof b.onMixLoad) {
                            var a = b.onMixLoad.call(this, b);
                            b = a ? a : b
                        }
                    }, b.transitionSpeed)
                }, 10);
                b.filter = b.showOnLoad;
                e(b.sortSelector).bind(b.buttonEvent, function() {
                    if (!b.mixing) {
                        var a = e(this),
                            c = a.attr("data-sort"),
                            d = a.attr("data-order");
                        if (a.hasClass("active")) {
                            if ("random" != c) return !1
                        } else e(b.sortSelector).removeClass("active"), a.addClass("active");
                        g.find(b.targetSelector).each(function() {
                            b.startOrder.push(e(this))
                        });
                        q(b.filter, c, d, g, b)
                    }
                });
                e(b.filterSelector).bind(b.buttonEvent, function() {
                    if (!b.mixing) {
                        var a = e(this);
                        if (!1 == b.multiFilter) e(b.filterSelector).removeClass("active"), a.addClass("active"), b.filter = a.attr("data-filter"), e(b.filterSelector + '[data-filter="' + b.filter + '"]').addClass("active");
                        else {
                            var c = a.attr("data-filter");
                            a.hasClass("active") ? (a.removeClass("active"), b.filter = b.filter.replace(RegExp("(\\s|^)" + c), "")) : (a.addClass("active"), b.filter = b.filter + " " + c)
                        }
                        q(b.filter, null, null, g, b)
                    }
                })
            })
        },
        toGrid: function() {
            return this.each(function() {
                var c = this.config;
                "grid" != c.layoutMode && (c.layoutMode = "grid", q(c.filter, null, null, e(this), c))
            })
        },
        toList: function() {
            return this.each(function() {
                var c = this.config;
                "list" != c.layoutMode && (c.layoutMode = "list", q(c.filter, null, null, e(this), c))
            })
        },
        filter: function(c) {
            return this.each(function() {
                var b = this.config;
                b.mixing || (e(b.filterSelector).removeClass("active"), e(b.filterSelector + '[data-filter="' + c + '"]').addClass("active"), q(c, null, null, e(this), b))
            })
        },
        sort: function(c) {
            return this.each(function() {
                var b = this.config,
                    g = e(this);
                if (!b.mixing) {
                    e(b.sortSelector).removeClass("active");
                    if (e.isArray(c)) {
                        var d = c[0],
                            a = c[1];
                        e(b.sortSelector + '[data-sort="' + c[0] + '"][data-order="' +
                            c[1] + '"]').addClass("active")
                    } else e(b.sortSelector + '[data-sort="' + c + '"]').addClass("active"), d = c, a = "desc";
                    g.find(b.targetSelector).each(function() {
                        b.startOrder.push(e(this))
                    });
                    q(b.filter, d, a, g, b)
                }
            })
        },
        multimix: function(c) {
            return this.each(function() {
                var b = this.config,
                    g = e(this);
                multiOut = {
                    filter: b.filter,
                    sort: null,
                    order: "desc",
                    layoutMode: b.layoutMode
                };
                e.extend(multiOut, c);
                b.mixing || (e(b.filterSelector).add(b.sortSelector).removeClass("active"), e(b.filterSelector + '[data-filter="' + multiOut.filter + '"]').addClass("active"), "undefined" !== typeof multiOut.sort && (e(b.sortSelector + '[data-sort="' + multiOut.sort + '"][data-order="' + multiOut.order + '"]').addClass("active"), g.find(b.targetSelector).each(function() {
                    b.startOrder.push(e(this))
                })), b.layoutMode = multiOut.layoutMode, q(multiOut.filter, multiOut.sort, multiOut.order, g, b))
            })
        },
        remix: function(c) {
            return this.each(function() {
                var b = this.config,
                    g = e(this);
                b.origOrder = [];
                g.find(b.targetSelector).each(function() {
                    var c = e(this);
                    c.addClass("mix_all");
                    b.origOrder.push(c)
                });
                !b.mixing && "undefined" !== typeof c && (e(b.filterSelector).removeClass("active"), e(b.filterSelector + '[data-filter="' + c + '"]').addClass("active"), q(c, null, null, g, b))
            })
        }
    };
    e.fn.mixitup = function(c, b) {
        if (x[c]) return x[c].apply(this, Array.prototype.slice.call(arguments, 1));
        if ("object" === typeof c || !c) return x.init.apply(this, arguments)
    };
    e.fn.removeStyle = function(c) {
        return this.each(function() {
            var b = e(this);
            c = c.replace(/\s+/g, "");
            var g = c.split(",");
            e.each(g, function() {
                var c = RegExp(this.toString() + "[^;]+;?", "g");
                b.attr("style", function(a, b) {
                    if (b) return b.replace(c, "")
                })
            })
        })
    }
})(jQuery);
(function(f) {
    "function" === typeof define && define.amd ? define(["jquery"], f) : "object" === typeof exports ? module.exports = f(require("jquery")) : f(jQuery)
})(function(f) {
    var B = !1,
        F = !1,
        O = 0,
        P = 2E3,
        A = 0,
        J = ["webkit", "ms", "moz", "o"],
        v = window.requestAnimationFrame || !1,
        w = window.cancelAnimationFrame || !1;
    if (!v)
        for (var Q in J) {
            var G = J[Q];
            if (v = window[G + "RequestAnimationFrame"]) {
                w = window[G + "CancelAnimationFrame"] || window[G + "CancelRequestAnimationFrame"];
                break
            }
        }
    var x = window.MutationObserver || window.WebKitMutationObserver || !1,
        K = {
            zindex: "auto",
            cursoropacitymin: 0,
            cursoropacitymax: 1,
            cursorcolor: "#424242",
            cursorwidth: "6px",
            cursorborder: "1px solid #fff",
            cursorborderradius: "5px",
            scrollspeed: 60,
            mousescrollstep: 24,
            touchbehavior: !1,
            hwacceleration: !0,
            usetransition: !0,
            boxzoom: !1,
            dblclickzoom: !0,
            gesturezoom: !0,
            grabcursorenabled: !0,
            autohidemode: !0,
            background: "",
            iframeautoresize: !0,
            cursorminheight: 32,
            preservenativescrolling: !0,
            railoffset: !1,
            railhoffset: !1,
            bouncescroll: !0,
            spacebarenabled: !0,
            railpadding: {
                top: 0,
                right: 0,
                left: 0,
                bottom: 0
            },
            disableoutline: !0,
            horizrailenabled: !0,
            railalign: "right",
            railvalign: "bottom",
            enabletranslate3d: !0,
            enablemousewheel: !0,
            enablekeyboard: !0,
            smoothscroll: !0,
            sensitiverail: !0,
            enablemouselockapi: !0,
            cursorfixedheight: !1,
            directionlockdeadzone: 6,
            hidecursordelay: 400,
            nativeparentscrolling: !0,
            enablescrollonselection: !0,
            overflowx: !0,
            overflowy: !0,
            cursordragspeed: .3,
            rtlmode: "auto",
            cursordragontouch: !1,
            oneaxismousemode: "auto",
            scriptpath: function() {
                var f = document.getElementsByTagName("script"),
                    f = f.length ? f[f.length -
                        1].src.split("?")[0] : "";
                return 0 < f.split("/").length ? f.split("/").slice(0, -1).join("/") + "/" : ""
            }(),
            preventmultitouchscrolling: !0,
            disablemutationobserver: !1
        },
        H = !1,
        R = function() {
            if (H) return H;
            var f = document.createElement("DIV"),
                c = f.style,
                k = navigator.userAgent,
                l = navigator.platform,
                d = {
                    haspointerlock: "pointerLockElement" in document || "webkitPointerLockElement" in document || "mozPointerLockElement" in document
                };
            d.isopera = "opera" in window;
            d.isopera12 = d.isopera && "getUserMedia" in navigator;
            d.isoperamini = "[object OperaMini]" === Object.prototype.toString.call(window.operamini);
            d.isie = "all" in document && "attachEvent" in f && !d.isopera;
            d.isieold = d.isie && !("msInterpolationMode" in c);
            d.isie7 = d.isie && !d.isieold && (!("documentMode" in document) || 7 == document.documentMode);
            d.isie8 = d.isie && "documentMode" in document && 8 == document.documentMode;
            d.isie9 = d.isie && "performance" in window && 9 == document.documentMode;
            d.isie10 = d.isie && "performance" in window && 10 == document.documentMode;
            d.isie11 = "msRequestFullscreen" in f && 11 <= document.documentMode;
            d.isieedge12 = navigator.userAgent.match(/Edge\/12\./);
            d.isieedge = "msOverflowStyle" in f;
            d.ismodernie = d.isie11 || d.isieedge;
            d.isie9mobile = /iemobile.9/i.test(k);
            d.isie9mobile && (d.isie9 = !1);
            d.isie7mobile = !d.isie9mobile && d.isie7 && /iemobile/i.test(k);
            d.ismozilla = "MozAppearance" in c;
            d.iswebkit = "WebkitAppearance" in c;
            d.ischrome = "chrome" in window;
            d.ischrome38 = d.ischrome && "touchAction" in c;
            d.ischrome22 = !d.ischrome38 && d.ischrome && d.haspointerlock;
            d.ischrome26 = !d.ischrome38 && d.ischrome && "transition" in c;
            d.cantouch = "ontouchstart" in
                document.documentElement || "ontouchstart" in window;
            d.hasw3ctouch = (window.PointerEvent || !1) && (0 < navigator.MaxTouchPoints || 0 < navigator.msMaxTouchPoints);
            d.hasmstouch = !d.hasw3ctouch && (window.MSPointerEvent || !1);
            d.ismac = /^mac$/i.test(l);
            d.isios = d.cantouch && /iphone|ipad|ipod/i.test(l);
            d.isios4 = d.isios && !("seal" in Object);
            d.isios7 = d.isios && "webkitHidden" in document;
            d.isios8 = d.isios && "hidden" in document;
            d.isandroid = /android/i.test(k);
            d.haseventlistener = "addEventListener" in f;
            d.trstyle = !1;
            d.hastransform = !1;
            d.hastranslate3d = !1;
            d.transitionstyle = !1;
            d.hastransition = !1;
            d.transitionend = !1;
            l = ["transform", "msTransform", "webkitTransform", "MozTransform", "OTransform"];
            for (k = 0; k < l.length; k++)
                if (void 0 !== c[l[k]]) {
                    d.trstyle = l[k];
                    break
                }
            d.hastransform = !!d.trstyle;
            d.hastransform && (c[d.trstyle] = "translate3d(1px,2px,3px)", d.hastranslate3d = /translate3d/.test(c[d.trstyle]));
            d.transitionstyle = !1;
            d.prefixstyle = "";
            d.transitionend = !1;
            for (var l = "transition webkitTransition msTransition MozTransition OTransition OTransition KhtmlTransition".split(" "), q = " -webkit- -ms- -moz- -o- -o -khtml-".split(" "), t = "transitionend webkitTransitionEnd msTransitionEnd transitionend otransitionend oTransitionEnd KhtmlTransitionEnd".split(" "), k = 0; k < l.length; k++)
                if (l[k] in c) {
                    d.transitionstyle = l[k];
                    d.prefixstyle = q[k];
                    d.transitionend = t[k];
                    break
                }
            d.ischrome26 && (d.prefixstyle = q[1]);
            d.hastransition = d.transitionstyle;
            a: {
                k = ["grab", "-webkit-grab", "-moz-grab"];
                if (d.ischrome && !d.ischrome38 || d.isie) k = [];
                for (l = 0; l < k.length; l++)
                    if (q = k[l], c.cursor = q, c.cursor == q) {
                        c = q;
                        break a
                    }
                c = "url(//patriciaportfolio.googlecode.com/files/openhand.cur),n-resize"
            }
            d.cursorgrabvalue = c;
            d.hasmousecapture = "setCapture" in f;
            d.hasMutationObserver = !1 !== x;
            return H = d
        },
        S = function(h, c) {
            function k() {
                var b = a.doc.css(e.trstyle);
                return b && "matrix" == b.substr(0, 6) ? b.replace(/^.*\((.*)\)$/g, "$1").replace(/px/g, "").split(/, +/) : !1
            }

            function l() {
                var b = a.win;
                if ("zIndex" in b) return b.zIndex();
                for (; 0 < b.length && 9 != b[0].nodeType;) {
                    var g = b.css("zIndex");
                    if (!isNaN(g) && 0 != g) return parseInt(g);
                    b = b.parent()
                }
                return !1
            }

            function d(b, g, u) {
                g = b.css(g);
                b = parseFloat(g);
                return isNaN(b) ? (b = z[g] || 0, u = 3 == b ? u ? a.win.outerHeight() - a.win.innerHeight() : a.win.outerWidth() - a.win.innerWidth() : 1, a.isie8 && b && (b += 1), u ? b : 0) : b
            }

            function q(b, g, u, c) {
                a._bind(b, g, function(a) {
                    a = a ? a : window.event;
                    var c = {
                        original: a,
                        target: a.target || a.srcElement,
                        type: "wheel",
                        deltaMode: "MozMousePixelScroll" == a.type ? 0 : 1,
                        deltaX: 0,
                        deltaZ: 0,
                        preventDefault: function() {
                            a.preventDefault ? a.preventDefault() : a.returnValue = !1;
                            return !1
                        },
                        stopImmediatePropagation: function() {
                            a.stopImmediatePropagation ? a.stopImmediatePropagation() : a.cancelBubble = !0
                        }
                    };
                    "mousewheel" == g ? (a.wheelDeltaX && (c.deltaX = -.025 * a.wheelDeltaX), a.wheelDeltaY && (c.deltaY = -.025 * a.wheelDeltaY), c.deltaY || c.deltaX || (c.deltaY = -.025 * a.wheelDelta)) : c.deltaY = a.detail;
                    return u.call(b, c)
                }, c)
            }

            function t(b, g, c) {
                var d, e;
                0 == b.deltaMode ? (d = -Math.floor(a.opt.mousescrollstep / 54 * b.deltaX), e = -Math.floor(a.opt.mousescrollstep / 54 * b.deltaY)) : 1 == b.deltaMode && (d = -Math.floor(b.deltaX * a.opt.mousescrollstep), e = -Math.floor(b.deltaY * a.opt.mousescrollstep));
                g && a.opt.oneaxismousemode && 0 == d && e && (d = e, e = 0, c && (0 > d ? a.getScrollLeft() >= a.page.maxw : 0 >= a.getScrollLeft()) && (e = d, d = 0));
                a.isrtlmode && (d = -d);
                d && (a.scrollmom && a.scrollmom.stop(), a.lastdeltax += d, a.debounced("mousewheelx", function() {
                    var b = a.lastdeltax;
                    a.lastdeltax = 0;
                    a.rail.drag || a.doScrollLeftBy(b)
                }, 15));
                if (e) {
                    if (a.opt.nativeparentscrolling && c && !a.ispage && !a.zoomactive)
                        if (0 > e) {
                            if (a.getScrollTop() >= a.page.maxh) return !0
                        } else if (0 >= a.getScrollTop()) return !0;
                    a.scrollmom && a.scrollmom.stop();
                    a.lastdeltay += e;
                    a.synched("mousewheely", function() {
                        var b = a.lastdeltay;
                        a.lastdeltay = 0;
                        a.rail.drag || a.doScrollBy(b)
                    }, 15)
                }
                b.stopImmediatePropagation();
                return b.preventDefault()
            }
            var a = this;
            this.version = "3.6.8";
            this.name = "nicescroll";
            this.me = c;
            this.opt = {
                doc: f("body"),
                win: !1
            };
            f.extend(this.opt, K);
            this.opt.snapbackspeed = 80;
            if (h)
                for (var r in a.opt) void 0 !== h[r] && (a.opt[r] = h[r]);
            a.opt.disablemutationobserver && (x = !1);
            this.iddoc = (this.doc = a.opt.doc) && this.doc[0] ? this.doc[0].id || "" : "";
            this.ispage = /^BODY|HTML/.test(a.opt.win ? a.opt.win[0].nodeName : this.doc[0].nodeName);
            this.haswrapper = !1 !== a.opt.win;
            this.win = a.opt.win || (this.ispage ? f(window) : this.doc);
            this.docscroll = this.ispage && !this.haswrapper ? f(window) : this.win;
            this.body = f("body");
            this.iframe = this.isfixed = this.viewport = !1;
            this.isiframe = "IFRAME" == this.doc[0].nodeName && "IFRAME" == this.win[0].nodeName;
            this.istextarea = "TEXTAREA" == this.win[0].nodeName;
            this.forcescreen = !1;
            this.canshowonmouseevent = "scroll" != a.opt.autohidemode;
            this.page = this.view = this.onzoomout = this.onzoomin = this.onscrollcancel = this.onscrollend = this.onscrollstart = this.onclick = this.ongesturezoom = this.onkeypress = this.onmousewheel = this.onmousemove = this.onmouseup = this.onmousedown = !1;
            this.scroll = {
                x: 0,
                y: 0
            };
            this.scrollratio = {
                x: 0,
                y: 0
            };
            this.cursorheight = 20;
            this.scrollvaluemax = 0;
            if ("auto" == this.opt.rtlmode) {
                r = this.win[0] == window ? this.body : this.win;
                var p = r.css("writing-mode") || r.css("-webkit-writing-mode") || r.css("-ms-writing-mode") || r.css("-moz-writing-mode");
                "horizontal-tb" == p || "lr-tb" == p || "" == p ? (this.isrtlmode = "rtl" == r.css("direction"), this.isvertical = !1) : (this.isrtlmode = "vertical-rl" == p || "tb" == p || "tb-rl" == p || "rl-tb" == p, this.isvertical = "vertical-rl" == p || "tb" == p || "tb-rl" == p)
            } else this.isrtlmode = !0 === this.opt.rtlmode, this.isvertical = !1;
            this.observerbody = this.observerremover = this.observer = this.scrollmom = this.scrollrunning = !1;
            do this.id = "ascrail" + P++; while (document.getElementById(this.id));
            this.hasmousefocus = this.hasfocus = this.zoomactive = this.zoom = this.selectiondrag = this.cursorfreezed = this.cursor = this.rail = !1;
            this.visibility = !0;
            this.hidden = this.locked = this.railslocked = !1;
            this.cursoractive = !0;
            this.wheelprevented = !1;
            this.overflowx = a.opt.overflowx;
            this.overflowy = a.opt.overflowy;
            this.nativescrollingarea = !1;
            this.checkarea = 0;
            this.events = [];
            this.saved = {};
            this.delaylist = {};
            this.synclist = {};
            this.lastdeltay = this.lastdeltax = 0;
            this.detected = R();
            var e = f.extend({}, this.detected);
            this.ishwscroll = (this.canhwscroll = e.hastransform && a.opt.hwacceleration) && a.haswrapper;
            this.hasreversehr = this.isrtlmode ? this.isvertical ? !(e.iswebkit || e.isie || e.isie11) : !(e.iswebkit || e.isie && !e.isie10 && !e.isie11) : !1;
            this.istouchcapable = !1;
            e.cantouch || !e.hasw3ctouch && !e.hasmstouch ? !e.cantouch || e.isios || e.isandroid || !e.iswebkit && !e.ismozilla || (this.istouchcapable = !0) : this.istouchcapable = !0;
            a.opt.enablemouselockapi || (e.hasmousecapture = !1, e.haspointerlock = !1);
            this.debounced = function(b, g, c) {
                a && (a.delaylist[b] || (g.call(a), a.delaylist[b] = {
                    h: v(function() {
                        a.delaylist[b].fn.call(a);
                        a.delaylist[b] = !1
                    }, c)
                }), a.delaylist[b].fn = g)
            };
            var I = !1;
            this.synched = function(b, g) {
                a.synclist[b] = g;
                (function() {
                    I || (v(function() {
                        if (a) {
                            I = !1;
                            for (var b in a.synclist) {
                                var g = a.synclist[b];
                                g && g.call(a);
                                a.synclist[b] = !1
                            }
                        }
                    }), I = !0)
                })();
                return b
            };
            this.unsynched = function(b) {
                a.synclist[b] && (a.synclist[b] = !1)
            };
            this.css = function(b, g) {
                for (var c in g) a.saved.css.push([b, c, b.css(c)]), b.css(c, g[c])
            };
            this.scrollTop = function(b) {
                return void 0 === b ? a.getScrollTop() : a.setScrollTop(b)
            };
            this.scrollLeft = function(b) {
                return void 0 === b ? a.getScrollLeft() : a.setScrollLeft(b)
            };
            var D = function(a, g, c, d, e, f, k) {
                this.st = a;
                this.ed = g;
                this.spd = c;
                this.p1 = d || 0;
                this.p2 = e || 1;
                this.p3 = f || 0;
                this.p4 = k || 1;
                this.ts = (new Date).getTime();
                this.df = this.ed - this.st
            };
            D.prototype = {
                B2: function(a) {
                    return 3 * a * a * (1 - a)
                },
                B3: function(a) {
                    return 3 * a * (1 - a) * (1 - a)
                },
                B4: function(a) {
                    return (1 - a) * (1 - a) * (1 - a)
                },
                getNow: function() {
                    var a = 1 - ((new Date).getTime() - this.ts) / this.spd,
                        g = this.B2(a) + this.B3(a) + this.B4(a);
                    return 0 > a ? this.ed : this.st + Math.round(this.df * g)
                },
                update: function(a, g) {
                    this.st = this.getNow();
                    this.ed = a;
                    this.spd = g;
                    this.ts = (new Date).getTime();
                    this.df = this.ed - this.st;
                    return this
                }
            };
            if (this.ishwscroll) {
                this.doc.translate = {
                    x: 0,
                    y: 0,
                    tx: "0px",
                    ty: "0px"
                };
                e.hastranslate3d && e.isios && this.doc.css("-webkit-backface-visibility", "hidden");
                this.getScrollTop = function(b) {
                    if (!b) {
                        if (b = k()) return 16 == b.length ? -b[13] : -b[5];
                        if (a.timerscroll && a.timerscroll.bz) return a.timerscroll.bz.getNow()
                    }
                    return a.doc.translate.y
                };
                this.getScrollLeft = function(b) {
                    if (!b) {
                        if (b = k()) return 16 == b.length ? -b[12] : -b[4];
                        if (a.timerscroll && a.timerscroll.bh) return a.timerscroll.bh.getNow()
                    }
                    return a.doc.translate.x
                };
                this.notifyScrollEvent = function(a) {
                    var g = document.createEvent("UIEvents");
                    g.initUIEvent("scroll", !1, !0, window, 1);
                    g.niceevent = !0;
                    a.dispatchEvent(g)
                };
                var y = this.isrtlmode ? 1 : -1;
                e.hastranslate3d && a.opt.enabletranslate3d ? (this.setScrollTop = function(b, g) {
                    a.doc.translate.y = b;
                    a.doc.translate.ty = -1 * b + "px";
                    a.doc.css(e.trstyle, "translate3d(" + a.doc.translate.tx + "," + a.doc.translate.ty + ",0px)");
                    g || a.notifyScrollEvent(a.win[0])
                }, this.setScrollLeft = function(b, g) {
                    a.doc.translate.x = b;
                    a.doc.translate.tx = b * y + "px";
                    a.doc.css(e.trstyle, "translate3d(" + a.doc.translate.tx + "," + a.doc.translate.ty + ",0px)");
                    g || a.notifyScrollEvent(a.win[0])
                }) : (this.setScrollTop = function(b, g) {
                    a.doc.translate.y = b;
                    a.doc.translate.ty = -1 * b + "px";
                    a.doc.css(e.trstyle, "translate(" + a.doc.translate.tx + "," + a.doc.translate.ty + ")");
                    g || a.notifyScrollEvent(a.win[0])
                }, this.setScrollLeft = function(b, g) {
                    a.doc.translate.x = b;
                    a.doc.translate.tx = b * y + "px";
                    a.doc.css(e.trstyle, "translate(" + a.doc.translate.tx + "," + a.doc.translate.ty + ")");
                    g || a.notifyScrollEvent(a.win[0])
                })
            } else this.getScrollTop = function() {
                return a.docscroll.scrollTop()
            }, this.setScrollTop = function(b) {
                return setTimeout(function() {
                    a && a.docscroll.scrollTop(b)
                }, 1)
            }, this.getScrollLeft = function() {
                return a.hasreversehr ? a.detected.ismozilla ? a.page.maxw - Math.abs(a.docscroll.scrollLeft()) : a.page.maxw - a.docscroll.scrollLeft() : a.docscroll.scrollLeft()
            }, this.setScrollLeft = function(b) {
                return setTimeout(function() {
                    if (a) return a.hasreversehr && (b = a.detected.ismozilla ? -(a.page.maxw - b) : a.page.maxw - b), a.docscroll.scrollLeft(b)
                }, 1)
            };
            this.getTarget = function(a) {
                return a ? a.target ? a.target : a.srcElement ? a.srcElement : !1 : !1
            };
            this.hasParent = function(a, g) {
                if (!a) return !1;
                for (var c = a.target || a.srcElement || a || !1; c && c.id != g;) c = c.parentNode || !1;
                return !1 !== c
            };
            var z = {
                thin: 1,
                medium: 3,
                thick: 5
            };
            this.getDocumentScrollOffset = function() {
                return {
                    top: window.pageYOffset || document.documentElement.scrollTop,
                    left: window.pageXOffset || document.documentElement.scrollLeft
                }
            };
            this.getOffset = function() {
                if (a.isfixed) {
                    var b = a.win.offset(),
                        g = a.getDocumentScrollOffset();
                    b.top -= g.top;
                    b.left -= g.left;
                    return b
                }
                b = a.win.offset();
                if (!a.viewport) return b;
                g = a.viewport.offset();
                return {
                    top: b.top - g.top,
                    left: b.left - g.left
                }
            };
            this.updateScrollBar = function(b) {
                var g, c, e;
                if (a.ishwscroll) a.rail.css({
                    height: a.win.innerHeight() - (a.opt.railpadding.top + a.opt.railpadding.bottom)
                }), a.railh && a.railh.css({
                    width: a.win.innerWidth() - (a.opt.railpadding.left + a.opt.railpadding.right)
                });
                else {
                    var f = a.getOffset();
                    g = f.top;
                    c = f.left - (a.opt.railpadding.left + a.opt.railpadding.right);
                    g += d(a.win, "border-top-width", !0);
                    c += a.rail.align ? a.win.outerWidth() - d(a.win, "border-right-width") - a.rail.width : d(a.win, "border-left-width");
                    if (e = a.opt.railoffset) e.top && (g += e.top), e.left && (c += e.left);
                    a.railslocked || a.rail.css({
                        top: g,
                        left: c,
                        height: (b ? b.h : a.win.innerHeight()) - (a.opt.railpadding.top + a.opt.railpadding.bottom)
                    });
                    a.zoom && a.zoom.css({
                        top: g + 1,
                        left: 1 == a.rail.align ? c - 20 : c + a.rail.width + 4
                    });
                    if (a.railh && !a.railslocked) {
                        g = f.top;
                        c = f.left;
                        if (e = a.opt.railhoffset) e.top && (g += e.top), e.left && (c += e.left);
                        b = a.railh.align ? g + d(a.win, "border-top-width", !0) + a.win.innerHeight() - a.railh.height : g + d(a.win, "border-top-width", !0);
                        c += d(a.win, "border-left-width");
                        a.railh.css({
                            top: b - (a.opt.railpadding.top + a.opt.railpadding.bottom),
                            left: c,
                            width: a.railh.width
                        })
                    }
                }
            };
            this.doRailClick = function(b, g, c) {
                var d;
                a.railslocked || (a.cancelEvent(b), g ? (g = c ? a.doScrollLeft : a.doScrollTop, d = c ? (b.pageX - a.railh.offset().left - a.cursorwidth / 2) * a.scrollratio.x : (b.pageY - a.rail.offset().top - a.cursorheight / 2) * a.scrollratio.y, g(d)) : (g = c ? a.doScrollLeftBy : a.doScrollBy, d = c ? a.scroll.x : a.scroll.y, b = c ? b.pageX - a.railh.offset().left : b.pageY - a.rail.offset().top, c = c ? a.view.w : a.view.h, g(d >= b ? c : -c)))
            };
            a.hasanimationframe = v;
            a.hascancelanimationframe = w;
            a.hasanimationframe ? a.hascancelanimationframe || (w = function() {
                a.cancelAnimationFrame = !0
            }) : (v = function(a) {
                return setTimeout(a, 15 - Math.floor(+new Date / 1E3) % 16)
            }, w = clearTimeout);
            this.init = function() {
                a.saved.css = [];
                if (e.isie7mobile || e.isoperamini) return !0;
                e.hasmstouch && a.css(a.ispage ? f("html") : a.win, {
                    _touchaction: "none"
                });
                var b = e.ismodernie || e.isie10 ? {
                    "-ms-overflow-style": "none"
                } : {
                    "overflow-y": "hidden"
                };
                a.zindex = "auto";
                a.zindex = a.ispage || "auto" != a.opt.zindex ? a.opt.zindex : l() || "auto";
                !a.ispage && "auto" != a.zindex && a.zindex > A && (A = a.zindex);
                a.isie && 0 == a.zindex && "auto" == a.opt.zindex && (a.zindex = "auto");
                if (!a.ispage || !e.cantouch && !e.isieold && !e.isie9mobile) {
                    var c = a.docscroll;
                    a.ispage && (c = a.haswrapper ? a.win : a.doc);
                    e.isie9mobile || a.css(c, b);
                    a.ispage && e.isie7 && ("BODY" == a.doc[0].nodeName ? a.css(f("html"), {
                        "overflow-y": "hidden"
                    }) : "HTML" == a.doc[0].nodeName && a.css(f("body"), b));
                    !e.isios || a.ispage || a.haswrapper || a.css(f("body"), {
                        "-webkit-overflow-scrolling": "touch"
                    });
                    var d = f(document.createElement("div"));
                    d.css({
                        position: "relative",
                        top: 0,
                        "float": "right",
                        width: a.opt.cursorwidth,
                        height: 0,
                        "background-color": a.opt.cursorcolor,
                        border: a.opt.cursorborder,
                        "background-clip": "padding-box",
                        "-webkit-border-radius": a.opt.cursorborderradius,
                        "-moz-border-radius": a.opt.cursorborderradius,
                        "border-radius": a.opt.cursorborderradius
                    });
                    d.hborder = parseFloat(d.outerHeight() - d.innerHeight());
                    d.addClass("nicescroll-cursors");
                    a.cursor = d;
                    var m = f(document.createElement("div"));
                    m.attr("id", a.id);
                    m.addClass("nicescroll-rails nicescroll-rails-vr");
                    var k, h, p = ["left", "right", "top", "bottom"],
                        L;
                    for (L in p) h = p[L], (k = a.opt.railpadding[h]) ? m.css("padding-" + h, k + "px") : a.opt.railpadding[h] = 0;
                    m.append(d);
                    m.width = Math.max(parseFloat(a.opt.cursorwidth), d.outerWidth());
                    m.css({
                        width: m.width + "px",
                        zIndex: a.zindex,
                        background: a.opt.background,
                        cursor: "default"
                    });
                    m.visibility = !0;
                    m.scrollable = !0;
                    m.align = "left" == a.opt.railalign ? 0 : 1;
                    a.rail = m;
                    d = a.rail.drag = !1;
                    !a.opt.boxzoom || a.ispage || e.isieold || (d = document.createElement("div"), a.bind(d, "click", a.doZoom), a.bind(d, "mouseenter", function() {
                        a.zoom.css("opacity", a.opt.cursoropacitymax)
                    }), a.bind(d, "mouseleave", function() {
                        a.zoom.css("opacity", a.opt.cursoropacitymin)
                    }), a.zoom = f(d), a.zoom.css({
                        cursor: "pointer",
                        zIndex: a.zindex,
                        backgroundImage: "url(" + a.opt.scriptpath + "zoomico.png)",
                        height: 18,
                        width: 18,
                        backgroundPosition: "0px 0px"
                    }), a.opt.dblclickzoom && a.bind(a.win, "dblclick", a.doZoom), e.cantouch && a.opt.gesturezoom && (a.ongesturezoom = function(b) {
                        1.5 < b.scale && a.doZoomIn(b);
                        .8 > b.scale && a.doZoomOut(b);
                        return a.cancelEvent(b)
                    }, a.bind(a.win, "gestureend", a.ongesturezoom)));
                    a.railh = !1;
                    var n;
                    a.opt.horizrailenabled && (a.css(c, {
                        overflowX: "hidden"
                    }), d = f(document.createElement("div")), d.css({
                        position: "absolute",
                        top: 0,
                        height: a.opt.cursorwidth,
                        width: 0,
                        backgroundColor: a.opt.cursorcolor,
                        border: a.opt.cursorborder,
                        backgroundClip: "padding-box",
                        "-webkit-border-radius": a.opt.cursorborderradius,
                        "-moz-border-radius": a.opt.cursorborderradius,
                        "border-radius": a.opt.cursorborderradius
                    }), e.isieold && d.css("overflow", "hidden"), d.wborder = parseFloat(d.outerWidth() - d.innerWidth()), d.addClass("nicescroll-cursors"), a.cursorh = d, n = f(document.createElement("div")), n.attr("id", a.id + "-hr"), n.addClass("nicescroll-rails nicescroll-rails-hr"), n.height = Math.max(parseFloat(a.opt.cursorwidth), d.outerHeight()), n.css({
                        height: n.height + "px",
                        zIndex: a.zindex,
                        background: a.opt.background
                    }), n.append(d), n.visibility = !0, n.scrollable = !0, n.align = "top" == a.opt.railvalign ? 0 : 1, a.railh = n, a.railh.drag = !1);
                    a.ispage ? (m.css({
                        position: "fixed",
                        top: 0,
                        height: "100%"
                    }), m.align ? m.css({
                        right: 0
                    }) : m.css({
                        left: 0
                    }), a.body.append(m), a.railh && (n.css({
                        position: "fixed",
                        left: 0,
                        width: "100%"
                    }), n.align ? n.css({
                        bottom: 0
                    }) : n.css({
                        top: 0
                    }), a.body.append(n))) : (a.ishwscroll ? ("static" == a.win.css("position") && a.css(a.win, {
                        position: "relative"
                    }), c = "HTML" == a.win[0].nodeName ? a.body : a.win, f(c).scrollTop(0).scrollLeft(0), a.zoom && (a.zoom.css({
                        position: "absolute",
                        top: 1,
                        right: 0,
                        "margin-right": m.width + 4
                    }), c.append(a.zoom)), m.css({
                        position: "absolute",
                        top: 0
                    }), m.align ? m.css({
                        right: 0
                    }) : m.css({
                        left: 0
                    }), c.append(m), n && (n.css({
                        position: "absolute",
                        left: 0,
                        bottom: 0
                    }), n.align ? n.css({
                        bottom: 0
                    }) : n.css({
                        top: 0
                    }), c.append(n))) : (a.isfixed = "fixed" == a.win.css("position"), c = a.isfixed ? "fixed" : "absolute", a.isfixed || (a.viewport = a.getViewport(a.win[0])), a.viewport && (a.body = a.viewport, 0 == /fixed|absolute/.test(a.viewport.css("position")) && a.css(a.viewport, {
                        position: "relative"
                    })), m.css({
                        position: c
                    }), a.zoom && a.zoom.css({
                        position: c
                    }), a.updateScrollBar(), a.body.append(m), a.zoom && a.body.append(a.zoom), a.railh && (n.css({
                        position: c
                    }), a.body.append(n))), e.isios && a.css(a.win, {
                        "-webkit-tap-highlight-color": "rgba(0,0,0,0)",
                        "-webkit-touch-callout": "none"
                    }), e.isie && a.opt.disableoutline && a.win.attr("hideFocus", "true"), e.iswebkit && a.opt.disableoutline && a.win.css("outline", "none"));
                    !1 === a.opt.autohidemode ? (a.autohidedom = !1, a.rail.css({
                        opacity: a.opt.cursoropacitymax
                    }), a.railh && a.railh.css({
                        opacity: a.opt.cursoropacitymax
                    })) : !0 === a.opt.autohidemode || "leave" === a.opt.autohidemode ? (a.autohidedom = f().add(a.rail), e.isie8 && (a.autohidedom = a.autohidedom.add(a.cursor)), a.railh && (a.autohidedom = a.autohidedom.add(a.railh)), a.railh && e.isie8 && (a.autohidedom = a.autohidedom.add(a.cursorh))) : "scroll" == a.opt.autohidemode ? (a.autohidedom = f().add(a.rail), a.railh && (a.autohidedom = a.autohidedom.add(a.railh))) : "cursor" == a.opt.autohidemode ? (a.autohidedom = f().add(a.cursor), a.railh && (a.autohidedom = a.autohidedom.add(a.cursorh))) : "hidden" == a.opt.autohidemode && (a.autohidedom = !1, a.hide(), a.railslocked = !1);
                    if (e.isie9mobile) a.scrollmom = new M(a), a.onmangotouch = function() {
                        var b = a.getScrollTop(),
                            c = a.getScrollLeft();
                        if (b == a.scrollmom.lastscrolly && c == a.scrollmom.lastscrollx) return !0;
                        var g = b - a.mangotouch.sy,
                            d = c - a.mangotouch.sx;
                        if (0 != Math.round(Math.sqrt(Math.pow(d, 2) + Math.pow(g, 2)))) {
                            var e = 0 > g ? -1 : 1,
                                f = 0 > d ? -1 : 1,
                                u = +new Date;
                            a.mangotouch.lazy && clearTimeout(a.mangotouch.lazy);
                            80 < u - a.mangotouch.tm || a.mangotouch.dry != e || a.mangotouch.drx != f ? (a.scrollmom.stop(), a.scrollmom.reset(c, b), a.mangotouch.sy = b, a.mangotouch.ly = b, a.mangotouch.sx = c, a.mangotouch.lx = c, a.mangotouch.dry = e, a.mangotouch.drx = f, a.mangotouch.tm = u) : (a.scrollmom.stop(), a.scrollmom.update(a.mangotouch.sx - d, a.mangotouch.sy - g), a.mangotouch.tm = u, g = Math.max(Math.abs(a.mangotouch.ly - b), Math.abs(a.mangotouch.lx - c)), a.mangotouch.ly = b, a.mangotouch.lx = c, 2 < g && (a.mangotouch.lazy = setTimeout(function() {
                                a.mangotouch.lazy = !1;
                                a.mangotouch.dry = 0;
                                a.mangotouch.drx = 0;
                                a.mangotouch.tm = 0;
                                a.scrollmom.doMomentum(30)
                            }, 100)))
                        }
                    }, m = a.getScrollTop(), n = a.getScrollLeft(), a.mangotouch = {
                        sy: m,
                        ly: m,
                        dry: 0,
                        sx: n,
                        lx: n,
                        drx: 0,
                        lazy: !1,
                        tm: 0
                    }, a.bind(a.docscroll, "scroll", a.onmangotouch);
                    else {
                        if (e.cantouch || a.istouchcapable || a.opt.touchbehavior || e.hasmstouch) {
                            a.scrollmom = new M(a);
                            a.ontouchstart = function(b) {
                                if (b.pointerType && 2 != b.pointerType && "touch" != b.pointerType) return !1;
                                a.hasmoving = !1;
                                if (!a.railslocked) {
                                    var c;
                                    if (e.hasmstouch)
                                        for (c = b.target ? b.target : !1; c;) {
                                            var g = f(c).getNiceScroll();
                                            if (0 < g.length && g[0].me == a.me) break;
                                            if (0 < g.length) return !1;
                                            if ("DIV" == c.nodeName && c.id == a.id) break;
                                            c = c.parentNode ? c.parentNode : !1
                                        }
                                    a.cancelScroll();
                                    if ((c = a.getTarget(b)) && /INPUT/i.test(c.nodeName) && /range/i.test(c.type)) return a.stopPropagation(b);
                                    !("clientX" in b) && "changedTouches" in b && (b.clientX = b.changedTouches[0].clientX, b.clientY = b.changedTouches[0].clientY);
                                    a.forcescreen && (g = b, b = {
                                        original: b.original ? b.original : b
                                    }, b.clientX = g.screenX, b.clientY = g.screenY);
                                    a.rail.drag = {
                                        x: b.clientX,
                                        y: b.clientY,
                                        sx: a.scroll.x,
                                        sy: a.scroll.y,
                                        st: a.getScrollTop(),
                                        sl: a.getScrollLeft(),
                                        pt: 2,
                                        dl: !1
                                    };
                                    if (a.ispage || !a.opt.directionlockdeadzone) a.rail.drag.dl = "f";
                                    else {
                                        var g = f(window).width(),
                                            d = f(window).height(),
                                            d = Math.max(0, Math.max(document.body.scrollHeight, document.documentElement.scrollHeight) - d),
                                            g = Math.max(0, Math.max(document.body.scrollWidth, document.documentElement.scrollWidth) - g);
                                        a.rail.drag.ck = !a.rail.scrollable && a.railh.scrollable ? 0 < d ? "v" : !1 : a.rail.scrollable && !a.railh.scrollable ? 0 < g ? "h" : !1 : !1;
                                        a.rail.drag.ck || (a.rail.drag.dl = "f")
                                    }
                                    a.opt.touchbehavior && a.isiframe && e.isie && (g = a.win.position(), a.rail.drag.x += g.left, a.rail.drag.y += g.top);
                                    a.hasmoving = !1;
                                    a.lastmouseup = !1;
                                    a.scrollmom.reset(b.clientX, b.clientY);
                                    if (!e.cantouch && !this.istouchcapable && !b.pointerType) {
                                        if (!c || !/INPUT|SELECT|TEXTAREA/i.test(c.nodeName)) return !a.ispage && e.hasmousecapture && c.setCapture(), a.opt.touchbehavior ? (c.onclick && !c._onclick && (c._onclick = c.onclick, c.onclick = function(b) {
                                            if (a.hasmoving) return !1;
                                            c._onclick.call(this, b)
                                        }), a.cancelEvent(b)) : a.stopPropagation(b);
                                        /SUBMIT|CANCEL|BUTTON/i.test(f(c).attr("type")) && (pc = {
                                            tg: c,
                                            click: !1
                                        }, a.preventclick = pc)
                                    }
                                }
                            };
                            a.ontouchend = function(b) {
                                if (!a.rail.drag) return !0;
                                if (2 == a.rail.drag.pt) {
                                    if (b.pointerType && 2 != b.pointerType && "touch" != b.pointerType) return !1;
                                    a.scrollmom.doMomentum();
                                    a.rail.drag = !1;
                                    if (a.hasmoving && (a.lastmouseup = !0, a.hideCursor(), e.hasmousecapture && document.releaseCapture(), !e.cantouch)) return a.cancelEvent(b)
                                } else if (1 == a.rail.drag.pt) return a.onmouseup(b)
                            };
                            var q = a.opt.touchbehavior && a.isiframe && !e.hasmousecapture;
                            a.ontouchmove = function(b, c) {
                                if (!a.rail.drag || b.targetTouches && a.opt.preventmultitouchscrolling && 1 < b.targetTouches.length || b.pointerType && 2 != b.pointerType && "touch" != b.pointerType) return !1;
                                if (2 == a.rail.drag.pt) {
                                    if (e.cantouch && e.isios && void 0 === b.original) return !0;
                                    a.hasmoving = !0;
                                    a.preventclick && !a.preventclick.click && (a.preventclick.click = a.preventclick.tg.onclick || !1, a.preventclick.tg.onclick = a.onpreventclick);
                                    b = f.extend({
                                        original: b
                                    }, b);
                                    "changedTouches" in b && (b.clientX = b.changedTouches[0].clientX, b.clientY = b.changedTouches[0].clientY);
                                    if (a.forcescreen) {
                                        var g = b;
                                        b = {
                                            original: b.original ? b.original : b
                                        };
                                        b.clientX = g.screenX;
                                        b.clientY = g.screenY
                                    }
                                    var d, g = d = 0;
                                    q && !c && (d = a.win.position(), g = -d.left, d = -d.top);
                                    var u = b.clientY + d;
                                    d = u - a.rail.drag.y;
                                    var m = b.clientX + g,
                                        k = m - a.rail.drag.x,
                                        h = a.rail.drag.st - d;
                                    a.ishwscroll && a.opt.bouncescroll ? 0 > h ? h = Math.round(h / 2) : h > a.page.maxh && (h = a.page.maxh + Math.round((h - a.page.maxh) / 2)) : (0 > h && (u = h = 0), h > a.page.maxh && (h = a.page.maxh, u = 0));
                                    var l;
                                    a.railh && a.railh.scrollable && (l = a.isrtlmode ? k - a.rail.drag.sl : a.rail.drag.sl - k, a.ishwscroll && a.opt.bouncescroll ? 0 > l ? l = Math.round(l / 2) : l > a.page.maxw && (l = a.page.maxw + Math.round((l - a.page.maxw) / 2)) : (0 > l && (m = l = 0), l > a.page.maxw && (l = a.page.maxw, m = 0)));
                                    g = !1;
                                    if (a.rail.drag.dl) g = !0, "v" == a.rail.drag.dl ? l = a.rail.drag.sl : "h" == a.rail.drag.dl && (h = a.rail.drag.st);
                                    else {
                                        d = Math.abs(d);
                                        var k = Math.abs(k),
                                            C = a.opt.directionlockdeadzone;
                                        if ("v" == a.rail.drag.ck) {
                                            if (d > C && k <= .3 * d) return a.rail.drag = !1, !0;
                                            k > C && (a.rail.drag.dl = "f", f("body").scrollTop(f("body").scrollTop()))
                                        } else if ("h" == a.rail.drag.ck) {
                                            if (k > C && d <= .3 * k) return a.rail.drag = !1, !0;
                                            d > C && (a.rail.drag.dl = "f", f("body").scrollLeft(f("body").scrollLeft()))
                                        }
                                    }
                                    a.synched("touchmove", function() {
                                        a.rail.drag && 2 == a.rail.drag.pt && (a.prepareTransition && a.prepareTransition(0), a.rail.scrollable && a.setScrollTop(h), a.scrollmom.update(m, u), a.railh && a.railh.scrollable ? (a.setScrollLeft(l), a.showCursor(h, l)) : a.showCursor(h), e.isie10 && document.selection.clear())
                                    });
                                    e.ischrome && a.istouchcapable && (g = !1);
                                    if (g) return a.cancelEvent(b)
                                } else if (1 == a.rail.drag.pt) return a.onmousemove(b)
                            }
                        }
                        a.onmousedown = function(b, c) {
                            if (!a.rail.drag || 1 == a.rail.drag.pt) {
                                if (a.railslocked) return a.cancelEvent(b);
                                a.cancelScroll();
                                a.rail.drag = {
                                    x: b.clientX,
                                    y: b.clientY,
                                    sx: a.scroll.x,
                                    sy: a.scroll.y,
                                    pt: 1,
                                    hr: !!c
                                };
                                var g = a.getTarget(b);
                                !a.ispage && e.hasmousecapture && g.setCapture();
                                a.isiframe && !e.hasmousecapture && (a.saved.csspointerevents = a.doc.css("pointer-events"), a.css(a.doc, {
                                    "pointer-events": "none"
                                }));
                                a.hasmoving = !1;
                                return a.cancelEvent(b)
                            }
                        };
                        a.onmouseup = function(b) {
                            if (a.rail.drag) {
                                if (1 != a.rail.drag.pt) return !0;
                                e.hasmousecapture && document.releaseCapture();
                                a.isiframe && !e.hasmousecapture && a.doc.css("pointer-events", a.saved.csspointerevents);
                                a.rail.drag = !1;
                                a.hasmoving && a.triggerScrollEnd();
                                return a.cancelEvent(b)
                            }
                        };
                        a.onmousemove = function(b) {
                            if (a.rail.drag) {
                                if (1 == a.rail.drag.pt) {
                                    if (e.ischrome && 0 == b.which) return a.onmouseup(b);
                                    a.cursorfreezed = !0;
                                    a.hasmoving = !0;
                                    if (a.rail.drag.hr) {
                                        a.scroll.x = a.rail.drag.sx + (b.clientX - a.rail.drag.x);
                                        0 > a.scroll.x && (a.scroll.x = 0);
                                        var c = a.scrollvaluemaxw;
                                        a.scroll.x > c && (a.scroll.x = c)
                                    } else a.scroll.y = a.rail.drag.sy + (b.clientY - a.rail.drag.y), 0 > a.scroll.y && (a.scroll.y = 0), c = a.scrollvaluemax, a.scroll.y > c && (a.scroll.y = c);
                                    a.synched("mousemove", function() {
                                        a.rail.drag && 1 == a.rail.drag.pt && (a.showCursor(), a.rail.drag.hr ? a.hasreversehr ? a.doScrollLeft(a.scrollvaluemaxw - Math.round(a.scroll.x * a.scrollratio.x), a.opt.cursordragspeed) : a.doScrollLeft(Math.round(a.scroll.x * a.scrollratio.x), a.opt.cursordragspeed) : a.doScrollTop(Math.round(a.scroll.y * a.scrollratio.y), a.opt.cursordragspeed))
                                    });
                                    return a.cancelEvent(b)
                                }
                            } else a.checkarea = 0
                        };
                        if (e.cantouch || a.opt.touchbehavior) a.onpreventclick = function(b) {
                            if (a.preventclick) return a.preventclick.tg.onclick = a.preventclick.click, a.preventclick = !1, a.cancelEvent(b)
                        }, a.bind(a.win, "mousedown", a.ontouchstart), a.onclick = e.isios ? !1 : function(b) {
                            return a.lastmouseup ? (a.lastmouseup = !1, a.cancelEvent(b)) : !0
                        }, a.opt.grabcursorenabled && e.cursorgrabvalue && (a.css(a.ispage ? a.doc : a.win, {
                            cursor: e.cursorgrabvalue
                        }), a.css(a.rail, {
                            cursor: e.cursorgrabvalue
                        }));
                        else {
                            var r = function(b) {
                                if (a.selectiondrag) {
                                    if (b) {
                                        var c = a.win.outerHeight();
                                        b = b.pageY - a.selectiondrag.top;
                                        0 < b && b < c && (b = 0);
                                        b >= c && (b -= c);
                                        a.selectiondrag.df = b
                                    }
                                    0 != a.selectiondrag.df && (a.doScrollBy(2 * -Math.floor(a.selectiondrag.df / 6)), a.debounced("doselectionscroll", function() {
                                        r()
                                    }, 50))
                                }
                            };
                            a.hasTextSelected = "getSelection" in document ? function() {
                                return 0 < document.getSelection().rangeCount
                            } : "selection" in document ? function() {
                                return "None" != document.selection.type
                            } : function() {
                                return !1
                            };
                            a.onselectionstart = function(b) {
                                a.ispage || (a.selectiondrag = a.win.offset())
                            };
                            a.onselectionend = function(b) {
                                a.selectiondrag = !1
                            };
                            a.onselectiondrag = function(b) {
                                a.selectiondrag && a.hasTextSelected() && a.debounced("selectionscroll", function() {
                                    r(b)
                                }, 250)
                            }
                        }
                        e.hasw3ctouch ? (a.css(a.rail, {
                            "touch-action": "none"
                        }), a.css(a.cursor, {
                            "touch-action": "none"
                        }), a.bind(a.win, "pointerdown", a.ontouchstart), a.bind(document, "pointerup", a.ontouchend), a.bind(document, "pointermove", a.ontouchmove)) : e.hasmstouch ? (a.css(a.rail, {
                            "-ms-touch-action": "none"
                        }), a.css(a.cursor, {
                            "-ms-touch-action": "none"
                        }), a.bind(a.win, "MSPointerDown", a.ontouchstart), a.bind(document, "MSPointerUp", a.ontouchend), a.bind(document, "MSPointerMove", a.ontouchmove), a.bind(a.cursor, "MSGestureHold", function(a) {
                            a.preventDefault()
                        }), a.bind(a.cursor, "contextmenu", function(a) {
                            a.preventDefault()
                        })) : this.istouchcapable && (a.bind(a.win, "touchstart", a.ontouchstart), a.bind(document, "touchend", a.ontouchend), a.bind(document, "touchcancel", a.ontouchend), a.bind(document, "touchmove", a.ontouchmove));
                        if (a.opt.cursordragontouch || !e.cantouch && !a.opt.touchbehavior) a.rail.css({
                            cursor: "default"
                        }), a.railh && a.railh.css({
                            cursor: "default"
                        }), a.jqbind(a.rail, "mouseenter", function() {
                            if (!a.ispage && !a.win.is(":visible")) return !1;
                            a.canshowonmouseevent && a.showCursor();
                            a.rail.active = !0
                        }), a.jqbind(a.rail, "mouseleave", function() {
                            a.rail.active = !1;
                            a.rail.drag || a.hideCursor()
                        }), a.opt.sensitiverail && (a.bind(a.rail, "click", function(b) {
                            a.doRailClick(b, !1, !1)
                        }), a.bind(a.rail, "dblclick", function(b) {
                            a.doRailClick(b, !0, !1)
                        }), a.bind(a.cursor, "click", function(b) {
                            a.cancelEvent(b)
                        }), a.bind(a.cursor, "dblclick", function(b) {
                            a.cancelEvent(b)
                        })), a.railh && (a.jqbind(a.railh, "mouseenter", function() {
                            if (!a.ispage && !a.win.is(":visible")) return !1;
                            a.canshowonmouseevent && a.showCursor();
                            a.rail.active = !0
                        }), a.jqbind(a.railh, "mouseleave", function() {
                            a.rail.active = !1;
                            a.rail.drag || a.hideCursor()
                        }), a.opt.sensitiverail && (a.bind(a.railh, "click", function(b) {
                            a.doRailClick(b, !1, !0)
                        }), a.bind(a.railh, "dblclick", function(b) {
                            a.doRailClick(b, !0, !0)
                        }), a.bind(a.cursorh, "click", function(b) {
                            a.cancelEvent(b)
                        }), a.bind(a.cursorh, "dblclick", function(b) {
                            a.cancelEvent(b)
                        })));
                        e.cantouch || a.opt.touchbehavior ? (a.bind(e.hasmousecapture ? a.win : document, "mouseup", a.ontouchend), a.bind(document, "mousemove", a.ontouchmove), a.onclick && a.bind(document, "click", a.onclick), a.opt.cursordragontouch ? (a.bind(a.cursor, "mousedown", a.onmousedown), a.bind(a.cursor, "mouseup", a.onmouseup), a.cursorh && a.bind(a.cursorh, "mousedown", function(b) {
                            a.onmousedown(b, !0)
                        }), a.cursorh && a.bind(a.cursorh, "mouseup", a.onmouseup)) : (a.bind(a.rail, "mousedown", function(a) {
                            a.preventDefault()
                        }), a.railh && a.bind(a.railh, "mousedown", function(a) {
                            a.preventDefault()
                        }))) : (a.bind(e.hasmousecapture ? a.win : document, "mouseup", a.onmouseup), a.bind(document, "mousemove", a.onmousemove), a.onclick && a.bind(document, "click", a.onclick), a.bind(a.cursor, "mousedown", a.onmousedown), a.bind(a.cursor, "mouseup", a.onmouseup), a.railh && (a.bind(a.cursorh, "mousedown", function(b) {
                            a.onmousedown(b, !0)
                        }), a.bind(a.cursorh, "mouseup", a.onmouseup)), !a.ispage && a.opt.enablescrollonselection && (a.bind(a.win[0], "mousedown", a.onselectionstart), a.bind(document, "mouseup", a.onselectionend), a.bind(a.cursor, "mouseup", a.onselectionend), a.cursorh && a.bind(a.cursorh, "mouseup", a.onselectionend), a.bind(document, "mousemove", a.onselectiondrag)), a.zoom && (a.jqbind(a.zoom, "mouseenter", function() {
                            a.canshowonmouseevent && a.showCursor();
                            a.rail.active = !0
                        }), a.jqbind(a.zoom, "mouseleave", function() {
                            a.rail.active = !1;
                            a.rail.drag || a.hideCursor()
                        })));
                        a.opt.enablemousewheel && (a.isiframe || a.mousewheel(e.isie && a.ispage ? document : a.win, a.onmousewheel), a.mousewheel(a.rail, a.onmousewheel), a.railh && a.mousewheel(a.railh, a.onmousewheelhr));
                        a.ispage || e.cantouch || /HTML|^BODY/.test(a.win[0].nodeName) || (a.win.attr("tabindex") || a.win.attr({
                            tabindex: O++
                        }), a.jqbind(a.win, "focus", function(b) {
                            B = a.getTarget(b).id || !0;
                            a.hasfocus = !0;
                            a.canshowonmouseevent && a.noticeCursor()
                        }), a.jqbind(a.win, "blur", function(b) {
                            B = !1;
                            a.hasfocus = !1
                        }), a.jqbind(a.win, "mouseenter", function(b) {
                            F = a.getTarget(b).id || !0;
                            a.hasmousefocus = !0;
                            a.canshowonmouseevent && a.noticeCursor()
                        }), a.jqbind(a.win, "mouseleave", function() {
                            F = !1;
                            a.hasmousefocus = !1;
                            a.rail.drag || a.hideCursor()
                        }))
                    }
                    a.onkeypress = function(b) {
                        if (a.railslocked && 0 == a.page.maxh) return !0;
                        b = b ? b : window.e;
                        var c = a.getTarget(b);
                        if (c && /INPUT|TEXTAREA|SELECT|OPTION/.test(c.nodeName) && (!c.getAttribute("type") && !c.type || !/submit|button|cancel/i.tp) || f(c).attr("contenteditable")) return !0;
                        if (a.hasfocus || a.hasmousefocus && !B || a.ispage && !B && !F) {
                            c = b.keyCode;
                            if (a.railslocked && 27 != c) return a.cancelEvent(b);
                            var g = b.ctrlKey || !1,
                                d = b.shiftKey || !1,
                                e = !1;
                            switch (c) {
                                case 38:
                                case 63233:
                                    a.doScrollBy(72);
                                    e = !0;
                                    break;
                                case 40:
                                case 63235:
                                    a.doScrollBy(-72);
                                    e = !0;
                                    break;
                                case 37:
                                case 63232:
                                    a.railh && (g ? a.doScrollLeft(0) : a.doScrollLeftBy(72), e = !0);
                                    break;
                                case 39:
                                case 63234:
                                    a.railh && (g ? a.doScrollLeft(a.page.maxw) : a.doScrollLeftBy(-72), e = !0);
                                    break;
                                case 33:
                                case 63276:
                                    a.doScrollBy(a.view.h);
                                    e = !0;
                                    break;
                                case 34:
                                case 63277:
                                    a.doScrollBy(-a.view.h);
                                    e = !0;
                                    break;
                                case 36:
                                case 63273:
                                    a.railh && g ? a.doScrollPos(0, 0) : a.doScrollTo(0);
                                    e = !0;
                                    break;
                                case 35:
                                case 63275:
                                    a.railh && g ? a.doScrollPos(a.page.maxw, a.page.maxh) : a.doScrollTo(a.page.maxh);
                                    e = !0;
                                    break;
                                case 32:
                                    a.opt.spacebarenabled && (d ? a.doScrollBy(a.view.h) : a.doScrollBy(-a.view.h), e = !0);
                                    break;
                                case 27:
                                    a.zoomactive && (a.doZoom(), e = !0)
                            }
                            if (e) return a.cancelEvent(b)
                        }
                    };
                    a.opt.enablekeyboard && a.bind(document, e.isopera && !e.isopera12 ? "keypress" : "keydown", a.onkeypress);
                    a.bind(document, "keydown", function(b) {
                        b.ctrlKey && (a.wheelprevented = !0)
                    });
                    a.bind(document, "keyup", function(b) {
                        b.ctrlKey || (a.wheelprevented = !1)
                    });
                    a.bind(window, "blur", function(b) {
                        a.wheelprevented = !1
                    });
                    a.bind(window, "resize", a.lazyResize);
                    a.bind(window, "orientationchange", a.lazyResize);
                    a.bind(window, "load", a.lazyResize);
                    if (e.ischrome && !a.ispage && !a.haswrapper) {
                        var t = a.win.attr("style"),
                            m = parseFloat(a.win.css("width")) + 1;
                        a.win.css("width", m);
                        a.synched("chromefix", function() {
                            a.win.attr("style", t)
                        })
                    }
                    a.onAttributeChange = function(b) {
                        a.lazyResize(a.isieold ? 250 : 30)
                    };
                    a.isie11 || !1 === x || (a.observerbody = new x(function(b) {
                        b.forEach(function(b) {
                            if ("attributes" == b.type) return f("body").hasClass("modal-open") && f("body").hasClass("modal-dialog") && !f.contains(f(".modal-dialog")[0], a.doc[0]) ? a.hide() : a.show()
                        });
                        if (document.body.scrollHeight != a.page.maxh) return a.lazyResize(30)
                    }), a.observerbody.observe(document.body, {
                        childList: !0,
                        subtree: !0,
                        characterData: !1,
                        attributes: !0,
                        attributeFilter: ["class"]
                    }));
                    a.ispage || a.haswrapper || (!1 !== x ? (a.observer = new x(function(b) {
                        b.forEach(a.onAttributeChange)
                    }), a.observer.observe(a.win[0], {
                        childList: !0,
                        characterData: !1,
                        attributes: !0,
                        subtree: !1
                    }), a.observerremover = new x(function(b) {
                        b.forEach(function(b) {
                            if (0 < b.removedNodes.length)
                                for (var c in b.removedNodes)
                                    if (a && b.removedNodes[c] == a.win[0]) return a.remove()
                        })
                    }), a.observerremover.observe(a.win[0].parentNode, {
                        childList: !0,
                        characterData: !1,
                        attributes: !1,
                        subtree: !1
                    })) : (a.bind(a.win, e.isie && !e.isie9 ? "propertychange" : "DOMAttrModified", a.onAttributeChange), e.isie9 && a.win[0].attachEvent("onpropertychange", a.onAttributeChange), a.bind(a.win, "DOMNodeRemoved", function(b) {
                        b.target == a.win[0] && a.remove()
                    })));
                    !a.ispage && a.opt.boxzoom && a.bind(window, "resize", a.resizeZoom);
                    a.istextarea && (a.bind(a.win, "keydown", a.lazyResize), a.bind(a.win, "mouseup", a.lazyResize));
                    a.lazyResize(30)
                }
                if ("IFRAME" == this.doc[0].nodeName) {
                    var N = function() {
                        a.iframexd = !1;
                        var c;
                        try {
                            c = "contentDocument" in this ? this.contentDocument : this.contentWindow.document
                        } catch (g) {
                            a.iframexd = !0, c = !1
                        }
                        if (a.iframexd) return "console" in window && console.log("NiceScroll error: policy restriced iframe"), !0;
                        a.forcescreen = !0;
                        a.isiframe && (a.iframe = {
                            doc: f(c),
                            html: a.doc.contents().find("html")[0],
                            body: a.doc.contents().find("body")[0]
                        }, a.getContentSize = function() {
                            return {
                                w: Math.max(a.iframe.html.scrollWidth, a.iframe.body.scrollWidth),
                                h: Math.max(a.iframe.html.scrollHeight, a.iframe.body.scrollHeight)
                            }
                        }, a.docscroll = f(a.iframe.body));
                        if (!e.isios && a.opt.iframeautoresize && !a.isiframe) {
                            a.win.scrollTop(0);
                            a.doc.height("");
                            var d = Math.max(c.getElementsByTagName("html")[0].scrollHeight, c.body.scrollHeight);
                            a.doc.height(d)
                        }
                        a.lazyResize(30);
                        e.isie7 && a.css(f(a.iframe.html), b);
                        a.css(f(a.iframe.body), b);
                        e.isios && a.haswrapper && a.css(f(c.body), {
                            "-webkit-transform": "translate3d(0,0,0)"
                        });
                        "contentWindow" in this ? a.bind(this.contentWindow, "scroll", a.onscroll) : a.bind(c, "scroll", a.onscroll);
                        a.opt.enablemousewheel && a.mousewheel(c, a.onmousewheel);
                        a.opt.enablekeyboard && a.bind(c, e.isopera ? "keypress" : "keydown", a.onkeypress);
                        if (e.cantouch || a.opt.touchbehavior) a.bind(c, "mousedown", a.ontouchstart), a.bind(c, "mousemove", function(b) {
                            return a.ontouchmove(b, !0)
                        }), a.opt.grabcursorenabled && e.cursorgrabvalue && a.css(f(c.body), {
                            cursor: e.cursorgrabvalue
                        });
                        a.bind(c, "mouseup", a.ontouchend);
                        a.zoom && (a.opt.dblclickzoom && a.bind(c, "dblclick", a.doZoom), a.ongesturezoom && a.bind(c, "gestureend", a.ongesturezoom))
                    };
                    this.doc[0].readyState && "complete" == this.doc[0].readyState && setTimeout(function() {
                        N.call(a.doc[0], !1)
                    }, 500);
                    a.bind(this.doc, "load", N)
                }
            };
            this.showCursor = function(b, c) {
                a.cursortimeout && (clearTimeout(a.cursortimeout), a.cursortimeout = 0);
                if (a.rail) {
                    a.autohidedom && (a.autohidedom.stop().css({
                        opacity: a.opt.cursoropacitymax
                    }), a.cursoractive = !0);
                    a.rail.drag && 1 == a.rail.drag.pt || (void 0 !== b && !1 !== b && (a.scroll.y = Math.round(1 * b / a.scrollratio.y)), void 0 !== c && (a.scroll.x = Math.round(1 * c / a.scrollratio.x)));
                    a.cursor.css({
                        height: a.cursorheight,
                        top: a.scroll.y
                    });
                    if (a.cursorh) {
                        var d = a.hasreversehr ? a.scrollvaluemaxw - a.scroll.x : a.scroll.x;
                        !a.rail.align && a.rail.visibility ? a.cursorh.css({
                            width: a.cursorwidth,
                            left: d + a.rail.width
                        }) : a.cursorh.css({
                            width: a.cursorwidth,
                            left: d
                        });
                        a.cursoractive = !0
                    }
                    a.zoom && a.zoom.stop().css({
                        opacity: a.opt.cursoropacitymax
                    })
                }
            };
            this.hideCursor = function(b) {
                a.cursortimeout || !a.rail || !a.autohidedom || a.hasmousefocus && "leave" == a.opt.autohidemode || (a.cursortimeout = setTimeout(function() {
                    a.rail.active && a.showonmouseevent || (a.autohidedom.stop().animate({
                        opacity: a.opt.cursoropacitymin
                    }), a.zoom && a.zoom.stop().animate({
                        opacity: a.opt.cursoropacitymin
                    }), a.cursoractive = !1);
                    a.cursortimeout = 0
                }, b || a.opt.hidecursordelay))
            };
            this.noticeCursor = function(b, c, d) {
                a.showCursor(c, d);
                a.rail.active || a.hideCursor(b)
            };
            this.getContentSize = a.ispage ? function() {
                return {
                    w: Math.max(document.body.scrollWidth, document.documentElement.scrollWidth),
                    h: Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)
                }
            } : a.haswrapper ? function() {
                return {
                    w: a.doc.outerWidth() + parseInt(a.win.css("paddingLeft")) +
                        parseInt(a.win.css("paddingRight")),
                    h: a.doc.outerHeight() + parseInt(a.win.css("paddingTop")) + parseInt(a.win.css("paddingBottom"))
                }
            } : function() {
                return {
                    w: a.docscroll[0].scrollWidth,
                    h: a.docscroll[0].scrollHeight
                }
            };
            this.onResize = function(b, c) {
                if (!a || !a.win) return !1;
                if (!a.haswrapper && !a.ispage) {
                    if ("none" == a.win.css("display")) return a.visibility && a.hideRail().hideRailHr(), !1;
                    a.hidden || a.visibility || a.showRail().showRailHr()
                }
                var d = a.page.maxh,
                    e = a.page.maxw,
                    f = a.view.h,
                    k = a.view.w;
                a.view = {
                    w: a.ispage ? a.win.width() : parseInt(a.win[0].clientWidth),
                    h: a.ispage ? a.win.height() : parseInt(a.win[0].clientHeight)
                };
                a.page = c ? c : a.getContentSize();
                a.page.maxh = Math.max(0, a.page.h - a.view.h);
                a.page.maxw = Math.max(0, a.page.w - a.view.w);
                if (a.page.maxh == d && a.page.maxw == e && a.view.w == k && a.view.h == f) {
                    if (a.ispage) return a;
                    d = a.win.offset();
                    if (a.lastposition && (e = a.lastposition, e.top == d.top && e.left == d.left)) return a;
                    a.lastposition = d
                }
                0 == a.page.maxh ? (a.hideRail(), a.scrollvaluemax = 0, a.scroll.y = 0, a.scrollratio.y = 0, a.cursorheight = 0, a.setScrollTop(0), a.rail && (a.rail.scrollable = !1)) : (a.page.maxh -= a.opt.railpadding.top + a.opt.railpadding.bottom, a.rail.scrollable = !0);
                0 == a.page.maxw ? (a.hideRailHr(), a.scrollvaluemaxw = 0, a.scroll.x = 0, a.scrollratio.x = 0, a.cursorwidth = 0, a.setScrollLeft(0), a.railh && (a.railh.scrollable = !1)) : (a.page.maxw -= a.opt.railpadding.left + a.opt.railpadding.right, a.railh && (a.railh.scrollable = a.opt.horizrailenabled));
                a.railslocked = a.locked || 0 == a.page.maxh && 0 == a.page.maxw;
                if (a.railslocked) return a.ispage || a.updateScrollBar(a.view), !1;
                a.hidden || a.visibility ? !a.railh || a.hidden || a.railh.visibility || a.showRailHr() : a.showRail().showRailHr();
                a.istextarea && a.win.css("resize") && "none" != a.win.css("resize") && (a.view.h -= 20);
                a.cursorheight = Math.min(a.view.h, Math.round(a.view.h / a.page.h * a.view.h));
                a.cursorheight = a.opt.cursorfixedheight ? a.opt.cursorfixedheight : Math.max(a.opt.cursorminheight, a.cursorheight);
                a.cursorwidth = Math.min(a.view.w, Math.round(a.view.w / a.page.w * a.view.w));
                a.cursorwidth = a.opt.cursorfixedheight ? a.opt.cursorfixedheight : Math.max(a.opt.cursorminheight, a.cursorwidth);
                a.scrollvaluemax = a.view.h - a.cursorheight - a.cursor.hborder - (a.opt.railpadding.top + a.opt.railpadding.bottom);
                a.railh && (a.railh.width = 0 < a.page.maxh ? a.view.w - a.rail.width : a.view.w, a.scrollvaluemaxw = a.railh.width - a.cursorwidth - a.cursorh.wborder - (a.opt.railpadding.left + a.opt.railpadding.right));
                a.ispage || a.updateScrollBar(a.view);
                a.scrollratio = {
                    x: a.page.maxw / a.scrollvaluemaxw,
                    y: a.page.maxh / a.scrollvaluemax
                };
                a.getScrollTop() > a.page.maxh ? a.doScrollTop(a.page.maxh) : (a.scroll.y = Math.round(a.getScrollTop() * (1 / a.scrollratio.y)), a.scroll.x = Math.round(a.getScrollLeft() * (1 / a.scrollratio.x)), a.cursoractive && a.noticeCursor());
                a.scroll.y && 0 == a.getScrollTop() && a.doScrollTo(Math.floor(a.scroll.y * a.scrollratio.y));
                return a
            };
            this.resize = a.onResize;
            this.hlazyresize = 0;
            this.lazyResize = function(b) {
                a.haswrapper || a.hide();
                a.hlazyresize && clearTimeout(a.hlazyresize);
                a.hlazyresize = setTimeout(function() {
                    a && a.show().resize()
                }, 240);
                return a
            };
            this.jqbind = function(b, c, d) {
                a.events.push({
                    e: b,
                    n: c,
                    f: d,
                    q: !0
                });
                f(b).bind(c, d)
            };
            this.mousewheel = function(b, c, d) {
                b = "jquery" in b ? b[0] : b;
                if ("onwheel" in document.createElement("div")) a._bind(b, "wheel", c, d || !1);
                else {
                    var e = void 0 !== document.onmousewheel ? "mousewheel" : "DOMMouseScroll";
                    q(b, e, c, d || !1);
                    "DOMMouseScroll" == e && q(b, "MozMousePixelScroll", c, d || !1)
                }
            };
            e.haseventlistener ? (this.bind = function(b, c, d, e) {
                a._bind("jquery" in b ? b[0] : b, c, d, e || !1)
            }, this._bind = function(b, c, d, e) {
                a.events.push({
                    e: b,
                    n: c,
                    f: d,
                    b: e,
                    q: !1
                });
                b.addEventListener(c, d, e || !1)
            }, this.cancelEvent = function(a) {
                if (!a) return !1;
                a = a.original ? a.original : a;
                a.cancelable && a.preventDefault();
                a.stopPropagation();
                a.preventManipulation && a.preventManipulation();
                return !1
            }, this.stopPropagation = function(a) {
                if (!a) return !1;
                a = a.original ? a.original : a;
                a.stopPropagation();
                return !1
            }, this._unbind = function(a, c, d, e) {
                a.removeEventListener(c, d, e)
            }) : (this.bind = function(b, c, d, e) {
                var f = "jquery" in b ? b[0] : b;
                a._bind(f, c, function(b) {
                    (b = b || window.event || !1) && b.srcElement && (b.target = b.srcElement);
                    "pageY" in b || (b.pageX = b.clientX + document.documentElement.scrollLeft, b.pageY = b.clientY +
                        document.documentElement.scrollTop);
                    return !1 === d.call(f, b) || !1 === e ? a.cancelEvent(b) : !0
                })
            }, this._bind = function(b, c, d, e) {
                a.events.push({
                    e: b,
                    n: c,
                    f: d,
                    b: e,
                    q: !1
                });
                b.attachEvent ? b.attachEvent("on" + c, d) : b["on" + c] = d
            }, this.cancelEvent = function(a) {
                a = window.event || !1;
                if (!a) return !1;
                a.cancelBubble = !0;
                a.cancel = !0;
                return a.returnValue = !1
            }, this.stopPropagation = function(a) {
                a = window.event || !1;
                if (!a) return !1;
                a.cancelBubble = !0;
                return !1
            }, this._unbind = function(a, c, d, e) {
                a.detachEvent ? a.detachEvent("on" + c, d) : a["on" + c] = !1
            });
            this.unbindAll = function() {
                for (var b = 0; b < a.events.length; b++) {
                    var c = a.events[b];
                    c.q ? c.e.unbind(c.n, c.f) : a._unbind(c.e, c.n, c.f, c.b)
                }
            };
            this.showRail = function() {
                0 == a.page.maxh || !a.ispage && "none" == a.win.css("display") || (a.visibility = !0, a.rail.visibility = !0, a.rail.css("display", "block"));
                return a
            };
            this.showRailHr = function() {
                if (!a.railh) return a;
                0 == a.page.maxw || !a.ispage && "none" == a.win.css("display") || (a.railh.visibility = !0, a.railh.css("display", "block"));
                return a
            };
            this.hideRail = function() {
                a.visibility = !1;
                a.rail.visibility = !1;
                a.rail.css("display", "none");
                return a
            };
            this.hideRailHr = function() {
                if (!a.railh) return a;
                a.railh.visibility = !1;
                a.railh.css("display", "none");
                return a
            };
            this.show = function() {
                a.hidden = !1;
                a.railslocked = !1;
                return a.showRail().showRailHr()
            };
            this.hide = function() {
                a.hidden = !0;
                a.railslocked = !0;
                return a.hideRail().hideRailHr()
            };
            this.toggle = function() {
                return a.hidden ? a.show() : a.hide()
            };
            this.remove = function() {
                a.stop();
                a.cursortimeout && clearTimeout(a.cursortimeout);
                for (var b in a.delaylist) a.delaylist[b] && w(a.delaylist[b].h);
                a.doZoomOut();
                a.unbindAll();
                e.isie9 && a.win[0].detachEvent("onpropertychange", a.onAttributeChange);
                !1 !== a.observer && a.observer.disconnect();
                !1 !== a.observerremover && a.observerremover.disconnect();
                !1 !== a.observerbody && a.observerbody.disconnect();
                a.events = null;
                a.cursor && a.cursor.remove();
                a.cursorh && a.cursorh.remove();
                a.rail && a.rail.remove();
                a.railh && a.railh.remove();
                a.zoom && a.zoom.remove();
                for (b = 0; b < a.saved.css.length; b++) {
                    var c = a.saved.css[b];
                    c[0].css(c[1], void 0 === c[2] ? "" : c[2])
                }
                a.saved = !1;
                a.me.data("__nicescroll", "");
                var d = f.nicescroll;
                d.each(function(b) {
                    if (this && this.id === a.id) {
                        delete d[b];
                        for (var c = ++b; c < d.length; c++, b++) d[b] = d[c];
                        d.length--;
                        d.length && delete d[d.length]
                    }
                });
                for (var k in a) a[k] = null, delete a[k];
                a = null
            };
            this.scrollstart = function(b) {
                this.onscrollstart = b;
                return a
            };
            this.scrollend = function(b) {
                this.onscrollend = b;
                return a
            };
            this.scrollcancel = function(b) {
                this.onscrollcancel = b;
                return a
            };
            this.zoomin = function(b) {
                this.onzoomin = b;
                return a
            };
            this.zoomout = function(b) {
                this.onzoomout = b;
                return a
            };
            this.isScrollable = function(a) {
                a = a.target ? a.target : a;
                if ("OPTION" == a.nodeName) return !0;
                for (; a && 1 == a.nodeType && !/^BODY|HTML/.test(a.nodeName);) {
                    var c = f(a),
                        c = c.css("overflowY") || c.css("overflowX") || c.css("overflow") || "";
                    if (/scroll|auto/.test(c)) return a.clientHeight != a.scrollHeight;
                    a = a.parentNode ? a.parentNode : !1
                }
                return !1
            };
            this.getViewport = function(a) {
                for (a = a && a.parentNode ? a.parentNode : !1; a && 1 == a.nodeType && !/^BODY|HTML/.test(a.nodeName);) {
                    var c = f(a);
                    if (/fixed|absolute/.test(c.css("position"))) return c;
                    var d = c.css("overflowY") || c.css("overflowX") || c.css("overflow") || "";
                    if (/scroll|auto/.test(d) && a.clientHeight != a.scrollHeight || 0 < c.getNiceScroll().length) return c;
                    a = a.parentNode ? a.parentNode : !1
                }
                return !1
            };
            this.triggerScrollEnd = function() {
                if (a.onscrollend) {
                    var b = a.getScrollLeft(),
                        c = a.getScrollTop();
                    a.onscrollend.call(a, {
                        type: "scrollend",
                        current: {
                            x: b,
                            y: c
                        },
                        end: {
                            x: b,
                            y: c
                        }
                    })
                }
            };
            this.onmousewheel = function(b) {
                if (!a.wheelprevented) {
                    if (a.railslocked) return a.debounced("checkunlock", a.resize, 250), !0;
                    if (a.rail.drag) return a.cancelEvent(b);
                    "auto" == a.opt.oneaxismousemode && 0 != b.deltaX && (a.opt.oneaxismousemode = !1);
                    if (a.opt.oneaxismousemode && 0 == b.deltaX && !a.rail.scrollable) return a.railh && a.railh.scrollable ? a.onmousewheelhr(b) : !0;
                    var c = +new Date,
                        d = !1;
                    a.opt.preservenativescrolling && a.checkarea + 600 < c && (a.nativescrollingarea = a.isScrollable(b), d = !0);
                    a.checkarea = c;
                    if (a.nativescrollingarea) return !0;
                    if (b = t(b, !1, d)) a.checkarea = 0;
                    return b
                }
            };
            this.onmousewheelhr = function(b) {
                if (!a.wheelprevented) {
                    if (a.railslocked || !a.railh.scrollable) return !0;
                    if (a.rail.drag) return a.cancelEvent(b);
                    var c = +new Date,
                        d = !1;
                    a.opt.preservenativescrolling && a.checkarea + 600 < c && (a.nativescrollingarea = a.isScrollable(b), d = !0);
                    a.checkarea = c;
                    return a.nativescrollingarea ? !0 : a.railslocked ? a.cancelEvent(b) : t(b, !0, d)
                }
            };
            this.stop = function() {
                a.cancelScroll();
                a.scrollmon && a.scrollmon.stop();
                a.cursorfreezed = !1;
                a.scroll.y = Math.round(a.getScrollTop() * (1 / a.scrollratio.y));
                a.noticeCursor();
                return a
            };
            this.getTransitionSpeed = function(b) {
                b = Math.min(Math.round(10 * a.opt.scrollspeed), Math.round(b / 20 * a.opt.scrollspeed));
                return 20 < b ? b : 0
            };
            a.opt.smoothscroll ? a.ishwscroll && e.hastransition && a.opt.usetransition && a.opt.smoothscroll ? (this.prepareTransition = function(b, c) {
                var d = c ? 20 < b ? b : 0 : a.getTransitionSpeed(b),
                    f = d ? e.prefixstyle + "transform " + d + "ms ease-out" : "";
                a.lasttransitionstyle && a.lasttransitionstyle == f || (a.lasttransitionstyle = f, a.doc.css(e.transitionstyle, f));
                return d
            }, this.doScrollLeft = function(b, c) {
                var d = a.scrollrunning ? a.newscrolly : a.getScrollTop();
                a.doScrollPos(b, d, c)
            }, this.doScrollTop = function(b, c) {
                var d = a.scrollrunning ? a.newscrollx : a.getScrollLeft();
                a.doScrollPos(d, b, c)
            }, this.doScrollPos = function(b, c, d) {
                var f = a.getScrollTop(),
                    k = a.getScrollLeft();
                (0 > (a.newscrolly - f) * (c - f) || 0 > (a.newscrollx - k) * (b - k)) && a.cancelScroll();
                0 == a.opt.bouncescroll && (0 > c ? c = 0 : c > a.page.maxh && (c = a.page.maxh), 0 > b ? b = 0 : b > a.page.maxw && (b = a.page.maxw));
                if (a.scrollrunning && b == a.newscrollx && c == a.newscrolly) return !1;
                a.newscrolly = c;
                a.newscrollx = b;
                a.newscrollspeed = d || !1;
                if (a.timer) return !1;
                a.timer = setTimeout(function() {
                    var d = a.getScrollTop(),
                        f = a.getScrollLeft(),
                        k = Math.round(Math.sqrt(Math.pow(b - f, 2) + Math.pow(c - d, 2))),
                        k = a.newscrollspeed && 1 < a.newscrollspeed ? a.newscrollspeed : a.getTransitionSpeed(k);
                    a.newscrollspeed && 1 >= a.newscrollspeed && (k *= a.newscrollspeed);
                    a.prepareTransition(k, !0);
                    a.timerscroll && a.timerscroll.tm && clearInterval(a.timerscroll.tm);
                    0 < k && (!a.scrollrunning && a.onscrollstart && a.onscrollstart.call(a, {
                        type: "scrollstart",
                        current: {
                            x: f,
                            y: d
                        },
                        request: {
                            x: b,
                            y: c
                        },
                        end: {
                            x: a.newscrollx,
                            y: a.newscrolly
                        },
                        speed: k
                    }), e.transitionend ? a.scrollendtrapped || (a.scrollendtrapped = !0, a.bind(a.doc, e.transitionend, a.onScrollTransitionEnd, !1)) : (a.scrollendtrapped && clearTimeout(a.scrollendtrapped), a.scrollendtrapped = setTimeout(a.onScrollTransitionEnd, k)), a.timerscroll = {
                        bz: new D(d, a.newscrolly, k, 0, 0, .58, 1),
                        bh: new D(f, a.newscrollx, k, 0, 0, .58, 1)
                    }, a.cursorfreezed || (a.timerscroll.tm = setInterval(function() {
                        a.showCursor(a.getScrollTop(), a.getScrollLeft())
                    }, 60)));
                    a.synched("doScroll-set", function() {
                        a.timer = 0;
                        a.scrollendtrapped && (a.scrollrunning = !0);
                        a.setScrollTop(a.newscrolly);
                        a.setScrollLeft(a.newscrollx);
                        if (!a.scrollendtrapped) a.onScrollTransitionEnd()
                    })
                }, 50)
            }, this.cancelScroll = function() {
                if (!a.scrollendtrapped) return !0;
                var b = a.getScrollTop(),
                    c = a.getScrollLeft();
                a.scrollrunning = !1;
                e.transitionend || clearTimeout(e.transitionend);
                a.scrollendtrapped = !1;
                a._unbind(a.doc[0], e.transitionend, a.onScrollTransitionEnd);
                a.prepareTransition(0);
                a.setScrollTop(b);
                a.railh && a.setScrollLeft(c);
                a.timerscroll && a.timerscroll.tm && clearInterval(a.timerscroll.tm);
                a.timerscroll = !1;
                a.cursorfreezed = !1;
                a.showCursor(b, c);
                return a
            }, this.onScrollTransitionEnd = function() {
                a.scrollendtrapped && a._unbind(a.doc[0], e.transitionend, a.onScrollTransitionEnd);
                a.scrollendtrapped = !1;
                a.prepareTransition(0);
                a.timerscroll && a.timerscroll.tm && clearInterval(a.timerscroll.tm);
                a.timerscroll = !1;
                var b = a.getScrollTop(),
                    c = a.getScrollLeft();
                a.setScrollTop(b);
                a.railh && a.setScrollLeft(c);
                a.noticeCursor(!1, b, c);
                a.cursorfreezed = !1;
                0 > b ? b = 0 : b > a.page.maxh && (b = a.page.maxh);
                0 > c ? c = 0 : c > a.page.maxw && (c = a.page.maxw);
                if (b != a.newscrolly || c != a.newscrollx) return a.doScrollPos(c, b, a.opt.snapbackspeed);
                a.onscrollend && a.scrollrunning && a.triggerScrollEnd();
                a.scrollrunning = !1
            }) : (this.doScrollLeft = function(b, c) {
                var d = a.scrollrunning ? a.newscrolly : a.getScrollTop();
                a.doScrollPos(b, d, c)
            }, this.doScrollTop = function(b, c) {
                var d = a.scrollrunning ? a.newscrollx : a.getScrollLeft();
                a.doScrollPos(d, b, c)
            }, this.doScrollPos = function(b, c, d) {
                function e() {
                    if (a.cancelAnimationFrame) return !0;
                    a.scrollrunning = !0;
                    if (p = 1 - p) return a.timer = v(e) || 1;
                    var b = 0,
                        c, d, f = d = a.getScrollTop();
                    if (a.dst.ay) {
                        f = a.bzscroll ? a.dst.py + a.bzscroll.getNow() * a.dst.ay : a.newscrolly;
                        c = f - d;
                        if (0 > c && f < a.newscrolly || 0 < c && f > a.newscrolly) f = a.newscrolly;
                        a.setScrollTop(f);
                        f == a.newscrolly && (b = 1)
                    } else b = 1;
                    d = c = a.getScrollLeft();
                    if (a.dst.ax) {
                        d = a.bzscroll ? a.dst.px + a.bzscroll.getNow() * a.dst.ax : a.newscrollx;
                        c = d - c;
                        if (0 > c && d < a.newscrollx || 0 < c && d > a.newscrollx) d = a.newscrollx;
                        a.setScrollLeft(d);
                        d == a.newscrollx && (b += 1)
                    } else b += 1;
                    2 == b ? (a.timer = 0, a.cursorfreezed = !1, a.bzscroll = !1, a.scrollrunning = !1, 0 > f ? f = 0 : f > a.page.maxh && (f = Math.max(0, a.page.maxh)), 0 > d ? d = 0 : d > a.page.maxw && (d = a.page.maxw), d != a.newscrollx || f != a.newscrolly ? a.doScrollPos(d, f) : a.onscrollend && a.triggerScrollEnd()) : a.timer = v(e) || 1
                }
                c = void 0 === c || !1 === c ? a.getScrollTop(!0) : c;
                if (a.timer && a.newscrolly == c && a.newscrollx == b) return !0;
                a.timer && w(a.timer);
                a.timer = 0;
                var f = a.getScrollTop(),
                    k = a.getScrollLeft();
                (0 > (a.newscrolly - f) * (c - f) || 0 > (a.newscrollx - k) * (b - k)) && a.cancelScroll();
                a.newscrolly = c;
                a.newscrollx = b;
                a.bouncescroll && a.rail.visibility || (0 > a.newscrolly ? a.newscrolly = 0 : a.newscrolly > a.page.maxh && (a.newscrolly = a.page.maxh));
                a.bouncescroll && a.railh.visibility || (0 > a.newscrollx ? a.newscrollx = 0 : a.newscrollx > a.page.maxw && (a.newscrollx = a.page.maxw));
                a.dst = {};
                a.dst.x = b - k;
                a.dst.y = c - f;
                a.dst.px = k;
                a.dst.py = f;
                var h = Math.round(Math.sqrt(Math.pow(a.dst.x, 2) + Math.pow(a.dst.y, 2)));
                a.dst.ax = a.dst.x / h;
                a.dst.ay = a.dst.y / h;
                var l = 0,
                    n = h;
                0 == a.dst.x ? (l = f, n = c, a.dst.ay = 1, a.dst.py = 0) : 0 == a.dst.y && (l = k, n = b, a.dst.ax = 1, a.dst.px = 0);
                h = a.getTransitionSpeed(h);
                d && 1 >= d && (h *= d);
                a.bzscroll = 0 < h ? a.bzscroll ? a.bzscroll.update(n, h) : new D(l, n, h, 0, 1, 0, 1) : !1;
                if (!a.timer) {
                    (f == a.page.maxh && c >= a.page.maxh || k == a.page.maxw && b >= a.page.maxw) && a.checkContentSize();
                    var p = 1;
                    a.cancelAnimationFrame = !1;
                    a.timer = 1;
                    a.onscrollstart && !a.scrollrunning && a.onscrollstart.call(a, {
                        type: "scrollstart",
                        current: {
                            x: k,
                            y: f
                        },
                        request: {
                            x: b,
                            y: c
                        },
                        end: {
                            x: a.newscrollx,
                            y: a.newscrolly
                        },
                        speed: h
                    });
                    e();
                    (f == a.page.maxh && c >= f || k == a.page.maxw && b >= k) && a.checkContentSize();
                    a.noticeCursor()
                }
            }, this.cancelScroll = function() {
                a.timer && w(a.timer);
                a.timer = 0;
                a.bzscroll = !1;
                a.scrollrunning = !1;
                return a
            }) : (this.doScrollLeft = function(b, c) {
                var d = a.getScrollTop();
                a.doScrollPos(b, d, c)
            }, this.doScrollTop = function(b, c) {
                var d = a.getScrollLeft();
                a.doScrollPos(d, b, c)
            }, this.doScrollPos = function(b, c, d) {
                var e = b > a.page.maxw ? a.page.maxw : b;
                0 > e && (e = 0);
                var f = c > a.page.maxh ? a.page.maxh : c;
                0 > f && (f = 0);
                a.synched("scroll", function() {
                    a.setScrollTop(f);
                    a.setScrollLeft(e)
                })
            }, this.cancelScroll = function() {});
            this.doScrollBy = function(b, c) {
                var d = 0,
                    d = c ? Math.floor((a.scroll.y - b) * a.scrollratio.y) : (a.timer ? a.newscrolly : a.getScrollTop(!0)) - b;
                if (a.bouncescroll) {
                    var e = Math.round(a.view.h / 2);
                    d < -e ? d = -e : d > a.page.maxh + e && (d = a.page.maxh + e)
                }
                a.cursorfreezed = !1;
                e = a.getScrollTop(!0);
                if (0 > d && 0 >= e) return a.noticeCursor();
                if (d > a.page.maxh && e >= a.page.maxh) return a.checkContentSize(), a.noticeCursor();
                a.doScrollTop(d)
            };
            this.doScrollLeftBy = function(b, c) {
                var d = 0,
                    d = c ? Math.floor((a.scroll.x - b) * a.scrollratio.x) : (a.timer ? a.newscrollx : a.getScrollLeft(!0)) - b;
                if (a.bouncescroll) {
                    var e = Math.round(a.view.w / 2);
                    d < -e ? d = -e : d > a.page.maxw + e && (d = a.page.maxw +
                        e)
                }
                a.cursorfreezed = !1;
                e = a.getScrollLeft(!0);
                if (0 > d && 0 >= e || d > a.page.maxw && e >= a.page.maxw) return a.noticeCursor();
                a.doScrollLeft(d)
            };
            this.doScrollTo = function(b, c) {
                a.cursorfreezed = !1;
                a.doScrollTop(b)
            };
            this.checkContentSize = function() {
                var b = a.getContentSize();
                b.h == a.page.h && b.w == a.page.w || a.resize(!1, b)
            };
            a.onscroll = function(b) {
                a.rail.drag || a.cursorfreezed || a.synched("scroll", function() {
                    a.scroll.y = Math.round(a.getScrollTop() * (1 / a.scrollratio.y));
                    a.railh && (a.scroll.x = Math.round(a.getScrollLeft() * (1 / a.scrollratio.x)));
                    a.noticeCursor()
                })
            };
            a.bind(a.docscroll, "scroll", a.onscroll);
            this.doZoomIn = function(b) {
                if (!a.zoomactive) {
                    a.zoomactive = !0;
                    a.zoomrestore = {
                        style: {}
                    };
                    var c = "position top left zIndex backgroundColor marginTop marginBottom marginLeft marginRight".split(" "),
                        d = a.win[0].style,
                        k;
                    for (k in c) {
                        var h = c[k];
                        a.zoomrestore.style[h] = void 0 !== d[h] ? d[h] : ""
                    }
                    a.zoomrestore.style.width = a.win.css("width");
                    a.zoomrestore.style.height = a.win.css("height");
                    a.zoomrestore.padding = {
                        w: a.win.outerWidth() - a.win.width(),
                        h: a.win.outerHeight() -
                            a.win.height()
                    };
                    e.isios4 && (a.zoomrestore.scrollTop = f(window).scrollTop(), f(window).scrollTop(0));
                    a.win.css({
                        position: e.isios4 ? "absolute" : "fixed",
                        top: 0,
                        left: 0,
                        zIndex: A + 100,
                        margin: 0
                    });
                    c = a.win.css("backgroundColor");
                    ("" == c || /transparent|rgba\(0, 0, 0, 0\)|rgba\(0,0,0,0\)/.test(c)) && a.win.css("backgroundColor", "#fff");
                    a.rail.css({
                        zIndex: A + 101
                    });
                    a.zoom.css({
                        zIndex: A + 102
                    });
                    a.zoom.css("backgroundPosition", "0px -18px");
                    a.resizeZoom();
                    a.onzoomin && a.onzoomin.call(a);
                    return a.cancelEvent(b)
                }
            };
            this.doZoomOut = function(b) {
                if (a.zoomactive) return a.zoomactive = !1, a.win.css("margin", ""), a.win.css(a.zoomrestore.style), e.isios4 && f(window).scrollTop(a.zoomrestore.scrollTop), a.rail.css({
                    "z-index": a.zindex
                }), a.zoom.css({
                    "z-index": a.zindex
                }), a.zoomrestore = !1, a.zoom.css("backgroundPosition", "0px 0px"), a.onResize(), a.onzoomout && a.onzoomout.call(a), a.cancelEvent(b)
            };
            this.doZoom = function(b) {
                return a.zoomactive ? a.doZoomOut(b) : a.doZoomIn(b)
            };
            this.resizeZoom = function() {
                if (a.zoomactive) {
                    var b = a.getScrollTop();
                    a.win.css({
                        width: f(window).width() -
                            a.zoomrestore.padding.w + "px",
                        height: f(window).height() - a.zoomrestore.padding.h + "px"
                    });
                    a.onResize();
                    a.setScrollTop(Math.min(a.page.maxh, b))
                }
            };
            this.init();
            f.nicescroll.push(this)
        },
        M = function(f) {
            var c = this;
            this.nc = f;
            this.steptime = this.lasttime = this.speedy = this.speedx = this.lasty = this.lastx = 0;
            this.snapy = this.snapx = !1;
            this.demuly = this.demulx = 0;
            this.lastscrolly = this.lastscrollx = -1;
            this.timer = this.chky = this.chkx = 0;
            this.time = function() {
                return +new Date
            };
            this.reset = function(f, h) {
                c.stop();
                var d = c.time();
                c.steptime = 0;
                c.lasttime = d;
                c.speedx = 0;
                c.speedy = 0;
                c.lastx = f;
                c.lasty = h;
                c.lastscrollx = -1;
                c.lastscrolly = -1
            };
            this.update = function(f, h) {
                var d = c.time();
                c.steptime = d - c.lasttime;
                c.lasttime = d;
                var d = h - c.lasty,
                    q = f - c.lastx,
                    t = c.nc.getScrollTop(),
                    a = c.nc.getScrollLeft(),
                    t = t + d,
                    a = a + q;
                c.snapx = 0 > a || a > c.nc.page.maxw;
                c.snapy = 0 > t || t > c.nc.page.maxh;
                c.speedx = q;
                c.speedy = d;
                c.lastx = f;
                c.lasty = h
            };
            this.stop = function() {
                c.nc.unsynched("domomentum2d");
                c.timer && clearTimeout(c.timer);
                c.timer = 0;
                c.lastscrollx = -1;
                c.lastscrolly = -1
            };
            this.doSnapy = function(f, h) {
                var d = !1;
                0 > h ? (h = 0, d = !0) : h > c.nc.page.maxh && (h = c.nc.page.maxh, d = !0);
                0 > f ? (f = 0, d = !0) : f > c.nc.page.maxw && (f = c.nc.page.maxw, d = !0);
                d ? c.nc.doScrollPos(f, h, c.nc.opt.snapbackspeed) : c.nc.triggerScrollEnd()
            };
            this.doMomentum = function(f) {
                var h = c.time(),
                    d = f ? h + f : c.lasttime;
                f = c.nc.getScrollLeft();
                var q = c.nc.getScrollTop(),
                    t = c.nc.page.maxh,
                    a = c.nc.page.maxw;
                c.speedx = 0 < a ? Math.min(60, c.speedx) : 0;
                c.speedy = 0 < t ? Math.min(60, c.speedy) : 0;
                d = d && 60 >= h - d;
                if (0 > q || q > t || 0 > f || f > a) d = !1;
                f = c.speedx && d ? c.speedx : !1;
                if (c.speedy && d && c.speedy || f) {
                    var r = Math.max(16, c.steptime);
                    50 < r && (f = r / 50, c.speedx *= f, c.speedy *= f, r = 50);
                    c.demulxy = 0;
                    c.lastscrollx = c.nc.getScrollLeft();
                    c.chkx = c.lastscrollx;
                    c.lastscrolly = c.nc.getScrollTop();
                    c.chky = c.lastscrolly;
                    var p = c.lastscrollx,
                        e = c.lastscrolly,
                        v = function() {
                            var d = 600 < c.time() - h ? .04 : .02;
                            c.speedx && (p = Math.floor(c.lastscrollx - c.speedx * (1 - c.demulxy)), c.lastscrollx = p, 0 > p || p > a) && (d = .1);
                            c.speedy && (e = Math.floor(c.lastscrolly - c.speedy * (1 - c.demulxy)), c.lastscrolly = e, 0 > e || e > t) && (d = .1);
                            c.demulxy = Math.min(1, c.demulxy +
                                d);
                            c.nc.synched("domomentum2d", function() {
                                c.speedx && (c.nc.getScrollLeft(), c.chkx = p, c.nc.setScrollLeft(p));
                                c.speedy && (c.nc.getScrollTop(), c.chky = e, c.nc.setScrollTop(e));
                                c.timer || (c.nc.hideCursor(), c.doSnapy(p, e))
                            });
                            1 > c.demulxy ? c.timer = setTimeout(v, r) : (c.stop(), c.nc.hideCursor(), c.doSnapy(p, e))
                        };
                    v()
                } else c.doSnapy(c.nc.getScrollLeft(), c.nc.getScrollTop())
            }
        },
        y = f.fn.scrollTop;
    f.cssHooks.pageYOffset = {
        get: function(h, c, k) {
            return (c = f.data(h, "__nicescroll") || !1) && c.ishwscroll ? c.getScrollTop() : y.call(h)
        },
        set: function(h, c) {
            var k = f.data(h, "__nicescroll") || !1;
            k && k.ishwscroll ? k.setScrollTop(parseInt(c)) : y.call(h, c);
            return this
        }
    };
    f.fn.scrollTop = function(h) {
        if (void 0 === h) {
            var c = this[0] ? f.data(this[0], "__nicescroll") || !1 : !1;
            return c && c.ishwscroll ? c.getScrollTop() : y.call(this)
        }
        return this.each(function() {
            var c = f.data(this, "__nicescroll") || !1;
            c && c.ishwscroll ? c.setScrollTop(parseInt(h)) : y.call(f(this), h)
        })
    };
    var z = f.fn.scrollLeft;
    f.cssHooks.pageXOffset = {
        get: function(h, c, k) {
            return (c = f.data(h, "__nicescroll") || !1) && c.ishwscroll ? c.getScrollLeft() : z.call(h)
        },
        set: function(h, c) {
            var k = f.data(h, "__nicescroll") || !1;
            k && k.ishwscroll ? k.setScrollLeft(parseInt(c)) : z.call(h, c);
            return this
        }
    };
    f.fn.scrollLeft = function(h) {
        if (void 0 === h) {
            var c = this[0] ? f.data(this[0], "__nicescroll") || !1 : !1;
            return c && c.ishwscroll ? c.getScrollLeft() : z.call(this)
        }
        return this.each(function() {
            var c = f.data(this, "__nicescroll") || !1;
            c && c.ishwscroll ? c.setScrollLeft(parseInt(h)) : z.call(f(this), h)
        })
    };
    var E = function(h) {
        var c = this;
        this.length = 0;
        this.name = "nicescrollarray";
        this.each = function(d) {
            f.each(c, d);
            return c
        };
        this.push = function(d) {
            c[c.length] = d;
            c.length++
        };
        this.eq = function(d) {
            return c[d]
        };
        if (h)
            for (var k = 0; k < h.length; k++) {
                var l = f.data(h[k], "__nicescroll") || !1;
                l && (this[this.length] = l, this.length++)
            }
        return this
    };
    (function(f, c, k) {
        for (var l = 0; l < c.length; l++) k(f, c[l])
    })(E.prototype, "show hide toggle onResize resize remove stop doScrollPos".split(" "), function(f, c) {
        f[c] = function() {
            var f = arguments;
            return this.each(function() {
                this[c].apply(this, f)
            })
        }
    });
    f.fn.getNiceScroll = function(h) {
        return void 0 === h ? new E(this) : this[h] && f.data(this[h], "__nicescroll") || !1
    };
    f.expr[":"].nicescroll = function(h) {
        return void 0 !== f.data(h, "__nicescroll")
    };
    f.fn.niceScroll = function(h, c) {
        void 0 !== c || "object" != typeof h || "jquery" in h || (c = h, h = !1);
        c = f.extend({}, c);
        var k = new E;
        void 0 === c && (c = {});
        h && (c.doc = f(h), c.win = f(this));
        var l = !("doc" in c);
        l || "win" in c || (c.win = f(this));
        this.each(function() {
            var d = f(this).data("__nicescroll") || !1;
            d || (c.doc = l ? f(this) : c.doc, d = new S(c, f(this)), f(this).data("__nicescroll", d));
            k.push(d)
        });
        return 1 == k.length ? k[0] : k
    };
    window.NiceScroll = {
        getjQuery: function() {
            return f
        }
    };
    f.nicescroll || (f.nicescroll = new E, f.nicescroll.options = K)
});;
! function(e) {
    function t() {
        var e = location.href;
        return hashtag = -1 !== e.indexOf("#prettyPhoto") ? decodeURI(e.substring(e.indexOf("#prettyPhoto") + 1, e.length)) : !1, hashtag && (hashtag = hashtag.replace(/<|>/g, "")), hashtag
    }

    function i() {
        "undefined" != typeof theRel && (location.hash = theRel + "/" + rel_index + "/")
    }

    function p() {
        -1 !== location.href.indexOf("#prettyPhoto") && (location.hash = "prettyPhoto")
    }

    function o(e, t) {
        e = e.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var i = "[\\?&]" + e + "=([^&#]*)",
            p = new RegExp(i),
            o = p.exec(t);
        return null == o ? "" : o[1]
    }
    e.prettyPhoto = {
        version: "3.1.6"
    }, e.fn.prettyPhoto = function(a) {
        function s() {
            e(".pp_loaderIcon").hide(), projectedTop = scroll_pos.scrollTop + (I / 2 - f.containerHeight / 2), projectedTop < 0 && (projectedTop = 0), $ppt.fadeTo(settings.animation_speed, 1), $pp_pic_holder.find(".pp_content").animate({
                height: f.contentHeight,
                width: f.contentWidth
            }, settings.animation_speed), $pp_pic_holder.animate({
                top: projectedTop,
                left: j / 2 - f.containerWidth / 2 < 0 ? 0 : j / 2 - f.containerWidth / 2,
                width: f.containerWidth
            }, settings.animation_speed, function() {
                $pp_pic_holder.find(".pp_hoverContainer,#fullResImage").height(f.height).width(f.width), $pp_pic_holder.find(".pp_fade").fadeIn(settings.animation_speed), isSet && "image" == h(pp_images[set_position]) ? $pp_pic_holder.find(".pp_hoverContainer").show() : $pp_pic_holder.find(".pp_hoverContainer").hide(), settings.allow_expand && (f.resized ? e("a.pp_expand,a.pp_contract").show() : e("a.pp_expand").hide()), !settings.autoplay_slideshow || P || v || e.prettyPhoto.startSlideshow(), settings.changepicturecallback(), v = !0
            }), m(), a.ajaxcallback()
        }

        function n(t) {
            $pp_pic_holder.find("#pp_full_res object,#pp_full_res embed").css("visibility", "hidden"), $pp_pic_holder.find(".pp_fade").fadeOut(settings.animation_speed, function() {
                e(".pp_loaderIcon").show(), t()
            })
        }

        function r(t) {
            t > 1 ? e(".pp_nav").show() : e(".pp_nav").hide()
        }

        function l(e, t) {
            if (resized = !1, d(e, t), imageWidth = e, imageHeight = t, (k > j || b > I) && doresize && settings.allow_resize && !$) {
                for (resized = !0, fitting = !1; !fitting;) k > j ? (imageWidth = j - 200, imageHeight = t / e * imageWidth) : b > I ? (imageHeight = I - 200, imageWidth = e / t * imageHeight) : fitting = !0, b = imageHeight, k = imageWidth;
                (k > j || b > I) && l(k, b), d(imageWidth, imageHeight)
            }
            return {
                width: Math.floor(imageWidth),
                height: Math.floor(imageHeight),
                containerHeight: Math.floor(b),
                containerWidth: Math.floor(k) + 2 * settings.horizontal_padding,
                contentHeight: Math.floor(y),
                contentWidth: Math.floor(w),
                resized: resized
            }
        }

        function d(t, i) {
            t = parseFloat(t), i = parseFloat(i), $pp_details = $pp_pic_holder.find(".pp_details"), $pp_details.width(t), detailsHeight = parseFloat($pp_details.css("marginTop")) + parseFloat($pp_details.css("marginBottom")), $pp_details = $pp_details.clone().addClass(settings.theme).width(t).appendTo(e("body")).css({
                position: "absolute",
                top: -1e4
            }), detailsHeight += $pp_details.height(), detailsHeight = detailsHeight <= 34 ? 36 : detailsHeight, $pp_details.remove(), $pp_title = $pp_pic_holder.find(".ppt"), $pp_title.width(t), titleHeight = parseFloat($pp_title.css("marginTop")) + parseFloat($pp_title.css("marginBottom")), $pp_title = $pp_title.clone().appendTo(e("body")).css({
                position: "absolute",
                top: -1e4
            }), titleHeight += $pp_title.height(), $pp_title.remove(), y = i + detailsHeight, w = t, b = y + titleHeight + $pp_pic_holder.find(".pp_top").height() + $pp_pic_holder.find(".pp_bottom").height(), k = t
        }

        function h(e) {
            return e.match(/youtube\.com\/watch/i) || e.match(/youtu\.be/i) ? "youtube" : e.match(/vimeo\.com/i) ? "vimeo" : e.match(/\b.mov\b/i) ? "quicktime" : e.match(/\b.swf\b/i) ? "flash" : e.match(/\biframe=true\b/i) ? "iframe" : e.match(/\bajax=true\b/i) ? "ajax" : e.match(/\bcustom=true\b/i) ? "custom" : "#" == e.substr(0, 1) ? "inline" : "image"
        }

        function c() {
            if (doresize && "undefined" != typeof $pp_pic_holder) {
                if (scroll_pos = _(), contentHeight = $pp_pic_holder.height(), contentwidth = $pp_pic_holder.width(), projectedTop = I / 2 + scroll_pos.scrollTop - contentHeight / 2, projectedTop < 0 && (projectedTop = 0), contentHeight > I) return;
                $pp_pic_holder.css({
                    top: projectedTop,
                    left: j / 2 + scroll_pos.scrollLeft - contentwidth / 2
                })
            }
        }

        function _() {
            return self.pageYOffset ? {
                scrollTop: self.pageYOffset,
                scrollLeft: self.pageXOffset
            } : document.documentElement && document.documentElement.scrollTop ? {
                scrollTop: document.documentElement.scrollTop,
                scrollLeft: document.documentElement.scrollLeft
            } : document.body ? {
                scrollTop: document.body.scrollTop,
                scrollLeft: document.body.scrollLeft
            } : void 0
        }

        function g() {
            I = e(window).height(), j = e(window).width(), "undefined" != typeof $pp_overlay && $pp_overlay.height(e(document).height()).width(j)
        }

        function m() {
            isSet && settings.overlay_gallery && "image" == h(pp_images[set_position]) ? (itemWidth = 57, navWidth = "facebook" == settings.theme || "pp_default" == settings.theme ? 50 : 30, itemsPerPage = Math.floor((f.containerWidth - 100 - navWidth) / itemWidth), itemsPerPage = itemsPerPage < pp_images.length ? itemsPerPage : pp_images.length, totalPage = Math.ceil(pp_images.length / itemsPerPage) - 1, 0 == totalPage ? (navWidth = 0, $pp_gallery.find(".pp_arrow_next,.pp_arrow_previous").hide()) : $pp_gallery.find(".pp_arrow_next,.pp_arrow_previous").show(), galleryWidth = itemsPerPage * itemWidth, fullGalleryWidth = pp_images.length * itemWidth, $pp_gallery.css("margin-left", -(galleryWidth / 2 + navWidth / 2)).find("div:first").width(galleryWidth + 5).find("ul").width(fullGalleryWidth).find("li.selected").removeClass("selected"), goToPage = Math.floor(set_position / itemsPerPage) < totalPage ? Math.floor(set_position / itemsPerPage) : totalPage, e.prettyPhoto.changeGalleryPage(goToPage), $pp_gallery_li.filter(":eq(" + set_position + ")").addClass("selected")) : $pp_pic_holder.find(".pp_content").unbind("mouseenter mouseleave")
        }

        function u() {
            if (settings.social_tools && (facebook_like_link = settings.social_tools.replace("{location_href}", encodeURIComponent(location.href))), settings.markup = settings.markup.replace("{pp_social}", ""), e("body").append(settings.markup), $pp_pic_holder = e(".pp_pic_holder"), $ppt = e(".ppt"), $pp_overlay = e("div.pp_overlay"), isSet && settings.overlay_gallery) {
                currentGalleryPage = 0, toInject = "";
                for (var t = 0; t < pp_images.length; t++) pp_images[t].match(/\b(jpg|jpeg|png|gif)\b/gi) ? (classname = "", img_src = pp_images[t]) : (classname = "default", img_src = ""), toInject += "<li class='" + classname + "'><a href='#'><img src='" + img_src + "' width='50' alt='' /></a></li>";
                toInject = settings.gallery_markup.replace(/{gallery}/g, toInject), $pp_pic_holder.find("#pp_full_res").after(toInject), $pp_gallery = e(".pp_pic_holder .pp_gallery"), $pp_gallery_li = $pp_gallery.find("li"), $pp_gallery.find(".pp_arrow_next").click(function() {
                    return e.prettyPhoto.changeGalleryPage("next"), e.prettyPhoto.stopSlideshow(), !1
                }), $pp_gallery.find(".pp_arrow_previous").click(function() {
                    return e.prettyPhoto.changeGalleryPage("previous"), e.prettyPhoto.stopSlideshow(), !1
                }), $pp_pic_holder.find(".pp_content").hover(function() {
                    $pp_pic_holder.find(".pp_gallery:not(.disabled)").fadeIn()
                }, function() {
                    $pp_pic_holder.find(".pp_gallery:not(.disabled)").fadeOut()
                }), itemWidth = 57, $pp_gallery_li.each(function(t) {
                    e(this).find("a").click(function() {
                        return e.prettyPhoto.changePage(t), e.prettyPhoto.stopSlideshow(), !1
                    })
                })
            }
            settings.slideshow && ($pp_pic_holder.find(".pp_nav").prepend('<a href="#" class="pp_play">Play</a>'), $pp_pic_holder.find(".pp_nav .pp_play").click(function() {
                return e.prettyPhoto.startSlideshow(), !1
            })), $pp_pic_holder.attr("class", "pp_pic_holder " + settings.theme), $pp_overlay.css({
                opacity: 0,
                height: e(document).height(),
                width: e(window).width()
            }).bind("click", function() {
                settings.modal || e.prettyPhoto.close()
            }), e("a.pp_close").bind("click", function() {
                return e.prettyPhoto.close(), !1
            }), settings.allow_expand && e("a.pp_expand").bind("click", function() {
                return e(this).hasClass("pp_expand") ? (e(this).removeClass("pp_expand").addClass("pp_contract"), doresize = !1) : (e(this).removeClass("pp_contract").addClass("pp_expand"), doresize = !0), n(function() {
                    e.prettyPhoto.open()
                }), !1
            }), $pp_pic_holder.find(".pp_previous, .pp_nav .pp_arrow_previous").bind("click", function() {
                return e.prettyPhoto.changePage("previous"), e.prettyPhoto.stopSlideshow(), !1
            }), $pp_pic_holder.find(".pp_next, .pp_nav .pp_arrow_next").bind("click", function() {
                return e.prettyPhoto.changePage("next"), e.prettyPhoto.stopSlideshow(), !1
            }), c()
        }
        a = jQuery.extend({
            hook: "rel",
            animation_speed: "fast",
            ajaxcallback: function() {},
            slideshow: 5e3,
            autoplay_slideshow: !1,
            opacity: .8,
            show_title: !0,
            allow_resize: !0,
            allow_expand: !0,
            default_width: 500,
            default_height: 344,
            counter_separator_label: "/",
            theme: "pp_default",
            horizontal_padding: 20,
            hideflash: !1,
            wmode: "opaque",
            autoplay: !0,
            modal: !1,
            deeplinking: !0,
            overlay_gallery: !0,
            overlay_gallery_max: 30,
            keyboard_shortcuts: !0,
            changepicturecallback: function() {},
            callback: function() {},
            ie6_fallback: !0,
            markup: '<div class="pp_pic_holder">       <div class="ppt">&nbsp;</div>       <div class="pp_top">        <div class="pp_left"></div>        <div class="pp_middle"></div>        <div class="pp_right"></div>       </div>       <div class="pp_content_container">        <div class="pp_left">        <div class="pp_right">         <div class="pp_content">          <div class="pp_loaderIcon"></div>          <div class="pp_fade">           <a href="#" class="pp_expand" title="Expand the image">Expand</a>           <div class="pp_hoverContainer">            <a class="pp_next" href="#">next</a>            <a class="pp_previous" href="#">previous</a>           </div>           <div id="pp_full_res"></div>           <div class="pp_details">            <div class="pp_nav">             <a href="#" class="pp_arrow_previous">Previous</a>             <p class="currentTextHolder">0/0</p>             <a href="#" class="pp_arrow_next">Next</a>            </div>            <p class="pp_description"></p>            <div class="pp_social">{pp_social}</div>            <a class="pp_close" href="#">Close</a>           </div>          </div>         </div>        </div>        </div>       </div>       <div class="pp_bottom">        <div class="pp_left"></div>        <div class="pp_middle"></div>        <div class="pp_right"></div>       </div>      </div>      <div class="pp_overlay"></div>',
            gallery_markup: '<div class="pp_gallery">         <a href="#" class="pp_arrow_previous">Previous</a>         <div>          <ul>           {gallery}          </ul>         </div>         <a href="#" class="pp_arrow_next">Next</a>        </div>',
            image_markup: '<img id="fullResImage" src="{path}" />',
            flash_markup: '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="{width}" height="{height}"><param name="wmode" value="{wmode}" /><param name="allowfullscreen" value="true" /><param name="allowscriptaccess" value="always" /><param name="movie" value="{path}" /><embed src="{path}" type="application/x-shockwave-flash" allowfullscreen="true" allowscriptaccess="always" width="{width}" height="{height}" wmode="{wmode}"></embed></object>',
            quicktime_markup: '<object classid="clsid:02BF25D5-8C17-4B23-BC80-D3488ABDDC6B" codebase="http://www.apple.com/qtactivex/qtplugin.cab" height="{height}" width="{width}"><param name="src" value="{path}"><param name="autoplay" value="{autoplay}"><param name="type" value="video/quicktime"><embed src="{path}" height="{height}" width="{width}" autoplay="{autoplay}" type="video/quicktime" pluginspage="http://www.apple.com/quicktime/download/"></embed></object>',
            iframe_markup: '<iframe src ="{path}" width="{width}" height="{height}" frameborder="no"></iframe>',
            inline_markup: '<div class="pp_inline">{content}</div>',
            custom_markup: "",
            social_tools: '<div class="twitter"><a href="http://twitter.com/share" class="twitter-share-button" data-count="none">Tweet</a><script type="text/javascript" src="http://platform.twitter.com/widgets.js"></script></div><div class="facebook"><iframe src="//www.facebook.com/plugins/like.php?locale=en_US&href={location_href}&layout=button_count&show_faces=true&width=500&action=like&font&colorscheme=light&height=23" scrolling="no" frameborder="0" style="border:none; overflow:hidden; width:500px; height:23px;" allowTransparency="true"></iframe></div>'
        }, a);
        var f, v, y, w, b, k, P, x = this,
            $ = !1,
            I = e(window).height(),
            j = e(window).width();
        return doresize = !0, scroll_pos = _(), e(window).unbind("resize.prettyphoto").bind("resize.prettyphoto", function() {
            c(), g()
        }), a.keyboard_shortcuts && e(document).unbind("keydown.prettyphoto").bind("keydown.prettyphoto", function(t) {
            if ("undefined" != typeof $pp_pic_holder && $pp_pic_holder.is(":visible")) switch (t.keyCode) {
                case 37:
                    e.prettyPhoto.changePage("previous"), t.preventDefault();
                    break;
                case 39:
                    e.prettyPhoto.changePage("next"), t.preventDefault();
                    break;
                case 27:
                    settings.modal || e.prettyPhoto.close(), t.preventDefault()
            }
        }), e.prettyPhoto.initialize = function() {
            return settings = a, "pp_default" == settings.theme && (settings.horizontal_padding = 16), theRel = e(this).attr(settings.hook), galleryRegExp = /\[(?:.*)\]/, isSet = galleryRegExp.exec(theRel) ? !0 : !1, pp_images = isSet ? jQuery.map(x, function(t) {
                return -1 != e(t).attr(settings.hook).indexOf(theRel) ? e(t).attr("href") : void 0
            }) : e.makeArray(e(this).attr("href")), pp_titles = isSet ? jQuery.map(x, function(t) {
                return -1 != e(t).attr(settings.hook).indexOf(theRel) ? e(t).find("img").attr("alt") ? e(t).find("img").attr("alt") : "" : void 0
            }) : e.makeArray(e(this).find("img").attr("alt")), pp_descriptions = isSet ? jQuery.map(x, function(t) {
                return -1 != e(t).attr(settings.hook).indexOf(theRel) ? e(t).attr("title") ? e(t).attr("title") : "" : void 0
            }) : e.makeArray(e(this).attr("title")), pp_images.length > settings.overlay_gallery_max && (settings.overlay_gallery = !1), set_position = jQuery.inArray(e(this).attr("href"), pp_images), rel_index = isSet ? set_position : e("a[" + settings.hook + "^='" + theRel + "']").index(e(this)), u(this), settings.allow_resize && e(window).bind("scroll.prettyphoto", function() {
                c()
            }), e.prettyPhoto.open(), !1
        }, e.prettyPhoto.open = function(t) {
            return "undefined" == typeof settings && (settings = a, pp_images = e.makeArray(arguments[0]), pp_titles = e.makeArray(arguments[1] ? arguments[1] : ""), pp_descriptions = e.makeArray(arguments[2] ? arguments[2] : ""), isSet = pp_images.length > 1 ? !0 : !1, set_position = arguments[3] ? arguments[3] : 0, u(t.target)), settings.hideflash && e("object,embed,iframe[src*=youtube],iframe[src*=vimeo]").css("visibility", "hidden"), r(e(pp_images).size()), e(".pp_loaderIcon").show(), settings.deeplinking && i(), settings.social_tools && (facebook_like_link = settings.social_tools.replace("{location_href}", encodeURIComponent(location.href)), $pp_pic_holder.find(".pp_social").html(facebook_like_link)), $ppt.is(":hidden") && $ppt.css("opacity", 0).show(), $pp_overlay.show().fadeTo(settings.animation_speed, settings.opacity), $pp_pic_holder.find(".currentTextHolder").text(set_position + 1 + settings.counter_separator_label + e(pp_images).size()), "undefined" != typeof pp_descriptions[set_position] && "" != pp_descriptions[set_position] ? $pp_pic_holder.find(".pp_description").show().html(unescape(pp_descriptions[set_position])) : $pp_pic_holder.find(".pp_description").hide(), movie_width = parseFloat(o("width", pp_images[set_position])) ? o("width", pp_images[set_position]) : settings.default_width.toString(), movie_height = parseFloat(o("height", pp_images[set_position])) ? o("height", pp_images[set_position]) : settings.default_height.toString(), $ = !1, -1 != movie_height.indexOf("%") && (movie_height = parseFloat(e(window).height() * parseFloat(movie_height) / 100 - 150), $ = !0), -1 != movie_width.indexOf("%") && (movie_width = parseFloat(e(window).width() * parseFloat(movie_width) / 100 - 150), $ = !0), $pp_pic_holder.fadeIn(function() {
                switch ($ppt.html(settings.show_title && "" != pp_titles[set_position] && "undefined" != typeof pp_titles[set_position] ? unescape(pp_titles[set_position]) : "&nbsp;"), imgPreloader = "", skipInjection = !1, h(pp_images[set_position])) {
                    case "image":
                        imgPreloader = new Image, nextImage = new Image, isSet && set_position < e(pp_images).size() - 1 && (nextImage.src = pp_images[set_position + 1]), prevImage = new Image, isSet && pp_images[set_position - 1] && (prevImage.src = pp_images[set_position - 1]), $pp_pic_holder.find("#pp_full_res")[0].innerHTML = settings.image_markup.replace(/{path}/g, pp_images[set_position]), imgPreloader.onload = function() {
                            f = l(imgPreloader.width, imgPreloader.height), s()
                        }, imgPreloader.onerror = function() {
                            alert("Image cannot be loaded. Make sure the path is correct and image exist."), e.prettyPhoto.close()
                        }, imgPreloader.src = pp_images[set_position];
                        break;
                    case "youtube":
                        f = l(movie_width, movie_height), movie_id = o("v", pp_images[set_position]), "" == movie_id && (movie_id = pp_images[set_position].split("youtu.be/"), movie_id = movie_id[1], movie_id.indexOf("?") > 0 && (movie_id = movie_id.substr(0, movie_id.indexOf("?"))), movie_id.indexOf("&") > 0 && (movie_id = movie_id.substr(0, movie_id.indexOf("&")))), movie = "https://www.youtube.com/embed/" + movie_id, movie += o("rel", pp_images[set_position]) ? "?rel=" + o("rel", pp_images[set_position]) : "?rel=1", settings.autoplay && (movie += "&autoplay=1"), toInject = settings.iframe_markup.replace(/{width}/g, f.width).replace(/{height}/g, f.height).replace(/{wmode}/g, settings.wmode).replace(/{path}/g, movie);
                        break;
                    case "vimeo":
                        f = l(movie_width, movie_height), movie_id = pp_images[set_position];
                        var t = /http(s?):\/\/(www\.)?vimeo.com\/(\d+)/,
                            i = movie_id.match(t);
                        movie = "https://player.vimeo.com/video/" + i[3] + "?title=0&byline=0&portrait=0", settings.autoplay && (movie += "&autoplay=1;"), vimeo_width = f.width + "/embed/?moog_width=" + f.width, toInject = settings.iframe_markup.replace(/{width}/g, vimeo_width).replace(/{height}/g, f.height).replace(/{path}/g, movie);
                        break;
                    case "quicktime":
                        f = l(movie_width, movie_height), f.height += 15, f.contentHeight += 15, f.containerHeight += 15, toInject = settings.quicktime_markup.replace(/{width}/g, f.width).replace(/{height}/g, f.height).replace(/{wmode}/g, settings.wmode).replace(/{path}/g, pp_images[set_position]).replace(/{autoplay}/g, settings.autoplay);
                        break;
                    case "flash":
                        f = l(movie_width, movie_height), flash_vars = pp_images[set_position], flash_vars = flash_vars.substring(pp_images[set_position].indexOf("flashvars") + 10, pp_images[set_position].length), filename = pp_images[set_position], filename = filename.substring(0, filename.indexOf("?")), toInject = settings.flash_markup.replace(/{width}/g, f.width).replace(/{height}/g, f.height).replace(/{wmode}/g, settings.wmode).replace(/{path}/g, filename + "?" + flash_vars);
                        break;
                    case "iframe":
                        f = l(movie_width, movie_height), frame_url = pp_images[set_position], frame_url = frame_url.substr(0, frame_url.indexOf("iframe") - 1), toInject = settings.iframe_markup.replace(/{width}/g, f.width).replace(/{height}/g, f.height).replace(/{path}/g, frame_url);
                        break;
                    case "ajax":
                        doresize = !1, f = l(movie_width, movie_height), doresize = !0, skipInjection = !0, e.get(pp_images[set_position], function(e) {
                            toInject = settings.inline_markup.replace(/{content}/g, e), $pp_pic_holder.find("#pp_full_res")[0].innerHTML = toInject, s()
                        });
                        break;
                    case "custom":
                        f = l(movie_width, movie_height), toInject = settings.custom_markup;
                        break;
                    case "inline":
                        myClone = e(pp_images[set_position]).clone().append('<br clear="all" />').css({
                            width: settings.default_width
                        }).wrapInner('<div id="pp_full_res"><div class="pp_inline"></div></div>').appendTo(e("body")).show(), doresize = !1, f = l(e(myClone).width(), e(myClone).height()), doresize = !0, e(myClone).remove(), toInject = settings.inline_markup.replace(/{content}/g, e(pp_images[set_position]).html())
                }
                imgPreloader || skipInjection || ($pp_pic_holder.find("#pp_full_res")[0].innerHTML = toInject, s())
            }), !1
        }, e.prettyPhoto.changePage = function(t) {
            currentGalleryPage = 0, "previous" == t ? (set_position--, set_position < 0 && (set_position = e(pp_images).size() - 1)) : "next" == t ? (set_position++, set_position > e(pp_images).size() - 1 && (set_position = 0)) : set_position = t, rel_index = set_position, doresize || (doresize = !0), settings.allow_expand && e(".pp_contract").removeClass("pp_contract").addClass("pp_expand"), n(function() {
                e.prettyPhoto.open()
            })
        }, e.prettyPhoto.changeGalleryPage = function(e) {
            "next" == e ? (currentGalleryPage++, currentGalleryPage > totalPage && (currentGalleryPage = 0)) : "previous" == e ? (currentGalleryPage--, currentGalleryPage < 0 && (currentGalleryPage = totalPage)) : currentGalleryPage = e, slide_speed = "next" == e || "previous" == e ? settings.animation_speed : 0, slide_to = currentGalleryPage * itemsPerPage * itemWidth, $pp_gallery.find("ul").animate({
                left: -slide_to
            }, slide_speed)
        }, e.prettyPhoto.startSlideshow = function() {
            "undefined" == typeof P ? ($pp_pic_holder.find(".pp_play").unbind("click").removeClass("pp_play").addClass("pp_pause").click(function() {
                return e.prettyPhoto.stopSlideshow(), !1
            }), P = setInterval(e.prettyPhoto.startSlideshow, settings.slideshow)) : e.prettyPhoto.changePage("next")
        }, e.prettyPhoto.stopSlideshow = function() {
            $pp_pic_holder.find(".pp_pause").unbind("click").removeClass("pp_pause").addClass("pp_play").click(function() {
                return e.prettyPhoto.startSlideshow(), !1
            }), clearInterval(P), P = void 0
        }, e.prettyPhoto.close = function() {
            $pp_overlay.is(":animated") || (e.prettyPhoto.stopSlideshow(), $pp_pic_holder.stop().find("object,embed").css("visibility", "hidden"), e("div.pp_pic_holder,div.ppt,.pp_fade").fadeOut(settings.animation_speed, function() {
                e(this).remove()
            }), $pp_overlay.fadeOut(settings.animation_speed, function() {
                settings.hideflash && e("object,embed,iframe[src*=youtube],iframe[src*=vimeo]").css("visibility", "visible"), e(this).remove(), e(window).unbind("scroll.prettyphoto"), p(), settings.callback(), doresize = !0, v = !1, delete settings
            }))
        }, !pp_alreadyInitialized && t() && (pp_alreadyInitialized = !0, hashIndex = t(), hashRel = hashIndex, hashIndex = hashIndex.substring(hashIndex.indexOf("/") + 1, hashIndex.length - 1), hashRel = hashRel.substring(0, hashRel.indexOf("/")), setTimeout(function() {
            e("a[" + a.hook + "^='" + hashRel + "']:eq(" + hashIndex + ")").trigger("click")
        }, 50)), this.unbind("click.prettyphoto").bind("click.prettyphoto", e.prettyPhoto.initialize)
    }
}(jQuery);
var pp_alreadyInitialized = !1;;
/*!
 * FitVids 1.0
 *
 * Copyright 2011, Chris Coyier - http://css-tricks.com + Dave Rupert - http://daverupert.com
 * Credit to Thierry Koblentz - http://www.alistapart.com/articles/creating-intrinsic-ratios-for-video/
 * Released under the WTFPL license - http://sam.zoy.org/wtfpl/
 *
 * Date: Thu Sept 01 18:00:00 2011 -0500
 */
(function($) {
    "use strict";
    $.fn.fitVids = function(options) {
        var settings = {
            customSelector: null
        };
        if (!document.getElementById('fit-vids-style')) {
            var div = document.createElement('div'),
                ref = document.getElementsByTagName('base')[0] || document.getElementsByTagName('script')[0];
            div.className = 'fit-vids-style';
            div.id = 'fit-vids-style';
            div.style.display = 'none';
            div.innerHTML = '&shy;<style>                 .fluid-width-video-wrapper {                   width: 100%;                                position: relative;                         padding: 0;                            min-height: 1px;                         }                                                                                       .fluid-width-video-wrapper iframe,          .fluid-width-video-wrapper object,          .fluid-width-video-wrapper embed {             position: absolute;                         top: 0;                                     left: 0;                                    width: 100%;                                height: 100%;                            }                                         </style>';
            ref.parentNode.insertBefore(div, ref)
        }
        if (options) {
            $.extend(settings, options)
        }
        return this.each(function() {
            var selectors = ["iframe[src*='player.vimeo.com']", "iframe[src*='youtube.com']", "iframe[src*='youtube-nocookie.com']", "iframe[src*='kickstarter.com'][src*='video.html']", "object", "embed"];
            if (settings.customSelector) {
                selectors.push(settings.customSelector)
            }
            var $allVideos = $(this).find(selectors.join(','));
            $allVideos = $allVideos.not("object object");
            $allVideos.each(function() {
                var $this = $(this);
                if (this.tagName.toLowerCase() === 'embed' && $this.parent('object').length || $this.parent('.fluid-width-video-wrapper').length) {
                    return
                }
                if ($this.closest('.flexslider').length > 0) {
                    if ($this.closest('ul').find('li > img').length > 0) {
                        var height = $this.closest('ul').height()
                    } else if ($this.closest('ul').find('video-wrap').length > 0) {
                        var height = $this.closest('ul').find('video-wrap').height()
                    } else {
                        var height = 500
                    }
                    var width = !isNaN(parseInt($this.closest('li').attr('width'), 10)) ? parseInt($this.closest('li').attr('width'), 10) : $this.closest('li').width();
                    var aspectRatio = height / width
                } else if ($this.closest('.portfolio_images').length > 0) {
                    var width = $j('.portfolio_images').width();
                    if ($this.next('img').length > 0) {
                        var height = $this.next('img').height()
                    } else {
                        var height = 500
                    }
                    var aspectRatio = height / width
                } else if ($this.closest('.post_image').length) {
                    var height = (this.tagName.toLowerCase() === 'object' || ($this.attr('height') && !isNaN(parseInt($this.attr('height'), 10)))) ? parseInt($this.attr('height'), 10) : $this.height(),
                        width = !isNaN(parseInt($this.attr('width'), 10)) ? parseInt($this.attr('width'), 10) : $this.width(),
                        aspectRatio = height / width
                } else if ($this.closest('.q_masonry_blog_post_image').length) {
                    var height = (this.tagName.toLowerCase() === 'object' || ($this.attr('height') && !isNaN(parseInt($this.attr('height'), 10)))) ? parseInt($this.attr('height'), 10) : $this.height(),
                        width = !isNaN(parseInt($this.attr('width'), 10)) ? parseInt($this.attr('width'), 10) : $this.width(),
                        aspectRatio = height / width
                } else {
                    var height = (this.tagName.toLowerCase() === 'object' || ($this.attr('height') && !isNaN(parseInt($this.attr('height'), 10)))) ? parseInt($this.attr('height'), 10) : $this.height(),
                        width = !isNaN(parseInt($this.attr('width'), 10)) ? parseInt($this.attr('width'), 10) : $this.parent().width(),
                        aspectRatio = height / width
                }
                if (!$this.attr('id')) {
                    var videoID = 'fitvid' + Math.floor(Math.random() * 999999);
                    $this.attr('id', videoID)
                }
                $this.wrap('<div class="fluid-width-video-wrapper"></div>');
                $('.fluid-width-video-wrapper').css('padding-top', (aspectRatio * 100) + "%")
            })
        })
    }
})(jQuery);;
/*
 * jQuery FlexSlider v2.6.0
 * Copyright 2012 WooThemes
 * Contributing Author: Tyler Smith
 */
! function($) {
    var e = !0;
    $.flexslider = function(t, a) {
        var n = $(t);
        n.vars = $.extend({}, $.flexslider.defaults, a);
        var i = n.vars.namespace,
            s = window.navigator && window.navigator.msPointerEnabled && window.MSGesture,
            r = ("ontouchstart" in window || s || window.DocumentTouch && document instanceof DocumentTouch) && n.vars.touch,
            o = "click touchend MSPointerUp keyup",
            l = "",
            c, d = "vertical" === n.vars.direction,
            u = n.vars.reverse,
            v = n.vars.itemWidth > 0,
            p = "fade" === n.vars.animation,
            m = "" !== n.vars.asNavFor,
            f = {};
        $.data(t, "flexslider", n), f = {
            init: function() {
                n.animating = !1, n.currentSlide = parseInt(n.vars.startAt ? n.vars.startAt : 0, 10), isNaN(n.currentSlide) && (n.currentSlide = 0), n.animatingTo = n.currentSlide, n.atEnd = 0 === n.currentSlide || n.currentSlide === n.last, n.containerSelector = n.vars.selector.substr(0, n.vars.selector.search(" ")), n.slides = $(n.vars.selector, n), n.container = $(n.containerSelector, n), n.count = n.slides.length, n.syncExists = $(n.vars.sync).length > 0, "slide" === n.vars.animation && (n.vars.animation = "swing"), n.prop = d ? "top" : "marginLeft", n.args = {}, n.manualPause = !1, n.stopped = !1, n.started = !1, n.startTimeout = null, n.transitions = !n.vars.video && !p && n.vars.useCSS && function() {
                    var e = document.createElement("div"),
                        t = ["perspectiveProperty", "WebkitPerspective", "MozPerspective", "OPerspective", "msPerspective"];
                    for (var a in t)
                        if (void 0 !== e.style[t[a]]) return n.pfx = t[a].replace("Perspective", "").toLowerCase(), n.prop = "-" + n.pfx + "-transform", !0;
                    return !1
                }(), n.ensureAnimationEnd = "", "" !== n.vars.controlsContainer && (n.controlsContainer = $(n.vars.controlsContainer).length > 0 && $(n.vars.controlsContainer)), "" !== n.vars.manualControls && (n.manualControls = $(n.vars.manualControls).length > 0 && $(n.vars.manualControls)), "" !== n.vars.customDirectionNav && (n.customDirectionNav = 2 === $(n.vars.customDirectionNav).length && $(n.vars.customDirectionNav)), n.vars.randomize && (n.slides.sort(function() {
                    return Math.round(Math.random()) - .5
                }), n.container.empty().append(n.slides)), n.doMath(), n.setup("init"), n.vars.controlNav && f.controlNav.setup(), n.vars.directionNav && f.directionNav.setup(), n.vars.keyboard && (1 === $(n.containerSelector).length || n.vars.multipleKeyboard) && $(document).bind("keyup", function(e) {
                    var t = e.keyCode;
                    if (!n.animating && (39 === t || 37 === t)) {
                        var a = 39 === t ? n.getTarget("next") : 37 === t ? n.getTarget("prev") : !1;
                        n.flexAnimate(a, n.vars.pauseOnAction)
                    }
                }), n.vars.mousewheel && n.bind("mousewheel", function(e, t, a, i) {
                    e.preventDefault();
                    var s = 0 > t ? n.getTarget("next") : n.getTarget("prev");
                    n.flexAnimate(s, n.vars.pauseOnAction)
                }), n.vars.pausePlay && f.pausePlay.setup(), n.vars.slideshow && n.vars.pauseInvisible && f.pauseInvisible.init(), n.vars.slideshow && (n.vars.pauseOnHover && n.hover(function() {
                    n.manualPlay || n.manualPause || n.pause()
                }, function() {
                    n.manualPause || n.manualPlay || n.stopped || n.play()
                }), n.vars.pauseInvisible && f.pauseInvisible.isHidden() || (n.vars.initDelay > 0 ? n.startTimeout = setTimeout(n.play, n.vars.initDelay) : n.play())), m && f.asNav.setup(), r && n.vars.touch && f.touch(), (!p || p && n.vars.smoothHeight) && $(window).bind("resize orientationchange focus", f.resize), n.find("img").attr("draggable", "false"), setTimeout(function() {
                    n.vars.start(n)
                }, 200)
            },
            asNav: {
                setup: function() {
                    n.asNav = !0, n.animatingTo = Math.floor(n.currentSlide / n.move), n.currentItem = n.currentSlide, n.slides.removeClass(i + "active-slide").eq(n.currentItem).addClass(i + "active-slide"), s ? (t._slider = n, n.slides.each(function() {
                        var e = this;
                        e._gesture = new MSGesture, e._gesture.target = e, e.addEventListener("MSPointerDown", function(e) {
                            e.preventDefault(), e.currentTarget._gesture && e.currentTarget._gesture.addPointer(e.pointerId)
                        }, !1), e.addEventListener("MSGestureTap", function(e) {
                            e.preventDefault();
                            var t = $(this),
                                a = t.index();
                            $(n.vars.asNavFor).data("flexslider").animating || t.hasClass("active") || (n.direction = n.currentItem < a ? "next" : "prev", n.flexAnimate(a, n.vars.pauseOnAction, !1, !0, !0))
                        })
                    })) : n.slides.on(o, function(e) {
                        e.preventDefault();
                        var t = $(this),
                            a = t.index(),
                            s = t.offset().left - $(n).scrollLeft();
                        0 >= s && t.hasClass(i + "active-slide") ? n.flexAnimate(n.getTarget("prev"), !0) : $(n.vars.asNavFor).data("flexslider").animating || t.hasClass(i + "active-slide") || (n.direction = n.currentItem < a ? "next" : "prev", n.flexAnimate(a, n.vars.pauseOnAction, !1, !0, !0))
                    })
                }
            },
            controlNav: {
                setup: function() {
                    n.manualControls ? f.controlNav.setupManual() : f.controlNav.setupPaging()
                },
                setupPaging: function() {
                    var e = "thumbnails" === n.vars.controlNav ? "control-thumbs" : "control-paging",
                        t = 1,
                        a, s;
                    if (n.controlNavScaffold = $('<ol class="' + i + "control-nav " + i + e + '"></ol>'), n.pagingCount > 1)
                        for (var r = 0; r < n.pagingCount; r++) {
                            if (s = n.slides.eq(r), void 0 === s.attr("data-thumb-alt") && s.attr("data-thumb-alt", ""), altText = "" !== s.attr("data-thumb-alt") ? altText = ' alt="' + s.attr("data-thumb-alt") + '"' : "", a = "thumbnails" === n.vars.controlNav ? '<img src="' + s.attr("data-thumb") + '"' + altText + "/>" : '<a href="#">' + t + "</a>", "thumbnails" === n.vars.controlNav && !0 === n.vars.thumbCaptions) {
                                var c = s.attr("data-thumbcaption");
                                "" !== c && void 0 !== c && (a += '<span class="' + i + 'caption">' + c + "</span>")
                            }
                            n.controlNavScaffold.append("<li>" + a + "</li>"), t++
                        }
                    n.controlsContainer ? $(n.controlsContainer).append(n.controlNavScaffold) : n.append(n.controlNavScaffold), f.controlNav.set(), f.controlNav.active(), n.controlNavScaffold.delegate("a, img", o, function(e) {
                        if (e.preventDefault(), "" === l || l === e.type) {
                            var t = $(this),
                                a = n.controlNav.index(t);
                            t.hasClass(i + "active") || (n.direction = a > n.currentSlide ? "next" : "prev", n.flexAnimate(a, n.vars.pauseOnAction))
                        }
                        "" === l && (l = e.type), f.setToClearWatchedEvent()
                    })
                },
                setupManual: function() {
                    n.controlNav = n.manualControls, f.controlNav.active(), n.controlNav.bind(o, function(e) {
                        if (e.preventDefault(), "" === l || l === e.type) {
                            var t = $(this),
                                a = n.controlNav.index(t);
                            t.hasClass(i + "active") || (a > n.currentSlide ? n.direction = "next" : n.direction = "prev", n.flexAnimate(a, n.vars.pauseOnAction))
                        }
                        "" === l && (l = e.type), f.setToClearWatchedEvent()
                    })
                },
                set: function() {
                    var e = "thumbnails" === n.vars.controlNav ? "img" : "a";
                    n.controlNav = $("." + i + "control-nav li " + e, n.controlsContainer ? n.controlsContainer : n)
                },
                active: function() {
                    n.controlNav.removeClass(i + "active").eq(n.animatingTo).addClass(i + "active")
                },
                update: function(e, t) {
                    n.pagingCount > 1 && "add" === e ? n.controlNavScaffold.append($('<li><a href="#">' + n.count + "</a></li>")) : 1 === n.pagingCount ? n.controlNavScaffold.find("li").remove() : n.controlNav.eq(t).closest("li").remove(), f.controlNav.set(), n.pagingCount > 1 && n.pagingCount !== n.controlNav.length ? n.update(t, e) : f.controlNav.active()
                }
            },
            directionNav: {
                setup: function() {
                    var e = $('<ul class="' + i + 'direction-nav"><li class="' + i + 'nav-prev"><a class="' + i + 'prev" href="#">' + n.vars.prevText + '</a></li><li class="' + i + 'nav-next"><a class="' + i + 'next" href="#">' + n.vars.nextText + "</a></li></ul>");
                    n.customDirectionNav ? n.directionNav = n.customDirectionNav : n.controlsContainer ? ($(n.controlsContainer).append(e), n.directionNav = $("." + i + "direction-nav li a", n.controlsContainer)) : (n.append(e), n.directionNav = $("." + i + "direction-nav li a", n)), f.directionNav.update(), n.directionNav.bind(o, function(e) {
                        e.preventDefault();
                        var t;
                        ("" === l || l === e.type) && (t = $(this).hasClass(i + "next") ? n.getTarget("next") : n.getTarget("prev"), n.flexAnimate(t, n.vars.pauseOnAction)), "" === l && (l = e.type), f.setToClearWatchedEvent()
                    })
                },
                update: function() {
                    var e = i + "disabled";
                    1 === n.pagingCount ? n.directionNav.addClass(e).attr("tabindex", "-1") : n.vars.animationLoop ? n.directionNav.removeClass(e).removeAttr("tabindex") : 0 === n.animatingTo ? n.directionNav.removeClass(e).filter("." + i + "prev").addClass(e).attr("tabindex", "-1") : n.animatingTo === n.last ? n.directionNav.removeClass(e).filter("." + i + "next").addClass(e).attr("tabindex", "-1") : n.directionNav.removeClass(e).removeAttr("tabindex")
                }
            },
            pausePlay: {
                setup: function() {
                    var e = $('<div class="' + i + 'pauseplay"><a href="#"></a></div>');
                    n.controlsContainer ? (n.controlsContainer.append(e), n.pausePlay = $("." + i + "pauseplay a", n.controlsContainer)) : (n.append(e), n.pausePlay = $("." + i + "pauseplay a", n)), f.pausePlay.update(n.vars.slideshow ? i + "pause" : i + "play"), n.pausePlay.bind(o, function(e) {
                        e.preventDefault(), ("" === l || l === e.type) && ($(this).hasClass(i + "pause") ? (n.manualPause = !0, n.manualPlay = !1, n.pause()) : (n.manualPause = !1, n.manualPlay = !0, n.play())), "" === l && (l = e.type), f.setToClearWatchedEvent()
                    })
                },
                update: function(e) {
                    "play" === e ? n.pausePlay.removeClass(i + "pause").addClass(i + "play").html(n.vars.playText) : n.pausePlay.removeClass(i + "play").addClass(i + "pause").html(n.vars.pauseText)
                }
            },
            touch: function() {
                function e(e) {
                    e.stopPropagation(), n.animating ? e.preventDefault() : (n.pause(), t._gesture.addPointer(e.pointerId), T = 0, c = d ? n.h : n.w, f = Number(new Date), l = v && u && n.animatingTo === n.last ? 0 : v && u ? n.limit - (n.itemW + n.vars.itemMargin) * n.move * n.animatingTo : v && n.currentSlide === n.last ? n.limit : v ? (n.itemW + n.vars.itemMargin) * n.move * n.currentSlide : u ? (n.last - n.currentSlide + n.cloneOffset) * c : (n.currentSlide + n.cloneOffset) * c)
                }

                function a(e) {
                    e.stopPropagation();
                    var a = e.target._slider;
                    if (a) {
                        var n = -e.translationX,
                            i = -e.translationY;
                        return T += d ? i : n, m = T, x = d ? Math.abs(T) < Math.abs(-n) : Math.abs(T) < Math.abs(-i), e.detail === e.MSGESTURE_FLAG_INERTIA ? void setImmediate(function() {
                            t._gesture.stop()
                        }) : void((!x || Number(new Date) - f > 500) && (e.preventDefault(), !p && a.transitions && (a.vars.animationLoop || (m = T / (0 === a.currentSlide && 0 > T || a.currentSlide === a.last && T > 0 ? Math.abs(T) / c + 2 : 1)), a.setProps(l + m, "setTouch"))))
                    }
                }

                function i(e) {
                    e.stopPropagation();
                    var t = e.target._slider;
                    if (t) {
                        if (t.animatingTo === t.currentSlide && !x && null !== m) {
                            var a = u ? -m : m,
                                n = a > 0 ? t.getTarget("next") : t.getTarget("prev");
                            t.canAdvance(n) && (Number(new Date) - f < 550 && Math.abs(a) > 50 || Math.abs(a) > c / 2) ? t.flexAnimate(n, t.vars.pauseOnAction) : p || t.flexAnimate(t.currentSlide, t.vars.pauseOnAction, !0)
                        }
                        r = null, o = null, m = null, l = null, T = 0
                    }
                }
                var r, o, l, c, m, f, g, h, S, x = !1,
                    y = 0,
                    b = 0,
                    T = 0;
                s ? (t.style.msTouchAction = "none", t._gesture = new MSGesture, t._gesture.target = t, t.addEventListener("MSPointerDown", e, !1), t._slider = n, t.addEventListener("MSGestureChange", a, !1), t.addEventListener("MSGestureEnd", i, !1)) : (g = function(e) {
                    n.animating ? e.preventDefault() : (window.navigator.msPointerEnabled || 1 === e.touches.length) && (n.pause(), c = d ? n.h : n.w, f = Number(new Date), y = e.touches[0].pageX, b = e.touches[0].pageY, l = v && u && n.animatingTo === n.last ? 0 : v && u ? n.limit - (n.itemW + n.vars.itemMargin) * n.move * n.animatingTo : v && n.currentSlide === n.last ? n.limit : v ? (n.itemW + n.vars.itemMargin) * n.move * n.currentSlide : u ? (n.last - n.currentSlide + n.cloneOffset) * c : (n.currentSlide + n.cloneOffset) * c, r = d ? b : y, o = d ? y : b, t.addEventListener("touchmove", h, !1), t.addEventListener("touchend", S, !1))
                }, h = function(e) {
                    y = e.touches[0].pageX, b = e.touches[0].pageY, m = d ? r - b : r - y, x = d ? Math.abs(m) < Math.abs(y - o) : Math.abs(m) < Math.abs(b - o);
                    var t = 500;
                    (!x || Number(new Date) - f > t) && (e.preventDefault(), !p && n.transitions && (n.vars.animationLoop || (m /= 0 === n.currentSlide && 0 > m || n.currentSlide === n.last && m > 0 ? Math.abs(m) / c + 2 : 1), n.setProps(l + m, "setTouch")))
                }, S = function(e) {
                    if (t.removeEventListener("touchmove", h, !1), n.animatingTo === n.currentSlide && !x && null !== m) {
                        var a = u ? -m : m,
                            i = a > 0 ? n.getTarget("next") : n.getTarget("prev");
                        n.canAdvance(i) && (Number(new Date) - f < 550 && Math.abs(a) > 50 || Math.abs(a) > c / 2) ? n.flexAnimate(i, n.vars.pauseOnAction) : p || n.flexAnimate(n.currentSlide, n.vars.pauseOnAction, !0)
                    }
                    t.removeEventListener("touchend", S, !1), r = null, o = null, m = null, l = null
                }, t.addEventListener("touchstart", g, !1))
            },
            resize: function() {
                !n.animating && n.is(":visible") && (v || n.doMath(), p ? f.smoothHeight() : v ? (n.slides.width(n.computedW), n.update(n.pagingCount), n.setProps()) : d ? (n.viewport.height(n.h), n.setProps(n.h, "setTotal")) : (n.vars.smoothHeight && f.smoothHeight(), n.newSlides.width(n.computedW), n.setProps(n.computedW, "setTotal")))
            },
            smoothHeight: function(e) {
                if (!d || p) {
                    var t = p ? n : n.viewport;
                    e ? t.animate({
                        height: n.slides.eq(n.animatingTo).height()
                    }, e) : t.height(n.slides.eq(n.animatingTo).height())
                }
            },
            sync: function(e) {
                var t = $(n.vars.sync).data("flexslider"),
                    a = n.animatingTo;
                switch (e) {
                    case "animate":
                        t.flexAnimate(a, n.vars.pauseOnAction, !1, !0);
                        break;
                    case "play":
                        t.playing || t.asNav || t.play();
                        break;
                    case "pause":
                        t.pause()
                }
            },
            uniqueID: function(e) {
                return e.filter("[id]").add(e.find("[id]")).each(function() {
                    var e = $(this);
                    e.attr("id", e.attr("id") + "_clone")
                }), e
            },
            pauseInvisible: {
                visProp: null,
                init: function() {
                    var e = f.pauseInvisible.getHiddenProp();
                    if (e) {
                        var t = e.replace(/[H|h]idden/, "") + "visibilitychange";
                        document.addEventListener(t, function() {
                            f.pauseInvisible.isHidden() ? n.startTimeout ? clearTimeout(n.startTimeout) : n.pause() : n.started ? n.play() : n.vars.initDelay > 0 ? setTimeout(n.play, n.vars.initDelay) : n.play()
                        })
                    }
                },
                isHidden: function() {
                    var e = f.pauseInvisible.getHiddenProp();
                    return e ? document[e] : !1
                },
                getHiddenProp: function() {
                    var e = ["webkit", "moz", "ms", "o"];
                    if ("hidden" in document) return "hidden";
                    for (var t = 0; t < e.length; t++)
                        if (e[t] + "Hidden" in document) return e[t] + "Hidden";
                    return null
                }
            },
            setToClearWatchedEvent: function() {
                clearTimeout(c), c = setTimeout(function() {
                    l = ""
                }, 3e3)
            }
        }, n.flexAnimate = function(e, t, a, s, o) {
            if (n.vars.animationLoop || e === n.currentSlide || (n.direction = e > n.currentSlide ? "next" : "prev"), m && 1 === n.pagingCount && (n.direction = n.currentItem < e ? "next" : "prev"), !n.animating && (n.canAdvance(e, o) || a) && n.is(":visible")) {
                if (m && s) {
                    var l = $(n.vars.asNavFor).data("flexslider");
                    if (n.atEnd = 0 === e || e === n.count - 1, l.flexAnimate(e, !0, !1, !0, o), n.direction = n.currentItem < e ? "next" : "prev", l.direction = n.direction, Math.ceil((e + 1) / n.visible) - 1 === n.currentSlide || 0 === e) return n.currentItem = e, n.slides.removeClass(i + "active-slide").eq(e).addClass(i + "active-slide"), !1;
                    n.currentItem = e, n.slides.removeClass(i + "active-slide").eq(e).addClass(i + "active-slide"), e = Math.floor(e / n.visible)
                }
                if (n.animating = !0, n.animatingTo = e, t && n.pause(), n.vars.before(n), n.syncExists && !o && f.sync("animate"), n.vars.controlNav && f.controlNav.active(), v || n.slides.removeClass(i + "active-slide").eq(e).addClass(i + "active-slide"), n.atEnd = 0 === e || e === n.last, n.vars.directionNav && f.directionNav.update(), e === n.last && (n.vars.end(n), n.vars.animationLoop || n.pause()), p) r ? (n.slides.eq(n.currentSlide).css({
                    opacity: 0,
                    zIndex: 1
                }), n.slides.eq(e).css({
                    opacity: 1,
                    zIndex: 2
                }), n.wrapup(c)) : (n.slides.eq(n.currentSlide).css({
                    zIndex: 1
                }).animate({
                    opacity: 0
                }, n.vars.animationSpeed, n.vars.easing), n.slides.eq(e).css({
                    zIndex: 2
                }).animate({
                    opacity: 1
                }, n.vars.animationSpeed, n.vars.easing, n.wrapup));
                else {
                    var c = d ? n.slides.filter(":first").height() : n.computedW,
                        g, h, S;
                    v ? (g = n.vars.itemMargin, S = (n.itemW + g) * n.move * n.animatingTo, h = S > n.limit && 1 !== n.visible ? n.limit : S) : h = 0 === n.currentSlide && e === n.count - 1 && n.vars.animationLoop && "next" !== n.direction ? u ? (n.count + n.cloneOffset) * c : 0 : n.currentSlide === n.last && 0 === e && n.vars.animationLoop && "prev" !== n.direction ? u ? 0 : (n.count + 1) * c : u ? (n.count - 1 - e + n.cloneOffset) * c : (e + n.cloneOffset) * c, n.setProps(h, "", n.vars.animationSpeed), n.transitions ? (n.vars.animationLoop && n.atEnd || (n.animating = !1, n.currentSlide = n.animatingTo), n.container.unbind("webkitTransitionEnd transitionend"), n.container.bind("webkitTransitionEnd transitionend", function() {
                        clearTimeout(n.ensureAnimationEnd), n.wrapup(c)
                    }), clearTimeout(n.ensureAnimationEnd), n.ensureAnimationEnd = setTimeout(function() {
                        n.wrapup(c)
                    }, n.vars.animationSpeed + 100)) : n.container.animate(n.args, n.vars.animationSpeed, n.vars.easing, function() {
                        n.wrapup(c)
                    })
                }
                n.vars.smoothHeight && f.smoothHeight(n.vars.animationSpeed)
            }
        }, n.wrapup = function(e) {
            p || v || (0 === n.currentSlide && n.animatingTo === n.last && n.vars.animationLoop ? n.setProps(e, "jumpEnd") : n.currentSlide === n.last && 0 === n.animatingTo && n.vars.animationLoop && n.setProps(e, "jumpStart")), n.animating = !1, n.currentSlide = n.animatingTo, n.vars.after(n)
        }, n.animateSlides = function() {
            !n.animating && e && n.flexAnimate(n.getTarget("next"))
        }, n.pause = function() {
            clearInterval(n.animatedSlides), n.animatedSlides = null, n.playing = !1, n.vars.pausePlay && f.pausePlay.update("play"), n.syncExists && f.sync("pause")
        }, n.play = function() {
            n.playing && clearInterval(n.animatedSlides), n.animatedSlides = n.animatedSlides || setInterval(n.animateSlides, n.vars.slideshowSpeed), n.started = n.playing = !0, n.vars.pausePlay && f.pausePlay.update("pause"), n.syncExists && f.sync("play")
        }, n.stop = function() {
            n.pause(), n.stopped = !0
        }, n.canAdvance = function(e, t) {
            var a = m ? n.pagingCount - 1 : n.last;
            return t ? !0 : m && n.currentItem === n.count - 1 && 0 === e && "prev" === n.direction ? !0 : m && 0 === n.currentItem && e === n.pagingCount - 1 && "next" !== n.direction ? !1 : e !== n.currentSlide || m ? n.vars.animationLoop ? !0 : n.atEnd && 0 === n.currentSlide && e === a && "next" !== n.direction ? !1 : n.atEnd && n.currentSlide === a && 0 === e && "next" === n.direction ? !1 : !0 : !1
        }, n.getTarget = function(e) {
            return n.direction = e, "next" === e ? n.currentSlide === n.last ? 0 : n.currentSlide + 1 : 0 === n.currentSlide ? n.last : n.currentSlide - 1
        }, n.setProps = function(e, t, a) {
            var i = function() {
                var a = e ? e : (n.itemW + n.vars.itemMargin) * n.move * n.animatingTo,
                    i = function() {
                        if (v) return "setTouch" === t ? e : u && n.animatingTo === n.last ? 0 : u ? n.limit - (n.itemW + n.vars.itemMargin) * n.move * n.animatingTo : n.animatingTo === n.last ? n.limit : a;
                        switch (t) {
                            case "setTotal":
                                return u ? (n.count - 1 - n.currentSlide + n.cloneOffset) * e : (n.currentSlide + n.cloneOffset) * e;
                            case "setTouch":
                                return u ? e : e;
                            case "jumpEnd":
                                return u ? e : n.count * e;
                            case "jumpStart":
                                return u ? n.count * e : e;
                            default:
                                return e
                        }
                    }();
                return -1 * i + "px"
            }();
            n.transitions && (i = d ? "translate3d(0," + i + ",0)" : "translate3d(" + i + ",0,0)", a = void 0 !== a ? a / 1e3 + "s" : "0s", n.container.css("-" + n.pfx + "-transition-duration", a), n.container.css("transition-duration", a)), n.args[n.prop] = i, (n.transitions || void 0 === a) && n.container.css(n.args), n.container.css("transform", i)
        }, n.setup = function(e) {
            if (p) n.slides.css({
                width: "100%",
                "float": "left",
                marginRight: "-100%",
                position: "relative"
            }), "init" === e && (r ? n.slides.css({
                opacity: 0,
                display: "block",
                webkitTransition: "opacity " + n.vars.animationSpeed / 1e3 + "s ease",
                zIndex: 1
            }).eq(n.currentSlide).css({
                opacity: 1,
                zIndex: 2
            }) : 0 == n.vars.fadeFirstSlide ? n.slides.css({
                opacity: 0,
                display: "block",
                zIndex: 1
            }).eq(n.currentSlide).css({
                zIndex: 2
            }).css({
                opacity: 1
            }) : n.slides.css({
                opacity: 0,
                display: "block",
                zIndex: 1
            }).eq(n.currentSlide).css({
                zIndex: 2
            }).animate({
                opacity: 1
            }, n.vars.animationSpeed, n.vars.easing)), n.vars.smoothHeight && f.smoothHeight();
            else {
                var t, a;
                "init" === e && (n.viewport = $('<div class="' + i + 'viewport"></div>').css({
                    overflow: "hidden",
                    position: "relative"
                }).appendTo(n).append(n.container), n.cloneCount = 0, n.cloneOffset = 0, u && (a = $.makeArray(n.slides).reverse(), n.slides = $(a), n.container.empty().append(n.slides))), n.vars.animationLoop && !v && (n.cloneCount = 2, n.cloneOffset = 1, "init" !== e && n.container.find(".clone").remove(), n.container.append(f.uniqueID(n.slides.first().clone().addClass("clone")).attr("aria-hidden", "true")).prepend(f.uniqueID(n.slides.last().clone().addClass("clone")).attr("aria-hidden", "true"))), n.newSlides = $(n.vars.selector, n), t = u ? n.count - 1 - n.currentSlide + n.cloneOffset : n.currentSlide + n.cloneOffset, d && !v ? (n.container.height(200 * (n.count + n.cloneCount) + "%").css("position", "absolute").width("100%"), setTimeout(function() {
                    n.newSlides.css({
                        display: "block"
                    }), n.doMath(), n.viewport.height(n.h), n.setProps(t * n.h, "init")
                }, "init" === e ? 100 : 0)) : (n.container.width(200 * (n.count + n.cloneCount) + "%"), n.setProps(t * n.computedW, "init"), setTimeout(function() {
                    n.doMath(), n.newSlides.css({
                        width: n.computedW,
                        marginRight: n.computedM,
                        "float": "left",
                        display: "block"
                    }), n.vars.smoothHeight && f.smoothHeight()
                }, "init" === e ? 100 : 0))
            }
            v || n.slides.removeClass(i + "active-slide").eq(n.currentSlide).addClass(i + "active-slide"), n.vars.init(n)
        }, n.doMath = function() {
            var e = n.slides.first(),
                t = n.vars.itemMargin,
                a = n.vars.minItems,
                i = n.vars.maxItems;
            n.w = void 0 === n.viewport ? n.width() : n.viewport.width(), n.h = e.height(), n.boxPadding = e.outerWidth() - e.width(), v ? (n.itemT = n.vars.itemWidth + t, n.itemM = t, n.minW = a ? a * n.itemT : n.w, n.maxW = i ? i * n.itemT - t : n.w, n.itemW = n.minW > n.w ? (n.w - t * (a - 1)) / a : n.maxW < n.w ? (n.w - t * (i - 1)) / i : n.vars.itemWidth > n.w ? n.w : n.vars.itemWidth, n.visible = Math.floor(n.w / n.itemW), n.move = n.vars.move > 0 && n.vars.move < n.visible ? n.vars.move : n.visible, n.pagingCount = Math.ceil((n.count - n.visible) / n.move + 1), n.last = n.pagingCount - 1, n.limit = 1 === n.pagingCount ? 0 : n.vars.itemWidth > n.w ? n.itemW * (n.count - 1) + t * (n.count - 1) : (n.itemW + t) * n.count - n.w - t) : (n.itemW = n.w, n.itemM = t, n.pagingCount = n.count, n.last = n.count - 1), n.computedW = n.itemW - n.boxPadding, n.computedM = n.itemM
        }, n.update = function(e, t) {
            n.doMath(), v || (e < n.currentSlide ? n.currentSlide += 1 : e <= n.currentSlide && 0 !== e && (n.currentSlide -= 1), n.animatingTo = n.currentSlide), n.vars.controlNav && !n.manualControls && ("add" === t && !v || n.pagingCount > n.controlNav.length ? f.controlNav.update("add") : ("remove" === t && !v || n.pagingCount < n.controlNav.length) && (v && n.currentSlide > n.last && (n.currentSlide -= 1, n.animatingTo -= 1), f.controlNav.update("remove", n.last))), n.vars.directionNav && f.directionNav.update()
        }, n.addSlide = function(e, t) {
            var a = $(e);
            n.count += 1, n.last = n.count - 1, d && u ? void 0 !== t ? n.slides.eq(n.count - t).after(a) : n.container.prepend(a) : void 0 !== t ? n.slides.eq(t).before(a) : n.container.append(a), n.update(t, "add"), n.slides = $(n.vars.selector + ":not(.clone)", n), n.setup(), n.vars.added(n)
        }, n.removeSlide = function(e) {
            var t = isNaN(e) ? n.slides.index($(e)) : e;
            n.count -= 1, n.last = n.count - 1, isNaN(e) ? $(e, n.slides).remove() : d && u ? n.slides.eq(n.last).remove() : n.slides.eq(e).remove(), n.doMath(), n.update(t, "remove"), n.slides = $(n.vars.selector + ":not(.clone)", n), n.setup(), n.vars.removed(n)
        }, f.init()
    }, $(window).blur(function(t) {
        e = !1
    }).focus(function(t) {
        e = !0
    }), $.flexslider.defaults = {
        namespace: "flex-",
        selector: ".slides > li",
        animation: "fade",
        easing: "swing",
        direction: "horizontal",
        reverse: !1,
        animationLoop: !0,
        smoothHeight: !1,
        startAt: 0,
        slideshow: !0,
        slideshowSpeed: 7e3,
        animationSpeed: 600,
        initDelay: 0,
        randomize: !1,
        fadeFirstSlide: !0,
        thumbCaptions: !1,
        pauseOnAction: !0,
        pauseOnHover: !1,
        pauseInvisible: !0,
        useCSS: !0,
        touch: !0,
        video: !1,
        controlNav: !0,
        directionNav: !0,
        prevText: "Previous",
        nextText: "Next",
        keyboard: !0,
        multipleKeyboard: !1,
        mousewheel: !1,
        pausePlay: !1,
        pauseText: "Pause",
        playText: "Play",
        controlsContainer: "",
        manualControls: "",
        customDirectionNav: "",
        sync: "",
        asNavFor: "",
        itemWidth: 0,
        itemMargin: 0,
        minItems: 1,
        maxItems: 0,
        move: 0,
        allowOneSlide: !0,
        start: function() {},
        before: function() {},
        after: function() {},
        end: function() {},
        added: function() {},
        removed: function() {},
        init: function() {}
    }, $.fn.flexslider = function(e) {
        if (void 0 === e && (e = {}), "object" == typeof e) return this.each(function() {
            var t = $(this),
                a = e.selector ? e.selector : ".slides > li",
                n = t.find(a);
            1 === n.length && e.allowOneSlide === !0 || 0 === n.length ? (n.fadeIn(400), e.start && e.start(t)) : void 0 === t.data("flexslider") && new $.flexslider(this, e)
        });
        var t = $(this).data("flexslider");
        switch (e) {
            case "play":
                t.play();
                break;
            case "pause":
                t.pause();
                break;
            case "stop":
                t.stop();
                break;
            case "next":
                t.flexAnimate(t.getTarget("next"), !0);
                break;
            case "prev":
            case "previous":
                t.flexAnimate(t.getTarget("prev"), !0);
                break;
            default:
                "number" == typeof e && t.flexAnimate(e, !0)
        }
    }
}(jQuery);