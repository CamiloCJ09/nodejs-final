import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const connectionString = process.env.MONGO_CONNECTION_STRING || "mongodb://127.0.0.1:27017/NodeDB";

export const db = mongoose.connect(connectionString).then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.log(err);
}
);