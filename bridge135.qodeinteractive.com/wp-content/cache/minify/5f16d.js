/*!
 * jQuery UI Autocomplete 1.11.4
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/autocomplete/
 */
! function(e) {
    "function" == typeof define && define.amd ? define(["jquery", "./core", "./widget", "./position", "./menu"], e) : e(jQuery)
}(function(u) {
    return u.widget("ui.autocomplete", {
        version: "1.11.4",
        defaultElement: "<input>",
        options: {
            appendTo: null,
            autoFocus: !1,
            delay: 300,
            minLength: 1,
            position: {
                my: "left top",
                at: "left bottom",
                collision: "none"
            },
            source: null,
            change: null,
            close: null,
            focus: null,
            open: null,
            response: null,
            search: null,
            select: null
        },
        requestIndex: 0,
        pending: 0,
        _create: function() {
            var i, s, n, e = this.element[0].nodeName.toLowerCase(),
                t = "textarea" === e,
                o = "input" === e;
            this.isMultiLine = t || !o && this.element.prop("isContentEditable"), this.valueMethod = this.element[t || o ? "val" : "text"], this.isNewMenu = !0, this.element.addClass("ui-autocomplete-input").attr("autocomplete", "off"), this._on(this.element, {
                keydown: function(e) {
                    if (this.element.prop("readOnly")) s = n = i = !0;
                    else {
                        s = n = i = !1;
                        var t = u.ui.keyCode;
                        switch (e.keyCode) {
                            case t.PAGE_UP:
                                i = !0, this._move("previousPage", e);
                                break;
                            case t.PAGE_DOWN:
                                i = !0, this._move("nextPage", e);
                                break;
                            case t.UP:
                                i = !0, this._keyEvent("previous", e);
                                break;
                            case t.DOWN:
                                i = !0, this._keyEvent("next", e);
                                break;
                            case t.ENTER:
                                this.menu.active && (i = !0, e.preventDefault(), this.menu.select(e));
                                break;
                            case t.TAB:
                                this.menu.active && this.menu.select(e);
                                break;
                            case t.ESCAPE:
                                this.menu.element.is(":visible") && (this.isMultiLine || this._value(this.term), this.close(e), e.preventDefault());
                                break;
                            default:
                                s = !0, this._searchTimeout(e)
                        }
                    }
                },
                keypress: function(e) {
                    if (i) return i = !1, void(this.isMultiLine && !this.menu.element.is(":visible") || e.preventDefault());
                    if (!s) {
                        var t = u.ui.keyCode;
                        switch (e.keyCode) {
                            case t.PAGE_UP:
                                this._move("previousPage", e);
                                break;
                            case t.PAGE_DOWN:
                                this._move("nextPage", e);
                                break;
                            case t.UP:
                                this._keyEvent("previous", e);
                                break;
                            case t.DOWN:
                                this._keyEvent("next", e)
                        }
                    }
                },
                input: function(e) {
                    if (n) return n = !1, void e.preventDefault();
                    this._searchTimeout(e)
                },
                focus: function() {
                    this.selectedItem = null, this.previous = this._value()
                },
                blur: function(e) {
                    this.cancelBlur ? delete this.cancelBlur : (clearTimeout(this.searching), this.close(e), this._change(e))
                }
            }), this._initSource(), this.menu = u("<ul>").addClass("ui-autocomplete ui-front").appendTo(this._appendTo()).menu({
                role: null
            }).hide().menu("instance"), this._on(this.menu.element, {
                mousedown: function(e) {
                    e.preventDefault(), this.cancelBlur = !0, this._delay(function() {
                        delete this.cancelBlur
                    });
                    var i = this.menu.element[0];
                    u(e.target).closest(".ui-menu-item").length || this._delay(function() {
                        var t = this;
                        this.document.one("mousedown", function(e) {
                            e.target === t.element[0] || e.target === i || u.contains(i, e.target) || t.close()
                        })
                    })
                },
                menufocus: function(e, t) {
                    var i, s;
                    if (this.isNewMenu && (this.isNewMenu = !1, e.originalEvent && /^mouse/.test(e.originalEvent.type))) return this.menu.blur(), void this.document.one("mousemove", function() {
                        u(e.target).trigger(e.originalEvent)
                    });
                    s = t.item.data("ui-autocomplete-item"), !1 !== this._trigger("focus", e, {
                        item: s
                    }) && e.originalEvent && /^key/.test(e.originalEvent.type) && this._value(s.value), (i = t.item.attr("aria-label") || s.value) && u.trim(i).length && (this.liveRegion.children().hide(), u("<div>").text(i).appendTo(this.liveRegion))
                },
                menuselect: function(e, t) {
                    var i = t.item.data("ui-autocomplete-item"),
                        s = this.previous;
                    this.element[0] !== this.document[0].activeElement && (this.element.focus(), this.previous = s, this._delay(function() {
                        this.previous = s, this.selectedItem = i
                    })), !1 !== this._trigger("select", e, {
                        item: i
                    }) && this._value(i.value), this.term = this._value(), this.close(e), this.selectedItem = i
                }
            }), this.liveRegion = u("<span>", {
                role: "status",
                "aria-live": "assertive",
                "aria-relevant": "additions"
            }).addClass("ui-helper-hidden-accessible").appendTo(this.document[0].body), this._on(this.window, {
                beforeunload: function() {
                    this.element.removeAttr("autocomplete")
                }
            })
        },
        _destroy: function() {
            clearTimeout(this.searching), this.element.removeClass("ui-autocomplete-input").removeAttr("autocomplete"), this.menu.element.remove(), this.liveRegion.remove()
        },
        _setOption: function(e, t) {
            this._super(e, t), "source" === e && this._initSource(), "appendTo" === e && this.menu.element.appendTo(this._appendTo()), "disabled" === e && t && this.xhr && this.xhr.abort()
        },
        _appendTo: function() {
            var e = this.options.appendTo;
            return (e = e && (e.jquery || e.nodeType ? u(e) : this.document.find(e).eq(0))) && e[0] || (e = this.element.closest(".ui-front")), e.length || (e = this.document[0].body), e
        },
        _initSource: function() {
            var i, s, n = this;
            u.isArray(this.options.source) ? (i = this.options.source, this.source = function(e, t) {
                t(u.ui.autocomplete.filter(i, e.term))
            }) : "string" == typeof this.options.source ? (s = this.options.source, this.source = function(e, t) {
                n.xhr && n.xhr.abort(), n.xhr = u.ajax({
                    url: s,
                    data: e,
                    dataType: "json",
                    success: function(e) {
                        t(e)
                    },
                    error: function() {
                        t([])
                    }
                })
            }) : this.source = this.options.source
        },
        _searchTimeout: function(s) {
            clearTimeout(this.searching), this.searching = this._delay(function() {
                var e = this.term === this._value(),
                    t = this.menu.element.is(":visible"),
                    i = s.altKey || s.ctrlKey || s.metaKey || s.shiftKey;
                e && (!e || t || i) || (this.selectedItem = null, this.search(null, s))
            }, this.options.delay)
        },
        search: function(e, t) {
            return e = null != e ? e : this._value(), this.term = this._value(), e.length < this.options.minLength ? this.close(t) : !1 !== this._trigger("search", t) ? this._search(e) : void 0
        },
        _search: function(e) {
            this.pending++, this.element.addClass("ui-autocomplete-loading"), this.cancelSearch = !1, this.source({
                term: e
            }, this._response())
        },
        _response: function() {
            var t = ++this.requestIndex;
            return u.proxy(function(e) {
                t === this.requestIndex && this.__response(e), this.pending--, this.pending || this.element.removeClass("ui-autocomplete-loading")
            }, this)
        },
        __response: function(e) {
            e = e && this._normalize(e), this._trigger("response", null, {
                content: e
            }), !this.options.disabled && e && e.length && !this.cancelSearch ? (this._suggest(e), this._trigger("open")) : this._close()
        },
        close: function(e) {
            this.cancelSearch = !0, this._close(e)
        },
        _close: function(e) {
            this.menu.element.is(":visible") && (this.menu.element.hide(), this.menu.blur(), this.isNewMenu = !0, this._trigger("close", e))
        },
        _change: function(e) {
            this.previous !== this._value() && this._trigger("change", e, {
                item: this.selectedItem
            })
        },
        _normalize: function(e) {
            return e.length && e[0].label && e[0].value ? e : u.map(e, function(e) {
                return "string" == typeof e ? {
                    label: e,
                    value: e
                } : u.extend({}, e, {
                    label: e.label || e.value,
                    value: e.value || e.label
                })
            })
        },
        _suggest: function(e) {
            var t = this.menu.element.empty();
            this._renderMenu(t, e), this.isNewMenu = !0, this.menu.refresh(), t.show(), this._resizeMenu(), t.position(u.extend({ of: this.element
            }, this.options.position)), this.options.autoFocus && this.menu.next()
        },
        _resizeMenu: function() {
            var e = this.menu.element;
            e.outerWidth(Math.max(e.width("").outerWidth() + 1, this.element.outerWidth()))
        },
        _renderMenu: function(i, e) {
            var s = this;
            u.each(e, function(e, t) {
                s._renderItemData(i, t)
            })
        },
        _renderItemData: function(e, t) {
            return this._renderItem(e, t).data("ui-autocomplete-item", t)
        },
        _renderItem: function(e, t) {
            return u("<li>").text(t.label).appendTo(e)
        },
        _move: function(e, t) {
            if (this.menu.element.is(":visible")) return this.menu.isFirstItem() && /^previous/.test(e) || this.menu.isLastItem() && /^next/.test(e) ? (this.isMultiLine || this._value(this.term), void this.menu.blur()) : void this.menu[e](t);
            this.search(null, t)
        },
        widget: function() {
            return this.menu.element
        },
        _value: function() {
            return this.valueMethod.apply(this.element, arguments)
        },
        _keyEvent: function(e, t) {
            this.isMultiLine && !this.menu.element.is(":visible") || (this._move(e, t), t.preventDefault())
        }
    }), u.extend(u.ui.autocomplete, {
        escapeRegex: function(e) {
            return e.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&")
        },
        filter: function(e, t) {
            var i = new RegExp(u.ui.autocomplete.escapeRegex(t), "i");
            return u.grep(e, function(e) {
                return i.test(e.label || e.value || e)
            })
        }
    }), u.widget("ui.autocomplete", u.ui.autocomplete, {
        options: {
            messages: {
                noResults: "No search results.",
                results: function(e) {
                    return e + (1 < e ? " results are" : " result is") + " available, use up and down arrow keys to navigate."
                }
            }
        },
        __response: function(e) {
            var t;
            this._superApply(arguments), this.options.disabled || this.cancelSearch || (t = e && e.length ? this.options.messages.results(e.length) : this.options.messages.noResults, this.liveRegion.children().hide(), u("<div>").text(t).appendTo(this.liveRegion))
        }
    }), u.ui.autocomplete
});;
/*!
 * jQuery UI Button 1.11.4
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/button/
 */
