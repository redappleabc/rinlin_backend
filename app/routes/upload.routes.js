const express = require("express");
const multer = require("multer");
require('dotenv').config();
const router = express.Router();
const fs= require('fs')
const path = require('path')


const db = require('../models');
const auth = require("../middleware/auth");
const { where } = require("sequelize");
const User = db.user;
// --------main avatar---------------
const storageMainAvatar = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = './uploads/img/';
    // Ensure the uploads directory exists
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now().toString().slice(0,11)+file.originalname}`);
  }
});
const uploadMainAvatar = multer({ storage: storageMainAvatar }).single("file");
// ---------avatars---------------
const storageAvatar = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = './uploads/img/';
    // Ensure the uploads directory exists
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now().toString().slice(0,11)+file.originalname}`);
  }
});
const uploadAvatar = multer({ storage: storageAvatar }).single("file");
// ----------favoriteImage----------------
const storageFavoriteImage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = './uploads/img/';
    // Ensure the uploads directory exists
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now().toString().slice(0,11)+file.originalname}`);
  }
});
const uploadFavoriteImage = multer({ storage: storageFavoriteImage }).single("file");

// -----------------------------------------------------------

router.post('/add_mainavatar', auth, uploadMainAvatar, async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  const userId = parseInt(req.body.userId);
  const filename = req.file.filename;
  try {
    const user = await User.findOne({
      where:{
        id : userId
      }
    });
    if (user) {
      user.avatar1 = filename;
      user.save();
    }
    res.status(200).json("Successfully saved!");
  } catch (error) {
    res.status(500).json({
      message: error.message || ''
    })
  }
});

router.post('/addavatar', auth, uploadAvatar, async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  const userId = parseInt(req.body.userId);
  const index = parseInt(req.body.index);
  const filename = req.file.filename;
  try {
    const user = await User.findOne({
      where:{
        id : userId
      }
    });
    if (user) {
      if (index == 0) {
        if (user.avatar1 != "" || user.avatar1 != null) {
          const imagePath = path.join(__dirname, '../../uploads/img', user.avatar1);
          fs.unlink(imagePath, (error) => {
            if (error) {
              console.error('Error deleting image:', error);
            } else {
              console.log('Image deleted successfully');
            }
          });
        }
        user.avatar1 = filename;
      }
      if (index == 1) {
        if (user.avatar2) {
          const imagePath = path.join(__dirname, '../../uploads/img', user.avatar2);
          fs.unlink(imagePath, (error) => {
            if (error) {
              console.error('Error deleting image:', error);
            } else {
              console.log('Image deleted successfully');
            }
          });
        }
        user.avatar2 = filename;
      }
      if (index == 2) {
        if (user.avatar3) {
          const imagePath = path.join(__dirname, '../../uploads/img', user.avatar3);
          fs.unlink(imagePath, (error) => {
            if (error) {
              console.error('Error deleting image:', error);
            } else {
              console.log('Image deleted successfully');
            }
          });
        }
        user.avatar3 = filename;
      }
      if (index == 3) {
        if (user.avatar4) {
          const imagePath = path.join(__dirname, '../../uploads/img', user.avatar4);
          fs.unlink(imagePath, (error) => {
            if (error) {
              console.error('Error deleting image:', error);
            } else {
              console.log('Image deleted successfully');
            }
          });
        }
        user.avatar4 = filename;
      }
      user.save();
    }
    res.status(200).json("Successfully saved!");
  } catch (error) {
    res.status(500).json({
      message: error.message || ''
    })
  }
});

router.post('/favorite_image', auth, uploadFavoriteImage, async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  const userId = parseInt(req.body.userId);
  const filename = req.file.filename;
  try {
    const user = await User.findOne({
      where:{
        id : userId
      }
    });
    if (user) {
      user.favoriteImage = filename;
      user.save();
    }
    res.status(200).json("Successfully saved!");
  } catch (error) {
    res.status(500).json({
      message: error.message || ''
    })
  }
});

module.exports = router;
