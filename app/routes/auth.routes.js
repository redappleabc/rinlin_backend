
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
  router.post('/save_answer', auth, users.saveAnswer);
  router.post('/favorite_description', auth, users.saveFavoriteDescription);
  router.post('/update_prefectureId', auth, users.updatePrefectureId);
  router.post('/update_height', auth, users.updateHeight);
  router.post('/update_bodyType', auth, users.updateBodyType);
  router.post('/update_blood', auth, users.updateBlood);
  router.post('/update_birth', auth, users.updateBirth);
  router.post('/update_education', auth, users.updateEducation);
  router.post('/update_jobType', auth, users.updateJobType);
  router.post('/update_income', auth, users.updateIncome);
  router.post('/update_materialHistory', auth, users.updateMaterialHistory);
  router.post('/update_attitude', auth, users.updateAttitude);
  router.post('/update_children', auth, users.updateChildren);
  router.post('/update_housework', auth, users.updateHousework);
  router.post('/update_hopeMeet', auth, users.updateHopeMeet);
  router.post('/update_dateCost', auth, users.updateDateCost);
  router.post('/update_holiday', auth, users.updateHoliday);
  router.post('/update_roomate', auth, users.updateRoomate);
  router.post('/update_alcohol', auth, users.updateAlcohol);
  router.post('/update_smoking', auth, users.updateSmoking);
  router.post('/update_saving', auth, users.updateSaving);
  
  router.get('/getuser', auth, users.getUser);
  router.get('/getuserById', auth, users.getUserById);
  router.delete('/remove_groups', auth, users.removeGroups);

  router.get('/get_allusers', auth, users.getAllUsers);

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