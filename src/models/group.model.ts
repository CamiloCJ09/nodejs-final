// Import the mongoose library for MongoDB interaction
import mongoose from "mongoose";

// Define the structure of the input data for creating a group
export interface GroupInput {
    name: string;
    users: string[];
}

// Define the structure of the group document, extending the GroupInput and mongoose.Document
export interface GroupDocument extends GroupInput, mongoose.Document {
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}

// Define the mongoose schema for the "groups" collection
const groupSchema = new mongoose.Schema(
    {
        // Group name is required and should be a string
        name: { type: String, required: true },

        // Users field is an array of MongoDB ObjectIds referencing the "User" model
        users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

        // Optional field for marking the group as deleted, with a default value of null
        deletedAt: { type: Date, default: null },
    },
    {
        // Enable timestamps for createdAt and updatedAt fields
        timestamps: true,

        // Specify the collection name as "groups"
        collection: "groups",
    }
);

// Create a mongoose model named "Group" based on the defined schema
const Group = mongoose.model<GroupDocument>("Group", groupSchema);

// Export the Group model for use in other parts of the application
export default Group;
