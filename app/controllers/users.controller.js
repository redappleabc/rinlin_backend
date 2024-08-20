const axios = require('axios')
const { format } = require('date-fns')
const db = require('../models')
const crypto = require('crypto');
const moment = require('moment-timezone');
const { where } = require('sequelize');
const jwt = require("jsonwebtoken");
const { group, log, time } = require('console');
const { json } = require('body-parser');

const User = db.user
const Group = db.group
const Like = db.like
const Block = db.block
const Matching = db.matching
const Request = db.request
const Verify = db.verify

// Retrieve all campaigns
exports.updateAccessToken = async (req, res) => {
  try {
    const refreshToken = req.body.refresh_token
    if(refreshToken == null){
      res.status(400).json("RefreshToken is valid.");
    }
    jwt.verify(token, process.env.REFRESH_SECRET, async (err, user) => {
      if (err) return res.status(401).json({ msg: "RefreshToken is incorrectly!" });
      const realUser = await User.findOne({
        where:{
          id:user.userId
        }
      })
      if (realUser) {
        const userId = realUser.id
        const payload = { userId };
        const accessToken =  jwt.sign(payload, process.env.ACCESS_SECRET, { expiresIn : "24h" });
        const result = {
          accessToken: accessToken
        }
        res.status(200).json(result)
      }else{
        res.status(401).json({ msg: "Token is incorrectly!" });
      }
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || ''
    })
  }
}

exports.phoneRegister = async (req, res) => {
  try {
    const buffer = crypto.randomBytes(3); // Generates 3 random bytes
    const pin = parseInt(buffer.toString('hex'), 16) % 1000000; // Convert to a number and limit to 6 digits
    const randomString = pin.toString().padStart(6, '0');
    const user = await User.findOne({
      where:{
        phoneNumber: req.body.phone_number
      }
    });
    if(user != null){
      user.phoneverifycode=randomString;
      user.save();
    }else{
      const newuser = User.create({
        phoneNumber: req.body.phone_number,
        pointCount: 50,
        phrase1: "こんにちは！\n共通する趣味や性格に惹かれて、メッセージを送ってみました。\n私はADREESに在住するAGE歳のNAMEです。\nメッセージお待ちしております。",
        phrase2: "初めまして。\n私は$uniqueADREESに在住する$uniqueAGE歳の$uniqueNAMEです。\nお互いまずはゆっくりとメッセージを重ねて仲良くなりたいです。\nよろしくお願いいたします。",
        phrase3: "初めまして。$NAMEと申します。\nプロフィールを拝見して、ぜひ一度メッセージをしたいと思いご連絡いたしました。\nよろしくお願いいたします。",
        verifyed: false,
        paied: false,
        phoneverifycode: randomString
      });
    }
    res.status(200).json("success");
  } catch (error) {
    res.status(500).json({
      message: error.message || ''
    })
  }
}

exports.phoneLogin = async (req, res) => {
  try {
    const user = await User.findOne({
      where:{
        phoneNumber:req.body.phone_number
      }
    });
    if(user){
      const userId = user.id
      if (user.phoneverifycode == req.body.verify_code) {
        const payload = { userId };
        const accessToken =  jwt.sign(payload, process.env.ACCESS_SECRET, { expiresIn : "24h" })
        const refreshToken =  jwt.sign(payload, process.env.REFRESH_SECRET)
        const result = {
          id: userId,
          gender: user.gender,
          accessToken: accessToken,
          refreshToken: refreshToken
        }
        res.status(200).json(result)
      } else {
        res.status(400).json("VerifyCode is incorrect.");
      }
    }else{
      res.status(400).json("VerifyCode is incorrect.");
    }
  } catch (error) {
    res.status(500).json({
      message: error.message || ''
    })
  }
}

exports.saveName = async (req, res) => {
  try {
    const userId = parseInt(req.body.id)
    const user = await User.findOne({
      where:{
        id: userId
      }
    });
    if (user) {
      user.name = req.body.name;
      user.save();
    }
    res.status(200).json("Saved name!");
  } catch (error) {
    res.status(500).json({
      message: error.message || ''
    })
  }
}

