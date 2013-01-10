
function type(x) {
    var m = /^\[object ([0-9A-Za-z_]+)\]$/.exec(Object.prototype.toString.call(x));
    if (m)
        return m[1];
}

function rarr(x, times) {
    var out = [];
    for (var i = 0; i < times; ++i)
        out.push(x)
    return out;
}

function rstr(x, times) {
    return rarr(x, times).join("");
}

/*
 * each(doc.body.children, function() { return this.tagName }, String.prototype.toLowerCase)
 * 
 */
function each() {
    if (arguments[0] === undefined || arguments[0] === null)
        return arguments[0];
    var data = arguments[0],
        t = type(data)
        numArgs = arguments.length;
    if (t == "Array" || t == "HTMLCollection" || t == "NodeList") {
        for (var arg = 1; arg < numArgs; ++arg) {
            var out = [];
            for (var index = 0; index < data.length; ++index)
                out.push(arguments[arg].call(data[index], data[index], index, index));
            data = out;
        }
    } else if (t == "Boolean" || t == "Number" || t == "String") {
        for (var arg = 1; arg < numArgs; ++arg)
            data = arguments[arg].call(data, undefined, 0);
    } else {
        for (var arg = 1; arg < numArgs; ++arg) {
            var out = {}, index = 0;
            for (var key in data)
                out[key] = arguments[arg].call(data[key], data[key], key, index++);
            data = out;
        }
    }
    return data;
}
