import User from "../models/user";
import { object, string, email, ref } from "yup";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const SignupSchema = new object({
  name: string().required(),
  email: string().email().required(),
  password: string().required(),
  confirmPassword: string()
    .oneOf([ref("password"), null], "Mật khẩu phải trùng khớp !!!")
    .required(),
});

const SigninSchema = new object({
  email: string().email().required(),
  password: string().required(),
});

const signup = async (req, res) => {
  try {
    const { password, email, name } = req.body;
    await SignupSchema.validate(req.body, { abortEarly: false });
    const userExist = await User.findOne({ email: email });
    if (userExist) {
      return res.json({
        message: "Tài khoản đã tồn tại !!!",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name: name,
      email: email,
      password: hashedPassword,
    });
    return res.json(user);
  } catch ({ errors }) {
    return res.json({
      message: errors,
    });
  }
};

const signin = async (req, res) => {
  try {
    const { password, email } = req.body;
    await SigninSchema.validate(req.body, { abortEarly: false });
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.json({
        message: "Tài khoản chưa tồn tại!!!",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({
        message: "Mật khẩu không đúng !!!",
      });
    }

    const token = await jwt.sign({ _id: user._id }, "anhquan", {
      expiresIn: "1h",
    });
    return res.json({
      expiresIn: "1h",
      accsetToken: token,
      user,
    });
  } catch ({ errors }) {
    return res.json({
      message: errors,
    });
  }
};

const users = async (req, res) => {
  try {
    const users = await User.find();
    if (users.length == 0) {
      return res.json({
        message: "Không có người dùng nào !!!",
      });
    }
    return res.json(users);
  } catch (error) {
    return res.status.json({
      message: error.message,
    });
  }
};

const remove = async (req, res) => {
  try {
    const users = await User.findByIdAndDelete(req.params.id);
    return res.json(users);
  } catch (error) {
    return res.status.json({
      message: error.message,
    });
  }
};

const authorize = async (req, res) => {
  try {
    const user = await User.updateOne(
      { _id: req.params.id },
      { $set: { role: "admin" } }
    );
    return res.json(user);
  } catch (error) {
    return res.json({
      message: error.message,
    });
  }
};

export { signup, signin, users, remove, authorize };
