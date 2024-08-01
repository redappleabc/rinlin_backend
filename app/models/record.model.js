module.exports = (sequelize, Sequelize) => {
  const Record = sequelize.define("record", {
    visiterId: {
      type: Sequelize.INTEGER,
    }
  });

  return Record;
};
