import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    user: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);
export const MessageModel = mongoose.model("messages", messageSchema);
