module.exports = (sequelize, Sequelize) => {
    return sequelize.define("user", {
        username: {
            type: Sequelize.STRING,
            allowNull: false
        },
        email: {
            type: Sequelize.STRING
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false
        }
    },{  
        paranoid: true,
        freezeTableName: true,
        indexes: [
            {
              unique: true,
              fields: ["username"]
            }
          ]
    });
  };