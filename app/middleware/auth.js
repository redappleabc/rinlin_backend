const jwt = require("jsonwebtoken");
const config = require("config");

const db = require("../models");
const { where } = require("sequelize");
const User = db.user;

module.exports = async function(req, res, next) {
  // Get token from header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if(token == null){
    res.status(401).json({ msg: "Token is not valid" });
  }

  jwt.verify(token, process.env.ACCESS_SECRET, async (err, user) => {
    if (err) return res.status(401).json({ msg: "Token is incorrectly!" });
    const realUser = await User.findOne({
      where:{
        id:user.userId
      }
    })
    if (realUser) {
      next();
    }else{
      res.status(401).json({ msg: "Token is incorrectly!" });
    }
  });

  // if (authHeader.startsWith('Bearer ')) {
  //   const token = authHeader.substring(7, authHeader.length);
  //   console.log("token================", token)
  //   // try {
  //   //   const decoded = jwt.verify(token, config.get("jwtSecret"));
  //   //   req.user = decoded.user;
  //   //   if (req.user.id === "admin") {
  //   //     next();
  //   //   } else {
  //   //     const user = await User.findOne({
  //   //       where: {
  //   //         id:req.user.id
  //   //       }
  //   //     });
  //   //     if( user ) {
  //   //       next();
  //   //     } else {
  //   //       res.status(404).json({ msg: "Valid User" });
  //   //     }
  //   //   }
  //   // } catch (err) {
  //   //   res.status(401).json({ msg: "Token is not valid" });
  //   // }
  // } else {
  //   return res.status(401).json({ msg: "No token, Authorization Denied" });
  // }
};
