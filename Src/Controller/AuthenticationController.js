import { UserModel, TokenModel } from "../Models";
import { ErrorHandler, SendToken, SendEmail } from "../Services";
import { FRONTEND_URL } from "../../Config";
import crypto from "crypto";
import cloudinary from "cloudinary";
const AuthenticationController = {
  // [ + ] REGISTRATION LOGIC

  async registerUser(req, res, next) {
    try {
      if (req.body.avatar) {
        let myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
          folder: "userProfileImage",
          width: 150,
          crop: "scale",
        });

        let { name, email, password } = req.body;
        // check if user in database already
        try {
          const exist = await UserModel.exists({ email: req.body.email });
          if (exist) {
            return next(new ErrorHandler("This email is already taken", 409));
          }
        } catch (err) {
          return next(err);
        }
        let user = await UserModel.create({
          name: req.body.name.trim(),
          email,
          password,
          avatar: {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
          },
        });
      }
      let { name, email, password } = req.body;
      // check if user in database already
      try {
        const exist = await UserModel.exists({ email: req.body.email });
        if (exist) {
          return next(new ErrorHandler("This email is already taken", 409));
        }
      } catch (err) {
        return next(err);
      }

      let user = await UserModel.create({
        name: req.body.name.trim(),
        email,
        password,
        userIp: req.socket.remoteAddress,
        userLocation,
      });

      const token = await TokenModel.create({
        userId: user._id,
        token: crypto.randomBytes(32).toString("hex"),
      });
      const url = `${FRONTEND_URL}/users/${user._id}/verify/${token.token}`;

      const message = `Your Email Verification token is:- ${url} \n\n If you Don't requested this email then ignore it\n\n `;
      const sendVerifyMail = await SendEmail({
        email: user.email,
        subject: `Email Verification`,
        message,
      });
      if (!sendVerifyMail) {
        return next(
          new ErrorHandler(
            "Something Error Occurred Please Try After Some Time",
            422
          )
        );
      }
      // SendToken(user, 201, res);
      res.status(201).json({
        success: "Pending",
        message:
          "An Email send to your account please verify your email address",
      });
    } catch (error) {
      return next(new ErrorHandler(error, 500));
    }
  },

  // [ + ] VERIFICATION EMAIL LOGIC

  async verifyEmail(req, res, next) {
    try {
      const user = await UserModel.findOne({ _id: req.params.id });
      if (!user) {
        return next(new ErrorHandler("Invalid Verification Link", 400));
      }

      const token = await TokenModel.findOne({
        userId: user._id,
        token: req.params.token,
      });
      if (!token) {
        return next(new ErrorHandler("Invalid Verification Link", 400));
      }

      await UserModel.findByIdAndUpdate(
        req.params.id,
        {
          verified: true,
        },
        { new: true, runValidators: true, useFindAndModify: false }
      );
      await token.remove();

      res.status(200).send({
        success: true,
        message: "Email Verification Successfully",
      });
    } catch (error) {
      return next(new ErrorHandler(error, 500));
    }
  },

  // [ + ] LOGIN USER LOGIC

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return next(new ErrorHandler("Please Enter Email & Password", 400));
      }
      const user = await UserModel.findOne({ email: email }).select(
        "+password"
      );
      if (!user) {
        return next(new ErrorHandler("Invalid Email and password", 400));
      }

      if (!user.verified) {
        return next(new ErrorHandler("please verify your email address", 400));
      }

      const isPasswordMatched = await user.comparePassword(password);
      if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid Email and password", 400));
      }

      if (user.status === "Deactivate") {
        let message = `To Reactivate Your Account Please Fill this form`;
        const sendActivateAccountInfo = await SendEmail({
          email: user.email,
          subject: `Reactivate Your Account`,
          message,
        });
        if (!sendActivateAccountInfo) {
          return next(
            new ErrorHandler(
              "Something Error Occurred Please Try After Some Time",
              422
            )
          );
        }
        return next(
          new ErrorHandler(
            "It Seem's You have deleted Your Account Please Check Your Mail For More Details",
            422
          )
        );
      }

      if (user.status === "Blocked") {
        let message = `Administrator Have Blocked Your Account Because Some Inappropriate Activity Has Done From Your Account`;
        const sendActivateAccountInfo = await SendEmail({
          email: user.email,
          subject: `Terms & Conditions`,
          message,
        });
        if (!sendActivateAccountInfo) {
          return next(
            new ErrorHandler(
              "Something Error Occurred Please Try After Some Time",
              422
            )
          );
        }
        return next(
          new ErrorHandler(
            "It Seem's Administrator have Blocked Your Account Please Check Your Mail For More Details",
            422
          )
        );
      }

      const token = user.getJWTToken();
      let message = `Someone Is Login From Your Account at User IP:- ${req.socket.remoteAddress} Location:"User Location Here" ${user.userLocation}`;

      const AccountLogin = await SendEmail({
        email: user.email,
        subject: `Login From Your Account`,
        message,
      });
      if (!AccountLogin) {
        return next(
          new ErrorHandler(
            "Something Error Occurred Please Try After Some Time",
            422
          )
        );
      }
      SendToken(user, 200, res);
    } catch (error) {
      return next(new ErrorHandler(error, 500));
    }
  },

  // [ + ] LOGOUT LOGIC

  async logout(req, res, next) {
    try {
      res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
      });
      res.status(200).json({
        success: true,
        message: "Successfully Logout",
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error });
    }
  },

  // [ + ] FORGOT PASSWORD USER LOGIC

  async forgotPassword(req, res, next) {
    const user = await UserModel.findOne({ email: req.body.email });
    if (!user) {
      return next(new ErrorHandler("User Not Found", 404));
    }
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    const resetPasswordUrl = `${FRONTEND_URL}/password/reset/${resetToken}`;

    const message = `Your password reset token is:- ${resetPasswordUrl} \n\n If you Don't requested this email then ignore it\n\n `;

    try {
      await SendEmail({
        email: user.email,
        subject: `Password Recovery Email`,
        message,
      });
      res.status(200).json({
        success: true,
        message: `Email sent to ${user.email} successfully`,
      });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });
      return next(new ErrorHandler(error.message, 500));
    }
  },

  // [ + ] RESET PASSWORD USER LOGIC

  async resetPassword(req, res, next) {
    try {
      const resetPasswordToken = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");
      const user = await UserModel.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },

        // [ + ]
      });
      if (!user) {
        return next(
          new ErrorHandler(
            "Reset password token is Invalid or has been expired",
            404
          )
        );
      }

      if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler("Password doesn't match", 400));
      }
      user.password = req.body.password;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();
      SendToken(user, 200, res);
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
};

export default AuthenticationController;
