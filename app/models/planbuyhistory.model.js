module.exports = (sequelize, Sequelize) => {
  const PlanBuyHistory = sequelize.define("planbuyhistory", {
    status: {
      type: Sequelize.STRING,
    },
    amount: {
      type: Sequelize.INTEGER,
    },
    startDate: {
      type: Sequelize.DATE,
    },
    endDate: {
      type: Sequelize.DATE,
    }

  });

  return PlanBuyHistory;
};
