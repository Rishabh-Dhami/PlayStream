import mongoose, {Schema} from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";


const videoSchema = new Schema({
    videoFile : {
        type : String,
        required: [true, "Video file path is required"],
        trim : true
    },
    thumbnail : {
        type : String,
        required: [true, "Thumbnail image path is required"],
    },
    owner : {
        type : Schema.Types.ObjectId,
        ref : "User",
        required: [true, "Video must have an owner"],
    },
    title : {
        type : String,
        required: [true, "Title is required"],
       trim : true,
       maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description : {
        type : String,
        required: [true, "Description is required"],
        trim : true,
        maxlength: [500, "Description cannot exceed 500 characters"],
    },
    duration : {
        type : Number,
        required: [true, "Duration is required"],
        min: [1, "Duration must be at least 1 second"],
    },
    views : {
        type : Number,
        default : 0,
        min: [0, "Views cannot be negative"],
    },
    ispublished : {
        type : true,
        default :true
    }
},{timestamps : true});


videoSchema.plugin(aggregatePaginate);

export const Video = mongoose.model("Video", videoSchema);