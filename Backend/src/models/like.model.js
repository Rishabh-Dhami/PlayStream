import mongoose, {Schema} from "mongoose";


const likeSchema = new Schema({
 comment : {
    type : mongoose.Types.ObjectId,
    ref : "Comment"
 },
 video : {
    type : mongoose.Types.ObjectId,
    ref : "Video"
 },
 tweet : {
    type : mongoose.Types.ObjectId,
    ref : "Tweet"
 },
 likeBy : {
    type : mongoose.Types.ObjectId,
    ref : "User",
    required: [true, "User ID is required to register a like"],
 }
}, {timestamps : true});

export const Like = mongoose.model('Like', likeSchema);