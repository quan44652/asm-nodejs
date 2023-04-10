import Category from "../models/category";
import Product from "../models/product";
import { object, string, number } from "yup";

const productSchema = new object({
  name: string().required(),
  price: number().required(),
  image: string().required(),
  description: string().required(),
  categoryId: string().required(),
});

const getAll = async (req, res) => {
  try {
    const {
      _sort = "createAt",
      _order = "asc",
      _limit = 10,
      _page = 1,
    } = req.query;
    const options = {
      page: _page,
      limit: _limit,
      sort: {
        [_sort]: _order === "desc" ? -1 : 1,
      },
    };
    const products = await Product.paginate({}, options);
    if (products.length === 0) {
      return res.json([]);
    }
    return res.json(products);
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

const getOne = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "categoryId"
    );
    if (!product) {
      return res.json({
        message: "Không có sản phẩm nào !!!",
      });
    }
    return res.json(product);
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

const create = async (req, res) => {
  try {
    await productSchema.validate(req.body, { abortEarly: false });
    const product = await Product.create(req.body);
    await Category.findByIdAndUpdate(product.categoryId, {
      $addToSet: {
        products: product.id,
      },
    });
    if (!product) {
      return res.json({
        message: "Thêm sản phẩm thất bại",
      });
    }
    return res.json(product);
  } catch ({ errors }) {
    return res.status(400).json({
      message: errors,
    });
  }
};

const update = async (req, res) => {
  try {
    await productSchema.validate(req.body, { abortEarly: false });
    const product = await Product.findByIdAndUpdate(req.params.id, req.body);
    if (!product) {
      return res.json({
        message: "Sửa sản phẩm thất bại",
      });
    }
    return res.json(product);
  } catch ({ errors }) {
    return res.status(400).json({
      message: errors,
    });
  }
};

const remove = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    return res.json(product);
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

export { getAll, create, update, getOne, remove };
