const axios = require('axios')
const { format } = require('date-fns')
const db = require('../models')
const { where } = require('sequelize')
const { json } = require('body-parser')
const { verify } = require('crypto')
const User = db.user
const Block = db.block
const Op = db.Sequelize.Op
const Sequelize = db.Sequelize

exports.getBlockList = async (req, res) => {
  try {
    const userId = req.query.userId;
    const blocks = await Block.findAll({
      where:{
        userId: userId
      }
    });
    if (blocks) {
      let result = [];
      for (let i = 0; i < blocks.length; i++) {
        const user = await User.findOne({
          where:{
            id: blocks[i].blockedUserId
          }
        });
        if (user) {
          result.push({
            id: user.id,
            avatar: user.avatar1,
            name: user.name,
            age: user.age,
            prefectureId: user.prefectureId
          });
        }
      }
      res.status(200).json(result);
    } else {
      res.status(400).json("No Blocks");
    }
    
  } catch (error) {
    res.status(500).json({
      message: err.message || 'An error occurred while obtaining records.',
    })
  }
}

exports.removeBlock = async (req, res) => {
  try {
    const userId = parseInt(req.body.userId);
    const blockedUserId = parseInt(req.body.blockedUserId);
    const block = await Block.findOne({
      where:{
        userId: userId,
        blockedUserId: blockedUserId
      }
    });
    if (block) {
      block.destroy();
    }
    res.status(200).json("deleted success!");
  } catch (error) {
    res.status(500).json({
      message: err.message || 'An error occurred while obtaining records.',
    })
  }
}

