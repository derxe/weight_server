const helper = require("./helper");


module.exports.expandWeights = (req, res, next) => {
    console.log("$$$ expanding weights")
    var body = helper.clone(req.body);

    req.body = [];
    for(var timestamp in body) {
        var w = {
            weight: body[timestamp],
            timestamp: (new Date(timestamp*1)).toISOString(),
        };
        if(!w.timestamp) {
            res.status(500).send({ 
                message: "Unable to convert timestamp to string: " + timestamp 
            });
            res.end();
            return;
        }
        req.body.push(w)
    }
    next() 
};