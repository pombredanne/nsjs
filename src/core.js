
/*
 * Doubles up as map and foreach construct
 */
function each(iterable, func) {
    var t = type(iterable),
        out = [];
    if (t == "Array" || t == "HTMLCollection" || t == "NodeList") {
        for (var i = 0; i < iterable.length; ++i)
            out.push(func.call(this, iterable[i], i, i));
    } else {
        var i = 0;
        for (var k in iterable) {
            out.push(func.call(this, iterable[k], k, i));
            i++;
        }
    }
    return out;
}

function hex(x) {
    if (x == 0)
        return "0";
    if (x < 0)
        return "-" + hex(-x);
    var h = "";
    while (x > 0) {
        h = "0123456789ABCDEF".charAt(x % 16) + h;
        x = Math.floor(x / 16);
    }
    return h;
}

function mod(p, q) {
    while (p < 0)
        p += q
    return p % q
}

function type(x) {
    var m = /^\[object ([0-9A-Za-z_]+)\]$/.exec(Object.prototype.toString.call(x));
    if (m)
        return m[1];
}

function zfill(s, width) {
    while (s.length < width)
        s = "0" + s
    return s
}

