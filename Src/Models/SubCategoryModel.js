import mongoose from "mongoose";
/* 
@Model--> Blog SubCategory
@Attribute title: string
@Attribute Category: id ref(Category)
*/
const SubCategorySchema = new mongoose.Schema(
  {
    subTitle: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    categories: {
      type: mongoose.Schema.ObjectId,
      ref: "Categories",
    },
  },
  { timestamps: true }
);

let SubCategoryModel = mongoose.model("SubCategory", SubCategorySchema);
export default SubCategoryModel;
