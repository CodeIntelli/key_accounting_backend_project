import mongoose from "mongoose";
/* 
@Model--> Blogs
@Attribute postTitle: string
@Attribute postDesc: string
@Attribute content: string
@Attribute post_slug: string
@Attribute thumbImage: object
@Attribute coverImage: object
@Attribute isPublish: Boolean
@Attribute publishedDate: Date
@Attribute tags: []
@Attribute subCategory: id ref(subCategory)
@Attribute metaTitle: string
@Attribute metaDesc: string
@Attribute metaKeyword: string
@Attribute facebook_id: string
@Attribute linkedin_id: string
@Attribute twitter_id: string
@Attribute instagram_id: string
@Attribute createdAt: Date
@Attribute updatedAt: Date
*/
const BlogSchema = new mongoose.Schema(
  {
    postTitle: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    postDesc: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    post_slug: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    thumbImage: {
      public_id: {
        type: String,
        required: [true, "Please Fill Details Properly"],
      },
      url: {
        type: String,
        required: [true, "Please Fill Details Properly"],
      },
    },
    coverImage: {
      public_id: {
        type: String,
        required: [true, "Please Fill Details Properly"],
      },
      url: {
        type: String,
        required: [true, "Please Fill Details Properly"],
      },
    },
    isPublish: {
      type: Boolean,
      default: true,
      lowercase: true,
      trim: true,
    },
    publishDate: {
      type: Date,
    },
    tags: [],
    subCategory: {
      type: mongoose.Schema.ObjectId,
      ref: "SubCategory",
    },
    metaTitle: {
      type: String,
      required: true,
    },
    metaDesc: {
      type: String,
      required: true,
    },
    metaKeyword: [],
    facebook_id: { type: String },
    linkedin_id: { type: String },
    twitter_id: { type: String },
    instagram_id: { type: String },
  },
  { timestamps: true }
);

let BlogModel = mongoose.model("Blog", BlogSchema);
export default BlogModel;
