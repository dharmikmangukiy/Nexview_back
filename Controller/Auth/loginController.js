import Joi from "joi";
import bcrypt from "bcrypt";
import { User } from "../../Models"; // Assuming LoginToken model exists
import { LoginToken } from "../../Models/LoginToken"; // Assuming LoginToken model exists
import CustomErrorHandler from "../../service/CustomErrorHandler";

const loginController = {

  async login(req, res, next) {
    // Validation
    const loginSchema = Joi.object({
      email: Joi.string().email().required(),
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

      // Save token to database
      await loginToken.save();

      res.json({ data, token }); // Return user and token
    } catch (err) {
      return next(err);
    }
  },

  async me(req, res, next) {
    try {
      const data = await User.findById(req.body._id); // req.data contains the decoded token
      if (!data) {
        return next(CustomErrorHandler.notFound('User not found'));
      }
      res.json(data);
    } catch (err) {
      return next(err);
    }
  },
};

// Function to generate token
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

export default loginController;
