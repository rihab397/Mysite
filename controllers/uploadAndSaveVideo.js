const express = require('express')
const app = express()
require('dotenv').config()
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }));
var { uploadAndSaveVideoModel } = require('../models/uploadAndSaveVideo')
const { google } = require('googleapis');
const path = require('path');
const fs= require('fs');
const dir = "./files/";
const filePath = path.join('index.js');

const CLIENT_ID = '914260115450-nqu686jng62ab1ofn3eni4bn2r5ult2l.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
const REFRESH_TOKEN = '1//04j_sLFfDUu3PCgYIARAAGAQSNwF-L9IreZX00FK6OgG7gksI4OUle2TKCUVCoRaaj4hL_eXDKvx4sInsGOJ4VRYyfmqh4FAeos4';
const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);
oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
const drive = google.drive({
  version: 'v3',
  auth: oauth2Client,
});
async function uploadFile(fileName) {
    mimeType=`video/${fileName.split(".")[1]}` 
  try {
    const response = await drive.files.create({
      requestBody: {
        name: fileName.split(".")[0] ,//This can be name of your choice
        mimeType,
        parents:["1TcDFMh7-2jw83vCiHa3SwQwSvl2QxT25"] //give the encrypted path of you drive folder find in the link of 
      },
      media: {
        mimeType: 'text/javascript',
        body: fs.createReadStream(dir+fileName),
      },
    });

    console.log(response.data);
    return response.data.id;
  } catch (error) {
    console.log(error.message);
  }
 
}









var saveVideo = async (req, res) => {
    try {
        var preExist = await uploadAndSaveVideoModel.find({ userName: req.body.userName });
        console.log("video arrived")
        if (preExist.length) {
            let id= await uploadFile(req.body.fileName);
            // setTimeout(async () => {
                if(id){
                    await uploadAndSaveVideoModel.findOneAndUpdate({ userName: req.body.userName }, { $push: { videosName: { fileName: id } } });
                    fs.unlink(dir+req.body.fileName, (e,s)=>{
                        console.log(e,s)
                    })
                }
               
            // },5000,id);

            res.send({ message: "file susseccfully uploaded" })
         
            //  req.files.avtar;  
        }
        else {
            var status = await uploadAndSaveVideoModel.create({
                userName: req.body.userName,
                videosName: [{ fileName: `${uploadFile(req.body.fileName)}` }]
            })
            fs.unlink(dir+req.body.fileName, (e,s)=>{
                console.log(e,s)
            }) 
        }
       
    }
    catch (er) {

        res.send({
            err: er
        })
    }


}
var removeVideo = async (req, res) => {
    try {
        await drive.files.delete({fileId:req.query.fileName})
        await uploadAndSaveVideoModel.findOneAndUpdate({ userName: req.query.userName }, { $pull: { 'videosName': { fileName: `${req.query.fileName}` } } });
        //  req.files.avtar;  
        res.send("delete successfully")
    }
    catch (e) {
        res.send(e)
    }
}
module.exports = {
    saveVideo: saveVideo,
    removeVideo: removeVideo
}
