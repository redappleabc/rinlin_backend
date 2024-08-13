const axios = require('axios')
const { format } = require('date-fns')
const db = require('../models')
const { where } = require('sequelize')
const { json } = require('body-parser')
const { verify } = require('crypto')
const Matching = db.matching
const User = db.user
const Like = db.like
const Post = db.post
const Message = db.message
const Op = db.Sequelize.Op
const Sequelize = db.Sequelize

// Retrieve all campaigns
exports.sendLike = async (req, res) => {
  try {
    const userId =  parseInt(req.body.userId);
    const user = await User.findOne({
      where:{
        id:userId
      }
    });
    const receivedId = parseInt(req.body.receivedId);
    const like = await Like.findOne({
      where:{
        userId: userId,
        received_id: receivedId
      }
    })
    if(!like){
      Like.create({
        userId: userId,
        received_id: receivedId
      });
      user.pointCount = user.pointCount - 1;
    }
    res.status(200).json("success!")
  } catch (error) {
    res.status(500).json({
      message: err.message || 'An error occurred while obtaining records.',
    })
  }
}

exports.skipSwipe = async (req, res) => {
  try {
    const userId =  parseInt(req.body.userId);
    const user = await User.findOne({
      where:{
        id: userId
      }
    })
    if (user) {
      user.pointCount = user.pointCount - 1;
      user.save();
    } else {
      res.status(400).json("No User");
    }
    res.status(200).json("success!");
  } catch (error) {
    res.status(500).json({
      message: err.message || 'An error occurred while obtaining records.',
    })
  }
}

exports.sendMessageLike = async (req, res) => {
  try {
    const userId =  parseInt(req.body.userId);
    const receivedId = parseInt(req.body.receivedId);
    const message = req.body.text;
    const user = await User.findOne({
      where:{
        id: userId
      }
    })
    const like = await Like.findOne({
      where:{
        userId: userId,
        received_id: receivedId
      }
    })
    if(!like){
      Like.create({
        userId: userId,
        received_id: receivedId,
        message: message
      });
      user.pointCount = user.pointCount -1;
    }
    res.status(200).json("success!")
  } catch (error) {
    res.status(500).json({
      message: err.message || 'An error occurred while obtaining records.',
    })
  }
}

exports.getLikeList = async (req, res) => {
  try {
    const userId =  parseInt(req.query.userId);
    const likes = await Like.findAll({
      where:{
        received_id: userId
      }
    })
    if(likes){
      let result = [];
      for (let i = 0; i < likes.length; i++) {
        let user = await User.findOne({
          where:{
            id: likes[i].userId
          }
        });
        console.log("user", user);
        
        if (user) {
          console.log(user.id)
          let avatars = [];
          if (user.avatar1 != null) {
            avatars.push(user.avatar1);
          }
          if (user.avatar2 != null) {
            avatars.push(user.avatar2);
          }
          if (user.avatar3 != null) {
            avatars.push(user.avatar3);
          }
          if (user.avatar4 != null) {
            avatars.push(user.avatar4);
          }
          result.push({
            id: user.id,
            name: user.name,
            description: likes[i].message,
            prefectureId: user.prefectureId, 
            age: user.age,
            avatars: avatars,
            verify: user.verifyed,
            favouriteText: user.favoriteDescription,
            favouriteImage: user.favoriteImage
          }); 
        }
      } 
      console.log(result);
      res.status(200).json(result);
    }else{
      res.status(400).json("No like lists");
    }
  } catch (error) {
    res.status(500).json({
      message: err.message || 'An error occurred while obtaining records.',
    })
  }
}

exports.skipLike = async (req, res) => {
  try {
    const receivedId =  parseInt(req.body.receivedId);
    const userId =  parseInt(req.body.userId);
    const user = await User.findOne({
      where:{
        id: receivedId
      }
    })
    const like = await Like.findOne({
      where:{
        received_id: receivedId,
        userId: userId
      }
    });
    if (like) {
      like.destroy();
    }
    if (user) {
      user.pointCount = user.pointCount - 1;
      user.save();
    } else {
      res.status(400).json("No User");
    }
    res.status(200).json("success!");
  } catch (error) {
    res.status(500).json({
      message: err.message || 'An error occurred while obtaining records.',
    })
  }
}

exports.createMatching = async (req, res) => {
  try {
    const userId =  parseInt(req.body.userId);
    const matchedUserId =  parseInt(req.body.matchedUserId);
    const user = await User.findOne({
      where:{
        id: userId
      }
    });
    if (user) {
      if (user.gender == 1) {
        Matching.create({
          maleId: userId,
          femaleId: matchedUserId
        });
      }
      if (user.gender == 2) {
        Matching.create({
          maleId: matchedUserId,
          femaleId: userId
        });
      }
      const like1 = await Like.findOne({
        where:{
          received_id: userId,
          userId: matchedUserId
        }
      })
      if (like1) {
        like1.destroy();
      }
      const like2 = await Like.findOne({
        where:{
          received_id: userId,
          userId: matchedUserId
        }
      })
      if (like2) {
        like2.destroy();
      }
      const post1 = await Post.findAll({
        where:{
          userId: userId
        },
        include : Message
      });
      if (post1 && post1.length != 0) {
        for (let i = 0; i < post1.length; i++) {
          for (let j = 0; j < post1[i].messages.length; j++) {
            if (post1[i].messages[j].senderId == matchedUserId) {
              post1[i].messages[j].destroy();
            }
          }
        }
      }
      const post2 = await Post.findAll({
        where:{
          userId: matchedUserId
        },
        include : Message
      });
      if (post2 && post2.length != 0) {
        for (let i = 0; i < post2.length; i++) {
          for (let j = 0; j < post2[i].messages.length; j++) {
            if (post2[i].messages[j].senderId == userId) {
              post2[i].messages[j].destroy();
            }
          }
        }
      }
      user.pointCount = user.pointCount - 1;
      res.status(200).json("success!");
    } else {
      res.status(400).json("No User!");
    }
  } catch (error) {
    res.status(500).json({
      message: err.message || 'An error occurred while obtaining records.',
    })
  }
}


