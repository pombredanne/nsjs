
function cyc(p, q) {
    return p < 0 ?
           (p % q + q) % q :
           p % q;
}

function range(start, stop, step) {
    var out = [];
    if (step === undefined)
        step = 1;
    if (stop === undefined) {
        stop = start;
        start = 0;
    }
    for (var i = start; i < stop; i += step)
        out.push(i)
    return out;
}

function sign(x) {
    if (arguments[0] === undefined || arguments[0] === null)
        return arguments[0];
    if (x == 0)
        return 0;
    return x < 0 ? -1 : 1;
}