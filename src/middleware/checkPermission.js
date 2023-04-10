import jwt from "jsonwebtoken";
import User from "../models/user";

const checkPermission = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return res.json({
        message: "Bạn cần đăng nhập để thực hiện hành động!!!",
      });
    }

    const token = await req.headers.authorization.split(" ")[1];
    jwt.verify(token, "anhquan", async (err, payload) => {
      if (err) {
        if (err.name === "JsonWebTokenError") {
          return res.json({
            message: "Token không hợp lệ",
          });
        }
        if (err.name === "TokenExpiredError") {
          return res.json({
            message: "Token hết hạn hãy đăng nhập lại",
          });
        }
      }
      const user = await User.findById(payload._id);
      if (user.role != "admin") {
        return res.json({
          message: "Bạn không có quyền để thực hiện hành động!!!",
        });
      }
      next();
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

export default checkPermission;
