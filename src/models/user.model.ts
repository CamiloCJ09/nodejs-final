// Import the mongoose library for MongoDB interaction
import mongoose from "mongoose";

// Define the structure of the input data for creating a user
export interface UserInput {
  name: string;
  email: string;
  password: string;
  role: string;
  groups?: string[];
}

// Define the structure of the user document, extending the UserInput and mongoose.Document
export interface UserDocument extends UserInput, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

// Define the mongoose schema for the "users" collection
const userSchema = new mongoose.Schema(
  {
    // User's name is required and should be a string
    name: { type: String, required: true },

    // User's email is required, unique, and indexed for efficient queries
    email: { type: String, required: true, index: true, unique: true },

    // User's password is required and should be a string
    password: { type: String, required: true },

    // User's role is required, should be one of "superadmin" or "user", defaulting to "user"
    role: { type: String, required: true, enum: ["superadmin", "user"], default: "user" },

    // Groups field is an array of MongoDB ObjectIds referencing the "Group" model
    groups: [{ type: mongoose.Schema.Types.ObjectId, ref: "Group" }],

    // Optional field for marking the user as deleted, with a default value of null
    deletedAt: { type: Date, default: null },
  },
  {
    // Enable timestamps for createdAt and updatedAt fields
    timestamps: true,

    // Specify the collection name as "users"
    collection: "users",
  }
);

// Create a mongoose model named "User" based on the defined schema
const User = mongoose.model<UserDocument>("User", userSchema);

// Export the User model for use in other parts of the application
export default User;
