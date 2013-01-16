
function code(x, lang) {
    
    var CYPHER_CHUNKS = /(\\\\|\/\*|\*\/|\/\/|\\"|"|\\'|'|\\`|`|\{[0-9A-Z_]+\}|\r|\n)/gim,
        CYPHER_TOKENS = /(create unique|is not|order by|[A-Z_][0-9A-Z_]*|={3,}|0\.[0-9]+|0|-?[1-9][0-9]*\.[0-9]+|-?[1-9][0-9]*|<?--+>?|<?-+\[|\]-+>?)/gi,
        CYPHER_VOCAB  = {
            "number":   /^(0\.[0-9]+|0|-?[1-9][0-9]*\.[0-9]+|-?[1-9][0-9]*)$/,
            "constant": /^(true|false|null)$/i,
            "pattern":  /^(<?--+>?|<?-+\[|\]-+>?)$/,
            "keyword":  /^(and|as|asc|create unique|create|delete|desc|distinct|in|is|is not|limit|match|or|order by|relate|return|set|skip|start|unique|where|with|={3,})$/i,
            "function": /^(abs|any|all|avg|coalesce|collect|count|extract|filter|foreach|has|head|id|last|left|length|lower|ltrim|max|min|node|nodes|none|not|percentile_cont|percentile_disc|range|reduce|rel|relationship|relationships|replace|right|round|rtrim|shortestPath|sign|single|sqrt|str|substring|sum|tail|trim|type|upper)$/i
        },
        
        EOL = /\r|\n|\r\n/m,
        
        COMMENT_SPAN   = '<span class="comment">',
        ESCAPED_SPAN   = '<span class="escaped">',
        PARAMETER_SPAN = '<span class="parameter">',
        STRING_SPAN    = '<span class="string">',
        END_SPAN       = '</span>';
    
    function push() {
        var args = Array.prototype.slice.call(arguments),
            array = args.shift();
        while (args.length > 0)
            array.push(args.shift());
    }
    
    /*
     * Repeatedly shift items from start of array `source` and push
     * onto end of array `sink`; end when marker `end` is found or when
     * `source` is empty, returning true or false respectively.
     */
    function shiftPushUntil(source, sink, end) {
        if (type(end) == "RegExp")
            var stop = function(x) {
                return x.match(end);
            }
        else
            var stop = function(x) {
                return x == end;
            }
        while (source.length > 0) {
            var x = source.shift();
            sink.push(x);
            if (stop(x))
                return true;
        }
        return false;
    }
    
    function CypherHighlighter() {
        
        var span = null;
        
        function continueSpan(span, source, sink) {
            var complete = shiftPushUntil(source, sink, span[1]);
            sink.push(END_SPAN);
            return complete ? null : span;
        }
        
        this.highlight = function(code) {
            var out = [], token;
            code = code.split(CYPHER_CHUNKS);
            if (span) {
                out.push(span[0]);
                span = continueSpan(span, code, out);
            }
            while (code.length > 0) {
                token = code.shift();
                if (token == "//") {
                    push(out, COMMENT_SPAN, token);
                    span = continueSpan([COMMENT_SPAN, EOL], code, out);
                } else if (token == "'" || token == '"') {
                    push(out, STRING_SPAN, token);
                    span = continueSpan([STRING_SPAN, token], code, out);
                } else if (token == "`") {
                    push(out, ESCAPED_SPAN, token);
                    span = continueSpan([ESCAPED_SPAN, token], code, out);
                } else if (token[0] == "{") {
                    push(out, PARAMETER_SPAN, token, END_SPAN);
                } else {
                    each(token.split(CYPHER_TOKENS), function() {
                        for(var key in CYPHER_VOCAB) {
                            if (CYPHER_VOCAB[key].test(this)) {
                                push(out, '<span class="', key, '">', this, END_SPAN);
                                return;
                            }
                        }
                        out.push(this);
                    });
                }
            }
            if (span)
                out.push(END_SPAN);
            return out.join("");
        }
        
    }
    
    function JavaScriptHighlighter() {
        var s = "",
            z = /(\\"|"|\\'|'|\/\*|\*\/|\/\/|\\\/|\/|\\\\|\r|\n)/gm,
            no = /^(0\.[0-9]+|0|-?[1-9][0-9]*\.[0-9]+|-?[1-9][0-9]*)$/gim,
            kw = /^(break|case|catch|class|continue|const|debugger|default|delete|do|else|enum|export|extends|finally|for|function|if|implements|import|in|instanceof|interface|let|new|package|private|protected|public|return|static|super|switch|this|throw|try|typeof|var|void|while|with|yield)$/,
            fn = /^(abs)$/;
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
                    if (c == "//") {
                        out.push('<span class="comment">');
                        out.push(c);
                        while (code.length > 0 && code[0] != "\r" && code[0] != "\n")
                            out.push(code.shift());
                        out.push(code.shift());
                        out.push('</span>');
                    } else if (c == "/*") {
                        out.push('<span class="comment">');
                        out.push(c);
                        s = "*/";
                    } else if (c == "'" | c == '"' | c == "/") {
                        out.push('<span class="string">');
                        out.push(c);
                        s = c;
                    } else {
                        c = c.split(/(@?[A-Z_][0-9A-Z_]*|0\.[0-9]+|0|-?[1-9][0-9]*\.[0-9]+|-?[1-9][0-9]*)/gim);
                        while (c.length > 0) {
                            var d = c.shift();
                            if (no.test(d)) {
                                out.push('<span class="number">');
                                out.push(d);
                                out.push('</span>');
                            } else if (kw.test(d)) {
                                out.push('<span class="keyword">');
                                out.push(d);
                                out.push('</span>');
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
    
    function PythonHighlighter() {
        var endMarker = "",
            z = /(#|\\"|"""|"|\\'|'''|'|\\\\|\r|\n)/gm,
            no = /^(0\.[0-9]+j?|0j?|-?[1-9][0-9]*\.[0-9]+j?|-?[1-9][0-9]*j?)$/gim,
            kw = /^(False|None|True|and|as|assert|break|class|continue|def|del|elif|else|except|finally|for|from|global|if|import|in|is|lambda|nonlocal|not|or|pass|raise|return|try|while|with|yield)$/,
            fn = /^(abs|all|any|ascii|bin|bool|bytearray|bytes|callable|chr|@?classmethod|compile|complex|delattr|dict|dir|divmod|enumerate|eval|exec|filter|float|format|frozenset|getattr|globals|hasattr|hash|help|hex|id|input|int|isinstance|issubclass|iter|len|list|locals|map|max|memoryview|min|next|object|oct|open|ord|pow|print|@?property|range|repr|reversed|round|set|setattr|slice|sorted|@?staticmethod|str|sum|super|tuple|type|vars|zip|__import__)$/;
        this.highlight = function(code) {
            var out = [];
            if (endMarker != "")
                out.push('<span class="string">');
            code = code.split(z);
            while (code.length > 0) {
                var c = code.shift();
                if (endMarker != "") {
                    out.push(c);
                    if (c == endMarker) {
                        out.push('</span>');
                        endMarker = "";
                    }
                } else if (c == "#") {
                    out.push('<span class="comment">');
                    out.push(c);
                    while (code.length > 0 && code[0] != "\r" && code[0] != "\n")
                        out.push(code.shift());
                    out.push(code.shift());
                    out.push('</span>');
                } else if (c[0] == "'" | c[0] == '"') {
                    out.push('<span class="string">');
                    out.push(c);
                    endMarker = c;
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
            if (endMarker != "")
                out.push('</span>');
            return out.join("");
        }
    }
    
    if (lang == "cypher") {
        var hi = new CypherHighlighter();
    } else if (lang == "javascript") {
        var hi = new JavaScriptHighlighter();
    } else if (lang == "python") {
        var hi = new PythonHighlighter();
    } else {
        throw "Unsupported language: " + lang;
    }
    
    x.walk(function() {
        if (this.tagName == "CODE")
            this.innerHTML = hi.highlight(this.textContent);
    });
    
}

