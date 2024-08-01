module.exports = (sequelize, Sequelize) => {
  const Message = sequelize.define("message", {
    senderId: {
      type: Sequelize.INTEGER,
    },
    content: {
      type: Sequelize.TEXT,
    },
  });

  return Message;
};
