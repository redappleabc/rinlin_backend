const axios = require('axios')
require('dotenv').config();
const express = require('express');
const { format } = require('date-fns')
const db = require('../models')
const stripe = require('stripe')(process.env.SK_KEY);
const moment = require('moment-timezone');


const User = db.user
const StateHistory = db.statehistory
const Give = db.give

const Op = db.Sequelize.Op
const Sequelize = db.Sequelize
var request = require('request');
const { where } = require('sequelize');

exports.createPaymentIntents = async (req, res) => {
  const { amount, paymentIntentId, userId, type, itemId } = req.body;
  try {
    const user = await User.findOne({
      where: {
        id: userId,
      }
    });
    if (user) {
      if (type == "first") {
        switch (parseInt(amount)) {
          case 980:
            {
              user.is_pay = true;
              // user.deadline = currentTime.add(1, 'month').toDate();
              const statehistory = await StateHistory.create({
                status: "月額プラン",
                amount: 980,
                startDate: moment(user.deadline).add(1, 'minutes').toDate(),
                endDate: moment(user.deadline).add(1, 'month').toDate(),
                userId: user.id,
                paymentIntentId: paymentIntentId
              });
              break;
            }
          case 9800:
            {
              user.is_pay = true;
              // user.deadline = currentTime.add(1, 'years').toDate();
              const statehistory = await StateHistory.create({
                status: "年額プラン",
                amount: 9800,
                startDate: moment(user.deadline).add(1, 'minutes').toDate(),
                endDate: moment(user.deadline).add(1, 'years').toDate(),
                userId: user.id,
                paymentIntentId: paymentIntentId
              });
              break;
            }
          default:
            break;
        }
        user.save();
      }
      if (type == "add_plan") {
        switch (parseInt(amount)) {
          case 980:
            {
              const history = await StateHistory.findOne({
                where: {
                  userId: user.id
                },
                order: [['id', 'DESC']],
              })
              const statehistory = await StateHistory.create({
                status: "月額プラン",
                amount: 980,
                startDate: moment(history.endDate).add(1, 'minutes').toDate(),
                endDate: moment(history.endDate).add(1, 'minutes').add(1, 'month').toDate(),
                userId: user.id,
                paymentIntentId: paymentIntentId
              });
              break;
            }
          case 9800:
            {
              const history = await StateHistory.findOne({
                where: {
                  userId: user.id
                },
                order: [['id', 'DESC']],
              })
              console.log(moment(history.endDate));
              const statehistory = await StateHistory.create({
                status: "年額プラン",
                amount: 9800,
                startDate: moment(history.endDate).add(1, 'minutes').toDate(),
                endDate: moment(history.endDate).add(1, 'minutes').add(1, 'years').toDate(),
                userId: user.id,
                paymentIntentId: paymentIntentId
              });
              break;
            }
          default:
            break;
        }
        user.save();
      }
      if (type == "give") {
        const give = await Give.create({
          userId: user.id,
          itemId: itemId,
          amount: amount
        });
      }
    } else {
      res.status(404).send({ error: 'User not exist' });
    }
    return res.status(200).json("success");
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
}

exports.createRefundIntents = async (req, res) => {
  // const { amount, currency, metadata } = req.body;
  console.log(req.body);
  try {
    const user = await User.findOne({
      where: {
        email: req.body.email
      }
    });
    if (user) {
      const histories = await StateHistory.findAll({
        where: {
          userId: user.id
        },
        order: [['id', 'ASC']],
      });
      const currentTime = moment.tz(Date.now(), 'Asia/Tokyo');
      if (histories) {
        console.log(histories)
        for (let i = 0; i < histories.length; i++) {
          if (histories[i].status != "無料期間" && histories[i].refunded != true && histories[i].paymentIntentId != "") {
            if (histories[i].endDate > currentTime.toDate()) {
              if (histories[i].startDate >= currentTime.toDate()) {
                console.log("first");
                const refund = await stripe.refunds.create({
                  payment_intent: histories[i].paymentIntentId,
                });
              } else {
                const totalDuration = moment(histories[i].endDate).diff(moment(histories[i].startDate));
                const elapsedDuration = moment().diff(moment(histories[i].startDate));
                const percentage = ((elapsedDuration / totalDuration)).toFixed(2);
                console.log(percentage);
                const refund = await stripe.refunds.create({
                  payment_intent: histories[i].paymentIntentId,
                  amount: parseInt(histories[i].amount * percentage)
                });
              }
              histories[i].refunded = true;
              histories[i].save();
            }
            user.plan = "";
            user.save();
          }
        }
      }
    }
    return res.status(200).json("success");
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
}

// exports.eventProcess = async (req, res) => {
//   try {
//     if(req.body.type=='charge.succeeded'){
//       var userData = req.body.data.object.metadata;
//       var paymentIntent = req.body.data.object.payment_intent;
//       console.log("========>", userData);
//       const amount = req.body.data.object.amount;
//       const user = await User.findOne({
//         where:{
//           id:userData.user_id,
//           name:userData.user_name,
//           email:userData.user_email,
//         }
//       });
//       if(userData.pay_type == "first_plan"){
//         if(user){
//           switch (amount) {
//             case 980:
//               {
//                 user.is_pay = true;
//                 // user.deadline = currentTime.add(1, 'month').toDate();
//                 const statehistory=await StateHistory.create({
//                   status: "月額プラン",
//                   amount: 980,
//                   startDate: moment(user.deadline).add(1, 'minutes').toDate(),
//                   endDate: moment(user.deadline).add(1, 'month').toDate(),
//                   userId: user.id,
//                   paymentIntentId:paymentIntent
//                 });
//                 break;
//               }
//             case 9800:
//               {
//                 user.is_pay = true;
//                 // user.deadline = currentTime.add(1, 'years').toDate();
//                 const statehistory=await StateHistory.create({
//                   status: "年額プラン",
//                   amount: 9800,
//                   startDate: moment(user.deadline).add(1, 'minutes').toDate(),
//                   endDate: moment(user.deadline).add(1, 'years').toDate(),
//                   userId: user.id,
//                   paymentIntentId:paymentIntent
//                 });
//                 break;
//               }
//             default:
//               break;
//           }
//           user.save();
//         }
//       }

//       if(userData.pay_type == "add_plan"){
//         console.log(req.body);
//         if(user){
//           const currentTime = moment.tz(Date.now(), 'Asia/Tokyo');
//           switch (amount) {
//             case 980:
//               {
//                     const history=await StateHistory.findOne({
//                       where:{
//                         userId:user.id
//                       },
//                       order: [['id', 'DESC']],
//                     })
//                     const statehistory=await StateHistory.create({
//                       status: "月額プラン",
//                       amount: 980,
//                       startDate: moment(history.endDate).add(1, 'minutes').toDate(),
//                       endDate: moment(history.endDate).add(1, 'minutes').add(1, 'month').toDate(),
//                       userId: user.id,
//                       paymentIntentId:paymentIntent
//                     });
//                 break;
//               }
//             case 9800:
//               {
//                     const history=await StateHistory.findOne({
//                       where:{
//                         userId:user.id
//                       },
//                       order: [['id', 'DESC']],
//                     })
//                     const statehistory=await StateHistory.create({
//                       status: "年額プラン",
//                       amount: 9800,
//                       startDate: moment(history.endDate).add(1, 'minutes').toDate(),
//                       endDate: moment(history.endDate).add(1, 'minutes').add(1, 'years').toDate(),
//                       userId: user.id,
//                       paymentIntentId:paymentIntent
//                     });
//                 break;
//               }
//             default:
//               break;
//           }
//           user.save();
//         }
//       }
//       if(userData.pay_type == "give"){
//         console.log(userData);
//         const give = await Give.create({
//           userId:user.id,
//           itemId:userData.itemId,
//           amount:amount
//         });
//       }
//     res.status(200).json("success")
//     }
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ error: err.message });
//   }
// }
