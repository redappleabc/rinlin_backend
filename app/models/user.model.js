module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("user", {
    appleId: {
      type: Sequelize.STRING,
    },
    applePassword: {
      type: Sequelize.STRING,
    },
    lineId: {
      type: Sequelize.STRING,
    },
    linePassword: {
      type: Sequelize.STRING,
    },
    facebookId: {
      type: Sequelize.STRING,
    },
    facebookPassword: {
      type: Sequelize.STRING,
    },
    phoneNumber:{
      type: Sequelize.STRING,
    },
    phoneverifycode: {
      type: Sequelize.STRING
    },
    name: {
      type: Sequelize.STRING,
    },
    age: {
      type: Sequelize.INTEGER,
    },
    gender: {
      type:Sequelize.INTEGER,
    },
    prefectureId: {
      type:Sequelize.INTEGER,
    },
    height: {
      type: Sequelize.INTEGER,
    },
    bodyType: {
      type: Sequelize.INTEGER,
    },
    attitude: {
      type: Sequelize.INTEGER,
    },
    avatar1: {
      type: Sequelize.STRING,
    },
    avatar2: {
      type: Sequelize.STRING,
    },
    avatar3: {
      type: Sequelize.STRING,
    },
    avatar4: {
      type: Sequelize.STRING,
    },
    blood: {
      type: Sequelize.INTEGER,
    },
    birth: {
      type: Sequelize.INTEGER,
    },
    education: {
      type: Sequelize.INTEGER,
    },
    jobType: {
      type: Sequelize.INTEGER,
    },
    income: {
      type: Sequelize.INTEGER,
    },
    materialHistory: {
      type: Sequelize.INTEGER,
    },
    children: {
      type: Sequelize.INTEGER,
    },
    housework: {
      type: Sequelize.INTEGER,
    },
    hopemeet: {
      type: Sequelize.INTEGER,
    },
    datecost: {
      type: Sequelize.INTEGER,
    },
    holiday: {
      type: Sequelize.INTEGER,
    },
    roomate: {
      type: Sequelize.INTEGER,
    },
    alcohol: {
      type: Sequelize.INTEGER,
    },
    smoking: {
      type: Sequelize.INTEGER,
    },
    saving: {
      type: Sequelize.INTEGER,
    },
    introduce: {
      type: Sequelize.TEXT('long'),
    },
    favoriteImage: {
      type: Sequelize.STRING,
    },
    favoriteDescription: {
      type: Sequelize.STRING,
    },
    verifyed:{
      type:Sequelize.BOOLEAN
    },
    paied:{
      type:Sequelize.BOOLEAN
    },
    pointCount: {
      type: Sequelize.INTEGER
    },
    matchedUsers: {
      type: Sequelize.INTEGER
    },
    question1:{
      type: Sequelize.TEXT,
    },
    question2:{
      type: Sequelize.TEXT,
    },
    question3:{
      type: Sequelize.TEXT,
    },
    phrase1: {
      type: Sequelize.TEXT('long'),
    },
    phrase2: {
      type: Sequelize.TEXT('long'),
    },
    phrase3: {
      type: Sequelize.TEXT('long'),
    },
    deadline:{
      type:Sequelize.DATE
    },
  }
);

  return User;
};
