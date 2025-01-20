import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import { ApiResponse } from "../utils/apiResponse.js"
import { ErrorHandler } from "../utils/errorHandler.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    const {content} = req.body;

    if(!content || content.trim().length === 0){
        throw new ErrorHandler(400, "Content id missting or empty");
    }

    if (content.length > 280) {
        throw new ErrorHandler(400, "Content exceeds the maximum length of 280 characters");
    }

    const tweet = await Tweet.create({
        content,
        owner : req.user?._id
    });

    return res.status(200).json(new ApiResponse(
        200,
        "tweet created successfully!",
        tweet
    ))
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets

    const {userId} = req.params;

    if(!userId){
        throw new ApiResponse(400, "Userid is missing!");
    }

    const user = await User.findById(userId);

    if(!user){
        throw new ApiResponse(400, "User not found");
    }

    const userTweets = await User.aggregate([
        {
            $match: { _id: user._id } // Filter for the specific user
        },
        {
            $lookup : {
                from : "tweets",
                localField : '_id',
                foreignField : "owner",
                as : 'tweets'
            }
        },{
            $project :{
                username : 1,
                tweets : 1
            }
        }
    ]);

    return res.status(200)
    .json(new ApiResponse(200,
        "User tweets feteched successfully",
        userTweets
    ))
})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet

    const {tweetId} = req.params;
    const {content} = req.body;

    if(!tweetId){
        throw new ErrorHandler(400, "Tweet ID is missing");
    }

    if(!content){
        throw new ErrorHandler(400, "Content is missing");
    }

    const updatedTweet = await Tweet.findByIdAndUpdate(tweetId, {content}, {new : true});

    if(!updateTweet){
        throw new ErrorHandler(400, "Something is wrong! while updating tweet");
    }

    return res.status(200).json(new ApiResponse(200, "tweet updated succesfully", updatedTweet));

})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    const {tweetId} = req.params;

    if(!tweetId){
        throw new ErrorHandler(400, "TweetId is missing");
    }


    const deletedTweet = await Tweet.findByIdAndDelete(tweetId);
  
    if(!deleteTweet){
        throw new ErrorHandler(400, "Something is wrong! while deleting tweet");
    }


    return res.status(200)
    .json(new ApiResponse(
        200,
        "Tweet is deleted succesfully!",
        deleteTweet
    ));
})


export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}