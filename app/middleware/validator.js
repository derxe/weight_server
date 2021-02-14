const db = require("../models");
const User = db.user;

const { body } = require('express-validator')

exports.userSingUp = () => {
  return [
    body('password').exists(),
    body('email', 'Invalid email').exists().isEmail(),
    body('username').exists().custom(username => {
      return userExists(username).then(exists => {
        if(exists) return Promise.reject("User already exists");
      })
    }),
  ]
}

exports.weights = () => {
  return [
    body().isArray(),
    //body('*.weight').exists().isNumeric(),
    body('*.timestamp_id').exists().isNumeric(),
  ]
}

exports.userSignIn = () => {
  return [
    body('password').exists(),
    body('username').exists()
  ]
}


var userExists = async (username) => {
  return User.findOne({
    where: { username }
  }).then(user => !!user);
};

