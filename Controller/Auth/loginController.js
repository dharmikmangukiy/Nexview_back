import Joi from "joi";
import bcrypt from "bcrypt";
import { User } from "../../Models"; // Assuming LoginToken model exists
import { LoginToken } from "../../Models/LoginToken"; // Assuming LoginToken model exists
import CustomErrorHandler from "../../service/CustomErrorHandler";
const { euclideanDistance, manhattanDistance, encryptBiometrics, decryptBiometrics, getInitializationVector, generateEncryptionKey } = require("../../utils")
async function generateToken() {
  const currentDate = new Date().toISOString().slice(0, 10); // Get current date in YYYY-MM-DD format
  // Generate random 20-digit number
  const randomNumber = Math.floor(100000000000000 + Math.random() * 9000000000000);
  // Generate random alphabet
  const randomAlphabet = String.fromCharCode(65 + Math.floor(Math.random() * 26));
  // Concatenate date, number, and alphabet
  const tokenData = `${currentDate}${randomNumber}${randomAlphabet}`;
  // Hash the token
  const token = await bcrypt.hash(tokenData, 10);
  return token;
}


const loginController = {

  async login(req, res, next) {
    // Validation
    const loginSchema = Joi.object({
      email: Joi.string().email().required(),
      ip: Joi.string().required(),
      password: Joi.string()
        .pattern(new RegExp(/.{3,30}/))
        .required(),
    });
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return next(error);
    }

    try {
      const data = await User.findOne({ email: req.body.email });
      if (!data) {
        return next(CustomErrorHandler.wrongCredentials());
      }
      // compare the password
      const match = await bcrypt.compare(req.body.password, data.password);
      if (!match) {
        return next(CustomErrorHandler.wrongCredentials());
      }

      // Generate token
      const token = await generateToken();

      // Check if token exists for the email
      let loginToken = await LoginToken.findOne({ email: req.body.email });

      if (loginToken) {
        // If token exists, update it
        loginToken.token = token;
      } else {
        // If token does not exist, create a new entry
        loginToken = new LoginToken({
          email: req.body.email,
          token: token
        });
      }
      data.IP = req.body.ip;
      await data.save();
      // Save token to database
      await loginToken.save();

      res.json({ data, token }); // Return user and token
    } catch (err) {
      return next(err);
    }
  },
  async faceLogin(req, res, next) {
    // Validation

    try {
      // Validate request body
      const { descriptor, ip } = req.body;
      if (!descriptor) {
        return res.status(400).send('Descriptor is missing.');
      }

      // Find all users
      const users = await User.find({});
      let threshold = 0.5;
      let bestMatchUser = {};

      // Loop through users to find the best match
      users.forEach(u => {
        if (u.face_descriptor) {
          const distance = euclideanDistance(descriptor, u.face_descriptor);
          if (distance < threshold) {
            threshold = distance;
            bestMatchUser = u;
          }
        }
      });

      // If no match found
      if (Object.keys(bestMatchUser).length === 0) {
        return res.status(200).send('It was not possible to associate the image inserted with the one registered. Insert a new image.');
      }

      // Find user by email
      const data = await User.findOne({ email: bestMatchUser.email });
      if (!data) {
        return next(CustomErrorHandler.wrongCredentials());
      }

      // Generate token
      const token = await generateToken();
      console.log('data', data)
      // Check if token exists for the email
      let loginToken = await LoginToken.findOne({ email: data.email });
      console.log('loginToken', loginToken)
      if (loginToken) {
        // If token exists, update it
        loginToken.token = token;
      } else {
        // If token does not exist, create a new entry
        loginToken = new LoginToken({
          email: data.email,
          token: token
        });
      }

      // Save IP address to user
      data.IP = ip;
      await data.save();

      // Save token to database
      await loginToken.save();

      // Return user data and token
      res.json({ data, token });
    } catch (err) {
      console.log('err', err)
      return next(err);
    }
  },

  async me(req, res, next) {
    try {
      const data = await LoginToken.findOne({ token: req.body.token }); // req.data contains the decoded token
      if (!data) {
        return res.status(402).send("User not found");
      } else {
        const user = await User.findOne({ email: data.email });
        res.json(user);
      }
    } catch (err) {
      return next(err);
    }
  },
};

// Function to generate token
export default loginController;
