

module.exports.getPlainObject = function(obj) {
    delete obj.dataValues.createdAt;
    delete obj.dataValues.updatedAt;
    delete obj.dataValues.deletedAt;
    return obj;
}

module.exports.clone = function(obj) {
    return JSON.parse(JSON.stringify(obj));
}

module.exports.clean = function(keepParameters) {
    return (obj) => {
        for(var param in obj.dataValues) {
            var inKeepParametes = false;
            for(var i in keepParameters) {
                if(keepParameters[i] == param)
                    inKeepParametes = true;
            }
            if(!inKeepParametes)
                delete obj.dataValues[param]
        }
        return obj.dataValues;
    }
}