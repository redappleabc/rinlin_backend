
const auth = require("../middleware/auth.js");

module.exports = app => {
  const notification = require("../controllers/notification.controller.js");
  
  var router = require("express").Router();

  // Retrieve all campaigns
  router.get('/get_notifications', auth, notification.getNotifications);
  // router.get('/getonenotification', auth, notification.getOneNotification);
  router.post('/adduser', auth, notification.addUserToNotification);

  // // router.get('/sendnotification', notification.sendNotification);
  
  // router.post('/updatenotification', auth, notification.updateNotification);
  // router.delete('/deleteone', auth, notification.deleteOne);  


  app.use("/api/notifications", router);
}