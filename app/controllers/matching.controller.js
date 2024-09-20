const axios = require('axios')
const { format } = require('date-fns')
const db = require('../models')
const { query } = require('express-validator')
const Op = db.Sequelize.Op
const Sequelize = db.Sequelize

const fs= require('fs')
const path = require('path')
const { where } = require('sequelize')

const User = db.user
const Matching = db.matching

// Retrieve all campaigns
exports.getAllMatchingList = async (req, res) => {
  try {
    const matching = await Matching.findAll({
      order: [['id', 'DESC']]
    });
    if (matching) {
      let result = [];
      for (let i = 0; i < matching.length; i++) {
        const maleUser = await User.findOne({
          where:{
            id: matching[i].maleId
          }
        });
        const femaleUser = await User.findOne({
          where:{
            id: matching[i].femaleId
          }
        });
        if (maleUser && femaleUser) {
          result.push(
            {
              male: maleUser,
              female: femaleUser,
              machingDate: matching[i].updatedAt
            }
          );
        }
      }
      res.status(200).json(result);
    }else{
      res.status(400).json("Cannot fine Matchng Lists!");
    }
  } catch (error) {
    res.status(500).json({
      message: error.message || ''
    })
  }
}
