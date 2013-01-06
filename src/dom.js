
window.doc = window.document;

function $(i) {
    return doc.getElementById(i);
}

function $N(i) {
    return doc.getElementsByName(i);
}

function $T(t) {
    return doc.getElementsByTagName(t);
}


/*
 * Create a text node
 * (alias for document.createTextNode)
 */
function text(t) {
    return doc.createTextNode(t)
}

function elem(tag, attrs) {
    var e = doc.createElement(tag);
    for (var key in attrs)
        e.setAttribute(key, attrs[key]);
    return e;
}

function build(obj, cls) {
    var attrs = (cls === undefined) ? {} : {"class": cls};
    if (type(obj) == "Object") {
        var e = elem("div", attrs);
        for (var key in obj)
            e.put(build(obj[key], key));
        return e;
    } else if (type(obj) == "Array") {
        var e = elem("ol", attrs);
        for (var i = 0; i < obj.length; ++i) {
            var li = elem("li");
            li.put(build(obj[i]));
            e.put(li)
        }
        return e;
    } else {
        var e = elem("span", attrs);
        e.write(obj)
        return e;
    }
}

function put() {
    var parent = (this === window) ? doc.body : this;
    for (var i = 0; i < arguments.length; ++i)
        parent.appendChild(arguments[i]);
}
Element.prototype.put = put;

function write() {
    for (var i = 0; i < arguments.length; ++i)
        put.call(this, text(arguments[i]));
}
Element.prototype.write = write;

function writeln() {
    write.apply(this, arguments);
    put.call(this, elem("br"));
}
Element.prototype.writeln = writeln;

function walk(f) {
    var obj = (this === window) ? doc.documentElement : this;
    f.call(obj);
    if("children" in obj) {
        for(var i = 0; i < obj.children.length; ++i)
            obj.children[i].walk(f);
    }
}
Element.prototype.walk = walk;

function hasClass(x) {
    var k = this.getAttribute("class");
    if (k == null)
        return false;
    k = k.split(" ")
    for (var i = 0; i < k.length; ++i) {
        if (k == x)
            return true;
    }
    return false;
}
Element.prototype.hasClass = hasClass;

