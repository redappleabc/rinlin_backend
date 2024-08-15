module.exports = (sequelize, Sequelize) => {
  const TopGroupTitle = sequelize.define("topgrouptitle", {
    title:{
      type: Sequelize.STRING,
    }
  });

  return TopGroupTitle;
};
