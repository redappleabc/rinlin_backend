const auth = require("../middleware/auth.js");

module.exports = app => {
  const blocks = require("../controllers/block.controller.js");
  
  var router = require("express").Router();

  // Retrieve all campaigns
  router.get('/get_blocklist', auth, blocks.getBlockList);

  router.delete('/remove_block', auth, blocks.removeBlock);
  
  // router.post('/add', introductions.addIntroduction);
  // router.delete('/delete', introductions.deleteOneItem);  


  app.use("/api/block", router);
}