! function(t) {
    "function" == typeof define && define.amd ? define(["jquery", "./core", "./widget"], t) : t(jQuery)
}(function(o) {
    function n() {
        var t = o(this);
        setTimeout(function() {
            t.find(":ui-button").button("refresh")
        }, 1)
    }

    function a(t) {
        var e = t.name,
            i = t.form,
            s = o([]);
        return e && (e = e.replace(/'/g, "\\'"), s = i ? o(i).find("[name='" + e + "'][type=radio]") : o("[name='" + e + "'][type=radio]", t.ownerDocument).filter(function() {
            return !this.form
        })), s
    }
    var u, r = "ui-button ui-widget ui-state-default ui-corner-all",
        l = "ui-button-icons-only ui-button-icon-only ui-button-text-icons ui-button-text-icon-primary ui-button-text-icon-secondary ui-button-text-only";
    return o.widget("ui.button", {
        version: "1.11.4",
        defaultElement: "<button>",
        options: {
            disabled: null,
            text: !0,
            label: null,
            icons: {
                primary: null,
                secondary: null
            }
        },
        _create: function() {
            this.element.closest("form").unbind("reset" + this.eventNamespace).bind("reset" + this.eventNamespace, n), "boolean" != typeof this.options.disabled ? this.options.disabled = !!this.element.prop("disabled") : this.element.prop("disabled", this.options.disabled), this._determineButtonType(), this.hasTitle = !!this.buttonElement.attr("title");
            var e = this,
                i = this.options,
                t = "checkbox" === this.type || "radio" === this.type,
                s = t ? "" : "ui-state-active";
            null === i.label && (i.label = "input" === this.type ? this.buttonElement.val() : this.buttonElement.html()), this._hoverable(this.buttonElement), this.buttonElement.addClass(r).attr("role", "button").bind("mouseenter" + this.eventNamespace, function() {
                i.disabled || this === u && o(this).addClass("ui-state-active")
            }).bind("mouseleave" + this.eventNamespace, function() {
                i.disabled || o(this).removeClass(s)
            }).bind("click" + this.eventNamespace, function(t) {
                i.disabled && (t.preventDefault(), t.stopImmediatePropagation())
            }), this._on({
                focus: function() {
                    this.buttonElement.addClass("ui-state-focus")
                },
                blur: function() {
                    this.buttonElement.removeClass("ui-state-focus")
                }
            }), t && this.element.bind("change" + this.eventNamespace, function() {
                e.refresh()
            }), "checkbox" === this.type ? this.buttonElement.bind("click" + this.eventNamespace, function() {
                if (i.disabled) return !1
            }) : "radio" === this.type ? this.buttonElement.bind("click" + this.eventNamespace, function() {
                if (i.disabled) return !1;
                o(this).addClass("ui-state-active"), e.buttonElement.attr("aria-pressed", "true");
                var t = e.element[0];
                a(t).not(t).map(function() {
                    return o(this).button("widget")[0]
                }).removeClass("ui-state-active").attr("aria-pressed", "false")
            }) : (this.buttonElement.bind("mousedown" + this.eventNamespace, function() {
                if (i.disabled) return !1;
                o(this).addClass("ui-state-active"), u = this, e.document.one("mouseup", function() {
                    u = null
                })
            }).bind("mouseup" + this.eventNamespace, function() {
                if (i.disabled) return !1;
                o(this).removeClass("ui-state-active")
            }).bind("keydown" + this.eventNamespace, function(t) {
                if (i.disabled) return !1;
                t.keyCode !== o.ui.keyCode.SPACE && t.keyCode !== o.ui.keyCode.ENTER || o(this).addClass("ui-state-active")
            }).bind("keyup" + this.eventNamespace + " blur" + this.eventNamespace, function() {
                o(this).removeClass("ui-state-active")
            }), this.buttonElement.is("a") && this.buttonElement.keyup(function(t) {
                t.keyCode === o.ui.keyCode.SPACE && o(this).click()
            })), this._setOption("disabled", i.disabled), this._resetButton()
        },
        _determineButtonType: function() {
            var t, e, i;
            this.element.is("[type=checkbox]") ? this.type = "checkbox" : this.element.is("[type=radio]") ? this.type = "radio" : this.element.is("input") ? this.type = "input" : this.type = "button", "checkbox" === this.type || "radio" === this.type ? (t = this.element.parents().last(), e = "label[for='" + this.element.attr("id") + "']", this.buttonElement = t.find(e), this.buttonElement.length || (t = t.length ? t.siblings() : this.element.siblings(), this.buttonElement = t.filter(e), this.buttonElement.length || (this.buttonElement = t.find(e))), this.element.addClass("ui-helper-hidden-accessible"), (i = this.element.is(":checked")) && this.buttonElement.addClass("ui-state-active"), this.buttonElement.prop("aria-pressed", i)) : this.buttonElement = this.element
        },
        widget: function() {
            return this.buttonElement
        },
        _destroy: function() {
            this.element.removeClass("ui-helper-hidden-accessible"), this.buttonElement.removeClass(r + " ui-state-active " + l).removeAttr("role").removeAttr("aria-pressed").html(this.buttonElement.find(".ui-button-text").html()), this.hasTitle || this.buttonElement.removeAttr("title")
        },
        _setOption: function(t, e) {
            if (this._super(t, e), "disabled" === t) return this.widget().toggleClass("ui-state-disabled", !!e), this.element.prop("disabled", !!e), void(e && ("checkbox" === this.type || "radio" === this.type ? this.buttonElement.removeClass("ui-state-focus") : this.buttonElement.removeClass("ui-state-focus ui-state-active")));
            this._resetButton()
        },
        refresh: function() {
            var t = this.element.is("input, button") ? this.element.is(":disabled") : this.element.hasClass("ui-button-disabled");
            t !== this.options.disabled && this._setOption("disabled", t), "radio" === this.type ? a(this.element[0]).each(function() {
                o(this).is(":checked") ? o(this).button("widget").addClass("ui-state-active").attr("aria-pressed", "true") : o(this).button("widget").removeClass("ui-state-active").attr("aria-pressed", "false")
            }) : "checkbox" === this.type && (this.element.is(":checked") ? this.buttonElement.addClass("ui-state-active").attr("aria-pressed", "true") : this.buttonElement.removeClass("ui-state-active").attr("aria-pressed", "false"))
        },
        _resetButton: function() {
            if ("input" !== this.type) {
                var t = this.buttonElement.removeClass(l),
                    e = o("<span></span>", this.document[0]).addClass("ui-button-text").html(this.options.label).appendTo(t.empty()).text(),
                    i = this.options.icons,
                    s = i.primary && i.secondary,
                    n = [];
                i.primary || i.secondary ? (this.options.text && n.push("ui-button-text-icon" + (s ? "s" : i.primary ? "-primary" : "-secondary")), i.primary && t.prepend("<span class='ui-button-icon-primary ui-icon " + i.primary + "'></span>"), i.secondary && t.append("<span class='ui-button-icon-secondary ui-icon " + i.secondary + "'></span>"), this.options.text || (n.push(s ? "ui-button-icons-only" : "ui-button-icon-only"), this.hasTitle || t.attr("title", o.trim(e)))) : n.push("ui-button-text-only"), t.addClass(n.join(" "))
            } else this.options.label && this.element.val(this.options.label)
        }
    }), o.widget("ui.buttonset", {
        version: "1.11.4",
        options: {
            items: "button, input[type=button], input[type=submit], input[type=reset], input[type=checkbox], input[type=radio], a, :data(ui-button)"
        },
        _create: function() {
            this.element.addClass("ui-buttonset")
        },
        _init: function() {
            this.refresh()
        },
        _setOption: function(t, e) {
            "disabled" === t && this.buttons.button("option", t, e), this._super(t, e)
        },
        refresh: function() {
            var t = "rtl" === this.element.css("direction"),
                e = this.element.find(this.options.items),
                i = e.filter(":ui-button");
            e.not(":ui-button").button(), i.button("refresh"), this.buttons = e.map(function() {
                return o(this).button("widget")[0]
            }).removeClass("ui-corner-all ui-corner-left ui-corner-right").filter(":first").addClass(t ? "ui-corner-right" : "ui-corner-left").end().filter(":last").addClass(t ? "ui-corner-left" : "ui-corner-right").end().end()
        },
        _destroy: function() {
            this.element.removeClass("ui-buttonset"), this.buttons.map(function() {
                return o(this).button("widget")[0]
            }).removeClass("ui-corner-left ui-corner-right").end().button("destroy")
        }
    }), o.ui.button
});;
/*!
 * jQuery UI Datepicker 1.11.4
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/datepicker/
 */
