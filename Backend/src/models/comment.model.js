import mongoose, {Schema} from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";

const commentSchema = new Schema({
   content : {
    type : String,
    trim : true,
    required: [true, "Comment content is required"],
    maxlength: [500, "Comment content cannot exceed 500 characters"],
   },
   owner : {
    type : mongoose.Types.ObjectId,
    ref : "User",
    required: [true, "Comment owner is required"],
   },
   video : {
    type : mongoose.Types.ObjectId,
    ref : 'Video',
    required: [true, "Associated video is required"],
   }
}, {timestamps :  true});

commentSchema.plugin(aggregatePaginate);
export const Comment = mongoose.model('Comment', commentSchema);