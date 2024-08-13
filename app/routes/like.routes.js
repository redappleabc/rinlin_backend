const auth = require("../middleware/auth.js");

module.exports = app => {
  const likes = require("../controllers/like.controller.js");
  
  var router = require("express").Router();

  // Retrieve all campaigns

  router.post('/send_like', auth, likes.sendLike);
  router.post('/skip_swipe', auth, likes.skipSwipe);
  router.post('/send_messagelike', auth, likes.sendMessageLike);

  router.get('/get_likelist', auth, likes.getLikeList);
  router.post('/skip_like', auth, likes.skipLike);
  router.post('/create_matching', auth, likes.createMatching);

  // router.post('/updateintroduction', introductions.updateIntroduction);
  
  // router.post('/add', introductions.addIntroduction);
  // router.delete('/delete', introductions.deleteOneItem);  


  app.use("/api/like", router);
}