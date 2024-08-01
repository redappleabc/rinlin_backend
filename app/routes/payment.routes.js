
const auth = require("../middleware/auth");

module.exports = app => {
  const payment = require("../controllers/payment.controller.js");
  
  var router = require("express").Router();

  // Retrieve all campaigns
  // router.post('/event-process', payment.eventProcess)
  router.post('/create-payment-intent',auth, payment.createPaymentIntents);
  router.post('/create-refund-intent',auth, payment.createRefundIntents);

  // router.post('/create-payment-intent-test', payment.createPaymentIntentsTest);


  // router.get('/sendnotification', notification.sendNotification);
  
  // router.post('/updatenotification', notification.updateNotification);
  // router.delete('/deleteone', notification.deleteOne);  


  app.use("/api/payment", router);
}