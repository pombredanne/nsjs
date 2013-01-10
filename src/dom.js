
window.doc = window.document;

function id(x) {
    return doc.getElementById(x);
}

function tag(tagName, parent) {
    if (parent == null)
        parent = doc;
    return parent.getElementsByTagName(tagName);
}

if (doc.getElementsByClassName) {

    window.cls = function(classNames, parent) {
        if (parent == null)
            parent = doc;
        return parent.getElementsByClassName(classNames);
    }

} else {
    
    window.cls = function(classNames, parent) {
        if (parent == null)
            parent = doc;
        var patterns = each(classNames.trim().split(/\s+/), function() {
            return new RegExp("\\b" + classNames + "\\b");
        });
        var allElements = parent.getElementsByTagName("*"),
            elements = [];
        for (var i = 0; i < allElements.length; ++i) {
            var klass = allElements[i].getAttribute("class"),
                match = true;
            if (klass != null && klass.length >= 0) {
                for (var p = 0; p < patterns.length; ++p) {
                    if (!patterns[p].test(klass))
                        match = false;
                        break;
                }
                if (match)
                    elements.push(allElements[i]);
            }
        }
        return elements;
    }
    
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
    var elements = cls(x, this.parentElement);
    for (var i = 0; i < elements.length; ++i) {
        if (elements[i] === this)
            return true;
    }
    return false;
}
Element.prototype.hasClass = hasClass;
