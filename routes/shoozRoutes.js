const express =require('express');
const { getAllShooz } = require('../controller/shoozController');

const shoozRouter=express.Router()
shoozRouter.route("/").get(getAllShooz)
module.exports=shoozRouter