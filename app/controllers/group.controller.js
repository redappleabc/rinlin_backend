const axios = require('axios')
const { format } = require('date-fns')
const db = require('../models')
const { where } = require('sequelize')
const { json } = require('body-parser')
const { name } = require('ejs')
const { verify } = require('crypto')
const Group = db.group
const TopGroup = db.topgroup
const User = db.user
const Category = db.category
const Like = db.like
const Block = db.block
const Matching = db.matching
const Op = db.Sequelize.Op
const Sequelize = db.Sequelize

// Retrieve all campaigns
exports.getAllGroup = async (req, res) => {
  try {
    const groups = await Group.findAll({
      order: [['id', 'ASC']]
    })
    if (groups) {
      let result = [];
      for (let i = 0; i < groups.length; i++) {
        result[i] = {
          id : groups[i].id,
          name : groups[i].name,
          image : groups[i].image,
          members : groups[i].members,
          categoryId : groups[i].categoryId
        }
      }
      res.status(200).json(result)
    } else {
      res.status(400).json("An error occurred while obtaining group information.")
    }
  } catch (error) {
    res.status(500).json({
      message: err.message || 'An error occurred while obtaining group information.',
    })
  }
}

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      order: [['order', 'ASC']]
    })
    if (categories) {
      let result = [];
      for (let i = 0; i < categories.length; i++) {
        result[i] = {
          id : categories[i].id,
          name : categories[i].name,
          image : categories[i].order
        }
      }
      res.status(200).json(result)
    } else {
      res.status(400).json("An error occurred while obtaining category information.")
    }
  } catch (error) {
    res.status(500).json({
      message: err.message || 'An error occurred while obtaining category information.',
    })
  }
}
exports.saveGroups=async(req, res)=>{
  try {
    const len=JSON.parse(req.body.groups).length;
    const user = await User.findOne({
      where:{
        id : req.body.id
      }
    });
    const groupArray = []
    for (let i = 0; i < len; i++) {
      groupArray[i] = await Group.findOne({
        where: {
          id: JSON.parse(req.body.groups)[i]
        }
      });
      await user.addGroup(groupArray[i], {through: { selfGranted: false }});
      groupArray[i].members = groupArray[i].members + 1;
      groupArray[i].save()
    }
    res.status(200).json("success")
  } catch (error) {
    res.status(500).json({
      message: error.message || 'An error occurred while archiving group information.',
    })
  }
}

exports.removeGroups = async (req, res) => {
  try {
    const userId = parseInt(req.body.id);
    const removeGroups = JSON.parse(req.body.removeGroups)
    const user = await User.findOne({
      where:{
        id: userId
      },
      include: Group
    });
    if (user) {
      for (let i = 0; i < removeGroups.length; i++) {
        for (let j = 0; j < user.groups.length; j++) {
          if (user.groups[j].id == removeGroups[i]) {
            user.groups[j].destroy()
            const group = await Group.findOne({
              where:{
                id: removeGroups[i]
              }
            });
            group.members = group.members - 1;
            group.save();
          }
        }
      }
    }
    res.status(200).json("Successfully deleted!");
  } catch (error) {
    res.status(500).json({
      message: error.message || ''
    })
  }
}

exports.getTopGroups = async (req, res) => {
  try {
    const topgroups = await TopGroup.findAll({
      order: [['id', 'ASC']],
    })
    if (topgroups && topgroups.length != 0) {
      let result = [];
      for (let i = 0; i < topgroups.length; i++) {
        const group = await Group.findOne({
          where:{
            id: topgroups[i].groupId
          }
        })
        if (group) {
          result.push({
            id: group.id,
            name: group.name,
            members: group.members,
            thumbnail: group.image,
            categoryId: group.categoryId
          });
        }
      }
      res.status(200).json(result)
    } else {
      res.status(400).json("An error occurred while obtaining group information.")
    }
  } catch (error) {
    res.status(500).json({
      message: err.message || 'An error occurred while obtaining group information.',
    })
  }
}

