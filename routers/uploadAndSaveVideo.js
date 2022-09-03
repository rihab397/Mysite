const express = require('express')
const app = express()
const router=express.Router();
var multer=require("multer");
require('dotenv').config()
app.use(express.static('files'));
var path=require('path');
var {saveVideo,removeVideo}=require('../controllers/uploadAndSaveVideo')



var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'files/')
    },
    filename: function (req, file, cb) {
        let fileName=`${file.fieldname+Date.now()}${path.extname(file.originalname)}`
        req.body["fileName"] = fileName;
        cb(null,fileName )
    }
  });
    
    const upload = multer({
      storage: storage
    });
router.post("/uploadvideo", upload.fields([
    {
      name: "avtar",
      maxCount: 5,
    },
  ]),saveVideo)
  router.get("/removevideo",removeVideo)
  

module.exports=router;