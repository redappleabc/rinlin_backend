module.exports = (sequelize, Sequelize) => {
  const Category = sequelize.define("category", {
    name: {
      type: Sequelize.STRING,
    },
    order:{
      type: Sequelize.INTEGER,
    }
  });

  return Category;
};
