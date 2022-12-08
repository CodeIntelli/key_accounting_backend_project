import mongoose from "mongoose";
/* 
@Model--> Pages
@Attribute english: {
      @Attribute pageTitle
      @Attribute sectionTitle
      @Attribute sectionDesc
      @Attribute heading
      @Attribute desc
      @Attribute other
      @Attribute isImage
      @Attribute sectionImage
}
    @Attribute spanish: {
      @Attribute pageTitle
      @Attribute sectionTitle
      @Attribute sectionDesc
      @Attribute heading
      @Attribute desc
      @Attribute other
      @Attribute isImage
      @Attribute sectionImage
    }
    @Attribute canView
*/
const PageSchema = new mongoose.Schema(
  {
    english: {
      pageTitle: {
        type: String,
        required: true,
        trim: true,
      },
      sectionTitle: {
        type: String,
        required: true,
        trim: true,
      },
      sectionDesc: {
        type: String,
        required: true,
        trim: true,
      },
      heading: { type: String, required: true, trim: true },
      desc: { type: String, required: true, trim: true },
      other: { type: String, required: true, trim: true },
      isImage: { type: Boolean, required: true },
      sectionImage: {
        public_id: {
          type: String,
          required: [true, "Please Fill Details Properly"],
        },
        url: {
          type: String,
          required: [true, "Please Fill Details Properly"],
        },
      },
    },
    spanish: {
      pageTitle: {
        type: String,
        required: true,
        trim: true,
      },
      sectionTitle: {
        type: String,
        required: true,
        trim: true,
      },
      sectionDesc: {
        type: String,
        required: true,
        trim: true,
      },
      heading: { type: String, required: true, trim: true },
      desc: { type: String, required: true, trim: true },
      other: { type: String, required: true, trim: true },
      isImage: { type: Boolean, required: true },
      sectionImage: {
        public_id: {
          type: String,
          required: [true, "Please Fill Details Properly"],
        },
        url: {
          type: String,
          required: [true, "Please Fill Details Properly"],
        },
      },
    },
    canView: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

let PageModel = mongoose.model("Page", PageSchema);
export default PageModel;
