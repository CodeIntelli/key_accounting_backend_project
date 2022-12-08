import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { JWT_EXPIRE, JWT_SECRET } from "../../Config";

/* 
@Model--> Users
@Attribute firstName: string
@Attribute lastName: string
@Attribute email: string
@Attribute phoneNumber: number
@Attribute country: string
@Attribute state: string
@Attribute city: string
@Attribute company: string
@Attribute role: enum['developer','content Writer','CEO']
@Attribute isActive: Boolean
@Attribute isVerified: Boolean
@Attribute createdAt: Date
@Attribute updatedAt: Date
@Attribute Blogs:[]
@Attribute isLogin:Boolean
*/

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Please Enter Your firstname"],
      lowercase: true,
      trim: true,
    },
    lastname: {
      type: String,
      required: [true, "Please Enter Your lastname"],
      lowercase: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please Enter Your Email"],
      unique: [true, "This Email is already taken"],
      lowercase: true,
      trim: true,
    },
    profileImg: {
      public_id: {
        type: String,
        required: [true, "Please Fill Details Properly"],
      },
      url: {
        type: String,
        required: [true, "Please Fill Details Properly"],
      },
    },
    phoneNumber: {
      type: Number,
      maxLength: [10, "Phone Number should Not Greater Than 10 Digits"],
      minLength: [10, "Phone Number should Not Less Than 10 Digits"],
      required: [true, "Please Enter Your phoneNumber"],
      trim: true,
    },
    country: {
      type: String,
      required: [true, "Please Enter Your Country"],
      lowercase: true,
      trim: true,
    },
    state: {
      type: String,
      required: [true, "Please Enter Your State"],
      lowercase: true,
      trim: true,
    },
    company: {
      type: String,
      required: [true, "Please Enter Your Company Name"],
      lowercase: true,
      trim: true,
    },
    role: {
      type: String,
      required: [true, "Please Enter Your Role"],
      default: "content_writer",
    }, // 'developer','content Writer','CEO'
    isActive: { type: Boolean, default: true },
    isLogin: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },
    blog_id: {
      type: mongoose.Schema.ObjectId,
      ref: "Blog",
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true }
);

// Bcrypt
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// JWT TOKEN
UserSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRE,
  });
};

// Compare Password
UserSchema.methods.comparePassword = async function (enteredpassword) {
  return await bcrypt.compare(enteredpassword, this.password);
};

// Generating Password Reset Token
UserSchema.methods.getResetPasswordToken = function () {
  // Generating Token
  const resetToken = crypto.randomBytes(20).toString("hex");
  // Hashing and adding resetPasswordTOken to UserSchema
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  //* this will valid only for 15 min
  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
  return resetToken;
};

let UserModel = mongoose.model("User", UserSchema);
export default UserModel;
