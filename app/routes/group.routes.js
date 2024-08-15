
const auth = require("../middleware/auth.js");

module.exports = app => {
  const group = require("../controllers/group.controller.js");
  
  var router = require("express").Router();

  // Retrieve all campaigns
  router.get('/getallgroups', auth, group.getAllGroup);
  router.get('/getallcategories', auth, group.getAllCategories);
  router.post('/save_groups', auth, group.saveGroups);
  router.delete('/remove_groups', auth, group.removeGroups);
  router.get('/get_topgroups', auth, group.getTopGroups);
  router.get('/get_allswipegroups', auth, group.getAllSwipeGroups);
  router.get('/get_groupusers', auth, group.getGroupUsers);
  router.get('/checkmember', auth, group.checkMember);
  router.post('/entergroup', auth, group.enterGroup);
  router.post('/get_groupusers', auth, group.searchGroupUser);

//  ---------admin-------
  // router.post('/updatereason', reasons.updateReason);
  // router.post('/add', reasons.addReason);
  // router.get('/getonereason', reasons.getOneReason);
  // router.delete('/delete', reasons.deleteOneItem);

  app.use("/api/groups", router);
}