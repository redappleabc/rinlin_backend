const express = require("express");
const multer = require("multer");
require('dotenv').config();
const router = express.Router();


const db = require('../models');
const auth = require("../middleware/auth");
const { where } = require("sequelize");
const User = db.user;

const storageAvatar1 = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = './uploads/img/';
    // Ensure the uploads directory exists
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now().toString().slice(0,11)+file.originalname}`);
  }
});
const uploadAvatar1 = multer({ storage: storageAvatar1 }).single("file");

// -----------------------------------------------------------

router.post('/addavatar1', auth, uploadAvatar1, async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  const userId = parseInt(req.body.userId);
  const filename = req.file.filename;
  console.log("userId",userId)
  console.log("filename",filename)
  try {
    const user = await User.findOne({
      where:{
        id : userId
      }
    });
    if (user) {
      user.avatar1 = filename
      user.save()
    }
    res.status(200).json("Successfully saved!");
  } catch (error) {
    res.status(500).json({
      message: error.message || ''
    })
  }
});

module.exports = router;
