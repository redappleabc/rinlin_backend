module.exports = (sequelize, Sequelize) => {
  const Block = sequelize.define("block", {
    blockedUserId: {
      type: Sequelize.INTEGER,
    }
  });

  return Block;
};
