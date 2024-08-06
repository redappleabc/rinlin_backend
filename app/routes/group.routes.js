
const auth = require("../middleware/auth.js");

module.exports = app => {
  const group = require("../controllers/group.controller.js");
  
  var router = require("express").Router();

  // Retrieve all campaigns
  router.get('/getallgroups', auth, group.getAllGroup);
  router.get('/getallcategories', auth, group.getAllCategories);
  router.post('/save_groups', auth, group.saveGroups);

//  ---------admin-------
  // router.post('/updatereason', reasons.updateReason);
  // router.post('/add', reasons.addReason);
  // router.get('/getonereason', reasons.getOneReason);
  // router.delete('/delete', reasons.deleteOneItem);

  app.use("/api/groups", router);
}