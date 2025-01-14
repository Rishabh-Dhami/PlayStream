import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import {ErrorHandler} from '../utils/errorHandler.js'

const registerUser = asyncHandler(async( req, res, next) => {
   // get user details from frontend
   // validation - not empty
   // check if user already exits, - usrename , mail
   // check for image - avatar
   // upload on them in cloudinary - avatar, cover image
   // CREATE user object - create a db entry
   // remove passeord and refresh token field from response
   // check for user creation 
   // return response

   let {usrename, email, fullname, password} = req.body;

   if(!usrename || !email || !fullname || !password){
      throw new ErrorHandler(400, "All fields are required!");
   }
   

   
   const existedUser = await User.findOne({
      $or: [{ usrename }, { email }]
  })

  if(!existedUser){
   throw new ErrorHandler(409,"User with email or usrename already exists")
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
      usrename: usrename.toLowerCase()
  })

  const createdUser = await User.findById(user._id).select("-password -refreshToken");

  if(!createdUser){
   throw new ErrorHandler(500, "Something is wrong! while registering the user");
  }

   return res.status(201).json(new ApiResponse(200, "User is registered successfully!", createdUser));
});
 



export {registerUser}