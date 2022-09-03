const express = require('express')
const app = express()
const router=express.Router();
require('dotenv').config()
app.use(express.static('files'));
var {streamVideo}=require('../controllers/streamVideo')

router.get("/:videoName",streamVideo)

module.exports=router;