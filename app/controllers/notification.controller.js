const axios = require('axios')
const { format } = require('date-fns')
const db = require('../models')
const OneSignal = require('onesignal-node');
const { ONE_SIGNAL_CONFIG }=require("../config/app.config");

const Notification = db.notification

const Op = db.Sequelize.Op
const Sequelize = db.Sequelize
var request = 	require('request');

// Retrieve all campaigns
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      order: [['updatedAt', 'DESC']],
    });
    if (notifications) {
      let result = [];
      for (let i = 0; i < notifications.length; i++) {
        result[i] = {
          id: notifications[i].id,
          title: notifications[i].title,
          content: notifications[i].content
        }
      }
      res.status(200).json(result);
    } else {
      res.status(400).json("No Notification");
    } 
  } catch (error) {
    res.status(500).json({
      message: error.message || 'Some error occurred while retrieving campaigns',
    })
  }
}


