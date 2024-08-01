const axios = require('axios')
const { format } = require('date-fns')
const db = require('../models')
const { query } = require('express-validator')
const Item = db.item
const Tab = db.tab
const Like = db.like
const Download = db.download
const Play = db.play
const User = db.user
const Category = db.category
const Give=db.give
// const CampaignGettingHistory = db.campaignGettingHistory
// const CampaignQueries = db.campaignQueries
// const CampaignInfo = db.campaignInfo
// const AdgroupInfo = db.adgroupInfo
// const AdInfo = db.adInfo
const Op = db.Sequelize.Op
const Sequelize = db.Sequelize

const fs= require('fs')
const path = require('path')
const { where } = require('sequelize')
const moment = require('moment-timezone');


// Retrieve all campaigns
exports.getItemAll = async (req, res) => {
  const item = await Item.findAll({
    include: Tab
    // order: [['recId', 'ASC']],
    // group: "campaignId",
  })
    .then((data) => {
      // console.log("111====",data);
      res.json(data)
    })
    .catch((err) => {
      res.status(500).json({
        message: err.message || 'Some error occurred while retrieving campaigns',
      })
    })
}

exports.getSortItemAll = async (req, res) => {
  try {
    const result=[];
    const item = await Item.findAll({
      include : Tab
    });
    const user = await User.findOne({
      where:{
        email:req.query.email
      }
    })
    const currentTime = moment.tz(Date.now(), 'Asia/Tokyo');
    if(user && user.plan!=""){
      if(item){
        for(let i=0;i<item.length;i++){
          result[i]=item[i];
        }
        for(let i=0;i<result.length;i++){
          for(let j=i+1;j<result.length;j++){
            if(result[i].order > result[j].order){
              var val=result[i];
              result[i]=result[j];
              result[j]=val;
            }
          }
        }
      }
    }
    return res.status(200).json(result)
  } catch (error) {
    res.status(500).json({
      message: error.message || ''
    })
  }
}

exports.getLike = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        email: req.query.email
      }
    })
    const like = await Like.findAll({
      where: {
        userId: user.id
      }
    })
    const result = []
    for (let i = 0; i < like.length; i++) {
      // console.log(like[i].itemId)
      const item = await Item.findOne({
        where: {
          id: like[i].itemId
        }
      })
      // console.log("--------",item);
      result[i] = item
    }
    return res.status(200).json(result)
  } catch (error) {
    res.status(500).json({
      message: error.message || ''
    })
  }
}

exports.getOneLike = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        email: req.query.email
      }
    })
    const like = await Like.findOne({
      where: {
        userId: user.id,
        itemId:req.query.id
      }
    })
    if(like){
      return res.status(200).json("yes")
    }else{
      return res.status(200).json("no")
    }
  } catch (error) {
    res.status(500).json({
      message: error.message || ''
    })
  }
}

exports.getPlay = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        email: req.query.email
      }
    })
    const play = await Play.findAll({
      where: {
        userId: user.id
      }
    })
    // console.log("=======>", like);
    const result = []
    for (let i = 0; i < play.length; i++) {
      // console.log(like[i].itemId)
      const item = await Item.findOne({
        where: {
          id: play[i].itemId
        }
      })
      result[i] = item
    }
    return res.status(200).json(result)
  } catch (error) {
    res.status(500).json({
      message: error.message || ''
    })
  }
}

exports.getDownload = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        email: req.query.email
      }
    })
    const download = await Download.findAll({
      where: {
        userId: user.id
      }
    })
    // console.log("=======>", like);
    const result = []
    for (let i = 0; i < download.length; i++) {
      // console.log(like[i].itemId)
      const item = await Item.findOne({
        where: {
          id: download[i].itemId
        }
      })
      result[i] = item
    }
    return res.status(200).json(result)
  } catch (error) {
    res.status(500).json({
      message: error.message || ''
    })
  }
}

exports.getTab = async (req, res) => {
  try {
    const item = await Item.findOne({
      where: { id: req.query.id },
      include: Tab
    })
    var len = item.tabs.length;
    var result = [];
    for (let i = 0; i < len; i++) {
      result[i] = item.tabs[i]
    }
    return res.status(200).json(result)
  } catch (error) {
    res.status(500).json({
      message: error.message || ''
    })
  }
}

exports.getAllTab = async (req, res) => {

  try {
    const tab = await Tab.findAll({
    })
    return res.status(200).json(tab)
  } catch (error) {
    res.status(500).json({
      message: error.message || ''
    })
  }
  // console.log('tabs>>', item.tabs);
}

