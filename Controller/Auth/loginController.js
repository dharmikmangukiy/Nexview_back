import Joi from "joi";
import bcrypt from "bcrypt";
import {  User } from "../../Models";
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
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        return next(CustomErrorHandler.wrongCredentials());
      }
      // compare the password
      const match = await bcrypt.compare(req.body.password, user.password);
      if (!match) {
        return next(CustomErrorHandler.wrongCredentials());
      }
      res.json(user);
    } catch (err) {
      return next(err);
    }
  },
  async me(req, res, next) {
    try {
      const user = await User.findById(req.body._id); // req.user contains the decoded token
      if (!user) {
        return next(CustomErrorHandler.notFound('User not found'));
      }
      res.json(user);
    } catch (err) {
      return next(err);
    }
  },
};

export default loginController;
