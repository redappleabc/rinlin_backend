
const express = require("express");
const router = express.Router();
const config = require("config");
const { check, validationResult } = require("express-validator");
const auth = require("../middleware/auth.js");

module.exports = app => {
  const users = require("../controllers/users.controller.js");
  
  var router = require("express").Router();

  // Admin
  router.post('/admin_login', users.adminLogin);
  router.get('/admin_getall', auth, users.adminGetAllUsers);
  router.get('/admin_getoneuser', auth, users.adminGetOneUsers);
  router.post('/admin_deleteuser', auth, users.adminDeleteUsers);
  router.post('/admin_adduser', auth, users.adminAddUser);
  router.post('/admin_updateuser', auth, users.adminUpdateUser);

  // Retrieve all campaigns
  router.post('/refresh_token/', users.updateAccessToken);

  router.post('/phone_register', users.phoneRegister);
  router.post('/phone_login', users.phoneLogin);
  router.post('/google_login', users.googleLogin);
  router.post('/line_login', users.lineLogin);
  router.post('/save_name', auth, users.saveName);
  router.post('/save_onesignalid', auth, users.saveOnesignalId);
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
  router.post('/search_swipeusers', auth, users.searchSwipeusers);
  router.post('/update_phrase', auth, users.updatePhrase);
  router.post('/advice_request', auth, users.adviceRequest);
  router.post('/checked_verifystate', auth, users.checkedVerifystate);
  router.post('/clear_viewusers', auth, users.clearViewUsers);
  router.post('/set_isregistered', auth, users.setIsRegistered);
  router.delete('/delete_account', auth, users.deleteAccount);
  
  router.get('/getuser', auth, users.getUser);
  router.get('/getuserById', auth, users.getUserById);
  router.get('/get_matchedusers', auth, users.getMatchedUsers);
  router.get('/get_phrase', auth, users.getPhrase);
  router.get('/get_advicestate', auth, users.getAdviceState);
  router.get('/get_verifystate', auth, users.getVerifyState);
  router.get('/get_isregistered', auth, users.getIsRegistered);

  router.get('/get_allusers', auth, users.getAllUsers);

  app.use("/api/auth", router);
}