const axios = require('axios')
const { format } = require('date-fns')
const db = require('../models')
const crypto = require('crypto');
const moment = require('moment-timezone');
const { where } = require('sequelize');
const jwt = require("jsonwebtoken");
const { group } = require('console');
const { json } = require('body-parser');

const User = db.user
const Group = db.group

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

exports.removeGroups = async (req, res) => {
  try {
    const userId = parseInt(req.body.id);
    const removeGroups = JSON.parse(req.body.removeGroups)
    const user = await User.findOne({
      where:{
        id: userId
      },
      include: Group
    });
    if (user) {
      for (let i = 0; i < removeGroups.length; i++) {
        for (let j = 0; j < user.groups.length; j++) {
          if (user.groups[j].id == removeGroups[i]) {
            user.groups[j].destroy()
          }
        }
      }
    }
    res.status(200).json("Successfully deleted!");
  } catch (error) {
    res.status(500).json({
      message: error.message || ''
    })
  }
}
// exports.isPay=async(req, res)=>{
//   try {
//     var email=JSON.parse(req.body.email);
//     console.log(email);
//     const user=await User.findOne({
//       where: {
//         email:email
//       }
//     });
//     if(user && !user.is_pay){
//       console.log(user)
//       user.destroy();
//       res.status(400).json("destroied");
//     }
//     if(!user){
//       res.status(400).json("noUser");
//     }
//     if(user && user.is_pay){
//       res.status(200).json("checkedUser");
//     }
//   } catch (error) {
//     res.status(500).json({
//       message: error.message || ''
//     })
//   }
// }

// exports.checkUser=async(req, res)=>{
//   try {
//     var email=JSON.parse(req.body.email);
//     console.log(email);
//     const user=await User.findOne({
//       where: {
//         email:email
//       }
//     });
//     if(user){
//       // console.log(user)
//       res.status(200).json("checkedUser");
//     }else{
//       res.status(400).json("noUser");
//     }
//   } catch (error) {
//     res.status(500).json({
//       message: error.message || ''
//     })
//   }
// }

// exports.addPlan=async(req, res)=>{
//   try {
//     var email=JSON.parse(req.body.email);
//     // var plan=JSON.parse(req.body.plan);
//     const currentTime = moment.tz(Date.now(), 'Asia/Tokyo');
//     const deadline = currentTime.add(7, 'days').toDate();

//     console.log(deadline);
//     const user=await User.findOne({
//       where: {
//         email: email
//       }
//     });
//     if(req.body.plan){
//       user.plan = "無料期間";
//       user.is_pay = false;
//       user.deadline = deadline;
//     }
//     user.save();
//     const statehistory=await StateHistory.create({
//       status: user.plan,
//       amount: 0,
//       userId: user.id
//     });
//     res.status(200).json("success");
//   } catch (error) {
//     res.status(500).json({
//       message: error.message || ''
//     })
//   }
// }
// exports.setNotification=async(req, res)=>{
//   console.log(req.body);
//   try {
//     const user=await User.update({ notification: req.body.notification }, {
//       where: {
//         email: req.body.email
//       }
//     });
//     return res.status(200).json("success")
//   } catch (error) {
//     res.status(500).json({
//       message: error.message || ''
//     })
//   }
// }
// exports.accountDelete=async(req, res)=>{
//   console.log(req.query);
//   try {
//     const user=await User.findOne({
//       where: {
//           email: req.query.email
//         },
//         order: [['email', 'DESC']],
//       });
//       // user.id_deleted=true;
//       // user.save();

//     const user_reasons=await User.findOne({
//       where:{
//         email:req.query.email
//       },
//       include: Reason
//     });
//     const reason=[];
//     for(let i=0;i<user_reasons.reasons.length;i++){
//       reason[i]=await Reason.findOne({
//         where:{
//           id:user_reasons.reasons[i].id
//         },
//         order:[['id','DESC']],
//       });
//       await user_reasons.removeReason(([reason[i]]))
//     }
//     const user_introductions=await User.findOne({
//       where:{
//         email:req.query.email
//       },
//       include: Introduction
//     });
//     const introduction=[];
//     for(let i=0;i<user_introductions.introductions.length;i++){
//       introduction[i]=await Introduction.findOne({
//         where:{
//           id:user_introductions.introductions[i].id
//         },
//         order:[['id','DESC']],
//       });
//       await user_introductions.removeIntroduction(([introduction[i]]))
//     }
//     const user_likes=await Like.findAll({
//       where:{
//         userId:user.id
//       }
//     });
//     for(let i=0;i<user_likes.length;i++){
//       user_likes[i].destroy();
//     }

