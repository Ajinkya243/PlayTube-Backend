const express=require('express');
require('dotenv').config();
const port =process.env.PORT;
const cors=require('cors');
const app=express();
app.use(express.json());
app.use(cors());
const {connectDB}=require('./db/db.connect')
const {Video}=require("./models/video.models");
const {User}=require("./models/user.models");
const jwt=require('jsonwebtoken');
const bcrypt=require('bcrypt');

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

//post user
app.post("/add-user",async(req,resp)=>{
    try{
        const{username,email,password}=req.body;
        const bcryptPassword=await bcrypt.hash(password,10);
        const user=new User({username,email,password:bcryptPassword});
        await user.save();
        resp.status(201).json({message:'User saved successfully',user});
    }
    catch(error){
        throw Error(error);
    }
})