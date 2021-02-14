const dbConfig = require("../config/db.config.js");
var bcrypt = require("bcryptjs");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  port: dbConfig.PORT, 
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("./user.model.js")(sequelize, Sequelize);
db.weight = require("./weight.model.js")(sequelize, Sequelize);


db.setDefaultValues = () => {
  db.user.bulkCreate([
    { username: 'user1', password: bcrypt.hashSync("123", 8) },
    { username: 'user2', password: bcrypt.hashSync("123", 8) },
    { username: 'user3', password: bcrypt.hashSync("123", 8) },
    { username: 'user4', password: bcrypt.hashSync("123", 8) },
    { username: 'user5', password: bcrypt.hashSync("123", 8) }
  ])
}


module.exports = db;

