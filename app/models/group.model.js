module.exports = (sequelize, Sequelize) => {
  const Group = sequelize.define("group", {
    name: {
      type: Sequelize.STRING,
    },
    image: {
      type: Sequelize.STRING,
    },
    members: {
      type: Sequelize.INTEGER,
    }
  });

  return Group;
};
