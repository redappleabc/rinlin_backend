const axios = require('axios')
const { format } = require('date-fns')
const db = require('../models')
const { where } = require('sequelize')
const { json } = require('body-parser')
const { ONE_SIGNAL_CONFIG }=require("../config/app.config");
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
    const user = await User.findOne({
      where:{
        id: userId
      }
    });
    if (userId != visiterId) {
      const record = await Record.findOne({
        where:{
          userId : userId,
          visiterId : visiterId
        },
        order: [['id', 'DESC']]
      });
      if (!record) {
        Record.create({
          visiterId: visiterId,
          userId: userId,
        });
        if (user.viewUsers) {
          user.viewUsers = user.viewUsers + 1;
        } else {
          user.viewUsers = 1;
        }
        user.save();
        if (user) {
          const notificationData = {
            app_id: ONE_SIGNAL_CONFIG.APP_ID,           // Your OneSignal App ID
            include_aliases:{
              onesignal_id: [
                user.onesignalId,
              ]
            },       // The Player IDs (specific devices)
            target_channel:"push",
            headings: { en: "リンリン" },             // Notification title
            contents: { en: `足跡がつきました！確認してみよう！` },           // Notification message
            data: {
              screen: "record",
            },                // Optional additional data (useful for handling clicks or app events)
          };
          try {
            const response = await axios.post('https://onesignal.com/api/v1/notifications', notificationData, {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${ONE_SIGNAL_CONFIG.API_KEY}`,  // Use your REST API key here
              },
            });
            console.log('Notification sent successfully:', response.data);
          } catch (error) {
            console.error('Error sending notification:', error.response ? error.response.data : error.message);
          }
        }
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
      order: [['id', 'DESC']]
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
        result.push({
          id:user.id,
          avatar : user.avatar1,
          name: user.name,
          age: user.age,
          prefectureId: user.prefectureId
        });
      }
    }
    res.status(200).json(result)
  } catch (error) {
    res.status(500).json({
      message: err.message || 'An error occurred while obtaining records.',
    })
  }
}

