const axios = require('axios')
const { format } = require('date-fns')
const db = require('../models')
const { where } = require('sequelize')
const { json } = require('body-parser')
const { name } = require('ejs')
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
    const posts = await Post.findAll({
      include: Message
    });
    if(posts){
      let result = [];
      for (let i = 0; i < posts.length; i++) {
        if (posts[i].userId != userId) {
          const user = await User.findOne({
            where:{
              id : posts[i].userId
            }
          })
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

