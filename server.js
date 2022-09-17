//Create our express and socket.io servers
const express = require('express')
const app = express()
const server = require('http').Server(app)
var io=require('socket.io')(server);

require('dotenv').config()
app.use(express.static('files'));
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}))
var  port =process.env.PORT || 1370 || 2000 || 5000

// app.get("/boy", function (req, res) {
//   res.sendFile('boy.html', {root: __dirname+"/views" })
//   });


//   app.get("/contact", function (req, res) {
//     res.sendFile('contact.html', {root: __dirname+"/views" })
//     });
//   app.get("/page", function (req, res) {
//     res.sendFile('page.html', {root: __dirname+"/views" })
//     });
//   app.get("/network", function (req, res) {
//     res.sendFile('network.html', {root: __dirname+"/views" })
//     });
//   app.get("/energy", function (req, res) {
//     res.sendFile('energy.html', {root: __dirname+"/views" })
//     });
//   app.get("/", function (req, res) {
//     res.sendFile('home.html', {root: __dirname+"/views" })
//     });

//     app.get("/home", function (req, res) {
//       res.sendFile('home.html', {root: __dirname+"/views" })
//       });


    


app.set('view engine', 'ejs') 
var uploadAndSaveVideoRoute=require('./routers/uploadAndSaveVideo')
var streamVideo=require('./routers/streamVideo')
var {uploadAndSaveVideoModel}=require('./models/uploadAndSaveVideo')

// app.use(express.json());

app.use("/upload",uploadAndSaveVideoRoute);
app.use("/remove",uploadAndSaveVideoRoute)

app.get('/savevideo', (req, res) => {
    res.render('room')
})

app.post('/formData/:data', (req, res) => {
  console.log(eval(req.params.data));
  res.send({message:"date get successfully"})
})


app.get("/video", function (req, res) {
    res.render('index')
  });


  app.get("/download", (req,res)=> {
  res.download(`files/${req.query.fileName}`);
  });

  app.get("/fetchVideo",async (req,res)=> {
  var videoData= await uploadAndSaveVideoModel.find({userName:req.query.userName,})
  console.log(videoData);
  res.status(200).send(videoData);
    });
  

  app.use("/videog",streamVideo)

// io.on("connection",(socket)=>{
//     console.log("New Connection");
//     socket.emit('data',{hey:'ddd'})
//     socket.broadcast.emit('hey','d')

//     socket.on('joined',(user)=>{
//     console.log(user);
//     socket.emit('massage', {msg:"hello friend"})

// }) 
// });
server.listen(4000,()=>{
  console.log("server started");
}) // Run the server on the 4000 port