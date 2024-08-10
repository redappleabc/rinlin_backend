const auth = require("../middleware/auth.js");

module.exports = app => {
  const records = require("../controllers/record.controller.js");
  
  var router = require("express").Router();

  // Retrieve all campaigns

  router.get('/get_record', records.getRecord);
  router.post('/save_record', records.saveRecord);
  // router.post('/updateintroduction', introductions.updateIntroduction);
  
  // router.post('/add', introductions.addIntroduction);
  // router.delete('/delete', introductions.deleteOneItem);  


  app.use("/api/records", router);
}