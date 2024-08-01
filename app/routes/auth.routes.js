
const express = require("express");
const router = express.Router();
const config = require("config");
const { check, validationResult } = require("express-validator");
const auth = require("../middleware/auth.js");

module.exports = app => {
  const users = require("../controllers/users.controller.js");
  
  var router = require("express").Router();

  // Retrieve all campaigns
  router.post('/phone_register', users.phoneRegister);
  // router.get('/getuser', auth, users.getOne);
  // router.get('/getplan', auth, users.getUserPlan);

  // router.get('/getall_subscription', auth, users.getAllSub);
  // router.get('/getgivelist', auth, users.getAllGiveList);

  // router.get('/getone_reason', auth, users.getOneReason);
  // router.get('/getone_introduction', auth, users.getOneIntroduction);
  // router.get('/getstatus', auth, users.getStatus);
  // router.get('/get_tiping', auth, users.getTiping);
  // router.get('/getname', auth, users.getName);
  // router.post('/plan', auth, users.addPlan);
  // router.post('/notification', users.setNotification);
  // router.post('/verify', users.emailVerify);

  // router.post('/ispay', users.isPay);
  // router.post('/checkuser', users.checkUser);

  // router.delete('/delete', auth, users.accountDelete);
  // router.delete('/onlydelete', auth, users.accountOnlyDelete);

  app.use("/api/auth", router);
}