exports.getAllCategory = async (req, res) => {

  try {
    const category = await Category.findAll({
    })
    return res.status(200).json(category)
  } catch (error) {
    res.status(500).json({
      message: error.message || ''
    })
  }
}

exports.addLike = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        email: req.body.email
      },
      order: [['email', 'DESC']],
    });
    const like=await Like.findOne({
      where:{
        userId: user.id,
        itemId: req.body.itemID
      }
    });
    if(like){
      like.destroy();
      return res.status(200).json("removed");
    }else{
      await Like.create({
        userId: user.id,
        itemId: req.body.itemID
      });
      return res.status(200).json("added");
    }
  } catch (error) {
    res.status(500).json({
      message: error.message || ''
    })
  }
}

exports.addDownload = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        email: req.body.email
      },
      order: [['email', 'DESC']],
    });
    const [download, created] = await Download.findOrCreate({
      where: {
        userId: user.id,
        itemId: req.body.itemID
      },
      defaults: {
        userId: user.id,
        itemId: req.body.itemID
      }
    });
    return res.status(200).json("success")
  } catch (error) {
    res.status(500).json({
      message: error.message || ''
    })
  }
}

exports.addPlays = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        email: req.body.email
      },
      order: [['email', 'DESC']],
    });
    const [play, created] = await Play.findOrCreate({
      where: {
        userId: user.id,
        itemId: req.body.itemID
      },
      defaults: {
        userId: user.id,
        itemId: req.body.itemID
      }
    });
    return res.status(200).json("success")
  } catch (error) {
    res.status(500).json({
      message: error.message || ''
    })
  }
}

exports.addGive = async (req, res) => {
  // console.log(req.body);
  try {
    const user = await User.findOne({
      where: {
        email: req.body.email
      },
      order: [['email', 'DESC']],
    });
    const give = await Give.create({
      userId:user.id,
      itemId:req.body.itemID,
      amount:req.body.amount
    });
    return res.status(200).json("success")
  } catch (error) {
    res.status(500).json({
      message: error.message || ''
    })
  }
}

exports.getContentSearch = async (req, res) => {
  // console.log("=======>", req.query.content);
  try {
    const item = await Item.findAll({})
    const result = [];
    let j = 0;
    for (let i = 0; i < item.length; i++) {
      if (item[i].japanesetitle.includes(req.query.content) || item[i].japanesedescription.includes(req.query.content)) {
        result[j] = item[i];
        j++;
      }
    }
    return res.status(200).json(result)
  } catch (error) {
    res.status(500).json({
      message: error.message || ''
    })
  }
}

exports.getEnContentSearch = async (req, res) => {
  // console.log("=======>", req.query.content);
  try {
    const item = await Item.findAll({})
    const result = [];
    let j = 0;
    for (let i = 0; i < item.length; i++) {
      if (item[i].englishtitle.includes(req.query.content) || item[i].englishdescription.includes(req.query.content)) {
        result[j] = item[i];
        j++;
      }
    }
    return res.status(200).json(result)
  } catch (error) {
    res.status(500).json({
      message: error.message || ''
    })
  }
}

exports.getCategorySearch = async (req, res) => {
  // console.log("=======>", req.query.content);
  try {
    const item = await Item.findAll({})
    const result = [];
    let j = 0;
    for (let i = 0; i < item.length; i++) {
      if (item[i].categoryId == req.query.id) {
        result[j] = item[i];
        j++;
      }
    }
    return res.status(200).json(result)
  } catch (error) {
    res.status(500).json({
      message: error.message || ''
    })
  }
}

exports.getTabSearch = async (req, res) => {
  try {
    const tab = await Tab.findOne({
      where: { id: req.query.id },
      include: Item
    })
    const item = await Item.findAll({})
    const result = [];
    for (let i = 0; i < tab.items.length; i++) {
      result[i] = tab.items[i];
    }
    return res.status(200).json(result)
  }
  catch (error) {
    res.status(500).json({
      message: error.message || ''
    })
  }
}

// -----------------admin-------------

exports.addItemVideo = async (req, res) => {
  try {
    const category = await Category.findOne({
      where: { name: req.body.category }
    })
    const item = await Item.create({
      temple:req.body.temple,
      japanesetitle: req.body.japanesetitle,
      englishtitle: req.body.englishtitle,
      time: req.body.time,
      order:req.body.order,
      type: "動画",
      filename: req.body.video,
      en_filename: req.body.en_video,
      main_image_url: '/img/'+req.body.filename,
      categoryId: category.id,
      japanesedescription: req.body.japanesedescription,
      englishdescription: req.body.englishdescription
    });
    const tab = [];
    for (let i = 0; i < req.body.tags.length; i++) {
      tab[i] = await Tab.findOne({
        where: { name: req.body.tags[i] },
        order: [['name', 'DESC']],
      });
      await item.addTab(tab[i], { through: { selfGranted: false } });
    }
    return res.status(200).json("success")
  } catch (error) {
    res.status(500).json({
      message: error.message || ''
    })
  }
}

