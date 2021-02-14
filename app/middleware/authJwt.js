const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const User = require("../models").user;


module.exports.verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];
  if (!token) {
    return res.status(401).send({
      message: "No auth token provided!"
    });
  }

  jwt.verify(token, config.secret, async (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!",
        error: err,
      });
    } else {

      var user = await User.findOne({
        where: { id: decoded.id }
      });
      if (!user) {
        return res.status(401).send({
          message: "Unauthorized!",
          error: "The token is not valid: user doesn't exists",
        });
      }

      req.userId = decoded.id;
      next();
    }
  });
};
