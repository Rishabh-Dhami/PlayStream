import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import {ErrorHandler} from '../utils/errorHandler.js'
import jwt from 'jsonwebtoken';

const registerUser = asyncHandler(async( req, res, next) => {
   // get user details from frontend
   // validation - not empty
   // check if user already exits, - username , mail
   // check for image - avatar
   // upload on them in cloudinary - avatar, cover image
   // CREATE user object - create a db entry
   // remove passeord and refresh token field from response
   // check for user creation 
   // return response

   let {username, email, fullname, password} = req.body;

   
   if(!username || !email || !fullname || !password){
      throw new ErrorHandler(400, "All fields are required!");
   }
   
   const existedUser = await User.findOne({
      $or: [{ username }, { email }]
  })

  if(existedUser){
   throw new ErrorHandler(409,"User with email or username already exists")
  }

  console.log(req.files)

  if (!req.files || !Array.isArray(req.files.avatar) || req.files.avatar.length === 0) {
   throw new ErrorHandler(400, "Avatar file is required");
 }

  const avatarLocalPath = req.files?.avatar[0]?.path;

  if (!avatarLocalPath) {
   throw new ApiError(400, "Avatar file is required")
  }

  let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }

   const avatar = await  uploadToCloudinary(avatarLocalPath);
   const coverImage = await uploadToCloudinary(coverImageLocalPath);


   const user = await User.create({
      fullname,
      avatar: avatar.url,
      coverImage: coverImage?.url || "",
      email, 
      password,
      username: username.toLowerCase()
  })

  const createdUser = await User.findById(user._id).select("-password -refreshToken");

  if(!createdUser){
   throw new ErrorHandler(500, "Something is wrong! while registering the user");
  }

   return res.status(201).json(new ApiResponse(200, "User is registered successfully!", createdUser));
});
 
const generateAccessAndRefreshTokens = async(userId) => {
   try {
      const user = await User.findById(userId);
      const accessToken = await user.generateAccessToken();
      const refreshToken = await user.generateRefreshToken();

      user.refreshToken = refreshToken;
      await user.save({validateBeforeSave : false});

      return {accessToken, refreshToken};
   } catch (error) {
      throw new ErrorHandler(500, "Something is wrong! while generating accessToken or refreshToken");
   }
}

const loginUser = asyncHandler(async(req, res, next) => {
   const {username, password} = req.body;

   if(!username || !password){
      throw new ErrorHandler(400, "All fields are required!");
   }

   const user = await User.findOne({username}).select("+password");

   if(!user){
      throw new ErrorHandler(400, "username does not exist");
   }

   const isPasswordValid =  user.isPasswordCorrect(password);

   if(!isPasswordValid){
      throw new ErrorHandler(400, "Invalid Password!")
   }

   const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id);

   console.log(accessToken);
   
   const  loggedInUser = await User.findById(user._id).select("-password -refreshToken");


   const options = {
      secure : true,
      httpOnly : true
   }

   return res.status(200)
   .cookie("accessToken", accessToken, options)
   .cookie("refreshToken", refreshToken, options)
   .json(new ApiResponse(
      200,
      "User loggedIn Successfully!",
      {user : loggedInUser, accessToken, refreshToken},
   ))

})


const logoutUser = asyncHandler(async(req, res, next) => {
   await User.findByIdAndUpdate(req.user._id,
      {
         $set : {
            refreshToken : undefined
         }
      },{
         new : true
      }
   )

   const options = {
      secure : true,
      httpOnly : true
   }

   return res.status(200)
   .clearCookie("accessToken",  options)
   .clearCookie("refreshToken", options)
   .json(200, "User logged out successfully" , {})
})

const refreshAccessToken = asyncHandler(async(req, res) => {
   const incomingRefreshToken = req.cookie?.refreshToken || req.body?.refreshToken;

   if(!incomingRefreshToken){
      throw new ErrorHandler(401,"Unauthorized Request!");
   }

   const decodedToken  = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);

   if(!decodedToken){
      throw new ErrorHandler(401, "Invalid refresh token!");
   }

   const user = await User.findById(decodedToken?._id);

   if(!user){
      throw new ErrorHandler(401, "Invalid refresh token");
   }

   if(incomingRefreshToken !== user?.refreshToken){
      throw new ErrorHandler(401, "Refresh token is expired or used");
   }


   const {accessToken, newRefreshToken} = await generateAccessAndRefreshTokens(user?._id);


   const options = {
      httpOnly : true,
      secure : true
   }

   return res.status(200)
   .cookie("accessToken", accessToken,options)
   .cookie("refreshToken",newRefreshToken, options)
   .json(new ApiResponse(
      200, 
      "Access token refreshed!",
      {
         accessToken,
         refreshToken : newRefreshToken
      }
   ))
  
})

export {
   registerUser,
   loginUser, 
   logoutUser,
   refreshAccessToken
}