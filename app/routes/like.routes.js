const auth = require("../middleware/auth.js");

module.exports = app => {
  const likes = require("../controllers/like.controller.js");
  
  var router = require("express").Router();

  // Retrieve all campaigns

  router.post('/send_like', likes.sendLike);
  // router.post('/updateintroduction', introductions.updateIntroduction);
  
  // router.post('/add', introductions.addIntroduction);
  // router.delete('/delete', introductions.deleteOneItem);  


  app.use("/api/like", router);
}