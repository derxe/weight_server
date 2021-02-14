var { authJwt, validator, weight:weightMid } = require("../middleware"); 

module.exports = app => {
  const weight = require("../controllers/weight.controller.js");

  var router = require("express").Router();

  // Create a new Weight
  router.post("/", [validator.weights()], weight.bulkCreate);

  // create a new weights in short format 
  router.post("/short", [weightMid.expandWeights], weight.bulkCreate);

  // Retrieve all Weight
  router.get("/", [[authJwt.verifyToken]], weight.findAll);

  // Retrieve a single Weights with id
  router.get("/:id", authJwt.verifyToken, weight.findOne);

  app.use("/api/weights", authJwt.verifyToken, router);
};
