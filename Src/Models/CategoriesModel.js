import mongoose from "mongoose";
/* 
@Model--> Blog Categories
@Attribute title: string
*/
const CategoriesSchema = new mongoose.Schema(
  {
    catTitle: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
  },
  { timestamps: true }
);

let CategoriesModel = mongoose.model("Categories", CategoriesSchema);
export default CategoriesModel;
