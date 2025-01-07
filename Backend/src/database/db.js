import mongoose from 'mongoose';


export default async function  connectDb() {
    try {
        //  Attempt to connect to MongoDB using the connection string from environment variables
        await mongoose.connect(process.env.MONGO_URL);

        // Once connected, log a success message
        console.log("MongoDB connected successfully!");
    } catch (error) {

        // If the connection fails, log the error and exit the process
        console.log("Error connecting to MongoDB:",  error);

        // Exit the process with a failure code (1) if the connection fails
        process.exit(1);
    }
}

