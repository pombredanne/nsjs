
function code(x, lang) {

    function PythonHighlighter() {
        var s = "",
            z = /(#|\\"|"""|"|\\'|'''|'|\r|\n)/gm,
            no = /^(0\.[0-9]+j?|0j?|-?[1-9][0-9]*\.[0-9]+j?|-?[1-9][0-9]*j?)$/gim,
            kw = /^(False|None|True|and|as|assert|break|class|continue|def|del|elif|else|except|finally|for|from|global|if|import|in|is|lambda|nonlocal|not|or|pass|raise|return|try|while|with|yield)$/,
            fn = /^(abs|all|any|ascii|bin|bool|bytearray|bytes|callable|chr|@?classmethod|compile|complex|delattr|dict|dir|divmod|enumerate|eval|exec|filter|float|format|frozenset|getattr|globals|hasattr|hash|help|hex|id|input|int|isinstance|issubclass|iter|len|list|locals|map|max|memoryview|min|next|object|oct|open|ord|pow|print|@?property|range|repr|reversed|round|set|setattr|slice|sorted|@?staticmethod|str|sum|super|tuple|type|vars|zip|__import__)$/;
        this.highlight = function(code) {
            var out = [];
            if (s != "")
                out.push('<span class="string">');
            code = code.split(z);
            while (code.length > 0) {
                var c = code.shift();
                if (s != "") {
                    out.push(c);
                    if (c == s) {
                        out.push('</span>');
                        s = "";
                    }
                } else {
                    if (c == "#") {
                        out.push('<span class="comment">');
                        out.push(c);
                        while (code.length > 0 && code[0] != "\r" && code[0] != "\n")
                            out.push(code.shift());
                        out.push(code.shift());
                        out.push('</span>');
                    } else if (c[0] == "'" | c[0] == '"') {
                        out.push('<span class="string">');
                        out.push(c);
                        s = c;
                    } else {
                        c = c.split(/(@?[A-Z_][0-9A-Z_]*|0\.[0-9]+j?|0j?|-?[1-9][0-9]*\.[0-9]+j?|-?[1-9][0-9]*j?)/gim);
                        var decl = false;
                        while (c.length > 0) {
                            var d = c.shift();
                            if (d.trim() != "" && decl) {
                                out.push('<span class="declaration">');
                                out.push(d);
                                out.push('</span>');
                                decl = false;
                            } else if (no.test(d)) {
                                out.push('<span class="number">');
                                out.push(d);
                                out.push('</span>');
                            } else if (kw.test(d)) {
                                out.push('<span class="keyword">');
                                out.push(d);
                                out.push('</span>');
                                if (d == "class" || d == "def") decl = true;
                            } else if (fn.test(d)) {
                                out.push('<span class="function">');
                                out.push(d);
                                out.push('</span>');
                            } else {
                                out.push(d)
                            }
                        }
                    }
                }
            }
            if (s != "") {
                out.push('</span>');
            }
            return out.join("");
        }
    }
    
    if (lang == "python") {
        var hi = new PythonHighlighter();
    } else {
        throw "Unsupported language: " + lang;
    }
    
    x.walk(function() {
        if (this.tagName == "CODE")
            this.innerHTML = hi.highlight(this.textContent);
    });
    
}

