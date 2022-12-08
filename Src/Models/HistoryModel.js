import mongoose from "mongoose";
/* 
@Model--> HistoryModel
@Attribute user: _id
@Attribute logMessage: String
@Attribute createdAt: Date
@Attribute updatedAt: Date
*/
const HistorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      default: true,
    },
    logMessage: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

let HistoryModel = mongoose.model("History", HistorySchema);
export default HistoryModel;
