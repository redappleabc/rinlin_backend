module.exports = (sequelize, Sequelize) => {
  const Matching = sequelize.define("matching", {
    maleId: {
      type: Sequelize.INTEGER,
    },
    femaleId:{
      type: Sequelize.INTEGER,
    }
  });
  
  return Matching;
};