//     const user_plays=await Play.findAll({
//       where:{
//         userId:user.id
//       }
//     });
//     for(let i=0;i<user_plays.length;i++){
//       user_plays[i].destroy();
//     }

//     const user_downloads=await Download.findAll({
//       where:{
//         userId:user.id
//       }
//     });
//     for(let i=0;i<user_downloads.length;i++){
//       user_downloads[i].destroy();
//     }
//      user.destroy();
//     return res.status(200).json("Success")
//   } catch (error) {
//     res.status(500).json({
//       message: error.message || ''
//     })
//   }
// }

// exports.accountOnlyDelete=async(req, res)=>{
//   console.log(req.query);
//   try {
//     const user=await User.findOne({
//       where: {
//           email: req.query.email
//         },
//         order: [['email', 'DESC']],
//       });
//       const user_reasons=await User.findOne({
//         where:{
//           email:req.query.email
//         },
//         include: Reason
//       });
//       const reason=[];
//       for(let i=0;i<user_reasons.reasons.length;i++){
//         reason[i]=await Reason.findOne({
//           where:{
//             id:user_reasons.reasons[i].id
//           },
//           order:[['id','DESC']],
//         });
//         await user_reasons.removeReason(([reason[i]]))
//       }
//       const user_introductions=await User.findOne({
//         where:{
//           email:req.query.email
//         },
//         include: Introduction
//       });
//       const introduction=[];
//       for(let i=0;i<user_introductions.introductions.length;i++){
//         introduction[i]=await Introduction.findOne({
//           where:{
//             id:user_introductions.introductions[i].id
//           },
//           order:[['id','DESC']],
//         });
//         await user_introductions.removeIntroduction(([introduction[i]]))
//       }
//     const user_likes=await Like.findAll({
//       where:{
//         userId:user.id
//       }
//     });
//     for(let i=0;i<user_likes.length;i++){
//       user_likes[i].destroy();
//     }

//     const user_plays=await Play.findAll({
//       where:{
//         userId:user.id
//       }
//     });
//     for(let i=0;i<user_plays.length;i++){
//       user_plays[i].destroy();
//     }

//     const user_downloads=await Download.findAll({
//       where:{
//         userId:user.id
//       }
//     });
//     for(let i=0;i<user_downloads.length;i++){
//       user_downloads[i].destroy();
//     }
//     // user.id_deleted=true
//     // user.save()
//     user.destroy()
//     return res.status(200).json(user)
//   } catch (error) {
//     res.status(500).json({
//       message: error.message || ''
//     })
//   }
// }

// exports.emailVerify=async(req, res)=>{
//   console.log(req.body);
//   try {
//     const user = await User.findOne({
//       where:{
//         email:req.body.email
//       }
//     });
//     if(user.verifycode!=req.body.verifycode){
//       return res.status(400).json("The Verification code is incorrect.");
//     }
//     return res.status(200).json("success")
//   } catch (error) {
//     res.status(500).json({
//       message: error.message || ''
//     })
//   }
// }

// // --------------admin--------------
// exports.getAll = async (req, res) => {
//   const users = await User.findAll({
//     // order: [['recId', 'ASC']],
//     // group: "campaignId",
//   })
//     .then((data) => {
//       res.json(data)
//     })
//     .catch((err) => {
//       res.status(500).json({
//         message: err.message || 'Some error occurred while retrieving campaigns',
//       })
//     })
// }

// exports.getOne = async (req, res) => {
//   const users = await User.findOne({
//     where:{
//       email:req.query.email
//     },
//     order: [['email', 'ASC']],
//   })
//     .then((data) => {
//       res.json(data)
//     })
//     .catch((err) => {
//       res.status(500).json({
//         message: err.message || 'Some error occurred while retrieving campaigns',
//       })
//     })
// }

// exports.getOneReason = async (req, res) => {
//   try {
//     // console.log(req.query.id)
//     var user = await User.findOne({
//       where:{
//         id:req.query.id
//       },
//       include:Reason,
//     });
//     return res.status(200).json(user)
//   } catch (error) {
//     res.status(500).json({
//       message: error.message || ''
//     })
//   }
// }

// exports.getOneIntroduction = async (req, res) => {
//   try {
//     // console.log(req.query.id)
//     var user = await User.findOne({
//       where:{
//         id:req.query.id
//       },
//       include:Introduction,
//     });
//     return res.status(200).json(user)
//   } catch (error) {
//     res.status(500).json({
//       message: error.message || ''
//     })
//   }
// }

// exports.getStatus = async (req, res) => {
//   try {
//     // console.log(req.query.id)
//     var statehistory = await StateHistory.findAll({
//       where:{
//         userId:req.query.id
//       }
//     });
//     // console.log(statehistory)
//     return res.status(200).json(statehistory)
//   } catch (error) {
//     res.status(500).json({
//       message: error.message || ''
//     })
//   }
// }