exports.addItemSound = async (req, res) => {
  try {
    const category = await Category.findOne({
      where: { name: req.body.category }
    })
    const item = await Item.create({
      temple:req.body.temple,
      japanesetitle: req.body.japanesetitle,
      englishtitle: req.body.englishtitle,
      time: req.body.time,
      order:req.body.order,
      type: "音声",
      filename: req.body.soundname,
      en_filename: req.body.en_soundname,
      main_image_url: '/img/'+req.body.filename,
      categoryId: category.id,
      japanesedescription: req.body.japanesedescription,
      englishdescription: req.body.englishdescription
    });
    const tab = [];
    for (let i = 0; i < req.body.tags.length; i++) {
      tab[i] = await Tab.findOne({
        where: { name: req.body.tags[i] },
        order: [['name', 'DESC']],
      });
      await item.addTab(tab[i], { through: { selfGranted: false } });
    }
    return res.status(200).json("success")
  } catch (error) {
    res.status(500).json({
      message: error.message || ''
    })
  }
}

exports.getAllTags = async (req, res) => {
  try {
    
    var result = [];
    const tab = await Tab.findAll({});
    for(let i=0;i<tab.length;i++){
      result[i]={
        name:tab[i].name,
        en_name:tab[i].en_name
      }
    }
    return res.status(200).json(result)
  } catch (error) {
    res.status(500).json({
      message: error.message || ''
    })
  }
}

exports.updateItemVideo = async (req, res) => {
  console.log(req.body);
  try {
    const item = await Item.findOne({
      where: {
        id: req.body.id
      },
      include: Tab
    })
    const category = await Category.findOne({
      where: { name: req.body.category },
    })
    if (item) {
      item.japanesetitle = req.body.japanesetitle;
      item.englishtitle = req.body.englishtitle;
      item.time = req.body.time;
      item.temple = req.body.temple;
      item.order = req.body.order;
      item.categoryId = category.id;
      item.japanesedescription = req.body.japanesedescription;
      item.englishdescription = req.body.englishdescription;
      const tab = []
      for (let i = 0; i < item.tabs.length; i++) {
        tab[i] = await Tab.findOne({
          where: { name: item.tabs[i].name },
          order: [['name', 'DESC']],
        });
        await item.removeTab(([tab[i].id]))
      }
    }
    if(req.body.video){
      item.filename=req.body.video;
    }
    if(req.body.en_video){
      item.en_filename=req.body.en_video;
    }
    if(req.body.filename){
      item.main_image_url = '/img/'+req.body.filename;
    }
    item.save();

    const tab = [];
    for (let i = 0; i < req.body.tags.length; i++) {
      tab[i] = await Tab.findOne({
        where: { name: req.body.tags[i] },
        order: [['name', 'DESC']],
      });
      // // await item.removeTab(([tab[i].id]))
      await item.addTab(tab[i], { through: { selfGranted: false } });
      // await item.updateTab(tab[i], {through: { selfGranted: false }});   
    }

    return res.status(200).json("Success")
  } catch (error) {
    res.status(500).json({
      message: error.message || ''
    })
  }
}

exports.updateItemSound = async (req, res) => {
  try {
    const item = await Item.findOne({
      where: {
        id: req.body.id
      },
      include: Tab
    })
    const category = await Category.findOne({
      where: { name: req.body.category },
    })

    if (item) {
      item.japanesetitle = req.body.japanesetitle;
      item.englishtitle = req.body.englishtitle;
      item.time = req.body.time;
      item.temple = req.body.temple;
      item.order = req.body.order;
      item.categoryId = category.id;
      item.japanesedescription = req.body.japanesedescription;
      item.englishdescription = req.body.englishdescription;
      const tab = []
      for (let i = 0; i < item.tabs.length; i++) {
        tab[i] = await Tab.findOne({
          where: { name: item.tabs[i].name },
          order: [['name', 'DESC']],
        });
        await item.removeTab(([tab[i].id]))
      }
    }
    if(req.body.filename){
      item.main_image_url = '/img/'+req.body.filename;
    }
    if(req.body.soundname){
      item.filename = req.body.soundname;
    }
    if(req.body.en_soundname){
      item.en_filename = req.body.en_soundname;
    }
    item.save();

    const tab = [];
    for (let i = 0; i < req.body.tags.length; i++) {
      tab[i] = await Tab.findOne({
        where: { name: req.body.tags[i] },
        order: [['name', 'DESC']],
      });
      // // await item.removeTab(([tab[i].id]))
      await item.addTab(tab[i], { through: { selfGranted: false } });
      // await item.updateTab(tab[i], {through: { selfGranted: false }});   
    }

    return res.status(200).json("Success")
  } catch (error) {
    res.status(500).json({
      message: error.message || ''
    })
  }
}

