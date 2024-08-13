const axios = require('axios')
const { format } = require('date-fns')
const db = require('../models')
const { where } = require('sequelize')
const { json } = require('body-parser')
const { name } = require('ejs')
const userModel = require('../models/user.model')
const Post = db.post
const User = db.user
const Like = db.like
const Message = db.message
const Op = db.Sequelize.Op
const Sequelize = db.Sequelize


exports.getMyPost = async (req, res) => {
  try {
    const userId =  parseInt(req.query.userId);
    const posts = await Post.findAll({
      where:{
        userId : userId
      },
      include: Message
    });
    const user = await User.findOne({
      where:{
        id:userId
      }
    });
    if(user && posts){
      let result = [];
      for (let i = 0; i < posts.length; i++) {
        result[i] = {
          id: posts[i].id,
          userId: posts[i].userId,
          name: user.name,
          description: posts[i].description,
          prefectureId: user.prefectureId,
          age: user.age,
          avatar: user.avatar1,
          backImage: posts[i].image,
          messageCount: posts[i].messages.length
        }
      }
      res.status(200).json(result)
    }else{
      res.status(400).json("The post doesn't exist.")
    }
  } catch (error) {
    res.status(500).json({
      message: err.message || 'An error occurred while obtaining records.',
    })
  }
}

exports.getPosts = async (req, res) => {
  try {
    const userId =  parseInt(req.query.userId);
    console.log(userId);
    
    const myself = await User.findOne({
      where:{
        id:userId
      }
    });
    const posts = await Post.findAll({
      include: Message
    });
    if(posts){
      let result = [];
      for (let i = 0; i < posts.length; i++) {
        if (posts[i].userId != userId) {
          const user = await User.findOne({
            where:{
              id : posts[i].userId,
            }
          })
          if (user.gender != myself.gender) {
            let flag = false;
            for (let j = 0; j < posts[i].messages.length; j++) {
              if (posts[i].messages[j].senderId == userId) {
                flag = true;
              }
            }
            if(!flag) {
              result.push({
                id: posts[i].id,
                userId: posts[i].userId,
                name: user.name,
                description: posts[i].description,
                prefectureId: user.prefectureId,
                age: user.age,
                avatar: user.avatar1,
                backImage: posts[i].image,
                messageCount: posts[i].messages.length
              });
            }
          }
        }
      }
      res.status(200).json(result)
    }else{
      res.status(400).json("The post doesn't exist.")
    }
  } catch (error) {
    res.status(500).json({
      message: err.message || 'An error occurred while obtaining records.',
    })
  }
}


exports.sendPostMessage = async (req, res) => {
  try {
    const senderId =  parseInt(req.body.senderId);
    const postId =  parseInt(req.body.postId);
    const content = req.body.message
    const post = await Post.findOne({
      where:{
        id: postId
      },
      include: Message
    });
    for (let i = 0; i < post.messages.length; i++) {
      if (post.messages[i].senderId == senderId) {
        res.status(400).json("Your message already exists in this post.")
      }
    }
    const message = await Message.create({
      senderId : senderId,
      content: content
    });
    await post.addMessage(message, {through: { selfGranted: false }});  
    res.status(200).json("success!")
  } catch (error) {
    res.status(500).json({
      message: err.message || 'An error occurred while obtaining records.',
    })
  }
}

exports.getPostMessageList = async (req, res) => {
  try {
    const postId = parseInt(req.query.postId);
    const post = await Post.findOne({
      where:{
        id: postId
      },
      include: Message
    });
    if(post){
      let result = [];
      for (let i = 0; i < post.messages.length; i++) {
        const senderId = post.messages[i].senderId;
        const content = post.messages[i].content;
        const user = await User.findOne({
          where:{
            id:senderId
          }
        });
        if (user) {
          result[i] = {
            id: postId,
            senderId: senderId,
            name: user.name,
            prefectureId: user.prefectureId,
            age: user.age,
            content: content,
            avatarImage: user.avatar1
          }
        }else{
          res.status(400).json("The post doesn't exist.")
        }
      }
      res.status(200).json(result)
    }else{
      res.status(400).json("The post doesn't exist.")
    }
  } catch (error) {
    res.status(500).json({
      message: err.message || 'An error occurred while obtaining records.',
    })
  }
}