exports.getAllSwipeGroups = async (req, res) => {
  try {
    const groups = await Group.findAll({
      order: [['id', 'ASC']]
    })
    if (groups) {
      let result = [];
      for (let i = 0; i < groups.length; i++) {
        const topgroups = await TopGroup.findOne({
          where:{
            groupId:groups[i].id
          }
        });
        if (!topgroups) {
          result.push({
            id: groups[i].id,
            name: groups[i].name,
            members: groups[i].members,
            thumbnail: groups[i].image,
            categoryId: groups[i].categoryId
          });
        }
      }
      res.status(200).json(result)
    } else {
      res.status(400).json("An error occurred while obtaining group information.")
    }
  } catch (error) {
    res.status(500).json({
      message: err.message || 'An error occurred while obtaining group information.',
    })
  }
}

exports.getGroupUsers = async (req, res) => {
  try {
    const userId = req.query.userId;
    const groupId = req.query.groupId;
    const myself = await User.findOne({
      where:{
        id: userId
      }
    });
    const group = await Group.findOne({
      where:{
        id: groupId
      },
      order: [['id', 'ASC']],
      include: User
    });
    const likes = await Like.findAll({
      where:{
        userId: userId
      }
    });
    const blocks = await Block.findAll({
      where:{
        userId: userId
      }
    });
    const matchings = await Matching.findAll({});
    const checkLike = (userId) =>{
      if (likes) {
        for (let i = 0; i < likes.length; i++) {
          if (likes[i].received_id == userId) {
            return false;
          }
        }
        return true;
      }else{
        return true;
      }
    }
    const checkBlock = (userId) =>{
      if (blocks) {
        for (let i = 0; i < blocks.length; i++) {
          if (blocks[i].blockedUserId == userId) {
            return false;
          }
        }
        return true;
      }else{
        return true;
      }
    }
    const checkMatching = (userId) =>{
      if (matchings) {
        for (let i = 0; i < matchings.length; i++) {
          if (matchings[i].maleId == myself.id && matchings[i].femaleId == userId || matchings[i].femaleId == myself.id && matchings[i].maleId == userId) {
            return false;
          }
        }
        return true;
      }else{
        return true;
      }
    }
    if (group) {
      let result = [];
      for (let i = 0; i < group.users.length; i++) {
        if (group.users[i].gender != myself.gender && checkLike(group.users[i].id) && checkBlock(group.users[i].id) && checkMatching(group.users[i].id) ) {
          result.push({
            id: group.users[i].id,
            name: group.users[i].name,
            introduction: group.users[i].introduce,
            prefectureId: group.users[i].prefectureId,
            age: group.users[i].age,
            avatar: group.users[i].avatar1,
            verify: group.users[i].verifyed
          });
        }
      }
      result.sort((a, b) => {
        if (a.prefectureId === myself.prefectureId && b.prefectureId !== myself.prefectureId || a.verify && !b.verify) {
          return -1; // a comes first
        } else if (a.prefectureId !== myself.prefectureId && b.prefectureId === myself.prefectureId || !a.verify && b.verify) {
          return 1;  // b comes first
        } else {
          return 0;  // maintain relative order of other elements
        }
      });
      res.status(200).json(result);
    } else {
      res.status(400).json("No group!")
    }
  } catch (error) {
    res.status(500).json({
      message: err.message || 'An error occurred while obtaining group information.',
    })
  }
}

exports.checkMember = async (req, res) => {
  try {
    const userId = req.query.userId;
    const groupId = req.query.groupId;
    const group = await Group.findOne({
      where:{
        id: groupId
      },
      order: [['id', 'ASC']],
      include: User
    });
    
    if (group) {
      let flag = false;
      for (let i = 0; i < group.users.length; i++) {
        if (group.users[i].id == userId) {
          flag = true;
          break;
        }
      }
      if (flag) {  
        res.status(200).json(true);
      } else {
        res.status(400).json(false);
      }
    } else {
      res.status(400).json("No group!")
    }
  } catch (error) {
    res.status(500).json({
      message: err.message || 'An error occurred while obtaining group information.',
    })
  }
}

