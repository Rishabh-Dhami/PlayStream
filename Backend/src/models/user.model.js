import mongoose ,{ Schema } from "mongoose";
import bcrypt from 'bcrypt';
import jwt, { JsonWebTokenError } from 'jsonwebtoken';


const userSchema = new Schema({
    username : {
        type : String,
        unique : true,
        required: [true, "Username is required"],
        lowercase : true,
        trim :true,
        index : true
    },
    email : {
        type : String,
        required: [true, "Email is required"],
        unique : true,
        trim : true,
        lowercase : true,
        match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"]
    },
    fullname : {
        type : String,
        trim : true,
        required: [true, "Full name is required"],
        index : true,
    },
    avatar : {
        type : String,
        required : true,
        default : "https://images.unsplash.com/photo-1728577740843-5f29c7586afe?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    coverImage : {
        type : String,
        default : "https://plus.unsplash.com/premium_photo-1666533243262-da144c8e306e?q=80&w=1375&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    watchHistory : [
        {
            type : Schema.Types.ObjectId,
            ref : "Video"
        }
    ],
    password : {
        type : String,
        required : [true, "password is required"],
        trim : true,
        select: false,
    },
    refreshToken : {
        type : String,
        select: false,
    }

}, {timestamps : true});



userSchema.pre('save', async function(next) {
    if(!this.isModified("password")) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }

});

userSchema.methods.isPasswordCorrect = async function(candidatePassword){
    try {
        const isMatch = await bcrypt.compare(candidatePassword, this.password);
        return isMatch;
    } catch (error) {
        throw new Error('Password comparison failed');
    }
}


userSchema.methods.generateAccessToken = function(){
    const token =  jwt.sign(
        {
            _id : this._id,
            username : this.username,
            email : this.email,
        },
        process.env.ACCESS_TOKEN_SECRET,
        process.env.ACCESS_TOKEN_EXPIRY
    )

    return token;
}

userSchema.methods.generateRefreshToken = function(){
    const token =  jwt.sign(
        {
            _id : this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        process.env.REFRESH_TOKEN_EXPIRY
    )
    
    return token;
}

export const User = mongoose.model("User", userSchema);