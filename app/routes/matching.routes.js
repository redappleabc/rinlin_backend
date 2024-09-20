const auth = require("../middleware/auth.js");

module.exports = app => {
  const items = require("../controllers/matching.controller.js");
  
  var router = require("express").Router();

  // -------admin----------
  router.get('/getallmatching', auth, items.getAllMatchingList);

  // router.get('/getcategory', items.getAllCategory);

  app.use("/api/matching", router);
}