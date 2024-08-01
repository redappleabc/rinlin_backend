module.exports = (sequelize, Sequelize) => {
  const Notification = sequelize.define("notifiaction", {
    title: {
      type: Sequelize.STRING,
    },
    content: {
      type: Sequelize.TEXT,
    }
  });

  return Notification;
};
