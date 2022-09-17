require('dotenv').config();
var url=process.env.url3;
var mongoose=require("mongoose");
mongoose.connect(url,{
    useNewUrlParser: true 
})
.then(m=>console.log("connected"))
.catch(er=>console.log(er))

var  uploadAndSaveVideo=mongoose.model("uploadAndSaveVideo",mongoose.Schema({
    userName:String,
    videosName:Array
}))

module.exports={
    uploadAndSaveVideoModel:uploadAndSaveVideo
}