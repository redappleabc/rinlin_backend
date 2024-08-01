module.exports = (sequelize, Sequelize) => {
  const Verify = sequelize.define("verify", {
    userId:{
      type: Sequelize.INTEGER,
    },
    photoType:{
      type: Sequelize.STRING,
    },
    photo: {
      type: Sequelize.STRING,
    },
    state:{
      type: Sequelize.STRING,
    }
  });

  return Verify;
};
