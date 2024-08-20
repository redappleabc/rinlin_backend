module.exports = (sequelize, Sequelize) => {
  const Request = sequelize.define("request", {
    userId: {
      type: Sequelize.INTEGER,
    },
    partnerId: {
      type: Sequelize.INTEGER,
    },
    state: {
      type: Sequelize.STRING,
    },
    answer: {
      type: Sequelize.TEXT,
    }
  });

  return Request;
};
