const db = require("../models");
const Weight = db.weight;
const Op = db.Sequelize.Op;
const moment = require("moment");
const { helper } = require("../middleware");
const { validationResult } = require('express-validator');
const { weights } = require("../middleware/validator");

weightReturnParams = ["weight", "timestamp_id", "updatedLocal"];
var cleanParams = function(data) {
  if(Array.isArray(data)) 
    return data.map(helper.clean(weightReturnParams));
  else
    return helper.clean(weightReturnParams)
}

exports.bulkCreate = (req, res) => {
  console.log("$$$ bulk creating")
  var errors  = validationResult(req);
  if(!errors.isEmpty()) {
    res.status(400).send({ errors: errors.array() });
    return;
  }

  var weights = req.body;
  // add user id to every wieght
  for(var i in weights) {
    var weight = weights[i];
    if(!weight.timestamp_id)
      weight.timestamp_id = new Date(weight.timestamp).getTime();
    weight.user_id = req.userId;
  }

  Weight.bulkCreate(weights, {
    updateOnDuplicate: ["weight", "updatedLocal", "updatedAt"] 
  }).then(data => {
    var response = { num_updated: data.length }
    
    if(data.length > 0) {
      var updatedAt = data[0].updatedAt;
      response.updatedAt = {
        timestamp: updatedAt.getTime(),
        iso: updatedAt.toISOString()
      }
    }
    res.send([response]);
  }).catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while creating weights."
    });
  });
};


// Find a single Weight with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Weight.findByPk(id)
    .then(data => {
      res.send(cleanParams(data));
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving weight with id=" + id
      });
    });
};

exports.findAll = (req, res) => {
  console.log("$$$ find all")

  var where = { user_id: req.userId };

  // add after into where paratmer if it is sen in the query
  // you can define after in "2021-02-07T15:41:06" fromat
  // or unix_after in unix fromat 1581086466000 
  if(req.query.after || req.query.unix_after) {
    var after = moment(req.query.after);
    if(!req.query.after) after = moment(req.query.unix_after, 'x'); 

    if(!after.isValid()) {
      res.status(400).send({ message: "After date is not valid. " + after });
      return;
    }
    where.updatedAt = { [Op.gt]: after }
  }

  Weight.findAll({ where })
    .then(data => {
      res.send(cleanParams(data));
    })
    .catch(err => {
      res.status(500).send({       
         message:
          err.message || "Some error occurred while retrieving weights."
      });
    });
};
