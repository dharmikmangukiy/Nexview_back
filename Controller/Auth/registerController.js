import Joi from "joi";
import bcrypt from "bcrypt";
import { User } from "../../Models";
import CustomErrorHandler from "../../service/CustomErrorHandler";

const registerController = {
  async register(req, res, next) {
    // Validation
    const registerSchema = Joi.object({
      name: Joi.string().min(3).max(30).required(),
      email: Joi.string().email().required(),
      password: Joi.string()
        .pattern(new RegExp(/.{3,30}/))
        .required(),
    });
    const { error } = registerSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    // check if user is in the database already
    try {
      const exist = await User.exists({ email: req.body.email });
      if (exist) {
        return next(
          CustomErrorHandler.alreadyExist("This email is already taken.")
        );
      }
    } catch (err) {
      return next(err);
    }
    const { name, email, password } = req.body;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // prepare the model

    const user = new User({
      name,
      email,
      password: hashedPassword,
    });
    try {
      const result = await user.save();
      console.log(result);
    } catch (err) {
      return next(err);
    }
    res.json({ user });
  },
};

export default registerController;
