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
exports.saveRecord = async (req, res) => {
  try {
    const userId =  parseInt(req.body.userId);
    const visiterId = parseInt(req.body.visiterId);
    if (userId != visiterId) {
      const record = await Record.findOne({
        where:{
          userId : userId,
          visiterId : visiterId
        },
        order: [['id', 'ASC']]
      });
      if (!record) {
        Record.create({
          visiterId: visiterId,
          userId: userId,
        });
      }
    }
    res.status(200).json("success!")
  } catch (error) {
    res.status(500).json({
      message: err.message || 'An error occurred while obtaining records.',
    })
  }
}

exports.getRecord = async (req, res) => {
  try {
    const userId =  parseInt(req.query.userId);
    const records = await Record.findAll({
      where:{
        userId : userId
      },
      order: [['id', 'ASC']]
    });
    let result = [];
    for (let i = 0; i < records.length; i++) {
      const user = await User.findOne({
        where:{
          id: records[i].visiterId
        }
      })
      const like = await Like.findOne({
        where:{
          received_id : user.id
        }
      })
      if (!like) {
        result[i] = {
          id:user.id,
          avatar : user.avatar1,
          name: user.name,
          age: user.age,
          prefectureId: user.prefectureId
        }
      }
    }
    res.status(200).json(result)
  } catch (error) {
    res.status(500).json({
      message: err.message || 'An error occurred while obtaining records.',
    })
  }
}

