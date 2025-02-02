import dotenv from 'dotenv';
dotenv.config();

import connectDb from './database/db.js';
import { app } from './app.js';

const port = process.env.PORT;

connectDb()
.then(() => {
    app.on("error", () => {
        console.error("An error occurred in the application:", err);
    // Handle the error, e.g., log it, notify, or shut down the application
    process.exit(1);  // Exit the process with an error code
    })

    app.listen(port, () => {
        console.log(`Server is running at ${port}`);
    })
})
.catch((error) => {
    console.log("Error connecting to MongoDB:",  error);
})