! function(e) {
    "function" == typeof define && define.amd ? define(["jquery", "./core"], e) : e(jQuery)
}(function(b) {
    var r;

    function e() {
        this._curInst = null, this._keyEvent = !1, this._disabledInputs = [], this._datepickerShowing = !1, this._inDialog = !1, this._mainDivId = "ui-datepicker-div", this._inlineClass = "ui-datepicker-inline", this._appendClass = "ui-datepicker-append", this._triggerClass = "ui-datepicker-trigger", this._dialogClass = "ui-datepicker-dialog", this._disableClass = "ui-datepicker-disabled", this._unselectableClass = "ui-datepicker-unselectable", this._currentClass = "ui-datepicker-current-day", this._dayOverClass = "ui-datepicker-days-cell-over", this.regional = [], this.regional[""] = {
            closeText: "Done",
            prevText: "Prev",
            nextText: "Next",
            currentText: "Today",
            monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            monthNamesShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
            dayNamesMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
            weekHeader: "Wk",
            dateFormat: "mm/dd/yy",
            firstDay: 0,
            isRTL: !1,
            showMonthAfterYear: !1,
            yearSuffix: ""
        }, this._defaults = {
            showOn: "focus",
            showAnim: "fadeIn",
            showOptions: {},
            defaultDate: null,
            appendText: "",
            buttonText: "...",
            buttonImage: "",
            buttonImageOnly: !1,
            hideIfNoPrevNext: !1,
            navigationAsDateFormat: !1,
            gotoCurrent: !1,
            changeMonth: !1,
            changeYear: !1,
            yearRange: "c-10:c+10",
            showOtherMonths: !1,
            selectOtherMonths: !1,
            showWeek: !1,
            calculateWeek: this.iso8601Week,
            shortYearCutoff: "+10",
            minDate: null,
            maxDate: null,
            duration: "fast",
            beforeShowDay: null,
            beforeShow: null,
            onSelect: null,
            onChangeMonthYear: null,
            onClose: null,
            numberOfMonths: 1,
            showCurrentAtPos: 0,
            stepMonths: 1,
            stepBigMonths: 12,
            altField: "",
            altFormat: "",
            constrainInput: !0,
            showButtonPanel: !1,
            autoSize: !1,
            disabled: !1
        }, b.extend(this._defaults, this.regional[""]), this.regional.en = b.extend(!0, {}, this.regional[""]), this.regional["en-US"] = b.extend(!0, {}, this.regional.en), this.dpDiv = a(b("<div id='" + this._mainDivId + "' class='ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all'></div>"))
    }

    function a(e) {
        var t = "button, .ui-datepicker-prev, .ui-datepicker-next, .ui-datepicker-calendar td a";
        return e.delegate(t, "mouseout", function() {
            b(this).removeClass("ui-state-hover"), -1 !== this.className.indexOf("ui-datepicker-prev") && b(this).removeClass("ui-datepicker-prev-hover"), -1 !== this.className.indexOf("ui-datepicker-next") && b(this).removeClass("ui-datepicker-next-hover")
        }).delegate(t, "mouseover", n)
    }

    function n() {
        b.datepicker._isDisabledDatepicker(r.inline ? r.dpDiv.parent()[0] : r.input[0]) || (b(this).parents(".ui-datepicker-calendar").find("a").removeClass("ui-state-hover"), b(this).addClass("ui-state-hover"), -1 !== this.className.indexOf("ui-datepicker-prev") && b(this).addClass("ui-datepicker-prev-hover"), -1 !== this.className.indexOf("ui-datepicker-next") && b(this).addClass("ui-datepicker-next-hover"))
    }

    function h(e, t) {
        for (var a in b.extend(e, t), t) null == t[a] && (e[a] = t[a]);
        return e
    }
    return b.extend(b.ui, {
        datepicker: {
            version: "1.11.4"
        }
    }), b.extend(e.prototype, {
        markerClassName: "hasDatepicker",
        maxRows: 4,
        _widgetDatepicker: function() {
            return this.dpDiv
        },
        setDefaults: function(e) {
            return h(this._defaults, e || {}), this
        },
        _attachDatepicker: function(e, t) {
            var a, i, s;
            i = "div" === (a = e.nodeName.toLowerCase()) || "span" === a, e.id || (this.uuid += 1, e.id = "dp" + this.uuid), (s = this._newInst(b(e), i)).settings = b.extend({}, t || {}), "input" === a ? this._connectDatepicker(e, s) : i && this._inlineDatepicker(e, s)
        },
        _newInst: function(e, t) {
            return {
                id: e[0].id.replace(/([^A-Za-z0-9_\-])/g, "\\\\$1"),
                input: e,
                selectedDay: 0,
                selectedMonth: 0,
                selectedYear: 0,
                drawMonth: 0,
                drawYear: 0,
                inline: t,
                dpDiv: t ? a(b("<div class='" + this._inlineClass + " ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all'></div>")) : this.dpDiv
            }
        },
        _connectDatepicker: function(e, t) {
            var a = b(e);
            t.append = b([]), t.trigger = b([]), a.hasClass(this.markerClassName) || (this._attachments(a, t), a.addClass(this.markerClassName).keydown(this._doKeyDown).keypress(this._doKeyPress).keyup(this._doKeyUp), this._autoSize(t), b.data(e, "datepicker", t), t.settings.disabled && this._disableDatepicker(e))
        },
        _attachments: function(e, t) {
            var a, i, s, r = this._get(t, "appendText"),
                n = this._get(t, "isRTL");
            t.append && t.append.remove(), r && (t.append = b("<span class='" + this._appendClass + "'>" + r + "</span>"), e[n ? "before" : "after"](t.append)), e.unbind("focus", this._showDatepicker), t.trigger && t.trigger.remove(), "focus" !== (a = this._get(t, "showOn")) && "both" !== a || e.focus(this._showDatepicker), "button" !== a && "both" !== a || (i = this._get(t, "buttonText"), s = this._get(t, "buttonImage"), t.trigger = b(this._get(t, "buttonImageOnly") ? b("<img/>").addClass(this._triggerClass).attr({
                src: s,
                alt: i,
                title: i
            }) : b("<button type='button'></button>").addClass(this._triggerClass).html(s ? b("<img/>").attr({
                src: s,
                alt: i,
                title: i
            }) : i)), e[n ? "before" : "after"](t.trigger), t.trigger.click(function() {
                return b.datepicker._datepickerShowing && b.datepicker._lastInput === e[0] ? b.datepicker._hideDatepicker() : (b.datepicker._datepickerShowing && b.datepicker._lastInput !== e[0] && b.datepicker._hideDatepicker(), b.datepicker._showDatepicker(e[0])), !1
            }))
        },
        _autoSize: function(e) {
            if (this._get(e, "autoSize") && !e.inline) {
                var t, a, i, s, r = new Date(2009, 11, 20),
                    n = this._get(e, "dateFormat");
                n.match(/[DM]/) && (t = function(e) {
                    for (s = i = a = 0; s < e.length; s++) e[s].length > a && (a = e[s].length, i = s);
                    return i
                }, r.setMonth(t(this._get(e, n.match(/MM/) ? "monthNames" : "monthNamesShort"))), r.setDate(t(this._get(e, n.match(/DD/) ? "dayNames" : "dayNamesShort")) + 20 - r.getDay())), e.input.attr("size", this._formatDate(e, r).length)
            }
        },
        _inlineDatepicker: function(e, t) {
            var a = b(e);
            a.hasClass(this.markerClassName) || (a.addClass(this.markerClassName).append(t.dpDiv), b.data(e, "datepicker", t), this._setDate(t, this._getDefaultDate(t), !0), this._updateDatepicker(t), this._updateAlternate(t), t.settings.disabled && this._disableDatepicker(e), t.dpDiv.css("display", "block"))
        },
        _dialogDatepicker: function(e, t, a, i, s) {
            var r, n, d, c, o, l = this._dialogInst;
            return l || (this.uuid += 1, r = "dp" + this.uuid, this._dialogInput = b("<input type='text' id='" + r + "' style='position: absolute; top: -100px; width: 0px;'/>"), this._dialogInput.keydown(this._doKeyDown), b("body").append(this._dialogInput), (l = this._dialogInst = this._newInst(this._dialogInput, !1)).settings = {}, b.data(this._dialogInput[0], "datepicker", l)), h(l.settings, i || {}), t = t && t.constructor === Date ? this._formatDate(l, t) : t, this._dialogInput.val(t), this._pos = s ? s.length ? s : [s.pageX, s.pageY] : null, this._pos || (n = document.documentElement.clientWidth, d = document.documentElement.clientHeight, c = document.documentElement.scrollLeft || document.body.scrollLeft, o = document.documentElement.scrollTop || document.body.scrollTop, this._pos = [n / 2 - 100 + c, d / 2 - 150 + o]), this._dialogInput.css("left", this._pos[0] + 20 + "px").css("top", this._pos[1] + "px"), l.settings.onSelect = a, this._inDialog = !0, this.dpDiv.addClass(this._dialogClass), this._showDatepicker(this._dialogInput[0]), b.blockUI && b.blockUI(this.dpDiv), b.data(this._dialogInput[0], "datepicker", l), this
        },
        _destroyDatepicker: function(e) {
            var t, a = b(e),
                i = b.data(e, "datepicker");
            a.hasClass(this.markerClassName) && (t = e.nodeName.toLowerCase(), b.removeData(e, "datepicker"), "input" === t ? (i.append.remove(), i.trigger.remove(), a.removeClass(this.markerClassName).unbind("focus", this._showDatepicker).unbind("keydown", this._doKeyDown).unbind("keypress", this._doKeyPress).unbind("keyup", this._doKeyUp)) : "div" !== t && "span" !== t || a.removeClass(this.markerClassName).empty(), r === i && (r = null))
        },
        _enableDatepicker: function(t) {
            var e, a, i = b(t),
                s = b.data(t, "datepicker");
            i.hasClass(this.markerClassName) && ("input" === (e = t.nodeName.toLowerCase()) ? (t.disabled = !1, s.trigger.filter("button").each(function() {
                this.disabled = !1
            }).end().filter("img").css({
                opacity: "1.0",
                cursor: ""
            })) : "div" !== e && "span" !== e || ((a = i.children("." + this._inlineClass)).children().removeClass("ui-state-disabled"), a.find("select.ui-datepicker-month, select.ui-datepicker-year").prop("disabled", !1)), this._disabledInputs = b.map(this._disabledInputs, function(e) {
                return e === t ? null : e
            }))
        },
        _disableDatepicker: function(t) {
            var e, a, i = b(t),
                s = b.data(t, "datepicker");
            i.hasClass(this.markerClassName) && ("input" === (e = t.nodeName.toLowerCase()) ? (t.disabled = !0, s.trigger.filter("button").each(function() {
                this.disabled = !0
            }).end().filter("img").css({
                opacity: "0.5",
                cursor: "default"
            })) : "div" !== e && "span" !== e || ((a = i.children("." + this._inlineClass)).children().addClass("ui-state-disabled"), a.find("select.ui-datepicker-month, select.ui-datepicker-year").prop("disabled", !0)), this._disabledInputs = b.map(this._disabledInputs, function(e) {
                return e === t ? null : e
            }), this._disabledInputs[this._disabledInputs.length] = t)
        },
        _isDisabledDatepicker: function(e) {
            if (!e) return !1;
            for (var t = 0; t < this._disabledInputs.length; t++)
                if (this._disabledInputs[t] === e) return !0;
            return !1
        },
        _getInst: function(e) {
            try {
                return b.data(e, "datepicker")
            } catch (e) {
                throw "Missing instance data for this datepicker"
            }
        },
        _optionDatepicker: function(e, t, a) {
            var i, s, r, n, d = this._getInst(e);
            if (2 === arguments.length && "string" == typeof t) return "defaults" === t ? b.extend({}, b.datepicker._defaults) : d ? "all" === t ? b.extend({}, d.settings) : this._get(d, t) : null;
            i = t || {}, "string" == typeof t && ((i = {})[t] = a), d && (this._curInst === d && this._hideDatepicker(), s = this._getDateDatepicker(e, !0), r = this._getMinMaxDate(d, "min"), n = this._getMinMaxDate(d, "max"), h(d.settings, i), null !== r && void 0 !== i.dateFormat && void 0 === i.minDate && (d.settings.minDate = this._formatDate(d, r)), null !== n && void 0 !== i.dateFormat && void 0 === i.maxDate && (d.settings.maxDate = this._formatDate(d, n)), "disabled" in i && (i.disabled ? this._disableDatepicker(e) : this._enableDatepicker(e)), this._attachments(b(e), d), this._autoSize(d), this._setDate(d, s), this._updateAlternate(d), this._updateDatepicker(d))
        },
        _changeDatepicker: function(e, t, a) {
            this._optionDatepicker(e, t, a)
        },
        _refreshDatepicker: function(e) {
            var t = this._getInst(e);
            t && this._updateDatepicker(t)
        },
        _setDateDatepicker: function(e, t) {
            var a = this._getInst(e);
            a && (this._setDate(a, t), this._updateDatepicker(a), this._updateAlternate(a))
        },
        _getDateDatepicker: function(e, t) {
            var a = this._getInst(e);
            return a && !a.inline && this._setDateFromField(a, t), a ? this._getDate(a) : null
        },
        _doKeyDown: function(e) {
            var t, a, i, s = b.datepicker._getInst(e.target),
                r = !0,
                n = s.dpDiv.is(".ui-datepicker-rtl");
            if (s._keyEvent = !0, b.datepicker._datepickerShowing) switch (e.keyCode) {
                case 9:
                    b.datepicker._hideDatepicker(), r = !1;
                    break;
                case 13:
                    return (i = b("td." + b.datepicker._dayOverClass + ":not(." + b.datepicker._currentClass + ")", s.dpDiv))[0] && b.datepicker._selectDay(e.target, s.selectedMonth, s.selectedYear, i[0]), (t = b.datepicker._get(s, "onSelect")) ? (a = b.datepicker._formatDate(s), t.apply(s.input ? s.input[0] : null, [a, s])) : b.datepicker._hideDatepicker(), !1;
                case 27:
                    b.datepicker._hideDatepicker();
                    break;
                case 33:
                    b.datepicker._adjustDate(e.target, e.ctrlKey ? -b.datepicker._get(s, "stepBigMonths") : -b.datepicker._get(s, "stepMonths"), "M");
                    break;
                case 34:
                    b.datepicker._adjustDate(e.target, e.ctrlKey ? +b.datepicker._get(s, "stepBigMonths") : +b.datepicker._get(s, "stepMonths"), "M");
                    break;
                case 35:
                    (e.ctrlKey || e.metaKey) && b.datepicker._clearDate(e.target), r = e.ctrlKey || e.metaKey;
                    break;
                case 36:
                    (e.ctrlKey || e.metaKey) && b.datepicker._gotoToday(e.target), r = e.ctrlKey || e.metaKey;
                    break;
                case 37:
                    (e.ctrlKey || e.metaKey) && b.datepicker._adjustDate(e.target, n ? 1 : -1, "D"), r = e.ctrlKey || e.metaKey, e.originalEvent.altKey && b.datepicker._adjustDate(e.target, e.ctrlKey ? -b.datepicker._get(s, "stepBigMonths") : -b.datepicker._get(s, "stepMonths"), "M");
                    break;
                case 38:
                    (e.ctrlKey || e.metaKey) && b.datepicker._adjustDate(e.target, -7, "D"), r = e.ctrlKey || e.metaKey;
                    break;
                case 39:
                    (e.ctrlKey || e.metaKey) && b.datepicker._adjustDate(e.target, n ? -1 : 1, "D"), r = e.ctrlKey || e.metaKey, e.originalEvent.altKey && b.datepicker._adjustDate(e.target, e.ctrlKey ? +b.datepicker._get(s, "stepBigMonths") : +b.datepicker._get(s, "stepMonths"), "M");
                    break;
                case 40:
                    (e.ctrlKey || e.metaKey) && b.datepicker._adjustDate(e.target, 7, "D"), r = e.ctrlKey || e.metaKey;
                    break;
                default:
                    r = !1
            } else 36 === e.keyCode && e.ctrlKey ? b.datepicker._showDatepicker(this) : r = !1;
            r && (e.preventDefault(), e.stopPropagation())
        },
        _doKeyPress: function(e) {
            var t, a, i = b.datepicker._getInst(e.target);
            if (b.datepicker._get(i, "constrainInput")) return t = b.datepicker._possibleChars(b.datepicker._get(i, "dateFormat")), a = String.fromCharCode(null == e.charCode ? e.keyCode : e.charCode), e.ctrlKey || e.metaKey || a < " " || !t || -1 < t.indexOf(a)
        },
        _doKeyUp: function(e) {
            var t = b.datepicker._getInst(e.target);
            if (t.input.val() !== t.lastVal) try {
                b.datepicker.parseDate(b.datepicker._get(t, "dateFormat"), t.input ? t.input.val() : null, b.datepicker._getFormatConfig(t)) && (b.datepicker._setDateFromField(t), b.datepicker._updateAlternate(t), b.datepicker._updateDatepicker(t))
            } catch (e) {}
            return !0
        },
        _showDatepicker: function(e) {
            var t, a, i, s, r, n, d;
            "input" !== (e = e.target || e).nodeName.toLowerCase() && (e = b("input", e.parentNode)[0]), b.datepicker._isDisabledDatepicker(e) || b.datepicker._lastInput === e || (t = b.datepicker._getInst(e), b.datepicker._curInst && b.datepicker._curInst !== t && (b.datepicker._curInst.dpDiv.stop(!0, !0), t && b.datepicker._datepickerShowing && b.datepicker._hideDatepicker(b.datepicker._curInst.input[0])), !1 !== (i = (a = b.datepicker._get(t, "beforeShow")) ? a.apply(e, [e, t]) : {}) && (h(t.settings, i), t.lastVal = null, b.datepicker._lastInput = e, b.datepicker._setDateFromField(t), b.datepicker._inDialog && (e.value = ""), b.datepicker._pos || (b.datepicker._pos = b.datepicker._findPos(e), b.datepicker._pos[1] += e.offsetHeight), s = !1, b(e).parents().each(function() {
                return !(s |= "fixed" === b(this).css("position"))
            }), r = {
                left: b.datepicker._pos[0],
                top: b.datepicker._pos[1]
            }, b.datepicker._pos = null, t.dpDiv.empty(), t.dpDiv.css({
                position: "absolute",
                display: "block",
                top: "-1000px"
            }), b.datepicker._updateDatepicker(t), r = b.datepicker._checkOffset(t, r, s), t.dpDiv.css({
                position: b.datepicker._inDialog && b.blockUI ? "static" : s ? "fixed" : "absolute",
                display: "none",
                left: r.left + "px",
                top: r.top + "px"
            }), t.inline || (n = b.datepicker._get(t, "showAnim"), d = b.datepicker._get(t, "duration"), t.dpDiv.css("z-index", function(e) {
                for (var t, a; e.length && e[0] !== document;) {
                    if (("absolute" === (t = e.css("position")) || "relative" === t || "fixed" === t) && (a = parseInt(e.css("zIndex"), 10), !isNaN(a) && 0 !== a)) return a;
                    e = e.parent()
                }
                return 0
            }(b(e)) + 1), b.datepicker._datepickerShowing = !0, b.effects && b.effects.effect[n] ? t.dpDiv.show(n, b.datepicker._get(t, "showOptions"), d) : t.dpDiv[n || "show"](n ? d : null), b.datepicker._shouldFocusInput(t) && t.input.focus(), b.datepicker._curInst = t)))
        },
        _updateDatepicker: function(e) {
            this.maxRows = 4, (r = e).dpDiv.empty().append(this._generateHTML(e)), this._attachHandlers(e);
            var t, a = this._getNumberOfMonths(e),
                i = a[1],
                s = e.dpDiv.find("." + this._dayOverClass + " a");
            0 < s.length && n.apply(s.get(0)), e.dpDiv.removeClass("ui-datepicker-multi-2 ui-datepicker-multi-3 ui-datepicker-multi-4").width(""), 1 < i && e.dpDiv.addClass("ui-datepicker-multi-" + i).css("width", 17 * i + "em"), e.dpDiv[(1 !== a[0] || 1 !== a[1] ? "add" : "remove") + "Class"]("ui-datepicker-multi"), e.dpDiv[(this._get(e, "isRTL") ? "add" : "remove") + "Class"]("ui-datepicker-rtl"), e === b.datepicker._curInst && b.datepicker._datepickerShowing && b.datepicker._shouldFocusInput(e) && e.input.focus(), e.yearshtml && (t = e.yearshtml, setTimeout(function() {
                t === e.yearshtml && e.yearshtml && e.dpDiv.find("select.ui-datepicker-year:first").replaceWith(e.yearshtml), t = e.yearshtml = null
            }, 0))
        },
        _shouldFocusInput: function(e) {
            return e.input && e.input.is(":visible") && !e.input.is(":disabled") && !e.input.is(":focus")
        },
        _checkOffset: function(e, t, a) {
            var i = e.dpDiv.outerWidth(),
                s = e.dpDiv.outerHeight(),
                r = e.input ? e.input.outerWidth() : 0,
                n = e.input ? e.input.outerHeight() : 0,
                d = document.documentElement.clientWidth + (a ? 0 : b(document).scrollLeft()),
                c = document.documentElement.clientHeight + (a ? 0 : b(document).scrollTop());
            return t.left -= this._get(e, "isRTL") ? i - r : 0, t.left -= a && t.left === e.input.offset().left ? b(document).scrollLeft() : 0, t.top -= a && t.top === e.input.offset().top + n ? b(document).scrollTop() : 0, t.left -= Math.min(t.left, t.left + i > d && i < d ? Math.abs(t.left + i - d) : 0), t.top -= Math.min(t.top, t.top + s > c && s < c ? Math.abs(s + n) : 0), t
        },
        _findPos: function(e) {
            for (var t, a = this._getInst(e), i = this._get(a, "isRTL"); e && ("hidden" === e.type || 1 !== e.nodeType || b.expr.filters.hidden(e));) e = e[i ? "previousSibling" : "nextSibling"];
            return [(t = b(e).offset()).left, t.top]
        },
        _hideDatepicker: function(e) {
            var t, a, i, s, r = this._curInst;
            !r || e && r !== b.data(e, "datepicker") || this._datepickerShowing && (t = this._get(r, "showAnim"), a = this._get(r, "duration"), i = function() {
                b.datepicker._tidyDialog(r)
            }, b.effects && (b.effects.effect[t] || b.effects[t]) ? r.dpDiv.hide(t, b.datepicker._get(r, "showOptions"), a, i) : r.dpDiv["slideDown" === t ? "slideUp" : "fadeIn" === t ? "fadeOut" : "hide"](t ? a : null, i), t || i(), this._datepickerShowing = !1, (s = this._get(r, "onClose")) && s.apply(r.input ? r.input[0] : null, [r.input ? r.input.val() : "", r]), this._lastInput = null, this._inDialog && (this._dialogInput.css({
                position: "absolute",
                left: "0",
                top: "-100px"
            }), b.blockUI && (b.unblockUI(), b("body").append(this.dpDiv))), this._inDialog = !1)
        },
        _tidyDialog: function(e) {
            e.dpDiv.removeClass(this._dialogClass).unbind(".ui-datepicker-calendar")
        },
        _checkExternalClick: function(e) {
            if (b.datepicker._curInst) {
                var t = b(e.target),
                    a = b.datepicker._getInst(t[0]);
                (t[0].id === b.datepicker._mainDivId || 0 !== t.parents("#" + b.datepicker._mainDivId).length || t.hasClass(b.datepicker.markerClassName) || t.closest("." + b.datepicker._triggerClass).length || !b.datepicker._datepickerShowing || b.datepicker._inDialog && b.blockUI) && (!t.hasClass(b.datepicker.markerClassName) || b.datepicker._curInst === a) || b.datepicker._hideDatepicker()
            }
        },
        _adjustDate: function(e, t, a) {
            var i = b(e),
                s = this._getInst(i[0]);
            this._isDisabledDatepicker(i[0]) || (this._adjustInstDate(s, t + ("M" === a ? this._get(s, "showCurrentAtPos") : 0), a), this._updateDatepicker(s))
        },
        _gotoToday: function(e) {
            var t, a = b(e),
                i = this._getInst(a[0]);
            this._get(i, "gotoCurrent") && i.currentDay ? (i.selectedDay = i.currentDay, i.drawMonth = i.selectedMonth = i.currentMonth, i.drawYear = i.selectedYear = i.currentYear) : (t = new Date, i.selectedDay = t.getDate(), i.drawMonth = i.selectedMonth = t.getMonth(), i.drawYear = i.selectedYear = t.getFullYear()), this._notifyChange(i), this._adjustDate(a)
        },
        _selectMonthYear: function(e, t, a) {
            var i = b(e),
                s = this._getInst(i[0]);
            s["selected" + ("M" === a ? "Month" : "Year")] = s["draw" + ("M" === a ? "Month" : "Year")] = parseInt(t.options[t.selectedIndex].value, 10), this._notifyChange(s), this._adjustDate(i)
        },
        _selectDay: function(e, t, a, i) {
            var s, r = b(e);
            b(i).hasClass(this._unselectableClass) || this._isDisabledDatepicker(r[0]) || ((s = this._getInst(r[0])).selectedDay = s.currentDay = b("a", i).html(), s.selectedMonth = s.currentMonth = t, s.selectedYear = s.currentYear = a, this._selectDate(e, this._formatDate(s, s.currentDay, s.currentMonth, s.currentYear)))
        },
        _clearDate: function(e) {
            var t = b(e);
            this._selectDate(t, "")
        },
        _selectDate: function(e, t) {
            var a, i = b(e),
                s = this._getInst(i[0]);
            t = null != t ? t : this._formatDate(s), s.input && s.input.val(t), this._updateAlternate(s), (a = this._get(s, "onSelect")) ? a.apply(s.input ? s.input[0] : null, [t, s]) : s.input && s.input.trigger("change"), s.inline ? this._updateDatepicker(s) : (this._hideDatepicker(), this._lastInput = s.input[0], "object" != typeof s.input[0] && s.input.focus(), this._lastInput = null)
        },
        _updateAlternate: function(e) {
            var t, a, i, s = this._get(e, "altField");
            s && (t = this._get(e, "altFormat") || this._get(e, "dateFormat"), a = this._getDate(e), i = this.formatDate(t, a, this._getFormatConfig(e)), b(s).each(function() {
                b(this).val(i)
            }))
        },
        noWeekends: function(e) {
            var t = e.getDay();
            return [0 < t && t < 6, ""]
        },
        iso8601Week: function(e) {
            var t, a = new Date(e.getTime());
            return a.setDate(a.getDate() + 4 - (a.getDay() || 7)), t = a.getTime(), a.setMonth(0), a.setDate(1), Math.floor(Math.round((t - a) / 864e5) / 7) + 1
        },
        parseDate: function(a, r, e) {
            if (null == a || null == r) throw "Invalid arguments";
            if ("" === (r = "object" == typeof r ? r.toString() : r + "")) return null;

            function n(e) {
                var t = d + 1 < a.length && a.charAt(d + 1) === e;
                return t && d++, t
            }

            function t(e) {
                var t = n(e),
                    a = "@" === e ? 14 : "!" === e ? 20 : "y" === e && t ? 4 : "o" === e ? 3 : 2,
                    i = new RegExp("^\\d{" + ("y" === e ? a : 1) + "," + a + "}"),
                    s = r.substring(h).match(i);
                if (!s) throw "Missing number at position " + h;
                return h += s[0].length, parseInt(s[0], 10)
            }

            function i(e, t, a) {
                var i = -1,
                    s = b.map(n(e) ? a : t, function(e, t) {
                        return [
                            [t, e]
                        ]
                    }).sort(function(e, t) {
                        return -(e[1].length - t[1].length)
                    });
                if (b.each(s, function(e, t) {
                        var a = t[1];
                        if (r.substr(h, a.length).toLowerCase() === a.toLowerCase()) return i = t[0], h += a.length, !1
                    }), -1 !== i) return i + 1;
                throw "Unknown name at position " + h
            }

            function s() {
                if (r.charAt(h) !== a.charAt(d)) throw "Unexpected literal at position " + h;
                h++
            }
            var d, c, o, l, h = 0,
                u = (e ? e.shortYearCutoff : null) || this._defaults.shortYearCutoff,
                p = "string" != typeof u ? u : (new Date).getFullYear() % 100 + parseInt(u, 10),
                g = (e ? e.dayNamesShort : null) || this._defaults.dayNamesShort,
                _ = (e ? e.dayNames : null) || this._defaults.dayNames,
                f = (e ? e.monthNamesShort : null) || this._defaults.monthNamesShort,
                k = (e ? e.monthNames : null) || this._defaults.monthNames,
                D = -1,
                m = -1,
                y = -1,
                v = -1,
                M = !1;
            for (d = 0; d < a.length; d++)
                if (M) "'" !== a.charAt(d) || n("'") ? s() : M = !1;
                else switch (a.charAt(d)) {
                    case "d":
                        y = t("d");
                        break;
                    case "D":
                        i("D", g, _);
                        break;
                    case "o":
                        v = t("o");
                        break;
                    case "m":
                        m = t("m");
                        break;
                    case "M":
                        m = i("M", f, k);
                        break;
                    case "y":
                        D = t("y");
                        break;
                    case "@":
                        D = (l = new Date(t("@"))).getFullYear(), m = l.getMonth() + 1, y = l.getDate();
                        break;
                    case "!":
                        D = (l = new Date((t("!") - this._ticksTo1970) / 1e4)).getFullYear(), m = l.getMonth() + 1, y = l.getDate();
                        break;
                    case "'":
                        n("'") ? s() : M = !0;
                        break;
                    default:
                        s()
                }
            if (h < r.length && (o = r.substr(h), !/^\s+/.test(o))) throw "Extra/unparsed characters found in date: " + o;
            if (-1 === D ? D = (new Date).getFullYear() : D < 100 && (D += (new Date).getFullYear() - (new Date).getFullYear() % 100 + (D <= p ? 0 : -100)), -1 < v)
                for (m = 1, y = v;;) {
                    if (y <= (c = this._getDaysInMonth(D, m - 1))) break;
                    m++, y -= c
                }
            if ((l = this._daylightSavingAdjust(new Date(D, m - 1, y))).getFullYear() !== D || l.getMonth() + 1 !== m || l.getDate() !== y) throw "Invalid date";
            return l
        },
        ATOM: "yy-mm-dd",
        COOKIE: "D, dd M yy",
        ISO_8601: "yy-mm-dd",
        RFC_822: "D, d M y",
        RFC_850: "DD, dd-M-y",
        RFC_1036: "D, d M y",
        RFC_1123: "D, d M yy",
        RFC_2822: "D, d M yy",
        RSS: "D, d M y",
        TICKS: "!",
        TIMESTAMP: "@",
        W3C: "yy-mm-dd",
        _ticksTo1970: 24 * (718685 + Math.floor(492.5) - Math.floor(19.7) + Math.floor(4.925)) * 60 * 60 * 1e7,
        formatDate: function(a, e, t) {
            if (!e) return "";

            function s(e) {
                var t = n + 1 < a.length && a.charAt(n + 1) === e;
                return t && n++, t
            }

            function i(e, t, a) {
                var i = "" + t;
                if (s(e))
                    for (; i.length < a;) i = "0" + i;
                return i
            }

            function r(e, t, a, i) {
                return s(e) ? i[t] : a[t]
            }
            var n, d = (t ? t.dayNamesShort : null) || this._defaults.dayNamesShort,
                c = (t ? t.dayNames : null) || this._defaults.dayNames,
                o = (t ? t.monthNamesShort : null) || this._defaults.monthNamesShort,
                l = (t ? t.monthNames : null) || this._defaults.monthNames,
                h = "",
                u = !1;
            if (e)
                for (n = 0; n < a.length; n++)
                    if (u) "'" !== a.charAt(n) || s("'") ? h += a.charAt(n) : u = !1;
                    else switch (a.charAt(n)) {
                        case "d":
                            h += i("d", e.getDate(), 2);
                            break;
                        case "D":
                            h += r("D", e.getDay(), d, c);
                            break;
                        case "o":
                            h += i("o", Math.round((new Date(e.getFullYear(), e.getMonth(), e.getDate()).getTime() - new Date(e.getFullYear(), 0, 0).getTime()) / 864e5), 3);
                            break;
                        case "m":
                            h += i("m", e.getMonth() + 1, 2);
                            break;
                        case "M":
                            h += r("M", e.getMonth(), o, l);
                            break;
                        case "y":
                            h += s("y") ? e.getFullYear() : (e.getYear() % 100 < 10 ? "0" : "") + e.getYear() % 100;
                            break;
                        case "@":
                            h += e.getTime();
                            break;
                        case "!":
                            h += 1e4 * e.getTime() + this._ticksTo1970;
                            break;
                        case "'":
                            s("'") ? h += "'" : u = !0;
                            break;
                        default:
                            h += a.charAt(n)
                    }
            return h
        },
        _possibleChars: function(a) {
            function e(e) {
                var t = i + 1 < a.length && a.charAt(i + 1) === e;
                return t && i++, t
            }
            var i, t = "",
                s = !1;
            for (i = 0; i < a.length; i++)
                if (s) "'" !== a.charAt(i) || e("'") ? t += a.charAt(i) : s = !1;
                else switch (a.charAt(i)) {
                    case "d":
                    case "m":
                    case "y":
                    case "@":
                        t += "0123456789";
                        break;
                    case "D":
                    case "M":
                        return null;
                    case "'":
                        e("'") ? t += "'" : s = !0;
                        break;
                    default:
                        t += a.charAt(i)
                }
            return t
        },
        _get: function(e, t) {
            return void 0 !== e.settings[t] ? e.settings[t] : this._defaults[t]
        },
        _setDateFromField: function(e, t) {
            if (e.input.val() !== e.lastVal) {
                var a = this._get(e, "dateFormat"),
                    i = e.lastVal = e.input ? e.input.val() : null,
                    s = this._getDefaultDate(e),
                    r = s,
                    n = this._getFormatConfig(e);
                try {
                    r = this.parseDate(a, i, n) || s
                } catch (e) {
                    i = t ? "" : i
                }
                e.selectedDay = r.getDate(), e.drawMonth = e.selectedMonth = r.getMonth(), e.drawYear = e.selectedYear = r.getFullYear(), e.currentDay = i ? r.getDate() : 0, e.currentMonth = i ? r.getMonth() : 0, e.currentYear = i ? r.getFullYear() : 0, this._adjustInstDate(e)
            }
        },
        _getDefaultDate: function(e) {
            return this._restrictMinMax(e, this._determineDate(e, this._get(e, "defaultDate"), new Date))
        },
        _determineDate: function(d, e, t) {
            var a, i, s = null == e || "" === e ? t : "string" == typeof e ? function(e) {
                try {
                    return b.datepicker.parseDate(b.datepicker._get(d, "dateFormat"), e, b.datepicker._getFormatConfig(d))
                } catch (e) {}
                for (var t = (e.toLowerCase().match(/^c/) ? b.datepicker._getDate(d) : null) || new Date, a = t.getFullYear(), i = t.getMonth(), s = t.getDate(), r = /([+\-]?[0-9]+)\s*(d|D|w|W|m|M|y|Y)?/g, n = r.exec(e); n;) {
                    switch (n[2] || "d") {
                        case "d":
                        case "D":
                            s += parseInt(n[1], 10);
                            break;
                        case "w":
                        case "W":
                            s += 7 * parseInt(n[1], 10);
                            break;
                        case "m":
                        case "M":
                            i += parseInt(n[1], 10), s = Math.min(s, b.datepicker._getDaysInMonth(a, i));
                            break;
                        case "y":
                        case "Y":
                            a += parseInt(n[1], 10), s = Math.min(s, b.datepicker._getDaysInMonth(a, i))
                    }
                    n = r.exec(e)
                }
                return new Date(a, i, s)
            }(e) : "number" == typeof e ? isNaN(e) ? t : (a = e, (i = new Date).setDate(i.getDate() + a), i) : new Date(e.getTime());
            return (s = s && "Invalid Date" === s.toString() ? t : s) && (s.setHours(0), s.setMinutes(0), s.setSeconds(0), s.setMilliseconds(0)), this._daylightSavingAdjust(s)
        },
        _daylightSavingAdjust: function(e) {
            return e ? (e.setHours(12 < e.getHours() ? e.getHours() + 2 : 0), e) : null
        },
        _setDate: function(e, t, a) {
            var i = !t,
                s = e.selectedMonth,
                r = e.selectedYear,
                n = this._restrictMinMax(e, this._determineDate(e, t, new Date));
            e.selectedDay = e.currentDay = n.getDate(), e.drawMonth = e.selectedMonth = e.currentMonth = n.getMonth(), e.drawYear = e.selectedYear = e.currentYear = n.getFullYear(), s === e.selectedMonth && r === e.selectedYear || a || this._notifyChange(e), this._adjustInstDate(e), e.input && e.input.val(i ? "" : this._formatDate(e))
        },
        _getDate: function(e) {
            return !e.currentYear || e.input && "" === e.input.val() ? null : this._daylightSavingAdjust(new Date(e.currentYear, e.currentMonth, e.currentDay))
        },
        _attachHandlers: function(e) {
            var t = this._get(e, "stepMonths"),
                a = "#" + e.id.replace(/\\\\/g, "\\");
            e.dpDiv.find("[data-handler]").map(function() {
                var e = {
                    prev: function() {
                        b.datepicker._adjustDate(a, -t, "M")
                    },
                    next: function() {
                        b.datepicker._adjustDate(a, +t, "M")
                    },
                    hide: function() {
                        b.datepicker._hideDatepicker()
                    },
                    today: function() {
                        b.datepicker._gotoToday(a)
                    },
                    selectDay: function() {
                        return b.datepicker._selectDay(a, +this.getAttribute("data-month"), +this.getAttribute("data-year"), this), !1
                    },
                    selectMonth: function() {
                        return b.datepicker._selectMonthYear(a, this, "M"), !1
                    },
                    selectYear: function() {
                        return b.datepicker._selectMonthYear(a, this, "Y"), !1
                    }
                };
                b(this).bind(this.getAttribute("data-event"), e[this.getAttribute("data-handler")])
            })
        },
        _generateHTML: function(e) {
            var t, a, i, s, r, n, d, c, o, l, h, u, p, g, _, f, k, D, m, y, v, M, b, w, C, I, x, Y, S, N, F, T, A, K, j, O, R, L, W, E = new Date,
                H = this._daylightSavingAdjust(new Date(E.getFullYear(), E.getMonth(), E.getDate())),
                P = this._get(e, "isRTL"),
                U = this._get(e, "showButtonPanel"),
                z = this._get(e, "hideIfNoPrevNext"),
                B = this._get(e, "navigationAsDateFormat"),
                J = this._getNumberOfMonths(e),
                V = this._get(e, "showCurrentAtPos"),
                q = this._get(e, "stepMonths"),
                Q = 1 !== J[0] || 1 !== J[1],
                X = this._daylightSavingAdjust(e.currentDay ? new Date(e.currentYear, e.currentMonth, e.currentDay) : new Date(9999, 9, 9)),
                Z = this._getMinMaxDate(e, "min"),
                $ = this._getMinMaxDate(e, "max"),
                G = e.drawMonth - V,
                ee = e.drawYear;
            if (G < 0 && (G += 12, ee--), $)
                for (t = this._daylightSavingAdjust(new Date($.getFullYear(), $.getMonth() - J[0] * J[1] + 1, $.getDate())), t = Z && t < Z ? Z : t; this._daylightSavingAdjust(new Date(ee, G, 1)) > t;) --G < 0 && (G = 11, ee--);
            for (e.drawMonth = G, e.drawYear = ee, a = this._get(e, "prevText"), a = B ? this.formatDate(a, this._daylightSavingAdjust(new Date(ee, G - q, 1)), this._getFormatConfig(e)) : a, i = this._canAdjustMonth(e, -1, ee, G) ? "<a class='ui-datepicker-prev ui-corner-all' data-handler='prev' data-event='click' title='" + a + "'><span class='ui-icon ui-icon-circle-triangle-" + (P ? "e" : "w") + "'>" + a + "</span></a>" : z ? "" : "<a class='ui-datepicker-prev ui-corner-all ui-state-disabled' title='" + a + "'><span class='ui-icon ui-icon-circle-triangle-" + (P ? "e" : "w") + "'>" + a + "</span></a>", s = this._get(e, "nextText"), s = B ? this.formatDate(s, this._daylightSavingAdjust(new Date(ee, G + q, 1)), this._getFormatConfig(e)) : s, r = this._canAdjustMonth(e, 1, ee, G) ? "<a class='ui-datepicker-next ui-corner-all' data-handler='next' data-event='click' title='" + s + "'><span class='ui-icon ui-icon-circle-triangle-" + (P ? "w" : "e") + "'>" + s + "</span></a>" : z ? "" : "<a class='ui-datepicker-next ui-corner-all ui-state-disabled' title='" + s + "'><span class='ui-icon ui-icon-circle-triangle-" + (P ? "w" : "e") + "'>" + s + "</span></a>", n = this._get(e, "currentText"), d = this._get(e, "gotoCurrent") && e.currentDay ? X : H, n = B ? this.formatDate(n, d, this._getFormatConfig(e)) : n, c = e.inline ? "" : "<button type='button' class='ui-datepicker-close ui-state-default ui-priority-primary ui-corner-all' data-handler='hide' data-event='click'>" + this._get(e, "closeText") + "</button>", o = U ? "<div class='ui-datepicker-buttonpane ui-widget-content'>" + (P ? c : "") + (this._isInRange(e, d) ? "<button type='button' class='ui-datepicker-current ui-state-default ui-priority-secondary ui-corner-all' data-handler='today' data-event='click'>" + n + "</button>" : "") + (P ? "" : c) + "</div>" : "", l = parseInt(this._get(e, "firstDay"), 10), l = isNaN(l) ? 0 : l, h = this._get(e, "showWeek"), u = this._get(e, "dayNames"), p = this._get(e, "dayNamesMin"), g = this._get(e, "monthNames"), _ = this._get(e, "monthNamesShort"), f = this._get(e, "beforeShowDay"), k = this._get(e, "showOtherMonths"), D = this._get(e, "selectOtherMonths"), m = this._getDefaultDate(e), y = "", M = 0; M < J[0]; M++) {
                for (b = "", this.maxRows = 4, w = 0; w < J[1]; w++) {
                    if (C = this._daylightSavingAdjust(new Date(ee, G, e.selectedDay)), I = " ui-corner-all", x = "", Q) {
                        if (x += "<div class='ui-datepicker-group", 1 < J[1]) switch (w) {
                            case 0:
                                x += " ui-datepicker-group-first", I = " ui-corner-" + (P ? "right" : "left");
                                break;
                            case J[1] - 1:
                                x += " ui-datepicker-group-last", I = " ui-corner-" + (P ? "left" : "right");
                                break;
                            default:
                                x += " ui-datepicker-group-middle", I = ""
                        }
                        x += "'>"
                    }
                    for (x += "<div class='ui-datepicker-header ui-widget-header ui-helper-clearfix" + I + "'>" + (/all|left/.test(I) && 0 === M ? P ? r : i : "") + (/all|right/.test(I) && 0 === M ? P ? i : r : "") + this._generateMonthYearHeader(e, G, ee, Z, $, 0 < M || 0 < w, g, _) + "</div><table class='ui-datepicker-calendar'><thead><tr>", Y = h ? "<th class='ui-datepicker-week-col'>" + this._get(e, "weekHeader") + "</th>" : "", v = 0; v < 7; v++) Y += "<th scope='col'" + (5 <= (v + l + 6) % 7 ? " class='ui-datepicker-week-end'" : "") + "><span title='" + u[S = (v + l) % 7] + "'>" + p[S] + "</span></th>";
                    for (x += Y + "</tr></thead><tbody>", N = this._getDaysInMonth(ee, G), ee === e.selectedYear && G === e.selectedMonth && (e.selectedDay = Math.min(e.selectedDay, N)), F = (this._getFirstDayOfMonth(ee, G) - l + 7) % 7, T = Math.ceil((F + N) / 7), A = Q && this.maxRows > T ? this.maxRows : T, this.maxRows = A, K = this._daylightSavingAdjust(new Date(ee, G, 1 - F)), j = 0; j < A; j++) {
                        for (x += "<tr>", O = h ? "<td class='ui-datepicker-week-col'>" + this._get(e, "calculateWeek")(K) + "</td>" : "", v = 0; v < 7; v++) R = f ? f.apply(e.input ? e.input[0] : null, [K]) : [!0, ""], W = (L = K.getMonth() !== G) && !D || !R[0] || Z && K < Z || $ && $ < K, O += "<td class='" + (5 <= (v + l + 6) % 7 ? " ui-datepicker-week-end" : "") + (L ? " ui-datepicker-other-month" : "") + (K.getTime() === C.getTime() && G === e.selectedMonth && e._keyEvent || m.getTime() === K.getTime() && m.getTime() === C.getTime() ? " " + this._dayOverClass : "") + (W ? " " + this._unselectableClass + " ui-state-disabled" : "") + (L && !k ? "" : " " + R[1] + (K.getTime() === X.getTime() ? " " + this._currentClass : "") + (K.getTime() === H.getTime() ? " ui-datepicker-today" : "")) + "'" + (L && !k || !R[2] ? "" : " title='" + R[2].replace(/'/g, "&#39;") + "'") + (W ? "" : " data-handler='selectDay' data-event='click' data-month='" + K.getMonth() + "' data-year='" + K.getFullYear() + "'") + ">" + (L && !k ? "&#xa0;" : W ? "<span class='ui-state-default'>" + K.getDate() + "</span>" : "<a class='ui-state-default" + (K.getTime() === H.getTime() ? " ui-state-highlight" : "") + (K.getTime() === X.getTime() ? " ui-state-active" : "") + (L ? " ui-priority-secondary" : "") + "' href='#'>" + K.getDate() + "</a>") + "</td>", K.setDate(K.getDate() + 1), K = this._daylightSavingAdjust(K);
                        x += O + "</tr>"
                    }
                    11 < ++G && (G = 0, ee++), b += x += "</tbody></table>" + (Q ? "</div>" + (0 < J[0] && w === J[1] - 1 ? "<div class='ui-datepicker-row-break'></div>" : "") : "")
                }
                y += b
            }
            return y += o, e._keyEvent = !1, y
        },
        _generateMonthYearHeader: function(e, t, a, i, s, r, n, d) {
            var c, o, l, h, u, p, g, _, f = this._get(e, "changeMonth"),
                k = this._get(e, "changeYear"),
                D = this._get(e, "showMonthAfterYear"),
                m = "<div class='ui-datepicker-title'>",
                y = "";
            if (r || !f) y += "<span class='ui-datepicker-month'>" + n[t] + "</span>";
            else {
                for (c = i && i.getFullYear() === a, o = s && s.getFullYear() === a, y += "<select class='ui-datepicker-month' data-handler='selectMonth' data-event='change'>", l = 0; l < 12; l++)(!c || l >= i.getMonth()) && (!o || l <= s.getMonth()) && (y += "<option value='" + l + "'" + (l === t ? " selected='selected'" : "") + ">" + d[l] + "</option>");
                y += "</select>"
            }
            if (D || (m += y + (!r && f && k ? "" : "&#xa0;")), !e.yearshtml)
                if (e.yearshtml = "", r || !k) m += "<span class='ui-datepicker-year'>" + a + "</span>";
                else {
                    for (h = this._get(e, "yearRange").split(":"), u = (new Date).getFullYear(), g = (p = function(e) {
                            var t = e.match(/c[+\-].*/) ? a + parseInt(e.substring(1), 10) : e.match(/[+\-].*/) ? u + parseInt(e, 10) : parseInt(e, 10);
                            return isNaN(t) ? u : t
                        })(h[0]), _ = Math.max(g, p(h[1] || "")), g = i ? Math.max(g, i.getFullYear()) : g, _ = s ? Math.min(_, s.getFullYear()) : _, e.yearshtml += "<select class='ui-datepicker-year' data-handler='selectYear' data-event='change'>"; g <= _; g++) e.yearshtml += "<option value='" + g + "'" + (g === a ? " selected='selected'" : "") + ">" + g + "</option>";
                    e.yearshtml += "</select>", m += e.yearshtml, e.yearshtml = null
                }
            return m += this._get(e, "yearSuffix"), D && (m += (!r && f && k ? "" : "&#xa0;") + y), m += "</div>"
        },
        _adjustInstDate: function(e, t, a) {
            var i = e.drawYear + ("Y" === a ? t : 0),
                s = e.drawMonth + ("M" === a ? t : 0),
                r = Math.min(e.selectedDay, this._getDaysInMonth(i, s)) + ("D" === a ? t : 0),
                n = this._restrictMinMax(e, this._daylightSavingAdjust(new Date(i, s, r)));
            e.selectedDay = n.getDate(), e.drawMonth = e.selectedMonth = n.getMonth(), e.drawYear = e.selectedYear = n.getFullYear(), "M" !== a && "Y" !== a || this._notifyChange(e)
        },
        _restrictMinMax: function(e, t) {
            var a = this._getMinMaxDate(e, "min"),
                i = this._getMinMaxDate(e, "max"),
                s = a && t < a ? a : t;
            return i && i < s ? i : s
        },
        _notifyChange: function(e) {
            var t = this._get(e, "onChangeMonthYear");
            t && t.apply(e.input ? e.input[0] : null, [e.selectedYear, e.selectedMonth + 1, e])
        },
        _getNumberOfMonths: function(e) {
            var t = this._get(e, "numberOfMonths");
            return null == t ? [1, 1] : "number" == typeof t ? [1, t] : t
        },
        _getMinMaxDate: function(e, t) {
            return this._determineDate(e, this._get(e, t + "Date"), null)
        },
        _getDaysInMonth: function(e, t) {
            return 32 - this._daylightSavingAdjust(new Date(e, t, 32)).getDate()
        },
        _getFirstDayOfMonth: function(e, t) {
            return new Date(e, t, 1).getDay()
        },
        _canAdjustMonth: function(e, t, a, i) {
            var s = this._getNumberOfMonths(e),
                r = this._daylightSavingAdjust(new Date(a, i + (t < 0 ? t : s[0] * s[1]), 1));
            return t < 0 && r.setDate(this._getDaysInMonth(r.getFullYear(), r.getMonth())), this._isInRange(e, r)
        },
        _isInRange: function(e, t) {
            var a, i, s = this._getMinMaxDate(e, "min"),
                r = this._getMinMaxDate(e, "max"),
                n = null,
                d = null,
                c = this._get(e, "yearRange");
            return c && (a = c.split(":"), i = (new Date).getFullYear(), n = parseInt(a[0], 10), d = parseInt(a[1], 10), a[0].match(/[+\-].*/) && (n += i), a[1].match(/[+\-].*/) && (d += i)), (!s || t.getTime() >= s.getTime()) && (!r || t.getTime() <= r.getTime()) && (!n || t.getFullYear() >= n) && (!d || t.getFullYear() <= d)
        },
        _getFormatConfig: function(e) {
            var t = this._get(e, "shortYearCutoff");
            return {
                shortYearCutoff: t = "string" != typeof t ? t : (new Date).getFullYear() % 100 + parseInt(t, 10),
                dayNamesShort: this._get(e, "dayNamesShort"),
                dayNames: this._get(e, "dayNames"),
                monthNamesShort: this._get(e, "monthNamesShort"),
                monthNames: this._get(e, "monthNames")
            }
        },
        _formatDate: function(e, t, a, i) {
            t || (e.currentDay = e.selectedDay, e.currentMonth = e.selectedMonth, e.currentYear = e.selectedYear);
            var s = t ? "object" == typeof t ? t : this._daylightSavingAdjust(new Date(i, a, t)) : this._daylightSavingAdjust(new Date(e.currentYear, e.currentMonth, e.currentDay));
            return this.formatDate(this._get(e, "dateFormat"), s, this._getFormatConfig(e))
        }
    }), b.fn.datepicker = function(e) {
        if (!this.length) return this;
        b.datepicker.initialized || (b(document).mousedown(b.datepicker._checkExternalClick), b.datepicker.initialized = !0), 0 === b("#" + b.datepicker._mainDivId).length && b("body").append(b.datepicker.dpDiv);
        var t = Array.prototype.slice.call(arguments, 1);
        return "string" != typeof e || "isDisabled" !== e && "getDate" !== e && "widget" !== e ? "option" === e && 2 === arguments.length && "string" == typeof arguments[1] ? b.datepicker["_" + e + "Datepicker"].apply(b.datepicker, [this[0]].concat(t)) : this.each(function() {
            "string" == typeof e ? b.datepicker["_" + e + "Datepicker"].apply(b.datepicker, [this].concat(t)) : b.datepicker._attachDatepicker(this, e)
        }) : b.datepicker["_" + e + "Datepicker"].apply(b.datepicker, [this[0]].concat(t))
    }, b.datepicker = new e, b.datepicker.initialized = !1, b.datepicker.uuid = (new Date).getTime(), b.datepicker.version = "1.11.4", b.datepicker
});