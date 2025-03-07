import express from 'express';
import path, { dirname } from 'path';
const app = express();


import cors from 'cors';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';
import { userRouter } from './routers/user.routes.js';
import {tweetRouter}  from './routers/tweet.routes.js'
import { healthcheckRouter } from './routers/healthcheck.routes.js';
import { subscriptionRouter } from './routers/subscription.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(cors({
    origin : process.env.ORIGIN_CORS,
    optionsSuccessStatus : 200
}));
app.use(cookieParser());
app.use(express.urlencoded({extended : true}));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Rishabh");
})

// create router
app.use("/api/v1/healthcheck", healthcheckRouter)
app.use("/api/v1/user", userRouter);
app.use("/api/v1/tweets", tweetRouter);
app.use("/api/v1/subscriptions", subscriptionRouter)

export {app}