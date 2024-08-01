module.exports = (sequelize, Sequelize) => {
  const Post = sequelize.define("post", {
    image: {
      type: Sequelize.STRING,
    },
    description: {
      type: Sequelize.TEXT,
    },
  });

  return Post;
};
