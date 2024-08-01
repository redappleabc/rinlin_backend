const express = require("express");
const multer = require("multer");
const path = require("path");
require('dotenv').config();
const router = express.Router();
const config = require("config");
const moment = require('moment-timezone')

const { check, validationResult } = require("express-validator");

const db = require('../models');
const auth = require("../middleware/auth");
const User = db.user;
const Item=db.item;

const storage_image = multer.diskStorage({
  destination: (req, file, cb) => {
    // Specify the directory where the file will be saved
    cb(null, './uploads/img/');
  },
  filename: async(req, file, cb) => {
        // Generate a unique filename for the uploaded file
    const item = await Item.findOne({
      where: {
        main_image_url: '/img/'+file.originalname
      }
    });
    cb(null, Date.now().toString().slice(0,11)+file.originalname);
    item.main_image_url='/img/'+Date.now().toString().slice(0,11)+file.originalname;
    item.save();
  }
});
const maxSize = 1 * 500 * 500;  
const upload_image = multer({
   storage: storage_image,
   limits: { fileSize: maxSize },
   fileFilter: function (req, file, cb) {
    // Set the filetypes, it is optional
      var filetypes = /jpeg|jpg|png/;
      var mimetype = filetypes.test(file.mimetype);
      var extname = filetypes.test(
          path.extname(file.originalname).toLowerCase()
      );
      if (mimetype && extname) {
          return cb(null, true);
      }
      cb(
          "Error: File upload only supports the " +
              "following filetypes - " +
              filetypes
      );
  }, 
  }).single("file");

  const storage_sound = multer.diskStorage({
    destination: (req, file, cb) => {
      // Specify the directory where the file will be saved
      cb(null, './uploads/sound/');
    },
    filename: async(req, file, cb) => {
      // Generate a unique filename for the uploaded file
      // console.log("==========>",date);
      const item = await Item.findOne({
        where: {
          filename: file.originalname
        },
      });
      cb(null, Date.now().toString().slice(0,11)+file.originalname);
      item.filename=Date.now().toString().slice(0,11)+file.originalname;
      item.save();
    }
  });
  const upload_sound = multer({
    storage: storage_sound, 
   }).single("sound");

  const storage_video = multer.diskStorage({
    destination: (req, file, cb) => {
      // Specify the directory where the file will be saved
      cb(null, './uploads/video/');
    },
    filename: async(req, file, cb) => {
      // Generate a unique filename for the uploaded file
      // console.log("==========>",date);
      const item = await Item.findOne({
        where: {
          filename: file.originalname
        },
      });
      cb(null, Date.now().toString().slice(0,11)+file.originalname);
      item.filename=Date.now().toString().slice(0,11)+file.originalname;
      item.save();
    }
  });

  const storage_ensound = multer.diskStorage({
    destination: (req, file, cb) => {
      // Specify the directory where the file will be saved
      cb(null, './uploads/sound/');
    },
    filename: async(req, file, cb) => {
      // Generate a unique filename for the uploaded file
      // console.log("==========>",date);
      const item = await Item.findOne({
        where: {
          en_filename: file.originalname
        },
      });
      cb(null, Date.now().toString().slice(0,11)+file.originalname);
      item.en_filename=Date.now().toString().slice(0,11)+file.originalname;
      item.save();
    }
  });
  const upload_ensound = multer({
    storage: storage_ensound, 
   }).single("sound");

  const storage_envideo = multer.diskStorage({
    destination: (req, file, cb) => {
      // Specify the directory where the file will be saved
      cb(null, './uploads/video/');
    },
    filename: async(req, file, cb) => {
      // Generate a unique filename for the uploaded file
      // console.log("==========>",date);
      const item = await Item.findOne({
        where: {
          en_filename: file.originalname
        },
      });
      cb(null, Date.now().toString().slice(0,11)+file.originalname);
      item.en_filename=Date.now().toString().slice(0,11)+file.originalname;
      item.save();
    }
  });

  const upload_envideo = multer({
    storage: storage_envideo, 
   }).single("video");

  const upload_video = multer({
    storage: storage_video, 
   }).single("video");
  
    
// @route       GET api/auth
// @desc        Get logged in user
// @access      Private
// router.get("/", auth, async (req, res) => {
//   try {
//     const user = await User.findByPk(req.user.id);
//     res.json(user);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send({msg: "Server Error "});
//   }
// });

// @route       POST api/auth
// @desc        Auth user & get Token
// @access      Public
router.post("/addimage", auth, function(req, res, next) {
  upload_image(req, res, function (err) {
    if (err) {
    } else {
        // SUCCESS, image successfully uploaded
        res.send("Success, Image uploaded!");
    }
});
  
});

router.post("/addsound", auth, function(req, res, next) {
  upload_sound(req, res, function (err) {
    if (err) {
        res.send(err);
    } else {
        // SUCCESS, image successfully uploaded
        res.send("Success, Sound uploaded!");
    }
  });
});
router.post("/addensound", auth, function(req, res, next) {
  upload_ensound(req, res, function (err) {
    if (err) {
        res.send(err);
    } else {
        // SUCCESS, image successfully uploaded
        res.send("Success, Sound uploaded!");
    }
  });
});

router.post("/addvideo", auth, function(req, res, next) {
  upload_video(req, res, function (err) {
    if (err) {
        res.send(err);
    } else {
        // SUCCESS, image successfully uploaded
        res.send("Success, Video uploaded!");
    }
  });
});

router.post("/addenvideo", auth, function(req, res, next) {
  upload_envideo(req, res, function (err) {
    if (err) {
        res.send(err);
    } else {
        // SUCCESS, image successfully uploaded
        res.send("Success, Video uploaded!");
    }
  });
});

module.exports = router;
