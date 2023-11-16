import mongoose from "mongoose";

export interface GroupInput {
    name: string;
    users: string[];
}

export interface GroupDocument extends GroupInput, mongoose.Document {
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}

const groupSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        deletedAt: { type: Date, default: null },
    },
    { timestamps: true, collection: "groups" }
);

const Group = mongoose.model<GroupDocument>("Group", groupSchema);

export default Group;