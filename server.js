const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const morgan = require("morgan");

process.env['DEBUG'] = '';

app.use(morgan('dev'))
// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
 

const dbFullReset = true;
const db = require("./app/models");
db.sequelize.sync({ force: dbFullReset }).then(() => {
  if(dbFullReset) db.setDefaultValues()
}).catch((error) => {
  console.error(error)
  console.error("Unable to connect to the database. Exiting application.")
  process.exit(1)
});



// simple route
var { authJwt } = require("./app/middleware"); 
app.get("/", authJwt.verifyToken, (req, res) => {
  res.json({ message: "Welcome to weight application." });
});

require("./app/routes/weight.routes")(app);
require('./app/routes/auth.routes')(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}.`);
});
