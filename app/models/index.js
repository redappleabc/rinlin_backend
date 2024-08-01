const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  dbConfig.DB, 
  dbConfig.USER, 
  dbConfig.PASSWORD, 
  {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect, 
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require('./user.model.js')(sequelize, Sequelize);
db.group = require('./group.model.js')(sequelize, Sequelize);
db.record = require('./record.model.js')(sequelize, Sequelize);
db.block = require('./block.model.js')(sequelize, Sequelize);
db.matching = require('./matching.model.js')(sequelize, Sequelize);
db.request = require('./request.model.js')(sequelize, Sequelize);
db.category = require('./category.model.js')(sequelize, Sequelize);
db.like = require('./like.model.js')(sequelize, Sequelize);
db.message = require('./message.model.js')(sequelize, Sequelize);
db.post = require('./post.model.js')(sequelize, Sequelize);
db.verify = require('./verify.model.js')(sequelize, Sequelize);
db.planbuyhistory = require('./planbuyhistory.model.js')(sequelize, Sequelize);
db.pointbuyhistory = require('./pointbuyhistory.model.js')(sequelize, Sequelize);
db.notification = require('./notification.model.js')(sequelize, Sequelize);

//associations
db.user.belongsToMany(db.group, { through: 'user_group' });
db.group.belongsToMany(db.user, { through: 'user_group' });

db.group.belongsTo(db.category);

db.user.hasMany(db.like);

db.user.hasMany(db.post);
db.post.belongsToMany(db.message, { through: 'post_message' });
db.message.belongsToMany(db.post, { through: 'post_message' });

db.user.hasMany(db.block);

db.user.hasMany(db.record);

db.user.hasMany(db.planbuyhistory);
db.user.hasMany(db.pointbuyhistory);

// db.user.belongsToMany(db.introduction, { through: 'user_introduction' });
// db.introduction.belongsToMany(db.user, { through: 'user_introduction' });

// db.item.belongsToMany(db.tab, { through: 'item_tab' });
// db.tab.belongsToMany(db.item, { through: 'item_tab' });

// db.item.belongsTo(db.category);
// db.statehistory.belongsTo(db.user);

// db.user.hasMany(db.like);
// db.like.belongsTo(db.item);

// db.user.hasMany(db.play);
// db.play.belongsTo(db.item);

// db.user.hasMany(db.download);
// db.download.belongsTo(db.item);

// db.user.hasMany(db.give);
// db.give.belongsTo(db.item);


module.exports = db;
