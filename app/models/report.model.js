module.exports = (sequelize, Sequelize) => {
  const Report = sequelize.define("report", {
    reporterId:{
      type: Sequelize.INTEGER,
    },
    violatorId:{
      type: Sequelize.INTEGER,
    },
  });

  return Report;
};