exports.deleteOneItem = async (req, res) => {
  try {
    const item_tab = await Item.findOne({
      where: {
        id: req.query.id
      },
      include: [Tab]
    });
    if(item_tab) {
      item_tab.removeTabs();
    }
    const item = await Item.findOne({
      where: {
        id: req.query.id
      },
      order:[['id','DESC']],
    });
    const likes = await Like.findAll({
      where:{
        itemId:item.id
      }
    })
    for(let i=0; i<likes.length; i++){
      likes[i].destroy();
    }
    const downloads = await Download.findAll({
      where:{
        itemId:item.id
      }
    })
    for(let i=0; i<downloads.length; i++){
      downloads[i].destroy();
    }
    const plays = await Play.findAll({
      where:{
        itemId:item.id
      }
    })
    for(let i=0; i<plays.length; i++){
      plays[i].destroy();
    }
    if(item.main_image_url){
      var array=item.main_image_url.split("/");
      var imageName= array[array.length-1];
      if(imageName!="default.png"){
        const firstimagePath = path.join(__dirname, '../../uploads/img', imageName);
        fs.unlink(firstimagePath, (error) => {
          if (error) {
            console.error('Error deleting image:', error);
          } else {
            console.log('Image deleted successfully');
          }
        });
      }
    }

    if(item.filename){
      if(item.type=="動画"){
        const firstimagePath = path.join(__dirname, '../../uploads/video', item.filename);
        fs.unlink(firstimagePath, (error) => {
          if (error) {
            console.error('Error deleting image:', error);
          } else {
            console.log('Video deleted successfully');
          }
        });
      }else{
        const firstimagePath = path.join(__dirname, '../../uploads/sound', item.filename);
        fs.unlink(firstimagePath, (error) => {
          if (error) {
            console.error('Error deleting image:', error);
          } else {
            console.log('Sound deleted successfully');
          }
        });
      }
    }

    if(item.en_filename){
      if(item.type=="動画"){
        const firstimagePath = path.join(__dirname, '../../uploads/video', item.en_filename);
        fs.unlink(firstimagePath, (error) => {
          if (error) {
            console.error('Error deleting image:', error);
          } else {
            console.log('Video deleted successfully');
          }
        });
      }else{
        const firstimagePath = path.join(__dirname, '../../uploads/sound', item.en_filename);
        fs.unlink(firstimagePath, (error) => {
          if (error) {
            console.error('Error deleting image:', error);
          } else {
            console.log('Sound deleted successfully');
          }
        });
      }
    }
    item.destroy();

    return res.status(200).json("Success")
  } catch (error) {
    res.status(500).json({
      message: error.message || ''
    })
  }
}

exports.getOneItem = async (req, res) => {
  const item = await Item.findOne({
    where: {
      id: req.query.id
    },
    include: Tab
  })
    .then((data) => {
      res.json(data)
    })
    .catch((err) => {
      res.status(500).json({
        message: err.message || 'Some error occurred while retrieving campaigns',
      })
    })
}

exports.getOneTag = async (req, res) => {
  const tab = await Tab.findOne({
    where: {
      id: req.query.id
    }
  })
    .then((data) => {
      res.json(data)
    })
    .catch((err) => {
      res.status(500).json({
        message: err.message || 'Some error occurred while retrieving campaigns',
      })
    })
}

exports.addTab = async (req, res) => {
  try {
    const tab = await Tab.create({
      name:req.body.name,
      en_name:req.body.enName
    });
    
    return res.status(200).json("success")
  } catch (error) {
    res.status(500).json({
      message: error.message || ''
    })
  }
}

exports.updateTag = async (req, res) => {
  try {
    const tab = await Tab.findOne({
      where: {
        id: req.body.id
      }
    })
    if(tab){
      tab.name=req.body.name,
      tab.en_name=req.body.enName
    }
    tab.save();    
    return res.status(200).json("Success")
  } catch (error) {
    res.status(500).json({
      message: error.message || ''
    })
  }
}

exports.deleteTag = async (req, res) => {
  try {
    const tab = await Tab.findOne({
      where: {
        id: req.query.id
      }
    });
    tab.destroy();

    return res.status(200).json("Success")
  } catch (error) {
    res.status(500).json({
      message: error.message || ''
    })
  }
}