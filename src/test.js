
/*
 * test(function, returns, whenGiven)
 */
function test() {
    var args = Array.prototype.slice.call(arguments),
        func = args.shift(),
        expected = args.shift();
    var argsText = [];
    for (var i = 0; i < args.length; ++i) {
        try {
            argsText.push(JSON.stringify(args[i]));
        } catch (e) {
            argsText.push("" + args[i]);
        }
    }
    var result = {"function": func.name, "arguments": argsText.join(",")};
    result["actual"] = func.apply(undefined, args);
    if (type(expected) == "Function") {
        result["pass"] = expected(result["actual"]);
    } else if (result["actual"] == expected || (result["actual"] === NaN && expected === NaN)) {
        result["pass"] = true;
    } else {
        result["pass"] = false;
    }
    return build(result, "result");
}

function tests() {
    var argss = Array.prototype.slice.call(arguments),
        func = argss.shift();
    var results = elem("div", {"class": "results"});
    results.put(
        build("function", "header"),
        build("arguments", "header"),
        build("result", "header"),
        build("pass", "header")
    );
    for (var i = 0; i < argss.length; ++i) {
        var args = argss[i];
        args.unshift(func);
        results.put(test.apply(null, args));
    }
    return results;
}

