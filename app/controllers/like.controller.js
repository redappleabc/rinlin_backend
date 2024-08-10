const axios = require('axios')
const { format } = require('date-fns')
const db = require('../models')
const { where } = require('sequelize')
const { json } = require('body-parser')
const Record = db.record
const User = db.user
const Like = db.like
const Op = db.Sequelize.Op
const Sequelize = db.Sequelize

// Retrieve all campaigns
exports.sendLike = async (req, res) => {
  try {
    const userId =  parseInt(req.body.userId);
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
    }
    res.status(200).json("success!")
  } catch (error) {
    res.status(500).json({
      message: err.message || 'An error occurred while obtaining records.',
    })
  }
}


