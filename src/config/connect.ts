// Import the dotenv module for loading environment variables from a .env file
import dotenv from 'dotenv';

// Import the mongoose module for MongoDB interaction
import mongoose from 'mongoose';

// Load environment variables from a .env file
dotenv.config();

// Define the MongoDB connection string, using a default value if not provided in the environment
const connectionString = process.env.MONGO_CONNECTION_STRING || "mongodb://127.0.0.1:27017/NodeDB";

// Connect to MongoDB using the provided connection string
export const db = mongoose.connect(connectionString).then(() => {
    // Log a message when successfully connected to MongoDB
    console.log("Connected to MongoDB");
}).catch((err) => {
    // Log any errors that occur during the connection process
    console.log(err);
});
