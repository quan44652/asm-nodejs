import Category from "../models/category";
import { object, string } from "yup";
import Product from "../models/product";

const categorySchema = new object({
  name: string().required(),
});

const getAll = async (req, res) => {
  try {
    const categories = await Category.find();
    if (categories.length === 0) {
      return res.json([]);
    }
    return res.json(categories);
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

const getOne = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id).populate(
      "products"
    );
    // const products = await Product.find({ categoryId: category.id }).populate(
    //   "categoryId"
    // );
    if (!category) {
      return res.json([]);
    }
    return res.json(category);
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

const create = async (req, res) => {
  try {
    await categorySchema.validate(req.body, { abortEarly: false });
    const category = await Category.create(req.body);
    if (!category) {
      return res.json({
        message: "Thêm sản phẩm thất bại",
      });
    }
    return res.json(category);
  } catch ({ errors }) {
    return res.status(400).json({
      message: errors,
    });
  }
};

const update = async (req, res) => {
  try {
    await categorySchema.validate(req.body, { abortEarly: false });
    const category = await Category.findByIdAndUpdate(req.params.id, req.body);
    if (!category) {
      return res.json({
        message: "Sửa sản phẩm thất bại",
      });
    }
    return res.json(category);
  } catch ({ errors }) {
    return res.status(400).json({
      message: errors,
    });
  }
};

const remove = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    return res.json(category);
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

export { getAll, create, update, getOne, remove };
