
const express = require("express");
const router = express.Router();
const config = require("config");
const { check, validationResult } = require("express-validator");
const auth = require("../middleware/auth.js");

module.exports = app => {
  const users = require("../controllers/users.controller.js");
  
  var router = require("express").Router();

  // Retrieve all campaigns
  router.post('/refresh_token/', users.updateAccessToken);

  router.post('/phone_register', users.phoneRegister);
  router.post('/phone_login', users.phoneLogin);
  router.post('/save_name', auth, users.saveName);
  router.post('/save_age', auth, users.saveAge);
  router.post('/save_firststep', auth, users.saveFirstStep);
  router.post('/save_secondstep', auth, users.saveSecondStep);
  router.post('/save_introduce', auth, users.saveIntroduce);
  
  router.get('/getuser', auth, users.getUser);
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