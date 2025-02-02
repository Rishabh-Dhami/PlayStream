import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { ApiResponse } from "../utils/apiResponse.js"
import { ErrorHandler } from "../utils/errorHandler.js"
import { application } from "express"


const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params;
    // TODO: toggle subscription
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;

    if(!channelId || !isValidObjectId(channelId)){
        throw new ErrorHandler(400, "Invalid or missing channel ID");
    }

    
    
    const channelSubscribers = await Subscription.aggregate([
        {
            $match : {
                   channel :  mongoose.Types.ObjectId(channelId)
            }
        },
        {
            $lookup : {
                from : "users",
                localField : 'subscriber',
                foreignField : "_id",
                as : 'subscribers',
                pipeline : [
                    {
                        $project : {
                            username : 1,
                            avatar : 1,
                            fullname :1,
                            coverImage : 1
                        }
                    }
                ]
            }
        },
        { $skip: (page - 1) * limit },
        { $limit: limit }
    ]);

    return res.status(200)
    .json(new ApiResponse(200, "channel subscribers fetched successfully!", channelSubscribers[0]));
    
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params;

    if(!subscriberId || !isValidObjectId(subscriberId)){
        throw new ErrorHandler(400, "SubscriberId is missing or invalid!");
    }

   const channel =  await Subscription.aggregate([
        {
            $match : {
                subscriber : mongoose.Types.ObjectId(subscriberId)
            }
        },
        {
            $lookup : {
                from : "users",
                localField : 'channel',
                foreignField : "_id",      
                as : 'channel',
                pipeline : [
                    {
                        $project : {
                            username : 1,
                            fullname : 1,
                            avatar : 1
                        }
                    }
                ]
            }
        },
        {
            $project : {
                channel : 1
            }
        }
    ]);

    if(!channel){
        throw new ErrorHandler(400, "Channel not found!");
    }

    return res.status(200)
    .json(new ApiResponse(200, "subscribed channel fetched succesfully!", channel[0]));
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}