module.exports = (sequelize, Sequelize) => {
  const Like = sequelize.define("like", {
    received_id: {
      type: Sequelize.INTEGER,
    },
    message: {
      type: Sequelize.TEXT,
    },
  });

  return Like;
};