exports.saveAge = async (req, res) => {
  try {
    const userId = parseInt(req.body.id)
    const user = await User.findOne({
      where:{
        id: userId
      }
    });
    if (user) {
      user.age = parseInt(req.body.age);
      user.save();
    }
    res.status(200).json("Saved age!");
  } catch (error) {
    res.status(500).json({
      message: error.message || ''
    })
  }
}
exports.saveFirstStep = async (req, res) => {
  try {
    const userId = parseInt(req.body.id)
    const user = await User.findOne({
      where:{
        id: userId
      }
    });
    if (user) {
      user.gender = parseInt(req.body.gender);
      user.prefectureId = parseInt(req.body.prefectureId);
      user.height = parseInt(req.body.height);
      user.bodyType = parseInt(req.body.bodyType);
      user.attitude = parseInt(req.body.attitude)
      user.save();
    }
    res.status(200).json("Successfully saved!");
  } catch (error) {
    res.status(500).json({
      message: error.message || ''
    })
  }
}

exports.saveSecondStep = async (req, res) => {
  try {
    const userId = parseInt(req.body.id)
    const user = await User.findOne({
      where:{
        id: userId
      }
    });
    if (user) {
      user.blood = parseInt(req.body.blood);
      user.birth = parseInt(req.body.birth);
      user.education = parseInt(req.body.education);
      user.jobType = parseInt(req.body.jobType);
      user.materialHistory = parseInt(req.body.materialHistory);
      user.income = parseInt(req.body.income);
      user.children = parseInt(req.body.children);
      user.housework = parseInt(req.body.housework);
      user.hopemeet = parseInt(req.body.hopeMeet);
      user.datecost = parseInt(req.body.dateCost);
      user.save();
    }
    res.status(200).json("Successfully saved!");
  } catch (error) {
    res.status(500).json({
      message: error.message || ''
    })
  }
}

exports.saveIntroduce = async (req, res) => {
  try {
    const userId = parseInt(req.body.id)
    const user = await User.findOne({
      where:{
        id: userId
      }
    });
    if (user) {
      user.introduce = req.body.introduce;
      user.save();
    }
    res.status(200).json("Successfully saved!");
  } catch (error) {
    res.status(500).json({
      message: error.message || ''
    })
  }
}