exports.enterGroup = async (req, res) => {
  try {
    const userId = parseInt(req.body.userId);
    const groupId = parseInt(req.body.groupId);
    const user = await User.findOne({
      where:{
        id: userId
      },
      include: Group
    });
    const group = await Group.findOne({
      where:{
        id: groupId
      }
    });
    if (user && group) {
      await user.addGroup(group, {through: { selfGranted: false }});
      group.members = group.members + 1;
      group.save();
      res.status(200).json("save success!");
    } else {
      res.status(400).json("No User or No Group!");
    }
  } catch (error) {
    res.status(500).json({
      message: err.message || 'An error occurred while obtaining group information.',
    })
  }
}

exports.searchGroupUser = async (req, res) => {
  try {
    const userId= parseInt(req.body.userId);
    const groupId = parseInt(req.body.groupId);
    const minAge= parseInt(req.body.minAge);
    const maxAge= parseInt(req.body.maxAge);
    const minHeight= parseInt(req.body.minHeight);
    const maxHeight= parseInt(req.body.maxHeight);
    const prefectureIds = JSON.parse(req.body.prefectureIds);
    const bodyTypes = JSON.parse(req.body.bodyTypes);
    const maritalHistories = JSON.parse(req.body.maritalHistories);
    const attitues = JSON.parse(req.body.attitues);
    const myself = await User.findOne({
      where:{
        id: userId
      }
    });
    const group = await Group.findOne({
      where:{
        id: groupId
      },
      order: [['id', 'ASC']],
      include: User
    });
    const likes = await Like.findAll({
      where:{
        userId: userId
      }
    });
    const blocks = await Block.findAll({
      where:{
        userId: userId
      }
    });
    const matchings = await Matching.findAll({});
    const checkLike = (userId) =>{
      if (likes) {
        for (let i = 0; i < likes.length; i++) {
          if (likes[i].received_id == userId) {
            return false;
          }
        }
        return true;
      }else{
        return true;
      }
    }
    const checkBlock = (userId) =>{
      if (blocks) {
        for (let i = 0; i < blocks.length; i++) {
          if (blocks[i].blockedUserId == userId) {
            return false;
          }
        }
        return true;
      }else{
        return true;
      }
    }
    const checkMatching = (userId) =>{
      if (matchings) {
        for (let i = 0; i < matchings.length; i++) {
          if (matchings[i].maleId == myself.id && matchings[i].femaleId == userId || matchings[i].femaleId == myself.id && matchings[i].maleId == userId) {
            return false;
          }
        }
        return true;
      }else{
        return true;
      }
    }
    if (group) {
      let result = [];
      for (let i = 0; i < group.users.length; i++) {
        if (group.users[i].gender != myself.gender && checkLike(group.users[i].id) && checkBlock(group.users[i].id) && checkMatching(group.users[i].id) ) {
          result.push({
            id: group.users[i].id,
            name: group.users[i].name,
            introduction: group.users[i].introduce,
            prefectureId: group.users[i].prefectureId,
            age: group.users[i].age,
            avatar: group.users[i].avatar1,
            verify: group.users[i].verifyed,
            bodyType: group.users[i].bodyType,
            materialHistory: group.users[i].materialHistory,
            attitude: group.users[i].attitude
          });
        }
      }
      result.sort((a, b) => {
        if (a.prefectureId === myself.prefectureId && b.prefectureId !== myself.prefectureId || a.verify && !b.verify) {
          return -1; // a comes first
        } else if (a.prefectureId !== myself.prefectureId && b.prefectureId === myself.prefectureId || !a.verify && b.verify) {
          return 1;  // b comes first
        } else {
          return 0;  // maintain relative order of other elements
        }
      });
      result = result.filter((item)=>(item.age >= minAge && item.age <= maxAge || item.height >= minHeight && item.height <= maxHeight || prefectureIds.includes(item.prefectureId) || bodyTypes.includes(item.bodyType) || maritalHistories.includes(item.materialHistory) || attitues.includes(item.attitude)))
      res.status(200).json(result);
    } else {
      res.status(400).json("No group!")
    }
  } catch (error) {
    res.status(500).json({
      message: err.message || 'An error occurred while obtaining group information.',
    })
  }
}