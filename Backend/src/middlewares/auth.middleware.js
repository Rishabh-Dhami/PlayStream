import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ErrorHandler } from "../utils/errorHandler.js";

const verifyJWT = asyncHandler(async(req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
    
        if(!token){
            throw new ErrorHandler(401, "Unauthorized Request!");
        }
        
        const decodedAccessToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        
        if(!decodedAccessToken){
            throw new ErrorHandler(401, "Invalid Access Token");
        }
    
        const user = await User.findById(decodedAccessToken?._id)
        .select("-password -refreshToken");
    
        if(!user){
            throw new ErrorHandler(401, "Invalid Access Token");
        }
    
        req.user = user;
        next();
    } catch (error) {
        throw new ErrorHandler(401, error?.message || "Invalid Access Token!");
    }
})


export {verifyJWT};