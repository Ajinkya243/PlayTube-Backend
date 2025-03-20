const mongoose=require('mongoose');

const videoSchema=new mongoose.Schema({
    title:{
        type:String
    },
    thumbnail:{
        type:String
    },
    videoId:{
        type:String
    },
    creatorName:{
        type:String
    },
    creatorLogo:{
        type:String
    },
    subscriber:{
        type:String
    },
    likes:{
        type:String
    },
    description:{
        type:String
    },
    views:{
        type:String
    },
    category:{
        type:String,
        enum:['gaming','movie','music','trailer']
    }

})

const Video=mongoose.model("Video",videoSchema);

module.exports={Video}