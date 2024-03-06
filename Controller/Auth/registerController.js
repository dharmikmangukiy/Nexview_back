import Joi from "joi";
import bcrypt from "bcrypt";
import { User } from "../../Models";
import CustomErrorHandler from "../../service/CustomErrorHandler";
import { LoginToken } from "../../Models/LoginToken";
const mimetypes = require("mime-types");
const uuid = require("uuid");
const jwt = require("jsonwebtoken");
const fs = require("fs")
const { euclideanDistance, manhattanDistance, encryptBiometrics, decryptBiometrics, getInitializationVector, generateEncryptionKey } = require("../../utils");
const registerController = {
  async register(req, res, next) {
    // Validation
    try {
      const { name, email, password, screenshot, descriptor } = req.body

      if (!(name && email && password && screenshot && descriptor)) {
        return res.status(400).send('Dati mancanti.')
      }

      if (!email.toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
        return res.status(400).send('The EMAIL field is not in the standard form.')
      }

      const oldUser = await User.findOne({ email });
      if (oldUser) {
        return res.status(409).send('User already registered. Please log in.')
      }

      const mime = (screenshot.split(';')[0]).split(':')[1];
      const ext = mimetypes.extension(mime);
      const path = 'uploads/' + uuid.v4() + '.' + ext;
      fs.writeFile(path, screenshot.split(',')[1], 'base64', (e) => {
        if (e) {
          console.log(e)
          throw 'Unable to save file.'
        }
      })
      const encryptedUserPassword = await bcrypt.hash(password, 10);
      const namea = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
      const emaila = email.toLowerCase();
      const user = await User.create({
        name: namea,
        email: emaila,
        password: encryptedUserPassword,
        image_src: path,
        face_descriptor: descriptor
      });
      console.log('user', user);
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.JWT_SECRET,
        { expiresIn: '2h' }
      )

      return res.status(200).json({
        name: user.name,
        email: user.email,
        screenshot: user.image_src,
        registerPic: screenshot,
        token
      })
    } catch (err) {
      return next(err);
    }
  },
  async forgatPassword(req, res, next) {
    const { email, otp, newPassword } = req.body;

    try {
      if (otp === '0000') {
        return next(CustomErrorHandler.notFound("OTP Not Valid."));
      }
      // Check if user exists
      const user = await User.findOne({ email });
      if (!user) {
        return next(CustomErrorHandler.notFound("User not found."));
      }

      // Check if current password matches
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return next(CustomErrorHandler.unauthorized("Invalid current password."));
      }

      // Hash newPassword
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);

      // Update user's password
      user.password = hashedNewPassword;
      await user.save();

      res.json({ message: "Password updated successfully." });
    } catch (err) {
      return next(err);
    }
  },
  async userProfile(req, res, next) {

    try {
      // Check if user exists
      const userLoginData = await LoginToken.findOne({ token: req.body.token });
      if (userLoginData === null) {
        return next(CustomErrorHandler.notFound("User not found."));
      }
      const user = await User.findOne({ email: userLoginData.email });
      if (!user) {
        return next(CustomErrorHandler.notFound("User not found."));
      }

      // Check if current password matches
      user.profile = req.body.profileImage;
      user.name = req.body.name;
      await user.save();

      res.json({ message: "Profile updated successfully." });
    } catch (err) {
      return next(err);
    }
  },
  async freePlan(req, res, next) {

    try {
      // Check if user exists
      const userLoginData = await LoginToken.findOne({ token: req.body.token });
      if (userLoginData === null) {
        return next(CustomErrorHandler.notFound("User not found."));
      }
      const user = await User.findOne({ email: userLoginData.email });
      if (!user) {
        return next(CustomErrorHandler.notFound("User not found."));
      }

      // Check if current password matches
      user.type = req.body.type;
      await user.save();

      res.json({ message: "User Converted  to Free Plan Successfully" });
    } catch (err) {
      return next(err);
    }
  },
};

export default registerController;
