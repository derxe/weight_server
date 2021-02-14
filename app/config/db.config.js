module.exports = {
  dialect: "postgres",
  HOST: "localhost",
  USER: "wtrack",
  PORT: 30307,
  PASSWORD: "padakrboane",
  DB: "weight_tracker",
  pool: { // used for Sequelize connection pool configuration:
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};
