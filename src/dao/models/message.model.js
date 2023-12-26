import mongoose from "mongoose";

// MESSAGE SCHEMA
const messageSchema = new mongoose.Schema({
  user: String,
  message: String,
  timestamp: Date,
});
const messageModel = mongoose.model("messages", messageSchema);
export default messageModel;
