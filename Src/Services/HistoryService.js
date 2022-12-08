import { HistoryModel } from "../Models";

const HistoryService = {
  async storeHistory(user_id, message) {
    try {
      const histModel = await HistoryModel.create({
        user: user_id,
        logMessage: message,
      });
      return histModel;
    } catch (err) {
      console.log(err);
    }
  },
  async getHistory() {
    try {
      const histModel = await HistoryModel.find();
      return histModel;
    } catch (err) {
      console.log(err);
    }
  },
  async getUserHistory(user_id) {
    try {
      const histModel = await HistoryModel.find({ user: user_id });
      return histModel;
    } catch (err) {
      console.log(err);
    }
  },
};
export default HistoryService;
