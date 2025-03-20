const express=require('express');
require('dotenv').config();
const port =process.env.PORT;
const cors=require('cors');
const app=express();
app.use(express.json());
app.use(cors());
const {connectDB}=require('./db/db.connect')
const {Video}=require("./models/video.models")

connectDB().then(()=>console.log('Database connected')).then(()=>{
    app.listen(port,async(req,resp)=>{
        console.log('Express runnign port',port)
    })
})

app.get("/",async(req,resp)=>{
    resp.send("Welcome to video library server")
})

//get list of video
app.get("/videos",async(req,resp)=>{
    try{
    const videos=await Video.find();
    resp.json(videos);
    }
    catch(error){
        throw Error(erro)
    }
})

//get video by id
app.get("/videos/:id",async(req,resp)=>{
    try{
        const video=await Video.findById(req.params.id);
        resp.json(video);
    }
    catch(error){
        throw Error(error)
    }
})

//post video
app.post("/video",async(req,resp)=>{
    try{
        const video=new Video(req.body);
        await video.save();
        resp.json(video);
    }
    catch(error){
        throw Error(error);
    }
})