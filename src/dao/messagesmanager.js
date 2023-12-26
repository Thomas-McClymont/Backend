import messageModel from "./models/message.model.js";

export default class MessagesManager {
  // GET MESSAGES
  getMessages = async () => {
    try {
      return await messageModel.find().lean().exec();
    } catch (error) {
      return error;
    }
  };

  // CREATE MESSAGE
  createMessage = async (message) => {
    if (message.user.trim() === "" || message.message.trim() === "") {
      return null;
    }
    try {
      return await messageModel.create(message);
    } catch (error) {
      return error;
    }
  };

  // DELETE ALL MESSAGES
  deleteAllMessages = async () => {
    try {
      console.log("Deleting all messages");
      const result = await messageModel.deleteMany({});
      console.log("Messages deleted" + result);
      return result;
    } catch (error) {
      return error;
    }
  };
}
