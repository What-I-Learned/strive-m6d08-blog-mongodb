import mongoose from 'mongoose';
const {Moddel,Schema}

const commentSchema = new Schema({
    text:{type:String,required:true},
    rating:{type:Number,required:false},
    username:{type:String,required:true,}

})

export default model("comment", commentSchema);