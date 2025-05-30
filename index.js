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
const jwt_key=process.env.jwt_key

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

//user login api
app.post("/user/login",async(req,resp)=>{
    try{
        const{email,password}=req.body;
        const user=await User.findOne({email})
        if(user){
            const isMatch=await bcrypt.compare(password,user.password);
            if(!isMatch){
                resp.status(404).json({message:"Invalid Credentials"});
            }
            const token=jwt.sign({id:user._id,username:user.username},jwt_key,{expiresIn:"24h"})
            resp.send(token);
        }
        else{
            resp.status(404).json({message:"Invalid Credentials"})
        }
    }
    catch(error){
        throw Error(error);
    }
})

// token verify api
const verifyJwt=(req,resp,next)=>{
    const authHeader=req.headers['authorization'];
    if(!authHeader){
       return resp.status(401).json({message:"No token provided"})
    }
    const token=req.headers['authorization'].split(' ')[1];
    if(!token){
        return resp.status(401).json({message:'Token format invalid'})
    }
    try{
        const user=jwt.verify(token,jwt_key);
    req.user=user;
    next();
    }
    catch(error){
        return resp.status(403).json({ message: "Invalid token" })
    }
    
}

app.get("/verify/token",async(req,resp)=>{
    try{
        const user=req.user;
        resp.status(200).json(user);
    }
    catch(error){
        throw Error(error);
    }
})