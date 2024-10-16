var hsv, lab, l1, a1, b1, l2, a2, b2, color = {
    hexToString: function(r) {
        var t = r.toString(16);
        return t = "000000".substr(0, 6 - t.length) + t
    },
    rgbToHsv: function(r) {
        var t = 0
          , a = r.r
          , o = r.g
          , i = r.b
          , n = a < o && a < i ? a : o < i ? o : i
          , e = a > o && a > i ? a : o > i ? o : i
          , s = 0 === e ? 0 : (e - n) / e
          , h = 0 === s ? 1e-5 : e - n;
        switch (e) {
        case a:
            t = (o - i) / h;
            break;
        case o:
            t = 2 + (i - a) / h;
            break;
        case i:
            t = 4 + (a - o) / h
        }
        return {
            h: (1e3 + t / 6) % 1,
            s,
            v: e
        }
    },
    hsvToRgb: function(r) {
        var t = r.h
          , a = r.s
          , o = r.v
          , i = 0
          , n = 0
          , e = 0
          , s = 6 * (t = (t + 1e3) % 1) | 0
          , h = 6 * t - s
          , g = o * (1 - a)
          , c = o * (1 - a * h)
          , l = o * (1 - a * (1 - h));
        switch (s) {
        case 0:
            i = o,
            n = l,
            e = g;
            break;
        case 1:
            i = c,
            n = o,
            e = g;
            break;
        case 2:
            i = g,
            n = o,
            e = l;
            break;
        case 3:
            i = g,
            n = c,
            e = o;
            break;
        case 4:
            i = l,
            n = g,
            e = o;
            break;
        case 5:
            i = o,
            n = g,
            e = c
        }
        return {
            r: i,
            g: n,
            b: e
        }
    },
    rgbToCmyk: function(r) {
        var t = 1 - r.r
          , a = 1 - r.g
          , o = 1 - r.b
          , i = t < a && t < o ? t : a < o ? a : o;
        return 1 === i ? t = a = o = 0 : (t = (t - i) / (1 - i),
        a = (a - i) / (1 - i),
        o = (o - i) / (1 - i)),
        {
            c: t,
            m: a,
            y: o,
            k: i
        }
    },
    cmykToRgb: function(r) {
        var t = r.k;
        return {
            r: 1 - (r.c * (1 - t) + t),
            g: 1 - (r.m * (1 - t) + t),
            b: 1 - (r.y * (1 - t) + t)
        }
    },
    rgbToXyz: function(r) {
        var t = r.r
          , a = r.g
          , o = r.b;
        return {
            x: 100 * (.4124 * (t = t > .04045 ? Math.pow((t + .055) / 1.055, 2.4) : t / 12.92) + .3576 * (a = a > .04045 ? Math.pow((a + .055) / 1.055, 2.4) : a / 12.92) + .1805 * (o = o > .04045 ? Math.pow((o + .055) / 1.055, 2.4) : o / 12.92)) / 95.047,
            y: .2126 * t + .7152 * a + .0722 * o,
            z: 100 * (.0193 * t + .1192 * a + .9505 * o) / 108.883
        }
    },
    xyzToRgb: function(r) {
        var t = r.x
          , a = r.y
          , o = r.z
          , i = 3.24063 * (t *= 95.047 / 100) - 1.53721 * a - .498629 * (o *= 1.08883)
          , n = -.968931 * t + 1.87576 * a + .0415175 * o
          , e = .0557101 * t - .204021 * a + 1.057 * o;
        return {
            r: i = i > .0031308 ? 1.055 * Math.pow(i, .4167) - .055 : 12.92 * i,
            g: n = n > .0031308 ? 1.055 * Math.pow(n, .4167) - .055 : 12.92 * n,
            b: e = e > .0031308 ? 1.055 * Math.pow(e, .4167) - .055 : 12.92 * e
        }
    },
    rgbToLab: function(r) {
        var t = this.rgbToXyz(r)
          , a = t.x
          , o = t.y
          , i = t.z
          , n = a > .008856 ? Math.pow(a, 1 / 3) : 7.787 * a + .1379
          , e = o > .008856 ? Math.pow(o, 1 / 3) : 7.787 * o + .1379;
        return {
            l: (116 * e - 16) / 100,
            a: (500 * (n - e) + 128) / 255,
            b: (200 * (e - (i > .008856 ? Math.pow(i, 1 / 3) : 7.787 * i + .1379)) + 128) / 255
        }
    },
    labToRgb: function(r) {
        var t = (100 * r.l + 16) / 116
          , a = t + (255 * r.a - 128) / 500
          , o = t - (255 * r.b - 128) / 200;
        return this.xyzToRgb({
            x: a > .2069 ? a * a * a : .1284 * (a - .1379),
            y: t > .2069 ? t * t * t : .1284 * (t - .1379),
            z: o > .2069 ? o * o * o : .1284 * (o - .1379)
        })
    },
    labToLAB: function(r) {
        var t = [];
        return t[0] = 100 * r[0],
        t[1] = 255 * r[1] - 128,
        t[2] = 255 * r[2] - 128,
        t
    },
    labToLABInverse: function(r) {
        var t = [];
        return t[0] = r[0] / 100,
        t[1] = (r[1] + 128) / 255,
        t[2] = (r[2] + 128) / 255,
        t
    },
    valuesToRgb: function(r, t) {
        var a, o, i, n;
        switch (r) {
        case "lab":
            o = {
                l: t[0],
                a: t[1],
                b: t[2]
            },
            a = this.labToRgb(o);
            break;
        case "rgb":
            a = {
                r: t[0],
                g: t[1],
                b: t[2]
            };
            break;
        case "cmyk":
            i = {
                c: t[0],
                m: t[1],
                y: t[2],
                k: t[3]
            },
            a = this.cmykToRgb(i);
            break;
        case "hsv":
            n = {
                h: t[0],
                s: t[1],
                v: t[2]
            },
            a = this.hsvToRgb(n)
        }
        function e(r) {
            return r < 0 ? 0 : r > 1 ? 1 : r
        }
        return a = {
            r: e(a.r),
            g: e(a.g),
            b: e(a.b)
        }
    },
    valuesToHex: function(r, t) {
        var a = this.valuesToRgb(r, t);
        return this.hexToString((Math.round(255 * a.r) << 16 | Math.round(255 * a.g) << 8 | Math.round(255 * a.b)) >>> 0).toUpperCase()
    }
}, NUM_BINS_H = 64, NUM_BINS_S = 64, NUM_BINS_V = 10, HISTOGRAM_SIZE = NUM_BINS_H * NUM_BINS_S * NUM_BINS_V;
function emptyArray(r) {
    if (self.Float64Array)
        return new Float64Array(r);
    for (var t = new Array(r); --r >= 0; )
        t[r] = 0;
    return t
}
function copyArray(r, t) {
    if (self.Float64Array) {
        var a = new Float64Array(r);
        return a.set(t),
        a
    }
    for (var o = new Array(r), i = 0; i < r; i++)
        o[i] = t[i];
    return o
}
function copyHistogram(r) {
    return copyArray(HISTOGRAM_SIZE, r)
}
function getPixel(r, t, a) {
    var o = 4 * (t + a * r._width);
    return {
        r: r._data.data[o],
        g: r._data.data[o + 1],
        b: r._data.data[o + 2],
        a: r._data.data[o + 3]
    }
}
function ImageHarmonyMath() {}
function BitmapData(r, t, a) {
    this._data = r,
    this._width = t,
    this._height = a
}
ImageHarmonyMath.weight = function(r, t, a, o, i) {
    var n = ImageHarmonyMath.suppression(ImageHarmonyMath.colorfulness(r, t, a), o) * ImageHarmonyMath.suppression(a, i) * ImageHarmonyMath.tripleCubicSigmoid(t, 0, 30) * ImageHarmonyMath.tripleCubicSigmoid(a, 0, 30);
    return n < .001 ? .001 : n
}
,
ImageHarmonyMath.colorfulness = function(r, t, a) {
    var o = color.rgbToLab(color.hsvToRgb({
        h: r / 255,
        s: t / 255,
        v: a / 255
    }))
      , i = 2 * o.a - 1
      , n = 2 * o.b - 1;
    return 255 * Math.sqrt(.5 * (i * i + n * n))
}
,
ImageHarmonyMath.tripleCubicSigmoid = function(r, t, a) {
    var o = a - t;
    return o > 0 ? ImageHarmonyMath.cubicSigmoid((r - t) / o) : 1
}
,
ImageHarmonyMath.suppression = function(r, t) {
    t < 0 && (t *= -1,
    r = 255 - r);
    var a = r / 255
      , o = t < .5 ? 2 * t : 1
      , i = t < .5 ? 0 : 2 * t - 1;
    return Math.pow(o * ImageHarmonyMath.cubicSigmoid(a) + (1 - o), 1 + 3 * i)
}
,
ImageHarmonyMath.cubicSigmoid = function(r) {
    if (r < 0)
        return 0;
    if (r > 1)
        return 1;
    var t = 2 * r - 1;
    return .5 * (1 + t * (1.5 - .5 * t * t))
}
,
ImageHarmonyMath.hsvToLab = function(r) {
    hsv = r.hsv,
    r.rgb = color.hsvToRgb({
        h: hsv.h,
        s: hsv.s,
        v: hsv.v
    }),
    (lab = color.rgbToLab(r.rgb)).l *= 255,
    lab.a *= 255,
    lab.b *= 255,
    r.gregLab = lab
}
,
ImageHarmonyMath.weightedDistanceLab = function(r, t, a, o) {
    r.gregLab || ImageHarmonyMath.hsvToLab(r),
    t.gregLab || ImageHarmonyMath.hsvToLab(t),
    l1 = r.gregLab.l,
    l2 = t.gregLab.l,
    a1 = r.gregLab.a,
    a2 = t.gregLab.a,
    b1 = r.gregLab.b,
    b2 = t.gregLab.b;
    var i = l1 - l2
      , n = a1 - a2
      , e = b1 - b2
      , s = Math.sqrt(a1 * a1 + b1 * b1) - Math.sqrt(a2 * a2 + b2 * b2)
      , h = s * s
      , g = n * n + e * e - h;
    return Math.sqrt(a * i * i + o * h + g)
}
;
var hardCoreEnergy, d, epsilon = 1e-10, practicallyInfiniteEnergy = 179769e300;
function intersectionEnergy(r, t, a, o, i, n) {
    return r.density < epsilon || t.density < epsilon ? practicallyInfiniteEnergy : (d = ImageHarmonyMath.weightedDistanceLab(r.color, t.color, i, n),
    hardCoreEnergy = d < a ? practicallyInfiniteEnergy : 0,
    d < a ? hardCoreEnergy * (1 - d / a) : o * (1 / d - 1 / a))
}
function HarmonyPoint(r, t) {
    this.color = r,
    this.density = t
}
function ColorStyle(r) {
    var t, a;
    switch (r.toLowerCase()) {
    case "bright":
        t = .88,
        a = .75;
        break;
    case "dark":
        t = -.8,
        a = -.8;
        break;
    case "muted":
        t = -.8,
        a = .6;
        break;
    case "deep":
        t = .6,
        a = -.7;
        break;
    case "colorful":
    default:
        t = .5,
        a = 0;
        break;
    case "blank":
        t = 0,
        a = 0
    }
    this.gHH = 1,
    this.gSS = .23,
    this.gBB = .04,
    this.colorRepulsion = 2.5,
    this.hardCoreInteractionRadius = 4,
    this.saturationScaleFactor = 1,
    this.style = r,
    this.colorfulnessEnhancement = t,
    this.shadowHighlightSuppression = a
}
function ImageHarmony() {
    this._colors = [],
    this.points = [],
    this.finalColor = [],
    this._numColors = null,
    this._xMultiplier = 1,
    this._yMultiplier = 1,
    this._xOffset = 0,
    this._yOffset = 0,
    this._harmonyPoints = []
}
function extractColorFromImage(r, t, a, o, i) {
    var n = new ImageHarmony
      , e = new BitmapData(r,t,a)
      , s = new ColorStyle(i);
    return n.extractColors(e, s, o),
    {
        finalColor: n.finalColor,
        points: n.points
    }
}
function findPixels(r, t) {
    var a = new ImageHarmony;
    a._bitmapData = new BitmapData(r,r.width,r.height);
    var o = [];
    return t.forEach((function(r) {
        o.push(a.findPixel(r))
    }
    )),
    o
}
HarmonyPoint.harmonyPointsSort = function(r, t) {
    var a = r.color.hsv
      , o = t.color.hsv;
    return a.h > o.h ? -1 : a.h < o.h ? 1 : a.s > o.s ? -1 : a.s < o.s ? 1 : a.v > o.v ? -1 : a.v < o.v ? 1 : 0
}
,
ImageHarmony.prototype.extractColors = function(r, t, a) {
    this._bitmapData = r,
    this._colorStyle = t,
    this._numColors = a,
    this.synchronousExtract()
}
,
ImageHarmony.prototype.synchronousExtract = function() {
    this.clearHistogram(),
    this.generateHistogram(),
    this.weightAndNormalizeHistogram(),
    this.findBestColors(),
    this.findBestPoints()
}
,
ImageHarmony.prototype.clearHistogram = function() {
    this._histogram = emptyArray(HISTOGRAM_SIZE)
}
,
ImageHarmony.prototype.generateHistogram = function() {
    var r, t, a, o, i, n, e, s = this._bitmapData, h = this._yOffset, g = this._xOffset, c = this._yMultiplier, l = this._xMultiplier, m = 255 / 256 * NUM_BINS_H, u = 255 / 256 * NUM_BINS_S, b = 255 / 256 * NUM_BINS_V, y = this._bitmapData._width, _ = this._bitmapData._height, f = this._histogram || emptyArray(HISTOGRAM_SIZE);
    for (n = h; n < _; n += c)
        for (i = g; i < y; i += l)
            (e = getPixel(s, i, n)).r /= 255,
            e.g /= 255,
            e.b /= 255,
            r = ~~((o = color.rgbToHsv(e)).h * m),
            t = ~~(o.s * u),
            a = ~~(o.v * b),
            f[(r * NUM_BINS_S + t) * NUM_BINS_V + a]++;
    this._histogram = f
}
,
ImageHarmony.prototype.weightAndNormalizeHistogram = function() {
    this._numColors,
    this.weightAndNormalize().volume
}
,
ImageHarmony.prototype.weightAndNormalize = function() {
    var r, t, a, o, i, n, e, s = this._colorStyle.colorfulnessEnhancement, h = this._colorStyle.shadowHighlightSuppression, g = copyHistogram(this._histogram), c = 0, l = NUM_BINS_H, m = NUM_BINS_S, u = NUM_BINS_V;
    for (t = 0; t < l; t++)
        for ((i = ~~((256 * t + l / 2) / l)) > 255 && (i = 255),
        a = 0; a < m; a++)
            for ((n = ~~((256 * a + m / 2) / m)) > 255 && (n = 255),
            o = 0; o < u; o++)
                0 !== g[(t * NUM_BINS_S + a) * NUM_BINS_V + o] && (e = ~~(256 * (o + .5) / u),
                (r = g[(t * NUM_BINS_S + a) * NUM_BINS_V + o] *= ImageHarmonyMath.weight(i, n, e, s, h)) > c && (c = r));
    var b, y, _ = .01, f = c > _ ? Math.log(c / _) : 0, p = 0;
    if (f > 0)
        for (t = 0; t < l; t++)
            for (a = 0; a < m; a++)
                for (o = 0; o < u; o++)
                    0 !== g[b = (t * NUM_BINS_S + a) * NUM_BINS_V + o] && (0 !== (y = (r = g[b]) > _ ? Math.log(r / _) / f : 0) && p++,
                    g[b] = y);
    return this._weightedHistogram = g,
    {
        volume: p
    }
}
,
ImageHarmony.prototype.findBestColors = function() {
    var r, t, a, o, i, n, e = this._colorStyle, s = this._numColors, h = this._weightedHistogram, g = NUM_BINS_H, c = NUM_BINS_S, l = NUM_BINS_V, m = [];
    for (r = 0; r < g; r++)
        for (o = ~~(1.411 * ~~((256 * r + g / 2) / g)),
        t = 0; t < c; t++)
            for ((i = ~~((256 * t + c / 2) / c * .392)) > 100 && (i = 100),
            a = 0; a < l; a++)
                0 !== h[(r * NUM_BINS_S + t) * NUM_BINS_V + a] && (n = {
                    hsv: {
                        h: o / 360,
                        s: i / 100,
                        v: ~~(256 * (a + .5) / l * .392) / 100
                    }
                },
                m.push(new HarmonyPoint(n,h[(r * NUM_BINS_S + t) * NUM_BINS_V + a])));
    var u, b, y, _, f, p, v = e.hardCoreInteractionRadius, M = e.colorRepulsion, I = e.gBB, S = e.gSS, d = [];
    for (u = 0; u < s; u++) {
        for (_ = Math.pow(10, 100),
        b = 0; b < m.length; b++) {
            for (f = 1 - m[b].density,
            y = 0; y < d.length; y++)
                f += intersectionEnergy(m[b], d[y], v, M, I, S);
            f < _ && (_ = f,
            p = m[b])
        }
        d.push(p)
    }
    this._harmonyPoints = d
}
,
ImageHarmony.prototype.findBestPoints = function() {
    var r = this._harmonyPoints;
    r.sort(HarmonyPoint.harmonyPointsSort);
    for (var t = 0; t < r.length; t++)
        this._colors.push(r[t].color),
        this.points.push(this.findPixel(this._colors[t]));
    this.finalColor = this._colors
}
,
ImageHarmony.prototype.findPixel = function(r) {
    for (var t = this._bitmapData, a = this._bitmapData._width, o = this._bitmapData._height, i = 255 * r.rgb.r, n = 255 * r.rgb.g, e = 255 * r.rgb.b, s = 179769e300, h = 0, g = 0, c = !1, l = 0; !c && l < o; l++)
        for (var m = 0; !c && m < a; m++) {
            var u = getPixel(t, m, l)
              , b = u.r - i
              , y = u.g - n
              , _ = u.b - e
              , f = b * b + y * y + _ * _;
            f < s && (h = m,
            g = l,
            s = f,
            f <= 12 && (c = !0))
        }
    return {
        x: h,
        y: g
    }
}
;
