module.exports = (sequelize, Sequelize) => {
  const PointBuyHistory = sequelize.define("pointbuyhistory", {
    amount: {
      type: Sequelize.INTEGER,
    },
    pointCount: {
      type: Sequelize.INTEGER,
    }
  });

  return PointBuyHistory;
};
