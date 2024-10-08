define("text", ["module"], function (e) {
    "use strict";
    function t(e, t) {
        return void 0 === e || "" === e ? t : e;
    }
    function a(e, a, i, s) {
        if (a === s) return !0;
        if (e === i) {
            if ("http" === e) return t(a, "80") === t(s, "80");
            if ("https" === e) return t(a, "443") === t(s, "443");
        }
        return !1;
    }
    var i,
        s,
        r,
        n,
        o,
        d = ["Msxml2.XMLHTTP", "Microsoft.XMLHTTP", "Msxml2.XMLHTTP.4.0"],
        l = /^\s*<\?xml(\s)+version=[\'\"](\d)*.(\d)*[\'\"](\s)*\?>/im,
        u = /<body[^>]*>\s*([\s\S]+)\s*<\/body>/im,
        h = "undefined" != typeof location && location.href,
        m = h && location.protocol && location.protocol.replace(/\:/, ""),
        c = h && location.hostname,
        p = h && (location.port || void 0),
        f = {},
        g = (e.config && e.config()) || {};
    return (
        (i = {
            version: "2.0.16",
            strip: function (e) {
                if (e) {
                    e = e.replace(l, "");
                    var t = e.match(u);
                    t && (e = t[1]);
                } else e = "";
                return e;
            },
            jsEscape: function (e) {
                return e
                    .replace(/(['\\])/g, "\\$1")
                    .replace(/[\f]/g, "\\f")
                    .replace(/[\b]/g, "\\b")
                    .replace(/[\n]/g, "\\n")
                    .replace(/[\t]/g, "\\t")
                    .replace(/[\r]/g, "\\r")
                    .replace(/[\u2028]/g, "\\u2028")
                    .replace(/[\u2029]/g, "\\u2029");
            },
            createXhr:
                g.createXhr ||
                function () {
                    var e, t, a;
                    if ("undefined" != typeof XMLHttpRequest)
                        return new XMLHttpRequest();
                    if ("undefined" != typeof ActiveXObject)
                        for (t = 0; t < 3; t += 1) {
                            a = d[t];
                            try {
                                e = new ActiveXObject(a);
                            } catch (e) {}
                            if (e) {
                                d = [a];
                                break;
                            }
                        }
                    return e;
                },
            parseName: function (e) {
                var t,
                    a,
                    i,
                    s = !1,
                    r = e.lastIndexOf("."),
                    n = 0 === e.indexOf("./") || 0 === e.indexOf("../");
                return (
                    -1 !== r && (!n || r > 1)
                        ? ((t = e.substring(0, r)), (a = e.substring(r + 1)))
                        : (t = e),
                    (i = a || t),
                    (r = i.indexOf("!")),
                    -1 !== r &&
                        ((s = "strip" === i.substring(r + 1)),
                        (i = i.substring(0, r)),
                        a ? (a = i) : (t = i)),
                    { moduleName: t, ext: a, strip: s }
                );
            },
            xdRegExp: /^((\w+)\:)?\/\/([^\/\\]+)/,
            useXhr: function (e, t, s, r) {
                var n,
                    o,
                    d,
                    l = i.xdRegExp.exec(e);
                return (
                    !l ||
                    ((n = l[2]),
                    (o = l[3]),
                    (o = o.split(":")),
                    (d = o[1]),
                    (o = o[0]),
                    (!n || n === t) &&
                        (!o || o.toLowerCase() === s.toLowerCase()) &&
                        ((!d && !o) || a(n, d, t, r)))
                );
            },
            finishLoad: function (e, t, a, s) {
                (a = t ? i.strip(a) : a), g.isBuild && (f[e] = a), s(a);
            },
            load: function (e, t, a, s) {
                if (s && s.isBuild && !s.inlineText) return void a();
                g.isBuild = s && s.isBuild;
                var r = i.parseName(e),
                    n = r.moduleName + (r.ext ? "." + r.ext : ""),
                    o = t.toUrl(n),
                    d = g.useXhr || i.useXhr;
                if (0 === o.indexOf("empty:")) return void a();
                !h || d(o, m, c, p)
                    ? i.get(
                          o,
                          function (t) {
                              i.finishLoad(e, r.strip, t, a);
                          },
                          function (e) {
                              a.error && a.error(e);
                          }
                      )
                    : t(
                          [n],
                          function (e) {
                              i.finishLoad(
                                  r.moduleName + "." + r.ext,
                                  r.strip,
                                  e,
                                  a
                              );
                          },
                          function (e) {
                              a.error && a.error(e);
                          }
                      );
            },
            write: function (e, t, a, s) {
                if (f.hasOwnProperty(t)) {
                    var r = i.jsEscape(f[t]);
                    a.asModule(
                        e + "!" + t,
                        "define(function () { return '" + r + "';});\n"
                    );
                }
            },
            writeFile: function (e, t, a, s, r) {
                var n = i.parseName(t),
                    o = n.ext ? "." + n.ext : "",
                    d = n.moduleName + o,
                    l = a.toUrl(n.moduleName + o) + ".js";
                i.load(
                    d,
                    a,
                    function (t) {
                        var a = function (e) {
                            return s(l, e);
                        };
                        (a.asModule = function (e, t) {
                            return s.asModule(e, l, t);
                        }),
                            i.write(e, d, a, r);
                    },
                    r
                );
            },
        }),
        "node" === g.env ||
        (!g.env &&
            "undefined" != typeof process &&
            process.versions &&
            process.versions.node &&
            !process.versions["node-webkit"] &&
            !process.versions["atom-shell"])
            ? ((s = require.nodeRequire("fs")),
              (i.get = function (e, t, a) {
                  try {
                      var i = s.readFileSync(e, "utf8");
                      "\ufeff" === i[0] && (i = i.substring(1)), t(i);
                  } catch (e) {
                      a && a(e);
                  }
              }))
            : "xhr" === g.env || (!g.env && i.createXhr())
            ? (i.get = function (e, t, a, s) {
                  var r,
                      n = i.createXhr();
                  if ((n.open("GET", e, !0), s))
                      for (r in s)
                          s.hasOwnProperty(r) &&
                              n.setRequestHeader(r.toLowerCase(), s[r]);
                  g.onXhr && g.onXhr(n, e),
                      (n.onreadystatechange = function (i) {
                          var s, r;
                          4 === n.readyState &&
                              ((s = n.status || 0),
                              s > 399 && s < 600
                                  ? ((r = new Error(e + " HTTP status: " + s)),
                                    (r.xhr = n),
                                    a && a(r))
                                  : t(n.responseText),
                              g.onXhrComplete && g.onXhrComplete(n, e));
                      }),
                      n.send(null);
              })
            : "rhino" === g.env ||
              (!g.env &&
                  "undefined" != typeof Packages &&
                  "undefined" != typeof java)
            ? (i.get = function (e, t) {
                  var a,
                      i,
                      s = new java.io.File(e),
                      r = java.lang.System.getProperty("line.separator"),
                      n = new java.io.BufferedReader(
                          new java.io.InputStreamReader(
                              new java.io.FileInputStream(s),
                              "utf-8"
                          )
                      ),
                      o = "";
                  try {
                      for (
                          a = new java.lang.StringBuffer(),
                              i = n.readLine(),
                              i &&
                                  i.length() &&
                                  65279 === i.charAt(0) &&
                                  (i = i.substring(1)),
                              null !== i && a.append(i);
                          null !== (i = n.readLine());

                      )
                          a.append(r), a.append(i);
                      o = String(a.toString());
                  } finally {
                      n.close();
                  }
                  t(o);
              })
            : ("xpconnect" === g.env ||
                  (!g.env &&
                      "undefined" != typeof Components &&
                      Components.classes &&
                      Components.interfaces)) &&
              ((r = Components.classes),
              (n = Components.interfaces),
              Components.utils.import("resource://gre/modules/FileUtils.jsm"),
              (o = "@mozilla.org/windows-registry-key;1" in r),
              (i.get = function (e, t) {
                  var a,
                      i,
                      s,
                      d = {};
                  o && (e = e.replace(/\//g, "\\")),
                      (s = new FileUtils.File(e));
                  try {
                      (a = r[
                          "@mozilla.org/network/file-input-stream;1"
                      ].createInstance(n.nsIFileInputStream)),
                          a.init(s, 1, 0, !1),
                          (i = r[
                              "@mozilla.org/intl/converter-input-stream;1"
                          ].createInstance(n.nsIConverterInputStream)),
                          i.init(
                              a,
                              "utf-8",
                              a.available(),
                              n.nsIConverterInputStream
                                  .DEFAULT_REPLACEMENT_CHARACTER
                          ),
                          i.readString(a.available(), d),
                          i.close(),
                          a.close(),
                          t(d.value);
                  } catch (e) {
                      throw new Error(((s && s.path) || "") + ": " + e);
                  }
              })),
        i
    );
}),
    define("text!ripple/template.html", [], function () {
        return "";
    }),
    define("global_libs/require/normalize", [], function () {
        function e(e, i, s) {
            if (e.match(o) || e.match(n)) return e;
            e = r(e);
            var d = s.match(n),
                l = i.match(n);
            return !l || (d && d[1] == l[1] && d[2] == l[2])
                ? a(t(e, i), s)
                : t(e, i);
        }
        function t(e, t) {
            if (
                ("./" == e.substr(0, 2) && (e = e.substr(2)),
                e.match(o) || e.match(n))
            )
                return e;
            var a = t.split("/"),
                i = e.split("/");
            for (a.pop(); (curPart = i.shift()); )
                ".." == curPart ? a.pop() : a.push(curPart);
            return a.join("/");
        }
        function a(e, t) {
            var a = t.split("/");
            for (
                a.pop(), t = a.join("/") + "/", i = 0;
                t.substr(i, 1) == e.substr(i, 1);

            )
                i++;
            for (; "/" != t.substr(i, 1); ) i--;
            (t = t.substr(i + 1)), (e = e.substr(i + 1)), (a = t.split("/"));
            var s = e.split("/");
            for (out = ""; a.shift(); ) out += "../";
            for (; (curPart = s.shift()); ) out += curPart + "/";
            return out.substr(0, out.length - 1);
        }
        var s = /([^:])\/+/g,
            r = function (e) {
                return e.replace(s, "$1/");
            },
            n = /[^\:\/]*:\/\/([^\/])*/,
            o = /^(\/|data:)/,
            d = function (t, a, i) {
                (a = r(a)), (i = r(i));
                for (
                    var s,
                        n,
                        t,
                        o =
                            /@import\s*("([^"]*)"|'([^']*)')|url\s*\((?!#)\s*(\s*"([^"]*)"|'([^']*)'|[^\)]*\s*)\s*\)/gi;
                    (s = o.exec(t));

                ) {
                    n = s[3] || s[2] || s[5] || s[6] || s[4];
                    var d;
                    d = e(n, a, i);
                    var l = s[5] || s[6] ? 1 : 0;
                    (t =
                        t.substr(0, o.lastIndex - n.length - l - 1) +
                        d +
                        t.substr(o.lastIndex - l - 1)),
                        (o.lastIndex = o.lastIndex + (d.length - n.length));
                }
                return t;
            };
        return (
            (d.convertURIBase = e), (d.absoluteURI = t), (d.relativeURI = a), d
        );
    }),
    define("css", [], function () {
        if ("undefined" == typeof window)
            return {
                load: function (e, t, a) {
                    a();
                },
            };
        var e = document.getElementsByTagName("head")[0],
            t =
                window.navigator.userAgent.match(
                    /Trident\/([^ ;]*)|AppleWebKit\/([^ ;]*)|Opera\/([^ ;]*)|rv\:([^ ;]*)(.*?)Gecko\/([^ ;]*)|MSIE\s([^ ;]*)|AndroidWebKit\/([^ ;]*)/
                ) || 0,
            a = !1,
            i = !0;
        t[1] || t[7]
            ? (a = parseInt(t[1]) < 6 || parseInt(t[7]) <= 9)
            : t[2] || t[8]
            ? (i = !1)
            : t[4] && (a = parseInt(t[4]) < 18);
        var s = {};
        s.pluginBuilder = "global_libs/require/css-builder";
        var r,
            n,
            o,
            d = function () {
                (r = document.createElement("style")),
                    e.appendChild(r),
                    (n = r.styleSheet || r.sheet);
            },
            l = 0,
            u = [],
            h = function (e) {
                l++,
                    32 == l && (d(), (l = 0)),
                    n.addImport(e),
                    (r.onload = function () {
                        m();
                    });
            },
            m = function () {
                o();
                var e = u.shift();
                return e ? ((o = e[1]), void h(e[0])) : void (o = null);
            },
            c = function (e, t) {
                if (((n && n.addImport) || d(), n && n.addImport))
                    o ? u.push([e, t]) : (h(e), (o = t));
                else {
                    r.textContent = '@import "' + e + '";';
                    var a = setInterval(function () {
                        try {
                            r.sheet.cssRules, clearInterval(a), t();
                        } catch (e) {}
                    }, 10);
                }
            },
            p = function (t, a) {
                var s = document.createElement("link");
                if (((s.type = "text/css"), (s.rel = "stylesheet"), i))
                    s.onload = function () {
                        (s.onload = function () {}), setTimeout(a, 7);
                    };
                else
                    var r = setInterval(function () {
                        for (var e = 0; e < document.styleSheets.length; e++) {
                            if (document.styleSheets[e].href == s.href)
                                return clearInterval(r), a();
                        }
                    }, 10);
                (s.href = t), e.appendChild(s);
            };
        return (
            (s.normalize = function (e, t) {
                return (
                    ".css" == e.substr(e.length - 4, 4) &&
                        (e = e.substr(0, e.length - 4)),
                    t(e)
                );
            }),
            (s.load = function (e, t, i) {
                (a ? c : p)(t.toUrl(e + ".css"), i);
            }),
            s
        );
    }),
    define("css!ripple/style", [], function () {}),
    define(
        "ripple/main",
        ["text!ripple/template.html", "_libs/pixi.min", "css!./style"],
        function (e, t) {
            return Backbone.View.extend({
                template: _.template(e),
                deferredLoadEventName: "ripples-load-complete",
                defaults: {
                    scaleX: 20,
                    scaleY: 29,
                    target_speed: 9,
                    mouse_sensitivity: 100,
                    direction: 245,
                    color: "#fff",
                    hex: "#fff",
                    alpha: "0",
                    mouse_interaction: !0,
                    image_url:
                        "//static.cargo.site/assets/backdrop/default_1024.jpg",
                    image_size: 2048,
                    image: "",
                    plugin_id: 8,
                    scale: 1,
                    size: "cover",
                },
                drawFrameID: null,
                initialize: function () {
                    (this.data = {
                        displacement_sprite: null,
                        image_size: { width: 100, height: 100 },
                        renderer: null,
                        shader_inited: !1,
                        stage: null,
                        loader: null,
                        image_url: "/",
                        is_mobile: !1,
                        sprite: null,
                        texture: null,
                        image_loaded: !1,
                        model_speed: { x: 0, y: 0 },
                        stage_size: { w: 800, h: 600, resolution: 1 },
                        movement_offset: { x: 0, y: 0 },
                        mouse_prev: { x: -1, y: -1 },
                        mouse_cur: { x: 0, y: 0 },
                        mouse_angle: 0,
                        mouse_override: !1,
                        mouse_delta: {
                            x: 0,
                            y: 0,
                            smooth_x: 0,
                            smooth_y: 0,
                            smooth_cumu_x: 0,
                            smooth_cumu_y: 0,
                        },
                    }),
                        (this.SetSizeFromMainView = _.bind(
                            this.SetSizeFromMainView,
                            this
                        )),
                        (this.image_load_queue = []);
                    var e = this.model.get("data");
                    (e = _.defaults(e, this.defaults)),
                        this.model.set("data", e),
                        this.listenTo(this.model, "reset", this.Init),
                        this.makeCallbacks();
                },
                render: function () {
                    var e = Cargo.Core.Handlebars.Render(
                        "{{>loading_animation}}",
                        {}
                    );
                    return (this.el.style.opacity = 0), this.$el.html(e), this;
                },
                loadImage: function () {
                    $(".loading_animation", this.el).removeClass("hidden");
                    var e = this.model.get("data"),
                        a = this,
                        i = Cargo.Collection.Images.fetchWebGLImage(
                            e.image,
                            this.defaults.image_size
                        );
                    i
                        ? (i.id = e.image)
                        : ((i = {
                              w: 1024,
                              h: 1024,
                              url: this.defaults.image_url,
                              id: 0,
                          }),
                          (e.image = 0),
                          this.model.set("data", e));
                    var s = new Image();
                    (s.crossOrigin = ""),
                        (this.data.image_loaded = !1),
                        this.image_load_queue.push(i.id),
                        (s.onload = function () {
                            if (!a.destroyed) {
                                var e = a.image_load_queue.pop();
                                if (a.model.get("data").image != e)
                                    return void a.loadImage();
                                if (e == i.id) {
                                    (a.image_load_queue = []),
                                        (a.data.image_size.width = i.w),
                                        (a.data.image_size.height = i.h);
                                    var r = new t.Texture.fromImage(s.src);
                                    (a.data.sprite.texture = r),
                                        (a.data.image_loaded = !0),
                                        a.setupShader(),
                                        a.resizeImage(),
                                        a.in_viewport ? a.Resume() : a.Pause();
                                }
                            }
                        }),
                        (s.src = i.url);
                },
                isPowerOfTwo: function (e) {
                    return 0 == (e & (e - 1));
                },
                nextHighestPowerOfTwo: function (e) {
                    --e;
                    for (var t = 1; t < 32; t <<= 1) e |= e >> t;
                    return Math.min(e + 1, 2048);
                },
                setupShader: function () {
                    var e = this;
                    (this.data.shader_inited = !1),
                        (this.data.sprite.filters = null),
                        (this.data.sprite.filters = [
                            new t.filters.DisplacementFilter(
                                this.data.displacement_sprite
                            ),
                        ]),
                        (this.data.sprite.renderable = !0),
                        (this.data.shader_inited = !0),
                        this.setShaderValues(),
                        setTimeout(function () {
                            Cargo.Event.trigger(e.deferredLoadEventName);
                        }, 100),
                        $(".loading_animation", this.el).addClass("hidden");
                },
                makeSprite: function () {
                    this.data.stage.removeChildren(),
                        (this.data.displacement_sprite.renderable = !1),
                        this.data.stage.addChild(this.data.displacement_sprite),
                        this.data.stage.addChild(this.data.sprite);
                },
                resizeImage: function () {
                    if (this.data.image_loaded) {
                        var e =
                                (this.data.image_size.height,
                                this.data.image_size.width,
                                0),
                            t = 0,
                            a = 0,
                            i = 0,
                            s = null,
                            r = {
                                h: this.data.stage_size.h + 4,
                                w: this.data.stage_size.w + 4,
                            },
                            n = {
                                y:
                                    this.data.image_size.width /
                                    this.data.image_size.height,
                                x:
                                    this.data.image_size.height /
                                    this.data.image_size.width,
                            };
                        (s = r.w / r.h < n.y),
                            s
                                ? ((e = Math.ceil(r.h)),
                                  (t = Math.ceil(r.h * n.y)))
                                : ((e = Math.ceil(r.w * n.x)),
                                  (t = Math.ceil(r.w))),
                            (a = Math.ceil((r.h - e) / 2 - 2)),
                            (i = Math.ceil((r.w - t) / 2 - 2)),
                            (this.data.sprite.height = e),
                            (this.data.sprite.width = t),
                            (this.data.sprite.x = i),
                            (this.data.sprite.y = a);
                    }
                },
                setShaderValues: function () {
                    var e = this.model.get("data");
                    this.data.shader_inited &&
                        (this.data.sprite.filters[0].scale = {
                            x: 2 * e.scaleX * e.scale,
                            y: 2 * e.scaleY * e.scale,
                        });
                },
                updateShaderAnimation: function () {
                    var e = this.model.get("data"),
                        t = e.scale || 1;
                    this.data.shader_inited &&
                        ((this.data.displacement_sprite.scale.x = t),
                        (this.data.displacement_sprite.scale.y = t),
                        (this.data.displacement_sprite.x =
                            (this.data.movement_offset.x +
                                this.data.mouse_delta.smooth_cumu_x) %
                            (512 * t)),
                        (this.data.displacement_sprite.y =
                            (this.data.movement_offset.y +
                                this.data.mouse_delta.smooth_cumu_y) %
                            (512 * t)));
                },
                changeBGColor: function () {
                    var e = this.model.get("data");
                    (this.data.renderer.backgroundColor = e.hex.replace(
                        "#",
                        "0x"
                    )),
                        (this.data.stage.alpha = 1 - e.alpha);
                },
                updateMotion: function () {
                    var e = this.model.get("data"),
                        t = 0.15 * e.target_speed,
                        a = 0;
                    1 == this.data.mouse_override
                        ? (a += this.data.mouse_angle)
                        : (a += -1 * e.direction * (Math.PI / 180)),
                        (this.data.model_speed = {
                            x: Math.cos(a) * t,
                            y: Math.sin(a) * t,
                        }),
                        (this.data.movement_offset = {
                            x: Math.cos(a) * t + this.data.movement_offset.x,
                            y: Math.sin(a) * t + this.data.movement_offset.y,
                        });
                },
                updateMouseOffset: function (e) {
                    this.model.get("data").mouse_interaction &&
                        ((this.data.mouse_cur = { x: 0, y: 0 }),
                        this.data.is_mobile && e
                            ? (this.data.mouse_cur = {
                                  x: e.layerX || e.touches[0].clientX,
                                  y: e.layerY || e.touches[0].clientY,
                              })
                            : (this.data.mouse_cur = e
                                  ? { x: e.clientX, y: e.clientY }
                                  : {
                                        x: this.data.mouse_prev.x,
                                        y: this.data.mouse_prev.y,
                                    }),
                        this.setMouseDelta(),
                        (this.data.mouse_calced = !0),
                        (this.data.mouse_prev = {
                            x: this.data.mouse_cur.x,
                            y: this.data.mouse_cur.y,
                        }));
                },
                setMouseDelta: function () {
                    var e = this.model.get("data");
                    if (
                        !(
                            Math.abs(
                                this.data.mouse_cur.x - this.data.mouse_prev.x
                            ) > 200 ||
                            Math.abs(
                                this.data.mouse_cur.y - this.data.mouse_prev.y
                            ) > 200
                        )
                    ) {
                        var t = {
                                x:
                                    this.data.mouse_cur.x -
                                    this.data.mouse_prev.x,
                                y:
                                    this.data.mouse_cur.y -
                                    this.data.mouse_prev.y,
                            },
                            a = Math.atan2(t.y, t.x),
                            i =
                                Math.sqrt(t.x * t.x + t.y * t.y) *
                                e.mouse_sensitivity *
                                0.01;
                        if (-1 == this.data.mouse_prev.x)
                            this.data.mouse_delta = {
                                x: 0,
                                y: 0,
                                smooth_x: 0,
                                smooth_y: 0,
                                smooth_cumu_x: 0,
                                smooth_cumu_y: 0,
                            };
                        else {
                            var s = {
                                x: this.data.mouse_delta.smooth_x,
                                y: this.data.mouse_delta.smooth_y,
                            };
                            this.data.mouse_delta = {
                                x: Math.cos(a) * i,
                                y: Math.sin(a) * i,
                                smooth_x:
                                    0.1 * this.data.mouse_delta.x + 0.9 * s.x,
                                smooth_y:
                                    0.1 * this.data.mouse_delta.y + 0.9 * s.y,
                                smooth_cumu_x:
                                    this.data.mouse_delta.smooth_cumu_x +
                                    this.data.mouse_delta.smooth_x,
                                smooth_cumu_y:
                                    this.data.mouse_delta.smooth_cumu_y +
                                    this.data.mouse_delta.smooth_y,
                            };
                        }
                        Math.abs(this.data.mouse_delta.x) >
                            Math.abs(this.data.model_speed.x) &&
                            Math.abs(this.data.mouse_delta.y) >
                                Math.abs(this.data.model_speed.y) &&
                            (this.data.mouse_angle = a);
                    }
                },
                SetSizeFromMainView: function (e, t) {
                    var a = window.devicePixelRatio,
                        i = e * a * t * a;
                    if (i > 2073600) {
                        var s = Math.sqrt(2073600 / i);
                        (e = Math.ceil(e * s)), (t = Math.ceil(t * s));
                    }
                    (this.data.stage_size.w == e &&
                        this.data.stage_size.h == t) ||
                        (this.Pause(),
                        (this.data.stage_size.w = e),
                        (this.data.stage_size.h = t),
                        (this.data.stage_size.resolution = a),
                        this.data.renderer.resize(
                            this.data.stage_size.w,
                            this.data.stage_size.h
                        ),
                        this.resizeImage(),
                        this.Resume());
                },
                Pause: function () {
                    window.cancelAnimationFrame(this.drawFrameID),
                        (this.paused = !0);
                },
                Resume: function () {
                    window.cancelAnimationFrame(this.drawFrameID),
                        this.in_viewport && (this.draw(), (this.paused = !1));
                },
                draw: function () {
                    var e = this;
                    (this.drawFrameID = window.requestAnimationFrame(
                        function () {
                            e.draw();
                        }
                    )),
                        this.updateMotion(),
                        0 == this.data.mouse_calced && this.setMouseDelta(),
                        (this.data.mouse_calced = !1),
                        this.updateShaderAnimation(),
                        this.data.renderer.render(this.data.stage);
                },
                makeCallbacks: function () {
                    this.mouseCallback = this.updateMouseOffset.bind(this);
                },
                doSetup: function () {
                    this.makeSprite(), this.loadImage(), this.setShaderValues();
                },
                Init: function () {
                    var e = this.model.get("data");
                    void 0 == e.image &&
                        ((e.image = this.defaults.image),
                        this.model.set("data", e)),
                        (this.data.shader_inited = !1),
                        (this.data.renderer = t.autoDetectRenderer(800, 600, {
                            resolution: window.devicePixelRatio,
                        })),
                        (this.image_load_queue = []),
                        (this.data.stage = new t.Container()),
                        (this.data.loader = new t.loaders.Loader()),
                        (this.data.sprite = new t.Sprite()),
                        (this.data.sprite.renderable = !1),
                        (this.data.displacement_sprite = new t.Sprite.fromImage(
                            "/_jsapps/backdrop/ripple/assets/filter_NRM.jpg"
                        )),
                        this.doSetup(),
                        this.el.appendChild(this.data.renderer.view),
                        this.data.renderer.view.classList.add(
                            "displacement_canvas"
                        ),
                        this.changeBGColor(),
                        Cargo.Helper.isMobile()
                            ? ((this.data.is_mobile = !0),
                              window.addEventListener(
                                  "touchmove",
                                  this.mouseCallback
                              ))
                            : window.addEventListener(
                                  "mousemove",
                                  this.mouseCallback
                              ),
                        this.in_viewport ? this.Resume() : this.Pause();
                },
                Update: function (e, t) {
                    var a = this.model.get("data");
                    t != a[e] &&
                        ((a[e] = t),
                        this.model.set("data", a),
                        "image" == e &&
                            ((this.data.sprite.renderable = !1),
                            (this.data.image_loaded = !1),
                            this.loadImage()),
                        "image_delete" == e &&
                            a.image == t &&
                            ((a.image = ""),
                            this.model.set("data", a),
                            this.loadImage()),
                        ("direction" != e &&
                            "target_speed" != e &&
                            "mouse_interaction" != e) ||
                            (this.data.mouse_override = !1),
                        "size" == e && this.resizeImage(),
                        ("hex" != e && "alpha" != e) || this.changeBGColor(),
                        this.setShaderValues());
                },
                destroy: function () {
                    (this.image_load_queue = []),
                        window.cancelAnimationFrame(this.drawFrameID),
                        window.removeEventListener(
                            "mousemove",
                            this.mouseCallback
                        ),
                        window.removeEventListener(
                            "touchmove",
                            this.mouseCallback
                        ),
                        (this.data.stage = null),
                        (this.data.loader = null),
                        this.data.renderer.destroy(),
                        (this.loadImage = null),
                        (this.data = null),
                        (this.destroyed = !0);
                },
            });
        }
    ),
    (Backdrop.Data.require_loaded = !0),
    (function (e) {
        var t = document,
            a = "appendChild",
            i = "styleSheet",
            s = t.createElement("style");
        (s.type = "text/css"),
            t.getElementsByTagName("head")[0][a](s),
            s[i] ? (s[i].cssText = e) : s[a](t.createTextNode(e));
    })(
        '[data-backdrop="ripple"].backdrop > div {\n\topacity: 0;\n\tposition: absolute;\n\ttop: 0;\n\tleft: 0;\n\twidth: 100%;\n\theight: 100%;\n}\n\n[data-backdrop="ripple"] .displacement_canvas {\n\tbackground-color: #000;\t\t\n\tposition: absolute;\n\ttop: 0;\n\tleft: 0;\n\twidth: 100%;\n\theight: 100%;\n}\n'
    );
