const auth = require("../middleware/auth.js");

module.exports = app => {
  const items = require("../controllers/item.controller.js");
  
  var router = require("express").Router();

  // Retrieve all campaigns
  router.get('/', auth, items.getItemAll);
  router.get('/sort', auth, items.getSortItemAll);
  router.get('/tab', auth, items.getTab);
  router.get('/getalltab', auth, items.getAllTab);
  router.get('/getallcategory', auth, items.getAllCategory);
  router.post('/like', auth, items.addLike);
  router.get('/getlike', auth, items.getLike);
  router.get('/getonelike', auth, items.getOneLike);
  router.get('/getplay', auth, items.getPlay);
  router.get('/getdownload', auth, items.getDownload);
  router.post('/download', auth, items.addDownload);
  router.post('/play', auth, items.addPlays);
  router.get('/search', auth, items.getContentSearch);
  router.get('/en_search', items.getEnContentSearch);
  router.get('/category_search', auth, items.getCategorySearch);
  router.get('/tab_search', auth, items.getTabSearch);
  router.post('/addgive', items.addGive);

  // -------admin----------
  router.post('/additem_video', auth, items.addItemVideo);
  router.post('/additem_sound', auth, items.addItemSound);
  router.post('/updateitem_video', auth, items.updateItemVideo);
  router.post('/updateitem_sound', auth, items.updateItemSound);
  router.post('/addtab', auth, items.addTab);
  router.get('/getoneitem', auth, items.getOneItem);
  router.delete('/deleteoneitem', auth, items.deleteOneItem);
  router.delete('/deletetag', auth, items.deleteTag);
  router.get('/getalltags', items.getAllTags);
  router.get('/getonetag', auth, items.getOneTag);
  router.post('/updatetag', auth, items.updateTag);

  // router.get('/getcategory', items.getAllCategory);

  app.use("/api/items", router);
}