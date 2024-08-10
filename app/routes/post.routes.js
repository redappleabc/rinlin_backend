const auth = require("../middleware/auth.js");

module.exports = app => {
  const posts = require("../controllers/post.controller.js");
  
  var router = require("express").Router();

  // Retrieve all campaigns

  router.get('/get_mypost', posts.getMyPost);
  router.get('/get_posts', posts.getPosts);
  // router.post('/updateintroduction', introductions.updateIntroduction);
  
  // router.post('/add', introductions.addIntroduction);
  // router.delete('/delete', introductions.deleteOneItem);  


  app.use("/api/posts", router);
}