// exports.getTiping = async (req, res) => {
//   try {
//     // console.log(req.query.id)
//     var give = await Give.findAll({
//       where:{
//         userId:req.query.id
//       },
//       include:Item
//     });
//     // console.log(give)
//     return res.status(200).json(give)
//   } catch (error) {
//     res.status(500).json({
//       message: error.message || ''
//     })
//   }
// }

// exports.getName = async (req, res) => {
//   try {
//     // console.log(req.query.id)
//     var user = await User.findOne({
//       where:{
//         email:req.query.email
//       }
//     });
//     //  console.log(user)
//     return res.status(200).json(user.name)
//   } catch (error) {
//     res.status(500).json({
//       message: error.message || ''
//     })
//   }
// }

// exports.getAllSub = async (req, res) => {
//   try {
//     // console.log(req.query.id)
//     const result = [];
//     const payment = [];
//     var k=0;
//     const users = await User.findAll({});
//     for(let i = 0 ; i < users.length ; i ++){
//        const histories = await StateHistory.findAll({
//         where:{
//           userId:users[i].id
//         }
//        });
//       if(histories){
//         for(let j=0;j<histories.length;j++){
//           result[k++]={
//             id:users[i].id,
//             name:users[i].name,
//             email:users[i].email,
//             paymentDate:histories[j].createdAt,
//             payment:histories[j].amount
//           }
//         }
//       }
//     }
//     // console.log(give)
//     return res.status(200).json(result)
//   } catch (error) {
//     res.status(500).json({
//       message: error.message || ''
//     })
//   }
// }

// exports.getAllGiveList = async (req, res) => {
//   try {
//     // console.log(req.query.id)
//     const result=[];
//     const gives=await Give.findAll({});
//     if(gives){
//       for(let i=0;i<gives.length;i++){
//         const user=await User.findOne({
//           where:{
//             id:gives[i].userId
//           }
//         });
//         console.log(user);
//         const item=await Item.findOne({
//           where:{
//             id:gives[i].itemId
//           }
//         });
//         result[i] = {
//           userId:gives[i].userId,
//           name:user.name,
//           email:user.email,
//           contentId:gives[i].itemId,
//           temple:item.temple,
//           amount:gives[i].amount,
//           paymentdate:gives[i].createdAt
//         }
//       }
//     }
//     // return res.status(200).json('result')
//      return res.status(200).json(result)
//   } catch (error) {
//     res.status(500).json({
//       message: error.message || ''
//     })
//   }
// }

// exports.getUserPlan = async (req, res) => {
//   try {
//     const user = await User.findOne({
//       where:{
//         email:req.query.email
//       },
//       order: [['email', 'ASC']],
//     });
//     if(user){
//       const currentTime = moment.tz(Date.now(), 'Asia/Tokyo');
//       console.log(currentTime.toDate())
//       if(currentTime.toDate() >= user.deadline){
//         user.plan_end=true;
//         user.save();
//         var plans=[];
//         var statehistorys = await StateHistory.findAll({
//           where:{
//             userId:user.id
//           },
//           order: [['id', 'ASC']],
//         });
//         if(statehistorys){
//           for(let i=0; i<statehistorys.length; i++){
//             if(statehistorys[i].startDate > user.deadline && user.plan_end){
//               user.plan = statehistorys[i].status;
//               user.deadline = statehistorys[i].endDate;
//               user.plan_end=false;
//               user.save();
//               break;
//             }
//           }
//         }
//       }
//     }
    
//     const date = moment(user.deadline).tz('Asia/Tokyo');
//     var result = {
//       id:user.id,
//       name:user.name,
//       plan:user.plan,
//       deadline:user.deadline,
//       jpRegisteredDate: moment(user.createdAt).tz('Asia/Tokyo').format('YYYY年MM月D日 h:mm A'),
//       jpConvertDeadline:date.format('YYYY年MM月D日 h:mm A'),
//       enRegisteredDate: moment(user.createdAt).tz('Asia/Tokyo').format("MMM D, YYYY, h:mm A"),
//       enConvertDeadline:moment(user.deadline).tz('Asia/Tokyo').format("MMM D, YYYY, h:mm A"),
//     };
//     if(user.plan=="無料期間"){
//       const currentTime = moment.tz(Date.now(), 'Asia/Tokyo');
//       const daysDifference = moment(user.deadline).diff(currentTime, 'days');
//       result.subDay=(daysDifference+1).toString();
//     }
//     return res.status(200).json(result);
//   } catch (error) {
//     res.status(500).json({
//       message: error.message || '',
//     })
//   }
  
// }