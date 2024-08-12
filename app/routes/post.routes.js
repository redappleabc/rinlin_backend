const auth = require("../middleware/auth.js");
const { post } = require("./upload.routes.js");

module.exports = app => {
  const posts = require("../controllers/post.controller.js");
  
  var router = require("express").Router();

  // Retrieve all campaigns

  router.get('/get_mypost', auth, posts.getMyPost);
  router.get('/get_posts', auth, posts.getPosts);
  router.post('/send_postmessage', auth, posts.sendPostMessage);
  router.get('/get_postmessagelist', auth, posts.getPostMessageList);

  
  // router.post('/add', introductions.addIntroduction);
  // router.delete('/delete', introductions.deleteOneItem);  


  app.use("/api/posts", router);
}