exports.getUser = async (req, res) => {
  try {
    const userId= req.query.userId;
    const user = await User.findOne({
      where:{
        id: userId
      },
      include: Group
    });
    if (user) {
      let avatars = [];
      if (user.avatar1 != null) {
        avatars.push(user.avatar1)
      } else{
        avatars.push("")
      }
      if (user.avatar2 != null) {
        avatars.push(user.avatar2)
      } else{
        avatars.push("")
      }
      if (user.avatar3 != null) {
        avatars.push(user.avatar3)
      } else{
        avatars.push("")
      }
      if (user.avatar4 != null) {
        avatars.push(user.avatar4)
      } else{
        avatars.push("")
      }
      let groups = [];
      for (let i = 0; i < user.groups.length; i++) {
        groups[i]=user.groups[i].id
      }

      const result = {
        id: user.id,
        name: user.name,
        age: user.age,
        gender: user.gender,
        introduce: user.introduce,
        prefectureId: user.prefectureId,
        height: user.height,
        bodyType: user.bodyType,
        attitude: user.attitude,
        avatars: avatars,
        blood: user.blood,
        birth: user.birth,
        education: user.education,
        jobType: user.jobType,
        income: user.income,
        materialHistory: user.materialHistory,
        children: user.children,
        housework: user.housework,
        hopeMeet: user.hopemeet,
        dateCost: user.datecost,
        holiday: user.holiday,
        roomate: user.roomate,
        alcohol: user.alcohol,
        smoking: user.smoking,
        saving: user.saving,
        favoriteImage: user.favoriteImage,
        favoriteDescription: user.favoriteDescription,
        groups:groups,
        isVerify:user.verifyed,
        isPay:user.paied,
        pointCount: user.pointCount,
        questions: [user.question1, user.question2, user.question3],
        phrases: [user.phrase1, user.phrase2, user.phrase3],
        deadline: user.deadline,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
      res.status(200).json(result);
    }
  } catch (error) {
    res.status(500).json({
      message: error.message || ''
    })
  }
}

exports.getUserById = async (req, res) => {
  try {
    const userId= req.query.userId;
    const user = await User.findOne({
      where:{
        id: userId
      },
      include: Group
    });
    if (user) {
      let avatars = [];
      if (user.avatar1 != null) {
        avatars.push(user.avatar1)
      } else{
        avatars.push("")
      }
      if (user.avatar2 != null) {
        avatars.push(user.avatar2)
      } else{
        avatars.push("")
      }
      if (user.avatar3 != null) {
        avatars.push(user.avatar3)
      } else{
        avatars.push("")
      }
      if (user.avatar4 != null) {
        avatars.push(user.avatar4)
      } else{
        avatars.push("")
      }
      let groups = [];
      for (let i = 0; i < user.groups.length; i++) {
        groups[i]=user.groups[i].id
      }

      const result = {
        id: user.id,
        name: user.name,
        age: user.age,
        gender: user.gender,
        introduce: user.introduce,
        prefectureId: user.prefectureId,
        height: user.height,
        bodyType: user.bodyType,
        attitude: user.attitude,
        avatars: avatars,
        blood: user.blood,
        birth: user.birth,
        education: user.education,
        jobType: user.jobType,
        income: user.income,
        materialHistory: user.materialHistory,
        children: user.children,
        housework: user.housework,
        hopeMeet: user.hopemeet,
        dateCost: user.datecost,
        holiday: user.holiday,
        roomate: user.roomate,
        alcohol: user.alcohol,
        smoking: user.smoking,
        saving: user.saving,
        favoriteImage: user.favoriteImage,
        favoriteDescription: user.favoriteDescription,
        groups:groups,
        isVerify:user.verifyed,
        isPay:user.paied,
        pointCount: user.pointCount,
        questions: [user.question1, user.question2, user.question3],
        phrases: [user.phrase1, user.phrase2, user.phrase3],
        deadline: user.deadline,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
      res.status(200).json(result);
    }else{
      res.status(400).json("No User");
    }
  } catch (error) {
    res.status(500).json({
      message: error.message || ''
    })
  }
}

exports.saveAnswer = async (req, res) => {
  try {
    const userId = parseInt(req.body.id);
    const index = parseInt(req.body.index);
    const user = await User.findOne({
      where:{
        id: userId
      }
    });
    if (user) {
      if(index == 1){
        if (user.question1 == null) {
          user.pointCount = user.pointCount + 5;
        }
        user.question1 = req.body.answer;
      }
      if (index == 2) {
        if (user.question2 == null) {
          user.pointCount = user.pointCount + 5;
        }
        user.question2 = req.body.answer;
      }
      if (index == 3) {
        if (user.question3 == null) {
          user.pointCount = user.pointCount + 5;
        }
        user.question3 = req.body.answer;
      }
      user.save();
    }
    res.status(200).json("Successfully saved!");
  } catch (error) {
    res.status(500).json({
      message: error.message || ''
    })
  }
}

exports.saveFavoriteDescription = async (req, res) => {
  try {
    const userId = parseInt(req.body.id);
    const user = await User.findOne({
      where:{
        id: userId
      }
    });
    if (user) {
      if (user.favoriteDescription == null) {
        user.pointCount = user.pointCount + 100;
      }
      user.favoriteDescription = req.body.description;
      user.save();
    }
    res.status(200).json("Successfully saved!");
  } catch (error) {
    res.status(500).json({
      message: error.message || ''
    })
  }
}

exports.updatePrefectureId = async (req, res) => {
  try {
    const userId = parseInt(req.body.id);
    const prefectureId = parseInt(req.body.prefectureId);
    const user = await User.findOne({
      where:{
        id: userId
      }
    });
    if (user) {
      user.prefectureId = prefectureId;
      user.save();
    }
    res.status(200).json("Successfully saved!");
  } catch (error) {
    res.status(500).json({
      message: error.message || ''
    })
  }
}

exports.updateHeight = async (req, res) => {
  try {
    const userId = parseInt(req.body.id);
    const height = parseInt(req.body.height);
    const user = await User.findOne({
      where:{
        id: userId
      }
    });
    if (user) {
      user.height = height;
      user.save();
    }
    res.status(200).json("Successfully saved!");
  } catch (error) {
    res.status(500).json({
      message: error.message || ''
    })
  }
}

exports.updateBodyType = async (req, res) => {
  try {
    const userId = parseInt(req.body.id);
    const bodyType = parseInt(req.body.bodyType);
    const user = await User.findOne({
      where:{
        id: userId
      }
    });
    if (user) {
      user.bodyType = bodyType;
      user.save();
    }
    res.status(200).json("Successfully saved!");
  } catch (error) {
    res.status(500).json({
      message: error.message || ''
    })
  }
}

exports.updateBlood = async (req, res) => {
  try {
    const userId = parseInt(req.body.id);
    const blood = parseInt(req.body.blood);
    const user = await User.findOne({
      where:{
        id: userId
      }
    });
    if (user) {
      user.blood = blood;
      user.save();
    }
    res.status(200).json("Successfully saved!");
  } catch (error) {
    res.status(500).json({
      message: error.message || ''
    })
  }
}

exports.updateBirth = async (req, res) => {
  try {
    const userId = parseInt(req.body.id);
    const birth = parseInt(req.body.birth);
    const user = await User.findOne({
      where:{
        id: userId
      }
    });
    if (user) {
      user.birth = birth;
      user.save();
    }
    res.status(200).json("Successfully saved!");
  } catch (error) {
    res.status(500).json({
      message: error.message || ''
    })
  }
}

exports.updateEducation = async (req, res) => {
  try {
    const userId = parseInt(req.body.id);
    const education = parseInt(req.body.education);
    const user = await User.findOne({
      where:{
        id: userId
      }
    });
    if (user) {
      user.education = education;
      user.save();
    }
    res.status(200).json("Successfully saved!");
  } catch (error) {
    res.status(500).json({
      message: error.message || ''
    })
  }
}

exports.updateJobType = async (req, res) => {
  try {
    const userId = parseInt(req.body.id);
    const jobType = parseInt(req.body.jobType);
    const user = await User.findOne({
      where:{
        id: userId
      }
    });
    if (user) {
      user.jobType = jobType;
      user.save();
    }
    res.status(200).json("Successfully saved!");
  } catch (error) {
    res.status(500).json({
      message: error.message || ''
    })
  }
}

exports.updateIncome = async (req, res) => {
  try {
    const userId = parseInt(req.body.id);
    const income = parseInt(req.body.income);
    const user = await User.findOne({
      where:{
        id: userId
      }
    });
    if (user) {
      user.income = income;
      user.save();
    }
    res.status(200).json("Successfully saved!");
  } catch (error) {
    res.status(500).json({
      message: error.message || ''
    })
  }
}

exports.updateMaterialHistory = async (req, res) => {
  try {
    const userId = parseInt(req.body.id);
    const materialHistory = parseInt(req.body.materialHistory);
    const user = await User.findOne({
      where:{
        id: userId
      }
    });
    if (user) {
      user.materialHistory = materialHistory;
      user.save();
    }
    res.status(200).json("Successfully saved!");
  } catch (error) {
    res.status(500).json({
      message: error.message || ''
    })
  }
}

exports.updateAttitude = async (req, res) => {
  try {
    const userId = parseInt(req.body.id);
    const attitude = parseInt(req.body.attitude);
    const user = await User.findOne({
      where:{
        id: userId
      }
    });
    if (user) {
      user.attitude = attitude;
      user.save();
    }
    res.status(200).json("Successfully saved!");
  } catch (error) {
    res.status(500).json({
      message: error.message || ''
    })
  }
}

exports.updateChildren = async (req, res) => {
  try {
    const userId = parseInt(req.body.id);
    const children = parseInt(req.body.children);
    const user = await User.findOne({
      where:{
        id: userId
      }
    });
    if (user) {
      user.children = children;
      user.save();
    }
    res.status(200).json("Successfully saved!");
  } catch (error) {
    res.status(500).json({
      message: error.message || ''
    })
  }
}

exports.updateHousework = async (req, res) => {
  try {
    const userId = parseInt(req.body.id);
    const housework = parseInt(req.body.housework);
    const user = await User.findOne({
      where:{
        id: userId
      }
    });
    if (user) {
      user.housework = housework;
      user.save();
    }
    res.status(200).json("Successfully saved!");
  } catch (error) {
    res.status(500).json({
      message: error.message || ''
    })
  }
}

exports.updateHopeMeet = async (req, res) => {
  try {
    const userId = parseInt(req.body.id);
    const hopeMeet = parseInt(req.body.hopeMeet);
    const user = await User.findOne({
      where:{
        id: userId
      }
    });
    if (user) {
      user.hopemeet = hopeMeet;
      user.save();
    }
    res.status(200).json("Successfully saved!");
  } catch (error) {
    res.status(500).json({
      message: error.message || ''
    })
  }
}

exports.updateDateCost = async (req, res) => {
  try {
    const userId = parseInt(req.body.id);
    const dateCost = parseInt(req.body.dateCost);
    const user = await User.findOne({
      where:{
        id: userId
      }
    });
    if (user) {
      user.datecost = dateCost;
      user.save();
    }
    res.status(200).json("Successfully saved!");
  } catch (error) {
    res.status(500).json({
      message: error.message || ''
    })
  }
}

exports.updateHoliday = async (req, res) => {
  try {
    const userId = parseInt(req.body.id);
    const holiday = parseInt(req.body.holiday);
    const user = await User.findOne({
      where:{
        id: userId
      }
    });
    if (user) {
      if(user.holiday == null){
        user.pointCount = user.pointCount + 10;
      }
      user.holiday = holiday;
      user.save();
    }
    res.status(200).json("Successfully saved!");
  } catch (error) {
    res.status(500).json({
      message: error.message || ''
    })
  }
}

exports.updateRoomate = async (req, res) => {
  try {
    const userId = parseInt(req.body.id);
    const roomate = parseInt(req.body.roomate);
    const user = await User.findOne({
      where:{
        id: userId
      }
    });
    if (user) {
      if(user.roomate == null){
        user.pointCount = user.pointCount + 10;
      }
      user.roomate = roomate;
      user.save();
    }
    res.status(200).json("Successfully saved!");
  } catch (error) {
    res.status(500).json({
      message: error.message || ''
    })
  }
}

exports.updateAlcohol = async (req, res) => {
  try {
    const userId = parseInt(req.body.id);
    const alcohol = parseInt(req.body.alcohol);
    const user = await User.findOne({
      where:{
        id: userId
      }
    });
    if (user) {
      if(user.alcohol == null){
        user.pointCount = user.pointCount + 10;
      }
      user.alcohol = alcohol;
      user.save();
    }
    res.status(200).json("Successfully saved!");
  } catch (error) {
    res.status(500).json({
      message: error.message || ''
    })
  }
}

exports.updateSmoking = async (req, res) => {
  try {
    const userId = parseInt(req.body.id);
    const smoking = parseInt(req.body.smoking);
    const user = await User.findOne({
      where:{
        id: userId
      }
    });
    if (user) {
      if(user.smoking == null){
        user.pointCount = user.pointCount + 10;
      }
      user.smoking = smoking;
      user.save();
    }
    res.status(200).json("Successfully saved!");
  } catch (error) {
    res.status(500).json({
      message: error.message || ''
    })
  }
}

exports.updateSaving = async (req, res) => {
  try {
    const userId = parseInt(req.body.id);
    const saving = parseInt(req.body.saving);
    const user = await User.findOne({
      where:{
        id: userId
      }
    });
    if (user) {
      if(user.saving == null){
        user.pointCount = user.pointCount + 10;
      }
      user.saving = saving;
      user.save();
    }
    res.status(200).json("Successfully saved!");
  } catch (error) {
    res.status(500).json({
      message: error.message || ''
    })
  }
}

exports.getAllUsers = async (req, res) => {
  try {
    const userId= req.query.userId;
    const myself = await User.findOne({
      where:{
        id: userId
      }
    });
    const users = await User.findAll({});
    const likes = await Like.findAll({
      where:{
        userId: userId
      }
    });
    const blocks = await Block.findAll({
      where:{
        userId: userId
      }
    });
    const matchings = await Matching.findAll({});
    const checkLike = (userId) =>{
      if (likes) {
        for (let i = 0; i < likes.length; i++) {
          if (likes[i].received_id == userId) {
            return false;
          }
        }
        return true;
      }else{
        return true;
      }
    }
    const checkBlock = (userId) =>{
      if (blocks) {
        for (let i = 0; i < blocks.length; i++) {
          if (blocks[i].blockedUserId == userId) {
            return false;
          }
        }
        return true;
      }else{
        return true;
      }
    }
    const checkMatching = (userId) =>{
      if (matchings) {
        for (let i = 0; i < matchings.length; i++) {
          if (matchings[i].maleId == myself.id && matchings[i].femaleId == userId || matchings[i].femaleId == myself.id && matchings[i].maleId == userId) {
            return false;
          }
        }
        return true;
      }else{
        return true;
      }
    }
    let result = [];
    let filteredUsers = [];
    for (let i = 0; i < users.length; i++) {
      if (users[i] != userId && users[i].gender != myself.gender && checkLike(users[i].id) && checkBlock(users[i].id) && checkMatching(users[i].id)) {
        filteredUsers.push(users[i]);
      }
    }
    if (filteredUsers.length != 0) {
      for (let i = 0; i < filteredUsers.length; i++) {
        let avatars = [];
        if (filteredUsers[i].avatar1 != null) {
          avatars.push(filteredUsers[i].avatar1)
        } 
        if (filteredUsers[i].avatar2 != null) {
          avatars.push(filteredUsers[i].avatar2)
        } 
        if (filteredUsers[i].avatar3 != null) {
          avatars.push(filteredUsers[i].avatar3)
        } 
        if (filteredUsers[i].avatar4 != null) {
          avatars.push(filteredUsers[i].avatar4)
        } 
        result[i] = {
          id: filteredUsers[i].id,
          name: filteredUsers[i].name,
          description: null,
          prefectureId: filteredUsers[i].prefectureId,
          age: filteredUsers[i].age,
          avatars: avatars,
          verify: filteredUsers[i].verifyed,
          favouriteText: filteredUsers[i].favoriteDescription,
          favouriteImage: filteredUsers[i].favoriteImage
        }
      }
      result.sort((a, b) => {
        if (a.prefectureId === myself.prefectureId && b.prefectureId !== myself.prefectureId || a.verify && !b.verify) {
          return -1; // a comes first
        } else if (a.prefectureId !== myself.prefectureId && b.prefectureId === myself.prefectureId || !a.verify && b.verify) {
          return 1;  // b comes first
        } else {
          return 0;  // maintain relative order of other elements
        }
      });
      res.status(200).json(result);
    } else {
      res.status(400).json("No Users");
    }
  } catch (error) {
    res.status(500).json({
      message: error.message || ''
    })
  }
}

exports.searchSwipeusers = async (req, res) => {
  try {
    const userId= parseInt(req.body.userId);
    const minAge= parseInt(req.body.minAge);
    const maxAge= parseInt(req.body.maxAge);
    const minHeight= parseInt(req.body.minHeight);
    const maxHeight= parseInt(req.body.maxHeight);
    const prefectureIds = JSON.parse(req.body.prefectureIds);
    const bodyTypes = JSON.parse(req.body.bodyTypes);
    const maritalHistories = JSON.parse(req.body.maritalHistories);
    const attitues = JSON.parse(req.body.attitues);
    const myself = await User.findOne({
      where:{
        id: userId
      }
    });
    const users = await User.findAll({});
    const likes = await Like.findAll({
      where:{
        userId: userId
      }
    });
    const blocks = await Block.findAll({
      where:{
        userId: userId
      }
    });
    const matchings = await Matching.findAll({});
    const checkLike = (userId) =>{
      if (likes) {
        for (let i = 0; i < likes.length; i++) {
          if (likes[i].received_id == userId) {
            return false;
          }
        }
        return true;
      }else{
        return true;
      }
    }
    const checkBlock = (userId) =>{
      if (blocks) {
        for (let i = 0; i < blocks.length; i++) {
          if (blocks[i].blockedUserId == userId) {
            return false;
          }
        }
        return true;
      }else{
        return true;
      }
    }
    const checkMatching = (userId) =>{
      if (matchings) {
        for (let i = 0; i < matchings.length; i++) {
          if (matchings[i].maleId == myself.id && matchings[i].femaleId == userId || matchings[i].femaleId == myself.id && matchings[i].maleId == userId) {
            return false;
          }
        }
        return true;
      }else{
        return true;
      }
    }
    let result = [];
    let filteredUsers = [];
    for (let i = 0; i < users.length; i++) {
      if (users[i] != userId && users[i].gender != myself.gender && checkLike(users[i].id) && checkBlock(users[i].id) && checkMatching(users[i].id)) {
        filteredUsers.push(users[i]);
      }
    }
    if (filteredUsers.length != 0) {
      for (let i = 0; i < filteredUsers.length; i++) {
        let avatars = [];
        if (filteredUsers[i].avatar1 != null) {
          avatars.push(filteredUsers[i].avatar1)
        } 
        if (filteredUsers[i].avatar2 != null) {
          avatars.push(filteredUsers[i].avatar2)
        } 
        if (filteredUsers[i].avatar3 != null) {
          avatars.push(filteredUsers[i].avatar3)
        } 
        if (filteredUsers[i].avatar4 != null) {
          avatars.push(filteredUsers[i].avatar4)
        } 
        result[i] = {
          id: filteredUsers[i].id,
          name: filteredUsers[i].name,
          description: null,
          prefectureId: filteredUsers[i].prefectureId,
          age: filteredUsers[i].age,
          avatars: avatars,
          verify: filteredUsers[i].verifyed,
          favouriteText: filteredUsers[i].favoriteDescription,
          favouriteImage: filteredUsers[i].favoriteImage,
          bodyType: filteredUsers[i].bodyType,
          materialHistory: filteredUsers[i].materialHistory,
          attitude: filteredUsers[i].attitude
        }
      }
      result.sort((a, b) => {
        if (a.prefectureId === myself.prefectureId && b.prefectureId !== myself.prefectureId || a.verify && !b.verify) {
          return -1; // a comes first
        } else if (a.prefectureId !== myself.prefectureId && b.prefectureId === myself.prefectureId || !a.verify && b.verify) {
          return 1;  // b comes first
        } else {
          return 0;  // maintain relative order of other elements
        }
      });
      result = result.filter((item)=>(item.age >= minAge && item.age <= maxAge || item.height >= minHeight && item.height <= maxHeight || prefectureIds.includes(item.prefectureId) || bodyTypes.includes(item.bodyType) || maritalHistories.includes(item.materialHistory) || attitues.includes(item.attitude)))
      res.status(200).json(result);
    } else {
      res.status(400).json("No Users");
    }
  } catch (error) {
    res.status(500).json({
      message: error.message || ''
    })
  }
}

exports.getMatchedUsers = async (req, res) => {
  try {
    const userId= req.query.userId;
    const user = await User.findOne({
      where:{
        id:userId
      }
    });
    if (user.gender == 1) {
      const matching = await Matching.findAll({
        where:{
          maleId: userId,
          ischatting: false
        }
      })
      console.log(matching);
      
      let result = [];
      for (let i = 0; i < matching.length; i++) {
        const female = await User.findOne({
          where:{
            id: matching[i].femaleId
          }
        });
        result[i] = {
          id: female.id,
          name: female.name,
          age: female.age,
          prefectureId: female.prefectureId,
          avatar: female.avatar1,
          time: (matching[i].createdAt).toString() 
        }
        if (result.length != 0) {
          res.status(200).json(result);
        } else {
          res.status(400).json("No Users");
        }
      }
    } else {
      const matching = await Matching.findAll({
        where:{
          femaleId: userId,
          ischatting: false
        }
      })
      let result = [];
      for (let i = 0; i < matching.length; i++) {
        const male = await User.findOne({
          where:{
            id: matching[i].maleId
          }
        });
        result[i] = {
          id: male.id,
          name: male.name,
          age: male.age,
          prefectureId: male.prefectureId,
          avatar: male.avatar1,
          time: (matching[i].createdAt).toString() 
        }
        if (result.length != 0) {
          res.status(200).json(result);
        } else {
          res.status(400).json("No Users");
        }
      }
    }
  } catch (error) {
    res.status(500).json({
      message: error.message || ''
    })
  }
}

exports.getPhrase = async (req, res) => {
  try {
    const userId= req.query.userId;
    const user = await User.findOne({
      where:{
        id:userId
      }
    });
    if (user) {
      const result = [
        {
          id: 1,
          text: user.phrase1
        },
        {
          id: 2,
          text: user.phrase2
        },
        {
          id: 3,
          text: user.phrase3
        }
      ];
      res.status(200).json(result);
    } else {
      res.status(400).json("No Users");
    }
  } catch (error) {
    res.status(500).json({
      message: error.message || ''
    })
  }
}

exports.updatePhrase = async (req, res) => {
  try {
    const userId= parseInt(req.body.userId);
    const id= parseInt(req.body.id);
    const user = await User.findOne({
      where:{
        id:userId
      }
    });
    if (user) {
      if (id == 1) {
        user.phrase1 = req.body.text;
      }
      if (id == 2) {
        user.phrase2 = req.body.text;
      }
      if (id == 3) {
        user.phrase3 = req.body.text;
      }
      user.save();
      res.status(200).json("success!");
    } else {
      res.status(400).json("No Users");
    }
  } catch (error) {
    res.status(500).json({
      message: error.message || ''
    })
  }
}

exports.adviceRequest = async (req, res) => {
  try {
    const userId= parseInt(req.body.userId);
    const partnerId= parseInt(req.body.partnerId);
    const request = await Request.findOne({
      where:{
        userId: userId,
        partnerId: partnerId
      }
    });
    if (!request) {
      Request.create({
        userId: userId,
        partnerId: partnerId,
        state: "request"
      });
      res.status(200).json("success!")
    } else {
      res.status(400).json("No Users");
    }
  } catch (error) {
    res.status(500).json({
      message: error.message || ''
    })
  }
}

exports.getAdviceState = async (req, res) => {
  try {
    const userId= req.query.userId;
    const partnerId = req.query.partnerId
    const request = await Request.findOne({
      where:{
        userId: userId,
        partnerId: partnerId
      }
    });
    if (request) {
      res.status(200).json({
        state: request.state,
        answer: request.answer
      });
    } else {
      res.state(400).json("No request");
    }
  } catch (error) {
    res.status(500).json({
      message: error.message || ''
    })
  }
}

exports.getVerifyState = async (req, res) => {
  try {
    const userId= req.query.userId;
    const verify = await Verify.findOne({
      where:{
        userId: userId
      }
    });
    if (verify && verify.showAlert) {
      res.status(200).json({
        state: verify.state,
      });
    } else {
      res.state(400).json("No Verify");
    }
  } catch (error) {
    res.status(500).json({
      message: error.message || ''
    })
  }
}

exports.checkedVerifystate = async (req, res) => {
  try {
    const userId= parseInt(req.body.userId);
    const verify = await Verify.findOne({
      where:{
        userId: userId
      }
    });
    if (verify) {
      verify.showAlert = false;
      verify.save();  
    }
    res.status(200).json("Checked!");
  } catch (error) {
    res.status(500).json({
      message: error.message || ''
    })
  }
}