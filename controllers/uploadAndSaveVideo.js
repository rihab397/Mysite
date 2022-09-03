const express = require('express')
const app = express()
require('dotenv').config()
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended:false}));
var {uploadAndSaveVideoModel}=require('../models/uploadAndSaveVideo')


var saveVideo= async(req,res)=>{
    try{
    var preExist=  await uploadAndSaveVideoModel.find({userName:req.body.userName})
    if(preExist.length){
     await uploadAndSaveVideoModel.findOneAndUpdate({userName:req.body.userName},{$push:{videosName:{fileName:`${req.body.fileName}`}}});
    //  req.files.avtar;  
    }
    else{
        var status=  await  uploadAndSaveVideoModel.create({
            userName:req.body.userName,
            videosName:[{fileName:`${req.body.fileName}`}]
         })
    }
    res.send({message:"file susseccfully uploaded"})
    }
    catch(er){

        res.send({
            err:er
        })
    }
    
     
  }
  var removeVideo= async(req,res)=>{
    try{
         await uploadAndSaveVideoModel.findOneAndUpdate({userName:req.query.userName},{$pull:{'videosName':{fileName:`${req.query.fileName}`}}});
        //  req.files.avtar;  
        res.send("delete successfully")
    }
    catch(e){
        res.send(e)
    }
  }
  module.exports={
      saveVideo:saveVideo,
      removeVideo:removeVideo
  }
  