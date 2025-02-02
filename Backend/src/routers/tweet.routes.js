import { Router } from 'express';
import { Tweet } from '../models/tweet.model.js';
import {
    createTweet,
    deleteTweet,
    getUserTweets,
    updateTweet,
} from "../controllers/tweet.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"
import checkOwnership from '../middlewares/ownership.middleware.js';

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/")
.post(createTweet);


router.route("/user/:userId")
.get(getUserTweets);


router.route("/:tweetId")
.patch( checkOwnership(Tweet, "tweetId"),updateTweet)
.delete(checkOwnership(Tweet, "tweetId"),deleteTweet);


export {router as tweetRouter}