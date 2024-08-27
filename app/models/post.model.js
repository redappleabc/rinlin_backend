module.exports = (sequelize, Sequelize) => {
  const Post = sequelize.define("post", {
    image: {
      type: Sequelize.STRING,
    },
    description: {
      type: Sequelize.TEXT,
    },
    newMessageCount: {
      type: Sequelize.INTEGER
    }
  });

  return Post;
};
