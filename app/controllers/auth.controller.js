const db = require("../models");
const config = require("../config/auth.config");
const { helper } = require("../middleware");
const { validationResult } = require('express-validator');
const User = db.user;
const Role = db.role;

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

var getJWTToken =  function(userId) {
  return jwt.sign({ id: userId }, config.secret, {
    expiresIn: 60*60*24*2 // 2 days
  });
}
exports.getJWTToken = getJWTToken;

exports.signup = (req, res) => {
  var errors  = validationResult(req);
  if(!errors.isEmpty()) {
    res.status(400).send({ errors: errors.array() });
    return;
  }

  const user = {
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8)
  }

  // Save User to Database
  User.create(user)
    .then(user => {
      res.send({ 
        message: "User registered successfully!",
        user: user,
        accessToken: getJWTToken(user.id),
      });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.signin = async (req, res, next) => {
  var errors  = validationResult(req);
  if(!errors.isEmpty()) {
    res.status(400).send({ errors: errors.array() });
    return;
  }

  var user = await User.findOne({
    where: { username: req.body.username }
  })

  if (!user) {
    return res.status(404).send({ message: "User Not found." });
  }

  var passwordIsValid = bcrypt.compareSync(
    req.body.password,
    user.password
  );

  if (!passwordIsValid) {
    return res.status(401).send({
      accessToken: null,
      message: "Invalid Password!"
    });
  }

  res.status(200).send({
    id: user.id,
    username: user.username,
    email: user.email,
    accessToken: getJWTToken(user.id)
  });
};
