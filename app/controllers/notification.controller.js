const axios = require('axios')
const { format } = require('date-fns')
const db = require('../models')
const OneSignal = require('onesignal-node');
const { ONE_SIGNAL_CONFIG }=require("../config/app.config");

const Notification = db.notification
const User = db.user

const Op = db.Sequelize.Op
const Sequelize = db.Sequelize
var request = 	require('request');
const { where } = require('sequelize');

// Retrieve all campaigns
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      include: User,
      order: [['updatedAt', 'DESC']],
    });
    if (notifications) {
      let result = [];
      for (let i = 0; i < notifications.length; i++) {
        let usersArray = [];
        for (let j = 0; j < notifications[i].users.length; j++) {
          usersArray[j] = notifications[i].users[j].id
        }
        result[i] = {
          id: notifications[i].id,
          title: notifications[i].title,
          content: notifications[i].content,
          usersArray: usersArray
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

exports.addUserToNotification = async (req, res) => {
  try {
    const userId = parseInt(req.body.userId);
    const notificationId = parseInt(req.body.notificationId);
    const user = await User.findOne({
      where:{
        id: userId
      }
    });
    const notification = await Notification.findOne({
      where:{
        id: notificationId
      },
      include: User,
    });
    if (user && notification) {
      console.log("-------------------------");
      
      await notification.addUser(user, {through: { selfGranted: false }})
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


